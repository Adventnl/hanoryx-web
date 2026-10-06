import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './overlays.module.css';

/**
 * A short description that appears beside a control on hover or keyboard focus,
 * after a beat so it does not flicker as the pointer crosses. It is wired up with
 * `aria-describedby`, is dismissed with Escape, and never holds anything the user
 * needs to act on — a tooltip adds detail, it does not replace a label.
 *
 *   <Tooltip text="Copy a link"><button>…</button></Tooltip>   (one focusable child)
 */
export default function Tooltip({ text, children, placement = 'top', delay = 350, className }) {
  const id = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  const show = useCallback(() => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(true), delay); }, [delay]);
  const hide = useCallback(() => { window.clearTimeout(timer.current); setOpen(false); }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const child = cloneElement(children, { 'aria-describedby': open ? `${id}-tip` : undefined });
  return (
    <span
      className={`${styles.anchor} ${className || ''}`}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={() => { window.clearTimeout(timer.current); setOpen(true); }}
      onBlur={hide}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); hide(); } }}
    >
      {child}
      {open && <span id={`${id}-tip`} role="tooltip" className={styles.tip} data-place={placement}>{text}</span>}
    </span>
  );
}
