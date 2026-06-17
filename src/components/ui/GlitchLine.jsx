import clsx from 'clsx';
import styles from './GlitchLine.module.css';

/**
 * Thin animated divider — a hairline with a slow travelling highlight and a
 * rare red glitch tick. Decorative; frozen under reduced motion.
 *
 * Props: tone 'default' | 'red'
 */
export function GlitchLine({ tone = 'default', className }) {
  return (
    <span className={clsx(styles.line, tone === 'red' && styles.red, className)} aria-hidden="true">
      <span className={styles.sweep} />
      <span className={styles.tick} />
    </span>
  );
}

export default GlitchLine;
