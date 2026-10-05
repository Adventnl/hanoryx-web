import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Check, Dices } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ChaosWheel.module.css';

const R = 92;
const arc = (i, n) => {
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
  const p = (a) => `${(100 + Math.cos(a) * R).toFixed(2)} ${(100 + Math.sin(a) * R).toFixed(2)}`;
  return `M100 100 L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`;
};

/** Break it on purpose. Spin for a way things go wrong, read what should happen
 *  and how to rehearse it, and mark the ones you have tried. A wheel because the
 *  failure you rehearse is usually the one you thought of; this picks another. */
export default function ChaosWheel({ tag, title, lede, scenarios = [], onward }) {
  const reduced = usePrefersReducedMotion();
  const n = scenarios.length;
  const [at, setAt] = useState(null);
  const [rot, setRot] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const busy = useRef(false);

  const spin = () => {
    if (busy.current || !n) return;
    let next = Math.floor(Math.random() * n);
    if (next === at && n > 1) next = (next + 1) % n;
    const centre = (next + 0.5) * (360 / n);
    const base = Math.ceil(rot / 360) * 360 + (reduced ? 0 : 360 * 3);
    setRot(base - centre + 360);
    setAt(next);
    if (!reduced) { busy.current = true; window.setTimeout(() => { busy.current = false; }, 1700); }
  };
  const s = at == null ? null : scenarios[at];
  const toggle = (id) => setDone((d) => { const x = new Set(d); if (x.has(id)) x.delete(id); else x.add(id); return x; });

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('chaos.rig')}>
        <div className={styles.wheelWrap}>
          <span className={styles.pointer} aria-hidden="true" />
          <svg className={styles.wheel} viewBox="0 0 200 200" style={{ transform: `rotate(${rot}deg)`, transitionDuration: reduced ? '0s' : '1.6s' }} aria-hidden="true">
            {scenarios.map((sc, i) => (
              <g key={sc.id}>
                <path d={arc(i, n)} className={clsx(styles.seg, i % 2 && styles.alt, done.has(sc.id) && styles.did)} />
                <text x="100" y="22" className={styles.num} transform={`rotate(${(i + 0.5) * (360 / n)} 100 100)`}>{i + 1}</text>
              </g>
            ))}
            <circle cx="100" cy="100" r="9" className={styles.hub} />
          </svg>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={spin}><Dices size={14} aria-hidden="true" /> Spin</button>
          <p className={styles.tally}>{done.size} of {n} rehearsed</p>
        </div>

        <div className={clsx(styles.card, s && styles.ready)} role="status" aria-live="polite" {...fx('chaos.card')}>
          {s ? (
            <>
              <p className={shared.label}>Failure {scenarios.indexOf(s) + 1} of {n}</p>
              <h3>{s.name}</h3>
              <dl>
                <div><dt>What happens</dt><dd>{s.happens}</dd></div>
                <div><dt>What should happen</dt><dd>{s.should}</dd></div>
                <div><dt>How to rehearse it</dt><dd>{s.test}</dd></div>
              </dl>
              <button type="button" className={clsx(shared.btn, done.has(s.id) && shared.btnOn)} aria-pressed={done.has(s.id)} onClick={() => toggle(s.id)}><Check size={14} aria-hidden="true" /> {done.has(s.id) ? 'Rehearsed' : 'Mark as rehearsed'}</button>
            </>
          ) : (
            <p className={styles.wait}>Spin the wheel for a failure to rehearse.</p>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
