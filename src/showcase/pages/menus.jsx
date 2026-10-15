import { useEffect, useRef, useState } from 'react';
import { clamp, useToggle } from '../hooks';
import { Ico } from '../icons';
import c from './menus.module.css';

/* ============================================================
   23 · MENUS — dropdowns, radials and command lists.
   The still side is a node map: a hub and seven stops joined by lines. The
   scroll opens one stop at a time (a petal lifts and its line fills) while a
   pulse runs out along the line to it. Specimens share a tiny open/close hook
   (Escape and an outside press close a menu) and are operable by keyboard.
   ============================================================ */

const STOPS = ['Files', 'Edit', 'View', 'Tools', 'Share', 'Help', 'More'];

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.hub}><b>MENU</b></div>
      {STOPS.map((s, k) => (
        <div key={s} className={c.stop} style={{ '--a': (k * 360) / STOPS.length, '--k': k }}>
          <i /><span>{s}</span>
        </div>
      ))}
      <small>1 HUB · 7 STOPS</small>
    </div>
  );
}

/* open / close with Escape and an outside press */
function useOpen(init = false) {
  const [open, setOpen] = useState(init);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('[aria-haspopup], [aria-expanded]')?.focus(); } };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  return [open, setOpen, ref];
}

/* arrow keys move between the items of a menu */
function roving(e) {
  const items = [...e.currentTarget.querySelectorAll('[role^="menuitem"], [role="option"]')];
  const i = items.indexOf(document.activeElement);
  const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
  if (to !== undefined) { e.preventDefault(); items[(to + items.length) % items.length]?.focus(); }
}

const ITEMS = ['Rename', 'Duplicate', 'Archive', 'Delete'];

/* 1 */ function Dropdown() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.dd}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>Actions <Ico n="down" /></button>
      {open && <ul role="menu" onKeyDown={roving}>{ITEMS.map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 2 */ function SelectMenu() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('Medium');
  return (
    <div ref={ref} className={c.dd}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{v} <Ico n="down" /></button>
      {open && <ul role="listbox" aria-label="Size" onKeyDown={roving}>{['Small', 'Medium', 'Large'].map((t) => <li key={t} role="none"><button type="button" role="option" aria-selected={t === v} onClick={() => { setV(t); setOpen(false); }}>{t}{t === v && <Ico n="check" />}</button></li>)}</ul>}
    </div>
  );
}

/* 3 */ function Context() {
  const [at, setAt] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!at) return undefined;
    const close = () => setAt(null);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [at]);
  const place = (e) => { e.preventDefault(); const r = ref.current.getBoundingClientRect(); setAt({ x: e.clientX - r.left, y: e.clientY - r.top }); };
  return (
    <div ref={ref} className={c.ctx} onContextMenu={place} tabIndex={0} role="group" aria-label="Right-click area. Press the context-menu key or Shift F10 on a keyboard." onKeyDown={(e) => { if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); setAt({ x: 60, y: 30 }); } }}>
      <span>Right-click here</span>
      {at && <ul role="menu" style={{ left: at.x, top: at.y }} onPointerDown={(e) => e.stopPropagation()}>{['Cut', 'Copy', 'Paste'].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setAt(null)}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 4 */ function Radial() {
  const [open, flip] = useToggle(true);
  const [pick, setPick] = useState('');
  return (
    <div className={c.radial} data-open={open}>
      {['pen', 'image', 'link', 'flag', 'star'].map((n, k) => <button key={n} type="button" aria-label={n} tabIndex={open ? 0 : -1} style={{ '--a': -72 + k * 36 }} onClick={() => setPick(n)}><Ico n={n} /></button>)}
      <button type="button" aria-expanded={open} aria-label="Radial menu" onClick={flip}><Ico n={open ? 'close' : 'plus'} /></button>
      <output>{pick || 'pick one'}</output>
    </div>
  );
}

/* 5 */ function CommandList() {
  const all = ['Open file', 'Open folder', 'Open settings', 'Run task', 'Run tests', 'Toggle theme'];
  const [q, setQ] = useState('');
  const [k, setK] = useState(0);
  const shown = all.filter((t) => t.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={c.cmd}>
      <input aria-label="Filter commands" placeholder="Type a command" value={q} onChange={(e) => { setQ(e.target.value); setK(0); }} onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setK((v) => clamp(v + 1, 0, Math.max(0, shown.length - 1))); } if (e.key === 'ArrowUp') { e.preventDefault(); setK((v) => clamp(v - 1, 0, Math.max(0, shown.length - 1))); } }} />
      <ul role="listbox" aria-label="Commands">{shown.length ? shown.map((t, i) => <li key={t} role="option" aria-selected={i === k} onClick={() => setK(i)}>{t}</li>) : <li className={c.none}>No match</li>}</ul>
    </div>
  );
}

