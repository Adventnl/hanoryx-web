import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, MousePointerClick, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../fx/SpotlightCard';
import { RevealGroup } from '@/animation/reveal/Reveal';
import ArticleArtShape from './ArticleArtShape';
import { loadAllPages } from '../../data/pages';
import { fx } from '../../utils/fx';
import styles from './InsightLibrary.module.css';

const WPM = 220;
const wordsIn = (v) => (typeof v === 'string' ? v.split(/\s+/).length : Array.isArray(v) ? v.reduce((n, x) => n + wordsIn(x), 0) : v && typeof v === 'object' ? Object.values(v).reduce((n, x) => n + wordsIn(x), 0) : 0);

/**
 * The guides, as a library: filter by area, search, sort by length, and see at
 * a glance which ones have something to play with. Titles, summaries and
 * reading times are read from the guides themselves.
 *
 *   articles: [{ key, area, art }]
 */
export default function InsightLibrary({ eyebrow, title, intro, articles = [] }) {
  const [pages, setPages] = useState(null);
  const [area, setArea] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('area');

  useEffect(() => {
    let live = true;
    loadAllPages().then((all) => { if (live) setPages(all); });
    return () => { live = false; };
  }, []);

  const items = useMemo(
    () =>
      articles.map((a) => {
        const p = pages?.[a.key];
        const doc = p?.blocks?.find((b) => b.kind === 'document');
        const demo = p?.blocks?.find((b) => b.type === 'signature' && b.kind !== 'document');
        return { ...a, to: `/${a.key}`, name: p?.title || a.key, blurb: p?.hero?.intro || '', minutes: doc ? Math.max(1, Math.round(wordsIn(doc.sections) / WPM)) : null, demo: Boolean(demo) };
      }),
    [articles, pages]
  );

  const areas = ['All', ...new Set(articles.map((a) => a.area))];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = items
    .filter((it) => (area === 'All' || it.area === area) && tokens.every((t) => `${it.name} ${it.blurb} ${it.area}`.toLowerCase().includes(t)))
    .sort((a, b) => (sort === 'time' ? (a.minutes || 0) - (b.minutes || 0) : sort === 'name' ? a.name.localeCompare(b.name) : a.area.localeCompare(b.area) || a.name.localeCompare(b.name)));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('insights.library')}>
        <div className={styles.top}>
          <label className={styles.search} {...fx('insights.live-filter')}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search the guides</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the guides…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{shown.length} / {items.length}</span>
          </label>
          <label className={styles.sort}>
            <span>Order by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="area">Area</option>
              <option value="time">Shortest first</option>
              <option value="name">Title</option>
            </select>
          </label>
        </div>
        <div className={styles.chips} role="group" aria-label="Area" {...fx('insights.area-chips')}>
          {areas.map((a) => <button key={a} type="button" className={clsx(styles.chip, area === a && styles.on)} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>)}
        </div>

        {shown.length === 0 ? (
          <p className={styles.none}>No guide matches. Try fewer words.</p>
        ) : (
          <RevealGroup key={`${area}-${query}-${sort}`} profile="dataMaterialize" className={styles.grid} itemClassName={styles.cell} stagger={0.06}>
            {shown.map((it, i) => (
              <SpotlightCard key={it.key} to={it.to} className={clsx(styles.cardWrap, i === 0 && area === 'All' && !query && sort === 'area' && styles.feature)} innerClassName={styles.card} {...fx('insights.card')}>
                <span className={styles.art}><ArticleArtShape art={it.art} /></span>
                <span className={styles.meta}>
                  <span className={styles.area}>{it.area}</span>
                  {it.minutes && <span className={styles.min}>{it.minutes} min read</span>}
                  {it.demo && <span className={styles.demo}><MousePointerClick size={12} aria-hidden="true" /> Demo inside</span>}
                </span>
                <h3 className={styles.name}>{it.name}</h3>
                <p className={styles.blurb}>{it.blurb}</p>
                <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.4} aria-hidden="true" />
              </SpotlightCard>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
