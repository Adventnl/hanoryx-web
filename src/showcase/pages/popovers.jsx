import { useEffect, useRef, useState } from 'react';
import { clamp, useLive, useToggle } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Ico } from '../icons';
import c from './popovers.module.css';

/* ============================================================
   31 · POPOVERS — tooltips, hover cards and callouts.
   The still side is a reference square with one popover that walks round it:
   the scroll sets its angle, so over the page it takes up every placement in
   turn, its arrow turning to keep pointing home. Specimens use a tiny open /
   close hook (Escape and an outside press close one) and every tooltip opens on
   keyboard focus as well as on hover.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.ref}><span>ANCHOR</span></div>
      <div className={c.bubble}><b>Popover</b><span>placement turns with the page</span><i /></div>
      <small>1 ANCHOR · 12 PLACEMENTS</small>
    </div>
  );
}

function useOpen(init = false) {
  const [open, setOpen] = useState(init);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  return [open, setOpen, ref];
}

/* a hover / focus trigger: open on pointer or keyboard focus, close on leave, blur or Escape.
   While its specimen is on screen it also shows itself now and then, so a tooltip is
   never just a button (not under reduced motion). */
function useTip(delay = 0) {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef(0);
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(timer.current); setOpen(false); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!live || reduced) return undefined;
    let off = 0;
    const cycle = () => { setAuto(true); off = setTimeout(() => setAuto(false), 1900); };
    const first = setTimeout(cycle, 900);
    const loop = setInterval(cycle, 5400);
    return () => { clearTimeout(first); clearTimeout(off); clearInterval(loop); setAuto(false); };
  }, [live, reduced]);
  return [open || auto, { onPointerEnter: show, onPointerLeave: hide, onFocus: show, onBlur: hide, onKeyDown: (e) => { if (e.key === 'Escape') hide(); } }];
}

const Trigger = ({ children = 'Hover me', ...rest }) => <button type="button" className={c.trigger} {...rest}>{children}</button>;

/* 1 */ function TipTop() {
  const [open, bind] = useTip();
  return <span className={c.wrap}><Trigger aria-describedby="tp-1" {...bind}>Hover or focus</Trigger><span id="tp-1" role="tooltip" className={`${c.tip} ${c.top}`} data-open={open}>Saved just now</span></span>;
}

/* 2 */ function Sides() {
  const [side, setSide] = useState('top');
  const [open, bind] = useTip();
  return (
    <div className={c.col}>
      <span className={c.wrap}><Trigger aria-describedby="tp-2" {...bind}>Anchor</Trigger><span id="tp-2" role="tooltip" className={`${c.tip} ${c[side]}`} data-open={open}>On the {side}</span></span>
      <div role="radiogroup" aria-label="Side" className={c.seg}>{['top', 'right', 'bottom', 'left'].map((s) => <button key={s} type="button" role="radio" aria-checked={s === side} onClick={() => setSide(s)}>{s}</button>)}</div>
    </div>
  );
}

/* 3 */ function Rich() {
  const [open, bind] = useTip();
  return <span className={c.wrap}><Trigger aria-describedby="tp-3" {...bind}>Plan limits</Trigger><span id="tp-3" role="tooltip" className={`${c.tip} ${c.top} ${c.rich}`} data-open={open}><b>Team plan</b>Ten seats, one workspace, no limits on files.</span></span>;
}

/* 4 */ function HoverCard() {
  const [open, bind] = useTip(250);
  return (
    <span className={c.wrap} {...bind}>
      <a href="#hc" className={c.handle} onClick={(e) => e.preventDefault()}>@mira</a>
      <span role="tooltip" className={`${c.card} ${c.top}`} data-open={open}><i>MK</i><b>Mira Kade</b><small>Design lead · Lisbon</small><span>Ships small things, often.</span></span>
    </span>
  );
}

/* 5 */ function ClickPop() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}>Rename</Trigger>
      {open && <form className={`${c.pop} ${c.bottom}`} role="dialog" aria-label="Rename" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}><label>Name<input defaultValue="Untitled" autoFocus /></label><button type="submit">Save</button></form>}
    </div>
  );
}