/* 6 */ function Mega() {
  const [open, setOpen, ref] = useOpen();
  const cols = [['Make', ['Pages', 'Forms', 'Flows']], ['Learn', ['Guides', 'Videos']], ['Ship', ['Deploy', 'Domains', 'Logs']]];
  return (
    <div ref={ref} className={c.mega}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>Products <Ico n="down" /></button>
      {open && <div>{cols.map(([h, l]) => <section key={h}><h4>{h}</h4>{l.map((t) => <a key={t} href="#mega" onClick={(e) => e.preventDefault()}>{t}</a>)}</section>)}</div>}
    </div>
  );
}

/* 7 */ function Submenu() {
  const [open, setOpen, ref] = useOpen();
  const [sub, setSub] = useState(-1);
  const subs = [['Export', ['PDF', 'PNG', 'SVG']], ['Share', ['Link', 'Email']]];
  return (
    <div ref={ref} className={c.sub}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>File <Ico n="down" /></button>
      {open && (
        <ul role="menu">
          {subs.map(([t, kids], i) => (
            <li key={t} role="none" onPointerEnter={() => setSub(i)} onPointerLeave={() => setSub(-1)}>
              <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={sub === i} onClick={() => setSub(sub === i ? -1 : i)} onFocus={() => setSub(i)}>{t}<Ico n="right" /></button>
              {sub === i && <ul role="menu">{kids.map((k) => <li key={k} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{k}</button></li>)}</ul>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* 8 */ function Pie() {
  const [k, setK] = useState(-1);
  const names = ['Up', 'Right', 'Down', 'Left'];
  return (
    <div className={c.pie} role="menu" aria-label="Pie menu">
      {names.map((n, i) => <button key={n} type="button" role="menuitem" data-on={k === i} style={{ '--a': i * 90 }} onPointerEnter={() => setK(i)} onPointerLeave={() => setK(-1)} onFocus={() => setK(i)} onBlur={() => setK(-1)}><span>{n}</span></button>)}
      <i aria-hidden="true" />
    </div>
  );
}

/* 9 */ function AccordionMenu() {
  const [o, setO] = useState(0);
  const sec = [['Account', ['Profile', 'Security']], ['Workspace', ['Members', 'Billing']], ['Support', ['Docs']]];
  return (
    <div className={c.acc}>
      {sec.map(([t, kids], i) => (
        <div key={t}>
          <button type="button" aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>{t}<Ico n={o === i ? 'up' : 'down'} /></button>
          <ul data-open={o === i}>{kids.map((k) => <li key={k}><a href="#acc" tabIndex={o === i ? 0 : -1} onClick={(e) => e.preventDefault()}>{k}</a></li>)}</ul>
        </div>
      ))}
    </div>
  );
}

/* 10 */ function Kebab() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.kebab}>
      <button type="button" aria-label="More options" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /><i /></button>
      {open && <ul role="menu" onKeyDown={roving}>{['Edit', 'Move', 'Remove'].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 11 */ function Burger() {
  const [open, flip] = useToggle();
  return (
    <div className={c.burger} data-open={open}>
      <button type="button" aria-expanded={open} aria-label="Menu" onClick={flip}><i /><i /><i /></button>
      <nav aria-label="Burger menu" inert={!open || undefined}>{['Work', 'Notes', 'Contact'].map((t, k) => <a key={t} href="#burger" style={{ '--k': k }} onClick={(e) => e.preventDefault()}>{t}</a>)}</nav>
    </div>
  );
}

/* 12 */ function CrumbMenu() {
  const [open, setOpen, ref] = useOpen();
  return (
    <nav ref={ref} className={c.crumb} aria-label="Breadcrumb with menu">
      <a href="#crumb" onClick={(e) => e.preventDefault()}>Home</a><span>/</span>
      <div>
        <button type="button" aria-label="Show hidden levels" aria-expanded={open} onClick={() => setOpen(!open)}>…</button>
        {open && <ul role="menu">{['Projects', 'Archive', '2024'].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button></li>)}</ul>}
      </div>
      <span>/</span><b aria-current="page">Report</b>
    </nav>
  );
}

/* 13 */ function UserMenu() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.user}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen(!open)}><span>MK</span><Ico n="down" /></button>
      {open && <div role="menu" onKeyDown={roving}><p><b>Mira Kade</b><small>mira@example.org</small></p>{['Profile', 'Billing', 'Sign out'].map((t) => <button key={t} type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button>)}</div>}
    </div>
  );
}

/* 14 */ function Flyout() {
  const [k, setK] = useState(-1);
  const rows = [['home', ['Overview', 'Alerts']], ['folder', ['Files', 'Shared']], ['gear', ['General', 'Keys']]];
  return (
    <div className={c.fly} onPointerLeave={() => setK(-1)}>
      <nav aria-label="Flyout menu">{rows.map(([n], i) => <button key={n} type="button" aria-label={n} aria-expanded={k === i} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onClick={() => setK(k === i ? -1 : i)}><Ico n={n} /></button>)}</nav>
      {k >= 0 && <ul>{rows[k][1].map((t) => <li key={t}><a href="#fly" onClick={(e) => e.preventDefault()}>{t}</a></li>)}</ul>}
    </div>
  );
}

/* 15 */ function Combobox() {
  const all = ['Amber', 'Azure', 'Bronze', 'Crimson', 'Cyan', 'Indigo'];
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const shown = all.filter((t) => t.toLowerCase().startsWith(q.toLowerCase()));
  return (
    <div className={c.combo}>
      <input role="combobox" aria-expanded={open} aria-controls="combo-list" aria-autocomplete="list" aria-label="Colour" placeholder="Type A, B or C" value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }} />
      {open && shown.length > 0 && <ul id="combo-list" role="listbox" aria-label="Colours">{shown.map((t) => <li key={t} role="option" aria-selected={false} onPointerDown={(e) => { e.preventDefault(); setQ(t); setOpen(false); }}>{t}</li>)}</ul>}
    </div>
  );
}

/* 16 */ function Checklist() {
  const [on, setOn] = useState(['Bold']);
  const flip = (t) => setOn((o) => (o.includes(t) ? o.filter((x) => x !== t) : [...o, t]));
  return (
    <div className={c.checks} role="group" aria-label="Checklist menu">
      {['Bold', 'Italic', 'Strike', 'Code'].map((t) => <label key={t}><input type="checkbox" checked={on.includes(t)} onChange={() => flip(t)} />{t}</label>)}
    </div>
  );
}

/* 17 */ function RadioMenu() {
  const [v, setV] = useState('Sort by date');
  return (
    <div className={c.radios} role="radiogroup" aria-label="Sort menu">
      {['Sort by date', 'Sort by name', 'Sort by size'].map((t) => <button key={t} type="button" role="radio" aria-checked={t === v} onClick={() => setV(t)}><i />{t}</button>)}
    </div>
  );
}

/* 18 */ function Menubar() {
  const [open, setOpen, ref] = useOpen();
  const [k, setK] = useState(-1);
  const bar = [['File', ['New', 'Open', 'Save']], ['Edit', ['Undo', 'Redo']], ['View', ['Zoom in', 'Zoom out']]];
  return (
    <div ref={ref} className={c.mbar}>
      <div role="menubar" aria-label="Menubar" onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (k + (e.key === 'ArrowRight' ? 1 : 2)) % 3; setK(next); setOpen(true); e.currentTarget.querySelectorAll('[role="menuitem"]')[next]?.focus(); } }}>
        {bar.map(([t], i) => <button key={t} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open && k === i} onClick={() => { setK(i); setOpen(!(open && k === i)); }} onPointerEnter={() => open && setK(i)}>{t}</button>)}
      </div>
      {open && k >= 0 && <ul role="menu" style={{ left: `${k * 3.6}rem` }}>{bar[k][1].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 19 */ function Slash() {
  const [v, setV] = useState('/');
  const cmds = ['Heading', 'Quote', 'Divider', 'Table'];
  const shown = v.startsWith('/') ? cmds.filter((t) => t.toLowerCase().includes(v.slice(1).toLowerCase())) : [];
  return (
    <div className={c.slash}>
      <input aria-label="Type a slash" value={v} onChange={(e) => setV(e.target.value)} />
      {shown.length > 0 && <ul role="listbox" aria-label="Slash commands">{shown.map((t) => <li key={t} role="option" aria-selected={false} onClick={() => setV(t)}>{t}</li>)}</ul>}
    </div>
  );
}

/* 20 */ function EmojiGrid() {
  const [open, setOpen, ref] = useOpen();
  const [pick, setPick] = useState('☺');
  const faces = ['☺', '☻', '♥', '★', '☀', '☂', '♪', '✿', '☾', '⚑', '✦', '☕'];
  return (
    <div ref={ref} className={c.emoji}>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={`Pick a symbol, now ${pick}`} onClick={() => setOpen(!open)}>{pick}</button>
      {open && <div role="dialog" aria-label="Symbols">{faces.map((f) => <button key={f} type="button" aria-label={f} onClick={() => { setPick(f); setOpen(false); }}>{f}</button>)}</div>}
    </div>
  );
}

/* 21 */ function Quick() {
  const [v, setV] = useState('Today');
  return (
    <div className={c.quick} role="radiogroup" aria-label="When">
      {['Today', 'Tomorrow', 'Next week', 'Pick a date…'].map((t) => <button key={t} type="button" role="radio" aria-checked={v === t} onClick={() => setV(t)}>{t}</button>)}
    </div>
  );
}

/* 22 */ function SortMenu() {
  const [col, setCol] = useState(0);
  const [dir, setDir] = useState(1);
  const cols = ['Name', 'Date', 'Size'];
  const click = (i) => { if (i === col) setDir(-dir); else { setCol(i); setDir(1); } };
  return (
    <div className={c.sort} role="group" aria-label="Sort menu">
      {cols.map((t, i) => <button key={t} type="button" aria-pressed={i === col} aria-label={`Sort by ${t}${i === col ? (dir > 0 ? ', ascending' : ', descending') : ''}`} onClick={() => click(i)}>{t}<Ico n={i === col ? (dir > 0 ? 'up' : 'down') : 'minus'} /></button>)}
    </div>
  );
}

/* 23 */ function ShareRow() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.share}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><Ico n="share" /> Share</button>
      {open && <div role="menu">{[['link', 'Link'], ['mail', 'Mail'], ['chat', 'Chat'], ['copy', 'Copy']].map(([n, t]) => <button key={n} type="button" role="menuitem" onClick={() => setOpen(false)}><Ico n={n} /><span>{t}</span></button>)}</div>}
    </div>
  );
}

