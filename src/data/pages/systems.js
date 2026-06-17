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
    scene: 'hex-lattice',
    eyebrow: 'Systems // SYS.NODE',
    title: 'Systems built to reduce operational drag.',
    intro:
      'Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals — engineered as one operating environment.',
    code: 'NODE.SYS',
    status: 'ONLINE',
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
      scene: 'circuit-trace',
      eyebrow: 'Categories',
      title: 'Seven operating surfaces.',
      intro: 'Each category is a controlled surface over the same hardened core.',
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
      scene: 'orbital-node',
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
      scene: 'topographic-lines',
      eyebrow: architecture.eyebrow,
      code: 'ARCH.STACK',
      title: architecture.title,
      body: [architecture.body],
      asideLabel: 'LAYERS',
      asideCode: 'L.STACK',
      points: architecture.layers.map((l) => ({ k: l.code, v: l.title })),
    },
    {
      type: 'redacted',
      scene: 'redaction-matrix',
      eyebrow: 'Research',
      title: 'Experimental online systems.',
      intro: 'Early-stage interface programs and research nodes. Detail is intentionally withheld.',
      items: [
        { code: 'RES.01', label: 'Experimental interface program', note: 'Surface withheld' },
        { code: 'RES.02', label: 'Unknown online system', note: 'Access scoped' },
        { code: 'RES.03', label: 'Redacted research node', note: 'Under review' },
      ],
    },
    { type: 'cta', scene: 'polar-radar', eyebrow: 'Open a channel', title: 'Discuss a system.' },
  ],
};

export default page;
