import { useEffect, useRef, useState } from 'react';
import { useToggle } from '../hooks';
import c from './keypads.module.css';

/* ============================================================
   04 · KEYPADS — keys, triggers and buttons with a feel.
   The still side is a backlit key matrix; a wave of light and a press travels
   across it as the page scrolls.
   ============================================================ */

const LEGENDS = [...'QWERTYUIASDFGHJKZXCVBNM1234567890,./;\'[]-='];

function Visual() {
  return (
    <div className={c.board} aria-hidden="true">
      {LEGENDS.slice(0, 40).map((t, k) => <i key={k} style={{ '--k': k }}>{t}</i>)}
    </div>
  );
}

/* a button that remembers it is held (pointer or keyboard) */
function useHold(onChange) {
  const [on, setOn] = useState(false);
  const set = (v) => () => { setOn(v); if (onChange) onChange(v); };
  return [on, { onPointerDown: set(true), onPointerUp: set(false), onPointerLeave: set(false), onBlur: set(false), onKeyDown: (e) => { if (e.key === ' ' || e.key === 'Enter') set(true)(); }, onKeyUp: set(false) }];
}

/* 1 */ function Mechanical() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.mech} aria-label="Mechanical key" onClick={() => setN(n + 1)}><i /><span>{n}</span></button>;
}

/* 2 */ function Chiclet() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.chiclet} aria-pressed={on} aria-label="Chiclet key" onClick={flip}>A</button>;
}

/* 3 */ function PianoPair() {
  const [k, setK] = useState('');
  return (
    <div className={c.piano} data-k={k}>
      {['C', 'D', 'E'].map((n) => <button type="button" key={n} aria-label={`White key ${n}`} onPointerDown={() => setK(n)} onPointerUp={() => setK('')} onKeyDown={() => setK(n)} onKeyUp={() => setK('')}>{n}</button>)}
      <b data-b="1" /><b data-b="2" />
    </div>
  );
}

/* 4 */ function Arcade() {
  const [held, hold] = useHold();
  return <button type="button" className={c.arcade} data-held={held} aria-label="Arcade button" {...hold}><i /></button>;
}

/* 5 */ function HoldRing() {
  const [held, hold] = useHold();
  return (
    <button type="button" className={c.holdRing} data-held={held} aria-label="Hold to confirm" {...hold}>
      <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" pathLength="1" /><circle className={c.prog} cx="22" cy="22" r="19" pathLength="1" /></svg>
      <span>{held ? 'KEEP' : 'HOLD'}</span>
    </button>
  );
}

/* 6 */ function Trigger() {
  const [held, hold] = useHold();
  return <button type="button" className={c.trigger} data-held={held} aria-label="Trigger" {...hold}><i /><b /></button>;
}

/* 7 */ function Calculator() {
  const [s, setS] = useState('0');
  const press = (k) => setS((v) => (k === 'C' ? '0' : v === '0' ? k : (v + k).slice(0, 9)));
  return (
    <div className={c.calc}>
      <output>{s}</output>
      <div>{['7', '8', '9', 'C', '4', '5', '6', '0'].map((k) => <button type="button" key={k} aria-label={`Key ${k}`} onClick={() => press(k)}>{k}</button>)}</div>
    </div>
  );
}

/* 8 */ function NumberPad() {
  const [s, setS] = useState('');
  return (
    <div className={c.pad}>
      <output>{s || '— — —'}</output>
      <div>{['1', '2', '3', '4', '5', '6', '7', '8', '9', '✕', '0', '↵'].map((k) => (
        <button type="button" key={k} aria-label={k === '✕' ? 'Clear' : k === '↵' ? 'Enter' : `Digit ${k}`} onClick={() => setS((v) => (k === '✕' || k === '↵' ? '' : (v + k).slice(-8)))}>{k}</button>
      ))}</div>
    </div>
  );
}

/* 9 */ function Typewriter() {
  const [held, hold] = useHold();
  return <button type="button" className={c.type} data-held={held} aria-label="Typewriter key" {...hold}><i>R</i></button>;
}

/* 10 */ function SpaceBar() {
  const [held, hold] = useHold();
  return <button type="button" className={c.space} data-held={held} aria-label="Space bar" {...hold}>SPACE</button>;
}

/* 11 */ function Chord() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  return (
    <div className={c.chord} data-both={a && b}>
      <button type="button" aria-label="Control key, hold" aria-pressed={a} onPointerDown={() => setA(true)} onPointerUp={() => setA(false)} onPointerLeave={() => setA(false)}>CTRL</button>
      <span>+</span>
      <button type="button" aria-label="K key, hold" aria-pressed={b} onPointerDown={() => setB(true)} onPointerUp={() => setB(false)} onPointerLeave={() => setB(false)}>K</button>
      <output>{a && b ? 'CHORD' : a || b ? 'ONE KEY' : 'IDLE'}</output>
    </div>
  );
}

