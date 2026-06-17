/* Button motion grammar. Magnetic pull lives in MagneticButton; border-draw,
   glow-crawl, ripple and press-compression are CSS (Button.module.css). These
   constants document the catalogue + tune the magnetic pull. */
export const MAGNET = { strength: 0.32, max: 10, ease: 0.18 };

export const buttonPress = {
  rest: { scale: 1 },
  press: { scale: 0.96, transition: { duration: 0.12 } },
};

export const BUTTON_MOTIONS = [
  'btn-magnetic',
  'btn-border-draw',
  'btn-glow-crawl',
  'btn-ripple',
  'btn-press',
  'btn-arrow-morph',
];
