import { useState } from 'react';
import { useDrag, useToggle } from '../hooks';
import { useHot, usePoint } from '../kit';
import c from './glow.module.css';

/* ============================================================
   17 · GLOW — spotlights, beams and borders of light.
   The still side is a pendant lamp that swings over a row of tiles. Where the
   cone falls a tile lights up: border, fill, glow and lift. Both the swing and the
   cone are one number — the beam's position, sin(pin × 4π) — and CSS does the
   rest (atan2 for the lamp's angle, a clip-path for the cone, clamp for how lit
   each tile is). Forty-two cards on the left are each lit in their own way.
   ============================================================ */

/* ---------- the still side ---------- */

const TILES = [0, 1, 2, 3, 4, 5];

function Visual() {
  return (
    <div className={c.room} aria-hidden="true">
      <i className={c.cord} />
      <span className={c.lamp}><i className={c.shade} /><i className={c.bulb} /></span>
      <i className={c.cone} />
      <i className={c.pool} />
      <div className={c.tiles}>
        {TILES.map((k) => <i key={k} className={c.tile} style={{ '--cx': 5 + (k + 0.5) * 15 }}><b /><b /></i>)}
      </div>
      <p className={c.lux}>Pendant 01</p>
    </div>
  );
}

/* ---------- helpers ---------- */

/** the pointer as CSS: where the light is, and whether it is on */
const light = (p, at = [50, 40]) => ({ '--lx': `${p ? p.x : at[0]}%`, '--ly': `${p ? p.y : at[1]}%`, '--on': p ? 1 : 0.45 });

/* ---------- 01 light that follows ---------- */

function SpotlightCard() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.spot}`} aria-label="A card with a spotlight that follows the pointer" style={{ ...bind.style, ...light(p) }}>
        <b>Spotlight</b><span>follows the pointer</span>
      </div>
    </div>
  );
}

function BorderBeam() {
  return (
    <div className={c.fig} role="img" aria-label="A card with a beam of light running around its border">
      <div className={`${c.card} ${c.beam}`}><b>Border beam</b><span>runs the edge</span></div>
    </div>
  );
}

function GradientBorder() {
  return (
    <div className={c.fig} role="img" aria-label="A card with a gradient border and a soft glow behind it">
      <div className={c.wrap}>
        <i className={c.backGlow} />
        <div className={`${c.card} ${c.gb}`}><b>Gradient</b><span>border and bloom</span></div>
      </div>
    </div>
  );
}

function SpinBorder() {
  return (
    <div className={c.fig} role="img" aria-label="A card whose gradient border turns">
      <div className={`${c.card} ${c.spin}`}><b>Spin</b><span>the border turns</span></div>
    </div>
  );
}

function OutlineGlow() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={`${c.card} ${c.outline}`}><b>Outline</b><span>lights on hover</span></span>
    </button>
  );
}

function InnerGlow() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={`${c.card} ${c.inner}`}><b>Inner</b><span>glows from within</span></span>
    </button>
  );
}

function RimLight() {
  const [p, bind] = usePoint();
  const a = p ? (Math.atan2(p.y - 50, p.x - 50) * 180) / Math.PI + 90 : 200;
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.rim}`} aria-label="A card lit from the side the pointer is on" style={{ ...bind.style, '--a': `${a.toFixed(0)}deg` }}>
        <b>Rim</b><span>lit from the pointer</span>
      </div>
    </div>
  );
}