/* 6 */ function Confirm() {
  const [open, setOpen, ref] = useOpen();
  const [gone, setGone] = useState(false);
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => { setGone(false); setOpen(!open); }}>{gone ? 'Deleted' : 'Delete'}</Trigger>
      {open && <div className={`${c.pop} ${c.top}`} role="alertdialog" aria-label="Confirm delete"><p>Delete this item?</p><div><button type="button" onClick={() => setOpen(false)}>Keep</button><button type="button" data-bad onClick={() => { setGone(true); setOpen(false); }}>Delete</button></div></div>}
    </div>
  );
}

/* 7 */ function Follow() {
  const [p, setP] = useState(null);
  return (
    <div className={c.follow} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP([e.clientX - r.left, e.clientY - r.top]); }} onPointerLeave={() => setP(null)} tabIndex={0} role="application" aria-label="Move the pointer over the area; a tip follows it" onKeyDown={(e) => { const d = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[e.key]; if (d) { e.preventDefault(); setP((q) => { const b = q || [80, 40]; return [clamp(b[0] + d[0], 0, 190), clamp(b[1] + d[1], 0, 90)]; }); } }}>
      <span>Move here</span>
      {p && <b style={{ left: p[0], top: p[1] }}>{Math.round(p[0])}, {Math.round(p[1])}</b>}
    </div>
  );
}

/* 8 */ function Bubbles() {
  const [k, setK] = useState(0);
  const tails = ['bl', 'br', 'tl', 'tr'];
  return (
    <div className={c.col}>
      <p className={c.speech} data-t={tails[k]}>Say it in a bubble.</p>
      <button type="button" className={c.next} onClick={() => setK((k + 1) % 4)}>Move the tail</button>
    </div>
  );
}

/* 9 */ function Coach() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.coach}>
      <button type="button" className={c.hot} aria-label="Hotspot" aria-expanded={on} onClick={flip}><i /></button>
      {on && <aside role="note"><b>New</b>Tap here to start a draft.<button type="button" onClick={flip}>Got it</button></aside>}
    </div>
  );
}

/* 10 */ function Hotspots() {
  const [k, setK] = useState(-1);
  const spots = [[28, 38, 'Lens'], [64, 56, 'Strap'], [48, 22, 'Dial']];
  return (
    <div className={c.spots} onPointerLeave={() => setK(-1)}>
      <svg viewBox="0 0 100 70" aria-hidden="true"><circle cx="50" cy="38" r="22" /><circle cx="50" cy="38" r="12" /><path d="M20 38h60M50 8v60" /></svg>
      {spots.map(([x, y, t], i) => <button key={t} type="button" aria-label={t} style={{ left: `${x}%`, top: `${y}%` }} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onBlur={() => setK(-1)}><i />{k === i && <em>{t}</em>}</button>)}
    </div>
  );
}

/* 11 */ function Footnote() {
  const [open, setOpen, ref] = useOpen();
  return (
    <p ref={ref} className={c.note}>Light moves slowly in glass<button type="button" aria-expanded={open} aria-label="Footnote 1" onClick={() => setOpen(!open)}><sup>1</sup></button>.
      {open && <span role="note" className={`${c.tip} ${c.top} ${c.rich}`} data-open>Roughly two thirds of its speed in a vacuum.</span>}
    </p>
  );
}

/* 12 */ function Glossary() {
  const [open, bind] = useTip();
  return <p className={c.note}>A good <span className={c.wrap}><button type="button" className={c.term} aria-describedby="tp-12" {...bind}>kerning</button><span id="tp-12" role="tooltip" className={`${c.tip} ${c.top} ${c.rich}`} data-open={open}>The space between two letters, adjusted by eye.</span></span> is felt, not seen.</p>;
}

/* 13 */ function ColourPop() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('#ff3333');
  const cols = ['#ff3333', '#ff9f43', '#feca57', '#1dd1a1', '#54a0ff', '#a29bfe', '#ffffff', '#576574'];
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}><i className={c.dot} style={{ background: v }} />Colour</Trigger>
      {open && <div className={`${c.pop} ${c.bottom} ${c.grid4}`} role="dialog" aria-label="Colours">{cols.map((h) => <button key={h} type="button" aria-label={h} aria-pressed={h === v} style={{ background: h }} onClick={() => { setV(h); setOpen(false); }} />)}</div>}
    </div>
  );
}

