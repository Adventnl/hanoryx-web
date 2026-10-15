import { useEffect, useId, useRef, useState } from 'react';
import { rng, useCycle, useDrag, useTick } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { usePointer } from '../pointerVars';
import { Ico } from '../icons';
import c from './morphs.module.css';

/* ============================================================
   45 · MORPHS — shapes that become other shapes.
   The still side is one shape that is a circle at the top of the page, a star in
   the middle and a square at the end, with every point of its outline sliding
   between them as the scroll advances. The forty-two specimens change shape
   too: by sliding the points of a clipped outline (the same trick), by CSS
   radii and transforms, by tweening the numbers of an SVG, or by melting
   together through a blur-and-threshold filter. Each one changes when you click,
   hover or slide it, or by itself while on screen.
   ============================================================ */

/* ---- outlines: 32 points sampled around the centre, so any two can be blended ---- */
const N = 32;
const TAU = Math.PI * 2;
const radial = (fn) => Array.from({ length: N }, (_, i) => { const a = (i / N) * TAU - Math.PI / 2; const r = fn(a); return [50 + Math.cos(a) * r * 50, 50 + Math.sin(a) * r * 50]; });
const ngonR = (n, rot = -Math.PI / 2) => (a) => { const s = TAU / n; const d = ((((a - rot) % s) + s) % s) - s / 2; return Math.cos(Math.PI / n) / Math.cos(d); };
const starR = (p, ri) => (a) => {
  const phi = Math.PI / p;
  let t = ((((a + Math.PI / 2) % (2 * phi)) + 2 * phi) % (2 * phi));
  if (t > phi) t = 2 * phi - t;
  const x2 = ri * Math.cos(phi); const y2 = ri * Math.sin(phi);
  const dx = x2 - 1; const dy = y2;
  return y2 / (Math.cos(t) * dy - Math.sin(t) * dx);
};
const squareR = (a) => 1 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
const plusR = (w, rot = 0) => (a) => { const cc = Math.abs(Math.cos(a + rot)); const ss = Math.abs(Math.sin(a + rot)); return Math.min(1.2, Math.max(Math.min(1 / (cc || 1e-6), w / (ss || 1e-6)), Math.min(w / (cc || 1e-6), 1 / (ss || 1e-6)))); };
const gearR = (k) => (a) => 0.72 + 0.26 * Math.max(-1, Math.min(1, Math.sin((a + Math.PI / 2) * k) * 2.4));
const flowerR = (k) => (a) => 0.58 + 0.42 * Math.abs(Math.cos((k * (a + Math.PI / 2)) / 2));
const blobR = (seed) => { const r = rng(seed); const p = [r() * TAU, r() * TAU, r() * TAU]; return (a) => 0.74 + 0.14 * Math.sin(2 * a + p[0]) + 0.08 * Math.sin(3 * a + p[1]) + 0.06 * Math.sin(5 * a + p[2]); };
/* an outline given as a parametric curve is re-read as a radius per angle */
const curveR = (pts) => {
  const q = pts.map(([x, y]) => ({ a: Math.atan2(y, x), r: Math.hypot(x, y) }));
  const mx = Math.max(...q.map((p) => p.r));
  return (a) => { const th = Math.atan2(Math.sin(a), Math.cos(a)); let best = q[0]; let d0 = 9; q.forEach((p) => { const d = Math.abs(Math.atan2(Math.sin(p.a - th), Math.cos(p.a - th))); if (d < d0) { d0 = d; best = p; } }); return best.r / mx; };
};
const HEART = curveR(Array.from({ length: 360 }, (_, i) => { const t = (i / 360) * TAU; return [16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; }));
const DROP = curveR(Array.from({ length: 360 }, (_, i) => { const t = (i / 360) * TAU; return [Math.sin(t) * Math.sin(t / 2), -Math.cos(t) + 0.1]; }));

const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(',')})`;
const S = {
  circle: radial(() => 1), square: radial(squareR), diamond: radial(ngonR(4)), tri: radial(ngonR(3)), pent: radial(ngonR(5)), hex: radial(ngonR(6)), oct: radial(ngonR(8)), dodec: radial(ngonR(12)),
  star5: radial(starR(5, 0.42)), star8: radial(starR(8, 0.55)), star12: radial(starR(12, 0.66)), star4: radial(starR(4, 0.3)),
  plus: radial(plusR(0.3)), cross: radial(plusR(0.3, Math.PI / 4)), heart: radial(HEART), drop: radial(DROP),
  gear6: radial(gearR(6)), gear9: radial(gearR(9)), gear14: radial(gearR(14)), flower3: radial(flowerR(3)), flower5: radial(flowerR(5)), flower8: radial(flowerR(8)),
  blob1: radial(blobR(3)), blob2: radial(blobR(8)), blob3: radial(blobR(14)), blob4: radial(blobR(21)),
};

/* the still side: circle, then star, then square, blended by the scroll */
function Visual() {
  const pts = S.circle.map(([x, y], i) => [x, y, S.star8[i][0], S.star8[i][1], S.square[i][0], S.square[i][1]]);
  const at = (a, b, d) => `calc(${a.toFixed(1)}% + ${(b - a).toFixed(1)}% * var(--t1) + ${(d - b).toFixed(1)}% * var(--t2))`;
  const clip = `polygon(${pts.map(([x0, y0, x1, y1, x2, y2]) => `${at(x0, x1, x2)} ${at(y0, y1, y2)}`).join(',')})`;
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visShape} style={{ clipPath: clip }} />
      <small>32 POINTS · 3 OUTLINES</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');

/* ---- shapes that cycle through clipped outlines ---- */
function Shifter({ title, list, auto = false, ms = 1500, hue = 0 }) {
  const [i, setI] = useState(0);
  const t = useCycle(list.length, ms);
  const idx = auto ? t : i;
  return (
    <button type="button" className={c.shifter} onClick={() => setI((v) => (v + 1) % list.length)} aria-label={`${title}: ${list[idx][0]}${auto ? '' : '. Click for the next shape'}`}>
      <i style={{ clipPath: poly(list[idx][1]), '--h': hue + idx * 40 }} />
      <small>{list[idx][0]}</small>
    </button>
  );
}
const NAME = { tri: 'triangle', pent: 'pentagon', hex: 'hexagon', oct: 'octagon', dodec: 'dodecagon', star4: '4 points', star5: '5 points', star8: '8 points', star12: '12 points', gear6: '6 teeth', gear9: '9 teeth', gear14: '14 teeth', flower3: '3 petals', flower5: '5 petals', flower8: '8 petals', blob1: 'blob', blob2: 'blob', blob3: 'blob', blob4: 'blob' };
const L = (...names) => names.map((n) => [NAME[n] ?? n, S[n]]);
const mkShift = (title, names, opts) => function Shift() { return <Shifter title={title} list={L(...names)} {...opts} />; };

/* ---- numbers that tween, for outlines drawn in SVG ---- */
function useTween(target, ms = 600) {
  const reduced = usePrefersReducedMotion();
  const [cur, setCur] = useState(target);
  const live = useRef(target);
  useEffect(() => {
    const from = live.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - (1 - k) ** 3;
      const v = target.map((x, i) => from[i] + (x - from[i]) * e);
      live.current = v;
      setCur(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return reduced ? target : cur;
}

/* ---- the specimens ---- */
const SPEC = [];
const add = (name, Comp, mode) => SPEC.push([name, Comp, mode]);

add('Round to square', mkShift('Round to square', ['circle', 'square', 'circle']), 'click');
add('Side ladder', mkShift('Side ladder', ['tri', 'diamond', 'pent', 'hex', 'oct', 'dodec', 'circle'], { auto: true, ms: 1100 }), 'auto');
add('Point count', mkShift('Star burst', ['star4', 'star5', 'star8', 'star12']), 'click');
add('Gear teeth', mkShift('Gear teeth', ['gear6', 'gear9', 'gear14', 'circle']), 'click');
add('Petal count', mkShift('Petal count', ['flower3', 'flower5', 'flower8'], { auto: true, ms: 1400 }), 'auto');
add('Wobble blob', mkShift('Wobble blob', ['blob1', 'blob2', 'blob3', 'blob4'], { auto: true, ms: 1700 }), 'auto');
add('Heart beat', mkShift('Heart beat', ['heart', 'circle', 'drop']), 'click');
add('Cross turn', mkShift('Cross turn', ['plus', 'cross', 'star4', 'plus']), 'click');
add('Diamond cut', mkShift('Diamond cut', ['diamond', 'square', 'oct', 'circle']), 'click');
add('Flat and flower', mkShift('Flat and flower', ['hex', 'flower8', 'star12', 'gear9'], { auto: true, ms: 1600 }), 'auto');

/* 11 */ function Squircle() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.35 });
  return (
    <div className={c.stage}>
      <i className={c.sq} style={{ borderRadius: `${v * 50}%` }} />
      <div className={c.rail} {...bind} aria-label="Corner radius"><u style={{ left: `${v * 100}%` }} /></div>
    </div>
  );
}
add('Corner slider', Squircle, 'drag');

add('Blob radius', function BlobRadius() { return <div className={c.stage} role="img" aria-label="A blob whose corners keep changing"><i className={c.blobR} /></div>; }, 'auto');

/* 13 */ function Pill() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.pill} data-on={on} aria-pressed={on} aria-label="Pill. Click to make it a circle" onClick={() => setOn((v) => !v)}><span>pill</span></button></div>;
}
add('Pill to disc', Pill, 'click');

/* 14 */ function Burger() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.burger} data-on={on} aria-pressed={on} aria-label="Menu button. Click to turn it into a cross" onClick={() => setOn((v) => !v)}><i /><i /><i /></button></div>;
}
add('Menu to cross', Burger, 'click');

/* 15 */ function PlayPause() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.playp} data-on={on} aria-pressed={on} aria-label={on ? 'Pause' : 'Play'} onClick={() => setOn((v) => !v)}><i /><i /></button></div>;
}
add('Play and pause', PlayPause, 'click');

/* 16 */ function PlusMinus() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.pm} data-on={on} aria-pressed={on} aria-label={on ? 'Minus' : 'Plus'} onClick={() => setOn((v) => !v)}><i /><i /></button></div>;
}
add('Plus to minus', PlusMinus, 'click');

/* 17 */ function Caret() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.caret} data-on={on} aria-expanded={on} aria-label="Caret. Click to flip it" onClick={() => setOn((v) => !v)}><Ico n="down" /></button></div>;
}
add('Caret flip', Caret, 'click');

/* 18 */ function SunMoon() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.sun} data-on={on} aria-pressed={on} aria-label={on ? 'Moon' : 'Sun'} onClick={() => setOn((v) => !v)}><i /><b /></button></div>;
}
add('Sun to moon', SunMoon, 'click');

/* 19 */ function Eye() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.eye} data-on={on} aria-pressed={on} aria-label={on ? 'Eye closed' : 'Eye open'} onClick={() => setOn((v) => !v)}><i /><b /></button></div>;
}
add('Eye and lid', Eye, 'click');

const CHECK = [4, 12, 9, 17, 9, 17, 20, 6];
const CROSS = [6, 6, 18, 18, 18, 6, 6, 18];
/* 20 */ function CheckCross() {
  const [on, setOn] = useState(false);
  const v = useTween(on ? CROSS : CHECK, 500);
  return (
    <div className={c.stage}>
      <button type="button" className={c.cc} aria-pressed={on} aria-label={on ? 'Cross' : 'Check mark'} onClick={() => setOn((x) => !x)}>
        <svg viewBox="0 0 24 24"><line x1={v[0]} y1={v[1]} x2={v[2]} y2={v[3]} /><line x1={v[4]} y1={v[5]} x2={v[6]} y2={v[7]} /></svg>
      </button>
    </div>
  );
}
add('Check to cross', CheckCross, 'click');

const SINE = Array.from({ length: 24 }, (_, i) => 32 + Math.sin((i / 23) * TAU * 1.5) * 22);
const SQUARE = Array.from({ length: 24 }, (_, i) => 32 + (Math.sin((i / 23) * TAU * 1.5) > 0 ? -22 : 22));
const FLAT = Array.from({ length: 24 }, () => 32);
const SAW = Array.from({ length: 24 }, (_, i) => 54 - ((i * 1.5) % 22) * 2);
const WAVES = [['sine', SINE], ['square', SQUARE], ['flat', FLAT], ['saw', SAW]];
/* 21 */ function WaveTween() {
  const [i, setI] = useState(0);
  const y = useTween(WAVES[i][1], 650);
  const d = y.map((v, k) => `${k ? 'L' : 'M'}${6 + (k / 23) * 98} ${v.toFixed(1)}`).join('');
  return (
    <button type="button" className={c.svgBtn} onClick={() => setI((v) => (v + 1) % 4)} aria-label={`Wave outline: ${WAVES[i][0]}. Click for the next one`}>
      <svg viewBox="0 0 110 64"><path d={d} /></svg><small>{WAVES[i][0]}</small>
    </button>
  );
}
add('Wave to flat', WaveTween, 'click');

const DATA = [[0.4, 0.7, 0.5, 0.9, 0.6, 0.3, 0.8], [0.9, 0.5, 0.8, 0.3, 0.7, 0.6, 0.4], [0.3, 0.3, 0.9, 0.9, 0.3, 0.9, 0.5]];
/* 22 */ function DataShuffle() {
  const [i, setI] = useState(0);
  const v = useTween(DATA[i], 600);
  return (
    <button type="button" className={c.svgBtn} onClick={() => setI((x) => (x + 1) % 3)} aria-label="Bars and line. Click to shuffle the data">
      <svg viewBox="0 0 110 64">
        {v.map((h, k) => <rect key={k} x={8 + k * 14} y={58 - h * 48} width="9" height={h * 48} rx="1.5" className={c.bar} />)}
        <path d={v.map((h, k) => `${k ? 'L' : 'M'}${12.5 + k * 14} ${58 - h * 48}`).join('')} className={c.ln} />
      </svg>
    </button>
  );
}
add('Data shuffle', DataShuffle, 'click');

const TW = [['hexagon', S.hex], ['5 points', S.star5], ['heart', S.heart], ['9 teeth', S.gear9]];
/* 23 */ function TweenShapes() {
  const [i, setI] = useState(0);
  const flat = TW[i][1].flat();
  const v = useTween(flat, 700);
  const pts = v.reduce((a, x, k) => (k % 2 ? a : [...a, `${x.toFixed(1)},${v[k + 1].toFixed(1)}`]), []).join(' ');
  return (
    <button type="button" className={c.svgBtn} onClick={() => setI((x) => (x + 1) % TW.length)} aria-label={`Tweened outline: ${TW[i][0]}. Click for the next one`}>
      <svg viewBox="0 0 100 100" className={c.sq100}><polygon points={pts} className={c.fill} /></svg><small>{TW[i][0]}</small>
    </button>
  );
}
add('Point tween', TweenShapes, 'click');

/* ---- gooey: blur then threshold, so circles melt into each other ---- */
const Goo = ({ id, std = 6 }) => (
  <svg width="0" height="0" aria-hidden="true" className={c.defs}><filter id={id}><feGaussianBlur in="SourceGraphic" stdDeviation={std} result="b" /><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" /></filter></svg>
);

/* 24 */ function Metaballs() {
  const [ref, bind] = usePointer();
  const id = `g${useId().replace(/\W/g, '')}`;
  return (
    <div ref={ref} {...bind} className={cx(c.stage, c.meta)} tabIndex={0} role="img" aria-label="Two blobs that melt together as one follows the pointer">
      <Goo id={id} />
      <div style={{ filter: `url(#${id})` }}><i className={c.mA} /><i className={c.mB} /><i className={c.mC} /></div>
    </div>
  );
}
add('Metaballs', Metaballs, 'hover');

