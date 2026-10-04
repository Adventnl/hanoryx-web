import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './ArrowLink.module.css';

/**
 * An inline call to action: an underline draws left→right on hover, the arrow
 * glides out of its corner. Resolves to a router Link (`to`), an external
 * anchor (`href`) or a button.
 */
export function ArrowLink({ to, href, children, className, tone = 'default', ...rest }) {
  const content = (
    <>
      <span className={styles.text}>{children}</span>
      <ArrowUpRight className={styles.arrow} size={15} strokeWidth={1.5} aria-hidden="true" />
    </>
  );
  const cls = clsx(styles.link, tone === 'red' && styles.red, className);
  if (to) return <Link to={to} className={cls} data-cursor="link" {...rest}>{content}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} data-cursor="link" {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return <button type="button" className={cls} data-cursor="link" {...rest}>{content}</button>;
}

export default ArrowLink;
