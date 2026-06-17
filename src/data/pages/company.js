import { company, metrics } from '../company';

const page = {
  key: 'company',
  title: 'Company',
  accent: '#ff3333',
  hero: {
    scene: 'concentric-gate',
    intensity: 'hero',
    eyebrow: 'Company // NODE.HQ',
    title: 'Hanoryx Systems is the system behind the systems.',
    intro:
      'A controlled environment for serious operations — software infrastructure, management platforms, and interface systems held under one design language. This is the node the others run from.',
    code: 'NODE.HQ',
    status: 'ONLINE',
    actions: [
      { label: 'Enter Systems', to: '/systems' },
      { label: 'Hanoryx North', to: '/north', variant: 'outline' },
    ],
    metrics: [
      { value: 3, label: 'Operating nodes' },
      { value: 2, label: 'Platforms in development' },
      { value: 1, label: 'Engineering division' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'topographic-lines',
      eyebrow: company.signal.eyebrow,
      code: 'HQ.SIGNAL',
      title: company.signal.title,
      body: company.signal.body,
      asideLabel: 'IDENTITY',
      asideCode: 'HQ.MAP',
      points: [
        { k: 'NAME', v: company.name },
        { k: 'DIVISION', v: company.division },
        { k: 'STATUS', v: company.status },
        { k: 'NODE', v: company.locationCode },
      ],
    },
    {
      type: 'cards',
      scene: 'hex-lattice',
      eyebrow: 'Topology',
      title: 'Three nodes, one system.',
      intro:
        'The company resolves into three connected surfaces. Systems is what is built, North is who builds it, and Work is the record of what has shipped. Each opens its own node.',
      items: [
        {
          code: 'NODE.SYS',
          label: 'Systems',
          title: 'What the company builds.',
          body: 'Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals — engineered as one operating environment over a hardened core.',
          tags: ['platforms', 'infrastructure', 'interface'],
          status: 'ONLINE',
          to: '/systems',
        },
        {
          code: 'NODE.NORTH',
          label: 'Hanoryx North',
          title: 'The engineering division.',
          body: 'The software development division that designs the architecture, interface systems, orchestration, and tooling everything else stands on. Production-minded, tightly scoped, released deliberately.',
          tags: ['architecture', 'orchestration', 'tooling'],
          status: 'ACTIVE',
          to: '/north',
        },
        {
          code: 'NODE.WRK',
          label: 'Work',
          title: 'The record of what shipped.',
          body: 'A registry of systems built, deployed, or sealed. Cleared entries open to a record; classified entries hold their surface and stay closed behind the gate.',
          tags: ['codex', 'registry', 'record'],
          status: 'OPERATIONAL',
          to: '/work',
        },
      ],
    },
    {
      type: 'stats',
      eyebrow: 'Company Telemetry',
      title: 'The node at a glance.',
      items: metrics.map((m) => ({
        value: m.value,
        suffix: m.suffix,
        label: m.label,
        note: m.note,
      })),
    },
    {
      type: 'cta',
      scene: 'polar-radar',
      eyebrow: 'Open a channel',
      title: 'Reach the node.',
      body: 'For software systems, internal platforms, operational interfaces, and controlled online infrastructure — the conversation starts at the gate.',
    },
  ],
};

export default page;
