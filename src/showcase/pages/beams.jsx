import { useState } from 'react';
import { rng, useDrag } from '../hooks';
import { usePointer } from '../pointerVars';
import c from './beams.module.css';

/* ============================================================
   41 · BEAMS — lines and traces of light.
   The still side is a circuit trace that runs the length of the page: a pulse
   of light travels along it as the scroll advances and the pads it passes light
   up behind it. The forty-two specimens are swatches of light on a dark ground:
   traces, tubes, rays and sweeps. The ones that would be moving are, while on
   screen (never under reduced motion); the rest answer to the pointer, a drag
   or a click, and all of them can be reached from the keyboard.
   ============================================================ */

function Visual() {
  const pads = [18, 40, 62, 84];
  return (
    <div className={c.vis} aria-hidden="true">
      <svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMid meet">
        <path d="M30 2V14L14 22V40L30 50V64L46 72V98" className={c.visBase} />
        <path d="M30 2V14L14 22V40L30 50V64L46 72V98" pathLength="100" className={c.visLit} />
        {pads.map((y, k) => <circle key={y} cx={[14, 30, 46, 46][k]} cy={y} r="3" className={c.visPad} style={{ '--at': (k + 1) / 5 }} />)}
      </svg>
      <small>1 TRACE · 4 PADS</small>
    </div>
  );
}

const Sv = ({ children, label, extra, ...p }) => <div className={c.sw} role="img" aria-label={label} {...p}><svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">{children}</svg>{extra}</div>;
const Lit = ({ d, dur = 2.4, delay = 0, len = 14, color, w }) => (
  <>
    <path d={d} className={c.base} />
    <path d={d} pathLength="100" className={c.lit} style={{ '--len': len, animationDuration: `${dur}s`, animationDelay: `${delay}s`, stroke: color, strokeWidth: w }} />
  </>
);

/* 01 */ const Pulse = () => <Sv label="A trace with a pulse of light running along it"><Lit d="M6 50H30L42 38H70L82 18H104" dur={2.6} len={18} /></Sv>;

/* 02 */ const Bus = () => <Sv label="Four traces carrying pulses">{[14, 26, 38, 50].map((y, k) => <Lit key={y} d={`M6 ${y}H40L48 ${y - 6 + k * 2}H104`} dur={2.2 + k * 0.3} delay={k * 0.4} len={12} />)}</Sv>;

/* 03 */ const Pads = () => (
  <Sv label="A trace ending in three pads that light up">
    <Lit d="M6 32H44" dur={2.4} len={16} />
    {[12, 32, 52].map((y, k) => <g key={y}><Lit d={`M44 32L60 ${y}H92`} dur={2.4} delay={0.4} len={16} /><circle cx="98" cy={y} r="4" className={c.pad} style={{ animationDelay: `${0.9 + k * 0.1}s` }} /></g>)}
  </Sv>
);

/* 04 */ const Branch = () => <Sv label="A trace splitting in two"><Lit d="M6 32H40" len={16} /><Lit d="M40 32L56 14H104" delay={0.5} len={14} /><Lit d="M40 32L56 50H104" delay={0.5} len={14} dur={2.8} /></Sv>;

/* 05 */ const Via = () => (
  <Sv label="A trace hopping between layers through vias">
    <Lit d="M6 18H40" len={16} /><circle cx="44" cy="18" r="3.4" className={c.via} />
    <Lit d="M44 18V46H70" delay={0.5} len={16} /><circle cx="74" cy="46" r="3.4" className={c.via} />
    <Lit d="M74 46V18H104" delay={1.1} len={16} />
  </Sv>
);

/* 06 */ const Strands = () => (
  <Sv label="Glowing fibre strands that sway">
    {[0, 1, 2, 3, 4].map((k) => <path key={k} className={c.strand} style={{ animationDelay: `${-k * 0.7}s`, stroke: `hsl(${190 + k * 22}, 90%, 65%)` }} d={`M0 ${14 + k * 9}C30 ${4 + k * 9} 60 ${30 + k * 6} 110 ${14 + k * 9}`} />)}
  </Sv>
);

