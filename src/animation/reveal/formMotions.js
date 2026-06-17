/* Form motion grammar. Field underline-draw, label lock, focus pulse and the
   submit "transmission" sequence are CSS-driven on the inputs. These variants
   support JS-orchestrated field reveals + submit state machines. */
import { EASE } from './motionProfiles';

export const fieldStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const fieldItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* submit button transmission stages */
export const SUBMIT_STATES = ['idle', 'transmitting', 'sent', 'error'];

export const FORM_MOTIONS = [
  'form-underline-draw',
  'form-label-lock',
  'form-focus-pulse',
  'form-submit-transmit',
  'form-field-stagger',
];
