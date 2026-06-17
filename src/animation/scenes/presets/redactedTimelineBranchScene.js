/* REDACTED TIMELINE BRANCH — a horizontal timeline spine with ticking time markers;
   past branches fork off as solid drawn-in lines with nodes, while future branches
   are blacked-out redaction bars that flicker, hiding what has not happened yet. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('redacted-timeline-branch', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let nodes = 8;
  let spineY = height * 0.5;

  const build = (w, h) => {
    W = w;
    H = h;
    spineY = h * 0.5;
    const scale = quality === 'low' || quality === 'static' ? 0.6 : quality === 'medium' ? 0.85 : 1;
    nodes = Math.max(5, Math.round(9 * scale * density));
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const padX = W * 0.07;
      const usableW = W - padX * 2;
      const gap = usableW / (nodes - 1);

      // playhead sweeps left->right then loops; everything left of it is "past" (solid),
      // everything right is "future" (redacted). Pointer can scrub the playhead.
      let head = (t * 0.05) % 1.25;
      head = clamp(head, 0, 1);
      if (p.active) head = lerp(head, clamp((p.x - padX) / usableW, 0, 1), 0.5);
      const headX = padX + usableW * head;

      // --- main spine ---
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = white(0.16);
      ctx.beginPath();
      ctx.moveTo(padX, spineY);
      ctx.lineTo(padX + usableW, spineY);
      ctx.stroke();

      // lit leading segment of the spine (the part already traversed) in faint red
      ctx.strokeStyle = A(0.22);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(padX, spineY);
      ctx.lineTo(headX, spineY);
      ctx.stroke();

      // --- minor time tick marks along the spine ---
      const ticks = nodes * 4;
      const tickGap = usableW / ticks;
      for (let i = 0; i <= ticks; i += 1) {
        const x = padX + i * tickGap;
        const major = i % 4 === 0;
        const th = major ? 7 : 3;
        ctx.strokeStyle = x < headX ? white(0.2) : white(0.07);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, spineY - th);
        ctx.lineTo(x, spineY + th);
        ctx.stroke();
      }

      // --- branch forks at each node ---
      for (let i = 0; i < nodes; i += 1) {
        const nx = padX + i * gap;
        const dir = i % 2 === 0 ? -1 : 1; // alternate up/down
        const reach = (28 + hash(i * 3.1) * 64);
        const run = (gap * 0.42) * (0.6 + hash(i * 5.7) * 0.7);
        const ny = spineY + dir * reach;
        const bx = nx + run;
        const isPast = nx <= headX;

        if (isPast) {
          // drawn-in solid branch: diagonal fork + horizontal tail + end node
          const prog = clamp((headX - nx) / (gap * 0.9), 0, 1);
          const ease = prog * prog * (3 - 2 * prog);
          const jx = lerp(nx, bx, Math.min(ease * 1.6, 1));
          const jy = lerp(spineY, ny, Math.min(ease * 1.6, 1));

          ctx.lineWidth = 1.2;
          ctx.strokeStyle = white(0.22);
          ctx.beginPath();
          ctx.moveTo(nx, spineY);
          ctx.lineTo(jx, jy);
          ctx.stroke();

          // horizontal tail once the elbow is reached
          if (ease > 0.62) {
            const tail = (ease - 0.62) / 0.38;
            ctx.beginPath();
            ctx.moveTo(bx, ny);
            ctx.lineTo(bx + run * 0.8 * tail, ny);
            ctx.stroke();

            // end-of-branch node, occasionally accented red
            const ex = bx + run * 0.8 * tail;
            const acc = hash(i * 9.3) > 0.7;
            ctx.fillStyle = acc ? A(0.85) : white(0.6);
            ctx.beginPath();
            ctx.arc(ex, ny, acc ? 2.6 : 1.8, 0, TAU);
            ctx.fill();
          }
        } else {
          // future branch: redaction bars stacked along where the branch WOULD go,
          // flickering as if censored / not yet declassified
          const bars = 3 + Math.floor(hash(i * 2.3) * 3);
          for (let b = 0; b < bars; b += 1) {
            const segY = spineY + dir * (16 + b * (reach / bars));
            const bw = 14 + hash2(i, b) * (run * 0.5);
            const bh = 5;
            const flick = Math.sin(t * 1.7 + i * 1.3 + b * 2.1) * 0.5 + 0.5;
            const gate = hash2(i * 7 + 1, b * 3 + 2);
            // mostly blacked out, rare red leak reveal
            if (flick > 0.97 && gate > 0.5) {
              ctx.fillStyle = A(0.18 + (flick - 0.97) * 14);
            } else {
              ctx.fillStyle = white(0.05 + flick * 0.05);
            }
            ctx.fillRect(nx + 4, segY - bh / 2, bw, bh);
          }
          // faint stub off the spine hinting a hidden fork
          ctx.strokeStyle = white(0.08);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nx, spineY);
          ctx.lineTo(nx + 6, spineY + dir * 12);
          ctx.stroke();
        }

        // node marker on the spine itself
        const onSpine = Math.abs(nx - headX) < tickGap * 1.2;
        ctx.fillStyle = isPast ? white(0.5) : white(0.18);
        ctx.beginPath();
        ctx.arc(nx, spineY, 2, 0, TAU);
        ctx.fill();
        if (onSpine) {
          ctx.strokeStyle = A(0.5);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, spineY, 5 + Math.sin(t * 5) * 1.5, 0, TAU);
          ctx.stroke();
        }
      }

      // --- playhead marker: a vertical scan line with a red core dot ---
      ctx.strokeStyle = white(0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX, H * 0.28);
      ctx.lineTo(headX, H * 0.72);
      ctx.stroke();

      ctx.fillStyle = A(0.9);
      ctx.beginPath();
      ctx.arc(headX, spineY, 3.4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = A(0.3 + 0.2 * (Math.sin(t * 4) * 0.5 + 0.5));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(headX, spineY, 8, 0, TAU);
      ctx.stroke();
    },
    dispose() {},
  };
});
