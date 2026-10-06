import { useId } from 'react';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A group of radio buttons — real ones, so the arrow keys move and choose, Tab
 * leaves the group, and a screen reader says "2 of 4". The legend names the group.
 *
 *   options: [{ value, label, hint?, disabled? }]
 */
export default function RadioGroup({ legend, options = [], value, defaultValue, onChange, name, row = false, className, disabled }) {
  const auto = useId();
  const group = name || `r${auto.replace(/:/g, '')}`;
  const [current, setCurrent] = useControllable({ value, defaultValue, onChange });

  return (
    <fieldset className={`${styles.fieldset} ${className || ''}`} disabled={disabled}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      <div className={styles.options} data-row={row ? '' : undefined}>
        {options.map((o) => (
          <label key={o.value} className={styles.check} data-disabled={o.disabled || disabled ? '' : undefined}>
            <input type="radio" name={group} value={o.value} checked={current === o.value} disabled={o.disabled} onChange={() => setCurrent(o.value)} />
            <span className={`${styles.box} ${styles.round}`} aria-hidden="true" />
            <span className={styles.checkText}>
              <b>{o.label}</b>
              {o.hint && <small>{o.hint}</small>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
