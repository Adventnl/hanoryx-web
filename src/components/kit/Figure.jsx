import styles from './content.module.css';

/**
 * Something visual with a caption. The caption belongs to the figure, so a screen
 * reader reads the two together; whatever you put inside needs its own text
 * alternative (an `alt`, or an `aria-label` on an SVG).
 */
export default function Figure({ children, caption, className }) {
  return (
    <figure className={`${styles.figure} ${className || ''}`}>
      <div className={styles.frame}>{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
