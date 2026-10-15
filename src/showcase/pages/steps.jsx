import { useEffect, useRef, useState } from 'react';
import { clamp, useCycle, useDrag } from '../hooks';
import { polar } from '../kit';
import { Ico } from '../icons';
import c from './steps.module.css';

/* ============================================================
   24 · STEPS — steppers, breadcrumbs and pagination.
   The still side is a winding path: a line that draws itself as the page
   scrolls, a marker that rides it, and five waypoints that light as it passes.
   Specimens share nothing but good manners: every stepper can be moved from
   the keyboard and says where it is in words.
   ============================================================ */

const WAVE = Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${(i * 100) / 40} ${30 + Math.sin((i / 40) * Math.PI * 4) * 17}`).join('');

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visPath}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d={WAVE} className={c.visBase} /><path d={WAVE} pathLength="1" className={c.visDraw} /></svg>
        {[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ '--k': k }} />)}
        <b />
      </div>
      <small>5 WAYPOINTS · 1 MARKER</small>
    </div>
  );
}

const useStep = (n, init = 0) => {
  const [i, setI] = useState(init);
  return [i, setI, () => setI((v) => clamp(v - 1, 0, n - 1)), () => setI((v) => clamp(v + 1, 0, n - 1))];
};

/* back and next buttons shared by several steppers */
function Nav({ i, n, set, label = 'Step' }) {
  return (
    <div className={c.nav} role="group" aria-label={`${label} controls`}>
      <button type="button" disabled={i === 0} onClick={() => set(i - 1)}>Back</button>
      <output aria-live="polite">{i + 1} / {n}</output>
      <button type="button" disabled={i === n - 1} onClick={() => set(i + 1)}>Next</button>
    </div>
  );
}

/* 1 */ function DotStepper() {
  const [i, set] = useStep(5, 1);
  return (
    <div className={c.col}>
      <ol className={c.dots} style={{ '--i': i }} aria-label="Dot stepper">{[0, 1, 2, 3, 4].map((k) => <li key={k} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-label={`Step ${k + 1}`} aria-current={k === i ? 'step' : undefined} onClick={() => set(k)} /></li>)}</ol>
      <Nav i={i} n={5} set={set} />
    </div>
  );
}

/* 2 */ function Numbered() {
  const [i, set] = useStep(4, 2);
  return (
    <div className={c.col}>
      <ol className={c.nums} aria-label="Numbered stepper">{['Cart', 'Ship', 'Pay', 'Done'].map((t, k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><b>{k < i ? <Ico n="check" /> : k + 1}</b><span>{t}</span></button></li>)}</ol>
    </div>
  );
}

/* 3 */ function Vertical() {
  const [i, set] = useStep(3, 1);
  const rows = [['Account', 'Name and mail'], ['Workspace', 'Pick a name'], ['Invite', 'Add the team']];
  return (
    <ol className={c.vert} aria-label="Vertical stepper">
      {rows.map(([t, d], k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><i>{k < i ? <Ico n="check" /> : k + 1}</i><b>{t}</b>{k === i && <small>{d}</small>}</button></li>)}
    </ol>
  );
}

/* 4 */ function Segments() {
  const [i, set] = useStep(4, 1);
  return (
    <div className={c.col}>
      <div className={c.segs} role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={i + 1}>{[0, 1, 2, 3].map((k) => <i key={k} data-on={k <= i} />)}</div>
      <Nav i={i} n={4} set={set} />
    </div>
  );
}

/* 5 */ function Icons() {
  const [i, set] = useStep(4, 0);
  return (
    <ol className={c.icons} aria-label="Icon stepper">
      {[['user', 'You'], ['folder', 'Files'], ['gear', 'Setup'], ['check', 'Done']].map(([n, t], k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><Ico n={n} /><span>{t}</span></button></li>)}
    </ol>
  );
}

/* 6 */ function SlashCrumbs() {
  return <nav className={c.slash} aria-label="Slash breadcrumb"><a href="#s">studio</a><span>/</span><a href="#s">work</a><span>/</span><a href="#s">2024</a><span>/</span><b aria-current="page">report</b></nav>;
}

/* 7 */ function ChevCrumbs() {
  return <nav className={c.chev} aria-label="Chevron breadcrumb"><a href="#c" aria-label="Home"><Ico n="home" /></a><Ico n="right" /><a href="#c">Library</a><Ico n="right" /><a href="#c">Data</a><Ico n="right" /><b aria-current="page">Reports</b></nav>;
}

/* 8 */ function Collapsing() {
  const [open, setOpen] = useState(false);
  const all = ['Home', 'Library', 'Data', 'Archive', 'Reports'];
  const shown = open ? all : [all[0], '…', ...all.slice(-2)];
  return (
    <nav className={c.slash} aria-label="Collapsing breadcrumb">
      {shown.map((t, k) => (
        <span key={t + k} className={c.crumbItem}>
          {k > 0 && <span>/</span>}
          {t === '…' ? <button type="button" aria-label="Show all levels" onClick={() => setOpen(true)}>…</button> : k === shown.length - 1 ? <b aria-current="page">{t}</b> : <a href="#c" onClick={(e) => e.preventDefault()}>{t}</a>}
        </span>
      ))}
    </nav>
  );
}

/* 9 */ function PillTrail() {
  const [k, setK] = useState(2);
  const t = ['Shop', 'Shoes', 'Boots', 'Chelsea'];
  return (
    <nav className={c.pills} aria-label="Pill trail">
      {t.map((n, i) => <button key={n} type="button" data-on={i === k} aria-current={i === k ? 'page' : undefined} onClick={() => setK(i)}>{n}</button>)}
    </nav>
  );
}

/* 10 */ function PageNumbers() {
  const [p, setP] = useState(5);
  const list = [1, p > 3 ? '…' : 2, ...[p - 1, p, p + 1].filter((x) => x > 1 && x < 9), p < 7 ? '…' : 8, 9].filter((x, i, a) => a.indexOf(x) === i || x === '…');
  return (
    <nav className={c.pages} aria-label="Pagination">
      <button type="button" aria-label="Previous page" disabled={p === 1} onClick={() => setP(p - 1)}><Ico n="left" /></button>
      {list.map((n, k) => (typeof n === 'number' ? <button key={n} type="button" aria-current={n === p ? 'page' : undefined} onClick={() => setP(n)}>{n}</button> : <span key={`e${k}`} aria-hidden="true">…</span>))}
      <button type="button" aria-label="Next page" disabled={p === 9} onClick={() => setP(p + 1)}><Ico n="right" /></button>
    </nav>
  );
}

/* 11 */ function PageOf() {
  const [p, setP] = useState(3);
  return (
    <div className={c.pageOf}>
      <button type="button" aria-label="Previous" disabled={p === 1} onClick={() => setP(p - 1)}>←</button>
      <span>Page <b>{p}</b> of 9</span>
      <button type="button" aria-label="Next" disabled={p === 9} onClick={() => setP(p + 1)}>→</button>
    </div>
  );
}

/* 12 */ function LoadMore() {
  const [n, setN] = useState(12);
  return (
    <div className={c.more}>
      <div role="progressbar" aria-label="Loaded" aria-valuemin={0} aria-valuemax={60} aria-valuenow={n}><i style={{ '--v': n / 60 }} /></div>
      <button type="button" disabled={n >= 60} onClick={() => setN((v) => Math.min(60, v + 12))}>{n >= 60 ? 'All loaded' : 'Load 12 more'}</button>
      <small>{n} of 60</small>
    </div>
  );
}

/* 13 */ function JumpTo() {
  const [v, setV] = useState('4');
  const [at, setAt] = useState(4);
  return (
    <form className={c.jump} onSubmit={(e) => { e.preventDefault(); const n = clamp(parseInt(v, 10) || 1, 1, 20); setAt(n); setV(String(n)); }}>
      <label>Go to page<input inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 2))} /></label>
      <button type="submit">Go</button>
      <output>Now on {at}</output>
    </form>
  );
}

/* 14 */ function Carousel() {
  const k = useCycle(5, 1800);
  return <div className={c.cdots} role="img" aria-label={`Slide ${k + 1} of 5`}>{[0, 1, 2, 3, 4].map((i) => <i key={i} data-on={i === k} />)}</div>;
}

/* 15 */ function Wizard() {
  const [i, set] = useStep(3, 0);
  return (
    <div className={c.wiz}>
      <p key={i}>{['Tell us who you are.', 'Choose how it looks.', 'Review and finish.'][i]}</p>
      <div><button type="button" disabled={i === 0} onClick={() => set(i - 1)}>Back</button><button type="button" onClick={() => set(i === 2 ? 0 : i + 1)}>{i === 2 ? 'Finish' : 'Continue'}</button></div>
    </div>
  );
}

/* 16 */ function TimelineSteps() {
  const [i, set] = useStep(4, 1);
  return (
    <ol className={c.time} aria-label="Horizontal timeline" style={{ '--i': i }}>
      {[['Draft', 'Mon'], ['Review', 'Tue'], ['Revise', 'Thu'], ['Ship', 'Fri']].map(([t, d], k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><i /><b>{t}</b><small>{d}</small></button></li>)}
    </ol>
  );
}

/* 17 */ function Checklist() {
  const [done, setDone] = useState([true, true, false, false]);
  const n = done.filter(Boolean).length;
  return (
    <div className={c.todo}>
      <ul>{['Sign in', 'Add a photo', 'Invite a friend', 'Take the tour'].map((t, k) => <li key={t}><label><input type="checkbox" checked={done[k]} onChange={() => setDone((d) => d.map((x, j) => (j === k ? !x : x)))} />{t}</label></li>)}</ul>
      <div role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={n}><i style={{ '--v': n / 4 }} /></div>
    </div>
  );
}

/* 18 */ function Quantity() {
  const [n, setN] = useState(2);
  return (
    <div className={c.qty} role="group" aria-label="Quantity">
      <button type="button" aria-label="Fewer" disabled={n <= 0} onClick={() => setN(n - 1)}><Ico n="minus" /></button>
      <output aria-live="polite">{n}</output>
      <button type="button" aria-label="More" disabled={n >= 9} onClick={() => setN(n + 1)}><Ico n="plus" /></button>
    </div>
  );
}

/* 19 */ function HoldSpin() {
  const [n, setN] = useState(10);
  const timer = useRef(0);
  const stop = () => { clearInterval(timer.current); timer.current = 0; };
  useEffect(() => stop, []);
  const hold = (d) => { setN((v) => clamp(v + d, 0, 99)); stop(); let speed = 0; timer.current = setInterval(() => { speed += 1; setN((v) => clamp(v + d * (speed > 8 ? 5 : 1), 0, 99)); }, 120); };
  return (
    <div className={c.qty} role="group" aria-label="Hold to spin">
      <button type="button" aria-label="Decrease, hold to repeat" onPointerDown={() => hold(-1)} onPointerUp={stop} onPointerLeave={stop} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setN((v) => clamp(v - 1, 0, 99)); } }}><Ico n="minus" /></button>
      <output aria-live="off">{String(n).padStart(2, '0')}</output>
      <button type="button" aria-label="Increase, hold to repeat" onPointerDown={() => hold(1)} onPointerUp={stop} onPointerLeave={stop} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setN((v) => clamp(v + 1, 0, 99)); } }}><Ico n="plus" /></button>
    </div>
  );
}

/* 20 */ function Ticks() {
  const [v, bind] = useDrag({ init: 0.5, steps: 5 });
  return (
    <div className={c.ticks} {...bind} aria-label="Stepped range" aria-valuetext={`Level ${Math.round(v * 5) + 1}`} style={{ ...bind.style, '--v': v }}>
      <i aria-hidden="true" />{[0, 1, 2, 3, 4, 5].map((k) => <u key={k} aria-hidden="true" data-on={k <= Math.round(v * 5)} />)}
      <output>{Math.round(v * 5) + 1}</output>
    </div>
  );
}

/* 21 */ function Cards() {
  const [i, set] = useStep(3, 0);
  return (
    <ol className={c.cards} aria-label="Step cards">
      {['Plan', 'Build', 'Ship'].map((t, k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><small>0{k + 1}</small><b>{t}</b></button></li>)}
    </ol>
  );
}

/* 22 */ function Stairs() {
  const [i, set] = useStep(5, 2);
  return (
    <ol className={c.stairs} aria-label="Stairs">
      {[0, 1, 2, 3, 4].map((k) => <li key={k}><button type="button" aria-label={`Level ${k + 1}`} aria-current={k === i ? 'step' : undefined} data-on={k <= i} style={{ '--h': k + 1 }} onClick={() => set(k)} /></li>)}
    </ol>
  );
}

/* 23 */ function PathFlag() {
  const [v, bind] = useDrag({ init: 0.3 });
  return (
    <div className={c.flag} {...bind} aria-label="Path position" style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M2 24C20 4 30 4 46 18S78 28 98 6" className={c.fbase} /><path d="M2 24C20 4 30 4 46 18S78 28 98 6" pathLength="1" className={c.fdraw} /></svg>
      <i aria-hidden="true" />
    </div>
  );
}

/* 24 */ function Onboarding() {
  const [i, set] = useStep(4, 0);
  const [gone, setGone] = useState(false);
  return gone ? <button type="button" className={c.again} onClick={() => { setGone(false); set(0); }}>Restart tour</button> : (
    <div className={c.onb}>
      <p>{['Welcome.', 'Find things fast.', 'Share with ease.', 'You are set.'][i]}</p>
      <ol aria-hidden="true">{[0, 1, 2, 3].map((k) => <li key={k} data-on={k === i} />)}</ol>
      <div><button type="button" onClick={() => setGone(true)}>Skip</button><button type="button" onClick={() => (i === 3 ? setGone(true) : set(i + 1))}>{i === 3 ? 'Done' : 'Next'}</button></div>
    </div>
  );
}

/* 25 */ function Tour() {
  const [i, set] = useStep(3, 0);
  return (
    <div className={c.tour}>
      <div className={c.tourStage}>{[0, 1, 2].map((k) => <span key={k} data-on={k === i} />)}</div>
      <aside role="note" style={{ '--i': i }}><b>Step {i + 1} of 3</b><p>{['This is the toolbar.', 'This is the canvas.', 'This is the panel.'][i]}</p><button type="button" onClick={() => set((i + 1) % 3)}>{i === 2 ? 'Restart' : 'Next'}</button></aside>
    </div>
  );
}

/* 26 */ function Countdown() {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n < 0) return undefined;
    const id = setTimeout(() => setN((v) => v - 1), 900);
    return () => clearTimeout(id);
  }, [n]);
  return (
    <div className={c.count}>
      <output aria-live="polite" key={n}>{n > 0 ? n : n === 0 ? 'Go' : '·'}</output>
      <button type="button" onClick={() => setN(3)}>Again</button>
    </div>
  );
}

/* 27 */ function Ladder() {
  const [i, set] = useStep(5, 3);
  return (
    <ol className={c.ladder} aria-label="Ladder">
      {[4, 3, 2, 1, 0].map((k) => <li key={k} data-on={k <= i}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}>Rung {k + 1}</button></li>)}
    </ol>
  );
}

/* 28 */ function SubSteps() {
  const [i, set] = useStep(3, 1);
  return (
    <ol className={c.sub} aria-label="Stepper with sub-steps">
      {[['Setup', ['Name', 'Region']], ['Connect', ['Source', 'Test']], ['Launch', ['Review']]].map(([t, kids], k) => (
        <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}>
          <button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}>{t}</button>
          {k === i && <ul>{kids.map((x) => <li key={x}>{x}</li>)}</ul>}
        </li>
      ))}
    </ol>
  );
}

/* 29 */ function Chapters() {
  const [i, set] = useStep(5, 2);
  return (
    <ol className={c.chap} aria-label="Chapters">
      {['Intro', 'Method', 'Results', 'Notes', 'Index'].map((t, k) => <li key={t}><button type="button" aria-current={k === i ? 'true' : undefined} onClick={() => set(k)}><span>{k + 1}.</span>{t}<i /></button></li>)}
    </ol>
  );
}

/* 30 */ function TimerRing() {
  const [i, set] = useStep(5, 2);
  const seg = Array.from({ length: 5 }, (_, k) => {
    const a0 = (k * 360) / 5 + 4;
    const a1 = ((k + 1) * 360) / 5 - 4;
    const [x0, y0] = polar(50, 50, 40, a0);
    const [x1, y1] = polar(50, 50, 40, a1);
    return `M${x0} ${y0}A40 40 0 0 1 ${x1} ${y1}`;
  });
  return (
    <div className={c.sring}>
      <svg viewBox="0 0 100 100" role="group" aria-label="Segment ring">{seg.map((d, k) => <path key={k} d={d} data-on={k <= i} tabIndex={0} role="button" aria-label={`Segment ${k + 1}`} aria-pressed={k === i} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(k); } }} />)}</svg>
      <output>{i + 1}/5</output>
    </div>
  );
}

/* 31 */ function PathBar() {
  const [at, setAt] = useState(3);
  const parts = ['~', 'work', 'notes', '2024', 'draft.md'];
  return (
    <nav className={c.pathbar} aria-label="Path bar">
      <button type="button" aria-label="Up one level" disabled={at === 0} onClick={() => setAt(at - 1)}><Ico n="up" /></button>
      <div>{parts.slice(0, at + 1).map((p, k) => <button key={p} type="button" aria-current={k === at ? 'page' : undefined} onClick={() => setAt(k)}>{p}</button>)}</div>
    </nav>
  );
}

/* 32 */ function WithError() {
  const [i, set] = useStep(4, 2);
  return (
    <ol className={c.err} aria-label="Stepper with an error">
      {['Details', 'Address', 'Payment', 'Review'].map((t, k) => <li key={t} data-s={k < i ? (k === 1 ? 'bad' : 'done') : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}><b>{k === 1 && k < i ? '!' : k + 1}</b><span>{t}{k === 1 && k < i ? ' — fix' : ''}</span></button></li>)}
    </ol>
  );
}

/* 33 */ function Optional() {
  const [i, set] = useStep(4, 1);
  return (
    <ol className={c.opt} aria-label="Stepper with an optional step">
      {[['Basics', false], ['Extras', true], ['Terms', false], ['Done', false]].map(([t, o], k) => <li key={t} data-s={k < i ? 'done' : k === i ? 'now' : 'next'}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}>{t}{o && <small>optional</small>}</button></li>)}
    </ol>
  );
}

/* 34 */ function Clock() {
  const [h, setH] = useState(3);
  return (
    <div className={c.clock} role="radiogroup" aria-label="Hour">
      {Array.from({ length: 12 }, (_, k) => k + 1).map((n) => <button key={n} type="button" role="radio" aria-checked={n === h} style={{ '--a': n * 30 }} onClick={() => setH(n)}>{n}</button>)}
      <i style={{ '--a': h * 30 }} aria-hidden="true" />
    </div>
  );
}

/* 35 */ function DateSteps() {
  const [i, set] = useStep(3, 0);
  const [pick, setPick] = useState(['', '', '']);
  const opts = [['Jan', 'Feb', 'Mar', 'Apr'], ['5', '12', '19', '26'], ['2024', '2025', '2026', '2027']];
  return (
    <div className={c.dstep}>
      <ol aria-label="Date steps">{['Month', 'Day', 'Year'].map((t, k) => <li key={t} data-on={k === i} data-done={!!pick[k]}><button type="button" aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}>{pick[k] || t}</button></li>)}</ol>
      <div>{opts[i].map((o) => <button key={o} type="button" onClick={() => { setPick((p) => p.map((x, j) => (j === i ? o : x))); if (i < 2) set(i + 1); }}>{o}</button>)}</div>
    </div>
  );
}

/* 36 */ function CardStack() {
  const [i, set] = useStep(4, 0);
  return (
    <div className={c.stackSteps}>
      {[0, 1, 2, 3].map((k) => <section key={k} style={{ '--d': k - i }} aria-hidden={k !== i}><b>0{k + 1}</b><span>{['Gather', 'Sort', 'Shape', 'Send'][k]}</span></section>)}
      <button type="button" onClick={() => set((i + 1) % 4)}>Next card</button>
    </div>
  );
}

/* 37 */ function Zigzag() {
  const [i, set] = useStep(5, 2);
  return (
    <ol className={c.zig} aria-label="Zigzag path">
      {[0, 1, 2, 3, 4].map((k) => <li key={k} data-s={k < i ? 'done' : k === i ? 'now' : 'next'} style={{ '--k': k }}><button type="button" aria-label={`Stop ${k + 1}`} aria-current={k === i ? 'step' : undefined} onClick={() => set(k)}>{k + 1}</button></li>)}
    </ol>
  );
}

/* 38 */ function Beads() {
  const [i, set] = useStep(6, 2);
  return (
    <div className={c.beads} role="group" aria-label="Beads">
      <i aria-hidden="true" />
      {Array.from({ length: 6 }, (_, k) => <button key={k} type="button" aria-label={`Bead ${k + 1}`} aria-current={k === i ? 'step' : undefined} data-on={k <= i} onClick={() => set(k)} />)}
    </div>
  );
}

/* 39 */ function Gates() {
  const [open, setOpen] = useState(1);
  return (
    <ol className={c.gates} aria-label="Gated steps">
      {['Welcome', 'Terms', 'Profile', 'Launch'].map((t, k) => <li key={t} data-locked={k > open}><button type="button" disabled={k > open} onClick={() => k === open && setOpen(open + 1 > 3 ? 1 : open + 1)}><Ico n={k > open ? 'lock' : 'check'} />{t}</button></li>)}
    </ol>
  );
}

/* 40 */ function Skip() {
  const [i, set] = useStep(6, 0);
  return (
    <div className={c.skip}>
      <div role="group" aria-label="Skip steps">{[0, 1, 2, 3, 4, 5].map((k) => <button key={k} type="button" aria-label={`Go to step ${k + 1}`} aria-current={k === i ? 'step' : undefined} data-on={k === i} onClick={() => set(k)}>{k + 1}</button>)}</div>
      <p><button type="button" disabled={i === 0} onClick={() => set(0)}>« First</button><button type="button" disabled={i === 5} onClick={() => set(5)}>Last »</button></p>
    </div>
  );
}

/* 41 */ function Rating() {
  const [n, setN] = useState(3);
  const [hov, setHov] = useState(0);
  return (
    <div className={c.rate} role="radiogroup" aria-label="Rating" onPointerLeave={() => setHov(0)}>
      {[1, 2, 3, 4, 5].map((k) => <button key={k} type="button" role="radio" aria-checked={k === n} aria-label={`${k} of 5`} data-on={k <= (hov || n)} onPointerEnter={() => setHov(k)} onClick={() => setN(k)}><Ico n="star" /></button>)}
    </div>
  );
}

/* 42 */ function Gauge() {
  const [i, set] = useStep(5, 1);
  return (
    <div className={c.gauge}>
      <div role="progressbar" aria-label="Level" aria-valuemin={1} aria-valuemax={5} aria-valuenow={i + 1} style={{ '--v': (i + 1) / 5 }}><span>{i + 1}</span></div>
      <Nav i={i} n={5} set={set} label="Level" />
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Dot stepper', DotStepper, 'click'], ['Numbered stepper', Numbered, 'click'], ['Vertical stepper', Vertical, 'click'], ['Segment progress', Segments, 'click'],
    ['Icon stepper', Icons, 'click'], ['Slash crumbs', SlashCrumbs, 'click'], ['Chevron crumbs', ChevCrumbs, 'click'], ['Collapsing crumbs', Collapsing, 'click'],
    ['Pill trail', PillTrail, 'click'], ['Page numbers', PageNumbers, 'click'], ['Page of', PageOf, 'click'], ['Load more', LoadMore, 'click'],
    ['Jump to page', JumpTo, 'type'], ['Carousel dots', Carousel, 'auto'], ['Wizard footer', Wizard, 'click'], ['Horizontal timeline', TimelineSteps, 'click'],
    ['Setup checklist', Checklist, 'click'], ['Count stepper', Quantity, 'click'], ['Hold to spin', HoldSpin, 'hold'], ['Stepped range', Ticks, 'drag'],
    ['Step cards', Cards, 'click'], ['Stairs', Stairs, 'click'], ['Path flag', PathFlag, 'drag'], ['Onboarding', Onboarding, 'click'],
    ['Guided tour', Tour, 'click'], ['Countdown', Countdown, 'auto'], ['Ladder', Ladder, 'click'], ['Sub-steps', SubSteps, 'click'],
    ['Chapter list', Chapters, 'click'], ['Ring steps', TimerRing, 'click'], ['Path bar', PathBar, 'click'], ['Error step', WithError, 'click'],
    ['Optional step', Optional, 'click'], ['Hour dial', Clock, 'click'], ['Date steps', DateSteps, 'click'], ['Card stack steps', CardStack, 'click'],
    ['Zigzag path', Zigzag, 'click'], ['Bead string', Beads, 'click'], ['Gated steps', Gates, 'click'], ['Skip steps', Skip, 'click'],
    ['Star steps', Rating, 'hover'], ['Level gauge', Gauge, 'click'],
  ],
};
