import styles from './data.module.css';

/**
 * Bars you can read as a list: each row has its label, a bar and the figure, so
 * the values are text first and a picture second. The largest is picked out in
 * red. Bars are scaled to the largest value unless you give `max`.
 *
 *   items: [{ label, value, display? }]
 */
export default function BarList({ items = [], max, unit = '', label, className }) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  const biggest = Math.max(...items.map((i) => i.value));
  return (
    <ul className={`${styles.bars} ${className || ''}`} aria-label={label}>
      {items.map((it) => (
        <li key={it.label} className={styles.bar} data-top={it.value === biggest ? '' : undefined}>
          <span>{it.label}</span>
          <span className={styles.barTrack} aria-hidden="true"><span className={styles.barFill} style={{ '--p': Math.min(1, it.value / top) }} /></span>
          <span className={styles.barValue}>{it.display ?? `${it.value}${unit}`}</span>
        </li>
      ))}
    </ul>
  );
}
