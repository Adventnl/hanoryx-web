import clsx from 'clsx';
import styles from './ScanlineOverlay.module.css';

/**
 * Fixed, full-viewport CRT scanline veil. Extremely subtle, static and
 * pointer-events none.
 *
 * It used to carry a 28vh band that crossed the screen forever. That one
 * infinite loop cost ~15 fps while scrolling (measured A/B on the home page,
 * 46 -> 57 fps with it removed): a large translucent layer re-composited over
 * every animating canvas, all the time, for an effect almost nobody could see.
 * Removed on purpose — motion on this site is for state, not ambience.
 */
export function ScanlineOverlay({ className }) {
  return <div className={clsx(styles.overlay, className)} aria-hidden="true" />;
}

export default ScanlineOverlay;
