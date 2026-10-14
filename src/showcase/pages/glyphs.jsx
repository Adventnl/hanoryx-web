import { useId, useState } from 'react';
import { useDrag, useCycle, useTick, useToggle } from '../hooks';
import { useHot, useScan, usePoint, useCell } from '../kit';
import c from './glyphs.module.css';

/* ============================================================
   14 · GLYPHS — outlines, strokes and letterforms.
   The still side is a type specimen sheet: one huge glyph at a time, drawn
   against the five lines every letter lives between (ascender, cap height,
   x-height, baseline, descender). The scroll outlines the glyph, then a scan
   line fills it from the top; the next glyph takes over. The metrics are the
   real ones for the site's serif. Everything is CSS reading the page's --pin.
   The ring carries forty-two things you can do to a letter.
   ============================================================ */

/* ---------- the still side ---------- */

const GLYPHS = ['A', 'g', 'R', 'S', 'e', 'Q', '&', '7'];
const code = (ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
/* baseline at y = 88, size 100: Cormorant's ascender .73, cap .63, x .39, descender .28 */
const GUIDES = [['ASC', 15, '0.73'], ['CAP', 25, '0.63'], ['X', 49, '0.39'], ['BASE', 88, '0'], ['DESC', 116, '-0.28']];

function Visual() {
  const uid = useId().replace(/\W/g, '');
  return (
    <svg className={c.sheet} viewBox="0 0 100 140" aria-hidden="true">
      <defs>
        {GLYPHS.map((_, k) => <clipPath key={k} id={`${uid}-${k}`}><rect className={c.wipe} style={{ '--k': k }} x="0" y="0" width="100" /></clipPath>)}
      </defs>
      {GUIDES.map(([name, y, v]) => (
        <g key={name} className={c.guide} data-base={name === 'BASE'}>
          <line x1="0" x2="100" y1={y} y2={y} />
          <text x="1" y={y - 1}>{name}</text>
          <text x="99" y={y - 1} textAnchor="end">{v}</text>
        </g>
      ))}
      {GLYPHS.map((ch, k) => (
        <g key={ch} className={c.glyph} style={{ '--k': k }}>
          <text className={c.gOut} x="50" y="88" textAnchor="middle">{ch}</text>
          <text className={c.gFill} x="50" y="88" textAnchor="middle" clipPath={`url(#${uid}-${k})`}>{ch}</text>
          <rect className={c.scan} x="0" y="0" width="100" height="0.6" />
          <text className={c.gCode} x="50" y="132" textAnchor="middle">{code(ch)}</text>
        </g>
      ))}
      <g>
        {GLYPHS.map((ch, k) => <text key={ch} className={c.stripCh} style={{ '--k': k }} x={50 + (k - 3.5) * 11} y="139">{ch}</text>)}
      </g>
    </svg>
  );
}

/* ---------- building blocks ---------- */

function Track({ bind, v, label, text }) {
  return (
    <div {...bind} className={c.track} aria-label={label} aria-valuetext={text} style={{ ...bind.style, '--v': v }}>
      <i />
    </div>
  );
}

/* ---------- 01 strokes and fills ---------- */

function StrokeWeight() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.4 });
  return (
    <div className={c.fig}>
      <p className={c.weightWords} style={{ '--w': v }}><span className={c.holl}>Ink</span><span className={c.sol}>Ink</span></p>
      <Track bind={bind} v={v} label="Stroke weight" text={`${(v * 4).toFixed(1)} pixels`} />
    </div>
  );
}

function OutlinePass() {
  return (
    <div className={c.fig} role="img" aria-label="The word trace, outlined and then filled">
      <svg className={c.pass} viewBox="0 0 120 52" aria-hidden="true"><text x="60" y="40" textAnchor="middle">Trace</text></svg>
    </div>
  );
}

function PaintOrder() {
  const [over, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={over} aria-label="Paint order: stroke over or under the fill" onClick={flip}>
      <svg className={c.paint} viewBox="0 0 120 56" aria-hidden="true"><text x="60" y="44" textAnchor="middle" style={{ paintOrder: over ? 'normal' : 'stroke fill' }}>Over</text></svg>
      <span className={c.note}>{over ? 'stroke over fill' : 'stroke under fill'}</span>
    </button>
  );
}

