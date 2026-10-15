import { useEffect, useRef, useState } from 'react';
import { usePointer } from '../pointerVars';
import c from './cursors.module.css';

/* ============================================================
   33 · CURSORS — pointers, followers and magnets.
   Every specimen is an area that publishes two numbers, --x and --y (0 to 1,
   where the pointer is), and CSS does the rest — a follower is a transition
   with a lag, a trail is the same dot with longer lags, a magnet is a
   translate. Nothing re-renders as the pointer moves. When nobody is pointing,
   a virtual pointer wanders on a slow curve (while the specimen is on screen,
   never under reduced motion) so the effect is always visible; the arrow keys
   move it by hand.
   The still side is the same idea driven by the page: a cursor rides a figure
   of eight, trailing ghosts, as the scroll moves.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visField}>
        {Array.from({ length: 9 }, (_, k) => <i key={k} style={{ '--k': k }} />)}
        <b />
      </div>
      <small>1 CURSOR · 8 GHOSTS</small>
    </div>
  );
}

function Area({ label, className = '', children, auto = true, ...rest }) {
  const [ref, bind] = usePointer(auto);
  return <div ref={ref} className={`${c.area} ${className}`} role="application" aria-label={`${label}. Move the pointer here, or use the arrow keys.`} tabIndex={0} {...bind} {...rest}>{children}</div>;
}

const dots = (n) => Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k }} />);

/* 1 */ function Dot() { return <Area label="Dot cursor"><i className={c.dot} /></Area>; }
/* 2 */ function RingFollow() { return <Area label="Ring follower"><i className={c.ring} /></Area>; }
/* 3 */ function DotRing() { return <Area label="Dot and ring"><i className={c.dot} /><i className={`${c.ring} ${c.slow}`} /></Area>; }
/* 4 */ function Magnet() { return <Area label="Magnet button" className={c.magnetArea}><button type="button" className={c.magnet}>Pull</button></Area>; }
/* 5 */ function Trail() { return <Area label="Trailing dots" className={c.trail}>{dots(8)}</Area>; }
/* 6 */ function Comet() { return <Area label="Comet" className={c.comet}>{dots(6)}</Area>; }
/* 7 */ function Spotlight() { return <Area label="Spotlight" className={c.spot}><span>Hanoryx</span></Area>; }
/* 8 */ function Flashlight() { return <Area label="Flashlight reveal" className={c.flash}><p aria-hidden="true">· · · · · · · · ·</p><p>Everything to see</p></Area>; }
/* 9 */ function Crosshair() { return <Area label="Crosshair" className={c.cross}><i /><i /><b /></Area>; }
/* 10 */ function Readout() { return <Area label="Coordinates" className={c.read}><i className={c.dot} /><output /></Area>; }
/* 11 */ function GridGlow() { return <Area label="Glowing grid" className={c.gridGlow}>{Array.from({ length: 40 }, (_, k) => <i key={k} style={{ '--cx': ((k % 8) + 0.5) / 8, '--cy': (Math.floor(k / 8) + 0.5) / 5 }} />)}</Area>; }
/* 12 */ function TiltPlate() { return <Area label="Tilting plate" className={c.tilt}><section><b>Tilt</b><span>follows the pointer</span></section></Area>; }
/* 13 */ function Depth() { return <Area label="Depth layers" className={c.depth}>{[0, 1, 2].map((k) => <i key={k} style={{ '--k': k }} />)}</Area>; }
/* 14 */ function Eyes() { return <Area label="Eyes" className={c.eyes}><span><i /></span><span><i /></span></Area>; }
/* 15 */ function Needle() { return <Area label="Needle" className={c.needle}><i /><b /></Area>; }
/* 16 */ function Arrow() { return <Area label="Arrow" className={c.arrow}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M5 10l7-7 7 7" /></svg></Area>; }
/* 17 */ function Blob() {
  return (
    <Area label="Gooey blob" className={c.blob}>
      <svg width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="cursors-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" /><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" /></filter></defs></svg>
      <div><i /><i /></div>
    </Area>
  );
}

/* 18 */ function RippleClick() {
  const [rs, setRs] = useState([]);
  const n = useRef(0);
  return (
    <div className={`${c.area} ${c.ripples}`} role="application" aria-label="Click for ripples" tabIndex={0} onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); n.current += 1; const id = n.current; setRs((a) => [...a.slice(-5), { id, x: e.clientX - r.left, y: e.clientY - r.top }]); setTimeout(() => setRs((a) => a.filter((q) => q.id !== id)), 1200); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); n.current += 1; const id = n.current; setRs((a) => [...a.slice(-5), { id, x: 100, y: 50 }]); setTimeout(() => setRs((a) => a.filter((q) => q.id !== id)), 1200); } }}>
      <span>Click anywhere</span>{rs.map((q) => <i key={q.id} style={{ left: q.x, top: q.y }} />)}
    </div>
  );
}

