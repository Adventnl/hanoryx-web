import { useState } from 'react';
import { useDrag, useTick, useCycle, pad2 } from '../hooks';
import { series, pts, poly } from '../kit';
import c from './tickers.module.css';

/* ============================================================
   12 · TICKERS — flaps, boards and marquees.
   The still side is a split-flap board. Every flap is a scroll-driven counter:
   CSS reads the page's --pin, turns it into "which letter, and how far through
   the flip", prints the letters with counters (upper-alpha, decimal) and tilts
   the two moving halves by that fraction. Nothing is animated by script.
   Everything on the right is a belt, a board or a sign.
   ============================================================ */

/* ---------- the still side ---------- */

const BOARD = ['ARRIVAL', 'SIGNAL ', 'GATE 07', 'ON TIME', 'BOARDED', 'SYSTEMS'];

/** One flap's numbers: which counter style, where it ends up, when it starts
 *  to move and how fast it runs, so that all of them land together. */
const flapOf = (ch, r, col) => {
  if (ch === ' ') return null;
  const num = ch >= '0' && ch <= '9';
  const m = num ? 10 : 26;
  const end = (num ? +ch : ch.charCodeAt(0) - 65) + m;
  const start = +(0.03 + col * 0.034 + r * 0.021).toFixed(3);
  return { num, m, end, start, rate: +(end / (0.93 - start)).toFixed(2) };
};
const FLAPS = BOARD.map((word, r) => [...word].map((ch, col) => flapOf(ch, r, col)));
const TAPE = 'FLAPS · BOARDS · MARQUEES · TICKERS · ';

function Visual() {
  return (
    <div className={c.board} aria-hidden="true">
      <p className={c.boardHead}><span><i className="sc-led" /> Flap board</span><span>6 × 7</span></p>
      <div className={c.flaps}>
        {FLAPS.map((row, r) => row.map((f, col) => (f ? (
          <i key={`${r}-${col}`} className={`${c.vf} ${f.num ? c.nu : c.al}`} style={{ '--m': f.m, '--e': f.end, '--s': f.start, '--rt': f.rate }}>
            <b className={`${c.h} ${c.up}`} />
            <b className={`${c.h} ${c.dn}`} />
            <b className={`${c.h} ${c.up} ${c.sfu}`} />
            <b className={`${c.h} ${c.dn} ${c.sfd}`} />
          </i>
        ) : <i key={`${r}-${col}`} className={c.vblank} />)))}
        <span className={c.scan} />
      </div>
      <div className={c.tapeV}><span>{TAPE.repeat(4)}</span></div>
    </div>
  );
}

/* ---------- building blocks ---------- */

/** A split-flap cell for one character (or a short word). When `cur` differs from
 *  `prev` the old top half falls and the new bottom half drops into place; the
 *  parent remounts the cell (a new key) to run it again. */
function Cell({ cur, prev = cur, i = 0 }) {
  const go = cur !== prev;
  const was = go ? prev : cur;
  return (
    <span className={`${c.cell} ${go ? c.go : ''}`} style={{ '--i': i, '--len': cur.length }}>
      <b className={`${c.h} ${c.up}`} data-ch={cur} />
      <b className={`${c.h} ${c.dn}`} data-ch={was} />
      <b className={`${c.h} ${c.up} ${c.fu}`} data-ch={was} />
      <b className={`${c.h} ${c.dn} ${c.fd}`} data-ch={cur} />
    </span>
  );
}

/** A column of digits that slides to show digit `d`. */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function Roll({ d }) {
  return <span className={c.roll} style={{ '--d': d }} aria-hidden="true">{DIGITS.map((n) => <i key={n}>{n}</i>)}</span>;
}

/** A belt: its children, twice in a row, slid along by exactly one copy. */
function Belt({ children, dur = 16, rev = false, className = '', copies = 2, scroll = false }) {
  return (
    <span className={`${c.belt} ${className}`}>
      <span className={`${c.runs} ${scroll ? c.byScroll : ''}`} style={{ '--dur': `${dur}s`, animationDirection: rev ? 'reverse' : 'normal' }}>
        {Array.from({ length: copies }, (_, k) => (
          k ? <span key={k} className={c.runSet} aria-hidden="true" inert>{children}</span> : <span key={k} className={c.runSet}>{children}</span>
        ))}
      </span>
    </span>
  );
}

/* ---------- 01 flaps and boards ---------- */

const WORDS = ['ARRIVE', 'DEPART', 'GATE 7', 'LANDED', 'ON AIR', 'CLEAR '];
function FlapWord() {
  const [s, setS] = useState({ prev: 0, cur: 0, k: 0 });
  const word = WORDS[s.cur];
  const was = WORDS[s.prev];
  return (
    <button
      type="button"
      className={`${c.fig} ${c.reset}`}
      aria-label={`Flip the board, now showing ${word.trim().toLowerCase()}`}
      onClick={() => setS((v) => ({ prev: v.cur, cur: (v.cur + 1) % WORDS.length, k: v.k + 1 }))}
    >
      <span className={c.row} style={{ '--fs': '14cqw' }}>
        {[...word].map((ch, i) => <Cell key={`${s.k}-${i}`} cur={ch} prev={was[i]} i={i} />)}
      </span>
    </button>
  );
}

