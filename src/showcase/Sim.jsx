import { useEffect, useRef } from 'react';
import { useLive } from './hooks';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/* ---- the engine ----------------------------------------------------------------
   Sim owns a canvas and a loop. `setup(S)` builds the state once (it is kept in
   S.st); `tick(S, dt)` advances and draws one frame. S carries the context, the
   size, the clock, the pointer (S.in, in canvas pixels) and a queue of clicks. */
export function Sim({ label, setup, tick, mode }) {
  const cv = useRef(null);
  const env = useRef(null);
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const touch = mode !== 'auto';

  useEffect(() => {
    const el = cv.current;
    if (!env.current) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      const ctx = el.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const S = { ctx, w, h, t: 0, in: { x: w / 2, y: h / 2, has: false }, poke: [], st: null };
      S.st = setup(S);
      env.current = S;
      if (reduced) for (let i = 0; i < 50; i += 1) tick(S, 0.03);
    }
    const S = env.current;
    if (!live || reduced) { tick(S, 0.016); return undefined; }
    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      S.t += dt;
      tick(S, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live, reduced, setup, tick]);

  const place = (e) => {
    const S = env.current;
    if (!S) return null;
    const r = e.currentTarget.getBoundingClientRect();
    S.in.x = ((e.clientX - r.left) / r.width) * S.w;
    S.in.y = ((e.clientY - r.top) / r.height) * S.h;
    S.in.has = true;
    return S;
  };
  const handlers = touch ? {
    tabIndex: 0,
    role: 'application',
    'aria-label': `${label}. ${mode === 'click' ? 'Click, or press Enter, to trigger it.' : 'Move the pointer or use the arrow keys.'}`,
    onPointerMove: place,
    onPointerLeave: () => { if (env.current) env.current.in.has = false; },
    onPointerDown: (e) => { const S = place(e); if (S) S.poke.push({ x: S.in.x, y: S.in.y }); },
    onKeyDown: (e) => {
      const S = env.current;
      if (!S) return;
      const d = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[e.key];
      if (d) { e.preventDefault(); S.in.has = true; S.in.x = Math.min(S.w, Math.max(0, S.in.x + d[0])); S.in.y = Math.min(S.h, Math.max(0, S.in.y + d[1])); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); S.in.has = true; S.poke.push({ x: S.in.x, y: S.in.y }); }
    },
    onBlur: () => { if (env.current) env.current.in.has = false; },
  } : { role: 'img', 'aria-label': label };

  return <canvas ref={cv} className="sc-sim" {...handlers} />;
}
