import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './FrameBudget.module.css';

const MODES = [
  { id: 'transform', label: 'transform', line: 'Moves on the compositor; no layout, no paint.' },
  { id: 'left', label: 'left / top', line: 'Triggers layout for every box on every frame.' },
  { id: 'shadow', label: 'box-shadow', line: 'Repaints every box on every frame.' },
];

/**
 * The frame budget, measured rather than described. Choose how many boxes to
 * animate and which property moves them; press Run and the page really animates
 * them for a couple of seconds while counting the frames it manages. The result
 * is a measurement of YOUR device, right now — and says so.
 */
export default function FrameBudget({ eyebrow, title, intro, note }) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(120);
  const [mode, setMode] = useState('transform');
  const [state, setState] = useState({ phase: 'idle', result: null });
  const stage = useRef(null);
  const raf = useRef(0);
  const cleanup = useRef(() => {});

  useEffect(() => () => { cancelAnimationFrame(raf.current); cleanup.current(); }, []);

  const run = () => {
    if (state.phase === 'running' || reduced) return;
    const host = stage.current;
    if (!host) return;
    setState({ phase: 'running', result: null });
    host.textContent = '';
    const boxes = Array.from({ length: count }, (_, i) => {
      const el = document.createElement('i');
      el.style.cssText = `position:absolute;left:${(i * 37) % 92}%;top:${(i * 53) % 84}%;width:14px;height:14px;background:#ff3333;border-radius:3px;opacity:.8;will-change:${mode === 'transform' ? 'transform' : 'auto'}`;
      host.appendChild(el);
      return el;
    });
    const deltas = [];
    let last = 0;
    const t0 = performance.now();
    const loop = (now) => {
      if (last) deltas.push(now - last);
      last = now;
      const t = (now - t0) / 1000;
      boxes.forEach((el, i) => {
        const dx = Math.sin(t * 2 + i) * 18;
        const dy = Math.cos(t * 2.4 + i) * 12;
        if (mode === 'transform') el.style.transform = `translate(${dx}px, ${dy}px)`;
        else if (mode === 'left') { el.style.marginLeft = `${dx}px`; el.style.marginTop = `${dy}px`; }
        else { el.style.transform = `translate(${dx}px, ${dy}px)`; el.style.boxShadow = `0 0 ${6 + Math.abs(dx)}px rgba(255,51,51,.8)`; }
      });
      if (now - t0 < 2200) raf.current = requestAnimationFrame(loop);
      else {
        host.textContent = '';
        const sorted = [...deltas].sort((a, b) => a - b);
        const avg = deltas.reduce((a, b) => a + b, 0) / Math.max(1, deltas.length);
        setState({ phase: 'done', result: { fps: 1000 / avg, p95: sorted[Math.floor(sorted.length * 0.95)] || avg, frames: deltas.length } });
      }
    };
    cleanup.current = () => { host.textContent = ''; };
    raf.current = requestAnimationFrame(loop);
  };

  const r = state.result;
  const over = r ? r.p95 > 16.7 * 1.5 : false;
  const bar = r ? Math.min(100, (r.p95 / 50) * 100) : 0;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('budget.rig')}>
        <div className={styles.controls}>
          <label className={styles.slider}>
            <span>Boxes to animate <b>{count}</b></span>
            <input type="range" min={20} max={300} step={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </label>
          <div className={styles.modes} role="radiogroup" aria-label="Property animated" {...fx('budget.mode')}>
            {MODES.map((m) => (
              <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={clsx(styles.mode, mode === m.id && styles.on)} onClick={() => setMode(m.id)}>
                <code>{m.label}</code><span>{m.line}</span>
              </button>
            ))}
          </div>
          <button type="button" className={styles.run} onClick={run} disabled={state.phase === 'running' || reduced} {...fx('budget.run')}>
            <Play size={14} aria-hidden="true" /> {reduced ? 'Off: reduced motion is on' : state.phase === 'running' ? 'Measuring…' : 'Run it for real'}
          </button>
        </div>
        <div className={styles.stageWrap}>
          <div ref={stage} className={styles.stage} aria-hidden="true" />
          {state.phase === 'idle' && <p className={styles.idle}>The boxes will appear here, and move.</p>}
        </div>
        <div className={styles.result} role="status" aria-live="polite" {...fx('budget.result')}>
          <p className={styles.k}>Measured on this device</p>
          {r ? (
            <>
              <p className={styles.fps}>{Math.round(r.fps)}<small> fps</small></p>
              <div className={styles.meter} aria-hidden="true">
                <i style={{ width: `${bar}%` }} className={clsx(over && styles.hot)} />
                <span style={{ left: `${(16.7 / 50) * 100}%` }}>16.7 ms</span>
                <span style={{ left: `${(33.3 / 50) * 100}%` }}>33 ms</span>
              </div>
              <p className={styles.line}>Slowest 5% of frames took <b>{r.p95.toFixed(1)} ms</b>. {over ? 'That is over the budget: the animation visibly stutters.' : 'That is inside the budget.'}</p>
            </>
          ) : (
            <p className={styles.line}>{state.phase === 'running' ? 'Counting frames…' : 'Press run. Then change the property and run it again.'}</p>
          )}
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
