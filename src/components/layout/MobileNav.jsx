import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { navLinks } from '../../data/navigation';
import { company } from '../../data/company';
import { AudioControl } from '../animation/AudioControl';
import styles from './MobileNav.module.css';

const panelV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06, delayChildren: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};
const itemV = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 12 },
};

/**
 * Full-screen mobile menu with staggered link reveals. Scroll-lock is
 * handled by the shell (Lenis stop) while open.
 */
export function MobileNav({ open, onClose, isPlaying, onToggleAudio }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          variants={panelV}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <nav className={styles.menu} aria-label="Mobile">
            {navLinks.map((link, i) => (
              <motion.div key={link.to} variants={itemV} className={styles.row}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
                >
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.label}>{link.label}</span>
                  <ArrowUpRight className={styles.arrow} size={20} strokeWidth={1.2} />
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <motion.div className={styles.foot} variants={itemV}>
            <Link to="/contact" onClick={onClose} className={styles.email}>
              {company.email}
            </Link>
            <div className={styles.footRow}>
              <span className={styles.status}>
                <span className={styles.dot} />
                {company.status}
              </span>
              <AudioControl isPlaying={isPlaying} onToggle={onToggleAudio} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
