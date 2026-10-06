import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './FunnelMath.module.css';

const VISITORS = 1000;

/** Every step between a first look and a confirmed purchase takes some people
 *  away. Set how many carry on at each step (your numbers, invented here) and
 *  watch the product of them; then take a step away and see what it is worth. */
export default function FunnelMath({ tag, title, lede, steps = [], onward }) {
  const [rates, setRates] = useState(() => Object.fromEntries(steps.map((s) => [s.id, s.rate])));
  const [skipped, setSkipped] = useState(() => new Set());

  const rows = useMemo(
    () => steps.reduce((acc, s) => {
      const before = acc.length ? acc[acc.length - 1].after : VISITORS;
      const r = skipped.has(s.id) ? 1 : rates[s.id] / 100;
      return [...acc, { ...s, before, after: before * r, r }];
    }, []),
    [steps, rates, skipped]
  );
  const end = rows[rows.length - 1].after;
  const toggle = (id) => setSkipped((x) => { const n = new Set(x); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('funnel.rig')}>
        <ol className={styles.steps}>
          {rows.map((s, i) => (
            <li key={s.id} className={clsx(styles.step, skipped.has(s.id) && styles.skip)}>
              <div className={styles.head}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <b>{s.name}</b>
                <label className={styles.drop}><input type="checkbox" checked={skipped.has(s.id)} onChange={() => toggle(s.id)} /> remove this step</label>
              </div>
              <span className={styles.bar} aria-hidden="true"><i style={{ width: `${(s.after / VISITORS) * 100}%` }} /></span>
              <div className={styles.row}>
                <label className={styles.rate}>
                  <span>{skipped.has(s.id) ? 'removed' : `${rates[s.id]}% carry on`}</span>
                  <input type="range" min={40} max={100} value={rates[s.id]} onChange={(e) => setRates((r) => ({ ...r, [s.id]: Number(e.target.value) }))} disabled={skipped.has(s.id)} aria-label={`Share who carry on after ${s.name}`} />
                </label>
                <span className={styles.left}><b>{Math.round(s.after)}</b> left of {VISITORS}</span>
              </div>
            </li>
          ))}
        </ol>
        <aside className={styles.out} aria-live="polite">
          <p className={styles.big}><b>{Math.round(end)}</b> of {VISITORS} reach the end</p>
          <p className={styles.sm}>That is {((end / VISITORS) * 100).toFixed(1)} in a hundred. Even when every step keeps nine in ten, five steps keep fewer than six in ten: the losses multiply, they do not add.</p>
          <p className={styles.fine}>The percentages start as round invented numbers, to show the shape. Use your own.</p>
        </aside>
      </div>
    </CloserFrame>
  );
}
