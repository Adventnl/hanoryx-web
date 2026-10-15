import { useEffect, useRef, useState } from 'react';
import { useCycle, useDrag, useLive, useTick, useToggle } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { arc, polar } from '../kit';
import { usePointer } from '../pointerVars';
import c from './cockpit.module.css';

/* ============================================================
   36 · COCKPIT — instruments with presence.
   Sixteen of the forty-two are one dial component given sixteen faces (a
   range, a sweep, coloured bands, a redline): every needle can be dragged, and
   until you do, each wanders between readings by itself while it is on screen.
   The rest are the instruments a dial cannot be — a horizon, a compass card, a
   lever, a tape. The still side is a heading card that the scroll turns twice.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.card}>
        <svg viewBox="0 0 100 100">
          {Array.from({ length: 72 }, (_, k) => { const [x1, y1] = polar(50, 50, 46, k * 5); const [x2, y2] = polar(50, 50, k % 6 === 0 ? 38 : 42, k * 5); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={k % 6 === 0 ? c.major : undefined} />; })}
          {['N', 'E', 'S', 'W'].map((t, k) => { const [x, y] = polar(50, 50, 31, k * 90); return <text key={t} x={x} y={y} textAnchor="middle" dominantBaseline="central" transform={`rotate(${k * 90} ${x} ${y})`}>{t}</text>; })}
        </svg>
      </div>
      <i className={c.lubber} />
      <b className={c.plane} />
      <output className={c.hdg} />
      <small>1 CARD · 360°</small>
    </div>
  );
}

const SEQ = [0.34, 0.62, 0.47, 0.8, 0.26, 0.7];

/* ---- the dial every gauge is made from ---- */
function Gauge({ title, unit, min, max, sweep = 270, major, minors = 4, bands = [], init = 0.5, digits = 0, labelEvery = 1 }) {
  const [v, bind, set] = useDrag({ mode: 'r', init, range: sweep });
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const [touched, setTouched] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    if (!live || reduced || touched) return undefined;
    const id = setInterval(() => { idx.current += 1; set(SEQ[idx.current % SEQ.length]); }, 1900);
    return () => clearInterval(id);
  }, [live, reduced, touched, set]);

  const start = -sweep / 2;
  const at = (val) => start + ((val - min) / (max - min)) * sweep;
  const steps = Math.round((max - min) / major);
  const value = min + v * (max - min);
  return (
    <div
      className={c.gauge}
      {...bind}
      onPointerDown={(e) => { setTouched(true); bind.onPointerDown(e); }}
      aria-label={`${title}, ${unit}. Drag the needle or use the arrow keys.`}
      aria-valuetext={`${value.toFixed(digits)} ${unit}`}
      data-active={touched}
      style={{ ...bind.style }}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" className={c.bezel} />
        <circle cx="50" cy="50" r="44" className={c.face} />
        {bands.map(([a, b, tone], k) => <path key={k} d={arc(50, 50, 40, at(a), at(b))} className={c[tone]} />)}
        {Array.from({ length: steps * (minors + 1) + 1 }, (_, k) => {
          const deg = start + (k / (steps * (minors + 1))) * sweep;
          const big = k % (minors + 1) === 0;
          const [x1, y1] = polar(50, 50, 44, deg);
          const [x2, y2] = polar(50, 50, big ? 36 : 40, deg);
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={big ? c.tickBig : c.tick} />;
        })}
        {Array.from({ length: steps + 1 }, (_, k) => {
          if (k % labelEvery) return null;
          const val = min + k * major;
          const [x, y] = polar(50, 50, 29, start + (k / steps) * sweep);
          return <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="central" className={c.num}>{val}</text>;
        })}
        <text x="50" y="68" textAnchor="middle" className={c.ttl}>{title}</text>
        <text x="50" y="76" textAnchor="middle" className={c.unit}>{unit}</text>
        <g className={c.needle} style={{ transform: `rotate(${start + v * sweep}deg)` }}><path d="M50 14 53 52 50 56 47 52Z" /><circle cx="50" cy="50" r="4.5" /></g>
      </svg>
      <output>{value.toFixed(digits)}</output>
    </div>
  );
}

