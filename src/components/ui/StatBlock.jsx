import clsx from 'clsx';
import { AnimatedCounter } from '../animation/AnimatedCounter';
import styles from './StatBlock.module.css';

/**
 * A single telemetry metric: animated value + label + note.
 * Props: value, suffix, decimals, label, note, code
 */
export function StatBlock({ value, suffix = '', decimals = 0, label, note, code, className }) {
  const isNumeric = typeof value === 'number';
  return (
    <div className={clsx(styles.stat, className)}>
      {code && <span className={styles.code}>{code}</span>}
      <span className={styles.value}>
        {isNumeric ? (
          <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
        ) : (
          <>{value}{suffix}</>
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
      {note && <span className={styles.note}>{note}</span>}
    </div>
  );
}

export default StatBlock;
