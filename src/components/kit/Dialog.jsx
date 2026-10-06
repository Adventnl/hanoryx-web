import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { lockScroll } from '../../utils/scrollLock';
import { useLenis } from '../../app/providers/lenis-context';
import styles from './overlays.module.css';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const shown = (el) => el.getClientRects().length > 0;

/**
 * A modal dialog: it takes over the screen until it is dealt with. Focus moves
 * in (to the element marked `data-autofocus`, else the first control), Tab and
 * Shift+Tab stay inside, Escape and a press on the backdrop close it, the page
 * behind stops scrolling, and focus returns to what opened it. It is named by
 * its title. Use it sparingly — most things do not need to interrupt.
 *
 *   <Dialog open={open} onClose={() => setOpen(false)} title="Rename" footer={<>…buttons…</>}>…</Dialog>
 */
export default function Dialog({ open, onClose, title, children, footer, width, side, dismissible = true, className }) {
  const titleId = useId().replace(/:/g, '');
  const panel = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return undefined;
    const before = document.activeElement;
    const unlock = lockScroll(lenis);
    const frame = requestAnimationFrame(() => {
      const target = panel.current?.querySelector('[data-autofocus]') || panel.current?.querySelector(FOCUSABLE) || panel.current;
      target?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      unlock();
      if (before && typeof before.focus === 'function' && document.contains(before)) before.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  if (!open || typeof document === 'undefined') return null;

  const onKeyDown = (e) => {
    if (e.key === 'Escape' && dismissible) { e.preventDefault(); e.stopPropagation(); onClose?.(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(panel.current.querySelectorAll(FOCUSABLE)).filter(shown);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return createPortal(
    <div className={styles.root} data-side={side} data-lenis-prevent>
      <div className={styles.backdrop} onPointerDown={dismissible ? onClose : undefined} aria-hidden="true" />
      <div ref={panel} className={`${styles.panel} ${className || ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={width ? { '--w': width } : undefined} onKeyDown={onKeyDown}>
        <div className={styles.head}>
          <h2 id={titleId}>{title}</h2>
          {dismissible && <button type="button" className={styles.close} onClick={onClose} aria-label="Close"><X size={16} aria-hidden="true" /></button>}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
