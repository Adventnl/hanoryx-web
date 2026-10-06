import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './LeastPrivilege.module.css';

/** Slide how much an account may do and watch the blast radius — what a stolen
 *  password or a slip of the mouse could reach — grow with it. The job needs the
 *  first three. Everything past that is risk that buys nothing. */
export default function LeastPrivilege({ tag, title, lede, job, powers = [], needed = 3, onward }) {
  const [n, setN] = useState(needed);
  const radius = 14 + (n / powers.length) * 82;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('privilege.rig')}>
        <div className={styles.dial}>
          <svg viewBox="0 0 200 200" role="img" aria-label={`Blast radius: ${n} of ${powers.length} powers granted`}>
            <circle cx="100" cy="100" r="96" className={styles.max} />
            <circle cx="100" cy="100" r={radius} className={clsx(styles.blast, n > needed && styles.over)} />
            <circle cx="100" cy="100" r={14 + (needed / powers.length) * 82} className={styles.need} />
            <circle cx="100" cy="100" r="4" className={styles.core} />
          </svg>
          <p className={styles.read}><b>{n}</b> of {powers.length} powers</p>
        </div>
        <div className={styles.side}>
          <label className={styles.slider}>
            <span>Powers granted to “{job}”</span>
            <input type="range" min={1} max={powers.length} value={n} onChange={(e) => setN(Number(e.target.value))} aria-valuetext={`${n} of ${powers.length}`} />
          </label>
          <ul className={styles.list} aria-live="polite" {...fx('privilege.powers')}>
            {powers.map((p, i) => (
              <li key={p.name} className={clsx(i < n && styles.on, i < needed && styles.need2)}>
                <b>{p.name}</b>
                <span>{i < needed ? 'The job needs this.' : p.risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CloserFrame>
  );
}
