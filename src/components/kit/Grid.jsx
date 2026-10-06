import styles from './content.module.css';

/**
 * Children in as many equal columns as fit, none narrower than `min`. There is no
 * breakpoint to maintain: on a phone `min` is wider than the screen, so you get
 * one column; on a wide screen, as many as fit.
 */
export default function Grid({ children, min = '15rem', gap = 4, as: Tag = 'div', className }) {
  return <Tag className={`${styles.grid} ${className || ''}`} style={{ '--min': min, '--gap': `var(--space-${gap})` }}>{children}</Tag>;
}