/* 19 */ function Paint() {
  const [ds, setDs] = useState([]);
  const [down, setDown] = useState(false);
  const add = (e) => { const r = e.currentTarget.getBoundingClientRect(); setDs((a) => [...a.slice(-60), { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, h: (a.length * 9) % 360 }]); };
  return (
    <div className={`${c.area} ${c.paint}`} role="application" aria-label="Paint with dots; drag, then clear" tabIndex={0} onPointerDown={(e) => { setDown(true); add(e); }} onPointerMove={(e) => { if (down) add(e); }} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)} onKeyDown={(e) => { if (e.key === 'Backspace') setDs([]); }}>
      {ds.map((d, i) => <i key={i} style={{ left: `${d.x}%`, top: `${d.y}%`, '--h': d.h }} />)}
      <button type="button" onClick={() => setDs([])}>Clear</button>
    </div>
  );
}

/* 20 */ function Caret() { return <Area label="Named caret" className={c.caret}><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 2v14l4-3 3 6 2-1-3-6h5z" /></svg><b>You</b></Area>; }

/* 21 */ function Crowd() {
  return (
    <Area label="Shared cursors" className={c.crowd}>
      {[['Ada', 0], ['Lin', 1], ['Mo', 2]].map(([n, k]) => <span key={n} style={{ '--k': k }}><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 2v14l4-3 3 6 2-1-3-6h5z" /></svg><b>{n}</b></span>)}
      <span className={c.me}><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 2v14l4-3 3 6 2-1-3-6h5z" /></svg><b>You</b></span>
    </Area>
  );
}

/* 22 */ function Gallery() {
  const names = ['pointer', 'crosshair', 'help', 'zoom-in', 'not-allowed', 'grab', 'text', 'move'];
  const [k, setK] = useState(-1);
  return (
    <div className={c.gallery} onPointerLeave={() => setK(-1)}>
      {names.map((n, i) => <button key={n} type="button" style={{ cursor: n }} onPointerEnter={() => setK(i)} onFocus={() => setK(i)}>{n}</button>)}
      <output>{k < 0 ? 'Hover a tile' : `cursor: ${names[k]}`}</output>
    </div>
  );
}

/* 23 */ function ViewLabel() { return <Area label="View label" className={c.viewLabel}><i><b>View</b></i></Area>; }

/* 24 */ function Repel() { return <Area label="Repelling dots" className={c.repel}>{Array.from({ length: 35 }, (_, k) => <i key={k} style={{ '--cx': (k % 7) / 6, '--cy': Math.floor(k / 7) / 4 }} />)}</Area>; }
/* 25 */ function Attract() { return <Area label="Attracted dots" className={c.attract}>{Array.from({ length: 20 }, (_, k) => <i key={k} style={{ '--k': k, '--cx': ((k * 37) % 100) / 100, '--cy': ((k * 61) % 100) / 100 }} />)}</Area>; }
/* 26 */ function Strings() { return <Area label="Strings" className={c.strings}>{[0, 1, 2, 3].map((k) => <i key={k} style={{ '--k': k }} />)}<b /></Area>; }
/* 27 */ function Elastic() { return <Area label="Elastic string" className={c.elastic}><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 50 30 100 30" /></svg><b /></Area>; }
/* 28 */ function Bulge() { return <Area label="Bulge" className={c.bulge}><i /></Area>; }
/* 29 */ function Halo() { return <Area label="Difference halo" className={c.halo}><h4>HALO</h4><i /></Area>; }
/* 30 */ function Gear() { return <Area label="Gear that turns with the pointer" className={c.gear}><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="9" /><path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4 4M28 28l4 4M32 8l-4 4M12 28l-4 4" /></svg></Area>; }
/* 31 */ function BorderLight() { return <Area label="Border light" className={c.borderLight}><section><b>Edge light</b></section></Area>; }
/* 32 */ function BtnGradient() { return <Area label="Button gradient" className={c.btnGrad}><button type="button">Hover me</button></Area>; }
/* 33 */ function Underline() { return <Area label="Sliding underline" className={c.underline}><nav>{['Work', 'Lab', 'Mail', 'About'].map((t) => <span key={t}>{t}</span>)}<i /></nav></Area>; }

/* 34 */ function Speed() {
  const ref = useRef(null);
  const last = useRef([0, 0, 0]);
  const decay = useRef(0);
  useEffect(() => () => clearTimeout(decay.current), []);
  const put = (v) => ref.current?.style.setProperty('--s', v.toFixed(3));
  return (
    <div ref={ref} className={`${c.area} ${c.speed}`} role="application" aria-label="Speed meter. Move the pointer here." tabIndex={0} onPointerMove={(e) => { const t = performance.now(); const [px, py, pt] = last.current; put(Math.min(1, Math.hypot(e.clientX - px, e.clientY - py) / Math.max(1, t - pt) / 3)); last.current = [e.clientX, e.clientY, t]; clearTimeout(decay.current); decay.current = setTimeout(() => put(0), 140); }} onPointerLeave={() => put(0)}>
      <i /><span>speed</span>
    </div>
  );
}

/* 35 */ function AngleDial() { return <Area label="Angle dial" className={c.angle}><i />{Array.from({ length: 12 }, (_, k) => <u key={k} style={{ '--k': k }} />)}</Area>; }

/* 36 */ function Stamps() {
  const [st, setSt] = useState([]);
  const glyphs = ['✦', '★', '✿', '◆'];
  return (
    <div className={`${c.area} ${c.stamps}`} role="application" aria-label="Click to stamp" tabIndex={0} onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); setSt((a) => [...a.slice(-8), { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, g: glyphs[a.length % 4], r: (a.length * 37) % 40 - 20 }]); }} onKeyDown={(e) => { if (e.key === 'Enter') setSt((a) => [...a.slice(-8), { x: 20 + ((a.length * 23) % 60), y: 30 + ((a.length * 17) % 40), g: glyphs[a.length % 4], r: 0 }]); }}>
      <span>Click to stamp</span>{st.map((s, i) => <b key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, '--r': `${s.r}deg` }}>{s.g}</b>)}
    </div>
  );
}

