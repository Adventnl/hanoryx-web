import { useEffect, useRef } from 'react';
import { subscribe } from '../../animation/rafScheduler';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { maxDpr } from '../../animation/motionBudget';
import styles from './MiniEngine.module.css';

/* Deterministic pseudo-random so the little world looks the same every visit. */
const h = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * A miniature 2D scene — rectangles and discs drifting in a grid, one of them
 * "selected" with a gizmo that hops between them. It is decoration drawn to
 * evoke an engine viewport; it does not run YK Engine. It draws on the shared
 * frame scheduler at ~30fps and only while on screen; reduced motion renders one
 * still frame.
 */
export function MiniEngine({ count = 9, className, ...rest }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const [hostRef, onScreen] = useOnScreen({ rootMargin: '80px 0px' });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const dpr = maxDpr();
    let W = 0;
    let H = 0;
    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(() => { size(); draw(0); });
    ro.observe(canvas);

    if (!simRef.current) {
      simRef.current = {
        t: 0,
        ents: Array.from({ length: count }, (_, i) => ({
          x: 0.12 + h(i * 3.1) * 0.76,
          y: 0.14 + h(i * 5.7 + 2) * 0.72,
          vx: (h(i * 8.3) - 0.5) * 0.00006,
          vy: (h(i * 6.1) - 0.5) * 0.00005,
          s: 16 + h(i * 2.3) * 22,
          disc: i % 3 === 1,
          hue: i % 4 === 0,
        })),
      };
    }
    const sim = simRef.current;
    const { ents } = sim;
    let last = 0;
    function draw(dt) {
      sim.t += dt;
      ctx.clearRect(0, 0, W, H);
      // grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.beginPath();
      for (let x = 0; x <= W; x += 28) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
      for (let y = 0; y <= H; y += 28) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
      ctx.stroke();

      ents.forEach((e) => {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.x < 0.06 || e.x > 0.94) e.vx *= -1;
        if (e.y < 0.08 || e.y > 0.92) e.vy *= -1;
        const px = e.x * W;
        const py = e.y * H;
        ctx.fillStyle = e.hue ? 'rgba(255,51,51,0.16)' : 'rgba(255,255,255,0.07)';
        ctx.strokeStyle = e.hue ? 'rgba(255,51,51,0.65)' : 'rgba(255,255,255,0.26)';
        if (e.disc) {
          ctx.beginPath();
          ctx.arc(px, py, e.s * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(px - e.s / 2, py - e.s / 2, e.s, e.s);
          ctx.strokeRect(px - e.s / 2 + 0.5, py - e.s / 2 + 0.5, e.s, e.s);
        }
      });

      // selection gizmo hops between entities every ~2.6s
      const sel = ents[Math.floor(sim.t / 2600) % ents.length];
      const sx = sel.x * W;
      const sy = sel.y * H;
      const r = sel.s * 0.5 + 7;
      ctx.strokeStyle = 'rgba(255,51,51,0.95)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - r, sy - r, r * 2, r * 2);
      [[-r, -r], [r, -r], [-r, r], [r, r]].forEach(([dx, dy]) => ctx.fillRect(sx + dx - 2, sy + dy - 2, 4, 4));
      ctx.fillStyle = 'rgba(255,51,51,0.95)';
      ctx.beginPath();
      ctx.moveTo(sx, sy); ctx.lineTo(sx + r + 18, sy);
      ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - r - 18);
      ctx.stroke();
    }

    if (reduced || !onScreen) {
      draw(0);
      return () => ro.disconnect();
    }
    const unsub = subscribe((now) => {
      if (last && now - last < 32) return;
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      draw(dt);
    });
    return () => {
      unsub();
      ro.disconnect();
    };
  }, [count, onScreen, reduced]);

  return (
    <div ref={hostRef} className={className} {...rest}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}

export default MiniEngine;
