import { useRef, useState } from 'react';
import { useDrag, useToggle } from '../hooks';
import { useHot, useScan, usePoint } from '../kit';
import c from './tilt.module.css';

/* ============================================================
   16 · TILT — cards with depth and weight.
   The still side is an exploded module in isometric view. Its six layers pull
   apart along the vertical axis and close again as you scroll, and the whole
   thing turns a quarter: the gap is sin(pin × π), the turn is pin, both in CSS.
   Forty-two cards ride the fly-through, each doing something with perspective.
   ============================================================ */

const LAYERS = ['base', 'grid', 'trace', 'chip', 'fins', 'pane'];
const TRACES = 'M10 30H40V60H70M10 50H25V80H60M90 20V45H60M90 90H70V70M30 90V70H45';

function Visual() {
  return (
    <div className={c.iso} aria-hidden="true">
      <div className={c.scene}>
        {LAYERS.map((l, i) => (
          <div key={l} className={`${c.layer} ${c[l]}`} style={{ '--i': i }}>
            {l === 'trace' ? <svg viewBox="0 0 100 100"><path d={TRACES} /></svg> : null}
            {l === 'chip' ? <b>H</b> : null}
            {l === 'fins' ? [0, 1, 2, 3, 4, 5].map((k) => <i key={k} />) : null}
          </div>
        ))}
      </div>
      <p className={c.isoTag}><i className="sc-led" /> Exploded view</p>
    </div>
  );
}

/* ---------- helpers ---------- */

/** -1..1 either side of the middle, or 0 when nothing is pointing */
const lean = (p) => ({ x: p ? (p.x - 50) / 50 : 0, y: p ? (p.y - 50) / 50 : 0 });

/* ---------- 01 pointer and perspective ---------- */

function PointerTilt() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="A card that tilts toward the pointer">
        <div className={c.card} style={{ transform: `rotateY(${(x * 15).toFixed(1)}deg) rotateX(${(-y * 15).toFixed(1)}deg)`, '--gx': `${p ? p.x : 50}%`, '--gy': `${p ? p.y : 25}%` }}>
          <b>Tilt</b><span>toward the pointer</span><i className={c.glare} />
        </div>
      </div>
    </div>
  );
}

function LayerParallax() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  const at = (d) => ({ transform: `translate(${(x * d).toFixed(1)}px, ${(y * d).toFixed(1)}px)` });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="Layers that shift at different depths">
        <div className={`${c.card} ${c.layers}`}>
          <span className={c.l0} style={at(-4)} />
          <span className={c.l1} style={at(8)} />
          <span className={c.l2} style={at(16)} />
          <b className={c.l3} style={at(26)}>Depth</b>
        </div>
      </div>
    </div>
  );
}

function LiftHover() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.stage}>
        <span className={`${c.card} ${c.lift}`}><b>Lift</b><span>rises, shadow widens</span></span>
        <i className={c.floor} />
      </span>
    </button>
  );
}

function IdleSway() {
  return (
    <div className={c.fig} role="img" aria-label="A card swaying gently in space">
      <div className={c.stage}>
        <div className={`${c.card} ${c.sway}`}><b>Sway</b><span>idle motion</span></div>
      </div>
    </div>
  );
}

function CardFan() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Three cards that fan out" {...bind}>
      <span className={c.fan}>
        {[0, 1, 2].map((i) => <i key={i} style={{ '--i': i }}>{['A', 'B', 'C'][i]}</i>)}
      </span>
    </button>
  );
}

function PeekCard() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A card hiding another" {...bind}>
      <span className={c.peek}>
        <i className={c.back}><b>Under</b></i>
        <i className={c.front}><b>Over</b></i>
      </span>
    </button>
  );
}

function MagneticCard() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="A card that leans toward the pointer">
        <div className={`${c.card} ${c.mag}`} style={{ transform: `translate(${(x * 14).toFixed(1)}px, ${(y * 10).toFixed(1)}px) scale(${p ? 1.04 : 1})` }}><b>Magnet</b><span>follows, slowly</span></div>
      </div>
    </div>
  );
}

