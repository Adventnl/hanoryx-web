/* Single global pointer tracker. One listener for the whole app; scenes read
   the shared object each frame (no per-element listeners, no React state).

   Pointer-follow is intentionally DISABLED: scene backgrounds were too buggy
   while tracking the cursor, so the shared pointer is frozen in its neutral
   (centered, inactive) state. Every scene already falls back to a static
   default when `active` is false, so backgrounds simply hold their resting
   position. The designed cursor (HanoryxCursor) tracks the mouse via its own
   listener and is unaffected. To re-enable follow, restore the listeners in
   initPointer(). */

const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false, vx: 0, vy: 0 };

export function initPointer() {
  /* No-op: backgrounds stay put. See file header. */
}

export function getPointer() {
  return pointer;
}
