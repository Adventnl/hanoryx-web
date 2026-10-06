import { useId } from 'react';
import styles from './feedback.module.css';

/**
 * How far along something is. With a `value` it is determinate and announces its
 * percentage; without one it is indeterminate ("working, no idea how long") and
 * says so. The percentage is also written beside the label for sighted readers.
 */
export default function ProgressBar({ label, value, max = 100, hideValue = false, className }) {
  const id = useId();
  const known = typeof value === 'number';
  const p = known ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className={`${styles.progress} ${className || ''}`}>
      <div className={styles.progressTop}>
        <span id={id}>{label}</span>
        {known && !hideValue && <output aria-hidden="true">{Math.round(p * 100)}%</output>}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? max : undefined}
        aria-valuenow={known ? value : undefined}
        aria-valuetext={known ? `${Math.round(p * 100)} percent` : 'In progress'}
        data-indeterminate={known ? undefined : ''}
      >
        <span className={styles.fill} style={{ '--p': p }} />
      </div>
    </div>
  );
}
