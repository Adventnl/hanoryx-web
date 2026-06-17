import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, lerp } from '../easing';

/* Particles drifting in a slow ambient field, magnetically drawn toward the
   pointer when active — pulled in, brightened, then easing back when released. */
registerScene('magnetic-particles', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let parts = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(14, Math.round(70 * (QUALITY_SCALE[q] ?? 1) * density));
    const accentEvery = 11; // a few red particles, sparse
    parts = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0,
      vy: 0,
      // ambient drift parameters — slow, continuous, per-particle phase
      phase: Math.random() * TAU,
      drift: 0.18 + Math.random() * 0.22,
      size: 0.8 + Math.random() * 1.4,
      bright: 0, // 0..1 attraction glow, eases up/down
      accent: i % accentEvery === 0,
    }));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, delta, pointer }) {
      const t = time * 0.001;
      const dt = clamp((delta || 16) / 16, 0.25, 3);

      // translucent fill for soft motion trails
      ctx.fillStyle = 'rgba(2,2,3,0.16)';
      ctx.fillRect(0, 0, W, H);

      const active = !!(pointer && pointer.active);
      const px = active ? pointer.x : 0;
      const py = active ? pointer.y : 0;
      const radius = Math.min(W, H) * 0.32;
      const radiusSq = radius * radius;

      for (let i = 0; i < parts.length; i += 1) {
        const p = parts[i];

        // gentle ambient acceleration via slowly rotating per-particle vector
        const a = p.phase + t * p.drift;
        let ax = Math.cos(a) * 0.012;
        let ay = Math.sin(a * 1.3) * 0.012;

        let pull = 0;
        if (active) {
          const dx = px - p.x;
          const dy = py - p.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < radiusSq) {
            const d = Math.sqrt(dSq) || 1;
            pull = 1 - d / radius; // 0..1, stronger near pointer
            const force = pull * 0.09;
            ax += (dx / d) * force;
            ay += (dy / d) * force;
          }
        }

        // ease the glow toward the current pull amount
        p.bright = lerp(p.bright, pull, 0.08 * dt);

        p.vx = (p.vx + ax * dt) * 0.94;
        p.vy = (p.vy + ay * dt) * 0.94;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // soft wrap so the field stays populated
        if (p.x < -8) p.x = W + 8;
        else if (p.x > W + 8) p.x = -8;
        if (p.y < -8) p.y = H + 8;
        else if (p.y > H + 8) p.y = -8;

        const alpha = 0.06 + p.bright * 0.22;
        const r = p.size * (1 + p.bright * 0.9);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, TAU);
        ctx.fillStyle = p.accent ? A(alpha + 0.04) : white(alpha);
        ctx.fill();
      }
    },
    dispose() {
      parts = null;
    },
  };
});
