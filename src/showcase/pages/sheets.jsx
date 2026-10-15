import { useEffect, useRef, useState } from 'react';
import { clamp, useDrag, useLive, useToggle } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Ico } from '../icons';
import c from './sheets.module.css';

/* ============================================================
   32 · SHEETS — drawers, modals and layered panes.
   The still side is a stack of five panes in depth: the scroll slides them
   apart along the view axis, each lifting out of the pile in turn, the way
   layers come apart in a design tool. Every specimen lives in a small stage of
   its own (so a "full screen" sheet only fills its box), traps nothing,
   and closes with its own button or Escape.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.stack}>
        {['SCRIM', 'PANE 04', 'PANE 03', 'PANE 02', 'PANE 01'].map((t, k) => <section key={t} style={{ '--k': k }}><b>{t}</b><i /></section>)}
      </div>
      <small>5 LAYERS · 1 AXIS</small>
    </div>
  );
}

function Stage({ label, children, className = '', onEscape }) {
  return <div className={`${c.stage} ${className}`} role="group" aria-label={label} onKeyDown={(e) => { if (e.key === 'Escape') onEscape?.(); }}>{children}</div>;
}
/* the button that opens a stage's sheet. Until someone presses it, it opens and closes the sheet
   by itself now and then while the specimen is on screen, so a stage is never an empty box
   (not under reduced motion). */
function Open({ on, set, children = 'Open' }) {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const touched = useRef(false);
  const latest = useRef(set);
  useEffect(() => { latest.current = set; });
  useEffect(() => {
    if (!live || reduced) return undefined;
    let off = 0;
    const cycle = () => {
      if (touched.current) return;
      latest.current(true);
      off = setTimeout(() => { if (!touched.current) latest.current(false); }, 2300);
    };
    const first = setTimeout(cycle, 1100);
    const loop = setInterval(cycle, 6800);
    return () => { clearTimeout(first); clearTimeout(off); clearInterval(loop); };
  }, [live, reduced]);
  return <button type="button" className={c.open} aria-expanded={on} onClick={() => { touched.current = true; set(!on); }}>{on ? 'Close' : children}</button>;
}

/* 1 */ function Bottom() {
  const [on, set] = useState(false);
  return <Stage label="Bottom sheet" onEscape={() => set(false)}><Open on={on} set={set} /><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={c.bottom} data-on={on} role="dialog" aria-label="Bottom sheet" inert={!on || undefined}><u /><b>Choose a size</b><p>Small, medium or large.</p></div></Stage>;
}

/* 2 */ function Right() {
  const [on, set] = useState(false);
  return <Stage label="Right drawer" onEscape={() => set(false)}><Open on={on} set={set} /><i className={c.scrim} data-on={on} onClick={() => set(false)} /><aside className={c.right} data-on={on} aria-label="Right drawer" inert={!on || undefined}><b>Details</b><p>Opens from the edge.</p><button type="button" onClick={() => set(false)}>Close</button></aside></Stage>;
}

/* 3 */ function Left() {
  const [on, set] = useState(false);
  return <Stage label="Left drawer" onEscape={() => set(false)}><Open on={on} set={set} /><i className={c.scrim} data-on={on} onClick={() => set(false)} /><nav className={c.left} data-on={on} aria-label="Left drawer" inert={!on || undefined}>{['Home', 'Work', 'Notes'].map((t) => <a key={t} href="#left" onClick={(e) => e.preventDefault()}>{t}</a>)}</nav></Stage>;
}

/* 4 */ function Modal() {
  const [on, set] = useState(false);
  return <Stage label="Modal" onEscape={() => set(false)}><Open on={on} set={set} /><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={c.modal} data-on={on} role="dialog" aria-modal="true" aria-label="Modal" inert={!on || undefined}><b>Heads up</b><p>A centred dialog.</p><button type="button" onClick={() => set(false)}>Okay</button></div></Stage>;
}

/* 5 */ function Alert() {
  const [on, set] = useState(false);
  const [r, setR] = useState('');
  return <Stage label="Alert dialog" onEscape={() => set(false)}><Open on={on} set={set}>Discard</Open><i className={c.scrim} data-on={on} /><div className={c.modal} data-on={on} role="alertdialog" aria-modal="true" aria-label="Discard changes" inert={!on || undefined}><b>Discard changes?</b><span><button type="button" onClick={() => { setR('kept'); set(false); }}>Keep</button><button type="button" data-bad onClick={() => { setR('dropped'); set(false); }}>Discard</button></span></div>{r && !on && <em className={c.said}>Changes {r}</em>}</Stage>;
}

