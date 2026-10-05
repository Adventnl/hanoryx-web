import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './data.module.css';

/**
 * One number, large, with its label above and, if you have it, how it moved.
 * The change is written as words for a screen reader ("up 4 percent"), and its
 * arrow and colour are decoration. `unit` is the small word after the figure.
 */
export default function Stat({ label, value, unit, change, changeLabel, note, className }) {
  const dir = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const Arrow = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : ArrowRight;
  return (
    <div className={`${styles.stat} ${className || ''}`}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}{unit && <small>{unit}</small>}</span>
      {change != null && (
        <span className={styles.delta} data-dir={dir}>
          <Arrow size={13} aria-hidden="true" />
          <span aria-hidden="true">{change > 0 ? '+' : ''}{change}%</span>
          <span className="sr-only">{dir === 'flat' ? 'unchanged' : `${dir} ${Math.abs(change)} percent`} {changeLabel}</span>
          {changeLabel && <span aria-hidden="true">{changeLabel}</span>}
        </span>
      )}
      {note && <span className={styles.statNote}>{note}</span>}
    </div>
  );
}
