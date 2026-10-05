import { useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './MotionModes.module.css';

const MODES = [
  { id: 'full', name: 'Full', says: 'The menu slides and scales into place, one item after another. Transform and opacity only.' },
  { id: 'calm', name: 'Calm', says: 'The same menu fades in. Nothing travels. The change is still seen, and nothing moves across the screen.' },
  { id: 'still', name: 'Still', says: 'The menu is simply there. The state changed; nothing animates.' },
];
const ITEMS = ['Overview', 'Principles', 'Security', 'Timeline'];

/** One menu opening under three motion policies. The site follows the device's
 *  reduced-motion setting, and also offers a calm display setting of its own. */
export default function MotionModes({ tag, title, lede, onward }) {
  const reduced = usePrefersReducedMotion();
  const [run, setRun] = useState(reduced ? 0 : 1);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('motionmodes.rig')}>
        <div className={styles.panels}>
          {MODES.map((m) => (
            <figure key={m.id} className={clsx(styles.panel, reduced && m.id === 'calm' && styles.yours)}>
              <div className={styles.stage} aria-hidden="true">
                <span className={styles.trigger}>Menu</span>
                <ul key={run} className={clsx(styles.menu, run > 0 && styles[m.id])}>
                  {ITEMS.map((it, i) => <li key={it} style={{ '--i': i }}>{it}</li>)}
                </ul>
              </div>
              <figcaption><b>{m.name}</b><span>{m.says}</span>{reduced && m.id === 'calm' && <em>Your device asks for reduced motion: this is closest to what you get here.</em>}</figcaption>
            </figure>
          ))}
        </div>
        <div className={shared.row}>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => setRun((n) => n + 1)} {...fx('motionmodes.play')}><Play size={14} aria-hidden="true" /> {run === 0 ? 'Play all three' : 'Play again'}</button>
          <p className={styles.note}>{reduced ? 'Nothing played by itself, because your device asks for less motion. Press the button to see each.' : 'Your device has not asked for reduced motion, so the first panel plays freely.'}</p>
        </div>
      </div>
    </CloserFrame>
  );
}
