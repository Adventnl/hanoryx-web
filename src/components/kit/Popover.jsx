import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './overlays.module.css';

/**
 * A panel that opens under a button and holds anything — text, a small form, a
 * few links. It is not modal: focus stays where it is and Tab moves on into the
 * panel, which follows the button in the page. Escape closes it and returns to the
 * button; so does a press anywhere outside.
 */
export default function Popover({ label, title, children, align = 'start', placement = 'bottom', className }) {
  const id = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  return (
    <span className={`${styles.anchor} ${className || ''}`} ref={root} onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); button.current?.focus(); } }}>
      <button ref={button} type="button" className={styles.trigger} aria-expanded={open} aria-controls={open ? `${id}-pop` : undefined} onClick={() => setOpen((o) => !o)}>
        {label}
        <ChevronDown size={13} aria-hidden="true" />
      </button>
      {open && (
        <div id={`${id}-pop`} role="group" aria-label={title || label} className={styles.pop} data-align={align} data-place={placement}>
          {title && <p className={styles.popTitle}>{title}</p>}
          {children}
        </div>
      )}
    </span>
  );
}
