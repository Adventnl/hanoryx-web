import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * An on/off switch for a setting that takes effect at once (use a checkbox for
 * something that waits for a Save). `role="switch"` on a button, so Space and
 * Enter flip it and a screen reader says "on" or "off". The label is the name.
 */
export default function Switch({ label, checked, defaultChecked = false, onChange, disabled, showState = true, className, ...rest }) {
  const [on, setOn] = useControllable({ value: checked, defaultValue: defaultChecked, onChange });
  return (
    <button type="button" role="switch" aria-checked={on} className={`${styles.switchRow} ${className || ''}`} disabled={disabled} onClick={() => setOn(!on)} {...rest}>
      <span className={styles.track} aria-hidden="true"><span className={styles.thumb} /></span>
      <span>{label}</span>
      {showState && <span className={styles.switchState} aria-hidden="true">{on ? 'On' : 'Off'}</span>}
    </button>
  );
}
