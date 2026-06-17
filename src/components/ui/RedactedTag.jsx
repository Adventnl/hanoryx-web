import clsx from 'clsx';
import { Lock } from 'lucide-react';
import styles from './RedactedTag.module.css';

/**
 * A tasteful redaction bar. Use `label` for a classified chip, or pass
 * `children` (a string) to redact a same-width block of text.
 *
 * Props: label (default 'RESTRICTED'), children, lock (show lock icon)
 */
export function RedactedTag({ label = 'RESTRICTED', children, lock = false, className }) {
  return (
    <span className={clsx(styles.tag, className)} aria-label={`Redacted: ${label}`}>
      {children ? <span className={styles.hidden}>{children}</span> : null}
      <span className={styles.face}>
        {lock && <Lock size={11} strokeWidth={1.6} aria-hidden="true" />}
        {label}
      </span>
    </span>
  );
}

export default RedactedTag;
