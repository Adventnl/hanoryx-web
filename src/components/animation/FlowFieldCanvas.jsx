import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useMousePosition } from '../../hooks/useMousePosition';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { FLOW_FIELD, BREAKPOINTS } from '../../utils/constants';
import styles from './FlowFieldCanvas.module.css';

/**
 * Procedural, cursor-reactive particle flow field — the living background.
 * Particles drift along a slow sine flow, connect to nearby neighbours, and
 * ease away from the pointer. A few red nodes sit at the threshold of
 * attention. Capped/static under reduced motion; thinned on mobile.
 * Fully cleaned up on unmount.
 */
export function FlowFieldCanvas({ className }) {
  const canvasRef = useRef(null);
  const pointer = useMousePosition();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const isMobile = window.innerWidth < BREAKPOINTS.mobile;
    const count = isMobile ? FLOW_FIELD.mobileCount : FLOW_FIELD.desktopCount;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let t = 0;

    const make = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * FLOW_FIELD.baseSpeed,
      vy: (Math.random() - 0.5) * FLOW_FIELD.baseSpeed,
      r: Math.random() * 1.1 + 0.4,
      red: Math.random() < 0.06,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, make);
    };

    const drawConnections = () => {
      const maxD = FLOW_FIELD.connectionDistance;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxD) {
            const op = (1 - dist / maxD) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${op})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawParticles = () => {
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red ? 'rgba(255,51,51,0.85)' : 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
    };

    const step = () => {
      t += 0.0025;
      ctx.fillStyle = 'rgba(5,5,5,0.34)';
      ctx.fillRect(0, 0, width, height);

      const { x: mx, y: my, active } = pointer.current;

      for (const p of particles) {
        // slow ambient flow
        p.x += p.vx + Math.cos((p.y * 0.004) + t) * 0.06;
        p.y += p.vy + Math.sin((p.x * 0.004) + t) * 0.06;

        // pointer ease-away
        if (active) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.hypot(dx, dy);
          if (d < FLOW_FIELD.pointerRadius && d > 0.001) {
            const force = (FLOW_FIELD.pointerRadius - d) / FLOW_FIELD.pointerRadius;
            p.x -= (dx / d) * force * 1.1;
            p.y -= (dy / d) * force * 1.1;
          }
        }

        // wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      drawConnections();
      drawParticles();
      raf = requestAnimationFrame(step);
    };

    const drawStatic = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      drawConnections();
      drawParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) drawStatic();
    else raf = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [pointer, reduced]);

  return <canvas ref={canvasRef} className={clsx(styles.canvas, className)} aria-hidden="true" />;
}

export default FlowFieldCanvas;
