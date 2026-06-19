import { useState } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { STORAGE_KEYS } from '../../utils/constants';
import styles from './PageTransition.module.css';

function bootAlreadyComplete() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.bootComplete) === '1';
  } catch {
    return true; // no storage -> behave as a normal navigation
  }
}

const variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(8px)',
    transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
  },
};

/**
 * Wraps a page so routes fade/blur/slide between each other. Pair with the
 * AnimatePresence in routes.jsx (mode="wait"). Each page should render its
 * content inside this component.
 */
export function PageTransition({ children, className }) {
  // On the very first load the boot overlay plays and SiteShell rises the whole
  // `.content` wrapper into view — that is the ONE entrance. If this page
  // mounted before boot finished, skip our own mount entrance so the two don't
  // stack and fight (the "shows then snaps/moves around" glitch on entry). On
  // later navigations boot is already complete, so the route transition plays.
  const [skipEnter] = useState(() => !bootAlreadyComplete());
  return (
    <motion.main
      id="main"
      className={clsx(styles.page, className)}
      variants={variants}
      initial={skipEnter ? false : 'initial'}
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}

export default PageTransition;
