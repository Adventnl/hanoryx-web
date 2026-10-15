import { useState } from 'react';
import { clamp, useCycle, useDrag, useToggle } from '../hooks';
import { usePointer } from '../pointerVars';
import c from './lenses.module.css';

/* ============================================================
   35 · LENSES — magnifiers, compare and focus.
   A lens shows the same thing twice, once as it is and once changed, and lets
   the pointer decide where. Most specimens publish the pointer as --x / --y
   (pointerVars.js) and draw a second, changed copy of the picture clipped to
   a shape that sits on it; a wandering virtual pointer keeps them moving until
   you take over. The still side is one lens that the scroll carries across a
   page of small type, enlarging whatever it passes.
   ============================================================ */

function Visual() {
  const text = 'Every great interface is a small act of attention, repeated until it feels like care.';
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visPage}>
        <p>{text}</p>
        <div className={c.visLens}><div><p>{text}</p></div></div>
        <i />
      </div>
      <small>1 LENS · 1 PAGE</small>
    </div>
  );
}

function Area({ label, className = '', children, auto = true, ...rest }) {
  const [ref, bind] = usePointer(auto);
  return <div ref={ref} className={`${c.area} ${className}`} role="application" aria-label={`${label}. Move the pointer here, or use the arrow keys.`} tabIndex={0} {...bind} {...rest}>{children}</div>;
}

const COPY = 'Small type rewards a closer look, and a lens is how you give it one.';
const Scene = ({ className = '' }) => <div className={`${c.scene} ${className}`} aria-hidden="true"><i /><b /><u /></div>;

/* 1 */ function Magnifier() {
  return <Area label="Magnifier" className={c.mag}><p>{COPY}</p><div className={c.lens}><div><p>{COPY}</p></div></div><i className={c.rim} /></Area>;
}

/* 2 */ function SquareLoupe() {
  return <Area label="Square loupe" className={`${c.mag} ${c.square}`}><p>{COPY}</p><div className={c.lens}><div><p>{COPY}</p></div></div><i className={c.rim} /></Area>;
}

/* 3 */ function SidePane() {
  return (
    <Area label="Zoom with a side pane" className={c.side}>
      <Scene className={c.fill} /><i className={c.box} />
      <div className={c.pane}><div><Scene /></div></div>
    </Area>
  );
}

/* 4 */ function BeforeAfter() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={`${c.area} ${c.slider}`} style={{ '--v': v }}>
      <Scene className={c.fill} /><Scene className={`${c.fill} ${c.mono} ${c.cut}`} />
      <i {...bind} aria-label="Before and after" aria-valuetext={`${Math.round(v * 100)} percent after`} style={bind.style} />
    </div>
  );
}

/* 5 */ function VerticalCompare() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5 });
  return (
    <div className={`${c.area} ${c.sliderV}`} style={{ '--v': 1 - v }}>
      <Scene className={c.fill} /><Scene className={`${c.fill} ${c.mono} ${c.cutV}`} />
      <i {...bind} aria-label="Top and bottom compare" aria-valuetext={`${Math.round((1 - v) * 100)} percent`} style={bind.style} />
    </div>
  );
}

