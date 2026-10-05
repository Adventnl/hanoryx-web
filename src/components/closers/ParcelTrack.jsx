import { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ParcelTrack.module.css';

/** A tracking line for a report: four stations, a parcel that travels to the one
 *  you choose, and who handles that stage. No timings are promised or implied —
 *  only the order things happen in. */
export default function ParcelTrack({ tag, title, lede, stages = [], onward }) {
  const [at, setAt] = useState(0);
  const stage = stages[at];
  const last = stages.length - 1;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ol className={styles.line} style={{ '--n': stages.length, '--at': at }} {...fx('parcel.route')}>
        <span className={styles.rail} aria-hidden="true"><span className={styles.done} /></span>
        <span className={styles.parcel} aria-hidden="true" {...fx('parcel.parcel')} />
        {stages.map((s, i) => (
          <li key={s.id} className={clsx(styles.station, i <= at && styles.reached, i === at && styles.here)}>
            <button type="button" onClick={() => setAt(i)} aria-current={i === at ? 'step' : undefined}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.name}>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className={clsx(shared.panel, styles.card)} role="status" aria-live="polite" key={stage.id}>
        <p className={shared.label}>Stage {at + 1} of {stages.length} · {stage.who}</p>
        <p className={styles.text}>{stage.line}</p>
        <div className={shared.row}>
          <button type="button" className={shared.btn} onClick={() => setAt((a) => Math.max(0, a - 1))} disabled={at === 0}><ChevronLeft size={14} aria-hidden="true" /> Back</button>
          <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={() => setAt((a) => Math.min(last, a + 1))} disabled={at === last}>Next stage <ChevronRight size={14} aria-hidden="true" /></button>
        </div>
      </div>
    </CloserFrame>
  );
}
