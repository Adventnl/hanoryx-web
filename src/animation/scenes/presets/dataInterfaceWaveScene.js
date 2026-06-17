// Oscilloscope data interface: multi-line signal traces over a faint measurement grid, with a sweeping vertical cursor and a readout dot riding the top trace.
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid, drawWave } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('data-interface-wave', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  const d = clamp(density || 1, 0.5, 1.4);
  const rows = quality === 'static' || quality === 'low' ? 3 : quality === 'medium' ? 4 : 5;
  const cell = 64;

  const build = (w, h) => { W = w; H = h; };
  build(width, height);

  // top-trace value matching drawWave row 0 (baseY = H/(rows+1), ph = t*0.8, amp)
  const topTrace = (px, t, amp) => {
    const baseY = H / (rows + 1);
    const ph = t * 0.8;
    const p = px / W;
    return baseY
      + Math.sin(p * TAU * 2.4 + ph) * amp
      + Math.sin(p * TAU * 6.1 - ph * 0.7) * amp * 0.3;
  };

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer, audio }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const au = audio || {};
      const level = au.active ? au.level : 0;
      const amp = (26 + level * 22) * d;

      // faint measurement grid backdrop
      drawGrid(ctx, { w: W, h: H, t: 0, cell, alpha: 0.05, accentEvery: 6, accent: A });

      // brighter center baseline (the oscilloscope zero line)
      const baseY = H / (rows + 1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.12);
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(W, baseY);
      ctx.stroke();

      // signal traces
      drawWave(ctx, { w: W, h: H, t, rows, amp, alpha: 0.12, accent: A, level });

      // sweeping vertical cursor (pointer-steered when active)
      const sweep = (Math.sin(t * 0.35) * 0.5 + 0.5);
      const cursorX = p.active
        ? lerp(0, W, clamp((p.nx + 1) * 0.5, 0, 1))
        : sweep * W;

      ctx.lineWidth = 1;
      ctx.strokeStyle = A(0.28);
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, H);
      ctx.stroke();

      // tick marks along the cursor
      const tick = 9;
      for (let ty = cell * 0.5; ty < H; ty += cell) {
        ctx.strokeStyle = A(0.5);
        ctx.beginPath();
        ctx.moveTo(cursorX - tick, ty);
        ctx.lineTo(cursorX + tick, ty);
        ctx.stroke();
      }

      // readout dot riding the top trace at the cursor
      const ry = topTrace(cursorX, t, amp);
      // soft halo
      ctx.fillStyle = A(0.16);
      ctx.beginPath();
      ctx.arc(cursorX, ry, 7, 0, TAU);
      ctx.fill();
      // core
      ctx.fillStyle = A(0.95);
      ctx.beginPath();
      ctx.arc(cursorX, ry, 2.6, 0, TAU);
      ctx.fill();
      // crosshair lead-in to the y-axis
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.18);
      ctx.beginPath();
      ctx.moveTo(0, ry);
      ctx.lineTo(cursorX - 9, ry);
      ctx.stroke();
      ctx.fillStyle = white(0.45);
      ctx.beginPath();
      ctx.arc(6, ry, 1.8, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