const FLASH = 'The names on this card are only readable inside the beam of the flashlight.';
function FlashlightText() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.flash}`} aria-label="Text that can be read only inside a circle of light" style={{ ...bind.style, ...light(p, [30, 40]) }}>
        <p className={c.dim}>{FLASH}</p>
        <p className={c.lit} aria-hidden="true">{FLASH}</p>
      </div>
    </div>
  );
}

function SharedLight() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={c.trio} aria-label="Three cards lit by one light" style={{ ...bind.style, ...light(p, [50, 50]) }}>
        {['One', 'Two', 'Three'].map((n, k) => <i key={n} className={c.mini} style={{ '--k': k }}><b>{n}</b></i>)}
      </div>
    </div>
  );
}

function PrismEdge() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={`${c.card} ${c.prism}`}><b>Prism</b><span>splits at the edge</span></span>
    </button>
  );
}

/* ---------- 02 light that moves on its own ---------- */

function AuroraCard() {
  return (
    <div className={c.fig} role="img" aria-label="A card with slow aurora light behind it">
      <div className={`${c.card} ${c.aurora}`}><i /><i /><i /><b>Aurora</b></div>
    </div>
  );
}

function PressFlash() {
  const [n, setN] = useState(0);
  const [at, setAt] = useState([50, 50]);
  return (
    <button
      type="button"
      className={`${c.fig} ${c.reset}`}
      aria-label="A card that flashes where it is pressed"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setAt([((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]);
        setN((v) => v + 1);
      }}
      onClick={(e) => { if (e.detail === 0) setN((v) => v + 1); }}
    >
      <span className={`${c.card} ${c.press}`} style={{ '--lx': `${at[0]}%`, '--ly': `${at[1]}%` }}>
        <i key={n} className={n ? c.flashRing : ''} /><b>Press</b><span>flash where you touch</span>
      </span>
    </button>
  );
}

function BreathingGlow() {
  return (
    <div className={c.fig} role="img" aria-label="A card with a glow that breathes">
      <div className={`${c.card} ${c.breathe}`}><b>Breathe</b><span>slow pulse</span></div>
    </div>
  );
}

function ShineBorder() {
  return (
    <div className={c.fig} role="img" aria-label="A card whose border catches a sheen">
      <div className={`${c.card} ${c.shine}`}><b>Shine</b><span>on the border only</span></div>
    </div>
  );
}

function Meteors() {
  return (
    <div className={c.fig} role="img" aria-label="A card with meteors streaking across it">
      <div className={`${c.card} ${c.meteors}`}>
        {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
        <b>Meteors</b>
      </div>
    </div>
  );
}

function TopBeam() {
  return (
    <div className={c.fig} role="img" aria-label="A card with a beam of light sweeping down from the top edge">
      <div className={`${c.card} ${c.top}`}><i /><b>Top beam</b><span>sweeps across</span></div>
    </div>
  );
}

function LensFlare() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.flare}`} aria-label="A card with a lens flare that follows the pointer" style={{ ...bind.style, ...light(p, [70, 30]) }}>
        <i /><i /><i /><b>Flare</b>
      </div>
    </div>
  );
}

function Backlight() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.wrap}>
        <i className={c.bl} />
        <span className={`${c.card} ${c.plain}`}><b>Backlight</b><span>{hot ? 'on' : 'off'}</span></span>
      </span>
    </button>
  );
}

function BloomText() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.bloom} data-on={on}>Bloom</span>
      <span className={c.note}>{on ? 'glow on' : 'glow off'}</span>
    </button>
  );
}

function LightSwitch() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Pull the cord to switch the light" onClick={flip}>
      <span className={c.lampBox} data-on={on}>
        <i className={c.pull} />
        <i className={c.hood} />
        <i className={c.ray} />
        <span className={`${c.card} ${c.dark}`}><b>{on ? 'Lit' : 'Dark'}</b></span>
      </span>
    </button>
  );
}