/* 07 */ function Neon() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" className={c.sw} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Neon tube. Click to switch it off">
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true"><path className={c.neon} data-on={on} d="M22 14V50M44 14V50M22 32H44M62 14L90 50M90 14L62 50" /></svg>
    </button>
  );
}

/* 08 */ const Pipe = () => <div className={c.sw} role="img" aria-label="A light pipe with a highlight moving through it"><i className={c.pipe} /></div>;

/* 09 */ const Grid = () => <div className={c.sw} role="img" aria-label="A laser grid sweeping"><i className={c.lgrid} /></div>;

/* 10 */ function Tripwire() {
  const [cut, setCut] = useState(false);
  return (
    <button type="button" className={c.sw} aria-pressed={cut} onClick={() => setCut((v) => !v)} aria-label="Tripwire laser. Click to break the beam">
      <i className={c.wire} data-cut={cut} /><b className={c.emit} style={{ left: '4%' }} /><b className={c.emit} style={{ right: '4%' }} />
      <span className={c.alarm} data-cut={cut}>{cut ? 'BROKEN' : 'CLEAR'}</span>
    </button>
  );
}

/* 11 */ const Radar = () => <div className={c.sw} role="img" aria-label="A radar sweep"><i className={c.radar} /></div>;

/* 12 */ const Scan = () => <div className={c.sw} role="img" aria-label="A scan line passing over lines"><i className={c.hatch} /><b className={c.scanbar} /></div>;

/* 13 */ const Rays = () => <div className={c.sw} role="img" aria-label="Sun rays turning"><i className={c.rays} /></div>;

/* 14 */ function Search() {
  const [ref, bind] = usePointer();
  return <div ref={ref} {...bind} className={cx(c.sw, c.cone)} tabIndex={0} role="img" aria-label="A search light that follows the pointer or the arrow keys"><i /><b /></div>;
}

/* 15 */ function Spot() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  return (
    <div className={c.sw}>
      <i className={c.spot} style={{ '--ang': `${(v - 0.5) * 90}deg` }} /><b className={c.lamp} />
      <div className={c.rail} {...bind} aria-label="Lamp angle"><u style={{ left: `${v * 100}%` }} /></div>
    </div>
  );
}

/* 16 */ const Border = () => <div className={cx(c.sw, c.border)} role="img" aria-label="A card with a light running round its border"><b>HX</b></div>;

/* 17 */ const Shine = () => <button type="button" className={cx(c.sw, c.shine)} aria-label="A button with a shine that crosses it"><span>Continue</span></button>;

/* 18 */ const Leak = () => <div className={c.sw} role="img" aria-label="Soft light leaks drifting"><i className={c.leak} /><i className={c.leak} /><i className={c.leak} /></div>;

/* 19 */ const Aurora = () => <Sv label="Ribbons of aurora">{[0, 1, 2].map((k) => <path key={k} className={c.aurora} style={{ animationDelay: `${-k * 1.6}s`, stroke: ['#6ee7b7', '#60a5fa', '#c084fc'][k], strokeWidth: 9 - k * 2 }} d={`M-5 ${34 + k * 4}C25 ${6 + k * 8} 55 ${58 - k * 6} 115 ${26 + k * 6}`} />)}</Sv>;

/* 20 */ const Stars = () => <div className={c.sw} role="img" aria-label="Shooting stars"><i className={c.shoot} style={{ '--y': '16%', '--d': '2.6s' }} /><i className={c.shoot} style={{ '--y': '44%', '--d': '3.4s', animationDelay: '0.9s' }} /><i className={c.shoot} style={{ '--y': '70%', '--d': '2.9s', animationDelay: '1.6s' }} /></div>;

/* 21 */ const Comet = () => <Sv label="A comet with a tail on a loop"><ellipse cx="55" cy="32" rx="40" ry="20" className={c.base} /><ellipse cx="55" cy="32" rx="40" ry="20" pathLength="100" className={c.comet} /></Sv>;

