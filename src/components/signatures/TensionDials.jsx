import { useId, useState } from 'react';
import clsx from 'clsx';
import { ProgressRing } from '../fx/ProgressRing';
import { fx } from '../../utils/fx';
import styles from './TensionDials.module.css';

/**
 * Hero object for the principles page. Each principle settles a tension, so
 * here are three of them as sliders. Push one to an extreme and the cost of
 * that extreme is named; hold all three near the middle and the ring closes.
 * It is a toy for an idea — nothing is measured, nothing is stored.
 *
 *   dials: [{ id, left, right, start, states: { low, mid, high } }]
 */
const HELD = 12; // within this many points of the centre counts as held

function stateOf(dial, value) {
  if (value < 50 - HELD) return { key: 'low', text: dial.states.low };
  if (value > 50 + HELD) return { key: 'high', text: dial.states.high };
  return { key: 'mid', text: dial.states.mid };
}

export default function TensionDials({ dials, caption }) {
  const uid = useId();
  const [values, setValues] = useState(() => Object.fromEntries(dials.map((d) => [d.id, d.start])));
  const held = dials.filter((d) => Math.abs(values[d.id] - 50) <= HELD).length;
  const all = held === dials.length;

  return (
    <div className={clsx(styles.panel, all && styles.settled)} {...fx('principles.tension-dials')}>
      <div className={styles.head}>
        <ProgressRing value={held / dials.length} size={64} stroke={3.4} label={`${held} of ${dials.length} tensions held`}>
          <span className={styles.count}>{held}/{dials.length}</span>
        </ProgressRing>
        <p className={styles.status} role="status" aria-live="polite">
          {all ? 'All three held. That is the work.' : 'Hold all three near the middle.'}
        </p>
      </div>

      <div className={styles.dials}>
        {dials.map((d) => {
          const v = values[d.id];
          const st = stateOf(d, v);
          const id = `${uid}-${d.id}`;
          return (
            <div key={d.id} className={styles.dial} data-state={st.key}>
              <div className={styles.labels}>
                <label htmlFor={id} className={clsx(styles.end, v < 50 - HELD && styles.lean)}>{d.left}</label>
                <label htmlFor={id} className={clsx(styles.end, v > 50 + HELD && styles.lean)}>{d.right}</label>
              </div>
              <div className={styles.rail} style={{ '--v': v }}>
                <span className={styles.zone} aria-hidden="true" />
                <span className={styles.fill} aria-hidden="true" />
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={v}
                  onChange={(e) => setValues((prev) => ({ ...prev, [d.id]: Number(e.target.value) }))}
                  aria-valuetext={`${st.key === 'mid' ? 'held' : st.key === 'low' ? `leaning ${d.left}` : `leaning ${d.right}`}`}
                  data-cursor="drag"
                />
                <span className={styles.thumb} aria-hidden="true" />
              </div>
              <p className={styles.text}>{st.text}</p>
            </div>
          );
        })}
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
