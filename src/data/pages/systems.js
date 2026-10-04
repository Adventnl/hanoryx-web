import { systemCategories } from '../systems';

const GLYPH = {
  'cat-01': 'calendar',
  'cat-02': 'cart',
  'cat-03': 'loop',
  'cat-04': 'terminal',
  'cat-05': 'database',
  'cat-06': 'gate',
  'cat-07': 'lens',
};
const ROUTE = {
  'cat-01': '/systems/operational-management',
  'cat-02': '/systems/commerce-infrastructure',
  'cat-03': '/systems/automation',
  'cat-04': '/systems/internal-platforms',
  'cat-05': '/systems/data-interfaces',
  'cat-06': '/systems/client-portals',
  'cat-07': '/systems/research-systems',
};
const SHORT = {
  'cat-01': 'Ops',
  'cat-02': 'Orders',
  'cat-03': 'Auto',
  'cat-04': 'Console',
  'cat-05': 'Data',
  'cat-06': 'Portals',
  'cat-07': 'Lab',
};

const areas = systemCategories.map((c) => ({
  id: c.id,
  code: c.code,
  title: c.title,
  summary: c.summary,
  tags: c.tags,
  glyph: GLYPH[c.id],
  to: ROUTE[c.id],
}));

const page = {
  key: 'systems',
  title: 'Systems',
  accent: '#ff3333',
  aliases: ['capabilities', 'what we build', 'platforms', 'areas', 'design areas'],
  hero: {
    scene: 'hex-lattice',
    intensity: 'hero',
    eyebrow: 'Systems / Overview',
    title: 'Seven areas where we build.',
    intro:
      'Management layers, commerce infrastructure, automation, dashboards, data interfaces, client-facing portals and research — described as design areas, not as a count of deployed products.',
    code: 'SYS.00',
    status: 'DESIGN AREAS',
    actions: [
      { label: 'Selected work', to: '/work' },
      { label: 'Development team', to: '/north', variant: 'outline' },
    ],
    aside: {
      kind: 'systemMap',
      nodes: areas.map((a) => ({ ...a, short: SHORT[a.id] })),
      links: [
        ['cat-01', 'cat-06'],
        ['cat-01', 'cat-03'],
        ['cat-01', 'cat-02'],
        ['cat-01', 'cat-04'],
        ['cat-04', 'cat-05'],
        ['cat-03', 'cat-05'],
        ['cat-02', 'cat-05'],
        ['cat-06', 'cat-05'],
        ['cat-07', 'cat-04'],
      ],
      core: { title: 'Shared core', line: 'Records · Roles' },
      caption: 'Which areas lean on which — a design model, not a diagram of deployed software.',
    },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'systemIndex',
      anchor: 'areas',
      railLabel: 'The seven areas',
      scene: 'architectural-grid',
      minHeight: 640,
      eyebrow: 'The seven areas',
      title: 'Where the work sits.',
      intro: 'Move across the rows — a preview follows the cursor. On a touch screen every row shows its own summary.',
      items: areas,
    },
    {
      type: 'signature',
      kind: 'needsFinder',
      anchor: 'start',
      railLabel: 'Where to start',
      scene: 'privacy-quiet-grid',
      minHeight: 560,
      eyebrow: 'Where to start',
      title: 'What are you trying to do?',
      intro: 'Pick the closest description and the matching area lights up.',
      needs: [
        {
          id: 'coordinate',
          label: 'Coordinate people, time and information',
          area: 'cat-01',
          why: 'An operating layer brings scheduling, communication and records into one shared picture, with access scoped to each role.',
        },
        {
          id: 'orders',
          label: 'Take orders and payments',
          area: 'cat-02',
          why: 'Commerce infrastructure treats the catalog, orders and payments as one connected model, so a checkout is the visible edge of a settlement path.',
        },
        {
          id: 'repeat',
          label: 'Remove repeated manual steps',
          area: 'cat-03',
          why: 'Automation turns a repeated sequence into an explicit rule: a trigger, a guard, an action and a record of the run.',
        },
        {
          id: 'see',
          label: 'See what is happening across an operation',
          area: 'cat-04',
          why: 'An internal platform joins dashboards, controls and exceptions, so an operator can read the state and act on it.',
        },
        {
          id: 'records',
          label: 'Make complex records easy to read',
          area: 'cat-05',
          why: 'Data interfaces give complicated records readable, queryable surfaces, each with a named source, an owner and an access rule.',
        },
        {
          id: 'access',
          label: 'Give customers or partners controlled access',
          area: 'cat-06',
          why: 'A client-facing portal shows each visitor a narrow, role-aware view without exposing the operation behind it.',
        },
        {
          id: 'explore',
          label: 'Explore an interface or motion idea',
          area: 'cat-07',
          why: 'Research systems are working studies on this very site — canvas, motion and performance — open to inspect.',
        },
      ],
      areas,
    },
    {
      type: 'cta',
      scene: 'status-pulse-grid',
      eyebrow: 'Next',
      title: 'Bring a system to talk through.',
      body: 'Start with the operation, the people and the records involved.',
      links: [{ label: 'Selected work', to: '/work' }],
    },
  ],
};

export default page;