/* 37 */ function Zones() { return <Area label="Zones" className={c.zones}>{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], k) => <i key={k} style={{ '--sx': a, '--sy': b }} />)}</Area>; }

/* 38 */ function Target() {
  const [t, setT] = useState([30, 40]);
  const [hits, setHits] = useState(0);
  return (
    <div className={`${c.area} ${c.target}`} role="group" aria-label="Target practice">
      <button type="button" style={{ left: `${t[0]}%`, top: `${t[1]}%` }} aria-label="Target" onClick={() => { setHits((h) => h + 1); setT([14 + ((hits * 37 + 23) % 72), 18 + ((hits * 53 + 11) % 64)]); }}><i /></button>
      <output>{hits} hits</output>
    </div>
  );
}

/* 39 */ function SineFollow() { return <Area label="Wave follows the pointer" className={c.sine}><svg viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30C15 0 25 0 40 30S65 60 80 30 105 0 120 30" /></svg></Area>; }
/* 40 */ function Orbiters() { return <Area label="Orbiters" className={c.orbiters}><b />{[0, 1, 2].map((k) => <i key={k} style={{ '--k': k }} />)}</Area>; }
/* 41 */ function Smear() { return <Area label="Smear" className={c.smear}>{dots(12)}</Area>; }
/* 42 */ function Mirror() { return <Area label="Mirrored cursors" className={c.mirror}><i /><i /><i /><i /></Area>; }

export default {
  Visual,
  items: [
    ['Dot cursor', Dot, 'hover'], ['Ring follower', RingFollow, 'hover'], ['Dot and ring', DotRing, 'hover'], ['Pulled button', Magnet, 'hover'],
    ['Trailing dots', Trail, 'hover'], ['Comet tail', Comet, 'hover'], ['Spotlight', Spotlight, 'hover'], ['Flashlight reveal', Flashlight, 'hover'],
    ['Crosshair', Crosshair, 'hover'], ['Coordinate follower', Readout, 'hover'], ['Glowing grid', GridGlow, 'hover'], ['Tilting plate', TiltPlate, 'hover'],
    ['Pointer layers', Depth, 'hover'], ['Watching eyes', Eyes, 'hover'], ['Needle', Needle, 'hover'], ['Arrow', Arrow, 'hover'],
    ['Gooey blob', Blob, 'hover'], ['Click ripples', RippleClick, 'click'], ['Dot painter', Paint, 'drag'], ['Named caret', Caret, 'hover'],
    ['Shared cursors', Crowd, 'hover'], ['Cursor styles', Gallery, 'hover'], ['View label', ViewLabel, 'hover'], ['Repelling dots', Repel, 'hover'],
    ['Attracted dots', Attract, 'hover'], ['Strings', Strings, 'hover'], ['Elastic string', Elastic, 'hover'], ['Bulge', Bulge, 'hover'],
    ['Difference halo', Halo, 'hover'], ['Turning gear', Gear, 'hover'], ['Pointer edge', BorderLight, 'hover'], ['Button gradient', BtnGradient, 'hover'],
    ['Sliding underline', Underline, 'hover'], ['Speed meter', Speed, 'hover'], ['Angle dial', AngleDial, 'hover'], ['Stamps', Stamps, 'click'],
    ['Zones', Zones, 'hover'], ['Target practice', Target, 'click'], ['Following wave', SineFollow, 'hover'], ['Orbiters', Orbiters, 'hover'],
    ['Smear', Smear, 'hover'], ['Mirror cursors', Mirror, 'hover'],
  ],
};
