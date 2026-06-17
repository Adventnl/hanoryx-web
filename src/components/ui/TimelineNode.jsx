import clsx from 'clsx';
import { useElementInView } from '../../hooks/useElementInView';
import { Pill } from './Pill';
import styles from './TimelineNode.module.css';

/**
 * One node on the animated roadmap. Marker dot + phase / title / body.
 * Redacted nodes blur their detail and show a RESTRICTED tag.
 *
 * Props: code, phase, title, body, status, redacted, index, active
 */
export function TimelineNode({ code, phase, title, body, status, redacted = false, index, active = false }) {
  const [ref, inView] = useElementInView({ threshold: 0.35 });

  return (
    <li
      ref={ref}
      className={clsx(styles.node, inView && styles.visible, redacted && styles.redacted, active && styles.active)}
    >
      <div className={styles.marker} aria-hidden="true">
        <span className={styles.dot} />
        {typeof index === 'number' && <span className={styles.idx}>{String(index).padStart(2, '0')}</span>}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.code}>{code}</span>
          {status && (
            <Pill variant={redacted ? 'red' : 'ghost'} dot={active}>{status}</Pill>
          )}
        </div>
        {phase && <span className={styles.phase}>{phase}</span>}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{body}</p>
        {redacted && <span className={styles.restricted}>// RESTRICTED DETAIL</span>}
      </div>
    </li>
  );
}

export default TimelineNode;
