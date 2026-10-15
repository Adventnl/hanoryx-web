import { useEffect, useRef, useState } from 'react';
import { clamp, useCycle, useDrag, useTick, useToggle } from '../hooks';
import { Ico } from '../icons';
import c from './docks.module.css';

/* ============================================================
   22 · DOCKS — floating bars, rails and toolbars.
   The still side is a dock of seven discs with the classic magnification, but
   driven by the scroll: a swell travels along the row as the page moves, so
   the disc under the "cursor" rises and its neighbours follow.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visDock}>{Array.from({ length: 7 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
      <div className={c.visShelf} />
      <div className={c.visBar}><i /></div>
      <small>7 ITEMS · ONE SWELL</small>
    </div>
  );
}

/* 1 */ function Magnify() {
  const [x, setX] = useState(null);
  const icons = ['home', 'folder', 'mail', 'camera', 'gear'];
  return (
    <div className={c.mag} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * icons.length - 0.5); }} onPointerLeave={() => setX(null)} role="toolbar" aria-label="Magnifying dock">
      {icons.map((n, k) => (
        <button key={n} type="button" aria-label={n} style={{ '--s': x === null ? 0 : Math.max(0, 1 - Math.abs(k - x) * 0.55) }}><Ico n={n} /></button>
      ))}
    </div>
  );
}

/* 2 */ function IconRail() {
  const [k, setK] = useState(0);
  const icons = ['home', 'search', 'bell', 'user'];
  return (
    <div className={c.rail} role="toolbar" aria-label="Icon rail" aria-orientation="vertical" style={{ '--k': k }}>
      {icons.map((n, i) => <button key={n} type="button" aria-label={n} aria-pressed={i === k} onClick={() => setK(i)}><Ico n={n} /></button>)}
      <i aria-hidden="true" />
    </div>
  );
}

/* 3 */ function Grouped() {
  const [on, setOn] = useState({ pen: true });
  const flip = (n) => setOn((o) => ({ ...o, [n]: !o[n] }));
  const groups = [['pen', 'copy'], ['link', 'image'], ['share', 'download']];
  return (
    <div className={c.grouped} role="toolbar" aria-label="Grouped toolbar">
      {groups.map((g, gi) => (
        <span key={gi}>{g.map((n) => <button key={n} type="button" aria-label={n} aria-pressed={!!on[n]} onClick={() => flip(n)}><Ico n={n} /></button>)}</span>
      ))}
    </div>
  );
}

/* 4 */ function Format() {
  const [on, setOn] = useState({ bold: true, italic: false, underline: false });
  const flip = (n) => setOn((o) => ({ ...o, [n]: !o[n] }));
  return (
    <div className={c.format}>
      <div role="toolbar" aria-label="Text format">{['bold', 'italic', 'underline'].map((n) => <button key={n} type="button" aria-label={n} aria-pressed={on[n]} onClick={() => flip(n)}><Ico n={n} /></button>)}</div>
      <p style={{ fontWeight: on.bold ? 700 : 300, fontStyle: on.italic ? 'italic' : 'normal', textDecoration: on.underline ? 'underline' : 'none' }}>The quick brown fox</p>
    </div>
  );
}

/* 5 */ function Command() {
  const [open, setOpen] = useState(false);
  return (
    <div className={c.command}>
      <button type="button" aria-expanded={open} aria-label="Command bar" onClick={() => setOpen(!open)}><Ico n="search" /><span>Search or jump to…</span><kbd>⌘K</kbd></button>
      {open && <ul>{['Open file', 'Run task', 'Go to line'].map((t) => <li key={t}>{t}</li>)}</ul>}
    </div>
  );
}

/* 6 */ function DotDock() {
  const [dots, setDots] = useState([3, 0, 1, 0]);
  const icons = ['mail', 'chat', 'bell', 'heart'];
  return (
    <div className={c.dots} role="toolbar" aria-label="Dock with notification dots">
      {icons.map((n, k) => (
        <button key={n} type="button" aria-label={`${n}${dots[k] ? `, ${dots[k]} new` : ''}`} onClick={() => setDots((d) => d.map((v, j) => (j === k ? (v ? 0 : k + 1) : v)))}>
          <Ico n={n} />{dots[k] > 0 && <b aria-hidden="true">{dots[k]}</b>}
        </button>
      ))}
    </div>
  );
}

