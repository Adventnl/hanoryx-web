import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import styles from './inputs.module.css';

/**
 * A checkbox with room for a hint. It is a real `<input type="checkbox">` — the
 * square is drawn beside it — so space, labels, forms and screen readers all work
 * as they should. `indeterminate` is the "some of them" state of a parent box.
 */
export default function Checkbox({ label, hint, checked, defaultChecked, onChange, indeterminate = false, disabled, className, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={`${styles.check} ${className || ''}`} data-disabled={disabled ? '' : undefined}>
      <input ref={ref} type="checkbox" checked={checked} defaultChecked={defaultChecked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked, e)} {...rest} />
      <span className={`${styles.box} ${styles.square}`} aria-hidden="true">
        {indeterminate ? <Minus size={13} strokeWidth={2.2} /> : <Check size={13} strokeWidth={2.2} />}
      </span>
      <span className={styles.checkText}>
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}
