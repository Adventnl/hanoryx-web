import clsx from 'clsx';
import styles from './ProgressRing.module.css';

/**
 * Ring gauge. `value` is 0..1; the stroke eases to it (CSS transition), so
 * ticking a checkbox or finishing a step sweeps the ring instead of jumping.
 */
export function ProgressRing({ value = 0, size = 96, stroke = 3, label, children, className, ...rest }) {
  const r = 20;
  return (
    <div className={clsx(styles.ring, className)} style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(value * 100)} percent`} {...rest}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className={styles.track} cx="24" cy="24" r={r} strokeWidth={stroke * 0.5} pathLength="1" />
        <circle
          className={styles.arc}
          cx="24"
          cy="24"
          r={r}
          strokeWidth={stroke}
          pathLength="1"
          style={{ strokeDashoffset: 1 - Math.max(0, Math.min(1, value)) }}
        />
      </svg>
      <span className={styles.center}>{children}</span>
    </div>
  );
}

export default ProgressRing;
