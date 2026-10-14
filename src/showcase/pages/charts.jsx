import { useState } from 'react';
import { useDrag, useTick, rng, clamp } from '../hooks';
import c from './charts.module.css';

/* ============================================================
   07 · CHARTS — marks, bars, lines and areas.
   The still middle of the page is a plotter: a line is drawn down the screen as
   you scroll, two series, a crosshair and a dot per series — the dots and the
   numbers beside them come from the same sine sums the paths were drawn with, so
   CSS (sin, counters) and SVG agree without any script per frame.
   Every sample is generated from a seed, so a chart is the same on every render.
   ============================================================ */

/* ---- data and geometry helpers ---- */
const series = (n, seed, lo = 0.15, hi = 0.95) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => lo + r() * (hi - lo));
};
const smooth3 = (a) => a.map((v, i) => (v + (a[i - 1] ?? v) + (a[i + 1] ?? v)) / 3);
const f1 = (n) => +n.toFixed(1);
const pts = (v, w = 100, h = 50, top = 4) => v.map((y, i) => [f1((i * w) / (v.length - 1)), f1(h - y * (h - top))]);
const poly = (p) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
/* a smooth curve through the points (Catmull-Rom turned into cubic segments) */
const curve = (p) => p.reduce((d, [x, y], i) => {
  if (!i) return `M${x} ${y}`;
  const [x0, y0] = p[i - 2] || p[i - 1];
  const [x1, y1] = p[i - 1];
  const [x3, y3] = p[i + 1] || p[i];
  return `${d}C${f1(x1 + (x - x0) / 6)} ${f1(y1 + (y - y0) / 6)} ${f1(x - (x3 - x1) / 6)} ${f1(y - (y3 - y1) / 6)} ${x} ${y}`;
}, '');
const areaOf = (p, h = 50) => `${curve(p)}L${p[p.length - 1][0]} ${h}L${p[0][0]} ${h}Z`;
const polar = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [f1(cx + Math.sin(a) * r), f1(cy - Math.cos(a) * r)];
};
const sector = (cx, cy, r0, r1, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z`;
};
const pct = (v) => Math.round(v * 100);

/* moving a pointer across a chart picks the item under it; arrow keys do the same.
   `edges` (cumulative 0..1 boundaries) is for items of unequal width. */
function useScan(n, { axis = 'x', label, edges } = {}) {
  const [i, setI] = useState(-1);
  const at = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = clamp(axis === 'x' ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height, 0, 0.9999);
    setI(edges ? edges.findIndex((x) => v < x) : Math.floor(v * n));
  };
  const bind = {
    role: 'slider',
    tabIndex: 0,
    'aria-valuemin': 0,
    'aria-valuemax': n,
    'aria-valuenow': i + 1,
    'aria-valuetext': i < 0 ? 'nothing selected' : label(i),
    style: { touchAction: axis === 'x' ? 'pan-y' : 'pan-x' },
    onPointerMove: at,
    onPointerDown: at,
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setI(-1); },
    onBlur: () => setI(-1),
    onKeyDown: (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); setI((k) => clamp(k < 0 ? (d > 0 ? 0 : n - 1) : k + d, 0, n - 1)); }
      if (e.key === 'Escape') setI(-1);
    },
  };
  return [i, bind];
}

/* a list of names that lights the matching part of a chart */
function Legend({ items, hot, setHot, sticky = false, unit = '' }) {
  return (
    <ul className={c.legend}>
      {items.map(([name, value], i) => (
        <li key={name}>
          <button
            type="button"
            data-hot={hot === i}
            onPointerEnter={sticky ? undefined : () => setHot(i)}
            onPointerLeave={sticky ? undefined : () => setHot(-1)}
            onFocus={sticky ? undefined : () => setHot(i)}
            onBlur={sticky ? undefined : () => setHot(-1)}
            onClick={() => setHot(i)}
          >
            <b style={{ '--k': i }} />{name}{value !== undefined && <em>{value}{unit}</em>}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---- the plotter ---- */
const SAMPLES = 121;
const traceA = (t) => 50 + 28 * Math.sin(t * Math.PI * 6) + 10 * Math.sin(t * Math.PI * 14 + Math.PI / 3);
const traceB = (t) => 50 + 22 * Math.cos(t * Math.PI * 4) + 12 * Math.sin(t * Math.PI * 10 + Math.PI / 9);
const trace = (fn) => Array.from({ length: SAMPLES }, (_, k) => `${k ? 'L' : 'M'}${f1(fn(k / (SAMPLES - 1)))} ${f1((k / (SAMPLES - 1)) * 100)}`).join('');
const PLOT_A = trace(traceA);
const PLOT_B = trace(traceB);
const PLOT_FILL = `M0 0${PLOT_A.replace('M', 'L')}L0 100Z`;

function Visual() {
  return (
    <div className={c.plot} aria-hidden="true">
      <ol className={c.axisTop}><li>0</li><li>25</li><li>50</li><li>75</li><li>100</li></ol>
      <ol className={c.axisLeft}>{[0, 20, 40, 60, 80, 100].map((n) => <li key={n}>T+{String(n).padStart(3, '0')}</li>)}</ol>
      <div className={c.field}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className={c.fillA} d={PLOT_FILL} />
          <path className={c.lineB} d={PLOT_B} />
          <path className={c.lineA} d={PLOT_A} />
        </svg>
        <i className={c.cross} />
        <b className={c.dotB}><u className={c.vb} /></b>
        <b className={c.dotA}><u className={c.va} /></b>
        <p className={c.tmark}><span className={c.vt} /></p>
      </div>
    </div>
  );
}

/* 1 */ const COLS = series(8, 3);
function ColumnChart() {
  const [k, setK] = useState(5);
  return (
    <div className={c.cols} role="group" aria-label="Column chart">
      <div className={c.bars}>
        {COLS.map((v, i) => (
          <button key={i} type="button" className={c.cb} aria-label={`Column ${i + 1}: ${pct(v)}`} aria-pressed={k === i} style={{ '--v': v, '--i': i }} onClick={() => setK(i)}><i /></button>
        ))}
      </div>
      <output className={c.out}>Column {k + 1} · <b>{pct(COLS[k])}</b></output>
    </div>
  );
}

/* 2 */ const LINE = smooth3(series(24, 5, 0.2, 0.92));
const LINE_P = pts(LINE, 100, 50, 5);
function ScrubLine() {
  const [i, bind] = useScan(24, { label: (k) => `Point ${k + 1}: ${pct(LINE[k])}` });
  const on = i >= 0;
  return (
    <div className={c.ch} {...bind} aria-label="Scrub line, move across it to read values">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.ar} d={areaOf(LINE_P, 52)} />
        <path className={`${c.ln} ${c.red}`} d={curve(LINE_P)} />
        {on && <g><line className={c.hair} x1={LINE_P[i][0]} x2={LINE_P[i][0]} y1="0" y2="52" /><circle className={c.dot} cx={LINE_P[i][0]} cy={LINE_P[i][1]} r="1.8" /></g>}
      </svg>
      <output className={c.out}>{on ? <>Point {i + 1} · <b>{pct(LINE[i])}</b></> : 'Move across the line'}</output>
    </div>
  );
}

/* 3 */ const MORPH = [21, 22, 23].map((s) => pts(smooth3(series(10, s)), 100, 50, 5));
function MorphArea() {
  const [k, setK] = useState(0);
  const area = areaOf(MORPH[k], 52);
  const ln = curve(MORPH[k]);
  return (
    <button type="button" className={c.chBtn} aria-label={`Morph area, dataset ${k + 1} of 3. Click to change`} onClick={() => setK((k + 1) % 3)}>
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={`${c.ar} ${c.morph}`} d={area} style={{ d: `path("${area}")` }} />
        <path className={`${c.ln} ${c.red} ${c.morph}`} d={ln} style={{ d: `path("${ln}")` }} />
      </svg>
      <span className={c.out}>Series <b>{'ABC'[k]}</b></span>
    </button>
  );
}

/* 4 */ const STACK = [31, 32, 33, 34].map((s, k) => series(6, s, 0.08 + 0.02 * k, 0.34 - 0.04 * k));
const STACK_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta'];
function StackToggle() {
  const [off, setOff] = useState([false, false, false, false]);
  const flip = (k) => setOff((o) => o.map((x, j) => (j === k ? !x : x)));
  return (
    <div className={c.stackBox}>
      <div className={c.sb}>
        {Array.from({ length: 6 }, (_, j) => (
          <span key={j}>
            {STACK.map((s, k) => (
              <i key={k} style={{ '--k': k, '--h': off[k] ? 0 : s[j], '--b': STACK.slice(0, k).reduce((a, t, m) => a + (off[m] ? 0 : t[j]), 0) }} />
            ))}
          </span>
        ))}
      </div>
      <ul className={c.legend}>
        {STACK_NAMES.map((n, k) => (
          <li key={n}><button type="button" aria-pressed={!off[k]} onClick={() => flip(k)}><b style={{ '--k': k }} />{n}</button></li>
        ))}
      </ul>
    </div>
  );
}

/* 5 */ const DONUT = [['Apps', 34], ['Docs', 22], ['Media', 18], ['Other', 14], ['Free', 12]];
const DONUT_FROM = DONUT.map((_, i) => DONUT.slice(0, i).reduce((a, [, v]) => a + v, 0));
function DonutSlices() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.donut} data-hot={hot}>
      <div className={c.ring}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {DONUT.map(([n, v], i) => (
            <circle key={n} className={c.slice} data-hot={hot === i} style={{ '--k': i }} cx="50" cy="50" r="36" pathLength="100" strokeDasharray={`${v - 1.2} ${101.2 - v}`} strokeDashoffset={-DONUT_FROM[i]} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} />
          ))}
        </svg>
        <p><b>{hot < 0 ? 100 : DONUT[hot][1]}</b><i>{hot < 0 ? 'total' : DONUT[hot][0]}</i></p>
      </div>
      <Legend items={DONUT} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 6 */ const PIE = [['Mon', 24], ['Tue', 18], ['Wed', 22], ['Thu', 16], ['Fri', 20]];
const PIE_ARCS = (() => {
  let a = 0;
  return PIE.map(([, v]) => {
    const from = a * 3.6;
    a += v;
    const to = a * 3.6;
    const mid = (((from + to) / 2) * Math.PI) / 180;
    return { from, to, dx: +Math.sin(mid).toFixed(2), dy: +(-Math.cos(mid)).toFixed(2) };
  });
})();
function PullPie() {
  const [k, setK] = useState(2);
  return (
    <div className={c.pie}>
      <svg viewBox="-6 -6 112 112" aria-hidden="true">
        {PIE_ARCS.map((a, i) => (
          <path key={i} className={c.wedge} data-on={k === i} style={{ '--k': i, '--dx': a.dx, '--dy': a.dy }} d={`M50 50L${polar(50, 50, 44, a.from).join(' ')}A44 44 0 ${a.to - a.from > 180 ? 1 : 0} 1 ${polar(50, 50, 44, a.to).join(' ')}Z`} onClick={() => setK(i)} />
        ))}
      </svg>
      <Legend items={PIE} hot={k} setHot={setK} sticky unit="%" />
    </div>
  );
}

/* 7 */ const CANDLES = (() => {
  const r = rng(41);
  let p = 50;
  const raw = [];
  for (let i = 0; i < 16; i += 1) {
    const o = p;
    const cl = o + (r() - 0.46) * 16;
    raw.push({ o, cl, h: Math.max(o, cl) + r() * 6, l: Math.min(o, cl) - r() * 6 });
    p = cl;
  }
  const lo = Math.min(...raw.map((d) => d.l));
  const hi = Math.max(...raw.map((d) => d.h));
  const y = (v) => f1(48 - ((v - lo) / (hi - lo)) * 44);
  return raw.map((d, i) => ({ x: f1(3 + i * 6.2), hy: y(d.h), ly: y(d.l), oy: y(d.o), cy: y(d.cl), up: d.cl >= d.o, o: Math.round(d.o), cl: Math.round(d.cl) }));
})();
function Candlesticks() {
  const [i, bind] = useScan(16, { label: (k) => `Candle ${k + 1}: open ${CANDLES[k].o}, close ${CANDLES[k].cl}` });
  const d = CANDLES[i];
  return (
    <div className={c.ch} {...bind} aria-label="Candlesticks, move across them to read open and close">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {CANDLES.map((k, n) => (
          <g key={n} className={c.candle} data-up={k.up} data-hot={n === i}>
            <line x1={k.x} x2={k.x} y1={k.hy} y2={k.ly} />
            <rect x={k.x - 2} width="4" y={Math.min(k.oy, k.cy)} height={Math.max(Math.abs(k.oy - k.cy), 0.8)} />
          </g>
        ))}
      </svg>
      <output className={c.out}>{d ? <>Open <b>{d.o}</b> · Close <b>{d.cl}</b></> : 'Move across the candles'}</output>
    </div>
  );
}

/* 8 */ const HEAT = (() => {
  const r = rng(51);
  return Array.from({ length: 140 }, (_, k) => Math.min(4, Math.floor(r() * (0.4 + 0.6 * Math.sin((Math.floor(k / 7) / 20) * Math.PI)) * 5)));
})();
function CalendarHeat() {
  const [i, bind] = useScan(20, { label: (k) => `Week ${k + 1}` });
  const sum = i < 0 ? 0 : HEAT.slice(i * 7, i * 7 + 7).reduce((a, b) => a + b, 0);
  return (
    <div className={c.cal} {...bind} aria-label="Calendar heat, move across the weeks">
      <div className={c.calGrid}>{HEAT.map((v, k) => <i key={k} data-v={v} data-hot={Math.floor(k / 7) === i} />)}</div>
      <output className={c.out}>{i < 0 ? 'Move across the weeks' : <>Week {i + 1} · <b>{sum}</b> events</>}</output>
    </div>
  );
}

/* 9 */ const GAUSS = (() => {
  const r = rng(61);
  const g = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  return Array.from({ length: 260 }, (_, k) => clamp(k % 5 < 3 ? 32 + g() * 11 : 68 + g() * 9, 0, 99.9));
})();
function BinSlider() {
  const [v, bind] = useDrag({ init: 0.35 });
  const bins = 4 + Math.round(v * 20);
  const counts = Array(bins).fill(0);
  GAUSS.forEach((x) => { counts[Math.floor((x / 100) * bins)] += 1; });
  const max = Math.max(...counts);
  return (
    <div className={c.hist}>
      <div className={c.hbars}>{counts.map((n, i) => <i key={i} style={{ '--h': n / max }} />)}</div>
      <div className={c.slide} {...bind} aria-label="Number of bins" style={{ ...bind.style, '--v': v }}><i /></div>
      <output className={c.out}><b>{bins}</b> bins</output>
    </div>
  );
}

/* 10 */ const SCAT = (() => {
  const r = rng(71);
  return Array.from({ length: 36 }, () => {
    const x = r();
    return { x: f1(4 + x * 92), y: f1(46 - clamp(x * 0.7 + (r() - 0.5) * 0.5 + 0.1, 0, 1) * 42) };
  }).sort((a, b) => a.x - b.x);
})();
function ScatterField() {
  const [i, bind] = useScan(36, { label: (k) => `Point ${k + 1}` });
  const p = SCAT[i];
  return (
    <div className={c.ch} {...bind} aria-label="Scatter field, move across it to pick a point">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 2V50H98" />
        {p && <g className={c.hair}><line x1={p.x} x2={p.x} y1="2" y2="50" /><line x1="2" x2="98" y1={p.y} y2={p.y} /></g>}
        {SCAT.map((d, k) => <circle key={k} className={c.dot} data-hot={k === i} cx={d.x} cy={d.y} r={k === i ? 2.2 : 1.3} />)}
      </svg>
      <output className={c.out}>{p ? <>x <b>{Math.round(p.x)}</b> · y <b>{Math.round(((46 - p.y) / 42) * 100)}</b></> : 'Move across the field'}</output>
    </div>
  );
}

/* 11 */ const BUBBLES = [[14, 62, 9, 5.2], [34, 30, 14, 6.4], [58, 66, 11, 4.8], [78, 28, 7, 5.6], [88, 62, 12, 6], [48, 14, 6, 4.4], [22, 16, 5, 5], [70, 84, 8, 5.8], [40, 80, 5, 4.6]];
function BubbleField() {
  return (
    <div className={c.bubbles} role="img" aria-label="Bubbles drifting up and down">
      {BUBBLES.map(([x, y, s, d], i) => (
        <i key={i} data-red={i % 4 === 1} style={{ left: `${x}%`, top: `${y}%`, '--s': s, animationDuration: `${d}s`, animationDelay: `${-i * 0.7}s` }}>{s > 10 ? s : ''}</i>
      ))}
    </div>
  );
}

/* 12 */ const SPIDER = [[0.8, 0.6, 0.9, 0.5, 0.7, 0.4], [0.5, 0.85, 0.4, 0.8, 0.45, 0.75], [0.65, 0.65, 0.65, 0.9, 0.35, 0.55]];
const SPIDER_AX = ['Reach', 'Speed', 'Depth', 'Cost', 'Trust', 'Fit'];
const spiderPath = (v) => `${v.map((r, i) => `${i ? 'L' : 'M'}${polar(50, 50, 6 + r * 34, i * 60).join(' ')}`).join('')}Z`;
function SpiderChart() {
  const [k, setK] = useState(0);
  const d = spiderPath(SPIDER[k]);
  return (
    <button type="button" className={c.chBtn} aria-label={`Spider chart, dataset ${k + 1} of 3. Click to change`} onClick={() => setK((k + 1) % 3)}>
      <svg className={c.spider} viewBox="-14 -2 128 104" aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((s) => <path key={s} className={c.gr} d={spiderPath(Array(6).fill(s))} />)}
        {SPIDER_AX.map((n, i) => {
          const [x1, y1] = polar(50, 50, 40, i * 60);
          const [tx, ty] = polar(50, 50, 47, i * 60);
          return (
            <g key={n}>
              <line className={c.gr} x1="50" y1="50" x2={x1} y2={y1} />
              <text className={c.t} x={tx} y={ty} textAnchor={tx < 46 ? 'end' : tx > 54 ? 'start' : 'middle'} dominantBaseline="central">{n}</text>
            </g>
          );
        })}
        <path className={`${c.ar} ${c.redFill} ${c.morph}`} d={d} style={{ d: `path("${d}")` }} />
        <path className={`${c.ln} ${c.red} ${c.morph}`} d={d} style={{ d: `path("${d}")` }} />
      </svg>
    </button>
  );
}

/* 13 */ const TREE = [['Apps', 38, 0, 0, 38, 60], ['Media', 27, 38, 0, 27, 60], ['Docs', 35, 65, 0, 35, 60], ['Mail', 30, 0, 60, 30, 40], ['Cache', 22, 30, 60, 22, 40], ['Logs', 28, 52, 60, 28, 40], ['Misc', 20, 80, 60, 20, 40]];
function Treemap() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.tree} data-hot={hot}>
      {TREE.map(([n, v, x, y, w, h], i) => (
        <button key={n} type="button" data-hot={hot === i} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, '--k': i }} aria-label={`${n} ${v}`} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)} onClick={() => setHot(i)}>
          <span>{n}</span><em>{v}</em>
        </button>
      ))}
    </div>
  );
}

/* 14 */ const SUN = [['Apps', [14, 11, 9]], ['Docs', [12, 8]], ['Media', [16, 10, 6]], ['Other', [9, 5]]];
const SUN_ARCS = (() => {
  let a = 0;
  const cats = [];
  const kids = [];
  SUN.forEach(([n, ch], ci) => {
    const from = a;
    ch.forEach((v) => { kids.push({ ci, from: a * 3.6 + 0.6, to: (a + v) * 3.6 - 0.6 }); a += v; });
    cats.push({ n, from: from * 3.6 + 0.6, to: a * 3.6 - 0.6, v: a - from });
  });
  return { cats, kids };
})();
function Sunburst() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.sun} data-hot={hot}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {SUN_ARCS.cats.map((a, i) => <path key={a.n} data-hot={hot === i} style={{ '--k': i }} d={sector(50, 50, 16, 31, a.from, a.to)} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} />)}
        {SUN_ARCS.kids.map((a, i) => <path key={i} className={c.outer} data-hot={hot === a.ci} style={{ '--k': a.ci }} d={sector(50, 50, 33, 46, a.from, a.to)} />)}
      </svg>
      <Legend items={SUN_ARCS.cats.map((a) => [a.n, a.v])} hot={hot} setHot={setHot} unit="%" />
    </div>
  );
}

/* 15 */ const FUNNEL = [['Visit', 100], ['View', 72], ['Add', 48], ['Buy', 31], ['Keep', 19]];
function FunnelSteps() {
  const [k, setK] = useState(2);
  return (
    <button type="button" className={c.funnel} aria-label={`Funnel, step ${k + 1} of 5. Click for the next step`} onClick={() => setK((k + 1) % 5)}>
      <svg viewBox="0 0 100 60" aria-hidden="true">
        {FUNNEL.map(([n, v], i) => {
          const nx = FUNNEL[i + 1] ? FUNNEL[i + 1][1] : v * 0.7;
          const y = i * 12;
          return <polygon key={n} data-on={i === k} points={`${50 - v * 0.46},${y} ${50 + v * 0.46},${y} ${50 + nx * 0.46},${y + 11} ${50 - nx * 0.46},${y + 11}`} />;
        })}
      </svg>
      <span className={c.fl}>
        {FUNNEL.map(([n, v], i) => <span key={n} data-on={i === k}><i>{n}</i><b>{v}</b></span>)}
      </span>
    </button>
  );
}

/* 16 */ const WF = (() => {
  const steps = [['Start', 60], ['A', 18], ['B', -9], ['C', 14], ['D', -12], ['E', 7]];
  let run = 0;
  const out = [];
  steps.forEach(([n, d], i) => {
    const from = i === 0 ? 0 : run;
    run = i === 0 ? d : run + d;
    out.push({ n, from, to: run, kind: i === 0 ? 't' : d >= 0 ? 'u' : 'd' });
  });
  out.push({ n: 'End', from: 0, to: run, kind: 't' });
  const y = (v) => f1(48 - (v / 90) * 44);
  return out.map((b) => ({ ...b, y: y(Math.max(b.from, b.to)), h: f1(Math.abs(y(b.from) - y(b.to))) }));
})();
function Waterfall() {
  return (
    <div className={c.ch} role="img" aria-label="Waterfall chart building up bar by bar">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 48H98" />
        {WF.map((b, i) => <rect key={b.n} className={c.wf} data-kind={b.kind} style={{ '--i': i }} x={5 + i * 13} width="10" y={b.y} height={b.h} />)}
      </svg>
    </div>
  );
}

/* 17 */ const BOX = [[18, 30, 42, 58, 78], [26, 38, 50, 64, 82], [10, 24, 36, 50, 70], [30, 44, 56, 70, 90], [20, 34, 48, 60, 74]];
const by = (v) => f1(48 - (v / 100) * 44);
function BoxWhisker() {
  const [i, bind] = useScan(5, { label: (k) => `Group ${k + 1}, median ${BOX[k][2]}` });
  return (
    <div className={c.ch} {...bind} aria-label="Box and whisker, move across the groups">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 48H98" />
        {BOX.map(([lo, q1, md, q3, hi], k) => {
          const x = 10 + k * 20;
          return (
            <g key={k} className={c.box} data-hot={k === i}>
              <line x1={x} x2={x} y1={by(hi)} y2={by(lo)} />
              <rect x={x - 6} width="12" y={by(q3)} height={f1(by(q1) - by(q3))} />
              <line className={c.med} x1={x - 6} x2={x + 6} y1={by(md)} y2={by(md)} />
            </g>
          );
        })}
      </svg>
      <output className={c.out}>{i < 0 ? 'Move across the groups' : <>Group {i + 1} · median <b>{BOX[i][2]}</b></>}</output>
    </div>
  );
}

/* 18 */ const RIDGE = Array.from({ length: 8 }, (_, k) => {
  const r = rng(90 + k);
  const p = Array.from({ length: 21 }, (_, j) => {
    const x = j / 20;
    const v = Math.exp(-(((x - (0.25 + r() * 0.5)) / 0.12) ** 2)) * (0.5 + r() * 0.5) + Math.exp(-(((x - (0.2 + r() * 0.6)) / 0.18) ** 2)) * 0.35 + r() * 0.05;
    return [f1(x * 100), f1(12 - v * 11)];
  });
  return `${curve(p)}L100 12L0 12Z`;
});
function Ridgeline() {
  return (
    <div className={c.ch} role="img" aria-label="Ridgeline plot with breathing ridges">
      <svg viewBox="0 0 100 60" aria-hidden="true">
        {RIDGE.map((d, k) => <g key={k} transform={`translate(0 ${k * 6})`}><path className={c.ridge} style={{ animationDelay: `${-k * 0.7}s` }} d={d} /></g>)}
      </svg>
    </div>
  );
}

/* 19 */ const GANTT = [['Plan', 0, 24], ['Draft', 12, 44], ['Build', 30, 78], ['Test', 58, 90], ['Ship', 82, 98]];
function GanttStrips() {
  const [i, bind] = useScan(5, { axis: 'y', label: (k) => `${GANTT[k][0]}, day ${GANTT[k][1]} to ${GANTT[k][2]}` });
  return (
    <div className={c.gantt} {...bind} aria-label="Gantt strips, move down the rows">
      {GANTT.map(([n, a, b], k) => (
        <p key={n} data-hot={k === i}><em>{n}</em><span><i style={{ left: `${a}%`, width: `${b - a}%` }} /></span><b>{b - a}d</b></p>
      ))}
    </div>
  );
}

/* 20 */ const LOLLI = series(10, 101, 0.2, 0.95);
function Lollipop() {
  const [i, bind] = useScan(10, { label: (k) => `Item ${k + 1}: ${pct(LOLLI[k])}` });
  return (
    <div className={c.ch} {...bind} aria-label="Lollipop chart, move across the stems">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 48H98" />
        {LOLLI.map((v, k) => {
          const x = 7 + k * 9.6;
          const y = f1(48 - v * 42);
          return <g key={k} className={c.pop} data-hot={k === i}><line x1={x} x2={x} y1="48" y2={y} /><circle cx={x} cy={y} r="2.4" /></g>;
        })}
      </svg>
      <output className={c.out}>{i < 0 ? 'Move across the stems' : <>Item {i + 1} · <b>{pct(LOLLI[i])}</b></>}</output>
    </div>
  );
}

/* 21 */ const DUMB = [[22, 61], [35, 52], [18, 74], [44, 49], [28, 83], [51, 68]];
function Dumbbell() {
  const [i, bind] = useScan(6, { axis: 'y', label: (k) => `Row ${k + 1}: ${DUMB[k][0]} to ${DUMB[k][1]}` });
  return (
    <div className={c.ch} {...bind} aria-label="Dumbbell dots, move down the rows">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {DUMB.map(([a, b], k) => {
          const y = 5 + k * 8.4;
          return <g key={k} className={c.dumb} data-hot={k === i}><line className={c.hair} x1="4" x2="96" y1={y} y2={y} /><line x1={a} x2={b} y1={y} y2={y} /><circle cx={a} cy={y} r="2" /><circle className={c.end} cx={b} cy={y} r="2" /></g>;
        })}
      </svg>
      <output className={c.out}>{i < 0 ? 'Move down the rows' : <><b>{DUMB[i][0]}</b> → <b>{DUMB[i][1]}</b></>}</output>
    </div>
  );
}

/* 22 */ const SLOPE = [[40, 62], [55, 48], [30, 71], [68, 52], [47, 33], [22, 38]];
function SlopeLines() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={c.chBtn} aria-label={`Slope lines, line ${k + 1} of 6 highlighted. Click for the next`} onClick={() => setK((k + 1) % 6)}>
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M20 2V50M80 2V50" />
        <text className={c.t} x="20" y="-0.5" textAnchor="middle">2024</text>
        <text className={c.t} x="80" y="-0.5" textAnchor="middle">2025</text>
        {SLOPE.map(([a, b], i) => <line key={i} className={c.slope} data-on={i === k} x1="20" x2="80" y1={f1(48 - a * 0.56)} y2={f1(48 - b * 0.56)} />)}
        {SLOPE.map(([a, b], i) => <g key={i} className={c.slopeDots} data-on={i === k}><circle cx="20" cy={f1(48 - a * 0.56)} r="1.5" /><circle cx="80" cy={f1(48 - b * 0.56)} r="1.5" /></g>)}
      </svg>
      <span className={c.out}>Line <b>{k + 1}</b> · {SLOPE[k][0]} → {SLOPE[k][1]}</span>
    </button>
  );
}

/* 23 */ const FLOW = [[20, 14, 6], [6, 22, 7], [4, 9, 12]];
const FLOW_BANDS = (() => {
  const s = 0.46;
  const gap = 3;
  const src = [0, 1, 2].map((i) => FLOW[i].reduce((a, b) => a + b, 0));
  const dst = [0, 1, 2].map((j) => FLOW.reduce((a, row) => a + row[j], 0));
  const top = (arr, i) => arr.slice(0, i).reduce((a, b) => a + b * s + gap, 0);
  const out = [];
  const used = [0, 0, 0];
  FLOW.forEach((row, i) => {
    let off = 0;
    row.forEach((v, j) => {
      const y0 = top(src, i) + off + (v * s) / 2;
      const y1 = top(dst, j) + used[j] + (v * s) / 2;
      off += v * s;
      used[j] += v * s;
      out.push({ i, j, v, w: f1(v * s), d: `M7 ${f1(y0)}C50 ${f1(y0)} 50 ${f1(y1)} 93 ${f1(y1)}` });
    });
  });
  return { out, src, dst, top: (i) => top(src, i), topD: (j) => top(dst, j), s };
})();
function FlowBands() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.flow} data-hot={hot}>
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {FLOW_BANDS.out.map((b) => <path key={`${b.i}${b.j}`} className={c.band} data-hot={hot === b.i} style={{ strokeWidth: b.w }} d={b.d} />)}
        {FLOW_BANDS.src.map((v, i) => <rect key={i} className={c.node} x="3" width="4" y={FLOW_BANDS.top(i)} height={f1(v * FLOW_BANDS.s)} />)}
        {FLOW_BANDS.dst.map((v, j) => <rect key={j} className={c.node} x="93" width="4" y={FLOW_BANDS.topD(j)} height={f1(v * FLOW_BANDS.s)} />)}
      </svg>
      <Legend items={[['Source A'], ['Source B'], ['Source C']]} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 24 */ const CHORD_EDGES = [[0, 2, 5], [0, 3, 3], [1, 4, 6], [2, 5, 4], [1, 3, 2], [4, 5, 3], [0, 1, 2]];
function ChordRing() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.chord} data-hot={hot}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={c.gr} cx="50" cy="50" r="40" />
        {CHORD_EDGES.map(([a, b, w], i) => {
          const [x1, y1] = polar(50, 50, 40, a * 60);
          const [x2, y2] = polar(50, 50, 40, b * 60);
          return <path key={i} className={c.chordEdge} data-hot={hot === a || hot === b} style={{ strokeWidth: w * 0.6 }} d={`M${x1} ${y1}Q50 50 ${x2} ${y2}`} />;
        })}
        {Array.from({ length: 6 }, (_, k) => <path key={k} className={c.chordNode} data-hot={hot === k} d={sector(50, 50, 41.5, 45, k * 60 - 8, k * 60 + 8)} />)}
      </svg>
      <Legend items={[['N1'], ['N2'], ['N3'], ['N4'], ['N5'], ['N6']]} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 25 */ const BUMP = [[1, 2, 2, 3, 4, 3], [2, 1, 3, 2, 1, 1], [3, 3, 1, 1, 2, 2], [4, 4, 4, 5, 3, 4], [5, 5, 5, 4, 5, 5]];
const BUMP_NAMES = ['Ash', 'Birch', 'Cedar', 'Dune', 'Elm'];
const BUMP_P = BUMP.map((row) => row.map((r, j) => [f1(8 + j * 17.6), f1(5 + (r - 1) * 10.5)]));
function BumpLines() {
  const [hot, setHot] = useState(1);
  return (
    <div className={c.bump}>
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {BUMP_P.map((p, k) => <g key={k} className={c.bumpLine} data-hot={hot === k}><path d={curve(p)} />{p.map(([x, y], j) => <circle key={j} cx={x} cy={y} r="1.5" />)}</g>)}
      </svg>
      <Legend items={BUMP_NAMES.map((n) => [n])} hot={hot} setHot={setHot} sticky />
    </div>
  );
}

/* 26 */ const STEP = (() => {
  const v = series(14, 111, 0.2, 0.95);
  let d = `M2 ${f1(48 - v[0] * 42)}`;
  v.forEach((y, i) => { d += `H${f1(2 + (i * 96) / 13)}V${f1(48 - y * 42)}`; });
  return `${d}H98`;
})();
function StepPlot() {
  return (
    <div className={c.ch} role="img" aria-label="A step line drawing itself">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 2V50H98" />
        <path className={c.ghost} d={STEP} />
        <path className={c.draw} d={STEP} pathLength="1" />
      </svg>
    </div>
  );
}

/* 27 */ const stream = (seed) => {
  const layers = Array.from({ length: 5 }, (_, k) => smooth3(smooth3(series(12, seed + k * 7, 0.2, 1))));
  const total = layers[0].map((_, j) => layers.reduce((a, l) => a + l[j], 0));
  const xs = (j) => f1((j * 100) / 11);
  const k = 34 / Math.max(...total);
  return layers.map((l, n) => {
    const top = l.map((_, j) => [xs(j), f1(26 - (total[j] * k) / 2 + layers.slice(0, n + 1).reduce((a, m) => a + m[j], 0) * k)]);
    const bottom = l.map((_, j) => [xs(j), f1(26 - (total[j] * k) / 2 + layers.slice(0, n).reduce((a, m) => a + m[j], 0) * k)]).reverse();
    return `${curve(top)}L${curve(bottom).slice(1)}Z`;
  });
};
const STREAMS = [stream(7), stream(19)];
function StreamGraph() {
  const set = useTick(3400) % 2;
  return (
    <div className={c.ch} role="img" aria-label="A stream graph slowly changing shape">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {STREAMS[set].map((d, k) => <path key={k} className={`${c.layer} ${c.morph}`} data-k={k} d={STREAMS[0][k]} style={{ d: `path("${d}")` }} />)}
      </svg>
    </div>
  );
}

/* 28 */ const HORIZON = [121, 122, 123].map((seed) => {
  const v = smooth3(series(20, seed, 0, 1));
  v.push(v[0]);
  const p = pts(v, 100, 12, -24);
  const all = [...p, ...p.map(([x, y]) => [f1(x + 100), y]).slice(1)];
  return `${curve(all)}L200 12L0 12Z`;
});
function HorizonStrip() {
  return (
    <div className={c.horizon} role="img" aria-label="Three horizon strips scrolling sideways">
      {HORIZON.map((d, r) => (
        <svg key={r} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
          <g className={c.pan} style={{ animationDuration: `${9 + r * 3}s` }}>
            {[0, 1, 2].map((b) => <path key={b} data-b={b} d={d} transform={`translate(0 ${b * 12})`} />)}
          </g>
        </svg>
      ))}
    </div>
  );
}

/* 29 */ const MOSAIC = [[30, [50, 30, 20]], [22, [40, 40, 20]], [18, [60, 25, 15]], [16, [30, 50, 20]], [14, [45, 35, 20]]];
const MOSAIC_EDGES = MOSAIC.map((_, i) => MOSAIC.slice(0, i + 1).reduce((a, [w]) => a + w, 0) / 100);
function MosaicColumns() {
  const [i, bind] = useScan(5, { edges: MOSAIC_EDGES, label: (k) => `Column ${k + 1}, width ${MOSAIC[k][0]}` });
  return (
    <div className={c.ch} {...bind} aria-label="Mosaic columns, move across them">
      <div className={c.mosaic}>
        {MOSAIC.map(([w, parts], k) => (
          <span key={k} data-hot={k === i} style={{ flexBasis: `${w}%` }}>
            {parts.map((h, j) => <i key={j} style={{ flexBasis: `${h}%`, '--k': j }} />)}
          </span>
        ))}
      </div>
      <output className={c.out}>{i < 0 ? 'Move across the columns' : <>Column {i + 1} · width <b>{MOSAIC[i][0]}</b></>}</output>
    </div>
  );
}

/* 30 */ const PYR = [[4, 5], [9, 8], [14, 13], [19, 18], [16, 17], [11, 13], [6, 9]];
const PYR_AGE = ['0–9', '10–19', '20–29', '30–39', '40–49', '50–59', '60+'];
function PyramidBars() {
  const [i, bind] = useScan(7, { axis: 'y', label: (k) => `${PYR_AGE[k]}: ${PYR[k][0]} and ${PYR[k][1]}` });
  return (
    <div className={c.pyr} {...bind} aria-label="Pyramid bars, move down the rows">
      {PYR.map(([l, r], k) => (
        <p key={k} data-hot={k === i}><span><i style={{ width: `${l * 5}%` }} /></span><em>{PYR_AGE[k]}</em><span><i style={{ width: `${r * 5}%` }} /></span></p>
      ))}
    </div>
  );
}

/* 31 */ const fmt = (n) => (Math.round(n * 100) / 100).toString().replace(/^0\./, '.');
function EasingCurve() {
  const [p, setP] = useState({ a: [0.25, 0.1], b: [0.25, 1] });
  const move = (key, e) => {
    if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
    const r = e.currentTarget.parentElement.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width);
    const y = clamp(1.2 - ((e.clientY - r.top) / r.height) * 1.4, -0.2, 1.2);
    setP((q) => ({ ...q, [key]: [Math.round(x * 100) / 100, Math.round(y * 100) / 100] }));
  };
  const nudge = (key, e) => {
    const d = { ArrowLeft: [-0.05, 0], ArrowRight: [0.05, 0], ArrowUp: [0, 0.05], ArrowDown: [0, -0.05] }[e.key];
    if (!d) return;
    e.preventDefault();
    setP((q) => ({ ...q, [key]: [clamp(q[key][0] + d[0]), clamp(q[key][1] + d[1], -0.2, 1.2)].map((n) => Math.round(n * 100) / 100) }));
  };
  const Y = (y) => f1(((1.2 - y) / 1.4) * 100);
  const css = `cubic-bezier(${fmt(p.a[0])}, ${fmt(p.a[1])}, ${fmt(p.b[0])}, ${fmt(p.b[1])})`;
  return (
    <div className={c.easeWrap} style={{ '--ease': `cubic-bezier(${p.a[0]},${p.a[1]},${p.b[0]},${p.b[1]})` }}>
      <div className={c.ease}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className={c.gr} d={`M0 ${Y(0)}H100M0 ${Y(1)}H100`} />
          <path className={c.hair} d={`M0 ${Y(0)}L${p.a[0] * 100} ${Y(p.a[1])}M100 ${Y(1)}L${p.b[0] * 100} ${Y(p.b[1])}`} />
          <path className={`${c.ln} ${c.red}`} vectorEffect="non-scaling-stroke" d={`M0 ${Y(0)}C${p.a[0] * 100} ${Y(p.a[1])} ${p.b[0] * 100} ${Y(p.b[1])} 100 ${Y(1)}`} />
        </svg>
        {['a', 'b'].map((key, n) => (
          <button key={key} type="button" className={c.handle} aria-label={`Control point ${n + 1}, arrow keys or drag`} style={{ left: `${p[key][0] * 100}%`, top: `${Y(p[key][1])}%` }}
            onPointerDown={(e) => e.currentTarget.setPointerCapture?.(e.pointerId)} onPointerMove={(e) => move(key, e)} onKeyDown={(e) => nudge(key, e)} />
        ))}
      </div>
      <span className={c.ball}><i /></span>
      <output className={c.out}>{css}</output>
    </div>
  );
}

/* 32 */ const ERR = series(7, 161, 0.3, 0.85).map((v, i) => ({ v, e: 0.05 + ((i * 37) % 11) / 100 }));
function ErrorBars() {
  const [i, bind] = useScan(7, { label: (k) => `Point ${k + 1}: ${pct(ERR[k].v)} give or take ${pct(ERR[k].e)}` });
  return (
    <div className={c.ch} {...bind} aria-label="Error bars, move across the points">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 48H98" />
        <path className={c.ln} d={poly(ERR.map((d, k) => [f1(8 + k * 14), f1(48 - d.v * 42)]))} />
        {ERR.map((d, k) => {
          const x = 8 + k * 14;
          const y = 48 - d.v * 42;
          const h = d.e * 42;
          return <g key={k} className={c.err} data-hot={k === i}><line x1={x} x2={x} y1={f1(y - h)} y2={f1(y + h)} /><line x1={x - 2} x2={x + 2} y1={f1(y - h)} y2={f1(y - h)} /><line x1={x - 2} x2={x + 2} y1={f1(y + h)} y2={f1(y + h)} /><circle cx={x} cy={f1(y)} r="1.8" /></g>;
        })}
      </svg>
      <output className={c.out}>{i < 0 ? 'Move across the points' : <><b>{pct(ERR[i].v)}</b> ± {pct(ERR[i].e)}</>}</output>
    </div>
  );
}

/* 33 */ const PAR = Array.from({ length: 5 }, (_, k) => series(5, 171 + k, 0.1, 0.95).map((v, j) => [f1(8 + j * 21), f1(46 - v * 40)]));
const PAR_NAMES = ['Line A', 'Line B', 'Line C', 'Line D', 'Line E'];
function ParallelLines() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.par} data-hot={hot}>
      <svg viewBox="0 0 100 52" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((j) => <line key={j} className={c.axis} x1={8 + j * 21} x2={8 + j * 21} y1="4" y2="48" />)}
        {PAR.map((p, k) => <path key={k} className={c.parLine} data-hot={hot === k} d={poly(p)} />)}
      </svg>
      <Legend items={PAR_NAMES.map((n) => [n])} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 34 */ const UNITS = [['Row A', 7], ['Row B', 5], ['Row C', 9], ['Row D', 3]];
function UnitIcons() {
  const [i, bind] = useScan(4, { axis: 'y', label: (k) => `${UNITS[k][0]}: ${UNITS[k][1]} of 10` });
  return (
    <div className={c.units} {...bind} aria-label="Unit icons, move down the rows">
      {UNITS.map(([n, v], k) => (
        <p key={n} data-hot={k === i}><em>{n}</em><span>{Array.from({ length: 10 }, (_, j) => <i key={j} data-on={j < v} />)}</span><b>{v}</b></p>
      ))}
    </div>
  );
}

/* 35 */ const SPARK = [['Alpha', 181], ['Beta', 182], ['Gamma', 183], ['Delta', 184], ['Epsilon', 185]].map(([n, s]) => {
  const v = smooth3(series(12, s, 0.1, 0.95));
  return { n, d: curve(pts(v, 40, 12, 1)), delta: Math.round((v[11] - v[0]) * 100) };
});
function SparkTable() {
  const [i, bind] = useScan(5, { axis: 'y', label: (k) => `${SPARK[k].n}: ${SPARK[k].delta} points` });
  return (
    <div className={c.spark} {...bind} aria-label="Spark table, move down the rows">
      {SPARK.map((r, k) => (
        <p key={r.n} data-hot={k === i} data-up={r.delta >= 0}><em>{r.n}</em><svg viewBox="0 0 40 12" aria-hidden="true"><path d={r.d} /></svg><b>{r.delta > 0 ? '+' : ''}{r.delta}</b></p>
      ))}
    </div>
  );
}

/* 36 */ const TL = pts(smooth3(series(20, 131, 0.1, 0.95)), 100, 52, 3);
const TL_D = curve(TL);
const TL_A = `${TL_D}L100 52L0 52Z`;
function ThresholdLine() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.55 });
  return (
    <div className={c.thr} {...bind} aria-label="Threshold line, drag up or down" style={{ ...bind.style, '--v': v }}>
      <svg className={c.thrLow} viewBox="0 0 100 52" aria-hidden="true"><path className={c.ar} d={TL_A} /><path className={c.ln} d={TL_D} /></svg>
      <svg className={c.thrHigh} viewBox="0 0 100 52" aria-hidden="true"><path className={`${c.ar} ${c.redFill}`} d={TL_A} /><path className={`${c.ln} ${c.red}`} d={TL_D} /></svg>
      <i /><output className={c.out}>Limit <b>{pct(v)}</b></output>
    </div>
  );
}

/* 37 */ const BR_D = curve(pts(smooth3(smooth3(smooth3(series(60, 141, 0.05, 1)))), 100, 40, 3));
const BRUSH = 0.25;
function BrushWindow() {
  const [v, bind] = useDrag({ init: 0.4 });
  const start = v * (1 - BRUSH);
  return (
    <div className={c.brush}>
      <div className={c.main}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <g style={{ transform: `scaleX(${1 / BRUSH}) translateX(${-start * 100}px)` }}><path className={`${c.ln} ${c.red} ${c.nonScaling}`} d={BR_D} /></g>
        </svg>
      </div>
      <div className={c.over} {...bind} aria-label="Brush window, drag to move" style={{ ...bind.style, '--s': start, '--w': BRUSH }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path className={`${c.ln} ${c.nonScaling}`} d={BR_D} /></svg>
        <i />
      </div>
    </div>
  );
}

/* 38 */ const BL_BARS = series(8, 151, 0.2, 0.9);
const BL_LINE = series(8, 152, 0.2, 0.9);
function BarsAndLine() {
  const [i, bind] = useScan(8, { label: (k) => `Month ${k + 1}: bar ${pct(BL_BARS[k])}, line ${pct(BL_LINE[k])}` });
  const lp = BL_LINE.map((v, k) => [f1(7 + k * 12.3), f1(48 - v * 42)]);
  return (
    <div className={c.ch} {...bind} aria-label="Bars and line, move across the months">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.axis} d="M2 48H98" />
        {BL_BARS.map((v, k) => <rect key={k} className={c.blBar} data-hot={k === i} x={f1(3 + k * 12.3)} width="8" y={f1(48 - v * 42)} height={f1(v * 42)} />)}
        <path className={`${c.ln} ${c.red}`} d={curve(lp)} />
        {lp.map(([x, y], k) => <circle key={k} className={c.dot} data-hot={k === i} cx={x} cy={y} r="1.5" />)}
      </svg>
      <output className={c.out}>{i < 0 ? 'Move across the months' : <>Bar <b>{pct(BL_BARS[i])}</b> · Line <b>{pct(BL_LINE[i])}</b></>}</output>
    </div>
  );
}

/* 39 */ const SPIRAL = Array.from({ length: 70 }, (_, k) => {
  const [x, y] = polar(50, 50, 5 + k * 0.58, k * 21);
  return { x, y, s: f1(0.8 + ((Math.sin(k * 0.9) + 1) / 2) * 2.2), red: k % 11 === 0 };
});
function SpiralPlot() {
  return (
    <div className={c.spiral} role="img" aria-label="A spiral of dots turning slowly">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <g className={c.turn}>{SPIRAL.map((d, k) => <circle key={k} data-red={d.red} cx={d.x} cy={d.y} r={d.s} />)}</g>
      </svg>
    </div>
  );
}

/* 40 */ const NOTE_LINE = pts(smooth3(series(24, 191, 0.2, 0.9)), 100, 50, 6);
const NOTES = [[4, 'Launch'], [11, 'Spike'], [19, 'Fix']];
function AnnotatedLine() {
  const [i, bind] = useScan(24, { label: (k) => `Point ${k + 1}${NOTES.find(([n]) => n === k) ? `, ${NOTES.find(([n]) => n === k)[1]}` : ''}` });
  const note = NOTES.find(([n]) => Math.abs(n - i) <= 1);
  return (
    <div className={c.ch} {...bind} aria-label="Annotated line, move across it to read the notes">
      <svg viewBox="0 0 100 52" aria-hidden="true">
        <path className={c.ar} d={areaOf(NOTE_LINE, 52)} />
        <path className={`${c.ln} ${c.red}`} d={curve(NOTE_LINE)} />
        {NOTES.map(([n, t]) => <g key={n} className={c.flag} data-hot={note?.[0] === n}><line x1={NOTE_LINE[n][0]} x2={NOTE_LINE[n][0]} y1={NOTE_LINE[n][1]} y2="2" /><circle cx={NOTE_LINE[n][0]} cy={NOTE_LINE[n][1]} r="1.7" /><text className={c.t} x={NOTE_LINE[n][0]} y="0" textAnchor="middle">{t}</text></g>)}
      </svg>
      <output className={c.out}>{note ? <>Note · <b>{note[1]}</b></> : 'Move across the line'}</output>
    </div>
  );
}

/* 41 */ const PACK = [['Core', 24, 31, 22], ['Edge', 64, 24, 17], ['Mail', 86, 42, 11], ['Docs', 50, 52, 11], ['Logs', 12, 57, 5], ['Tmp', 72, 55, 8], ['Misc', 92, 14, 7]];
function CirclePack() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.pack} data-hot={hot}>
      {PACK.map(([n, x, y, r], i) => (
        <button key={n} type="button" data-hot={hot === i} aria-label={`${n}, size ${r}`} style={{ '--cx': x, '--cy': y, '--r': r }} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)} onClick={() => setHot(i)}>
          {r > 8 && <span>{n}</span>}
        </button>
      ))}
    </div>
  );
}

/* 42 */ const DIV = [-42, 18, 64, -12, 36, -58, 27];
function DivergingBars() {
  const [i, bind] = useScan(7, { axis: 'y', label: (k) => `Row ${k + 1}: ${DIV[k]}` });
  return (
    <div className={c.div} {...bind} aria-label="Diverging bars, move down the rows">
      {DIV.map((v, k) => (
        <p key={k} data-hot={k === i} data-neg={v < 0}><span><i style={{ '--v': Math.abs(v) / 64 }} /></span><b>{v > 0 ? '+' : ''}{v}</b></p>
      ))}
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Column chart', ColumnChart, 'click'], ['Scrub line', ScrubLine, 'hover'], ['Morph area', MorphArea, 'click'], ['Stack toggle', StackToggle, 'click'],
    ['Donut slices', DonutSlices, 'hover'], ['Pull-out pie', PullPie, 'click'], ['Candlesticks', Candlesticks, 'hover'], ['Calendar heat', CalendarHeat, 'hover'],
    ['Bin slider', BinSlider, 'drag'], ['Scatter field', ScatterField, 'hover'], ['Bubble field', BubbleField, 'auto'], ['Spider chart', SpiderChart, 'click'],
    ['Treemap', Treemap, 'hover'], ['Sunburst', Sunburst, 'hover'], ['Funnel steps', FunnelSteps, 'click'], ['Waterfall', Waterfall, 'auto'],
    ['Box and whisker', BoxWhisker, 'hover'], ['Ridgeline', Ridgeline, 'auto'], ['Gantt strips', GanttStrips, 'hover'], ['Lollipop chart', Lollipop, 'hover'],
    ['Dumbbell dots', Dumbbell, 'hover'], ['Slope lines', SlopeLines, 'click'], ['Flow bands', FlowBands, 'hover'], ['Chord ring', ChordRing, 'hover'],
    ['Bump lines', BumpLines, 'click'], ['Step plot', StepPlot, 'auto'], ['Stream graph', StreamGraph, 'auto'], ['Horizon strip', HorizonStrip, 'auto'],
    ['Mosaic columns', MosaicColumns, 'hover'], ['Pyramid bars', PyramidBars, 'hover'], ['Easing curve', EasingCurve, 'drag'], ['Error bars', ErrorBars, 'hover'],
    ['Parallel lines', ParallelLines, 'hover'], ['Unit icons', UnitIcons, 'hover'], ['Spark table', SparkTable, 'hover'], ['Threshold line', ThresholdLine, 'drag'],
    ['Brush window', BrushWindow, 'drag'], ['Bars and line', BarsAndLine, 'hover'], ['Spiral plot', SpiralPlot, 'auto'], ['Annotated line', AnnotatedLine, 'hover'],
    ['Circle pack', CirclePack, 'hover'], ['Diverging bars', DivergingBars, 'hover'],
  ],
};
