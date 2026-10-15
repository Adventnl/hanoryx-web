import { useRef, useState } from 'react';
import { clamp, useCycle, useDrag, useTick } from '../hooks';
import { curve, pts } from '../kit';
import { Ico } from '../icons';
import c from './waypoints.module.css';

/* ============================================================
   25 · WAYPOINTS — outlines, contents and wayfinding.
   The still side is a compass: a needle that turns twice over the journey and
   eight waypoints around the dial that light as it passes. Specimens are the
   other ways a page tells you where you are and where to go next.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.dial}>
        {Array.from({ length: 8 }, (_, k) => <i key={k} style={{ '--a': k * 45 }}><b>{'N NE E SE S SW W NW'.split(' ')[k]}</b></i>)}
        <u />
        <s />
      </div>
      <small>1 NEEDLE · 8 WAYPOINTS</small>
    </div>
  );
}

const DOC = ['Intro', 'Method', 'Results', 'Notes', 'Index'];

/* 1 */ function Contents() {
  const [k, setK] = useState(1);
  return (
    <nav className={c.toc} aria-label="Contents">
      <ol>{DOC.map((t, i) => <li key={t}><button type="button" aria-current={i === k ? 'true' : undefined} onClick={() => setK(i)}><span>{String(i + 1).padStart(2, '0')}</span>{t}</button></li>)}</ol>
      <i aria-hidden="true" style={{ '--k': k }} />
    </nav>
  );
}

/* 2 */ function OutlineRail() {
  const [hot, setHot] = useState(-1);
  const heads = [['Overview', 0], ['Setup', 1], ['Usage', 1], ['Advanced', 0], ['Limits', 1], ['Credits', 0]];
  return (
    <div className={c.rail} onPointerLeave={() => setHot(-1)}>
      <ul>{heads.map(([t, d], i) => <li key={t} data-hot={i === hot} style={{ '--d': d }}><button type="button" aria-label={`Jump to ${t}`} onPointerEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}><i /><span>{t}</span></button></li>)}</ul>
    </div>
  );
}

/* 3 */ function MiniMapScroller() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.7 });
  return (
    <div className={c.mini} {...bind} aria-label="Page thumbnail, drag the window" aria-valuetext={`${Math.round((1 - v) * 100)} percent down`} style={{ ...bind.style, '--v': 1 - v }}>
      {Array.from({ length: 14 }, (_, k) => <i key={k} style={{ width: `${40 + ((k * 37) % 55)}%` }} />)}
      <b aria-hidden="true" />
    </div>
  );
}

