import { useEffect, useRef, useState } from 'react';
import { useDrag, useLive, useTick, clamp } from '../hooks';
import c from './dials.module.css';

/* ============================================================
   02 · DIALS — turn, wind, spin and detent.
   The still centre is a dial of its own: a bezel that turns two full revolutions
   against a needle that sweeps the other way, with an arc that draws as you go.
   ============================================================ */

const TICKS = Array.from({ length: 60 }, (_, i) => i);

function Visual() {
  return (
    <div className={c.big} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <g className={c.bezel}>
          {TICKS.map((i) => {
            const a = (i * 6 * Math.PI) / 180;
            const r1 = i % 5 === 0 ? 80 : 86;
            return <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 94} y2={100 - Math.cos(a) * 94} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <text key={i} x={100 + Math.sin(a) * 68} y={100 - Math.cos(a) * 68 + 3} textAnchor="middle">{i === 0 ? 12 : i}</text>;
          })}
        </g>
        <circle className={c.ring} cx="100" cy="100" r="54" />
        <circle className={c.sweep} cx="100" cy="100" r="46" pathLength="1" />
        <g className={c.needle}><path d="M100 22 L96 100 H104 Z" /><circle cx="100" cy="100" r="6" /></g>
      </svg>
    </div>
  );
}

/* ---- two local helpers ---- */
/* an angle that keeps counting past a full turn */
function useSpin() {
  const [rot, setRot] = useState(0);
  const last = useRef(null);
  const at = (e, el) => {
    const r = el.getBoundingClientRect();
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
  };
  const bind = {
    role: 'slider', tabIndex: 0, 'aria-valuemin': 0, 'aria-valuemax': 360, 'aria-valuenow': Math.round(((rot % 360) + 360) % 360), style: { touchAction: 'none' },
    onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); last.current = at(e, e.currentTarget); },
    onPointerMove: (e) => {
      if (last.current === null) return;
      const a = at(e, e.currentTarget);
      let d = a - last.current;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      last.current = a;
      setRot((r) => r + d);
    },
    onPointerUp: () => { last.current = null; },
    onPointerCancel: () => { last.current = null; },
    onKeyDown: (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRot((r) => r + 15); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRot((r) => r - 15); }
    },
  };
  return [rot, bind];
}

/* a point dragged inside a round field: { x, y } in -1..1 */
function useStick() {
  const [p, setP] = useState({ x: 0, y: 0 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    let x = ((e.clientX - r.left) / r.width) * 2 - 1;
    let y = ((e.clientY - r.top) / r.height) * 2 - 1;
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    setP({ x, y });
  };
  const bind = {
    role: 'application', 'aria-roledescription': 'two-axis control', tabIndex: 0, style: { touchAction: 'none' },
    onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); },
    onPointerMove: (e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) move(e); },
    onPointerUp: () => setP({ x: 0, y: 0 }),
    onKeyDown: (e) => {
      const d = { ArrowLeft: [-0.3, 0], ArrowRight: [0.3, 0], ArrowUp: [0, -0.3], ArrowDown: [0, 0.3] }[e.key];
      if (d) { e.preventDefault(); setP((q) => ({ x: clamp(q.x + d[0], -1, 1), y: clamp(q.y + d[1], -1, 1) })); }
      if (e.key === 'Home') setP({ x: 0, y: 0 });
    },
  };
  return [p, bind];
}

/* a gear outline: n teeth between two radii */
const gear = (n, r1, r2) => {
  let d = '';
  for (let i = 0; i < n * 4; i += 1) {
    const a = ((i / (n * 4)) * 2 * Math.PI) - Math.PI / 2;
    const r = i % 4 === 1 || i % 4 === 2 ? r2 : r1;
    d += `${i ? 'L' : 'M'}${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`;
  }
  return `${d}Z`;
};
const GEAR_A = gear(12, 38, 46);
const GEAR_B = gear(8, 24, 31);

/* 1 */ function Detent() {
  const [v, bind] = useDrag({ mode: 'r', steps: 11, init: 0.36 });
  return (
    <div className={c.detent} style={{ '--v': v }}>
      {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i }} data-on={i / 11 <= v + 0.001} />)}
      <div className={c.knob} {...bind} aria-label="Detent knob"><b /></div>
    </div>
  );
}

/* 2 */ function Chicken() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.62 });
  return <div className={c.chicken} {...bind} aria-label="Chicken-head knob" style={{ ...bind.style, '--v': v }}><i /><span>{Math.round(v * 10)}</span></div>;
}

