import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, easeOutCubic, mapRange } from '../easing';

/* A terminal readout — monospace log lines scan in sequence, a caret blinks on
   the active line, and a faint highlight bar sweeps down the column. One red
   WARN line. Static strings, low-alpha white; mysterious technical mood. */
registerScene('command-terminal', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);

  // Static log content. One WARN line (index 6) is rendered in accent red.
  const LINES = [
    '> hanoryx::core boot --secure',
    '  link established  node=0x7F3A',
    '  loading kernel modules .......',
    '  handshake verified   sig=OK',
    '  sync telemetry  ch[04] active',
    '  mapping subsystems  alloc=42%',
    '! WARN  drift detected  Δ=0.013',
    '  recalibrating phase lock .....',
    '  channels nominal   throughput',
    '> awaiting command',
  ];
  const WARN_INDEX = 6;

  let W = width;
  let H = height;
  let fontPx = 15;
  let lineH = 26;
  let originX = 0;
  let originY = 0;
  let cycle = 18; // seconds for one full readout cycle

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    fontPx = Math.round(clamp(Math.min(w, h) * 0.018, 12, 18) * (0.85 + scale * 0.15));
    lineH = Math.round(fontPx * 1.7);
    const blockH = lineH * LINES.length;
    // Keep the readout offset toward the left third, vertically centred-ish.
    originX = clamp(w * 0.08, 18, w * 0.5);
    originY = clamp((h - blockH) * 0.5, lineH, h - blockH - lineH);
    // density nudges how long each line lingers before the next reveals.
    cycle = mapRange(clamp(density, 0.4, 1.6), 0.4, 1.6, 26, 12);
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;
      const phase = (t % cycle) / cycle; // 0..1 across the readout

      // Subtle pointer parallax (resolution-independent nx/ny).
      const px = pointer && pointer.active ? pointer.nx * 6 : 0;
      const py = pointer && pointer.active ? pointer.ny * 4 : 0;

      ctx.font = `${fontPx}px "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      // Faint frame margin on the left to read as a console gutter.
      ctx.strokeStyle = white(0.05);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originX + px - 10, originY + py - lineH * 0.6);
      ctx.lineTo(originX + px - 10, originY + py + lineH * LINES.length - lineH * 0.4);
      ctx.stroke();

      // Determine which line is "active" (currently scanning in).
      const activeF = phase * (LINES.length + 1);
      const activeIdx = Math.floor(activeF);

      // Scanning highlight bar sweeping down the block.
      const barY = originY + py + activeF * lineH;
      if (barY > originY + py - lineH && barY < originY + py + LINES.length * lineH) {
        const grad = ctx.createLinearGradient(0, barY - lineH * 0.7, 0, barY + lineH * 0.7);
        grad.addColorStop(0, white(0));
        grad.addColorStop(0.5, white(0.06));
        grad.addColorStop(1, white(0));
        ctx.fillStyle = grad;
        ctx.fillRect(originX + px - 14, barY - lineH * 0.7, W * 0.42, lineH * 1.4);
      }

      for (let i = 0; i < LINES.length; i += 1) {
        const y = originY + py + i * lineH + lineH * 0.5;
        const str = LINES[i];

        // Reveal progress: lines before active are fully shown, active scans in.
        let reveal;
        if (i < activeIdx) reveal = 1;
        else if (i > activeIdx) reveal = 0;
        else reveal = easeOutCubic(clamp(activeF - activeIdx, 0, 1));

        const shown = Math.round(str.length * reveal);
        if (shown <= 0 && i > activeIdx) continue;

        const isWarn = i === WARN_INDEX;
        // Active line a touch brighter; settled lines stay faint.
        const baseA = i === activeIdx ? 0.22 : 0.13;
        const tone = isWarn ? A : white;
        ctx.fillStyle = isWarn ? A(i === activeIdx ? 0.32 : 0.2) : tone(baseA);

        const text = str.slice(0, shown);
        ctx.fillText(text, originX + px, y);

        // Blinking caret on the active line, parked at the reveal head.
        if (i === activeIdx) {
          const blink = 0.5 + 0.5 * Math.sin(t * TAU * 1.1);
          const caretX = originX + px + ctx.measureText(text).width + 2;
          ctx.fillStyle = isWarn ? A(0.4 * blink + 0.1) : white(0.3 * blink + 0.08);
          ctx.fillRect(caretX, y - fontPx * 0.42, fontPx * 0.55, fontPx * 0.85);
        }
      }
    },
    dispose() {
      W = 0;
      H = 0;
    },
  };
});