/* 4 */ function BackToTop() {
  const [v, bind] = useDrag({ init: 0.6 });
  return (
    <div className={c.top}>
      <button type="button" aria-label={`Back to top, ${Math.round(v * 100)} percent read`} style={{ '--v': v }}><svg className={c.ringSvg} viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" /><circle cx="20" cy="20" r="17" pathLength="1" /></svg><Ico n="up" /></button>
      <div className={c.topSlide} {...bind} aria-label="Reading progress" style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

/* 5 */ function SectionDots() {
  const [k, setK] = useState(2);
  return (
    <ul className={c.sdots} aria-label="Section dots">
      {DOC.map((t, i) => <li key={t}><button type="button" aria-label={t} aria-current={i === k ? 'true' : undefined} onClick={() => setK(i)}><i /><span>{t}</span></button></li>)}
    </ul>
  );
}

/* 6 */ function AnchorChips() {
  const [k, setK] = useState('');
  return (
    <div className={c.chips}>
      <div role="group" aria-label="Jump to">{['#intro', '#method', '#results', '#notes'].map((h) => <button key={h} type="button" aria-pressed={k === h} onClick={() => setK(h)}>{h}</button>)}</div>
      <output>{k ? `location.hash = "${k}"` : 'no anchor'}</output>
    </div>
  );
}

/* 7 */ function CompassRose() {
  const [k, setK] = useState(1);
  const marks = [['Cairn', 0], ['Lake', 80], ['Ridge', 160], ['Hut', 250]];
  return (
    <div className={c.rose}>
      <div className={c.roseFace}><i style={{ '--a': marks[k][1] }} aria-hidden="true" />{['N', 'E', 'S', 'W'].map((d, i) => <b key={d} style={{ '--a': i * 90 }}>{d}</b>)}</div>
      <div role="radiogroup" aria-label="Waypoint">{marks.map(([t], i) => <button key={t} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
    </div>
  );
}

/* 8 */ function Signpost() {
  const [k, setK] = useState(-1);
  const signs = [['Station', '1.2 km', 1], ['Harbour', '3.8 km', -1], ['Old town', '600 m', 1]];
  return (
    <div className={c.post}>
      <i aria-hidden="true" />
      {signs.map(([t, d, dir], i) => <button key={t} type="button" data-dir={dir} data-on={k === i} style={{ '--i': i }} onClick={() => setK(k === i ? -1 : i)}><span>{t}</span><small>{d}</small></button>)}
    </div>
  );
}

/* 9 */ function YouAreHere() {
  const [at, setAt] = useState([4, 2]);
  return (
    <div className={c.here} role="grid" aria-label="Map, choose where you are">
      {Array.from({ length: 6 }, (_, r) => <div key={r} role="row">{Array.from({ length: 9 }, (_, k) => <button key={k} type="button" role="gridcell" aria-label={`Row ${r + 1}, column ${k + 1}`} aria-selected={at[0] === k && at[1] === r} onClick={() => setAt([k, r])} />)}</div>)}
      <i aria-hidden="true" style={{ '--x': at[0], '--y': at[1] }}><b>YOU ARE HERE</b></i>
    </div>
  );
}

/* 10 */ function FloorPlan() {
  const [k, setK] = useState(2);
  const rooms = [['Lobby', 'M4 4h40v28H4z'], ['Atrium', 'M48 4h48v28H48z'], ['Studio', 'M4 36h56v28H4z'], ['Lab', 'M64 36h32v28H64z']];
  return (
    <div className={c.plan}>
      <svg viewBox="0 0 100 68" role="group" aria-label="Floor plan">
        {rooms.map(([t, d], i) => <path key={t} d={d} tabIndex={0} role="button" aria-pressed={i === k} aria-label={t} onClick={() => setK(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setK(i); } }} />)}
        <path className={c.route} d="M24 18 46 34 32 50" />
      </svg>
      <output>{rooms[k][0]}</output>
    </div>
  );
}

/* 11 */ function Subway() {
  const [k, setK] = useState(2);
  const stops = ['Quay', 'Mill', 'Court', 'Gate', 'Park'];
  return (
    <div className={c.metro} style={{ '--k': k }}>
      <ol>{stops.map((t, i) => <li key={t}><button type="button" aria-current={i === k ? 'true' : undefined} onClick={() => setK(i)}><i /><span>{t}</span></button></li>)}</ol>
      <b aria-hidden="true" />
    </div>
  );
}

/* 12 */ function Blazes() {
  const [k, setK] = useState(1);
  const blazes = [['Left turn', 'M8 6v28h18'], ['Straight', 'M17 6v28'], ['Right turn', 'M26 6v28H8'], ['Fork', 'M17 34V16M17 16 8 6M17 16 26 6']];
  return (
    <div className={c.blaze} role="radiogroup" aria-label="Trail markers">
      {blazes.map(([t, d], i) => <button key={t} type="button" role="radio" aria-checked={i === k} aria-label={t} onClick={() => setK(i)}><svg viewBox="0 0 34 40" aria-hidden="true"><rect x="3" y="2" width="28" height="36" rx="4" /><path d={d} /></svg></button>)}
    </div>
  );
}

/* 13 */ function MileMarkers() {
  const [v, bind] = useDrag({ init: 0.4, steps: 20 });
  return (
    <div className={c.miles} {...bind} aria-label="Distance along the trail" aria-valuetext={`${(v * 10).toFixed(1)} kilometres`} style={{ ...bind.style, '--v': v }}>
      {Array.from({ length: 21 }, (_, k) => <u key={k} data-big={k % 5 === 0} aria-hidden="true" />)}
      <b aria-hidden="true"><output>{(v * 10).toFixed(1)} km</output></b>
    </div>
  );
}

/* 14 */ function Trace() {
  const [trail, setTrail] = useState([1, 4]);
  const grid = Array.from({ length: 12 }, (_, k) => k);
  return (
    <div className={c.trace} role="group" aria-label="Trace your route">
      {grid.map((k) => <button key={k} type="button" aria-pressed={trail.includes(k)} aria-label={`Waypoint ${k + 1}`} onClick={() => setTrail((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]))}><i data-n={trail.indexOf(k) + 1 || undefined} /></button>)}
      <output>{trail.length} stops</output>
    </div>
  );
}

/* 15 */ function ReadBar() {
  const [v, bind] = useDrag({ init: 0.45 });
  return (
    <div className={c.read}>
      <div className={c.readBar} {...bind} aria-label="Reading position" style={{ ...bind.style, '--v': v }}>{[0.2, 0.45, 0.7, 0.9].map((p) => <u key={p} style={{ left: `${p * 100}%` }} aria-hidden="true" />)}<i aria-hidden="true" /></div>
      <output>{['Intro', 'Method', 'Results', 'Notes', 'Index'][Math.min(4, Math.floor(v * 5))]}</output>
    </div>
  );
}

/* 16 */ function Numbered() {
  const [open, setOpen] = useState(1);
  const secs = [['Basics', ['Install', 'Run']], ['Guides', ['Theming', 'Routing']], ['Reference', ['API']]];
  return (
    <ol className={c.nsec} aria-label="Numbered sections">
      {secs.map(([t, kids], i) => (
        <li key={t}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><b>{i + 1}</b>{t}</button>
          {open === i && <ol>{kids.map((k, j) => <li key={k}>{i + 1}.{j + 1} {k}</li>)}</ol>}
        </li>
      ))}
    </ol>
  );
}

/* 17 */ function NextPrev() {
  const [k, setK] = useState(1);
  const posts = ['Maps', 'Signs', 'Trails', 'Charts'];
  return (
    <nav className={c.np} aria-label="Next and previous">
      <button type="button" disabled={k === 0} onClick={() => setK(k - 1)}><small>Previous</small><b>{posts[k - 1] || '—'}</b></button>
      <button type="button" disabled={k === 3} onClick={() => setK(k + 1)}><small>Next</small><b>{posts[k + 1] || '—'}</b></button>
    </nav>
  );
}

/* 18 */ function StickyChapter() {
  const [k, setK] = useState(0);
  const ch = ['I · Arrival', 'II · Crossing', 'III · Return'];
  return (
    <div className={c.sticky}>
      <header key={k}>{ch[k]}</header>
      <div className={c.stickyBody} onScroll={(e) => { const el = e.currentTarget; setK(clamp(Math.floor((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 2.999), 0, 2)); }} tabIndex={0} aria-label="Scroll the text; the header follows">
        {Array.from({ length: 9 }, (_, i) => <p key={i}>{['Gulls over the pier.', 'A long wait in the rain.', 'The ferry, late.', 'A line of lamps.', 'Salt on the glass.', 'Nobody speaks.', 'The coast comes up.', 'Home by the hill road.', 'Lights, then the door.'][i]}</p>)}
      </div>
    </div>
  );
}

/* 19 */ function ScrollCue() {
  return (
    <div className={c.cue} role="img" aria-label="Scroll cue">
      <span><i /></span>
      <small>Scroll</small>
    </div>
  );
}

/* 20 */ function SkipLink() {
  const [shown, setShown] = useState(false);
  return (
    <div className={c.skip}>
      <a href="#skip" data-shown={shown} onFocus={() => setShown(true)} onBlur={() => setShown(false)} onClick={(e) => e.preventDefault()}>Skip to content</a>
      <p>Press Tab to bring the link in.</p>
      <button type="button" onClick={() => setShown(!shown)} aria-pressed={shown}>Preview</button>
    </div>
  );
}

/* 21 */ function Tree() {
  const [k, setK] = useState('1.2');
  const nodes = [['1', 'Part one', [['1.1', 'First'], ['1.2', 'Second']]], ['2', 'Part two', [['2.1', 'Third']]]];
  return (
    <ul className={c.tree} aria-label="Contents tree">
      {nodes.map(([id, t, kids]) => (
        <li key={id}><b>{id}  {t}</b><ul>{kids.map(([kid, kt]) => <li key={kid}><button type="button" aria-current={kid === k ? 'true' : undefined} onClick={() => setK(kid)}>{kid} {kt}</button></li>)}</ul></li>
      ))}
    </ul>
  );
}

/* 22 */ function Index() {
  const [k, setK] = useState(3);
  return (
    <ol className={c.idx} aria-label="Dot and line index">
      {['Prelude', 'First', 'Second', 'Third', 'Coda'].map((t, i) => <li key={t} data-on={i <= k}><button type="button" aria-current={i === k ? 'true' : undefined} onClick={() => setK(i)}><i /><span>{t}</span></button></li>)}
    </ol>
  );
}

/* 23 */ function GateArrows() {
  const [k, setK] = useState(0);
  const signs = [['A1–A12', 'left'], ['B1–B20', 'right'], ['Baggage', 'down'], ['Exit', 'up']];
  return (
    <div className={c.gate} role="radiogroup" aria-label="Gate signs">
      {signs.map(([t, d], i) => <button key={t} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}><Ico n={d} /><span>{t}</span></button>)}
    </div>
  );
}

/* 24 */ function Board() {
  const n = useTick(1600);
  const rows = [['LH 482', 'Lisbon', 'B12'], ['KL 1021', 'Oslo', 'A03'], ['AF 614', 'Nice', 'C07'], ['BA 238', 'Dublin', 'A19']];
  return (
    <table className={c.board}>
      <caption className="sr-only">Departures</caption>
      <tbody>{rows.map(([f, d, g], i) => <tr key={f} data-hot={i === n % 4}><th scope="row">{f}</th><td>{d}</td><td>{g}</td><td aria-hidden="true">{i === n % 4 ? '→' : ''}</td></tr>)}</tbody>
    </table>
  );
}

/* 25 */ function Radar() {
  const blips = [[30, 24], [70, 40], [44, 70], [20, 62]];
  return (
    <div className={c.radar} role="img" aria-label="Radar with four waypoints">
      <i aria-hidden="true" />
      {blips.map(([x, y], k) => <b key={k} style={{ left: `${x}%`, top: `${y}%`, '--k': k }} aria-hidden="true" />)}
    </div>
  );
}

/* 26 */ function Coords() {
  const [p, setP] = useState(null);
  return (
    <div className={c.coords} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP([((e.clientX - r.left) / r.width), ((e.clientY - r.top) / r.height)]); }} onPointerLeave={() => setP(null)} tabIndex={0} role="application" aria-label="Coordinate grid, move the pointer" onKeyDown={(e) => { const d = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key]; if (d) { e.preventDefault(); setP((q) => { const b = q || [0.5, 0.5]; return [clamp(b[0] + d[0]), clamp(b[1] + d[1])]; }); } }}>
      {p && <><i style={{ left: `${p[0] * 100}%` }} /><i style={{ top: `${p[1] * 100}%` }} data-h /></>}
      <output>{p ? `${(60 - p[1] * 6).toFixed(2)}°N ${(p[0] * 12).toFixed(2)}°E` : 'Hover the grid'}</output>
    </div>
  );
}

