import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Send } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './GateRun.module.css';

/** A request walks the gates one at a time and stops at the first that says no.
 *  Pick a scenario, send it, and watch where it is turned back — and which
 *  question it failed. The gates are the page's own four review areas. */
export default function GateRun({ tag, title, lede, gates = [], scenarios = [], onward }) {
  const reduced = usePrefersReducedMotion();
  const [sid, setSid] = useState(scenarios[0]?.id);
  const [step, setStep] = useState(-1); // -1 idle; n = number of gates passed so far
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const sc = scenarios.find((s) => s.id === sid) || scenarios[0];
  const failAt = sc.passes.findIndex((p) => !p);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = () => {
    timers.current.forEach(clearTimeout);
    setDone(false);
    const stop = failAt === -1 ? gates.length : failAt;
    if (reduced) { setStep(stop); setDone(true); return; }
    setStep(0);
    for (let i = 1; i <= stop; i += 1) timers.current.push(window.setTimeout(() => setStep(i), i * 700));
    timers.current.push(window.setTimeout(() => setDone(true), stop * 700 + 500));
  };
  const pick = (id) => { timers.current.forEach(clearTimeout); setSid(id); setStep(-1); setDone(false); };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('gaterun.rig')}>
        <div className={styles.scenarios} role="radiogroup" aria-label="Request">
          {scenarios.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={s.id === sid} className={clsx(styles.sc, s.id === sid && styles.on)} onClick={() => pick(s.id)}>{s.label}</button>
          ))}
        </div>

        <div className={styles.track} style={{ '--n': gates.length, '--at': Math.max(0, step) }}>
          <span className={styles.line} aria-hidden="true" />
          <span className={clsx(styles.token, step < 0 && styles.idle, done && failAt !== -1 && styles.stopped)} aria-hidden="true" {...fx('gaterun.token')} />
          {gates.map((g, i) => {
            const passed = step > i || (done && failAt === -1);
            const failed = done && failAt === i;
            return (
              <div key={g.id} className={clsx(styles.gate, passed && styles.pass, failed && styles.fail)} {...fx('gaterun.gate')}>
                <span className={styles.bar} aria-hidden="true" />
                <b>{g.label}</b>
                <i>{g.ask}</i>
              </div>
            );
          })}
        </div>

        <div className={styles.out}>
          <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={send}><Send size={14} aria-hidden="true" /> Send the request</button>
          <p role="status" aria-live="polite" className={styles.verdict}>
            {!done ? (step < 0 ? sc.note : 'Checking…') : failAt === -1 ? <><b>Allowed.</b> Every gate said yes.</> : <><b>Denied at {gates[failAt].label}.</b> {sc.why || gates[failAt].ask}</>}
          </p>
        </div>
      </div>
    </CloserFrame>
  );
}