function CubeDrag() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.12 });
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.stage} ${c.cubeStage}`} aria-label="Drag to turn the cube" style={{ ...bind.style }}>
        <div className={c.cube} style={{ transform: `rotateX(-22deg) rotateY(${(v * 360).toFixed(1)}deg)` }}>
          {['A', 'B', 'C', 'D'].map((f, i) => <i key={f} style={{ '--i': i }}>{f}</i>)}
          <i className={c.top} />
          <i className={c.bottom} />
        </div>
      </div>
    </div>
  );
}

function IsoBlock() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="An isometric block that rises" {...bind}>
      <span className={c.isoBlock}><i className={c.bTop} /><i className={c.bLeft} /><i className={c.bRight} /></span>
    </button>
  );
}

function DragTilt() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  return (
    <div className={c.fig}>
      <div className={c.stage}>
        <div {...bind} className={`${c.card} ${c.grab}`} aria-label="Drag across the card to turn it" style={{ ...bind.style, transform: `rotateY(${((v - 0.5) * 70).toFixed(1)}deg)` }}>
          <b>Turn</b><span>drag across</span>
        </div>
      </div>
    </div>
  );
}

function PressDown() {
  const [down, setDown] = useState(false);
  const isKey = (e) => e.key === ' ' || e.key === 'Enter';
  return (
    <div className={c.fig}>
      <button
        type="button"
        className={`${c.stage} ${c.reset}`}
        aria-pressed={down}
        aria-label="A card you can press"
        onPointerDown={() => setDown(true)}
        onPointerUp={() => setDown(false)}
        onPointerLeave={() => setDown(false)}
        onPointerCancel={() => setDown(false)}
        onBlur={() => setDown(false)}
        onKeyDown={(e) => { if (isKey(e) && !e.repeat) { e.preventDefault(); setDown(true); } }}
        onKeyUp={(e) => { if (isKey(e)) setDown(false); }}
      >
        <span className={`${c.card} ${c.press}`} data-down={down}><b>Press</b><span>{down ? 'pressed' : 'hold me'}</span></span>
      </button>
    </div>
  );
}

function FloatCard() {
  return (
    <div className={c.fig} role="img" aria-label="A card floating above its shadow">
      <div className={c.stage}>
        <div className={`${c.card} ${c.float}`}><b>Float</b><span>breathes</span></div>
        <i className={c.drop} />
      </div>
    </div>
  );
}

function DepthText() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  const at = (d) => ({ transform: `translate(${(x * d).toFixed(1)}px, ${(y * d * 0.6).toFixed(1)}px)` });
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.stage} ${c.depthStage}`} aria-label="Three lines of type at three depths">
        <p className={c.depth}>
          <span style={at(-12)}>DEEP</span>
          <span style={at(0)}>FIELD</span>
          <span style={at(14)}>TYPE</span>
        </p>
      </div>
    </div>
  );
}

function FoilCard() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="A foil card whose colour follows the pointer">
        <div className={`${c.card} ${c.foil}`} style={{ transform: `rotateY(${(x * 10).toFixed(1)}deg) rotateX(${(-y * 10).toFixed(1)}deg)`, '--a': `${(x * 90 + 200).toFixed(0)}deg`, '--gx': `${p ? p.x : 50}%`, '--gy': `${p ? p.y : 50}%` }}><b>Foil</b></div>
      </div>
    </div>
  );
}

function GlossSweep() {
  return (
    <div className={c.fig} role="img" aria-label="A card with a gloss that sweeps across">
      <div className={c.stage}><div className={`${c.card} ${c.gloss}`}><b>Gloss</b><span>passes by</span></div></div>
    </div>
  );
}

/* ---------- 02 flips, hinges and stacks ---------- */

function CardFlip() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Card; flip it over" onClick={flip}>
      <span className={c.stage}>
        <span className={c.flipper} data-on={on}>
          <span className={`${c.card} ${c.face}`}><b>Front</b></span>
          <span className={`${c.card} ${c.face} ${c.backFace}`}><b>Back</b></span>
        </span>
      </span>
    </button>
  );
}