/* 27 */ function Route() {
  const [leg, setLeg] = useState(0);
  const legs = [['A → B', '12 min'], ['B → C', '8 min'], ['C → D', '21 min']];
  return (
    <div className={c.route2}>
      <svg viewBox="0 0 120 40" aria-hidden="true"><path d="M10 28 40 12 80 26 110 10" className={c.rBase} />{[[10, 28], [40, 12], [80, 26], [110, 10]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.4" className={k <= leg + 0 ? c.rOn : undefined} />)}<path d={['M10 28 40 12', 'M40 12 80 26', 'M80 26 110 10'][leg]} className={c.rLeg} /></svg>
      <div role="radiogroup" aria-label="Route legs">{legs.map(([t, m], i) => <button key={t} type="button" role="radio" aria-checked={i === leg} onClick={() => setLeg(i)}>{t}<small>{m}</small></button>)}</div>
    </div>
  );
}

const PROFILE = Array.from({ length: 24 }, (_, i) => 0.2 + 0.5 * Math.abs(Math.sin(i / 4)) + 0.2 * Math.sin(i / 1.6) ** 2);

/* 28 */ function Elevation() {
  const [k, setK] = useState(10);
  const p = pts(PROFILE, 100, 40, 4);
  return (
    <div className={c.elev}>
      <svg viewBox="0 0 100 40" aria-hidden="true" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setK(clamp(Math.round(((e.clientX - r.left) / r.width) * 23), 0, 23)); }}>
        <path d={`${curve(p)}L100 40L0 40Z`} className={c.eFill} /><path d={curve(p)} className={c.eLine} />
        <line x1={p[k][0]} x2={p[k][0]} y1={p[k][1]} y2="40" className={c.eMark} /><circle cx={p[k][0]} cy={p[k][1]} r="2" className={c.eDot} />
      </svg>
      <input type="range" min="0" max="23" value={k} onChange={(e) => setK(Number(e.target.value))} aria-label="Position on the profile" />
      <output>{Math.round(PROFILE[k] * 1200)} m</output>
    </div>
  );
}

