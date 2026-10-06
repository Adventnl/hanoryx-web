import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A slider: the native range input, so ← → ↑ ↓ Home End and PageUp/PageDown work
 * without any script, with its value written beside the label. `format` turns the
 * number into text ("40 ms"); `marks` is a few words under the track.
 */
export default function RangeField({ label, hint, value, defaultValue = 0, onChange, min = 0, max = 100, step = 1, format = (n) => String(n), marks, className, disabled }) {
  const [n, setN] = useControllable({ value, defaultValue, onChange });
  return (
    <Field label={label} hint={hint} className={className} labelExtra={<output className={styles.rangeValue}>{format(n)}</output>}>
      {(a11y) => (
        <>
          <input {...a11y} className={styles.range} type="range" min={min} max={max} step={step} value={n} disabled={disabled} aria-valuetext={format(n)} onChange={(e) => setN(Number(e.target.value))} />
          {marks && <span className={styles.marks} aria-hidden="true">{marks.map((m) => <span key={m}>{m}</span>)}</span>}
        </>
      )}
    </Field>
  );
}