/* 12 */ function Dome() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.dome} aria-label="Rubber dome" onClick={() => setN(n + 1)}><s key={n} /><i /></button>;
}

/* 13 */ function TouchPad() {
  const [p, setP] = useState({ x: 0.5, y: 0.5, on: false });
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, on: true }); };
  return <div className={c.touch} role="application" aria-label="Touch pad" tabIndex={0} onPointerMove={move} onPointerLeave={() => setP((q) => ({ ...q, on: false }))} style={{ '--tx': p.x, '--ty': p.y }} data-on={p.on}><i /></div>;
}

/* 14 */ function SoftKeys() {
  const [k, setK] = useState('—');
  return (
    <div className={c.soft}>
      <output>{k}</output>
      <div>{['BACK', 'SELECT', 'MORE'].map((t) => <button type="button" key={t} aria-label={t} onClick={() => setK(t)}>{t}</button>)}</div>
    </div>
  );
}

/* 15 */ function Liquid() {
  return <button type="button" className={c.liquid}><span>Pour</span><i /></button>;
}

/* 16 */ function Offset() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.offset} onClick={() => setN(n + 1)}>PRESS {n}</button>;
}

/* 17 */ function Stroke() {
  return <button type="button" className={c.stroke}><svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="118" height="38" pathLength="1" /></svg><span>Draw</span></button>;
}

/* 18 */ function Magnet() {
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <div className={c.magnetZone} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 }); }} onPointerLeave={() => setP({ x: 0, y: 0 })}>
      <button type="button" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>Attract</button>
    </div>
  );
}

/* 19 */ function Shimmer() {
  return <button type="button" className={c.shimmer}>Shimmer</button>;
}

/* 20 */ function SpinBorder() {
  return <button type="button" className={c.spin}><span>Orbit</span></button>;
}

/* 21 */ function Ripple() {
  const [r, setR] = useState([]);
  const add = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const id = e.timeStamp;
    setR((x) => [...x, { id, x: e.clientX - b.left, y: e.clientY - b.top }]);
    window.setTimeout(() => setR((x) => x.filter((q) => q.id !== id)), 700);
  };
  return <button type="button" className={c.ripple} onClick={add}>Ripple{r.map((q) => <s key={q.id} style={{ left: q.x, top: q.y }} />)}</button>;
}

/* 22 */ function PulseCta() {
  return <button type="button" className={c.pulseCta}><s /><s /><span>Go live</span></button>;
}

/* 23 */ function Async() {
  const [st, setSt] = useState('idle');
  const go = () => {
    if (st !== 'idle') return;
    setSt('busy');
    window.setTimeout(() => { setSt('done'); window.setTimeout(() => setSt('idle'), 1400); }, 1100);
  };
  return <button type="button" className={c.asyncBtn} data-s={st} onClick={go} aria-live="polite"><i /><span>{st === 'idle' ? 'Save' : st === 'busy' ? 'Saving' : 'Saved'}</span></button>;
}

/* 24 */ function Double() {
  const [armed, setArmed] = useState(false);
  const [done, setDone] = useState(false);
  const click = () => {
    if (done) { setDone(false); return; }
    if (!armed) { setArmed(true); window.setTimeout(() => setArmed(false), 2400); } else { setArmed(false); setDone(true); }
  };
  return <button type="button" className={c.double} data-s={done ? 'done' : armed ? 'armed' : 'idle'} onClick={click}>{done ? 'Deleted · undo' : armed ? 'Sure? Press again' : 'Delete'}</button>;
}