/* 29 */ function Bookmarks() {
  const [marks, setMarks] = useState([3, 11]);
  const flip = (k) => setMarks((m) => (m.includes(k) ? m.filter((x) => x !== k) : [...m, k]));
  return (
    <div className={c.books}>
      <ol>{Array.from({ length: 14 }, (_, k) => <li key={k}><button type="button" aria-pressed={marks.includes(k)} aria-label={`Page ${k + 1}`} onClick={() => flip(k)}><i /></button></li>)}</ol>
      <output>{marks.length} saved</output>
    </div>
  );
}

/* 30 */ function PageFlags() {
  const [k, setK] = useState(1);
  return (
    <div className={c.flags}>
      <div className={c.flagPage}><b>{['Maps', 'Signs', 'Trails'][k]}</b><span>Page {k * 4 + 3}</span></div>
      <div role="tablist" aria-label="Page flags" aria-orientation="vertical">{['#ff3333', '#ffb347', '#6ee7b7'].map((h, i) => <button key={h} type="button" role="tab" aria-selected={i === k} aria-label={['Maps', 'Signs', 'Trails'][i]} style={{ '--h': h, '--i': i }} onClick={() => setK(i)} />)}</div>
    </div>
  );
}

/* 31 */ function Depth() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.7 });
  const m = Math.round((1 - v) * 4000);
  const zone = m < 200 ? 'Sunlight' : m < 1000 ? 'Twilight' : m < 4000 ? 'Midnight' : 'Abyss';
  return (
    <div className={c.depth} {...bind} aria-label="Depth, drag the marker" aria-valuetext={`${m} metres, ${zone}`} style={{ ...bind.style, '--v': 1 - v }}>
      <b aria-hidden="true"><i /></b>
      <output>{m} m<small>{zone}</small></output>
    </div>
  );
}

