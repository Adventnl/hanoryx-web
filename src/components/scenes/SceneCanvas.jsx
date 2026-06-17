import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { subscribe } from '../../animation/rafScheduler';
import { getScene } from '../../animation/sceneRegistry';
import { ensureScenes } from '../../animation/scenes';
import { resolveQuality, maxDpr, getMotionState, sceneFrameInterval } from '../../animation/motionBudget';
import { registerScene as registerBudget, reportVisibility } from '../../animation/sceneBudget';
import { getPointer } from '../../animation/pointer';
import { getAudio } from '../../animation/audioBridge';
import styles from './SceneCanvas.module.css';

/**
 * Renders a single registered scene onto a canvas.
 *  - the scene library is loaded on demand (code-split) via ensureScenes()
 *  - each scene registers with the SCENE BUDGET: only the few most-visible
 *    scenes animate at once; the rest hold a static frame (the core anti-lag)
 *  - the rAF draw is throttled to ~30fps (backgrounds don't need 60/120Hz)
 *  - DPR-capped + quality-scaled by the motion budget
 *  - a single static frame under reduced motion, never loops
 *  - fully torn down (loop, budget, observers, scene.dispose) on unmount
 */
export function SceneCanvas({ scene: name, cost = 'medium', density = 1, accent = '#ff3333', className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const { reduced } = getMotionState();
    const interval = sceneFrameInterval();
    let scene = null;
    let factory = null;
    let built = false;
    let unsub = null;
    let unregister = null;
    let disposed = false;
    let io = null;
    let ro = null;
    let resizeRaf = 0;
    let lastDraw = 0;
    let hasFrame = false;
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
      built = true;
    };
    const ensureBuilt = () => {
      if (!built) build();
    };
    const drawStill = () => {
      if (!scene) return;
      scene.draw({ time: 0, delta: 16.7, width, height, quality, pointer: getPointer(), audio: getAudio(), still: true });
      hasFrame = true;
    };
    const frame = (time, delta) => {
      if (disposed || !scene) return;
      // throttle background scenes to ~30fps regardless of display refresh
      if (time - lastDraw < interval - 2) return;
      lastDraw = time;
      scene.draw({ time, delta, width, height, quality, pointer: getPointer(), audio: getAudio() });
      hasFrame = true;
    };
    const startLoop = () => {
      if (!unsub && !reduced && !disposed && scene) unsub = subscribe(frame);
    };
    const stopLoop = () => {
      if (unsub) {
        unsub();
        unsub = null;
      }
    };

    // The budget calls this to grant/revoke animation. Revoked scenes keep
    // their last painted frame (frozen) rather than going blank.
    const controller = {
      ratio: 0,
      running: false,
      run(on) {
        if (on) {
          ensureBuilt();
          startLoop();
        } else {
          stopLoop();
          ensureBuilt();
        }
      },
    };

    ensureScenes().then(() => {
      if (disposed) return;
      factory = getScene(name);
      if (!factory) return;

      io = new IntersectionObserver(
        (entries) => {
          const e = entries[entries.length - 1];
          const ratio = e.isIntersecting ? e.intersectionRatio : 0;
          if (ratio > 0 && !hasFrame) {
            // first time on screen -> build + paint ONE static frame (cheap, once)
            ensureBuilt();
            if (!controller.running) drawStill();
          }
          reportVisibility(controller, ratio);
        },
        { threshold: [0, 0.4, 0.9], rootMargin: '40px 0px' }
      );
      io.observe(canvas);

      ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          if (!built) return;
          build();
          if (!unsub) drawStill();
        });
      });
      ro.observe(canvas);

      if (reduced) {
        ensureBuilt();
        drawStill();
      } else {
        unregister = registerBudget(controller);
      }
    });

    return () => {
      disposed = true;
      stopLoop();
      if (unregister) unregister();
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