/* 25 */ function Split() {
  const [open, flip] = useToggle();
  const [pick, setPick] = useState('Publish');
  return (
    <div className={c.split}>
      <button type="button">{pick}</button>
      <button type="button" aria-expanded={open} aria-label="More options" onClick={flip}><svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg></button>
      {open && <ul>{['Publish', 'Schedule', 'Save draft'].map((t) => <li key={t}><button type="button" onClick={() => { setPick(t); flip(); }}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 26 */ function IconGroup() {
  const [on, setOn] = useState([true, false, false]);
  return (
    <div className={c.group} role="group" aria-label="Text style">
      {['B', 'I', 'U'].map((t, i) => <button type="button" key={t} aria-label={['Bold', 'Italic', 'Underline'][i]} aria-pressed={on[i]} data-t={t} onClick={() => setOn(on.map((x, j) => (j === i ? !x : x)))}>{t}</button>)}
    </div>
  );
}

/* 27 */ function PlayPause() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.play} aria-pressed={on} aria-label={on ? 'Pause' : 'Play'} onClick={flip}><svg viewBox="0 0 24 24" aria-hidden="true">{on ? <path d="M7 5v14M17 5v14" /> : <path d="M8 5l11 7-11 7Z" />}</svg></button>;
}

/* 28 */ function LabelSwap() {
  return <button type="button" className={c.swap}><span><b>Send</b><b>Sent →</b></span></button>;
}

/* 29 */ function ArrowThrough() {
  return <button type="button" className={c.through}><span>Continue</span><i><svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5" /></svg><svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5" /></svg></i></button>;
}

/* 30 */ function UploadRing() {
  const [p, setP] = useState(0);
  const timer = useRef(0);
  useEffect(() => {
    const t = timer;
    return () => window.clearInterval(t.current);
  }, []);
  const go = () => {
    window.clearInterval(timer.current);
    setP(0);
    timer.current = window.setInterval(() => setP((v) => { if (v >= 100) { window.clearInterval(timer.current); return 100; } return v + 4; }), 60);
  };
  return <button type="button" className={c.upload} style={{ '--p': p }} onClick={go}><span>{p === 0 ? 'Upload' : p >= 100 ? 'Done' : `${p}%`}</span></button>;
}

/* 31 */ function Heart() {
  const [on, flip] = useToggle();
  return (
    <button type="button" className={c.heart} aria-pressed={on} aria-label="Like" onClick={flip}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C5 15 3 11 3 8a4.5 4.5 0 0 1 9-1.5A4.5 4.5 0 0 1 21 8c0 3-2 7-9 13Z" /></svg>
      {on && Array.from({ length: 6 }, (_, i) => <s key={i} style={{ '--a': `${i * 60}deg` }} />)}
    </button>
  );
}

/* 32 */ function CountUp() {
  const [n, setN] = useState(7);
  return (
    <button type="button" className={c.count} aria-label={`Count ${n}, add one`} onClick={() => setN(n + 1)}>
      <span key={n}>{n}</span><i>+1</i>
    </button>
  );
}

/* 33 */ function UndoRedo() {
  const [past, setPast] = useState(['A']);
  const [future, setFuture] = useState([]);
  return (
    <div className={c.undo}>
      <button type="button" aria-label="Undo" disabled={past.length < 2} onClick={() => { setFuture((f) => [past[past.length - 1], ...f]); setPast((p) => p.slice(0, -1)); }}>↶</button>
      <output>{past.join(' ')}</output>
      <button type="button" aria-label="Redo" disabled={!future.length} onClick={() => { setPast((p) => [...p, future[0]]); setFuture((f) => f.slice(1)); }}>↷</button>
      <button type="button" aria-label="Add a step" onClick={() => { setPast((p) => [...p, String.fromCharCode(65 + p.length)].slice(-8)); setFuture([]); }}>+</button>
    </div>
  );
}

/* 34 */ function Reactions() {
  const [k, setK] = useState(null);
  return (
    <div className={c.react} role="group" aria-label="Reactions">
      {['♥', '★', '✦', '◆'].map((t, i) => <button type="button" key={t} aria-label={`React ${t}`} aria-pressed={k === i} onClick={() => setK(k === i ? null : i)}>{t}</button>)}
    </div>
  );
}

/* 35 */ function RadialFab() {
  const [open, flip] = useToggle();
  return (
    <div className={c.fab} data-open={open}>
      {['✎', '⌕', '＋'].map((t, i) => <button type="button" key={t} tabIndex={open ? 0 : -1} aria-label={['Edit', 'Find', 'Add'][i]} style={{ '--i': i }}>{t}</button>)}
      <button type="button" className={c.fabMain} aria-expanded={open} aria-label="Actions" onClick={flip}>＋</button>
    </div>
  );
}

/* 36 */ function Pager() {
  const [n, setN] = useState(2);
  return (
    <div className={c.pager}>
      <button type="button" aria-label="Previous page" disabled={n === 0} onClick={() => setN(n - 1)}>‹</button>
      <p>{Array.from({ length: 5 }, (_, i) => <i key={i} data-on={i === n} />)}</p>
      <button type="button" aria-label="Next page" disabled={n === 4} onClick={() => setN(n + 1)}>›</button>
    </div>
  );
}

/* 37 */ function HoldRepeat() {
  const [n, setN] = useState(10);
  const timer = useRef(0);
  const stop = () => window.clearInterval(timer.current);
  useEffect(() => {
    const t = timer;
    return () => window.clearInterval(t.current);
  }, []);
  const start = (d) => { stop(); setN((v) => v + d); timer.current = window.setInterval(() => setN((v) => v + d), 120); };
  return (
    <div className={c.repeat}>
      <button type="button" aria-label="Decrease, hold to repeat" onPointerDown={() => start(-1)} onPointerUp={stop} onPointerLeave={stop}>−</button>
      <output>{n}</output>
      <button type="button" aria-label="Increase, hold to repeat" onPointerDown={() => start(1)} onPointerUp={stop} onPointerLeave={stop}>+</button>
    </div>
  );
}

/* 38 */ function ShiftLegends() {
  const [shift, flip] = useToggle();
  const pairs = [['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%']];
  return (
    <div className={c.shift} data-shift={shift}>
      <div>{pairs.map(([a, b]) => <button type="button" key={a} aria-label={shift ? b : a}><small>{b}</small><span>{a}</span></button>)}</div>
      <button type="button" className={c.shiftKey} aria-pressed={shift} onClick={flip}>SHIFT</button>
    </div>
  );
}

/* 39 */ function DPad() {
  const [k, setK] = useState('');
  const set = (t) => ({ onPointerDown: () => setK(t), onPointerUp: () => setK(''), onPointerLeave: () => setK(''), onKeyDown: () => setK(t), onKeyUp: () => setK('') });
  return (
    <div className={c.dpad} data-k={k}>
      <div>{['up', 'left', 'right', 'down'].map((d) => <button type="button" key={d} aria-label={`D-pad ${d}`} data-d={d} {...set(d)} />)}</div>
      <p>{['A', 'B', 'X', 'Y'].map((t) => <button type="button" key={t} aria-label={`Button ${t}`} data-b={t} {...set(t)}>{t}</button>)}</p>
    </div>
  );
}

/* 40 */ function PinPad() {
  const [s, setS] = useState('');
  const [res, setRes] = useState('');
  const tap = (k) => {
    const next = (s + k).slice(0, 4);
    setS(next);
    if (next.length === 4) {
      setRes(next === '1234' ? 'ok' : 'no');
      window.setTimeout(() => { setS(''); setRes(''); }, 900);
    }
  };
  return (
    <div className={c.pin} data-res={res}>
      <p>{Array.from({ length: 4 }, (_, i) => <i key={i} data-on={i < s.length} />)}</p>
      <div>{['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => <button type="button" key={k} aria-label={`PIN digit ${k}`} onClick={() => tap(k)}>{k}</button>)}</div>
      <output>{res === 'ok' ? 'OPEN' : res === 'no' ? 'WRONG' : 'TRY 1234'}</output>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Mechanical key', Mechanical, 'press'], ['Chiclet key', Chiclet, 'click'], ['Piano pair', PianoPair, 'press'], ['Arcade button', Arcade, 'press'],
    ['Hold ring', HoldRing, 'hold'], ['Trigger', Trigger, 'press'], ['Calculator keys', Calculator, 'click'], ['Number pad', NumberPad, 'click'],
    ['Typewriter key', Typewriter, 'press'], ['Space bar', SpaceBar, 'press'], ['Chord detect', Chord, 'hold'], ['Rubber dome', Dome, 'click'],
    ['Touch pad', TouchPad, 'hover'], ['Soft keys', SoftKeys, 'click'], ['Liquid fill', Liquid, 'hover'], ['Offset block', Offset, 'press'],
    ['Stroke draw', Stroke, 'hover'], ['Magnet button', Magnet, 'hover'], ['Shimmer', Shimmer, 'auto'], ['Orbit border', SpinBorder, 'auto'],
    ['Ripple', Ripple, 'click'], ['Pulse CTA', PulseCta, 'auto'], ['Async button', Async, 'click'], ['Double confirm', Double, 'click'],
    ['Split button', Split, 'click'], ['Style group', IconGroup, 'click'], ['Play pause', PlayPause, 'click'], ['Label swap', LabelSwap, 'hover'],
    ['Arrow through', ArrowThrough, 'hover'], ['Upload ring', UploadRing, 'click'], ['Heart burst', Heart, 'click'], ['Count up', CountUp, 'click'],
    ['Undo redo', UndoRedo, 'click'], ['Reactions', Reactions, 'click'], ['Radial FAB', RadialFab, 'click'], ['Pager', Pager, 'click'],
    ['Hold repeat', HoldRepeat, 'hold'], ['Shift legends', ShiftLegends, 'click'], ['D-pad', DPad, 'press'], ['PIN pad', PinPad, 'click'],
  ],
};
