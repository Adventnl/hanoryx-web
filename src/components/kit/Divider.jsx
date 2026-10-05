import styles from './content.module.css';

/**
 * A line between things. Without a label it is a plain thematic break (`<hr>`);
 * with one it reads as a heading-less section break ("or", "Later") and is a
 * separator for assistive technology, not a heading.
 */
export default function Divider({ children, className }) {
  if (!children) return <hr className={`${styles.rule} ${className || ''}`} />;
  return <div className={`${styles.divider} ${className || ''}`} role="separator">{children}</div>;
}
