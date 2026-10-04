import { useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { usePointerField } from '../../hooks/usePointerField';
import styles from './SpotlightCard.module.css';

/**
 * A card whose 1px border and surface are lit by the pointer: a radial light
 * travels the border while a faint glow pools under the cursor. The border is
 * the card's own background showing through a 1px inset (no CSS mask, so it is
 * cheap), and the light follows --mx/--my from usePointerField.
 *
 * Polymorphic: `to` -> router Link, `href` -> <a>, otherwise <div>.
 * `tone="red"` lights the border red (default), `"white"` for a quieter card.
 */
export function SpotlightCard({ to, href, tone = 'red', className, innerClassName, children, ...rest }) {
  const ref = useRef(null);
  usePointerField(ref);

  let Tag = 'div';
  const props = { ...rest };
  if (to) {
    Tag = Link;
    props.to = to;
  } else if (href) {
    Tag = 'a';
    props.href = href;
    if (/^https?:/.test(href)) {
      props.target = props.target ?? '_blank';
      props.rel = props.rel ?? 'noreferrer';
    }
  }

  return (
    <Tag ref={ref} className={clsx(styles.card, tone === 'white' && styles.white, className)} {...props}>
      <span className={styles.border} aria-hidden="true" />
      <span className={clsx(styles.inner, innerClassName)}>{children}</span>
    </Tag>
  );
}

export default SpotlightCard;
