import { useEffect, useMemo, useRef, useState } from 'react';
import { clamp, rng, useCycle, useDrag, useLive, useTick, useToggle } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { curve } from '../kit';
import { Ico } from '../icons';
import c from './studio.module.css';

/* ============================================================
   37 · STUDIO — meters, reels and faders for sound.
   Nothing here makes a sound: these are the faces of studio gear. The still
   side is a VU meter whose needle follows a swinging signal that the scroll
   scrubs — a loud passage, a quiet one, a peak. Specimens that would be moving
   in a studio move by themselves while on screen (never under reduced motion),
   and the ones you operate are real controls with values you can read.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.vuBig}>
        <svg viewBox="0 0 100 62">
          <path d="M10 52A46 46 0 0 1 90 52" className={c.arcBase} />
          <path d="M66 14A46 46 0 0 1 90 52" className={c.arcHot} />
          {Array.from({ length: 11 }, (_, k) => { const a = -50 + k * 10; const r = (a * Math.PI) / 180; const x1 = 50 + Math.sin(r) * 44; const y1 = 62 - Math.cos(r) * 44; const x2 = 50 + Math.sin(r) * (k % 5 === 0 ? 36 : 40); const y2 = 62 - Math.cos(r) * (k % 5 === 0 ? 36 : 40); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={c.vtick} />; })}
          <text x="50" y="40" textAnchor="middle" className={c.vText}>VU</text>
        </svg>
        <i />
        <b />
      </div>
      <div className={c.visBars}>{Array.from({ length: 20 }, (_, k) => <u key={k} style={{ '--k': k }} />)}</div>
      <small>1 NEEDLE · 20 BANDS</small>
    </div>
  );
}

/* gentle fake levels that move while the specimen is on screen */
function useLevels(n, ms = 140) {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const [vals, setVals] = useState(() => Array.from({ length: n }, (_, i) => 0.3 + ((i * 37) % 50) / 100));
  const t = useRef(0);
  useEffect(() => {
    if (!live || reduced) return undefined;
    const id = setInterval(() => {
      t.current += 1;
      setVals((a) => a.map((_, i) => clamp(0.45 + 0.32 * Math.sin(t.current * (0.25 + i * 0.07) + i * 1.7) + 0.16 * Math.sin(t.current * 0.9 + i * 3.1), 0.05, 0.98)));
    }, ms);
    return () => clearInterval(id);
  }, [live, reduced, ms]);
  return vals;
}

/* 1 */ function Vu() {
  const [v] = useLevels(1, 180);
  const [hit, setHit] = useState(0);
  return (
    <button type="button" className={c.vu} onClick={() => setHit((h) => h + 1)} aria-label="VU meter. Press for a peak">
      <svg viewBox="0 0 100 62" aria-hidden="true"><path d="M10 52A46 46 0 0 1 90 52" className={c.arcBase} /><path d="M66 14A46 46 0 0 1 90 52" className={c.arcHot} /><text x="50" y="42" textAnchor="middle" className={c.vText}>VU</text><g className={c.needle} style={{ transform: `rotate(${-48 + (hit % 2 ? 0.98 : v) * 96}deg)` }}><path d="M49.2 62 50 14 50.8 62z" /></g><circle cx="50" cy="62" r="3" className={c.cap} /></svg>
    </button>
  );
}

/* 2 */ function LedMeter() {
  const [l, r] = useLevels(2, 120);
  return (
    <div className={c.led} role="img" aria-label="Stereo level">
      {[l, r].map((v, ch) => <div key={ch}>{Array.from({ length: 14 }, (_, k) => <i key={k} data-on={k / 14 < v} style={{ '--k': k }} />)}</div>)}
    </div>
  );
}

/* 3 */ function Reels() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.reels} data-on={on} aria-pressed={on} aria-label="Tape reels. Press to stop or start" onClick={flip}><i /><i /><b /></button>;
}

/* 4 */ function Cassette() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.cassette} data-on={on} aria-pressed={on} aria-label="Cassette. Press to stop or start" onClick={flip}><span><i /><i /></span><u /></button>;
}

/* 5 */ function Vinyl() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.vinyl} data-on={on} aria-pressed={on} aria-label="Turntable. Press to stop or start" onClick={flip}><i /><b /><s /></button>;
}

