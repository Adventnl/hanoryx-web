import { useEffect, useId, useState } from 'react';
import { useDrag, useLive, rng, clamp } from '../hooks';
import c from './gauges.module.css';

/* ============================================================
   06 · GAUGES — meters that read the room.
   The pinned side is a dial stack that the scroll alone drives: three arcs fill
   at different rates, a ring of dashes turns, a needle trembles toward 100, and
   the number in the middle is written by CSS counters — no script per frame.
   Angles throughout run clockwise from twelve o'clock.
   ============================================================ */

const pt = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [+(cx + Math.sin(a) * r).toFixed(2), +(cy - Math.cos(a) * r).toFixed(2)];
};
const arc = (cx, cy, r, from, to) => {
  const [x1, y1] = pt(cx, cy, r, from);
  const [x2, y2] = pt(cx, cy, r, to);
  return `M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

/* tick marks (and optional numerals) around the pivot at 50,50 */
function Ticks({ n, from, to, r, len = 3, major = 0, majorLen = 6, labels, labelR, closed = false }) {
  const out = [];
  const last = closed ? n - 1 : n;
  for (let i = 0; i <= last; i += 1) {
    const deg = from + ((to - from) * i) / n;
    const big = major > 0 && i % major === 0;
    const [x1, y1] = pt(50, 50, r, deg);
    const [x2, y2] = pt(50, 50, r - (big ? majorLen : len), deg);
    out.push(<line key={i} className={big ? c.major : undefined} x1={x1} y1={y1} x2={x2} y2={y2} />);
    if (big && labels) {
      const [tx, ty] = pt(50, 50, labelR ?? r - majorLen - 4, deg);
      out.push(<text key={`t${i}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="central">{labels[i / major]}</text>);
    }
  }
  return <g className={c.ticks}>{out}</g>;
}

/* a button that wants to be hovered: hover for a mouse, a tap for touch, Enter for a keyboard */
function useHot() {
  const [hot, setHot] = useState(false);
  const bind = {
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHot(true); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setHot(false); },
    onPointerDown: (e) => { if (e.pointerType !== 'mouse') setHot((h) => !h); },
    onClick: (e) => { if (e.detail === 0) setHot((h) => !h); },
    onBlur: () => setHot(false),
  };
  return [hot, bind];
}

/* a point dragged inside a box: { x, y } in 0..1 */
function useXY(init) {
  const [p, setP] = useState(init);
  const at = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setP({ x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) });
  };
  const bind = {
    role: 'application',
    'aria-roledescription': 'two-axis control',
    tabIndex: 0,
    style: { touchAction: 'none' },
    onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); at(e); },
    onPointerMove: (e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) at(e); },
    onKeyDown: (e) => {
      const d = { ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[e.key];
      if (d) { e.preventDefault(); setP((q) => ({ x: clamp(q.x + d[0]), y: clamp(q.y + d[1]) })); }
      if (e.key === 'Home') setP({ x: 0.5, y: 0.5 });
    },
  };
  return [p, bind];
}

/* ---- the pinned dial stack ---- */
const RAYS = Array.from({ length: 72 }, (_, i) => {
  const [x1, y1] = pt(100, 100, 90, i * 5);
  const [x2, y2] = pt(100, 100, 98, i * 5);
  return { i, x1, y1, x2, y2 };
});

function Visual() {
  return (
    <div className={c.big} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <g className={c.rays}>{RAYS.map((l) => <line key={l.i} style={{ '--i': l.i }} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}</g>
        <path className={c.bigRail} d={arc(100, 100, 78, -135, 135)} />
        <path className={c.bigRun} d={arc(100, 100, 78, -135, 135)} pathLength="1" />
        <path className={c.bigRail} d={arc(100, 100, 66, -135, 135)} />
        <path className={c.bigRun2} d={arc(100, 100, 66, -135, 135)} pathLength="1" />
        <circle className={c.bigDash} cx="100" cy="100" r="53" pathLength="1" />
        <circle className={c.bigDash2} cx="100" cy="100" r="46" pathLength="1" />
        <g className={c.bigNeedle}><path d="M100 26 L96.2 100 H103.8Z" /><circle cx="100" cy="100" r="7.5" /></g>
      </svg>
      <p className={c.readout}><b className={c.bigNum} /><i>% load</i></p>
    </div>
  );
}

/* 1 */ const SWEEP = [0.08, 0.36, 0.62, 0.9, 0.5];
function SweepDial() {
  const [k, setK] = useState(1);
  const v = SWEEP[k];
  return (
    <button type="button" className={c.half} style={{ '--v': v }} aria-label={`Sweep dial at ${Math.round(v * 100)}. Click to move the needle`} onClick={() => setK((k + 1) % SWEEP.length)}>
      <svg viewBox="0 0 100 60" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 44, -90, 90)} />
        <path className={c.hot} d={arc(50, 50, 44, 54, 90)} />
        <Ticks n={20} from={-90} to={90} r={38} len={3} major={5} majorLen={5} />
        <g className={c.nd}><path d="M50 11 L48.4 50 H51.6Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4" />
      </svg>
      <span>{Math.round(v * 100)}</span>
    </button>
  );
}