/* 25 */ function GooMenu() {
  const [on, setOn] = useState(false);
  const id = `g${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.stage}>
      <Goo id={id} std={5} />
      <div className={c.gooMenu} data-on={on} style={{ filter: `url(#${id})` }}>
        {['search', 'heart', 'bell', 'user'].map((n, k) => <i key={n} style={{ '--k': k }} />)}
        <button type="button" className={c.gooHub} aria-expanded={on} aria-label="Menu" onClick={() => setOn((v) => !v)} />
      </div>
      <div className={c.gooIcons} data-on={on} aria-hidden="true">
        <em className={c.hubIco}><Ico n="plus" /></em>{['search', 'heart', 'bell', 'user'].map((n, k) => <span key={n} style={{ '--k': k }}><Ico n={n} /></span>)}</div>
    </div>
  );
}
add('Goo menu', GooMenu, 'click');

/* 26 */ function GooDrops() {
  const id = `g${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.stage} role="img" aria-label="Drops falling into a pool and merging">
      <Goo id={id} std={5} />
      <div className={c.drops} style={{ filter: `url(#${id})` }}><i style={{ '--d': '0s' }} /><i style={{ '--d': '0.9s' }} /><i style={{ '--d': '1.8s' }} /><b /></div>
    </div>
  );
}
add('Goo drops', GooDrops, 'auto');