/* 7 */ function Expanding() {
  const [open, setOpen] = useState(false);
  const rows = [['home', 'Home'], ['folder', 'Files'], ['gear', 'Settings']];
  return (
    <nav className={c.expand} data-open={open} aria-label="Expanding rail">
      <button type="button" aria-expanded={open} aria-label={open ? 'Collapse rail' : 'Expand rail'} onClick={() => setOpen(!open)}><Ico n={open ? 'left' : 'right'} /></button>
      {rows.map(([n, t]) => <a key={n} href="#expanding" onClick={(e) => e.preventDefault()}><Ico n={n} /><span>{t}</span></a>)}
    </nav>
  );
}

/* 8 */ function Transport() {
  const [on, flip] = useToggle();
  const [t, setT] = useState(0.35);
  useEffect(() => {
    if (!on) return undefined;
    const id = setInterval(() => setT((v) => (v >= 1 ? 0 : v + 0.02)), 120);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div className={c.transport}>
      <div role="toolbar" aria-label="Transport bar">
        <button type="button" aria-label="Previous" onClick={() => setT(0)}><Ico n="prev" /></button>
        <button type="button" aria-label={on ? 'Pause' : 'Play'} aria-pressed={on} onClick={flip}><Ico n={on ? 'pause' : 'play'} /></button>
        <button type="button" aria-label="Next" onClick={() => setT(1)}><Ico n="next" /></button>
      </div>
      <i style={{ '--t': t }} aria-hidden="true" />
    </div>
  );
}

/* 9 */ function ZoomBar() {
  const [z, setZ] = useState(100);
  return (
    <div className={c.zoom} role="group" aria-label="Zoom bar">
      <button type="button" aria-label="Zoom out" disabled={z <= 25} onClick={() => setZ((v) => Math.max(25, v - 25))}><Ico n="minus" /></button>
      <output aria-live="polite">{z}%</output>
      <button type="button" aria-label="Zoom in" disabled={z >= 400} onClick={() => setZ((v) => Math.min(400, v + 25))}><Ico n="plus" /></button>
    </div>
  );
}

/* 10 */ function Reactions() {
  const faces = ['❤', '★', '✦', '◆'];
  const [n, setN] = useState([4, 1, 0, 2]);
  return (
    <div className={c.react} role="toolbar" aria-label="Reaction bar">
      {faces.map((f, k) => <button key={f} type="button" aria-label={`React ${f}, ${n[k]}`} onClick={() => setN((a) => a.map((v, j) => (j === k ? v + 1 : v)))}><span>{f}</span><b>{n[k]}</b></button>)}
    </div>
  );
}

/* 11 */ function Bubble() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.bubble}>
      {on && <div role="toolbar" aria-label="Selection bubble"><button type="button" aria-label="Bold"><Ico n="bold" /></button><button type="button" aria-label="Link"><Ico n="link" /></button><button type="button" aria-label="Comment"><Ico n="chat" /></button></div>}
      <p>A dock may <button type="button" aria-pressed={on} onClick={flip}>appear over a selection</button> and leave with it.</p>
    </div>
  );
}

/* 12 */ function SpeedDial() {
  const [open, flip] = useToggle();
  return (
    <div className={c.dial} data-open={open}>
      {['camera', 'image', 'pen'].map((n, k) => <button key={n} type="button" aria-label={n} tabIndex={open ? 0 : -1} style={{ '--k': k + 1 }}><Ico n={n} /></button>)}
      <button type="button" aria-expanded={open} aria-label="Speed dial" onClick={flip}><Ico n="plus" /></button>
    </div>
  );
}

/* 13 */ function ArcDock() {
  const [open, flip] = useToggle(true);
  const icons = ['home', 'star', 'bolt', 'user'];
  return (
    <div className={c.arc} data-open={open}>
      {icons.map((n, k) => <button key={n} type="button" aria-label={n} tabIndex={open ? 0 : -1} style={{ '--a': -60 + k * 40 }}><Ico n={n} /></button>)}
      <button type="button" aria-expanded={open} aria-label="Arc dock" onClick={flip}><Ico n="gear" /></button>
    </div>
  );
}

