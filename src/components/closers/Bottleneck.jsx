import { useState } from 'react';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './Bottleneck.module.css';

const START = [
  { id: 'intake', name: 'Intake', people: 2, minutes: 4 },
  { id: 'review', name: 'Review', people: 1, minutes: 9 },
  { id: 'prepare', name: 'Prepare', people: 3, minutes: 12 },
  { id: 'dispatch', name: 'Dispatch', people: 1, minutes: 5 },
  { id: 'confirm', name: 'Confirm', people: 1, minutes: 3 },
];
const HOURS = 8;
const cap = (s) => (s.people * 60) / s.minutes;

/** An operation moves at the pace of its slowest step. Five steps, each with
 *  people and minutes per item: the slowest is marked, and adding a person
 *  anywhere else changes nothing. An invented operation, to show the shape. */
export default function Bottleneck({ tag, title, lede, onward }) {
  const [stages, setStages] = useState(START);
  const [note, setNote] = useState(null);
  const caps = stages.map(cap);
  const through = Math.min(...caps);
  const slow = caps.indexOf(through);
  const max = Math.max(...caps);

  const add = (i, d) => {
    const next = stages.map((s, j) => (j === i ? { ...s, people: Math.max(1, Math.min(9, s.people + d)) } : s));
    const after = Math.min(...next.map(cap));
    setStages(next);
    if (d > 0) setNote(after > through + 0.001 ? `${next[i].name} was the slowest step. Throughput rose from ${through.toFixed(1)} to ${after.toFixed(1)} an hour.` : `That changed nothing: ${stages[slow].name} is still the slowest step, at ${through.toFixed(1)} an hour.`);
    else setNote(null);
  };
  const setMinutes = (i, m) => setStages((s) => s.map((x, j) => (j === i ? { ...x, minutes: m } : x)));

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('bottleneck.rig')}>
        <ol className={styles.line}>
          {stages.map((s, i) => (
            <li key={s.id} className={clsx(styles.stage, i === slow && styles.slow)}>
              <div className={styles.head}><b>{s.name}</b>{i === slow && <em>slowest</em>}</div>
              <span className={styles.pipe} aria-hidden="true"><i style={{ height: `${Math.max(8, (caps[i] / max) * 100)}%` }} /></span>
              <p className={styles.cap}><b>{caps[i].toFixed(1)}</b> an hour</p>
              <div className={styles.people}>
                <button type="button" onClick={() => add(i, -1)} aria-label={`One fewer person at ${s.name}`}><Minus size={13} aria-hidden="true" /></button>
                <span aria-live="polite">{s.people} {s.people === 1 ? 'person' : 'people'}</span>
                <button type="button" onClick={() => add(i, 1)} aria-label={`One more person at ${s.name}`}><Plus size={13} aria-hidden="true" /></button>
              </div>
              <label className={styles.min}>
                <span>{s.minutes} min each</span>
                <input type="range" min={1} max={20} value={s.minutes} onChange={(e) => setMinutes(i, Number(e.target.value))} aria-label={`Minutes per item at ${s.name}`} />
              </label>
            </li>
          ))}
        </ol>
        <div className={styles.result} role="status" aria-live="polite">
          <p className={styles.big}><b>{through.toFixed(1)}</b> items an hour</p>
          <p className={styles.sm}>About <b>{Math.floor(through * HOURS)}</b> in a {HOURS}-hour day, set by <b>{stages[slow].name.toLowerCase()}</b>.</p>
          {note && <p className={styles.note}>{note}</p>}
        </div>
      </div>
    </CloserFrame>
  );
}
