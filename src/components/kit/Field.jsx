import { useId } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import styles from './inputs.module.css';

/**
 * The label, hint and error every field shares, wired up so a screen reader
 * hears them: the control receives its id, `aria-describedby` and `aria-invalid`
 * from the function passed as `children`.
 *
 *   <Field label="Email" hint="We reply from this address." error={error}>
 *     {(props) => <input {...props} type="email" />}
 *   </Field>
 *
 * An error replaces the hint, and is announced when it appears.
 */
export default function Field({ label, hint, error, required, id, className, labelExtra, children }) {
  const auto = useId();
  const base = id || `f${auto.replace(/:/g, '')}`;
  const hintId = hint && !error ? `${base}-hint` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  const describedBy = hintId || errorId;

  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={base}>
          <span>{label}</span>
          {required && <span className={styles.req}>required</span>}
          {labelExtra}
        </label>
      )}
      {children({ id: base, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hintId && <p id={hintId} className={styles.hint}>{hint}</p>}
      {errorId && (
        <p id={errorId} className={styles.error} role="alert">
          <AlertCircle size={13} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