/* 14 */ function DatePop() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('Today');
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{v}</Trigger>
      {open && <ul className={`${c.pop} ${c.bottom} ${c.list}`} role="listbox" aria-label="When">{['Today', 'Tomorrow', 'Next week'].map((t) => <li key={t}><button type="button" role="option" aria-selected={t === v} onClick={() => { setV(t); setOpen(false); }}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 15 */ function ReactPop() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('');
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}>{v || 'React'}</Trigger>
      {open && <div className={`${c.pop} ${c.top} ${c.faces}`} role="dialog" aria-label="Reactions">{['❤', '★', '✦', '☻', '☀'].map((f) => <button key={f} type="button" aria-label={f} onClick={() => { setV(f); setOpen(false); }}>{f}</button>)}</div>}
    </div>
  );
}

/* 16 */ function LinkPreview() {
  const [open, bind] = useTip(250);
  return (
    <span className={c.wrap} {...bind}>
      <a href="#lp" className={c.handle} onClick={(e) => e.preventDefault()}>hanoryx.systems</a>
      <span role="tooltip" className={`${c.card} ${c.bottom}`} data-open={open}><i className={c.shot} /><b>Hanoryx Systems</b><small>hanoryx.systems</small></span>
    </span>
  );
}

/* 17 */ function Inline() {
  const [editing, setEditing, ref] = useOpen();
  const [v, setV] = useState('Q3 plan');
  return (
    <div ref={ref} className={c.wrap}>
      {editing ? <form className={c.inlineForm} onSubmit={(e) => { e.preventDefault(); setEditing(false); }}><input aria-label="Title" value={v} onChange={(e) => setV(e.target.value)} autoFocus /><button type="submit" aria-label="Save"><Ico n="check" /></button></form> : <button type="button" className={c.editable} onClick={() => setEditing(true)}>{v}<Ico n="pen" /></button>}
    </div>
  );
}

/* 18 */ function SharePop() {
  const [open, setOpen, ref] = useOpen();
  const [done, setDone] = useState(false);
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => { setOpen(!open); setDone(false); }}><Ico n="share" />Share</Trigger>
      {open && <div className={`${c.pop} ${c.bottom}`} role="dialog" aria-label="Share"><code>hnx.sh/abc12</code><button type="button" onClick={() => setDone(true)}>{done ? 'Copied ✓' : 'Copy link'}</button></div>}
    </div>
  );
}

/* 19 */ function InfoI() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.wrap}>
      <span className={c.label}>Retention <button type="button" className={c.i} aria-label="About retention" aria-expanded={open} onClick={() => setOpen(!open)}>i</button></span>
      {open && <div className={`${c.pop} ${c.top}`} role="note"><p>Files are kept for 30 days after you delete them.</p></div>}
    </div>
  );
}

/* 20 */ function FieldError() {
  const [v, setV] = useState('ada@');
  const bad = !/^\S+@\S+\.\S+$/.test(v);
  return (
    <div className={c.wrap}>
      <input className={c.field} aria-label="Mail" aria-invalid={bad} aria-describedby="tp-20" value={v} onChange={(e) => setV(e.target.value)} />
      <span id="tp-20" role={bad ? 'alert' : undefined} className={`${c.tip} ${c.bottom} ${c.badTip}`} data-open={bad}>Needs a domain, like ada@lab.io</span>
    </div>
  );
}

/* 21 */ function KeyHint() {
  const [open, bind] = useTip();
  return <span className={c.wrap}><Trigger aria-describedby="tp-21" aria-keyshortcuts="Meta+S" {...bind}>Save</Trigger><span id="tp-21" role="tooltip" className={`${c.tip} ${c.top}`} data-open={open}>Save <kbd>⌘</kbd><kbd>S</kbd></span></span>;
}

/* 22 */ function Delayed() {
  const [open, bind] = useTip(600);
  const [warm, setWarm] = useState(false);
  return <span className={c.wrap}><Trigger aria-describedby="tp-22" onPointerEnter={() => setWarm(true)} onPointerLeave={() => setWarm(false)} data-warm={warm} {...bind}>Wait for it<i aria-hidden="true" className={c.fuse} /></Trigger><span id="tp-22" role="tooltip" className={`${c.tip} ${c.top}`} data-open={open}>Worth the wait</span></span>;
}

