import { useRef, useState } from 'react';
import { useCycle, useDrag, useTick } from '../hooks';
import { useHot } from '../kit';
import c from './tabs.module.css';

/* ============================================================
   21 · TABS — strips, pills and segments that glide.
   The still side is a strip of five tabs whose underline is driven by the
   scroll alone: it slides along the strip, the label it reaches lights, and a
   panel title below it follows. Specimens share one small tablist (roving
   tabindex, arrow keys, Home and End), so every one of them works from a keyboard.
   ============================================================ */

const WORDS = ['Overview', 'Detail', 'History', 'Notes', 'Export'];

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visStrip}>
        {WORDS.map((w, k) => <span key={w} style={{ '--k': k }}>{w}</span>)}
        <i />
      </div>
      <div className={c.visPanels}>
        {WORDS.map((w, k) => <b key={w} style={{ '--k': k }}>{w}</b>)}
      </div>
      <div className={c.visRule}><i /></div>
      <small>5 TABS · 1 INDICATOR</small>
    </div>
  );
}

/* One tablist: the indicator is an <i> that the page's CSS places from --i and --n. */
function Tabs({ labels, init = 0, label = 'Tabs', vertical = false, className, tabClass, onPick, children, render }) {
  const [i, setI] = useState(init);
  const box = useRef(null);
  const go = (k) => {
    const j = (k + labels.length) % labels.length;
    setI(j);
    onPick?.(j);
    box.current?.querySelectorAll('[role="tab"]')[j]?.focus();
  };
  const key = (e) => {
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === next) { e.preventDefault(); go(i + 1); }
    else if (e.key === prev) { e.preventDefault(); go(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(labels.length - 1); }
  };
  return (
    <div ref={box} role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'} className={className} style={{ '--i': i, '--n': labels.length }} onKeyDown={key}>
      {labels.map((t, k) => (
        <button key={k} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} className={tabClass} data-on={k === i} onClick={() => { setI(k); onPick?.(k); }}>
          {render ? render(t, k, k === i) : t}
        </button>
      ))}
      {children}
    </div>
  );
}

const ABC = ['One', 'Two', 'Three'];
const TRIO = ['Day', 'Week', 'Month'];

/* 1 */ function Underline() { return <Tabs labels={ABC} label="Underline tabs" className={c.under} tabClass={c.tab}><i aria-hidden="true" /></Tabs>; }

/* 2 */ function PillSlide() { return <Tabs labels={TRIO} label="Pill tabs" className={c.pill} tabClass={c.tab}><i aria-hidden="true" /></Tabs>; }

/* 3 */ function Segmented() { return <Tabs labels={['List', 'Grid', 'Map']} label="Segmented control" className={c.seg} tabClass={c.tab}><i aria-hidden="true" /></Tabs>; }

/* 4 */ function FolderTabs() {
  return <Tabs labels={['Inbox', 'Sent', 'Drafts']} init={1} label="Folder tabs" className={c.folder} tabClass={c.tab} />;
}

/* 5 */ function SideTabs() {
  return <Tabs labels={['Profile', 'Billing', 'Keys', 'Team']} vertical label="Vertical tabs" className={c.side} tabClass={c.tab}><i aria-hidden="true" /></Tabs>;
}

/* 6 */ function Badged() {
  const counts = [12, 3, 0];
  return <Tabs labels={['Open', 'Review', 'Done']} label="Tabs with counts" className={c.badged} tabClass={c.tab} render={(t, k) => <>{t}<sup>{counts[k]}</sup></>} />;
}

/* 7 */ function Closable() {
  const start = ['index.js', 'app.css', 'notes.md', 'todo.txt'];
  const [tabs, setTabs] = useState(start);
  const [cur, setCur] = useState(0);
  const close = (name) => setTabs((t) => {
    const next = t.filter((x) => x !== name);
    setCur((v) => Math.min(v, Math.max(0, next.length - 1)));
    return next.length ? next : start;
  });
  return (
    <div className={c.closable} role="tablist" aria-label="Closable tabs">
      {tabs.map((t, k) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={k === cur}
          aria-keyshortcuts="Delete"
          data-on={k === cur}
          onClick={() => setCur(k)}
          onKeyDown={(e) => { if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); close(t); } }}
        >
          {t}
          <span aria-hidden="true" onClick={(e) => { e.stopPropagation(); close(t); }}>×</span>
        </button>
      ))}
    </div>
  );
}