/* 6 */ function Takeover() {
  const [on, set] = useState(false);
  return <Stage label="Full-screen takeover" onEscape={() => set(false)}><Open on={on} set={set} /><div className={c.full} data-on={on} role="dialog" aria-label="Full screen" inert={!on || undefined}><button type="button" aria-label="Close" onClick={() => set(false)}><Ico n="close" /></button><b>Full</b><p>Fills the stage.</p></div></Stage>;
}

/* 7 */ function Pushed() {
  const [d, setD] = useState(0);
  return (
    <Stage label="Pushed panes">
      <div className={c.pushes}>{[0, 1, 2].map((k) => <section key={k} style={{ '--k': k, '--d': d - k }} aria-hidden={k !== d}><b>Pane {k + 1}</b>{k < 2 && <button type="button" tabIndex={k === d ? 0 : -1} onClick={() => setD(k + 1)}>Push</button>}{k > 0 && <button type="button" tabIndex={k === d ? 0 : -1} onClick={() => setD(k - 1)}>Back</button>}</section>)}</div>
    </Stage>
  );
}

/* 8 */ function Snap() {
  const [v, bind, set] = useDrag({ mode: 'y', init: 0.25, steps: 0 });
  const snap = () => set(v < 0.3 ? 0.18 : v < 0.62 ? 0.5 : 0.85);
  return (
    <Stage label="Snapping sheet">
      <div className={c.snapSheet} style={{ '--h': v }}>
        <div className={c.grab} {...bind} aria-label="Sheet handle, drag or use arrow keys" aria-valuetext={`${Math.round(v * 100)} percent open`} onPointerUp={snap} onKeyUp={snap} style={{ ...bind.style }}><u /></div>
        <p>Drag me to a snap point.</p>
      </div>
    </Stage>
  );
}

/* 9 */ function Peek() {
  const [on, set] = useToggle();
  return <Stage label="Peeking sheet"><div className={c.peek} data-on={on}><button type="button" aria-expanded={on} onClick={set}><u /><b>Now playing</b></button><div inert={!on || undefined}><p>Slow Static · Side B</p><span /></div></div></Stage>;
}

/* 10 */ function Curtain() {
  const [on, set] = useState(false);
  return <Stage label="Dropping banner" onEscape={() => set(false)}><Open on={on} set={set} /><div className={c.drop} data-on={on} role="note"><b>Spring call</b><span>Send work by Friday.</span></div></Stage>;
}

/* 11 */ function SplitPane() {
  const [v, bind] = useDrag({ init: 0.4 });
  return (
    <Stage label="Split pane">
      <div className={c.split} style={{ '--v': v }}><section><b>List</b></section><i {...bind} aria-label="Resize panes" aria-valuetext={`${Math.round(v * 100)} percent`} style={bind.style} /><section><b>Detail</b></section></div>
    </Stage>
  );
}

/* 12 */ function SlideOver() {
  const [k, setK] = useState(-1);
  return (
    <Stage label="Slide-over detail">
      <ul className={c.list}>{['Alpha', 'Beta', 'Gamma'].map((t, i) => <li key={t}><button type="button" aria-expanded={k === i} onClick={() => setK(k === i ? -1 : i)}>{t}</button></li>)}</ul>
      <div className={c.over} data-on={k >= 0} inert={k < 0 || undefined}><button type="button" aria-label="Close" onClick={() => setK(-1)}><Ico n="left" /></button><b>{['Alpha', 'Beta', 'Gamma'][Math.max(k, 0)]}</b><p>Detail slides over the list.</p></div>
    </Stage>
  );
}

/* 13 */ function Palette() {
  const [on, set] = useState(false);
  return <Stage label="Command palette" onEscape={() => set(false)}><Open on={on} set={set} /><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={c.pal} data-on={on} role="dialog" aria-label="Command palette" inert={!on || undefined}><input aria-label="Command" placeholder="Type a command" /><ul>{['New file', 'Open…', 'Toggle theme'].map((t) => <li key={t}>{t}</li>)}</ul></div></Stage>;
}