/* 27 */ function InkSplit() {
  const [on, setOn] = useState(false);
  const id = `g${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.stage}>
      <Goo id={id} std={6} />
      <button type="button" className={c.split} data-on={on} aria-pressed={on} aria-label="Ink drop. Click to split it" onClick={() => setOn((v) => !v)} style={{ filter: `url(#${id})` }}><i /><i /></button>
    </div>
  );
}
add('Ink split', InkSplit, 'click');

/* 28 */ function CardAvatar() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <button type="button" className={c.avatar} data-on={on} aria-pressed={on} aria-label="Profile card. Click to shrink it to an avatar" onClick={() => setOn((v) => !v)}>
        <b>A</b><span><em>Ada Okafor</em><small>Systems</small></span>
      </button>
    </div>
  );
}
add('Card to avatar', CardAvatar, 'click');

/* 29 */ function Loader() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <button type="button" className={c.loadBtn} data-on={on} aria-busy={on} aria-label={on ? 'Saving' : 'Save'} onClick={() => setOn((v) => !v)}><span>Save</span><i /></button>
    </div>
  );
}
add('Button to loader', Loader, 'click');

/* 30 */ function SearchGrow() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <div className={c.searchG} data-on={on}>
        <button type="button" aria-expanded={on} aria-label={on ? 'Close search' : 'Open search'} onClick={() => setOn((v) => !v)}><Ico n={on ? 'close' : 'search'} /></button>
        <input aria-label="Search" placeholder="Search…" tabIndex={on ? 0 : -1} />
      </div>
    </div>
  );
}
add('Search grow', SearchGrow, 'click');

