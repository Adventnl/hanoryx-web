/* Single global pointer tracker. One listener for the whole app; scenes read
   the shared object each frame (no per-element listeners, no React state). */

const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false, vx: 0, vy: 0 };
let inited = false;

export function initPointer() {
  if (inited || typeof window === 'undefined') return;
  inited = true;

  let lastX = 0;
  let lastY = 0;

  const onMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    pointer.vx = x - lastX;
    pointer.vy = y - lastY;
    lastX = x;
    lastY = y;
    pointer.x = x;
    pointer.y = y;
    pointer.nx = (x / window.innerWidth) * 2 - 1;
    pointer.ny = (y / window.innerHeight) * 2 - 1;
    pointer.active = true;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  const onTouch = (e) => {
    const t = e.touches[0];
    if (t) onMove({ clientX: t.clientX, clientY: t.clientY });
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('mouseout', onLeave, { passive: true });
}

export function getPointer() {
  return pointer;
}
