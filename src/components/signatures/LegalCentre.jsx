import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../fx/SpotlightCard';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { loadAllPages } from '../../data/pages';
import { fx } from '../../utils/fx';
import styles from './LegalCentre.module.css';

const WORDS_PER_MINUTE = 220;
const wordsIn = (value) => (typeof value === 'string' ? value.split(/\s+/).length : Array.isArray(value) ? value.reduce((n, v) => n + wordsIn(v), 0) : value && typeof value === 'object' ? Object.values(value).reduce((n, v) => n + wordsIn(v), 0) : 0);

/**
 * Every legal document in one place. The title, section count and reading time
 * of each card are read from the document itself, and the bar along the bottom
 * is its shape: one segment per section, as wide as the section is long.
 *
 *   docs: [{ key, kind, blurb }]   (kind: Policy · Notice · Statement)
 */
export default function LegalCentre({ eyebrow, title, intro, docs = [] }) {
  const [pages, setPages] = useState(null);
  const [kind, setKind] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let live = true;
    loadAllPages().then((all) => { if (live) setPages(all); });
    return () => { live = false; };
  }, []);

  const items = useMemo(
    () =>
      docs.map((d, i) => {
        const page = pages?.[d.key];
        const doc = page?.blocks?.find((b) => b.kind === 'document');
        const sizes = doc ? doc.sections.map((s) => Math.max(20, wordsIn(s.body))) : [];
        const words = sizes.reduce((n, v) => n + v, 0);
        return {
          ...d,
          n: String(i + 1).padStart(2, '0'),
          to: `/${d.key}`,
          name: page?.title || d.key,
          sections: sizes.length,
          minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
          sizes,
          total: words || 1,
        };
      }),
    [docs, pages]
  );

  const kinds = ['All', ...new Set(docs.map((d) => d.kind))];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = items.filter((it) => (kind === 'All' || it.kind === kind) && tokens.every((t) => `${it.name} ${it.blurb} ${it.kind}`.toLowerCase().includes(t)));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('legal.centre')}>
        <div className={styles.top}>
          <label className={styles.search} {...fx('legal.live-filter')}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Filter the documents</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter the documents…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{shown.length} / {items.length}</span>
          </label>
          <div className={styles.kinds} role="group" aria-label="Kind of document" {...fx('legal.kind-chips')}>
            {kinds.map((k) => (
              <button key={k} type="button" className={clsx(styles.chip, kind === k && styles.chipOn)} aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <p className={styles.none}>No document matches. Try fewer words.</p>
        ) : (
          <RevealGroup key={`${kind}-${query}`} profile="dataMaterialize" className={styles.grid} itemClassName={styles.cell} stagger={0.06}>
            {shown.map((it) => (
              <SpotlightCard key={it.key} to={it.to} className={styles.cardWrap} innerClassName={styles.card} {...fx('legal.doc-card')}>
                <span className={styles.head}>
                  <span className={styles.num}>{it.n}</span>
                  <span className={styles.kind}>{it.kind}</span>
                </span>
                <h3 className={styles.name}>{it.name}</h3>
                <p className={styles.blurb}>{it.blurb}</p>
                <span className={styles.spine} aria-hidden="true" {...fx('legal.spine')}>
                  {it.sizes.map((w, i) => <i key={i} style={{ flexGrow: w, '--d': `${i * 38}ms` }} />)}
                </span>
                <span className={styles.foot}>
                  <span>{it.sections ? `${it.sections} sections · about ${it.minutes} min` : 'Loading…'}</span>
                  <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </SpotlightCard>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
