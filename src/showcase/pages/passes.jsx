import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag, useLive, useTick, useToggle, rng, clamp, pad2 } from '../hooks';
import { useHot, usePoint, f1 } from '../kit';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import c from './passes.module.css';

/* ============================================================
   20 · PASSES — tickets, receipts and badges.
   A line runs down the middle of the page and a pass hangs from either side of it.
   The medallion that rides the line is a pass of its own: a code prints itself row
   by row as you scroll, a ring of forty-two punch holes fills one for each pass
   you have passed, and the counter in the middle is written by CSS. Everything
   below is something you could be handed at a door — boarding passes to tear,
   stamps to land, codes to scan, badges to swing.
   ============================================================ */

/* ---- the medallion on the line: a code that prints as you scroll ---- */
const QR_N = 15;
const QR = (() => {
  const r = rng(404);
  const out = [];
  const finder = (y0, x0) => {
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        if (x === 0 || y === 0 || x === 4 || y === 4 || (x === 2 && y === 2)) out.push({ x: x0 + x, y: y0 + y, d: 0.02 + (y * 5 + x) * 0.002 });
      }
    }
  };
  finder(0, 0); finder(0, 10); finder(10, 0);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      if (x === 0 || y === 0 || x === 4 || y === 4 || (x === 2 && y === 2)) out.push({ x: 9 + x, y: 9 + y, d: 0.05 + y * 0.01 });
    }
  }
  for (let y = 0; y < QR_N; y += 1) {
    for (let x = 0; x < QR_N; x += 1) {
      const inFinder = (y < 6 && (x < 6 || x > 8)) || (y > 8 && x < 6);
      const inAlign = x >= 9 && x <= 13 && y >= 9 && y <= 13;
      if (inFinder || inAlign) continue;
      if (r() < 0.5) out.push({ x, y, d: 0.08 + (y / QR_N) * 0.76 + r() * 0.1 });
    }
  }
  return out;
})();

function Visual() {
  return (
    <div className={c.medal} aria-hidden="true">
      <i className={c.medalRing} />
      {Array.from({ length: 42 }, (_, i) => <i key={i} className={c.punch} style={{ '--i': i }} />)}
      <p className={c.medalTop}>Admit one</p>
      <div className={c.qr}>
        {QR.map((q) => <i key={`${q.x}.${q.y}`} style={{ '--x': q.x, '--y': q.y, '--d': q.d.toFixed(3) }} />)}
        <b className={c.beam} />
      </div>
      <p className={c.medalNo} />
      <p className={c.valid}>Valid</p>
    </div>
  );
}

/* ---- helpers ---- */

/** A flag that switches itself off again: [on, fire]. */
function useFlash(ms = 700) {
  const [on, setOn] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const fire = useCallback(() => {
    setOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }, [ms]);
  return [on, fire];
}

/** Bar widths for a barcode: the same bars for the same seed. */
const barsOf = (seed, n) => {
  const r = rng(seed);
  let x = 0;
  const rects = [];
  for (let i = 0; i < n; i += 1) {
    const w = 1 + Math.floor(r() * 3);
    rects.push([x, w]);
    x += w + 1 + Math.floor(r() * 2);
  }
  return { rects, width: x };
};
const BC = { a: barsOf(11, 34), b: barsOf(23, 30), c: barsOf(37, 26), d: barsOf(51, 40), e: barsOf(7, 22) };

function Barcode({ code, className = '' }) {
  return (
    <svg className={`${c.bars} ${className}`} viewBox={`0 0 ${code.width} 24`} preserveAspectRatio="none" aria-hidden="true">
      {code.rects.map(([x, w]) => <rect key={x} x={x} y="0" width={w} height="24" />)}
    </svg>
  );
}

/** A rectangle whose edges are bitten by half-circles: nx along the top and bottom, ny down the sides. */
const perf = (w, h, r, nx, ny) => {
  let d = 'M0 0';
  for (let k = 0; k < nx; k += 1) { const x = ((k + 0.5) * w) / nx; d += `L${f1(x - r)} 0A${r} ${r} 0 0 0 ${f1(x + r)} 0`; }
  d += `L${w} 0`;
  for (let k = 0; k < ny; k += 1) { const y = ((k + 0.5) * h) / ny; d += `L${w} ${f1(y - r)}A${r} ${r} 0 0 0 ${w} ${f1(y + r)}`; }
  d += `L${w} ${h}`;
  for (let k = nx - 1; k >= 0; k -= 1) { const x = ((k + 0.5) * w) / nx; d += `L${f1(x + r)} ${h}A${r} ${r} 0 0 0 ${f1(x - r)} ${h}`; }
  d += `L0 ${h}`;
  for (let k = ny - 1; k >= 0; k -= 1) { const y = ((k + 0.5) * h) / ny; d += `L0 ${f1(y + r)}A${r} ${r} 0 0 0 0 ${f1(y - r)}`; }
  return `${d}Z`;
};

/* 1 */
function BoardingPass() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.bp} data-hot={hot} aria-label="Boarding pass: hover, tap or press Enter to start boarding" {...bind}>
      <span className={c.bpMain}>
        <span className={c.kp}>Boarding pass · HX 214</span>
        <span className={c.bpRoute}>
          <b>KRA</b>
          <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 11 22 3l-7 18-3-7z" /></svg></i>
          <b>MOL</b>
        </span>
        <span className={c.bpFields}>
          <span><em>Passenger</em>A. Ledger</span>
          <span><em>Gate</em>12</span>
          <span><em>Boards</em>09:40</span>
        </span>
      </span>
      <span className={c.bpStub}>
        <span className={c.kp}>Seat</span>
        <b>14C</b>
        <Barcode code={BC.e} className={c.bpCode} />
      </span>
    </button>
  );
}

