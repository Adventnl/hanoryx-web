import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowUpRight, Search, Shuffle } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { loadAllPages } from '../../data/pages';
import { pageRouteKeys, routePath } from '../../app/routeConfig';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './SiteDirectory.module.css';

const GROUPS = [
  { id: 'company', label: 'Company', test: (k) => k === 'company' || k.startsWith('company/') || k === 'contact' },
  { id: 'work', label: 'Work', test: (k) => k === 'work' || k.startsWith('work/') },
  { id: 'systems', label: 'Systems', test: (k) => k === 'systems' || k.startsWith('systems/') },
  { id: 'development', label: 'Development', test: (k) => k === 'north' || k.startsWith('north/') || k === 'engineering' || k === 'lab' },
  { id: 'insights', label: 'Insights', test: (k) => k === 'insights' || k.startsWith('insights/') },
  { id: 'resources', label: 'Resources', test: (k) => k === 'resources' || k.startsWith('resources/') },
  { id: 'trust', label: 'Trust', test: (k) => k === 'trust' || k.startsWith('trust/') },
  { id: 'legal', label: 'Legal', test: (k) => k === 'legal' || k.startsWith('legal/') },
  { id: 'site', label: 'The site', test: (k) => k === 'home' || k === 'sitemap' },
];

function Marked({ text, tokens }) {
  if (!tokens.length) return text;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

/**
 * A directory of every page on the site, built from the same page data that
 * renders them. Type to filter (title, path and the page's opening line), or
 * press "Take me somewhere" to land on a page at random. Rows re-flow with an
 * eased layout animation as the filter narrows.
 */
export default function SiteDirectory({ eyebrow, title, intro }) {
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState(null);

  // Every page's title and opening line, read from the page data itself.
  useEffect(() => {
    let live = true;
    loadAllPages().then((all) => { if (live) setPages(all); });
    return () => { live = false; };
  }, []);

  const items = useMemo(
    () =>
      pageRouteKeys
        .map((key) => {
          const page = pages?.[key];
          if (!page) return null;
          return {
            key,
            to: routePath(key),
            title: page.searchTitle || page.title,
            intro: page.hero?.intro || '',
          };
        })
        .filter(Boolean),
    [pages]
  );

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const visible = items.filter((it) => {
    if (!tokens.length) return true;
    const hay = `${it.title} ${it.to} ${it.intro}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });

  const surprise = () => {
    const pool = items.filter((it) => it.to !== pathname);
    navigate(pool[Math.floor(Math.random() * pool.length)].to);
  };
  const onKeyDown = (event) => {
    if (event.key === 'Enter' && visible.length === 1) navigate(visible[0].to);
    if (event.key === 'Escape') setQuery('');
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('sitemap.filter-directory')}>
        <div className={styles.top}>
          <label className={styles.search} {...fx('sitemap.live-filter')}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Filter pages</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder="Filter the pages…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{visible.length} / {items.length}</span>
          </label>
          <button type="button" className={styles.surprise} onClick={surprise} data-cursor="link" {...fx('sitemap.surprise')}>
            <Shuffle size={14} aria-hidden="true" /> Take me somewhere
          </button>
        </div>

        {GROUPS.map((g) => {
          const rows = visible.filter((it) => g.test(it.key));
          if (rows.length === 0) return null;
          return (
            <section key={g.id} className={styles.group} aria-label={g.label} {...fx('sitemap.group-reflow')}>
              <h3><span>{g.label}</span><i>{rows.length}</i></h3>
              <ul>
                <AnimatePresence initial={false}>
                  {rows.map((it) => (
                    <motion.li
                      key={it.key}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link to={it.to} className={clsx(styles.row, it.to === pathname && styles.here)} data-cursor="link">
                        <span className={styles.name}><Marked text={it.title} tokens={tokens} /></span>
                        <code className={styles.path}><Marked text={it.to} tokens={tokens} /></code>
                        <span className={styles.line}>{it.intro}</span>
                        <ArrowUpRight className={styles.arrow} size={16} strokeWidth={1.4} aria-hidden="true" />
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          );
        })}
        {visible.length === 0 && <p className={styles.none}>No page matches “{query}”.</p>}
      </div>
    </div>
  );
}
