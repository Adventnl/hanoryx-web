import styles from './content.module.css';

/** Children in a row that wraps when it runs out of room — buttons, tags, links. `align` and `justify` are flexbox values. */
export default function Cluster({ children, gap = 3, align = 'center', justify = 'flex-start', as: Tag = 'div', className }) {
  return <Tag className={`${styles.cluster} ${className || ''}`} style={{ '--gap': `var(--space-${gap})`, '--align': align, '--justify': justify }}>{children}</Tag>;
}
