import { useEffect, useState } from 'react';
import { useDrag, useLive, useTick, clamp, pad2 } from '../hooks';
import { useCell, useHot, polar, f1 } from '../kit';
import c from './figures.module.css';

/* ============================================================
   09 · FIGURES — numerals that roll, flip and settle.
   One specimen fills the right of the screen at a time, cut in by a moving edge.
   On the left, two odometers read the scroll itself: the big one counts which
   specimen you are on, the small one how far down the page you are. They are
   rolling reels of digits moved by CSS (round / mod on the scroll number), with
   the carry behaving like a real odometer: a digit only turns over while the
   one beside it is passing nine.
   ============================================================ */

const strip = (len) => Array.from({ length: len }, (_, i) => i % 10);
function Reel({ cls, len = 11 }) {
  return <span className={`${c.reel} ${cls}`}><b>{strip(len).map((d, i) => <i key={i}>{d}</i>)}</b></span>;
}

function Visual() {
  return (
    <div className={c.stack} aria-hidden="true">
      <p className={c.cap}>specimen</p>
      <div className={c.big}><Reel cls={c.tens} len={6} /><Reel cls={c.ones} /></div>
      <p className={c.of}>of 42</p>
      <div className={c.pct}><Reel cls={c.pH} len={3} /><Reel cls={c.pT} /><Reel cls={c.pO} /><span>%</span></div>
      <p className={c.cap}>of the way down</p>
    </div>
  );
}

/* ---- little helpers ---- */
const hms = (s) => [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
const digitsOf = (h, m) => [Math.floor(h / 10), h % 10, Math.floor(m / 10), m % 10];

/* 1 */ const clockAt = (n) => { const m = (9 * 60 + 41 + n) % 1440; return [Math.floor(m / 60), m % 60]; };
function FlipDigit({ cur, prev }) {
  return (
    <div className={c.flipDigit}>
      <div key={cur} className={c.fi}>
        <span className={c.fTop}><b>{cur}</b></span>
        <span className={c.fBotOld}><b>{prev}</b></span>
        <span className={c.fLeafTop}><b>{prev}</b></span>
        <span className={c.fLeafBot}><b>{cur}</b></span>
        <span className={c.fBotNew}><b>{cur}</b></span>
      </div>
    </div>
  );
}
function FlipClock() {
  const n = useTick(1400);
  const now = clockAt(n);
  const d = digitsOf(...now);
  const p = digitsOf(...clockAt(Math.max(0, n - 1)));
  return (
    <div className={c.fig} role="img" aria-label={`Flip clock showing ${pad2(now[0])}:${pad2(now[1])}`}>
      <div className={c.flipClock}>
        <FlipDigit cur={d[0]} prev={p[0]} /><FlipDigit cur={d[1]} prev={p[1]} />
        <b>:</b>
        <FlipDigit cur={d[2]} prev={p[2]} /><FlipDigit cur={d[3]} prev={p[3]} />
      </div>
    </div>
  );
}

/* 2 */ function MileageReel() {
  return (
    <div className={c.fig} role="img" aria-label="An odometer rolling forward">
      <div className={c.mileBox}>
        {[4, 3, 2, 1, 0].map((k) => (
          <span key={k} className={`${c.reel} ${k ? c.mileK : c.mile0}`} style={{ '--p10': 10 ** k }}><b>{strip(11).map((d, i) => <i key={i}>{d}</i>)}</b></span>
        ))}
        <small>km</small>
      </div>
    </div>
  );
}

/* 3 */ const COUNT_TARGETS = [8421, 120, 99999, 0, 4096];
function EasedCount() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={c.countBtn} style={{ '--cv': COUNT_TARGETS[k] }} aria-label="Eased count, click for another number" onClick={() => setK((k + 1) % COUNT_TARGETS.length)}>
      <b className={c.cv} />
      <i><u /></i>
    </button>
  );
}

/* 4 */ function CountdownRing() {
  const [run, setRun] = useState(0);
  return (
    <button type="button" className={c.cdBtn} aria-label="Ten second countdown, click to start it over" onClick={() => setRun(run + 1)}>
      <span key={run} className={c.cd} data-run={run > 0}>
        <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" /><circle className={c.cdRun} cx="50" cy="50" r="44" pathLength="1" /></svg>
        <b className={c.cdn} />
      </span>
      <em>{run ? 'click to restart' : 'click to start'}</em>
    </button>
  );
}