/* 31 */ function Fab() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <div className={c.fab} data-on={on}>
        <button type="button" aria-expanded={on} aria-label={on ? 'Close actions' : 'Open actions'} onClick={() => setOn((v) => !v)}><Ico n="plus" /></button>
        <ul>{['Note', 'Photo', 'Link'].map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </div>
  );
}
add('Button to panel', Fab, 'click');

/* 32 */ function Squash() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" role="switch" aria-checked={on} className={c.squash} data-on={on} aria-label="Switch" onClick={() => setOn((v) => !v)}><i /></button></div>;
}
add('Squash switch', Squash, 'click');

/* 33 */ function DrawCheck() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <button type="button" role="checkbox" aria-checked={on} className={c.box} data-on={on} aria-label="Checkbox" onClick={() => setOn((v) => !v)}>
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" pathLength="1" /></svg>
      </button>
    </div>
  );
}
add('Check draw', DrawCheck, 'click');

/* 34 */ function Dots() {
  const [on, setOn] = useState(false);
  return <div className={c.stage}><button type="button" className={c.dots} data-on={on} aria-pressed={on} aria-label="Three dots. Click to join them into a bar" onClick={() => setOn((v) => !v)}><i /><i /><i /></button></div>;
}
add('Dots to bar', Dots, 'click');

