/* Pure-math proof of the hex-tunnel loop seam (no browser).
   For a representative VISIBLE ring, show: OLD code makes its depth snap while
   it's still visible (alpha>0) every flow period; NEW code makes depth fully
   continuous and only wraps where alpha == 0. */
const rings = 18;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---- OLD ----
function oldRing(i, t) {
  const flow = (t * 0.32) % 1;
  const d = ((i + flow) % rings) / rings;
  const near = clamp((d - 0.85) / 0.15, 0, 1);
  const far = clamp(d / 0.12, 0, 1);
  const alpha = far * (1 - near * 0.9);
  return { d, alpha };
}
// ---- NEW ----
function newRing(i, t) {
  const ph = (t * 0.07 + i / rings) % 1;
  const near = clamp((ph - 0.82) / 0.18, 0, 1);
  const far = clamp(ph / 0.12, 0, 1);
  const alpha = far * (1 - near);
  return { d: ph, alpha };
}

function analyze(name, fn) {
  const dt = 1 / 60; // 60fps
  let maxVisibleJump = 0, jumpAt = 0, jumpAlpha = 0;
  let dMin = 1, dMax = 0;
  const i = 9; // a mid-tunnel ring
  let prev = fn(i, 0);
  for (let t = dt; t < 30; t += dt) {
    const cur = fn(i, t);
    dMin = Math.min(dMin, cur.d); dMax = Math.max(dMax, cur.d);
    const jump = Math.abs(cur.d - prev.d);
    // a "visible snap" = a depth discontinuity while the ring is still visible
    if (jump > 0.02 && Math.min(cur.alpha, prev.alpha) > 0.02 && jump > maxVisibleJump) {
      maxVisibleJump = jump; jumpAt = t; jumpAlpha = Math.min(cur.alpha, prev.alpha);
    }
    prev = cur;
  }
  console.log(`${name}: ring#${i} depth range=[${dMin.toFixed(3)}..${dMax.toFixed(3)}] (traversal=${((dMax - dMin) * 100).toFixed(0)}% of tunnel)`);
  console.log(`        worst VISIBLE depth-snap=${maxVisibleJump.toFixed(3)} at t=${jumpAt.toFixed(2)}s while alpha=${jumpAlpha.toFixed(3)}`);
  console.log(`        -> ${maxVisibleJump > 0.02 ? 'SEAM: a visible ring teleports' : 'SEAMLESS: no visible discontinuity'}`);
}

analyze('OLD', oldRing);
analyze('NEW', newRing);
