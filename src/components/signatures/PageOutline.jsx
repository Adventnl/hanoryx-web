import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLenis } from '../../app/providers/lenis-context';
import { fx } from '../../utils/fx';
import styles from './PageOutline.module.css';

const LANDMARKS = 'header, nav, main, footer, aside, search, form[aria-label], section[aria-label], section[aria-labelledby], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]';
const roleOf = (el) => el.getAttribute('role') || ({ HEADER: 'banner', NAV: 'navigation', MAIN: 'main', FOOTER: 'contentinfo', ASIDE: 'complementary', SEARCH: 'search', FORM: 'form', SECTION: 'region' })[el.tagName] || el.tagName.toLowerCase();
const nameOf = (el) => {
  const label = el.getAttribute('aria-label');
  if (label) return label;
  const ids = el.getAttribute('aria-labelledby');
  if (ids) return ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent.trim()).filter(Boolean).join(' ');
  return '';
};
const hasName = (el) => Boolean(el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.querySelector('img[alt]:not([alt=""])'));

/* Everything below is read from the live document, the way assistive technology would meet it. */
function scan() {
  const main = document.querySelector('main') || document.body;
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter((h) => h.offsetParent !== null || getComputedStyle(h).position === 'fixed')
    .map((el) => ({ el, level: Number(el.tagName[1]), text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 90) }));
  let jumps = 0;
  headings.forEach((h, i) => { if (i && h.level - headings[i - 1].level > 1) jumps += 1; });
  const landmarks = Array.from(document.querySelectorAll(LANDMARKS)).map((el) => ({ el, role: roleOf(el), name: nameOf(el) }));
  const stops = Array.from(document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.disabled && el.getClientRects().length);
  return {
    title: document.title,
    lang: document.documentElement.lang,
    headings,
    jumps,
    h1s: headings.filter((h) => h.level === 1).length,
    landmarks,
    stops: stops.length,
    imgsNoAlt: document.querySelectorAll('img:not([alt])').length,
    unnamed: Array.from(main.querySelectorAll('a[href], button')).filter((el) => !hasName(el)).length,
    skip: Boolean(document.querySelector('a[href^="#"][class*="skip" i], a[href="#main"], a[href="#content"]')),
  };
}

/** A screen reader's-eye view of the page you are reading: its title and language,
 *  its headings as an outline, its landmarks, how many places the Tab key stops, and
 *  a few things that go wrong. Click a heading to go there. */
export default function PageOutline({ eyebrow, title, intro, note }) {
  const [r, setR] = useState(null);
  const lenis = useLenis();
  const run = useCallback(() => setR(scan()), []);
  useEffect(() => {
    const id = window.setTimeout(run, 600);
    return () => window.clearTimeout(id);
  }, [run]);

  const go = (el) => { lenis.scrollTo(el, { offset: -120, duration: 1.1 }); };
  const checks = r && [
    { ok: Boolean(r.title), text: `The page has a title: “${r.title}”` },
    { ok: Boolean(r.lang), text: r.lang ? `The language is declared (${r.lang})` : 'No language declared, so a screen reader may guess wrongly' },
    { ok: r.h1s === 1, text: r.h1s === 1 ? 'There is exactly one top-level heading' : `There are ${r.h1s} top-level headings; there should be one` },
    { ok: r.jumps === 0, text: r.jumps === 0 ? 'Heading levels never skip' : `Heading levels skip ${r.jumps} time${r.jumps === 1 ? '' : 's'}` },
    { ok: r.imgsNoAlt === 0, text: r.imgsNoAlt === 0 ? 'Every image has an alt attribute' : `${r.imgsNoAlt} image${r.imgsNoAlt === 1 ? ' has' : 's have'} no alt attribute` },
    { ok: r.unnamed === 0, text: r.unnamed === 0 ? 'Every link and button in the main content has a name' : `${r.unnamed} link${r.unnamed === 1 ? '' : 's'} or button${r.unnamed === 1 ? '' : 's'} without a name` },
    { ok: r.landmarks.some((l) => l.role === 'main'), text: r.landmarks.some((l) => l.role === 'main') ? 'There is a main landmark' : 'No main landmark' },
  ];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('outline.rig')}>
        <div className={styles.left}>
          <div className={styles.top}>
            <p className={styles.k}>Headings · {r ? r.headings.length : '…'}</p>
            <button type="button" className={styles.btn} onClick={run}><RefreshCw size={13} aria-hidden="true" /> Scan again</button>
          </div>
          <ol className={styles.outline} aria-label="Headings on this page">
            {(r?.headings || []).map((h, i) => (
              <li key={i} style={{ '--lvl': h.level }}>
                <button type="button" onClick={() => go(h.el)}><span className={styles.lv}>H{h.level}</span>{h.text || '(empty heading)'}</button>
              </li>
            ))}
            {!r && <li className={styles.wait}>Reading the page…</li>}
          </ol>
        </div>
        <div className={styles.right}>
          <p className={styles.k}>What a screen reader meets</p>
          <ul className={styles.checks} aria-live="polite">
            {(checks || []).map((c) => <li key={c.text} className={clsx(!c.ok && styles.bad)}>{c.ok ? <Check size={14} aria-hidden="true" /> : <AlertTriangle size={14} aria-hidden="true" />}<span>{c.text}</span></li>)}
          </ul>
          {r && (
            <>
              <p className={styles.k}>Landmarks · {r.landmarks.length}</p>
              <ul className={styles.lm}>{r.landmarks.slice(0, 12).map((l, i) => <li key={i}><b>{l.role}</b><span>{l.name || 'no name'}</span></li>)}</ul>
              <p className={styles.stops}><b>{r.stops}</b> places the Tab key can stop on this page</p>
            </>
          )}
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
