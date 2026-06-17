/* ============================================================
   MOTION BUDGET — decides how much motion the device/page can afford.
   Combines a one-time device-tier probe, the reduced-motion setting, a
   DPR cap, and the live FPS from the rAF scheduler. Scenes ask
   resolveQuality(cost) and scale their work to the answer.
   ============================================================ */

import { getFps } from './rafScheduler';

const ORDER = ['low', 'medium', 'high'];

function detect() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return { tier: 'high', mobile: false, dpr: 1, reduced: false };
  }
  const mobile =
    window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;

  let tier = 'high';
  if (mobile || cores <= 4 || mem <= 4) tier = 'medium';
  if (cores <= 2 || mem <= 2) tier = 'low';

  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  return { tier, mobile, dpr, reduced };
}

let state = detect();

export function getMotionState() {
  return state;
}

export function refreshMotionState() {
  state = detect();
  return state;
}

export function maxDpr() {
  return state.dpr;
}

/* Resolve the quality a scene should run at, given its declared cost.
   cost: 'low' | 'medium' | 'high' | 'hero'  ->  'static' | 'low' | 'medium' | 'high' */
export function resolveQuality(cost = 'medium') {
  if (state.reduced) return 'static';

  // Device ceiling.
  let ceilingIdx = ORDER.indexOf(state.tier);
  if (ceilingIdx < 0) ceilingIdx = 2;

  // Live downgrade if the frame rate is suffering.
  const fps = getFps();
  if (fps < 30) ceilingIdx = Math.min(ceilingIdx, 0);
  else if (fps < 45) ceilingIdx = Math.min(ceilingIdx, 1);

  const want = cost === 'hero' ? 'high' : cost;
  let wantIdx = ORDER.indexOf(want);
  if (wantIdx < 0) wantIdx = 1;

  return ORDER[Math.min(wantIdx, ceilingIdx)];
}

/* At most one full-quality "hero" scene at a time. */
let heroLocked = false;
export function claimHero() {
  if (heroLocked) return false;
  heroLocked = true;
  return true;
}
export function releaseHero() {
  heroLocked = false;
}

if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener?.('change', refreshMotionState);
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(refreshMotionState, 250);
  });
}
