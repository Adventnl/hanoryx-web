/* List / process-step motion grammar. Connector-line draw, sequential node
   activation and the focus highlight-rail are CSS; these variants drive
   JS-orchestrated sequential reveals. */
import { EASE } from './motionProfiles';

export const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const listNode = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export const LIST_MOTIONS = [
  'list-connector-draw',
  'list-node-sequence',
  'list-focus-rail',
  'process-line-draw',
  'process-step-activate',
];