/* 2 */
function TearStub() {
  const [v, bind, set] = useDrag({ mode: 'x', init: 0 });
  const torn = v >= 0.97;
  return (
    <div className={c.fig}>
      <div className={c.ts} {...bind} aria-label="Drag across the ticket to tear off the stub" data-torn={torn} style={{ ...bind.style, '--t': clamp((v - 0.5) / 0.45).toFixed(3) }}>
        <span className={c.tsMain}>
          <span className={c.kp}>Admit one · row F</span>
          <b>Late show</b>
          <span className={c.tsRule} />
          <span className={c.kp}>Keep this half</span>
        </span>
        <span className={c.tsStub}>
          <span className={c.kp}>No.</span>
          <b>0371</b>
          <Barcode code={BC.c} className={c.tsCode} />
        </span>
      </div>
      <p className={c.row}>
        <span className={c.k}>{torn ? 'Torn clean' : 'Drag across to tear'}</span>
        <button type="button" className={c.btn} onClick={() => set(0)}>Reset</button>
      </p>
    </div>
  );
}

/* 3 */
const SCR_W = 288;
const SCR_H = 96;
function paintFoil(cv) {
  const g = cv?.getContext('2d');
  if (!g) return;
  g.globalCompositeOperation = 'source-over';
  const grad = g.createLinearGradient(0, 0, SCR_W, SCR_H);
  grad.addColorStop(0, '#7e818a');
  grad.addColorStop(0.45, '#dcdde2');
  grad.addColorStop(1, '#6f727b');
  g.fillStyle = grad;
  g.fillRect(0, 0, SCR_W, SCR_H);
  g.fillStyle = 'rgba(0,0,0,0.07)';
  for (let y = 0; y < SCR_H; y += 3) g.fillRect(0, y, SCR_W, 1);
  g.fillStyle = '#4b4e56';
  g.font = '600 12px "JetBrains Mono", monospace';
  g.textAlign = 'center';
  g.fillText('SCRATCH HERE', SCR_W / 2, SCR_H / 2 + 4);
}
function ScratchPanel() {
  const cv = useRef(null);
  const down = useRef(false);
  const strokes = useRef(0);
  const [done, setDone] = useState(false);
  useEffect(() => { paintFoil(cv.current); }, []);
  const scratch = (e) => {
    const el = cv.current;
    const g = el.getContext('2d');
    if (!g) return;
    const r = el.getBoundingClientRect();
    g.globalCompositeOperation = 'destination-out';
    g.beginPath();
    g.arc(((e.clientX - r.left) / r.width) * SCR_W, ((e.clientY - r.top) / r.height) * SCR_H, 13, 0, Math.PI * 2);
    g.fill();
    strokes.current += 1;
    if (strokes.current % 5 === 0) {
      const px = g.getImageData(0, 0, SCR_W, SCR_H).data;
      let clear = 0;
      let all = 0;
      for (let i = 3; i < px.length; i += 148) { all += 1; if (px[i] === 0) clear += 1; }
      if (clear / all > 0.5) { g.clearRect(0, 0, SCR_W, SCR_H); setDone(true); }
    }
  };
  const reveal = () => { cv.current.getContext('2d')?.clearRect(0, 0, SCR_W, SCR_H); setDone(true); };
  const again = () => { paintFoil(cv.current); strokes.current = 0; setDone(false); };
  return (
    <div className={c.fig}>
      <div className={c.sp} data-done={done}>
        <span className={c.spPrize}>
          <span className={c.kp}>Prize</span>
          <b>Win 250</b>
          <i className={c.stars} aria-hidden="true"><u /><u /><u /></i>
        </span>
        <canvas
          ref={cv}
          className={c.spFoil}
          width={SCR_W}
          height={SCR_H}
          aria-label="Foil panel: scratch it with the pointer, or press the reveal button"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); down.current = true; scratch(e); }}
          onPointerMove={(e) => { if (down.current) scratch(e); }}
          onPointerUp={() => { down.current = false; }}
          onPointerCancel={() => { down.current = false; }}
        />
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} onClick={reveal}>Reveal</button>
        <button type="button" className={c.btn} onClick={again}>New card</button>
      </p>
    </div>
  );
}

/* 4 */
const RECEIPT = [['HANORYX CAFE', ''], ['TABLE 04 · 14 OCT', ''], ['Espresso', '3.20'], ['Croissant', '4.50'], ['Oat flat white', '4.80'], ['Sparkling water', '2.60'], ['Service', '1.50'], ['TOTAL', '16.60']];
function Printout() {
  const n = useTick(620);
  const t = n % (RECEIPT.length + 4);
  const shown = Math.min(t, RECEIPT.length);
  return (
    <div className={c.pr} data-cut={t === RECEIPT.length + 3}>
      <span className={c.prSheet}>
        {RECEIPT.slice(0, shown).map(([a, b], i) => (
          <span key={a} className={c.prLine} data-head={i < 2} data-total={a === 'TOTAL'}>
            <span>{a}</span><span>{b}</span>
          </span>
        ))}
      </span>
      <span className={c.prSlot}><i className="sc-led" /><span className={c.k}>Printing</span></span>
    </div>
  );
}

