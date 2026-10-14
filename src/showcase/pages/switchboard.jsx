import { useState } from 'react';
import { useDrag, useToggle, useTick } from '../hooks';
import c from './switchboard.module.css';

/* ============================================================
   01 · SWITCHBOARD — forty ways to flip a state.
   The still side is the board itself: forty lamps, one per specimen, that
   light as the page passes them while a scan line sweeps the grid.
   ============================================================ */

function Visual() {
  return (
    <div className={c.board} aria-hidden="true">
      <div className={c.plate}>BUS A · 40 WAYS</div>
      <div className={c.lamps}>
        {Array.from({ length: 40 }, (_, k) => <i key={k} style={{ '--k': k }} />)}
        <b className={c.scan} />
      </div>
      <div className={c.bus}><i /></div>
      <div className={c.dial}><span /></div>
    </div>
  );
}

/* 1 */ function Rocker() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.rocker} aria-pressed={on} aria-label="Rocker switch" onClick={flip}><b>I</b><b>O</b></button>;
}

/* 2 */ function Pill() {
  const [on, flip] = useToggle(true);
  return <button type="button" role="switch" aria-checked={on} aria-label="Pill switch" className={c.pill} onClick={flip}><i /></button>;
}

/* 3 */ function Guard() {
  const [open, setOpen] = useState(false);
  const [on, flip, set] = useToggle();
  return (
    <div className={c.guard} data-open={open}>
      <button type="button" className={c.gSwitch} aria-pressed={on} aria-label="Guarded switch" tabIndex={open ? 0 : -1} onClick={flip}><i /></button>
      <button type="button" className={c.gCover} aria-label={open ? 'Close the cover' : 'Lift the cover'} aria-expanded={open} onClick={() => { setOpen(!open); set(false); }} />
    </div>
  );
}

/* 4 */ function SlideLock() {
  const [v, bind] = useDrag({ init: 0 });
  return (
    <div className={c.slide} {...bind} aria-label="Slide to unlock" style={{ ...bind.style, '--v': v }} data-done={v > 0.9}>
      <span>{v > 0.9 ? 'UNLOCKED' : 'SLIDE TO UNLOCK'}</span><i />
    </div>
  );
}

/* 5 */ function TwoKey() {
  const [a, flipA] = useToggle();
  const [b, flipB] = useToggle();
  return (
    <div className={c.twoKey} data-live={a && b}>
      <button type="button" aria-pressed={a} aria-label="Key one" onClick={flipA}><i /></button>
      <span className={c.lamp} />
      <button type="button" aria-pressed={b} aria-label="Key two" onClick={flipB}><i /></button>
    </div>
  );
}

/* 6 */ function PullChain() {
  const [on, flip] = useToggle();
  return (
    <div className={c.chainWrap}>
      <span className={c.bulb} data-on={on} />
      <button type="button" className={c.chain} aria-pressed={on} aria-label="Pull chain" onClick={flip}><i /></button>
    </div>
  );
}

/* 7 */ function Knife() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={c.knife} aria-pressed={on} aria-label="Knife switch" onClick={flip}>
      <u /><i /><u />
    </button>
  );
}

/* 8 */ function Dip() {
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 0, 1, 0]);
  const flip = (n) => setBits((b) => b.map((x, i) => (i === n ? 1 - x : x)));
  return (
    <div className={c.dip}>
      <div>{bits.map((x, n) => <button type="button" key={n} aria-pressed={x === 1} aria-label={`Bit ${n + 1}`} onClick={() => flip(n)}><i /></button>)}</div>
      <output>{parseInt(bits.join(''), 2)}</output>
    </div>
  );
}

/* 9 */ function Latch() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.latch} aria-pressed={on} aria-label="Push latch" onClick={flip}><i /></button>;
}

/* 10 */ function Breaker() {
  const [n, setN] = useState(0);
  const label = ['ON', 'TRIPPED', 'OFF'][n];
  return (
    <button type="button" className={c.breaker} data-s={n} aria-label={`Breaker, ${label}. Press to change`} onClick={() => setN((n + 1) % 3)}>
      <i /><span>{label}</span>
    </button>
  );
}

