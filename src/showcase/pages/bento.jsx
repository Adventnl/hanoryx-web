import { useState } from 'react';
import { useDrag, useTick, useCycle, useToggle } from '../hooks';
import { useHot, useScan, usePoint, useCell } from '../kit';
import c from './bento.module.css';

/* ============================================================
   19 · BENTO — tiles that tessellate.
   The still side is one board of eight tiles that settles into three different
   arrangements as you scroll. Each tile has a rectangle in each arrangement, and
   its box is a blend of the three, weighted by two eased numbers taken from --pin:
   plain calc(), no script. On the right, forty-two dashboard tiles drift in two
   columns, each one a small working thing.
   ============================================================ */

/* ---------- the still side ---------- */

/* x y w h, in quarters of the board, for the three arrangements */
const LAYOUTS = [
  [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 2, 1], [0, 2, 1, 2], [1, 2, 2, 1], [3, 2, 1, 2], [1, 3, 2, 1]],
  [[2, 0, 2, 2], [0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 2, 1], [3, 2, 1, 2], [1, 2, 2, 1], [0, 2, 1, 2], [1, 3, 2, 1]],
  [[0, 0, 1, 4], [1, 0, 2, 1], [3, 0, 1, 2], [1, 1, 1, 1], [2, 1, 1, 1], [1, 2, 3, 1], [1, 3, 1, 1], [2, 3, 2, 1]],
];
const KINDS = ['hero', 'ring', 'switch', 'dots', 'bars', 'lines', 'meter', 'chips'];
const NAMES = ['Revenue', 'Goal', 'Alerts', 'Month', 'Week', 'Queue', 'Load', 'Tags'];
const boxOf = (i) => {
  const out = {};
  ['a', 'b', 'c'].forEach((l, k) => ['x', 'y', 'w', 'h'].forEach((d, j) => { out[`--${l}${d}`] = LAYOUTS[k][i][j]; }));
  return out;
};

function Visual() {
  return (
    <div className={c.board} aria-hidden="true">
      <div className={c.grid}>
        {KINDS.map((kind, i) => (
          <div key={kind} className={c.vt} style={boxOf(i)}>
            <div className={`${c.cell} ${c[`k_${kind}`]}`}>
              <i className={c.vk}>{NAMES[i]}</i>
              {kind === 'hero' ? <b>$12.4k</b> : null}
              {kind === 'ring' ? <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" /><circle cx="20" cy="20" r="15" pathLength="100" /></svg> : null}
              {kind === 'switch' ? <u><s /></u> : null}
              {kind === 'dots' ? <span>{Array.from({ length: 35 }, (_, k) => <s key={k} data-on={[3, 9, 10, 17, 18, 24, 31].includes(k)} />)}</span> : null}
              {kind === 'bars' ? <span>{[40, 66, 52, 88, 60, 74].map((h, k) => <s key={k} style={{ '--h': `${h}%` }} />)}</span> : null}
              {kind === 'lines' ? <span><s /><s /><s /></span> : null}
              {kind === 'meter' ? <span><s /></span> : null}
              {kind === 'chips' ? <span><s /><s /><s /></span> : null}
            </div>
          </div>
        ))}
      </div>
      <p className={c.layoutTag}><i className="sc-led" /><span className={c.la}>Arrangement A</span><span className={c.lb}>Arrangement B</span><span className={c.lc}>Arrangement C</span></p>
    </div>
  );
}

/* ---------- helpers ---------- */

const pad = (n) => String(n).padStart(2, '0');

function Tile({ k, children, className = '', ...rest }) {
  return <span className={`${c.tile} ${className}`} {...rest}><i className={c.k}>{k}</i>{children}</span>;
}

/* ---------- 01 numbers and charts ---------- */

const SPARK = 'M0 20 L12 16 L24 18 L36 10 L48 13 L60 6 L72 9 L84 3 L100 5';
function StatTile() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <Tile k="Revenue">
        <b className={c.v}>$12.4k</b>
        <em className={c.delta}>8.2% this week</em>
        <svg className={c.spark} viewBox="0 0 100 24" aria-hidden="true"><path d={SPARK} /></svg>
      </Tile>
    </button>
  );
}

