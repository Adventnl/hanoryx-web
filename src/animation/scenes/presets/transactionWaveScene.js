/* TRANSACTION WAVE — a commerce throughput ticker: transaction spikes erupt
   upward from a baseline at varying heights, a slow cumulative line climbs across,
   faint value gridlines behind. Markets/throughput shape language, no full grid. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('transaction-wave', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;

  let slots = 48;
  let valueLines = 5;
  let baseY = height * 0.72;
  let spanH = height * 0.5;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.5 : q === 'medium' ? 0.78 : 1;
    slots = clamp(Math.round(56 * scale * density), 14, 90);
    valueLines = clamp(Math.round(5 * density), 3, 7);
    baseY = H * 0.74;
    spanH = H * 0.52;
  };
  build(width, height);

  // deterministic spike height for a given global transaction index
  const spikeHeight = (idx) => {
    const r = hash(idx * 1.0);
    const r2 = hash2(idx * 0.37, idx * 0.91);
    // most are small; rare large bursts
    const big = r2 > 0.9 ? 0.55 + 0.45 * r : r2 > 0.7 ? 0.28 + 0.3 * r : 0.06 + 0.22 * r;
    return clamp(big, 0.04, 1);
  };
  const isFlagged = (idx) => hash2(idx * 0.13 + 4, idx * 0.71 + 2) > 0.88;

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const left = W * 0.05;
      const right = W * 0.95;
      const trackLen = right - left;
      const step = trackLen / slots;

      // faint horizontal value gridlines + axis baseline
      ctx.lineWidth = 1;
      for (let i = 1; i <= valueLines; i++) {
        const y = baseY - (spanH * i) / valueLines;
        ctx.strokeStyle = white(0.04);
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
        // value tick on left margin
        ctx.strokeStyle = white(0.1);
        ctx.beginPath();
        ctx.moveTo(left - 4, y);
        ctx.lineTo(left, y);
        ctx.stroke();
      }
      // baseline rail
      ctx.strokeStyle = white(0.16);
      ctx.beginPath();
      ctx.moveTo(left, baseY);
      ctx.lineTo(right, baseY);
      ctx.stroke();

      // scroll: transactions march leftward; flow is a continuous index
      const flow = t * 6.0; // transactions per second feel
      const frac = flow % 1;
      const headIdx = Math.floor(flow);

      // running cumulative line: smooth slow climb sampled across the window,
      // tied to recent spike volume so it visibly steps up on big bursts
      ctx.strokeStyle = white(0.12);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const cumTop = baseY - spanH * 0.96;
      for (let s = 0; s <= slots; s++) {
        const idx = headIdx - slots + s;
        // accumulate a windowed sum of spike heights to make a rising envelope
        let acc = 0;
        for (let k = 0; k < 6; k++) {
          acc += spikeHeight(idx - k) * 0.16;
        }
        // global slow drift so the line keeps creeping upward over time
        const drift = (Math.sin(idx * 0.018) * 0.5 + 0.5) * 0.55 + 0.2;
        const v = clamp(acc * 0.5 + drift * 0.5, 0, 1);
        const x = left + (s - frac) * step;
        const y = lerp(baseY - spanH * 0.15, cumTop, v);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // transaction spikes erupting upward from the baseline
      for (let s = 0; s <= slots; s++) {
        const idx = headIdx - slots + s;
        if (idx < 0) continue;
        const x = left + (s - frac) * step;
        if (x < left - step || x > right + step) continue;

        const h = spikeHeight(idx);
        const flagged = isFlagged(idx);
        // newest spike (near right edge) gets a brief eruption pop
        const age = (slots - s) + frac; // slots near 0 = freshest
        const pop = age < 1.2 ? 1 - age / 1.2 : 0;
        const topY = baseY - spanH * h * (1 + 0.18 * pop);

        // fade spikes that approach the left edge (aging out)
        const edgeFade = clamp((s - 0.5) / 3, 0, 1) * clamp((slots - s + 0.5) / 2, 0, 1);
        const alpha = (0.18 + 0.4 * h) * edgeFade;

        if (flagged) {
          ctx.strokeStyle = A(clamp((0.35 + 0.4 * h) * edgeFade, 0, 0.85));
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = white(alpha);
          ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, topY);
        ctx.stroke();

        // spike cap — small square at the peak of taller transactions
        if (h > 0.32 || flagged) {
          const cap = flagged ? 3 : 2;
          if (flagged) {
            ctx.fillStyle = A(clamp((0.55 + 0.35 * pop) * edgeFade, 0, 1));
            ctx.fillRect(x - cap, topY - cap, cap * 2, cap * 2);
          } else {
            ctx.fillStyle = white(clamp((0.5 + 0.35 * pop) * edgeFade, 0, 0.85));
            ctx.fillRect(x - cap, topY - cap, cap * 2, cap * 2);
          }
        }

        // eruption ring on the very freshest flagged burst
        if (pop > 0.05 && flagged) {
          ctx.strokeStyle = A(0.4 * pop);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, topY, 4 + 10 * (1 - pop), 0, TAU);
          ctx.stroke();
        }
      }

      // right-edge "live" marker where new transactions enter
      const liveY = baseY;
      ctx.strokeStyle = A(0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(right, liveY - 6);
      ctx.lineTo(right, liveY + 6);
      ctx.stroke();
      ctx.fillStyle = A(0.6 + 0.4 * (Math.sin(t * 4) * 0.5 + 0.5));
      ctx.beginPath();
      ctx.arc(right, liveY, 2.4, 0, TAU);
      ctx.fill();

      // pointer inspection: vertical readout line snapped to nearest slot
      if (p.active) {
        const px = clamp(p.x, left, right);
        const sNear = Math.round((px - left) / step + frac);
        const snapX = left + (sNear - frac) * step;
        const idx = headIdx - slots + sNear;
        const h = idx >= 0 ? spikeHeight(idx) : 0;
        ctx.strokeStyle = white(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(snapX, baseY - spanH);
        ctx.lineTo(snapX, baseY + 6);
        ctx.stroke();
        // highlight that transaction's value point
        const y = baseY - spanH * h;
        ctx.fillStyle = A(0.7);
        ctx.beginPath();
        ctx.arc(snapX, y, 3, 0, TAU);
        ctx.fill();
      }
    },
    dispose() {},
  };
});
