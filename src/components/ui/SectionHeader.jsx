import clsx from 'clsx';
import { useElementInView } from '../../hooks/useElementInView';
import styles from './SectionHeader.module.css';

const SIZE_CLASS = {
  display: 'display',
  hero: 'heading-hero',
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
};

/**
 * Eyebrow + serif title + optional intro, with a built-in staged reveal.
 *
 * Props:
 *   eyebrow  mono label above the title
 *   title    main heading (string or node)
 *   intro    optional lead paragraph
 *   code     optional mono code shown to the side
 *   as       heading tag (default 'h2')
 *   size     'display'|'hero'|'h1'|'h2'|'h3' (default 'h2')
 *   align    'left' | 'center' (default 'left')
 *   reveal   enable in-view reveal (default true)
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  code,
  as: Tag = 'h2',
  size = 'h2',
  align = 'left',
  reveal = true,
  className,
  children,
}) {
  const [ref, inView] = useElementInView({ threshold: 0.2 });
  const visible = !reveal || inView;

  return (
    <header
      ref={ref}
      className={clsx(
        styles.header,
        align === 'center' && styles.center,
        visible && styles.visible,
        className
      )}
    >
      {(eyebrow || code) && (
        <div className={styles.top}>
          {eyebrow && <span className={clsx('eyebrow', styles.eyebrow)}>{eyebrow}</span>}
          {code && <span className={clsx('mono', styles.code)}>{code}</span>}
        </div>
      )}
      {title && (
        <Tag className={clsx(SIZE_CLASS[size] || 'heading-2', styles.title)}>{title}</Tag>
      )}
      {intro && <p className={clsx('lead', styles.intro)}>{intro}</p>}
      {children}
    </header>
  );
}

export default SectionHeader;