function SparkTile() {
  return (
    <div className={c.fig} role="img" aria-label="A trend line drawing itself">
      <Tile k="Visits">
        <svg className={`${c.spark} ${c.draw}`} viewBox="0 0 100 24" aria-hidden="true"><path pathLength="1" d={SPARK} /><circle cx="100" cy="5" r="2" /></svg>
        <b className={c.v}>4,218</b>
      </Tile>
    </div>
  );
}

function RingTile() {
  const [hot, bind] = useHot();
  const v = hot ? 86 : 62;
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label={`Goal ring at ${v} percent`} {...bind}>
      <Tile k="Goal">
        <span className={c.ringWrap}>
          <svg className={c.ring} viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" /><circle cx="20" cy="20" r="15" pathLength="100" style={{ strokeDashoffset: 100 - v }} /></svg>
          <b>{v}%</b>
        </span>
      </Tile>
    </button>
  );
}

const DAYS = Array.from({ length: 35 }, (_, i) => i - 2);
function CalendarTile() {
  const [day, setDay] = useState(14);
  return (
    <div className={c.fig}>
      <Tile k="October">
        <div className={c.cal}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <i key={i} className={c.wd}>{d}</i>)}
          {DAYS.map((d) => (d >= 1 && d <= 31
            ? <button key={d} type="button" aria-pressed={d === day} aria-label={`October ${d}`} onClick={() => setDay(d)}>{d}</button>
            : <u key={d} />))}
        </div>
      </Tile>
    </div>
  );
}

const BARS = [38, 62, 48, 86, 58, 72, 44];
function BarTile() {
  const [i, bind] = useScan(BARS.length, { axis: 'x', label: (k) => `Day ${k + 1}: ${BARS[k]}` });
  return (
    <div className={c.fig}>
      <Tile k="This week">
        <div {...bind} className={c.barBox} aria-label="Bars; move along them to read a day">
          {BARS.map((h, k) => <i key={k} data-on={i === k} style={{ '--h': `${h}%` }}>{i === k ? <b>{h}</b> : null}</i>)}
        </div>
      </Tile>
    </div>
  );
}

function DonutTile() {
  return (
    <div className={c.fig} role="img" aria-label="A donut chart turning slowly: forty percent, thirty, thirty">
      <Tile k="Split">
        <span className={c.donut}><i /><b>3</b></span>
      </Tile>
    </div>
  );
}