/* 11 */ function Tumbler() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.tumbler} aria-pressed={on} aria-label="Tumbler switch" onClick={flip}><i /><b /></button>;
}

/* 12 */ function Lever() {
  const [on, flip] = useToggle();
  return (
    <button type="button" className={c.lever} aria-pressed={on} aria-label="Lever" onClick={flip}>
      <span>UP</span><i /><span>DN</span>
    </button>
  );
}

/* 13 */ function Jumper() {
  const [pos, setPos] = useState(0);
  return (
    <button type="button" className={c.jumper} data-p={pos} aria-label="Jumper, move to the other pair" onClick={() => setPos(1 - pos)}>
      <u /><u /><u /><s />
    </button>
  );
}

/* 14 */ function Thumbwheel() {
  const [n, setN] = useState(3);
  return (
    <div className={c.wheelBox}>
      <button type="button" aria-label="Decrease" onClick={() => setN((n + 9) % 10)}>−</button>
      <div className={c.win}><ol style={{ '--n': n }}>{Array.from({ length: 10 }, (_, d) => <li key={d}>{d}</li>)}</ol></div>
      <button type="button" aria-label="Increase" onClick={() => setN((n + 1) % 10)}>+</button>
    </div>
  );
}

/* 15 */ function Rotary() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={c.rotary} data-n={n} aria-label={`Selector, position ${'ABC'[n]}`} onClick={() => setN((n + 1) % 3)}>
      <b>A</b><b>B</b><b>C</b><i />
    </button>
  );
}

/* 16 */ function Keylock() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.keylock} aria-pressed={on} aria-label="Key lock" onClick={flip}><i /><span>{on ? 'RUN' : 'LOCK'}</span></button>;
}

/* 17 */ function Bolt() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.bolt} aria-pressed={on} aria-label="Door bolt" onClick={flip}><i /><b /></button>;
}

/* 18 */ function Mercury() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.mercury} aria-pressed={on} aria-label="Mercury tilt switch" onClick={flip}><i /></button>;
}

/* 19 */ function CheckLamp() {
  const [on, flip] = useToggle();
  return (
    <label className={c.checkLamp}>
      <input type="checkbox" checked={on} onChange={flip} aria-label="Lamp checkbox" />
      <svg viewBox="0 0 40 56" aria-hidden="true"><path d="M20 4a15 15 0 0 0-8 27c2 2 3 4 3 7h10c0-3 1-5 3-7A15 15 0 0 0 20 4Z" /><path d="M15 44h10M16 49h8M16 28l4-8 4 8" /></svg>
    </label>
  );
}

/* 20 */ function RadioBank() {
  const [k, setK] = useState(1);
  return (
    <div className={c.bank} role="radiogroup" aria-label="Interlocked keys">
      {['AM', 'FM', 'SW', 'LW'].map((t, i) => <button type="button" key={t} role="radio" aria-checked={k === i} onClick={() => setK(i)}>{t}</button>)}
    </div>
  );
}

/* 21 */ function Momentary() {
  const [on, setOn] = useState(false);
  const down = () => setOn(true);
  const up = () => setOn(false);
  return (
    <button type="button" className={c.momentary} aria-pressed={on} aria-label="Momentary, hold to run" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') down(); }} onKeyUp={up} onBlur={up}>
      <i />{on ? 'HELD' : 'HOLD'}
    </button>
  );
}

/* 22 */ function Seesaw() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.seesaw} aria-pressed={on} aria-label="Seesaw" onClick={flip}><i><b /><b /></i><u /></button>;
}

/* 23 */ function Reed() {
  const [v, bind] = useDrag({ init: 0.1 });
  const near = Math.abs(v - 0.5) < 0.16;
  return (
    <div className={c.reed} {...bind} aria-label="Magnet position" style={{ ...bind.style, '--v': v }} data-closed={near}>
      <u /><u /><i /><span>{near ? 'CLOSED' : 'OPEN'}</span>
    </div>
  );
}