/* 5 */
function LanyardBadge() {
  const [v, bind, set] = useDrag({ mode: 'x', init: 0.5 });
  const [held, setHeld] = useState(false);
  const release = () => { setHeld(false); set(0.5); };
  return (
    <div
      className={c.lb}
      {...bind}
      data-held={held}
      aria-label="Lanyard badge: drag sideways to swing it, let go to watch it settle"
      style={{ ...bind.style, '--v': v.toFixed(3) }}
      onPointerDown={(e) => { setHeld(true); bind.onPointerDown(e); }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span className={c.lbSwing}>
        <span className={c.lbStrap} />
        <span className={c.lbClip} />
        <span className={c.lbCard}>
          <i className={c.lbSlot} />
          <span className={c.lbFace}>AQ</span>
          <b>A. Quill</b>
          <span className={c.lbRole}>Staff</span>
          <Barcode code={BC.b} className={c.lbCode} />
        </span>
      </span>
    </div>
  );
}

/* 6 */
function LaserScan() {
  return (
    <div className={c.ls}>
      <span className={c.kp}>Scan me</span>
      <span className={c.lsCode}>
        <Barcode code={BC.a} className={c.lsDim} />
        <Barcode code={BC.a} className={c.lsHot} />
        <i className={c.lsBeam} />
      </span>
      <span className={c.lsOut}>4 006381 333931</span>
    </div>
  );
}

/* 7 */
const STAMPS = [['ENTRY', 'circle'], ['TRANSIT', 'rect'], ['CLEARED', 'oval'], ['EXIT', 'hex'], ['RETURN', 'tri'], ['VISA OK', 'dbl']];
function StampArt({ word, kind }) {
  const shape = {
    circle: <><circle cx="30" cy="30" r="26" /><circle cx="30" cy="30" r="21" strokeWidth="0.8" /></>,
    rect: <rect x="5" y="13" width="50" height="34" rx="3" />,
    oval: <ellipse cx="30" cy="30" rx="27" ry="18" />,
    hex: <polygon points="30,4 54,17 54,43 30,56 6,43 6,17" />,
    tri: <polygon points="30,5 56,52 4,52" />,
    dbl: <><rect x="4" y="12" width="52" height="36" rx="2" /><rect x="8" y="16" width="44" height="28" rx="1" strokeWidth="0.8" /></>,
  }[kind];
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      {shape}
      <text x="30" y={kind === 'tri' ? 43 : 32} textAnchor="middle" fontSize={word.length > 6 ? 6.6 : 8} fill="currentColor" stroke="none">{word}</text>
      <text x="30" y={kind === 'tri' ? 49 : 41} textAnchor="middle" fontSize="4.6" fill="currentColor" stroke="none">14 OCT</text>
    </svg>
  );
}
function PassportPage() {
  const [n, setN] = useState(2);
  return (
    <div className={c.fig}>
      <div className={c.ps}>
        <span className={c.kd}>Visas · page 07</span>
        <span className={c.psGrid}>
          {STAMPS.map(([word, kind], i) => (
            <span key={word} className={c.psSlot}>
              {i < n && <span className={c.psStamp} data-red={i % 2 === 0} style={{ '--r': `${(i * 37) % 23 - 11}deg` }}><StampArt word={word} kind={kind} /></span>}
            </span>
          ))}
        </span>
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} disabled={n >= STAMPS.length} onClick={() => setN((k) => Math.min(STAMPS.length, k + 1))}>{n >= STAMPS.length ? 'Page full' : 'Stamp'}</button>
        <button type="button" className={c.btn} onClick={() => setN(0)}>Clear</button>
      </p>
    </div>
  );
}

/* 8 */
function TapCard() {
  const [bal, setBal] = useState(750);
  const [on, fire] = useFlash(1000);
  const low = bal < 240;
  const tap = () => { if (low) return; setBal((b) => b - 240); fire(); };
  return (
    <div className={c.fig}>
      <div className={c.tc} data-tap={on} data-low={low}>
        <span className={c.tcReader}><i /><i /><i /><em /></span>
        <span className={c.tcCard}>
          <span className={c.k}>Transit card</span>
          <b>{(bal / 100).toFixed(2)}</b>
          <span className={c.tcChip} />
        </span>
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} onClick={tap} disabled={low}>Tap in</button>
        <button type="button" className={c.btn} onClick={() => setBal((b) => b + 1000)}>Top up</button>
      </p>
    </div>
  );
}

/* 9 */
const CUT = 'M20 20H280V100H20Z';
function CutHere() {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const svg = useRef(null);
  useEffect(() => {
    const el = svg.current;
    if (!el || !el.pauseAnimations) return;
    if (live && !reduced) el.unpauseAnimations(); else el.pauseAnimations();
  }, [live, reduced]);
  return (
    <svg ref={svg} className={c.ch} viewBox="0 0 300 120" role="img" aria-label="A coupon with scissors snipping along its dashed border">
      <rect className={c.chBody} x="12" y="12" width="276" height="96" rx="6" />
      <text className={c.chBig} x="150" y="66" textAnchor="middle">20% off</text>
      <text className={c.chSmall} x="150" y="86" textAnchor="middle">CUT ALONG THE LINE</text>
      <path className={c.chDash} d={CUT} pathLength="1" />
      <path className={c.chCut} d={CUT} pathLength="1">
        <animate attributeName="stroke-dashoffset" from="1" to="0" dur="7s" repeatCount="indefinite" />
      </path>
      <g className={c.chScissors}>
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={CUT} />
        <g className={c.chChop}>
          <path d="M-6 -4 14 2.6M-6 4 14 -2.6" />
          <circle cx="-9" cy="-5.4" r="3.1" />
          <circle cx="-9" cy="5.4" r="3.1" />
        </g>
      </g>
    </svg>
  );
}

/* 10 */
function RollingCode() {
  const n = useTick(4000);
  const r = rng(n * 977 + 13);
  const cells = Array.from({ length: 81 }, (_, i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    if (x < 3 && y < 3) return !(x === 1 && y === 1);
    if (x > 5 && y < 3) return !(x === 7 && y === 1);
    if (x < 3 && y > 5) return !(x === 1 && y === 7);
    return r() < 0.5;
  });
  return (
    <div className={c.rc}>
      <span className={c.rcCode}>
        {cells.map((on, i) => <i key={i} data-on={on} />)}
        <svg viewBox="0 0 100 100" aria-hidden="true"><rect key={n} x="1" y="1" width="98" height="98" rx="9" pathLength="1" /></svg>
      </span>
      <span className={c.rcSide}>
        <span className={c.k}>One-time code</span>
        <b>{((n * 7919 + 40503) % 65536).toString(16).toUpperCase().padStart(4, '0')}</b>
        <span className={c.k}>Refreshes every 4 s</span>
      </span>
    </div>
  );
}

/* 11 */
function PostageStamp() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.pg} data-hot={hot} aria-label="Postage stamp: hover, tap or press Enter to postmark it" {...bind}>
      <svg className={c.pgStamp} viewBox="0 0 120 150" aria-hidden="true">
        <path d={perf(120, 150, 3.3, 9, 11)} fill="#eeeef1" />
        <rect x="11" y="11" width="98" height="128" fill="#0b0c0e" />
        <circle cx="60" cy="86" r="30" fill="#ff3333" />
        <path d="M18 86h84" stroke="#0b0c0e" strokeWidth="2.4" />
        <path d="M24 96h72M30 106h60M38 116h44" stroke="#0b0c0e" strokeWidth="2.4" />
        <text x="60" y="34" textAnchor="middle" fontSize="8" letterSpacing="2.4" fill="#eeeef1">FIRST CLASS</text>
        <text x="20" y="130" fontSize="15" fill="#eeeef1">1.00</text>
        <text x="100" y="130" textAnchor="end" fontSize="6" letterSpacing="1.6" fill="#eeeef1">HNX</text>
      </svg>
      <svg className={c.pgMark} viewBox="0 0 140 70" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="36" cy="35" r="27" />
        <circle cx="36" cy="35" r="20" strokeWidth="0.8" />
        <text x="36" y="33" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none">14 OCT</text>
        <text x="36" y="42" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none">HNX POST</text>
        <path d="M70 18q9-7 18 0t18 0t18 0M70 30q9-7 18 0t18 0t18 0M70 42q9-7 18 0t18 0t18 0M70 54q9-7 18 0t18 0t18 0" />
      </svg>
    </button>
  );
}