function GaugeTile() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.62 });
  return (
    <div className={c.fig}>
      <Tile k="Load">
        <svg className={c.gauge} viewBox="0 0 60 36" aria-hidden="true">
          <path className={c.gTrack} d="M6 32A24 24 0 0 1 54 32" />
          <path className={c.gVal} pathLength="1" d="M6 32A24 24 0 0 1 54 32" style={{ strokeDasharray: `${v} 1` }} />
        </svg>
        <b className={`${c.v} ${c.center}`}>{Math.round(v * 100)}%</b>
      </Tile>
      <div {...bind} className={c.track} aria-label="Load" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

const hands = (n) => {
  const s = (10 * 3600 + 8 * 60 + n) % 43200;
  return [(s / 43200) * 360, ((s % 3600) / 3600) * 360, (n % 60) * 6];
};
function ClockTile() {
  const t = useTick(1000);
  const [h, m, s] = hands(t);
  return (
    <div className={c.fig} role="img" aria-label={`Analog clock, ten past ten, ${t % 60} seconds`}>
      <Tile k="Local">
        <span className={c.clock}>
          {[0, 1, 2, 3].map((i) => <i key={i} style={{ '--r': `${i * 90}deg` }} />)}
          <b style={{ transform: `rotate(${h}deg)` }} /><b className={c.min} style={{ transform: `rotate(${m}deg)` }} /><b className={c.sec} style={{ transform: `rotate(${s}deg)` }} />
        </span>
      </Tile>
    </div>
  );
}

function TimerTile() {
  const t = useTick(100);
  const [run, setRun] = useState({ on: false, start: 0, base: 0 });
  const ms = (run.on ? run.base + (t - run.start) : run.base) * 100;
  const toggle = () => setRun((r) => (r.on ? { on: false, start: 0, base: r.base + (t - r.start) } : { on: true, start: t, base: r.base }));
  return (
    <div className={c.fig}>
      <Tile k="Stopwatch">
        <b className={c.v} aria-live="off">{pad(Math.floor(ms / 60000))}:{pad(Math.floor(ms / 1000) % 60)}<small>.{Math.floor((ms % 1000) / 100)}</small></b>
        <span className={c.row}>
          <button type="button" className={c.btn} onClick={toggle}>{run.on ? 'Stop' : 'Start'}</button>
          <button type="button" className={c.btn} onClick={() => setRun({ on: false, start: 0, base: 0 })}>Reset</button>
        </span>
      </Tile>
    </div>
  );
}

/* ---------- 02 switches and lists ---------- */

function ToggleTile() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" role="switch" aria-checked={on} className={`${c.fig} ${c.reset}`} onClick={flip}>
      <Tile k="Alerts">
        <span className={c.sw} data-on={on}><i /></span>
        <b className={c.v}>{on ? 'On' : 'Off'}</b>
      </Tile>
    </button>
  );
}

const TODO = ['Wind the belt', 'Open the gates', 'Serve the tea'];
function ChecklistTile() {
  const [done, setDone] = useState(() => new Set([0]));
  const toggle = (i) => setDone((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className={c.fig}>
      <Tile k={`Tasks · ${done.size}/3`}>
        <ul className={c.tasks}>
          {TODO.map((t, i) => <li key={t}><button type="button" role="checkbox" aria-checked={done.has(i)} onClick={() => toggle(i)}><i /><span>{t}</span></button></li>)}
        </ul>
      </Tile>
    </div>
  );
}

function ProgressSteps() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Step ${n} of 5; advance`} onClick={() => setN((v) => (v % 5) + 1)}>
      <Tile k={`Setup · ${n}/5`}>
        <span className={c.segs}>{[1, 2, 3, 4, 5].map((k) => <i key={k} data-on={k <= n} />)}</span>
        <b className={c.v}>{['Account', 'Team', 'Billing', 'Data', 'Launch'][n - 1]}</b>
      </Tile>
    </button>
  );
}

function PlayerTile() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Player; play or pause" onClick={flip}>
      <Tile k="Now playing">
        <span className={c.eq} data-on={on}>{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} />)}</span>
        <b className={c.v}>Quiet machine</b>
        <span className={c.pbar} data-on={on}><i /></span>
      </Tile>
    </button>
  );
}

function ChatTile() {
  return (
    <div className={c.fig} role="img" aria-label="A short conversation appearing, message by message">
      <Tile k="Chat">
        <div className={c.chat}>
          <p style={{ '--i': 0 }}>Is the belt on?</p>
          <p className={c.me} style={{ '--i': 1 }}>Always.</p>
          <p style={{ '--i': 2 }}><i /><i /><i /></p>
        </div>
      </Tile>
    </div>
  );
}

function BatteryTile() {
  const [full, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={full} aria-label="Battery; plug in or unplug" onClick={flip}>
      <Tile k="Battery">
        <span className={c.batt} data-full={full}><i /><b /></span>
        <b className={c.v}>{full ? '92%' : '21%'}</b>
      </Tile>
    </button>
  );
}

function SignalTile() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Signal ${n} of 4 bars; change`} onClick={() => setN((v) => (v % 4) + 1)}>
      <Tile k="Signal">
        <span className={c.bars4}>{[1, 2, 3, 4].map((k) => <i key={k} data-on={k <= n} style={{ '--k': k }} />)}</span>
        <b className={c.v}>{['Weak', 'Fair', 'Good', 'Strong'][n - 1]}</b>
      </Tile>
    </button>
  );
}

