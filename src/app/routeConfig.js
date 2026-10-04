/* ============================================================
   ROUTE CONFIG — the single source of truth for routes + navigation.

   `navGroups`      drives the radial mega-menu and the mobile menu (primary
                    navigation only — Contact lives in the footer).
   `pageRouteKeys`  every route rendered through the data-driven PageTemplate,
                    keyed into data/pages/*.js (the page's own data file is
                    also what the search index reads).
   `redirects`      retired routes. Old links never land on stale content.
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
      { label: 'Architecture', to: '/north/architecture', code: 'NTH.02' },
      { label: 'Interface Lab', to: '/north/interface-lab', code: 'NTH.03' },
      { label: 'Motion Systems', to: '/north/motion-systems', code: 'NTH.04' },
      { label: 'Tooling', to: '/north/tooling', code: 'NTH.05' },
      { label: 'Site Engineering', to: '/engineering', code: 'ENG.01' },
      { label: 'Visual Lab', to: '/lab', code: 'LAB.01' },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    code: 'WRK',
    to: '/work',
    blurb: 'Selected company work. Two primary projects, two quieter supporting studies.',
    children: [
      { label: 'Overview', to: '/work', code: 'WRK.00' },
      { label: 'Musebase', to: '/work/musebase', code: 'WRK.01' },
      { label: 'YK Engine', to: '/work/yk-engine', code: 'WRK.02' },
      { label: 'Customer Product', to: '/work/customer-product', code: 'WRK.03' },
      { label: 'Internal CRM', to: '/work/internal-crm', code: 'WRK.04' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    code: 'CMP',
    to: '/company',
    blurb: 'Hanoryx Systems — its principles, its security approach, and its chronology.',
    children: [
      { label: 'Overview', to: '/company', code: 'CMP.00' },
      { label: 'Principles', to: '/company/principles', code: 'CMP.01' },
      { label: 'Security', to: '/company/security', code: 'CMP.02' },
      { label: 'Timeline', to: '/company/timeline', code: 'CMP.03' },
      { label: 'Careers', to: '/company/careers', code: 'CMP.04' },
    ],
  },
];

/* Every page rendered through PageTemplate. 'home' resolves to '/'. */
export const pageRouteKeys = [
  'home',
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
  'north/architecture',
  'north/interface-lab',
  'north/motion-systems',
  'north/tooling',
  'engineering',
  'lab',
  'work',
  'work/musebase',
  'work/yk-engine',
  'work/customer-product',
  'work/internal-crm',
  'company',
  'company/principles',
  'company/security',
  'company/timeline',
  'company/careers',
  'contact',
  'sitemap',
  'legal/privacy',
  'legal/terms',
  'legal/cookies',
  'legal/accessibility',
];

export const routePath = (key) => (key === 'home' ? '/' : `/${key}`);

/* Retired routes -> where their visitors belong now. Matched exactly; the
   /projects/:id family is handled by a pattern route in routes.jsx. */
export const redirects = [
  ['/timeline', '/company/timeline'],
  ['/projects', '/work'],
  ['/company/status', '/company'],
  ['/work/commerce-system-i', '/work/customer-product'],
  ['/work/north-console', '/work'],
  ['/work/unknown-system-03', '/work'],
  ['/work/experimental-interface-program', '/lab'],
];

/* Footer / sitemap / search all read the same directory so a page is added once. */
export const directory = [
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'Company', to: '/company' },
      { label: 'Principles', to: '/company/principles' },
      { label: 'Security approach', to: '/company/security' },
      { label: 'Timeline', to: '/company/timeline' },
      { label: 'Careers', to: '/company/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    id: 'work',
    title: 'Work',
    links: [
      { label: 'All work', to: '/work' },
      { label: 'Musebase', to: '/work/musebase' },
      { label: 'YK Engine', to: '/work/yk-engine' },
      { label: 'Customer product', to: '/work/customer-product' },
      { label: 'Internal CRM', to: '/work/internal-crm' },
    ],
  },
  {
    id: 'systems',
    title: 'Systems',
    links: [
      { label: 'Systems overview', to: '/systems' },
      { label: 'Operational management', to: '/systems/operational-management' },
      { label: 'Commerce infrastructure', to: '/systems/commerce-infrastructure' },
      { label: 'Automation', to: '/systems/automation' },
      { label: 'Data interfaces', to: '/systems/data-interfaces' },
      { label: 'Client portals', to: '/systems/client-portals' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { label: 'Development', to: '/north' },
      { label: 'Motion systems', to: '/north/motion-systems' },
      { label: 'Site engineering', to: '/engineering' },
      { label: 'Visual lab', to: '/lab' },
      { label: 'Site map', to: '/sitemap' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Terms', to: '/legal/terms' },
      { label: 'Cookies & storage', to: '/legal/cookies' },
      { label: 'Accessibility', to: '/legal/accessibility' },
    ],
  },
];
