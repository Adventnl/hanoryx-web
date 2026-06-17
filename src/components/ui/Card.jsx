import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { Pill } from './Pill';
import styles from './Card.module.css';

/**
 * Standard content card on the DataPanel surface. Consistent header
 * (label/code), serif title, body, and a tag/status footer.
 *
 * Props:
 *   code, label   header strip
 *   title         serif heading
 *   description   body copy (string or node)
 *   tags          string[] rendered as Pills
 *   status        small status text (footer-right)
 *   to / href     makes the whole card a link
 *   interactive   hover lift (default true)
 *   tone          'default' | 'redacted'
 *   arrow         show the corner arrow (default = interactive)
 */
export function Card({
  code,
  label,
  title,
  description,
  tags,
  status,
  to,
  href,
  interactive = true,
  tone = 'default',
  arrow,
  className,
  children,
}) {
  const showArrow = arrow ?? Boolean(to || href);
  return (
    <DataPanel
      code={code}
      label={label}
      to={to}
      href={href}
      interactive={interactive}
      tone={tone}
      className={clsx(styles.card, className)}
    >
      {showArrow && <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.5} aria-hidden="true" />}

      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.desc}>{description}</p>}
      {children}

      {(tags?.length || status) && (
        <div className={styles.foot}>
          <div className={styles.tags}>
            {tags?.map((t) => (
              <Pill key={t} variant="ghost">{t}</Pill>
            ))}
          </div>
          {status && <span className={styles.status}>{status}</span>}
        </div>
      )}
    </DataPanel>
  );
}

export default Card;