const STORE = [['Docs', 24, 'a'], ['Media', 38, 'b'], ['Apps', 18, 'c'], ['Free', 20, 'd']];
function StorageTile() {
  const edges = STORE.reduce((a, s, i) => [...a, (a[i - 1] ?? 0) + s[1] / 100], []);
  const [i, bind] = useScan(4, { axis: 'x', edges, label: (k) => `${STORE[k][0]}: ${STORE[k][1]} percent` });
  return (
    <div className={c.fig}>
      <Tile k="Storage">
        <div {...bind} className={c.stack} aria-label="Storage by kind; move along the bar">
          {STORE.map(([n, p, k], j) => <i key={n} className={c[`s_${k}`]} data-on={i === j} style={{ flexGrow: p }} />)}
        </div>
        <b className={c.v}>{i < 0 ? '80 GB' : `${STORE[i][0]} · ${STORE[i][1]}%`}</b>
      </Tile>
    </div>
  );
}

function KnobTile() {
  const [v, bind] = useDrag({ mode: 'r', init: 0.4 });
  return (
    <div className={c.fig}>
      <Tile k="Level">
        <div {...bind} className={c.knob} aria-label="Level knob" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style }}>
          <i style={{ transform: `rotate(${-135 + v * 270}deg)` }} />
        </div>
        <b className={`${c.v} ${c.center}`}>{Math.round(v * 100)}</b>
      </Tile>
    </div>
  );
}

function VolumeTile() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.55, steps: 10 });
  return (
    <div className={c.fig}>
      <Tile k="Volume">
        <div {...bind} className={c.vol} aria-label="Volume" aria-valuetext={`${Math.round(v * 10)} of 10`} style={{ ...bind.style }}>
          {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i < Math.round(v * 10)} style={{ '--i': i }} />)}
        </div>
        <b className={`${c.v} ${c.center}`}>{Math.round(v * 10)}</b>
      </Tile>
    </div>
  );
}

/* ---------- 03 inputs and small apps ---------- */

function NotesTile() {
  const [t, setT] = useState('Check the belt before seven.');
  const words = t.trim() ? t.trim().split(/\s+/).length : 0;
  return (
    <div className={c.fig}>
      <Tile k={`Notes · ${words} words`}>
        <textarea className={c.area} value={t} onChange={(e) => setT(e.target.value)} rows={3} aria-label="Notes" spellCheck="false" />
      </Tile>
    </div>
  );
}

const SW = ['#ff3333', '#f1f1f4', '#8a8d96', '#5a0f0f'];
function SwatchTile() {
  const [k, setK] = useState(0);
  return (
    <div className={c.fig}>
      <Tile k="Accent" style={{ '--acc': SW[k] }} className={c.accent}>
        <b className={c.v}>{['Signal', 'Paper', 'Steel', 'Ember'][k]}</b>
        <span className={c.swatches} role="radiogroup" aria-label="Accent colour">
          {SW.map((s, i) => <button key={s} type="button" role="radio" aria-checked={i === k} aria-label={['Signal', 'Paper', 'Steel', 'Ember'][i]} style={{ background: s }} onClick={() => setK(i)} />)}
        </span>
      </Tile>
    </div>
  );
}

const TAGS = ['belts', 'gates', 'tea', 'maps', 'notes'];
function TagsTile() {
  const [on, setOn] = useState(() => new Set(['tea']));
  const toggle = (t) => setOn((s) => { const n = new Set(s); if (n.has(t)) n.delete(t); else n.add(t); return n; });
  return (
    <div className={c.fig}>
      <Tile k={`Tags · ${on.size}`}>
        <span className={c.chips}>{TAGS.map((t) => <button key={t} type="button" aria-pressed={on.has(t)} onClick={() => toggle(t)}>{t}</button>)}</span>
      </Tile>
    </div>
  );
}

