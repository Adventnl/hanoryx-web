import clsx from 'clsx';
import styles from './MarqueeRail.module.css';

/**
 * Seamless infinite marquee. Items are duplicated and translated -50% so the
 * loop is continuous. Pauses on hover; frozen under reduced motion.
 *
 * Props: items (string[]/node[]), speed (s, default 32), reverse, className
 */
export function MarqueeRail({ items = [], speed = 32, reverse = false, className }) {
  const doubled = [...items, ...items];
  return (
    <div className={clsx(styles.rail, className)} aria-hidden="true">
      <div
        className={clsx(styles.track, reverse && styles.reverse)}
        style={{ '--marquee-dur': `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span className={styles.item} key={i}>
            <span className={styles.text}>{item}</span>
            <span className={styles.sep} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default MarqueeRail;
