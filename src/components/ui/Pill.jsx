import clsx from 'clsx';
import styles from './Pill.module.css';

/**
 * Small mono tag / status chip.
 * Props: variant 'default'|'red'|'ghost', dot (live indicator), icon.
 */
export function Pill({ children, variant = 'default', dot = false, icon: Icon, className, ...rest }) {
  return (
    <span className={clsx(styles.pill, styles[variant], className)} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {Icon && <Icon size={12} strokeWidth={1.5} aria-hidden="true" />}
      <span className={styles.text}>{children}</span>
    </span>
  );
}

export default Pill;