/* 23 */ function Sticky() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-expanded={open} onClick={() => setOpen(!open)}>Pin the tip</Trigger>
      <span role="note" className={`${c.tip} ${c.top} ${c.rich}`} data-open={open}><b>Stays open</b>Press elsewhere, or Escape, to close.</span>
    </div>
  );
}

/* 24 */ function Tour() {
  const [i, setI] = useState(0);
  const steps = ['First, name the project.', 'Then add a teammate.', 'Last, press publish.'];
  return (
    <div className={c.tour}>
      <div className={c.tourRow}>{[0, 1, 2].map((k) => <span key={k} data-on={k === i} />)}</div>
      <aside role="note" style={{ '--i': i }}><b>{i + 1} of 3</b><p>{steps[i]}</p><button type="button" onClick={() => setI((i + 1) % 3)}>{i === 2 ? 'Again' : 'Next'}</button></aside>
    </div>
  );
}

/* 25 */ function ChartTip() {
  const [k, setK] = useState(-1);
  const v = [34, 52, 41, 70, 58, 80];
  return (
    <div className={c.chart} onPointerLeave={() => setK(-1)}>
      {v.map((h, i) => <button key={i} type="button" aria-label={`Month ${i + 1}: ${h}`} style={{ height: `${h}%` }} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onBlur={() => setK(-1)}>{k === i && <em>{h}</em>}</button>)}
    </div>
  );
}

/* 26 */ function Avatars() {
  const [k, setK] = useState(-1);
  const names = ['Ada', 'Lin', 'Mo', 'Ivo'];
  return (
    <div className={c.avs} onPointerLeave={() => setK(-1)}>
      {names.map((n, i) => <button key={n} type="button" aria-label={n} style={{ '--h': i * 70 }} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onBlur={() => setK(-1)}>{n[0]}{k === i && <em>{n}</em>}</button>)}
    </div>
  );
}

/* 27 */ function Disabled() {
  const [open, bind] = useTip();
  return <span className={c.wrap} {...bind} tabIndex={0} aria-describedby="tp-27" role="group" aria-label="Disabled button with a reason"><button type="button" className={c.trigger} disabled>Publish</button><span id="tp-27" role="tooltip" className={`${c.tip} ${c.top}`} data-open={open}>Add a title first</span></span>;
}

/* 28 */ function Truncated() {
  const [open, bind] = useTip();
  return <span className={c.wrap}><button type="button" className={c.trunc} aria-describedby="tp-28" {...bind}>Annual_report_final_v7_reviewed.pdf</button><span id="tp-28" role="tooltip" className={`${c.tip} ${c.top}`} data-open={open}>Annual_report_final_v7_reviewed.pdf</span></span>;
}

/* 29 */ function Thumb() {
  const [open, bind] = useTip();
  return <span className={c.wrap}><button type="button" className={c.thumb} aria-describedby="tp-29" aria-label="Cover, preview on hover" {...bind} /><span id="tp-29" role="tooltip" className={`${c.big} ${c.right}`} data-open={open} /></span>;
}

/* 30 */ function MapPin() {
  const [k, setK] = useState(0);
  const pins = [[24, 56, 'Harbour café'], [58, 36, 'Old library'], [78, 62, 'Night market']];
  return (
    <div className={c.map}>
      {pins.map(([x, y], i) => <button key={i} type="button" aria-label={pins[i][2]} aria-pressed={i === k} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setK(i)} />)}
      <aside style={{ left: `${pins[k][0]}%`, top: `${pins[k][1]}%` }} role="note" key={k}><b>{pins[k][2]}</b><small>4 min walk</small></aside>
    </div>
  );
}

/* 31 */ function CalDay() {
  const [k, setK] = useState(-1);
  const ev = { 3: 'Review · 10:00', 7: 'Launch · all day', 12: 'Offsite' };
  return (
    <div className={c.cal} onPointerLeave={() => setK(-1)}>
      {Array.from({ length: 14 }, (_, i) => <button key={i} type="button" aria-label={`Day ${i + 1}${ev[i] ? `, ${ev[i]}` : ''}`} data-ev={Boolean(ev[i])} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onBlur={() => setK(-1)}>{i + 1}{k === i && ev[i] && <em>{ev[i]}</em>}</button>)}
    </div>
  );
}

