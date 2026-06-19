/* ============================================================
   CATEGORY TRANSITIONS — maps a pathname to a route "category" and a bold,
   short (≈0.6s) full-screen transition preset. One distinct motif per group
   so navigating between sections feels cinematic without a heavy per-nav cost
   (the presets are pure CSS keyframes — GPU transform/clip only).
   ============================================================ */

export function categoryOf(pathname = '/') {
  if (pathname === '/' || pathname === '') return 'home';
  const seg = pathname.split('/').filter(Boolean)[0];
  switch (seg) {
    case 'systems': return 'systems';
    case 'north': return 'north';
    case 'work': return 'work';
    case 'company': return 'company';
    case 'timeline': return 'timeline';
    case 'contact': return 'contact';
    case 'legal': return 'legal';
    default: return 'page';
  }
}

/* className -> the CSS module modifier; label -> HUD tag shown briefly. */
export const TRANSITION_PRESETS = {
  home: { mod: 'home', label: 'SYS.CORE' },
  systems: { mod: 'systems', label: 'SYS.GRID' },
  north: { mod: 'north', label: 'NTH.RAILS' },
  work: { mod: 'work', label: 'WRK.REDACT' },
  company: { mod: 'company', label: 'CMP.PRISM' },
  timeline: { mod: 'timeline', label: 'TIME.DRAW' },
  contact: { mod: 'contact', label: 'CH.SIGNAL' },
  legal: { mod: 'legal', label: 'DOC.OPEN' },
  page: { mod: 'page', label: 'SYS.LOAD' },
};

export function presetFor(pathname) {
  return TRANSITION_PRESETS[categoryOf(pathname)] || TRANSITION_PRESETS.page;
}
