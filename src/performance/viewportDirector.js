/* ============================================================
   VIEWPORT DIRECTOR — stable, correct viewport sizing.

   Browsers' `100vh` is wrong on mobile (URL bar) and `svh/dvh` aren't always
   enough for our full-screen stages. This writes a measured pixel height to
   CSS custom properties that stages read, and keeps scene/scroll layout in
   sync after resize/orientation so animations never run on stale dimensions
   (the cause of the "1.5 blocks on load" + glitch-on-resize bugs).

     --viewport-h : measured viewport height in px
     --vh         : 1% of that, for `calc()`

   Updates are debounced; after settling it dispatches `hanoryx:layout-settled`
   so ScrollTrigger / Lenis / scenes can refresh once, cleanly.
   ============================================================ */

let started = false;
let debounce = 0;

function measure() {
  const vv = window.visualViewport;
  const h = Math.round(vv?.height || window.innerHeight || 0);
  if (!h) return;
  const root = document.documentElement;
  root.style.setProperty('--viewport-h', `${h}px`);
  root.style.setProperty('--vh', `${h / 100}px`);
}

function settle() {
  measure();
  // two RAFs so layout/paint flush before dependents recalc
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('hanoryx:layout-settled'));
    });
  });
}

function onResize() {
  measure(); // immediate so stages don't jump
  clearTimeout(debounce);
  debounce = setTimeout(settle, 160);
}

export function initViewportDirector() {
  if (started || typeof window === 'undefined') return;
  started = true;
  measure();
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
  window.visualViewport?.addEventListener?.('resize', onResize, { passive: true });
  // Re-measure once fonts load (they shift heading line-box heights).
  if (document.fonts?.ready) document.fonts.ready.then(settle).catch(() => {});
}
