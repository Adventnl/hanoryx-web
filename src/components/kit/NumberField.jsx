import { Minus, Plus } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

const places = (n) => (String(n).split('.')[1] || '').length;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * A number with buttons either side. ↑ and ↓ step it, typing is free, and the
 * value is clamped to `min` and `max` when you leave the field — never while you
 * are typing, so "1" on the way to "12" is not rounded up to a minimum of 5.
 * `onChange` receives a number (or `null` while the field is empty).
 */
export default function NumberField({ label, hint, error, required, value, defaultValue = null, onChange, min = -Infinity, max = Infinity, step = 1, suffix, className, disabled }) {
  const [n, setN] = useControllable({ value, defaultValue, onChange });
  const decimals = Math.max(places(step), places(min === -Infinity ? 0 : min));
  const fix = (x) => Number(x.toFixed(decimals));
  const bump = (dir) => setN(fix(clamp((n ?? 0) + dir * step, min, max)));

  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <span className={styles.group} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
          <button type="button" className={styles.iconBtn} onClick={() => bump(-1)} disabled={disabled || (n ?? 0) <= min} aria-label={`Decrease ${label || 'value'}`} tabIndex={-1}><Minus size={14} aria-hidden="true" /></button>
          <input
            {...a11y}
            className={`${styles.bare} ${styles.number}`}
            type="number"
            inputMode="decimal"
            value={n ?? ''}
            min={Number.isFinite(min) ? min : undefined}
            max={Number.isFinite(max) ? max : undefined}
            step={step}
            required={required}
            disabled={disabled}
            onChange={(e) => setN(e.target.value === '' ? null : Number(e.target.value))}
            onBlur={() => { if (n != null) setN(fix(clamp(n, min, max))); }}
          />
          {suffix && <span className={styles.adorn}>{suffix}</span>}
          <button type="button" className={styles.iconBtn} onClick={() => bump(1)} disabled={disabled || (n ?? 0) >= max} aria-label={`Increase ${label || 'value'}`} tabIndex={-1}><Plus size={14} aria-hidden="true" /></button>
        </span>
      )}
    </Field>
  );
}
