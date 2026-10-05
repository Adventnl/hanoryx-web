import { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { ProgressRing } from '../fx/ProgressRing';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LaunchTimeline.module.css';

/** The two weeks around a launch, as a track you walk along: what to do at each
 *  stop, with the items you can tick and a ring that fills. Arrow keys move
 *  between stops. Nothing is saved. */
export default function LaunchTimeline({ tag, title, lede, stops = [], onward }) {
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const stop = stops[at];
  const total = stops.reduce((n, s) => n + s.items.length, 0);
  const key = (s, i) => `${s.id}:${i}`;
  const toggle = (k) => setDone((d) => { const n = new Set(d); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const go = (d) => setAt((n) => Math.max(0, Math.min(stops.length - 1, n + d)));
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { e.preventDefault(); setAt(0); }
    else if (e.key === 'End') { e.preventDefault(); setAt(stops.length - 1); }
  };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('launch.rig')}>
        <div className={styles.track} role="group" aria-label="Stops, from two weeks before to a week after" onKeyDown={onKey}>
          <span className={styles.line} aria-hidden="true"><i style={{ transform: `scaleX(${stops.length > 1 ? at / (stops.length - 1) : 0})` }} /></span>
          {stops.map((s, i) => {
            const n = s.items.filter((_, j) => done.has(key(s, j))).length;
            return (
              <button key={s.id} type="button" className={clsx(styles.stop, i === at && styles.here, i < at && styles.past, n === s.items.length && styles.full)} aria-current={i === at ? 'step' : undefined} onClick={() => setAt(i)}>
                <span className={styles.node} aria-hidden="true" />
                <b>{s.when}</b>
                <small>{n}/{s.items.length}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.body}>
          <div className={styles.card} aria-live="polite" {...fx('launch.stop')}>
            <p className={shared.label}>{stop.when}</p>
            <h3>{stop.title}</h3>
            <ul>
              {stop.items.map((t, j) => (
                <li key={t}>
                  <label className={clsx(styles.row, done.has(key(stop, j)) && styles.on)}>
                    <input type="checkbox" checked={done.has(key(stop, j))} onChange={() => toggle(key(stop, j))} />
                    <span className={styles.box} aria-hidden="true" />
                    <span>{t}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className={shared.row}>
              <button type="button" className={shared.btn} onClick={() => go(-1)} disabled={at === 0}><ChevronLeft size={14} aria-hidden="true" /> Earlier</button>
              <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => go(1)} disabled={at === stops.length - 1}>Later <ChevronRight size={14} aria-hidden="true" /></button>
            </div>
          </div>
          <div className={styles.ring}>
            <ProgressRing value={total ? done.size / total : 0} size={120} stroke={3.4} label={`${done.size} of ${total} ticked`} {...fx('launch.ring')}>
              <span className={styles.big}>{done.size}<small>/{total}</small></span>
            </ProgressRing>
            <p className={shared.label}>ticked</p>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
