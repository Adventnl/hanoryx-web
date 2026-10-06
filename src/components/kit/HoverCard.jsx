import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './overlays.module.css';

/**
 * A preview card for a link: hover or focus the link and a little more about where
 * it goes appears, and stays while the pointer is on it. Because touch has no
 * hover, the card must only ever *add* — the link has to make sense without it.
 *
 *   <HoverCard title="Glossary" body="Every term the site uses…"><Link to="/resources/glossary">…</Link></HoverCard>
 */
export default function HoverCard({ title, body, children, delay = 280, className }) {
  const id = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  const arm = useCallback((on, ms) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(on), ms); }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      className={`${styles.anchor} ${className || ''}`}
      onPointerEnter={() => arm(true, delay)}
      onPointerLeave={() => arm(false, 160)}
      onFocus={() => arm(true, 0)}
      onBlur={() => arm(false, 0)}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); arm(false, 0); } }}
    >
      <span aria-describedby={open ? `${id}-card` : undefined} style={{ display: 'inline-flex' }}>{children}</span>
      {open && (
        <span id={`${id}-card`} role="tooltip" className={styles.card}>
          {title && <h4>{title}</h4>}
          <span>{body}</span>
        </span>
      )}
    </span>
  );
}