/* 24 */ function Dropup() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.up}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>Insert <Ico n="up" /></button>
      {open && <ul role="menu" onKeyDown={roving}>{['Image', 'Table', 'Chart'].map((t) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 25 */ function WithKeys() {
  const [open, setOpen, ref] = useOpen();
  return (
    <div ref={ref} className={c.keys}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>Edit <Ico n="down" /></button>
      {open && <ul role="menu" onKeyDown={roving}>{[['Copy', '⌘C'], ['Paste', '⌘V'], ['Select all', '⌘A']].map(([t, k]) => <li key={t} role="none"><button type="button" role="menuitem" onClick={() => setOpen(false)}>{t}<kbd>{k}</kbd></button></li>)}</ul>}
    </div>
  );
}

/* 26 */ function WheelMenu() {
  const names = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'];
  const [k, setK] = useState(2);
  return (
    <div className={c.wheel} tabIndex={0} role="listbox" aria-label="Wheel menu" aria-activedescendant={`wheel-${k}`} onWheel={(e) => { e.preventDefault(); setK((v) => clamp(v + Math.sign(e.deltaY), 0, 5)); }} onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setK((v) => clamp(v + 1, 0, 5)); } if (e.key === 'ArrowUp') { e.preventDefault(); setK((v) => clamp(v - 1, 0, 5)); } }}>
      {names.map((n, i) => <span key={n} id={`wheel-${i}`} role="option" aria-selected={i === k} style={{ '--d': i - k }} onClick={() => setK(i)}>{n}</span>)}
    </div>
  );
}

