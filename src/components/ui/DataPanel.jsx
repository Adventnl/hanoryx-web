import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useElementInView } from '../../hooks/useElementInView';
import styles from './DataPanel.module.css';

/**
 * Glass "data panel" container — the base surface for cards and modules.
 * Optional corner brackets, mono code/label header strip, hover scan-line,
 * and interactive lift. Renders as div / <Link> (to) / <a> (href).
 *
 * Props:
 *   code        mono code, top-right
 *   label       eyebrow label, top-left
 *   brackets    corner brackets (default true)
 *   interactive hover lift + scan + red edge (default false)
 *   tone        'default' | 'redacted'
 */
export function DataPanel({
  code,
  label,
  brackets = true,
  interactive = false,
  tone = 'default',
  to,
  href,
  className,
  children,
  ...rest
}) {
  const [viewRef, inView] = useElementInView({ threshold: 0.2 });
  let Tag = 'div';
  const tagProps = { ...rest };
  if (to) { Tag = Link; tagProps.to = to; }
  else if (href) { Tag = 'a'; tagProps.href = href; }

  return (
    <Tag
      ref={viewRef}
      className={clsx(
        styles.panel,
        'glass',
        interactive && styles.interactive,
        tone === 'redacted' && styles.redacted,
        inView && styles.armed,
        className
      )}
      {...tagProps}
    >
      {brackets && (
        <span className={styles.brackets} aria-hidden="true">
          <i className={clsx(styles.bracket, styles.tl)} />
          <i className={clsx(styles.bracket, styles.tr)} />
          <i className={clsx(styles.bracket, styles.bl)} />
          <i className={clsx(styles.bracket, styles.br)} />
        </span>
      )}
      <span className={styles.revealScan} aria-hidden="true" />

      {(label || code) && (
        <div className={styles.head}>
          {label && <span className={clsx('data-label', styles.label)}>{label}</span>}
          {code && <span className={clsx('mono', styles.code)}>{code}</span>}
        </div>
      )}

      {interactive && <span className={styles.scan} aria-hidden="true" />}

      <div className={styles.body}>{children}</div>
    </Tag>
  );
}

export default DataPanel;
