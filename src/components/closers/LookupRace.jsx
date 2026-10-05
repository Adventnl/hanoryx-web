import { useState } from 'react';
import { Timer } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './LookupRace.module.css';

/* The real thing, on this machine: build a sorted list of half a million numbers and
   an index over it, then find a few hundred of them three ways, timing each. */
function measure() {
  const N = 500000;
  const data = new Int32Array(N);
  for (let i = 0; i < N; i += 1) data[i] = i * 3;
  const index = new Map();
  for (let i = 0; i < N; i += 1) index.set(data[i], i);
  const targets = Array.from({ length: 200 }, () => data[Math.floor(Math.random() * N)]);

  const time = (fn) => { const t0 = performance.now(); let hits = 0; for (const t of targets) hits += fn(t); return { ms: performance.now() - t0, hits }; };
  const scan = time((t) => { for (let i = 0; i < N; i += 1) if (data[i] === t) return 1; return 0; });
  const binary = time((t) => { let lo = 0; let hi = N - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (data[m] === t) return 1; if (data[m] < t) lo = m + 1; else hi = m - 1; } return 0; });
  const hash = time((t) => (index.has(t) ? 1 : 0));
  return { N, per: (r) => (r.ms / targets.length) * 1000, scan, binary, hash };
}

const fmt = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million` : n >= 1e3 ? `${(n / 1e3).toFixed(0)},000` : String(n));
const steps = (n) => ({ scan: Math.round(n / 2), binary: Math.ceil(Math.log2(n)), hash: 1 });

/** Finding one row among millions. Three ways, with the number of steps each takes
 *  as the table grows, and then the real thing: the page builds half a million
 *  rows in your browser and times each method for you. */
export default function LookupRace({ tag, title, lede, onward }) {
  const [exp, setExp] = useState(7);
  const [run, setRun] = useState(null);
  const [busy, setBusy] = useState(false);
  const n = 10 ** exp;
  const s = steps(n);
  const max = Math.log10(s.scan + 1);
  const bar = (v) => `${Math.max(2, (Math.log10(v + 1) / max) * 100)}%`;

  const go = () => {
    setBusy(true);
    window.setTimeout(() => { setRun(measure()); setBusy(false); }, 60);
  };

  const rows = [
    { id: 'scan', name: 'Look at every row', how: 'Start at the top and check each one.', n: s.scan, note: 'On average, half the table.' },
    { id: 'binary', name: 'Keep the rows in order', how: 'Check the middle; keep the half that could hold it; repeat.', n: s.binary, note: 'Doubling the table adds one step.' },
    { id: 'hash', name: 'Keep an index', how: 'Compute where it is stored and go straight there.', n: s.hash, note: 'The same however big the table is.' },
  ];

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('lookup.rig')}>
        <div className={styles.race}>
          <label className={tool.field}><span>Rows in the table <b>{fmt(n)}</b></span><input type="range" min={3} max={9} value={exp} onChange={(e) => setExp(Number(e.target.value))} /></label>
          <ul>
            {rows.map((r) => (
              <li key={r.id}>
                <div className={styles.head}><b>{r.name}</b><span>{r.n.toLocaleString()} {r.n === 1 ? 'step' : 'steps'}</span></div>
                <span className={styles.bar} aria-hidden="true"><i className={styles[r.id]} style={{ width: bar(r.n) }} /></span>
                <p>{r.how} <em>{r.note}</em></p>
              </li>
            ))}
          </ul>
          <p className={styles.fine}>The bars are on a logarithmic scale: each tick is ten times the last. Without it the third would be invisible.</p>
        </div>
        <div className={styles.real}>
          <p className={shared.label}>Now for real, on this machine</p>
          <p className={styles.sm}>Builds a sorted list of half a million numbers and an index over it, then finds 200 of them each way. It takes a moment.</p>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={go} disabled={busy}><Timer size={14} aria-hidden="true" /> {busy ? 'Measuring…' : run ? 'Measure again' : 'Measure'}</button>
          {run && (
            <dl aria-live="polite">
              <div><dt>Look at every row</dt><dd>{run.per(run.scan).toFixed(1)} µs</dd></div>
              <div><dt>Rows in order</dt><dd>{run.per(run.binary).toFixed(2)} µs</dd></div>
              <div><dt>An index</dt><dd>{run.per(run.hash).toFixed(2)} µs</dd></div>
            </dl>
          )}
          {run && <p className={styles.fine}>Average time to find one of half a million rows, on your device, just now. It varies from run to run.</p>}
        </div>
      </div>
    </CloserFrame>
  );
}
