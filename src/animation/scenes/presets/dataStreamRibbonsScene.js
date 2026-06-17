/* DATA STREAM RIBBONS — several bright thin straight diagonal ribbons of flowing
   dashes carrying data in transit; bright packet glints ride each stream over a
   faint baseline grid. Straight diagonal dash flow, not braided curves. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid, hash } from '../primitives';
import { TAU, clamp } from '../../easing';

registerScene('data-stream-ribbons', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let streams = 7;
  let dashesPer = 22;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    streams = Math.max(4, Math.round(8 * scale * density));
    dashesPer = q === 'static' ? 10 : Math.max(8, Math.round(24 * scale));
  };
  build(width, height);

  // shared diagonal direction (down-right), normalised
  const dirX = 0.86;
  const dirY = 0.5;
  // perpendicular for offsetting parallel streams
  const perpX = -dirY;
  const perpY = dirX;

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // faint baseline grid
      drawGrid(ctx, { w: W, h: H, t: t * 0.15, cell: Math.max(46, Math.min(W, H) / 10), alpha: 0.035, scroll: 0, accentEvery: 0, accent: null });

      // travel length covers the whole diagonal extent plus margin
      const span = Math.abs(W * dirX) + Math.abs(H * dirY) + 160;
      // anchor each stream along the perpendicular axis, centered on screen
      const cx = W * 0.5;
      const cy = H * 0.5;
      const lateral = Math.max(W, H) * 0.62;

      const accentStream = (Math.floor(t * 0.18) % streams + streams) % streams;

      for (let s = 0; s < streams; s += 1) {
        const isAccent = s === accentStream;
        // base offset of this stream along the perpendicular
        const u = (s + 0.5) / streams - 0.5;
        const off = u * lateral + Math.sin(t * 0.25 + s * 1.3) * 5;
        // origin point: pull the line back along -dir so it crosses the whole screen
        const ox = cx + perpX * off - dirX * span * 0.5;
        const oy = cy + perpY * off - dirY * span * 0.5;

        // a point at distance d along this stream
        const at = (d) => [ox + dirX * d, oy + dirY * d];

        // pointer attenuation: stream brightens when cursor is near its axis line
        let near = 0;
        if (p.active) {
          const rx = p.x - cx - perpX * off;
          const ry = p.y - cy - perpY * off;
          const perpDist = Math.abs(rx * perpX + ry * perpY);
          near = clamp(1 - perpDist / 90, 0, 1);
        }

        const baseAlpha = (isAccent ? 0.12 : 0.07) + near * 0.18;
        const speed = span * (0.07 + hash(s * 3.1) * 0.06);
        const phase = (t * speed + hash(s * 5.7) * span) % span;

        // flowing dashes along the stream
        ctx.lineWidth = isAccent ? 1.3 : 1;
        const dashGap = span / dashesPer;
        const dashLen = dashGap * 0.42;
        for (let k = 0; k < dashesPer; k += 1) {
          let d = (k * dashGap + phase) % span;
          if (d < 0) d += span;
          // taper dash brightness toward the head of the flow for direction cue
          const flow = ((d - phase + span) % span) / span; // 0 at head .. 1 at tail
          const fade = 0.35 + 0.65 * (1 - flow);
          const [x1, y1] = at(d);
          const [x2, y2] = at(d + dashLen);
          ctx.strokeStyle = isAccent ? A(baseAlpha * fade + 0.06) : white(baseAlpha * fade);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // faint continuous rail underneath to read as a ribbon
        const [ax, ay] = at(0);
        const [bx, by] = at(span);
        ctx.strokeStyle = isAccent ? A(0.05 + near * 0.06) : white(0.025 + near * 0.04);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // packet glints — a couple of bright leading points racing along the stream
        const glints = isAccent ? 2 : 1;
        for (let g = 0; g < glints; g += 1) {
          const gSeed = hash(s * 9.3 + g * 4.1);
          let gd = (t * speed * 1.35 + gSeed * span) % span;
          if (gd < 0) gd += span;
          const [gx, gy] = at(gd);
          const pulse = 0.6 + 0.4 * Math.sin(t * 5 + s + g * 2);

          // short bright streak behind the glint along the flow
          const [tx, ty] = at(gd - dashGap * 0.9);
          ctx.strokeStyle = isAccent ? A(0.55 * pulse + near * 0.2) : white(0.32 * pulse + near * 0.2);
          ctx.lineWidth = isAccent ? 1.6 : 1.1;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(gx, gy);
          ctx.stroke();

          // glint head
          ctx.fillStyle = isAccent ? A(0.9 * pulse) : white(0.55 * pulse + near * 0.25);
          ctx.beginPath();
          ctx.arc(gx, gy, isAccent ? 2.1 : 1.4, 0, TAU);
          ctx.fill();
        }
      }
    },
    dispose() {},
  };
});
