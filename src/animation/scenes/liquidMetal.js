import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp } from '../easing';

/* Soft elliptical blobs drifting and breathing — a calm metallic sheen.
   Large radial-gradient ellipses overlap with very low alpha; no hard edges. */
registerScene('liquid-metal', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let blobs = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    const count = clamp(Math.round(5 * scale * density), 3, 6);
    const span = Math.min(W, H);
    blobs = Array.from({ length: count }, (_, i) => {
      const phase = (i / count) * TAU;
      return {
        // resolution-independent home in 0..1 space, spread around the frame
        hx: 0.18 + 0.64 * ((i * 0.37 + 0.11) % 1),
        hy: 0.22 + 0.56 * ((i * 0.61 + 0.29) % 1),
        radius: span * (0.34 + 0.16 * ((i * 0.53) % 1)),
        // slow drift + breathing speeds, all gentle
        driftSpeed: 0.018 + i * 0.006,
        driftAmp: 0.05 + 0.04 * ((i * 0.41) % 1),
        breatheSpeed: 0.013 + i * 0.004,
        squashSpeed: 0.011 + i * 0.005,
        phase,
        // one faint red accent blob, the rest neutral white
        accent: i === count - 2,
        baseAlpha: i === count - 2 ? 0.07 : 0.05 + 0.03 * ((i * 0.29) % 1),
      };
    });
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      // translucent veil for a soft metallic smear; trail-friendly
      ctx.fillStyle = 'rgba(2,2,3,0.16)';
      ctx.fillRect(0, 0, W, H);

      const pr = pointer || {};
      const px = pr.active ? pr.nx : 0;
      const py = pr.active ? pr.ny : 0;

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < blobs.length; i += 1) {
        const b = blobs[i];
        // slow elliptical drift around the home anchor (+ faint parallax)
        const dx = Math.cos(t * b.driftSpeed + b.phase) * b.driftAmp;
        const dy = Math.sin(t * b.driftSpeed * 0.8 + b.phase) * b.driftAmp;
        const cx = (b.hx + dx) * W + px * 18 * (i % 2 ? 1 : -1);
        const cy = (b.hy + dy) * H + py * 18 * (i % 2 ? 1 : -1);

        // breathing scale + gentle squash so ellipses feel liquid
        const breathe = 1 + 0.12 * Math.sin(t * b.breatheSpeed + b.phase);
        const squash = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(t * b.squashSpeed + b.phase * 1.7));
        const rx = b.radius * breathe;
        const ry = b.radius * breathe * squash;
        const alpha = b.baseAlpha * (0.85 + 0.15 * Math.sin(t * b.breatheSpeed * 1.3 + b.phase));

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        const col = b.accent ? A : white;
        grad.addColorStop(0, col(alpha));
        grad.addColorStop(0.55, col(alpha * 0.4));
        grad.addColorStop(1, col(0));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        ctx.translate(-cx, -cy);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(rx, ry), 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = 'source-over';
    },
    dispose() {
      blobs = null;
    },
  };
});