const G = (cfg) => function Dial() { return <Gauge {...cfg} />; };

const gauges = [
  ['Airspeed dial', G({ title: 'AIRSPEED', unit: 'KT', min: 0, max: 200, major: 20, bands: [[40, 110, 'green'], [110, 160, 'amber'], [160, 200, 'red']], labelEvery: 2 }), 'drag'],
  ['Pressure altimeter', G({ title: 'ALT', unit: 'x100 FT', min: 0, max: 10, major: 1, minors: 4, digits: 1 }), 'drag'],
  ['Engine revs', G({ title: 'RPM', unit: 'x100', min: 0, max: 30, major: 5, sweep: 240, bands: [[5, 25, 'green'], [25, 30, 'red']], init: 0.6 }), 'drag'],
  ['Oil pressure', G({ title: 'OIL PSI', unit: 'PSI', min: 0, max: 100, major: 20, sweep: 180, bands: [[0, 20, 'red'], [20, 60, 'green'], [60, 100, 'amber']] }), 'drag'],
  ['Oil temperature', G({ title: 'OIL TEMP', unit: '°C', min: 40, max: 140, major: 20, sweep: 200, bands: [[60, 110, 'green'], [110, 140, 'red']], init: 0.55 }), 'drag'],
  ['Exhaust temperature', G({ title: 'EGT', unit: '°C', min: 400, max: 900, major: 100, sweep: 220, bands: [[500, 800, 'green'], [800, 900, 'red']], init: 0.45 }), 'drag'],
  ['Fuel quantity', G({ title: 'FUEL', unit: 'GAL', min: 0, max: 40, major: 10, sweep: 120, bands: [[0, 5, 'red']], init: 0.7 }), 'drag'],
  ['Manifold pressure', G({ title: 'MAP', unit: 'IN HG', min: 10, max: 35, major: 5, sweep: 250, bands: [[15, 28, 'green'], [28, 35, 'red']], init: 0.5 }), 'drag'],
  ['Charge ammeter', G({ title: 'AMPS', unit: 'A', min: -40, max: 40, major: 20, sweep: 140, bands: [[-40, 0, 'red'], [0, 40, 'green']], init: 0.6 }), 'drag'],
  ['Bus voltage', G({ title: 'VOLTS', unit: 'V', min: 10, max: 16, major: 1, sweep: 200, bands: [[10, 12, 'red'], [12, 15, 'green'], [15, 16, 'amber']], init: 0.65, digits: 1 }), 'drag'],
  ['Climb rate', G({ title: 'VSI', unit: 'x100 FPM', min: -20, max: 20, major: 5, sweep: 300, init: 0.5, labelEvery: 1 }), 'drag'],
  ['G-load meter', G({ title: 'G', unit: 'G', min: -2, max: 6, major: 1, sweep: 240, bands: [[-2, -1, 'red'], [-1, 4, 'green'], [4, 6, 'amber']], init: 0.4, digits: 1 }), 'drag'],
  ['Cabin pressure', G({ title: 'CABIN', unit: 'PSI', min: 0, max: 10, major: 2, sweep: 220, bands: [[8, 10, 'red']], init: 0.35, digits: 1 }), 'drag'],
  ['Hydraulic pressure', G({ title: 'HYD', unit: 'x1000 PSI', min: 0, max: 4, major: 1, sweep: 200, bands: [[2.5, 3.5, 'green'], [3.5, 4, 'red']], init: 0.7, digits: 1 }), 'drag'],
  ['Outside air', G({ title: 'OAT', unit: '°C', min: -40, max: 50, major: 10, sweep: 180, init: 0.4, labelEvery: 2 }), 'drag'],
  ['Head temperature', G({ title: 'CHT', unit: '°C', min: 100, max: 260, major: 40, sweep: 200, bands: [[120, 220, 'green'], [220, 260, 'red']], init: 0.5 }), 'drag'],
];

