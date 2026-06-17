import { motion } from 'motion/react';
import clsx from 'clsx';
import styles from './PageTransition.module.css';

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
  return (
    <motion.main
      id="main"
      className={clsx(styles.page, className)}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}

export default PageTransition;