function Dimmer() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.6 });
  return (
    <div className={c.fig}>
      <div className={`${c.card} ${c.dimmed}`} style={{ '--v': v }}><b>Dimmer</b><span>{Math.round(v * 100)}%</span></div>
      <div {...bind} className={c.track} aria-label="Brightness" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

function LaserGrid() {
  return (
    <div className={c.fig} role="img" aria-label="A grid that a laser line sweeps across and lights">
      <div className={`${c.card} ${c.laser}`}><i /><b>Laser</b></div>
    </div>
  );
}

function ScanSweep() {
  return (
    <div className={c.fig} role="img" aria-label="A scan line passing down a card and revealing its text">
      <div className={`${c.card} ${c.scanCard}`}><p>Read as the line passes.</p><i /></div>
    </div>
  );
}

function XrayLens() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.xray}`} aria-label="A card with a lens that shows its wireframe" style={{ ...bind.style, ...light(p, [60, 50]) }}>
        <b>Surface</b>
        <span className={c.wire} aria-hidden="true"><b>Wireframe</b></span>
      </div>
    </div>
  );
}

function HeatTrail() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.heat}`} aria-label="A card where a warm trail follows the pointer" style={{ ...bind.style, '--lx': `${p ? p.x : 50}%`, '--ly': `${p ? p.y : 50}%` }}>
        <i /><i /><i /><b>Trail</b>
      </div>
    </div>
  );
}

function FocusGlow() {
  return (
    <div className={c.fig}>
      <div className={`${c.card} ${c.focus}`}>
        <b>Focus</b>
        <button type="button" className={c.btn}>Tab to me</button>
      </div>
    </div>
  );
}

/* ---------- 03 pulses, rings and small lights ---------- */

function HaloRings() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A dot with halo rings" {...bind}>
      <span className={c.halo}><i /><i /><i /><b /></span>
    </button>
  );
}

function PulseRadar() {
  return (
    <div className={c.fig} role="img" aria-label="Pulses spreading from a point like a radar">
      <div className={c.radar}><i /><i /><i /><b /></div>
    </div>
  );
}

function Ripple() {
  const [rip, setRip] = useState(null);
  return (
    <button
      type="button"
      className={`${c.fig} ${c.reset}`}
      aria-label="A card that ripples where you press"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setRip({ x: e.clientX - r.left, y: e.clientY - r.top, k: Date.now() });
      }}
    >
      <span className={`${c.card} ${c.ripple}`}>
        {rip ? <i key={rip.k} style={{ left: rip.x, top: rip.y }} /> : null}
        <b>Ripple</b><span>press anywhere</span>
      </span>
    </button>
  );
}

function EdgeLight() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={`${c.card} ${c.edge}`}><i /><b>Edge</b><span>a line of light on top</span></span>
    </button>
  );
}

function GlowButton() {
  return (
    <div className={c.fig}>
      <button type="button" className={c.gbtn}><span>Glow</span></button>
    </div>
  );
}

function GlowField() {
  const [v, setV] = useState('');
  return (
    <div className={c.fig}>
      <label className={c.field}>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Type here" aria-label="A field that glows while you type" spellCheck="false" autoComplete="off" />
      </label>
    </div>
  );
}

function GlowToggle() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" role="switch" aria-checked={on} aria-label="Glow switch" className={`${c.fig} ${c.reset}`} onClick={flip}>
      <span className={c.sw} data-on={on}><i /></span>
    </button>
  );
}

function GlowBar() {
  return (
    <div className={c.fig} role="img" aria-label="A progress bar with a glowing leading edge">
      <div className={c.gbar}><i /></div>
    </div>
  );
}

function GlowLine() {
  return (
    <div className={c.fig} role="img" aria-label="A glowing line chart being drawn">
      <svg className={c.gline} viewBox="0 0 120 40" aria-hidden="true">
        <path pathLength="1" d="M2 32C14 30 18 14 30 16S44 34 56 26 70 6 84 12 100 30 118 8" />
      </svg>
    </div>
  );
}

const TRAIL = [0, 1, 2, 3, 4];
function DotTrail() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={c.trail} aria-label="Dots that trail the pointer, each a little later">
        {TRAIL.map((i) => <i key={i} style={{ left: `${p ? p.x : 50}%`, top: `${p ? p.y : 50}%`, '--i': i, opacity: p ? 1 - i * 0.18 : 0.2 }} />)}
      </div>
    </div>
  );
}