/* 14 */ function StatusStrip() {
  const [m, setM] = useState(0);
  const modes = ['NORMAL', 'INSERT', 'VISUAL'];
  return (
    <div className={c.status} role="status" aria-label="Status strip">
      <span>⎇ main</span><span>0 ✕ · 2 !</span><span>Ln 42, Col 7</span>
      <button type="button" aria-label={`Mode ${modes[m]}. Click to change`} onClick={() => setM((m + 1) % 3)} data-m={m}>{modes[m]}</button>
    </div>
  );
}

/* 15 */ function SectionRail() {
  const [open, setOpen] = useState(0);
  const secs = [['Projects', ['Alpha', 'Beta']], ['People', ['Ada', 'Lin']], ['Archive', ['2023']]];
  return (
    <nav className={c.sections} aria-label="Section rail">
      {secs.map(([t, kids], i) => (
        <div key={t}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><Ico n={open === i ? 'down' : 'right'} />{t}</button>
          {open === i && <ul>{kids.map((k) => <li key={k}>{k}</li>)}</ul>}
        </div>
      ))}
    </nav>
  );
}

/* 16 */ function Rearranging() {
  const [order, setOrder] = useState(['home', 'search', 'bell', 'user']);
  const [sel, setSel] = useState(1);
  const move = (d) => setOrder((o) => { const j = sel + d; if (j < 0 || j >= o.length) return o; const n = [...o]; [n[sel], n[j]] = [n[j], n[sel]]; setSel(j); return n; });
  return (
    <div className={c.reorder}>
      <div role="toolbar" aria-label="Rearranging dock">{order.map((n, k) => <button key={n} type="button" aria-label={n} aria-pressed={k === sel} onClick={() => setSel(k)}><Ico n={n} /></button>)}</div>
      <span><button type="button" aria-label="Move left" onClick={() => move(-1)}><Ico n="left" /></button><button type="button" aria-label="Move right" onClick={() => move(1)}><Ico n="right" /></button></span>
    </div>
  );
}

/* 17 */ function TipDock() {
  const names = ['Inbox', 'Tasks', 'Notes', 'Files'];
  const icons = ['mail', 'check', 'pen', 'folder'];
  return (
    <div className={c.tips} role="toolbar" aria-label="Dock with labels">
      {icons.map((n, k) => <button key={n} type="button" aria-label={names[k]} data-tip={names[k]}><Ico n={n} /></button>)}
    </div>
  );
}

/* 18 */ function Palette() {
  const [k, setK] = useState(2);
  const tools = ['pen', 'image', 'bolt', 'eye', 'link', 'flag', 'pin', 'star'];
  return (
    <div className={c.palette} role="toolbar" aria-label="Tool palette">
      {tools.map((n, i) => <button key={n} type="button" aria-label={n} aria-pressed={i === k} onClick={() => setK(i)}><Ico n={n} /></button>)}
    </div>
  );
}

/* 19 */ function SlideOut() {
  const [open, flip] = useToggle();
  return (
    <div className={c.slideOut} data-open={open}>
      <button type="button" aria-expanded={open} aria-label="Toggle toolbar" onClick={flip}><Ico n={open ? 'close' : 'list'} /></button>
      <div role="toolbar" aria-label="Slide-out bar" inert={!open || undefined}>{['pen', 'copy', 'trash'].map((n) => <button key={n} type="button" aria-label={n}><Ico n={n} /></button>)}</div>
    </div>
  );
}

/* 20 */ function Snap() {
  const [at, setAt] = useState('bottom');
  return (
    <div className={c.snap}>
      <div className={c.snapStage} data-at={at}><i aria-hidden="true" /></div>
      <div role="radiogroup" aria-label="Dock position">{['left', 'bottom', 'right'].map((p) => <button key={p} type="button" role="radio" aria-checked={at === p} onClick={() => setAt(p)}>{p}</button>)}</div>
    </div>
  );
}

/* 21 */ function MiniPlayer() {
  const [on, flip] = useToggle(true);
  const t = useTick(900);
  return (
    <div className={c.mini}>
      <i aria-hidden="true" data-spin={on} />
      <div><b>Slow Static</b><span>Side B · 3:41</span><u aria-hidden="true"><s style={{ width: `${on ? 12 + ((t * 7) % 80) : 36}%` }} /></u></div>
      <button type="button" aria-label={on ? 'Pause' : 'Play'} aria-pressed={on} onClick={flip}><Ico n={on ? 'pause' : 'play'} /></button>
    </div>
  );
}