/* 3 */ function Concentric() {
  const [a, bindA] = useDrag({ mode: 'r', init: 0.3 });
  const [b, bindB] = useDrag({ mode: 'r', init: 0.7 });
  return (
    <div className={c.concentric}>
      <div className={c.outer} {...bindA} aria-label="Outer ring" style={{ ...bindA.style, '--v': a }}><i /></div>
      <div className={c.inner} {...bindB} aria-label="Inner knob" style={{ ...bindB.style, '--v': b }}><i /></div>
    </div>
  );
}

/* 4 */ function Jog() {
  const [rot, bind] = useSpin();
  return <div className={c.jog} {...bind} aria-label="Jog wheel" style={{ ...bind.style, '--r': `${rot}deg` }}><i /><b /></div>;
}

/* 5 */ function ClickWheel() {
  const [rot, bind] = useSpin();
  const [on, setOn] = useState(false);
  return (
    <div className={c.clickWheel} {...bind} aria-label="Click wheel" style={{ ...bind.style, '--r': `${rot}deg` }}>
      <i /><button type="button" aria-pressed={on} aria-label="Centre button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setOn(!on)}>{Math.round(rot / 15)}</button>
    </div>
  );
}

/* 6 */ function LedRing() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.5 });
  return (
    <div className={c.ledRing} style={{ '--v': v }}>
      {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--i': i }} data-on={i / 15 <= v + 0.001} />)}
      <div className={c.knob} {...bind} aria-label="Encoder with LED ring"><b /></div>
    </div>
  );
}

/* 7 */ function Tuning() {
  const [v, bind] = useDrag({ init: 0.45 });
  return (
    <div className={c.tuning} {...bind} aria-label="Tuning dial" style={{ ...bind.style, '--v': v }}>
      <ol>{[88, 92, 96, 100, 104, 108].map((n) => <li key={n}>{n}</li>)}</ol>
      <i /><span>FM {(88 + v * 20).toFixed(1)}</span>
    </div>
  );
}

/* 8 */ function Combination() {
  const [v, bind] = useDrag({ mode: 'r', range: 360, init: 0.5 });
  return (
    <div className={c.combo} {...bind} aria-label="Combination dial" style={{ ...bind.style, '--v': v }}>
      <ol>{Array.from({ length: 20 }, (_, i) => <li key={i} style={{ '--i': i }}>{i * 2}</li>)}</ol>
      <b /><span>{Math.round(v * 39)}</span>
    </div>
  );
}

/* 9 */ function Padlock() {
  const [d, setD] = useState([2, 7, 1, 0]);
  const open = d.join('') === '2718';
  return (
    <div className={c.padlock} data-open={open}>
      <svg viewBox="0 0 40 30" aria-hidden="true"><path d="M8 28V14a12 12 0 0 1 24 0v3" /></svg>
      <div>{d.map((x, i) => <button type="button" key={i} aria-label={`Wheel ${i + 1}, ${x}`} onClick={() => setD(d.map((y, j) => (j === i ? (y + 1) % 10 : y)))}>{x}</button>)}</div>
    </div>
  );
}

/* 10 */ function Marshall() {
  const [v, bind] = useDrag({ mode: 'r', steps: 11, init: 0.9 });
  return (
    <div className={c.marshall} style={{ '--v': v }}>
      {Array.from({ length: 12 }, (_, i) => <em key={i} style={{ '--i': i }}>{i}</em>)}
      <div className={c.skirt} {...bind} aria-label="Gain, zero to eleven"><b /></div>
    </div>
  );
}

/* 11 */ function Knurled() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.5 });
  return <div className={c.knurled} {...bind} aria-label="Knurled knob" style={{ ...bind.style, '--v': v }}><i /></div>;
}

/* 12 */ function ArcSlider() {
  const [v, bind] = useDrag({ mode: 'r', range: 240, init: 0.4 });
  return (
    <div className={c.arc} {...bind} aria-label="Arc slider" style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 80" aria-hidden="true"><path d="M14 66A40 40 0 1 1 86 66" pathLength="1" /><path className={c.fill} d="M14 66A40 40 0 1 1 86 66" pathLength="1" style={{ strokeDashoffset: 1 - v }} /></svg>
      <i /><span>{Math.round(v * 100)}</span>
    </div>
  );
}

/* 13 */ function PieMenu() {
  const [k, setK] = useState(2);
  const labels = ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', 'Find'];
  return (
    <div className={c.pie}>
      {labels.map((t, i) => <button type="button" key={t} aria-pressed={k === i} style={{ '--i': i }} onClick={() => setK(i)}><span>{t}</span></button>)}
      <output>{labels[k]}</output>
    </div>
  );
}

