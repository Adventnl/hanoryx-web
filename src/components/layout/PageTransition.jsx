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

/* Opacity + transform only — never `filter`. This element wraps the ENTIRE page
   (thousands of px tall, every canvas scene inside it), and Motion leaves the
   last animated value inline: `filter: blur(0px)` kept the whole page in an
   offscreen filter surface that every 30fps canvas update re-rendered, costing
   ~20fps on its own (measured). The route transition overlay already masks the
   swap, so the page itself only needs to fade and slide. */
const variants = {
  initial: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
  },
};

/**
 * Wraps a page so routes fade/slide between each other. Pair with the
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
