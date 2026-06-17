import clsx from 'clsx';
import styles from './SectionPin.module.css';

/**
 * Pins its content to the viewport for a scroll distance using CSS sticky —
 * robust against transformed ancestors (page transitions) and Lenis, unlike
 * ScrollTrigger pinning. The outer height defines how long it stays pinned.
 *
 * Props: height (default '220vh'), children, className, contentClassName
 */
export function SectionPin({ height = '220vh', className, contentClassName, children }) {
  return (
    <div className={clsx(styles.outer, className)} style={{ '--pin-height': height }}>
      <div className={clsx(styles.inner, contentClassName)}>{children}</div>
    </div>
  );
}

export default SectionPin;
