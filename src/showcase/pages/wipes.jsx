import { useEffect, useRef, useState } from 'react';
import { useDrag, useLive } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import c from './wipes.module.css';

/* ============================================================
   34 · WIPES — curtains, clips and reveals.
   A wipe is a rule for how panel B replaces panel A, so nearly every specimen
   is the same two panels and a different rule. Press one to run it; until
   someone does, each runs itself now and then while it is on screen (never under
   reduced motion). The still side is one wipe, scrubbed by the scroll: a clip
   edge sweeps across a pair of panels from first to last.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visBox}>
        <section><b>A</b><span>Before</span></section>
        <section><b>B</b><span>After</span><i /></section>
      </div>
      <small>2 PANELS · 1 EDGE</small>
    </div>
  );
}

/* a toggle that flips itself while on screen until it has been pressed */
function useWipe(every = 2600) {
  const [b, setB] = useState(false);
  const touched = useRef(false);
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!live || reduced) return undefined;
    const first = setTimeout(() => { if (!touched.current) setB((v) => !v); }, 700);
    const id = setInterval(() => { if (!touched.current) setB((v) => !v); }, every);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [live, reduced, every]);
  return [b, () => { touched.current = true; setB((v) => !v); }];
}

/* one wipe: kind picks the rule (see the stylesheet), name labels it for assistive technology */
function Wipe({ kind, name }) {
  const [b, flip] = useWipe();
  return (
    <button type="button" className={`${c.wipe} ${c[kind]}`} data-b={b} aria-pressed={b} aria-label={`${name}. Press to run it again`} onClick={flip}>
      <span className={c.a}><b>A</b></span>
      <span className={c.b}><b>B</b></span>
    </button>
  );
}

const make = (kind, name) => function Specimen() { return <Wipe kind={kind} name={name} />; };

const KINDS = [
  ['Left to right', 'lr'], ['Right to left', 'rl'], ['Top down', 'td'], ['Bottom up', 'bu'],
  ['Diagonal edge', 'diag'], ['Iris open', 'iris'], ['Corner iris', 'corner'], ['Iris close', 'close'],
  ['Diamond', 'diamond'], ['Star burst', 'star'], ['Row blinds', 'blindsH'], ['Column blinds', 'blindsV'],
  ['Pixel checker', 'checker'], ['Theatre curtain', 'curtain'], ['Shutter doors', 'shutter'], ['Barn doors', 'barn'],
  ['Slat turn', 'slats'], ['Clock sweep', 'clock'], ['Radial wipe', 'radial'], ['Fan wipe', 'fan'],
  ['Zigzag edge', 'zigzag'], ['Wave edge', 'wave'], ['Ink spread', 'ink'], ['Push', 'push'],
  ['Cover', 'cover'], ['Uncover', 'uncover'], ['Zoom cut', 'zoom'], ['Cube turn', 'cube'],
  ['Turn over', 'flipw'], ['Hinge fold', 'fold'], ['Page peel', 'peel'], ['Crossfade', 'fade'],
  ['Blur dissolve', 'blur'], ['Glitch cut', 'glitch'], ['Scan line', 'scan'], ['Stepped pixels', 'pixel'],
  ['Column stagger', 'colStagger'], ['Row stagger', 'rowStagger'],
];

const wipes = KINDS.map(([name, kind]) => [name, make(kind, name), 'click']);

/* the four that answer to more than a press */

/* 39 */ function DragWipe() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={`${c.wipe} ${c.dragw}`} style={{ '--v': v }}>
      <span className={c.a}><b>A</b></span>
      <span className={c.b}><b>B</b></span>
      <i {...bind} aria-label="Drag to wipe" aria-valuetext={`${Math.round(v * 100)} percent`} style={bind.style} />
    </div>
  );
}

/* 40 */ function Scrub() {
  const [v, setV] = useState(0.35);
  return (
    <div className={c.scrub}>
      <div className={`${c.wipe} ${c.scrubw}`} style={{ '--v': v }}><span className={c.a}><b>A</b></span><span className={c.b}><b>B</b></span></div>
      <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Scrub the wipe" />
    </div>
  );
}

/* 41 */ function TextMask() {
  const [b, flip] = useWipe(3200);
  return (
    <button type="button" className={`${c.wipe} ${c.textMask}`} data-b={b} aria-pressed={b} aria-label="Text mask. Press to run it again" onClick={flip}>
      <span className={c.a}><b>A</b></span>
      <span className={c.t} aria-hidden="true">REVEAL</span>
    </button>
  );
}

/* 42 */ function ClickReveal() {
  const [p, setP] = useState(null);
  return (
    <div className={`${c.wipe} ${c.spot}`} data-on={Boolean(p)} style={p ? { '--cx': `${p[0]}px`, '--cy': `${p[1]}px` } : undefined} role="application" aria-label="Click to open a circle of B from that point; press Enter for the middle" tabIndex={0}
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP((q) => (q ? null : [e.clientX - r.left, e.clientY - r.top])); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setP((q) => (q ? null : [100, 60])); } }}>
      <span className={c.a}><b>A</b></span>
      <span className={c.b}><b>B</b></span>
    </div>
  );
}

export default {
  Visual,
  items: [...wipes, ['Drag to wipe', DragWipe, 'drag'], ['Scrubbed wipe', Scrub, 'drag'], ['Text mask', TextMask, 'click'], ['Click reveal', ClickReveal, 'click']],
};