/* 2 */ function ArcMeter() {
  return (
    <div className={c.arcMeter} role="img" aria-label="Arc meter swinging between low and high">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 40, -135, 135)} />
        <path className={c.run} d={arc(50, 50, 40, -135, 135)} pathLength="1" />
      </svg>
      <b className={c.num} />
    </div>
  );
}

/* 3 */ function TripleRings() {
  const [hot, h] = useHot();
  const v = hot ? [0.96, 0.88, 0.74] : [0.78, 0.52, 0.31];
  return (
    <button type="button" className={c.rings3} data-hot={hot} aria-label="Triple rings, hover to fill them" {...h}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {[41, 31, 21].map((r, i) => (
          <g key={r}>
            <circle className={c.rail} cx="50" cy="50" r={r} />
            <circle className={c.ring} data-k={i} cx="50" cy="50" r={r} pathLength="1" style={{ strokeDasharray: `${v[i]} 1` }} />
          </g>
        ))}
      </svg>
      <span>{Math.round(v[0] * 100)}</span>
    </button>
  );
}

/* 4 */ const KMH = ['0', '40', '80', '120', '160', '200', '240'];
function Speedometer() {
  const [on, setOn] = useState(false);
  const [v, setV] = useState(0);
  const live = useLive();
  const rest = v === 0;
  useEffect(() => {
    if (!live || (!on && rest)) return undefined;
    const id = window.setInterval(() => setV((s) => clamp(s + (on ? 0.028 : -0.04))), 50);
    return () => window.clearInterval(id);
  }, [on, rest, live]);
  const go = () => setOn(true);
  const stop = () => setOn(false);
  return (
    <div className={c.speedo} style={{ '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 46, -135, 135)} />
        <path className={c.hot} d={arc(50, 50, 46, 90, 135)} />
        <Ticks n={24} from={-135} to={135} r={42} len={3} major={4} majorLen={6} labels={KMH} labelR={30} />
        <g className={c.nd}><path d="M50 12 L48.3 50 H51.7Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4.5" />
      </svg>
      <output>{Math.round(v * 240)}<small> km/h</small></output>
      <button
        type="button"
        aria-label="Hold to accelerate"
        onPointerDown={go}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) go(); }}
        onKeyUp={stop}
        onBlur={stop}
      >
        Hold
      </button>
    </div>
  );
}

/* 5 */ const REV = [0.62, 0.9, 0.76, 0.97];
const REVS = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
function Tachometer() {
  const [n, setN] = useState(0);
  const [hot, setHot] = useState(false);
  useEffect(() => {
    if (!hot) return undefined;
    const id = window.setTimeout(() => setHot(false), 700);
    return () => window.clearTimeout(id);
  }, [hot, n]);
  const v = hot ? REV[n % REV.length] : 0.2;
  return (
    <button type="button" className={c.round} style={{ '--v': v }} aria-label="Tachometer, click to rev the engine" onClick={() => { setN(n + 1); setHot(true); }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 46, -135, 135)} />
        <path className={c.hot} d={arc(50, 50, 46, 84, 135)} />
        <Ticks n={16} from={-135} to={135} r={42} len={3} major={2} majorLen={6} labels={REVS} labelR={30} />
        <g className={c.nd}><g className={c.jit}><path d="M50 14 L48.4 50 H51.6Z" /></g></g>
        <circle className={c.hub} cx="50" cy="50" r="4.5" />
        <text className={c.unit} x="50" y="68" textAnchor="middle">×1000 RPM</text>
      </svg>
    </button>
  );
}

