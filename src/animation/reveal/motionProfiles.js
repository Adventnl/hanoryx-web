/* ============================================================
   COMPONENT MOTION — shared motion grammar for components (not backgrounds).
   Shared easings and springs for component motion.
   Consumed by KineticText and the UI components; also catalogued in the
   animation inventory.
   ============================================================ */

export const EASE = [0.16, 1, 0.3, 1]; // signature deceleration
export const EASE_SMOOTH = [0.22, 1, 0.36, 1];

export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 320, damping: 30 },
  pop: { type: 'spring', stiffness: 420, damping: 24 },
};
