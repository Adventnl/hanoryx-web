import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../utils/fx';
import styles from './CloserFrame.module.css';

/**
 * The common skeleton of a page ending. Each ending is its own composition
 * (see closers/registry.js); this frame only supplies what they share: a mono
 * "end of page" tag with a drawn rule, an optional headline and lede, and an
 * optional row of onward links. It is not a call to action — endings summarise
 * or play out the page they close.
 *
 *   tag     small label, e.g. "End of principles"
 *   title   serif headline (optional — some endings let the object speak)
 *   lede    one sentence under it
 *   onward  [{ label, to }]  where to go next
 */
export default function CloserFrame({ tag, title, lede, onward, align = 'left', className, children }) {
  return (
    <div className={clsx(styles.frame, align === 'center' && styles.center, className)}>
      <Reveal profile="scanX" as="div" className={styles.tagRow} {...fx('closer.end-tag')}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.tag}>{tag || 'End of page'}</span>
        <span className={styles.rule} aria-hidden="true" />
      </Reveal>
      {(title || lede) && (
        <Reveal profile="depthRise" as="header" className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {lede && <p className={styles.lede}>{lede}</p>}
        </Reveal>
      )}
      <div className={styles.body}>{children}</div>
      {onward?.length > 0 && (
        <nav className={styles.onward} aria-label="Keep reading" {...fx('closer.onward-links')}>
          {onward.map((l) => (
            <Link key={l.to} to={l.to} className={styles.link} data-cursor="link">
              <span>{l.label}</span>
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