function AvatarsTile() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Team avatars that spread out" {...bind}>
      <Tile k="Team">
        <span className={c.faces}>{['AW', 'BR', 'CE', 'DM', '+3'].map((f, i) => <i key={f} style={{ '--i': i }}>{f}</i>)}</span>
        <b className={c.v}>8 people</b>
      </Tile>
    </button>
  );
}

const PRICES = Array.from({ length: 20 }, (_, i) => +(184 + 3 * Math.sin(i * 1.1) + 2 * Math.cos(i * 2.3)).toFixed(2));
function TickerTile() {
  const t = useTick(1200);
  const now = PRICES[t % 20];
  const was = PRICES[(t + 19) % 20];
  return (
    <div className={c.fig} role="img" aria-label={`Price ${now.toFixed(2)}`}>
      <Tile k="HNRX">
        <b key={t} className={`${c.v} ${c.flash}`} data-dn={now < was}>{now.toFixed(2)}</b>
        <span className={c.miniBars}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--h': `${30 + ((PRICES[(t + i) % 20] - 180) / 8) * 70}%` }} />)}</span>
      </Tile>
    </div>
  );
}

function MapTile() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <Tile k={p ? `${(40 + p.y * 0.1).toFixed(3)}° N · ${(p.x * 0.1).toFixed(3)}° E` : 'Map'}>
        <div {...bind} className={c.map} aria-label="A small map; move over it to place the pin">
          <i className={c.pin} style={{ left: `${p ? p.x : 62}%`, top: `${p ? p.y : 42}%` }} />
        </div>
      </Tile>
    </div>
  );
}

const QUOTES = ['The belt keeps moving.', 'Nobody asked it to.', 'Somebody should.'];
function QuoteTile() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="A quotation; show the next" onClick={() => setK((x) => (x + 1) % 3)}>
      <Tile k={`Quote ${k + 1}/3`}>
        <b key={k} className={`${c.q}`}>“{QUOTES[k]}”</b>
      </Tile>
    </button>
  );
}

function ImageTile() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A picture that zooms and shows its caption" {...bind}>
      <span className={`${c.tile} ${c.imgTile}`}><i className={c.art} /><span className={c.cap}>Fig. 1 — The belt, from the gate</span></span>
    </button>
  );
}

function CodeTile() {
  return (
    <div className={c.fig} role="img" aria-label="A few lines of code appearing one after another">
      <Tile k="belt.js">
        <pre className={c.code}>
          <span style={{ '--i': 0 }}>const belt = start();</span>
          <span style={{ '--i': 1 }}>belt.speed(5);</span>
          <span style={{ '--i': 2 }}>await belt.ready;</span>
        </pre>
      </Tile>
    </div>
  );
}

function CommandTile() {
  return (
    <div className={c.fig} role="img" aria-label="A command line typing a status command">
      <Tile k="Command">
        <p className={c.cmd}><span>$</span> status --all<i /></p>
        <p className={c.out}>belt   ok<br />gates  ok<br />tea    low</p>
      </Tile>
    </div>
  );
}

function CardTile() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={c.pay} aria-label="A payment card with a shine that follows the pointer" style={{ ...bind.style, '--lx': `${p ? p.x : 30}%`, '--ly': `${p ? p.y : 20}%` }}>
        <b>H</b><span>•••• •••• •••• 4242</span><em>A. WRITER</em>
      </div>
    </div>
  );
}

function InvoiceTile() {
  const [paid, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={paid} aria-label="Invoice; mark it paid or unpaid" onClick={flip}>
      <Tile k="Invoice 0142">
        <span className={c.rows}><i><span>Belt</span><b>$120</b></i><i><span>Tea</span><b>$18</b></i><i className={c.total}><span>Total</span><b>$138</b></i></span>
        <em className={c.badge} data-paid={paid}>{paid ? 'Paid' : 'Due'}</em>
      </Tile>
    </button>
  );
}

