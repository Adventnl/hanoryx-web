import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp } from '../easing';

/* Technical blueprint surface: major + minor grid, measuring ticks, corner
   crosshair marks and dimension dashes, with a slow vertical drift and a
   single red crosshair node tracing the grid like a CAD cursor. */
registerScene('architectural-grid', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let minor = 36;
  let majorEvery = 5;
  let tickLen = 5;
  let node = { x: 0, y: 0 };

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] || 1;
    /* Larger cells when quality/density is low so we draw fewer lines. */
    const base = 34 / clamp(scale * density, 0.4, 1.4);
    minor = clamp(base, 26, 64);
    majorEvery = 5;
    tickLen = minor < 34 ? 4 : 6;
    node = { x: W * 0.5, y: H * 0.5 };
  };
  build(width, height);

  /* One short crosshair tick mark (no allocation). */
  const cross = (x, y, r, col) => {
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      /* Slow vertical drift of the whole grid; a hair of pointer parallax. */
      const px = pointer && pointer.active ? pointer.nx : 0;
      const py = pointer && pointer.active ? pointer.ny : 0;
      const driftY = ((t * 4) % minor) - minor;
      const offX = -((px * minor) % minor);
      const offY = driftY - (py * minor) % minor;

      const major = minor * majorEvery;
      const startX = Math.floor((-minor + offX) / minor) * minor;
      const startY = Math.floor((-minor + offY) / minor) * minor;

      /* Minor + major vertical lines. */
      ctx.lineWidth = 1;
      for (let x = startX; x <= W + minor; x += minor) {
        const isMajor = Math.round((x - offX) / minor) % majorEvery === 0;
        ctx.strokeStyle = white(isMajor ? 0.1 : 0.04);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      /* Minor + major horizontal lines. */
      for (let y = startY; y <= H + minor; y += minor) {
        const isMajor = Math.round((y - offY) / minor) % majorEvery === 0;
        ctx.strokeStyle = white(isMajor ? 0.1 : 0.04);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      /* Measuring ticks along the top and left margins, between minor lines. */
      ctx.strokeStyle = white(0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      const half = minor / 2;
      for (let x = startX; x <= W + minor; x += minor) {
        const mx = x + half;
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, tickLen);
      }
      for (let y = startY; y <= H + minor; y += minor) {
        const my = y + half;
        ctx.moveTo(0, my);
        ctx.lineTo(tickLen, my);
      }
      ctx.stroke();

      /* Small crosshair marks at every major intersection. */
      ctx.lineWidth = 1;
      const cMark = white(0.16);
      for (let x = startX; x <= W + minor; x += major) {
        const sx = Math.round((x - offX) / minor);
        if (sx % majorEvery !== 0) continue;
        for (let y = startY; y <= H + minor; y += major) {
          const sy = Math.round((y - offY) / minor);
          if (sy % majorEvery !== 0) continue;
          cross(x, y, tickLen + 1, cMark);
        }
      }

      /* Dimension dashes: a faint dashed measure line across one major band. */
      const bandY = startY + major + (Math.floor(t * 0.05) % 2) * major;
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = white(0.07);
      ctx.beginPath();
      ctx.moveTo(0, bandY + half);
      ctx.lineTo(W, bandY + half);
      ctx.stroke();
      ctx.setLineDash([]);
      /* End caps for the dimension line. */
      cross(major, bandY + half, 3, white(0.14));
      cross(W - major, bandY + half, 3, white(0.14));

      /* Single red crosshair node gliding to grid intersections (CAD cursor). */
      const tx = W * (0.5 + Math.cos(t * 0.16) * 0.32);
      const ty = H * (0.5 + Math.sin(t * 0.11) * 0.28);
      node.x += (tx - node.x) * 0.04;
      node.y += (ty - node.y) * 0.04;
      const snapX = Math.round((node.x - offX) / minor) * minor + offX;
      const snapY = Math.round((node.y - offY) / minor) * minor + offY;

      ctx.lineWidth = 1;
      const pulse = 0.18 + Math.sin(t * 1.6) * 0.06;
      /* Guide lines from node to the margins. */
      ctx.strokeStyle = A(0.08);
      ctx.beginPath();
      ctx.moveTo(snapX, 0);
      ctx.lineTo(snapX, H);
      ctx.moveTo(0, snapY);
      ctx.lineTo(W, snapY);
      ctx.stroke();
      /* The crosshair + ring. */
      cross(snapX, snapY, 9, A(0.5));
      ctx.strokeStyle = A(pulse + 0.2);
      ctx.beginPath();
      ctx.arc(snapX, snapY, 5, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = A(0.7);
      ctx.beginPath();
      ctx.arc(snapX, snapY, 1.4, 0, TAU);
      ctx.fill();
    },
    dispose() {
      node = null;
    },
  };
});