/* 6 */ function Fader() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.7 });
  const db = v < 0.02 ? '−∞' : (20 * Math.log10(v / 0.75)).toFixed(1);
  return (
    <div className={c.fader}>
      <div {...bind} aria-label="Channel fader" aria-valuetext={`${db} dB`} style={{ ...bind.style, '--v': v }}>{Array.from({ length: 11 }, (_, k) => <u key={k} />)}<i /></div>
      <output>{db}<small>dB</small></output>
    </div>
  );
}

/* 7 */ function Pan() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.5, range: 270 });
  const p = Math.round((v - 0.5) * 100);
  return (
    <div className={c.pan}>
      <div {...bind} aria-label="Pan" aria-valuetext={p === 0 ? 'centre' : p < 0 ? `${-p} left` : `${p} right`} style={{ ...bind.style, '--v': v }}><i /></div>
      <output>{p === 0 ? 'C' : p < 0 ? `L${-p}` : `R${p}`}</output>
    </div>
  );
}

/* 8 */ function Buttons() {
  const [s, setS] = useState({ M: false, S: true, R: false });
  return <div className={c.msr} role="group" aria-label="Mute, solo, arm">{['M', 'S', 'R'].map((k) => <button key={k} type="button" aria-pressed={s[k]} aria-label={{ M: 'Mute', S: 'Solo', R: 'Record arm' }[k]} data-k={k} onClick={() => setS((o) => ({ ...o, [k]: !o[k] }))}>{k}</button>)}</div>;
}

/* 9 */ function Strip() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.72 });
  const [l] = useLevels(1, 130);
  const [mute, flip] = useToggle();
  return (
    <div className={c.strip} data-mute={mute}>
      <span className={c.sMeter} role="img" aria-label="Level"><i style={{ height: `${(mute ? 0.02 : l * v) * 100}%` }} /></span>
      <div className={c.sFader} {...bind} aria-label="Strip fader" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}><i /></div>
      <button type="button" aria-pressed={mute} onClick={flip}>M</button>
      <b>CH 1</b>
    </div>
  );
}

/* 10 */ function Cross() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.cross} {...bind} aria-label="Crossfader" aria-valuetext={v < 0.1 ? 'deck A' : v > 0.9 ? 'deck B' : `${Math.round((1 - v) * 100)} A, ${Math.round(v * 100)} B`} style={{ ...bind.style, '--v': v }}>
      <span style={{ opacity: 1 - v * 0.7 }}>A</span><i /><span style={{ opacity: 0.3 + v * 0.7 }}>B</span>
    </div>
  );
}

const WAVE = (() => { const r = rng(21); return Array.from({ length: 56 }, (_, k) => 0.12 + 0.82 * Math.abs(Math.sin(k / 6.5) * Math.sin(k / 2.3 + 1)) * (0.5 + r() * 0.5)); })();

/* 11 */ function Scrub() {
  const [v, bind] = useDrag({ init: 0.38 });
  return (
    <div className={c.wave} {...bind} aria-label="Waveform playhead" aria-valuetext={`${(v * 3.6).toFixed(1)} seconds`} style={{ ...bind.style, '--v': v }}>
      {WAVE.map((h, k) => <u key={k} data-past={k / WAVE.length < v} style={{ height: `${h * 100}%` }} />)}
      <i />
    </div>
  );
}

/* 12 */ function ZoomWave() {
  const [z, setZ] = useState(0.3);
  return (
    <div className={c.zoomWave}>
      <div><div style={{ '--z': 1 + z * 3 }}>{WAVE.map((h, k) => <u key={k} style={{ height: `${h * 100}%` }} />)}</div></div>
      <input type="range" min="0" max="1" step="0.01" value={z} onChange={(e) => setZ(Number(e.target.value))} aria-label="Waveform zoom" />
    </div>
  );
}

/* 13 */ function Loop() {
  const [a, bindA] = useDrag({ init: 0.25 });
  const [b, bindB] = useDrag({ init: 0.7 });
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return (
    <div className={c.loop} style={{ '--a': lo, '--b': hi }}>
      <div className={c.loopWave}>{WAVE.map((h, k) => <u key={k} style={{ height: `${h * 100}%` }} />)}<i /></div>
      <div className={c.loopA} {...bindA} aria-label="Loop start" aria-valuetext={`${(a * 3.6).toFixed(1)} s`} style={bindA.style} />
      <div className={c.loopB} {...bindB} aria-label="Loop end" aria-valuetext={`${(b * 3.6).toFixed(1)} s`} style={bindB.style} />
    </div>
  );
}

