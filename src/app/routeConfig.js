/* ============================================================
   ROUTE CONFIG — the single source of truth for routes + navigation.

   `navGroups`      drives the wide mega-menu and the mobile menu (primary
                    navigation only — Contact lives in the footer).
   `pageRouteKeys`  every route rendered through the data-driven PageTemplate,
                    keyed into data/pages/*.js (the page's own data file is
                    also what the search index reads).
   `redirects`      retired routes. Old links never land on stale content.
   ============================================================ */

import { chapters, pagesIn, showcasePages, showcasePath } from '../showcase/pages.js';

/* A menu entry: label, route, a short code, and one line saying what is there. */
const entry = (label, to, code, desc) => ({ label, to, code, desc });

/* The primary menu is a wide panel, not a list: each group has a `lead` (its
   overview, drawn above the rail) and `categories` (the left rail). Picking a
   category fills the right of the panel with its pages, each with a line of
   description. A group with one category has no rail — its panel opens with the
   group's introduction in that place instead. Every entry also appears in the
   flat `children` list (lead first), which the mobile menu, the 404 page's
   suggestions and the tests read. */
const menu = [
  {
    id: 'systems',
    label: 'Systems',
    code: 'SYS',
    to: '/systems',
    blurb: 'Operational platforms, commerce infrastructure, automation, and interfaces.',
    lead: entry('Overview', '/systems', 'SYS.00', 'The design areas Hanoryx builds in, side by side.'),
    categories: [
      {
        id: 'areas',
        code: '01',
        label: 'Design areas',
        blurb: 'Where the company designs and builds.',
        items: [
          entry('Operational Management', '/systems/operational-management', 'SYS.01', 'Scheduling, communication, records and role coordination.'),
          entry('Commerce Infrastructure', '/systems/commerce-infrastructure', 'SYS.02', 'Transactions, catalogue logic and payments as one connected model.'),
          entry('Automation', '/systems/automation', 'SYS.03', 'Explicit triggers, guarded conditions and inspectable actions.'),
        ],
      },
      {
        id: 'surfaces',
        code: '02',
        label: 'Platforms & interfaces',
        blurb: 'What people use to work inside a system.',
        items: [
          entry('Internal Platforms', '/systems/internal-platforms', 'SYS.04', 'Dashboards, administrative controls and workflow actions.'),
          entry('Data Interfaces', '/systems/data-interfaces', 'SYS.05', 'Scoped views and status surfaces for complex records.'),
          entry('Client Portals', '/systems/client-portals', 'SYS.06', 'Role-aware access to records and workflows.'),
          entry('Research Systems', '/systems/research-systems', 'SYS.07', 'Canvas, motion and performance studies you can inspect.'),
        ],
      },
    ],
  },
  {
    id: 'north',
    label: 'Development',
    code: 'DEV',
    to: '/north',
    blurb: 'Hanoryx North — our development team. Architecture, interface, motion, tooling.',
    lead: entry('Overview', '/north', 'NTH.00', 'The team behind the systems, and how it works.'),
    categories: [
      {
        id: 'north',
        code: '01',
        label: 'Hanoryx North',
        blurb: 'The development team and its disciplines.',
        items: [
          entry('Engineering', '/north/engineering', 'NTH.01', 'Durable platforms: architecture, reliability and modular design.'),
          entry('Architecture', '/north/architecture', 'NTH.02', 'Shaping a system from the data core outward.'),
          entry('Interface Lab', '/north/interface-lab', 'NTH.03', 'This site as the specimen: navigation, search, components, scenes.'),
          entry('Motion Systems', '/north/motion-systems', 'NTH.04', 'The easing, cadence and budget behind every movement.'),
          entry('Tooling', '/north/tooling', 'NTH.05', 'The linter, bundler, smoke harness and browser checks.'),
        ],
      },
      {
        id: 'kit',
        code: '02',
        label: 'Kit & site',
        blurb: 'What the site itself is built from.',
        items: [
          entry('Components', '/north/components', 'KIT.00', 'The interface kit: fields, navigation, feedback, data, overlays, layout.'),
          entry('Site Engineering', '/engineering', 'ENG.01', 'Scene registry, shared scheduler, quality budget and code splitting.'),
          entry('Visual Lab', '/lab', 'LAB.01', 'Selected Canvas studies with density and still-frame controls.'),
        ],
      },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    code: 'WRK',
    to: '/work',
    blurb: 'Selected company work. Two primary projects, two quieter supporting studies.',
    lead: entry('Overview', '/work', 'WRK.00', 'Two primary projects and two quieter supporting studies.'),
    categories: [
      {
        id: 'selected',
        code: '01',
        label: 'Selected work',
        blurb: 'Described plainly, without client names, dates or figures we cannot stand behind.',
        items: [
          entry('Musebase', '/work/musebase', 'WRK.01', 'A coordination application: scheduling, communication and records.'),
          entry('YK Engine', '/work/yk-engine', 'WRK.02', 'A proprietary 2D engine with an editor, a player and export tooling.'),
          entry('Customer Product', '/work/customer-product', 'WRK.03', 'A customer-facing product built around the transaction experience.'),
          entry('Internal CRM', '/work/internal-crm', 'WRK.04', 'An internal data system designed to stay usable at very large scale.'),
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    code: 'CMP',
    to: '/company',
    blurb: 'Hanoryx Systems — its principles, its security approach, and its chronology.',
    lead: entry('Overview', '/company', 'CMP.00', 'Hanoryx Systems, and Hanoryx North as its development team.'),
    categories: [
      {
        id: 'company',
        code: '01',
        label: 'Hanoryx Systems',
        blurb: 'How the company thinks, protects and grows.',
        items: [
          entry('Principles', '/company/principles', 'CMP.01', 'Six short rules, and what each one changes in practice.'),
          entry('Security', '/company/security', 'CMP.02', 'How security shapes system design. An approach, not a certification.'),
          entry('Timeline', '/company/timeline', 'CMP.03', 'Undated phases of the work, in the order they are told.'),
          entry('Careers', '/company/careers', 'CMP.04', 'The kinds of work we do, for anyone who would like to introduce themselves.'),
        ],
      },
    ],
  },
  {
    id: 'showcase',
    label: 'Showcase',
    code: 'SHW',
    to: '/showcase',
    badge: 'New',
    blurb: `${showcasePages.length} scroll-driven pages of components for their own sake. Nothing to read, a great deal to touch.`,
    lead: entry('All pages', '/showcase', 'SHW.00', `The index: every one of the ${showcasePages.length} pages, with how each one moves.`),
    categories: chapters.map((c) => ({
      id: c.id,
      code: c.code,
      label: c.title,
      blurb: c.blurb,
      items: pagesIn(c.id).map((p) => entry(p.title, showcasePath(p.slug), `SHW.${String(showcasePages.indexOf(p) + 1).padStart(2, '0')}`, p.blurb)),
    })),
  },
];

export const navGroups = menu.map((g) => ({ ...g, children: [g.lead, ...g.categories.flatMap((c) => c.items)] }));

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
  'systems/capabilities',
  'systems/integrations',
  'systems/lifecycle',
  'north',
  'north/engineering',
  'north/architecture',
  'north/interface-lab',
  'north/motion-systems',
  'north/tooling',
  'north/handbook',
  'north/design-tokens',
  'north/stack',
  'north/quality',
  'north/accessibility',
  'north/components',
  'north/components/inputs',
  'north/components/navigation',
  'north/components/feedback',
  'north/components/data',
  'north/components/overlays',
  'north/components/content',
  'north/blocks',
  'engineering',
  'lab',
  'work',
  'work/musebase',
  'work/yk-engine',
  'work/customer-product',
  'work/internal-crm',
  'work/how-to-read',
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

/* The showcase is its own family of routes: an index and one page per entry in
   showcase/pages.js. They are not rendered through PageTemplate (each is a
   scroll-driven stage), so they have no data file; `allRouteKeys` is every page
   of the site, which the sitemap, the footer's counts and the tests use. */
export const showcaseRouteKeys = ['showcase', ...showcasePages.map((p) => `showcase/${p.slug}`)];
export const allRouteKeys = [...pageRouteKeys, ...showcaseRouteKeys];

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
        heading: 'Interface kit',
        links: [
          { label: 'All components', to: '/north/components' },
          { label: 'Inputs', to: '/north/components/inputs' },
          { label: 'Navigation', to: '/north/components/navigation' },
          { label: 'Feedback', to: '/north/components/feedback' },
          { label: 'Data display', to: '/north/components/data' },
          { label: 'Overlays', to: '/north/components/overlays' },
          { label: 'Content and layout', to: '/north/components/content' },
          { label: 'Page blocks', to: '/north/blocks' },
        ],
      },
      {
        heading: 'Reference',
        links: [
          { label: 'Capabilities', to: '/systems/capabilities' },
          { label: 'Integration patterns', to: '/systems/integrations' },
          { label: 'System lifecycle', to: '/systems/lifecycle' },
          { label: 'How to read the work', to: '/work/how-to-read' },
        ],
      },
      {
        heading: 'Showcase',
        links: [
          { label: 'All showcase pages', to: '/showcase' },
          { label: 'Switchboard', to: '/showcase/switchboard' },
          { label: 'Gauges', to: '/showcase/gauges' },
          { label: 'Kinetic type', to: '/showcase/kinetic' },
          { label: 'Tilt cards', to: '/showcase/tilt' },
          { label: 'Loaders', to: '/showcase/loaders' },
          { label: 'Handset screens', to: '/showcase/handset' },
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
  { id: 'showcase', label: 'Showcase', to: '/showcase', test: (k) => k === 'showcase' || k.startsWith('showcase/') },
  { id: 'insights', label: 'Insights', to: '/insights', test: (k) => k === 'insights' || k.startsWith('insights/') },
  { id: 'resources', label: 'Resources', to: '/resources', test: (k) => k === 'resources' || k.startsWith('resources/') },
  { id: 'trust', label: 'Trust', to: '/trust', test: (k) => k === 'trust' || k.startsWith('trust/') },
  { id: 'legal', label: 'Legal', to: '/legal', test: (k) => k === 'legal' || k.startsWith('legal/') },
];

/* Everything the menus and the footer link to, flat and de-duplicated: what the
   404 page ranks by spelling to suggest the nearest real pages. Derived, so a
   page added to the menu or the footer is suggested without a third list. */
export const directory = (() => {
  const seen = new Map();
  const add = (group, label, to) => { if (!seen.has(to)) seen.set(to, { group, label, to }); };
  navGroups.forEach((g) => g.children.forEach((c) => add(g.label, c.label === 'Overview' ? g.label : c.label, c.to)));
  footerColumns.forEach((col) => col.groups.forEach((gr) => gr.links.forEach((l) => add(col.title, l.label, l.to))));
  return [...seen.values()];
})();
