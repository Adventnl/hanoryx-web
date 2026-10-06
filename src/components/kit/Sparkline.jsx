import { useId } from 'react';
import styles from './data.module.css';

/**
 * A tiny line chart with no axes, for "which way is it going". It is an image
 * with a text description — range, first and last value — so the shape is never
 * the only way to learn it. The last point is marked.
 */
export default function Sparkline({ data = [], label, width = 180, height = 44, unit = '', className }) {
  const id = useId();
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const x = (i) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v) => height - pad - ((v - min) / span) * (height - pad * 2);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${height} L${x(0).toFixed(1)} ${height} Z`;
  const last = data[data.length - 1];
  const text = `${label ? `${label}: ` : ''}from ${data[0]}${unit} to ${last}${unit}, between ${min}${unit} and ${max}${unit}.`;

  return (
    <svg className={`${styles.spark} ${className || ''}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={id}>
      <title id={id}>{text}</title>
      <path className={styles.sparkArea} d={area} />
      <path className={styles.sparkLine} d={line} />
      <circle className={styles.sparkDot} cx={x(data.length - 1)} cy={y(last)} r="2.6" />
    </svg>
  );
}
