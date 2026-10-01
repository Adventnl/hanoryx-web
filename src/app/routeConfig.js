/* ============================================================
   ROUTE CONFIG — the single source of truth for routes + navigation.
   `navGroups` drives the radial mega-menu (categories + sub-routes).
   `pageRoutes` is the flat list the router maps to pages.
   Deep pages render through the data-driven PageTemplate (data/pages.js);
   a few routes use bespoke page components.
   ============================================================ */

export const navGroups = [
  {
    id: 'systems',
    label: 'Systems',
    code: 'SYS',
    to: '/systems',
    blurb: 'Operational platforms, commerce infrastructure, automation, and interfaces.',
    children: [
      { label: 'Overview', to: '/systems', code: 'SYS.00' },
      { label: 'Operational Management', to: '/systems/operational-management', code: 'SYS.01' },
      { label: 'Commerce Infrastructure', to: '/systems/commerce-infrastructure', code: 'SYS.02' },
      { label: 'Automation', to: '/systems/automation', code: 'SYS.03' },
      { label: 'Internal Platforms', to: '/systems/internal-platforms', code: 'SYS.04' },
      { label: 'Data Interfaces', to: '/systems/data-interfaces', code: 'SYS.05' },
      { label: 'Client Portals', to: '/systems/client-portals', code: 'SYS.06' },
      { label: 'Research Systems', to: '/systems/research-systems', code: 'SYS.07' },
    ],
  },
  {
    id: 'north',
    label: 'Development',
    code: 'DEV',
    to: '/north',
    blurb: 'Hanoryx North — our development team. Architecture, interface, motion, tooling.',
    children: [
      { label: 'Overview', to: '/north', code: 'NTH.00' },
      { label: 'Engineering', to: '/north/engineering', code: 'NTH.01' },
      { label: 'Engineering / Site', to: '/engineering', code: 'ENG.01' },
      { label: 'Visual Lab', to: '/lab', code: 'LAB.01' },
      { label: 'Interface Lab', to: '/north/interface-lab', code: 'NTH.02' },
      { label: 'Motion Systems', to: '/north/motion-systems', code: 'NTH.03' },
      { label: 'Architecture', to: '/north/architecture', code: 'NTH.04' },
      { label: 'Tooling', to: '/north/tooling', code: 'NTH.05' },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    code: 'WRK',
    to: '/work',
    blurb: 'Public repositories and selected system work.',
    children: [
      { label: 'Overview', to: '/work', code: 'WRK.00' },
      { label: 'Public repositories', to: '/projects', code: 'GH.00' },
      { label: 'Musebase', to: '/work/musebase', code: 'WRK.02' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    code: 'CMP',
    to: '/company',
    blurb: 'Hanoryx Systems, its principles, and public development.',
    children: [
      { label: 'Overview', to: '/company', code: 'CMP.00' },
      { label: 'Principles', to: '/company/principles', code: 'CMP.01' },
      { label: 'Security', to: '/company/security', code: 'CMP.02' },
      { label: 'Public Development', to: '/company/status', code: 'CMP.03' },
    ],
  },
  {
    id: 'timeline',
    label: 'Timeline',
    code: 'TIME',
    to: '/timeline',
    blurb: 'A chronology of public repositories.',
    children: [{ label: 'Public Timeline', to: '/timeline', code: 'TIME.00' }],
  },
  {
    id: 'contact',
    label: 'Contact',
    code: 'CH',
    to: '/contact',
    blurb: 'Open a channel.',
    children: [{ label: 'Contact', to: '/contact', code: 'CH.00' }],
  },
];

/* Routes that render through the data-driven PageTemplate, keyed into
   data/pages.js. Bespoke routes (home, contact, timeline, 404, musebase)
   are wired directly in routes.jsx. */
export const templateRouteKeys = [
  'systems',
  'systems/operational-management',
  'systems/commerce-infrastructure',
  'systems/automation',
  'systems/internal-platforms',
  'systems/data-interfaces',
  'systems/client-portals',
  'systems/research-systems',
  'north',
  'north/engineering',
  'north/interface-lab',
  'north/motion-systems',
  'north/architecture',
  'north/tooling',
  'work',
  'work/commerce-system-i',
  'work/musebase',
  'work/north-console',
  'work/unknown-system-03',
  'work/experimental-interface-program',
  'company',
  'company/principles',
  'company/security',
  'company/status',
  'legal/privacy',
  'legal/terms',
];
