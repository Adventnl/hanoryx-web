import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Search } from 'lucide-react';
import clsx from 'clsx';
import { navGroups } from '../../app/routeConfig';
import { company } from '../../data/company';
import { AudioSignalButton } from '../audio/AudioSignalButton';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './MobileNav.module.css';

const panelV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.28 } },
};
const itemV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 10 },
};

/** Full-screen mobile menu: expandable route groups + live audio + status. */
export function MobileNav({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...overlayRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus?.(); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={overlayRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="Site menu" variants={reduced ? undefined : panelV} initial={reduced ? false : 'hidden'} animate={reduced ? undefined : 'show'} exit={reduced ? undefined : 'exit'}>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close mobile navigation">×</button>
          <nav className={styles.menu} aria-label="Mobile">
            {navGroups.map((g, i) => {
              const multi = g.children.length > 1;
              const isOpen = expanded === g.id;
              return (
                <motion.div key={g.id} variants={reduced ? undefined : itemV} className={styles.group}>
                  <div className={styles.groupHead}>
                    <NavLink to={g.to} onClick={onClose} className={styles.groupLink}>
                      <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.groupLabel}>{g.label}</span>
                    </NavLink>
                    {multi && (
                      <button
                        type="button"
                        className={clsx(styles.expand, isOpen && styles.expandOpen)}
                        onClick={() => setExpanded(isOpen ? null : g.id)}
                        aria-label={`Toggle ${g.label} routes`}
                        aria-expanded={isOpen}
                      >
                        <Plus size={18} strokeWidth={1.4} />
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {multi && isOpen && (
                      <motion.ul
                        className={styles.sub}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {g.children.map((c) => (
                          <li key={c.to + c.label}>
                            <NavLink to={c.to} onClick={onClose} className={styles.subLink}>
                              <span className={styles.subCode}>{c.code}</span>
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          <motion.div className={styles.foot} variants={reduced ? undefined : itemV}>
            <button
              type="button"
              className={styles.channel}
              onClick={() => {
                onClose();
                // Let the menu start closing before the palette opens, so the
                // two overlays hand off instead of stacking.
                window.setTimeout(() => window.dispatchEvent(new Event('hanoryx:search')), 180);
              }}
            >
              <Search size={15} strokeWidth={1.5} aria-hidden="true" /> Search the site
            </button>
            <div className={styles.footRow}>
              <span className={styles.status}>
                <span className={styles.dot} />
                {company.status}
              </span>
              <AudioSignalButton />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
