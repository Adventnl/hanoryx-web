import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CornerDownLeft, Search, X } from 'lucide-react';
import clsx from 'clsx';
import { useLenis } from '../../app/providers/lenis-context';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { lockScroll } from '../../utils/scrollLock';
import { countBySection, search, tokenize } from './searchEngine';
import styles from './CommandPalette.module.css';
import { fx } from '../../utils/fx';

const RECENT_KEY = 'hnx.search.recent';
const SECTIONS = ['All', 'Work', 'Systems', 'Development', 'Company', 'Legal'];
const HINTS = ['a feature, e.g. “scheduling”', 'a project, e.g. “engine editor”', 'a principle or a phase', 'anything the pages say'];
const EASE = [0.16, 1, 0.3, 1];

function readRecent() {
  try {
    return JSON.parse(sessionStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeRecent(path) {
  try {
    const next = [path, ...readRecent().filter((p) => p !== path)].slice(0, 3);
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* storage unavailable */ }
}

/* Render `text` with <mark> over each [start,end) range. */
function Marked({ text, ranges }) {
  if (!ranges || !ranges.length) return text;
  const parts = [];
  let last = 0;
  ranges.forEach(([a, b], i) => {
    if (a > last) parts.push(text.slice(last, a));
    parts.push(<mark key={i}>{text.slice(a, b)}</mark>);
    last = b;
  });
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function isEditable(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/* The highlights that glide between result rows and between section chips.
   Motion's shared layout (`layoutId`) used to do this, but a layout animation
   still running on a node keeps AnimatePresence from removing the dialog: the
   panel had faded out and sat in the DOM for another ~300 ms, swallowing
   clicks. Here JS only measures where the active item sits and writes it to
   CSS variables; a CSS transition does the gliding, so nothing outlives the
   exit. The first placement is instant (`data-ink-ready` arrives a frame later)
   so the highlight never slides in from the corner. */
const ROW_INK = { x: '--ink-x', y: '--ink-y', w: '--ink-w', h: '--ink-h', on: '--ink-on' };
const CHIP_INK = { x: '--chip-x', y: '--chip-y', w: '--chip-w', h: '--chip-h', on: '--chip-on' };

function placeInk(container, target, names) {
  if (!container) return;
  const set = (name, value) => container.style.setProperty(name, value);
  if (!target) {
    set(names.on, '0');
    return;
  }
  set(names.x, `${target.offsetLeft}px`);
  set(names.y, `${target.offsetTop}px`);
  set(names.w, `${target.offsetWidth}px`);
  set(names.h, `${target.offsetHeight}px`);
  set(names.on, '1');
  if (!container.hasAttribute('data-ink-ready')) {
    requestAnimationFrame(() => container.setAttribute('data-ink-ready', ''));
  }
}

/**
 * Command palette / site search.
 *
 * A fixed overlay rendered in a portal and anchored to the TOP of the viewport
 * (never vertically re-centred), so growing or shrinking result lists cannot
 * make it jump. It searches page titles AND body copy / case-study text and
 * shows the best matching excerpt for each page.
 *
 * Keyboard: ⌘/Ctrl+K or "/" opens · ↑ ↓ Home End move · Enter opens · Esc
 * closes · Tab stays inside the dialog. Click outside dismisses. Focus returns
 * to where it was.
 */
export function CommandPalette({ enabled = true }) {
  const navigate = useNavigate();
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const listId = useId();
  const inputId = `${listId}-input`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('All');
  const [active, setActive] = useState(0);
  const [docs, setDocs] = useState(null);
  const [recent, setRecent] = useState([]);
  const [hint, setHint] = useState(0);

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const chipsRef = useRef(null);
  const returnFocus = useRef(null);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Load the index lazily; prefetch shortly after idle so first open is instant.
  const ensureDocs = useCallback(() => {
    if (docs) return;
    import('./searchIndex').then((mod) => setDocs(mod.getSearchDocuments()));
  }, [docs]);
  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setTimeout(ensureDocs, 2500);
    return () => window.clearTimeout(id);
  }, [enabled, ensureDocs]);

  const openPalette = useCallback(() => {
    if (!enabled) return;
    returnFocus.current = document.activeElement;
    ensureDocs();
    setQuery('');
    setSection('All');
    setActive(0);
    setRecent(readRecent());
    setOpen(true);
  }, [enabled, ensureDocs]);

  const closePalette = useCallback(() => setOpen(false), []);

  // Global triggers.
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPalette();
        return;
      }
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(document.activeElement)) {
        event.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hanoryx:search', openPalette);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hanoryx:search', openPalette);
    };
  }, [openPalette]);

  // While open: lock page scroll, focus the field, close on Escape anywhere.
  useEffect(() => {
    if (!open) return undefined;
    const unlock = lockScroll(lenis);
    const focusId = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closePalette();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      cancelAnimationFrame(focusId);
      document.removeEventListener('keydown', onKey, true);
      unlock();
    };
  }, [open, lenis, closePalette]);

  // Rotating placeholder hint while the field is empty.
  useEffect(() => {
    if (!open || query || reduced) return undefined;
    const id = window.setInterval(() => setHint((h) => (h + 1) % HINTS.length), 3200);
    return () => window.clearInterval(id);
  }, [open, query, reduced]);

  const terms = useMemo(() => tokenize(query), [query]);

  const results = useMemo(() => {
    if (!docs) return [];
    if (!terms.length) {
      // Empty query: recent visits first, then the curated way in.
      const byPath = new Map(docs.map((d) => [d.to, d]));
      const order = [...recent, '/work/musebase', '/work/yk-engine', '/company/timeline', '/systems', '/north/motion-systems', '/company/careers'];
      const seen = new Set();
      const picked = [];
      for (const path of order) {
        const doc = byPath.get(path);
        if (doc && !seen.has(path) && (section === 'All' || doc.section === section)) {
          seen.add(path);
          picked.push({ doc, score: 0, excerpt: doc.summary ? { text: doc.summary, ranges: [], truncatedStart: false, truncatedEnd: doc.summaryCut } : null, titleRanges: [], recent: recent.includes(path) });
        }
      }
      if (section !== 'All') {
        docs.filter((d) => d.section === section && !seen.has(d.to)).forEach((doc) => picked.push({ doc, score: 0, excerpt: doc.summary ? { text: doc.summary, ranges: [], truncatedStart: false, truncatedEnd: doc.summaryCut } : null, titleRanges: [] }));
      }
      return picked.slice(0, 8);
    }
    return search(docs, query, { section, limit: 12 });
  }, [docs, terms, query, section, recent]);

  const counts = useMemo(() => {
    if (!docs) return {};
    if (!terms.length) {
      const c = { All: docs.length };
      docs.forEach((d) => { c[d.section] = (c[d.section] || 0) + 1; });
      return c;
    }
    return countBySection(docs, query);
  }, [docs, terms, query]);

  const choose = useCallback(
    (item) => {
      if (!item) return;
      writeRecent(item.doc.to);
      setOpen(false);
      navigate(item.doc.to);
    },
    [navigate]
  );

  const onPanelKeyDown = (event) => {
    const count = results.length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (count) setActive((a) => (a + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (count) setActive((a) => (a - 1 + count) % count);
    } else if (event.key === 'Home' && event.target === inputRef.current && !query) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End' && event.target === inputRef.current && !query) {
      event.preventDefault();
      setActive(Math.max(0, count - 1));
    } else if (event.key === 'Enter') {
      if (results[active]) {
        event.preventDefault();
        choose(results[active]);
      }
    } else if (event.key === 'Tab') {
      // Keep focus inside the dialog.
      const focusable = [...panelRef.current.querySelectorAll('input, button:not([tabindex="-1"])')].filter((el) => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  // Move the glide highlights to the active row and section chip.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const list = listRef.current;
    const chips = chipsRef.current;
    const place = () => {
      placeInk(list, list?.querySelector('[aria-selected="true"]'), ROW_INK);
      placeInk(chips, chips?.querySelector('[aria-pressed="true"]'), CHIP_INK);
    };
    place();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(place);
    if (list) observer.observe(list);
    if (chips) observer.observe(chips);
    return () => observer.disconnect();
  }, [open, active, results, section, counts]);

  // Keep the active row visible while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const row = listRef.current?.querySelector('[aria-selected="true"]');
    row?.scrollIntoView({ block: 'nearest' });
  }, [active, open, results]);

  // Return focus where it came from once the exit animation is done.
  const onExited = () => {
    const el = returnFocus.current;
    if (el && typeof el.focus === 'function' && document.contains(el)) el.focus({ preventScroll: true });
  };

  const activeId = results[active] ? `${listId}-opt-${active}` : undefined;
  const status = !docs
    ? 'Loading search index'
    : terms.length
      ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
      : 'Suggested pages';

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : {
        initial: { opacity: 0, y: -16, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
        exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.22, ease: EASE } },
      };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExited}>
      {open && (
        <div className={styles.root} data-chrome>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduced ? 0.1 : 0.35 } }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0.1 : 0.25 } }}
            onPointerDown={closePalette}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Search Hanoryx Systems"
            onKeyDown={onPanelKeyDown}
            {...fx('palette.panel')}
            {...panelMotion}
          >
            <div className={styles.inputRow}>
              <Search size={19} aria-hidden="true" className={clsx(styles.searchIcon, !docs && styles.pulsing)} />
              <div className={styles.field}>
                <label className="sr-only" htmlFor={inputId}>Search the site</label>
                <input
                  id={inputId}
                  ref={inputRef}
                  className={styles.input}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={activeId}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  enterKeyHint="go"
                  placeholder=""
                />
                {!query && (
                  <span className={styles.hint} aria-hidden="true" {...fx('palette.hint-rotor')}>
                    Search{' '}
                    <span key={hint} className={styles.hintWord}>{HINTS[hint]}</span>
                  </span>
                )}
              </div>
              <button type="button" className={styles.close} aria-label="Close search" onClick={closePalette}>
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div ref={chipsRef} className={styles.chips} role="group" aria-label="Filter results by section">
              <span className={styles.chipInk} aria-hidden="true" {...fx('palette.chip-ink')} />
              {SECTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  tabIndex={-1}
                  className={clsx(styles.chip, section === name && styles.chipOn)}
                  aria-pressed={section === name}
                  onClick={() => {
                    setSection(name);
                    setActive(0);
                    inputRef.current?.focus({ preventScroll: true });
                  }}
                >
                  <span className={styles.chipLabel}>{name}</span>
                  <span className={styles.chipCount}>{counts[name] ?? 0}</span>
                </button>
              ))}
            </div>

            <div
              id={listId}
              ref={listRef}
              className={styles.results}
              role="listbox"
              aria-label="Search results"
              data-lenis-prevent
            >
              <span className={styles.rowInk} aria-hidden="true" {...fx('palette.row-ink')} />
              {!terms.length && results.length > 0 && <p className={styles.group}>{recent.length ? 'Recent & suggested' : 'Suggested'}</p>}
              {results.map((item, index) => {
                const on = index === active;
                const ranges = item.titleRanges;
                return (
                  <motion.button
                    key={item.doc.to}
                    id={`${listId}-opt-${index}`}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={on}
                    className={clsx(styles.row, on && styles.rowOn)}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE, delay: Math.min(index, 6) * 0.025 } }}
                    onPointerMove={(event) => {
                      const last = lastPointer.current;
                      if (Math.abs(event.clientX - last.x) + Math.abs(event.clientY - last.y) < 2) return;
                      lastPointer.current = { x: event.clientX, y: event.clientY };
                      if (!on) setActive(index);
                    }}
                    onClick={() => choose(item)}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowHead}>
                        <strong className={styles.rowTitle}><Marked text={item.doc.title} ranges={ranges} /></strong>
                        <span className={styles.rowSection}>{item.recent ? 'Recent' : item.doc.section}</span>
                        <span className={styles.rowPath}>{item.doc.to}</span>
                      </span>
                      {item.excerpt && (
                        <span className={styles.excerpt} {...fx('palette.excerpt-marks')}>
                          {item.excerpt.heading && item.excerpt.heading !== item.doc.title && <span className={styles.excerptHeading}>{item.excerpt.heading}</span>}
                          {item.excerpt.truncatedStart && '… '}
                          <Marked text={item.excerpt.text} ranges={item.excerpt.ranges} />
                          {item.excerpt.truncatedEnd && ' …'}
                        </span>
                      )}
                    </span>
                    <span className={styles.rowEnter} aria-hidden="true"><CornerDownLeft size={14} /></span>
                  </motion.button>
                );
              })}

              {docs && !results.length && (
                <div className={styles.empty}>
                  <p>
                    Nothing matches <strong>“{query}”</strong>
                    {section !== 'All' ? <> in {section}</> : null}.
                  </p>
                  <p className={styles.emptyHint}>
                    {section !== 'All' ? (
                      <button type="button" tabIndex={-1} onClick={() => setSection('All')}>Search every section</button>
                    ) : (
                      'Try a shorter word — search reads page titles and the text on each page.'
                    )}
                  </p>
                </div>
              )}
              {!docs && <p className={styles.empty}>Indexing pages…</p>}
            </div>

            <div className={styles.footer} {...fx('palette.key-hints')}>
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Open</span>
              <span><kbd>esc</kbd> Close</span>
              <span className={styles.count} role="status" aria-live="polite">{status}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default CommandPalette;