/* 22 */ function CartDock() {
  const [n, setN] = useState(2);
  const [bump, setBump] = useState(0);
  return (
    <div className={c.cart}>
      <button type="button" onClick={() => { setN(n + 1); setBump((b) => b + 1); }}>Add item</button>
      <span aria-live="polite" aria-label={`Cart, ${n} items`}><Ico n="cart" /><b key={bump} data-bump={bump > 0}>{n}</b></span>
    </div>
  );
}

/* 23 */ function GlowDock() {
  const [k, setK] = useState(1);
  return (
    <div className={c.glow} role="toolbar" aria-label="Glow dock" style={{ '--k': k }}>
      {['home', 'bolt', 'heart', 'user'].map((n, i) => <button key={n} type="button" aria-label={n} aria-pressed={i === k} onClick={() => setK(i)}><Ico n={n} /></button>)}
      <i aria-hidden="true" />
    </div>
  );
}

/* 24 */ function SplitButton() {
  const [open, flip, set] = useToggle();
  const [label, setLabel] = useState('Save');
  return (
    <div className={c.split}>
      <div><button type="button">{label}</button><button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="More save options" onClick={flip}><Ico n="down" /></button></div>
      {open && <ul role="menu">{['Save', 'Save as…', 'Save all'].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => { setLabel(t.replace('…', '')); set(false); }}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 25 */ function SearchDock() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <form className={c.search} data-open={open} role="search" aria-label="Search dock" onSubmit={(e) => e.preventDefault()}>
      <button type="button" aria-label={open ? 'Close search' : 'Open search'} aria-expanded={open} onClick={() => { setOpen(!open); if (!open) setTimeout(() => ref.current?.focus(), 200); }}><Ico n="search" /></button>
      <input ref={ref} aria-label="Search" placeholder="Search…" tabIndex={open ? 0 : -1} />
    </form>
  );
}

/* 26 */ function FilterBar() {
  const [on, setOn] = useState(['New']);
  const flip = (t) => setOn((o) => (o.includes(t) ? o.filter((x) => x !== t) : [...o, t]));
  return (
    <div className={c.filter} role="group" aria-label="Filter bar">
      {['New', 'Hot', 'Saved', 'Mine'].map((t) => <button key={t} type="button" aria-pressed={on.includes(t)} onClick={() => flip(t)}>{on.includes(t) && <Ico n="check" />}{t}</button>)}
    </div>
  );
}

/* 27 */ function TextSize() {
  const [s, setS] = useState(1);
  return (
    <div className={c.size}>
      <div role="group" aria-label="Text size bar">
        <button type="button" aria-label="Smaller text" disabled={s <= 0} onClick={() => setS(s - 1)}>A−</button>
        <button type="button" aria-label="Reset text size" onClick={() => setS(1)}>A</button>
        <button type="button" aria-label="Larger text" disabled={s >= 3} onClick={() => setS(s + 1)}>A+</button>
      </div>
      <p style={{ fontSize: `${0.8 + s * 0.2}rem` }}>Sample text at size {s + 1}</p>
    </div>
  );
}

/* 28 */ function Ribbon() {
  const [t, setT] = useState(0);
  const groups = [[['pen', 'copy'], ['bold', 'italic']], [['image', 'link'], ['list', 'grid']], [['eye', 'lock'], ['flag', 'pin']]];
  return (
    <div className={c.ribbon}>
      <div role="tablist" aria-label="Ribbon tabs">{['Home', 'Insert', 'View'].map((n, i) => <button key={n} type="button" role="tab" aria-selected={i === t} onClick={() => setT(i)}>{n}</button>)}</div>
      <div role="toolbar" aria-label={`${['Home', 'Insert', 'View'][t]} tools`}>{groups[t].map((g, gi) => <span key={gi}>{g.map((n) => <button key={n} type="button" aria-label={n}><Ico n={n} /></button>)}</span>)}</div>
    </div>
  );
}

/* 29 */ function HideOnScroll() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className={c.hide}>
      <div className={c.hideBar} data-hidden={hidden} role="toolbar" aria-label="Bar that hides"><Ico n="home" /><Ico n="search" /><Ico n="user" /></div>
      <button type="button" aria-pressed={hidden} onClick={() => setHidden(!hidden)}>{hidden ? 'Scroll up' : 'Scroll down'}</button>
    </div>
  );
}

