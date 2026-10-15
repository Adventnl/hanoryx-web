/* ============================================================
   CAMERA — the maths behind the canvas stages. Pure: no DOM, no React, so it
   runs in Node (qa/camera.mjs) as well as in the page.

   A canvas stage lays the specimens out on a big flat plane and flies a camera
   between them as the page scrolls. For each pair of neighbours the flight has
   three beats, so it feels like being pulled out of one place and dropped into
   the next, not like a column sliding past:

       hold      the camera rests on specimen i, close and usable
       travel    it pulls back until both ends of the hop fit on screen, swings
                 across (left, right, up or down — wherever the next one is),
                 then falls back in
       hold      it rests on specimen i + 1

   Everything is in rem, so a canvas scales with the visitor's type size. The
   camera is { x, y, s, roll, bell }: where it looks, how big things are drawn,
   how far it banks into the turn (degrees), and how far through the zoom-out
   it is (0 at rest, 1 at the widest point) for the parts of the page that
   fade in only while the canvas is seen from a height.
   ============================================================ */

/** The room one specimen takes on the canvas (rem). Its card is a little narrower. */
export const CARD = { w: 32, h: 22 };

/** How much of each hop is spent at rest at either end. */
export const HOLD = 0.22;

/** Never pull back further than this, however far apart two specimens are. */
const MIN_SCALE = 0.11;

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const r2 = (v) => Math.round(v * 100) / 100;

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cell number d along a Hilbert curve on a side × side board (side a power of two). */
function hilbert(side, d) {
  let x = 0;
  let y = 0;
  let t = d;
  for (let s = 1; s < side; s *= 2) {
    const rx = 1 & (t >> 1);
    const ry = 1 & (t ^ rx);
    if (ry === 0) {
      if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
      [x, y] = [y, x];
    }
    x += s * rx;
    y += s * ry;
    t >>= 2;
  }
  return [x, y];
}

/* ---- layouts: where the specimens sit. Each returns points (rem) and, for
   every hop, how much deeper than usual the camera should pull back. ---- */

/* A fractal wander: the specimens follow a Hilbert curve across a board, so the
   camera keeps doubling back and heading off the other way — left, down, right,
   up — but never loses the thread. */
function wander(n) {
  const order = n <= 64 ? 3 : 4;
  const side = 1 << order;
  const cells = side * side;
  const jitter = seeded(11);
  const pts = Array.from({ length: n }, (_, i) => {
    const d = n < 2 ? 0 : Math.round((i * (cells - 1)) / (n - 1));
    const [cx, cy] = hilbert(side, d);
    return { x: (cx - (side - 1) / 2) * 50 + (jitter() - 0.5) * 8, y: (cy - (side - 1) / 2) * 36 + (jitter() - 0.5) * 6 };
  });
  return { pts, deep: pts.map(() => 1) };
}

/* An atlas: one sheet, in rows, read like a snake. At the end of every row the
   camera pulls right out to show the whole sheet before it dives into the next.
   Neighbours sit a touch high and low in turn, so the way along a row rises and falls. */
function atlas(n) {
  const cols = 7;
  const rows = Math.ceil(n / cols);
  const pts = Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const c = i % cols;
    const col = row % 2 ? cols - 1 - c : c;
    // alternate columns ride a little high and low, so a row climbs and falls as it goes
    return { x: (col - (cols - 1) / 2) * 46, y: (row - (rows - 1) / 2) * 33 + (col % 2 ? -13 : 13) };
  });
  return { pts, deep: pts.map((_, i) => ((i + 1) % cols === 0 ? 0.5 : 1)) };
}

/* A spiral: the specimens wind outward, an even arc apart, and the camera follows
   them round, swinging through every direction on the way. */
function spiral(n) {
  const arc = 50;
  const gap = 50;
  const b = gap / (2 * Math.PI);
  let theta = -Math.PI * 0.62;
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const r = 46 + b * (theta + Math.PI * 0.62);
    pts.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r * 0.74 });
    theta += arc / r;
  }
  return { pts, deep: pts.map((_, i) => (i % 8 === 7 ? 0.62 : 1)) };
}

export const LAYOUTS = { canvas: wander, atlas, spiral };

/** The plan for n specimens on a canvas of the given kind. */
export function plan(kind, n) {
  const made = (LAYOUTS[kind] || wander)(n);
  const xs = made.pts.map((p) => p.x);
  const ys = made.pts.map((p) => p.y);
  const bounds = { minX: Math.min(...xs) - CARD.w / 2, maxX: Math.max(...xs) + CARD.w / 2, minY: Math.min(...ys) - CARD.h / 2, maxY: Math.max(...ys) + CARD.h / 2 };
  // centre the plan on the origin, so the world has an obvious middle
  const mx = (bounds.minX + bounds.maxX) / 2;
  const my = (bounds.minY + bounds.maxY) / 2;
  const pts = made.pts.map((p) => ({ x: r2(p.x - mx), y: r2(p.y - my) }));
  const w = bounds.maxX - bounds.minX;
  const h = bounds.maxY - bounds.minY;
  return { pts, deep: made.deep, w: r2(w), h: r2(h), minX: r2(-w / 2), minY: r2(-h / 2) };
}

/* ---- the camera ---- */

/** How big things are drawn when the camera is at rest: as large as the screen allows, within reason. */
export function restScale(view, rem) {
  return clamp(Math.min(view.w / (CARD.w * 1.1 * rem), view.h / (CARD.h * 1.75 * rem)), 0.8, 1.6);
}

/** The scale at which both ends of a hop (and a margin) fit on the screen. */
function fitScale(a, b, view, rem) {
  const ex = Math.abs(b.x - a.x) + CARD.w + 10;
  const ey = Math.abs(b.y - a.y) + CARD.h + 10;
  return 0.9 * Math.min(view.w / (ex * rem), view.h / (ey * rem));
}

/**
 * Where the camera is when the page is `f` specimens in (0 … n - 1, fractions
 * between). `view` is the screen in px, `rem` the size of a rem in px.
 */
export function cameraAt(f, plane, view, rem) {
  const { pts, deep } = plane;
  const rest = restScale(view, rem);
  if (pts.length < 2) return { x: pts[0]?.x ?? 0, y: pts[0]?.y ?? 0, s: rest, roll: 0, bell: 0 };

  const at = clamp(f, 0, pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(at));
  const a = pts[i];
  const b = pts[i + 1];
  const t = clamp((at - i - HOLD) / (1 - 2 * HOLD));

  const move = smoother(t);
  const bell = Math.sin(Math.PI * t) ** 0.8;
  const low = Math.max(MIN_SCALE, Math.min(fitScale(a, b, view, rem), rest * 0.42) * (deep[i] ?? 1));
  const s = rest * (low / rest) ** bell;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lean = dx / (Math.abs(dx) + Math.abs(dy) + 1);
  return { x: a.x + dx * move, y: a.y + dy * move, s, roll: -lean * 2.4 * bell, bell };
}

/** Which specimen the camera is nearest to. */
export function nearest(f, count) {
  return clamp(Math.round(f), 0, Math.max(0, count - 1));
}
