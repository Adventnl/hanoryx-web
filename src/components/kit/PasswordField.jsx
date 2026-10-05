import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import { strength } from './strength';
import styles from './inputs.module.css';

const LEVELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

/**
 * A password field with a show/hide toggle and a strength meter. The meter is
 * announced politely as it changes. Everything happens in the page.
 */
export default function PasswordField({ label = 'Password', hint, error, required, value, defaultValue = '', onChange, meter = true, className, disabled }) {
  const [pw, setPw] = useControllable({ value, defaultValue, onChange });
  const [shown, setShown] = useState(false);
  const level = strength(pw);

  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <>
          <span className={styles.group} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
            <input {...a11y} className={styles.bare} type={shown ? 'text' : 'password'} value={pw} required={required} disabled={disabled} autoComplete="new-password" spellCheck={false} onChange={(e) => setPw(e.target.value)} />
            <button type="button" className={styles.iconBtn} onClick={() => setShown((s) => !s)} aria-pressed={shown} aria-label={shown ? 'Hide the password' : 'Show the password'} disabled={disabled}>
              {shown ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            </button>
          </span>
          {meter && (
            <span className={styles.strength}>
              <span className={styles.strengthBars} data-level={Math.max(level, 0)} aria-hidden="true">
                {[1, 2, 3, 4].map((i) => <i key={i} data-on={level >= i ? '' : undefined} />)}
              </span>
              <span className={styles.strengthText} role="status">{level < 0 ? 'Strength shows as you type' : `Strength: ${LEVELS[level].toLowerCase()}`}</span>
            </span>
          )}
        </>
      )}
    </Field>
  );
}