/* 12 */
function NameSticker() {
  const [name, setName] = useState('Ada');
  return (
    <div className={c.fig}>
      <div className={c.ns} style={{ '--n': Math.max(5, name.length) }}>
        <b>Hello</b>
        <span className={c.nsLine}>my name is</span>
        <span className={c.nsName} key={name.length}>{name.trim() || '…'}</span>
      </div>
      <label className={c.nsField}>
        <span className={c.k}>Name</span>
        <input value={name} maxLength={14} onChange={(e) => setName(e.target.value)} aria-label="Name for the sticker" spellCheck="false" autoComplete="off" />
      </label>
    </div>
  );
}

/* 13 */
const SEAT_ROWS = 5;
const SEAT_TAKEN = (() => { const r = rng(88); return new Set(Array.from({ length: 9 }, () => `${1 + Math.floor(r() * SEAT_ROWS)}${'ABCDEF'[Math.floor(r() * 6)]}`)); })();
function SeatChooser() {
  const [sel, setSel] = useState('3C');
  return (
    <div className={c.fig}>
      <div className={c.sc} role="group" aria-label="Seat map">
        {Array.from({ length: SEAT_ROWS }, (_, r) => (
          <span key={r} className={c.scRow}>
            <em>{r + 1}</em>
            {'ABCDEF'.split('').map((l, k) => {
              const id = `${r + 1}${l}`;
              return (
                <button key={id} type="button" className={c.scSeat} data-gap={k === 3} aria-pressed={sel === id} aria-label={`Seat ${id}`} disabled={SEAT_TAKEN.has(id)} onClick={() => setSel(id)} />
              );
            })}
          </span>
        ))}
      </div>
      <p className={c.row}><span className={c.k}>Seat</span><b className={c.scOut}>{sel}</b></p>
    </div>
  );
}

/* 14 */
function ParkingStub() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.25, steps: 8 });
  const h = Math.round(v * 8);
  const out = 9 * 60 + 12 + h * 60;
  return (
    <div className={c.fig}>
      <div className={c.pk}>
        <span className={c.pkHead}><span className={c.kp}>Parking · lot 3</span><span className={c.kp}>In 09:12</span></span>
        <b className={c.pkHours}>{pad2(h)}<small>h</small></b>
        <span className={c.pkOut}>{h ? `Valid until ${pad2(Math.floor(out / 60))}:${pad2(out % 60)}` : 'Slide to buy time'}</span>
        <span className={c.pkPrice}>{(h * 2.4).toFixed(2)}</span>
      </div>
      <span className={c.pkTrack} {...bind} aria-label="Hours to park" style={{ ...bind.style, '--v': v.toFixed(3) }}><i /></span>
    </div>
  );
}

/* 15 */
function HoloSeal() {
  const [p, bind] = usePoint();
  const x = p ? p.x : 50;
  const y = p ? p.y : 50;
  return (
    <div className={c.fig}>
      <div className={c.hs} {...bind} aria-label="Hologram seal: move the pointer over it to move the light" style={{ ...bind.style, '--lx': x.toFixed(1), '--ly': y.toFixed(1) }}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs><path id="hs-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" /></defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
          <text fontSize="6.6" fill="currentColor"><textPath href="#hs-ring" textLength="228" lengthAdjust="spacing">GENUINE · HANORYX · GENUINE · HANORYX ·</textPath></text>
          <path d="M41 39v22M59 39v22M41 50h18" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>
      <p className={c.k}>{p ? 'Light is moving' : 'Move over the seal'}</p>
    </div>
  );
}

/* 16 */
function WaxEnvelope() {
  const [open, flip] = useToggle(false);
  return (
    <div className={c.fig}>
      <button type="button" className={c.we} data-open={open} aria-pressed={open} aria-label="Wax-sealed envelope: press to break the seal" onClick={flip}>
        <span className={c.weBack} />
        <span className={c.weCard}><span className={c.kp}>You are invited</span><b>Admit one</b></span>
        <span className={c.weFront} />
        <span className={c.weFlap} />
        <span className={c.weSeal}><i /><i /></span>
      </button>
    </div>
  );
}

/* 17 */
function NumberDispenser() {
  const [taken, setTaken] = useState(41);
  const [serving, setServing] = useState(38);
  return (
    <div className={c.fig}>
      <div className={c.nd}>
        <span className={c.ndBox}>
          <span className={c.kd}>Take a number</span>
          <span className={c.ndSlot}><span className={c.ndTicket} key={taken}><b>{pad2(taken)}</b></span></span>
        </span>
        <span className={c.ndBoard}>
          <span className={c.kd}>Now serving</span>
          <b>{pad2(serving)}</b>
          <span className={c.kd}>{taken - serving} waiting</span>
        </span>
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} onClick={() => setTaken((n) => n + 1)}>Take</button>
        <button type="button" className={c.btn} disabled={serving >= taken} onClick={() => setServing((n) => n + 1)}>Call next</button>
      </p>
    </div>
  );
}

/* 18 */
function LuggageTag() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.lt} data-hot={hot} aria-label="Luggage tag: hover, tap or press Enter to swing it" {...bind}>
      <span className={c.ltSwing}>
        <span className={c.ltString} />
        <span className={c.ltTag}>
          <i className={c.ltHole} />
          <span className={c.ltBand}>Priority</span>
          <b>MOL</b>
          <span className={c.kp}>A. Ledger · 23 kg</span>
          <Barcode code={BC.d} className={c.ltCode} />
        </span>
      </span>
    </button>
  );
}

