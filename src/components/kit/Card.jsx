import styles from './content.module.css';

/**
 * A surface that groups related content. Variants: `raised` (the default),
 * `flat`, `outline` and `accent`. The title is a heading whose level you choose
 * with `as`, so the card fits the outline of the page it is on. `interactive`
 * lifts it on hover and focus — put the one link or button inside it, and make
 * that the thing you press (do not wrap a whole card in a link).
 */
export default function Card({ eyebrow, title, as: Heading = 'h3', children, footer, variant = 'raised', interactive = false, className }) {
  return (
    <article className={`${styles.card} ${className || ''}`} data-variant={variant} data-interactive={interactive ? '' : undefined}>
      {eyebrow && <span className={styles.cardEyebrow}>{eyebrow}</span>}
      {title && <Heading className={styles.cardTitle}>{title}</Heading>}
      {children && <div className={styles.cardBody}>{children}</div>}
      {footer && <div className={styles.cardFoot}>{footer}</div>}
    </article>
  );
}