/** the six digits of a clock that started at 10:42:51 and has run for n seconds */
const clockAt = (n) => {
  const s = (38571 + n) % 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  const sec = s % 60;
  return [Math.floor(h / 10), h % 10, Math.floor(m / 10), m % 10, Math.floor(sec / 10), sec % 10].map(String);
};
function FlapClock() {
  const t = useTick(1000);
  const now = clockAt(t);
  const was = clockAt(Math.max(0, t - 1));
  return (
    <div className={c.fig} role="img" aria-label="A flip clock counting seconds">
      <span className={c.row} style={{ '--fs': '12cqw' }}>
        {[0, 2, 4].map((a) => (
          <span key={a} className={c.pair}>
            <Cell key={`${t}-${a}`} cur={now[a]} prev={was[a]} />
            <Cell key={`${t}-${a + 1}`} cur={now[a + 1]} prev={was[a + 1]} />
          </span>
        ))}
      </span>
    </div>
  );
}

const FLIGHTS = [['18:45', 'ZURICH', 'B12'], ['19:05', 'OSLO', 'A03'], ['19:20', 'LISBON', 'C21']];
const STATUS = ['ON TIME', 'BOARDED', 'DELAYED', 'CLOSED ', 'LANDED '];
const statusAt = (r, t) => STATUS[(Math.floor((Math.max(0, t) + r * 3) / 9) + r) % STATUS.length];
function DepartureRow() {
  const t = useTick(1400);
  return (
    <div className={c.fig} role="img" aria-label="A departures board whose statuses change one at a time">
      <ol className={c.dep}>
        {FLIGHTS.map(([time, to, gate], r) => {
          const now = statusAt(r, t);
          const was = statusAt(r, t - 1);
          return (
            <li key={to}>
              <span>{time}</span><span>{to}</span><span>{gate}</span>
              <span className={c.depS} style={{ '--fs': '0.76rem' }}>
                {[...now].map((ch, i) => <Cell key={`${t}-${i}`} cur={ch} prev={was[i]} i={i} />)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const COLS = 8;
const SIZE = COLS * 2;
const clean = (s) => s.toUpperCase().replace(/[^A-Z0-9 .!?-]/g, '').slice(0, SIZE);
/** two rows of eight: break at the last space that fits, otherwise at the edge */
const lay = (s) => {
  if (s.length <= COLS) return s.padEnd(COLS) + ''.padEnd(COLS);
  let cut = s.lastIndexOf(' ', COLS);
  if (cut < 1) cut = COLS;
  return s.slice(0, cut).padEnd(COLS) + s.slice(cut).trimStart().slice(0, COLS).padEnd(COLS);
};
function Letterboard() {
  const [text, setText] = useState('HELLO THERE');
  const [cells, setCells] = useState(() => [...lay('HELLO THERE')].map((ch) => ({ cur: ch, prev: ch, k: 0 })));
  const onChange = (e) => {
    const v = clean(e.target.value);
    const next = lay(v);
    setText(v);
    setCells((cs) => cs.map((x, i) => (next[i] === x.cur ? x : { cur: next[i], prev: x.cur, k: x.k + 1 })));
  };
  return (
    <div className={c.fig}>
      <div className={c.letters} style={{ '--fs': '8.6cqw' }} role="img" aria-label={`Letterboard reading ${text.trim() || 'nothing'}`}>
        {cells.map((x, i) => <Cell key={`${i}-${x.k}`} cur={x.cur} prev={x.prev} i={0} />)}
      </div>
      <input className={c.input} value={text} maxLength={SIZE} onChange={onChange} aria-label="Message for the letterboard" spellCheck="false" autoComplete="off" />
    </div>
  );
}

const SIDES = ['HOME', 'AWAY'];
function Scoreboard() {
  const [sc, setSc] = useState([{ cur: 2, prev: 2, k: 0 }, { cur: 1, prev: 1, k: 0 }]);
  const bump = (t) => setSc((s) => s.map((x, i) => (i === t ? { cur: (x.cur + 1) % 100, prev: x.cur, k: x.k + 1 } : x)));
  return (
    <div className={c.fig}>
      <div className={c.score}>
        {SIDES.map((name, i) => {
          const s = sc[i];
          const now = pad2(s.cur);
          const was = pad2(s.prev);
          return (
            <button key={name} type="button" className={`${c.team} ${c.reset}`} onClick={() => bump(i)} aria-label={`${name.toLowerCase()} score ${s.cur}, add one`}>
              <span className={c.teamName}>{name}</span>
              <span className={c.row} style={{ '--fs': '9cqw' }}>
                {[...now].map((d, j) => <Cell key={`${s.k}-${j}`} cur={d} prev={was[j]} i={j} />)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const dayOf = (n) => ({ date: pad2(((n - 1) % 30) + 1), wk: DAYS[(n + 1) % 7] });
function PageADay() {
  const [s, setS] = useState({ n: 14, prev: 14, k: 0 });
  const now = dayOf(s.n);
  const was = dayOf(s.prev);
  return (
    <button
      type="button"
      className={`${c.fig} ${c.reset}`}
      aria-label={`Calendar page, ${now.wk.toLowerCase()} ${Number(now.date)} October. Turn the page`}
      onClick={() => setS((v) => ({ n: v.n + 1, prev: v.n, k: v.k + 1 }))}
    >
      <span className={c.leaf}>
        <span className={c.leafHead}>OCTOBER</span>
        <span className={c.row} style={{ '--fs': '10cqw' }}>
          <Cell key={`w${s.k}`} cur={now.wk} prev={was.wk} />
          <Cell key={`d${s.k}`} cur={now.date} prev={was.date} i={2} />
        </span>
      </span>
    </button>
  );
}

function PumpPrice() {
  const [cents, setCents] = useState(349);
  const step = (d) => setCents((v) => Math.min(999, Math.max(100, v + d)));
  const d = String(cents).padStart(3, '0');
  return (
    <div className={c.fig}>
      <div className={c.pump} style={{ '--fs': '11cqw' }} role="img" aria-label={`Price ${(cents / 100).toFixed(2)} a litre`}>
        <span className={c.unit}>$</span><Roll d={+d[0]} /><b>.</b><Roll d={+d[1]} /><Roll d={+d[2]} /><sup>9</sup>
      </div>
      <div className={c.pair2}>
        <button type="button" className={c.nudge} onClick={() => step(-1)} aria-label="Lower the price">−</button>
        <button type="button" className={c.nudge} onClick={() => step(1)} aria-label="Raise the price">+</button>
      </div>
    </div>
  );
}

const FLOORS = Array.from({ length: 12 }, (_, i) => i + 1);
function FloorIndicator() {
  const t = useTick(1100);
  const p = t % 22;
  const up = p < 11;
  const floor = up ? p + 1 : 23 - p;
  return (
    <div className={c.fig} role="img" aria-label={`Lift at floor ${floor}, going ${up ? 'up' : 'down'}`}>
      <div className={c.lift}>
        <span key={`a${up}`} className={`${c.arrow} ${up ? '' : c.aDn}`} />
        <span key={`f${floor}`} className={c.floorNo}>{pad2(floor)}</span>
        <small>LIFT B</small>
      </div>
      <ol className={c.stops}>{FLOORS.map((n) => <li key={n} data-on={n === floor} />)}</ol>
    </div>
  );
}

/* seven segments in a 10 x 18 box */
const SEG = {
  a: '1.4,0.8 8.6,0.8 7.4,2.2 2.6,2.2',
  b: '9.2,1.4 9.2,8.6 7.8,7.4 7.8,2.6',
  c: '9.2,9.4 9.2,16.6 7.8,15.4 7.8,10.6',
  d: '1.4,17.2 2.6,15.8 7.4,15.8 8.6,17.2',
  e: '0.8,9.4 2.2,10.6 2.2,15.4 0.8,16.6',
  f: '0.8,1.4 2.2,2.6 2.2,7.4 0.8,8.6',
  g: '1.4,9 2.6,7.8 7.4,7.8 8.6,9 7.4,10.2 2.6,10.2',
};
const LIT = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
const SEG_X = [0, 13, 30, 43, 60, 73];
function SegmentClock() {
  const t = useTick(1000);
  const s = (86390 + t) % 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  const sec = s % 60;
  const digits = [Math.floor(h / 10), h % 10, Math.floor(m / 10), m % 10, Math.floor(sec / 10), sec % 10];
  return (
    <div className={c.fig} role="img" aria-label={`Seven-segment clock reading ${pad2(h)}:${pad2(m)}:${pad2(sec)}`}>
      <svg className={c.seg} viewBox="-2 -2 87 22" aria-hidden="true">
        {digits.map((d, i) => (
          <g key={i} transform={`translate(${SEG_X[i]} 0)`}>
            {Object.entries(SEG).map(([k, p]) => <polygon key={k} points={p} className={LIT[d].includes(k) ? c.segOn : c.segOff} />)}
          </g>
        ))}
        {[26.5, 56.5].map((x) => (
          <g key={x} className={c.colonDots}><circle cx={x} cy="6" r="1" /><circle cx={x} cy="12" r="1" /></g>
        ))}
      </svg>
    </div>
  );
}

function LaunchCountdown() {
  const t = useTick(1000);
  const left = 20 - (t % 25);
  const gone = left <= 0;
  return (
    <div className={c.fig} role="img" aria-label={gone ? 'Lift off' : `${left} seconds to launch`}>
      <p className={c.tm} data-gone={gone}>
        <span>T{gone ? '+' : '−'}</span>00:{pad2(Math.abs(left))}
      </p>
      <span className={c.tmBar}><i style={{ '--w': Math.min(1, (20 - left) / 20) }} /></span>
      <small className={c.tmNote}>{gone ? 'LIFT OFF' : 'ALL SYSTEMS NOMINAL'}</small>
    </div>
  );
}

const TRAINS = [['1', '18:02', 'Northfield', 'On time'], ['2', '18:09', 'Harbour', '3 min'], ['3', '18:15', 'Old Mill', 'Delayed']];
function PlatformSign() {
  const next = useCycle(TRAINS.length, 2200);
  return (
    <div className={c.fig} role="img" aria-label="A platform sign listing the next three trains">
      <div className={c.sign}>
        <ol>
          {TRAINS.map(([pf, time, to, st], r) => (
            <li key={pf} data-next={r === next}><b>{pf}</b><span>{time}</span><span>{to}</span><em>{st}</em></li>
          ))}
        </ol>
        <Belt dur={16} className={c.mind}><span>Mind the gap between the train and the platform  ·  </span></Belt>
      </div>
    </div>
  );
}

function BadgeRoll() {
  const [n, setN] = useState(7);
  return (
    <div className={c.fig}>
      <div className={c.bellRow}>
        <button type="button" className={`${c.bell} ${c.reset}`} onClick={() => setN((v) => Math.min(99, v + 1))} aria-label={`Notifications, ${n}. Add one`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17v-6a6 6 0 0 1 12 0v6l1.6 2H4.4zM10 21.5h4" /></svg>
          <span className={c.badge} data-zero={n === 0} style={{ '--fs': '0.9rem' }}><Roll d={Math.floor(n / 10)} /><Roll d={n % 10} /></span>
        </button>
        <button type="button" className={c.nudge} onClick={() => setN(0)} aria-label="Clear the notifications">Clear</button>
      </div>
    </div>
  );
}

/* ---------- 02 marquees and tapes ---------- */

function Marquee() {
  return (
    <div className={c.fig} role="img" aria-label="Quiet signals, loud systems">
      <Belt dur={15}><span className={c.mqText}>Quiet signals  ·  loud systems  ·  </span></Belt>
    </div>
  );
}

const LINES = [['ONE WAY', 13, false], ['THE OTHER', 17, true], ['ONE WAY', 10, false]];
function CounterBelts() {
  return (
    <div className={c.fig} role="img" aria-label="Three belts running in opposite directions">
      {LINES.map(([txt, dur, rev], i) => (
        <Belt key={i} dur={dur} rev={rev} className={c.bigBelt}>
          <span className={i === 1 ? c.outline : c.solid}>{txt}  ·  </span>
        </Belt>
      ))}
    </div>
  );
}

const QUOTES = [['HNRX', 12.4, 0.8], ['ORBT', 88.15, -1.2], ['VLTA', 4.02, 2.4], ['KRNL', 231.7, -0.3], ['MESH', 57.9, 1.1], ['LUMN', 19.35, -2.7], ['DYNA', 143, 0.4]];
function StockTape() {
  return (
    <div className={c.fig} role="img" aria-label="A scrolling tape of made-up prices">
      <Belt dur={24} className={c.tapeBar}>
        {QUOTES.map(([sym, px, ch]) => (
          <span key={sym} className={c.quote} data-dn={ch < 0}><b>{sym}</b>{px.toFixed(2)}<em>{Math.abs(ch).toFixed(1)}%</em></span>
        ))}
      </Belt>
    </div>
  );
}

function NewsCrawl() {
  return (
    <div className={c.fig} role="img" aria-label="A news crawl: quiet launch confirmed for Tuesday, gates reopen at seven">
      <div className={c.news}>
        <span className={c.live}><i className="sc-led" /> LIVE</span>
        <Belt dur={22} className={c.newsBelt}><span>Quiet launch confirmed for Tuesday  ·  Gates reopen at seven  ·  Tea is served on platform two  ·  </span></Belt>
      </div>
    </div>
  );
}

function LedScroller() {
  return (
    <div className={c.fig} role="img" aria-label="A dot-matrix sign scrolling: signal on, all stations">
      <div className={c.led}>
        <div className={c.ledDots}>
          <Belt dur={14} className={c.ledBelt}><span>SIGNAL ON  ·  ALL STATIONS  ·  </span></Belt>
        </div>
      </div>
    </div>
  );
}

function CautionTape() {
  return (
    <div className={c.fig} role="img" aria-label="Two crossing strips of caution tape">
      <div className={c.tapes}>
        <div className={`${c.strip} ${c.s1}`}><Belt dur={9}><span>KEEP CLEAR  ·  KEEP CLEAR  ·  </span></Belt></div>
        <div className={`${c.strip} ${c.s2}`}><Belt dur={11} rev><span>MIND THE GAP  ·  MIND THE GAP  ·  </span></Belt></div>
      </div>
    </div>
  );
}

const WAVE = [...'RIDING THE WAVE  ·  '];
function WaveMarquee() {
  return (
    <div className={c.fig} role="img" aria-label="Riding the wave">
      <Belt dur={15} className={c.waveBelt}>
        {WAVE.map((ch, i) => <span key={i} className={c.wch} style={{ '--i': i }}>{ch}</span>)}
      </Belt>
    </div>
  );
}

const CHIPS = ['Atlas', 'Beacon', 'Cobalt', 'Drift', 'Ember', 'Fathom', 'Gale', 'Harbor'];
function PauseChips() {
  const [pick, setPick] = useState('Cobalt');
  return (
    <div className={c.fig}>
      <Belt dur={20} className={c.chips}>
        {CHIPS.map((n) => <button key={n} type="button" className={c.chip} aria-pressed={pick === n} onClick={() => setPick(n)}>{n}</button>)}
      </Belt>
      <p className={c.note}>{pick} selected  ·  hover or focus to pause</p>
    </div>
  );
}

function HoldFreeze() {
  const [held, setHeld] = useState(false);
  const on = () => setHeld(true);
  const off = () => setHeld(false);
  const isKey = (e) => e.key === ' ' || e.key === 'Enter';
  return (
    <div className={c.fig}>
      <button
        type="button"
        className={`${c.freeze} ${c.reset}`}
        data-held={held}
        aria-pressed={held}
        aria-label="Hold to freeze the tape"
        onPointerDown={on}
        onPointerUp={off}
        onPointerLeave={off}
        onPointerCancel={off}
        onBlur={off}
        onKeyDown={(e) => { if (isKey(e) && !e.repeat) { e.preventDefault(); on(); } }}
        onKeyUp={(e) => { if (isKey(e)) off(); }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Belt dur={6} className={c.freezeBelt}><span>HOLD  ·  TO FREEZE  ·  HOLD  ·  TO FREEZE  ·  </span></Belt>
        <span className={c.freezeTag}>{held ? 'FROZEN' : 'RUNNING'}</span>
      </button>
    </div>
  );
}

const FRAMES = Array.from({ length: 24 }, (_, i) => i);
function ScrubTape() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.3 });
  const frame = Math.round(v * 23) + 1;
  return (
    <div className={c.fig}>
      <div {...bind} className={c.scrub} aria-label="Scrub the film strip" aria-valuetext={`Frame ${frame} of 24`} style={{ ...bind.style, '--v': v }}>
        <span className={c.film}>{FRAMES.map((i) => <i key={i} data-key={i % 6 === 0}>{pad2(i + 1)}</i>)}</span>
        <span className={c.handle} />
      </div>
      <p className={c.note}>FRAME {pad2(frame)} / 24</p>
    </div>
  );
}

function ScrollTape() {
  return (
    <div className={c.fig} role="img" aria-label="A tape that slides as the page scrolls">
      <Belt copies={8} scroll className={c.scrollBelt}><span className={c.scrollText}>THE PAGE MOVES  ·  THE TAPE FOLLOWS  ·  </span></Belt>
      <p className={c.note}>linked to the page scroll</p>
    </div>
  );
}

const SPARKS = ['HNRX', 'ORBT', 'VLTA', 'KRNL', 'MESH', 'LUMN'].map((sym, i) => {
  const v = series(9, 40 + i * 7);
  const delta = (v[8] - v[0]) * 10;
  return { sym, d: poly(pts(v, 44, 16, 2)), dn: delta < 0, pct: `${Math.abs(delta).toFixed(1)}%` };
});
function SparklineTape() {
  return (
    <div className={c.fig} role="img" aria-label="A tape of made-up prices, each with a small trend line">
      <Belt dur={26} className={c.tapeBar}>
        {SPARKS.map((s) => (
          <span key={s.sym} className={c.spk} data-dn={s.dn}>
            <b>{s.sym}</b>
            <svg viewBox="0 0 44 16" aria-hidden="true"><path d={s.d} /></svg>
            <em>{s.pct}</em>
          </span>
        ))}
      </Belt>
    </div>
  );
}

function GiantBelt() {
  return (
    <div className={c.fig} role="img" aria-label="Signal and noise, written very large on a slow belt">
      <Belt dur={32} className={c.giant}><span>SIGNAL</span><i /><span>NOISE</span><i /></Belt>
      <Belt dur={19} rev className={c.dots}><span>{'· · · · · · · · · · · · '}</span></Belt>
    </div>
  );
}

/* ---------- 03 rolling lists ---------- */

const ROLL = ['Gate 7 opens at seven', 'Tea is served on platform two', 'A glove was found in carriage four', 'The 18:02 leaves from track nine', 'Mind the gap'];
const ROLLED = [...ROLL, ...ROLL.slice(0, 3)];
function VerticalRoll() {
  return (
    <div className={c.fig} role="img" aria-label="Headlines rolling up one line at a time">
      <div className={c.vroll}><ol>{ROLLED.map((l, i) => <li key={i}>{l}</li>)}</ol></div>
    </div>
  );
}

const HEADS = ['The belt keeps moving', 'Nothing here needs saying', 'Look up, it said so', 'Quiet launch, loud finish', 'Tea at four'];
function HeadlineSwap() {
  const t = useTick(2600);
  const i = t % HEADS.length;
  return (
    <div className={c.fig} role="img" aria-label={`Headline: ${HEADS[i]}`}>
      <div className={c.swap}>
        {t > 0 ? <span key={`o${t}`} className={c.swapOut}>{HEADS[(i + HEADS.length - 1) % HEADS.length]}</span> : null}
        <span key={`i${t}`} className={c.swapIn}>{HEADS[i]}</span>
      </div>
      <small className={c.note}>{pad2(i + 1)} / {pad2(HEADS.length)}</small>
    </div>
  );
}

const CHAT = [['ops', 'ping'], ['gate', 'ready?'], ['ops', 'ack'], ['dock', 'tea is on'], ['gate', 'copy that'], ['ops', 'belt is moving'], ['dock', 'mind the gap'], ['gate', 'all clear']];
function ChatScroll() {
  const t = useTick(1500);
  const newest = t + 4;
  const rows = [0, 1, 2, 3, 4].map((j) => t + j);
  return (
    <div className={c.fig} role="img" aria-label="A chat log gaining a new message every moment">
      <ol className={c.chat}>
        {rows.map((n) => {
          const [who, said] = CHAT[n % CHAT.length];
          return <li key={n} data-new={n === newest}><b>{who}</b>{said}</li>;
        })}
      </ol>
    </div>
  );
}

const CAPS = ['Nothing here needs saying.', 'The belt keeps moving.', 'Look up, it said so.', 'Quiet, then louder.'];
function CaptionBar() {
  const t = useTick(2400);
  const i = t % CAPS.length;
  return (
    <div className={c.fig} role="img" aria-label={`Caption: ${CAPS[i]}`}>
      <div className={c.cinema}>
        <p key={t} className={c.subs}>{CAPS[i]}</p>
        <span className={c.tc}>00:00:{pad2((t * 2 + 1) % 60)}:{pad2((t * 7) % 24)}</span>
        <i key={`b${t}`} className={c.capBar} />
      </div>
    </div>
  );
}

const DRUM = ['MORNING', 'NOON', 'EVENING', 'NIGHT', 'DAWN', 'DUSK', 'TIDE', 'EMBER'];
function WordDrum() {
  return (
    <div className={c.fig} role="img" aria-label="A drum turning through words: morning, noon, evening, night">
      <div className={c.drumView}>
        <ol className={c.drum}>{DRUM.map((w, i) => <li key={w} style={{ '--i': i }}>{w}</li>)}</ol>
        <i className={c.drumLine} />
      </div>
    </div>
  );
}

const SLOT_N = 10;
const REELS = [0, 1, 2];
const STRIP = Array.from({ length: SLOT_N * 3 }, (_, i) => i % SLOT_N);
function SlotReel() {
  const [s, setS] = useState({ k: 0, from: [0, 0, 0], to: [0, 0, 0] });
  const spin = () => setS((v) => {
    const rest = v.to.map((x) => x % SLOT_N);
    return { k: v.k + 1, from: rest, to: rest.map((x, r) => x + 10 + ((v.k * 7 + r * 5 + 3) % 10)) };
  });
  const shown = s.to.map((x) => x % SLOT_N);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} onClick={spin} aria-label={`Spin the reels. Showing ${shown.join(' ')}`}>
      <span className={c.reels} style={{ '--fs': '11cqw' }}>
        {REELS.map((r) => (
          <span key={`${r}-${s.k}`} className={c.reel} style={{ '--a': s.from[r], '--b': s.to[r], '--dur': `${1.1 + r * 0.4}s` }}>
            <span className={c.strip3}>{STRIP.map((d, i) => <i key={i}>{d}</i>)}</span>
          </span>
        ))}
      </span>
      <span className={c.lever}>SPIN</span>
    </button>
  );
}

const CONTENDERS = [['Atlas', 62, 0.31, 0], ['Beacon', 58, 0.43, 1.7], ['Cobalt', 55, 0.37, 3.1], ['Drift', 51, 0.5, 4.4], ['Ember', 47, 0.27, 5.9]];
function Leaderboard() {
  const t = useTick(1800);
  const scored = CONTENDERS.map(([name, base, w, ph]) => ({ name, v: Math.round(base + 14 * Math.sin(t * w + ph)) }));
  const order = [...scored].sort((a, b) => b.v - a.v || a.name.localeCompare(b.name)).map((x) => x.name);
  return (
    <div className={c.fig} role="img" aria-label={`Leaderboard, ${order[0]} in front`}>
      <ol className={c.lead}>
        {scored.map((s) => {
          const rank = order.indexOf(s.name);
          return (
            <li key={s.name} style={{ '--r': rank, '--w': s.v }} data-top={rank === 0}>
              <b>{rank + 1}</b><span>{s.name}</span><em>{s.v}</em><i />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- 04 instruments and lights ---------- */

const BEAT = 'M0 22h18q4-7 8 0h6l2 3 3-3 4-20 4 28 3-8h8q7-10 14 0h30';
function HeartbeatTape() {
  return (
    <div className={c.fig} role="img" aria-label="A heartbeat trace scrolling past, seventy-two beats a minute">
      <div className={c.ecg}>
        <svg className={c.ecgSvg} viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
          {[0, 100, 200].map((x) => <path key={x} d={BEAT} transform={`translate(${x} 0)`} />)}
        </svg>
        <span className={c.bpm}><i className="sc-led" /> 72 BPM</span>
      </div>
    </div>
  );
}

const BULBS = Array.from({ length: 15 }, (_, i) => <i key={i} style={{ '--k': i }} />);
function CinemaBulbs() {
  return (
    <div className={c.fig} role="img" aria-label="A cinema marquee with chasing bulbs: opening night">
      <div className={c.cinemaSign}>
        <span className={c.bulbRow}>{BULBS}</span>
        <p>OPENING <b>NIGHT</b></p>
        <span className={c.bulbRow}>{BULBS}</span>
      </div>
    </div>
  );
}

function TubeSign() {
  return (
    <div className={c.fig} role="img" aria-label="A neon exit sign with arrows chasing toward the exit">
      <div className={c.tube}>
        <span className={c.arrows}>{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--i': i }} />)}</span>
        <b>EXIT</b>
      </div>
    </div>
  );
}

const STATIONS = [89.1, 94.7, 98.3, 101.9, 106.5];
function RadioDial() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.46 });
  const mhz = 87.5 + v * 20.5;
  const locked = STATIONS.some((s) => Math.abs(s - mhz) < 0.3);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.dial} aria-label="Tune the dial" aria-valuetext={`${mhz.toFixed(1)} megahertz`} style={{ ...bind.style, '--mhz': mhz.toFixed(2) }}>
        <span className={c.scale}>{Array.from({ length: 22 }, (_, i) => <i key={i}><b>{88 + i}</b></i>)}</span>
        <u className={c.needle} />
      </div>
      <p className={c.readout} data-lock={locked}>{mhz.toFixed(1)} <small>MHz</small> <em>{locked ? 'LOCKED' : 'SEARCH'}</em></p>
    </div>
  );
}

const STOPS = ['Mill', 'Quay', 'Market', 'Cross', 'Park', 'End'];
function LineMap() {
  const t = useTick(1500);
  const i = t % (STOPS.length * 2 - 2);
  const fwd = i < STOPS.length - 1;
  const at = i < STOPS.length ? i : 2 * (STOPS.length - 1) - i;
  const next = STOPS[Math.max(0, Math.min(STOPS.length - 1, at + (fwd ? 1 : -1)))];
  return (
    <div className={c.fig} role="img" aria-label={`A train at ${STOPS[at]}, next ${next}`}>
      <div className={c.line} style={{ '--at': at }}>
        <ol>{STOPS.map((s, k) => <li key={s} data-done={k <= at}><i /><span>{s}</span></li>)}</ol>
        <b className={c.train} />
      </div>
      <p className={c.note}>NOW <b>{STOPS[at]}</b>  ·  NEXT <b>{next}</b></p>
    </div>
  );
}

const STEPS = ['Packed', 'Sorted', 'On the road', 'Out today', 'Delivered'];
function ParcelTracker() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Parcel status: ${STEPS[n]}. Advance it`} onClick={() => setN((v) => (v + 1) % STEPS.length)}>
      <span className={c.track} style={{ '--n': n }}>
        <span className={c.rail}><i /></span>
        {STEPS.map((s, k) => <span key={s} className={c.stepDot} data-state={k < n ? 'done' : k === n ? 'now' : 'next'} />)}
      </span>
      <span key={n} className={c.stepName}>{STEPS[n]}</span>
    </button>
  );
}

const PRICES = Array.from({ length: 24 }, (_, i) => +(1284.5 + 12 * Math.sin(i * 1.3) + 6 * Math.cos(i * 2.9)).toFixed(2));
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function FlashPrice() {
  const t = useTick(1100);
  const now = PRICES[t % PRICES.length];
  const was = PRICES[(t + PRICES.length - 1) % PRICES.length];
  const up = now >= was;
  return (
    <div className={c.fig} role="img" aria-label={`Price ${money(now)}, ${up ? 'up' : 'down'} ${money(Math.abs(now - was))}`}>
      <div key={t} className={c.flash} data-dn={!up}>
        <small>INDEX</small>
        <b>{money(now)}</b>
        <em>{money(Math.abs(now - was))}</em>
      </div>
    </div>
  );
}

const TYPED = ['Signal acquired.', 'Belt speed nominal.', 'Mind the gap.', 'Standing by.'];
const typedAt = (t) => {
  let n = t % TYPED.reduce((a, s) => a + s.length * 2 + 22, 0);
  for (const s of TYPED) {
    const span = s.length * 2 + 22;
    if (n < span) {
      let shown = 0;
      if (n < s.length) shown = n;
      else if (n < s.length + 16) shown = s.length;
      else if (n < s.length * 2 + 16) shown = s.length - (n - s.length - 16);
      return s.slice(0, shown);
    }
    n -= span;
  }
  return '';
};
function TypingTape() {
  const t = useTick(80);
  return (
    <div className={c.fig} role="img" aria-label="A message being typed and erased: signal acquired, belt speed nominal">
      <div className={c.typeBar}><b>MSG</b><span>{typedAt(t)}</span><i className={c.caret} /></div>
    </div>
  );
}

const SYNC = [...'SYNCING FEED'];
function ShimmerStatus() {
  return (
    <div className={c.fig} role="img" aria-label="Syncing feed, forty-two percent">
      <p className={c.shim}>{SYNC.map((ch, i) => <span key={i} style={{ '--i': i }}>{ch}</span>)}</p>
      <span className={c.shimBar}><i /></span>
      <span className={c.shimMeta}><em>42%</em><b>3 / 7 BLOCKS</b></span>
    </div>
  );
}

const RL10 = Array.from({ length: 11 }, (_, i) => i % 10);
const RL6 = Array.from({ length: 7 }, (_, i) => i % 6);
function StopwatchReel() {
  return (
    <div className={c.fig} role="img" aria-label="A stopwatch built from four turning reels">
      <div className={c.watch}>
        <span className={`${c.rl} ${c.mT}`}><b>{RL6.map((d, i) => <i key={i}>{d}</i>)}</b></span>
        <span className={`${c.rl} ${c.mO}`}><b>{RL10.map((d, i) => <i key={i}>{d}</i>)}</b></span>
        <u>:</u>
        <span className={`${c.rl} ${c.sT}`}><b>{RL6.map((d, i) => <i key={i}>{d}</i>)}</b></span>
        <span className={`${c.rl} ${c.sO}`}><b>{RL10.map((d, i) => <i key={i}>{d}</i>)}</b></span>
      </div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Flap word', FlapWord, 'click'], ['Flap clock', FlapClock, 'auto'], ['Departure row', DepartureRow, 'auto'], ['Letterboard', Letterboard, 'type'],
    ['Scoreboard', Scoreboard, 'click'], ['Page-a-day', PageADay, 'click'], ['Pump price', PumpPrice, 'click'], ['Floor indicator', FloorIndicator, 'auto'],
    ['Segment clock', SegmentClock, 'auto'], ['Launch countdown', LaunchCountdown, 'auto'], ['Platform sign', PlatformSign, 'auto'], ['Badge roll', BadgeRoll, 'click'],
    ['Marquee', Marquee, 'auto'], ['Counter belts', CounterBelts, 'auto'], ['Stock tape', StockTape, 'auto'], ['News crawl', NewsCrawl, 'auto'],
    ['LED scroller', LedScroller, 'auto'], ['Caution tape', CautionTape, 'auto'], ['Wave marquee', WaveMarquee, 'auto'], ['Pause chips', PauseChips, 'hover'],
    ['Hold to freeze', HoldFreeze, 'press'], ['Scrub tape', ScrubTape, 'drag'], ['Scroll tape', ScrollTape, 'scroll'], ['Sparkline tape', SparklineTape, 'auto'],
    ['Giant belt', GiantBelt, 'auto'], ['Vertical roll', VerticalRoll, 'auto'], ['Headline swap', HeadlineSwap, 'auto'], ['Chat scroll', ChatScroll, 'auto'],
    ['Caption bar', CaptionBar, 'auto'], ['Word drum', WordDrum, 'auto'], ['Slot reel', SlotReel, 'click'], ['Leaderboard', Leaderboard, 'auto'],
    ['Heartbeat tape', HeartbeatTape, 'auto'], ['Cinema bulbs', CinemaBulbs, 'auto'], ['Tube sign', TubeSign, 'auto'], ['Radio dial', RadioDial, 'drag'],
    ['Line map', LineMap, 'auto'], ['Parcel tracker', ParcelTracker, 'click'], ['Flash price', FlashPrice, 'auto'], ['Typing tape', TypingTape, 'auto'],
    ['Shimmer status', ShimmerStatus, 'auto'], ['Stopwatch reel', StopwatchReel, 'auto'],
  ],
};