/* 27 */ function RingMenu() {
  const [r, setR] = useState(0);
  return (
    <div className={c.ring} style={{ '--r': r }}>
      <div aria-hidden="true">{['home', 'star', 'bell', 'user', 'gear', 'mail'].map((n, k) => <span key={n} style={{ '--a': k * 60 }}><Ico n={n} /></span>)}</div>
      <button type="button" aria-label="Turn the ring left" onClick={() => setR(r - 1)}><Ico n="left" /></button>
      <button type="button" aria-label="Turn the ring right" onClick={() => setR(r + 1)}><Ico n="right" /></button>
    </div>
  );
}

/* 28 */ function FanMenu() {
  const [open, flip] = useToggle(true);
  return (
    <div className={c.fan} data-open={open}>
      {['A', 'B', 'C', 'D'].map((t, k) => <button key={t} type="button" tabIndex={open ? 0 : -1} style={{ '--k': k }}>{t}</button>)}
      <button type="button" aria-expanded={open} aria-label="Fan menu" onClick={flip}><Ico n="plus" /></button>
    </div>
  );
}

/* 29 */ function Stagger() {
  const [open, flip] = useToggle();
  return (
    <div className={c.stagger} data-open={open}>
      <button type="button" aria-expanded={open} onClick={flip}>Menu</button>
      <ul>{['One', 'Two', 'Three', 'Four'].map((t, k) => <li key={t} style={{ '--k': k }}><a href="#stagger" tabIndex={open ? 0 : -1} onClick={(e) => e.preventDefault()}>{t}</a></li>)}</ul>
    </div>
  );
}

