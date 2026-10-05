import { useState } from 'react';
import CloserFrame from './CloserFrame';
import { Alert, RangeField, Switch, ToastProvider, useToast } from '../kit';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ToastBench.module.css';

/* The part that needs the provider above it. */
function Bench({ presets, alerts }) {
  const toast = useToast();
  const [seconds, setSeconds] = useState(5);
  const [sticky, setSticky] = useState(false);
  const [log, setLog] = useState([]);
  const [shown, setShown] = useState(() => new Set());

  const note = (how, text) => setLog((l) => [{ how, text, n: (l[0]?.n || 0) + 1 }, ...l].slice(0, 8));
  const fire = (p) => {
    toast({ title: p.title, body: p.body, tone: p.tone, duration: sticky ? 0 : seconds * 1000 });
    note('polite', `${p.title}. ${p.body}`);
  };
  const flip = (a) => setShown((s) => {
    const n = new Set(s);
    if (n.has(a.id)) { n.delete(a.id); return n; }
    n.add(a.id);
    note(a.tone === 'danger' || a.tone === 'warning' ? 'assertive' : 'polite', `${a.title}. ${a.body}`);
    return n;
  });

  return (
    <div className={styles.rig} {...fx('toastbench.rig')}>
      <div className={styles.col}>
        <p className={shared.label}>Toasts: nothing to answer</p>
        <div className={styles.presets}>
          {presets.map((p) => <button key={p.id} type="button" className={shared.btn} onClick={() => fire(p)}>{p.label}</button>)}
        </div>
        <RangeField label="Stays for" min={2} max={12} value={seconds} onChange={setSeconds} format={(n) => `${n} s`} hint="Under five seconds is too quick for many people to read." disabled={sticky} />
        <Switch label="Stay until dismissed" checked={sticky} onChange={setSticky} />
        <p className={shared.label}>Alerts: something to look at</p>
        <div className={styles.presets}>
          {alerts.map((a) => <button key={a.id} type="button" className={`${shared.btn} ${shown.has(a.id) ? shared.btnOn : ''}`} aria-pressed={shown.has(a.id)} onClick={() => flip(a)}>{a.label}</button>)}
        </div>
        <div className={styles.col}>
          {alerts.filter((a) => shown.has(a.id)).map((a) => <Alert key={a.id} tone={a.tone} title={a.title} onDismiss={() => flip(a)}>{a.body}</Alert>)}
        </div>
      </div>
      <div className={styles.col}>
        <p className={shared.label}>What is announced, and how</p>
        <ol className={styles.log} aria-label="Announcements" {...fx('toastbench.log')}>
          {log.map((line) => (
            <li key={line.n}><span className={styles.tag} data-how={line.how}>{line.how}</span><span>{line.text}</span></li>
          ))}
          {!log.length && <li className={styles.empty}>Fire a toast or show an alert and the words a screen reader would say appear here.</li>}
        </ol>
        <p className={styles.fine}>Polite messages wait for the reader to finish what they are saying; assertive ones interrupt. Errors and warnings interrupt; confirmations wait. A toast pauses while it is hovered or focused.</p>
      </div>
    </div>
  );
}

/** Fire the feedback components and watch what each one would announce. */
export default function ToastBench({ tag, title, lede, presets = [], alerts = [], onward }) {
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ToastProvider>
        <Bench presets={presets} alerts={alerts} />
      </ToastProvider>
    </CloserFrame>
  );
}
