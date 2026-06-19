/* Single global pointer TARGET. One listener for the whole app; it records the
   raw cursor position (window coords) and whether the pointer is currently over
   the page. Scenes never read this directly — each SceneCanvas keeps its own
   SMOOTHED pointer that eases toward this target in canvas-local space (see
   SceneCanvas.updatePointer). That smoothing is what fixes the old bug: feeding
   raw coordinates straight to scenes made cursor-reactive backgrounds snap, and
   a scene scrolled away then back teleported its influence point to the live
   cursor. With per-canvas easing the rendered value only ever glides.

   The designed cursor (HanoryxCursor) tracks the mouse via its own listener and
   is independent of this. */

const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false };
let started = false;

export function initPointer() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const onMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.active = true;
  };
  // Leaving the document or blurring the window marks the target inactive; each
  // SceneCanvas then eases its effect back to the neutral (centred) resting
  // state rather than freezing at the last position.
  const onLeave = () => { pointer.active = false; };

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);
}

export function getPointer() {
  return pointer;
}