/* 30 */ function Island() {
  const [k, setK] = useState(0);
  const states = [['', ''], ['Now playing', '▶'], ['Timer 02:00', '◔'], ['Call in progress', '●']];
  return (
    <div className={c.island}>
      <button type="button" data-k={k} aria-label={`Island, ${states[k][0] || 'idle'}. Click to change`} onClick={() => setK((k + 1) % 4)}><span aria-hidden="true">{states[k][1]}</span><b>{states[k][0]}</b></button>
    </div>
  );
}

/* 31 */ function AvatarDock() {
  const names = ['A', 'B', 'C', 'D', 'E'];
  return (
    <div className={c.avatars} role="group" aria-label="Avatar dock">
      {names.map((n, k) => <button key={n} type="button" aria-label={`Person ${n}`} style={{ '--k': k }}>{n}</button>)}
      <span>+3</span>
    </div>
  );
}

/* 32 */ function ScrubBar() {
  const [v, bind] = useDrag({ init: 0.4, steps: 60 });
  return (
    <div className={c.scrub} {...bind} aria-label="Scrub bar" aria-valuetext={`${Math.round(v * 60)} seconds`} style={{ ...bind.style, '--v': v }}>
      <i aria-hidden="true" />
      {Array.from({ length: 13 }, (_, k) => <u key={k} aria-hidden="true" />)}
      <output>{String(Math.floor((v * 60) / 60)).padStart(2, '0')}:{String(Math.round(v * 60) % 60).padStart(2, '0')}</output>
    </div>
  );
}

/* 33 */ function ChatDock() {
  const [open, flip] = useToggle();
  return (
    <div className={c.chat} data-open={open}>
      {open && <div role="dialog" aria-label="Chat dock"><b>Support</b><p>Hello. Ask anything.</p><input aria-label="Message" placeholder="Type…" /></div>}
      <button type="button" aria-expanded={open} aria-label="Chat" onClick={flip}><Ico n={open ? 'close' : 'chat'} /></button>
    </div>
  );
}

/* 34 */ function Paging() {
  const [p, setP] = useState(2);
  return (
    <div className={c.paging} role="group" aria-label="Paging bar">
      <button type="button" aria-label="Previous page" disabled={p === 0} onClick={() => setP(p - 1)}><Ico n="left" /></button>
      {[0, 1, 2, 3, 4].map((k) => <i key={k} aria-hidden="true" data-on={k === p} />)}
      <button type="button" aria-label="Next page" disabled={p === 4} onClick={() => setP(p + 1)}><Ico n="right" /></button>
    </div>
  );
}

/* 35 */ function BuyBar() {
  const [added, flip] = useToggle();
  return (
    <div className={c.buy}>
      <div><b>€48</b><span>Free returns</span></div>
      <button type="button" aria-pressed={added} onClick={flip}>{added ? 'In bag ✓' : 'Add to bag'}</button>
    </div>
  );
}