/* 32 */ function ZoomLevels() {
  const [k, setK] = useState(1);
  const lv = ['Country', 'City', 'Street', 'Door'];
  return (
    <div className={c.zlev}>
      <div className={c.zmap} style={{ '--k': k }} aria-hidden="true"><i /><i /><i /><b /></div>
      <div role="radiogroup" aria-label="Zoom level">{lv.map((t, i) => <button key={t} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
    </div>
  );
}

/* 33 */ function Treasure() {
  const [x, setX] = useState([[22, 60], [48, 36]]);
  return (
    <div className={c.treasure} role="application" aria-label="Treasure map, click to add a mark" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setX((a) => [...a.slice(-3), [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]]); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setX((a) => [...a.slice(-3), [20 + a.length * 17, 30 + (a.length % 2) * 30]]); if (e.key === 'Backspace') setX([]); }}>
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true"><path d={x.map(([a, b], i) => `${i ? 'L' : 'M'}${a} ${b * 0.7}`).join('')} className={c.tPath} /></svg>
      {x.map(([a, b], i) => <b key={`${i}-${a}`} style={{ left: `${a}%`, top: `${b}%` }}>{i === x.length - 1 ? '✕' : '·'}</b>)}
    </div>
  );
}

/* 34 */ function Lighthouse() {
  const k = useCycle(6, 1000);
  return (
    <div className={c.light} role="img" aria-label="Lighthouse beam sweeping six markers">
      <i aria-hidden="true" />
      {Array.from({ length: 6 }, (_, i) => <b key={i} data-on={i === k} style={{ '--a': i * 60 }} aria-hidden="true" />)}
    </div>
  );
}