/* 35 */ function StackGrid() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <button type="button" className={c.stack} data-on={on} aria-pressed={on} aria-label="Tiles. Click to spread them into a grid" onClick={() => setOn((v) => !v)}>
        {Array.from({ length: 6 }, (_, k) => <i key={k} style={{ '--k': k }} />)}
      </button>
    </div>
  );
}
add('Stack to grid', StackGrid, 'click');

/* 36 */ function ListCards() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.stage}>
      <button type="button" className={c.lc} data-on={on} aria-pressed={on} aria-label="Layout. Click to switch between a list and cards" onClick={() => setOn((v) => !v)}>
        {[0, 1, 2].map((k) => <i key={k}><b /><u /></i>)}
      </button>
    </div>
  );
}
add('List to cards', ListCards, 'click');

const WORDS = ['stone', 'water', 'cloud', 'flame'];
/* 37 */ function WordSwap() {
  const i = useCycle(4, 1500);
  return <div className={c.stage} role="img" aria-label="A word that turns into other words"><b key={i} className={c.word}>{WORDS[i]}</b></div>;
}
add('Noun blur', WordSwap, 'auto');

/* 38 */ function PointerBlob() {
  const [ref, bind] = usePointer();
  return <div ref={ref} {...bind} className={cx(c.stage, c.pblob)} tabIndex={0} role="img" aria-label="A shape that leans toward the pointer"><i /></div>;
}
add('Pointer lean', PointerBlob, 'hover');

