import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowUp, Check, ChevronDown, ChevronUp, Link2, ListTree, Printer, Search, X } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { RichText } from '../fx/RichText';
import { useLenis } from '../../app/providers/lenis-context';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import styles from './DocumentReader.module.css';

const WORDS_PER_MINUTE = 220;
const pad = (n) => String(n).padStart(2, '0');

/* The plain text of a body item — used to count words and to find things. */
function textOf(item) {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  if (item.list || item.ol) return (item.list || item.ol).join(' ');
  if (item.note) return item.note;
  if (item.table) return [...item.table.head, ...item.table.rows.flat()].join(' ');
  if (item.defs) return item.defs.map((d) => `${d.k} ${d.v}`).join(' ');
  if (item.steps) return item.steps.map((s) => `${s.title} ${s.body}`).join(' ');
  if (item.code) return item.code;
  if (item.quote) return `${item.quote} ${item.cite || ''}`;
  if (item.sub) return `${item.sub} ${(item.body || []).map(textOf).join(' ')}`;
  return '';
}

/* One body item of a section. Strings are paragraphs; objects pick a shape by
   their one meaningful key: list · ol · note · table · defs · steps · code · quote · sub. */
function Item({ item, id, number, terms, hl }) {
  const rich = (text) => <RichText text={text} terms={terms} highlight={hl} />;
  if (typeof item === 'string') return <p className={styles.p} data-block={id}>{rich(item)}</p>;
  if (item.list) {
    return (
      <ul className={styles.list} data-block={id}>
        {item.list.map((li) => <li key={li}>{rich(li)}</li>)}
      </ul>
    );
  }
  if (item.ol) {
    return (
      <ol className={styles.ol} data-block={id}>
        {item.ol.map((li) => <li key={li}>{rich(li)}</li>)}
      </ol>
    );
  }
  if (item.note) {
    return (
      <aside className={clsx(styles.note, item.tone === 'warn' && styles.warn)} data-block={id}>
        <span className={styles.noteLabel}>{item.label || (item.tone === 'warn' ? 'Worth knowing' : 'Note')}</span>
        <p>{rich(item.note)}</p>
      </aside>
    );
  }
  if (item.table) {
    return (
      <div className={styles.tableWrap} data-block={id} tabIndex={0} role="region" aria-label={item.caption || 'Table'}>
        <table className={styles.table}>
          {item.caption && <caption>{item.caption}</caption>}
          <thead>
            <tr>{item.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {item.table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, c) => (c === 0 ? <th key={c} scope="row">{rich(cell)}</th> : <td key={c}>{rich(cell)}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (item.defs) {
    return (
      <dl className={styles.defs} data-block={id}>
        {item.defs.map((d) => (
          <div key={d.k} className={styles.def}>
            <dt>{d.k}</dt>
            <dd>{rich(d.v)}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (item.steps) {
    return (
      <ol className={styles.steps} data-block={id}>
        {item.steps.map((s) => (
          <li key={s.title}>
            <strong>{s.title}</strong>
            <span>{rich(s.body)}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (item.code) {
    return <pre className={styles.pre} data-block={id} tabIndex={0}><code>{item.code}</code></pre>;
  }
  if (item.quote) {
    return (
      <blockquote className={styles.quote} data-block={id}>
        <p>{rich(item.quote)}</p>
        {item.cite && <cite>{item.cite}</cite>}
      </blockquote>
    );
  }
  if (item.sub) {
    return (
      <div className={styles.sub} data-block={id}>
        <h4><span className={styles.subNum}>{number}</span>{item.sub}</h4>
        {(item.body || []).map((child, i) => (
          <Item key={i} item={child} id={`${id}-${i}`} number={`${number}.${i + 1}`} terms={terms} hl={hl} />
        ))}
      </div>
    );
  }
  return null;
}

/**
 * A long-form document reader — for legal text, policies, handbooks and
 * articles. A contents rail follows the reader (a red node travels down it as
 * the page is read), the active section lights, every section has a one-line
 * plain-language summary, defined words explain themselves on hover, and a
 * find bar highlights and steps through matches. Sections can be linked to,
 * and the whole page prints cleanly (Print / Save as PDF).
 *
 *   sections: [{ id, title, plain, body: [string | { list | ol | note | table | defs | steps | code | quote | sub }] }]
 *   terms:    { word: 'definition' }   — used by {{word}} in the text
 *   meta:     [{ k, v }]               — small facts shown under the title
 */
export default function DocumentReader({
  eyebrow,
  title,
  intro,
  variant = 'legal',
  version,
  summaryLabel = 'In plain words',
  summary = [],
  meta = [],
  sections = [],
  terms,
  note,
  endLabel = 'End of document',
}) {
  const lenis = useLenis();
  const uid = useId();
  const [copied, copy] = useCopy();
  const rootRef = useRef(null);
  const percentRef = useRef(null);
  const [active, setActive] = useState(sections[0]?.id);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  const words = useMemo(
    () => sections.reduce((n, s) => n + textOf({ sub: s.title, body: s.body }).split(/\s+/).length + (s.plain ? s.plain.split(/\s+/).length : 0), 0),
    [sections]
  );
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  const hl = useMemo(() => query.toLowerCase().split(/\s+/).filter((t) => t.length > 1), [query]);
  const matches = useMemo(() => {
    if (!hl.length) return [];
    const found = [];
    sections.forEach((s) => {
      s.body.forEach((item, i) => {
        const hay = textOf(item).toLowerCase();
        if (hl.every((t) => hay.includes(t))) found.push(`${s.id}-${i}`);
      });
    });
    return found;
  }, [hl, sections]);

  const goTo = useCallback((el, offset = -110) => {
    if (el) lenis.scrollTo(el, { offset });
  }, [lenis]);

  const jump = (index) => {
    if (!matches.length) return;
    const next = (index + matches.length) % matches.length;
    setCursor(next);
    goTo(rootRef.current?.querySelector(`[data-block="${matches[next]}"]`), -180);
  };

  // Scroll-spy: the section nearest the reading line is the active one.
  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(`${uid}-${s.id}`)).filter(Boolean);
    if (!targets.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.dataset.section); }),
      { rootMargin: '-30% 0px -62% 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections, uid]);

  // Reading progress: written to a CSS variable (no React state per scroll).
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.45 - rect.top) / Math.max(1, rect.height)));
      el.style.setProperty('--read', p.toFixed(4));
      if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // A link to #section opens at that section.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || !sections.some((s) => s.id === hash)) return undefined;
    const id = window.setTimeout(() => goTo(document.getElementById(`${uid}-${hash}`)), 700);
    return () => window.clearTimeout(id);
  }, [sections, uid, goTo]);

  const linkFor = (id) => `${window.location.origin}${window.location.pathname}#${id}`;

  const onFindKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      jump(cursor + (event.shiftKey ? -1 : 1));
    } else if (event.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div ref={rootRef} className={clsx(styles.root, styles[variant])} data-print="doc" style={{ '--read': 0 }}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />

      <div className={styles.facts} {...fx('doc.fact-strip')}>
        {version && <span className={styles.fact}><i>Version</i>{version}</span>}
        <span className={styles.fact}><i>Reading time</i>{minutes} min</span>
        <span className={styles.fact}><i>Sections</i>{sections.length}</span>
        {meta.map((m) => <span key={m.k} className={styles.fact}><i>{m.k}</i>{m.v}</span>)}
        <button type="button" className={styles.print} onClick={() => window.print()} {...fx('doc.print')}>
          <Printer size={14} aria-hidden="true" /> Print or save as PDF
        </button>
      </div>

      {summary.length > 0 && (
        <aside className={styles.summary} aria-label={summaryLabel} {...fx('doc.plain-summary')}>
          <span className={styles.summaryLabel}>{summaryLabel}</span>
          <ul>
            {summary.map((line) => <li key={line}><RichText text={line} terms={terms} /></li>)}
          </ul>
        </aside>
      )}

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Document contents" {...fx('doc.contents-rail')}>
          <button type="button" className={styles.tocToggle} aria-expanded={tocOpen} aria-controls={`${uid}-toc`} onClick={() => setTocOpen((v) => !v)}>
            <ListTree size={15} aria-hidden="true" /> Contents
            <ChevronDown size={15} className={clsx(styles.chev, tocOpen && styles.chevOpen)} aria-hidden="true" />
          </button>
          <div id={`${uid}-toc`} className={clsx(styles.tocBody, tocOpen && styles.tocOpen)}>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.fill} />
              <span className={styles.node} {...fx('doc.reading-node')} />
            </div>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={clsx(styles.tocLink, active === s.id && styles.tocOn)}
                    aria-current={active === s.id ? 'true' : undefined}
                    onClick={() => { setTocOpen(false); goTo(document.getElementById(`${uid}-${s.id}`)); }}
                  >
                    <span>{pad(i + 1)}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
            <p className={styles.read}><span ref={percentRef}>0%</span> read</p>
          </div>
        </nav>

        <div className={styles.doc}>
          <div className={styles.find} role="search" {...fx('doc.find-bar')}>
            <Search size={15} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setCursor(0); }}
              onKeyDown={onFindKey}
              placeholder="Find in this document…"
              aria-label="Find in this document"
              spellCheck={false}
              autoComplete="off"
            />
            <span className={styles.count} role="status" aria-live="polite">
              {query.trim().length > 1 ? (matches.length ? `${cursor + 1} / ${matches.length}` : 'No match') : ''}
            </span>
            <button type="button" aria-label="Previous match" disabled={!matches.length} onClick={() => jump(cursor - 1)}><ChevronUp size={15} aria-hidden="true" /></button>
            <button type="button" aria-label="Next match" disabled={!matches.length} onClick={() => jump(cursor + 1)}><ChevronDown size={15} aria-hidden="true" /></button>
            {query && <button type="button" aria-label="Clear the search" onClick={() => setQuery('')}><X size={15} aria-hidden="true" /></button>}
          </div>

          {sections.map((s, i) => {
            const url = linkFor(s.id);
            return (
              <section
                key={s.id}
                id={`${uid}-${s.id}`}
                data-section={s.id}
                className={clsx(styles.section, active === s.id && styles.on)}
                aria-labelledby={`${uid}-${s.id}-h`}
              >
                <header className={styles.sHead}>
                  <span className={styles.num} aria-hidden="true" {...fx('doc.section-numeral')}>{pad(i + 1)}</span>
                  <h3 id={`${uid}-${s.id}-h`}>{s.title}</h3>
                  <button type="button" className={styles.anchor} onClick={() => copy(url)} aria-label={`Copy a link to “${s.title}”`}>
                    {copied === url ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
                  </button>
                </header>
                {s.plain && (
                  <aside className={styles.plain} {...fx('doc.in-short')}>
                    <span>In short</span>
                    <p>{s.plain}</p>
                  </aside>
                )}
                <div className={styles.sBody}>
                  {s.body.map((item, bi) => {
                    const id = `${s.id}-${bi}`;
                    const hot = matches[cursor] === id;
                    return (
                      <div key={bi} className={clsx(styles.row, hot && styles.hot)}>
                        <Item item={item} id={id} number={`${i + 1}.${bi + 1}`} terms={terms} hl={hl} />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <footer className={styles.end} {...fx('doc.end-mark')}>
            <span className={styles.endLine} aria-hidden="true" />
            <p><Check size={15} aria-hidden="true" /> {endLabel} · {sections.length} sections · about {minutes} min</p>
            <button type="button" onClick={() => lenis.scrollTo(rootRef.current, { offset: -90 })}>
              <ArrowUp size={14} aria-hidden="true" /> Back to the start of the document
            </button>
          </footer>
          {note && <p className={styles.footnote}>{note}</p>}
        </div>
      </div>
    </div>
  );
}
