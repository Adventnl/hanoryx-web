import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { clamp, easeOutCubic } from '../easing';

/* A horizontal baseline through evenly spaced nodes. A bright red pulse
   sweeps left-to-right repeatedly, igniting each node as it passes. Faint
   vertical ticks drop beneath every node; the line itself is faint white. */
registerScene('timeline-pulse', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let nodes = [];
  let baseY = height * 0.5;
  let pulse = 0; // 0..1 normalized sweep position
  const speed = 0.13; // sweeps per second

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    baseY = H * 0.52;
    const count = Math.max(5, Math.round(11 * (QUALITY_SCALE[q] ?? 1) * density));
    const margin = W * 0.08;
    const span = W - margin * 2;
    nodes = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const t = count > 1 ? i / (count - 1) : 0.5;
      nodes[i] = {
        x: margin + span * t,
        t, // position along the timeline 0..1
        glow: 0, // current activation 0..1, decays over time
        tick: 16 + ((i * 37) % 28), // deterministic tick length
      };
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ delta, pointer }) {
      ctx.clearRect(0, 0, W, H);
      const dt = Math.min(delta, 50) / 1000;

      // subtle vertical parallax from pointer
      const par = pointer && pointer.active ? clamp(pointer.ny, -1, 1) * 10 : 0;
      const y = baseY + par;

      // advance the sweep
      const prev = pulse;
      pulse += dt * speed;
      const wrapped = pulse >= 1;
      if (wrapped) pulse -= 1;
      const px = nodes.length ? nodes[0].x + (nodes[nodes.length - 1].x - nodes[0].x) * pulse : 0;

      // baseline
      if (nodes.length) {
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, y);
        ctx.lineTo(nodes[nodes.length - 1].x, y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.1);
        ctx.stroke();
      }

      // bright trailing segment behind the pulse
      if (nodes.length) {
        const tailT = Math.max(0, pulse - 0.12);
        const x0 = nodes[0].x;
        const x1 = nodes[nodes.length - 1].x;
        const tx = x0 + (x1 - x0) * tailT;
        const grad = ctx.createLinearGradient(tx, y, px, y);
        grad.addColorStop(0, A(0));
        grad.addColorStop(1, A(0.5));
        ctx.beginPath();
        ctx.moveTo(tx, y);
        ctx.lineTo(px, y);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // nodes, ticks, activations
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];

        // ignite when the sweep crosses this node's position (handles wrap)
        const crossed = wrapped
          ? n.t >= prev || n.t <= pulse
          : n.t >= prev && n.t <= pulse;
        if (crossed) n.glow = 1;
        else if (n.glow > 0) n.glow = Math.max(0, n.glow - dt * 1.4);

        const g = easeOutCubic(n.glow);

        // vertical tick under the node
        ctx.beginPath();
        ctx.moveTo(n.x, y);
        ctx.lineTo(n.x, y + n.tick);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.05 + g * 0.12);
        ctx.stroke();

        // node dot
        ctx.beginPath();
        ctx.arc(n.x, y, 2 + g * 2.2, 0, 6.283);
        ctx.fillStyle = g > 0.02 ? A(0.35 + g * 0.55) : white(0.16);
        ctx.fill();

        // halo on freshly activated nodes
        if (g > 0.04) {
          ctx.beginPath();
          ctx.arc(n.x, y, 5 + g * 9, 0, 6.283);
          ctx.lineWidth = 1;
          ctx.strokeStyle = A(g * 0.22);
          ctx.stroke();
        }
      }

      // the travelling pulse head
      if (nodes.length) {
        ctx.beginPath();
        ctx.arc(px, y, 3, 0, 6.283);
        ctx.fillStyle = A(0.95);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, y, 8, 0, 6.283);
        ctx.lineWidth = 1;
        ctx.strokeStyle = A(0.25);
        ctx.stroke();
      }
    },
    dispose() {
      nodes = null;
    },
  };
});
