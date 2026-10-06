import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './Horizon.module.css';

/** The company's phases as strata under a horizon: the oldest lies deepest, the
 *  newest sits just beneath the surface, and above the line is the part that has
 *  not been told yet. Hover or focus a layer to read it. */
export default function Horizon({ tag, title, lede, phases = [], onward }) {
  const ordered = [...phases].reverse(); // newest first, top of the stack
  const [id, setId] = useState(null);
  const current = phases.find((p) => p.id === id);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.scene} {...fx('horizon.scene')}>
        <div className={styles.sky}>
          <span className={styles.sun} aria-hidden="true" {...fx('horizon.sun')} />
          <p className={styles.next}><span className={styles.cursor} aria-hidden="true" />The next phase has not been told yet.</p>
        </div>
        <div className={styles.line} aria-hidden="true"><span>Where the story stands</span></div>
        <ol className={styles.strata} {...fx('horizon.strata')}>
          {ordered.map((p, i) => (
            <li key={p.id} style={{ '--d': i / Math.max(1, ordered.length - 1) }}>
              <button type="button" className={clsx(styles.layer, id === p.id && styles.on)} onMouseEnter={() => setId(p.id)} onFocus={() => setId(p.id)} onClick={() => setId(p.id)}>
                <span className={styles.code}>{p.code}</span>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.line2}>{p.line}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.read} role="status" aria-live="polite">{current ? current.body : 'Move over a layer. The deepest is where it began.'}</p>
      </div>
    </CloserFrame>
  );
}