function DoubleOutline() {
  return (
    <div className={c.fig} role="img" aria-label="The word echo, wrapped in two outlines">
      <svg className={c.dbl} viewBox="0 0 120 56" aria-hidden="true">
        <text className={c.dblA} x="60" y="42" textAnchor="middle">Echo</text>
        <text className={c.dblB} x="60" y="42" textAnchor="middle">Echo</text>
        <text className={c.dblC} x="60" y="42" textAnchor="middle">Echo</text>
      </svg>
    </div>
  );
}

function GradientStroke() {
  const id = `gs${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="The word flow, outlined in a gradient that travels">
      <svg className={c.gstroke} viewBox="0 0 120 52" aria-hidden="true">
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="60" y2="0" spreadMethod="repeat">
            <stop offset="0" stopColor="#ff3333" /><stop offset="0.5" stopColor="#ffffff" /><stop offset="1" stopColor="#ff3333" />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="60 0" dur="2.4s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="60" y="40" textAnchor="middle" stroke={`url(#${id})`}>Flow</text>
      </svg>
    </div>
  );
}

function StencilCut() {
  const id = `st${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="Stencil letters, cut by moving bridges">
      <svg className={c.stencil} viewBox="0 0 120 56" aria-hidden="true">
        <defs>
          <mask id={id}>
            <rect width="120" height="56" fill="#fff" />
            <g className={c.bridges}>{[0, 1, 2, 3].map((i) => <rect key={i} x="0" y={6 + i * 12} width="120" height="2.6" fill="#000" />)}</g>
          </mask>
        </defs>
        <text x="60" y="44" textAnchor="middle" mask={`url(#${id})`}>Cut</text>
      </svg>
    </div>
  );
}

function Knockout() {
  const [p, bind] = usePoint();
  const id = `ko${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig}>
      <div {...bind} className={c.ko} aria-label="Letters knocked out of a block; move over it to move the light" style={{ ...bind.style, '--lx': `${p ? p.x : 30}%`, '--ly': `${p ? p.y : 40}%` }}>
        <svg viewBox="0 0 120 56" aria-hidden="true">
          <defs><mask id={id}><rect width="120" height="56" fill="#fff" /><text x="60" y="42" textAnchor="middle" fill="#000">OUT</text></mask></defs>
          <rect width="120" height="56" fill="#0a0b0d" mask={`url(#${id})`} />
        </svg>
      </div>
    </div>
  );
}

function LongShadow() {
  const [p, bind] = usePoint();
  const a = p ? Math.atan2(p.y - 50, p.x - 50) : Math.PI / 4;
  const shadow = Array.from({ length: 30 }, (_, i) => `${(Math.cos(a) * (i + 1) * 1.2).toFixed(1)}px ${(Math.sin(a) * (i + 1) * 1.2).toFixed(1)}px 0 rgba(255, 51, 51, ${(0.85 - i * 0.027).toFixed(2)})`).join(',');
  return (
    <div className={c.fig}>
      <div {...bind} className={c.lsBox} aria-label="A long shadow that points away from the pointer">
        <span className={c.ls} style={{ textShadow: shadow }}>Long</span>
      </div>
    </div>
  );
}

const LAYERS = Array.from({ length: 14 }, (_, i) => i);
function Extrude() {
  return (
    <div className={c.fig} role="img" aria-label="Extruded letters turning on the spot">
      <div className={c.extBox}>
        <div className={c.ext}>
          {LAYERS.map((i) => <span key={i} style={{ '--i': i }} aria-hidden="true">3D</span>)}
        </div>
      </div>
    </div>
  );
}

function PatternFill() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.pat}>Stripe</span>
    </button>
  );
}

function AuroraFill() {
  return (
    <div className={c.fig}>
      <p className={c.aur}>Aurora</p>
    </div>
  );
}

function Halftone() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.half}>Dots</span>
    </button>
  );
}

/* ---------- 02 anatomy and construction ---------- */

