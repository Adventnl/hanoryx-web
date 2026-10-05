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
  'company/how-we-work',
  'company/hiring',
  'company/faq',
  'company/press',
  'company/brand',
  'insights',
  'insights/idempotency',
  'insights/audit-trails',
  'insights/permissions',
  'insights/runbooks',
  'insights/triggers',
  'insights/api-contracts',
  'insights/handover',
  'insights/animation-budgets',
  'resources',
  'resources/glossary',
  'resources/changelog',
  'resources/downloads',
  'resources/tools',
  'resources/tools/contrast',
  'resources/tools/type-scale',
  'resources/tools/cron',
  'resources/tools/readiness',
  'resources/tools/decision-record',
  'contact',
  'sitemap',
  'trust',
  'trust/status',
  'trust/disclosure',
  'trust/third-parties',
  'trust/licences',
  'legal',
  'legal/privacy',
  'legal/terms',
  'legal/cookies',
  'legal/accessibility',
  'legal/acceptable-use',
  'legal/copyright',
  'legal/disclaimer',
  'legal/retention',
  'legal/complaints',
  'legal/linking',
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


/* ============================================================
   FOOTER — a directory of the whole site, laid out as columns with named
   groups (the way a large company footer is). It is deliberately NOT the
   navigation again: the primary menu carries Work, Systems, Development and
   Company; the footer leads to the rest — the company's practice, the guides,
   the tools, the trust material and the legal documents.

   A link is only drawn if its page exists (the footer filters against
   pageRouteKeys), so the model can be written ahead of the pages.
   ============================================================ */
export const footerColumns = [
  {
    id: 'company',
    title: 'Company',
    groups: [
      {
        heading: 'Hanoryx Systems',
        links: [
          { label: 'How we work', to: '/company/how-we-work' },
          { label: 'Principles', to: '/company/principles' },
          { label: 'Hiring process', to: '/company/hiring' },
          { label: 'Careers', to: '/company/careers' },
          { label: 'Questions & answers', to: '/company/faq' },
        ],
      },
      {
        heading: 'Press & brand',
        links: [
          { label: 'Press & media', to: '/company/press' },
          { label: 'Brand', to: '/company/brand' },
          { label: 'Release notes', to: '/resources/changelog' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    ],
  },
  {
    id: 'insights',
    title: 'Insights',
    groups: [
      {
        heading: 'Guides',
        links: [
          { label: 'All insights', to: '/insights' },
          { label: 'Idempotency in order systems', to: '/insights/idempotency' },
          { label: 'Audit trails that answer questions', to: '/insights/audit-trails' },
          { label: 'Roles, permissions and scopes', to: '/insights/permissions' },
          { label: 'Runbooks people actually use', to: '/insights/runbooks' },
        ],
      },
      {
        heading: 'More guides',
        links: [
          { label: 'Cron, queues and events', to: '/insights/triggers' },
          { label: 'APIs people can integrate against', to: '/insights/api-contracts' },
          { label: 'Designing for handover', to: '/insights/handover' },
          { label: 'Animation budgets', to: '/insights/animation-budgets' },
        ],
      },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    groups: [
      {
        heading: 'Library',
        links: [
          { label: 'Resource centre', to: '/resources' },
          { label: 'Glossary', to: '/resources/glossary' },
          { label: 'Downloads', to: '/resources/downloads' },
          { label: 'Site map', to: '/sitemap' },
        ],
      },
      {
        heading: 'Tools',
        links: [
          { label: 'All tools', to: '/resources/tools' },
          { label: 'Contrast checker', to: '/resources/tools/contrast' },
          { label: 'Type scale', to: '/resources/tools/type-scale' },
          { label: 'Cron explainer', to: '/resources/tools/cron' },
          { label: 'Readiness check', to: '/resources/tools/readiness' },
          { label: 'Decision records', to: '/resources/tools/decision-record' },
        ],
      },
    ],
  },
  {
    id: 'development',
    title: 'Development',
    groups: [
      {
        heading: 'Hanoryx North',
        links: [
          { label: 'Engineering handbook', to: '/north/handbook' },
          { label: 'Design tokens', to: '/north/design-tokens' },
          { label: 'The stack', to: '/north/stack' },
          { label: 'How we check the work', to: '/north/quality' },
          { label: 'Accessible by default', to: '/north/accessibility' },
        ],
      },
      {
        heading: 'Systems reference',
        links: [
          { label: 'Capabilities', to: '/systems/capabilities' },
          { label: 'Integration patterns', to: '/systems/integrations' },
          { label: 'System lifecycle', to: '/systems/lifecycle' },
          { label: 'Work by capability', to: '/work/capabilities' },
        ],
      },
    ],
  },
  {
    id: 'trust',
    title: 'Trust',
    groups: [
      {
        heading: 'Trust centre',
        links: [
          { label: 'Trust centre', to: '/trust' },
          { label: 'Live status', to: '/trust/status' },
          { label: 'Security disclosure', to: '/trust/disclosure' },
          { label: 'Third-party services', to: '/trust/third-parties' },
          { label: 'Licences & notices', to: '/trust/licences' },
          { label: 'Data retention', to: '/legal/retention' },
        ],
      },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    groups: [
      {
        heading: 'Policies',
        links: [
          { label: 'Legal centre', to: '/legal' },
          { label: 'Privacy', to: '/legal/privacy' },
          { label: 'Terms of use', to: '/legal/terms' },
          { label: 'Cookies & storage', to: '/legal/cookies' },
          { label: 'Accessibility', to: '/legal/accessibility' },
        ],
      },
      {
        heading: 'Notices',
        links: [
          { label: 'Acceptable use', to: '/legal/acceptable-use' },
          { label: 'Copyright & marks', to: '/legal/copyright' },
          { label: 'Disclaimers', to: '/legal/disclaimer' },
          { label: 'Feedback & complaints', to: '/legal/complaints' },
          { label: 'Linking to this site', to: '/legal/linking' },
        ],
      },
    ],
  },
];

/* The short row of legal links under the copyright line. */
export const footerLegalRow = [
  { label: 'Privacy', to: '/legal/privacy' },
  { label: 'Terms', to: '/legal/terms' },
  { label: 'Cookies', to: '/legal/cookies' },
  { label: 'Accessibility', to: '/legal/accessibility' },
  { label: 'Security', to: '/trust/disclosure' },
  { label: 'Site map', to: '/sitemap' },
];

/* The sections of the whole site, with the pages that belong to each — used by
   the footer's section row (with live page counts) and nowhere else. */
export const siteSections = [
  { id: 'work', label: 'Work', to: '/work', test: (k) => k === 'work' || k.startsWith('work/') },
  { id: 'systems', label: 'Systems', to: '/systems', test: (k) => k === 'systems' || k.startsWith('systems/') },
  { id: 'development', label: 'Development', to: '/north', test: (k) => k === 'north' || k.startsWith('north/') || k === 'engineering' || k === 'lab' },
  { id: 'company', label: 'Company', to: '/company', test: (k) => k === 'company' || k.startsWith('company/') || k === 'contact' },
  { id: 'insights', label: 'Insights', to: '/insights', test: (k) => k === 'insights' || k.startsWith('insights/') },
  { id: 'resources', label: 'Resources', to: '/resources', test: (k) => k === 'resources' || k.startsWith('resources/') },
  { id: 'trust', label: 'Trust', to: '/trust', test: (k) => k === 'trust' || k.startsWith('trust/') },
  { id: 'legal', label: 'Legal', to: '/legal', test: (k) => k === 'legal' || k.startsWith('legal/') },
];
