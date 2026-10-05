import { ChevronDown } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A native `<select>`, styled. Native on purpose: it brings the platform's own
 * keyboard handling, its picker on a phone and its screen-reader behaviour for
 * free. `options` is `[{ value, label, disabled? }]` (or plain strings).
 */
export default function SelectField({ label, hint, error, required, options = [], value, defaultValue = '', onChange, placeholder, className, disabled }) {
  const [current, setCurrent] = useControllable({ value, defaultValue, onChange });
  const list = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <span className={styles.selectWrap}>
          <select {...a11y} className={styles.select} value={current} required={required} disabled={disabled} onChange={(e) => setCurrent(e.target.value)}>
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {list.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      )}
    </Field>
  );
}
