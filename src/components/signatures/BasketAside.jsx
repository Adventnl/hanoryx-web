import { useState } from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { TiltSurface } from '../fx/TiltSurface';
import { Odometer } from '../fx/Odometer';
import styles from './BasketAside.module.css';

const TILES = [0, 1, 2, 3, 4, 5];

/** Hero object for the customer-product page: six abstract tiles. Tap one to
 *  "add" it — it lifts, takes a tick, and the basket count rolls up. A tiny
 *  taste of the experience; the tiles are shapes, not products. */
export default function BasketAside({ caption }) {
  const [picked, setPicked] = useState(() => new Set([1]));
  const toggle = (i) => setPicked((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <TiltSurface tilt={6} className={styles.wrap}>
      <div className={styles.shell}>
        <div className={styles.bar}>
          <span className={styles.search} />
          <span className={styles.basket} aria-label={`${picked.size} in the basket`}>
            <span className={styles.basketIcon} aria-hidden="true" />
            <Odometer value={picked.size} />
          </span>
        </div>
        <div className={styles.grid} role="group" aria-label="Abstract tiles — tap to add">
          {TILES.map((i) => (
            <button
              key={i}
              type="button"
              className={clsx(styles.tile, picked.has(i) && styles.on)}
              style={{ '--i': i }}
              aria-pressed={picked.has(i)}
              aria-label={`Tile ${i + 1}`}
              onClick={() => toggle(i)}
            >
              <span className={styles.art} />
              <span className={styles.lines}><i /><i /></span>
              <span className={styles.tick}><Check size={12} strokeWidth={2.4} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>
      {caption && <span className={styles.caption}>{caption}</span>}
    </TiltSurface>
  );
}