/* 19 */
function KeySwipe() {
  const [v, bind, set] = useDrag({ mode: 'x', init: 0 });
  const granted = v >= 0.9;
  const release = () => set(granted ? 1 : 0);
  return (
    <div className={c.fig}>
      <div className={c.ks} {...bind} data-state={granted ? 'ok' : v > 0.05 ? 'read' : 'idle'} aria-label="Key card reader: drag the card along the reader to the end" style={{ ...bind.style, '--v': v.toFixed(3) }} onPointerUp={release} onPointerCancel={release}>
        <span className={c.ksLed}><i /><span className={c.kd}>{granted ? 'Access' : v > 0.05 ? 'Reading' : 'Swipe'}</span></span>
        <span className={c.ksCard}><span className={c.ksStripe} /><span className={c.kd}>Room 214</span><b>Key</b></span>
      </div>
      <p className={c.row}><button type="button" className={c.btn} onClick={() => set(0)}>Again</button></p>
    </div>
  );
}

/* 20 */
const BILL = [['Noodles', 1200], ['Dumplings', 850], ['Tea', 300], ['Cake', 650]];
function SplitBill() {
  const [mine, setMine] = useState([true, true, false, false]);
  const [tip, setTip] = useState(10);
  const sum = BILL.reduce((a, [, p], i) => a + (mine[i] ? p : 0), 0);
  const total = Math.round(sum * (1 + tip / 100));
  return (
    <div className={c.sb}>
      <span className={c.kp}>Table 4 · tap what you had</span>
      <span className={c.sbRows}>
        {BILL.map(([n, p], i) => (
          <button key={n} type="button" className={c.sbRow} aria-pressed={mine[i]} onClick={() => setMine((m) => m.map((x, k) => (k === i ? !x : x)))}>
            <i /><span>{n}</span><span>{(p / 100).toFixed(2)}</span>
          </button>
        ))}
      </span>
      <span className={c.sbTip}>
        <span className={c.kp}>Tip</span>
        {[0, 10, 15].map((t) => <button key={t} type="button" aria-pressed={tip === t} onClick={() => setTip(t)}>{t}%</button>)}
      </span>
      <span className={c.sbTotal}><span className={c.kp}>You pay</span><b>{(total / 100).toFixed(2)}</b></span>
    </div>
  );
}

/* 21 */
const DRAWS = [4821, 1937, 7305, 2468, 9014, 5560];
const DIGITS = Array.from({ length: 30 }, (_, i) => i % 10);
function RaffleDraw() {
  const [k, setK] = useState(-1);
  const n = k < 0 ? 0 : DRAWS[k % DRAWS.length];
  const digits = String(n).padStart(4, '0').split('');
  return (
    <div className={c.fig}>
      <div className={c.rd} role="img" aria-label={k < 0 ? 'Raffle number not drawn yet' : `Raffle number ${String(n).padStart(4, '0')}`}>
        {digits.map((d, i) => (
          <span key={i} className={c.rdCol} style={{ '--d': Number(d) + (k % 2 ? 20 : 10), '--i': i }}>
            <span>{DIGITS.map((x, j) => <i key={j}>{x}</i>)}</span>
          </span>
        ))}
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} onClick={() => setK((x) => x + 1)}>Draw</button>
        <span className={c.k}>{k < 0 ? 'Not drawn' : `Draw ${k + 1}`}</span>
      </p>
    </div>
  );
}

/* 22 */
function Postmark() {
  return (
    <svg className={c.pm} viewBox="0 0 220 100" role="img" aria-label="A postmark pressed onto the corner of an envelope">
      <defs><path id="pm-ring" d="M60 50m-34 0a34 34 0 1 1 68 0a34 34 0 1 1 -68 0" /></defs>
      <rect className={c.pmPaper} x="2" y="2" width="216" height="96" rx="4" />
      <path className={c.pmAddr} d="M130 80h72M130 88h54" />
      <g className={c.pmInk} fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="60" cy="50" r="42" />
        <circle cx="60" cy="50" r="24" strokeWidth="1" />
        <text fontSize="6.2" fill="currentColor" stroke="none"><textPath href="#pm-ring" textLength="208" lengthAdjust="spacing">HANORYX · POST OFFICE · NO. 7 ·</textPath></text>
        <text x="60" y="55" textAnchor="middle" fontSize="17" fill="currentColor" stroke="none">14</text>
        <text x="60" y="65" textAnchor="middle" fontSize="6" letterSpacing="1.4" fill="currentColor" stroke="none">OCT</text>
        <path d="M112 20q8-8 16 0t16 0t16 0t16 0t16 0M112 34q8-8 16 0t16 0t16 0t16 0t16 0M112 48q8-8 16 0t16 0t16 0t16 0t16 0M112 62q8-8 16 0t16 0t16 0t16 0t16 0" />
      </g>
    </svg>
  );
}

/* 23 */
function HangTag() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.ht} data-hot={hot} aria-label="Hang tag: hover, tap or press Enter to turn it over" {...bind}>
      <span className={c.htFlip}>
        <span className={c.htFront}>
          <i className={c.htHole} />
          <span className={c.kp}>Style 0420</span>
          <b>Wool coat</b>
          <span className={c.kp}>Size M · charcoal</span>
          <Barcode code={BC.c} className={c.htCode} />
        </span>
        <span className={c.htBack}>
          <i className={c.htHole} />
          <span className={c.kd}>Now</span>
          <b>49</b>
          <s>79</s>
        </span>
      </span>
    </button>
  );
}

/* 24 */
const FORTUNES = ['The belt keeps moving.', 'A quiet machine is a good machine.', 'Tomorrow runs on time.', 'The gate opens inward.', 'Small stamps, large doors.'];
function FortuneSlip() {
  const [k, setK] = useState(-1);
  return (
    <div className={c.fig}>
      <button type="button" className={c.fs} data-out={k >= 0} aria-label={k < 0 ? 'Crack the cookie' : 'Pull another fortune'} onClick={() => setK((n) => n + 1)}>
        <span className={c.fsSlip} key={k}><span>{k < 0 ? '' : FORTUNES[k % FORTUNES.length]}</span></span>
        <svg className={c.fsCookie} viewBox="0 0 120 70" aria-hidden="true">
          <path className={c.fsBack} d="M8 46A52 40 0 0 1 112 46Q60 64 8 46Z" />
          <path className={c.fsFront} d="M26 50A36 26 0 0 1 98 50Q62 62 26 50Z" />
        </svg>
      </button>
      <p className={c.k}>{k < 0 ? 'Crack it open' : `Fortune ${(k % FORTUNES.length) + 1} of ${FORTUNES.length}`}</p>
    </div>
  );
}