/* 14 */ function Lightbox() {
  const [on, set] = useState(false);
  return <Stage label="Lightbox" onEscape={() => set(false)}><button type="button" className={c.thumb} aria-label="Open picture" onClick={() => set(true)} /><div className={c.light} data-on={on} role="dialog" aria-label="Picture" inert={!on || undefined} onClick={() => set(false)}><div /><button type="button" aria-label="Close picture" onClick={() => set(false)}><Ico n="close" /></button></div></Stage>;
}

/* 15 */ function Prefs() {
  const [on, set] = useState(false);
  const [a, flipA] = useToggle(true);
  const [b, flipB] = useToggle();
  return <Stage label="Preferences sheet" onEscape={() => set(false)}><Open on={on} set={set}>Prefs</Open><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={c.bottom} data-on={on} role="dialog" aria-label="Preferences" inert={!on || undefined}><u /><label><span>Motion</span><input type="checkbox" checked={a} onChange={flipA} /></label><label><span>Sound</span><input type="checkbox" checked={b} onChange={flipB} /></label></div></Stage>;
}

/* 16 */ function ShareSheet() {
  const [on, set] = useState(false);
  return <Stage label="Share sheet" onEscape={() => set(false)}><Open on={on} set={set}>Share</Open><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={`${c.bottom} ${c.tall}`} data-on={on} role="dialog" aria-label="Share" inert={!on || undefined}><u /><div className={c.apps}>{[['mail', 'Mail'], ['chat', 'Chat'], ['link', 'Link'], ['copy', 'Copy']].map(([n, t]) => <button key={n} type="button" onClick={() => set(false)}><Ico n={n} /><span>{t}</span></button>)}</div></div></Stage>;
}

/* 17 */ function Onboard() {
  const [i, setI] = useState(-1);
  const steps = [['Welcome', 'A short tour.'], ['Pick a theme', 'Dark, of course.'], ['All set', 'Off you go.']];
  return <Stage label="Onboarding modal" onEscape={() => setI(-1)}><Open on={i >= 0} set={(v) => setI(v ? 0 : -1)}>Start</Open><i className={c.scrim} data-on={i >= 0} /><div className={c.modal} data-on={i >= 0} role="dialog" aria-modal="true" aria-label="Onboarding" inert={i < 0 || undefined}><b>{steps[Math.max(i, 0)][0]}</b><p>{steps[Math.max(i, 0)][1]}</p><button type="button" onClick={() => setI(i >= 2 ? -1 : i + 1)}>{i >= 2 ? 'Done' : 'Next'}</button></div></Stage>;
}

/* 18 */ function FormModal() {
  const [on, set] = useState(false);
  return <Stage label="Form modal" onEscape={() => set(false)}><Open on={on} set={set}>New</Open><i className={c.scrim} data-on={on} onClick={() => set(false)} /><form className={c.modal} data-on={on} role="dialog" aria-modal="true" aria-label="New item" inert={!on || undefined} onSubmit={(e) => { e.preventDefault(); set(false); }}><label>Name<input /></label><button type="submit">Create</button></form></Stage>;
}

/* 19 */ function PickerSheet() {
  const [on, set] = useState(false);
  const [k, setK] = useState(1);
  return <Stage label="Picker sheet" onEscape={() => set(false)}><Open on={on} set={set}>Pick</Open><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={`${c.bottom} ${c.tall}`} data-on={on} role="dialog" aria-label="Pick an image" inert={!on || undefined}><u /><div className={c.pick} role="radiogroup" aria-label="Images">{[0, 1, 2, 3].map((i) => <button key={i} type="button" role="radio" aria-checked={i === k} aria-label={`Image ${i + 1}`} style={{ '--h': i * 70 }} onClick={() => { setK(i); set(false); }} />)}</div></div></Stage>;
}

/* 20 */ function Nested() {
  const [d, setD] = useState(0);
  return (
    <Stage label="Nested sheets" onEscape={() => setD(Math.max(0, d - 1))}>
      <button type="button" className={c.open} onClick={() => setD(1)}>Open</button>
      <i className={c.scrim} data-on={d > 0} />
      <div className={c.nest} data-on={d > 0} style={{ '--d': d }} role="dialog" aria-label="First sheet" inert={d !== 1 || undefined}><b>One</b><button type="button" onClick={() => setD(2)}>Open another</button><button type="button" onClick={() => setD(0)}>Close</button></div>
      <div className={`${c.nest} ${c.nest2}`} data-on={d > 1} role="dialog" aria-label="Second sheet" inert={d !== 2 || undefined}><b>Two</b><button type="button" onClick={() => setD(1)}>Back</button></div>
    </Stage>
  );
}

