import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Copy, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import styles from './TokenInspector.module.css';

const GROUPS = [
  { id: 'colour', label: 'Colour', test: (n) => n.startsWith('--c-') },
  { id: 'type', label: 'Type size', test: (n) => n.startsWith('--fs-') },
  { id: 'font', label: 'Typeface', test: (n) => n.startsWith('--font-') },
  { id: 'space', label: 'Space', test: (n) => n.startsWith('--space-') },
  { id: 'shape', label: 'Shape', test: (n) => n.startsWith('--r-') },
  { id: 'motion', label: 'Motion', test: (n) => n.startsWith('--dur-') || n.startsWith('--ease-') },
  { id: 'effect', label: 'Effect', test: (n) => n.startsWith('--glow-') || n.startsWith('--shadow') },
  { id: 'other', label: 'Other', test: () => true },
];

/* Every custom property declared on :root in the page's own stylesheets. */
function readTokens() {
  const found = new Set();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules || [])) {
      if (rule.selectorText && /^:root\b/.test(rule.selectorText.trim())) {
        for (const name of Array.from(rule.style)) if (name.startsWith('--')) found.add(name);
      }
    }
  }
  const cs = getComputedStyle(document.documentElement);
  return [...found].map((name) => {
    const value = cs.getPropertyValue(name).trim();
    const group = GROUPS.find((g) => g.test(name));
    return { name, value, group: group.id };
  });
}

function Preview({ t }) {
  const v = `var(${t.name})`;
  switch (t.group) {
    case 'colour': return <span className={styles.swatch}><i style={{ background: v }} /></span>;
    case 'type': return <span className={styles.type} style={{ fontSize: v }}>Aa</span>;
    case 'font': return <span className={styles.font} style={{ fontFamily: v }}>Hamburgefonstiv</span>;
    case 'space': return <span className={styles.space}><i style={{ width: v }} /></span>;
    case 'shape': return <span className={styles.shape} style={{ borderRadius: v }} />;
    case 'effect': return <span className={styles.effect} style={{ boxShadow: v }} />;
    case 'motion': return t.name.startsWith('--dur-')
      ? <span className={styles.run}><i style={{ animationDuration: v }} /></span>
      : <span className={styles.run}><i style={{ animationTimingFunction: v }} /></span>;
    default: return <span className={styles.none}>—</span>;
  }
}

/** The design tokens, read from the stylesheet this page is wearing. Search them,
 *  group them, see what each one is, copy it as var(--name). Nothing here is
 *  typed in by hand: change a token in the CSS and this page changes with it. */
export default function TokenInspector({ eyebrow, title, intro, note }) {
  const [tokens, setTokens] = useState(null);
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');
  const [copied, copy] = useCopy();

  useEffect(() => {
    const id = window.setTimeout(() => setTokens(readTokens()), 300);
    return () => window.clearTimeout(id);
  }, []);

  const counts = useMemo(() => Object.fromEntries(GROUPS.map((g) => [g.id, (tokens || []).filter((t) => t.group === g.id).length])), [tokens]);
  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return (tokens || []).filter((t) => (group === 'all' || t.group === group) && (!q || `${t.name} ${t.value}`.toLowerCase().includes(q)));
  }, [tokens, group, query]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('tokens.inspector')}>
        <div className={styles.top}>
          <label className={styles.search}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search the tokens</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search names and values…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{tokens ? `${shown.length} / ${tokens.length}` : '…'}</span>
          </label>
        </div>
        <div className={styles.chips} role="group" aria-label="Kind of token">
          <button type="button" className={clsx(styles.chip, group === 'all' && styles.on)} aria-pressed={group === 'all'} onClick={() => setGroup('all')}>All</button>
          {GROUPS.filter((g) => counts[g.id] > 0).map((g) => <button key={g.id} type="button" className={clsx(styles.chip, group === g.id && styles.on)} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}<i>{counts[g.id]}</i></button>)}
        </div>
        {!tokens && <p className={styles.wait}>Reading the stylesheet…</p>}
        {tokens && tokens.length === 0 && <p className={styles.wait}>This browser did not let the page read its own stylesheet, so there is nothing to list.</p>}
        <ul className={styles.list}>
          {shown.map((t) => (
            <li key={t.name} className={styles.row}>
              <Preview t={t} />
              <code className={styles.name}>{t.name}</code>
              <span className={styles.value}>{t.value}</span>
              <button type="button" className={styles.copy} onClick={() => copy(`var(${t.name})`)} aria-label={`Copy var(${t.name})`}><Copy size={12} aria-hidden="true" /> {copied === `var(${t.name})` ? 'Copied' : 'var()'}</button>
            </li>
          ))}
        </ul>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
