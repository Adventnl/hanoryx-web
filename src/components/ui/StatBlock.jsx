import clsx from 'clsx';
import { AnimatedCounter } from '../effects/AnimatedCounter';
import styles from './StatBlock.module.css';

/**
 * A single telemetry metric: animated value + label + note.
 * Props: value, suffix, decimals, label, note, code
 */
export function StatBlock({ value, suffix = '', decimals = 0, label, note, code, className }) {
  const isNumeric = typeof value === 'number';
  return (
    <div className={clsx(styles.stat, className)}>
      <span className={styles.head}>
        {code && <span className={styles.code}>{code}</span>}
        <span className={styles.live} aria-hidden="true" />
      </span>
      <span className={styles.value}>
        {isNumeric ? (
          <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
        ) : (
          <>{value}{suffix}</>
        )}
      </span>
      {/* idle micro-waveform under the metric */}
      <span className={styles.spark} aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={styles.bar} style={{ '--i': i }} />
        ))}
      </span>
      {label && <span className={styles.label}>{label}</span>}
      {note && <span className={styles.note}>{note}</span>}
    </div>
  );
}

export default StatBlock;
