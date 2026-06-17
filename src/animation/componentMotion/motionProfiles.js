/* ============================================================
   COMPONENT MOTION — shared motion grammar for components (not backgrounds).
   Canonical easings, springs, durations + reusable `motion` variant objects
   so component entrances/hovers stop being one generic fade-up everywhere.
   Consumed by RevealText and the UI components; also catalogued in the
   animation inventory.
   ============================================================ */

export const EASE = [0.16, 1, 0.3, 1]; // signature deceleration
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];
export const EASE_SMOOTH = [0.22, 1, 0.36, 1];

export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 320, damping: 30 },
  pop: { type: 'spring', stiffness: 420, damping: 24 },
};

export const DUR = { fast: 0.4, base: 0.8, slow: 1.2 };

/* Container/child reveal variants — pass to motion components. Each is a
   visibly different reveal language, not a recoloured fade. */
export const revealVariants = {
  // soft rise + de-blur (the classic, kept for body copy)
  fadeUp: {
    hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: EASE } },
  },
  // clipped mask wipe upward
  maskUp: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.8, ease: EASE } },
  },
  // horizontal scan wipe (line scanner)
  scanX: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.7, ease: EASE } },
  },
  // split on the y-axis from a center line
  splitY: {
    hidden: { opacity: 0, scaleY: 0.2 },
    show: { opacity: 1, scaleY: 1, transition: { duration: 0.7, ease: EASE } },
  },
  // radial pop from a point
  pop: {
    hidden: { opacity: 0, scale: 0.7 },
    show: { opacity: 1, scale: 1, transition: SPRING.pop },
  },
  // slide from the inline-start with a slight skew settle
  slideIn: {
    hidden: { opacity: 0, x: -36 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  },
};

/* Stagger container presets for lists/grids. */
export const staggerContainer = (stagger = 0.07, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const REVEAL_NAMES = Object.keys(revealVariants);
