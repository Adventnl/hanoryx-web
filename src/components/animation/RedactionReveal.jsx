import clsx from 'clsx';
import { useElementInView } from '../../hooks/useElementInView';
import styles from './RedactionReveal.module.css';

/**
 * Wraps content behind a redaction bar that sweeps away when scrolled into
 * view — "decrypting" the content. Honors reduced motion by revealing at
 * once. Content stays selectable/visible to assistive tech the whole time.
 *
 * Props: as, label (default 'DECRYPTING'), children, className
 */
export function RedactionReveal({ as: Tag = 'span', label = 'DECRYPTING', className, children }) {
  const [ref, inView] = useElementInView({ threshold: 0.4 });

  return (
    <Tag ref={ref} className={clsx(styles.wrap, inView && styles.revealed, className)}>
      <span className={styles.content}>{children}</span>
      <span className={styles.cover} aria-hidden="true">
        <span className={styles.label}>{label}</span>
      </span>
    </Tag>
  );
}

export default RedactionReveal;