/* 22 */ const Orbits = () => <Sv label="Orbit paths with dots"><g className={c.orb}>{[14, 24, 34].map((r, k) => <g key={r} style={{ animationDuration: `${6 + k * 3}s` }} className={c.spinG}><ellipse cx="55" cy="32" rx={r * 1.6} ry={r * 0.9} className={c.base} /><circle cx={55 + r * 1.6} cy="32" r="2.2" className={c.dot} /></g>)}</g></Sv>;

/* 23 */ function Lissajous() {
  const d = Array.from({ length: 121 }, (_, i) => { const t = (i / 120) * Math.PI * 2; return `${i ? 'L' : 'M'}${(55 + Math.sin(3 * t + 1) * 44).toFixed(1)} ${(32 + Math.sin(2 * t) * 24).toFixed(1)}`; }).join('');
  return <Sv label="A Lissajous figure being drawn"><path d={d} className={c.base} /><path d={d} pathLength="100" className={c.lit} style={{ '--len': 30, animationDuration: '4s', strokeWidth: 1.6 }} /></Sv>;
}

/* 24 */ const SinePair = () => <Sv label="Two sine beams">{[0, 1].map((k) => <path key={k} className={c.sine} style={{ stroke: k ? '#60a5fa' : '#ff4d4d', animationDelay: `${-k * 1.1}s` }} d="M-10 32q15-30 30 0t30 0t30 0t30 0" />)}</Sv>;

/* 25 */ const Beat = () => <Sv label="A heartbeat trace"><Lit d="M0 36H30L36 36L40 16L46 54L51 30L55 36H75L81 36L85 22L90 46L94 36H110" dur={2.6} len={30} w={1.6} /></Sv>;

/* 26 */ function Plexus() {
  const [ref, bind] = usePointer();
  const pts = Array.from({ length: 12 }, (_, i) => [rng(i + 5)() * 100 + 5, rng(i + 40)() * 54 + 5]);
  const links = [];
  pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 30) links.push([a, b, `${i}-${j}`]); }));
  return (
    <div ref={ref} {...bind} className={cx(c.sw, c.plex)} tabIndex={0} role="img" aria-label="A network of points that glows near the pointer">
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">
        {links.map(([a, b, k]) => <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={c.link} />)}
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" className={c.node} />)}
      </svg>
      <i />
    </div>
  );
}

/* 27 */ const Ribbon = () => <Sv label="A ribbon of light"><defs><linearGradient id="bmrib" x1="0" x2="1"><stop offset="0" stopColor="#ff4d4d" stopOpacity="0" /><stop offset="0.5" stopColor="#ff9a4d" /><stop offset="1" stopColor="#ffe08a" stopOpacity="0" /></linearGradient></defs><path className={c.rib} d="M0 50C30 6 50 62 110 14" stroke="url(#bmrib)" /></Sv>;

/* 28 */ function Spiral() {
  const d = Array.from({ length: 140 }, (_, i) => { const t = i / 8; const r = 1.4 * t; return `${i ? 'L' : 'M'}${(55 + Math.cos(t) * r * 1.7).toFixed(1)} ${(32 + Math.sin(t) * r * 1.2).toFixed(1)}`; }).join('');
  return <Sv label="A spiral drawing itself"><path d={d} className={c.base} /><path d={d} pathLength="100" className={c.lit} style={{ '--len': 26, animationDuration: '3.6s', strokeWidth: 1.5 }} /></Sv>;
}

/* 29 */ function Prism() {
  return (
    <button type="button" className={cx(c.sw, c.prism)} aria-label="A prism that splits white light; hover or focus to widen it">
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">
        <path d="M0 34H40" className={c.white} />
        <path d="M40 22L54 46H26Z" className={c.glass} transform="translate(8 -2)" />
        {['#ff4d4d', '#ff9a4d', '#ffe14d', '#6ee7b7', '#60a5fa', '#c084fc'].map((col, k) => <path key={col} d="M56 34L110 34" stroke={col} className={c.fan} style={{ '--k': k - 2.5 }} />)}
      </svg>
    </button>
  );
}