const POP = ['circle', 'star5', 'heart', 'hex', 'flower5'];
/* 39 */ function Pop() {
  const [i, setI] = useState(0);
  return (
    <div className={c.stage}>
      <button type="button" className={c.popBtn} onClick={() => setI((v) => (v + 1) % POP.length)} aria-label={`Shape ${POP[i]}. Click for the next one`}>
        <i key={i} style={{ clipPath: poly(S[POP[i]]), '--h': i * 70 }} />
      </button>
    </div>
  );
}
add('Pop shapes', Pop, 'click');

/* 40 */ function Iris() {
  const [on, setOn] = useState(true);
  return <div className={c.stage}><button type="button" className={c.iris} data-on={on} aria-pressed={on} aria-label="Picture. Click to close the iris" onClick={() => setOn((v) => !v)}><i /></button></div>;
}
add('Iris cut', Iris, 'click');

/* 41 */ function RoundPulse() {
  return <div className={c.stage} role="img" aria-label="A shape that breathes between square and circle"><i className={c.breath} /></div>;
}
add('Breathing shape', RoundPulse, 'auto');

/* 42 */ function Tide() {
  const n = useTick(1600);
  const sides = [3, 4, 5, 6][n % 4];
  return (
    <div className={c.stage} role="img" aria-label={`A ${sides}-sided shape that gains a side each moment`}>
      <i className={c.nside} style={{ clipPath: poly(radial(ngonR(sides))) }} />
      <small className={c.cap}>{sides} sides</small>
    </div>
  );
}
add('Side counter', Tide, 'auto');

export default { Visual, items: SPEC };
