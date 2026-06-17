import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { navGroups } from '../../app/routeConfig';
import { company } from '../../data/company';
import { AudioSignalButton } from '../audio/AudioSignalButton';
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={styles.overlay} variants={panelV} initial="hidden" animate="show" exit="exit">
          <nav className={styles.menu} aria-label="Mobile">
            {navGroups.map((g, i) => {
              const multi = g.children.length > 1;
              const isOpen = expanded === g.id;
              return (
                <motion.div key={g.id} variants={itemV} className={styles.group}>
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
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

          <motion.div className={styles.foot} variants={itemV}>
            <Link to="/contact" onClick={onClose} className={styles.channel}>
              Open Channel <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
            <div className={styles.footRow}>
              <span className={styles.status}>
                <span className={styles.dot} />
                {company.status}
              </span>
              <AudioSignalButton />
            </div>
            <a href={`mailto:${company.email}`} className={styles.email}>{company.email}</a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