/* 25 */
function TicketRoll() {
  const [v, bind] = useDrag({ mode: 'x', init: 0, steps: 9 });
  const at = Math.round(v * 9);
  return (
    <div className={c.fig}>
      <div className={c.tr} {...bind} aria-label="Ticket roll: drag to pull the next ticket" style={{ ...bind.style, '--at': at }}>
        <span className={c.trStrip}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={c.trTicket} data-cur={i === at}><span className={c.kp}>Ticket</span><b>{101 + i}</b></span>
          ))}
        </span>
        <i className={c.trGate} />
      </div>
      <p className={c.k}>Now serving {101 + at}</p>
    </div>
  );
}

/* 26 */
function EmbossedCard() {
  const [p, bind] = usePoint();
  const x = p ? p.x : 30;
  const y = p ? p.y : 26;
  return (
    <div className={c.fig}>
      <div className={c.em} {...bind} aria-label="Embossed card: move the pointer to move the light across the raised digits" style={{ ...bind.style, '--lx': x.toFixed(1), '--ly': y.toFixed(1) }}>
        <span className={c.emTop}><span>Member</span><i /></span>
        <b className={c.emNum}>4096 0042 1717 0099</b>
        <span className={c.emRow}><span>A. LEDGER</span><span>09/29</span></span>
      </div>
    </div>
  );
}

/* 27 */
function VisitorLog() {
  const [rows, setRows] = useState([[2, 'M. Okafor'], [1, 'T. Brandt']]);
  const [name, setName] = useState('');
  const next = rows[0][0] + 1;
  const stamp = (k) => { const m = 9 * 60 + k * 7; return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
  const add = (e) => {
    e.preventDefault();
    const t = name.trim();
    if (!t) return;
    setRows((r) => [[next, t], ...r].slice(0, 4));
    setName('');
  };
  return (
    <div className={c.fig}>
      <div className={c.vl}>
        <span className={c.vlHead}><span className={c.kp}>Visitors</span><span className={c.kp}>In</span></span>
        <ol>
          {rows.map(([k, n]) => <li key={k}><span>{n}</span><span>{stamp(k)}</span></li>)}
        </ol>
      </div>
      <form className={c.vlForm} onSubmit={add}>
        <input value={name} maxLength={18} onChange={(e) => setName(e.target.value)} placeholder="Sign in…" aria-label="Visitor name" spellCheck="false" autoComplete="off" />
        <button type="submit" className={c.btn}>Add</button>
      </form>
    </div>
  );
}

/* 28 */
function Rosette() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.ro} data-hot={hot} aria-label="Rosette: hover, tap or press Enter to fan the ribbons" {...bind}>
      <span className={c.roTail} />
      <span className={`${c.roTail} ${c.roTail2}`} />
      <span className={c.roDisc}><span className={c.roCore}><b>1</b></span></span>
    </button>
  );
}

/* 29 */
function ConductorPunch() {
  const [done, setDone] = useState(() => new Set([1, 6]));
  const toggle = (i) => setDone((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className={c.fig}>
      <div className={c.cp}>
        <span className={c.cpHead}><span className={c.kp}>Day return</span><span className={c.kp}>{done.size}/10 punched</span></span>
        <span className={c.cpGrid}>
          {Array.from({ length: 10 }, (_, i) => (
            <button key={i} type="button" className={c.cpCell} data-s={i % 5} aria-pressed={done.has(i)} aria-label={`Zone ${i + 1}`} onClick={() => toggle(i)}>
              <em>{i + 1}</em><i />
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}

/* 30 */
const PARCEL = ['Label printed', 'Sorted at depot', 'Loaded', 'Out for delivery'];
function ParcelLabel() {
  const [s, setS] = useState(1);
  return (
    <div className={c.fig}>
      <div className={c.pa}>
        <span className={c.paTop}><b>B-14</b><span className={c.paBand}>Priority</span></span>
        <span className={c.paCode}>
          <Barcode code={BC.d} className={c.paBars} />
          <i className={c.paBeam} key={s} />
        </span>
        <ol className={c.paSteps}>
          {PARCEL.map((t, i) => <li key={t} data-done={i <= s}>{t}</li>)}
        </ol>
      </div>
      <p className={c.row}><button type="button" className={c.btn} onClick={() => setS((x) => (x + 1) % PARCEL.length)}>Scan</button><span className={c.k}>Step {s + 1} of {PARCEL.length}</span></p>
    </div>
  );
}

/* 31 */
function ExpiringPass() {
  const n = useTick(1000);
  const left = Math.max(0, 20 - (n % 26));
  return (
    <div className={c.fig}>
      <div className={c.xp} data-out={left === 0} style={{ '--left': (left / 20).toFixed(3) }}>
        <svg className={c.xpRing} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" pathLength="1" /></svg>
        <span className={c.xpMid}><span className={c.kp}>Day pass</span><b>00:{pad2(left)}</b></span>
        <span className={c.xpBand}>Expired</span>
      </div>
    </div>
  );
}

/* 32 */
const STK = ['H', 'OK', 'NEW', 'GO', 'A+', '42'];
const LID = [[22, 30, -9], [60, 24, 10], [40, 64, -14], [76, 62, 7], [16, 70, 12], [54, 44, -4]];
function StickerSheet() {
  const [stuck, setStuck] = useState([false, true, false, false, false, false]);
  const flip = (i) => setStuck((s) => s.map((x, k) => (k === i ? !x : x)));
  return (
    <div className={c.fig}>
      <div className={c.ss}>
        <span className={c.ssSheet}>
          {STK.map((t, i) => (
            <button key={t} type="button" className={c.ssPad} aria-pressed={stuck[i]} aria-label={`Sticker ${t}: ${stuck[i] ? 'take it off the lid' : 'stick it on the lid'}`} onClick={() => flip(i)}>
              {!stuck[i] && <span className={c.ssSticker} data-k={i}>{t}</span>}
            </button>
          ))}
        </span>
        <span className={c.ssLid} aria-hidden="true">
          {STK.map((t, i) => stuck[i] && <span key={t} className={`${c.ssSticker} ${c.ssPut}`} data-k={i} style={{ left: `${LID[i][0]}%`, top: `${LID[i][1]}%`, '--r': `${LID[i][2]}deg` }}>{t}</span>)}
        </span>
      </div>
    </div>
  );
}

/* 33 */
function StubPile() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={c.pile} data-hot={hot} aria-label="Pile of ticket stubs: hover, tap or press Enter to fan them out" {...bind}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={c.pileStub} style={{ '--i': i }}><span className={c.kp}>Stub</span><b>{pad2(i + 1)}</b></span>
      ))}
    </button>
  );
}