/* 14 */ function Spectrum() {
  const v = useLevels(16, 110);
  return <div className={c.spec} role="img" aria-label="Spectrum analyser">{v.map((h, k) => <i key={k} style={{ height: `${h * 100}%`, '--k': k }} />)}</div>;
}

/* 15 */ function Spectrogram() {
  const t = useTick(120);
  const cells = useMemo(() => Array.from({ length: 12 * 8 }, (_, i) => (i * 37 + 11) % 100), []);
  return <div className={c.gram} role="img" aria-label="Spectrogram">{cells.map((v, i) => <i key={i} style={{ '--h': ((Math.floor(i / 8) + t) % 12) * 28 + (v % 30), '--l': 22 + (((Math.floor(i / 8) * 7 + (i % 8) * 13 + t * 5) % 100) / 100) * 40 }} />)}</div>;
}

/* 16 */ function Scope() {
  return <svg className={c.scope} viewBox="0 0 120 60" role="img" aria-label="Oscilloscope"><path d="M0 30h120M0 10h120M0 50h120M20 0v60M40 0v60M60 0v60M80 0v60M100 0v60" className={c.grid} /><path d="M0 30Q15 -5 30 30T60 30T90 30T120 30" className={c.trace} /><path d="M0 30Q15 -5 30 30T60 30T90 30T120 30" className={`${c.trace} ${c.trace2}`} /></svg>;
}

/* 17 */ function Phase() {
  return <div className={c.phase} role="img" aria-label="Phase scope"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" className={c.grid} /><path d="M6 50h88M50 6v88" className={c.grid} /><path className={c.lis} d="M50 8C80 8 92 30 92 50S80 92 50 92 8 70 8 50 20 8 50 8Z" /></svg></div>;
}

/* 18 */ function EqCurve() {
  const [lo, bLo] = useDrag({ mode: 'y', init: 0.62 });
  const [mid, bMid] = useDrag({ mode: 'y', init: 0.45 });
  const [hi, bHi] = useDrag({ mode: 'y', init: 0.58 });
  const p = [[0, 0.5], [18, lo], [50, mid], [82, hi], [100, 0.5]].map(([x, y]) => [x, 50 - (y - 0.5) * 80]);
  return (
    <div className={c.eq}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M0 50h100M25 0v100M50 0v100M75 0v100" className={c.grid} /><path d={curve(p)} className={c.trace} /></svg>
      <div>{[['Low', lo, bLo], ['Mid', mid, bMid], ['High', hi, bHi]].map(([n, v, b]) => <span key={n}><div {...b} aria-label={`${n} gain`} aria-valuetext={`${((v - 0.5) * 24).toFixed(1)} dB`} style={{ ...b.style, '--v': v }}><i /></div><small>{n}</small></span>)}</div>
    </div>
  );
}

/* 19 */ function Comp() {
  const [r, setR] = useState(0.4);
  const ratio = 1 + r * 9;
  return (
    <div className={c.comp}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M0 100 100 0" className={c.grid} /><path d={`M0 100 L50 50 L100 ${50 - 50 / ratio}`} className={c.trace} /><circle cx="50" cy="50" r="2.4" className={c.pt} /></svg>
      <label><span>Ratio {ratio.toFixed(1)}:1</span><input type="range" min="0" max="1" step="0.01" value={r} onChange={(e) => setR(Number(e.target.value))} aria-label="Ratio" /></label>
    </div>
  );
}

/* 20 */ function Gate() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.4 });
  const [l] = useLevels(1, 150);
  const open = l > v;
  return (
    <div className={c.gate}>
      <div {...bind} aria-label="Gate threshold" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v, '--l': l }}><i /><b /></div>
      <span data-open={open}>{open ? 'OPEN' : 'SHUT'}</span>
    </div>
  );
}

/* 21 */ function Limiter() {
  const [l] = useLevels(1, 130);
  const gr = Math.max(0, l - 0.62);
  return <div className={c.lim} role="img" aria-label="Limiter gain reduction"><i style={{ height: `${gr * 220}%` }} /><span>GR</span></div>;
}

