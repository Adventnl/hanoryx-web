/* SCHEDULING GRID — an abstract week planner: vertical lanes split by horizontal
   time rows, booking blocks of varying length fade in and out across the lanes, and a
   vertical "now" line sweeps left->right lighting blocks it crosses; a sparse few latch red. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('scheduling-grid', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let lanes = 7;
  let rows = 9;
  let padX = 0, padY = 0, gridW = 0, gridH = 0, laneW = 0, rowH = 0;
  let blockCount = 0;

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.65 : quality === 'medium' ? 0.85 : 1;
    lanes = clamp(Math.round(7 * density), 5, 9);
    rows = clamp(Math.round((h / 70)), 6, 14);
    padX = W * 0.08;
    padY = H * 0.12;
    gridW = W - padX * 2;
    gridH = H - padY * 2;
    laneW = gridW / lanes;
    rowH = gridH / rows;
    // one set of deterministic blocks per lane; count scales with quality
    blockCount = clamp(Math.round(lanes * 3.2 * scale), 8, 60);
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // --- "now" sweep position (column-space 0..lanes), loops with a brief blank ---
      const cycle = (t * 0.07) % 1.18;
      const sweep = clamp(cycle, 0, 1);
      let nowX = padX + sweep * gridW;
      if (p.active) nowX = lerp(nowX, clamp(p.x, padX, padX + gridW), 0.5);
      const nowCol = (nowX - padX) / laneW;

      // --- base grid: lane columns + faint time rows ---
      for (let c = 0; c <= lanes; c += 1) {
        const x = padX + c * laneW;
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(c === 0 || c === lanes ? 0.12 : 0.06);
        ctx.beginPath();
        ctx.moveTo(x, padY);
        ctx.lineTo(x, padY + gridH);
        ctx.stroke();
        // lane header tick
        if (c < lanes) {
          ctx.strokeStyle = white(0.16);
          ctx.beginPath();
          ctx.moveTo(x + 4, padY - 8);
          ctx.lineTo(x + laneW * 0.42, padY - 8);
          ctx.stroke();
        }
      }
      for (let r = 0; r <= rows; r += 1) {
        const y = padY + r * rowH;
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(r === 0 || r === rows ? 0.1 : 0.04);
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + gridW, y);
        ctx.stroke();
      }

      // --- booking blocks: each pinned to a lane, spans some rows, breathes in/out ---
      const inset = Math.min(laneW * 0.16, 7);
      for (let i = 0; i < blockCount; i += 1) {
        const lane = Math.floor(hash(i * 1.7) * lanes);
        const startRow = Math.floor(hash2(i, 3) * (rows - 1));
        const span = 1 + Math.floor(hash2(i, 11) * Math.min(4, rows - startRow - 1) + 0.0);
        const x = padX + lane * laneW + inset;
        const bw = laneW - inset * 2;
        const y = padY + startRow * rowH + inset * 0.5;
        const bh = span * rowH - inset;

        // staggered fade-in / hold / fade-out life-cycle, phase-offset per block
        const phase = (t * 0.18 + hash(i * 4.3)) % 1;
        let life;
        if (phase < 0.18) life = phase / 0.18;             // appear
        else if (phase < 0.78) life = 1;                   // hold
        else if (phase < 0.92) life = 1 - (phase - 0.78) / 0.14; // fade
        else life = 0;                                     // gap
        if (life <= 0.001) continue;

        // proximity of the now-line to this block's lane center
        const blockCol = lane + 0.5;
        const cross = clamp(1 - Math.abs(nowCol - blockCol) / 0.85, 0, 1);

        const isAccent = hash(i * 8.9) > 0.84;

        // block body (subtle fill) + crisp outline
        const baseA = 0.04 + life * 0.05 + cross * 0.07;
        ctx.fillStyle = isAccent ? A(baseA + cross * 0.1) : white(baseA);
        ctx.fillRect(x, y, bw, bh * life);

        ctx.lineWidth = 1;
        ctx.strokeStyle = isAccent
          ? A(0.2 + life * 0.25 + cross * 0.4)
          : white(0.08 + life * 0.16 + cross * 0.25);
        ctx.strokeRect(x, y, bw, bh * life);

        // left status rail of the block — the booking "spine"
        if (life > 0.4) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = isAccent ? A(0.55 + cross * 0.4) : white(0.3 + cross * 0.3);
          ctx.beginPath();
          ctx.moveTo(x + 1, y + 2);
          ctx.lineTo(x + 1, y + bh * life - 2);
          ctx.stroke();
        }

        // tiny duration ticks inside longer blocks
        if (span >= 2 && life > 0.6) {
          for (let s = 1; s < span; s += 1) {
            const ty = y + s * rowH;
            if (ty > y + bh * life - 3) break;
            ctx.lineWidth = 1;
            ctx.strokeStyle = white(0.06 + cross * 0.1);
            ctx.beginPath();
            ctx.moveTo(x + 3, ty);
            ctx.lineTo(x + bw * 0.4, ty);
            ctx.stroke();
          }
        }
      }

      // --- the "now" sweep line: vertical scan with a red core + soft trailing band ---
      const trailW = laneW * 0.5;
      const grad = ctx.createLinearGradient(nowX - trailW, 0, nowX, 0);
      grad.addColorStop(0, A(0));
      grad.addColorStop(1, A(0.06));
      ctx.fillStyle = grad;
      ctx.fillRect(nowX - trailW, padY, trailW, gridH);

      ctx.lineWidth = 1.4;
      ctx.strokeStyle = A(0.55);
      ctx.beginPath();
      ctx.moveTo(nowX, padY - 6);
      ctx.lineTo(nowX, padY + gridH + 6);
      ctx.stroke();

      // pulsing head dot at the top of the now-line
      const pulse = 0.5 + Math.sin(t * 4) * 0.5;
      ctx.fillStyle = A(0.85);
      ctx.beginPath();
      ctx.arc(nowX, padY - 6, 3, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = A(0.25 + pulse * 0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nowX, padY - 6, 6 + pulse * 2, 0, TAU);
      ctx.stroke();
    },
    dispose() {},
  };
});
