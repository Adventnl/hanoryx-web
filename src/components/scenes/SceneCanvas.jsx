import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { subscribe } from '../../animation/rafScheduler';
import { getScene } from '../../animation/sceneRegistry';
import { ensureScenes } from '../../animation/scenes';
import { resolveQuality, maxDpr, getMotionState } from '../../animation/motionBudget';
import { getPointer } from '../../animation/pointer';
import { getAudio } from '../../animation/audioBridge';
import styles from './SceneCanvas.module.css';

/**
 * Renders a single registered scene onto a canvas.
 *  - the scene library is loaded on demand (code-split) via ensureScenes()
 *  - one scene per canvas, driven by the shared rAF scheduler
 *  - paused via IntersectionObserver whenever it leaves the viewport
 *  - DPR-capped and quality-scaled by the motion budget
 *  - draws a single static frame under reduced motion, never loops
 *  - fully torn down (scheduler, observers, scene.dispose) on unmount
 *
 * Props: scene (registered name), cost 'low'|'medium'|'high'|'hero',
 *        density (multiplier), accent (#hex), className.
 */
export function SceneCanvas({ scene: name, cost = 'medium', density = 1, accent = '#ff3333', className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const { reduced } = getMotionState();
    let scene = null;
    let factory = null;
    let unsub = null;
    let disposed = false;
    let io = null;
    let ro = null;
    let resizeRaf = 0;
    let width = 0;
    let height = 0;
    let quality = 'medium';

    const build = () => {
      if (!factory) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = maxDpr();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      quality = resolveQuality(cost);
      if (scene && scene.dispose) scene.dispose();
      scene = factory({ ctx, width, height, quality, reduced, accent, density, pointer: getPointer, audio: getAudio });
    };

    const drawStill = () => {
      if (scene) scene.draw({ time: 0, delta: 16.7, width, height, quality, pointer: getPointer(), audio: getAudio(), still: true });
    };
    const frame = (time, delta) => {
      if (!disposed && scene) scene.draw({ time, delta, width, height, quality, pointer: getPointer(), audio: getAudio() });
    };
    const start = () => {
      if (!unsub && !reduced && !disposed && scene) unsub = subscribe(frame);
    };
    const stop = () => {
      if (unsub) {
        unsub();
        unsub = null;
      }
    };

    ensureScenes().then(() => {
      if (disposed) return;
      factory = getScene(name);
      if (!factory) return;
      build();
      if (reduced) drawStill();

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { rootMargin: '220px' }
      );
      io.observe(canvas);

      ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          build();
          if (!unsub) drawStill();
        });
      });
      ro.observe(canvas);
    });

    return () => {
      disposed = true;
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      cancelAnimationFrame(resizeRaf);
      if (scene && scene.dispose) scene.dispose();
      scene = null;
    };
  }, [name, cost, density, accent]);

  return <canvas ref={canvasRef} className={clsx(styles.canvas, className)} aria-hidden="true" />;
}

export default SceneCanvas;
