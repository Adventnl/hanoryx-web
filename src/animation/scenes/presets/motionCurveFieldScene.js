// Motion-grammar reference: a stack of easing/bezier curves plotted on a faint axis grid, each with a dot animating along it at its own easing and tick marks reading like a timing-function catalogue.
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('motion-curve-field', ({ ctx, width, height, quality, accent }) => {
  const A = accentFn(accent);
  let W = width, H = height;

  // a small library of easing functions sampled u:0..1 -> 0..1
  const EASES = [
    (u) => u, // linear
    (u) => u * u, // ease-in quad
    (u) => 1 - (1 - u) * (1 - u), // ease-out quad
    (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2), // in-out cubic
    (u) => 1 - Math.pow(1 - u, 4), // ease-out quart
    (u) => Math.pow(2, 10 * (u - 1)) * (u < 1 ? 1 : 1), // expo-in (clamped below)
    (u) => -(Math.cos(Math.PI * u) - 1) / 2, // sine in-out
    (u) => { // back-out overshoot
      const c1 = 1.70158, c3 = c1 + 1, p = u - 1;
      return 1 + c3 * p * p * p + c1 * p * p;
    },
  ];

  // how many curves to show by quality
  const curveCount = quality === 'static' || quality === 'low' ? 3
    : quality === 'medium' ? 5 : EASES.length;

  // sample resolution per curve (kept small; <200 total points/frame)
  const SEG = quality === 'high' ? 22 : 16;

  // layout geometry, recomputed on resize
  let pad, plotW, plotH, originX, originY;
  const build = (w, h) => {
    W = w; H = h;
    pad = Math.max(36, Math.min(W, H) * 0.12);
    plotW = W - pad * 2;
    plotH = H - pad * 2;
    originX = pad;
    originY = H - pad;
  };
  build(width, height);

  const easeVal = (i, u) => clamp(EASES[i](clamp(u, 0, 1)), -0.25, 1.25);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // faint backing axis grid
      drawGrid(ctx, { w: W, h: H, t: 0, cell: 56, alpha: 0.035, accentEvery: 0, accent: A });

      // plot frame: x-axis (time) and y-axis (value)
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.16);
      ctx.beginPath();
      ctx.moveTo(originX, pad);
      ctx.lineTo(originX, originY);
      ctx.lineTo(W - pad, originY);
      ctx.stroke();

      // labels-as-ticks: subdivisions on both axes
      const ticks = 4;
      ctx.lineWidth = 1;
      for (let k = 0; k <= ticks; k++) {
        const f = k / ticks;
        // x ticks along the time axis
        const tx = originX + plotW * f;
        ctx.strokeStyle = white(0.1);
        ctx.beginPath();
        ctx.moveTo(tx, originY);
        ctx.lineTo(tx, originY + 6);
        ctx.stroke();
        // y ticks along the value axis
        const ty = originY - plotH * f;
        ctx.beginPath();
        ctx.moveTo(originX - 6, ty);
        ctx.lineTo(originX, ty);
        ctx.stroke();
        // faint dashless value baseline at 0 and 1
        if (k === 0 || k === ticks) {
          ctx.strokeStyle = white(0.06);
          ctx.beginPath();
          ctx.moveTo(originX, ty);
          ctx.lineTo(W - pad, ty);
          ctx.stroke();
        }
      }

      // pointer scrubs the active playhead; otherwise it loops automatically
      const auto = (t * 0.18) % 1;
      const playRaw = p.active ? clamp((p.nx + 1) * 0.5, 0, 1) : auto;
      const playhead = clamp(playRaw, 0, 1);

      // moving playhead line down the time axis
      const phX = originX + plotW * playhead;
      ctx.lineWidth = 1;
      ctx.strokeStyle = A(0.22);
      ctx.beginPath();
      ctx.moveTo(phX, pad);
      ctx.lineTo(phX, originY);
      ctx.stroke();

      // draw each easing curve + its running dot
      for (let i = 0; i < curveCount; i++) {
        // each curve advances on its own loop phase for a staggered feel
        const phase = (t * (0.12 + i * 0.015) + i * 0.13) % 1;
        const u0 = p.active ? playhead : phase;

        // curve trace
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = white(lerp(0.1, 0.22, i / Math.max(1, curveCount - 1)));
        ctx.beginPath();
        for (let s = 0; s <= SEG; s++) {
          const u = s / SEG;
          const x = originX + plotW * u;
          const y = originY - plotH * easeVal(i, u);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // the dot riding this curve at its eased position
        const dx = originX + plotW * u0;
        const dy = originY - plotH * easeVal(i, u0);

        // ghost trail: where it was a moment ago, fading
        const uPrev = (u0 - 0.06 + 1) % 1;
        const gx = originX + plotW * uPrev;
        const gy = originY - plotH * easeVal(i, uPrev);
        ctx.fillStyle = white(0.08);
        ctx.beginPath();
        ctx.arc(gx, gy, 2, 0, TAU);
        ctx.fill();

        // leader lines projecting the dot onto both axes (motion-grammar read)
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.07);
        ctx.beginPath();
        ctx.moveTo(originX, dy);
        ctx.lineTo(dx, dy);
        ctx.moveTo(dx, originY);
        ctx.lineTo(dx, dy);
        ctx.stroke();

        // the running dot — red core only on the lead/active curve, white otherwise
        const accentCurve = i === (curveCount - 1);
        if (accentCurve) {
          ctx.fillStyle = A(0.16);
          ctx.beginPath();
          ctx.arc(dx, dy, 6, 0, TAU);
          ctx.fill();
          ctx.fillStyle = A(0.95);
          ctx.beginPath();
          ctx.arc(dx, dy, 2.6, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillStyle = white(0.55);
          ctx.beginPath();
          ctx.arc(dx, dy, 2.2, 0, TAU);
          ctx.fill();
        }

        // small value tick on the y-axis marking this dot's level
        ctx.fillStyle = accentCurve ? A(0.6) : white(0.22);
        ctx.fillRect(originX - 3, dy - 0.5, 5, 1);
      }

      // origin marker dot
      ctx.fillStyle = white(0.3);
      ctx.beginPath();
      ctx.arc(originX, originY, 1.8, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
