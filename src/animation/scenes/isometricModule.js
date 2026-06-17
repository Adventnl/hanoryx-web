import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, lerp } from '../easing';

/* Isometric cubes drifting through depth — faint white volumes that bob and
   parallax. One cube is edge-lit in the accent red. 2:1 iso projection. */
registerScene('isometric-module', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cubes = [];

  /* 2:1 isometric basis: x-axis -> (2,1), y-axis -> (-2,1), z (up) -> (0,-2). */
  const project = (cx, cy, gx, gy, gz, s) => ({
    x: cx + (gx - gy) * s * 2,
    y: cy + (gx + gy) * s - gz * s * 2,
  });

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] || 1;
    const count = Math.max(3, Math.round(8 * scale * clamp(density, 0.5, 1.6)));
    cubes = [];
    for (let i = 0; i < count; i += 1) {
      const depth = (i + 0.5) / count; // 0 far .. 1 near
      cubes.push({
        bx: (0.12 + 0.76 * ((i * 0.6180339) % 1)) * W,
        by: (0.14 + 0.72 * ((i * 0.3541) % 1)) * H,
        depth,
        size: lerp(13, 30, depth) * lerp(0.85, 1.15, (i % 5) / 4),
        bob: 8 + depth * 22,
        bobSpeed: 0.18 + ((i * 0.137) % 1) * 0.22,
        bobPhase: (i / count) * TAU,
        driftPhase: (i * 0.41) % TAU,
        driftSpeed: 0.05 + ((i * 0.071) % 1) * 0.07,
        accentCube: i === Math.floor(count * 0.5),
      });
    }
  };
  build(width, height);

  // Reusable face vertex buffers (top, left, right) — no per-frame alloc.
  const top = [
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ];
  const left = [
    [0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0],
  ];
  const right = [
    [1, 0, 1], [1, 1, 1], [1, 1, 0], [1, 0, 0],
  ];

  const drawFace = (cx, cy, verts, s, fill, edge, lw) => {
    ctx.beginPath();
    for (let i = 0; i < verts.length; i += 1) {
      const p = project(cx, cy, verts[i][0], verts[i][1], verts[i][2], s);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = edge;
    ctx.stroke();
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      const px = pointer && pointer.active ? pointer.nx : 0;
      const py = pointer && pointer.active ? pointer.ny : 0;

      for (let i = 0; i < cubes.length; i += 1) {
        const c = cubes[i];
        // Depth-scaled parallax + slow lateral drift + vertical bob.
        const par = c.depth * 26;
        const drift = Math.sin(t * c.driftSpeed + c.driftPhase) * (10 + c.depth * 26);
        const bob = Math.sin(t * c.bobSpeed + c.bobPhase) * c.bob;
        const cx = c.bx + drift - px * par;
        const cy = c.by + bob - py * par;
        const s = c.size;

        const fade = lerp(0.5, 1, c.depth); // nearer cubes a touch stronger
        const baseFill = 0.018 * fade;
        const baseEdge = 0.1 * fade;
        const lw = lerp(0.8, 1.3, c.depth);

        if (c.accentCube) {
          // Faint white volume, red edges (edge-lit accent).
          const pulse = 0.55 + 0.45 * Math.sin(t * 0.7 + c.bobPhase);
          drawFace(cx, cy, top, s, white(baseFill * 1.4), A(0.12 + 0.16 * pulse), lw);
          drawFace(cx, cy, left, s, white(baseFill), A(0.07 + 0.1 * pulse), lw);
          drawFace(cx, cy, right, s, white(baseFill * 0.7), A(0.1 + 0.13 * pulse), lw);
        } else {
          // Three faces with subtle tonal stepping for volume.
          drawFace(cx, cy, top, s, white(baseFill * 1.8), white(baseEdge), lw);
          drawFace(cx, cy, left, s, white(baseFill * 0.9), white(baseEdge * 0.7), lw);
          drawFace(cx, cy, right, s, white(baseFill * 1.3), white(baseEdge * 0.85), lw);
        }
      }
    },
    dispose() {
      cubes = null;
    },
  };
});
