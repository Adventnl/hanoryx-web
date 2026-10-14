import { useEffect, useState } from 'react';
import { useDrag, useTick, rng, clamp, pad2 } from '../hooks';
import { useCell, useScan, f1 } from '../kit';
import c from './matrices.module.css';

/* ============================================================
   08 · MATRICES — heat, tables and dot grids to pan across.
   The page is a field of forty-two grids you travel across along a snaking path.
   On the left, a small map of that field: the red cell and the dot are where the
   scroll has taken you, the line is the way so far, and the numbers beside them
   are written by CSS counters — the same `--pin` that moves the field draws them.
   Most specimens below are grids read with the pointer or the arrow keys
   (useCell); the rest are small games, tables and displays.
   ============================================================ */

/* ---- the map on the left ---- */
const N = 42; /* specimens on this page: the map draws one cell for each */
const COLS = 8;
const ROWS = 6;
const END = N / COLS; /* how far along the path the last specimen sits */
const CELLS = Array.from({ length: COLS * ROWS }, (_, k) => {
  const r = Math.floor(k / COLS);
  const col = k % COLS;
  return { k, r, col, real: r * COLS + (r % 2 ? COLS - 1 - col : col) < N };
});
const tri = (s) => 1 - Math.abs((s % 2) - 1);
const TRACE = [...Array.from({ length: Math.ceil(END) }, (_, s) => s), END]
  .map((s, i) => `${i ? 'L' : 'M'}${f1(0.5 + 7 * tri(s))} ${f1((s + 0.5) * 1.5)}`).join('');

function Visual() {
  return (
    <div className={c.mini} aria-hidden="true">
      <p className={c.where}><b className={c.nTile} /><i>/ {N}</i></p>
      <div className={c.board}>
        <div className={c.cells}>
          {CELLS.map((d) => <i key={d.k} data-real={d.real} style={{ '--cx': d.col, '--cy': d.r }} />)}
        </div>
        <svg viewBox="0 0 8 9"><path className={c.trace} d={TRACE} pathLength="1" /></svg>
        <b className={c.you} />
      </div>
      <p className={c.coords}>row <span className={c.nRow} /> / {ROWS} · col <span className={c.nCol} /> / {COLS}</p>
    </div>
  );
}

/* ---- a 5 x 7 dot font for the displays ---- */
const FONT = {
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  ':': ['0', '0', '1', '0', '1', '0', '0'],
  _: ['0', '0', '0', '0', '0', '0', '0'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
};
const raster = (text) => {
  const rows = Array.from({ length: 7 }, () => '');
  [...text].forEach((ch, i) => {
    for (let y = 0; y < 7; y += 1) rows[y] += FONT[ch][y] + (i < text.length - 1 ? '0' : '');
  });
  return rows;
};

/* 1 */ const HEAT = (() => {
  const r = rng(5);
  return Array.from({ length: 6 }, () => Array.from({ length: 10 }, () => r()));
})();
function HeatMatrix() {
  const [at, bind] = useCell(6, 10);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.hm} {...bind} aria-label="Heat matrix, move over it or use the arrow keys">
        {HEAT.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} style={{ '--v': v }} data-hot={i === r || j === k} data-sel={i === r && j === k} />))}
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the matrix' : <>R{r + 1} · C{k + 1} · <b>{HEAT[r][k].toFixed(2)}</b></>}</output>
    </div>
  );
}

/* 2 */ const AXIS6 = ['A', 'B', 'C', 'D', 'E', 'F'];
const CORR = Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => (i === j ? 1 : +Math.cos((i + 1) * (j + 1) * 0.9 + i + j).toFixed(2))));
function CorrelationGrid() {
  const [at, bind] = useCell(6, 6);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.cg} {...bind} aria-label="Correlation grid, move over it or use the arrow keys">
        {CORR.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} style={{ '--r': Math.abs(v) }} data-neg={v < 0} data-hot={i === r || j === k} data-sel={i === r && j === k} />))}
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the grid' : <>{AXIS6[r]} × {AXIS6[k]} · <b>{CORR[r][k].toFixed(2)}</b></>}</output>
    </div>
  );
}

/* 3 */ const pctOf = (v, total) => Math.round((v / total) * 100);
const CONF = [[42, 5, 3], [6, 38, 6], [2, 7, 41]];
const CONF_SUM = CONF.flat().reduce((a, b) => a + b, 0);
function ConfusionMatrix() {
  const [sel, setSel] = useState([1, 2]);
  const [at, bind] = useCell(3, 3, (r, k) => setSel([r, k]));
  const [r, k] = sel;
  return (
    <div className={c.box}>
      <div className={c.cmWrap}>
        <em>actual ↓ · predicted →</em>
        <div className={c.cm} {...bind} aria-label="Confusion matrix, click a cell">
          {CONF.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} style={{ '--v': v / 50 }} data-diag={i === j} data-sel={i === r && j === k} data-at={i === at[0] && j === at[1]}>{v}</i>))}
        </div>
      </div>
      <output className={c.out}>Actual {AXIS6[r]} · predicted {AXIS6[k]} · <b>{CONF[r][k]}</b> ({pctOf(CONF[r][k], CONF_SUM)}%)</output>
    </div>
  );
}

/* 4 */ const NINE = Array.from({ length: 9 }, (_, i) => i + 1);
function TimesTable() {
  const [at, bind] = useCell(9, 9);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.tt} {...bind} aria-label="Times table, move over it or use the arrow keys">
        {NINE.map((a, i) => NINE.map((b, j) => <i key={`${i}-${j}`} data-hot={i === r || j === k} data-sel={i === r && j === k}>{a * b}</i>))}
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the table' : <>{r + 1} × {k + 1} = <b>{(r + 1) * (k + 1)}</b></>}</output>
    </div>
  );
}

