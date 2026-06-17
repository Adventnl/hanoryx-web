/* ============================================================
   SCENE BUDGET — caps how many background canvases animate at once.

   Every SceneCanvas registers a lightweight controller and reports its current
   viewport visibility ratio. On any change the budget re-ranks all controllers
   and lets only the top-K (maxActiveScenes) actually run the rAF loop; the rest
   hold their last painted frame. This makes per-page cost independent of how
   many scenes a page declares — the core fix for site-wide lag.
   ============================================================ */
import { maxActiveScenes } from './motionBudget';

const controllers = new Set();
let raf = 0;

function schedule() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    rebalance();
  });
}

function rebalance() {
  const k = maxActiveScenes();
  const visible = Array.from(controllers)
    .filter((c) => c.ratio > 0.01)
    .sort((a, b) => b.ratio - a.ratio);
  const active = new Set(visible.slice(0, k));

  for (const c of controllers) {
    const should = active.has(c);
    if (should && !c.running) {
      c.running = true;
      c.run(true);
    } else if (!should && c.running) {
      c.running = false;
      c.run(false);
    }
  }
}

/**
 * Register a scene controller.
 * @param {{ratio:number, running:boolean, run:(on:boolean)=>void}} ctrl
 * @returns {() => void} unregister
 */
export function registerScene(ctrl) {
  ctrl.ratio = ctrl.ratio || 0;
  ctrl.running = false;
  controllers.add(ctrl);
  schedule();
  return () => {
    controllers.delete(ctrl);
    if (ctrl.running) {
      ctrl.running = false;
      ctrl.run(false);
    }
    schedule();
  };
}

/** Report a controller's new visibility ratio (0..1) and re-rank. */
export function reportVisibility(ctrl, ratio) {
  if (ctrl.ratio === ratio) return;
  ctrl.ratio = ratio;
  schedule();
}

export function activeSceneCount() {
  let n = 0;
  for (const c of controllers) if (c.running) n += 1;
  return n;
}