/* 5 */ function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [on, setOn] = useState(false);
  const live = useLive();
  useEffect(() => {
    if (!on || !live) return undefined;
    const id = window.setInterval(() => setMs((m) => m + 50), 50);
    return () => window.clearInterval(id);
  }, [on, live]);
  return (
    <div className={c.fig}>
      <output className={c.watch}>{pad2(Math.floor(ms / 60000))}:{pad2(Math.floor(ms / 1000) % 60)}<small>.{pad2(Math.floor(ms / 10) % 100)}</small></output>
      <div className={c.pair}>
        <button type="button" aria-pressed={on} onClick={() => setOn(!on)}>{on ? 'Stop' : 'Start'}</button>
        <button type="button" onClick={() => { setOn(false); setMs(0); }}>Reset</button>
      </div>
    </div>
  );
}

/* 6 */ const SEGS = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
const SEG_POLY = { a: '10,4 50,4 44,10 16,10', b: '52,6 52,46 46,40 46,12', c: '52,54 52,94 46,88 46,60', d: '10,96 50,96 44,90 16,90', e: '8,54 8,94 14,88 14,60', f: '8,6 8,46 14,40 14,12', g: '12,50 18,45 42,45 48,50 42,55 18,55' };
function Digit7({ v }) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true">
      {Object.entries(SEG_POLY).map(([k, p]) => <polygon key={k} points={p} data-on={SEGS[v].includes(k)} />)}
    </svg>
  );
}
function SevenSegment() {
  const [n, setN] = useState(247);
  return (
    <div className={c.fig}>
      <div className={c.sevens} role="img" aria-label={`Seven-segment display showing ${n}`}>
        {[...String(n).padStart(3, '0')].map((d, i) => <Digit7 key={i} v={d} />)}
      </div>
      <div className={c.pair}>
        <button type="button" aria-label="Count down" onClick={() => setN((v) => (v + 999) % 1000)}>−</button>
        <button type="button" aria-label="Count up" onClick={() => setN((v) => (v + 1) % 1000)}>+</button>
      </div>
    </div>
  );
}

/* 7 */ function NixieTubes() {
  const n = useTick(900);
  const v = String((n * 3719) % 10000).padStart(4, '0');
  return (
    <div className={c.fig}>
      <div className={c.nixies} role="img" aria-label={`Nixie tubes showing ${v}`}>
        {[...v].map((d, i) => (
          <span key={i}>{Array.from({ length: 10 }, (_, k) => <b key={k} data-on={Number(d) === k}>{k}</b>)}</span>
        ))}
      </div>
    </div>
  );
}

/* 8 */ const SLOT_RESULTS = [[7, 7, 7], [3, 5, 1], [9, 2, 4], [6, 6, 2], [1, 1, 1], [8, 0, 5]];
function SlotReels() {
  const [spin, setSpin] = useState(0);
  const prev = SLOT_RESULTS[Math.max(0, spin - 1) % 6];
  const cur = SLOT_RESULTS[spin % 6];
  return (
    <button type="button" className={c.slotBtn} aria-label={`Slot reels showing ${cur.join(' ')}. Click to spin`} onClick={() => setSpin(spin + 1)}>
      {cur.map((d, r) => (
        <span key={r}>
          <b key={spin} className={spin ? c.reelSpin : undefined} style={{ '--from': spin ? prev[r] : d, '--to': 30 + d, animationDuration: `${1.4 + r * 0.5}s` }}>
            {Array.from({ length: 41 }, (_, i) => <i key={i}>{i % 10}</i>)}
          </b>
        </span>
      ))}
    </button>
  );
}

/* 9 */ const TARGET = '4071928';
function NumberScramble() {
  const [hot, h] = useHot();
  const [frame, setFrame] = useState(99);
  useEffect(() => {
    if (!hot) return undefined;
    let f = 0;
    const id = window.setInterval(() => { f += 1; setFrame(f); if (f > 30) window.clearInterval(id); }, 45);
    return () => window.clearInterval(id);
  }, [hot]);
  const shown = hot ? frame : 99;
  return (
    <button type="button" className={c.scramble} aria-label="Number scramble, hover to decode the number" {...h}>
      {[...TARGET].map((d, i) => <b key={i} data-done={shown > 6 + i * 3}>{shown > 6 + i * 3 ? d : (shown * 7919 + i * 104729) % 10}</b>)}
    </button>
  );
}

/* 10 */ const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const toRoman = (num) => {
  let left = num;
  let out = '';
  ROMAN.forEach(([v, r]) => { while (left >= v) { out += r; left -= v; } });
  return out;
};
function RomanNumerals() {
  const [n, setN] = useState(2026);
  const step = (d) => setN((v) => clamp(v + d, 1, 3999));
  return (
    <div className={c.fig}>
      <output className={c.roman}>{toRoman(n)}</output>
      <p className={c.sub}>{n}</p>
      <div className={c.pair}>
        <button type="button" aria-label="Down ten" onClick={() => step(-10)}>−10</button>
        <button type="button" aria-label="Down one" onClick={() => step(-1)}>−1</button>
        <button type="button" aria-label="Up one" onClick={() => step(1)}>+1</button>
        <button type="button" aria-label="Up ten" onClick={() => step(10)}>+10</button>
      </div>
    </div>
  );
}