/* 30 */ function Underlined() {
  return (
    <nav className={c.under} aria-label="Underline menu">
      {['Index', 'Work', 'Notes', 'About'].map((t) => <a key={t} href="#under" onClick={(e) => e.preventDefault()}>{t}</a>)}
    </nav>
  );
}

/* 31 */ function Overlay() {
  const [open, flip] = useToggle();
  return (
    <div className={c.overlay} data-open={open}>
      <button type="button" aria-expanded={open} aria-label="Full-screen menu" onClick={flip}>{open ? 'Close' : 'Menu'}</button>
      <nav aria-label="Overlay menu" inert={!open || undefined}>{['01 Work', '02 Notes', '03 Say hi'].map((t, k) => <a key={t} href="#overlay" style={{ '--k': k }} onClick={(e) => e.preventDefault()}>{t}</a>)}</nav>
    </div>
  );
}

/* 32 */ function Tree() {
  const [open, setOpen] = useState({ src: true });
  const flip = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  return (
    <ul className={c.tree} role="tree" aria-label="Tree menu">
      {[['src', ['app.js', 'ui.js']], ['docs', ['intro.md']]].map(([d, kids]) => (
        <li key={d} role="treeitem" aria-expanded={!!open[d]}>
          <button type="button" onClick={() => flip(d)}><Ico n={open[d] ? 'down' : 'right'} />{d}/</button>
          {open[d] && <ul role="group">{kids.map((f) => <li key={f} role="treeitem" aria-selected={false}>{f}</li>)}</ul>}
        </li>
      ))}
    </ul>
  );
}

