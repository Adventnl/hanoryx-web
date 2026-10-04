import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { KeyCap } from '../../components/fx/KeyCap';
import { shortcutPanel } from '../../data/shortcuts';
import { useLenis } from '../../app/providers/lenis-context';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { lockScroll } from '../../utils/scrollLock';
import styles from './ShortcutsOverlay.module.css';

const EASE = [0.16, 1, 0.3, 1];

/**
 * The "?" panel: a short list of the keys that do something here. It is a real
 * dialog — focus moves into it and returns afterwards, Escape and a click on the
 * backdrop close it, the page behind stops scrolling — and it eases in and out
 * rather than appearing. Rows light their caps as you press the real keys.
 */
export function ShortcutsOverlay({ open, onClose }) {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnTo.current = document.activeElement;
    const unlock = lockScroll(lenis);
    const focusId = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    const onKey = (event) => {
      if (event.key === 'Escape' || event.key === '?') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      } else if (event.key === 'Tab') {
        // keep focus inside the panel (it has a single control and one link)
        const items = Array.from(document.querySelectorAll('[data-shortcuts-panel] a, [data-shortcuts-panel] button'));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      cancelAnimationFrame(focusId);
      document.removeEventListener('keydown', onKey, true);
      unlock();
      returnTo.current?.focus?.({ preventScroll: true });
    };
  }, [open, lenis, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.root}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
          onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            data-shortcuts-panel
            initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
          >
            <header className={styles.head}>
              <span className={styles.eyebrow}>Shortcuts</span>
              <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close the shortcuts panel">
                <X size={16} aria-hidden="true" />
              </button>
            </header>
            <ul className={styles.list}>
              {shortcutPanel.map((row, i) => (
                <li key={row.label} style={{ '--i': i }}>
                  <span className={styles.keys}>
                    {row.keys.map((k, ki) => (
                      <span key={k} className={styles.keyGroup}>
                        {ki > 0 && <i aria-hidden="true">+</i>}
                        <KeyCap>{k}</KeyCap>
                      </span>
                    ))}
                  </span>
                  <span className={styles.what}>
                    <b>{row.label}</b>
                    {row.note && <small>{row.note}</small>}
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/legal/accessibility" className={styles.more} onClick={onClose}>
              Open the full keyboard map <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ShortcutsOverlay;