const ITEMS = ['Belt', 'Gate', 'Tea', 'Timetable', 'Platform', 'Mill'];
function SearchTile() {
  const [q, setQ] = useState('t');
  const hits = ITEMS.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={c.fig}>
      <Tile k={`Search · ${hits.length}`}>
        <input className={c.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search the list" spellCheck="false" autoComplete="off" />
        <span className={c.hits}>{hits.length ? hits.map((h) => <i key={h}>{h}</i>) : <em>nothing</em>}</span>
      </Tile>
    </div>
  );
}

const KEYS = [...'QWERT'];
function KeysTile() {
  const [last, setLast] = useState('');
  return (
    <div className={c.fig}>
      <Tile k="Keys">
        <div className={c.keys} tabIndex={0} role="group" aria-label="Press Q, W, E, R or T to light a key" onKeyDown={(e) => { const k = e.key.toUpperCase(); if (KEYS.includes(k)) setLast(k); }} onBlur={() => setLast('')}>
          {KEYS.map((k) => <i key={k} data-on={last === k}>{k}</i>)}
        </div>
      </Tile>
    </div>
  );
}

function CounterTile() {
  const [n, setN] = useState(7);
  return (
    <div className={c.fig}>
      <Tile k="Count">
        <span className={c.cnt}>
          <button type="button" aria-label="Subtract one" onClick={() => setN((v) => Math.max(0, v - 1))}>−</button>
          <b className={c.v}>{pad(n)}</b>
          <button type="button" aria-label="Add one" onClick={() => setN((v) => Math.min(99, v + 1))}>+</button>
        </span>
      </Tile>
    </div>
  );
}

function RatingTile() {
  const [rate, setRate] = useState(3);
  const [hover, setHover] = useState(0);
  const shown = hover || rate;
  return (
    <div className={c.fig}>
      <Tile k={`Rating · ${rate}/5`}>
        <span className={c.stars} role="radiogroup" aria-label="Rating" onPointerLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rate === n} aria-label={`${n} stars`} data-on={n <= shown} onPointerEnter={() => setHover(n)} onClick={() => setRate(n)} />)}
        </span>
      </Tile>
    </div>
  );
}

const LOADS = [['Belt', 82], ['Gate', 54], ['Tea', 31], ['Mill', 67]];
function LoadBars() {
  return (
    <div className={c.fig} role="img" aria-label="Four load bars filling in turn">
      <Tile k="Load">
        <span className={c.lbars}>{LOADS.map(([n, v], i) => <i key={n} style={{ '--w': `${v}%`, '--i': i }}><span>{n}</span></i>)}</span>
      </Tile>
    </div>
  );
}

const COLS = [['Todo', ['Wind', 'Open']], ['Done', ['Print']]];
function KanbanTile() {
  const [cols, setCols] = useState(COLS);
  const move = (ci, name) => setCols((cs) => cs.map((c2, i) => (i === ci ? [c2[0], c2[1].filter((x) => x !== name)] : [c2[0], [...c2[1], ...(i === 1 - ci ? [name] : [])]])));
  return (
    <div className={c.fig}>
      <Tile k="Board">
        <div className={c.kan}>
          {cols.map(([title, cards], ci) => (
            <div key={title}><em>{title}</em>{cards.map((n) => <button key={n} type="button" aria-label={`${n}: move to ${cols[1 - ci][0]}`} onClick={() => move(ci, n)}>{n}</button>)}</div>
          ))}
        </div>
      </Tile>
    </div>
  );
}

function CountdownTile() {
  const t = useTick(1000);
  const left = 3 * 86400 + 14 * 3600 + 22 * 60 + 40 - t;
  return (
    <div className={c.fig} role="img" aria-label="A countdown to launch">
      <Tile k="Launch in">
        <b className={c.v}>{pad(Math.floor(left / 86400))}<small>d</small> {pad(Math.floor((left % 86400) / 3600))}<small>h</small> {pad(Math.floor((left % 3600) / 60))}<small>m</small> {pad(left % 60)}<small>s</small></b>
      </Tile>
    </div>
  );
}

function WeatherTile() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Weather; hover to switch units" {...bind}>
      <Tile k="Weather">
        <span className={c.sun}><i /><u /></span>
        <b className={c.v}>{hot ? '64°F' : '18°C'}</b>
      </Tile>
    </button>
  );
}