/* ---- the others ---- */

/* 17 */ function Attitude() {
  const [ref, bind] = usePointer();
  return (
    <div ref={ref} className={c.horizon} role="application" aria-label="Attitude indicator. Move the pointer here, or use the arrow keys." tabIndex={0} {...bind}>
      <div className={c.sky}><i /><b /></div>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" className={c.ring} /><path d="M20 52h22l8 6 8-6h22M50 20v8" className={c.fixed} /></svg>
    </div>
  );
}

/* 18 */ function Compass() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.25, range: 360 });
  const hdg = (Math.round(v * 360) + 180) % 360;
  return (
    <div className={c.compass} {...bind} aria-label="Heading card, drag to turn" aria-valuetext={`${hdg} degrees`} style={{ ...bind.style, '--r': `${(v - 0.5) * -360}deg` }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><g className={c.cardG}>{Array.from({ length: 36 }, (_, k) => { const [x1, y1] = polar(50, 50, 46, k * 10); const [x2, y2] = polar(50, 50, k % 3 === 0 ? 39 : 42, k * 10); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={c.tickBig} />; })}{['N', 'E', 'S', 'W'].map((t, k) => { const [x, y] = polar(50, 50, 31, k * 90); return <text key={t} x={x} y={y} textAnchor="middle" dominantBaseline="central" className={c.num} transform={`rotate(${k * 90} ${x} ${y})`}>{t}</text>; })}</g><path d="M50 6l4 8h-8z" className={c.bug} /></svg>
      <b>{String(hdg).padStart(3, '0')}°</b>
    </div>
  );
}

/* 19 */ function Turn() {
  const [ref, bind] = usePointer();
  return (
    <div ref={ref} className={c.turn} role="application" aria-label="Turn coordinator. Move the pointer here, or use the arrow keys." tabIndex={0} {...bind}>
      <svg viewBox="0 0 100 70" aria-hidden="true"><g className={c.bank}><path d="M18 36h64M50 36V26M36 36l-8-6M64 36l8-6" /><circle cx="50" cy="36" r="3.4" /></g><path d="M14 56h72" className={c.race} /></svg>
      <i />
    </div>
  );
}

/* 20 */ function Hsi() {
  const [v, bind] = useDrag({ init: 0.62 });
  return (
    <div className={c.hsi} {...bind} aria-label="Course deviation, drag sideways" aria-valuetext={`${Math.round((v - 0.5) * 20) / 10} dots`} style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" className={c.ring} />{[-2, -1, 1, 2].map((k) => <circle key={k} cx={50 + k * 12} cy="50" r="2" className={c.dot} />)}<path d="M50 12v76" className={c.course} /><path d="M50 12l-5 9h10z" className={c.bug} /></svg>
      <i />
    </div>
  );
}

/* 21 */ function Ils() {
  const [ref, bind] = usePointer();
  return (
    <div ref={ref} className={c.ils} role="application" aria-label="Localiser and glide slope. Move the pointer here, or use the arrow keys." tabIndex={0} {...bind}>
      <svg viewBox="0 0 100 100" aria-hidden="true">{[-2, -1, 1, 2].map((k) => <circle key={`h${k}`} cx={50 + k * 14} cy="50" r="2.2" className={c.dot} />)}{[-2, -1, 1, 2].map((k) => <circle key={`v${k}`} cx="50" cy={50 + k * 14} r="2.2" className={c.dot} />)}</svg>
      <i className={c.loc} /><i className={c.gs} />
    </div>
  );
}

/* 22 */ function Adf() {
  return (
    <div className={c.adf} role="img" aria-label="Automatic direction finder sweeping">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" className={c.ring} />{Array.from({ length: 12 }, (_, k) => { const [x1, y1] = polar(50, 50, 46, k * 30); const [x2, y2] = polar(50, 50, 40, k * 30); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={c.tickBig} />; })}</svg>
      <i /><b />
    </div>
  );
}

