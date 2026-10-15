import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { StageApiContext, pad2, useStageVars } from '../hooks';
import { curve } from '../kit';
import { Hud, Visual, common, spec } from './parts';
import { CARD, cameraAt, plan } from './camera';
import s from './canvas.module.css';

/* ============================================================
   CANVAS STAGES — the page is a sheet, not a column. The specimens sit on a
   big flat plane and the scroll flies a camera between them (camera.js):
   it rests on one, pulls back until the way to the next is in view, swings
   across — left, right, up or down — and drops back in. Three plans share the
   machinery: `canvas` (a fractal wander), `atlas` (a sheet read in rows) and
   `spiral` (winding outward).

   Like every stage this never re-renders per frame: the hook hands over the
   scroll position and camera.js turns it into where the camera is. That goes
   straight into the world's own transform — not into custom properties on an
   ancestor, which would make the browser re-style every element of every
   specimen on every frame. The hook's own numbers (--pin and the rest) go to a
   small overlay that holds the monitor, the map and the readout.
   ============================================================ */

const sign = (v) => `${v < 0 ? '−' : '+'}${Math.abs(Math.round(v))}`;

/* the dotted way between specimens, one hop at a time so each can light as it is flown */
function hops(pts) {
  const through = curve(pts.map((p) => [p.x, p.y]));
  // curve() is one long path; for a lit-as-you-go trail each hop needs its own, so cut it at the points
  const parts = through.split('C').slice(1);
  return parts.map((c, i) => `M${pts[i].x} ${pts[i].y}C${c}`);
}

export function CanvasStage({ kind, meta, no, Visual: V, items }) {
  const n = items.length;
  const root = useRef(null);
  const view = useRef(null);
  const world = useRef(null);
  const rail = useRef(null);
  const finder = useRef(null);
  const readout = useRef(null);
  const size = useRef({ w: 1440, h: 900, rem: 16 });
  const out = useRef(false);
  const { jump } = useContext(StageApiContext);
  const plane = useMemo(() => plan(kind, n), [kind, n]);
  const legs = useMemo(() => hops(plane.pts), [plane]);

  /* the screen's size and the size of a rem, kept off the per-frame path */
  useEffect(() => {
    const el = view.current;
    if (!el) return undefined;
    const measure = () => {
      size.current = { w: el.clientWidth, h: el.clientHeight, rem: parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 };
    };
    measure();
    const watch = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    watch?.observe(el);
    window.addEventListener('resize', measure);
    return () => { watch?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const onFrame = useCallback(({ f }) => {
    const el = view.current;
    if (!el) return;
    const { w, h, rem } = size.current;
    const c = cameraAt(f, plane, { w, h }, rem);
    // the world moves the opposite way to the camera: bring the camera to the origin, bank, then scale
    if (world.current) world.current.style.transform = `scale(${c.s.toFixed(4)}) rotate(${c.roll.toFixed(3)}deg) translate(${(-c.x).toFixed(2)}rem, ${(-c.y).toFixed(2)}rem)`;
    // the other specimens light up while the camera is pulled back (only when that changes)
    const wide = c.bell > 0.3;
    if (wide !== out.current) { out.current = wide; el.dataset.out = wide ? '1' : '0'; }
    // the viewfinder on the map: what the screen can see, in canvas units
    const box = finder.current;
    if (box) {
      const vw = w / c.s / rem;
      const vh = h / c.s / rem;
      box.setAttribute('x', (c.x - vw / 2).toFixed(1));
      box.setAttribute('y', (c.y - vh / 2).toFixed(1));
      box.setAttribute('width', vw.toFixed(1));
      box.setAttribute('height', vh.toFixed(1));
    }
    if (readout.current) readout.current.textContent = `${c.s.toFixed(2)}× · X ${sign(c.x)} · Y ${sign(c.y)}`;
  }, [plane]);

  const active = useStageVars(root, { count: n, pinned: true, target: rail, onFrame });
  const pad = 70;

  return (
    <section ref={root} className={s.canvas} style={{ '--n': n }} data-engine={kind} {...common(meta)}>
      <div ref={view} className={s.pin} data-out="0">
        <div className={s.eye}>
          <div ref={world} className={s.world}>
            <i className={s.sheet} data-ground={meta.ground} style={{ left: `${plane.minX - pad}rem`, top: `${plane.minY - pad}rem`, width: `${plane.w + pad * 2}rem`, height: `${plane.h + pad * 2}rem` }} aria-hidden="true" />
            <svg className={s.trail} style={{ left: `${plane.minX}rem`, top: `${plane.minY}rem`, width: `${plane.w}rem`, height: `${plane.h}rem` }} viewBox={`${plane.minX} ${plane.minY} ${plane.w} ${plane.h}`} aria-hidden="true" focusable="false">
              {legs.map((d, i) => <path key={i} d={d} className={clsx(s.leg, i < active && s.flown)} />)}
            </svg>
            {items.map((_, i) => {
              const p = plane.pts[i];
              const here = i === active;
              return (
                <div
                  key={i}
                  className={clsx(s.node, here && s.here)}
                  style={{ '--x': p.x, '--y': p.y, '--w': `${CARD.w - 2}rem` }}
                  /* away from the camera a specimen is a place to fly to: a click takes you there, and so does focusing it */
                  onClickCapture={(e) => { if (!here) { e.preventDefault(); e.stopPropagation(); jump(i); } }}
                  onFocusCapture={() => { if (!here) jump(i); }}
                >
                  <span className={s.ghost} aria-hidden="true">{pad2(i + 1)}</span>
                  <span className={s.tag} aria-hidden="true">X {sign(p.x)} · Y {sign(p.y)}</span>
                  {spec(meta, no, items, i)}
                </div>
              );
            })}
          </div>
        </div>

        <div ref={rail} className={s.rail}>
        <div className={s.pip} data-label={meta.title} aria-hidden="true"><Visual Visual={V} /></div>

        <div className={s.map} data-label="Canvas" aria-hidden="true">
          <svg viewBox={`${plane.minX - 6} ${plane.minY - 6} ${plane.w + 12} ${plane.h + 12}`} preserveAspectRatio="xMidYMid meet">
            <path className={s.mapTrail} d={legs.join('')} />
            {plane.pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === active ? 4.6 : 2.6} className={clsx(s.mapDot, i <= active && s.mapLit, i === active && s.mapHere)} />)}
            <rect ref={finder} className={s.mapView} x="0" y="0" width="0" height="0" />
          </svg>
          <output ref={readout} className={s.readout}>1.00× · X +0 · Y +0</output>
        </div>

        <div className={s.hudBox}><Hud no={no} items={items} active={active} /></div>
        </div>
      </div>
    </section>
  );
}

export default CanvasStage;
