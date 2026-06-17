import clsx from 'clsx';
import styles from './SystemGrid.module.css';

/**
 * Decorative animated grid field — a faint drifting grid with a few pulsing
 * red nodes. Sits behind section content as an "operating surface". Purely
 * presentational; quiet under reduced motion.
 *
 * Props: nodes (number of red pulse nodes, default 5)
 */
export function SystemGrid({ nodes = 5, className }) {
  const positions = [
    { top: '18%', left: '12%', d: '0s' },
    { top: '64%', left: '24%', d: '1.2s' },
    { top: '32%', left: '78%', d: '0.6s' },
    { top: '80%', left: '66%', d: '1.8s' },
    { top: '48%', left: '46%', d: '0.9s' },
    { top: '12%', left: '60%', d: '1.5s' },
  ].slice(0, nodes);

  return (
    <div className={clsx(styles.grid, className)} aria-hidden="true">
      <div className={styles.lines} />
      <div className={styles.glow} />
      {positions.map((p, i) => (
        <span
          key={i}
          className={styles.node}
          style={{ top: p.top, left: p.left, animationDelay: p.d }}
        />
      ))}
    </div>
  );
}

export default SystemGrid;