/* 36 */ function SelectionBar() {
  const [sel, setSel] = useState([0, 2]);
  const flip = (k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return (
    <div className={c.select}>
      <ul>{['Notes.md', 'Plan.pdf', 'Cover.png'].map((t, k) => <li key={t}><label><input type="checkbox" checked={sel.includes(k)} onChange={() => flip(k)} />{t}</label></li>)}</ul>
      <div role="toolbar" aria-label="Selection bar" data-show={sel.length > 0}><b>{sel.length} selected</b><button type="button" aria-label="Delete selected" onClick={() => setSel([])}><Ico n="trash" /></button><button type="button" aria-label="Clear selection" onClick={() => setSel([])}><Ico n="close" /></button></div>
    </div>
  );
}

/* 37 */ function RingDock() {
  const k = useCycle(4, 1800);
  return (
    <div className={c.ring} role="toolbar" aria-label="Dock with progress rings">
      {['home', 'mail', 'camera', 'gear'].map((n, i) => (
        <button key={n} type="button" aria-label={n} data-on={i === k}>
          <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" /><circle cx="20" cy="20" r="17" /></svg>
          <Ico n={n} />
        </button>
      ))}
    </div>
  );
}

/* 38 */ function Shortcuts() {
  const [hit, setHit] = useState('');
  const keys = [['⌘', 'S', 'Save'], ['⌘', 'Z', 'Undo'], ['⇧', 'P', 'Panel']];
  return (
    <div className={c.keys}>
      <ul>{keys.map(([a, b, t]) => <li key={t}><button type="button" onClick={() => setHit(t)}><kbd>{a}</kbd><kbd>{b}</kbd><span>{t}</span></button></li>)}</ul>
      <output>{hit ? `${hit} ✓` : 'Press a shortcut'}</output>
    </div>
  );
}

/* 39 */ function JumpList() {
  const items = ['Overview', 'Install', 'Usage', 'API', 'FAQ'];
  const [k, setK] = useState(1);
  return (
    <ul className={c.jump} role="listbox" aria-label="Jump list" tabIndex={0} aria-activedescendant={`jump-${k}`} onKeyDown={(e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setK((v) => clamp(v + 1, 0, 4)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setK((v) => clamp(v - 1, 0, 4)); }
    }}>
      {items.map((t, i) => <li key={t} id={`jump-${i}`} role="option" aria-selected={i === k} onClick={() => setK(i)}>{t}</li>)}
    </ul>
  );
}

/* 40 */ function CornerStack() {
  const [help, flip] = useToggle();
  return (
    <div className={c.corner}>
      {help && <p role="note">Press ? for shortcuts</p>}
      <button type="button" aria-label="Back to top"><Ico n="up" /></button>
      <button type="button" aria-pressed={help} aria-label="Help" onClick={flip}>?</button>
    </div>
  );
}

/* 41 */ function Notch() {
  const [k, setK] = useState(1);
  return (
    <div className={c.notch} role="toolbar" aria-label="Notch dock" style={{ '--k': k }}>
      {['home', 'heart', 'plus', 'bell', 'user'].map((n, i) => <button key={n} type="button" aria-label={n} aria-pressed={i === k} onClick={() => setK(i)}><Ico n={n} /></button>)}
      <i aria-hidden="true" />
    </div>
  );
}

/* 42 */ function EdgeHandle() {
  const [v, bind] = useDrag({ init: 0.15 });
  return (
    <div className={c.edge} style={{ '--v': v }}>
      <div className={c.drawer} aria-hidden="true"><span>Drawer</span></div>
      <div className={c.handle} {...bind} style={{ ...bind.style, '--v': v }} aria-label="Edge handle, drag to open the drawer"><i /></div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Magnify dock', Magnify, 'hover'], ['Icon rail', IconRail, 'click'], ['Grouped toolbar', Grouped, 'click'], ['Format bar', Format, 'click'],
    ['Command bar', Command, 'click'], ['Dot dock', DotDock, 'click'], ['Expanding rail', Expanding, 'click'], ['Transport bar', Transport, 'click'],
    ['Zoom bar', ZoomBar, 'click'], ['Reaction bar', Reactions, 'click'], ['Selection bubble', Bubble, 'click'], ['Speed dial', SpeedDial, 'click'],
    ['Arc dock', ArcDock, 'click'], ['Status strip', StatusStrip, 'click'], ['Section rail', SectionRail, 'click'], ['Rearranging dock', Rearranging, 'click'],
    ['Tooltip dock', TipDock, 'hover'], ['Tool palette', Palette, 'click'], ['Slide-out bar', SlideOut, 'click'], ['Snap dock', Snap, 'click'],
    ['Mini player', MiniPlayer, 'click'], ['Cart dock', CartDock, 'click'], ['Glow dock', GlowDock, 'click'], ['Split button', SplitButton, 'click'],
    ['Search dock', SearchDock, 'click'], ['Filter bar', FilterBar, 'click'], ['Text size bar', TextSize, 'click'], ['Ribbon', Ribbon, 'click'],
    ['Hide on scroll', HideOnScroll, 'click'], ['Island', Island, 'click'], ['Avatar dock', AvatarDock, 'hover'], ['Scrub bar', ScrubBar, 'drag'],
    ['Chat dock', ChatDock, 'click'], ['Paging bar', Paging, 'click'], ['Sticky buy bar', BuyBar, 'click'], ['Selection bar', SelectionBar, 'click'],
    ['Ring dock', RingDock, 'auto'], ['Shortcut bar', Shortcuts, 'click'], ['Jump list', JumpList, 'keys'], ['Corner stack', CornerStack, 'click'],
    ['Notch dock', Notch, 'click'], ['Edge handle', EdgeHandle, 'drag'],
  ],
};