/* 21 */ function Expand() {
  const [on, set] = useToggle();
  return <Stage label="Card to modal"><button type="button" className={c.card} data-on={on} aria-expanded={on} onClick={set}><b>Quiet hours</b><span>{on ? 'From ten at night until seven, nothing buzzes. Tap again to fold it away.' : 'Tap to open'}</span></button></Stage>;
}

/* 22 */ function AccDrawer() {
  const [k, setK] = useState(0);
  return <Stage label="Accordion drawer"><div className={c.acc}>{['Basics', 'Colour', 'Type'].map((t, i) => <section key={t} data-on={i === k}><button type="button" aria-expanded={i === k} onClick={() => setK(i)}>{t}</button><p>{i === k ? 'Settings for ' + t.toLowerCase() + '.' : ''}</p></section>)}</div></Stage>;
}

/* 23 */ function MenuOverlay() {
  const [on, set] = useState(false);
  return <Stage label="Menu overlay" onEscape={() => set(false)}><Open on={on} set={set}>Menu</Open><nav className={c.menuO} data-on={on} aria-label="Menu overlay" inert={!on || undefined}>{['Index', 'Work', 'Lab', 'Mail'].map((t, k) => <a key={t} href="#mo" style={{ '--k': k }} onClick={(e) => e.preventDefault()}>{t}</a>)}</nav></Stage>;
}

/* 24 */ function Filters() {
  const [on, set] = useState(false);
  const [sel, setSel] = useState(['New']);
  const flip = (t) => setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  return <Stage label="Filters sheet" onEscape={() => set(false)}><Open on={on} set={set}>Filters</Open><i className={c.scrim} data-on={on} onClick={() => set(false)} /><div className={`${c.bottom} ${c.tall}`} data-on={on} role="dialog" aria-label="Filters" inert={!on || undefined}><u /><div className={c.chips}>{['New', 'Sale', 'Local', 'Used'].map((t) => <button key={t} type="button" aria-pressed={sel.includes(t)} onClick={() => flip(t)}>{t}</button>)}</div><button type="button" className={c.apply} onClick={() => set(false)}>Show {sel.length * 12} results</button></div></Stage>;
}

/* 25 */ function Corner() {
  const [on, set] = useToggle();
  return <Stage label="Corner sheet"><div className={c.corner} data-on={on}><button type="button" aria-expanded={on} aria-label="Chat" onClick={set}><Ico n={on ? 'close' : 'chat'} /></button><div inert={!on || undefined} role="dialog" aria-label="Chat"><b>Chat</b><p>Hi there.</p></div></div></Stage>;
}

/* 26 */ function Hinge() {
  const [on, set] = useToggle();
  return <Stage label="Fold-out panel"><div className={c.hinge} data-on={on}><button type="button" aria-expanded={on} onClick={set}>Fold</button><div inert={!on || undefined}><b>Tucked away</b></div></div></Stage>;
}

/* 27 */ function Doors() {
  const [on, set] = useToggle();
  return <Stage label="Curtain"><div className={c.doors} data-on={on}><i /><i /><p>Behind the curtain</p></div><button type="button" className={c.open} aria-pressed={on} onClick={set}>{on ? 'Close' : 'Open'}</button></Stage>;
}

/* 28 */ function Deck() {
  const [top, setTop] = useState(0);
  return (
    <Stage label="Layered deck">
      <div className={c.deck}>{[0, 1, 2, 3].map((k) => <section key={k} style={{ '--p': (k - top + 4) % 4 }} aria-hidden={(k - top + 4) % 4 !== 0}><b>0{k + 1}</b></section>)}</div>
      <button type="button" className={c.open} onClick={() => setTop((top + 1) % 4)}>Shuffle</button>
    </Stage>
  );
}

/* 29 */ function Parallax() {
  const [p, setP] = useState(0.5);
  return (
    <Stage label="Parallax sheets">
      <div className={c.para} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP(clamp((e.clientX - r.left) / r.width)); }} tabIndex={0} role="application" aria-label="Move across to slide the layers" onKeyDown={(e) => { if (e.key === 'ArrowLeft') setP((v) => clamp(v - 0.1)); if (e.key === 'ArrowRight') setP((v) => clamp(v + 0.1)); }}>
        {[0, 1, 2].map((k) => <i key={k} style={{ '--k': k, '--p': p }} />)}
      </div>
    </Stage>
  );
}

