import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* HEX TUNNEL — concentric hexagons surge outward from a vanishing point toward
   the viewer, each ring slightly counter-rotated and fading with depth; one
   pulsing red ring rides the loop. Built ring-by-ring (not a flat lattice). */
registerScene('hex-tunnel', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let rings = 14;
  let maxR = 1;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H * 0.5;
    maxR = Math.hypot(W, H) * 0.62;
    const scale = q === 'static' || q === 'low' ? 0.55 : q === 'medium' ? 0.8 : 1;
    rings = Math.round(clamp(18 * scale * density, 6, 28));
  };
  build(width, height);

  const hexPath = (r, rot) => {
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const a = rot + (i / 6) * TAU;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.92;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const ox = p.active ? p.nx * 22 : 0;
      const oy = p.active ? p.ny * 22 : 0;

      ctx.save();
      ctx.translate(ox, oy);
      ctx.lineJoin = 'round';

      // Concentric white rings: a continuous, SEAMLESS outward surge.
      // Each ring rides its OWN continuously looping depth phase, staggered by
      // i/rings so the tunnel always reads as a steady stream. The old code
      // derived depth from ((i + flow) % rings) where `flow = (t*0.32) % 1`
      // resetting yanked EVERY ring's depth back one slot at once — the whole
      // tunnel surged for ~3s then SNAPPED back (the "doesn't loop / jumps"
      // bug). Now each ring's phase wraps independently while its alpha fades to
      // ZERO at BOTH ends, so the wrap is invisible and it loops forever.
      const rate = 0.07; // depth cycles per second (matches the red ring)
      for (let i = 0; i < rings; i++) {
        // ph: 0 at vanishing point, 1 at viewer — continuous, wraps seamlessly
        const ph = (t * rate + i / rings) % 1;
        const d = Math.pow(ph, 1.7);          // perspective bunching near centre
        const r = lerp(6, maxR, d);
        // rotation depends only on t and the FIXED ring index, so it never jumps
        // when the phase wraps (the ring keeps its identity; only depth loops).
        const rot = t * 0.22 + i * 0.21;

        // fade in from the far point, fade fully out as it passes the viewer
        const near = clamp((ph - 0.82) / 0.18, 0, 1);
        const far = clamp(ph / 0.12, 0, 1);
        const depthAlpha = far * (1 - near);  // -> 0 at BOTH ends = no seam

        const jitter = 0.85 + hash(i * 1.7) * 0.3;
        ctx.lineWidth = lerp(0.6, 1.4, d);
        ctx.strokeStyle = white(clamp(depthAlpha * 0.16 * jitter, 0, 0.22));
        hexPath(r, rot);
        ctx.stroke();
      }

      // One red ring rides the loop. It travels on its OWN continuously
      // looping depth (not a discrete ring slot, which used to make it snap),
      // surging from the vanishing point out to the viewer and fading fully to
      // zero at BOTH ends — so the wrap is invisible and it reads as a single
      // seamless infinite loop. Tweak the 0.07 rate to speed it up / slow it.
      const ad = (t * 0.07) % 1;
      const da = Math.pow(ad, 1.7);
      const rad = lerp(6, maxR, da);
      const rota = t * (0.28 - da * 0.18);
      const nearA = clamp((da - 0.85) / 0.15, 0, 1);
      const farA = clamp(da / 0.12, 0, 1);
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = A(clamp(farA * (1 - nearA) * (0.32 + 0.38 * pulse), 0, 0.78));
      hexPath(rad, rota);
      ctx.stroke();

      // vanishing-point core
      const corePulse = 0.6 + 0.4 * Math.sin(t * 2.2);
      ctx.fillStyle = A(0.85 * corePulse);
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = white(0.1);
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, TAU);
      ctx.stroke();

      ctx.restore();
    },
    dispose() {},
  };
});
