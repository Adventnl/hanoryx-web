/* WORKFLOW RIVER — many near-parallel curved streamlines drifting left-to-right
   like a braided river, with directional flow particles riding the exact curves
   at varying per-lane speed; sparse red marks the leading current. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawRibbons, hash } from '../primitives';
import { clamp, lerp } from '../../easing';

registerScene('workflow-river', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let lanes = 18;
  let perLane = 6;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.5 : q === 'medium' ? 0.78 : 1;
    lanes = Math.max(8, Math.round(20 * scale * density));
    perLane = q === 'static' ? 0 : Math.max(2, Math.round(6 * scale));
  };
  build(width, height);

  // shared streamline field: y for a given lane at horizontal position x and time t
  const streamY = (lane, x, t, warp) => {
    const base = ((lane + 0.5) / lanes) * H;
    const sway = (lane % 3) - 1;
    const a1 = H * 0.06 * (0.6 + hash(lane * 1.7) * 0.8);
    const a2 = H * 0.025;
    return (
      base +
      Math.sin(x * 0.0032 + t * 0.5 + lane * 0.45) * a1 +
      Math.cos(x * 0.0085 - t * 0.8 + lane) * a2 +
      sway * Math.sin(t * 0.22 + lane) * 6 +
      warp
    );
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const px = p.active ? p.x : -1e4;
      const py = p.active ? p.y : -1e4;

      // faint braided underlay
      drawRibbons(ctx, { w: W, h: H, t: t * 0.6, count: Math.max(4, lanes >> 2), alpha: 0.04, accent: null });

      const step = Math.max(14, Math.round(W / 60));
      const accentLane = (Math.floor(t * 0.2) % lanes + lanes) % lanes;

      for (let lane = 0; lane < lanes; lane += 1) {
        const isAccent = lane === accentLane;
        ctx.lineWidth = isAccent ? 1.4 : 1;
        ctx.strokeStyle = isAccent ? A(0.16) : white(0.05 + (lane % 4 === 0 ? 0.04 : 0));
        ctx.beginPath();
        for (let x = -step; x <= W + step; x += step) {
          // pointer parts the current: lines bend away from cursor
          let warp = 0;
          if (p.active) {
            const dx = x - px;
            const dy0 = ((lane + 0.5) / lanes) * H - py;
            const d2 = dx * dx + dy0 * dy0;
            const f = clamp(9000 / (d2 + 4000), 0, 1);
            warp = Math.sign(dy0 || 1) * f * 34;
          }
          const y = streamY(lane, x, t, warp);
          if (x <= -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // directional flow particles riding the curves
      if (perLane > 0) {
        const speed = W * 0.09;
        for (let lane = 0; lane < lanes; lane += 1) {
          const laneSpeed = speed * (0.55 + hash(lane * 2.3) * 0.9);
          const isAccent = lane === accentLane;
          for (let k = 0; k < perLane; k += 1) {
            const seed = hash(lane * 7.1 + k * 1.9);
            const span = W + 80;
            let x = (seed * span + t * laneSpeed) % span;
            if (x < 0) x += span;
            x -= 40;
            let warp = 0;
            if (p.active) {
              const dx = x - px;
              const dy0 = ((lane + 0.5) / lanes) * H - py;
              const d2 = dx * dx + dy0 * dy0;
              const f = clamp(9000 / (d2 + 4000), 0, 1);
              warp = Math.sign(dy0 || 1) * f * 34;
            }
            const y = streamY(lane, x, t, warp);
            const ahead = streamY(lane, x + 6, t, warp);
            const dir = Math.atan2(ahead - y, 6);
            const fade = clamp(Math.min(x, W - x) / 60, 0, 1);
            const len = 7 + (laneSpeed / speed) * 6;

            // motion streak along the tangent
            ctx.lineWidth = isAccent ? 1.5 : 1;
            ctx.strokeStyle = isAccent ? A(0.5 * fade) : white(0.22 * fade);
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(dir) * len, y - Math.sin(dir) * len);
            ctx.lineTo(x, y);
            ctx.stroke();

            const head = isAccent ? A(0.85 * fade) : white(0.4 * fade);
            ctx.fillStyle = head;
            ctx.beginPath();
            ctx.arc(x, y, isAccent ? 1.8 : 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // subtle directional vignette toward downstream edge
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, `rgba(0,0,0,${lerp(0.12, 0.18, hash(Math.floor(t)))})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    },
    dispose() {},
  };
});