/* 22 */ function Adsr() {
  const [a, bA] = useDrag({ init: 0.2 });
  const [d, bD] = useDrag({ init: 0.35 });
  const [s, bS] = useDrag({ init: 0.6 });
  const [r, bR] = useDrag({ init: 0.4 });
  const x1 = 4 + a * 26;
  const x2 = x1 + 4 + d * 22;
  const y2 = 54 - s * 44;
  const x3 = 78;
  const x4 = x3 + 4 + r * 14;
  return (
    <div className={c.adsr}>
      <svg viewBox="0 0 100 60" aria-hidden="true"><path d={`M4 56 L${x1} 8 L${x2} ${y2} L${x3} ${y2} L${x4} 56`} className={c.trace} /></svg>
      <div>{[['A', a, bA], ['D', d, bD], ['S', s, bS], ['R', r, bR]].map(([n, v, b]) => <span key={n}><div {...b} aria-label={{ A: 'Attack', D: 'Decay', S: 'Sustain', R: 'Release' }[n]} aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...b.style, '--v': v }}><i /></div><small>{n}</small></span>)}</div>
    </div>
  );
}

/* 23 */ function Lfo() {
  const shapes = [['Sine', 'M0 20C10 -4 20 -4 30 20S50 44 60 20'], ['Tri', 'M0 20 15 4 45 36 60 20'], ['Saw', 'M0 36 30 4V36L60 4'], ['Square', 'M0 36V6H30V36H60V6']];
  const [k, setK] = useState(0);
  return (
    <div className={c.lfo}>
      <svg viewBox="0 0 60 40" aria-hidden="true"><path d={shapes[k][1]} /><circle r="2" className={c.runner}><animateMotion dur="2.4s" repeatCount="indefinite" path={shapes[k][1]} /></circle></svg>
      <div role="radiogroup" aria-label="LFO shape">{shapes.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}>{n}</button>)}</div>
    </div>
  );
}

/* 24 */ function Osc() {
  const shapes = ['M2 20C8 2 14 2 20 20S32 38 38 20', 'M2 34 20 6 38 34', 'M2 34 22 6V34H38', 'M2 34V6H20V34H38'];
  const [k, setK] = useState(2);
  return <div className={c.osc} role="radiogroup" aria-label="Oscillator wave">{shapes.map((d, i) => <button key={i} type="button" role="radio" aria-checked={i === k} aria-label={['Sine', 'Triangle', 'Saw', 'Square'][i]} onClick={() => setK(i)}><svg viewBox="0 0 40 40" aria-hidden="true"><path d={d} /></svg></button>)}</div>;
}

/* 25 */ function Filter() {
  const [x, setX] = useState(0.5);
  const [q, setQ] = useState(0.4);
  const bx = 15 + x * 70;
  return (
    <div className={c.filter}>
      <svg viewBox="0 0 100 60" aria-hidden="true"><path d={`M0 20 H${bx - 18} C${bx - 8} 20 ${bx - 6} ${24 - q * 22} ${bx} ${24 - q * 22} S${bx + 8} 56 ${bx + 20} 56 H100`} className={c.trace} /></svg>
      <div><input type="range" min="0" max="1" step="0.01" value={x} onChange={(e) => setX(Number(e.target.value))} aria-label="Cutoff" /><input type="range" min="0" max="1" step="0.01" value={q} onChange={(e) => setQ(Number(e.target.value))} aria-label="Resonance" /></div>
    </div>
  );
}

/* 26 */ function Reverb() {
  const [v, bind] = useDrag({ init: 0.5 });
  return <div className={c.verb} {...bind} aria-label="Reverb size" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}>{[0, 1, 2, 3].map((k) => <i key={k} style={{ '--k': k }} />)}<b /></div>;
}

/* 27 */ function Delay() {
  return <div className={c.delay} role="img" aria-label="Delay taps fading away">{[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ '--k': k }} />)}</div>;
}

/* 28 */ function Sequencer() {
  const [on, setOn] = useState(() => Array.from({ length: 16 }, (_, k) => k % 4 === 0 || k === 6 || k === 11));
  const t = useCycle(16, 220);
  return (
    <div className={c.seq} role="group" aria-label="Step sequencer">
      {on.map((x, k) => <button key={k} type="button" aria-pressed={x} aria-label={`Step ${k + 1}`} data-now={k === t} onClick={() => setOn((a) => a.map((y, j) => (j === k ? !y : y)))} />)}
    </div>
  );
}

/* 29 */ function Pads() {
  const [hit, setHit] = useState(-1);
  const auto = useCycle(16, 450);
  return (
    <div className={c.pads} role="group" aria-label="Drum pads">
      {Array.from({ length: 16 }, (_, k) => <button key={k} type="button" aria-label={`Pad ${k + 1}`} data-hit={hit === k || (hit < 0 && auto === ((k * 5) % 16))} onPointerDown={() => setHit(k)} onPointerUp={() => setHit(-1)} onPointerLeave={() => setHit(-1)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHit(k); }} onKeyUp={() => setHit(-1)} />)}
    </div>
  );
}

