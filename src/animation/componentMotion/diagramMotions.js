/* Diagram / SVG motion grammar. Stroke-draw via pathLength + dashoffset (used
   by the radial menu, stat sparklines, and inline figures), node pop-in and
   active-pulse. */
import { SPRING } from './motionProfiles';

/* For an SVG path/circle with pathLength="1": animate dashoffset 1 -> 0. */
export const strokeDraw = {
  hidden: { strokeDashoffset: 1 },
  show: (i = 0) => ({ strokeDashoffset: 0, transition: { duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] } }),
};

export const diagramNode = {
  hidden: { scale: 0, opacity: 0 },
  show: (i = 0) => ({ scale: 1, opacity: 1, transition: { ...SPRING.pop, delay: 0.15 + i * 0.05 } }),
};

export const DIAGRAM_MOTIONS = ['svg-stroke-draw', 'svg-node-pop', 'svg-active-pulse', 'svg-connector-draw'];