/* 6 */ function PeakHold() {
  return (
    <div className={c.peak} role="img" aria-label="Level meter with a peak marker">
      <div className={c.cells}>
        {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
        <u />
      </div>
      <ol><li>-40</li><li>-20</li><li>-10</li><li>-3</li><li>0 dB</li></ol>
    </div>
  );
}

/* 7 */ function Battery() {
  const [s, setS] = useState({ v: 0.42, chg: true });
  const live = useLive();
  useEffect(() => {
    if (!live) return undefined;
    const id = window.setInterval(() => setS((p) => {
      const v = clamp(p.v + (p.chg ? 0.012 : -0.01));
      return { v, chg: v >= 1 ? false : v <= 0.06 ? true : p.chg };
    }), 120);
    return () => window.clearInterval(id);
  }, [live]);
  const pct = Math.round(s.v * 100);
  return (
    <button type="button" className={c.batt} data-chg={s.chg} data-low={s.v < 0.2} style={{ '--v': s.v }} aria-label={`Battery ${pct} percent, ${s.chg ? 'charging' : 'discharging'}. Click to reverse`} onClick={() => setS((p) => ({ ...p, chg: !p.chg }))}>
      <span className={c.cell}><i /><output>{pct}%</output></span>
      <u />
      <svg viewBox="0 0 10 16" aria-hidden="true"><path d="M6 0 1 9h4l-1 7 5-9H5z" /></svg>
    </button>
  );
}

/* 8 */ const DBM = [-96, -88, -80, -72, -64, -56];
function SignalBars() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={c.signal} aria-label={`Signal strength ${n} of 5. Click to change`} onClick={() => setN((n + 1) % 6)}>
      <span>{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ '--i': i }} data-on={i < n} />)}</span>
      <em>{DBM[n]} dBm</em>
    </button>
  );
}

/* 9 */ const GLASS = 'M10 5H50V15C50 30 36 38 33 45C36 52 50 60 50 75V85H10V75C10 60 24 52 27 45C24 38 10 30 10 15Z';
function Hourglass() {
  const id = useId().replace(/\W/g, '');
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.glass} aria-label="Hourglass, click to turn it over" onClick={() => setN(n + 1)}>
      <svg viewBox="0 0 60 90" aria-hidden="true" style={{ transform: `rotate(${n * 180}deg)` }}>
        <defs>
          <clipPath id={`${id}t`}><path d="M10 5H50V15C50 30 36 38 33 45H27C24 38 10 30 10 15Z" /></clipPath>
          <clipPath id={`${id}b`}><path d="M27 45H33C36 52 50 60 50 75V85H10V75C10 60 24 52 27 45Z" /></clipPath>
        </defs>
        <g key={n} className={c.sand} data-flip={n % 2}>
          <g clipPath={`url(#${id}t)`}><rect className={c.top} x="8" y="5" width="44" height="40" /></g>
          <g clipPath={`url(#${id}b)`}><rect className={c.bottom} x="8" y="45" width="44" height="40" /></g>
          <path className={c.stream} d="M30 44V83" />
        </g>
        <path className={c.rim} d={GLASS} />
        <path className={c.capLine} d="M6 3H54M6 87H54" />
      </svg>
    </button>
  );
}

/* 10 */ const ODO = [0, 0, 3, 8, 1, 5];
function Odometer() {
  return (
    <div className={c.odo} role="img" aria-label="Odometer counting up">
      {ODO.map((d, k) => (
        <i key={k} style={{ '--t': `${2 * 10 ** (5 - k)}s`, '--s': d }}>
          <b>{Array.from({ length: 11 }, (_, n) => <em key={n}>{n % 10}</em>)}</b>
        </i>
      ))}
      <small>km</small>
    </div>
  );
}

/* 11 */ const BULLETS = [['Reach', 0.62, 0.9, 0.78], ['Speed', 0.41, 0.66, 0.7], ['Uptime', 0.84, 0.97, 0.9]];
function Bullet() {
  const [hot, h] = useHot();
  return (
    <button type="button" className={c.bullets} data-hot={hot} aria-label="Bullet gauges, hover to compare with the target" {...h}>
      {BULLETS.map(([label, rest, up, target]) => (
        <span key={label} style={{ '--v': hot ? up : rest, '--t': target }}>
          <em>{label}</em>
          <i><b /><u /></i>
        </span>
      ))}
    </button>
  );
}

/* 12 */ const CELLS = Array.from({ length: 100 }, (_, k) => (9 - Math.floor(k / 10)) * 10 + (k % 10));
function Waffle() {
  const [v, bind] = useDrag({ init: 0.63 });
  const lit = Math.round(v * 100);
  return (
    <div className={c.waffle}>
      <div className={c.grid} {...bind} aria-label="Waffle gauge">
        {CELLS.map((n, k) => <i key={k} data-on={n < lit} data-hi={n >= 75} />)}
      </div>
      <output>{lit}<small>%</small></output>
    </div>
  );
}

