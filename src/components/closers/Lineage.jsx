import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './Lineage.module.css';

/** “Where did this number come from?” Press the figure and follow it down, hop
 *  by hop, to the system that produced it, seeing what must be recorded at each
 *  hop for the trail to be walkable. An invented figure, to show the idea. */
export default function Lineage({ tag, title, lede, figure, hops = [], onward }) {
  const [depth, setDepth] = useState(0);
  const open = (i) => setDepth((d) => Math.max(d, i + 1));
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('lineage.rig')}>
        <button type="button" className={clsx(styles.figure, depth > 0 && styles.opened)} onClick={() => setDepth((d) => (d === 0 ? 1 : d))} aria-expanded={depth > 0}>
          <span className={styles.k}>{figure.label}</span>
          <b>{figure.value}</b>
          <small>{depth === 0 ? 'Press it. Where did this come from?' : 'Follow the trail down'}</small>
        </button>
        <ol className={styles.trail}>
          {hops.map((h, i) => (
            <li key={h.id} className={clsx(styles.hop, i < depth && styles.shown)}>
              {i < depth ? (
                <>
                  <span className={styles.node} aria-hidden="true" />
                  <div className={styles.body}>
                    <p className={styles.n}>{String(i + 1).padStart(2, '0')} · {h.layer}</p>
                    <h3>{h.name}</h3>
                    <p>{h.says}</p>
                    <p className={styles.record}><b>Record here:</b> {h.record}</p>
                    {i === depth - 1 && i < hops.length - 1 && (
                      <button type="button" className={styles.next} onClick={() => open(i + 1)}>Where did that come from? <ChevronDown size={14} aria-hidden="true" /></button>
                    )}
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
        {depth >= hops.length && <p className={styles.end} role="status">The trail ends at a source a person can open. A number you can walk back to is a number you can trust, or correct.</p>}
      </div>
    </CloserFrame>
  );
}