const PARTS = [['stem', 66, 72, 40, 60, 'end'], ['bowl', 110, 46, 132, 34, 'start'], ['counter', 88, 47, 132, 56, 'start'], ['leg', 101, 84, 132, 92, 'start'], ['foot', 62, 103, 40, 118, 'end']];
function Anatomy() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Letter anatomy, show or hide the labels" onClick={flip}>
      <svg className={c.anat} viewBox="0 0 160 130" aria-hidden="true">
        <text className={c.anatR} x="80" y="104" textAnchor="middle">R</text>
        <g className={c.callouts} data-on={on}>
          {PARTS.map(([name, x, y, tx, ty, anchor]) => (
            <g key={name}>
              <line x1={x} y1={y} x2={tx} y2={ty} />
              <circle cx={x} cy={y} r="1.6" />
              <text x={tx + (anchor === 'end' ? -1.5 : 1.5)} y={ty + 1.4} textAnchor={anchor}>{name}</text>
            </g>
          ))}
        </g>
      </svg>
    </button>
  );
}

const MET = [['ascender', 15], ['cap height', 25], ['x-height', 49], ['baseline', 88], ['descender', 116]];
function MetricsBox() {
  const [p, bind] = usePoint();
  const yv = p ? (p.y / 100) * 130 : -99;
  const near = p ? MET.reduce((best, m, i) => (Math.abs(m[1] - yv) < Math.abs(MET[best][1] - yv) ? i : best), 0) : -1;
  return (
    <div className={c.fig}>
      <div {...bind} className={c.metrics} aria-label="Type metrics; move over the letters to pick a line" style={{ ...bind.style }}>
        <svg viewBox="0 0 160 130" aria-hidden="true">
          {MET.map(([name, y], i) => (
            <g key={name} data-on={i === near}>
              <line x1="0" x2="160" y1={y} y2={y} />
              <text x="158" y={y - 2} textAnchor="end">{name}</text>
            </g>
          ))}
          <text className={c.metricsText} x="12" y="88">Hp</text>
        </svg>
      </div>
      <p className={c.note}>{near < 0 ? 'point at a line' : MET[near][0]}</p>
    </div>
  );
}

function Overshoot() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Optical overshoot, switch it on or off" onClick={flip}>
      <svg className={c.over} viewBox="0 0 120 70" aria-hidden="true">
        <line className={c.ovLine} x1="0" x2="120" y1="14" y2="14" /><line className={c.ovLine} x1="0" x2="120" y1="58" y2="58" />
        <path className={c.ovH} d="M14 14V58M38 14V58M14 36H38" />
        <ellipse className={c.ovO} data-on={on} cx="78" cy="36" rx="19" />
      </svg>
      <span className={c.note}>{on ? 'round letters overshoot' : 'no overshoot: they look short'}</span>
    </button>
  );
}

function GeometricSet() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Geometric letters, hover to show how they are built" {...bind}>
      <svg className={c.geo} viewBox="0 0 150 56" aria-hidden="true">
        <g className={c.geoLetters}>
          <circle cx="20" cy="28" r="18" />
          <path d="M52 10V46H60A18 18 0 0 0 60 10Z" />
          <path d="M96 46V10H104A9 9 0 0 1 104 28H96" />
          <path d="M126 10V46M126 10H134A8 8 0 0 1 134 26H126M126 26H136A10 10 0 0 1 136 46H126" />
        </g>
        <g className={c.geoBuild}>
          <circle cx="20" cy="28" r="18" /><circle cx="20" cy="28" r="1.4" />
          <circle cx="60" cy="28" r="18" /><circle cx="104" cy="19" r="9" />
          <circle cx="134" cy="18" r="8" /><circle cx="136" cy="36" r="10" />
          <path d="M0 10H150M0 46H150" />
        </g>
      </svg>
    </button>
  );
}

const GRID = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ&@#$%?'];
function GlyphGrid() {
  const [at, bind] = useCell(4, 8, null);
  const ch = at[0] >= 0 ? GRID[at[0] * 8 + at[1]] : null;
  return (
    <div className={c.fig}>
      <div {...bind} className={c.gridBox} aria-label="A grid of glyphs; move over it to inspect one">
        {GRID.map((g, i) => <i key={g} data-on={at[0] === Math.floor(i / 8) && at[1] === i % 8}>{g}</i>)}
      </div>
      <p className={c.note}>{ch ? `${ch}  ·  ${code(ch)}  ·  ${ch.codePointAt(0)}` : 'point at a glyph'}</p>
    </div>
  );
}