/* 13 */ const SEIS = (() => {
  const r = rng(11);
  let d = 'M0 25';
  for (let x = 2; x <= 200; x += 2) {
    const env = 0.12 + 1.15 * Math.exp(-(((x - 46) / 12) ** 2)) + 0.75 * Math.exp(-(((x - 132) / 18) ** 2));
    const y = x === 200 ? 25 : 25 + (r() - 0.5) * 28 * env;
    d += `L${x} ${y.toFixed(1)}`;
  }
  return d;
})();
function Seismograph() {
  return (
    <div className={c.seis} role="img" aria-label="Seismograph trace scrolling past a pen">
      <div className={c.paper}>
        {[0, 1].map((k) => (
          <svg key={k} viewBox="0 0 200 50" preserveAspectRatio="none"><path d={SEIS} /></svg>
        ))}
      </div>
      <i />
    </div>
  );
}

/* 14 */ const FUEL = [0.1, 0.34, 0.58, 0.82, 1];
function Fuel() {
  const [k, setK] = useState(1);
  const v = FUEL[k];
  return (
    <button type="button" className={c.fuel} style={{ '--v': v }} data-low={v < 0.2} aria-label={`Fuel gauge ${Math.round(v * 100)} percent. Click to refuel`} onClick={() => setK((k + 1) % FUEL.length)}>
      <svg viewBox="0 4 100 52" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 44, -60, 60)} />
        <path className={c.hot} d={arc(50, 50, 44, -60, -42)} />
        <Ticks n={8} from={-60} to={60} r={38} len={3} major={4} majorLen={6} />
        <text className={c.tagBig} x="21" y="42" textAnchor="middle">E</text>
        <text className={c.tagBig} x="79" y="42" textAnchor="middle">F</text>
        <text className={c.tagMid} x="50" y="20" textAnchor="middle">½</text>
        <g className={c.nd}><path d="M50 12 L48.5 50 H51.5Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="3.6" />
      </svg>
      <i />
    </button>
  );
}

/* 15 */ const BAR = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
function Pressure() {
  const [hot, h] = useHot();
  return (
    <button type="button" className={c.press} style={{ '--v': hot ? 0.88 : 0.42 }} aria-label="Pressure gauge, hover to raise the pressure" {...h}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={c.face} cx="50" cy="50" r="47" />
        <path className={c.hot} d={arc(50, 50, 40, 70, 135)} />
        <Ticks n={20} from={-135} to={135} r={45} len={3} major={2} majorLen={6} labels={BAR} labelR={31} />
        <text className={c.unit} x="50" y="72" textAnchor="middle">BAR</text>
        <g className={c.nd}><g className={c.jit}><path d="M50 13 L48.4 50 H51.6Z" /><path className={c.tail} d="M50 50 L48.6 63 H51.4Z" /></g></g>
        <circle className={c.hub} cx="50" cy="50" r="4.5" />
      </svg>
    </button>
  );
}

/* 16 */ const WEATHER = [['STORMY', -72], ['RAIN', -36], ['CHANGE', 0], ['FAIR', 36], ['DRY', 72]];
function Barometer() {
  const [v, bind] = useDrag({ init: 0.58 });
  return (
    <div className={c.baro} {...bind} aria-label="Barometer, drag to set the pressure" style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 60" aria-hidden="true">
        <path className={c.rail} d={arc(50, 50, 44, -90, 90)} />
        {WEATHER.map(([t, a]) => <text key={t} transform={`rotate(${a} 50 50)`} x="50" y="19" textAnchor="middle">{t}</text>)}
        <Ticks n={40} from={-90} to={90} r={47} len={2.4} major={10} majorLen={4} />
        <g className={c.nd}><path d="M50 14 L48.5 50 H51.5Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4" />
      </svg>
      <output>{Math.round(960 + v * 80)} hPa</output>
    </div>
  );
}