/* 23 */ function Radio() {
  const [f, setF] = useState(12150);
  return (
    <div className={c.radio}>
      <output aria-live="polite">{(f / 100).toFixed(2)}<small>MHz</small></output>
      <div role="group" aria-label="Tune">
        <button type="button" aria-label="Down one megahertz" onClick={() => setF((v) => Math.max(11800, v - 100))}>−1</button>
        <button type="button" aria-label="Down 25 kilohertz" onClick={() => setF((v) => Math.max(11800, v - 25))}>−.025</button>
        <button type="button" aria-label="Up 25 kilohertz" onClick={() => setF((v) => Math.min(13697, v + 25))}>+.025</button>
        <button type="button" aria-label="Up one megahertz" onClick={() => setF((v) => Math.min(13697, v + 100))}>+1</button>
      </div>
    </div>
  );
}

/* 24 */ function Squawk() {
  const [d, setD] = useState([1, 2, 0, 0]);
  return (
    <div className={c.squawk} role="group" aria-label="Transponder code">
      {d.map((n, k) => <span key={k}><button type="button" aria-label={`Digit ${k + 1} up`} onClick={() => setD((a) => a.map((x, j) => (j === k ? (x + 1) % 8 : x)))}>▲</button><output>{n}</output><button type="button" aria-label={`Digit ${k + 1} down`} onClick={() => setD((a) => a.map((x, j) => (j === k ? (x + 7) % 8 : x)))}>▼</button></span>)}
    </div>
  );
}

/* 25 */ function FlightClock() {
  const t = useTick(1000);
  const s = 41 * 60 + 18 + t;
  return <div className={c.clock} role="timer" aria-label="Flight time"><b>FT</b><output>{String(Math.floor(s / 3600)).padStart(2, '0')}:{String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:{String(s % 60).padStart(2, '0')}</output></div>;
}

/* 26 */ function Kollsman() {
  const [p, setP] = useState(1013);
  return (
    <div className={c.kolls}>
      <output>{p}<small>hPa</small></output>
      <div><button type="button" aria-label="Lower pressure setting" onClick={() => setP((v) => v - 1)}>−</button><button type="button" aria-label="Standard pressure" onClick={() => setP(1013)}>STD</button><button type="button" aria-label="Raise pressure setting" onClick={() => setP((v) => v + 1)}>+</button></div>
    </div>
  );
}

/* 27 */ function Throttle() {
  const [v, bind, set] = useDrag({ mode: 'y', init: 0.3 });
  const live = useLive();
  const [touched, setTouched] = useState(false);
  const reduced = usePrefersReducedMotion();
  const idx = useRef(0);
  useEffect(() => {
    if (!live || reduced || touched) return undefined;
    const id = setInterval(() => { idx.current += 1; set(SEQ[idx.current % SEQ.length]); }, 2000);
    return () => clearInterval(id);
  }, [live, reduced, touched, set]);
  return (
    <div className={c.throttle}>
      <div {...bind} onPointerDown={(e) => { setTouched(true); bind.onPointerDown(e); }} aria-label="Throttle lever" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}><i /><b /></div>
      <output>{Math.round(v * 100)}%</output>
    </div>
  );
}

/* 28 */ function Flaps() {
  const [k, setK] = useState(1);
  const pos = ['UP', '10°', '20°', '30°'];
  return (
    <div className={c.flaps} role="radiogroup" aria-label="Flap lever">
      <i style={{ '--k': k }} aria-hidden="true" />
      {pos.map((p, i) => <button key={p} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}><span>{p}</span></button>)}
    </div>
  );
}