const ALPHA = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
function AlphabetStrip() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.35 });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.alpha} aria-label="Drag along the alphabet" aria-valuetext={ALPHA[Math.round(v * 25)]} style={{ ...bind.style }}>
        {ALPHA.map((ch, i) => <i key={ch} style={{ '--s': (1 + 2.2 * Math.exp(-(((i / 25 - v) * 9) ** 2))).toFixed(2) }}>{ch}</i>)}
      </div>
    </div>
  );
}

const MONO = [
  <path key="H" d="M0 1V15M10 1V15M0 8H10" />,
  <path key="A" d="M0 15L5 1L10 15M2 10H8" />,
  <path key="N" d="M0 15V1L10 15V1" />,
  <ellipse key="O" cx="5" cy="8" rx="5" ry="7" />,
  <path key="R" d="M0 15V1H6A3.5 3.5 0 0 1 6 8H0M6 8L10 15" />,
  <path key="Y" d="M0 1L5 8L10 1M5 8V15" />,
  <path key="X" d="M0 1L10 15M10 1L0 15" />,
];
function Monoline() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.3 });
  return (
    <div className={c.fig}>
      <svg className={c.monoSvg} viewBox="-3 -2 88 20" style={{ '--sw': (0.5 + v * 2.6).toFixed(2) }} role="img" aria-label="HANORYX in a single-line letter style">
        {MONO.map((p, i) => <g key={i} transform={`translate(${i * 12} 0)`}>{p}</g>)}
      </svg>
      <Track bind={bind} v={v} label="Line weight" text={`${(0.5 + v * 2.6).toFixed(1)} units`} />
    </div>
  );
}

function StressAxis() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const id = `sa${useId().replace(/\W/g, '')}`;
  const ang = (v - 0.5) * 80;
  return (
    <div className={c.fig}>
      <svg className={c.stress} viewBox="0 0 100 100" role="img" aria-label={`An O whose stress axis is tilted ${Math.round(ang)} degrees`}>
        <defs>
          <mask id={id}>
            <rect width="100" height="100" fill="#fff" />
            <ellipse cx="50" cy="50" rx="19" ry="35" fill="#000" transform={`rotate(${ang.toFixed(1)} 50 50)`} />
          </mask>
        </defs>
        <ellipse cx="50" cy="50" rx="35" ry="45" fill="#fff" mask={`url(#${id})`} />
        <line x1="50" y1="2" x2="50" y2="98" className={c.axis} transform={`rotate(${ang.toFixed(1)} 50 50)`} />
      </svg>
      <Track bind={bind} v={v} label="Stress axis" text={`${Math.round(ang)} degrees`} />
    </div>
  );
}

