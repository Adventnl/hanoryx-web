import clsx from 'clsx';
import styles from './ScanlineOverlay.module.css';

/**
 * Fixed, full-viewport CRT scanline veil. Extremely subtle, pointer-events
 * none. A faint moving sweep adds life unless reduced motion is set.
 */
export function ScanlineOverlay({ className }) {
  return (
    <div className={clsx(styles.overlay, className)} aria-hidden="true">
      <div className={styles.sweep} />
    </div>
  );
}

export default ScanlineOverlay;