/* 34 */
const RSVP = ['Yes', 'Maybe', 'No'];
const RSVP_OUT = ['See you there', 'We will hold a seat', 'Noted, with thanks'];
function RsvpSlip() {
  const [pick, setPick] = useState(-1);
  return (
    <div className={c.rs}>
      <span className={c.rsTear}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l13 14M5 19 18 5" /><circle cx="4" cy="5" r="2.2" /><circle cx="4" cy="19" r="2.2" /></svg><i /></span>
      <span className={c.kp}>Reply by 28 Oct</span>
      <b>Will you come?</b>
      <span className={c.rsOpts} role="group" aria-label="Your reply">
        {RSVP.map((t, i) => (
          <button key={t} type="button" aria-pressed={pick === i} onClick={() => setPick(i)}>
            <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13l5 5L20 6" pathLength="1" /></svg></i>{t}
          </button>
        ))}
      </span>
      <span className={c.rsOut}>{pick < 0 ? 'No reply yet' : RSVP_OUT[pick]}</span>
    </div>
  );
}

/* 35 */
function GateReader() {
  const [hold, setHold] = useState(false);
  const [ok, setOk] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const start = () => {
    setHold(true);
    setOk(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOk(true), 900);
  };
  const stop = () => { setHold(false); window.clearTimeout(timer.current); };
  const press = (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } };
  const lift = (e) => { if (e.key === ' ' || e.key === 'Enter') stop(); };
  return (
    <div className={c.fig}>
      <button
        type="button"
        className={c.gr}
        data-hold={hold}
        data-ok={ok}
        aria-label="Gate reader: press and hold to scan your pass"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); start(); }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={press}
        onKeyUp={lift}
        onBlur={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className={c.grRing}><span className={c.grCore}><b>{ok ? 'Valid' : hold ? 'Hold…' : 'Hold'}</b></span></span>
      </button>
      <p className={c.k}>{ok ? 'Gate open' : 'Press and hold to scan'}</p>
    </div>
  );
}

/* 36 */
const DUE = ['03 NOV', '17 NOV', '01 DEC', '15 DEC', '29 DEC', '12 JAN'];
function DueSlip() {
  const [n, setN] = useState(2);
  return (
    <div className={c.fig}>
      <div className={c.du}>
        <span className={c.duHead}><span className={c.kp}>Date due</span><span className={c.kp}>Please return</span></span>
        <span className={c.duRows}>
          {DUE.slice(0, n).map((d, i) => <span key={d} className={c.duRow} style={{ '--r': `${((i * 29) % 5) - 2}deg` }}>{d}</span>)}
        </span>
      </div>
      <p className={c.row}>
        <button type="button" className={c.btn} disabled={n >= DUE.length} onClick={() => setN((k) => k + 1)}>Renew</button>
        <button type="button" className={c.btn} onClick={() => setN(1)}>Clear</button>
      </p>
    </div>
  );
}

/* 37 */
const zig = (w, h, t) => {
  const n = Math.round(w / (t * 2));
  let d = `M0 ${t}`;
  for (let k = 0; k < n; k += 1) d += `L${f1(((k + 0.5) * w) / n)} 0L${f1(((k + 1) * w) / n)} ${t}`;
  d += `L${w} ${h - t}`;
  for (let k = n - 1; k >= 0; k -= 1) d += `L${f1(((k + 0.5) * w) / n)} ${h}L${f1((k * w) / n)} ${h - t}`;
  return `${d}Z`;
};
const wave = (w, h, a) => {
  const n = 8;
  let d = `M0 ${a}`;
  for (let k = 0; k < n; k += 1) d += `Q${f1(((k + 0.5) * w) / n)} ${k % 2 ? a * 2 : 0} ${f1(((k + 1) * w) / n)} ${a}`;
  d += `L${w} ${h - a}`;
  for (let k = n - 1; k >= 0; k -= 1) d += `Q${f1(((k + 0.5) * w) / n)} ${k % 2 ? h : h - a * 2} ${f1((k * w) / n)} ${h - a}`;
  return `${d}Z`;
};
const EDGES = [
  ['Straight', (w, h) => `M0 0H${w}V${h}H0Z`],
  ['Scallop', (w, h) => perf(w, h, 5.2, 10, 3)],
  ['Zigzag', (w, h) => zig(w, h, 7)],
  ['Notch', (w, h) => perf(w, h, 10, 1, 1)],
  ['Wave', (w, h) => wave(w, h, 5)],
];
function EdgeStyles() {
  const [k, setK] = useState(1);
  return (
    <div className={c.fig}>
      <svg className={c.eg} viewBox="0 0 240 96" role="img" aria-label={`A ticket with a ${EDGES[k][0].toLowerCase()} edge`}>
        <path className={c.egPaper} key={k} d={EDGES[k][1](240, 96)} />
        <text className={c.egBig} x="120" y="52" textAnchor="middle">Admit one</text>
        <text className={c.egSmall} x="120" y="70" textAnchor="middle">{EDGES[k][0].toUpperCase()} EDGE</text>
      </svg>
      <span className={c.egTabs} role="group" aria-label="Edge style">
        {EDGES.map(([n], i) => <button key={n} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{n}</button>)}
      </span>
    </div>
  );
}