/* 30 */ function Papers() {
  const [spread, set] = useToggle();
  return <Stage label="Pile of papers"><div className={c.papers} data-on={spread}>{[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ '--k': k }} />)}</div><button type="button" className={c.open} aria-pressed={spread} onClick={set}>{spread ? 'Stack' : 'Spread'}</button></Stage>;
}

/* 31 */ function Windowed() {
  const [s, setS] = useState('open');
  return (
    <Stage label="Window">
      {s === 'open' && <div className={c.win}><header><button type="button" aria-label="Close window" onClick={() => setS('closed')} /><button type="button" aria-label="Minimise window" onClick={() => setS('min')} /><button type="button" aria-label="Zoom window" /><span>Notes</span></header><p>A tiny window.</p></div>}
      {s === 'min' && <button type="button" className={c.dockBtn} onClick={() => setS('open')}>Notes</button>}
      {s === 'closed' && <button type="button" className={c.open} onClick={() => setS('open')}>Reopen</button>}
    </Stage>
  );
}

/* 32 */ function TabPanes() {
  const [k, setK] = useState(0);
  return (
    <Stage label="Tabbed panes">
      <div className={c.tabbed}><div role="tablist" aria-label="Panes">{['One', 'Two', 'Three'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}>{t}</button>)}</div><section style={{ '--k': k }}>{['Pane one', 'Pane two', 'Pane three'].map((t) => <p key={t}>{t}</p>)}</section></div>
    </Stage>
  );
}

/* 33 */ function Corner2() {
  const [v, bind] = useDrag({ init: 0.5 });
  return <Stage label="Resizable sheet"><div className={c.resize} style={{ '--v': v }}><b>Resize</b><i {...bind} aria-label="Resize handle" aria-valuetext={`${Math.round(60 + v * 40)} percent`} style={bind.style} /></div></Stage>;
}

/* 34 */ function Blurred() {
  const [on, set] = useState(false);
  return <Stage label="Blurred backdrop" onEscape={() => set(false)} className={c.busy}><Open on={on} set={set} /><div className={c.blurScrim} data-on={on} onClick={() => set(false)} /><div className={c.modal} data-on={on} role="dialog" aria-label="Blurred backdrop" inert={!on || undefined}><b>Out of focus</b><p>The page behind softens.</p></div></Stage>;
}

/* 35 */ function SwipeDismiss() {
  const [v, bind, set] = useDrag({ mode: 'y', init: 1 });
  const [gone, setGone] = useState(false);
  return <Stage label="Swipe down to dismiss">{gone ? <button type="button" className={c.open} onClick={() => { setGone(false); set(1); }}>Bring back</button> : <div className={c.swipeSheet} {...bind} style={{ ...bind.style, '--v': v }} aria-label="Sheet, drag down to dismiss" onPointerUp={() => { if (v < 0.45) setGone(true); else set(1); }} onKeyUp={(e) => { if (e.key === 'ArrowDown' && v < 0.45) setGone(true); }}><u /><b>Drag me down</b></div>}</Stage>;
}

/* 36 */ function Glass() {
  const [on, set] = useToggle(true);
  return <Stage label="Glass pane" className={c.gradient}><div className={c.glass} data-on={on}><b>Frosted</b><p>Light passes, detail does not.</p></div><button type="button" className={c.open} aria-pressed={on} onClick={set}>{on ? 'Clear' : 'Frost'}</button></Stage>;
}

/* 37 */ function Raise() {
  const [k, setK] = useState(1);
  return <Stage label="Raise a layer"><div className={c.raise}>{[0, 1, 2].map((i) => <button key={i} type="button" aria-pressed={i === k} style={{ '--i': i, '--z': i === k ? 9 : 3 - Math.abs(i - k) }} onClick={() => setK(i)}>Layer {i + 1}</button>)}</div></Stage>;
}

/* 38 */ function MiniPlayer() {
  const [big, set] = useToggle();
  return <Stage label="Expanding player"><div className={c.player} data-big={big}><button type="button" aria-expanded={big} aria-label={big ? 'Collapse player' : 'Expand player'} onClick={set}><i /><span><b>Slow Static</b><small>Side B</small></span></button><div inert={!big || undefined}><u /><p>Lyrics, queue and the rest.</p></div></div></Stage>;
}