/* 14 */ function Needle() {
  const [v, bind] = useDrag({ mode: 'r', range: 180, init: 0.3 });
  return (
    <div className={c.needleGauge} {...bind} aria-label="Needle setter" style={{ ...bind.style, '--v': v }}>
      <i /><b /><span>{Math.round(v * 240)}</span>
    </div>
  );
}

/* 15 */ function Pan() {
  const [v, bind] = useDrag({ mode: 'r', steps: 20, init: 0.5 });
  const n = Math.round((v - 0.5) * 200);
  return (
    <div className={c.pan} style={{ '--v': v }}>
      <span>L</span><div className={c.knob} {...bind} aria-label="Pan"><b /></div><span>R</span>
      <output>{n === 0 ? 'CENTRE' : n < 0 ? `L ${-n}` : `R ${n}`}</output>
    </div>
  );
}

/* 16 */ function RotaryPhone() {
  const [rot, setRot] = useState(0);
  const [out, setOut] = useState('');
  const dial = (n) => {
    setRot(28 + n * 26);
    setOut((s) => (s + n).slice(-6));
    window.setTimeout(() => setRot(0), 420);
  };
  return (
    <div className={c.phone}>
      <div className={c.disc} style={{ '--r': `${rot}deg` }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => <button type="button" key={n} aria-label={`Dial ${n}`} style={{ '--i': i }} onClick={() => dial(n)}>{n}</button>)}
      </div>
      <output>{out || '—'}</output>
    </div>
  );
}

/* 17 */ function Bezel() {
  const [v, bind] = useDrag({ mode: 'r', range: 360, init: 0.5 });
  return (
    <div className={c.bezelBox} {...bind} aria-label="Compass bezel" style={{ ...bind.style, '--v': v }}>
      <i><b>N</b></i><u /><span>{Math.round(((v + 0.5) % 1) * 360)}°</span>
    </div>
  );
}

/* 18 */ function Steering() {
  const [v, bind] = useDrag({ mode: 'r', range: 220, init: 0.5 });
  return <div className={c.wheel} {...bind} aria-label="Steering wheel" style={{ ...bind.style, '--v': v }}><i /><b /></div>;
}

/* 19 */ function Crank() {
  const [rot, bind] = useSpin();
  return (
    <div className={c.crank} {...bind} aria-label="Crank handle" style={{ ...bind.style, '--r': `${rot}deg` }}>
      <i><b /></i><span>{Math.floor(Math.abs(rot) / 360)} turns</span>
    </div>
  );
}

/* 20 */ function Gears() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.gears} aria-label="Turn the gears" onClick={() => setN(n + 1)}>
      <svg viewBox="-8 0 152 110" aria-hidden="true">
        <g transform="translate(-8 12)"><path className={c.ga} d={GEAR_A} style={{ transform: `rotate(${n * 30}deg)` }} /></g>
        <g transform="translate(52 -20)"><path className={c.gb} d={GEAR_B} style={{ transform: `rotate(${-n * 45 + 22}deg)` }} /></g>
      </svg>
    </button>
  );
}

/* 21 */ function Alarm() {
  const [v, bind] = useDrag({ mode: 'r', range: 360, init: 0.25 });
  const mins = Math.round(v * 720);
  const hh = Math.floor(mins / 60) % 12 || 12;
  return (
    <div className={c.alarm} {...bind} aria-label="Alarm hands" style={{ ...bind.style, '--v': v }}>
      <i /><b /><span>{hh}:{String(mins % 60).padStart(2, '0')}</span>
    </div>
  );
}

/* 22 */ function Thermostat() {
  const [v, bind] = useDrag({ mode: 'r', range: 280, init: 0.45 });
  return (
    <div className={c.thermo} {...bind} aria-label="Thermostat ring" style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" pathLength="1" /><circle className={c.fill} cx="50" cy="50" r="42" pathLength="1" style={{ strokeDasharray: `${v * 0.78} 1` }} /></svg>
      <span>{(16 + v * 12).toFixed(1)}°</span>
    </div>
  );
}

/* 23 */ function HeatRing() {
  const [v, bind] = useDrag({ mode: 'r', range: 360, init: 0.7 });
  return <div className={c.heat} {...bind} aria-label="Heat ring" style={{ ...bind.style, '--v': v }}><i /><span>{Math.round(v * 100)}%</span></div>;
}