function MagicCard() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.card} ${c.magic}`} aria-label="A card with a spotlight inside and a glowing border" style={{ ...bind.style, ...light(p) }}>
        <b>Magic</b><span>border and fill together</span>
      </div>
    </div>
  );
}

function MeshGradient() {
  return (
    <div className={c.fig} role="img" aria-label="A card filled with a slowly moving mesh gradient">
      <div className={`${c.card} ${c.mesh}`}><b>Mesh</b></div>
    </div>
  );
}

const STARS = Array.from({ length: 22 }, (_, i) => [(i * 37) % 100, (i * 53 + 11) % 100, (i % 5) * 0.5]);
function Starfield() {
  return (
    <div className={c.fig} role="img" aria-label="A card full of twinkling stars">
      <div className={`${c.card} ${c.stars}`}>
        {STARS.map(([x, y, d], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s` }} />)}
        <b>Stars</b>
      </div>
    </div>
  );
}

function Candle() {
  return (
    <div className={c.fig} role="img" aria-label="A candle flame flickering">
      <div className={c.candle}><i className={c.halo2} /><i className={c.flame} /><i className={c.wick} /><i className={c.wax} /></div>
    </div>
  );
}

function LightLeak() {
  return (
    <div className={c.fig} role="img" aria-label="A light leak drifting across a card">
      <div className={`${c.card} ${c.leak}`}><i /><b>Leak</b></div>
    </div>
  );
}

function Bokeh() {
  return (
    <div className={c.fig} role="img" aria-label="Soft out-of-focus lights drifting behind a card">
      <div className={`${c.card} ${c.bokeh}`}>
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
        <b>Bokeh</b>
      </div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Spotlight card', SpotlightCard, 'hover'], ['Border beam', BorderBeam, 'auto'], ['Gradient border', GradientBorder, 'auto'], ['Spin border', SpinBorder, 'auto'],
    ['Outline glow', OutlineGlow, 'hover'], ['Inner glow', InnerGlow, 'hover'], ['Rim light', RimLight, 'hover'], ['Flashlight text', FlashlightText, 'hover'],
    ['Shared light', SharedLight, 'hover'], ['Prism edge', PrismEdge, 'hover'], ['Aurora card', AuroraCard, 'auto'], ['Press flash', PressFlash, 'press'],
    ['Breathing glow', BreathingGlow, 'auto'], ['Shine border', ShineBorder, 'auto'], ['Meteors', Meteors, 'auto'], ['Top beam', TopBeam, 'auto'],
    ['Lens flare', LensFlare, 'hover'], ['Backlight', Backlight, 'hover'], ['Bloom text', BloomText, 'click'], ['Light switch', LightSwitch, 'click'],
    ['Dimmer', Dimmer, 'drag'], ['Laser grid', LaserGrid, 'auto'], ['Scan sweep', ScanSweep, 'auto'], ['X-ray lens', XrayLens, 'hover'],
    ['Heat trail', HeatTrail, 'hover'], ['Focus glow', FocusGlow, 'keys'], ['Halo rings', HaloRings, 'hover'], ['Pulse radar', PulseRadar, 'auto'],
    ['Ripple', Ripple, 'press'], ['Edge light', EdgeLight, 'hover'], ['Glow button', GlowButton, 'hover'], ['Glow field', GlowField, 'type'],
    ['Glow toggle', GlowToggle, 'click'], ['Glow bar', GlowBar, 'auto'], ['Glow line', GlowLine, 'auto'], ['Dot trail', DotTrail, 'hover'],
    ['Magic card', MagicCard, 'hover'], ['Mesh gradient', MeshGradient, 'auto'], ['Starfield', Starfield, 'auto'], ['Candle', Candle, 'auto'],
    ['Light leak', LightLeak, 'auto'], ['Bokeh', Bokeh, 'auto'],
  ],
};