/* 30 */ function Streak() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.sw} onClick={() => setN((v) => v + 1)} aria-label="Lens streak. Click to flash it"><i key={n} className={c.streak} data-go={n > 0} /><b className={c.flare} /></button>;
}

/* 31 */ const Runway = () => <div className={c.sw} role="img" aria-label="Runway lights running toward you"><div className={c.run}>{Array.from({ length: 8 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div></div>;

/* 32 */ const Rails = () => <div className={c.sw} role="img" aria-label="Two rails with ticks sliding"><i className={c.rails} /></div>;

/* 33 */ const Trails = () => <Sv label="Long-exposure light trails">{[0, 1, 2, 3].map((k) => <path key={k} className={c.trail} style={{ animationDelay: `${-k * 0.9}s`, stroke: k % 2 ? '#ff4d4d' : '#ffe08a' }} d={`M-6 ${52 - k * 8}C30 ${50 - k * 14} 60 ${26 - k * 3} 116 ${6 + k * 6}`} />)}</Sv>;

/* 34 */ function Harp() {
  const [on, setOn] = useState([0, 2, 3]);
  const flip = (i) => setOn((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <div className={cx(c.sw, c.harp)} role="group" aria-label="Laser harp">
      {[0, 1, 2, 3, 4].map((i) => <button key={i} type="button" aria-pressed={on.includes(i)} aria-label={`String ${i + 1}`} onClick={() => flip(i)} style={{ '--h': 130 + i * 38 }}><i /></button>)}
    </div>
  );
}

/* 35 */ function Splitter() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" className={c.sw} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Beam splitter. Click to turn the mirror">
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">
        <path d="M0 32H55" className={c.white} />
        <path d="M55 32H110" className={c.white} style={{ opacity: on ? 0.6 : 1 }} />
        <path d="M55 32V0" className={c.white} style={{ opacity: on ? 1 : 0 }} />
        <rect x="49" y="26" width="12" height="12" className={c.glass} transform={`rotate(${on ? 45 : 0} 55 32)`} style={{ transition: 'transform 0.4s' }} />
      </svg>
    </button>
  );
}

/* 36 */ function Bounce() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.4 });
  const a = (v - 0.5) * 70 * (Math.PI / 180);
  const rx = -Math.cos(2 * a);
  const ry = Math.sin(2 * a);
  const L = 60;
  return (
    <div className={c.sw}>
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">
        <path d="M0 30H70" className={c.white} />
        <path d={`M70 30L${(70 + rx * L).toFixed(1)} ${(30 + ry * L).toFixed(1)}`} className={c.white} style={{ stroke: '#ff9a4d' }} />
        <rect x="68" y="16" width="3" height="28" className={c.mirror} transform={`rotate(${(a * 180) / Math.PI} 70 30)`} />
      </svg>
      <div className={c.rail} {...bind} aria-label="Mirror angle"><u style={{ left: `${v * 100}%` }} /></div>
    </div>
  );
}

/* 37 */ const Bundle = () => <Sv label="A bundle of fibres converging">{Array.from({ length: 11 }, (_, k) => <path key={k} className={c.strand} style={{ animationDelay: `${-k * 0.3}s`, stroke: `hsl(${200 + k * 12}, 90%, 66%)`, animationDuration: '3.6s' }} d={`M0 ${6 + k * 5}C40 ${6 + k * 5} 50 32 110 32`} />)}</Sv>;

/* 38 */ function Strobe() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.sw} onClick={() => setN((v) => v + 1)} aria-label="Strobe bars. Click to fire them">
      <div className={c.bars} key={n} data-go={n > 0}>{Array.from({ length: 9 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
    </button>
  );
}

/* 39 */ const Caustic = () => <Sv label="A web of light curves">{Array.from({ length: 9 }, (_, k) => <path key={k} className={c.caustic} style={{ animationDelay: `${-k * 0.5}s` }} d={`M0 ${k * 8}C40 ${64 - k * 8} 70 ${k * 8} 110 ${64 - k * 8}`} />)}</Sv>;

/* 40 */ function Tracer() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={c.sw} onClick={() => setN((v) => v + 1)} aria-label="Route trace. Click to draw it again">
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true">
        <path d="M10 52C30 52 28 20 50 20S70 50 96 14" className={c.base} />
        <path key={n} d="M10 52C30 52 28 20 50 20S70 50 96 14" pathLength="100" className={c.draw} />
        <circle cx="10" cy="52" r="3" className={c.dot} /><circle key={`e${n}`} cx="96" cy="14" r="3.4" className={c.endpin} />
      </svg>
    </button>
  );
}