/* 24 */ function Stepped() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={c.stepped} style={{ '--n': n }} aria-label={`Selector, position ${n + 1} of 6. Press to advance`} onClick={() => setN((n + 1) % 6)}>
      {[...'ABCDEF'].map((t, i) => <em key={t} style={{ '--i': i }} data-on={i === n}>{t}</em>)}<i />
    </button>
  );
}

/* 25 */ function Pot() {
  const [v, bind] = useDrag({ mode: 'r', range: 280, init: 0.5 });
  return (
    <div className={c.pot} {...bind} aria-label="Potentiometer" style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 78A42 42 0 1 1 80 78" /><path className={c.zig} d="M24 80l3-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5" /></svg>
      <i /><span>{Math.round(v * 10000)} Ω</span>
    </div>
  );
}

/* 26 */ function Joystick() {
  const [p, bind] = useStick();
  return (
    <div className={c.stick} {...bind} aria-label="Joystick" style={{ ...bind.style, '--x': p.x, '--y': p.y }}>
      <u /><i /><span>{p.x.toFixed(1)}, {(-p.y).toFixed(1)}</span>
    </div>
  );
}

/* 27 */ function Trackball() {
  const [p, bind] = useStick();
  return <div className={c.ball} {...bind} aria-label="Trackball" style={{ ...bind.style, '--x': p.x, '--y': p.y }}><i /></div>;
}

/* 28 */ function ScrollWheel() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.scroll} style={{ '--n': n }} aria-label="Scroll wheel, click to notch" onClick={() => setN(n + 1)}>
      <i /><span>{n}</span>
    </button>
  );
}

/* 29 */ function Throttle() {
  const [a, bindA] = useDrag({ mode: 'y', init: 0.4 });
  const [b, bindB] = useDrag({ mode: 'y', init: 0.4 });
  return (
    <div className={c.throttle}>
      <div {...bindA} aria-label="Left throttle" style={{ ...bindA.style, '--v': a }}><i /></div>
      <div {...bindB} aria-label="Right throttle" style={{ ...bindB.style, '--v': b }}><i /></div>
      <output>{Math.abs(a - b) < 0.06 ? 'SYNC' : 'SPLIT'}</output>
    </div>
  );
}

/* 30 */ function Roulette() {
  const [turn, setTurn] = useState(0);
  const [hit, setHit] = useState(null);
  const spin = () => {
    const to = Math.floor(Math.random() * 12);
    setTurn((t) => Math.ceil(t / 360) * 360 + 1080 + (360 - to * 30 - 15));
    setHit(to);
  };
  return (
    <div className={c.roulette}>
      <button type="button" aria-label="Spin the roulette wheel" onClick={spin} style={{ '--t': `${turn}deg` }}><i /></button>
      <u /><output>{hit === null ? 'SPIN' : `№ ${hit + 1}`}</output>
    </div>
  );
}

/* 31 */ function Drum() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const [v, bind] = useDrag({ mode: 'y', steps: 6, init: 0.5 });
  return (
    <div className={c.drum} {...bind} aria-label="Day picker" style={{ ...bind.style, '--n': Math.round((1 - v) * 6) }}>
      <ol>{days.map((d) => <li key={d}>{d}</li>)}</ol><i />
    </div>
  );
}

/* 32 */ function Gyro() {
  return <div className={c.gyro} aria-hidden="true"><i /><i /><i /><b /></div>;
}