/* 29 */ function GearLever() {
  const [down, flip] = useToggle(true);
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    if (!moving) return undefined;
    const id = setTimeout(() => setMoving(false), 1500);
    return () => clearTimeout(id);
  }, [moving]);
  return (
    <div className={c.gear}>
      <button type="button" aria-pressed={down} aria-label={down ? 'Gear down. Press to raise' : 'Gear up. Press to lower'} onClick={() => { flip(); setMoving(true); }} data-down={down}><i /></button>
      <div role="img" aria-label={moving ? 'Gear in transit' : down ? 'Three green: down and locked' : 'Lights out: up'}>{[0, 1, 2].map((k) => <u key={k} data-s={moving ? 'transit' : down ? 'down' : 'up'} />)}</div>
    </div>
  );
}

/* 30 */ function TrimWheel() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5, steps: 20 });
  return (
    <div className={c.trim}>
      <div {...bind} aria-label="Trim wheel" aria-valuetext={v > 0.52 ? 'nose up' : v < 0.48 ? 'nose down' : 'neutral'} style={{ ...bind.style, '--v': v }}>{Array.from({ length: 14 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
      <output>{v > 0.52 ? 'NOSE UP' : v < 0.48 ? 'NOSE DOWN' : 'NEUTRAL'}</output>
    </div>
  );
}

/* 31 */ function Switches() {
  const names = ['BCN', 'NAV', 'LDG', 'STR', 'PIT', 'FUEL'];
  const [on, setOn] = useState([true, true, false, false, true, true]);
  return (
    <div className={c.switches} role="group" aria-label="Switch panel">
      {names.map((n, k) => <button key={n} type="button" aria-pressed={on[k]} aria-label={n} onClick={() => setOn((a) => a.map((x, j) => (j === k ? !x : x)))}><i /><span>{n}</span></button>)}
    </div>
  );
}

/* 32 */ function Annunciators() {
  const [lit, setLit] = useState([false, true, false, false, false, true]);
  const names = ['LOW FUEL', 'OIL', 'VOLTS', 'DOOR', 'VAC', 'HEAT'];
  return (
    <div className={c.ann} role="group" aria-label="Warning lamps">
      {names.map((n, k) => <button key={n} type="button" aria-pressed={lit[k]} data-w={k % 2} onClick={() => setLit((a) => a.map((x, j) => (j === k ? !x : x)))}>{n}</button>)}
    </div>
  );
}

/* 33 */ function PullUp() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.pull} aria-pressed={on} aria-label={on ? 'Terrain warning on. Press to silence' : 'Silenced. Press to trigger'} onClick={flip} data-on={on}>PULL UP</button>;
}

/* 34 */ function Autopilot() {
  const [on, setOn] = useState({ HDG: true, ALT: true });
  const modes = ['HDG', 'NAV', 'APR', 'ALT', 'VS'];
  return (
    <div className={c.ap} role="group" aria-label="Autopilot modes">
      {modes.map((m) => <button key={m} type="button" aria-pressed={!!on[m]} onClick={() => setOn((o) => ({ ...o, [m]: !o[m] }))}><i />{m}</button>)}
    </div>
  );
}

/* 35 */ function SpeedTape() {
  const k = useCycle(8, 1500);
  const spd = 90 + k * 6;
  return <div className={c.tape} role="img" aria-label={`Speed ${spd} knots`} style={{ '--s': (spd - 60) / 5 }}><ol>{Array.from({ length: 24 }, (_, i) => 60 + i * 5).map((n) => <li key={n} data-big={n % 10 === 0}>{n % 10 === 0 ? n : ''}</li>)}</ol><i /><b>{spd}</b></div>;
}

/* 36 */ function AltTape() {
  const k = useCycle(8, 1700);
  const alt = 3200 + k * 100;
  return <div className={`${c.tape} ${c.altTape}`} role="img" aria-label={`Altitude ${alt} feet`} style={{ '--s': (alt - 3000) / 40 }}><ol>{Array.from({ length: 24 }, (_, i) => 3000 + i * 40).map((n) => <li key={n} data-big={n % 200 === 0}>{n % 200 === 0 ? n : ''}</li>)}</ol><i /><b>{alt}</b></div>;
}