const SERIFS = ['none', 'hairline', 'slab', 'bracketed'];
const FEET = {
  none: 'M44 14H56V86H44Z',
  hairline: 'M44 14H56V86H44ZM30 14H70V16H30ZM30 84H70V86H30Z',
  slab: 'M44 14H56V86H44ZM30 14H70V22H30ZM30 78H70V86H30Z',
  bracketed: 'M44 22H56V78H44ZM30 14H70V19Q56 20 56 30V70Q56 80 70 81V86H30V81Q44 80 44 70V30Q44 20 30 19Z',
};
function SerifStyles() {
  const [k, setK] = useState(2);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Serif style ${SERIFS[k]}. Try the next`} onClick={() => setK((x) => (x + 1) % SERIFS.length)}>
      <svg className={c.serifSvg} viewBox="0 0 100 100" aria-hidden="true"><path d={FEET[SERIFS[k]]} /></svg>
      <span className={c.note}>{SERIFS[k]}</span>
    </button>
  );
}

/* ---------- 03 spacing and rhythm ---------- */

function KerningPair() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5, steps: 20 });
  const units = Math.round((v - 0.5) * 600);
  return (
    <div className={c.fig}>
      <p className={c.kern} style={{ letterSpacing: `${(units / 1000).toFixed(3)}em` }}>AV</p>
      <Track bind={bind} v={v} label="Kerning between A and V" text={`${units} units`} />
      <span className={c.note}>{units > 0 ? '+' : ''}{units}  /  1000 em</span>
    </div>
  );
}

function Tracking() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.25 });
  return (
    <div className={c.fig}>
      <p className={c.track2} style={{ letterSpacing: `${(-0.04 + v * 0.5).toFixed(3)}em` }}>SPACE</p>
      <Track bind={bind} v={v} label="Letter spacing" text={`${Math.round((-0.04 + v * 0.5) * 1000)} units`} />
    </div>
  );
}

function Leading() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.35 });
  return (
    <div className={c.fig}>
      <div className={c.leadRow}>
        <p className={c.lead} style={{ lineHeight: (0.95 + v * 1.0).toFixed(2) }}>Set the lines close, or let them breathe a little.</p>
        <div {...bind} className={c.vtrack} aria-label="Line height" aria-valuetext={`${(0.95 + v).toFixed(2)}`} style={{ ...bind.style, '--v': v }}><i /></div>
      </div>
    </div>
  );
}

function TypeScale() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const r = 1.125 + v * 0.493;
  return (
    <div className={c.fig}>
      <ol className={c.scaleList} aria-label={`A type scale at ratio ${r.toFixed(3)}`}>
        {[3, 2, 1, 0].map((k) => <li key={k} style={{ fontSize: `${(0.8 * r ** k).toFixed(2)}rem` }}>Aa</li>)}
      </ol>
      <Track bind={bind} v={v} label="Scale ratio" text={r.toFixed(3)} />
      <span className={c.note}>ratio {r.toFixed(3)}</span>
    </div>
  );
}

function BaselineGrid() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Baseline grid, show or hide" onClick={flip}>
      <span className={c.bg} data-on={on}>Every line of text rests on the same invisible grid, and so does the next one.</span>
    </button>
  );
}

function HangingPunct() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Hanging punctuation, switch on or off" onClick={flip}>
      <span className={c.hang} data-on={on}>“Quotation marks belong in the margin, so the text lines up.”</span>
    </button>
  );
}

function SkipInk() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Skip ink, switch on or off" onClick={flip}>
      <span className={c.skip} style={{ textDecorationSkipInk: on ? 'auto' : 'none' }}>gypsy jumping quickly</span>
    </button>
  );
}

const NUMS = [['lining tabular', 'lining-nums tabular-nums'], ['old-style', 'oldstyle-nums proportional-nums'], ['slashed zero', 'lining-nums slashed-zero'], ['fractions', 'diagonal-fractions']];
function Numerals() {
  const [k, setK] = useState(1);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Numeral style ${NUMS[k][0]}. Try the next`} onClick={() => setK((x) => (x + 1) % NUMS.length)}>
      <span className={c.nums} style={{ fontVariantNumeric: NUMS[k][1] }}>0123456789<br />1/2  3/4  5/8</span>
      <span className={c.note}>{NUMS[k][0]}</span>
    </button>
  );
}

function Ligatures() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Ligatures, switch on or off" onClick={flip}>
      <span className={c.lig} style={{ fontVariantLigatures: on ? 'common-ligatures discretionary-ligatures' : 'none' }}>office, fifty, affluent flight</span>
      <span className={c.note}>{on ? 'ligatures on' : 'ligatures off'}</span>
    </button>
  );
}

