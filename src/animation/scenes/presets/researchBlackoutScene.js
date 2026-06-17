/* RESEARCH BLACKOUT — rows of redacted/blacked-out bars over a dark field; a slow
   horizontal scan band sweeps across, momentarily exposing bars it passes, while rare
   cells flicker a partial red reveal. Mostly dark and ominous. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawRedaction, drawScan, hash, hash2 } from '../primitives';
import { clamp } from '../../easing';

registerScene('research-blackout', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let rows = 12;

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.6 : quality === 'medium' ? 0.85 : 1;
    rows = Math.max(7, Math.round(14 * scale * density));
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // base dark redaction field — very faint, the underlying "document"
      drawRedaction(ctx, { w: W, h: H, t: t * 0.6, rows, alpha: 0.5, accent: A });

      // slow horizontal scan position (mirror drawScan axis 'x' math)
      const speed = 0.07;
      let scanX = ((t * speed) % 1) * W;
      if (p.active) scanX = scanX * 0.7 + p.x * 0.3; // pointer nudges the sweep

      // structured blackout grid: solid bars that go nearly black, exposed by the scan
      const rh = H / rows;
      const band = 110; // px reach of the scan's exposing influence
      for (let r = 0; r < rows; r += 1) {
        const y = r * rh + rh * 0.34;
        const bh = rh * 0.4;
        let x = W * 0.05;
        const segs = 3 + Math.floor(hash(r * 1.7 + 4) * 5);
        for (let s = 0; s < segs; s += 1) {
          const bw = (0.06 + hash2(r * 5 + 1, s * 3 + 2) * 0.18) * W;
          const cx = x + bw * 0.5;

          // base blacked-out bar — deep, just barely visible edge
          ctx.fillStyle = white(0.05 + hash2(r, s) * 0.04);
          ctx.fillRect(x, y, bw, bh);

          // scan exposure: bars near the sweep line brighten as if redaction lifts
          const prox = clamp(1 - Math.abs(cx - scanX) / band, 0, 1);
          if (prox > 0.02) {
            const ease = prox * prox;
            ctx.fillStyle = white(0.04 + ease * 0.22);
            ctx.fillRect(x, y, bw, bh);
            // a thin lit underline at the strongest part of the sweep
            if (ease > 0.45) {
              ctx.fillStyle = white(0.16 * ease);
              ctx.fillRect(x, y + bh, bw, 1);
            }
          }

          // rare flicker reveal — a partial red leak from a hidden cell
          const flick = Math.sin(t * 1.6 + r * 2.3 + s * 5.1) * 0.5 + 0.5;
          const gate = hash2(r * 9 + 3, s * 7 + 5);
          if (flick > 0.985 && gate > 0.55) {
            const rw = bw * (0.3 + hash2(s, r) * 0.45);
            ctx.fillStyle = A(0.16 + (flick - 0.985) * 12);
            ctx.fillRect(x, y, rw, bh);
          }

          x += bw + W * 0.022;
          if (x > W * 0.94) break;
        }
      }

      // the scan band itself — a soft, dark-tinted moving exposure (sparse red)
      drawScan(ctx, { w: W, h: H, t, axis: 'x', alpha: 0.035, accent: A, speed });

      // faint vertical edge line marking the scan's leading front
      ctx.strokeStyle = A(0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, H);
      ctx.stroke();
    },
    dispose() {},
  };
});