/* 33 */ function MiniMap() {
  const [k, setK] = useState(4);
  return (
    <div className={c.miniMap} role="radiogroup" aria-label="Pick a region">
      {Array.from({ length: 9 }, (_, i) => <button key={i} type="button" role="radio" aria-checked={i === k} aria-label={`Region ${i + 1}`} onClick={() => setK(i)} />)}
    </div>
  );
}

/* 34 */ function Language() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('EN');
  return (
    <div ref={ref} className={c.lang}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`Language ${v}`} onClick={() => setOpen(!open)}>{v}</button>
      {open && <ul role="listbox" aria-label="Language" onKeyDown={roving}>{[['EN', 'English'], ['DE', 'Deutsch'], ['FR', 'Français'], ['ES', 'Español']].map(([k, t]) => <li key={k} role="none"><button type="button" role="option" aria-selected={k === v} onClick={() => { setV(k); setOpen(false); }}><b>{k}</b>{t}</button></li>)}</ul>}
    </div>
  );
}

/* 35 */ function HourList() {
  const [k, setK] = useState(9);
  return (
    <div className={c.hours} role="listbox" aria-label="Hour menu" tabIndex={0} aria-activedescendant={`h-${k}`} onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setK((v) => clamp(v + 1, 6, 18)); } if (e.key === 'ArrowUp') { e.preventDefault(); setK((v) => clamp(v - 1, 6, 18)); } }}>
      {Array.from({ length: 13 }, (_, i) => i + 6).map((h) => <span key={h} id={`h-${h}`} role="option" aria-selected={h === k} onClick={() => setK(h)}>{String(h).padStart(2, '0')}:00</span>)}
    </div>
  );
}

/* 36 */ function ColourMenu() {
  const [open, setOpen, ref] = useOpen();
  const [v, setV] = useState('#ff3333');
  const cols = ['#ff3333', '#ff9f43', '#feca57', '#1dd1a1', '#54a0ff', '#a29bfe', '#ffffff', '#576574'];
  return (
    <div ref={ref} className={c.colours}>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={`Colour ${v}`} style={{ '--v': v }} onClick={() => setOpen(!open)}><i /></button>
      {open && <div role="dialog" aria-label="Colours">{cols.map((h) => <button key={h} type="button" aria-label={h} aria-pressed={h === v} style={{ '--v': h }} onClick={() => { setV(h); setOpen(false); }} />)}</div>}
    </div>
  );
}

/* 37 */ function FontMenu() {
  const [k, setK] = useState(0);
  const fonts = [['Serif', 'var(--font-serif)'], ['Sans', 'var(--font-sans)'], ['Mono', 'var(--font-mono)']];
  return (
    <div className={c.fonts} role="radiogroup" aria-label="Font menu">
      {fonts.map(([n, f], i) => <button key={n} type="button" role="radio" aria-checked={i === k} style={{ fontFamily: f }} onClick={() => setK(i)}>{n} — Aa Gg 123</button>)}
    </div>
  );
}

/* 38 */ function Danger() {
  const [open, setOpen, ref] = useOpen();
  const [sure, setSure] = useState(false);
  return (
    <div ref={ref} className={c.danger}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => { setOpen(!open); setSure(false); }}>Project <Ico n="down" /></button>
      {open && <ul role="menu"><li role="none"><button type="button" role="menuitem">Rename</button></li><li role="none"><button type="button" role="menuitem" data-bad onClick={() => (sure ? (setOpen(false), setSure(false)) : setSure(true))}>{sure ? 'Really delete?' : 'Delete'}</button></li></ul>}
    </div>
  );
}

/* 39 */ function Shrink() {
  const [small, flip] = useToggle();
  return (
    <div className={c.shrink}>
      <header data-small={small}><b>Studio</b><nav aria-label="Shrinking header">{['Work', 'Lab', 'Mail'].map((t) => <a key={t} href="#shrink" onClick={(e) => e.preventDefault()}>{t}</a>)}</nav></header>
      <button type="button" aria-pressed={small} onClick={flip}>{small ? 'Scrolled' : 'At top'}</button>
    </div>
  );
}

