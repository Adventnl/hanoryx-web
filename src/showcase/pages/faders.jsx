import { useState } from 'react';
import { useDrag, useToggle, clamp } from '../hooks';
import c from './faders.module.css';

/* ============================================================
   03 · FADERS — sliders on a rail that slides.
   The still side is an eight-channel desk whose caps ride the scroll.
   ============================================================ */

function Visual() {
  return (
    <div className={c.desk} aria-hidden="true">
      {Array.from({ length: 8 }, (_, k) => (
        <div key={k} className={c.lane} style={{ '--k': k }}>
          <i className={c.cap} />
          <b className={c.led} />
          <span>{k + 1}</span>
        </div>
      ))}
    </div>
  );
}

const WAVE = Array.from({ length: 44 }, (_, i) => 0.2 + 0.8 * Math.abs(Math.sin(i * 0.66) * Math.cos(i * 0.21)));
const HIST = Array.from({ length: 28 }, (_, i) => 0.15 + 0.85 * Math.exp(-(((i - 12) / 7) ** 2)) * (0.8 + 0.2 * Math.sin(i * 1.9)));
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

/* a track you drag along (thumb position as --v), with an aria-label */
function Track({ cls, label, init = 0.5, steps = 0, mode = 'x', children, onValue }) {
  const [v, bind] = useDrag({ mode, init, steps, onChange: onValue });
  return <div className={cls} {...bind} aria-label={label} style={{ ...bind.style, '--v': v }}>{children(v)}</div>;
}

/* 1 */ function Console() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.7 });
  return (
    <div className={c.console} style={{ '--v': v }}>
      <ol>{['+10', '0', '−10', '−20', '−40', '−∞'].map((t) => <li key={t}>{t}</li>)}</ol>
      <div className={c.slot} {...bind} aria-label="Channel fader" style={{ ...bind.style, '--v': v }}><i /></div>
      <output>{v > 0.01 ? `${((v - 0.7) * 33).toFixed(1)} dB` : '−∞'}</output>
    </div>
  );
}

/* 2 */ function DualRange() {
  const [lo, setLo] = useState(25);
  const [hi, setHi] = useState(70);
  return (
    <div className={c.dual} style={{ '--lo': lo, '--hi': hi }}>
      <input type="range" min="0" max="100" value={lo} aria-label="Range start" onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 4))} />
      <input type="range" min="0" max="100" value={hi} aria-label="Range end" onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 4))} />
      <span>{lo} – {hi}</span>
    </div>
  );
}

/* 3 */ function Stepped() {
  const [n, setN] = useState(4);
  return (
    <div className={c.stepped}>
      <input type="range" min="0" max="10" step="1" value={n} aria-label="Stepped slider" onChange={(e) => setN(Number(e.target.value))} />
      <ol>{Array.from({ length: 11 }, (_, i) => <li key={i} data-on={i <= n} />)}</ol>
      <output>{n} / 10</output>
    </div>
  );
}

/* 4 */ function VuFader() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.55 });
  return (
    <div className={c.vu}>
      <div className={c.slotV} {...bind} aria-label="Fader with meter" style={{ ...bind.style, '--v': v }}><i /></div>
      <ol>{Array.from({ length: 14 }, (_, i) => <li key={i} data-on={i / 13 <= v} data-hot={i > 10} />)}</ol>
    </div>
  );
}

/* 5 */ function Cross() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.cross}>
      <div className={c.crossTrack} {...bind} aria-label="Crossfader" style={{ ...bind.style, '--v': v }}><i /></div>
      <p><b>A {Math.round((1 - v) * 100)}</b><b>B {Math.round(v * 100)}</b></p>
    </div>
  );
}

