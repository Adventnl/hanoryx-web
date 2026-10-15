/* Camera — the canvas stages' flight path, checked without a browser.
 *
 *   node qa/camera.mjs
 *
 * For every kind of canvas and several specimen counts this checks that the
 * layout gives each specimen a place of its own, that the camera rests exactly
 * on each specimen at close range, that between two specimens it really does
 * pull back and fit both ends on screen, that it is continuous (no jumps), and
 * that the flight goes both ways — left and right, up and down.
 */
import { CARD, LAYOUTS, cameraAt, plan, restScale } from '../src/showcase/stages/camera.js';
import { reporter } from './lib.mjs';

const r = reporter('camera');
const views = [{ w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 1100, h: 700 }];
const counts = [40, 42, 46, 50];

for (const kind of Object.keys(LAYOUTS)) {
  const problems = [];
  for (const n of counts) {
    const plane = plan(kind, n);
    if (plane.pts.length !== n) problems.push(`${n}: ${plane.pts.length} points`);

    // no two cards on the same patch of canvas
    let clash = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const dx = Math.abs(plane.pts[i].x - plane.pts[j].x);
        const dy = Math.abs(plane.pts[i].y - plane.pts[j].y);
        if (dx < CARD.w + 1 && dy < CARD.h + 1) clash += 1;
      }
    }
    if (clash) problems.push(`${n}: ${clash} pairs of cards overlap`);

    // left and right, up and down
    const hops = plane.pts.slice(1).map((p, i) => ({ dx: p.x - plane.pts[i].x, dy: p.y - plane.pts[i].y }));
    const dirs = { left: hops.some((h) => h.dx < -20), right: hops.some((h) => h.dx > 20), up: hops.some((h) => h.dy < -20), down: hops.some((h) => h.dy > 20) };
    if (!Object.values(dirs).every(Boolean)) problems.push(`${n}: the flight only goes ${Object.entries(dirs).filter(([, v]) => v).map(([k]) => k).join('/')}`);

    for (const view of views) {
      const rem = 16;
      const rest = restScale(view, rem);

      // at rest on every specimen, exactly
      for (let i = 0; i < n; i += 1) {
        const c = cameraAt(i, plane, view, rem);
        if (Math.abs(c.x - plane.pts[i].x) > 0.01 || Math.abs(c.y - plane.pts[i].y) > 0.01 || Math.abs(c.s - rest) > 1e-6) { problems.push(`${n} @${view.w}: not at rest on ${i}`); break; }
      }

      // each hop pulls back, fits both ends, and comes back
      let shallow = 0;
      let unfit = 0;
      let jumps = 0;
      let prev = cameraAt(0, plane, view, rem);
      for (let i = 0; i < n - 1; i += 1) {
        let low = Infinity;
        let widest = null;
        for (let k = 1; k <= 200; k += 1) {
          const c = cameraAt(i + k / 200, plane, view, rem);
          if (c.s < low) { low = c.s; widest = c; }
          // continuity: nothing moves further than a hair between 1/200ths of a hop
          const ds = Math.abs(Math.log(c.s / prev.s));
          const dp = Math.hypot(c.x - prev.x, c.y - prev.y);
          if (ds > 0.09 || dp > 7) jumps += 1;
          prev = c;
        }
        if (low > rest * 0.5 + 1e-6) shallow += 1;
        // at the widest point both specimens are inside the screen
        const half = { w: view.w / widest.s / rem / 2, h: view.h / widest.s / rem / 2 };
        const ends = [plane.pts[i], plane.pts[i + 1]];
        if (!ends.every((p) => Math.abs(p.x - widest.x) + CARD.w / 2 <= half.w + 0.5 && Math.abs(p.y - widest.y) + CARD.h / 2 <= half.h + 0.5)) unfit += 1;
      }
      if (shallow) problems.push(`${n} @${view.w}: ${shallow} hops barely pull back`);
      if (unfit) problems.push(`${n} @${view.w}: ${unfit} hops do not fit both ends on screen`);
      if (jumps) problems.push(`${n} @${view.w}: ${jumps} jumps in the flight`);
    }
  }
  r.check(`${kind}: ${counts.join(', ')} specimens each have a place; the camera rests, pulls back, fits both ends and never jumps`, problems.length === 0, problems.slice(0, 3).join(' ; '));
}

r.done();