/* 24 */ function Rope() {
  const [v, bind] = useDrag({ mode: 'y', init: 1 });
  const pull = 1 - v;
  return (
    <div className={c.rope} {...bind} aria-label="Rope pull" style={{ ...bind.style, '--p': pull }} data-on={pull > 0.5}>
      <i /><b /><span className={c.bulb} data-on={pull > 0.5} />
    </div>
  );
}

/* 25 */ function Arm() {
  const [n, setN] = useState(0);
  return (
    <div className={c.arm} style={{ '--n': n }} data-n={n} role="radiogroup" aria-label="Arming state">
      {['SAFE', 'ARM', 'FIRE'].map((t, i) => <button type="button" key={t} role="radio" aria-checked={n === i} onClick={() => setN(i)}>{t}</button>)}
      <i />
    </div>
  );
}

/* 26 */ function Pedal() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.pedal} aria-pressed={on} aria-label="Foot pedal" onClick={flip}><i /><span>{on ? 'DOWN' : 'UP'}</span></button>;
}

/* 27 */ function FlipBit() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.flipBit} aria-pressed={on} aria-label="Flip bit" onClick={flip}><span key={String(on)}>{on ? 1 : 0}</span></button>;
}

/* 28 */ function Cam() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.cam} aria-pressed={on} aria-label="Cam lock" onClick={flip}><i /><b /></button>;
}

/* 29 */ function Hasp() {
  const [open, flip] = useToggle();
  return (
    <button type="button" className={c.hasp} aria-pressed={open} aria-label="Hasp" onClick={flip}>
      <b /><span className={c.lamp} /><i />
    </button>
  );
}

/* 30 */ function Snap() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.snap} aria-pressed={on} aria-label="Magnetic snap switch" onClick={flip}><u /><i /><u /></button>;
}

/* 31 */ function Segment() {
  const [n, setN] = useState(1);
  return (
    <div className={c.segment} style={{ '--n': n }} data-n={n} role="radiogroup" aria-label="Mode">
      {['OFF', 'AUTO', 'ON'].map((t, i) => <button type="button" key={t} role="radio" aria-checked={n === i} onClick={() => setN(i)}>{t}</button>)}
      <i />
    </div>
  );
}

/* 32 */ function Pulse() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.pulse} aria-pressed={on} aria-label="Pulse switch" onClick={flip}><s key={String(on)} /><i /></button>;
}

/* 33 */ function Dimmer() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={c.dimmer} style={{ '--n': n }} aria-label={`Dimmer, level ${n} of 4`} onClick={() => setN((n + 1) % 5)}>
      <span className={c.bulb} data-on={n > 0} style={{ opacity: 0.25 + n * 0.19 }} />
      <p>{[0, 1, 2, 3].map((x) => <i key={x} data-on={n > x} />)}</p>
    </button>
  );
}

/* 34 */ function Fuse() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.fuse} aria-pressed={on} aria-label="Fuse" onClick={flip}><i><b /></i><u /><u /></button>;
}

/* 35 */ function Plug() {
  const [on, flip] = useToggle();
  return (
    <button type="button" className={c.plug} aria-pressed={on} aria-label="Plug" onClick={flip}>
      <span className={c.bulb} data-on={on} /><i /><b />
    </button>
  );
}

/* 36 */ function DeadMan() {
  const [held, setHeld] = useState(false);
  return (
    <button type="button" className={c.dead} data-held={held} aria-label="Dead man's switch, hold to run" onPointerDown={() => setHeld(true)} onPointerUp={() => setHeld(false)} onPointerLeave={() => setHeld(false)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHeld(true); }} onKeyUp={() => setHeld(false)} onBlur={() => setHeld(false)}>
      <i /><span>{held ? 'RUNNING' : 'HOLD TO RUN'}</span>
    </button>
  );
}

/* 37 */ function Crossbar() {
  const [grid, setGrid] = useState(() => [0, 4, 8]);
  const toggle = (n) => setGrid((g) => (g.includes(n) ? g.filter((x) => x !== n) : [...g, n]));
  return (
    <div className={c.cross}>
      {Array.from({ length: 9 }, (_, n) => <button type="button" key={n} aria-pressed={grid.includes(n)} aria-label={`Crosspoint ${Math.floor(n / 3) + 1},${(n % 3) + 1}`} onClick={() => toggle(n)} />)}
    </div>
  );
}

