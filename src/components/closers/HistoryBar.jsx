import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { releases } from '../../data/releases';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './HistoryBar.module.css';

const TAGS = ['Added', 'Changed', 'Fixed'];
const rows = [...releases].sort((a, b) => b.chapter - a.chapter).map((r) => ({ ...r, counts: Object.fromEntries(TAGS.map((t) => [t, r.notes.filter((n) => n.tag === t).length])) }));
const max = Math.max(...rows.map((r) => r.notes.length));
const totals = Object.fromEntries(TAGS.map((t) => [t, rows.reduce((n, r) => n + r.counts[t], 0)]));
const all = TAGS.reduce((n, t) => n + totals[t], 0);

/** The whole history of the site as one chart: a row for each chapter, a bar as
 *  long as the number of notes in it, cut into what was added, changed and fixed.
 *  The shapes differ as well as the shades, so it reads without colour. */
export default function HistoryBar({ tag, title, lede, onward }) {
  const [on, setOn] = useState(rows[rows.length - 1].chapter);
  const cur = rows.find((r) => r.chapter === on);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('historybar.rig')}>
        <div className={styles.chart}>
          <p className={styles.sum}><b>{all}</b> notes in <b>{rows.length}</b> chapters: {totals.Added} added, {totals.Changed} changed, {totals.Fixed} fixed.</p>
          <ol>
            {rows.map((r) => (
              <li key={r.id} className={clsx(styles.row, r.chapter === on && styles.cur)} onPointerEnter={() => setOn(r.chapter)} onFocus={() => setOn(r.chapter)}>
                <Link to={`/resources/changelog#chapter-${r.chapter}`} className={styles.link} data-cursor="link" aria-label={`Chapter ${r.chapter}, ${r.title}: ${r.counts.Added} added, ${r.counts.Changed} changed, ${r.counts.Fixed} fixed`}>
                  <span className={styles.ch}>{String(r.chapter).padStart(2, '0')}</span>
                  <span className={styles.name}>{r.title}</span>
                  <span className={styles.bar} aria-hidden="true">
                    {TAGS.map((t) => r.counts[t] > 0 && <i key={t} className={styles[t]} style={{ flexGrow: r.counts[t] }} />)}
                    <i className={styles.pad} style={{ flexGrow: max - r.notes.length }} />
                  </span>
                  <span className={styles.n}>{r.notes.length}</span>
                </Link>
              </li>
            ))}
          </ol>
          <ul className={styles.legend} aria-label="Key">
            {TAGS.map((t) => <li key={t}><i className={clsx(styles.sw, styles[t])} aria-hidden="true" />{t} <b>{totals[t]}</b></li>)}
          </ul>
        </div>
        <aside className={styles.detail} aria-live="polite" {...fx('historybar.detail')}>
          <p className={shared.label}>Chapter {cur.chapter}</p>
          <h3>{cur.title}</h3>
          <p>{cur.lede}</p>
          <ul>{cur.notes.slice(0, 3).map((n) => <li key={n.text}><b>{n.tag}</b> {n.text}</li>)}</ul>
          {cur.notes.length > 3 && <p className={styles.more}>and {cur.notes.length - 3} more</p>}
        </aside>
      </div>
    </CloserFrame>
  );
}