/* 35 */ function SnapDots() {
  const box = useRef(null);
  const [k, setK] = useState(0);
  const go = (i) => { box.current?.scrollTo({ left: i * box.current.clientWidth, behavior: 'smooth' }); setK(i); };
  return (
    <div className={c.snap}>
      <div ref={box} className={c.snapRow} tabIndex={0} aria-label="Cards, scroll sideways" onScroll={(e) => setK(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>{['One', 'Two', 'Three'].map((t) => <section key={t}>{t}</section>)}</div>
      <div role="tablist" aria-label="Card position">{[0, 1, 2].map((i) => <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={`Card ${i + 1}`} onClick={() => go(i)} />)}</div>
    </div>
  );
}

/* 36 */ function JumpSelect() {
  const [v, setV] = useState('Method');
  return (
    <label className={c.jumpSel}>
      <span>Jump to</span>
      <select value={v} onChange={(e) => setV(e.target.value)}>{DOC.map((t) => <option key={t}>{t}</option>)}</select>
      <output>→ #{v.toLowerCase()}</output>
    </label>
  );
}

/* 37 */ function Annotations() {
  const [k, setK] = useState(-1);
  const notes = [[24, 34, 'Chimney'], [58, 60, 'Doorway'], [78, 28, 'Weather vane']];
  return (
    <div className={c.annot} onPointerLeave={() => setK(-1)}>
      <svg viewBox="0 0 100 60" aria-hidden="true"><path d="M10 54V28L30 12l20 16v26M50 28l16-10 24 12v24H50M28 54V36h10v18" /></svg>
      {notes.map(([x, y, t], i) => <button key={t} type="button" style={{ left: `${x}%`, top: `${y}%` }} aria-label={t} aria-expanded={k === i} onPointerEnter={() => setK(i)} onFocus={() => setK(i)} onBlur={() => setK(-1)}><span>{i + 1}</span>{k === i && <em>{t}</em>}</button>)}
    </div>
  );
}

/* 38 */ function Landmarks() {
  const [k, setK] = useState('C');
  const list = { A: ['Abbey'], B: ['Bridge', 'Belfry'], C: ['Castle', 'Cathedral'], D: ['Dock'] };
  return (
    <div className={c.lm}>
      <div role="tablist" aria-label="Letters">{Object.keys(list).map((l) => <button key={l} type="button" role="tab" aria-selected={k === l} onClick={() => setK(l)}>{l}</button>)}</div>
      <ul>{list[k].map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}

/* 39 */ function Cube() {
  const [k, setK] = useState(0);
  const faces = ['Front', 'Right', 'Back', 'Left'];
  return (
    <div className={c.cube}>
      <div className={c.cubeBox} style={{ '--k': k }} aria-hidden="true">{faces.map((f, i) => <b key={f} style={{ '--i': i }}>{f}</b>)}</div>
      <div><button type="button" aria-label="Turn left" onClick={() => setK(k - 1)}><Ico n="left" /></button><output aria-live="polite">{faces[((k % 4) + 4) % 4]}</output><button type="button" aria-label="Turn right" onClick={() => setK(k + 1)}><Ico n="right" /></button></div>
    </div>
  );
}

/* 40 */ function StationMap() {
  const [k, setK] = useState(3);
  const st = [[10, 30], [30, 12], [52, 30], [72, 12], [92, 30]];
  return (
    <div className={c.stations}>
      <svg viewBox="0 0 100 42" aria-hidden="true"><path d={st.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')} className={c.sBase} /><path d={st.slice(0, k + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')} className={c.sOn} /></svg>
      {st.map(([x, y], i) => <button key={i} type="button" aria-label={`Station ${i + 1}`} aria-pressed={i === k} data-on={i <= k} style={{ left: `${x}%`, top: `${(y / 42) * 100}%` }} onClick={() => setK(i)} />)}
    </div>
  );
}

/* 41 */ function Elevator() {
  const [k, setK] = useState(2);
  return (
    <div className={c.lift}>
      <div className={c.shaft} style={{ '--k': k }} aria-hidden="true"><i /></div>
      <div role="radiogroup" aria-label="Floor">{[4, 3, 2, 1, 0].map((f) => <button key={f} type="button" role="radio" aria-checked={f === k} onClick={() => setK(f)}>{f === 0 ? 'G' : f}</button>)}</div>
    </div>
  );
}

/* 42 */ function Bearing() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.5, range: 360 });
  const deg = (Math.round(v * 360) + 180) % 360;
  const names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return (
    <div className={c.bearing}>
      <div {...bind} aria-label="Bearing dial" aria-valuetext={`${deg} degrees`} style={{ ...bind.style, '--v': v }}><i aria-hidden="true" />{[0, 90, 180, 270].map((a) => <b key={a} aria-hidden="true" style={{ '--a': a }}>{names[a / 45]}</b>)}</div>
      <output>{String(deg).padStart(3, '0')}° {names[Math.round(deg / 45) % 8]}</output>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Contents list', Contents, 'click'], ['Outline rail', OutlineRail, 'hover'], ['Page thumbnail', MiniMapScroller, 'drag'], ['Back-to-top ring', BackToTop, 'drag'],
    ['Section dots', SectionDots, 'click'], ['Anchor chips', AnchorChips, 'click'], ['Compass rose', CompassRose, 'click'], ['Signpost', Signpost, 'click'],
    ['You are here', YouAreHere, 'click'], ['Floor plan', FloorPlan, 'click'], ['Subway line', Subway, 'click'], ['Trail blazes', Blazes, 'click'],
    ['Mile markers', MileMarkers, 'drag'], ['Route trace', Trace, 'click'], ['Reading marks', ReadBar, 'drag'], ['Numbered sections', Numbered, 'click'],
    ['Next and previous', NextPrev, 'click'], ['Sticky chapter', StickyChapter, 'scroll'], ['Scroll cue', ScrollCue, 'auto'], ['Skip link', SkipLink, 'keys'],
    ['Contents tree', Tree, 'click'], ['Dot index', Index, 'click'], ['Gate signs', GateArrows, 'click'], ['Departures board', Board, 'auto'],
    ['Waypoint radar', Radar, 'auto'], ['Coordinate grid', Coords, 'hover'], ['Route legs', Route, 'click'], ['Elevation profile', Elevation, 'hover'],
    ['Bookmark strip', Bookmarks, 'click'], ['Page flags', PageFlags, 'click'], ['Depth marker', Depth, 'drag'], ['Zoom levels', ZoomLevels, 'click'],
    ['Treasure map', Treasure, 'click'], ['Lighthouse beam', Lighthouse, 'auto'], ['Snap dots', SnapDots, 'scroll'], ['Jump select', JumpSelect, 'click'],
    ['Annotation pins', Annotations, 'hover'], ['Landmark index', Landmarks, 'click'], ['Orientation cube', Cube, 'click'], ['Station map', StationMap, 'click'],
    ['Elevator', Elevator, 'click'], ['Bearing dial', Bearing, 'drag'],
  ],
};