/* 41 */ function Cable() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.35 });
  const d = `M6 12Q55 ${12 + (1 - v) * 80} 104 12`;
  return (
    <div className={c.sw}>
      <svg viewBox="0 0 110 64" className={c.sv} aria-hidden="true"><Lit d={d} dur={2.4} len={14} w={1.8} /></svg>
      <div className={cx(c.rail, c.railV)} {...bind} aria-label="Cable slack"><u style={{ bottom: `${v * 100}%` }} /></div>
    </div>
  );
}

/* 42 */ function Rings() {
  const [rs, setRs] = useState([{ id: 0, x: 50, y: 50 }]);
  const spawn = (x, y) => setRs((a) => [...a.slice(-3), { id: (a.at(-1)?.id ?? 0) + 1, x, y }]);
  return (
    <button type="button" className={c.sw} aria-label="Click to send a pulse ring"
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = e.detail === 0 ? 50 : ((e.clientX - r.left) / r.width) * 100; const y = e.detail === 0 ? 50 : ((e.clientY - r.top) / r.height) * 100; spawn(x, y); }}>
      {rs.map((r) => <i key={r.id} className={c.ring} style={{ left: `${r.x}%`, top: `${r.y}%` }} />)}
      <b className={c.flare} /><span className={c.hint}>CLICK</span>
    </button>
  );
}

function cx(...a) { return a.filter(Boolean).join(' '); }

export default {
  Visual,
  items: [
    ['Signal trace', Pulse, 'auto'], ['Bus lines', Bus, 'auto'], ['Chip pads', Pads, 'auto'], ['Branch trace', Branch, 'auto'],
    ['Via hop', Via, 'auto'], ['Fibre strands', Strands, 'auto'], ['Neon tube', Neon, 'click'], ['Light pipe', Pipe, 'auto'],
    ['Grid sweep', Grid, 'auto'], ['Tripwire', Tripwire, 'click'], ['Sweep dish', Radar, 'auto'], ['Scan bar', Scan, 'auto'],
    ['Sun rays', Rays, 'auto'], ['Search light', Search, 'hover'], ['Spot cone', Spot, 'drag'], ['Running border', Border, 'auto'],
    ['Edge shine', Shine, 'hover'], ['Light leaks', Leak, 'auto'], ['Aurora lines', Aurora, 'auto'], ['Shooting stars', Stars, 'auto'],
    ['Comet loop', Comet, 'auto'], ['Orbit trace', Orbits, 'auto'], ['Lissajous', Lissajous, 'auto'], ['Sine pair', SinePair, 'auto'],
    ['Heart trace', Beat, 'auto'], ['Plexus', Plexus, 'hover'], ['Light ribbon', Ribbon, 'auto'], ['Spiral beam', Spiral, 'auto'],
    ['White split', Prism, 'hover'], ['Lens streak', Streak, 'click'], ['Runway lights', Runway, 'auto'], ['Rail ticks', Rails, 'auto'],
    ['Long exposure', Trails, 'auto'], ['Laser harp', Harp, 'click'], ['Beam splitter', Splitter, 'click'], ['Mirror bounce', Bounce, 'drag'],
    ['Fibre bundle', Bundle, 'auto'], ['Strobe bars', Strobe, 'click'], ['Caustic net', Caustic, 'auto'], ['Path draw', Tracer, 'click'],
    ['Slack cable', Cable, 'drag'], ['Pulse rings', Rings, 'click'],
  ],
};