const CAPS = [['normal', 'none'], ['small-caps', 'none'], ['all-small-caps', 'none'], ['titling-caps', 'none'], ['normal', 'uppercase']];
function CapsToggle() {
  const [k, setK] = useState(1);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Capitals style ${CAPS[k][0]}. Try the next`} onClick={() => setK((x) => (x + 1) % CAPS.length)}>
      <span className={c.caps} style={{ fontVariantCaps: CAPS[k][0], textTransform: CAPS[k][1] }}>Small Capitals Look Calm</span>
      <span className={c.note}>{CAPS[k][1] === 'uppercase' ? 'uppercase' : CAPS[k][0]}</span>
    </button>
  );
}

const MODES = [['horizontal-tb', 'upright'], ['vertical-rl', 'mixed'], ['vertical-rl', 'upright'], ['vertical-lr', 'mixed']];
function VerticalText() {
  const [k, setK] = useState(1);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Writing mode ${MODES[k][0]}. Try the next`} onClick={() => setK((x) => (x + 1) % MODES.length)}>
      <span className={c.vert}><span style={{ writingMode: MODES[k][0], textOrientation: MODES[k][1] }}>Vertical type</span></span>
      <span className={c.note}>{MODES[k][0]} · {MODES[k][1]}</span>
    </button>
  );
}

/* ---------- 04 play ---------- */

const NORTH = [...'NORTH'];
function LetterCompass() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={c.compass} aria-label="Letters that turn to face the pointer">
        {NORTH.map((ch, i) => {
          const cx = 10 + i * 20;
          const ang = p ? (Math.atan2(p.y - 50, (p.x - cx) * 3) * 180) / Math.PI + 90 : 0;
          return <span key={i} style={{ transform: `rotate(${ang.toFixed(1)}deg)` }}>{ch}</span>;
        })}
      </div>
    </div>
  );
}

const WEIGHTS = [300, 400, 500, 600];
function WeightLadder() {
  const [i, bind] = useScan(WEIGHTS.length, { axis: 'y', label: (k) => `weight ${WEIGHTS[k]}` });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.ladder} aria-label="Four weights of one word; move along it to pick one">
        {WEIGHTS.map((w, k) => <p key={w} style={{ fontWeight: w }} data-on={i === k} data-f={i === -1 || i === k}><b>{w}</b>Weight</p>)}
      </div>
    </div>
  );
}

const FAMILIES = [['serif', 'Cormorant Garamond'], ['sans', 'Inter'], ['mono', 'JetBrains Mono']];
function FamilySwap() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Typeface ${FAMILIES[k][1]}. Try the next`} onClick={() => setK((x) => (x + 1) % FAMILIES.length)}>
      <span key={k} className={`${c.swapCh} ${c[FAMILIES[k][0]]}`}>Rg</span>
      <span className={c.note}>{FAMILIES[k][1]}</span>
    </button>
  );
}

const AMPS = ['serif', 'sans', 'mono', 'outline'];
function Ampersand() {
  const k = useCycle(AMPS.length, 1700);
  return (
    <div className={c.fig} role="img" aria-label="An ampersand in four different styles">
      <span key={k} className={`${c.amp} ${c[`amp_${AMPS[k]}`]}`}>&amp;</span>
      <span className={c.note}>{AMPS[k]}</span>
    </div>
  );
}

function DropCap() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Drop cap, ${n} lines deep. Change the depth`} onClick={() => setN((x) => (x % 4) + 2)}>
      <span className={c.drop} style={{ '--n': n }}>The belt keeps moving, though nobody asked it to, and the first letter of a paragraph can sink into the lines below it like a stone into water.</span>
    </button>
  );
}

function ItalicAngle() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const deg = Math.round(v * 24);
  return (
    <div className={c.fig}>
      <p className={c.slant} style={{ transform: `skewX(${-deg}deg)` }}>Rag</p>
      <Track bind={bind} v={v} label="Slant angle" text={`${deg} degrees`} />
      <span className={c.note}>{deg}°</span>
    </div>
  );
}

function TypeTester() {
  const [t, setT] = useState('Sphinx of black quartz');
  return (
    <div className={c.fig}>
      <div className={c.tester}>
        <p className={c.t1}>{t || ' '}</p>
        <p className={c.t2}>{t || ' '}</p>
        <p className={c.t3}>{t || ' '}</p>
      </div>
      <input className={c.input} value={t} maxLength={24} onChange={(e) => setT(e.target.value)} aria-label="Text to set in three typefaces" spellCheck="false" autoComplete="off" />
    </div>
  );
}

