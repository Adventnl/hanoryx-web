import { systemCategories, musebase, architecture } from '../systems';

const DETAIL_ROUTES = {
  'cat-01': '/systems/operational-management',
  'cat-02': '/systems/commerce-infrastructure',
  'cat-03': '/systems/automation',
  'cat-04': '/systems/internal-platforms',
  'cat-05': '/systems/data-interfaces',
  'cat-06': '/systems/client-portals',
  'cat-07': '/systems/research-systems',
};

const page = {
  key: 'systems',
  title: 'Systems',
  accent: '#ff3333',
  hero: {
    scene: 'hex-tunnel',
    eyebrow: 'Systems // SYS.NODE',
    title: 'Systems designed to reduce operational drag.',
    intro:
      'Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals — a set of related software design capabilities.',
    code: 'NODE.SYS',
    status: 'CAPABILITY AREAS',
    actions: [{ label: 'Enter Hanoryx North', to: '/north', variant: 'outline' }],
    metrics: [
      { value: 7, label: 'System categories' },
      { value: 2, label: 'Platforms in development' },
      { value: 3, label: 'Architecture layers' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'orbital-command',
      eyebrow: 'Categories',
      title: 'Seven design areas.',
      intro: 'Explore the workflow and interface questions each category addresses. These are capability descriptions, not a count of deployed products.',
      items: systemCategories.map((c) => ({
        code: c.code,
        title: c.title,
        body: c.summary,
        tags: c.tags,
        status: c.status,
        to: DETAIL_ROUTES[c.id],
      })),
    },
    {
      type: 'feature',
      scene: 'dashboard-tiles',
      eyebrow: 'Featured System',
      code: musebase.code,
      name: musebase.name,
      label: musebase.type,
      status: musebase.status,
      summary: musebase.summary,
      logo: true,
      modules: musebase.modules,
    },
    {
      type: 'split',
      scene: 'isometric-infra',
      eyebrow: architecture.eyebrow,
      code: 'ARCH.STACK',
      title: architecture.title,
      body: [architecture.body],
      asideLabel: 'LAYERS',
      asideCode: 'L.STACK',
      points: architecture.layers.map((l) => ({ k: l.code, v: l.title })),
    },
    {
      type: 'cards',
      scene: 'status-pulse-grid',
      eyebrow: 'Public studies',
      title: 'Experiments you can inspect.',
      intro: 'The site exposes its interface research through working scenes, engineering notes, and public source.',
      items: [
        { code: 'RES.01', title: 'Visual Lab', body: 'Switch among selected Canvas scenes and adjust rendering density.', tags: ['Canvas', 'Interaction'], status: 'PUBLIC', to: '/lab' },
        { code: 'RES.02', title: 'Site engineering', body: 'Inspect how the scene scheduler, motion budget, and route layers fit together.', tags: ['Architecture', 'Motion'], status: 'PUBLIC', to: '/engineering' },
        { code: 'RES.03', title: 'Public repositories', body: 'Browse projects backed by reviewed source descriptions and GitHub metadata.', tags: ['Source', 'Projects'], status: 'PUBLIC', to: '/projects' },
      ],
    },
    { type: 'cta', scene: 'architecture-layer', eyebrow: 'Open a channel', title: 'Discuss a system.' },
  ],
};

export default page;