/* 5 */ const SALES = [['Alder', 42, 12.5], ['Birch', 17, 33.1], ['Cedar', 66, 8.4], ['Dune', 29, 21.7], ['Elm', 51, 15.2], ['Fir', 8, 40.9]];
const SALES_HEAD = ['Name', 'Units', 'Share'];
function SortableTable() {
  const [sort, setSort] = useState({ col: 1, dir: -1 });
  const rows = [...SALES].sort((a, b) => (a[sort.col] > b[sort.col] ? 1 : a[sort.col] < b[sort.col] ? -1 : 0) * sort.dir);
  return (
    <table className={c.tbl}>
      <thead>
        <tr>
          {SALES_HEAD.map((h, i) => (
            <th key={h} aria-sort={sort.col === i ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
              <button type="button" onClick={() => setSort((s) => ({ col: i, dir: s.col === i ? -s.dir : 1 }))}>{h}<u>{sort.col === i ? (sort.dir > 0 ? '▲' : '▼') : ''}</u></button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows.map(([n, a, b]) => <tr key={n}><td>{n}</td><td>{a}</td><td>{b.toFixed(1)}%</td></tr>)}</tbody>
    </table>
  );
}

/* 6 */ const LOG = Array.from({ length: 24 }, (_, i) => [`R${pad2(i + 1)}`, Math.round(20 + 60 * Math.abs(Math.sin(i * 1.3))), i % 5 === 0]);
function ScrollTable() {
  return (
    <div className={c.scrollTbl} role="region" aria-label="Scrolling table with a fixed header" tabIndex={0}>
      <table>
        <thead><tr><th>Row</th><th>Load</th><th>Flag</th></tr></thead>
        <tbody>{LOG.map(([n, v, f]) => <tr key={n}><td>{n}</td><td><i style={{ '--v': v / 100 }} />{v}</td><td>{f ? '●' : ''}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

/* 7 */ function DotClock() {
  const n = useTick(1100);
  const t = (12 * 60 + 58 + n) % (24 * 60);
  const rows = raster(`${pad2(Math.floor(t / 60))}${n % 2 ? '_' : ':'}${pad2(t % 60)}`);
  return (
    <div className={c.dots} role="img" aria-label="A dot-matrix clock running fast" style={{ '--w': rows[0].length }}>
      {rows.map((row, y) => [...row].map((b, x) => <i key={`${y}-${x}`} data-on={b === '1'} />))}
    </div>
  );
}

/* 8 */ const MSG = raster('HANORYX GRID ');
const MSG_W = MSG[0].length;
const MSG_LIT = MSG.flatMap((row, y) => [...row].map((b, x) => (b === '1' ? [x, y] : null)).filter(Boolean));
function PixelMarquee() {
  return (
    <div className={c.marq} role="img" aria-label="A pixel marquee scrolling a message">
      <div className={c.mstrip} style={{ '--w': MSG_W }}>
        {[0, 1].map((k) => (
          <span key={k} style={{ '--o': k * MSG_W }}>{MSG_LIT.map(([x, y]) => <i key={`${x}-${y}`} style={{ '--x': x, '--y': y }} />)}</span>
        ))}
      </div>
    </div>
  );
}

/* 9 */ const LW = 18;
const LH = 10;
const seeded = (seed) => {
  const r = rng(seed * 97 + 3);
  return Array.from({ length: LW * LH }, () => r() < 0.32);
};
const stepLife = (g) => g.map((on, i) => {
  const x = i % LW;
  const y = Math.floor(i / LW);
  let n = 0;
  for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) if (dx || dy) n += g[((y + dy + LH) % LH) * LW + ((x + dx + LW) % LW)] ? 1 : 0;
  return on ? n === 2 || n === 3 : n === 3;
});
function LifeGrid() {
  const [seed, setSeed] = useState(1);
  const gen = useTick(280) % 90;
  let g = seeded(seed);
  for (let i = 0; i < gen; i += 1) g = stepLife(g);
  return (
    <button type="button" className={c.lifeBtn} aria-label="Life grid, click to start from a new pattern" onClick={() => setSeed(seed + 1)}>
      <span className={c.life}>{g.map((on, i) => <i key={i} data-on={on} />)}</span>
      <em>generation {gen}</em>
    </button>
  );
}

/* 10 */ const PW = 12;
const PH = 8;
const HEART = ['000000000000', '001100001100', '011110011110', '011111111110', '001111111100', '000111111000', '000011110000', '000001100000'];
const PAD_START = [...HEART.join('')].map((b) => b === '1');
function PixelPad() {
  const [cells, setCells] = useState(PAD_START);
  const [paint, setPaint] = useState(null);
  const [cur, setCur] = useState(-1);
  const idx = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.floor(clamp((e.clientY - r.top) / r.height, 0, 0.9999) * PH) * PW + Math.floor(clamp((e.clientX - r.left) / r.width, 0, 0.9999) * PW);
  };
  const put = (i, v) => setCells((p) => (p[i] === v ? p : p.map((x, j) => (j === i ? v : x))));
  return (
    <div className={c.box}>
      <div
        className={c.pad}
        role="application"
        aria-roledescription="pixel pad"
        aria-label="Pixel pad, drag to draw or erase, or use arrow keys and space"
        tabIndex={0}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); const i = idx(e); const v = !cells[i]; setPaint(v); setCur(i); put(i, v); }}
        onPointerMove={(e) => { if (paint !== null) { const i = idx(e); setCur(i); put(i, paint); } }}
        onPointerUp={() => setPaint(null)}
        onPointerCancel={() => setPaint(null)}
        onBlur={() => setCur(-1)}
        onKeyDown={(e) => {
          const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -PW, ArrowDown: PW }[e.key];
          if (d) { e.preventDefault(); setCur((i) => clamp((i < 0 ? 0 : i) + d, 0, PW * PH - 1)); }
          if ((e.key === ' ' || e.key === 'Enter') && cur >= 0) { e.preventDefault(); put(cur, !cells[cur]); }
        }}
      >
        {cells.map((on, i) => <i key={i} data-on={on} data-cur={i === cur} />)}
      </div>
      <button type="button" className={c.mini2} onClick={() => setCells(PAD_START.map(() => false))}>Clear</button>
    </div>
  );
}

/* 11 */ const SEATS = (() => {
  const r = rng(7);
  return Array.from({ length: 54 }, () => r() < 0.28);
})();
const FREE_SEATS = SEATS.map((t, i) => (t ? -1 : i)).filter((i) => i >= 0);
function SeatMap() {
  const [mine, setMine] = useState(FREE_SEATS.slice(9, 11));
  const [at, bind] = useCell(6, 9, (r, k) => {
    const i = r * 9 + k;
    if (!SEATS[i]) setMine((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
  });
  return (
    <div className={c.box}>
      <div className={c.seats} {...bind} aria-label="Seat map, click free seats to pick them">
        {SEATS.map((taken, i) => <i key={i} data-taken={taken} data-mine={mine.includes(i)} data-at={i === at[0] * 9 + at[1]} />)}
      </div>
      <output className={c.out}><b>{mine.length}</b> seats picked · screen is up here ↑</output>
    </div>
  );
}

/* 12 */ const BINGO = (() => {
  const r = rng(12);
  const col = (j) => {
    const pool = Array.from({ length: 15 }, (_, k) => k + 1 + j * 15);
    return Array.from({ length: 5 }, () => pool.splice(Math.floor(r() * pool.length), 1)[0]);
  };
  const cols = [0, 1, 2, 3, 4].map(col);
  return Array.from({ length: 25 }, (_, i) => (i === 12 ? 0 : cols[i % 5][Math.floor(i / 5)]));
})();
const BINGO_LINES = [...Array.from({ length: 5 }, (_, r) => [0, 1, 2, 3, 4].map((k) => r * 5 + k)), ...Array.from({ length: 5 }, (_, k) => [0, 1, 2, 3, 4].map((r) => r * 5 + k)), [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];
function BingoCard() {
  const [stamps, setStamps] = useState([12, 0, 6]);
  const [at, bind] = useCell(5, 5, (r, k) => {
    const i = r * 5 + k;
    if (i !== 12) setStamps((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  });
  const won = BINGO_LINES.filter((l) => l.every((i) => i === 12 || stamps.includes(i)));
  const winCells = new Set(won.flat());
  return (
    <div className={c.box}>
      <div className={c.bingo} {...bind} aria-label="Bingo card, click numbers to stamp them">
        {BINGO.map((n, i) => <i key={i} data-st={i === 12 || stamps.includes(i)} data-win={winCells.has(i)} data-at={i === at[0] * 5 + at[1]}>{i === 12 ? '★' : n}</i>)}
      </div>
      <output className={c.out}>{won.length ? <b>Bingo!</b> : `${stamps.filter((i) => i !== 12).length} stamped`}</output>
    </div>
  );
}

/* 13 */ const SUDOKU = (() => {
  const r = rng(13);
  return Array.from({ length: 81 }, (_, i) => {
    const row = Math.floor(i / 9);
    const col = i % 9;
    return r() < 0.46 ? 0 : ((row * 3 + Math.floor(row / 3) + col) % 9) + 1;
  });
})();
function SudokuPeek() {
  const [at, bind] = useCell(9, 9);
  const [r, k] = at;
  const box = (a, b) => Math.floor(a / 3) * 3 + Math.floor(b / 3);
  return (
    <div className={c.box}>
      <div className={c.sudoku} {...bind} aria-label="Sudoku, move over it to light a row, column and box">
        {SUDOKU.map((v, i) => {
          const a = Math.floor(i / 9);
          const b = i % 9;
          return <i key={i} data-hot={r >= 0 && (a === r || b === k || box(a, b) === box(r, k))} data-sel={a === r && b === k}>{v || ''}</i>;
        })}
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the grid' : <>Row {r + 1} · col {k + 1} · box <b>{box(r, k) + 1}</b></>}</output>
    </div>
  );
}

/* 14 */ const press = (g, i) => {
  const x = i % 5;
  const y = Math.floor(i / 5);
  return g.map((on, j) => {
    const jx = j % 5;
    const jy = Math.floor(j / 5);
    return Math.abs(jx - x) + Math.abs(jy - y) <= 1 ? !on : on;
  });
};
const LIGHTS_START = [6, 12, 18, 8].reduce(press, Array(25).fill(false));
function LightsOut() {
  const [g, setG] = useState(LIGHTS_START);
  const [moves, setMoves] = useState(0);
  const won = g.every((x) => !x);
  const [at, bind] = useCell(5, 5, (r, k) => {
    if (won) { setG(LIGHTS_START); setMoves(0); } else { setG((p) => press(p, r * 5 + k)); setMoves((m) => m + 1); }
  });
  return (
    <div className={c.box}>
      <div className={c.lights} {...bind} aria-label="Lights out, click a light to flip it and its neighbours">
        {g.map((on, i) => <i key={i} data-on={on} data-at={i === at[0] * 5 + at[1]} />)}
      </div>
      <output className={c.out}>{won ? <b>Dark · click to restart</b> : <>Moves <b>{moves}</b></>}</output>
    </div>
  );
}

/* 15 */ const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const slide = (t, i) => {
  const b = t.indexOf(0);
  const near = Math.abs((b % 3) - (i % 3)) + Math.abs(Math.floor(b / 3) - Math.floor(i / 3)) === 1;
  return near ? t.map((v, j) => (j === b ? t[i] : j === i ? 0 : v)) : t;
};
const PUZZLE_START = [7, 4, 3, 7, 8, 5, 4, 1, 0, 3, 4, 5, 8].reduce((t, k) => {
  const b = t.indexOf(0);
  const choices = [b - 3, b + 3, b % 3 ? b - 1 : -1, b % 3 < 2 ? b + 1 : -1].filter((x) => x >= 0 && x < 9);
  return slide(t, choices[k % choices.length]);
}, SOLVED);
function TilePuzzle() {
  const [t, setT] = useState(PUZZLE_START);
  const solved = t.every((v, i) => v === SOLVED[i]);
  const [, bind] = useCell(3, 3, (r, k) => setT((p) => (solved ? PUZZLE_START : slide(p, r * 3 + k))));
  return (
    <div className={c.box}>
      <div className={c.puzzle} {...bind} aria-label="Sliding puzzle, click a tile beside the gap to slide it" data-solved={solved}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
          const i = t.indexOf(n);
          return <b key={n} style={{ '--x': i % 3, '--y': Math.floor(i / 3) }}>{n}</b>;
        })}
      </div>
      <output className={c.out}>{solved ? <b>Solved · click to shuffle</b> : 'Put the numbers in order'}</output>
    </div>
  );
}

/* 16 */ const MW = 8;
const MH = 6;
const MINES = (() => {
  const r = rng(16);
  const m = Array(MW * MH).fill(false);
  let placed = 0;
  while (placed < 7) { const i = Math.floor(r() * MW * MH); if (!m[i]) { m[i] = true; placed += 1; } }
  return m;
})();
const around = (i) => {
  const x = i % MW;
  const y = Math.floor(i / MW);
  const out = [];
  for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) if ((dx || dy) && x + dx >= 0 && x + dx < MW && y + dy >= 0 && y + dy < MH) out.push((y + dy) * MW + x + dx);
  return out;
};
const MINE_COUNT = MINES.map((_, i) => around(i).filter((j) => MINES[j]).length);
const FIRST = Math.max(0, MINE_COUNT.findIndex((n, i) => n === 0 && !MINES[i]));
const reveal = (open, i) => {
  const next = [...open];
  const stack = [i];
  while (stack.length) {
    const j = stack.pop();
    if (!next[j] && !MINES[j]) { next[j] = true; if (!MINE_COUNT[j]) stack.push(...around(j)); }
  }
  return next;
};
function MineField() {
  const [open, setOpen] = useState(() => reveal(Array(MW * MH).fill(false), FIRST));
  const [lost, setLost] = useState(false);
  const cleared = MINES.every((m, i) => m || open[i]);
  const [at, bind] = useCell(MH, MW, (r, k) => {
    const i = r * MW + k;
    if (lost || cleared) { setOpen(reveal(Array(MW * MH).fill(false), FIRST)); setLost(false); } else if (MINES[i]) setLost(true);
    else setOpen((o) => reveal(o, i));
  });
  return (
    <div className={c.box}>
      <div className={c.mines} {...bind} aria-label="Mine field, click a square to uncover it">
        {MINES.map((m, i) => <i key={i} data-open={open[i] || (lost && m)} data-mine={lost && m} data-at={i === at[0] * MW + at[1]}>{lost && m ? '✕' : open[i] && MINE_COUNT[i] ? MINE_COUNT[i] : ''}</i>)}
      </div>
      <output className={c.out}>{lost ? <b>Boom · click to retry</b> : cleared ? <b>Cleared · click to retry</b> : '7 mines, 41 squares'}</output>
    </div>
  );
}

/* 17 */ const START_BOARD = [...'rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR'];
function ChessBoard() {
  const [board, setBoard] = useState(START_BOARD);
  const [sel, setSel] = useState(-1);
  const [at, bind] = useCell(8, 8, (r, k) => {
    const i = r * 8 + k;
    if (sel < 0) { if (board[i] !== '.') setSel(i); } else {
      if (sel !== i) setBoard((b) => b.map((p, j) => (j === i ? b[sel] : j === sel ? '.' : p)));
      setSel(-1);
    }
  });
  return (
    <div className={c.box}>
      <div className={c.chess} {...bind} aria-label="Chess board, click a piece and then a square to move it">
        {board.map((p, i) => <i key={i} data-dark={(Math.floor(i / 8) + (i % 8)) % 2} data-sel={i === sel} data-at={i === at[0] * 8 + at[1]} data-w={p !== '.' && p === p.toUpperCase()}>{p === '.' ? '' : p.toUpperCase()}</i>)}
      </div>
      <output className={c.out}>{sel < 0 ? 'Pick a piece' : 'Pick where it goes'}</output>
    </div>
  );
}

/* 18 */ const KB = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
function KeyMap() {
  const [down, setDown] = useState([]);
  const [typed, setTyped] = useState('');
  const press = (k) => { setDown((d) => (d.includes(k) ? d : [...d, k])); setTyped((t) => (t + (k === ' ' ? '·' : k)).slice(-14)); };
  const release = (k) => setDown((d) => d.filter((x) => x !== k));
  const keyOf = (e) => (e.key === ' ' ? ' ' : /^[a-z]$/i.test(e.key) ? e.key.toUpperCase() : null);
  return (
    <div className={c.kb} role="application" aria-label="Key map, press letter keys to light them" tabIndex={0} onBlur={() => setDown([])}
      onKeyDown={(e) => { const k = keyOf(e); if (k) { e.preventDefault(); if (!e.repeat) press(k); } }}
      onKeyUp={(e) => { const k = keyOf(e); if (k) release(k); }}>
      {KB.map((row, r) => (
        <p key={row} style={{ '--r': r }}>
          {[...row].map((k) => <i key={k} data-down={down.includes(k)} onPointerDown={() => press(k)} onPointerUp={() => release(k)} onPointerLeave={() => release(k)}>{k}</i>)}
        </p>
      ))}
      <p><i className={c.space} data-down={down.includes(' ')} onPointerDown={() => press(' ')} onPointerUp={() => release(' ')} onPointerLeave={() => release(' ')}>space</i></p>
      <output>{typed || 'press some keys'}</output>
    </div>
  );
}

/* 19 */ const TAPE_TEXT = 'MATRICES AND GRIDS';
function PaperTape() {
  const [i, bind] = useScan(TAPE_TEXT.length, { label: (k) => `${TAPE_TEXT[k]}, code ${TAPE_TEXT.charCodeAt(k)}` });
  return (
    <div className={c.box}>
      <div className={c.tape} {...bind} aria-label="Paper tape, move along it to read the characters">
        {[...TAPE_TEXT].map((ch, k) => (
          <span key={k} data-hot={k === i}>
            {[7, 6, 5, 4].map((b) => <i key={b} data-on={(ch.charCodeAt(0) >> b) & 1} />)}
            <u />
            {[3, 2, 1, 0].map((b) => <i key={b} data-on={(ch.charCodeAt(0) >> b) & 1} />)}
          </span>
        ))}
      </div>
      <output className={c.out}>{i < 0 ? 'Move along the tape' : <>“{TAPE_TEXT[i] === ' ' ? '␣' : TAPE_TEXT[i]}” · <b>{TAPE_TEXT.charCodeAt(i).toString(2).padStart(8, '0')}</b></>}</output>
    </div>
  );
}

/* 20 */ const BRAILLE = { a: '1', b: '12', c: '14', d: '145', e: '15', f: '124', g: '1245', h: '125', i: '24', j: '245', k: '13', l: '123', m: '134', n: '1345', o: '135', p: '1234', q: '12345', r: '1235', s: '234', t: '2345', u: '136', v: '1236', w: '2456', x: '1346', y: '13456', z: '1356' };
const BRAILLE_ORDER = [1, 4, 2, 5, 3, 6];
function BrailleCells() {
  const [text, setText] = useState('grid');
  const letters = [...text.toLowerCase()].filter((ch) => BRAILLE[ch]);
  return (
    <div className={c.box}>
      <input className={c.input} value={text} maxLength={8} aria-label="Text to turn into braille" onChange={(e) => setText(e.target.value)} />
      <div className={c.braille}>
        {letters.map((ch, k) => (
          <span key={k} aria-label={ch}>{BRAILLE_ORDER.map((d) => <i key={d} data-on={BRAILLE[ch].includes(d)} />)}</span>
        ))}
      </div>
    </div>
  );
}

/* 21 */ function BitGrid() {
  const [bytes, setBytes] = useState([255, 51, 51]);
  const [at, bind] = useCell(3, 8, (r, k) => setBytes((b) => b.map((v, i) => (i === r ? v ^ (128 >> k) : v))));
  const hex = `#${bytes.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  return (
    <div className={c.bits}>
      <div className={c.bitGrid} {...bind} aria-label="Bit grid, click a bit to flip it">
        {bytes.map((v, r) => [...Array(8)].map((_, k) => <i key={`${r}-${k}`} data-on={(v >> (7 - k)) & 1} data-at={r === at[0] && k === at[1]} />))}
      </div>
      <p><u style={{ background: hex }} /><output>{hex}</output></p>
    </div>
  );
}

/* 22 */ const DUMP = [...'HEX DUMP: EVERY BYTE IS A CELL AND EVERY CELL IS A LETTER. HOVER IT!'.padEnd(72, ' ').slice(0, 72)];
function HexDump() {
  const [at, bind] = useCell(6, 12);
  const sel = at[0] * 12 + at[1];
  return (
    <div className={c.box}>
      <div className={c.dump}>
        <div className={c.hex} {...bind} aria-label="Hex dump, move over the bytes or use the arrow keys">
          {DUMP.map((ch, i) => <i key={i} data-sel={i === sel} data-row={at[0] >= 0 && Math.floor(i / 12) === at[0]}>{ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}</i>)}
        </div>
        <div className={c.ascii} aria-hidden="true">
          {DUMP.map((ch, i) => <i key={i} data-sel={i === sel}>{ch === ' ' ? '·' : ch}</i>)}
        </div>
      </div>
      <output className={c.out}>{at[0] < 0 ? 'Move over the bytes' : <>offset <b>0x{sel.toString(16).toUpperCase().padStart(2, '0')}</b> · “{DUMP[sel]}”</>}</output>
    </div>
  );
}

/* 23 */ const QUAD = [['Do first', ['Fix leak', 'Call back']], ['Plan', ['Redesign', 'Learn']], ['Hand off', ['Invoices']], ['Drop', ['Inbox zero', 'Old tabs']]];
function PriorityMatrix() {
  const [k, setK] = useState(0);
  return (
    <div className={c.prio}>
      <em>urgent →</em>
      {QUAD.map(([name, chips], i) => (
        <button key={name} type="button" aria-pressed={k === i} onClick={() => setK(i)}>
          <b>{name}</b>
          {chips.map((t) => <span key={t}>{t}</span>)}
        </button>
      ))}
    </div>
  );
}

/* 24 */ const risk = (r, k) => (5 - r) * (k + 1);
const riskName = (s) => (s <= 4 ? 'Low' : s <= 9 ? 'Moderate' : s <= 16 ? 'High' : 'Severe');
function RiskMatrix() {
  const [at, bind] = useCell(5, 5);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.risk}>
        <em>likelihood ↑</em>
        <div {...bind} aria-label="Risk matrix, move over it or use the arrow keys">
          {Array.from({ length: 25 }, (_, i) => <i key={i} style={{ '--s': risk(Math.floor(i / 5), i % 5) / 25 }} data-sel={Math.floor(i / 5) === r && i % 5 === k} />)}
        </div>
        <em>impact →</em>
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the matrix' : <>Score <b>{risk(r, k)}</b> · {riskName(risk(r, k))}</>}</output>
    </div>
  );
}

/* 25 */ const OPS = [['AND', (a, b) => a & b], ['OR', (a, b) => a | b], ['XOR', (a, b) => a ^ b], ['NAND', (a, b) => 1 - (a & b)]];
function TruthTable() {
  const [k, setK] = useState(0);
  return (
    <div className={c.truth}>
      <div className={c.seg} role="group" aria-label="Operator">
        {OPS.map(([n], i) => <button key={n} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{n}</button>)}
      </div>
      <table>
        <thead><tr><th>A</th><th>B</th><th>{OPS[k][0]}</th></tr></thead>
        <tbody>{[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => <tr key={`${a}${b}`}><td>{a}</td><td>{b}</td><td data-one={OPS[k][1](a, b) === 1}>{OPS[k][1](a, b)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

/* 26 */ const PLANS = ['Basic', 'Plus', 'Max'];
const FEATURES = [['Search', [1, 1, 1]], ['Export', [0, 1, 1]], ['Share', [0, 1, 1]], ['Audit', [0, 0, 1]], ['Custom', [0, 0, 1]]];
function PlanTable() {
  const [k, setK] = useState(1);
  return (
    <table className={c.plans}>
      <thead>
        <tr><th />{PLANS.map((p, i) => <th key={p} data-sel={k === i}><button type="button" aria-pressed={k === i} onClick={() => setK(i)}>{p}</button></th>)}</tr>
      </thead>
      <tbody>{FEATURES.map(([n, v]) => <tr key={n}><th scope="row">{n}</th>{v.map((x, i) => <td key={i} data-sel={k === i}>{x ? '✓' : '—'}</td>)}</tr>)}</tbody>
    </table>
  );
}

/* 27 */ const PIVOT = (() => {
  const r = rng(27);
  return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 5 + Math.floor(r() * 55)));
})();
const PIVOT_ROWS = PIVOT.map((row) => row.reduce((a, b) => a + b, 0));
const PIVOT_COLS = [0, 1, 2, 3].map((k) => PIVOT.reduce((a, row) => a + row[k], 0));
function PivotTable() {
  const [at, bind] = useCell(4, 4);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.pivot}>
        <div className={c.pv} {...bind} aria-label="Pivot table, move over it or use the arrow keys">
          {PIVOT.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} data-hot={i === r || j === k} data-sel={i === r && j === k}>{v}</i>))}
        </div>
        <div className={c.pvTot} aria-hidden="true">{PIVOT_ROWS.map((v, i) => <i key={i} data-hot={i === r}>{v}</i>)}</div>
        <div className={c.pvFoot} aria-hidden="true">{PIVOT_COLS.map((v, j) => <i key={j} data-hot={j === k}>{v}</i>)}</div>
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the table' : <>Cell <b>{PIVOT[r][k]}</b> · row {PIVOT_ROWS[r]} · column {PIVOT_COLS[k]}</>}</output>
    </div>
  );
}

/* 28 */ const BUSY_START = (() => {
  const r = rng(28);
  return Array.from({ length: 30 }, () => r() < 0.34);
})();
const DAYS5 = ['M', 'T', 'W', 'T', 'F'];
function Timetable() {
  const [busy, setBusy] = useState(BUSY_START);
  const [at, bind] = useCell(6, 5, (r, k) => setBusy((b) => b.map((x, i) => (i === r * 5 + k ? !x : x))));
  return (
    <div className={c.box}>
      <div className={c.ttWrap}>
        <span>{DAYS5.map((d, i) => <em key={i}>{d}</em>)}</span>
        <div className={c.slots} {...bind} aria-label="Timetable, click a slot to mark it busy or free">
          {busy.map((b, i) => <i key={i} data-busy={b} data-at={i === at[0] * 5 + at[1]} />)}
        </div>
      </div>
      <output className={c.out}><b>{busy.filter((x) => !x).length}</b> slots free</output>
    </div>
  );
}

/* 29 */ const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function MonthGrid() {
  const [m, setM] = useState(9);
  const [day, setDay] = useState(14);
  const lead = new Date(2026, m, 1).getDay();
  const days = new Date(2026, m + 1, 0).getDate();
  return (
    <div className={c.month}>
      <p>
        <button type="button" aria-label="Previous month" onClick={() => setM((v) => (v + 11) % 12)}>‹</button>
        <b>{MONTHS[m]} 2026</b>
        <button type="button" aria-label="Next month" onClick={() => setM((v) => (v + 1) % 12)}>›</button>
      </p>
      <div>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <em key={i}>{d}</em>)}
        {Array.from({ length: lead }, (_, i) => <u key={`l${i}`} />)}
        {Array.from({ length: days }, (_, i) => <button key={i} type="button" aria-label={`${MONTHS[m]} ${i + 1}`} aria-pressed={day === i + 1} onClick={() => setDay(i + 1)}>{i + 1}</button>)}
      </div>
    </div>
  );
}

/* 30 */ function MiniSheet() {
  const [v, setV] = useState(['12', '8', '15', '4', '22', '9', '30', '6', '11']);
  const n = (i) => Number(v[i]) || 0;
  const rowSum = (r) => n(r * 3) + n(r * 3 + 1) + n(r * 3 + 2);
  const colSum = (k) => n(k) + n(3 + k) + n(6 + k);
  return (
    <div className={c.sheet}>
      {[0, 1, 2].map((r) => (
        <p key={r}>
          {[0, 1, 2].map((k) => <input key={k} type="number" value={v[r * 3 + k]} aria-label={`Cell ${'ABC'[k]}${r + 1}`} onChange={(e) => setV((p) => p.map((x, i) => (i === r * 3 + k ? e.target.value : x)))} />)}
          <b>{rowSum(r)}</b>
        </p>
      ))}
      <p><b>{colSum(0)}</b><b>{colSum(1)}</b><b>{colSum(2)}</b><b className={c.grand}>{rowSum(0) + rowSum(1) + rowSum(2)}</b></p>
    </div>
  );
}

/* 31 */ const RULE30 = (() => {
  let row = Array.from({ length: 23 }, (_, i) => i === 11);
  const out = [row];
  for (let g = 0; g < 10; g += 1) {
    const prev = row;
    row = prev.map((_, i) => { const a = prev[i - 1] ? 1 : 0; const b = prev[i] ? 1 : 0; const d = prev[i + 1] ? 1 : 0; return ((30 >> (a * 4 + b * 2 + d)) & 1) === 1; });
    out.push(row);
  }
  return out;
})();
function CellularRows() {
  return (
    <div className={c.auto} role="img" aria-label="A cellular automaton growing row by row">
      {RULE30.map((row, r) => <p key={r} style={{ '--r': r }}>{row.map((on, i) => <i key={i} data-on={on} />)}</p>)}
    </div>
  );
}

/* 32 */ function PascalTriangle() {
  const [i, bind] = useScan(12, { axis: 'y', label: (k) => `Row ${k}, sum ${2 ** k}` });
  return (
    <div className={c.box}>
      <div className={c.pascal} {...bind} aria-label="Pascal's triangle with odd numbers lit, move down the rows">
        {Array.from({ length: 12 }, (_, n) => <p key={n} data-hot={n === i}>{Array.from({ length: n + 1 }, (_, k) => <i key={k} data-on={(n & k) === k} />)}</p>)}
      </div>
      <output className={c.out}>{i < 0 ? 'Move down the rows' : <>Row <b>{i}</b> · sum <b>{2 ** i}</b></>}</output>
    </div>
  );
}

/* 33 */ const mixHex = (col, row) => {
  const t = col / 7;
  const k = 1 - row * 0.17;
  const rgb = [255, 255 - 204 * t, 255 - 204 * t].map((v) => Math.round(v * k));
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
};
function SwatchMatrix() {
  const [sel, setSel] = useState([1, 5]);
  const [at, bind] = useCell(5, 8, (r, k) => setSel([r, k]));
  const hex = mixHex(sel[1], sel[0]);
  return (
    <div className={c.box}>
      <div className={c.swatches} {...bind} aria-label="Swatch matrix, click a colour">
        {Array.from({ length: 40 }, (_, i) => <i key={i} style={{ background: mixHex(i % 8, Math.floor(i / 8)) }} data-sel={Math.floor(i / 8) === sel[0] && i % 8 === sel[1]} data-at={i === at[0] * 8 + at[1]} />)}
      </div>
      <output className={c.out}><u style={{ background: hex }} /> <b>{hex}</b></output>
    </div>
  );
}

/* 34 */ const WORDS = [['GRID', 0, 1, 0, 1], ['CELL', 1, 6, 1, 0], ['DOT', 5, 0, 0, 1], ['BIT', 7, 2, 0, 1], ['ROW', 2, 0, 1, 1]];
const SEARCH = (() => {
  const r = rng(34);
  const g = Array.from({ length: 64 }, () => String.fromCharCode(65 + Math.floor(r() * 26)));
  WORDS.forEach(([w, y, x, dy, dx]) => [...w].forEach((ch, i) => { g[(y + dy * i) * 8 + x + dx * i] = ch; }));
  return g;
})();
const wordCells = ([w, y, x, dy, dx]) => [...w].map((_, i) => (y + dy * i) * 8 + x + dx * i);
function WordSearch() {
  const [k, setK] = useState(0);
  const lit = wordCells(WORDS[k]);
  return (
    <div className={c.search}>
      <div className={c.letters} role="img" aria-label="Eight by eight letter grid">
        {SEARCH.map((ch, i) => <i key={i} data-lit={lit.includes(i)}>{ch}</i>)}
      </div>
      <ul>
        {WORDS.map(([w], i) => <li key={w}><button type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button></li>)}
      </ul>
    </div>
  );
}

/* 35 */ const DECK = [0, 3, 1, 5, 2, 4, 3, 0, 5, 1, 4, 2];
const GLYPHS = ['●', '■', '▲', '◆', '★', '✚'];
function MemoryFlip() {
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  useEffect(() => {
    if (open.length < 2) return undefined;
    const match = DECK[open[0]] === DECK[open[1]];
    const id = window.setTimeout(() => { if (match) setDone((d) => [...d, ...open]); setOpen([]); }, match ? 350 : 850);
    return () => window.clearTimeout(id);
  }, [open]);
  const won = done.length === 12;
  const [at, bind] = useCell(3, 4, (r, k) => {
    const i = r * 4 + k;
    if (won) { setDone([]); setOpen([]); return; }
    if (open.length < 2 && !open.includes(i) && !done.includes(i)) setOpen((o) => [...o, i]);
  });
  return (
    <div className={c.box}>
      <div className={c.memory} {...bind} aria-label="Memory game, click cards to find the pairs">
        {DECK.map((g, i) => <i key={i} data-up={open.includes(i) || done.includes(i)} data-done={done.includes(i)} data-at={i === at[0] * 4 + at[1]}><b>{GLYPHS[g]}</b></i>)}
      </div>
      <output className={c.out}>{won ? <b>All paired · click to shuffle</b> : <><b>{done.length / 2}</b> of 6 pairs</>}</output>
    </div>
  );
}

/* 36 */ const LINES3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const winner = (b) => { const l = LINES3.find(([x, y, z]) => b[x] && b[x] === b[y] && b[x] === b[z]); return l ? b[l[0]] : null; };
const reply = (b) => {
  const free = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  const wins = (who) => free.find((i) => winner(b.map((v, j) => (j === i ? who : v))) === who);
  const pick = wins('O') ?? wins('X') ?? [4, 0, 2, 6, 8, 1, 3, 5, 7].find((i) => free.includes(i));
  return pick === undefined ? b : b.map((v, i) => (i === pick ? 'O' : v));
};
function NoughtsGrid() {
  const [b, setB] = useState(Array(9).fill(''));
  const w = winner(b);
  const over = w || b.every(Boolean);
  const [at, bind] = useCell(3, 3, (r, k) => {
    const i = r * 3 + k;
    if (over) { setB(Array(9).fill('')); return; }
    if (b[i]) return;
    const next = b.map((v, j) => (j === i ? 'X' : v));
    setB(winner(next) || next.every(Boolean) ? next : reply(next));
  });
  return (
    <div className={c.box}>
      <div className={c.noughts} {...bind} aria-label="Noughts and crosses, click a square to play X">
        {b.map((v, i) => <i key={i} data-v={v} data-at={i === at[0] * 3 + at[1]}>{v}</i>)}
      </div>
      <output className={c.out}>{w ? <b>{w === 'X' ? 'You win' : 'O wins'} · click to restart</b> : over ? <b>Draw · click to restart</b> : 'Your move, X'}</output>
    </div>
  );
}

/* 37 */ const FW = 7;
const FH = 6;
const four = (b) => {
  for (let y = 0; y < FH; y += 1) {
    for (let x = 0; x < FW; x += 1) {
      const v = b[y * FW + x];
      if (v) for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
        if ([1, 2, 3].every((n) => { const xx = x + dx * n; const yy = y + dy * n; return xx >= 0 && xx < FW && yy >= 0 && yy < FH && b[yy * FW + xx] === v; })) return v;
      }
    }
  }
  return null;
};
const drop = (b, col, who) => {
  for (let y = FH - 1; y >= 0; y -= 1) if (!b[y * FW + col]) return b.map((v, i) => (i === y * FW + col ? who : v));
  return null;
};
const aiDrop = (b) => {
  const cols = [3, 2, 4, 1, 5, 0, 6].filter((k) => drop(b, k, 'W'));
  const win = (who) => cols.find((k) => four(drop(b, k, who)) === who);
  const k = win('W') ?? win('R') ?? cols[0];
  return k === undefined ? b : drop(b, k, 'W');
};
function DropFour() {
  const [b, setB] = useState(Array(FW * FH).fill(''));
  const w = four(b);
  const over = w || b.every(Boolean);
  const [at, bind] = useCell(FH, FW, (r, k) => {
    if (over) { setB(Array(FW * FH).fill('')); return; }
    const next = drop(b, k, 'R');
    if (next) setB(four(next) ? next : aiDrop(next));
  });
  return (
    <div className={c.box}>
      <div className={c.four} {...bind} aria-label="Drop four, click a column to drop a disc">
        {b.map((v, i) => <i key={i} data-v={v} data-col={at[1] === i % FW} />)}
      </div>
      <output className={c.out}>{w ? <b>{w === 'R' ? 'You win' : 'White wins'} · click to restart</b> : over ? <b>Full · click to restart</b> : 'Drop a red disc in a column'}</output>
    </div>
  );
}

/* 38 */ const SHIPS = [[0, 1, 4, 'h'], [2, 6, 3, 'v'], [5, 2, 3, 'h'], [7, 5, 2, 'h']];
const FLEET = new Set(SHIPS.flatMap(([y, x, n, d]) => Array.from({ length: n }, (_, i) => (d === 'h' ? y * 8 + x + i : (y + i) * 8 + x))));
function FleetGrid() {
  const [shots, setShots] = useState(() => Array(64).fill(0));
  const hits = shots.filter((s) => s === 2).length;
  const won = hits === FLEET.size;
  const [at, bind] = useCell(8, 8, (r, k) => {
    const i = r * 8 + k;
    if (won) { setShots(Array(64).fill(0)); return; }
    if (!shots[i]) setShots((s) => s.map((v, j) => (j === i ? (FLEET.has(i) ? 2 : 1) : v)));
  });
  return (
    <div className={c.box}>
      <div className={c.fleet} {...bind} aria-label="Fleet grid, click squares to fire">
        {shots.map((s, i) => <i key={i} data-s={s} data-at={i === at[0] * 8 + at[1]} />)}
      </div>
      <output className={c.out}>{won ? <b>Fleet found · click to reset</b> : <>Hits <b>{hits}</b> of {FLEET.size} · shots {shots.filter(Boolean).length}</>}</output>
    </div>
  );
}

/* 39 */ const COEF = (v) => +(v * 3 - 1.5).toFixed(2);
function TransformGrid() {
  const [a, ba] = useDrag({ init: 0.8 });
  const [b, bb] = useDrag({ init: 0.58 });
  const [cc, bc] = useDrag({ init: 0.4 });
  const [d, bd] = useDrag({ init: 0.78 });
  const m = [COEF(a), COEF(b), COEF(cc), COEF(d)];
  const sliders = [['a', ba, a], ['b', bb, b], ['c', bc, cc], ['d', bd, d]];
  return (
    <div className={c.xform}>
      <div className={c.plane} aria-hidden="true">
        <svg viewBox="-5 -5 10 10" style={{ transform: `matrix(${m[0]}, ${-m[2]}, ${-m[1]}, ${m[3]}, 0, 0)` }}>
          {Array.from({ length: 11 }, (_, i) => <path key={`h${i}`} d={`M-5 ${i - 5}H5M${i - 5} -5V5`} />)}
          <path className={c.glyph} d="M-1.5 2.5V-2.5H1.5M-1.5 0H0.8" />
        </svg>
      </div>
      <div className={c.coefs}>
        {sliders.map(([n, bind, v]) => (
          <p key={n}><em>{n}</em><span {...bind} aria-label={`Matrix value ${n}`} style={{ ...bind.style, '--v': v }}><i /></span><b>{COEF(v).toFixed(2)}</b></p>
        ))}
        <output>det {(m[0] * m[3] - m[1] * m[2]).toFixed(2)}</output>
      </div>
    </div>
  );
}

/* 40 */ const MA = [[1, 2, 0], [0, 1, 3], [2, 0, 1]];
const MB = [[1, 0, 2], [3, 1, 0], [0, 2, 1]];
const MC = MA.map((row) => [0, 1, 2].map((k) => row.reduce((s, v, i) => s + v * MB[i][k], 0)));
function ProductGrid() {
  const [at, bind] = useCell(3, 3);
  const [r, k] = at;
  return (
    <div className={c.box}>
      <div className={c.product}>
        <div className={c.mat}>{MA.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} data-hot={i === r}>{v}</i>))}</div>
        <span>×</span>
        <div className={c.mat}>{MB.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} data-hot={j === k}>{v}</i>))}</div>
        <span>=</span>
        <div className={c.mat} {...bind} aria-label="Product matrix, move over a cell to see how it is made">
          {MC.map((row, i) => row.map((v, j) => <i key={`${i}-${j}`} data-sel={i === r && j === k}>{v}</i>))}
        </div>
      </div>
      <output className={c.out}>{r < 0 ? 'Move over the result' : <>{MA[r].map((v, i) => `${v}×${MB[i][k]}`).join(' + ')} = <b>{MC[r][k]}</b></>}</output>
    </div>
  );
}

/* 41 */ function LampGrid() {
  const [at, bind] = useCell(6, 10);
  return (
    <div className={c.box}>
      <div className={c.lamps} {...bind} aria-label="Lamp grid, move over it and the nearby lamps light" data-idle={at[0] < 0} style={at[0] < 0 ? bind.style : { ...bind.style, '--hy': at[0], '--hx': at[1] }}>
        {Array.from({ length: 60 }, (_, i) => <i key={i} style={{ '--cx': i % 10, '--cy': Math.floor(i / 10) }} />)}
      </div>
    </div>
  );
}

/* 42 */ function EqualizerGrid() {
  return (
    <div className={c.eq} role="img" aria-label="An equalizer made of dots">
      {Array.from({ length: 16 }, (_, k) => (
        <span key={k} style={{ animationDuration: `${1.4 + (k % 5) * 0.37}s`, animationDelay: `${-k * 0.23}s` }}>
          {Array.from({ length: 8 }, (_, r) => <i key={r} style={{ '--r': r }} />)}
        </span>
      ))}
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Heat matrix', HeatMatrix, 'hover'], ['Correlation grid', CorrelationGrid, 'hover'], ['Confusion matrix', ConfusionMatrix, 'click'], ['Times table', TimesTable, 'hover'],
    ['Sortable table', SortableTable, 'click'], ['Scroll table', ScrollTable, 'scroll'], ['Dot clock', DotClock, 'auto'], ['Pixel marquee', PixelMarquee, 'auto'],
    ['Life grid', LifeGrid, 'click'], ['Pixel pad', PixelPad, 'drag'], ['Seat map', SeatMap, 'click'], ['Bingo card', BingoCard, 'click'],
    ['Sudoku peek', SudokuPeek, 'hover'], ['Lights out', LightsOut, 'click'], ['Tile puzzle', TilePuzzle, 'click'], ['Mine field', MineField, 'click'],
    ['Chess board', ChessBoard, 'click'], ['Key map', KeyMap, 'keys'], ['Paper tape', PaperTape, 'hover'], ['Braille cells', BrailleCells, 'type'],
    ['Bit grid', BitGrid, 'click'], ['Hex dump', HexDump, 'hover'], ['Priority matrix', PriorityMatrix, 'click'], ['Risk matrix', RiskMatrix, 'hover'],
    ['Truth table', TruthTable, 'click'], ['Plan table', PlanTable, 'click'], ['Pivot table', PivotTable, 'hover'], ['Timetable', Timetable, 'click'],
    ['Month grid', MonthGrid, 'click'], ['Mini sheet', MiniSheet, 'type'], ['Cellular rows', CellularRows, 'auto'], ['Pascal triangle', PascalTriangle, 'hover'],
    ['Swatch matrix', SwatchMatrix, 'click'], ['Word search', WordSearch, 'click'], ['Memory flip', MemoryFlip, 'click'], ['Noughts grid', NoughtsGrid, 'click'],
    ['Drop four', DropFour, 'click'], ['Fleet grid', FleetGrid, 'click'], ['Transform grid', TransformGrid, 'drag'], ['Product grid', ProductGrid, 'hover'],
    ['Lamp grid', LampGrid, 'hover'], ['Equalizer grid', EqualizerGrid, 'auto'],
  ],
};
