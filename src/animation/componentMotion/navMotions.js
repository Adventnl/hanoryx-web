/* Navigation motion grammar. The radial mega-menu deploy + selector swing live
   in RadialMegaMenu; the mobile command rail in MobileNav. These constants
   document the catalogue and tune the deploy timing. */
export const NAV_INTENT = { openDelay: 150, closeDelay: 130, fastSweep: 1.1 };

export const megaDeploy = {
  hidden: { opacity: 0, y: -14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.24 } },
};

export const NAV_MOTIONS = [
  'nav-hover-intent',
  'nav-radial-deploy',
  'nav-selector-swing',
  'nav-ring-stroke-draw',
  'nav-node-pop',
  'mobile-command-rail',
];
