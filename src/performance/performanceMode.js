/* ============================================================
   PERFORMANCE MODE — the fast-scroll governor.

   A single global module tracks scroll velocity and broadcasts a coarse
   performance mode that the whole app reads to decide how hard to work:

     'normal'      — animate normally
     'fast-scroll' — the user is flinging the page; freeze scenes, snap reveals,
                     disable pointer-reactive effects, skip eager scene painting
     'reduced'     — prefers-reduced-motion; nothing heavy ever runs

   One scroll listener, one timer, ref-based — no React state in the hot path.
   Scenes / reveals / cursor subscribe and react. The core anti-lag for fast
   scrolling: we stop trying to animate every block the user flies past.
   ============================================================ */

const FAST_THRESHOLD = 1400; // px/sec — above this = fast-scroll
const SETTLE_MS = 180; // quiet time before returning to 'normal'

const subscribers = new Set();
let mode = 'normal';
let lastY = 0;
let lastT = 0;
let settleTimer = 0;
let started = false;

const reducedQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function notify() {
  for (const cb of subscribers) {
    try {
      cb(mode);
    } catch {
      /* never let one subscriber break the broadcast */
    }
  }
}

function setMode(next) {
  if (mode === next) return;
  mode = next;
  notify();
}

function onScroll() {
  if (reducedQuery?.matches) return; // reduced users never enter fast-scroll
  const y = window.scrollY || window.pageYOffset || 0;
  const t = performance.now();
  if (lastT) {
    const dt = t - lastT;
    if (dt > 0) {
      const v = (Math.abs(y - lastY) / dt) * 1000; // px/sec
      if (v > FAST_THRESHOLD) {
        setMode('fast-scroll');
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => setMode('normal'), SETTLE_MS);
      }
    }
  }
  lastY = y;
  lastT = t;
}

export function initPerformanceMode() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (reducedQuery?.matches) {
    mode = 'reduced';
  }
  reducedQuery?.addEventListener?.('change', (e) => {
    setMode(e.matches ? 'reduced' : 'normal');
  });
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function getPerformanceMode() {
  return mode;
}

export function isFastScroll() {
  return mode === 'fast-scroll';
}

/** Subscribe to mode changes. Returns an unsubscribe fn. */
export function subscribePerformanceMode(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}