/* 11 */ function BinaryClock() {
  const n = useTick(1000);
  const [h, m, s] = hms(9 * 3600 + 41 * 60 + 7 + n);
  const cols = [[Math.floor(h / 10), 2], [h % 10, 4], [Math.floor(m / 10), 3], [m % 10, 4], [Math.floor(s / 10), 3], [s % 10, 4]];
  return (
    <div className={c.fig}>
      <div className={c.bin} role="img" aria-label={`Binary clock showing ${pad2(h)}:${pad2(m)}:${pad2(s)}`}>
        <span className={c.binKey}><em>8</em><em>4</em><em>2</em><em>1</em></span>
        {cols.map(([v, bits], i) => (
          <span key={i} data-gap={i % 2 === 0}>{[8, 4, 2, 1].map((w) => <i key={w} data-hidden={w >= 2 ** bits} data-on={Math.floor(v / w) % 2 === 1} />)}</span>
        ))}
      </div>
    </div>
  );
}

/* 12 */ function TallyMarks() {
  const [n, setN] = useState(13);
  const groups = Math.floor(n / 5);
  const rest = n % 5;
  const stroke = (k, x) => <line key={k} x1={x} y1="4" x2={x} y2="36" />;
  return (
    <button type="button" className={c.tally} aria-label={`Tally of ${n}. Click to add a mark`} onClick={() => setN((v) => (v + 1) % 31)}>
      <span>
        {Array.from({ length: groups }, (_, g) => (
          <svg key={g} viewBox="0 0 44 40" aria-hidden="true">{[6, 15, 24, 33].map((x, k) => stroke(k, x))}<line className={c.slash} x1="1" y1="30" x2="43" y2="10" /></svg>
        ))}
        {rest > 0 && <svg viewBox="0 0 44 40" aria-hidden="true">{[6, 15, 24, 33].slice(0, rest).map((x, k) => stroke(k, x))}</svg>}
      </span>
      <em>{n}</em>
    </button>
  );
}

/* 13 */ function Abacus() {
  const [rods, setRods] = useState([0, 2, 6, 4, 1]);
  const set = (i, v) => setRods((r) => r.map((x, j) => (j === i ? v : x)));
  return (
    <div className={c.fig}>
      <div className={c.abacus}>
        {rods.map((v, i) => (
          <span key={i}>
            <button type="button" className={`${c.bead} ${c.heaven}`} data-on={v >= 5} style={{ '--t': v >= 5 ? 1 : 0 }} aria-label={`Rod ${i + 1}, five bead`} onClick={() => set(i, v >= 5 ? v - 5 : v + 5)} />
            {[1, 2, 3, 4].map((k) => (
              <button key={k} type="button" className={`${c.bead} ${c.earth}`} data-on={v % 5 >= k} style={{ '--t': k - 1 + (v % 5 >= k ? 0 : 1.143) }} aria-label={`Rod ${i + 1}, bead ${k}`} onClick={() => set(i, (v >= 5 ? 5 : 0) + (v % 5 === k ? k - 1 : k))} />
            ))}
          </span>
        ))}
      </div>
      <output className={c.fOut}>{rods.join('')}</output>
    </div>
  );
}

/* 14 */ const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
function CurrencyCounter() {
  const n = useTick(150);
  return (
    <div className={c.fig} role="img" aria-label="A running currency total">
      <b className={c.money}>{money.format(12345.67 + n * 3.21)}</b>
      <p className={c.sub}>+ 3.21 every tick</p>
    </div>
  );
}

/* 15 */ const ROLL = ['48210', '00007', '93605', '12345', '60606'];
function RollToNumber() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={c.rollBtn} aria-label={`Rolling number ${ROLL[k]}. Click for another`} onClick={() => setK((k + 1) % ROLL.length)}>
      {[...ROLL[k]].map((d, i) => (
        <span key={i} style={{ '--i': i }}><b style={{ '--d': d }}>{strip(10).map((x, j) => <i key={j}>{x}</i>)}</b></span>
      ))}
    </button>
  );
}