/* 32 */ function DefCard() {
  const [open, bind] = useTip(200);
  return <p className={c.note}>See the <span className={c.wrap} {...bind}><a href="#dc" className={c.handle} onClick={(e) => e.preventDefault()}>Golden Gate</a><span role="tooltip" className={`${c.card} ${c.top}`} data-open={open}><i className={c.shot} /><b>Golden Gate Bridge</b><span>A suspension bridge, 1937.</span></span></span>.</p>;
}

/* 33 */ function DropDown() {
  const [open, flip] = useToggle();
  return (
    <div className={c.slideBox}>
      <div className={c.slideBar}><b>Studio</b><button type="button" aria-expanded={open} onClick={flip}>News</button></div>
      <div className={c.slideDown} data-open={open} role="note"><b>Spring open call</b><span>Send work by Friday.</span></div>
    </div>
  );
}

/* 34 */ function AssistBubble() {
  const [open, flip] = useToggle();
  return (
    <div className={c.assist}>
      <button type="button" aria-expanded={open} aria-label="Assistant" onClick={flip}><Ico n={open ? 'close' : 'chat'} /></button>
      {open && <div role="dialog" aria-label="Assistant"><b>Hi</b><p>Need a hand with the layout?</p><span><button type="button">Yes</button><button type="button" onClick={flip}>Later</button></span></div>}
    </div>
  );
}

/* 35 */ function RowActions() {
  const [k, setK] = useState(-1);
  return (
    <ul className={c.rows} onPointerLeave={() => setK(-1)}>
      {['Brief.docx', 'Moodboard.fig', 'Notes.md'].map((t, i) => <li key={t} onPointerEnter={() => setK(i)} onFocus={() => setK(i)}><span>{t}</span>{k === i && <div role="toolbar" aria-label={`${t} actions`}><button type="button" aria-label="Open"><Ico n="eye" /></button><button type="button" aria-label="Copy"><Ico n="copy" /></button><button type="button" aria-label="Delete"><Ico n="trash" /></button></div>}</li>)}
    </ul>
  );
}

/* 36 */ function NotifPop() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.wrap}>
      <button type="button" className={c.bellBtn} aria-haspopup="dialog" aria-expanded={open} aria-label="Notifications, 3 new" onClick={() => setOpen(!open)}><Ico n="bell" /><b>3</b></button>
      {open && <div className={`${c.pop} ${c.bottomR} ${c.notif}`} role="dialog" aria-label="Notifications">{['Build passed', 'Ada commented', 'Invite accepted'].map((t) => <p key={t}>{t}</p>)}</div>}
    </div>
  );
}

/* 37 */ function SettingsPop() {
  const [open, setOpen, ref] = useOpen();
  const [on, flip] = useToggle(true);
  const [v, setV] = useState(60);
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}><Ico n="gear" />View</Trigger>
      {open && <div className={`${c.pop} ${c.bottom} ${c.settings}`} role="dialog" aria-label="View settings"><label><span>Grid</span><input type="checkbox" checked={on} onChange={flip} /></label><label><span>Zoom {v}%</span><input type="range" min="20" max="100" value={v} onChange={(e) => setV(Number(e.target.value))} /></label></div>}
    </div>
  );
}

/* 38 */ function StepPop() {
  const [k, setK] = useState(1);
  return (
    <div className={c.steps}>
      <ol>{['Draft', 'Review', 'Live'].map((t, i) => <li key={t}><button type="button" aria-current={i === k ? 'step' : undefined} onClick={() => setK(i)}>{i + 1}</button>{i === k && <em>{t}</em>}</li>)}</ol>
    </div>
  );
}

/* 39 */ function Themed() {
  const [dark, flip] = useToggle(true);
  const [open, bind] = useTip();
  return (
    <div className={c.col}>
      <span className={c.wrap}><Trigger aria-describedby="tp-39" {...bind}>Tip</Trigger><span id="tp-39" role="tooltip" className={`${c.tip} ${c.top} ${dark ? c.darkTip : ''}`} data-open={open}>{dark ? 'Dark tip' : 'Light tip'}</span></span>
      <button type="button" className={c.next} aria-pressed={dark} onClick={flip}>{dark ? 'Make light' : 'Make dark'}</button>
    </div>
  );
}