function ActivityRings() {
  return (
    <div className={c.fig} role="img" aria-label="Three activity rings filling and emptying">
      <Tile k="Activity">
        <svg className={c.rings} viewBox="0 0 60 60" aria-hidden="true">
          {[24, 17, 10].map((r, i) => <g key={r}><circle cx="30" cy="30" r={r} /><circle className={c.arc} cx="30" cy="30" r={r} pathLength="100" style={{ '--i': i }} /></g>)}
        </svg>
      </Tile>
    </div>
  );
}

const HEAT = Array.from({ length: 35 }, (_, i) => ((i * 37 + 11) % 10) / 10);
function HeatTile() {
  const [at, bind] = useCell(5, 7, null);
  const k = at[0] >= 0 ? at[0] * 7 + at[1] : -1;
  return (
    <div className={c.fig}>
      <Tile k={k >= 0 ? `Day ${k + 1} · ${Math.round(HEAT[k] * 100)}` : 'Activity'}>
        <div {...bind} className={c.heat} aria-label="A heat map; move over it to read a day">
          {HEAT.map((v, i) => <i key={i} data-on={i === k} style={{ '--v': v }} />)}
        </div>
      </Tile>
    </div>
  );
}

/* the last one is a small loop of its own */
const CYC = ['Plan', 'Build', 'Ship', 'Watch'];
function CycleTile() {
  const k = useCycle(CYC.length, 1400);
  return (
    <div className={c.fig} role="img" aria-label={`A cycle currently at ${CYC[k]}`}>
      <Tile k="Cycle">
        <span className={c.cycle}>{CYC.map((n, i) => <i key={n} data-on={i === k}>{n}</i>)}</span>
      </Tile>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Stat tile', StatTile, 'hover'], ['Spark tile', SparkTile, 'auto'], ['Ring tile', RingTile, 'hover'], ['Calendar tile', CalendarTile, 'click'],
    ['Bar tile', BarTile, 'hover'], ['Donut tile', DonutTile, 'auto'], ['Gauge tile', GaugeTile, 'drag'], ['Clock tile', ClockTile, 'auto'],
    ['Timer tile', TimerTile, 'click'], ['Toggle tile', ToggleTile, 'click'], ['Checklist tile', ChecklistTile, 'click'], ['Steps tile', ProgressSteps, 'click'],
    ['Player tile', PlayerTile, 'click'], ['Chat tile', ChatTile, 'auto'], ['Battery tile', BatteryTile, 'click'], ['Signal tile', SignalTile, 'click'],
    ['Storage tile', StorageTile, 'hover'], ['Knob tile', KnobTile, 'drag'], ['Volume tile', VolumeTile, 'drag'], ['Notes tile', NotesTile, 'type'],
    ['Swatch tile', SwatchTile, 'click'], ['Tags tile', TagsTile, 'click'], ['Avatars tile', AvatarsTile, 'hover'], ['Price tile', TickerTile, 'auto'],
    ['Map tile', MapTile, 'hover'], ['Quote tile', QuoteTile, 'click'], ['Image tile', ImageTile, 'hover'], ['Code tile', CodeTile, 'auto'],
    ['Command tile', CommandTile, 'auto'], ['Card tile', CardTile, 'hover'], ['Invoice tile', InvoiceTile, 'click'], ['Search tile', SearchTile, 'type'],
    ['Keys tile', KeysTile, 'keys'], ['Counter tile', CounterTile, 'click'], ['Rating tile', RatingTile, 'hover'], ['Load bars tile', LoadBars, 'auto'],
    ['Board tile', KanbanTile, 'click'], ['Countdown tile', CountdownTile, 'auto'], ['Weather tile', WeatherTile, 'hover'], ['Rings tile', ActivityRings, 'auto'],
    ['Heat tile', HeatTile, 'hover'], ['Cycle tile', CycleTile, 'auto'],
  ],
};