const DECK = ['A', 'B', 'C', 'D'];
function StackShuffle() {
  const [order, setOrder] = useState(DECK);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="A deck of four cards; send the top one to the back" onClick={() => setOrder((o) => [...o.slice(1), o[0]])}>
      <span className={c.deck}>
        {DECK.map((k) => <i key={k} style={{ '--r': order.indexOf(k) }}>{k}</i>)}
      </span>
    </button>
  );
}

function HingeCover() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A card with a cover that opens" onClick={flip}>
      <span className={c.stage}>
        <span className={c.book} data-on={on}>
          <i className={c.inner}><b>Inside</b></i>
          <i className={c.cover}><b>Cover</b></i>
        </span>
      </span>
    </button>
  );
}

function DoorCard() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A card with a door" {...bind}>
      <span className={c.stage}>
        <span className={c.doorway}>
          <i className={c.room}>Light</i>
          <i className={c.door} />
        </span>
      </span>
    </button>
  );
}

function DrawerCard() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-expanded={on} aria-label="A card with a drawer" onClick={flip}>
      <span className={c.drawerBox} data-on={on}>
        <i className={c.drawer}><b>Drawer</b></i>
        <i className={c.shell}><b>Card</b><span>pull for more</span></i>
      </span>
    </button>
  );
}

function WobbleClick() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="A card that wobbles when pressed" onClick={() => setN((v) => v + 1)}>
      <span className={c.stage}>
        <span key={n} className={`${c.card} ${n ? c.wobble : ''}`}><b>Wobble</b><span>{n} {n === 1 ? 'push' : 'pushes'}</span></span>
      </span>
    </button>
  );
}