/* 40 */ function ActionSheet() {
  const [open, flip] = useToggle();
  return (
    <div className={c.sheet} data-open={open}>
      <button type="button" aria-expanded={open} onClick={flip}>Options</button>
      <div role="menu" aria-label="Action sheet" inert={!open || undefined}>{['Take photo', 'Choose file'].map((t) => <button key={t} type="button" role="menuitem" onClick={flip}>{t}</button>)}<button type="button" role="menuitem" onClick={flip}>Cancel</button></div>
    </div>
  );
}

/* 41 */ function Magnetic() {
  const [at, setAt] = useState(-1);
  return (
    <ul className={c.magnet} onPointerLeave={() => setAt(-1)} aria-label="Magnetic menu">
      {['Alpha', 'Beta', 'Gamma', 'Delta'].map((t, i) => <li key={t}><a href="#magnet" onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)} onClick={(e) => e.preventDefault()}>{t}</a></li>)}
      <i style={{ '--at': at < 0 ? 0 : at, opacity: at < 0 ? 0 : 1 }} aria-hidden="true" />
    </ul>
  );
}

/* 42 */ function Sitemap() {
  const [k, setK] = useState(0);
  const cols = [['Studio', ['About', 'People']], ['Work', ['Cases', 'Lab']], ['Talk', ['Mail', 'Press']]];
  return (
    <div className={c.site} role="group" aria-label="Footer menu">
      {cols.map(([h, l], i) => (
        <div key={h} data-on={i === k}>
          <button type="button" aria-expanded={i === k} onClick={() => setK(i)}>{h}</button>
          <ul>{l.map((t) => <li key={t}><a href="#site" tabIndex={i === k ? 0 : -1} onClick={(e) => e.preventDefault()}>{t}</a></li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Dropdown', Dropdown, 'click'], ['Select menu', SelectMenu, 'click'], ['Context menu', Context, 'right-click'], ['Radial menu', Radial, 'click'],
    ['Command list', CommandList, 'type'], ['Mega menu', Mega, 'click'], ['Nested submenu', Submenu, 'hover'], ['Pie menu', Pie, 'hover'],
    ['Accordion menu', AccordionMenu, 'click'], ['Kebab menu', Kebab, 'click'], ['Burger menu', Burger, 'click'], ['Breadcrumb menu', CrumbMenu, 'click'],
    ['Account menu', UserMenu, 'click'], ['Flyout rail', Flyout, 'hover'], ['Combobox', Combobox, 'type'], ['Checklist menu', Checklist, 'click'],
    ['Radio menu', RadioMenu, 'click'], ['Menubar', Menubar, 'click'], ['Slash menu', Slash, 'type'], ['Symbol grid', EmojiGrid, 'click'],
    ['Quick dates', Quick, 'click'], ['Sort menu', SortMenu, 'click'], ['Share row', ShareRow, 'click'], ['Dropup', Dropup, 'click'],
    ['Shortcut menu', WithKeys, 'click'], ['Wheel menu', WheelMenu, 'scroll'], ['Ring menu', RingMenu, 'click'], ['Fan menu', FanMenu, 'click'],
    ['Stagger menu', Stagger, 'click'], ['Underline menu', Underlined, 'hover'], ['Overlay menu', Overlay, 'click'], ['Tree menu', Tree, 'click'],
    ['Region map', MiniMap, 'click'], ['Language menu', Language, 'click'], ['Hour list', HourList, 'keys'], ['Colour menu', ColourMenu, 'click'],
    ['Font menu', FontMenu, 'click'], ['Danger menu', Danger, 'click'], ['Shrinking header', Shrink, 'click'], ['Action sheet', ActionSheet, 'click'],
    ['Magnetic menu', Magnetic, 'hover'], ['Footer menu', Sitemap, 'click'],
  ],
};
