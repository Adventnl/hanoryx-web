import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Accordion } from '../fx/Accordion';
import { RichText } from '../fx/RichText';
import { fx } from '../../utils/fx';
import styles from './FaqDesk.module.css';

/**
 * Questions and answers with a desk of categories on the left and a search
 * field above the list. Type to narrow, pick a category, open a question; each
 * answer can point at the page that answers it properly.
 *
 *   faqs: [{ id, cat, q, a: string | string[], to?, toLabel? }]
 */
export default function FaqDesk({ eyebrow, title, intro, cats = [], faqs = [] }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const names = ['All', ...cats];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  const counts = useMemo(() => {
    const c = { All: faqs.length };
    faqs.forEach((f) => { c[f.cat] = (c[f.cat] || 0) + 1; });
    return c;
  }, [faqs]);

  const shown = faqs.filter((f) => (cat === 'All' || f.cat === cat) && tokens.every((t) => `${f.q} ${[].concat(f.a).join(' ')}`.toLowerCase().includes(t)));

  const items = shown.map((f) => ({
    id: f.id,
    meta: f.cat,
    title: f.q,
    body: (
      <div className={styles.answer}>
        {[].concat(f.a).map((p) => <p key={p}><RichText text={p} highlight={tokens} /></p>)}
        {f.to && <Link to={f.to} className={styles.more} data-cursor="link">{f.toLabel || 'Read more'} <ArrowUpRight size={13} aria-hidden="true" /></Link>}
      </div>
    ),
  }));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.desk} {...fx('faq.desk')}>
        <div className={styles.cats} role="group" aria-label="Category" {...fx('faq.categories')}>
          {names.map((n) => (
            <button key={n} type="button" className={clsx(styles.cat, cat === n && styles.on)} aria-pressed={cat === n} onClick={() => setCat(n)}>
              <span>{n}</span><i>{counts[n] ?? 0}</i>
            </button>
          ))}
        </div>
        <div className={styles.main}>
          <label className={styles.search} {...fx('faq.live-filter')}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search the questions</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the questions…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{shown.length} / {faqs.length}</span>
          </label>
          {items.length ? (
            <Accordion items={items} numbered={false} single key={`${cat}-${query}`} />
          ) : (
            <p className={styles.none}>No question matches. Try fewer words, or another category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
