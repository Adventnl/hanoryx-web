import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawRadialBars } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* RADIAL AUDIO CORE — a centred radial spectrum. drawRadialBars fans out from a
   white core ring, driven by live audio.bands (idle procedural when silent).
   Loud beats spawn outward-expanding pulse rings; a faint reflected inner ring
   and a sweeping read mark give it the feel of a live signal core. */
registerScene('radial-audio-core', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  const d = density || 1;
  const count =
    quality === 'static' || quality === 'low' ? 48
      : quality === 'medium' ? 72
        : 96;
  const barCount = Math.max(36, Math.round(count * d));

  const idle = new Float32Array(32);
  const rings = []; // expanding pulse rings {r, alpha, accent}
  let lvl = 0;
  let prevLvl = 0;
  let beatHold = 0;

  let cx = W / 2;
  let cy = H / 2;
  let inner = 70;

  const build = (w, h) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H / 2;
    inner = clamp(Math.min(W, H) * 0.14, 50, 130);
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer, audio }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const au = audio || {};

      // gentle parallax of the core toward the pointer
      const ox = cx + (p.nx || 0) * 18;
      const oy = cy + (p.ny || 0) * 18;

      const live = au.active;
      let bands;
      if (live) {
        bands = au.bands;
        lvl = lerp(lvl, au.level || 0, 0.25);
      } else {
        for (let i = 0; i < idle.length; i += 1) {
          const k = i / idle.length;
          idle[i] = 0.12 + (Math.sin(t * 1.6 + i * 0.55) * 0.5 + 0.5) * 0.3 * (1 - k * 0.35);
        }
        bands = idle;
        lvl = lerp(lvl, 0.2 + Math.sin(t * 0.9) * 0.06, 0.06);
      }

      // beat detection: a sharp rise in level spawns a pulse ring
      const rise = lvl - prevLvl;
      if (rise > 0.06 && beatHold <= 0 && lvl > 0.22) {
        if (rings.length < 8) rings.push({ r: inner, a: 0.5, hot: lvl });
        beatHold = 0.18;
      }
      beatHold -= 0.016;
      prevLvl = lvl;

      // faint encompassing guide rings
      ctx.lineWidth = 1;
      for (let g = 0; g < 3; g += 1) {
        const rr = inner + 70 + g * 46;
        ctx.strokeStyle = white(0.04 - g * 0.008);
        ctx.beginPath();
        ctx.arc(ox, oy, rr, 0, TAU);
        ctx.stroke();
      }

      // expanding beat pulse rings
      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i];
        ring.r += 2.6 + ring.hot * 5;
        ring.a *= 0.955;
        const maxR = Math.max(W, H) * 0.62;
        if (ring.a < 0.02 || ring.r > maxR) {
          rings.splice(i, 1);
          continue;
        }
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = A(ring.a * 0.7);
        ctx.beginPath();
        ctx.arc(ox, oy, ring.r, 0, TAU);
        ctx.stroke();
      }

      // mirrored faint inner spectrum (shorter, drawn inward) for depth
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.translate(ox, oy);
      ctx.rotate(t * 0.05);
      ctx.translate(-ox, -oy);
      drawRadialBars(ctx, {
        cx: ox,
        cy: oy,
        t: -t,
        count: Math.round(barCount * 0.6),
        inner: inner * 0.62,
        alpha: 0.4,
        accent: A,
        bands,
        level: lvl * 0.4,
      });
      ctx.restore();

      // primary radial spectrum, slowly rotating
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(-t * 0.08);
      ctx.translate(-ox, -oy);
      drawRadialBars(ctx, {
        cx: ox,
        cy: oy,
        t,
        count: barCount,
        inner,
        alpha: 0.55,
        accent: A,
        bands,
        level: lvl,
      });
      ctx.restore();

      // white core ring + breathing red centre that swells with level
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = white(0.16 + lvl * 0.18);
      ctx.beginPath();
      ctx.arc(ox, oy, inner, 0, TAU);
      ctx.stroke();

      const coreR = 4 + lvl * 16 + Math.sin(t * 3) * 1.2;
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR + 10);
      grad.addColorStop(0, A(0.6 + lvl * 0.4));
      grad.addColorStop(1, A(0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, coreR + 10, 0, TAU);
      ctx.fill();
      ctx.fillStyle = A(0.85);
      ctx.beginPath();
      ctx.arc(ox, oy, coreR, 0, TAU);
      ctx.fill();

      // rotating read mark riding the outer guide ring
      const ma = t * 0.6;
      const mr = inner + 70;
      ctx.fillStyle = white(0.12 + lvl * 0.5);
      ctx.beginPath();
      ctx.arc(ox + Math.cos(ma) * mr, oy + Math.sin(ma) * mr, 2 + lvl * 4, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
