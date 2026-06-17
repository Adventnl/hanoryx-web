import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { accentFn, white } from '../../animation/scenePalette';
import { TAU } from '../../animation/easing';
import { getAudio } from '../../animation/audioBridge';
import {
  TOTAL,
  seg,
  segSmooth,
  env,
  ROUTE_LABELS,
  MODULE_LABELS,
  PROJECT_NODES,
} from './synthesisTimeline';

/* deterministic hash so particle/fragment placement is stable per index */
function hash(n) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

const QSCALE = { high: 1, medium: 0.7, low: 0.45 };

/**
 * SynthesisCanvas — the heavy, procedural half of the cinematic. A single
 * canvas drives every particle/ring/grid layer for all eleven phases. It does
 * NOT own a loop: the parent's master GSAP timeline calls `render(t)` once per
 * frame with the sequence time in seconds, so there is exactly one clock for
 * the whole experience (canvas + DOM stay in perfect sync, trivial cleanup).
 *
 * Exposes via ref: render(seconds) and a one-shot still(seconds).
 */
export const SynthesisCanvas = forwardRef(function SynthesisCanvas(
  { accent = '#ff3333', quality = 'high', initialTime = 0, className },
  ref
) {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const A = accentFn(accent);
    const qScale = QSCALE[quality] ?? 1;
    // cap DPR — heavy fills, mobile gets a lower ceiling
    const dprCap = quality === 'low' ? 1.5 : 2;
    let W = 0;
    let H = 0;
    let ro = null;
    let resizeRaf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ---- shared geometry helpers (closures over ctx) ---- */
    const dot = (x, y, r, style) => {
      ctx.fillStyle = style;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    };
    const line = (x1, y1, x2, y2, style, w = 1) => {
      ctx.strokeStyle = style;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    const strokeRect = (x, y, w, h, style, lw = 1) => {
      ctx.strokeStyle = style;
      ctx.lineWidth = lw;
      ctx.strokeRect(x, y, w, h);
    };

    /* ============== PHASE LAYERS ============== */

    // persistent architectural grid — builds in phase 3, stays faintly after
    function layerGrid(t) {
      const build = seg(t, 3.0, 5.0);
      const settle = 1 - seg(t, 17.0, 19.0) * 0.4; // dims slightly at lock
      const a = (0.05 + 0.03 * Math.sin(t * 1.5)) * build * settle * (1 - seg(t, 19.3, 20));
      if (a <= 0.001) return;
      const cell = 72;
      const cx = W / 2;
      const cy = H / 2;
      // lines extend outward from the centre cross as the grid "constructs"
      const reach = segSmooth(t, 3.0, 5.0);
      for (let x = cell / 2; x < W; x += cell) {
        const d = Math.abs(x - cx) / (W / 2);
        if (d > reach + 0.05) continue;
        line(x, cy - (H / 2) * reach, x, cy + (H / 2) * reach, white(a), 1);
      }
      for (let y = cell / 2; y < H; y += cell) {
        const d = Math.abs(y - cy) / (H / 2);
        if (d > reach + 0.05) continue;
        line(cx - (W / 2) * reach, y, cx + (W / 2) * reach, y, white(a * 0.8), 1);
      }
      // coordinate readouts
      if (build > 0.6 && t < 9) {
        ctx.font = '10px var(--font-mono, monospace)';
        ctx.fillStyle = A(0.4 * build);
        ctx.fillText(`X:${W} Y:${H}`, cx + 14, cy - 12);
        ctx.fillStyle = white(0.25 * build);
        ctx.fillText('GRID.LOCK', cx + 14, cy + 22);
      }
    }

    // the central core node — present the whole run, the gravitational anchor
    function layerCore(t) {
      const cx = W / 2;
      const cy = H / 2;
      const born = seg(t, 0.2, 1.2);
      const lockPulse = env(t, 17.0, 19.2, 0.2, 0.6);
      const release = 1 - seg(t, 19.2, 20);
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      const r = (3 + born * 4 + lockPulse * 10) * release;
      if (r <= 0) return;
      // glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 6 + 30);
      g.addColorStop(0, A(0.5 * release * (0.6 + 0.4 * pulse)));
      g.addColorStop(1, A(0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 6 + 30, 0, TAU);
      ctx.fill();
      dot(cx, cy, r, A(0.95 * release));
      // crosshair ticks during black start
      const ch = env(t, 0.4, 3.5, 0.4, 0.8);
      if (ch > 0.01) {
        const len = 16 + 8 * pulse;
        const s = white(0.35 * ch);
        line(cx - len - 8, cy, cx - 8, cy, s);
        line(cx + 8, cy, cx + len + 8, cy, s);
        line(cx, cy - len - 8, cx, cy - 8, s);
        line(cx, cy + 8, cx, cy + len + 8, s);
      }
    }

    // phase 2 — concentric ignition rings + radial spokes + orbit nodes
    function layerIgnition(t) {
      const e = env(t, 1.5, 7.5, 0.3, 2.5);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.42;
      const rings = 6;
      for (let i = 0; i < rings; i += 1) {
        const draw = segSmooth(t, 1.5 + i * 0.12, 2.6 + i * 0.12);
        if (draw <= 0) continue;
        const rad = (R / rings) * (i + 1);
        const sweep = TAU * draw;
        const rot = t * (i % 2 ? -0.25 : 0.3);
        ctx.strokeStyle = i === 2 ? A(0.4 * e) : white(0.1 * e);
        ctx.lineWidth = i === 2 ? 1.6 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, rot, rot + sweep);
        ctx.stroke();
      }
      // radial spokes
      const spokes = 12;
      const spokeP = segSmooth(t, 2.0, 3.0);
      for (let i = 0; i < spokes; i += 1) {
        const a = (TAU * i) / spokes + t * 0.1;
        line(cx, cy, cx + Math.cos(a) * R * spokeP, cy + Math.sin(a) * R * spokeP, white(0.06 * e));
      }
      // orbit nodes
      const orbP = seg(t, 2.4, 3.2);
      const nodes = 5;
      for (let i = 0; i < nodes; i += 1) {
        const a = (TAU * i) / nodes + t * 0.5;
        const rad = R * 0.66;
        dot(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 2.2 * orbP, A(0.8 * e));
      }
    }

    // phase 4 — fragments pulled inward from the edges (not readable)
    function layerFragments(t) {
      const e = env(t, 4.8, 9.0, 0.4, 1.6);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const count = Math.round(120 * qScale);
      const pull = segSmooth(t, 5.0, 7.0);
      const R = Math.min(W, H) * 0.34;
      for (let i = 0; i < count; i += 1) {
        const edgeA = hash(i) * TAU;
        const sx = cx + Math.cos(edgeA) * (Math.max(W, H) * 0.7);
        const sy = cy + Math.sin(edgeA) * (Math.max(W, H) * 0.7);
        const ringA = hash(i * 3.7) * TAU + t * 0.4;
        const tr = R * (0.4 + hash(i * 1.7) * 0.6);
        const tx = cx + Math.cos(ringA) * tr;
        const ty = cy + Math.sin(ringA) * tr;
        const k = pull * (0.6 + hash(i * 5.1) * 0.4);
        const x = sx + (tx - sx) * k;
        const y = sy + (ty - sy) * k;
        dot(x, y, 0.8 + hash(i * 2.3) * 1.4, i % 7 === 0 ? A(0.7 * e) : white(0.4 * e));
      }
    }

    // phase 5 — Hanoryx North node + code rails + route orbit
    function layerNorth(t) {
      const e = env(t, 6.8, 11.0, 0.4, 1.6);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const ny = cy - Math.min(W, H) * 0.28;
      // north node
      const rise = segSmooth(t, 7.0, 8.0);
      const yy = cy + (ny - cy) * rise;
      dot(cx, yy, 3 + 2 * rise, A(0.9 * e));
      line(cx, cy, cx, yy, A(0.3 * e));
      // code rails — vertical ticks rising along the spine
      const rails = 5;
      const railP = segSmooth(t, 7.4, 9.0);
      for (let i = 0; i < rails; i += 1) {
        const rx = cx - 60 + i * 30;
        const top = cy + (yy - cy) * railP;
        ctx.strokeStyle = white(0.12 * e);
        ctx.setLineDash([3, 5]);
        line(rx, cy, rx, top, white(0.12 * e));
        ctx.setLineDash([]);
      }
      // route orbit ring (labels are DOM) — draw the ring + 5 nodes
      const orb = segSmooth(t, 7.6, 9.0);
      const R = Math.min(W, H) * 0.2 * orb;
      if (R > 4) {
        ctx.strokeStyle = white(0.1 * e);
        ctx.beginPath();
        ctx.arc(cx, yy, R, 0, TAU);
        ctx.stroke();
        for (let i = 0; i < ROUTE_LABELS.length; i += 1) {
          const a = (TAU * i) / ROUTE_LABELS.length + t * 0.4 - TAU / 4;
          dot(cx + Math.cos(a) * R, yy + Math.sin(a) * R, 2.4, A(0.85 * e));
        }
      }
    }

    // phase 6 — seven system modules, each with a distinct micro-motif
    function layerModules(t) {
      const e = env(t, 8.9, 13.0, 0.4, 1.6);
      if (e <= 0.01) return;
      const n = MODULE_LABELS.length;
      const mw = Math.min(120, (W * 0.82) / n);
      const mh = mw * 0.66;
      const gap = mw * 0.18;
      const totalW = n * mw + (n - 1) * gap;
      const x0 = (W - totalW) / 2;
      const y = H * 0.5 - mh / 2;
      for (let i = 0; i < n; i += 1) {
        const appear = segSmooth(t, 9.0 + i * 0.12, 9.8 + i * 0.12);
        if (appear <= 0) continue;
        const x = x0 + i * (mw + gap);
        const lift = (1 - appear) * 24;
        ctx.save();
        ctx.globalAlpha = appear * e;
        strokeRect(x, y + lift, mw, mh, white(0.18), 1);
        // bracket accents
        ctx.strokeStyle = A(0.6);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y + lift + 8);
        ctx.lineTo(x, y + lift);
        ctx.lineTo(x + 8, y + lift);
        ctx.stroke();
        // distinct micro-motif per module
        const ix = x + 8;
        const iy = y + lift + 8;
        const iw = mw - 16;
        const ih = mh - 16;
        const lt = t * 2 + i;
        ctx.strokeStyle = A(0.5);
        ctx.fillStyle = A(0.5);
        const motif = i % 7;
        if (motif === 0) {
          // bar meter
          for (let b = 0; b < 5; b += 1) {
            const v = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(lt + b));
            ctx.fillRect(ix + b * (iw / 5), iy + ih * (1 - v), iw / 5 - 3, ih * v);
          }
        } else if (motif === 1) {
          // pipeline dots flowing
          for (let b = 0; b < 4; b += 1) {
            const f = (lt * 0.3 + b * 0.25) % 1;
            dot(ix + f * iw, iy + ih / 2, 2, A(0.7));
          }
        } else if (motif === 2) {
          // rotating gear ring
          ctx.beginPath();
          ctx.arc(ix + iw / 2, iy + ih / 2, ih * 0.34, lt, lt + 4.5);
          ctx.stroke();
        } else if (motif === 3) {
          // stacked layer bars
          for (let b = 0; b < 3; b += 1) {
            const off = Math.sin(lt + b) * 4;
            line(ix + off, iy + 4 + b * (ih / 3), ix + iw + off, iy + 4 + b * (ih / 3), white(0.4));
          }
        } else if (motif === 4) {
          // oscilloscope
          ctx.beginPath();
          for (let px = 0; px <= iw; px += 4) {
            const yy = iy + ih / 2 + Math.sin(px * 0.1 + lt * 2) * ih * 0.3;
            if (px === 0) ctx.moveTo(ix + px, yy);
            else ctx.lineTo(ix + px, yy);
          }
          ctx.stroke();
        } else if (motif === 5) {
          // iris gate
          const r = ih * 0.36 * (0.6 + 0.4 * Math.sin(lt));
          ctx.beginPath();
          ctx.arc(ix + iw / 2, iy + ih / 2, r, 0, TAU);
          ctx.stroke();
        } else {
          // scatter nodes
          for (let b = 0; b < 5; b += 1) {
            dot(ix + hash(b + i) * iw, iy + hash(b * 2 + i) * ih, 1.6, white(0.45));
          }
        }
        ctx.restore();
      }
    }

    // phase 7 — project timeline: path draws, solid nodes then redacted silhouettes
    function layerTimeline(t) {
      const e = env(t, 10.9, 15.0, 0.4, 1.6);
      if (e <= 0.01) return;
      const y = H * 0.5;
      const x0 = W * 0.14;
      const x1 = W * 0.86;
      const draw = segSmooth(t, 11.0, 12.6);
      // path
      line(x0, y, x0 + (x1 - x0) * draw, y, A(0.5 * e), 1.6);
      const n = PROJECT_NODES.length;
      for (let i = 0; i < n; i += 1) {
        const nx = x0 + ((x1 - x0) * i) / (n - 1);
        if (nx > x0 + (x1 - x0) * draw + 6) continue;
        const node = PROJECT_NODES[i];
        const appear = seg(t, 11.0 + i * 0.3, 11.6 + i * 0.3);
        if (node.redacted) {
          // black silhouette with redaction flicker
          const flick = Math.sin(t * 8 + i) > 0.86 ? 0.5 : 0.14;
          ctx.fillStyle = white(flick * appear * e);
          ctx.fillRect(nx - 14, y - 10, 28, 20);
          strokeRect(nx - 14, y - 10, 28, 20, white(0.2 * e));
        } else {
          const pulse = 0.5 + 0.5 * Math.sin(t * 3 + i);
          dot(nx, y, (4 + pulse * 2) * appear, A(0.9 * e));
          ctx.strokeStyle = A(0.4 * e);
          ctx.beginPath();
          ctx.arc(nx, y, 10 * appear, 0, TAU);
          ctx.stroke();
        }
      }
    }

    // phase 8 — panels converge to a central operating surface + radial menu
    function layerConvergence(t) {
      const e = env(t, 12.9, 17.0, 0.4, 1.6);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const conv = segSmooth(t, 13.0, 14.6);
      const count = 9;
      const surfW = Math.min(W * 0.5, 460);
      const surfH = surfW * 0.6;
      for (let i = 0; i < count; i += 1) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const tx = cx - surfW / 2 + (col + 0.5) * (surfW / 3);
        const ty = cy - surfH / 2 + (row + 0.5) * (surfH / 3);
        const a = hash(i) * TAU;
        const sx = cx + Math.cos(a) * Math.max(W, H) * 0.6;
        const sy = cy + Math.sin(a) * Math.max(W, H) * 0.6;
        const x = sx + (tx - sx) * conv;
        const y = sy + (ty - sy) * conv;
        const pw = surfW / 3 - 10;
        const ph = surfH / 3 - 10;
        ctx.save();
        ctx.globalAlpha = e * conv;
        strokeRect(x - pw / 2, y - ph / 2, pw, ph, white(0.22));
        line(x - pw / 2, y - ph / 2 + 6, x - pw / 2 + 12, y - ph / 2 + 6, A(0.7));
        ctx.restore();
      }
      // radial menu flash
      const menu = env(t, 14.2, 15.0, 0.3, 0.4);
      if (menu > 0.01) {
        ctx.strokeStyle = A(0.5 * menu);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, surfW * 0.62, 0, TAU);
        ctx.stroke();
        for (let i = 0; i < 6; i += 1) {
          const a = (TAU * i) / 6 - TAU / 4;
          dot(cx + Math.cos(a) * surfW * 0.62, cy + Math.sin(a) * surfW * 0.62, 3, A(0.8 * menu));
        }
      }
    }

    // phase 9 — full-screen signal wall (audio reactive / procedural idle)
    function layerSignalWall(t) {
      const e = env(t, 14.9, 17.4, 0.4, 0.8);
      if (e <= 0.01) return;
      const audio = getAudio();
      const rise = segSmooth(t, 15.0, 16.0);
      const n = Math.round(48 * qScale);
      const gap = 3;
      const bw = (W - gap * (n - 1)) / n;
      const maxH = H * 0.42 * rise;
      for (let i = 0; i < n; i += 1) {
        const band = audio.active
          ? audio.bands[i % audio.bands.length]
          : 0.12 + (Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5) * 0.5 * (0.5 + 0.5 * Math.sin(i * 0.3 + t));
        const bh = Math.max(2, band * maxH);
        ctx.fillStyle = i % 5 === 0 ? A(0.5 * e) : white(0.28 * e * (0.4 + band));
        ctx.fillRect(i * (bw + gap), H - bh, bw, bh);
        ctx.fillStyle = A(0.7 * e);
        ctx.fillRect(i * (bw + gap), H - bh - 2, bw, 2);
        // mirrored top
        ctx.fillStyle = white(0.1 * e);
        ctx.fillRect(i * (bw + gap), 0, bw, bh * 0.5);
      }
    }

    // phase 10 — compression ring contracts to the identity core
    function layerLock(t) {
      const e = env(t, 16.9, 19.4, 0.3, 0.6);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const contract = segSmooth(t, 17.0, 18.6);
      const R = Math.min(W, H) * 0.5 * (1 - contract);
      ctx.strokeStyle = A(0.6 * e);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, R), 0, TAU);
      ctx.stroke();
      // converging tick marks
      const ticks = 24;
      for (let i = 0; i < ticks; i += 1) {
        const a = (TAU * i) / ticks;
        const r1 = Math.max(4, R);
        const r2 = r1 + 14 * (1 - contract);
        line(
          cx + Math.cos(a) * r1,
          cy + Math.sin(a) * r1,
          cx + Math.cos(a) * r2,
          cy + Math.sin(a) * r2,
          white(0.3 * e)
        );
      }
    }

    // phase 11 — release: a soft particle burst disperses outward
    function layerRelease(t) {
      const e = seg(t, 19.0, 20.0);
      if (e <= 0.01) return;
      const cx = W / 2;
      const cy = H / 2;
      const count = Math.round(80 * qScale);
      const out = segSmooth(t, 19.0, 20.0);
      for (let i = 0; i < count; i += 1) {
        const a = hash(i) * TAU;
        const r = out * Math.max(W, H) * 0.6 * (0.3 + hash(i * 2.1) * 0.7);
        const fade = 1 - out;
        dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.4, i % 6 === 0 ? A(0.7 * fade) : white(0.4 * fade));
      }
    }

    function render(t) {
      const time = Math.min(Math.max(t, 0), TOTAL);
      ctx.clearRect(0, 0, W, H);
      // global release fade so nothing cuts hard at the end
      const globalFade = 1 - seg(time, 19.4, 20) * 0.85;
      ctx.globalAlpha = 1;
      layerGrid(time);
      layerIgnition(time);
      layerFragments(time);
      layerNorth(time);
      layerModules(time);
      layerTimeline(time);
      layerConvergence(time);
      layerSignalWall(time);
      layerLock(time);
      layerRelease(time);
      layerCore(time);
      // dim pass for release
      if (globalFade < 1) {
        ctx.fillStyle = `rgba(2,2,3,${(1 - globalFade) * 0.6})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    apiRef.current = { render, resize, lastT: initialTime, get size() { return { W, H }; } };
    render(initialTime);

    ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        // repaint last frame so a resize mid-pause doesn't blank the canvas
        if (apiRef.current?.lastT != null) render(apiRef.current.lastT);
      });
    });
    ro.observe(canvas);

    return () => {
      if (ro) ro.disconnect();
      cancelAnimationFrame(resizeRaf);
      apiRef.current = null;
    };
  }, [accent, quality, initialTime]);

  useImperativeHandle(ref, () => ({
    render(t) {
      if (apiRef.current) {
        apiRef.current.lastT = t;
        apiRef.current.render(t);
      }
    },
  }), []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default SynthesisCanvas;