/* 6 */ function Clear() { return <Area label="Clear patch" className={c.clear}><Scene className={c.fill} /><div className={c.veil} /></Area>; }
/* 7 */ function Dim() { return <Area label="Dimmed focus" className={c.dim}><Scene className={c.fill} /><div className={c.dimmer} /><i className={c.rim} /></Area>; }
/* 8 */ function Depth() { return <Area label="Depth of field" className={c.dof}><div>{['Near', 'Mid', 'Far'].map((t, k) => <span key={t} style={{ '--z': k }}>{t}</span>)}</div></Area>; }
/* 9 */ function Fisheye() { return <Area label="Fisheye bars" className={c.fish}>{Array.from({ length: 14 }, (_, k) => <i key={k} style={{ '--cx': (k + 0.5) / 14, '--h': 0.3 + ((k * 37) % 55) / 100 }} />)}</Area>; }
/* 10 */ function LetterLens() { return <Area label="Letter lens" className={c.letters}><p>{'LENSES'.split('').map((l, k) => <span key={k} style={{ '--cx': 0.16 + k * 0.136 }}>{l}</span>)}</p></Area>; }
/* 11 */ function Peephole() { return <Area label="Peephole" className={c.peep}><Scene className={c.fill} /><div className={c.door} /></Area>; }
/* 12 */ function XRay() { return <Area label="X-ray" className={c.xray}><div className={c.body}><i /><i /><i /><i /></div><div className={c.lens}><div className={c.bones}><i /><i /><i /><i /></div></div><i className={c.rim} /></Area>; }
/* 13 */ function Invert() { return <Area label="Inverting lens" className={c.mag}><Scene className={c.fill} /><div className={`${c.lens} ${c.inv}`}><div><Scene /></div></div><i className={c.rim} /></Area>; }
/* 14 */ function Colourise() { return <Area label="Colour patch" className={c.mag}><Scene className={`${c.fill} ${c.mono}`} /><div className={`${c.lens} ${c.colour}`}><div><Scene /></div></div><i className={c.rim} /></Area>; }

/* 15 */ function ZoomSteps() {
  const [k, setK] = useState(1);
  return (
    <div className={c.zoomSteps}>
      <div className={c.viewport}><div style={{ '--z': [1, 2, 4][k] }}><Scene /></div></div>
      <div role="radiogroup" aria-label="Zoom level">{['1×', '2×', '4×'].map((t, i) => <button key={t} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
    </div>
  );
}

/* 16 */ function ZoomSlider() {
  const [v, setV] = useState(0.4);
  return (
    <div className={c.zoomSteps}>
      <div className={c.viewport}><div style={{ '--z': 1 + v * 4 }}><Scene /></div></div>
      <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Zoom" />
    </div>
  );
}

/* 17 */ function Minimap() { return <Area label="Viewfinder on a thumbnail" className={c.mini}><Scene className={c.fill} /><i className={c.finder} /></Area>; }

/* 18 */ function Diagonal() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={`${c.area} ${c.diag}`} style={{ '--v': v }}>
      <Scene className={c.fill} /><Scene className={`${c.fill} ${c.mono} ${c.cutD}`} />
      <i {...bind} aria-label="Diagonal compare" aria-valuetext={`${Math.round(v * 100)} percent`} style={bind.style} />
    </div>
  );
}

/* 19 */ function Onion() {
  const [v, bind] = useDrag({ init: 0.5 });
  return (
    <div className={`${c.area} ${c.onion}`} style={{ '--v': v }}>
      <Scene className={c.fill} /><Scene className={`${c.fill} ${c.mono} ${c.fade}`} />
      <i {...bind} aria-label="Blend" aria-valuetext={`${Math.round(v * 100)} percent`} style={bind.style}><b /></i>
    </div>
  );
}

/* 20 */ function Difference() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.diffBox}>
      <div className={`${c.area} ${c.diffA}`} data-on={on}><Scene className={c.fill} /><Scene className={`${c.fill} ${c.shift}`} /></div>
      <button type="button" aria-pressed={on} onClick={flip}>{on ? 'Difference on' : 'Difference off'}</button>
    </div>
  );
}

/* 21 */ function HoldCompare() {
  const [b, setB] = useState(false);
  return (
    <div className={c.hold}>
      <div className={`${c.area} ${c.holdBox}`}><Scene className={c.fill} /><Scene className={`${c.fill} ${c.mono} ${c.holdTop}`} data-b={b} /></div>
      <button type="button" onPointerDown={() => setB(true)} onPointerUp={() => setB(false)} onPointerLeave={() => setB(false)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setB(true); }} onKeyUp={() => setB(false)} onBlur={() => setB(false)}>Hold for before</button>
    </div>
  );
}

/* 22 */ function Flare() { return <Area label="Lens flare" className={c.flare}><Scene className={c.fill} /><i className={c.f1} /><i className={c.f2} /><i className={c.f3} /></Area>; }