function CoverFlow() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const pos = v * 4;
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.stage} ${c.flowStage}`} aria-label="Drag to move along the row of cards" aria-valuetext={`Card ${Math.round(pos) + 1} of 5`} style={{ ...bind.style }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const d = i - pos;
          return <i key={i} className={c.flowCard} style={{ transform: `translateX(${(d * 34).toFixed(1)}px) translateZ(${(-Math.abs(d) * 40).toFixed(0)}px) rotateY(${(Math.max(-1, Math.min(1, d)) * -52).toFixed(1)}deg)`, zIndex: 10 - Math.round(Math.abs(d) * 2) }}>{i + 1}</i>;
        })}
      </div>
    </div>
  );
}

const DRAWERS = [['One', 'The first card, open.'], ['Two', 'A second card, folded.'], ['Three', 'And a third.']];
function StackAccordion() {
  const [k, setK] = useState(0);
  return (
    <div className={c.fig}>
      <div className={c.acc}>
        {DRAWERS.map(([t, body], i) => (
          <div key={t} className={c.accCard} data-on={i === k}>
            <button type="button" aria-expanded={i === k} onClick={() => setK(i)}>{t}</button>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlabEdge() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="A thick slab that turns toward the pointer">
        <div className={c.slab} style={{ transform: `rotateY(${(x * 26).toFixed(1)}deg) rotateX(${(-y * 20).toFixed(1)}deg)` }}>
          {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
          <b>Slab</b>
        </div>
      </div>
    </div>
  );
}

function ElevationSlider() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.4, steps: 5 });
  const n = Math.round(v * 5);
  return (
    <div className={c.fig}>
      <div className={c.elevStage}><div className={c.elev} style={{ '--n': n }}><b>Level {n}</b></div></div>
      <div {...bind} className={c.track} aria-label="Elevation" aria-valuetext={`Level ${n} of 5`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

function ElevationLadder() {
  const [i, bind] = useScan(5, { axis: 'x', label: (k) => `Elevation ${k + 1}` });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.ladder} aria-label="Five cards at five heights; move along them">
        {[0, 1, 2, 3, 4].map((k) => <i key={k} data-on={i === k} style={{ '--n': k + 1 }} />)}
      </div>
    </div>
  );
}

/* ---------- 03 glass, light and orbits ---------- */

function GlassSlab() {
  const [p, bind] = usePoint();
  const { x } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={`${c.stage} ${c.glassStage}`} aria-label="Frosted glass over coloured shapes">
        <i className={c.orb1} /><i className={c.orb2} />
        <div className={c.glass} style={{ transform: `translateX(${(x * 12).toFixed(1)}px)`, '--gx': `${p ? p.x : 40}%` }}><b>Glass</b></div>
      </div>
    </div>
  );
}

function PerspectiveFloor() {
  return (
    <div className={c.fig} role="img" aria-label="A grid floor rushing toward the viewer">
      <div className={c.floorBox}>
        <i className={c.grid3d} />
        <b className={c.horizon}>Floor</b>
      </div>
    </div>
  );
}

function OrbitCards() {
  return (
    <div className={c.fig} role="img" aria-label="Three cards orbiting a point">
      <div className={`${c.stage} ${c.orbitStage}`}>
        <div className={c.orbit}>{[0, 1, 2].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
      </div>
    </div>
  );
}

function Rolodex() {
  return (
    <div className={c.fig} role="img" aria-label="A rolodex of cards turning end over end">
      <div className={`${c.stage} ${c.orbitStage}`}>
        <div className={c.rolo}>{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--i': i }}>{i + 1}</i>)}</div>
      </div>
    </div>
  );
}

function TiltedPair() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Two tilted cards that line up" {...bind}>
      <span className={c.pair}><i><b>One</b></i><i><b>Two</b></i></span>
    </button>
  );
}

function ElasticDrag() {
  const [off, setOff] = useState({ x: 0, y: 0, drag: false });
  const start = useRef(null);
  const down = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); start.current = [e.clientX, e.clientY]; setOff((o) => ({ ...o, drag: true })); };
  const move = (e) => { if (start.current) setOff({ x: Math.max(-70, Math.min(70, e.clientX - start.current[0])), y: Math.max(-26, Math.min(26, e.clientY - start.current[1])), drag: true }); };
  const up = () => { start.current = null; setOff({ x: 0, y: 0, drag: false }); };
  const key = (e) => {
    const d = { ArrowLeft: [-30, 0], ArrowRight: [30, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[e.key];
    if (d) { e.preventDefault(); setOff((o) => ({ x: Math.max(-70, Math.min(70, o.x + d[0])), y: Math.max(-26, Math.min(26, o.y + d[1])), drag: true })); }
    if (e.key === 'Escape' || e.key === 'Enter') up();
  };
  return (
    <div className={c.fig}>
      <div className={c.stage}>
        <div role="application" aria-roledescription="draggable card" aria-label="Drag the card; it springs back" tabIndex={0} className={`${c.card} ${c.elastic}`} data-drag={off.drag} style={{ transform: `translate(${off.x}px, ${off.y}px) rotate(${off.x * 0.14}deg)`, touchAction: 'none' }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key} onBlur={up}>
          <b>Elastic</b><span>pull and let go</span>
        </div>
      </div>
    </div>
  );
}

function ThrowCard() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="A card that hops across and back" onClick={() => setN((v) => v + 1)}>
      <span className={c.throwBox}>
        <i key={n} className={n ? c.hop : ''}><b>Hop</b></i>
        <u className={c.spot} />
      </span>
    </button>
  );
}

function PageCurl() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A page whose corner curls" {...bind}>
      <span className={c.curl}><b>Curl</b><i /></span>
    </button>
  );
}

function PopUpCard() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A pop-up card; open it" onClick={flip}>
      <span className={c.popup} data-on={on}>
        <i className={c.pBase} />
        <i className={`${c.pFig} ${c.p1}`} /><i className={`${c.pFig} ${c.p2}`} /><i className={`${c.pFig} ${c.p3}`} />
      </span>
    </button>
  );
}

function CoinFlip() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`A coin; flip it. Showing ${n % 2 ? 'tails' : 'heads'}`} onClick={() => setN((v) => v + 1)}>
      <span className={c.coinBox}>
        <span className={c.coin} style={{ transform: `rotateY(${n * 540 + 0}deg)` }}><i>H</i><i className={c.tails}>T</i></span>
      </span>
    </button>
  );
}

function SlabStack() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A stack of slabs that spreads" {...bind}>
      <span className={c.slabs}>{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
    </button>
  );
}

function DollyZoom() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Three layers that zoom at different rates" {...bind}>
      <span className={c.dolly}><i className={c.d1} /><i className={c.d2} /><i className={c.d3}><b>Zoom</b></i></span>
    </button>
  );
}

function ShadowCaster() {
  const [p, bind] = usePoint();
  const { x, y } = lean(p);
  return (
    <div className={c.fig}>
      <div {...bind} className={c.stage} aria-label="A floating card whose shadow moves away from the pointer">
        <div className={`${c.card} ${c.cast}`} style={{ boxShadow: `${(-x * 22).toFixed(0)}px ${(-y * 22 + 26).toFixed(0)}px 26px -6px rgba(0, 0, 0, 0.9), ${(-x * 8).toFixed(0)}px ${(-y * 8 + 8).toFixed(0)}px 10px rgba(0, 0, 0, 0.5)` }}><b>Shadow</b><span>moves away from the light</span></div>
      </div>
    </div>
  );
}

function Turntable() {
  return (
    <div className={c.fig} role="img" aria-label="A card standing on a turntable">
      <div className={`${c.stage} ${c.orbitStage}`}>
        <div className={c.turn}><i className={c.tFront}><b>Front</b></i><i className={c.tBack}><b>Back</b></i></div>
        <u className={c.plate} />
      </div>
    </div>
  );
}

function FanScan() {
  const [i, bind] = useScan(5, { axis: 'x', label: (k) => `Card ${k + 1}` });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.scan} aria-label="Five cards that lean with the pointer">
        {[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ transform: `rotateY(${(i < 0 ? 0 : (k - i) * -16).toFixed(0)}deg) translateZ(${i === k ? 26 : 0}px)` }}>{k + 1}</i>)}
      </div>
    </div>
  );
}

function DealCards() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A deck that deals out a row of cards" onClick={flip}>
      <span className={c.dealt} data-on={on}>{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--i': i }}>{i + 1}</i>)}</span>
    </button>
  );
}

export default {
  Visual,
  items: [
    ['Pointer tilt', PointerTilt, 'hover'], ['Layer parallax', LayerParallax, 'hover'], ['Lift', LiftHover, 'hover'], ['Idle sway', IdleSway, 'auto'],
    ['Card fan', CardFan, 'hover'], ['Peek card', PeekCard, 'hover'], ['Magnetic card', MagneticCard, 'hover'], ['Cube drag', CubeDrag, 'drag'],
    ['Iso block', IsoBlock, 'hover'], ['Drag tilt', DragTilt, 'drag'], ['Press down', PressDown, 'press'], ['Float card', FloatCard, 'auto'],
    ['Depth text', DepthText, 'hover'], ['Foil card', FoilCard, 'hover'], ['Gloss sweep', GlossSweep, 'auto'], ['Card flip', CardFlip, 'click'],
    ['Stack shuffle', StackShuffle, 'click'], ['Hinge cover', HingeCover, 'click'], ['Door card', DoorCard, 'hover'], ['Drawer card', DrawerCard, 'click'],
    ['Wobble', WobbleClick, 'click'], ['Cover flow', CoverFlow, 'drag'], ['Stack accordion', StackAccordion, 'click'], ['Slab edge', SlabEdge, 'hover'],
    ['Elevation slider', ElevationSlider, 'drag'], ['Elevation ladder', ElevationLadder, 'hover'], ['Glass slab', GlassSlab, 'hover'], ['Perspective floor', PerspectiveFloor, 'auto'],
    ['Orbit cards', OrbitCards, 'auto'], ['Rolodex', Rolodex, 'auto'], ['Tilted pair', TiltedPair, 'hover'], ['Elastic drag', ElasticDrag, 'drag'],
    ['Hop card', ThrowCard, 'click'], ['Page curl', PageCurl, 'hover'], ['Pop-up card', PopUpCard, 'click'], ['Coin flip', CoinFlip, 'click'],
    ['Slab stack', SlabStack, 'hover'], ['Dolly zoom', DollyZoom, 'hover'], ['Shadow caster', ShadowCaster, 'hover'], ['Turntable', Turntable, 'auto'],
    ['Fan scan', FanScan, 'hover'], ['Deal cards', DealCards, 'click'],
  ],
};
