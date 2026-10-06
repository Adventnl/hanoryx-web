import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LifetimeRuler.module.css';

/** A ruler of moments. Slide the marker (or use the arrow keys) and each item
 *  shows whether it is still alive at that moment — so "how long is it kept?"
 *  is answered by watching things go out. */
export default function LifetimeRuler({ tag, title, lede, stops = [], items = [], onward }) {
  const [at, setAt] = useState(0);
  const stop = stops[at];
  const pct = stops.length > 1 ? (at / (stops.length - 1)) * 100 : 0;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.ruler} {...fx('retention.ruler')}>
        <div className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ width: `${pct}%` }} />
          {stops.map((s, i) => (
            <span key={s.id} className={clsx(styles.tick, i <= at && styles.passed)} style={{ left: `${(i / (stops.length - 1)) * 100}%` }} />
          ))}
          <span className={styles.thumb} style={{ left: `${pct}%` }} {...fx('retention.time-marker')} />
        </div>
        <input
          className={styles.input}
          type="range"
          min={0}
          max={stops.length - 1}
          step={1}
          value={at}
          onChange={(event) => setAt(Number(event.target.value))}
          aria-label="Moment in time"
          aria-valuetext={stop?.label}
        />
        <ol className={styles.labels}>
          {stops.map((s, i) => (
            <li key={s.id} style={{ left: `${(i / (stops.length - 1)) * 100}%` }}>
              <button type="button" className={clsx(styles.stopBtn, i === at && styles.here)} onClick={() => setAt(i)} tabIndex={-1}>{s.label}</button>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.note} role="status" aria-live="polite">{stop?.note}</p>
      <ul className={styles.items} {...fx('retention.alive-list')}>
        {items.map((it) => {
          const alive = Boolean(it.lives[at]);
          return (
            <li key={it.id} className={clsx(styles.item, alive && styles.alive)}>
              <span className={styles.pip} aria-hidden="true" />
              <code>{it.label}</code>
              <span className={shared.label}>{alive ? 'Still there' : 'Gone'}</span>
            </li>
          );
        })}
      </ul>
    </CloserFrame>
  );
}