/* 37 */ function HydBars() {
  const [v, setV] = useState([0.8, 0.62, 0.35]);
  return (
    <div className={c.hyd} role="group" aria-label="Hydraulic quantities">
      {v.map((x, k) => <button key={k} type="button" aria-label={`System ${k + 1}, ${Math.round(x * 100)} percent. Press to change`} onClick={() => setV((a) => a.map((y, j) => (j === k ? (y > 0.85 ? 0.2 : y + 0.2) : y)))} data-low={x < 0.4} style={{ '--v': x }}><i /><span>{k + 1}</span></button>)}
    </div>
  );
}

/* 38 */ function BatteryMaster() {
  const [on, flip] = useToggle();
  return (
    <div className={c.master}>
      <button type="button" role="switch" aria-checked={on} aria-label="Battery master" onClick={flip}><i /></button>
      <span data-on={on}>{on ? '13.8 V' : '— — —'}</span>
    </div>
  );
}

/* 39 */ function FuelSelector() {
  const [k, setK] = useState(2);
  const pos = ['OFF', 'LEFT', 'BOTH', 'RIGHT'];
  return (
    <div className={c.selector}>
      <button type="button" aria-label={`Fuel selector, ${pos[k]}. Press to turn`} onClick={() => setK((k + 1) % 4)} style={{ '--k': k }}><i /></button>
      {pos.map((p, i) => <span key={p} data-on={i === k} style={{ '--a': i }}>{p}</span>)}
    </div>
  );
}

/* 40 */ function Yoke() {
  const [ref, bind] = usePointer();
  return (
    <div ref={ref} className={c.yoke} role="application" aria-label="Control column position. Move the pointer here, or use the arrow keys." tabIndex={0} {...bind}><i /><b /></div>
  );
}

/* 41 */ function Pedals() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.pedals} {...bind} aria-label="Rudder pedals" aria-valuetext={v > 0.55 ? 'right' : v < 0.45 ? 'left' : 'centre'} style={{ ...bind.style, '--v': v }}><span>L</span><i /><span>R</span></div>
  );
}

/* 42 */ function Stall() {
  const [v, bind] = useDrag({ init: 0.45 });
  const warn = v > 0.78;
  return (
    <div className={c.stall} {...bind} aria-label="Angle of attack" aria-valuetext={warn ? 'stall warning' : 'normal'} data-warn={warn} style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 60" aria-hidden="true"><path d={arc(50, 54, 40, -80, 80)} className={c.aoaBase} /><path d={arc(50, 54, 40, 50, 80)} className={c.aoaRed} /><g className={c.aoaNeedle}><path d="M50 54l-2-34h4z" /></g></svg>
      <b>{warn ? 'STALL' : 'AOA'}</b>
    </div>
  );
}

export default {
  Visual,
  items: [
    ...gauges,
    ['Artificial horizon', Attitude, 'hover'], ['Heading card', Compass, 'drag'], ['Turn coordinator', Turn, 'hover'], ['Course deviation', Hsi, 'drag'],
    ['Glide path', Ils, 'hover'], ['Direction finder', Adf, 'auto'], ['Radio tuner', Radio, 'click'], ['Squawk code', Squawk, 'click'],
    ['Flight clock', FlightClock, 'auto'], ['Pressure setting', Kollsman, 'click'], ['Throttle lever', Throttle, 'drag'], ['Flap lever', Flaps, 'click'],
    ['Gear lever', GearLever, 'click'], ['Trim wheel', TrimWheel, 'drag'], ['Switch panel', Switches, 'click'], ['Warning lamps', Annunciators, 'click'],
    ['Terrain warning', PullUp, 'click'], ['Autopilot modes', Autopilot, 'click'], ['Speed tape', SpeedTape, 'auto'], ['Altitude tape', AltTape, 'auto'],
    ['Hydraulic bars', HydBars, 'click'], ['Battery master', BatteryMaster, 'click'], ['Fuel selector', FuelSelector, 'click'], ['Control column', Yoke, 'hover'],
    ['Rudder pedals', Pedals, 'drag'], ['Stall warning', Stall, 'drag'],
  ],
};