const superellipse = (rx, ry, n, steps = 72) => Array.from({ length: steps }, (_, i) => {
  const t = (i / steps) * Math.PI * 2;
  const co = Math.cos(t);
  const si = Math.sin(t);
  return `${i ? 'L' : 'M'}${(50 + rx * Math.sign(co) * Math.abs(co) ** (2 / n)).toFixed(1)} ${(50 + ry * Math.sign(si) * Math.abs(si) ** (2 / n)).toFixed(1)}`;
}).join('') + 'Z';
function BowlMorph() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.25 });
  const n = 1 + v * 7;
  return (
    <div className={c.fig}>
      <svg className={c.bowl} viewBox="0 0 100 100" role="img" aria-label={`An O whose shape runs from a diamond to a square, at exponent ${n.toFixed(1)}`}>
        <path fillRule="evenodd" d={superellipse(40, 44, n) + superellipse(21, 28, n)} />
      </svg>
      <Track bind={bind} v={v} label="Roundness" text={`exponent ${n.toFixed(1)}`} />
    </div>
  );
}

function WordSpacing() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.3 });
  const ws = -0.15 + v * 1.15;
  return (
    <div className={c.fig}>
      <p className={c.words} style={{ wordSpacing: `${ws.toFixed(2)}em` }}>Space between words is part of the rhythm</p>
      <Track bind={bind} v={v} label="Word spacing" text={`${ws.toFixed(2)} em`} />
      <span className={c.note}>word space {ws > 0 ? '+' : ''}{ws.toFixed(2)} em</span>
    </div>
  );
}

function CodePoint() {
  const t = useTick(900);
  const cp = 0x21 + (t % 94);
  return (
    <div className={c.fig} role="img" aria-label={`Code point ${code(String.fromCodePoint(cp))}`}>
      <div className={c.cp}>
        <b key={cp}>{String.fromCodePoint(cp)}</b>
        <ul>
          <li>{code(String.fromCodePoint(cp))}</li>
          <li>{cp}</li>
          <li>{cp.toString(2).padStart(8, '0')}</li>
        </ul>
      </div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Stroke weight', StrokeWeight, 'drag'], ['Outline pass', OutlinePass, 'auto'], ['Paint order', PaintOrder, 'click'], ['Double outline', DoubleOutline, 'auto'],
    ['Gradient stroke', GradientStroke, 'auto'], ['Stencil cut', StencilCut, 'auto'], ['Knockout', Knockout, 'hover'], ['Long shadow', LongShadow, 'hover'],
    ['Extrude', Extrude, 'auto'], ['Pattern fill', PatternFill, 'hover'], ['Aurora fill', AuroraFill, 'auto'], ['Halftone', Halftone, 'hover'],
    ['Anatomy', Anatomy, 'click'], ['Metrics box', MetricsBox, 'hover'], ['Overshoot', Overshoot, 'click'], ['Geometric set', GeometricSet, 'hover'],
    ['Glyph grid', GlyphGrid, 'hover'], ['Alphabet strip', AlphabetStrip, 'drag'], ['Monoline', Monoline, 'drag'], ['Stress axis', StressAxis, 'drag'],
    ['Serif styles', SerifStyles, 'click'], ['Kerning pair', KerningPair, 'drag'], ['Tracking', Tracking, 'drag'], ['Leading', Leading, 'drag'],
    ['Type scale', TypeScale, 'drag'], ['Baseline grid', BaselineGrid, 'click'], ['Hanging punctuation', HangingPunct, 'click'], ['Skip ink', SkipInk, 'click'],
    ['Numerals', Numerals, 'click'], ['Ligatures', Ligatures, 'click'], ['Caps toggle', CapsToggle, 'click'], ['Vertical text', VerticalText, 'click'],
    ['Letter compass', LetterCompass, 'hover'], ['Weight ladder', WeightLadder, 'hover'], ['Family swap', FamilySwap, 'click'], ['Ampersand', Ampersand, 'auto'],
    ['Drop cap', DropCap, 'click'], ['Italic angle', ItalicAngle, 'drag'], ['Type tester', TypeTester, 'type'], ['Bowl morph', BowlMorph, 'drag'],
    ['Word spacing', WordSpacing, 'drag'], ['Code point', CodePoint, 'auto'],
  ],
};
