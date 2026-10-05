import styles from './content.module.css';

/**
 * A pull quote with its source. A real `<blockquote>` inside a `<figure>`, with
 * the attribution as the caption. Only ever put words here that someone really
 * said, with their say-so — this site quotes its own principles, not testimonials.
 */
export default function Quote({ children, cite, className }) {
  return (
    <figure className={`${styles.quote} ${className || ''}`}>
      <blockquote>{children}</blockquote>
      {cite && <figcaption>— {cite}</figcaption>}
    </figure>
  );
}
