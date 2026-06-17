import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { MagneticButton } from '../effects/MagneticButton';
import styles from './Button.module.css';

/**
 * Primary interactive control. Resolves its element automatically:
 *   to    -> react-router <Link>
 *   href  -> <a> (external / mailto)
 *   else  -> <button>
 *
 * Props:
 *   variant  'primary' | 'ghost' | 'line' | 'outline'   (default 'primary')
 *   size     'sm' | 'md' | 'lg'                          (default 'md')
 *   icon     optional lucide icon component
 *   magnetic enable magnetic pull                        (default true)
 */
export function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  magnetic = true,
  className,
  children,
  ...rest
}) {
  const elementProps = { ...rest };
  let as = 'button';

  if (to) {
    as = Link;
    elementProps.to = to;
  } else if (href) {
    as = 'a';
    elementProps.href = href;
    if (/^https?:/.test(href)) {
      elementProps.target = elementProps.target ?? '_blank';
      elementProps.rel = elementProps.rel ?? 'noreferrer';
    }
  } else {
    elementProps.type = rest.type ?? 'button';
  }

  const classes = clsx(
    styles.btn,
    styles[variant],
    styles[size],
    className
  );

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {Icon ? <Icon className={styles.icon} size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
    </>
  );

  if (!magnetic) {
    const Tag = as;
    return (
      <Tag className={classes} {...elementProps}>
        {content}
      </Tag>
    );
  }

  return (
    <MagneticButton as={as} className={classes} {...elementProps}>
      {content}
    </MagneticButton>
  );
}

export default Button;
