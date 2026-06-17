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

      const flow = (t * 0.32) % 1;           // 0..1 z-progress that loops
      const accentSlot = Math.floor(t * 0.18) % rings;

      for (let i = 0; i < rings; i++) {
        // depth d: 0 at vanishing point, 1 at viewer; advanced by flow
        let d = ((i + flow) % rings) / rings;
        d = Math.pow(d, 1.7);                 // perspective bunching near centre
        const r = lerp(6, maxR, d);
        const rot = t * (0.28 - d * 0.18) + i * 0.21;

        // fade in from the far point, fade out as it sweeps past the viewer
        const near = clamp((d - 0.85) / 0.15, 0, 1);
        const far = clamp(d / 0.12, 0, 1);
        const depthAlpha = far * (1 - near * 0.9);

        const isAccent = i === accentSlot;
        if (isAccent) {
          const pulse = 0.45 + 0.55 * Math.sin(t * 3.4 + i);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = A(clamp(depthAlpha * (0.28 + 0.4 * pulse), 0, 0.7));
          hexPath(r, rot);
          ctx.stroke();
        } else {
          const jitter = 0.85 + hash(i * 1.7) * 0.3;
          ctx.lineWidth = lerp(0.6, 1.4, d);
          ctx.strokeStyle = white(clamp(depthAlpha * 0.16 * jitter, 0, 0.22));
          hexPath(r, rot);
          ctx.stroke();
        }
      }

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
