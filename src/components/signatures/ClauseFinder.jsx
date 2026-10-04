import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Accordion } from '../fx/Accordion';
import { fx } from '../../utils/fx';
import styles from './ClauseFinder.module.css';

/**
 * Plain-language clauses you can filter. Type to narrow, pick a topic, open a
 * clause. The one-line gist sits under every title so the list can be read
 * without opening anything.
 *
 *   topics:  [string]       (first is "All")
 *   clauses: [{ id, title, meta, topic, gist, body: string | string[] }]
 */
export default function ClauseFinder({ eyebrow, title, intro, topics, clauses, note }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(topics[0]);

  const shown = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return clauses.filter((c) => {
      if (topic !== topics[0] && c.topic !== topic) return false;
      if (!tokens.length) return true;
      const hay = `${c.title} ${c.gist} ${[].concat(c.body).join(' ')}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [clauses, topic, topics, query]);

  const items = shown.map((c) => ({
    id: c.id,
    meta: c.meta,
    title: (
      <span className={styles.title}>
        <span>{c.title}</span>
        <small>{c.gist}</small>
      </span>
    ),
    body: (
      <div className={styles.body}>
        {[].concat(c.body).map((p) => <p key={p}>{p}</p>)}
      </div>
    ),
  }));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('terms.clause-finder')}>
        <div className={styles.top}>
          <label className={styles.search}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Filter the clauses</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter the clauses…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{shown.length} / {clauses.length}</span>
          </label>
          <div className={styles.topics} role="group" aria-label="Topic">
            {topics.map((t) => (
              <button key={t} type="button" className={clsx(styles.chip, topic === t && styles.chipOn)} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
            ))}
          </div>
        </div>
        {items.length > 0 ? (
          <Accordion items={items} single numbered={false} key={`${topic}-${query}`} />
        ) : (
          <p className={styles.none}>No clause matches. Try fewer words.</p>
        )}
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