/* 16 */ function AnalogClock() {
  const n = useTick(1000);
  const s = 10 * 3600 + 8 * 60 + 30 + n;
  return (
    <div className={c.fig}>
      <div className={c.analog} role="img" aria-label="An analog clock" style={{ '--s': `${s * 6}deg`, '--m': `${(s / 60) * 6}deg`, '--h': `${(s / 3600) * 30}deg` }}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className={c.face} cx="50" cy="50" r="47" />
          {Array.from({ length: 60 }, (_, i) => { const [x1, y1] = polar(50, 50, 45, i * 6); const [x2, y2] = polar(50, 50, i % 5 ? 42.5 : 40, i * 6); return <line key={i} className={i % 5 ? c.minor : c.major} x1={x1} y1={y1} x2={x2} y2={y2} />; })}
          {Array.from({ length: 12 }, (_, i) => { const [x, y] = polar(50, 50, 33, (i + 1) * 30); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central">{i + 1}</text>; })}
          <g className={c.hHand}><path d="M50 26 V54" /></g>
          <g className={c.mHand}><path d="M50 14 V54" /></g>
          <g className={c.sHand}><path d="M50 10 V60" /></g>
          <circle className={c.pin} cx="50" cy="50" r="2.4" />
        </svg>
      </div>
    </div>
  );
}

/* 17 */ const ZONES = [['UTC', 0], ['UTC+5', 5], ['UTC+9', 9]];
function WorldClocks() {
  const n = useTick(1000);
  return (
    <div className={c.world} role="img" aria-label="Three clocks in different time zones">
      {ZONES.map(([name, off]) => {
        const [h, m, s] = hms(7 * 3600 + 12 * 60 + 40 + n + off * 3600);
        return <p key={name} data-day={h >= 6 && h < 18}><em>{name}</em><b>{pad2(h)}:{pad2(m)}<small>:{pad2(s)}</small></b><i /></p>;
      })}
    </div>
  );
}

/* 18 */ function TearOffDay() {
  const [day, setDay] = useState(14);
  return (
    <button type="button" className={c.tear} aria-label={`Tear-off calendar showing the ${day}th. Click to tear off the sheet`} onClick={() => setDay((d) => (d % 31) + 1)}>
      <span className={c.sheet}><em>Oct</em><b>{day}</b><i>day {day} of 31</i></span>
      <span key={day} className={`${c.sheet} ${c.torn}`}><em>Oct</em><b>{day - 1 || 31}</b><i>day {day - 1 || 31} of 31</i></span>
    </button>
  );
}

/* 19 */ const STAT = [48210, 51240];
function DeltaStat() {
  const [hot, h] = useHot();
  const up = STAT[1] >= STAT[0];
  return (
    <button type="button" className={c.stat} style={{ '--cv': hot ? STAT[1] : STAT[0] }} aria-label="Delta stat, hover to compare with the last period" {...h}>
      <em>Sessions</em>
      <b className={c.cv} />
      <i data-up={up} data-show={hot}>{up ? '▲' : '▼'} {Math.abs(((STAT[1] - STAT[0]) / STAT[0]) * 100).toFixed(1)}%</i>
    </button>
  );
}

/* 20 */ const FRACS = [[1, 2], [1, 3], [2, 3], [3, 4], [5, 6], [7, 8]];
function FractionPie() {
  const [k, setK] = useState(3);
  const [n, d] = FRACS[k];
  return (
    <button type="button" className={c.frac} style={{ '--fn': n, '--fd': d }} aria-label={`Fraction ${n} over ${d}. Click for another`} onClick={() => setK((k + 1) % FRACS.length)}>
      <span className={c.pie}><i /></span>
      <span className={c.fraction}><b>{n}</b><u /><b>{d}</b></span>
    </button>
  );
}

/* 21 */ const DICE = [[0, 0], [0, -90], [-90, 0], [90, 0], [0, 90], [0, 180]];
const DICE_SEQ = [3, 5, 2, 6, 1, 4];
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function DiceRoll() {
  const [n, setN] = useState(0);
  const face = DICE_SEQ[n % 6];
  const [rx, ry] = DICE[face - 1];
  return (
    <button type="button" className={c.diceBtn} aria-label={`Dice showing ${face}. Click to roll`} onClick={() => setN(n + 1)}>
      <span className={c.cube} style={{ transform: `rotateX(${rx + n * 720}deg) rotateY(${ry + n * 360}deg)` }}>
        {[1, 2, 3, 4, 5, 6].map((f) => <i key={f} data-f={f}>{Array.from({ length: 9 }, (_, p) => <b key={p} data-on={PIPS[f].includes(p)} />)}</i>)}
      </span>
    </button>
  );
}

/* 22 */ function Scoreboard() {
  const [s, setS] = useState([3, 2]);
  const add = (i, d) => setS((p) => p.map((v, j) => (j === i ? clamp(v + d, 0, 99) : v)));
  return (
    <div className={c.score}>
      {['A', 'B'].map((t, i) => (
        <p key={t}>
          <em>Side {t}</em>
          <b key={s[i]}>{s[i]}</b>
          <span>
            <button type="button" aria-label={`Side ${t} minus one`} onClick={() => add(i, -1)}>−</button>
            <button type="button" aria-label={`Side ${t} plus one`} onClick={() => add(i, 1)}>+</button>
          </span>
        </p>
      ))}
    </div>
  );
}

/* 23 */ function HexClock() {
  const n = useTick(1000);
  const [h, m, s] = hms(14 * 3600 + 35 * 60 + 8 + n);
  const hex = `#${[Math.round((h * 255) / 23), Math.round((m * 255) / 59), Math.round((s * 255) / 59)].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  return (
    <div className={c.fig} role="img" aria-label={`A colour made from the time: ${hex}`}>
      <div className={c.hexSwatch} style={{ background: hex }}><b>{hex}</b></div>
      <p className={c.sub}>{pad2(h)}:{pad2(m)}:{pad2(s)}</p>
    </div>
  );
}

/* 24 */ function NumberLine() {
  const [v, bind] = useDrag({ init: 0.62, steps: 20 });
  const x = Math.round(v * 20) - 10;
  return (
    <div className={c.fig}>
      <div className={c.nl} {...bind} aria-label="Number line, drag the point" style={{ ...bind.style, '--v': v }}>
        {Array.from({ length: 21 }, (_, i) => <i key={i} data-big={i % 5 === 0} style={{ '--i': i }}>{i % 5 === 0 ? i - 10 : ''}</i>)}
        <u />
      </div>
      <output className={c.fOut}>{x > 0 ? '+' : ''}{x}<small>|x| = {Math.abs(x)}</small></output>
    </div>
  );
}

/* 25 */ function BadgeCount() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={c.bell} aria-label={`${n} notifications. Click to add one`} onClick={() => setN((v) => (v >= 12 ? 0 : v + 1))}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" /></svg>
      {n > 0 && <b key={n}>{n > 9 ? '9+' : n}</b>}
    </button>
  );
}

/* 26 */ const FLOORS = [7, 2, 9, 4, 1, 6];
function FloorDisplay() {
  const [floor, setFloor] = useState(3);
  const [goal, setGoal] = useState(3);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (floor === goal) return undefined;
    const id = window.setTimeout(() => setFloor((f) => f + Math.sign(goal - f)), 520);
    return () => window.clearTimeout(id);
  }, [floor, goal]);
  const dir = Math.sign(goal - floor);
  return (
    <button type="button" className={c.floor} aria-label={`Elevator at floor ${floor}. Click to call it to another floor`} onClick={() => { setGoal(FLOORS[k % FLOORS.length]); setK(k + 1); }}>
      <i data-dir={dir}>{dir > 0 ? '▲' : dir < 0 ? '▼' : '■'}</i>
      <b key={floor} data-dir={dir}>{floor}</b>
      <em>{dir ? `going to ${goal}` : 'click to call'}</em>
    </button>
  );
}

/* 27 */ function TicketQueue() {
  const [now, setNow] = useState(41);
  return (
    <div className={c.queue}>
      <em>Now serving</em>
      <b key={now}>{String(now).padStart(3, '0')}</b>
      <p>{[1, 2, 3].map((k) => <i key={k}>{String(now + k).padStart(3, '0')}</i>)}</p>
      <button type="button" onClick={() => setNow((v) => v + 1)}>Call next</button>
    </div>
  );
}

/* 28 */ const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const below100 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
const below1000 = (n) => (n < 100 ? below100(n) : `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${below100(n % 100)}` : ''}`);
const words = (n) => {
  if (n === 0) return 'zero';
  const out = [];
  [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand'], [1, '']].forEach(([v, name]) => {
    const part = Math.floor(n / v) % 1000;
    if (part) out.push(`${below1000(part)}${name ? ` ${name}` : ''}`);
  });
  return out.join(' ');
};
function NumberWords() {
  const [text, setText] = useState('1234567');
  const n = Number(text) || 0;
  return (
    <div className={c.fig}>
      <input className={c.input} inputMode="numeric" value={text} maxLength={12} aria-label="A whole number to spell out" onChange={(e) => setText(e.target.value.replace(/\D/g, ''))} />
      <p className={c.words}>{words(n)}</p>
    </div>
  );
}

/* 29 */ function BaseSwitch() {
  const [text, setText] = useState('2026');
  const n = Math.min(Number(text) || 0, 2 ** 31 - 1);
  const group = (s) => s.replace(/\B(?=(.{4})+$)/g, ' ');
  return (
    <div className={c.fig}>
      <input className={c.input} inputMode="numeric" value={text} maxLength={10} aria-label="A decimal number to convert" onChange={(e) => setText(e.target.value.replace(/\D/g, ''))} />
      <dl className={c.bases}>
        <dt>bin</dt><dd>{group(n.toString(2))}</dd>
        <dt>oct</dt><dd>{n.toString(8)}</dd>
        <dt>hex</dt><dd>{group(n.toString(16).toUpperCase())}</dd>
      </dl>
    </div>
  );
}

/* 30 */ function ModClock() {
  const [t, setT] = useState(3);
  const step = (by) => setT((v) => v + by);
  const h = t % 12;
  return (
    <div className={c.fig}>
      <div className={c.mod} style={{ '--t': t }} role="img" aria-label={`A twelve hour clock pointing at ${h || 12}`}>
        {Array.from({ length: 12 }, (_, i) => <em key={i} style={{ '--i': i }}>{i || 12}</em>)}
        <i />
        <u />
      </div>
      <p className={c.sub}>{`${t}`} mod 12 = <b>{h}</b></p>
      <div className={c.pair}>
        <button type="button" onClick={() => step(5)}>+5</button>
        <button type="button" onClick={() => step(7)}>+7</button>
      </div>
    </div>
  );
}

/* 31 */ const SIEVE_P = [2, 3, 5, 7];
const SIEVE = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  const p = SIEVE_P.find((q) => n > q && n % q === 0);
  return { n, step: p ? SIEVE_P.indexOf(p) : -1, one: n === 1 };
});
function PrimeSieve() {
  return (
    <div className={c.fig} role="img" aria-label="The sieve of Eratosthenes crossing out multiples of 2, 3, 5 and 7">
      <div className={c.sieve}>{SIEVE.map((d) => <i key={d.n} data-one={d.one} style={{ '--s': d.step }} data-composite={d.step >= 0}>{d.n}</i>)}</div>
    </div>
  );
}