/* 30 */ function Keys() {
  const [k, setK] = useState(-1);
  const white = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
  return (
    <div className={c.keys} role="group" aria-label="Piano keys">
      {white.map((n, i) => <button key={i} type="button" aria-label={`Key ${n}`} data-on={k === i} onPointerDown={() => setK(i)} onPointerUp={() => setK(-1)} onPointerLeave={() => setK(-1)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setK(i); }} onKeyUp={() => setK(-1)}><span>{n}</span></button>)}
      {[0, 1, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} aria-hidden="true" />)}
    </div>
  );
}

/* 31 */ function TapTempo() {
  const [taps, setTaps] = useState([]);
  const bpm = taps.length > 1 ? Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1))) : 0;
  return (
    <div className={c.tap}>
      <button type="button" onClick={() => setTaps((a) => [...a.slice(-5), performance.now()])}>TAP</button>
      <output aria-live="polite">{bpm || '—'}<small>BPM</small></output>
      <button type="button" className={c.reset} onClick={() => setTaps([])}>reset</button>
    </div>
  );
}

/* 32 */ function Metronome() { return <div className={c.metro} role="img" aria-label="Metronome"><i /><b /></div>; }

/* 33 */ function Tuner() {
  const [v] = useLevels(1, 220);
  const cents = Math.round((v - 0.5) * 80);
  return (
    <div className={c.tuner} role="img" aria-label={`Tuner: A, ${cents} cents`}>
      <div><i style={{ left: `${50 + cents * 0.9}%` }} /></div>
      <b data-ok={Math.abs(cents) < 6}>A</b><small>{cents > 0 ? '+' : ''}{cents}¢</small>
    </div>
  );
}

/* 34 */ function Timecode() {
  const t = useTick(1000);
  const s = 123 + t;
  return <div className={c.tc} role="timer" aria-label="Timecode"><output>{String(Math.floor(s / 60)).padStart(2, '0')}:{String(s % 60).padStart(2, '0')}:{String((t * 7) % 25).padStart(2, '0')}</output></div>;
}

/* 35 */ function Lufs() {
  const [l] = useLevels(1, 200);
  const v = 0.35 + l * 0.4;
  return <div className={c.lufs} role="img" aria-label={`Loudness ${(-30 + v * 22).toFixed(1)} LUFS`}><i style={{ width: `${v * 100}%` }} /><b /><span>{(-30 + v * 22).toFixed(1)} LUFS</span></div>;
}

/* 36 */ function GainStage() {
  const [g, bind] = useDrag({ init: 0.5 });
  return (
    <div className={c.stage}>
      {[['IN', 0.5], ['PRE', g], ['OUT', Math.min(1, g * 0.9 + 0.1)]].map(([n, v]) => <span key={n}><i style={{ height: `${v * 100}%`, background: v > 0.85 ? '#ff4747' : v > 0.7 ? '#ffb347' : '#3dd68c' }} /><small>{n}</small></span>)}
      <div className={c.stageGain} {...bind} aria-label="Preamp gain" aria-valuetext={`${Math.round(g * 60)} dB`} style={{ ...bind.style, '--v': g }}><i /></div>
    </div>
  );
}

/* 37 */ function Patch() {
  const [from, setFrom] = useState(-1);
  const [links, setLinks] = useState([[0, 1], [2, 3]]);
  const click = (side, k) => {
    if (side === 0) { setFrom(from === k ? -1 : k); return; }
    if (from < 0) return;
    setLinks((l) => (l.some(([a, b]) => a === from && b === k) ? l.filter(([a, b]) => !(a === from && b === k)) : [...l, [from, k]]));
    setFrom(-1);
  };
  return (
    <div className={c.patch} role="group" aria-label="Patch bay: choose an output, then an input">
      <svg viewBox="0 0 100 60" aria-hidden="true">{links.map(([a, b], i) => <path key={i} d={`M12 ${10 + a * 13}C45 ${10 + a * 13} 55 ${10 + b * 13} 88 ${10 + b * 13}`} className={c.cable} />)}</svg>
      {[0, 1].map((side) => <div key={side}>{[0, 1, 2, 3].map((k) => <button key={k} type="button" aria-label={`${side ? 'Input' : 'Output'} ${k + 1}`} aria-pressed={side === 0 && from === k} onClick={() => click(side, k)} />)}</div>)}
    </div>
  );
}

