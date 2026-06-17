/* ============================================================
   RAF SCHEDULER — one requestAnimationFrame loop for the whole app.
   Scenes and loops subscribe with a callback (time, delta). A single
   loop means predictable scheduling, no uncontrolled rAF stacking,
   trivial global pause, and a shared FPS signal for the motion budget.
   ============================================================ */

const subscribers = new Set();
let rafId = 0;
let last = 0;
let running = false;

// Exponential moving average of FPS, read by the motion budget.
let fpsEMA = 60;

function tick(now) {
  const delta = last ? Math.min(now - last, 64) : 16.7; // clamp tab-switch gaps
  last = now;

  if (delta > 0) {
    const instant = 1000 / delta;
    fpsEMA += (instant - fpsEMA) * 0.05;
  }

  // Snapshot so a callback can unsubscribe mid-iteration safely.
  const list = Array.from(subscribers);
  for (let i = 0; i < list.length; i += 1) {
    try {
      list[i](now, delta);
    } catch {
      /* never let one bad scene kill the loop */
    }
  }

  if (subscribers.size > 0) {
    rafId = requestAnimationFrame(tick);
  } else {
    running = false;
    last = 0;
  }
}

export function subscribe(callback) {
  subscribers.add(callback);
  if (!running) {
    running = true;
    last = 0;
    rafId = requestAnimationFrame(tick);
  }
  return () => unsubscribe(callback);
}

export function unsubscribe(callback) {
  subscribers.delete(callback);
}

export function getFps() {
  return fpsEMA;
}

export function getSubscriberCount() {
  return subscribers.size;
}

// Pause everything when the tab is hidden (rAF already throttles, but this
// also resets the clock so we don't get a huge delta on return).
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      running = false;
      last = 0;
    } else if (subscribers.size > 0 && !running) {
      running = true;
      last = 0;
      rafId = requestAnimationFrame(tick);
    }
  });
}
