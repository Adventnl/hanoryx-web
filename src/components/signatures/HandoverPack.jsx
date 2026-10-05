import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { ProgressRing } from '../fx/ProgressRing';
import { fx } from '../../utils/fx';
import styles from './HandoverPack.module.css';

/**
 * A handover pack, item by item. Tick what is in it and a ring fills; a new
 * teammate's first-change time is estimated from what they would have to work
 * out for themselves, and the one missing thing that hurts most is named.
 *
 *   items: [{ id, label, why, weight, vital }]
 */
const BANDS = [
  { min: 0.85, label: 'Hours', line: 'They can run it, read why it is the way it is, and make a safe first change before lunch.' },
  { min: 0.6, label: 'A day or two', line: 'They will find their way, with a few questions and one or two wrong turns.' },
  { min: 0.3, label: 'Weeks', line: 'They will spend most of their time reconstructing things that could have been written down.' },
  { min: 0, label: 'Longer than anyone would like', line: 'They are doing archaeology. Some things will be broken before they are understood.' },
];

export default function HandoverPack({ eyebrow, title, intro, items = [], note }) {
  const [have, setHave] = useState(() => new Set());
  const toggle = (id) => setHave((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const total = items.reduce((n, i) => n + i.weight, 0);
  const score = items.filter((i) => have.has(i.id)).reduce((n, i) => n + i.weight, 0) / total;
  const band = BANDS.find((b) => score >= b.min);
  const worst = useMemo(() => items.filter((i) => !have.has(i.id)).sort((a, b) => b.weight - a.weight)[0], [items, have]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('handover.rig')}>
        <ul className={styles.pack} {...fx('handover.items')}>
          {items.map((i) => (
            <li key={i.id}>
              <label className={clsx(styles.item, have.has(i.id) && styles.on)}>
                <input type="checkbox" checked={have.has(i.id)} onChange={() => toggle(i.id)} />
                <span className={styles.box} aria-hidden="true" />
                <span className={styles.body}><b>{i.label}</b><span>{i.why}</span></span>
                {i.vital && <i>vital</i>}
              </label>
            </li>
          ))}
        </ul>
        <aside className={styles.side} {...fx('handover.readiness')}>
          <ProgressRing value={score} size={150} stroke={3.6} label={`Pack is ${Math.round(score * 100)} percent complete`} {...fx('handover.ring')}>
            <span className={styles.pct}>{Math.round(score * 100)}<small>%</small></span>
          </ProgressRing>
          <div role="status" aria-live="polite" className={styles.read}>
            <p className={styles.k}>A new teammate’s first safe change</p>
            <p className={styles.band}>{band.label}</p>
            <p className={styles.line}>{band.line}</p>
            {worst && <p className={styles.worst}><b>Missing, and it hurts most:</b> {worst.label.toLowerCase()}. {worst.why}</p>}
          </div>
        </aside>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
