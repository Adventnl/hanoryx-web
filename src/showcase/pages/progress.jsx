import { useEffect, useState } from 'react';
import { useDrag, useToggle } from '../hooks';
import { Ico } from '../icons';
import c from './progress.module.css';

/* ============================================================
   28 · PROGRESS — bars, rings and vessels that fill.
   Most specimens are pure CSS: one registered number, --v (0 to 1), is run by a
   keyframe animation and every bar, ring and counter below reads it, so they
   all fill in step with their own clock. The ones that answer to you are the
   sliders, the uploads and the buttons. The still side is a ring and three bars
   that the scroll itself fills, with the figure written by CSS counters.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visRing}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="44" pathLength="1" /></svg><b /></div>
      <div className={c.visBars}>{[1, 0.62, 0.34].map((w, k) => <i key={k} style={{ '--w': w }} />)}</div>
      <small>1 RING · 3 BARS</small>
    </div>
  );
}

const run = (label) => ({ role: 'progressbar', 'aria-label': label, 'aria-valuetext': 'Loading' });
const cells = (n) => Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k }} />);

/* 1 */ function Linear() { return <div className={c.linear} {...run('Linear')}><i /></div>; }
/* 2 */ function Striped() { return <div className={c.striped} {...run('Striped')}><i /></div>; }
/* 3 */ function Hairline() { return <div className={c.hair} {...run('Hairline')}><i /></div>; }
/* 4 */ function Steps10() { return <div className={c.steps10} {...run('Ten steps')}>{cells(10)}</div>; }
/* 5 */ function Labelled() {
  return (
    <div className={c.labelled} {...run('Labelled steps')}>
      <i />{['Plan', 'Build', 'Test', 'Ship'].map((t, k) => <span key={t} style={{ '--k': k }}>{t}</span>)}
    </div>
  );
}
/* 6 */ function RingPct() { return <div className={c.ringP} {...run('Ring')}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" /><circle cx="50" cy="50" r="42" pathLength="1" /></svg><b /></div>; }
/* 7 */ function HalfRing() { return <div className={c.half} {...run('Half ring')}><svg viewBox="0 0 100 56"><path d="M8 50a42 42 0 0 1 84 0" /><path d="M8 50a42 42 0 0 1 84 0" pathLength="1" /></svg><b /></div>; }
/* 8 */ function Donut() {
  return (
    <div className={c.donut} {...run('Donut')}>
      <svg viewBox="0 0 100 100">{[[44, '#ff3333', 0.45], [36, '#ffb347', 0.3], [28, '#6ee7b7', 0.2]].map(([r, col, w], k) => <circle key={r} cx="50" cy="50" r={r} pathLength="1" style={{ stroke: col, '--w': w, '--k': k }} />)}</svg>
    </div>
  );
}
/* 9 */ function Vessel() { return <div className={c.vessel} {...run('Vessel')}><i /><i /><b /></div>; }
/* 10 */ function Cell() { return <div className={c.cell} {...run('Battery')}><i /></div>; }
/* 11 */ function Thermo() { return <div className={c.thermo} {...run('Thermometer')}><i /><b /></div>; }
/* 12 */ function Tube() { return <div className={c.tube} {...run('Test tube')}><i /></div>; }
/* 13 */ function Dotted() { return <div className={c.dotted} {...run('Dotted')}>{cells(20)}</div>; }
/* 14 */ function Pixels() { return <div className={c.pixels} {...run('Pixel fill')}>{cells(48)}</div>; }
/* 15 */ function Ticks() { return <div className={c.ticks} {...run('Tick ring')}>{cells(36)}<b /></div>; }

/* 16 */ function RangeFill() {
  const [v, bind] = useDrag({ init: 0.45 });
  return <div className={c.range} {...bind} aria-label="Range progress" style={{ ...bind.style, '--v': v }}><i /><b /></div>;
}
/* 17 */ function Scrub() {
  const [v, bind, set] = useDrag({ init: 0.3 });
  const [on, flip] = useToggle();
  useEffect(() => {
    if (!on) return undefined;
    const id = setTimeout(() => set(v >= 0.999 ? 0 : v + 0.012), 250);
    return () => clearTimeout(id);
  }, [on, v, set]);
  const t = Math.round(v * 214);
  return (
    <div className={c.scrub}>
      <button type="button" aria-label={on ? 'Pause' : 'Play'} aria-pressed={on} onClick={flip}><Ico n={on ? 'pause' : 'play'} /></button>
      <div {...bind} aria-label="Scrub" aria-valuetext={`${Math.floor(t / 60)} minutes ${t % 60} seconds`} style={{ ...bind.style, '--v': v }}><i /><b /></div>
      <output>{Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')}</output>
    </div>
  );
}
/* 18 */ function Uploads() {
  const files = [['cover.png', 0.9], ['notes.pdf', 0.55], ['demo.mov', 0.2]];
  return <ul className={c.uploads}>{files.map(([n, w]) => <li key={n}><span>{n}</span><div {...run(n)} style={{ '--w': w }}><i /></div></li>)}</ul>;
}
/* 19 */ function Stacked() {
  return <div className={c.stacked} role="img" aria-label="Stacked bar: 45 percent used, 30 percent shared, 15 percent trash, 10 percent free"><i style={{ '--w': 45, '--col': '#ff3333' }} /><i style={{ '--w': 30, '--col': '#ffb347' }} /><i style={{ '--w': 15, '--col': '#7aa2ff' }} /><i style={{ '--w': 10, '--col': '#2a2b31' }} /></div>;
}
/* 20 */ function Bullet() { return <div className={c.bullet} {...run('Bullet')}><i /><b /></div>; }
/* 21 */ function Gradient() { return <div className={c.grad} {...run('Gradient')}><i /></div>; }
/* 22 */ function Neon() { return <div className={c.neon} {...run('Neon')}><i /></div>; }
/* 23 */ function Rider() { return <div className={c.rider} {...run('Percent rider')}><i /><b /></div>; }
/* 24 */ function Indeterminate() { return <div className={c.indet} role="progressbar" aria-label="Indeterminate"><i /></div>; }
/* 25 */ function Buffer() { return <div className={c.buffer} {...run('Buffering')}><i /><b /></div>; }
/* 26 */ function Drain() { return <div className={c.drain} {...run('Countdown')}><i /></div>; }
/* 27 */ function Skills() {
  return <ul className={c.skills}>{[['Type', 0.92], ['Motion', 0.74], ['Sound', 0.48]].map(([t, w]) => <li key={t}><span>{t}</span><div role="img" aria-label={`${t} ${Math.round(w * 100)} percent`}><i style={{ '--w': w }} /></div></li>)}</ul>;
}
/* 28 */ function SpiralBar() { return <div className={c.spiralP} {...run('Spiral')}><svg viewBox="0 0 100 100"><path d="M50 50m0-4a4 4 0 1 1-4 4a12 12 0 1 1 12 12a20 20 0 1 1-20-20a28 28 0 1 1 28 28a36 36 0 1 1-36-36" pathLength="1" /></svg></div>; }
/* 29 */ function WaveBar() { return <div className={c.waveBar} {...run('Wave')}><svg viewBox="0 0 120 14" preserveAspectRatio="none"><path d="M0 7q7.5-8 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0" /></svg></div>; }
/* 30 */ function PieFill() { return <div className={c.pie} {...run('Pie')} />; }
/* 31 */ function Vu() { return <div className={c.vu} {...run('Level meter')}>{cells(12)}</div>; }
/* 32 */ function Rocket() { return <div className={c.rocket} {...run('Rocket')}><i /><b><Ico n="bolt" /></b></div>; }
/* 33 */ function Stair() { return <div className={c.stair} {...run('Staircase')}>{cells(8)}</div>; }
/* 34 */ function HexFill() { return <div className={c.hexP} {...run('Hex')}><i /></div>; }
/* 35 */ function Clockface() { return <div className={c.clockP} {...run('Twelve dots')}>{cells(12)}</div>; }
/* 36 */ function Milestones() {
  return <div className={c.miles} {...run('Milestones')}><i />{[0, 1, 2, 3].map((k) => <span key={k} style={{ '--k': k }} />)}</div>;
}
/* 37 */ function ArcSteps() { return <div className={c.arcs} {...run('Arc steps')}>{cells(5)}</div>; }

/* 38 */ function DownloadButton() {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (s <= 0 || s >= 100) return undefined;
    const id = setTimeout(() => setS((v) => Math.min(100, v + 6)), 90);
    return () => clearTimeout(id);
  }, [s]);
  return (
    <button type="button" className={c.dl} style={{ '--v': s / 100 }} data-done={s >= 100} aria-busy={s > 0 && s < 100} onClick={() => setS(s === 0 || s >= 100 ? 1 : s)}>
      <i aria-hidden="true" /><span>{s === 0 ? 'Download' : s >= 100 ? 'Done · open' : `${s}%`}</span>
    </button>
  );
}
/* 39 */ function RingDone() { return <div className={c.ringDone} {...run('Ring then check')}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" pathLength="1" /><path d="M30 52l14 14 26-30" pathLength="1" /></svg></div>; }
/* 40 */ function MiniMatrix() { return <div className={c.matrix} {...run('Nine bars')}>{cells(9)}</div>; }
/* 41 */ function SineTrace() { return <div className={c.sine} {...run('Sine trace')}><svg viewBox="0 0 120 40" preserveAspectRatio="none"><path d="M0 20C15 -6 25 -6 40 20S65 46 80 20 105 -6 120 20" pathLength="1" /></svg></div>; }
/* 42 */ function Odometer() {
  return <div className={c.odo} {...run('Odometer')}>{['hundreds', 'tens', 'ones'].map((d) => <span key={d} data-d={d}><i /></span>)}<b>%</b></div>;
}

export default {
  Visual,
  items: [
    ['Linear bar', Linear, 'auto'], ['Striped bar', Striped, 'auto'], ['Hairline', Hairline, 'auto'], ['Ten steps', Steps10, 'auto'],
    ['Labelled steps', Labelled, 'auto'], ['Ring percent', RingPct, 'auto'], ['Half ring', HalfRing, 'auto'], ['Donut rings', Donut, 'auto'],
    ['Vessel', Vessel, 'auto'], ['Cell charge', Cell, 'auto'], ['Mercury column', Thermo, 'auto'], ['Test tube', Tube, 'auto'],
    ['Dotted fill', Dotted, 'auto'], ['Pixel fill', Pixels, 'auto'], ['Tick ring', Ticks, 'auto'], ['Range fill', RangeFill, 'drag'],
    ['Player scrub', Scrub, 'drag'], ['Upload list', Uploads, 'static'], ['Stacked bar', Stacked, 'static'], ['Bullet chart', Bullet, 'auto'],
    ['Gradient bar', Gradient, 'auto'], ['Neon bar', Neon, 'auto'], ['Percent rider', Rider, 'auto'], ['Indeterminate', Indeterminate, 'auto'],
    ['Buffer bar', Buffer, 'auto'], ['Draining bar', Drain, 'auto'], ['Skill bars', Skills, 'static'], ['Spiral trace', SpiralBar, 'auto'],
    ['Wave bar', WaveBar, 'auto'], ['Pie fill', PieFill, 'auto'], ['Level meter', Vu, 'auto'], ['Rocket bar', Rocket, 'auto'],
    ['Staircase fill', Stair, 'auto'], ['Hex fill', HexFill, 'auto'], ['Twelve dots', Clockface, 'auto'], ['Milestone bar', Milestones, 'auto'],
    ['Arc steps', ArcSteps, 'auto'], ['Download button', DownloadButton, 'click'], ['Ring to check', RingDone, 'auto'], ['Nine bars', MiniMatrix, 'auto'],
    ['Sine trace', SineTrace, 'auto'], ['Odometer fill', Odometer, 'auto'],
  ],
};