/* 6 */ function LogFreq() {
  const [v, bind] = useDrag({ init: 0.5 });
  const hz = Math.round(20 * Math.pow(1000, v));
  return (
    <div className={c.log}>
      <div {...bind} aria-label="Frequency" style={{ ...bind.style, '--v': v }}><i /></div>
      <p><span>20</span><span>200</span><span>2k</span><span>20k</span></p>
      <output>{hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${hz} Hz`}</output>
    </div>
  );
}

/* 7 */ function Bubble() {
  return <Track cls={c.bubble} label="Slider with value bubble" init={0.4}>{(v) => <><i /><b>{Math.round(v * 100)}</b></>}</Track>;
}

/* 8 */ function HeatTrack() {
  return <Track cls={c.heat} label="Heat track" init={0.6}>{() => <i />}</Track>;
}

/* 9 */ function Balance() {
  return <Track cls={c.balance} label="Balance" init={0.62} steps={40}>{(v) => <><u /><i /><span>{v === 0.5 ? 'CENTRE' : v < 0.5 ? `L ${Math.round((0.5 - v) * 200)}` : `R ${Math.round((v - 0.5) * 200)}`}</span></>}</Track>;
}

/* 10 */ function CentreDetent() {
  const [v, bind] = useDrag({ init: 0.5, steps: 10 });
  return (
    <div className={c.detent}>
      <div {...bind} aria-label="Slider with a centre detent" style={{ ...bind.style, '--v': v }}><i /></div>
      <ol>{Array.from({ length: 11 }, (_, i) => <li key={i} data-mid={i === 5} data-on={i === Math.round(v * 10)} />)}</ol>
    </div>
  );
}

/* 11 */ function Tape() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.tape} {...bind} aria-label="Tape measure" style={{ ...bind.style, '--v': v }}>
      <ol>{Array.from({ length: 41 }, (_, i) => <li key={i} data-big={i % 5 === 0}>{i % 5 === 0 ? i * 2 : ''}</li>)}</ol>
      <i /><output>{(v * 80).toFixed(1)} cm</output>
    </div>
  );
}

/* 12 */ function Block() {
  const [n, setN] = useState(6);
  return (
    <div className={c.block} role="group" aria-label="Block meter">
      {Array.from({ length: 12 }, (_, i) => <button type="button" key={i} aria-label={`Level ${i + 1}`} aria-pressed={i < n} data-hot={i > 8} onClick={() => setN(i + 1 === n ? i : i + 1)} />)}
    </div>
  );
}

/* 13 */ function Segments() {
  const [v, bind] = useDrag({ init: 0.5, steps: 9 });
  return (
    <div className={c.segs} {...bind} aria-label="Segment bar" style={{ ...bind.style }}>
      {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i <= Math.round(v * 9)} />)}
    </div>
  );
}

/* 14 */ function HistRange() {
  const [lo, setLo] = useState(20);
  const [hi, setHi] = useState(68);
  return (
    <div className={c.hist} style={{ '--lo': lo, '--hi': hi }}>
      <ol>{HIST.map((h, i) => <li key={i} style={{ height: `${h * 100}%` }} data-in={(i / 27) * 100 >= lo && (i / 27) * 100 <= hi} />)}</ol>
      <input type="range" min="0" max="100" value={lo} aria-label="Histogram start" onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 5))} />
      <input type="range" min="0" max="100" value={hi} aria-label="Histogram end" onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 5))} />
    </div>
  );
}

/* 15 */ function Thermometer() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.55 });
  return (
    <div className={c.thermo} {...bind} aria-label="Thermometer" style={{ ...bind.style, '--v': v }}>
      <i /><b /><span>{Math.round(-10 + v * 50)}°</span>
    </div>
  );
}

/* 16 */ function Ladder() {
  const [n, setN] = useState(3);
  return (
    <div className={c.ladder} role="group" aria-label="Ladder">
      {Array.from({ length: 8 }, (_, i) => <button type="button" key={i} aria-label={`Rung ${8 - i}`} aria-pressed={8 - i === n} data-below={8 - i < n} onClick={() => setN(8 - i)} />)}
    </div>
  );
}

/* 17 */ function SlideRule() {
  const [v, bind] = useDrag({ init: 0.3 });
  return (
    <div className={c.rule} {...bind} aria-label="Slide rule" style={{ ...bind.style, '--v': v }}>
      <ol>{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <li key={n} style={{ left: `${Math.log10(n) * 100}%` }}>{n}</li>)}</ol>
      <ol className={c.slider}>{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <li key={n} style={{ left: `${Math.log10(n) * 100}%` }}>{n}</li>)}</ol>
    </div>
  );
}

/* 18 */ function Zipper() {
  const [v, bind] = useDrag({ init: 0.45 });
  return (
    <div className={c.zip} {...bind} aria-label="Zipper" style={{ ...bind.style, '--v': v }}>
      <i /><b />
    </div>
  );
}

/* 19 */ function RibbonPull() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.ribbon} {...bind} aria-label="Ribbon pull" style={{ ...bind.style, '--v': v }}>
      <i /><b />
    </div>
  );
}

/* 20 */ function MagnetSnap() {
  const [v, bind] = useDrag({ init: 0.25, steps: 4 });
  return (
    <div className={c.magnet} {...bind} aria-label="Magnetic snap slider" style={{ ...bind.style, '--v': v }}>
      {['XS', 'S', 'M', 'L', 'XL'].map((t) => <em key={t}>{t}</em>)}<i />
    </div>
  );
}

/* 21 */ function RubberBand() {
  const [s, setS] = useState({ x: 0.5, dy: 0 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setS({ x: clamp((e.clientX - r.left) / r.width), dy: clamp(e.clientY - (r.top + r.height / 2), -44, 44) });
  };
  const x = s.x * 100;
  const dy = s.dy;
  const left = Math.hypot(x, dy);
  const right = Math.hypot(100 - x, dy);
  return (
    <div className={c.band} aria-label="Rubber band" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(s.x * 100)} style={{ touchAction: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); }}
      onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) move(e); }}
      onPointerUp={() => setS((p) => ({ ...p, dy: 0 }))}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') setS((p) => ({ ...p, x: clamp(p.x + 0.05) })); if (e.key === 'ArrowLeft') setS((p) => ({ ...p, x: clamp(p.x - 0.05) })); }}>
      <u style={{ width: `${left}%`, transform: `rotate(${Math.atan2(dy, x) * 57.2958}deg)` }} />
      <u style={{ width: `${right}%`, left: `${x}%`, transform: `translateY(${dy}px) rotate(${Math.atan2(-dy, 100 - x) * 57.2958}deg)` }} />
      <i style={{ left: `${x}%`, transform: `translate(-50%, calc(-50% + ${dy}px))` }} />
    </div>
  );
}

/* 22 */ function VideoScrub() {
  const [v, bind] = useDrag({ init: 0.35 });
  const t = Math.round(v * 204);
  return (
    <div className={c.video}>
      <div className={c.frames} {...bind} aria-label="Video scrubber" style={{ ...bind.style, '--v': v }}>
        {Array.from({ length: 10 }, (_, i) => <b key={i} style={{ '--g': 0.1 + ((i * 37) % 10) / 14 }} />)}<i />
      </div>
      <output>{Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')} / 3:24</output>
    </div>
  );
}

/* 23 */ function WaveScrub() {
  const [v, bind] = useDrag({ init: 0.4 });
  return (
    <div className={c.wave} {...bind} aria-label="Waveform scrubber" style={{ ...bind.style, '--v': v }}>
      {WAVE.map((h, i) => <i key={i} style={{ height: `${h * 100}%` }} data-on={i / WAVE.length <= v} />)}
    </div>
  );
}

/* 24 */ function MonthRange() {
  const [r, setR] = useState([2, 5]);
  const [anchor, setAnchor] = useState(null);
  const at = (i) => { if (anchor === null) { setAnchor(i); setR([i, i]); } else { setR([Math.min(anchor, i), Math.max(anchor, i)]); setAnchor(null); } };
  return (
    <div className={c.months} role="group" aria-label="Month range, choose two months">
      {MONTHS.map((m, i) => <button type="button" key={i} aria-label={`Month ${i + 1}`} aria-pressed={i >= r[0] && i <= r[1]} data-edge={i === r[0] || i === r[1]} onClick={() => at(i)}>{m}</button>)}
    </div>
  );
}

/* 25 */ function Price() {
  const [lo, setLo] = useState(40);
  const [hi, setHi] = useState(160);
  return (
    <div className={c.price}>
      <label>MIN<input type="number" min="0" max="200" value={lo} onChange={(e) => setLo(clamp(Number(e.target.value), 0, hi))} aria-label="Minimum price" /></label>
      <div style={{ '--lo': lo / 2, '--hi': hi / 2 }}><u /></div>
      <label>MAX<input type="number" min="0" max="200" value={hi} onChange={(e) => setHi(clamp(Number(e.target.value), lo, 200))} aria-label="Maximum price" /></label>
    </div>
  );
}

/* 26 */ function PitchBend() {
  const [v, bind, set] = useDrag({ mode: 'y', init: 0.5 });
  return (
    <div className={c.pitch} {...bind} onPointerUp={() => set(0.5)} aria-label="Pitch bend, springs back" style={{ ...bind.style, '--v': v }}>
      <i /><span>{v > 0.52 ? 'UP' : v < 0.48 ? 'DOWN' : 'FLAT'}</span>
    </div>
  );
}

/* 27 */ function Blinds() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.4 });
  return (
    <div className={c.blinds} style={{ '--v': v }}>
      <div>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
      <p {...bind} aria-label="Blinds cord" style={{ ...bind.style, '--v': v }}><b /></p>
    </div>
  );
}

/* 28 */ function SunSlider() {
  return (
    <Track cls={c.sun} label="Brightness" init={0.5}>
      {(v) => <><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r={5 + v * 5} />{Array.from({ length: 8 }, (_, i) => <path key={i} d="M20 3v5" style={{ transform: `rotate(${i * 45}deg) scaleY(${0.5 + v})`, transformOrigin: '20px 20px' }} />)}</svg><i /></>}
    </Track>
  );
}

/* 29 */ function Plates() {
  const [v, bind] = useDrag({ init: 0.45, steps: 8 });
  const n = Math.round(v * 8);
  return (
    <div className={c.plates} {...bind} aria-label="Plate loader" style={{ ...bind.style }}>
      <div>{Array.from({ length: 8 }, (_, i) => <i key={i} data-on={i < n} style={{ height: `${100 - i * 7}%` }} />)}<b /></div>
      <output>{20 + n * 10} KG</output>
    </div>
  );
}

/* 30 */ function SpeedRuler() {
  const [v, bind] = useDrag({ init: 0.4 });
  return (
    <div className={c.speed} {...bind} aria-label="Speed" style={{ ...bind.style, '--v': v }}>
      <ol>{Array.from({ length: 21 }, (_, i) => <li key={i} data-big={i % 5 === 0} />)}</ol><i /><span>{Math.round(v * 200)}<small> KM/H</small></span>
    </div>
  );
}

/* 31 */ function Alpha() {
  return <Track cls={c.alpha} label="Opacity" init={0.65}>{(v) => <><u /><i /><span>{Math.round(v * 100)}%</span></>}</Track>;
}

/* 32 */ function Tint() {
  return <Track cls={c.tint} label="Tint" init={0.3}>{() => <i />}</Track>;
}

/* 33 */ function SizeMarks() {
  const [v, bind] = useDrag({ init: 0.5, steps: 3 });
  const n = Math.round(v * 3);
  return (
    <div className={c.sizes}>
      <div {...bind} aria-label="Size" style={{ ...bind.style, '--v': v }}><i /></div>
      <ol>{['S', 'M', 'L', 'XL'].map((t, i) => <li key={t} data-on={i === n}>{t}</li>)}</ol>
    </div>
  );
}

/* 34 */ function Triple() {
  const [p, setP] = useState([0.2, 0.5, 0.8]);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width);
    setP((cur) => {
      const k = cur.reduce((best, q, i) => (Math.abs(q - x) < Math.abs(cur[best] - x) ? i : best), 0);
      return cur.map((q, i) => (i === k ? x : q)).sort((a, b) => a - b);
    });
  };
  return (
    <div className={c.triple} role="group" aria-label="Three thumbs" style={{ touchAction: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); }}
      onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) move(e); }}>
      <u style={{ left: `${p[0] * 100}%`, right: `${(1 - p[2]) * 100}%` }} />
      {p.map((q, i) => <i key={i} style={{ left: `${q * 100}%` }} data-mid={i === 1} />)}
    </div>
  );
}

/* 35 */ function FanSpeed() {
  const [n, setN] = useState(2);
  return (
    <div className={c.fan} style={{ '--d': n ? `${(2.4 / n).toFixed(2)}s` : '0s' }} data-n={n}>
      <svg viewBox="0 0 40 40" aria-hidden="true"><g><path d="M20 20C20 10 28 6 31 12 28 14 24 16 20 20ZM20 20C30 20 34 28 28 31 26 28 24 24 20 20ZM20 20C20 30 12 34 9 28 12 26 16 24 20 20ZM20 20C10 20 6 12 12 9 14 12 16 16 20 20Z" /></g></svg>
      <input type="range" min="0" max="4" step="1" value={n} aria-label="Fan speed" onChange={(e) => setN(Number(e.target.value))} />
    </div>
  );
}

/* 36 */ function Charge() {
  const [v, bind] = useDrag({ init: 0.62, steps: 10 });
  return (
    <div className={c.charge} {...bind} aria-label="Charge level" style={{ ...bind.style, '--v': v }}>
      <div><i /></div><u /><span>{Math.round(v * 100)}%</span>
    </div>
  );
}

/* 37 */ function RopeTension() {
  const [v, bind] = useDrag({ init: 0.4 });
  const sag = (1 - v) * 38;
  return (
    <div className={c.rope} {...bind} aria-label="Rope tension" style={{ ...bind.style }}>
      <svg viewBox="0 0 200 60" aria-hidden="true"><path d={`M6 10Q100 ${10 + sag * 2} 194 10`} /><circle cx="100" cy={10 + sag} r="4" /><circle cx="6" cy="10" r="4" /><circle cx="194" cy="10" r="4" /></svg>
      <span>{Math.round(v * 100)} N</span>
    </div>
  );
}

/* 38 */ function ChapterSeek() {
  const [v, bind] = useDrag({ init: 0.3 });
  const marks = [0.12, 0.34, 0.58, 0.81];
  const names = ['Intro', 'Setup', 'Build', 'Ship', 'Outro'];
  const at = marks.filter((m) => m <= v).length;
  return (
    <div className={c.chapters}>
      <div {...bind} aria-label="Chapter seek" style={{ ...bind.style, '--v': v }}>{marks.map((m) => <u key={m} style={{ left: `${m * 100}%` }} />)}<i /></div>
      <output>{String(at + 1).padStart(2, '0')} · {names[at]}</output>
    </div>
  );
}

/* 39 */ function EqTrio() {
  const [a, bindA] = useDrag({ mode: 'y', init: 0.6 });
  const [b, bindB] = useDrag({ mode: 'y', init: 0.5 });
  const [d, bindD] = useDrag({ mode: 'y', init: 0.4 });
  return (
    <div className={c.eq}>
      {[['LO', a, bindA], ['MID', b, bindB], ['HI', d, bindD]].map(([t, v, bind]) => (
        <div key={t}><div {...bind} aria-label={`${t} band`} style={{ ...bind.style, '--v': v }}><i /></div><span>{t}</span></div>
      ))}
    </div>
  );
}

/* 40 */ function Lockable() {
  const [locked, flip] = useToggle();
  const [v, bind] = useDrag({ init: 0.5 });
  const guard = locked ? { ...bind, onPointerDown: undefined, onPointerMove: undefined, onKeyDown: undefined, tabIndex: -1, 'aria-disabled': true } : bind;
  return (
    <div className={c.lockable} data-locked={locked}>
      <div {...guard} aria-label="Lockable slider" style={{ ...bind.style, '--v': v }}><i /></div>
      <button type="button" aria-pressed={locked} aria-label="Lock the slider" onClick={flip}>{locked ? 'LOCKED' : 'FREE'}</button>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Console fader', Console, 'drag'], ['Dual range', DualRange, 'drag'], ['Stepped slider', Stepped, 'drag'], ['VU fader', VuFader, 'drag'],
    ['Crossfader', Cross, 'drag'], ['Log frequency', LogFreq, 'drag'], ['Value bubble', Bubble, 'drag'], ['Heat track', HeatTrack, 'drag'],
    ['Balance bar', Balance, 'drag'], ['Centre detent', CentreDetent, 'drag'], ['Tape measure', Tape, 'drag'], ['Block meter', Block, 'click'],
    ['Segment bar', Segments, 'drag'], ['Histogram range', HistRange, 'drag'], ['Thermometer', Thermometer, 'drag'], ['Rung ladder', Ladder, 'click'],
    ['Slide rule', SlideRule, 'drag'], ['Zipper', Zipper, 'drag'], ['Ribbon pull', RibbonPull, 'drag'], ['Magnet snap', MagnetSnap, 'drag'],
    ['Rubber band', RubberBand, 'drag'], ['Video scrub', VideoScrub, 'drag'], ['Waveform scrub', WaveScrub, 'drag'], ['Month range', MonthRange, 'click'],
    ['Price range', Price, 'type'], ['Pitch bend', PitchBend, 'drag'], ['Blinds pull', Blinds, 'drag'], ['Sun slider', SunSlider, 'drag'],
    ['Plate loader', Plates, 'drag'], ['Speed ruler', SpeedRuler, 'drag'], ['Alpha slider', Alpha, 'drag'], ['Tint slider', Tint, 'drag'],
    ['Size marks', SizeMarks, 'drag'], ['Triple thumb', Triple, 'drag'], ['Fan speed', FanSpeed, 'drag'], ['Charge slider', Charge, 'drag'],
    ['Rope tension', RopeTension, 'drag'], ['Chapter seek', ChapterSeek, 'drag'], ['EQ trio', EqTrio, 'drag'], ['Lockable slider', Lockable, 'drag'],
  ],
};