/* 33 */ function KitchenTimer() {
  const [v, bind, set] = useDrag({ mode: 'r', range: 330, init: 0 });
  const [running, setRunning] = useState(false);
  const tick = useTick(1000);
  const [from, setFrom] = useState(0);
  const left = running ? Math.max(0, Math.round(v * 3600) - (tick - from)) : Math.round(v * 3600);
  return (
    <div className={c.timer}>
      <div className={c.knob} {...bind} aria-label="Timer dial" style={{ ...bind.style, '--v': v }}><b /></div>
      <output>{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</output>
      <button type="button" aria-pressed={running} onClick={() => { setFrom(tick); setRunning(!running); if (running) set(left / 3600); }}>{running ? 'STOP' : 'START'}</button>
    </div>
  );
}

/* 34 */ function Metronome() {
  const [v, bind] = useDrag({ init: 0.35 });
  const bpm = Math.round(40 + v * 160);
  return (
    <div className={c.metro}>
      <div className={c.pend} style={{ '--d': `${(120 / bpm).toFixed(2)}s` }}><i /></div>
      <div className={c.track} {...bind} aria-label="Tempo" style={{ ...bind.style, '--v': v }}><u /></div>
      <output>{bpm} BPM</output>
    </div>
  );
}

/* 35 */ function Sundial() {
  const [v, bind] = useDrag({ init: 0.4 });
  return (
    <div className={c.sundial} {...bind} aria-label="Sun position" style={{ ...bind.style, '--v': v }}>
      <i /><b /><u /><span>{Math.floor(6 + v * 12)}:00</span>
    </div>
  );
}

/* 36 */ function Orbiter() {
  const [v, bind] = useDrag({ mode: 'r', range: 360, init: 0.5 });
  return <div className={c.orbiter} {...bind} aria-label="Orbit angle" style={{ ...bind.style, '--v': v }}><i /><b /></div>;
}

/* 37 */ function Flywheel() {
  const [spin, setSpin] = useState(0);
  const live = useLive();
  // the wheel slows by one step every 0.9 s while it is on screen
  useEffect(() => {
    if (!spin || !live) return undefined;
    const id = window.setTimeout(() => setSpin((s) => Math.max(0, s - 1)), 900);
    return () => window.clearTimeout(id);
  }, [spin, live]);
  return (
    <button type="button" className={c.fly} data-s={spin} aria-label="Flywheel, click to spin up" onClick={() => setSpin(Math.min(5, spin + 2))} style={{ '--d': spin ? `${(1.8 / spin).toFixed(2)}s` : '0s' }}>
      <i /><span>{spin * 120} RPM</span>
    </button>
  );
}

/* 38 */ function Thumbscrew() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={c.thumb} aria-pressed={on} aria-label="Thumbscrew" onClick={() => setOn(!on)}>
      <i /><b /><u />
    </button>
  );
}

/* 39 */ function Ratchet() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.ratchet} aria-label="Ratchet wheel, click to advance a tooth" onClick={() => setN(n + 1)}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d={gear(12, 36, 44)} style={{ transform: `rotate(${n * 30}deg)` }} />
        <path className={c.pawl} d="M78 12 L58 28 L64 32 L84 18 Z" style={{ transform: `rotate(${n % 2 ? -4 : 0}deg)` }} />
      </svg>
    </button>
  );
}

/* 40 */ function Inclinometer() {
  const [v, bind] = useDrag({ mode: 'r', range: 120, init: 0.5 });
  const deg = (v - 0.5) * 60;
  return (
    <div className={c.incl} {...bind} aria-label="Tilt" style={{ ...bind.style, '--v': v }}>
      <i><b /></i><span>{deg.toFixed(0)}°</span>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Detent knob', Detent, 'drag'], ['Chicken head', Chicken, 'drag'], ['Concentric pair', Concentric, 'drag'], ['Jog wheel', Jog, 'drag'],
    ['Click wheel', ClickWheel, 'drag'], ['LED ring', LedRing, 'drag'], ['Tuning dial', Tuning, 'drag'], ['Combination dial', Combination, 'drag'],
    ['Padlock rollers', Padlock, 'click'], ['Amp gain', Marshall, 'drag'], ['Knurled knob', Knurled, 'drag'], ['Arc slider', ArcSlider, 'drag'],
    ['Pie menu', PieMenu, 'click'], ['Needle setter', Needle, 'drag'], ['Pan knob', Pan, 'drag'], ['Rotary phone', RotaryPhone, 'click'],
    ['Compass bezel', Bezel, 'drag'], ['Steering wheel', Steering, 'drag'], ['Crank handle', Crank, 'drag'], ['Gear pair', Gears, 'click'],
    ['Alarm hands', Alarm, 'drag'], ['Thermostat ring', Thermostat, 'drag'], ['Heat ring', HeatRing, 'drag'], ['Stepped 6-way', Stepped, 'click'],
    ['Potentiometer', Pot, 'drag'], ['Joystick', Joystick, 'drag'], ['Trackball', Trackball, 'drag'], ['Scroll wheel', ScrollWheel, 'click'],
    ['Throttle pair', Throttle, 'drag'], ['Roulette', Roulette, 'click'], ['Drum picker', Drum, 'drag'], ['Gyro rings', Gyro, 'auto'],
    ['Kitchen timer', KitchenTimer, 'drag'], ['Metronome', Metronome, 'drag'], ['Sundial', Sundial, 'drag'], ['Orbiter', Orbiter, 'drag'],
    ['Flywheel', Flywheel, 'click'], ['Thumbscrew', Thumbscrew, 'click'], ['Ratchet', Ratchet, 'click'], ['Inclinometer', Inclinometer, 'drag'],
  ],
};
