/* ============================================================
   CATEGORY TRANSITIONS — maps a pathname to a route "category" and the motif of
   the route current: which way the line travels. One motif per section so
   moving between sections reads as a change of place, at no real cost (the
   current is pure CSS transform + opacity; see TransitionOverlay).
   ============================================================ */

export function categoryOf(pathname = '/') {
  if (pathname === '/' || pathname === '') return 'home';
  const seg = pathname.split('/').filter(Boolean)[0];
  switch (seg) {
    case 'systems': return 'systems';
    case 'north':
    case 'engineering':
    case 'lab': return 'north';
    case 'work': return 'work';
    case 'company': return 'company';
    case 'contact': return 'contact';
    case 'legal': return 'legal';
    default: return 'page';
  }
}

/* mod -> the CSS module modifier (the direction of travel). */
export const TRANSITION_PRESETS = {
  home: { mod: 'home' },        // rises from the bottom
  systems: { mod: 'systems' },  // crosses left to right
  north: { mod: 'north' },      // falls top to bottom
  work: { mod: 'work' },        // crosses right to left
  company: { mod: 'company' },  // opens outward from the middle
  contact: { mod: 'contact' },  // rises from the bottom
  legal: { mod: 'legal' },      // falls top to bottom
  page: { mod: 'page' },
};

export function presetFor(pathname) {
  return TRANSITION_PRESETS[categoryOf(pathname)] || TRANSITION_PRESETS.page;
}

/* The destination, written at the end of the line: "WORK / MUSEBASE". */
export function labelFor(pathname) {
  const parts = pathname.split('/').filter(Boolean).slice(0, 3);
  if (parts.length === 0) return 'HOME';
  const text = parts.join(' / ').replace(/-/g, ' ').toUpperCase();
  return text.length > 34 ? `${text.slice(0, 33)}…` : text;
}