/* 38 */ function Phones() {
  const [n, setN] = useState(6);
  return (
    <div className={c.phones}>
      <button type="button" aria-label={`Headphone volume ${n} of 11. Press to raise`} onClick={() => setN((n + 1) % 12)} style={{ '--n': n }}><i /></button>
      <output>{n}</output>
    </div>
  );
}

/* 39 */ function MicRing() {
  const [l] = useLevels(1, 100);
  return <div className={c.mic} role="img" aria-label="Microphone level" style={{ '--l': l }}><i /><i /><Ico n="mic" /></div>;
}

/* 40 */ function RecArm() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.rec} aria-pressed={on} onClick={flip} data-on={on}><i /><span>{on ? 'REC' : 'ARM'}</span></button>;
}

/* 41 */ function Transport() {
  const [s, setS] = useState('play');
  return (
    <div className={c.transport} role="group" aria-label="Transport">
      {[['prev', 'Rewind'], ['stop', 'Stop'], ['play', 'Play'], ['rec', 'Record']].map(([k, t]) => <button key={k} type="button" aria-pressed={s === k} aria-label={t} data-k={k} onClick={() => setS(s === k ? 'stop' : k)}>{k === 'stop' ? <i /> : k === 'rec' ? <b /> : <Ico n={k === 'prev' ? 'prev' : 'play'} />}</button>)}
    </div>
  );
}

/* 42 */ function Markers() {
  const [m, setM] = useState([18, 54, 82]);
  return (
    <div className={c.marks} role="application" aria-label="Timeline: click to drop a marker, press Backspace to clear" tabIndex={0} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setM((a) => [...a.slice(-5), ((e.clientX - r.left) / r.width) * 100]); }} onKeyDown={(e) => { if (e.key === 'Enter') setM((a) => [...a.slice(-5), 20 + (a.length * 17) % 60]); if (e.key === 'Backspace') setM([]); }}>
      {Array.from({ length: 25 }, (_, k) => <u key={k} data-big={k % 4 === 0} />)}
      {m.map((x, i) => <b key={`${i}-${Math.round(x)}`} style={{ left: `${x}%` }}><span>{i + 1}</span></b>)}
    </div>
  );
}

export default {
  Visual,
  items: [
    ['VU meter', Vu, 'click'], ['Peak LEDs', LedMeter, 'auto'], ['Reel-to-reel', Reels, 'click'], ['Cassette deck', Cassette, 'click'],
    ['Record deck', Vinyl, 'click'], ['Channel fader', Fader, 'drag'], ['Pan pot', Pan, 'drag'], ['Mute solo arm', Buttons, 'click'],
    ['Mixer strip', Strip, 'drag'], ['DJ crossfade', Cross, 'drag'], ['Wave scrub', Scrub, 'drag'], ['Waveform zoom', ZoomWave, 'drag'],
    ['Loop region', Loop, 'drag'], ['Spectrum bars', Spectrum, 'auto'], ['Spectrogram', Spectrogram, 'auto'], ['Oscilloscope', Scope, 'auto'],
    ['Phase scope', Phase, 'auto'], ['EQ curve', EqCurve, 'drag'], ['Compressor curve', Comp, 'drag'], ['Gate light', Gate, 'drag'],
    ['Limiter meter', Limiter, 'auto'], ['Envelope shaper', Adsr, 'drag'], ['LFO shapes', Lfo, 'click'], ['Wave picker', Osc, 'click'],
    ['Filter sweep', Filter, 'drag'], ['Reverb rings', Reverb, 'drag'], ['Delay taps', Delay, 'auto'], ['Step sequencer', Sequencer, 'click'],
    ['Drum pads', Pads, 'press'], ['Piano keys', Keys, 'press'], ['Tap tempo', TapTempo, 'click'], ['Beat pendulum', Metronome, 'auto'],
    ['Tuner needle', Tuner, 'auto'], ['Timecode', Timecode, 'auto'], ['Loudness bar', Lufs, 'auto'], ['Gain staging', GainStage, 'drag'],
    ['Patch bay', Patch, 'click'], ['Headphone knob', Phones, 'click'], ['Mic ring', MicRing, 'auto'], ['Record arm', RecArm, 'click'],
    ['Transport keys', Transport, 'click'], ['Marker timeline', Markers, 'click'],
  ],
};
