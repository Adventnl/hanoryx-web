import clsx from 'clsx';
import { useElementInView } from '../../hooks/useElementInView';
import styles from './Odometer.module.css';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * A number that rolls into place, each digit on its own wheel with a stagger.
 * The wheels start at 0 and settle when the number scrolls into view; a CSS
 * transition does all of the motion. Reads as the plain number to assistive
 * tech. Under reduced motion the transition collapses, so it simply shows the
 * value.
 */
export function Odometer({ value, decimals = 0, prefix = '', suffix = '', className }) {
  const [ref, inView] = useElementInView({ threshold: 0.4 });
  const formatted = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const label = `${prefix}${formatted}${suffix}`;

  return (
    <span ref={ref} role="img" aria-label={label} className={clsx(styles.odo, className)}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {Array.from(formatted).map((ch, i) =>
        DIGITS.includes(ch) ? (
          <span key={i} className={styles.col} aria-hidden="true">
            <span className={styles.strip} style={{ '--d': inView ? Number(ch) : 0, '--i': i }}>
              {DIGITS.map((d) => (
                <span key={d} className={styles.digit}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true" className={styles.sym}>{ch}</span>
        )
      )}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}

export default Odometer;