/* 8 */ function Sortable() {
  const [order, setOrder] = useState(['Red', 'Ink', 'Bone']);
  const [cur, setCur] = useState(1);
  const move = (d) => setOrder((o) => {
    const j = cur + d;
    if (j < 0 || j >= o.length) return o;
    const n = [...o];
    [n[cur], n[j]] = [n[j], n[cur]];
    setCur(j);
    return n;
  });
  return (
    <div className={c.sortable}>
      <div role="tablist" aria-label="Reorderable tabs">{order.map((t, k) => <button key={t} type="button" role="tab" aria-selected={k === cur} data-on={k === cur} onClick={() => setCur(k)}>{t}</button>)}</div>
      <span><button type="button" aria-label="Move tab left" onClick={() => move(-1)}>←</button><button type="button" aria-label="Move tab right" onClick={() => move(1)}>→</button></span>
    </div>
  );
}

/* 9 */ function Scrolling() {
  const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'];
  const [cur, setCur] = useState(2);
  const box = useRef(null);
  const nudge = (d) => box.current?.scrollBy({ left: d * 120, behavior: 'smooth' });
  return (
    <div className={c.scrolling}>
      <button type="button" aria-label="Scroll tabs left" onClick={() => nudge(-1)}>‹</button>
      <div ref={box} role="tablist" aria-label="Scrolling tabs">{names.map((t, k) => <button key={t} type="button" role="tab" aria-selected={k === cur} data-on={k === cur} onClick={() => setCur(k)}>{t}</button>)}</div>
      <button type="button" aria-label="Scroll tabs right" onClick={() => nudge(1)}>›</button>
    </div>
  );
}

/* 10 */ function IconOnly() {
  const icons = [['M4 12 12 4l8 8M6 10v9h12v-9', 'Home'], ['M4 6h16M4 12h16M4 18h10', 'List'], ['M12 5v14M5 12h14', 'Add'], ['M12 3a6 6 0 0 0-6 6c0 5-2 6-2 6h16s-2-1-2-6a6 6 0 0 0-6-6ZM10 19a2 2 0 0 0 4 0', 'Alerts']];
  return (
    <Tabs labels={icons} label="Icon tabs" className={c.icons} tabClass={c.tab} render={([d, name]) => <svg viewBox="0 0 24 24" aria-label={name} role="img"><path d={d} /></svg>}>
      <i aria-hidden="true" />
    </Tabs>
  );
}

/* 11 */ function Chevrons() { return <Tabs labels={['Cart', 'Ship', 'Pay', 'Done']} label="Chevron tabs" className={c.chev} tabClass={c.tab} />; }

/* 12 */ function Ink() {
  const [i, setI] = useState(0);
  const [from, setFrom] = useState(0);
  const pick = (k) => { setFrom(i); setI(k); };
  const lo = Math.min(i, from);
  const hi = Math.max(i, from);
  return (
    <div className={c.ink} role="tablist" aria-label="Stretching ink tabs" style={{ '--lo': lo, '--span': hi - lo + 1 }} data-moving={from !== i}>
      {['Run', 'Test', 'Ship', 'Rest'].map((t, k) => <button key={t} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => pick(k)}>{t}</button>)}
      <i aria-hidden="true" />
    </div>
  );
}

/* 13 */ function MagicLine() {
  const [i, setI] = useState(1);
  const [hover, setHover] = useState(-1);
  const at = hover >= 0 ? hover : i;
  return (
    <div className={c.magic} role="tablist" aria-label="Magic line tabs" style={{ '--at': at }} onPointerLeave={() => setHover(-1)}>
      {['Work', 'Lab', 'About', 'Mail'].map((t, k) => (
        <button key={t} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onPointerEnter={() => setHover(k)} onFocus={() => setHover(k)} onBlur={() => setHover(-1)} onClick={() => setI(k)}>{t}</button>
      ))}
      <i aria-hidden="true" />
    </div>
  );
}

