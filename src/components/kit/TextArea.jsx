import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A multi-line field that tells you how much room is left. `maxLength` is not
 * enforced by cutting your text off: going over turns the count red and the
 * field invalid, so nothing you typed disappears.
 */
export default function TextArea({ label, hint, error, required, maxLength, value, defaultValue = '', onChange, rows = 4, className, disabled, ...rest }) {
  const [text, setText] = useControllable({ value, defaultValue, onChange });
  const over = maxLength != null && text.length > maxLength;
  const problem = error || (over ? `${text.length - maxLength} characters over the limit.` : undefined);

  return (
    <Field label={label} hint={hint} error={problem} required={required} className={className}>
      {(a11y) => (
        <>
          <span className={styles.group} data-invalid={problem ? '' : undefined} data-disabled={disabled ? '' : undefined}>
            <textarea {...a11y} className={styles.bare} rows={rows} required={required} disabled={disabled} value={text} onChange={(e) => setText(e.target.value)} {...rest} />
          </span>
          {maxLength != null && (
            <span className={styles.count} data-over={over ? '' : undefined} aria-hidden="true">{text.length} / {maxLength}</span>
          )}
        </>
      )}
    </Field>
  );
}