/* 38 */ function Patch() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={c.patch} aria-pressed={on} aria-label="Patch cable" onClick={flip}>
      <svg viewBox="0 0 120 56" aria-hidden="true"><circle cx="14" cy="16" r="9" /><circle cx="106" cy="16" r="9" /><path d={on ? 'M14 16C30 56 90 56 106 16' : 'M14 16C20 40 30 44 38 40'} /><circle cx={on ? 106 : 40} cy={on ? 16 : 40} r="4" /></svg>
    </button>
  );
}

/* 39 */ function Valve() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.valve} data-open={n % 2 === 0} aria-label={`Valve wheel, ${n % 2 === 0 ? 'open' : 'shut'}`} onClick={() => setN(n + 1)}>
      <svg viewBox="0 0 60 60" aria-hidden="true" style={{ transform: `rotate(${n * 90}deg)` }}><circle cx="30" cy="30" r="22" /><path d="M30 8v44M8 30h44" /><circle cx="30" cy="30" r="5" /></svg>
      <span>{n % 2 === 0 ? 'OPEN' : 'SHUT'}</span>
    </button>
  );
}

/* 40 */ function Master() {
  const [kids, setKids] = useState([true, false, true]);
  const all = kids.every(Boolean);
  const some = kids.some(Boolean);
  const tick = useTick(1400);
  return (
    <div className={c.master} data-tick={tick % 2}>
      <button type="button" role="checkbox" aria-checked={all ? 'true' : some ? 'mixed' : 'false'} aria-label="Master" className={c.mBox} data-s={all ? 2 : some ? 1 : 0} onClick={() => setKids(kids.map(() => !all))}><i /></button>
      <div>{kids.map((k, i) => <button type="button" key={i} aria-pressed={k} aria-label={`Channel ${i + 1}`} onClick={() => setKids(kids.map((x, j) => (j === i ? !x : x)))}>{i + 1}</button>)}</div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Rocker', Rocker, 'click'], ['Pill', Pill, 'click'], ['Guard cover', Guard, 'click'], ['Slide lock', SlideLock, 'drag'],
    ['Two-key', TwoKey, 'click'], ['Pull chain', PullChain, 'click'], ['Knife switch', Knife, 'click'], ['DIP bank', Dip, 'click'],
    ['Push latch', Latch, 'click'], ['Breaker', Breaker, 'click'], ['Tumbler', Tumbler, 'click'], ['Lever', Lever, 'click'],
    ['Jumper', Jumper, 'click'], ['Thumbwheel', Thumbwheel, 'click'], ['Rotary 3-way', Rotary, 'click'], ['Key lock', Keylock, 'click'],
    ['Door bolt', Bolt, 'click'], ['Mercury tilt', Mercury, 'click'], ['Lamp check', CheckLamp, 'click'], ['Radio bank', RadioBank, 'click'],
    ['Momentary', Momentary, 'hold'], ['Seesaw', Seesaw, 'click'], ['Reed relay', Reed, 'drag'], ['Rope pull', Rope, 'drag'],
    ['Arming switch', Arm, 'click'], ['Foot pedal', Pedal, 'click'], ['Flip bit', FlipBit, 'click'], ['Cam lock', Cam, 'click'],
    ['Hasp', Hasp, 'click'], ['Magnetic snap', Snap, 'click'], ['Segment mode', Segment, 'click'], ['Pulse switch', Pulse, 'click'],
    ['Dimmer step', Dimmer, 'click'], ['Fuse', Fuse, 'click'], ['Plug and socket', Plug, 'click'], ["Dead man's", DeadMan, 'hold'],
    ['Crossbar', Crossbar, 'click'], ['Patch cable', Patch, 'click'], ['Valve wheel', Valve, 'click'], ['Master channel', Master, 'click'],
  ],
};
