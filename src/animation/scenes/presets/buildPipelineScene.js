/* BUILD PIPELINE — 5 stage gates chained left to right; a build token advances
   gate by gate, each cleared stage fills with a check-tick pulse, and an
   occasional parallel branch forks below. A CI/build shape language. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('build-pipeline', ({ ctx, width, height, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;

  const STAGES = 5;
  let stageXs = [];
  let mainY = 0;
  let branchY = 0;
  let gateR = 14;

  const build = (w, h) => {
    W = w;
    H = h;
    mainY = H * 0.42;
    branchY = H * 0.66;
    gateR = clamp(Math.min(W, H) * 0.028, 9, 22) * (0.85 + density * 0.2);
    stageXs = [];
    const left = W * 0.12;
    const span = W * 0.76;
    for (let s = 0; s < STAGES; s++) {
      stageXs.push(left + (span * s) / (STAGES - 1));
    }
  };
  build(width, height);

  // draw a small check-tick glyph centered at (x,y), scaled by k, alpha a
  const tick = (x, y, k, col) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 0.45 * k, y + 0.02 * k);
    ctx.lineTo(x - 0.1 * k, y + 0.38 * k);
    ctx.lineTo(x + 0.5 * k, y - 0.38 * k);
    ctx.stroke();
    ctx.lineCap = 'butt';
  };

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // a full pipeline run cycles; "head" is the fractional stage the token is at
      const cycle = 7.0;
      const phase = (t % cycle) / cycle; // 0..1 across the whole pipeline
      const head = phase * STAGES; // 0..STAGES, fractional gate position
      // which run number — used to decide if this run forks a parallel branch
      const runId = Math.floor(t / cycle);
      const branchActive = hash(runId * 1.7 + 3) > 0.55;
      const branchFrom = 1; // fork after stage index 1
      const branchTo = 3; // rejoin at stage index 3

      // ---- connecting rails between gates (main line) ----
      ctx.lineWidth = 1;
      for (let s = 0; s < STAGES - 1; s++) {
        const x0 = stageXs[s] + gateR;
        const x1 = stageXs[s + 1] - gateR;
        const segDone = head > s + 1;
        const segActive = head > s + 0.5 && head <= s + 1.4;
        ctx.strokeStyle = segDone ? white(0.22) : white(0.07);
        ctx.beginPath();
        ctx.moveTo(x0, mainY);
        ctx.lineTo(x1, mainY);
        ctx.stroke();

        // travelling fill pulse on the active segment
        if (segActive) {
          const fp = clamp(head - s, 0, 1);
          const px = lerp(stageXs[s], stageXs[s + 1], fp);
          ctx.strokeStyle = A(0.5);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(Math.max(x0, px - 26), mainY);
          ctx.lineTo(px, mainY);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }

      // ---- parallel branch rail (forks down, runs, rejoins) ----
      if (branchActive) {
        const fx = stageXs[branchFrom];
        const tx = stageXs[branchTo];
        const reached = head > branchFrom + 0.5;
        const a = reached ? 0.16 : 0.05;
        ctx.strokeStyle = white(a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx, mainY + gateR * 0.4);
        ctx.lineTo(fx, branchY);
        ctx.lineTo(tx, branchY);
        ctx.lineTo(tx, mainY + gateR * 0.4);
        ctx.stroke();

        // branch worker token
        if (head > branchFrom + 0.4 && head < branchTo + 0.4) {
          const bp = clamp((head - branchFrom) / (branchTo - branchFrom), 0, 1);
          const bx = lerp(fx, tx, bp);
          ctx.fillStyle = white(0.5);
          ctx.fillRect(bx - 3, branchY - 3, 6, 6);
          ctx.strokeStyle = white(0.2);
          ctx.strokeRect(bx - 4, branchY - 4, 8, 8);
        }
      }

      // ---- stage gates ----
      for (let s = 0; s < STAGES; s++) {
        const gx = stageXs[s];
        const cleared = head > s + 0.85;
        const arriving = head > s + 0.2 && head <= s + 1.0;
        // pulse when token just cleared this stage
        const justCleared = head - (s + 0.85);
        const pulse = justCleared > 0 && justCleared < 0.5 ? 1 - justCleared / 0.5 : 0;

        // gate frame (rounded square)
        const col = cleared ? A(0.4 + 0.45 * pulse) : arriving ? white(0.4) : white(0.16);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        const r2 = gateR;
        ctx.moveTo(gx - r2, mainY);
        ctx.arc(gx, mainY, r2, 0, TAU);
        ctx.stroke();

        // inner status mark
        if (cleared) {
          tick(gx, mainY, gateR * 0.9, A(0.7 + 0.3 * pulse));
          // expanding ring on the clear-pulse
          if (pulse > 0.02) {
            ctx.strokeStyle = A(0.4 * pulse);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(gx, mainY, gateR + (1 - pulse) * gateR * 1.4, 0, TAU);
            ctx.stroke();
          }
        } else {
          // pending: a small idle spinner notch
          const sa = t * 1.4 + s;
          ctx.strokeStyle = white(arriving ? 0.5 : 0.18);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(gx, mainY, gateR * 0.5, sa, sa + TAU * 0.55);
          ctx.stroke();
        }

        // stage label tick under each gate (mono baseline marks)
        ctx.strokeStyle = cleared ? white(0.3) : white(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx - 4, mainY + gateR + 7);
        ctx.lineTo(gx + 4, mainY + gateR + 7);
        ctx.stroke();
      }

      // ---- the advancing build token (diamond) on the main rail ----
      {
        const seg = Math.floor(clamp(head, 0, STAGES - 0.001));
        const local = clamp(head - seg, 0, 1);
        // ease the dwell at each gate
        const eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
        const tx = clamp(head < STAGES - 1 ? lerp(stageXs[seg], stageXs[Math.min(seg + 1, STAGES - 1)], eased) : stageXs[STAGES - 1], stageXs[0], stageXs[STAGES - 1]);
        const blink = 0.7 + 0.3 * Math.sin(t * 7);
        const d = gateR * 0.46;
        ctx.save();
        ctx.translate(tx, mainY);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = A(0.85 * blink);
        ctx.fillRect(-d, -d, d * 2, d * 2);
        ctx.strokeStyle = white(0.7);
        ctx.lineWidth = 1;
        ctx.strokeRect(-d, -d, d * 2, d * 2);
        ctx.restore();
      }

      // ---- top status strip: ticking run counter dots ----
      const stripY = H * 0.16;
      for (let i = 0; i < STAGES; i++) {
        const on = head > i + 0.85;
        ctx.fillStyle = on ? A(0.6) : white(0.12);
        ctx.beginPath();
        ctx.arc(stageXs[i], stripY, on ? 2.6 : 1.8, 0, TAU);
        ctx.fill();
      }
      // mono progress bar under the strip
      const barX0 = stageXs[0];
      const barX1 = stageXs[STAGES - 1];
      ctx.strokeStyle = white(0.08);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(barX0, stripY + 8);
      ctx.lineTo(barX1, stripY + 8);
      ctx.stroke();
      ctx.strokeStyle = A(0.35);
      ctx.beginPath();
      ctx.moveTo(barX0, stripY + 8);
      ctx.lineTo(lerp(barX0, barX1, phase), stripY + 8);
      ctx.stroke();

      // ---- pointer inspection: vertical readout line snapped to nearest gate ----
      if (p.active) {
        let nearest = 0;
        let best = Infinity;
        for (let s = 0; s < STAGES; s++) {
          const dx = Math.abs(p.x - stageXs[s]);
          if (dx < best) {
            best = dx;
            nearest = s;
          }
        }
        const gx = stageXs[nearest];
        ctx.strokeStyle = white(0.12);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx, stripY + 12);
        ctx.lineTo(gx, branchActive ? branchY + 10 : mainY + gateR + 16);
        ctx.stroke();
        ctx.fillStyle = A(0.5);
        ctx.beginPath();
        ctx.arc(gx, stripY + 12, 2.2, 0, TAU);
        ctx.fill();
      }
    },
    dispose() {},
  };
});
