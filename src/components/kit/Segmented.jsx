import { useId } from 'react';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A short row of exclusive choices drawn as one control, with an ink that glides
 * to the chosen one. Radio buttons underneath, so ← → choose, and it is named by
 * `label`. For choices that switch a panel of content, use Tabs.
 *
 *   options: ['Day', 'Week'] or [{ value, label }]
 */
export default function Segmented({ label, options = [], value, defaultValue, onChange, name, className }) {
  const auto = useId();
  const group = name || `s${auto.replace(/:/g, '')}`;
  const list = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const [current, setCurrent] = useControllable({ value, defaultValue: defaultValue ?? list[0]?.value, onChange });
  const index = Math.max(0, list.findIndex((o) => o.value === current));

  return (
    <div className={`${styles.seg} ${className || ''}`} role="radiogroup" aria-label={label} style={{ '--n': list.length, '--i': index }}>
      <span className={styles.segInk} aria-hidden="true" />
      {list.map((o) => (
        <label key={o.value} className={styles.segItem}>
          <input type="radio" name={group} value={o.value} checked={current === o.value} onChange={() => setCurrent(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
