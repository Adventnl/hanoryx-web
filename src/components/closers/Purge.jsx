import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Eraser, RefreshCw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { clearOwnStorage, isOwnKey, readFootprint } from '../../utils/footprint';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './Purge.module.css';

/** A purge button for the site's own items in your browser. One press runs a
 *  short "wipe", removes only the keys that belong to this site, and shows what
 *  is left (which should be nothing of ours). */
export default function Purge({ tag, title, lede, onward }) {
  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | running | done
  const [removed, setRemoved] = useState(0);
  const timer = useRef(0);

  const read = useCallback(() => {
    const fp = readFootprint();
    setItems([...(fp.local || []), ...(fp.session || [])].filter(isOwnKey));
  }, []);
  useEffect(() => {
    const id = window.setTimeout(read, 0);
    const poll = window.setInterval(read, 2000);
    return () => { window.clearTimeout(id); window.clearInterval(poll); window.clearTimeout(timer.current); };
  }, [read]);

  const run = () => {
    if (phase === 'running') return;
    setPhase('running');
    timer.current = window.setTimeout(() => {
      setRemoved(clearOwnStorage());
      read();
      setPhase('done');
    }, 1500);
  };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.stage} {...fx('purge.stage')}>
        <button type="button" className={clsx(styles.big, phase === 'running' && styles.running, phase === 'done' && styles.done)} onClick={run} aria-label="Remove this site’s items from my browser" {...fx('purge.wipe-button')}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className={styles.track} cx="60" cy="60" r="54" />
            <circle className={styles.arc} cx="60" cy="60" r="54" pathLength="1" />
          </svg>
          <Eraser size={30} strokeWidth={1.2} aria-hidden="true" />
          <span>{phase === 'running' ? 'Wiping…' : phase === 'done' ? 'Wiped' : 'Purge'}</span>
        </button>
        <div className={styles.side}>
          <p className={shared.label}>Held for this site right now</p>
          <ul className={styles.list} aria-live="polite" {...fx('purge.item-list')}>
            {items.length === 0 ? (
              <li className={styles.none}>{phase === 'done' ? `Removed ${removed} ${removed === 1 ? 'item' : 'items'}. Nothing of this site’s is left.` : 'Nothing. This site holds no items in your browser right now.'}</li>
            ) : (
              items.map((k) => <li key={k} className={clsx(styles.item, phase === 'running' && styles.strike)}><code>{k}</code></li>)
            )}
          </ul>
          <div className={shared.row}>
            <button type="button" className={shared.btn} onClick={read}><RefreshCw size={14} aria-hidden="true" /> Re-read</button>
          </div>
          <p className={styles.note}>Only keys that start with <code>hnx.</code> are touched. Other sites’ data, and your browser’s own caches, are not.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