/* 17 */ const DROP = 'M30 4C30 4 8 30 8 50a22 22 0 0 0 44 0C52 30 30 4 30 4Z';
function Droplet() {
  const id = `drop${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.drop} role="img" aria-label="A droplet filling and draining">
      <svg viewBox="0 0 60 80">
        <defs><clipPath id={id}><path d={DROP} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          <g className={c.level}>
            <path className={c.wave} d="M-30 0q7.5-5 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0V90H-30Z" />
          </g>
        </g>
        <path className={c.rim} d={DROP} />
      </svg>
      <b className={c.num} />
    </div>
  );
}

/* 18 */ function Thermal() {
  const [v, bind, set] = useDrag({ init: 0.35 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    set((e.clientX - r.left) / r.width);
  };
  return (
    <div className={c.thermal} {...bind} onPointerMove={move} aria-label="Temperature strip, move along it to read" style={{ ...bind.style, '--v': v }}>
      <i />
      <b><em>{Math.round(-10 + v * 50)}°</em></b>
      <ol><li>-10</li><li>10</li><li>30</li><li>40</li></ol>
    </div>
  );
}

/* 19 */ function RadialBars() {
  return (
    <div className={c.radial} role="img" aria-label="Five radial bars rising and falling">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {[44, 36, 28, 20, 12].map((r, i) => (
          <g key={r}>
            <path className={c.rail} d={arc(50, 50, r, -135, 135)} />
            <path className={c.run} data-k={i} d={arc(50, 50, r, -135, 135)} pathLength="1" style={{ animationDuration: `${4.5 + i * 1.3}s`, animationDelay: `${-i * 1.7}s` }} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* 20 */ const DOTS = Array.from({ length: 28 }, (_, i) => pt(50, 50, 40, -135 + (270 * i) / 27));
function DotArc() {
  return (
    <div className={c.dotArc} role="img" aria-label="A dotted arc lighting up">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {DOTS.map(([x, y], i) => <circle key={i} style={{ '--i': i }} cx={x} cy={y} r={i % 3 === 0 ? 2.7 : 2} />)}
      </svg>
      <b className={c.num} />
    </div>
  );
}

/* 21 */ function SpiritLevel() {
  const [v, bind] = useDrag({ init: 0.2 });
  const flat = Math.abs(v - 0.5) < 0.03;
  return (
    <div className={c.spirit} {...bind} aria-label="Spirit level, drag to move the bubble" style={{ ...bind.style, '--v': v }} data-flat={flat}>
      <div><i /><u /><b /></div>
      <span>{flat ? 'LEVEL' : `${((v - 0.5) * 8).toFixed(1)}°`}</span>
    </div>
  );
}

/* 22 */ function Attitude() {
  const [p, bind] = useXY({ x: 0.68, y: 0.4 });
  return (
    <div className={c.att} {...bind} aria-label="Attitude indicator, drag to bank and pitch" style={{ ...bind.style, '--roll': `${((p.x - 0.5) * 70).toFixed(1)}deg`, '--pitch': `${((p.y - 0.5) * 36).toFixed(1)}%` }}>
      <div className={c.world}><i /></div>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M18 54h20l6 8 6-8 6 8 6-8h20" />
        <g className={c.rollg}><path className={c.pointer} d="M50 6 L45.5 14 H54.5Z" /></g>
        <Ticks n={12} from={-60} to={60} r={46} len={3} major={2} majorLen={5} />
      </svg>
    </div>
  );
}

/* 23 */ const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function Altimeter() {
  return (
    <div className={c.alti} role="img" aria-label="Altimeter with three turning hands">
      <svg viewBox="0 0 100 100">
        <circle className={c.face} cx="50" cy="50" r="47" />
        <Ticks n={50} from={0} to={360} r={44} len={3} major={5} majorLen={6} labels={DIGITS} labelR={32} closed />
        <g className={c.spin} style={{ animationDuration: '120s' }}><path className={c.short} d="M50 26 L47.4 50 H52.6Z" /></g>
        <g className={c.spin} style={{ animationDuration: '12s' }}><path d="M50 10 L48.6 50 H51.4Z" /></g>
        <g className={c.spin} style={{ animationDuration: '2.4s' }}><path className={c.thin} d="M50 6 V58" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4" />
      </svg>
    </div>
  );
}

/* 24 */ const COMPASS = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' };
const TAPE = Array.from({ length: 144 }, (_, i) => {
  const deg = (((i * 5 - 180) % 360) + 360) % 360;
  return { i, big: deg % 10 === 0, l: deg % 30 === 0 ? (COMPASS[deg] ?? String(deg).padStart(3, '0')) : '' };
});
function HeadingTape() {
  return (
    <div className={c.head} role="img" aria-label="Heading tape turning through a full circle">
      <div className={c.tape}>{TAPE.map((m) => <i key={m.i} data-big={m.big} data-l={m.l} />)}</div>
      <u />
      <p>HDG <b className={c.num} style={{ '--max': 360 }} />°</p>
    </div>
  );
}

/* 25 */ const VOLTS = [5, 12, 3.3, 9, 1.5, 15];
function Voltmeter() {
  const [k, setK] = useState(0);
  const v = VOLTS[k];
  return (
    <button type="button" className={c.volt} style={{ '--v': v / 15 }} aria-label={`Voltmeter reading ${v} volts. Click to probe the next rail`} onClick={() => setK((k + 1) % VOLTS.length)}>
      <svg viewBox="0 0 100 60" aria-hidden="true">
        <Ticks n={30} from={-60} to={60} r={46} len={3} major={5} majorLen={6} labels={['0', '3', '6', '9', '12', '15']} labelR={33} />
        <path className={c.redArc} d={arc(50, 50, 49, 36, 60)} />
        <text x="50" y="42" textAnchor="middle">V DC</text>
        <g className={c.nd}><path d="M50 8 L48.9 50 H51.1Z" /></g>
        <circle className={c.hubInk} cx="50" cy="50" r="3.4" />
      </svg>
      <output>{v.toFixed(1)} V</output>
    </button>
  );
}

/* 26 */ function StereoLadder() {
  return (
    <div className={c.stereo} role="img" aria-label="Stereo level ladder">
      {['L', 'R'].map((ch, k) => (
        <div key={ch} className={c.col} style={{ animationDuration: k ? '3.1s' : '2.6s', animationDelay: k ? '-1.2s' : '0s' }}>
          {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
          <em>{ch}</em>
        </div>
      ))}
      <ol><li>0</li><li>-6</li><li>-12</li><li>-24</li></ol>
    </div>
  );
}

/* 27 */ function PieTimer() {
  return (
    <div className={c.pie} role="img" aria-label="A sixty second pie timer">
      <i />
      <b className={c.num} style={{ '--max': 60 }} />
      <small>sec</small>
    </div>
  );
}

/* 28 */ function TwinNeedle() {
  const [hot, h] = useHot();
  return (
    <button type="button" className={c.round} aria-label="Twin needle gauge, hover to swap the readings" {...h}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={c.face} cx="50" cy="50" r="47" />
        <Ticks n={20} from={-135} to={135} r={44} len={3} major={5} majorLen={6} />
        <text className={c.tag} x="50" y="30" textAnchor="middle">OIL</text>
        <text className={c.tag} x="50" y="76" textAnchor="middle">TEMP</text>
        <g className={c.nd} style={{ '--v': hot ? 0.82 : 0.24 }}><path d="M50 12 L48.4 50 H51.6Z" /></g>
        <g className={`${c.nd} ${c.white}`} style={{ '--v': hot ? 0.3 : 0.74 }}><path d="M50 18 L48.6 50 H51.4Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4.5" />
      </svg>
    </button>
  );
}

/* 29 */ const ECG = 'M0 30H14q4-8 8 0H34L38 34 44 6 50 52 54 30H62q6-12 12 0H100H114q4-8 8 0H134L138 34 144 6 150 52 154 30H162q6-12 12 0H200';
function PulseTrace() {
  return (
    <div className={c.pulse} role="img" aria-label="A heartbeat trace with a travelling highlight">
      <svg viewBox="0 0 200 60" preserveAspectRatio="none">
        <path className={c.ghost} d={ECG} />
        <path className={c.comet} d={ECG} pathLength="1" />
      </svg>
      <span>72 <small>BPM</small></span>
    </div>
  );
}

/* 30 */ function OrbitMeter() {
  return (
    <div className={c.orbit} role="img" aria-label="Orbit meter">
      <i /><u />
      <b className={c.num} />
    </div>
  );
}

/* 31 */ function SegmentRing() {
  const [n, setN] = useState(7);
  return (
    <button type="button" className={c.segring} aria-label={`Segment ring, ${n} of 12 lit. Click to light another`} onClick={() => setN((n + 1) % 13)}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => <path key={i} data-on={i < n} data-last={i === n - 1} d={arc(50, 50, 40, i * 30 + 3, i * 30 + 27)} />)}
      </svg>
      <b>{n}</b>
    </button>
  );
}

/* 32 */ const TEAMS = ['Atlas', 'Bravo', 'Cedar', 'Delta', 'Ember'];
const ROUNDS = [[62, 48, 71, 35, 54], [41, 77, 58, 66, 29], [83, 52, 44, 69, 61], [57, 63, 90, 38, 72]];
function RankBars() {
  const [k, setK] = useState(0);
  const s = ROUNDS[k];
  const rank = s.map((x) => s.filter((y) => y > x).length);
  return (
    <button type="button" className={c.rank} aria-label={`Rank bars, round ${k + 1}. Click for the next round`} onClick={() => setK((k + 1) % ROUNDS.length)}>
      {TEAMS.map((t, i) => (
        <span key={t} data-top={rank[i] === 0} style={{ '--r': rank[i], '--w': s[i] / 100 }}>
          <em>{t}</em><i><b /></i><u>{s[i]}</u>
        </span>
      ))}
    </button>
  );
}

/* 33 */ const DISK = [['Apps', 0.24], ['Media', 0.31], ['Docs', 0.12], ['System', 0.15], ['Free', 0.18]];
function DiskUsage() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.disk} data-hot={hot}>
      <div className={c.stack}>{DISK.map(([n, w], i) => <i key={n} style={{ '--w': w, '--k': i }} data-hot={hot === i} />)}</div>
      <ul>
        {DISK.map(([n, w], i) => (
          <li key={n}>
            <button type="button" onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)} onClick={() => setHot(i)}>
              <b style={{ '--k': i }} />{n}<em>{Math.round(w * 100)}%</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 34 */ function MeterBridge() {
  return (
    <div className={c.bridge} role="img" aria-label="A bridge of eight small meters">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ animationDuration: `${2.2 + (i % 4) * 0.7}s`, animationDelay: `${-i * 0.55}s` }}><i /><em>{i + 1}</em></span>
      ))}
    </div>
  );
}

/* 35 */ const ROSE_A = [0.52, 0.4, 0.62, 0.34, 0.8, 0.44, 0.3, 0.56, 0.7, 0.38, 0.5, 0.28, 0.6, 0.46, 0.36, 0.58];
const ROSE_B = [0.92, 0.6, 0.42, 0.7, 0.36, 0.84, 0.56, 0.3, 0.48, 0.94, 0.64, 0.4, 0.74, 0.34, 0.8, 0.5];
function WindRose() {
  const [hot, h] = useHot();
  const L = hot ? ROSE_B : ROSE_A;
  return (
    <button type="button" className={c.rose} aria-label="Wind rose, hover to change the wind" {...h}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={c.rail} cx="50" cy="50" r="40" />
        <circle className={c.rail} cx="50" cy="50" r="24" />
        {L.map((l, i) => <path key={i} style={{ '--i': i, '--l': l }} d="M50 50 L46.4 14 L50 6 L53.6 14Z" />)}
        <text x="50" y="-1" textAnchor="middle">N</text>
        <text x="104" y="52" textAnchor="middle">E</text>
        <text x="50" y="106" textAnchor="middle">S</text>
        <text x="-4" y="52" textAnchor="middle">W</text>
      </svg>
    </button>
  );
}

/* 36 */ const BLIPS = [[28, 0.62], [112, 0.4], [196, 0.78], [301, 0.5], [340, 0.3]];
function RadarSweep() {
  return (
    <div className={c.radar} role="img" aria-label="Radar sweep with fading echoes">
      {BLIPS.map(([a, r]) => <i key={a} style={{ '--a': a, '--r': r }} />)}
    </div>
  );
}

/* 37 */ function Tank() {
  const [v, setV] = useState(0.55);
  const live = useLive();
  useEffect(() => {
    if (!live) return undefined;
    const id = window.setInterval(() => setV((x) => clamp(x - 0.006)), 200);
    return () => window.clearInterval(id);
  }, [live]);
  return (
    <button type="button" className={c.tank} style={{ '--v': v }} aria-label={`Tank at ${Math.round(v * 100)} percent. Click to pump water in`} onClick={() => setV((x) => clamp(x + 0.22))}>
      <span><i /></span>
      <ol><li>100</li><li>75</li><li>50</li><li>25</li><li>0</li></ol>
      <b>{Math.round(v * 100)}%</b>
    </button>
  );
}

/* 38 */ const RISK = [['Low', 0.16], ['Medium', 0.5], ['High', 0.84]];
function RiskMeter() {
  const [k, setK] = useState(1);
  return (
    <button type="button" className={c.half} style={{ '--v': RISK[k][1] }} aria-label={`Risk ${RISK[k][0]}. Click to change`} onClick={() => setK((k + 1) % 3)}>
      <svg viewBox="0 0 100 60" aria-hidden="true">
        <path className={c.zone} data-z="0" d={arc(50, 50, 42, -88, -32)} />
        <path className={c.zone} data-z="1" d={arc(50, 50, 42, -28, 28)} />
        <path className={c.zone} data-z="2" d={arc(50, 50, 42, 32, 88)} />
        <g className={c.nd}><path d="M50 14 L48.6 50 H51.4Z" /></g>
        <circle className={c.hub} cx="50" cy="50" r="4" />
      </svg>
      <span>{RISK[k][0]}</span>
    </button>
  );
}

/* 39 */ function Sonar() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={c.sonar} aria-label="Sonar, click to send a ping" onClick={() => setN(n + 1)}>
      {[0, 1, 2].map((d) => <i key={`${n}-${d}`} style={{ animationDelay: `${d * 0.28}s` }} />)}
      {[[0.34, 0.5, -30], [0.7, 0.88, 40]].map(([t, r, a]) => <u key={`${n}-${a}`} style={{ '--r': r, '--a': a, animationDelay: `${t * 1.1}s` }} />)}
      <em>{30 + ((n * 13) % 40)} ms</em>
    </button>
  );
}

/* 40 */ function Cooldown() {
  const [cd, setCd] = useState(false);
  useEffect(() => {
    if (!cd) return undefined;
    const id = window.setTimeout(() => setCd(false), 4000);
    return () => window.clearTimeout(id);
  }, [cd]);
  return (
    <button type="button" className={c.cool} data-cd={cd} disabled={cd} aria-label={cd ? 'Ability recharging' : 'Ability ready. Click to use it'} onClick={() => setCd(true)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>
      {cd && (<><i /><b className={c.num} /></>)}
      <kbd>Q</kbd>
    </button>
  );
}

/* 41 */ const PHASES = [['New', 'r', 1, false], ['Waxing crescent', 'r', 0.5, false], ['First quarter', 'r', 0, false], ['Waxing gibbous', 'r', 0.5, true], ['Full', 'r', 1, true], ['Waning gibbous', 'l', 0.5, true], ['Last quarter', 'l', 0, true], ['Waning crescent', 'l', 0.5, false]];
function MoonPhase() {
  const [k, setK] = useState(3);
  const [name, side, w, lit] = PHASES[k];
  return (
    <button type="button" className={c.moon} data-side={side} data-lit={lit} style={{ '--w': w }} aria-label={`Moon phase: ${name}. Click for the next phase`} onClick={() => setK((k + 1) % PHASES.length)}>
      <span><i /><u /></span>
      <em>{name}</em>
    </button>
  );
}

/* 42 */ function TickSweep() {
  return (
    <div className={c.tickSweep} role="img" aria-label="Sixty ticks lighting in turn">
      {Array.from({ length: 60 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
      <b>SCAN</b>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Sweep dial', SweepDial, 'click'], ['Arc meter', ArcMeter, 'auto'], ['Triple rings', TripleRings, 'hover'], ['Speedometer', Speedometer, 'hold'],
    ['Tachometer', Tachometer, 'click'], ['Peak hold', PeakHold, 'auto'], ['Battery cell', Battery, 'click'], ['Signal bars', SignalBars, 'click'],
    ['Hourglass', Hourglass, 'click'], ['Odometer', Odometer, 'auto'], ['Bullet gauge', Bullet, 'hover'], ['Waffle gauge', Waffle, 'drag'],
    ['Seismograph', Seismograph, 'auto'], ['Fuel gauge', Fuel, 'click'], ['Pressure gauge', Pressure, 'hover'], ['Barometer', Barometer, 'drag'],
    ['Droplet level', Droplet, 'auto'], ['Thermal strip', Thermal, 'hover'], ['Radial bars', RadialBars, 'auto'], ['Dot arc', DotArc, 'auto'],
    ['Spirit level', SpiritLevel, 'drag'], ['Attitude', Attitude, 'drag'], ['Altimeter', Altimeter, 'auto'], ['Heading tape', HeadingTape, 'auto'],
    ['Voltmeter', Voltmeter, 'click'], ['Stereo ladder', StereoLadder, 'auto'], ['Pie timer', PieTimer, 'auto'], ['Twin needle', TwinNeedle, 'hover'],
    ['Pulse trace', PulseTrace, 'auto'], ['Orbit meter', OrbitMeter, 'auto'], ['Segment ring', SegmentRing, 'click'], ['Rank bars', RankBars, 'click'],
    ['Disk usage', DiskUsage, 'hover'], ['Meter bridge', MeterBridge, 'auto'], ['Wind rose', WindRose, 'hover'], ['Radar sweep', RadarSweep, 'auto'],
    ['Tank level', Tank, 'click'], ['Risk meter', RiskMeter, 'click'], ['Sonar ping', Sonar, 'click'], ['Cooldown tile', Cooldown, 'click'],
    ['Moon phase', MoonPhase, 'click'], ['Tick sweep', TickSweep, 'auto'],
  ],
};
