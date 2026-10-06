import styles from './content.module.css';

/** Children in a column with an even gap (a spacing token, `--space-1` … `--space-12`). */
export default function Stack({ children, gap = 4, as: Tag = 'div', className }) {
  return <Tag className={`${styles.stack} ${className || ''}`} style={{ '--gap': `var(--space-${gap})` }}>{children}</Tag>;
}
