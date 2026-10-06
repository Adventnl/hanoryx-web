import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { releases } from '../../data/releases';
import { fx } from '../../utils/fx';
import styles from './ReleaseNotes.module.css';

const TAGS = ['Added', 'Changed', 'Fixed'];
const count = (tag) => releases.reduce((n, r) => n + r.notes.filter((x) => x.tag === tag).length, 0);

/** The site's history, told in chapters, newest first. The site is not versioned
 *  and nothing on it is derived from repository dates, so the chapters carry no
 *  dates: they are in the order things happened. Filter by what kind of change. */
export default function ReleaseNotes({ eyebrow, title, intro, note }) {
  const [tag, setTag] = useState('All');
  const [open, setOpen] = useState(() => new Set([releases[0].id]));
  const toggle = (id) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOpen = open.size === releases.length;
  const visible = releases
    .map((r) => ({ ...r, notes: r.notes.filter((n) => tag === 'All' || n.tag === tag) }))
    .filter((r) => r.notes.length);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('changelog.bench')}>
        <div className={styles.top}>
          <div className={styles.chips} role="group" aria-label="Kind of change">
            {['All', ...TAGS].map((t) => (
              <button key={t} type="button" className={clsx(styles.chip, tag === t && styles.on)} aria-pressed={tag === t} onClick={() => setTag(t)}>
                {t}{t !== 'All' && <i>{count(t)}</i>}
              </button>
            ))}
          </div>
          <button type="button" className={styles.all} onClick={() => setOpen(allOpen ? new Set() : new Set(releases.map((r) => r.id)))}>{allOpen ? 'Collapse all' : 'Expand all'}</button>
        </div>

        <ol className={styles.list}>
          {visible.map((r) => {
            const isOpen = open.has(r.id);
            return (
              <li key={r.id} id={`chapter-${r.chapter}`} className={clsx(styles.chapter, isOpen && styles.isOpen)} {...fx('changelog.chapter')}>
                <button type="button" className={styles.head} aria-expanded={isOpen} aria-controls={`notes-${r.id}`} onClick={() => toggle(r.id)}>
                  <span className={styles.num}>Ch. {String(r.chapter).padStart(2, '0')}</span>
                  <span className={styles.titles}><b>{r.title}</b><span>{r.lede}</span></span>
                  <span className={styles.tags}>{r.tags.map((t) => <i key={t}>{t}</i>)}</span>
                  <ChevronDown className={styles.chev} size={18} strokeWidth={1.4} aria-hidden="true" />
                </button>
                <div id={`notes-${r.id}`} className={styles.body} hidden={!isOpen}>
                  <ul>
                    {r.notes.map((n) => (
                      <li key={n.text}>
                        <span className={clsx(styles.tag, styles[`tag${n.tag}`])}>{n.tag}</span>
                        <span className={styles.text}>{n.text}</span>
                        {n.to && <Link to={n.to} className={styles.go} data-cursor="link" aria-label={`Open ${n.to}`}><ArrowUpRight size={14} aria-hidden="true" /></Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
