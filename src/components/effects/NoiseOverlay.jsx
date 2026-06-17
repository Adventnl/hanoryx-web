import clsx from 'clsx';
import styles from './NoiseOverlay.module.css';

/**
 * Fixed, full-viewport film-grain veil built from an inline SVG turbulence
 * filter (no external asset). Pointer-events none, very low opacity.
 */
export function NoiseOverlay({ className }) {
  return <div className={clsx(styles.noise, className)} aria-hidden="true" />;
}

export default NoiseOverlay;
