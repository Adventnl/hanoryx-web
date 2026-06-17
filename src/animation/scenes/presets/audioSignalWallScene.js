import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawAudioWave, drawGrid } from '../primitives';
import { TAU, lerp } from '../../easing';

/* AUDIO SIGNAL WALL — full-width spectrum visualizer. Reacts to live audio via
   the shared audio bridge; falls back to a procedural idle signal when nothing
   is playing. A faint baseline grid + a mirrored reflection give it depth.
   Designed to be the dominant, obvious background on Contact / signal blocks. */
registerScene('audio-signal-wall', ({ ctx, width, height, accent }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  const idle = new Float32Array(40);
  let lvl = 0;

  const build = (w, h) => {
    W = w;
    H = h;
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, audio }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      drawGrid(ctx, { w: W, h: H, t, cell: 80, alpha: 0.03, scroll: 6 });

      const live = audio && audio.active;
      let bands;
      if (live) {
        bands = audio.bands;
        lvl = lerp(lvl, audio.level, 0.2);
      } else {
        for (let i = 0; i < idle.length; i += 1) {
          idle[i] = 0.08 + (Math.sin(t * 1.3 + i * 0.5) * 0.5 + 0.5) * 0.22 * (1 - i / idle.length * 0.4);
        }
        bands = idle;
        lvl = lerp(lvl, 0.18, 0.05);
      }

      // main spectrum anchored near the lower third
      ctx.save();
      ctx.translate(0, H * 0.34);
      drawAudioWave(ctx, { w: W, h: H * 0.66, t, bands, level: lvl, alpha: 0.55, accent: A, mode: 'bars' });
      ctx.restore();

      // faint mirrored reflection above the baseline
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.translate(0, H * 0.34);
      ctx.scale(1, -1);
      drawAudioWave(ctx, { w: W, h: H * 0.3, t, bands, level: lvl, alpha: 0.5, accent: A, mode: 'bars' });
      ctx.restore();

      // baseline + travelling read head
      ctx.strokeStyle = white(0.08);
      ctx.beginPath();
      ctx.moveTo(0, H * 0.34);
      ctx.lineTo(W, H * 0.34);
      ctx.stroke();

      const hx = ((t * 0.08) % 1) * W;
      ctx.fillStyle = A(0.1 + lvl * 0.5);
      ctx.beginPath();
      ctx.arc(hx, H * 0.34, 3 + lvl * 6, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
