import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './navigation.module.css';

/**
 * A button that opens a menu of actions (not a navigation: use links for that).
 * The ARIA menu-button pattern: ↓ or Enter opens and moves into the menu, ↑ ↓
 * Home End move, typing a letter jumps to the item that starts with it, Escape
 * closes and returns to the button, and Tab closes. A click elsewhere closes it.
 *
 *   items: [{ label, onSelect, danger?, disabled? } | { separator: true }]
 */
export default function DropdownMenu({ label, items = [], align = 'start', className }) {
  const base = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const actions = items.map((it, i) => ({ ...it, i })).filter((it) => !it.separator && !it.disabled);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const focusItem = (i) => itemRefs.current[i]?.focus();
  const openAt = (which) => {
    setOpen(true);
    // the menu mounts on the next frame; focus follows it
    requestAnimationFrame(() => focusItem(which === 'last' ? actions[actions.length - 1]?.i : actions[0]?.i));
  };
  const close = (back) => { setOpen(false); if (back) buttonRef.current?.focus(); };

  const onMenuKey = (e) => {
    const at = actions.findIndex((a) => itemRefs.current[a.i] === document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(actions[(at + 1) % actions.length].i); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(actions[(at - 1 + actions.length) % actions.length].i); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(actions[0].i); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(actions[actions.length - 1].i); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') close(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const hit = actions.find((a, n) => n > at && a.label.toLowerCase().startsWith(e.key.toLowerCase())) || actions.find((a) => a.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit) focusItem(hit.i);
    }
  };

  return (
    <span className={`${styles.menuWrap} ${className || ''}`} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${base}-menu` : undefined}
        onClick={() => (open ? close(false) : openAt('first'))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); openAt('first'); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); openAt('last'); }
        }}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <ul id={`${base}-menu`} role="menu" aria-label={label} className={styles.menu} data-end={align === 'end' ? '' : undefined} onKeyDown={onMenuKey}>
          {items.map((it, i) => (it.separator ? (
            <li key={`sep-${i}`} role="separator" className={styles.menuSep} />
          ) : (
            <li key={it.label} role="none">
              <button
                ref={(el) => { itemRefs.current[i] = el; }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className={styles.menuItem}
                data-danger={it.danger ? '' : undefined}
                disabled={it.disabled}
                onClick={() => { it.onSelect?.(); close(true); }}
              >
                {it.label}
              </button>
            </li>
          )))}
        </ul>
      )}
    </span>
  );
}