/* 38 */
function LaminateSlider() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  return (
    <div className={c.fig}>
      <div className={c.lm} {...bind} aria-label="Laminate: drag sideways to peel the film back" style={{ ...bind.style, '--v': v.toFixed(3) }}>
        <span className={c.lmCard}>
          <span className={c.lmPhoto} />
          <span className={c.lmInfo}><span className={c.kd}>Resident</span><b>Mara Quill</b><span className={c.kd}>ID 0042 7731</span></span>
        </span>
        <span className={c.lmFilm} />
        <i className={c.lmEdge} />
      </div>
      <p className={c.k}>{v > 0.97 ? 'Fully laminated' : v < 0.03 ? 'Bare card' : `${Math.round(v * 100)}% laminated`}</p>
    </div>
  );
}

/* 39 */
function LiftPass() {
  const [go, fire] = useFlash(2200);
  return (
    <div className={c.fig}>
      <div className={c.lp} data-go={go}>
        <span className={c.lpCard}>
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M0 24 14 6l8 10 10-14 14 18 8-6 6 10z" /></svg>
          <b>Day lift pass</b>
          <span className={c.kd}>Valid 14 Oct</span>
        </span>
        <span className={c.lpGate}><i className={c.lpArm} /><i className={c.lpLed} /></span>
      </div>
      <p className={c.row}><button type="button" className={c.btn} onClick={fire}>Scan at gate</button></p>
    </div>
  );
}

/* 40 */
function Wristband() {
  const [on, flip] = useToggle(false);
  return (
    <div className={c.fig}>
      <button type="button" className={c.wb} data-on={on} aria-pressed={on} aria-label="Wristband: press to fasten or open the clasp" onClick={flip}>
        <span className={`${c.wbHalf} ${c.wbL}`}><span>ALL ACCESS</span></span>
        <span className={`${c.wbHalf} ${c.wbR}`}><span>DAY TWO</span></span>
        <i className={c.wbRivet} />
      </button>
      <p className={c.k}>{on ? 'Fastened' : 'Open'}</p>
    </div>
  );
}

/* 41 */
const PF_N = 28;
function PerfLens() {
  const [p, bind] = usePoint();
  const at = p ? (p.x / 100) * PF_N : -9;
  return (
    <div className={c.fig}>
      <div className={c.pf} {...bind} aria-label="Perforation line: move the pointer along it" style={{ ...bind.style, '--at': at.toFixed(2) }}>
        <span className={c.pfTop}><span className={c.kp}>Keep this half</span></span>
        <span className={c.pfLine}>{Array.from({ length: PF_N }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
        <span className={c.pfBottom}><span className={c.kp}>Return this half</span></span>
      </div>
    </div>
  );
}

/* 42 */
const SLOTS = [['09:00', 540, 4], ['09:30', 570, 0], ['10:00', 600, 2], ['10:30', 630, 6], ['11:00', 660, 1], ['11:30', 690, 3]];
function EntrySlot() {
  const [k, setK] = useState(2);
  const [label, mins] = SLOTS[k];
  const end = mins + 30;
  return (
    <div className={c.es}>
      <span className={c.esTop}>
        <span className={c.esClock} aria-hidden="true" style={{ '--hr': `${((mins / 60) % 12) * 30}deg`, '--mn': `${(mins % 60) * 6}deg` }}><i /><i /><b /></span>
        <span className={c.esTime}>
          <span className={c.kp}>Enter between</span>
          <b>{label} – {pad2(Math.floor(end / 60))}:{pad2(end % 60)}</b>
        </span>
      </span>
      <span className={c.esSlots} role="group" aria-label="Entry time">
        {SLOTS.map(([t, , left], i) => (
          <button key={t} type="button" aria-pressed={k === i} disabled={left === 0} onClick={() => setK(i)}><b>{t}</b><span>{left ? `${left} left` : 'Full'}</span></button>
        ))}
      </span>
    </div>
  );
}

/* ---- the page ---- */
const items = [
  ['Boarding pass', BoardingPass, 'hover'],
  ['Tear-off stub', TearStub, 'drag'],
  ['Scratch panel', ScratchPanel, 'drag'],
  ['Thermal printout', Printout, 'auto'],
  ['Lanyard badge', LanyardBadge, 'drag'],
  ['Laser scan', LaserScan, 'auto'],
  ['Passport page', PassportPage, 'click'],
  ['Tap card', TapCard, 'click'],
  ['Cut here', CutHere, 'auto'],
  ['Rolling code', RollingCode, 'auto'],
  ['Postage stamp', PostageStamp, 'hover'],
  ['Name sticker', NameSticker, 'type'],
  ['Seat chooser', SeatChooser, 'click'],
  ['Parking stub', ParkingStub, 'drag'],
  ['Hologram seal', HoloSeal, 'hover'],
  ['Wax seal', WaxEnvelope, 'click'],
  ['Number dispenser', NumberDispenser, 'click'],
  ['Luggage tag', LuggageTag, 'hover'],
  ['Key card swipe', KeySwipe, 'drag'],
  ['Split the bill', SplitBill, 'click'],
  ['Raffle draw', RaffleDraw, 'click'],
  ['Postmark', Postmark, 'auto'],
  ['Hang tag', HangTag, 'hover'],
  ['Fortune slip', FortuneSlip, 'click'],
  ['Ticket roll', TicketRoll, 'drag'],
  ['Embossed card', EmbossedCard, 'hover'],
  ['Visitor log', VisitorLog, 'type'],
  ['Rosette', Rosette, 'hover'],
  ['Conductor punch', ConductorPunch, 'click'],
  ['Parcel label', ParcelLabel, 'click'],
  ['Expiring pass', ExpiringPass, 'auto'],
  ['Sticker page', StickerSheet, 'click'],
  ['Stub pile', StubPile, 'hover'],
  ['RSVP slip', RsvpSlip, 'click'],
  ['Gate reader', GateReader, 'press'],
  ['Due-date slip', DueSlip, 'click'],
  ['Edge styles', EdgeStyles, 'click'],
  ['Laminate slider', LaminateSlider, 'drag'],
  ['Lift pass', LiftPass, 'click'],
  ['Wristband', Wristband, 'click'],
  ['Perforation lens', PerfLens, 'hover'],
  ['Entry slot', EntrySlot, 'click'],
];

export default { Visual, items };
