import { company } from '../company';
import { publicMetrics } from '../publicMetrics';

const page = {
  key: 'company',
  title: 'Company',
  accent: '#ff3333',
  hero: {
    scene: 'orbital-command',
    intensity: 'hero',
    eyebrow: 'Company / Hanoryx Systems',
    title: 'Software systems, built with intent.',
    intro:
      'Hanoryx Systems builds platforms and interfaces. Hanoryx North is its engineering identity; this site and the linked public repositories show part of the work.',
    code: 'HANORYX',
    status: 'SOFTWARE ENGINEERING',
    metricsSource: 'github-public',
    actions: [
      { label: 'Enter Systems', to: '/systems' },
      { label: 'Public projects', to: '/projects', variant: 'outline' },
    ],
    metrics: [
      ...publicMetrics.map(({ value, label }) => ({ value, label })),
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'architecture-layer',
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
        { k: 'PUBLIC WORK', v: 'Curated GitHub repositories' },
      ],
    },
    {
      type: 'cards',
      scene: 'topology-pulse',
      eyebrow: 'Explore Hanoryx',
      title: 'Three ways into the work.',
      intro:
        'Explore software capabilities, engineering practice, and public source. Each view answers a different question.',
      items: [
        {
          code: 'NODE.SYS',
          label: 'Systems',
          title: 'What the company builds.',
          body: 'Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals — engineered as one operating environment over a hardened core.',
          tags: ['platforms', 'infrastructure', 'interface'],
          status: 'CAPABILITIES',
          to: '/systems',
        },
        {
          code: 'NODE.NORTH',
          label: 'Hanoryx North',
          title: 'The engineering division.',
          body: 'The software development division that designs the architecture, interface systems, orchestration, and tooling everything else stands on. Production-minded, tightly scoped, released deliberately.',
          tags: ['architecture', 'orchestration', 'tooling'],
          status: 'ENGINEERING',
          to: '/north',
        },
        {
          code: 'NODE.WRK',
          label: 'Work',
          title: 'Public work and source.',
          body: 'A curated record of public repositories, implementation languages, and development dates.',
          tags: ['repositories', 'projects', 'source'],
          status: 'PUBLIC',
          to: '/work',
        },
      ],
    },
    {
      type: 'stats',
      eyebrow: 'Company Telemetry',
      title: 'The node at a glance.',
      items: publicMetrics.map((m) => ({
        value: m.value,
        suffix: m.suffix,
        label: m.label,
        note: m.note,
      })),
    },
    {
      type: 'cta',
      scene: 'status-pulse-grid',
      eyebrow: 'Open a channel',
      title: 'Reach the node.',
      body: 'For software systems, internal platforms, operational interfaces, and controlled online infrastructure — the conversation starts at the gate.',
    },
  ],
};

export default page;
