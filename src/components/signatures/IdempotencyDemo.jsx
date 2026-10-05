import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RotateCcw, Send } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './IdempotencyDemo.module.css';

/**
 * A payment request whose answer gets lost on the way back. With no
 * idempotency key the client retries and the customer is charged twice; with
 * one, the server recognises the retry and replays its first answer. Press Pay,
 * flip the key on and off, and watch the ledger.
 */
export default function IdempotencyDemo({ eyebrow, title, intro, amount = 20, note }) {
  const reduced = usePrefersReducedMotion();
  const [useKey, setUseKey] = useState(false);
  const [lose, setLose] = useState(true);
  const [ledger, setLedger] = useState([]);
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const timers = useRef([]);
  const keys = useRef(new Map());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const say = (who, text, tone) => setLog((l) => [...l, { id: l.length, who, text, tone }].slice(-9));
  const later = (fn, ms) => { if (reduced) fn(); else timers.current.push(window.setTimeout(fn, ms)); };

  // The server: with a key it remembers the first answer, without one it can't tell.
  const serve = (key) => {
    if (key && keys.current.has(key)) {
      say('server', `Seen ${key} before. Replaying the first answer, charging nothing.`, 'good');
      return keys.current.get(key);
    }
    const id = `ch_${100 + ++seq.current}`;
    setLedger((l) => [...l, { id, amount, dup: l.length > 0 }]);
    if (key) keys.current.set(key, id);
    say('server', `${key ? `New key ${key}. ` : 'No key. '}Charged ${amount} — ${id}.`, key ? 'info' : 'warn');
    return id;
  };

  const pay = () => {
    if (busy) return;
    setBusy(true);
    setLog([]);
    const key = useKey ? `key_${Math.random().toString(16).slice(2, 6)}` : null;
    say('client', `Pay ${amount}${key ? ` with ${key}` : ''}.`, 'info');
    const first = serve(key);
    if (!lose) { later(() => { say('client', `Got ${first}. Done.`, 'good'); setBusy(false); }, 500); return; }
    later(() => say('network', 'The answer is lost on the way back.', 'warn'), 500);
    later(() => say('client', 'No answer… so it asks again, as any client should.', 'info'), 1300);
    later(() => {
      const second = serve(key);
      say('client', `Got ${second}. Done.`, 'good');
      setBusy(false);
    }, 2000);
  };

  const reset = () => { timers.current.forEach(clearTimeout); keys.current = new Map(); setLedger([]); setLog([]); setBusy(false); seq.current = 0; };
  const over = ledger.length > 1;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('idem.rig')}>
        <div className={styles.controls}>
          <div className={styles.toggles}>
            <label className={clsx(styles.switch, useKey && styles.on)} {...fx('idem.key-switch')}>
              <input type="checkbox" checked={useKey} onChange={(e) => { setUseKey(e.target.checked); reset(); }} />
              <span className={styles.knob} aria-hidden="true" />
              <span>Send an idempotency key</span>
            </label>
            <label className={clsx(styles.switch, lose && styles.on)}>
              <input type="checkbox" checked={lose} onChange={(e) => { setLose(e.target.checked); reset(); }} />
              <span className={styles.knob} aria-hidden="true" />
              <span>Lose the first answer</span>
            </label>
          </div>
          <div className={styles.buttons}>
            <button type="button" className={styles.pay} onClick={pay} disabled={busy}><Send size={14} aria-hidden="true" /> Pay {amount}</button>
            <button type="button" className={styles.ghost} onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
          </div>
        </div>

        <div className={styles.cols}>
          <ol className={styles.log} aria-label="What happened" aria-live="polite" {...fx('idem.event-log')}>
            {log.length === 0 && <li className={styles.empty}>Press Pay. One payment is intended.</li>}
            {log.map((l) => (
              <li key={l.id} className={clsx(styles.line, styles[l.tone])}>
                <span className={styles.who}>{l.who}</span>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
          <div className={styles.ledger} {...fx('idem.ledger')}>
            <p className={styles.k}>Ledger — charges that exist</p>
            <ul>
              {ledger.map((c) => (
                <li key={c.id} className={clsx(c.dup && styles.dup)}><code>{c.id}</code><b>{c.amount}</b>{c.dup && <i>duplicate</i>}</li>
              ))}
              {ledger.length === 0 && <li className={styles.none}>No charges yet.</li>}
            </ul>
            <p className={clsx(styles.sum, over && styles.bad)} role="status">
              {ledger.length === 0 ? 'Intended: 1 charge.' : over ? `Intended 1 charge. The customer was charged ${ledger.length} times.` : 'Intended 1 charge. Exactly 1 exists.'}
            </p>
          </div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