/* 23 */ function Autofocus() {
  const k = useCycle(3, 1800);
  const spots = [[24, 40], [60, 62], [78, 30]];
  return (
    <div className={`${c.area} ${c.af}`}><Scene className={c.fill} /><i style={{ left: `${spots[k][0]}%`, top: `${spots[k][1]}%` }} /><span>AF · {k + 1}</span></div>
  );
}

/* 24 */ function Viewfinder() { return <div className={`${c.area} ${c.vf}`}><Scene className={c.fill} /><div><i /><i /><i /><i /></div><b>REC ●</b></div>; }

/* 25 */ function RackFocus() {
  const [front, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.area} ${c.rack}`} data-front={front} aria-pressed={front} aria-label="Rack focus. Press to switch focus" onClick={flip}>
      <span className={c.near}>Near</span><span className={c.far}>Far</span>
    </button>
  );
}

/* 26 */ function Iris() {
  const [v, bind] = useDrag({ init: 0.55 });
  return (
    <div className={c.irisBox}>
      <div {...bind} className={c.iris} aria-label="Aperture" aria-valuetext={`f/${(1.4 + (1 - v) * 14).toFixed(1)}`} style={{ ...bind.style, '--v': v }}>{Array.from({ length: 8 }, (_, k) => <i key={k} style={{ '--k': k }} />)}<b /></div>
      <output>f/{(1.4 + (1 - v) * 14).toFixed(1)}</output>
    </div>
  );
}

/* 27 */ function Binoculars() { return <Area label="Binoculars" className={c.binos}><Scene className={c.fill} /><div className={c.cover} /></Area>; }
/* 28 */ function Keyhole() { return <Area label="Keyhole" className={c.key}><Scene className={`${c.fill} ${c.darkS}`} /><Scene className={`${c.fill} ${c.keyClip}`} /></Area>; }
/* 29 */ function Ruler() { return <Area label="Reading ruler" className={c.ruler}><p>{COPY} {COPY}</p><i /></Area>; }
/* 30 */ function LineFocus() { return <Area label="Line focus" className={c.lineFocus}>{['The light was low', 'and the page was long;', 'we read it line by line', 'until the night was gone.'].map((t, k) => <span key={t} style={{ '--cy': (k + 0.5) / 4 }}>{t}</span>)}</Area>; }
/* 31 */ function WordSwell() { return <Area label="Word swell" className={c.swell}><p>{['A', 'lens', 'makes', 'one', 'word', 'loud'].map((w, k) => <span key={w} style={{ '--cx': 0.1 + k * 0.16 }}>{w}</span>)}</p></Area>; }
/* 32 */ function Bubble() { return <Area label="Bubble" className={c.bubble}><div className={c.dots} /><i /></Area>; }
/* 33 */ function GlassLens() { return <Area label="Glass lens" className={c.glass}><div className={c.stripes} /><i /></Area>; }
/* 34 */ function Prism() { return <Area label="Prism split" className={c.prism}><h4>PRISM</h4><h4 aria-hidden="true">PRISM</h4><h4 aria-hidden="true">PRISM</h4></Area>; }
/* 35 */ function Aberration() { return <Area label="Chromatic edge" className={c.chroma}><Scene className={c.fill} /><i /></Area>; }
/* 36 */ function Scope() { return <Area label="Scope" className={c.mag}><Scene className={c.fill} /><div className={c.lens}><div><Scene className={c.big} /></div></div><i className={c.rim} /><i className={c.reticle} /></Area>; }
/* 37 */ function Picker() { return <Area label="Pixel loupe" className={c.loupe}><Scene className={c.fill} /><i /><b /></Area>; }

/* 38 */ function ClickZoom() {
  const [p, setP] = useState(null);
  return (
    <div className={`${c.area} ${c.clickZoom}`} role="button" tabIndex={0} aria-pressed={Boolean(p)} aria-label="Click to zoom in at that point; click again to reset"
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP((q) => (q ? null : [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100])); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setP((q) => (q ? null : [50, 50])); } }}>
      <div style={{ transformOrigin: p ? `${p[0]}% ${p[1]}%` : '50% 50%', transform: p ? 'scale(3)' : 'none' }}><Scene /></div>
    </div>
  );
}

/* 39 */ function PanWindow() {
  const [pos, setPos] = useState([0.3, 0.4]);
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); setPos([clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height)]); };
  return (
    <div className={`${c.area} ${c.pan}`} role="application" aria-label="Drag to pan the picture" tabIndex={0} onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); }} onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture?.(e.pointerId)) move(e); }} onKeyDown={(e) => { const d = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key]; if (d) { e.preventDefault(); setPos((q) => [clamp(q[0] + d[0]), clamp(q[1] + d[1])]); } }}>
      <div style={{ '--px': pos[0], '--py': pos[1] }}><Scene /></div>
    </div>
  );
}

/* 40 */ function TiltShift() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5 });
  return (
    <div className={`${c.area} ${c.tilt}`} {...bind} aria-label="Tilt shift band" aria-valuetext={`${Math.round((1 - v) * 100)} percent`} style={{ ...bind.style, '--v': 1 - v }}>
      <Scene className={c.fill} /><div className={c.bandTop} /><div className={c.bandBottom} />
    </div>
  );
}

/* 41 */ function Vignette() {
  const [v, setV] = useState(0.5);
  return (
    <div className={c.zoomSteps}>
      <div className={`${c.area} ${c.vig}`} style={{ '--v': v }}><Scene className={c.fill} /><div /></div>
      <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Vignette strength" />
    </div>
  );
}

/* 42 */ function Frost() { return <Area label="Frosted window" className={c.frost}><Scene className={c.fill} /><div className={c.pane2} /></Area>; }

export default {
  Visual,
  items: [
    ['Magnifier', Magnifier, 'hover'], ['Square loupe', SquareLoupe, 'hover'], ['Zoom side pane', SidePane, 'hover'], ['Before and after', BeforeAfter, 'drag'],
    ['Top and bottom', VerticalCompare, 'drag'], ['Clear patch', Clear, 'hover'], ['Dimmed focus', Dim, 'hover'], ['Depth of field', Depth, 'hover'],
    ['Fisheye bars', Fisheye, 'hover'], ['Letter lens', LetterLens, 'hover'], ['Peephole', Peephole, 'hover'], ['X-ray', XRay, 'hover'],
    ['Inverting lens', Invert, 'hover'], ['Colour patch', Colourise, 'hover'], ['Zoom steps', ZoomSteps, 'click'], ['Zoom slider', ZoomSlider, 'drag'],
    ['Viewfinder map', Minimap, 'hover'], ['Diagonal compare', Diagonal, 'drag'], ['Onion skin', Onion, 'drag'], ['Difference blend', Difference, 'click'],
    ['Hold for before', HoldCompare, 'hold'], ['Sun flare', Flare, 'hover'], ['Autofocus box', Autofocus, 'auto'], ['Camera frame', Viewfinder, 'auto'],
    ['Rack focus', RackFocus, 'click'], ['Aperture', Iris, 'drag'], ['Binoculars', Binoculars, 'hover'], ['Keyhole', Keyhole, 'hover'],
    ['Guide band', Ruler, 'hover'], ['Line focus', LineFocus, 'hover'], ['Word swell', WordSwell, 'hover'], ['Soap bubble', Bubble, 'hover'],
    ['Glass lens', GlassLens, 'hover'], ['Prism split', Prism, 'hover'], ['Chromatic edge', Aberration, 'hover'], ['Scope', Scope, 'hover'],
    ['Pixel loupe', Picker, 'hover'], ['Click zoom', ClickZoom, 'click'], ['Pan window', PanWindow, 'drag'], ['Tilt shift', TiltShift, 'drag'],
    ['Vignette slider', Vignette, 'drag'], ['Frosted window', Frost, 'hover'],
  ],
};