/* 39 */ function Wizard() {
  const [i, setI] = useState(-1);
  return <Stage label="Dialog sequence" onEscape={() => setI(-1)}><Open on={i >= 0} set={(v) => setI(v ? 0 : -1)}>Begin</Open><i className={c.scrim} data-on={i >= 0} /><div className={c.modal} data-on={i >= 0} role="dialog" aria-modal="true" aria-label="Steps" inert={i < 0 || undefined}><ol>{[0, 1, 2].map((k) => <li key={k} data-on={k <= i} />)}</ol><p>Step {Math.max(i, 0) + 1} of 3</p><span><button type="button" disabled={i <= 0} onClick={() => setI(i - 1)}>Back</button><button type="button" onClick={() => setI(i >= 2 ? -1 : i + 1)}>{i >= 2 ? 'Finish' : 'Next'}</button></span></div></Stage>;
}

/* 40 */ function SidePeek() {
  const [v, bind] = useDrag({ init: 0.1 });
  return <Stage label="Side peek"><div className={c.sidePeek} style={{ '--v': v }}><aside><b>Panel</b></aside><i {...bind} aria-label="Pull the panel open" aria-valuetext={`${Math.round(v * 100)} percent`} style={bind.style} /></div></Stage>;
}

/* 41 */ function Toast2() {
  const [on, set] = useState(false);
  return <Stage label="Sheet with undo" onEscape={() => set(false)}><Open on={on} set={set}>Archive</Open><div className={c.undoBar} data-on={on} role="status"><span>Archived</span><button type="button" onClick={() => set(false)}>Undo</button></div></Stage>;
}

/* 42 */ function Layers() {
  const [n, setN] = useState(3);
  return (
    <Stage label="Stacked layers">
      <div className={c.layers}>{Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
      <span className={c.pm}><button type="button" aria-label="Remove a layer" disabled={n <= 1} onClick={() => setN(n - 1)}><Ico n="minus" /></button><output>{n}</output><button type="button" aria-label="Add a layer" disabled={n >= 6} onClick={() => setN(n + 1)}><Ico n="plus" /></button></span>
    </Stage>
  );
}

export default {
  Visual,
  items: [
    ['Bottom sheet', Bottom, 'click'], ['Side drawer', Right, 'click'], ['Nav drawer', Left, 'click'], ['Centred modal', Modal, 'click'],
    ['Discard dialog', Alert, 'click'], ['Full takeover', Takeover, 'click'], ['Pushed panes', Pushed, 'click'], ['Snapping sheet', Snap, 'drag'],
    ['Peeking sheet', Peek, 'click'], ['Dropping banner', Curtain, 'click'], ['Split pane', SplitPane, 'drag'], ['Slide-over detail', SlideOver, 'click'],
    ['Command modal', Palette, 'click'], ['Lightbox', Lightbox, 'click'], ['Preferences sheet', Prefs, 'click'], ['Share sheet', ShareSheet, 'click'],
    ['Tour modal', Onboard, 'click'], ['Form modal', FormModal, 'click'], ['Picker sheet', PickerSheet, 'click'], ['Nested sheets', Nested, 'click'],
    ['Card to modal', Expand, 'click'], ['Accordion drawer', AccDrawer, 'click'], ['Menu overlay', MenuOverlay, 'click'], ['Filters sheet', Filters, 'click'],
    ['Corner chat', Corner, 'click'], ['Fold-out panel', Hinge, 'click'], ['Curtain doors', Doors, 'click'], ['Layered deck', Deck, 'click'],
    ['Parallax sheets', Parallax, 'hover'], ['Pile of papers', Papers, 'click'], ['Mini window', Windowed, 'click'], ['Tabbed panes', TabPanes, 'click'],
    ['Resizable sheet', Corner2, 'drag'], ['Blurred backdrop', Blurred, 'click'], ['Swipe to dismiss', SwipeDismiss, 'drag'], ['Glass pane', Glass, 'click'],
    ['Raise a layer', Raise, 'click'], ['Expanding player', MiniPlayer, 'click'], ['Dialog sequence', Wizard, 'click'], ['Side peek', SidePeek, 'drag'],
    ['Sheet with undo', Toast2, 'click'], ['Layer stack', Layers, 'click'],
  ],
};
