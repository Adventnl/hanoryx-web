import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './ScopeTarget.module.css';

/** A target for a vulnerability-reporting scope: the bullseye is what is in
 *  scope, the rings outside it are what is not. Hover or focus a ring (or pick
 *  it from the list) to read what sits in it. */
export default function ScopeTarget({ tag, title, lede, rings = [], onward }) {
  const [id, setId] = useState(rings[0]?.id);
  const current = rings.find((r) => r.id === id) || rings[0];
  const R = 46;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.wrap} {...fx('scope.target')}>
        <svg viewBox="0 0 200 200" className={styles.svg} role="img" aria-label="Concentric rings: the centre is in scope, the outer rings are not">
          {[...rings].reverse().map((r, k) => {
            const i = rings.length - 1 - k;
            const radius = ((i + 1) / rings.length) * 96;
            return <circle key={r.id} cx="100" cy="100" r={radius} className={clsx(styles.ring, r.scope === 'in' ? styles.in : styles.out, r.id === id && styles.on)} onMouseEnter={() => setId(r.id)} />;
          })}
          <line x1="100" y1="4" x2="100" y2="196" className={styles.cross} />
          <line x1="4" y1="100" x2="196" y2="100" className={styles.cross} />
          <circle cx="100" cy="100" r="3" className={styles.dot} />
          <text x="100" y={100 - R * 0 + 20} textAnchor="middle" className={styles.hint}>{current.short}</text>
        </svg>
        <div className={styles.side}>
          <div className={styles.picker} role="radiogroup" aria-label="Ring">
            {rings.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={r.id === id} className={clsx(styles.opt, r.id === id && styles.optOn)} onClick={() => setId(r.id)} onFocus={() => setId(r.id)}>
                <span className={clsx(styles.badge, r.scope === 'in' ? styles.badgeIn : styles.badgeOut)}>{r.scope === 'in' ? 'In scope' : 'Out of scope'}</span>
                {r.label}
              </button>
            ))}
          </div>
          <div className={styles.card} role="status" aria-live="polite" key={current.id}>
            <p>{current.note}</p>
            <ul>{current.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
