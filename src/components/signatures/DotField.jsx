import { useEffect, useRef } from 'react';
import { subscribe } from '../../animation/rafScheduler';
import { maxDpr } from '../../animation/motionBudget';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import styles from './DotField.module.css';
import { fx } from '../../utils/fx';

const COLS = 34;
const ROWS = 22;

/**
 * Hero object for the internal-CRM page: a dense field of ~750 dots — the
 * feeling of a very large set, not a claim about one. A soft lens follows the
 * pointer and pulls the dots near it into focus (bigger, brighter, red at the
 * core); at rest a slow wave rolls through. Canvas, shared scheduler, only while
 * on screen; one still frame under reduced motion.
 */
export default function DotField({ caption }) {
  const canvasRef = useRef(null);
  const [hostRef, onScreen] = useOnScreen({ rootMargin: '120px 0px' });
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const pointer = useRef({ x: -999, y: -999, on: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = maxDpr();
    let W = 0;
    let H = 0;
    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const cw = W / COLS;
      const ch = H / ROWS;
      const p = pointer.current;
      let lens = p.on ? 1 : 0;
      for (let r = 0; r < ROWS; r += 1) {
        for (let c = 0; c < COLS; c += 1) {
          const x = (c + 0.5) * cw;
          const y = (r + 0.5) * ch;
          const wave = Math.sin(c * 0.45 + r * 0.3 + t * 0.0012) * 0.5 + 0.5;
          let k = 0;
          if (lens) {
            const d = Math.hypot(x - p.x, y - p.y);
            k = Math.max(0, 1 - d / 120);
            k *= k;
          }
          const rad = 1.1 + wave * 0.9 + k * 3.6;
          ctx.fillStyle = k > 0.35 ? `rgba(255,51,51,${0.35 + k * 0.6})` : `rgba(255,255,255,${0.1 + wave * 0.16 + k * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const ro = new ResizeObserver(() => { size(); draw(0); });
    ro.observe(canvas);
    if (reduced || !onScreen) {
      draw(0);
      return () => ro.disconnect();
    }
    let last = 0;
    const unsub = subscribe((now) => {
      if (last && now - last < 33) return;
      last = now;
      draw(now);
    });
    return () => { unsub(); ro.disconnect(); };
  }, [onScreen, reduced]);

  const onMove = (e) => {
    if (!fine) return;
    const rect = canvasRef.current.getBoundingClientRect();
    pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, on: true };
  };
  const onLeave = () => { pointer.current.on = false; };

  return (
    <div ref={hostRef} className={styles.wrap} onPointerMove={onMove} onPointerLeave={onLeave}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" {...fx('dots.pointer-lens')} />
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}