/* 14 */ function RollCount() {
  const [i, setI] = useState(2);
  return (
    <div className={c.roll}>
      <div className={c.rollWin} aria-live="polite" aria-label={`Page ${i + 1} of 5`}><ol style={{ '--i': i }}>{[1, 2, 3, 4, 5].map((n) => <li key={n}>{n}</li>)}</ol><span>/ 5</span></div>
      <div role="tablist" aria-label="Rolling counter tabs">{[0, 1, 2, 3, 4].map((k) => <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Page ${k + 1}`} onClick={() => setI(k)} />)}</div>
    </div>
  );
}

/* 15 */ function Roman() { return <Tabs labels={['I', 'II', 'III', 'IV', 'V']} label="Roman numeral tabs" className={c.roman} tabClass={c.tab} />; }

/* 16 */ function CardRadio() {
  const [k, setK] = useState(0);
  const plans = [['Free', '0'], ['Team', '12'], ['Firm', '40']];
  return (
    <div className={c.cards} role="radiogroup" aria-label="Plan cards">
      {plans.map(([n, p], i) => <button key={n} type="button" role="radio" aria-checked={k === i} onClick={() => setK(i)}><b>{n}</b><span>{p}</span></button>)}
    </div>
  );
}

/* 17 */ function MultiToggle() {
  const [on, setOn] = useState([true, false, true]);
  return (
    <div className={c.multi} role="group" aria-label="Text styles">
      {['B', 'I', 'U'].map((t, k) => <button key={t} type="button" aria-pressed={on[k]} aria-label={['Bold', 'Italic', 'Underline'][k]} onClick={() => setOn((o) => o.map((x, j) => (j === k ? !x : x)))}>{t}</button>)}
    </div>
  );
}

/* 18 */ function DotsGrow() { return <Tabs labels={['1', '2', '3', '4', '5']} label="Growing dots" className={c.dots} tabClass={c.tab} render={(t) => <span className="sr-only">Slide {t}</span>} />; }

/* 19 */ function AutoFill() {
  const n = useCycle(4, 2400);
  return (
    <div className={c.auto} role="tablist" aria-label="Auto-advancing tabs" data-n={n}>
      {['Plan', 'Build', 'Check', 'Ship'].map((t, k) => <button key={t} type="button" role="tab" aria-selected={k === n} tabIndex={-1} data-on={k === n}><span>{t}</span><i /></button>)}
    </div>
  );
}

/* 20 */ function Crossfade() {
  const [k, setK] = useState(0);
  const body = ['Short notes on the first thing.', 'A longer reading of the second.', 'Third: the least said the better.'];
  return (
    <div className={c.panel}>
      <div role="tablist" aria-label="Tabs with a panel">{['One', 'Two', 'Three'].map((t, i) => <button key={t} type="button" role="tab" id={`cf-${i}`} aria-selected={i === k} aria-controls="cf-panel" data-on={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
      <p id="cf-panel" role="tabpanel" aria-labelledby={`cf-${k}`} key={k}>{body[k]}</p>
    </div>
  );
}

/* 21 */ function DrumTabs() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5, steps: 6 });
  const k = 6 - Math.round(v * 6);
  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className={c.drum} {...bind} aria-label="Day drum, drag or use arrows" aria-valuetext={names[k]} style={{ ...bind.style, '--k': k }}>
      <ol>{names.map((n) => <li key={n}>{n}</li>)}</ol>
    </div>
  );
}

/* 22 */ function Fan() {
  const [k, setK] = useState(2);
  return (
    <div className={c.fan} role="tablist" aria-label="Fanned tabs">
      {['A', 'B', 'C', 'D', 'E'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} style={{ '--d': i - k }} onClick={() => setK(i)}>{t}</button>)}
    </div>
  );
}

/* 23 */ function IndexCards() {
  const [k, setK] = useState(0);
  return (
    <div className={c.index}>
      <div role="tablist" aria-label="Index card dividers" aria-orientation="vertical">{['A–F', 'G–M', 'N–S', 'T–Z'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} style={{ '--i': i }} onClick={() => setK(i)}>{t}</button>)}</div>
      <div className={c.card} key={k}>Entries {['A–F', 'G–M', 'N–S', 'T–Z'][k]}</div>
    </div>
  );
}

/* 24 */ function KnobTabs() {
  const [k, setK] = useState(1);
  const labels = ['OFF', 'LOW', 'MID', 'HIGH'];
  return (
    <div className={c.knob}>
      <button type="button" aria-label={`Mode knob, ${labels[k]}. Press to turn`} onClick={() => setK((k + 1) % 4)} style={{ '--k': k }}><i /></button>
      {labels.map((t, i) => <span key={t} data-on={i === k} style={{ '--a': i }}>{t}</span>)}
    </div>
  );
}

/* 25 */ function BottomBar() {
  return (
    <Tabs labels={['Home', 'Find', 'Saved', 'Me']} label="Bottom bar" className={c.bottom} tabClass={c.tab} render={(t, k) => <><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r={4 + k} /></svg><span>{t}</span></>} />
  );
}

/* 26 */ function FloatLabel() {
  return <Tabs labels={['Mine', 'Shared', 'Public']} label="Raised label tabs" className={c.raise} tabClass={c.tab} />;
}

/* 27 */ function History() {
  const [trail, setTrail] = useState(['Home']);
  const [at, setAt] = useState(0);
  const open = (name) => { setTrail((t) => [...t.slice(0, at + 1), name]); setAt((a) => a + 1); };
  return (
    <div className={c.history}>
      <div><button type="button" aria-label="Back" disabled={at === 0} onClick={() => setAt(at - 1)}>←</button><button type="button" aria-label="Forward" disabled={at >= trail.length - 1} onClick={() => setAt(at + 1)}>→</button><output>{trail[at]}</output></div>
      <div>{['Docs', 'Pricing', 'Blog'].map((n) => <button key={n} type="button" onClick={() => open(n)}>{n}</button>)}</div>
    </div>
  );
}

/* 28 */ function Gooey() {
  const [k, setK] = useState(0);
  return (
    <div className={c.goo}>
      <svg width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="tabs-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" /><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" /></filter></defs></svg>
      <div className={c.gooBlob} style={{ '--k': k }} aria-hidden="true"><i /><i /></div>
      <div role="tablist" aria-label="Gooey tabs">{['Up', 'Mid', 'Low'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
    </div>
  );
}

/* 29 */ function Compass() {
  const [k, setK] = useState(0);
  const dirs = ['N', 'E', 'S', 'W'];
  return (
    <div className={c.compass} role="tablist" aria-label="Compass tabs">
      {dirs.map((d, i) => <button key={d} type="button" role="tab" aria-selected={i === k} style={{ '--a': i * 90 }} onClick={() => setK(i)}>{d}</button>)}
      <i style={{ '--k': k }} aria-hidden="true" />
    </div>
  );
}

/* 30 */ function Months() {
  const [k, setK] = useState(4);
  const names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <div className={c.months} role="tablist" aria-label="Months">
      {names.map((n, i) => <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={full[i]} onClick={() => setK(i)}>{n}</button>)}
    </div>
  );
}

/* 31 */ function Week() {
  const [k, setK] = useState(2);
  return (
    <div className={c.week} role="tablist" aria-label="Days of the week">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]} data-today={i === 3} onClick={() => setK(i)}><span>{d}</span><b>{12 + i}</b></button>)}
    </div>
  );
}

/* 32 */ function HexTabs() {
  const [k, setK] = useState(1);
  return (
    <div className={c.hex} role="tablist" aria-label="Hex tabs">
      {['α', 'β', 'γ'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}>{t}</button>)}
    </div>
  );
}

/* 33 */ function Rolodex() {
  const letters = 'ABCDEFGHIJKLM'.split('');
  const [at, setAt] = useState(-1);
  return (
    <div className={c.rolodex} role="tablist" aria-label="Letter index" onPointerLeave={() => setAt(-1)}>
      {letters.map((l, i) => <button key={l} type="button" role="tab" aria-selected={at === i} style={{ '--d': at < 0 ? 9 : Math.abs(i - at) }} onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)}>{l}</button>)}
    </div>
  );
}

/* 34 */ function Overflow() {
  const all = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  const [k, setK] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div className={c.overflow}>
      <div>
        <div role="tablist" aria-label="Tabs with overflow">
          {all.slice(0, 3).map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => { setK(i); setOpen(false); }}>{t}</button>)}
        </div>
        <button type="button" aria-haspopup="true" aria-expanded={open} aria-label="More tabs" onClick={() => setOpen(!open)}>•••</button>
      </div>
      {open && <ul>{all.slice(3).map((t, j) => <li key={t}><button type="button" onClick={() => { setK(j + 3); setOpen(false); }}>{t}</button></li>)}</ul>}
      <output>Showing {all[k]}</output>
    </div>
  );
}

/* 35 */ function TwoLine() {
  return <Tabs labels={[['Pending', '4 items'], ['Active', '9 items'], ['Closed', '31 items']]} label="Two-line tabs" className={c.two} tabClass={c.tab} render={([a, b]) => <><b>{a}</b><small>{b}</small></>}><i aria-hidden="true" /></Tabs>;
}

/* 36 */ function Pager() {
  const [k, setK] = useState(3);
  const pages = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div className={c.pager} role="tablist" aria-label="Pages">
      {pages.map((p, i) => <button key={p} type="button" role="tab" aria-selected={i === k} aria-label={`Page ${p}`} onClick={() => setK(i)}>{p}</button>)}
    </div>
  );
}

/* 37 */ function Lamps() {
  const [k, setK] = useState(0);
  return (
    <div className={c.lamps} role="tablist" aria-label="Lit tabs">
      {['CH1', 'CH2', 'CH3', 'CH4'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}><i />{t}</button>)}
    </div>
  );
}

/* 38 */ function Roving() {
  const [k, setK] = useState(0);
  const [note, setNote] = useState('Focus a tab, then press an arrow key');
  return (
    <div className={c.roving}>
      <Tabs labels={['Left', 'Mid', 'Right']} label="Arrow-key tabs" className={c.under} tabClass={c.tab} onPick={(j) => { setK(j); setNote(`Moved to ${['Left', 'Mid', 'Right'][j]}`); }}><i aria-hidden="true" /></Tabs>
      <output aria-live="polite" data-k={k}>{note}</output>
    </div>
  );
}

/* 39 */ function Overlap() {
  const [k, setK] = useState(1);
  return (
    <div className={c.overlap} role="tablist" aria-label="Overlapping tabs">
      {['Doc 1', 'Doc 2', 'Doc 3', 'Doc 4'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === k} style={{ '--z': i === k ? 9 : 4 - i }} onClick={() => setK(i)}>{t}</button>)}
    </div>
  );
}

/* 40 */ function ZoomTab() {
  const [pt, setPt] = useState(null);
  const [hot, bind] = useHot();
  return (
    <div className={c.zoom} {...bind} data-hot={hot}>
      <Tabs labels={['S', 'M', 'L', 'XL']} label="Size tabs" className={c.scale} tabClass={c.tab} onPick={setPt} />
      <output>{pt === null ? 'M' : ['S', 'M', 'L', 'XL'][pt]}</output>
    </div>
  );
}

/* 41 */ function Ticker() {
  const n = useTick(1800);
  const names = ['Live', 'Queue', 'Alerts', 'Logs'];
  return (
    <div className={c.ticker} role="tablist" aria-label="Rotating highlight">
      {names.map((t, i) => <button key={t} type="button" role="tab" aria-selected={i === n % 4} tabIndex={-1} data-on={i === n % 4}>{t}</button>)}
    </div>
  );
}

/* 42 */ function Swatches() {
  const [k, setK] = useState(0);
  const hues = ['#ff3333', '#ffb347', '#6ee7b7', '#7aa2ff'];
  return (
    <div className={c.swatch} role="tablist" aria-label="Colour tabs" style={{ '--tone': hues[k] }}>
      {hues.map((h, i) => <button key={h} type="button" role="tab" aria-selected={i === k} aria-label={`Colour ${i + 1}`} style={{ '--h': h }} onClick={() => setK(i)} />)}
      <output>{hues[k]}</output>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Underline', Underline, 'click'], ['Pill slide', PillSlide, 'click'], ['Segmented', Segmented, 'click'], ['Manila tabs', FolderTabs, 'click'],
    ['Side tabs', SideTabs, 'click'], ['Counted tabs', Badged, 'click'], ['Closable', Closable, 'click · del'], ['Sortable tabs', Sortable, 'click'],
    ['Scrolling tabs', Scrolling, 'click'], ['Icon tabs', IconOnly, 'click'], ['Chevron steps', Chevrons, 'click'], ['Ink stretch', Ink, 'click'],
    ['Magic line', MagicLine, 'hover'], ['Rolling count', RollCount, 'click'], ['Roman tabs', Roman, 'click'], ['Plan cards', CardRadio, 'click'],
    ['Style toggles', MultiToggle, 'click'], ['Growing dots', DotsGrow, 'click'], ['Auto-advance', AutoFill, 'auto'], ['Panel crossfade', Crossfade, 'click'],
    ['Day drum', DrumTabs, 'drag'], ['Fan of tabs', Fan, 'click'], ['Index dividers', IndexCards, 'click'], ['Knob tabs', KnobTabs, 'click'],
    ['Bottom bar', BottomBar, 'click'], ['Raised label', FloatLabel, 'click'], ['History tabs', History, 'click'], ['Gooey tabs', Gooey, 'click'],
    ['Compass tabs', Compass, 'click'], ['Month strip', Months, 'click'], ['Week strip', Week, 'click'], ['Hex tabs', HexTabs, 'click'],
    ['Letter rolodex', Rolodex, 'hover'], ['Overflow menu', Overflow, 'click'], ['Two-line tabs', TwoLine, 'click'], ['Pager tabs', Pager, 'click'],
    ['Lamp tabs', Lamps, 'click'], ['Arrow-key tabs', Roving, 'keys'], ['Overlapping tabs', Overlap, 'click'], ['Zoom tabs', ZoomTab, 'click'],
    ['Highlight ticker', Ticker, 'auto'], ['Colour swatches', Swatches, 'click'],
  ],
};