/* 40 */ function Placements() {
  const all = ['top-start', 'top', 'top-end', 'left', 'right', 'bottom-start', 'bottom', 'bottom-end'];
  const [p, setP] = useState('top');
  return (
    <div className={c.place}>
      <div className={c.placeStage}><span data-p={p}>{p}</span><i /></div>
      <div role="radiogroup" aria-label="Placement">{all.map((a) => <button key={a} type="button" role="radio" aria-checked={a === p} aria-label={a} data-p={a} onClick={() => setP(a)} />)}</div>
    </div>
  );
}

/* 41 */ function Nested() {
  const [open, setOpen, ref] = useOpen();
  const [inner, flip] = useToggle();
  return (
    <div ref={ref} className={c.wrap}>
      <Trigger aria-haspopup="dialog" aria-expanded={open} onClick={() => { setOpen(!open); }}>Options</Trigger>
      {open && <div className={`${c.pop} ${c.bottom} ${c.nested}`} role="dialog" aria-label="Options"><button type="button" aria-expanded={inner} onClick={flip}>More…</button>{inner && <div className={c.pop2} role="note">A popover inside a popover.</div>}</div>}
    </div>
  );
}

/* 42 */ function Flip() {
  const [pos, setPos] = useState({ x: 40, y: 70 });
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: clamp(((e.clientX - r.left) / r.width) * 100, 6, 94), y: clamp(((e.clientY - r.top) / r.height) * 100, 12, 90) }); };
  const above = pos.y > 45;
  return (
    <div className={c.flip} onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); }} onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) move(e); }} tabIndex={0} role="application" aria-label="Drag the anchor to the top or bottom edge; the popover flips" onKeyDown={(e) => { const d = { ArrowUp: [0, -10], ArrowDown: [0, 10], ArrowLeft: [-10, 0], ArrowRight: [10, 0] }[e.key]; if (d) { e.preventDefault(); setPos((q) => ({ x: clamp(q.x + d[0], 6, 94), y: clamp(q.y + d[1], 12, 90) })); } }}>
      <i style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
      <span style={{ left: `${pos.x}%`, top: `${pos.y}%` }} data-above={above}>{above ? 'Flipped above' : 'Fits below'}</span>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Top tooltip', TipTop, 'hover'], ['Side picker', Sides, 'click'], ['Rich tooltip', Rich, 'hover'], ['Hover card', HoverCard, 'hover'],
    ['Click popover', ClickPop, 'click'], ['Confirm popover', Confirm, 'click'], ['Following tip', Follow, 'hover'], ['Speech bubble', Bubbles, 'click'],
    ['Coachmark', Coach, 'click'], ['Product hotspots', Hotspots, 'hover'], ['Footnote bubble', Footnote, 'click'], ['Term tooltip', Glossary, 'hover'],
    ['Colour popover', ColourPop, 'click'], ['Date popover', DatePop, 'click'], ['Reaction popover', ReactPop, 'click'], ['Link preview', LinkPreview, 'hover'],
    ['Edit in place', Inline, 'click'], ['Share popover', SharePop, 'click'], ['Info popover', InfoI, 'click'], ['Field error tip', FieldError, 'type'],
    ['Key hint tip', KeyHint, 'hover'], ['Delayed tip', Delayed, 'hover'], ['Pinned tip', Sticky, 'click'], ['Tour popover', Tour, 'click'],
    ['Chart tip', ChartTip, 'hover'], ['Avatar tips', Avatars, 'hover'], ['Why disabled', Disabled, 'hover'], ['Truncated name', Truncated, 'hover'],
    ['Thumbnail preview', Thumb, 'hover'], ['Map pin popover', MapPin, 'click'], ['Calendar day tip', CalDay, 'hover'], ['Definition card', DefCard, 'hover'],
    ['Drop-down notice', DropDown, 'click'], ['Assistant bubble', AssistBubble, 'click'], ['Row actions', RowActions, 'hover'], ['Notification popover', NotifPop, 'click'],
    ['Settings popover', SettingsPop, 'click'], ['Step popover', StepPop, 'click'], ['Themed tip', Themed, 'click'], ['Placement picker', Placements, 'click'],
    ['Nested popover', Nested, 'click'], ['Flipping popover', Flip, 'drag'],
  ],
};
