import Field from './Field';
import styles from './inputs.module.css';

/**
 * A single-line text field: label, hint, error, and an optional prefix and
 * suffix inside the border (a currency, a unit, an `@`). Controlled
 * (`value` + `onChange`) or not (`defaultValue`) — it is a plain `<input>`.
 */
export default function TextField({ label, hint, error, required, prefix, suffix, className, disabled, type = 'text', ...input }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <span className={styles.group} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
          {prefix && <span className={styles.adorn}>{prefix}</span>}
          <input {...a11y} className={styles.bare} type={type} required={required} disabled={disabled} autoComplete="off" {...input} />
          {suffix && <span className={styles.adorn}>{suffix}</span>}
        </span>
      )}
    </Field>
  );
}
