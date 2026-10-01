import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { TAU } from '../../easing';

// Every connection means the two public repositories share a detected language.
// The positions are deterministic; this is a visual index, not a force simulation.
registerScene('public-repositories', ({ ctx, width, height, quality, accent, sceneData = [] }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  const records = sceneData.slice(0, quality === 'low' || quality === 'static' ? 12 : 24);
  const edges = [];
  for (let i = 0; i < records.length; i += 1) {
    const languages = new Set(records[i].languages);
    for (let j = i + 1; j < records.length; j += 1) {
      if (records[j].languages.some((language) => languages.has(language))) edges.push([i, j]);
    }
  }
  const position = (index, progress, time) => {
    const angle = (index / Math.max(records.length, 1)) * TAU - Math.PI / 2;
    const spread = 0.31 + progress * 0.13;
    return {
      x: W * (0.58 + Math.cos(angle) * spread) + Math.sin(time * 0.00022 + index) * 5,
      y: H * (0.52 + Math.sin(angle) * spread * 0.8) + Math.cos(time * 0.00019 + index) * 5,
    };
  };
  return {
    resize(w, h) { W = w; H = h; },
    draw({ time, progress = 0.5, pointer, still }) {
      ctx.clearRect(0, 0, W, H);
      const t = still ? 0 : time;
      const points = records.map((_, index) => position(index, progress, t));
      for (const [i, j] of edges) {
        const a = points[i];
        const b = points[j];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = white(0.055);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      points.forEach((point, index) => {
        const near = pointer?.active && Math.hypot(point.x - pointer.x, point.y - pointer.y) < 120;
        const radius = near ? 6 : 4;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, TAU);
        ctx.fillStyle = index === 0 || near ? A(0.7) : white(0.42);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 12 + Math.sin(t * 0.0005 + index) * 2, 0, TAU);
        ctx.strokeStyle = near ? A(0.35) : white(0.075);
        ctx.stroke();
      });
    },
    dispose() {},
  };
});
