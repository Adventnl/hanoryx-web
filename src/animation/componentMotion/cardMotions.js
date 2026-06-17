/* Card motion grammar. Card entrance/hover behaviours are driven mostly by CSS
   (DataPanel: corner-bracket draw, reveal-scan, hover lift + scan crawl). These
   variants are for motion-driven card grids that want JS orchestration. */
import { EASE, SPRING } from './motionProfiles';

export const cardGridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const cardItem = {
  hidden: { opacity: 0, y: 30, rotateX: 6 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Orbit/radial card layout entrance — scale-pop from center outward. */
export const cardOrbitItem = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (i = 0) => ({ opacity: 1, scale: 1, transition: { ...SPRING.pop, delay: i * 0.05 } }),
};

/* Diagonal-slice layout entrance. */
export const cardSliceItem = {
  hidden: { opacity: 0, x: -40, skewX: -6 },
  show: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.6, ease: EASE } },
};

export const CARD_MOTIONS = ['card-grid', 'card-orbit', 'card-slice', 'card-border-trace', 'card-tilt'];
