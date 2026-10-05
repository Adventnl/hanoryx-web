import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, Link2, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { useLenis } from '../../app/providers/lenis-context';
import { glossary, glossaryAreas } from '../../data/glossary';
import { fx } from '../../utils/fx';
import styles from './GlossaryBrowser.module.css';

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const letterOf = (t) => t[0].toUpperCase();
const SORTED = [...glossary].sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));

function Term({ g }) {
  const [copied, copy] = useCopy();
  return (
    <li id={`term-${slug(g.term)}`} className={styles.term} {...fx('glossary.term')}>
      <div className={styles.head}>
        <h3>{g.term}</h3>
        <span className={styles.area}>{g.area}</span>
      </div>
      <p>{g.def}</p>
      <div className={styles.foot}>
        {g.see && <Link to={`/${g.see}`} className={styles.see} data-cursor="link">Read more <ArrowUpRight size={12} aria-hidden="true" /></Link>}
        <button type="button" className={styles.link} onClick={() => copy(`${window.location.origin}${window.location.pathname}#term-${slug(g.term)}`)} aria-label={`Copy a link to ${g.term}`}><Link2 size={12} aria-hidden="true" /> {copied ? 'Copied' : 'Link'}</button>
      </div>
    </li>
  );
}

/** Every term the site uses, in plain language: search, filter by area, jump by
 *  letter, copy a link to one term. The same list explains the words that are
 *  underlined in the guides. */
export default function GlossaryBrowser({ eyebrow, title, intro, note }) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('All');
  const lenis = useLenis();
  const shown = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return SORTED.filter((g) => (area === 'All' || g.area === area) && tokens.every((t) => `${g.term} ${g.def}`.toLowerCase().includes(t)));
  }, [area, query]);
  const letters = [...new Set(SORTED.map((g) => letterOf(g.term)))];
  const present = new Set(shown.map((g) => letterOf(g.term)));
  const groups = letters.filter((l) => present.has(l)).map((l) => ({ letter: l, items: shown.filter((g) => letterOf(g.term) === l) }));

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id.startsWith('term-')) return undefined;
    const t = window.setTimeout(() => { const el = document.getElementById(id); if (el) lenis.scrollTo(el, { offset: -120, duration: 1.1 }); }, 500);
    return () => window.clearTimeout(t);
  }, [lenis]);

  const jump = (l) => { const el = document.getElementById(`letter-${l}`); if (el) lenis.scrollTo(el, { offset: -110, duration: 1 }); };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('glossary.bench')}>
        <div className={styles.top}>
          <label className={styles.search}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search the glossary</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms and meanings…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{shown.length} / {glossary.length}</span>
          </label>
        </div>
        <div className={styles.chips} role="group" aria-label="Area">
          {['All', ...glossaryAreas].map((a) => <button key={a} type="button" className={clsx(styles.chip, area === a && styles.on)} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>)}
        </div>
        <nav className={styles.az} aria-label="Jump to a letter" {...fx('glossary.az')}>
          {letters.map((l) => <button key={l} type="button" disabled={!present.has(l)} onClick={() => jump(l)}>{l}</button>)}
        </nav>
        {groups.length === 0 ? (
          <p className={styles.none}>No term matches. Try fewer words.</p>
        ) : (
          groups.map((g) => (
            <section key={g.letter} className={styles.group} aria-labelledby={`letter-${g.letter}`}>
              <h2 id={`letter-${g.letter}`} className={styles.letter}>{g.letter}</h2>
              <ul className={styles.list}>{g.items.map((t) => <Term key={t.term} g={t} />)}</ul>
            </section>
          ))
        )}
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
