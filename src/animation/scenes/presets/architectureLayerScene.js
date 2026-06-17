/* ARCHITECTURE LAYER — a system blueprint of 4-5 stacked slab layers drawn in a
   slight isometric skew, joined by vertical connectors; a red data pulse rises
   through the stack, briefly lighting each layer it passes. A layered-stack
   shape language, no grid. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('architecture-layer', ({ ctx, width, height, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;

  let layers = 5;
  let cols = 6;
  let slabW = 0;
  let slabD = 0;
  let layerH = 0;
  let baseY = 0;
  let cx = 0;

  const build = (w, h) => {
    W = w;
    H = h;
    layers = H < 380 ? 4 : 5;
    cols = clamp(Math.round(6 * density), 4, 9);

    slabW = Math.min(W * 0.46, 520);
    slabD = slabW * 0.34;          // isometric depth (skewed up-right)
    const stackSpan = H * 0.62;
    layerH = stackSpan / layers * 0.46;
    baseY = H * 0.78;
    cx = W * 0.5;
  };
  build(width, height);

  // isometric projection: floor point (fx in -0.5..0.5 of slab, depth 0..1) -> screen
  const skewX = () => slabD;       // horizontal shear of the back edge
  const skewY = () => -slabD * 0.5;

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const sx = skewX();
      const sy = skewY();
      const hw = slabW * 0.5;
      const tilt = clamp((p.nx || 0) * 0.12, -0.18, 0.18);

      // pulse position 0 (bottom) -> 1 (top), looping
      const pulse = (t * 0.13) % 1;
      const pulseLayer = pulse * (layers - 1);

      // draw from back/bottom layer to front/top so stacking reads correctly
      for (let i = 0; i < layers; i++) {
        const ly = baseY - i * (layerH + H * 0.05);
        const ox = cx + i * (W * 0.012 * (1 + tilt));   // slight per-layer drift

        // four floor corners of this slab (front-left, front-right, back-right, back-left)
        const flx = ox - hw, fly = ly;
        const frx = ox + hw, fry = ly;
        const brx = frx + sx, bry = fry + sy;
        const blx = flx + sx, bly = fly + sy;

        const here = 1 - clamp(Math.abs(pulseLayer - i), 0, 1);
        const glow = here * here;

        // vertical side walls (extrude floor up by layerH)
        const wallA = 0.05 + 0.07 * glow;
        // left front wall
        ctx.fillStyle = white(wallA * 0.6);
        ctx.beginPath();
        ctx.moveTo(flx, fly);
        ctx.lineTo(frx, fry);
        ctx.lineTo(frx, fry - layerH);
        ctx.lineTo(flx, fly - layerH);
        ctx.closePath();
        ctx.fill();
        // right side wall
        ctx.fillStyle = white(wallA * 0.35);
        ctx.beginPath();
        ctx.moveTo(frx, fry);
        ctx.lineTo(brx, bry);
        ctx.lineTo(brx, bry - layerH);
        ctx.lineTo(frx, fry - layerH);
        ctx.closePath();
        ctx.fill();

        // top face fill (where modules sit)
        const tly = fly - layerH;
        const tfrx = frx, tfry = fry - layerH;
        const tbrx = brx, tbry = bry - layerH;
        const tblx = blx, tbly = bly - layerH;
        ctx.fillStyle = white(0.02 + 0.05 * glow);
        ctx.beginPath();
        ctx.moveTo(flx, tly);
        ctx.lineTo(tfrx, tfry);
        ctx.lineTo(tbrx, tbry);
        ctx.lineTo(tblx, tbly);
        ctx.closePath();
        ctx.fill();

        // top face outline
        ctx.lineWidth = 1;
        ctx.strokeStyle = glow > 0.4 ? A(0.25 + 0.4 * glow) : white(0.18);
        ctx.beginPath();
        ctx.moveTo(flx, tly);
        ctx.lineTo(tfrx, tfry);
        ctx.lineTo(tbrx, tbry);
        ctx.lineTo(tblx, tbly);
        ctx.closePath();
        ctx.stroke();

        // bottom front edge of the wall (anchors the slab)
        ctx.strokeStyle = white(0.08 + 0.12 * glow);
        ctx.beginPath();
        ctx.moveTo(flx, fly);
        ctx.lineTo(frx, fry);
        ctx.stroke();

        // module ridges across the top face (lengthwise division lines)
        for (let c = 1; c < cols; c++) {
          const u = c / cols;
          const x0 = lerp(flx, tfrx, u);
          const y0 = lerp(tly, tfry, u);
          const x1 = lerp(tblx, tbrx, u);
          const y1 = lerp(tbly, tbry, u);
          ctx.strokeStyle = white(0.05 + 0.08 * glow);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }

        // a few lit module cells on the layer the pulse is at
        if (glow > 0.15) {
          const litCols = Math.min(cols, 4);
          for (let c = 0; c < litCols; c++) {
            const seed = hash(i * 19 + c * 7 + Math.floor(t * 0.7));
            if (seed < 0.5) continue;
            const u0 = (c + 0.18) / cols;
            const u1 = (c + 0.82) / cols;
            const mx = lerp(lerp(flx, tfrx, (u0 + u1) / 2), lerp(tblx, tbrx, (u0 + u1) / 2), 0.5);
            const my = lerp(lerp(tly, tfry, (u0 + u1) / 2), lerp(tbly, tbry, (u0 + u1) / 2), 0.5);
            const r = 2 + 1.5 * glow;
            ctx.fillStyle = A(0.5 * glow);
            ctx.beginPath();
            ctx.arc(mx, my, r, 0, TAU);
            ctx.fill();
          }
        }
      }

      // vertical connectors between consecutive layers (back-right column = spine)
      for (let i = 0; i < layers - 1; i++) {
        const lyA = baseY - i * (layerH + H * 0.05);
        const lyB = baseY - (i + 1) * (layerH + H * 0.05);
        const oxA = cx + i * (W * 0.012 * (1 + tilt));
        const oxB = cx + (i + 1) * (W * 0.012 * (1 + tilt));
        // connector anchored near back-right corner of each slab top
        const ax = oxA + hw + sx;
        const ay = lyA + sy - layerH;
        const bx = oxB + hw + sx;
        const by = lyB + sy;          // bottom (front edge) of upper slab

        const active = 1 - clamp(Math.abs(pulseLayer - (i + 0.5)), 0, 1.2) / 1.2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.07 + 0.14 * active);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // second connector near the front-left for a strut feel
        const cxA = oxA - hw;
        const cyA = lyA - layerH;
        const cxB = oxB - hw;
        const cyB = lyB;
        ctx.strokeStyle = white(0.05 + 0.08 * active);
        ctx.beginPath();
        ctx.moveTo(cxA, cyA);
        ctx.lineTo(cxB, cyB);
        ctx.stroke();
      }

      // the rising data pulse: a bright core travelling up the central spine
      {
        const li = Math.floor(pulseLayer);
        const frac = pulseLayer - li;
        const lyA = baseY - li * (layerH + H * 0.05);
        const lyB = baseY - Math.min(li + 1, layers - 1) * (layerH + H * 0.05);
        const oxA = cx + li * (W * 0.012 * (1 + tilt));
        const oxB = cx + Math.min(li + 1, layers - 1) * (W * 0.012 * (1 + tilt));
        const spineXA = oxA + sx * 0.5;
        const spineXB = oxB + sx * 0.5;
        const px = lerp(spineXA, spineXB, frac);
        const py = lerp(lyA - layerH * 0.5 + sy * 0.5, lyB - layerH * 0.5 + sy * 0.5, frac);

        // trailing streak below the core
        const grad = ctx.createLinearGradient(px, py + 70, px, py);
        grad.addColorStop(0, A(0));
        grad.addColorStop(1, A(0.5));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py + 70);
        ctx.lineTo(px, py);
        ctx.stroke();

        const pr = 3.5 + Math.sin(t * 5) * 0.6;
        ctx.fillStyle = A(0.9);
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = A(0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pr + 4 + Math.sin(t * 5) * 1.5, 0, TAU);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
