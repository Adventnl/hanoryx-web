// SIGNAL SPECTRUM FIELD — audio-reactive stack of full-width spectral ribbons (mirrored waveforms) layered over a faint measurement grid; phase-offset per row gives a parallax depth, idle sine drift when audio is off.
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid, drawAudioWave } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('signal-spectrum-field', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  const d = clamp(density || 1, 0.5, 1.4);
  const rows = quality === 'static' || quality === 'low' ? 3 : quality === 'medium' ? 4 : 6;

  // re-used idle buffers, one per ribbon, so audio-off shows independent drift
  const idle = [];
  for (let r = 0; r < rows; r += 1) idle.push(new Float32Array(32));
  // per-ribbon working buffer fed to the primitive (kept small, reused)
  const work = new Float32Array(32);
  let lvl = 0;

  const build = (w, h) => { W = w; H = h; };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer, audio }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const au = audio || {};
      const live = au.active && au.bands;

      lvl = lerp(lvl, live ? au.level : 0.16, live ? 0.22 : 0.05);

      // faint full-width measurement grid backdrop
      drawGrid(ctx, { w: W, h: H, t, cell: 88, alpha: 0.035, scroll: 5, accentEvery: 8, accent: A });

      // horizontal travelling read head — brightens the ribbon it passes
      const headX = ((t * 0.06 + (p.active ? (p.nx + 1) * 0.5 * 0.4 : 0)) % 1) * W;

      const band = H / (rows + 1);
      for (let r = 0; r < rows; r += 1) {
        const cy = band * (r + 1);
        // depth: front ribbons (lower) read taller & brighter
        const depth = (r + 1) / rows;
        const rh = band * (0.78 + depth * 0.5) * d;

        // build this ribbon's spectrum slice
        const buf = idle[r];
        if (live) {
          // sample audio bands with a per-row offset so rows are distinct
          const off = r * 4;
          for (let i = 0; i < 32; i += 1) {
            const v = au.bands[(i + off) % au.bands.length];
            // smooth into the reusable work buffer to soften jitter
            work[i] = lerp(work[i], v, 0.35) * (0.6 + depth * 0.5);
          }
        } else {
          const ph = t * (0.9 + r * 0.18);
          for (let i = 0; i < 32; i += 1) {
            buf[i] = 0.12
              + (Math.sin(ph + i * 0.42 + r * 1.7) * 0.5 + 0.5) * 0.2
              + (Math.sin(ph * 0.6 - i * 0.21) * 0.5 + 0.5) * 0.08;
          }
        }
        const bands = live ? work : buf;

        // proximity of the read head to this ribbon's horizontal sweep position
        const litMix = 1 - clamp(Math.abs(headX - W * depth) / (W * 0.32), 0, 1);

        ctx.save();
        ctx.translate(0, cy - rh / 2);
        // back rows recede in opacity
        ctx.globalAlpha = 0.22 + depth * 0.45;
        drawAudioWave(ctx, {
          w: W, h: rh, t: t + r * 0.5, bands, level: lvl * (0.4 + depth),
          alpha: 0.18 + depth * 0.22, accent: A, mode: 'wave',
        });
        ctx.restore();

        // thin baseline for each ribbon
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.04 + depth * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(W, cy);
        ctx.stroke();

        // accent node where the read head crosses, scaled by level + ribbon depth
        if (litMix > 0.02) {
          const nodeX = W * depth;
          const rad = (2 + lvl * 7 + depth * 2) * (0.5 + litMix);
          ctx.fillStyle = A((0.12 + lvl * 0.5) * litMix);
          ctx.beginPath();
          ctx.arc(nodeX, cy, rad, 0, TAU);
          ctx.fill();
        }
      }

      // vertical read head line, very faint, tying the rows together
      ctx.lineWidth = 1;
      ctx.strokeStyle = A(0.06 + lvl * 0.18);
      ctx.beginPath();
      ctx.moveTo(headX, 0);
      ctx.lineTo(headX, H);
      ctx.stroke();
    },
    dispose() {},
  };
});