/* 32 */ const collatz = (n) => { const out = [n]; let v = n; while (v !== 1) { v = v % 2 ? 3 * v + 1 : v / 2; out.push(v); } return out; };
const STARTS = [27, 7, 97, 12, 19];
function CollatzTrail() {
  const [k, setK] = useState(0);
  const seq = collatz(STARTS[k]);
  const hi = Math.max(...seq);
  const path = seq.map((v, i) => `${i ? 'L' : 'M'}${f1((i / (seq.length - 1)) * 100)} ${f1(46 - (Math.log(v) / Math.log(hi)) * 42)}`).join('');
  return (
    <button type="button" className={c.chBtn} aria-label={`Collatz sequence from ${STARTS[k]}. Click for another start`} onClick={() => setK((k + 1) % STARTS.length)}>
      <svg key={k} viewBox="0 0 100 50" aria-hidden="true"><path className={c.collatz} d={path} pathLength="1" /></svg>
      <span className={c.sub}>start <b>{STARTS[k]}</b> · {seq.length - 1} steps · peak {hi}</span>
    </button>
  );
}

/* 33 */ const FIB_TILES = (() => {
  const sides = ['right', 'top', 'left', 'bottom'];
  let box = { x0: 0, y0: 0, x1: 1, y1: 1 };
  const tiles = [{ s: 1, x: 0, y: 0 }];
  [1, 2, 3, 5, 8, 13, 21].forEach((s, i) => {
    const side = sides[i % 4];
    const t = side === 'right' ? { s, x: box.x1, y: box.y0 } : side === 'top' ? { s, x: box.x0, y: box.y0 - s } : side === 'left' ? { s, x: box.x0 - s, y: box.y0 } : { s, x: box.x0, y: box.y1 };
    tiles.push(t);
    box = { x0: Math.min(box.x0, t.x), y0: Math.min(box.y0, t.y), x1: Math.max(box.x1, t.x + s), y1: Math.max(box.y1, t.y + s) };
  });
  return { tiles, box };
})();
function FibonacciTiles() {
  const { tiles, box } = FIB_TILES;
  return (
    <div className={c.fig} role="img" aria-label="Squares sized by the Fibonacci numbers, spiralling out">
      <svg className={c.fibSvg} viewBox={`${box.x0 - 0.3} ${box.y0 - 0.3} ${box.x1 - box.x0 + 0.6} ${box.y1 - box.y0 + 0.6}`} aria-hidden="true">
        {tiles.map((t, i) => (
          <g key={i} className={c.fibTile} style={{ '--i': i }}>
            <rect x={t.x} y={t.y} width={t.s} height={t.s} />
            <text x={t.x + t.s / 2} y={t.y + t.s / 2} textAnchor="middle" dominantBaseline="central" style={{ fontSize: Math.max(0.9, t.s * 0.34) }}>{t.s}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* 34 */ function TimesWheel() {
  const [v, bind] = useDrag({ init: 0.08 });
  const mult = +(2 + v * 48).toFixed(1);
  const n = 72;
  const d = Array.from({ length: n }, (_, i) => {
    const [x1, y1] = polar(50, 50, 46, (i / n) * 360);
    const [x2, y2] = polar(50, 50, 46, (((i * mult) % n) / n) * 360);
    return `M${x1} ${y1}L${x2} ${y2}`;
  }).join('');
  return (
    <div className={c.fig}>
      <svg className={c.wheel} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" /><path d={d} /></svg>
      <div className={c.slide} {...bind} aria-label="Multiplier, drag to change it" style={{ ...bind.style, '--v': v }}><i /></div>
      <output className={c.sub}>× <b>{mult}</b></output>
    </div>
  );
}

/* 35 */ const PI = '3.14159265358979323846264338327950288419716939937510582097494459230781640628620899';
function PiDigits() {
  return (
    <div className={c.pi} role="img" aria-label="The first eighty digits of pi scrolling past">
      <div>{[0, 1].map((k) => <span key={k}>{[...PI].map((d, i) => <i key={i} data-dot={d === '.'}>{d}</i>)}</span>)}</div>
    </div>
  );
}

/* 36 */ const ULAM = (() => {
  const size = 15;
  const grid = Array.from({ length: size }, () => Array(size).fill(0));
  let x = 7;
  let y = 7;
  let n = 1;
  let len = 1;
  const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
  let d = 0;
  grid[y][x] = n;
  while (n < size * size) {
    for (let rep = 0; rep < 2 && n < size * size; rep += 1) {
      for (let s = 0; s < len && n < size * size; s += 1) { x += dirs[d][0]; y += dirs[d][1]; n += 1; if (grid[y]) grid[y][x] = n; }
      d = (d + 1) % 4;
    }
    len += 1;
  }
  return grid;
})();
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false; return true; };
function UlamSpiral() {
  const [at, bind] = useCell(15, 15);
  const sel = at[0] < 0 ? 0 : ULAM[at[0]][at[1]];
  return (
    <div className={c.fig}>
      <div className={c.ulam} {...bind} aria-label="Ulam spiral with the primes lit, move over it or use the arrow keys">
        {ULAM.flat().map((v, i) => <i key={i} data-prime={isPrime(v)} data-sel={v === sel} />)}
      </div>
      <output className={c.sub}>{sel ? <><b>{sel}</b> is {isPrime(sel) ? 'prime' : 'composite'}</> : 'Move over the spiral'}</output>
    </div>
  );
}

/* 37 */ const WORDS_BIG = ['2026', '8192', '3.14', '1729', '0042'];
function OutlineDigits() {
  const n = useTick(3400);
  const word = WORDS_BIG[n % WORDS_BIG.length];
  return (
    <div className={c.fig}>
      <svg className={c.outlineSvg} viewBox="0 0 200 70" role="img" aria-label={`The number ${word}, drawn as an outline`}>
        <text key={word} className={c.outlineText} x="100" y="54" textAnchor="middle">{word}</text>
      </svg>
    </div>
  );
}

/* 38 */ function LiquidNumber() {
  return (
    <div className={c.fig} role="img" aria-label="A number that fills like a vessel">
      <b className={c.liquid} />
    </div>
  );
}

/* 39 */ function BeatCounter() {
  const n = useTick(830);
  return (
    <div className={c.fig} role="img" aria-label="A pulse at seventy-two beats a minute">
      <span className={c.beat}><i /><i /><b>72</b></span>
      <p className={c.sub}>beat <b>{n}</b></p>
    </div>
  );
}

/* 40 */ const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function RatioSplit() {
  const [v, bind] = useDrag({ init: 0.35, steps: 18 });
  const a = 1 + Math.round(v * 18);
  const b = 20 - a;
  const g = gcd(a, b);
  return (
    <div className={c.fig}>
      <div className={c.ratio} style={{ '--a': a }}><i><b>{a}</b></i><i><b>{b}</b></i></div>
      <div className={c.slide} {...bind} aria-label="Split between the two sides, drag to change it" style={{ ...bind.style, '--v': v }}><i /></div>
      <output className={c.sub}>{a}:{b} = <b>{a / g}:{b / g}</b></output>
    </div>
  );
}

/* 41 */ const SI = { '-12': 'pico', '-9': 'nano', '-6': 'micro', '-3': 'milli', 0: '', 3: 'kilo', 6: 'mega', 9: 'giga', 12: 'tera' };
function NotationSwitch() {
  const [text, setText] = useState('0.000472');
  const n = Number(text);
  const ok = text.trim() !== '' && Number.isFinite(n) && n !== 0;
  const exp = ok ? Math.floor(Math.log10(Math.abs(n))) : 0;
  const eng = ok ? Math.floor(exp / 3) * 3 : 0;
  return (
    <div className={c.fig}>
      <input className={c.input} value={text} maxLength={14} aria-label="A number to write in other notations" onChange={(e) => setText(e.target.value.replace(/[^0-9.eE+-]/g, ''))} />
      <dl className={c.bases}>
        <dt>sci</dt><dd>{ok ? n.toExponential() : '—'}</dd>
        <dt>eng</dt><dd>{ok ? `${+(n / 10 ** eng).toPrecision(4)} × 10^${eng}` : '—'}</dd>
        <dt>si</dt><dd>{ok && SI[eng] !== undefined ? `${+(n / 10 ** eng).toPrecision(4)} ${SI[eng] || '(none)'}` : '—'}</dd>
      </dl>
    </div>
  );
}

/* 42 */ const factor = (num) => {
  const out = [];
  let n = num;
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) {
    let e = 0;
    while (n % p === 0) { n /= p; e += 1; }
    if (e) out.push([p, e]);
  }
  if (n > 1) out.push([n, 1]);
  return out;
};
function PrimeFactors() {
  const [text, setText] = useState('360');
  const n = clamp(Number(text) || 0, 0, 999999999);
  const f = n > 1 ? factor(n) : [];
  return (
    <div className={c.fig}>
      <input className={c.input} inputMode="numeric" value={text} maxLength={9} aria-label="A whole number to factor" onChange={(e) => setText(e.target.value.replace(/\D/g, ''))} />
      <p className={c.words}>
        {n < 2 ? 'Try a number above one' : f.length === 1 && f[0][1] === 1 ? <>{n} is prime</> : <>{n} = {f.map(([p, e], i) => <span key={p}>{i ? ' × ' : ''}{p}{e > 1 && <sup>{e}</sup>}</span>)}</>}
      </p>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Flip clock', FlipClock, 'auto'], ['Mileage reel', MileageReel, 'auto'], ['Eased count', EasedCount, 'click'], ['Countdown ring', CountdownRing, 'click'],
    ['Stopwatch', Stopwatch, 'click'], ['Seven segment', SevenSegment, 'click'], ['Nixie tubes', NixieTubes, 'auto'], ['Slot reels', SlotReels, 'click'],
    ['Number scramble', NumberScramble, 'hover'], ['Roman numerals', RomanNumerals, 'click'], ['Binary clock', BinaryClock, 'auto'], ['Tally marks', TallyMarks, 'click'],
    ['Abacus', Abacus, 'click'], ['Currency counter', CurrencyCounter, 'auto'], ['Roll to number', RollToNumber, 'click'], ['Analog clock', AnalogClock, 'auto'],
    ['World clocks', WorldClocks, 'auto'], ['Tear-off day', TearOffDay, 'click'], ['Delta stat', DeltaStat, 'hover'], ['Fraction pie', FractionPie, 'click'],
    ['Dice roll', DiceRoll, 'click'], ['Scoreboard', Scoreboard, 'click'], ['Hex clock', HexClock, 'auto'], ['Number line', NumberLine, 'drag'],
    ['Badge count', BadgeCount, 'click'], ['Floor display', FloorDisplay, 'click'], ['Ticket queue', TicketQueue, 'click'], ['Number words', NumberWords, 'type'],
    ['Base switch', BaseSwitch, 'type'], ['Mod clock', ModClock, 'click'], ['Prime sieve', PrimeSieve, 'auto'], ['Collatz trail', CollatzTrail, 'click'],
    ['Fibonacci tiles', FibonacciTiles, 'auto'], ['Times wheel', TimesWheel, 'drag'], ['Pi digits', PiDigits, 'auto'], ['Ulam spiral', UlamSpiral, 'hover'],
    ['Outline digits', OutlineDigits, 'auto'], ['Liquid number', LiquidNumber, 'auto'], ['Beat counter', BeatCounter, 'auto'], ['Ratio split', RatioSplit, 'drag'],
    ['Notation switch', NotationSwitch, 'type'], ['Prime factors', PrimeFactors, 'type'],
  ],
};
