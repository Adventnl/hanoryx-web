import { useId } from 'react';
import styles from './feedback.module.css';

/**
 * A gauge for a quantity inside a known range (disk used, budget spent) — not
 * progress toward a goal, which is a ProgressBar. Drawn as cells; the colour
 * changes in the low and high zones, and the zone is also written out for
 * anyone who cannot see the colour. `role="meter"` carries the numbers.
 */
export default function Meter({ label, value, min = 0, max = 100, low, high, cells = 20, unit = '', className }) {
  const id = useId();
  const p = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const zone = low != null && value < low ? 'low' : high != null && value > high ? 'high' : 'ok';
  const lit = Math.round(p * cells);
  return (
    <div className={`${styles.meter} ${className || ''}`} data-zone={zone}>
      <div className={styles.progressTop}>
        <span id={id}>{label}</span>
        <output>{value}{unit}{zone !== 'ok' ? ` · ${zone}` : ''}</output>
      </div>
      <div className={styles.cells} style={{ '--n': cells }} role="meter" aria-labelledby={id} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={`${value}${unit}${zone !== 'ok' ? `, ${zone}` : ''}`}>
        {Array.from({ length: cells }, (_, i) => <i key={i} data-on={i < lit ? '' : undefined} />)}
      </div>
    </div>
  );
}
