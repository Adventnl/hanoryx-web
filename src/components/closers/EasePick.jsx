import { useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './EasePick.module.css';

/** The same menu opening, four times, each on a different easing. Pick the one
 *  that feels right, then see what the rule of thumb says — and why. */
export default function EasePick({ tag, title, lede, options = [], answer, why, onward }) {
  const reduced = usePrefersReducedMotion();
  const [run, setRun] = useState(1);
  const [pick, setPick] = useState(null);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('ease.rig')}>
        <ul className={styles.opts}>
          {options.map((o) => (
            <li key={o.id}>
              <button type="button" className={clsx(styles.opt, pick === o.id && styles.on)} onClick={() => setPick(o.id)} aria-pressed={pick === o.id}>
                <span className={styles.stage} aria-hidden="true">
                  <i key={run} className={clsx(styles.menu, !reduced && styles.go)} style={{ '--ease': o.css }} />
                </span>
                <b>{o.label}</b>
                <code>{o.css}</code>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.row}>
          <button type="button" className={shared.btn} onClick={() => setRun((n) => n + 1)}><Play size={14} aria-hidden="true" /> Play all four</button>
          <p className={styles.verdict} role="status" aria-live="polite">
            {pick == null ? 'Play them, then choose the one that feels right for a menu opening.' : pick === answer ? <><b>Same as the rule of thumb.</b> {why}</> : <><b>The rule of thumb picks “{options.find((o) => o.id === answer).label}”.</b> {why}</>}
          </p>
        </div>
      </div>
    </CloserFrame>
  );
}
