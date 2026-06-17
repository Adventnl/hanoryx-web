import { unknownSystems } from '../systems';

const page = {
  key: 'systems/research-systems',
  title: 'Research Systems',
  accent: '#ff3333',
  hero: {
    scene: 'glyph-field',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.07',
    title: 'Experimental online systems, built away from the surface.',
    intro: 'A small set of research nodes where new interface and orchestration ideas are pressured before any of them carry a name. Most of what runs here stays withheld.',
    code: 'NODE.X',
    status: 'RESEARCH',
    actions: [{ label: 'All systems', to: '/systems', variant: 'outline' }],
    metrics: [
      { value: 7, label: 'Active research nodes' },
      { value: 3, label: 'Tracks toward production' },
      { value: 0, label: 'Publicly named' },
    ],
  },
  blocks: [
    {
      type: 'redacted',
      scene: 'blackout-silhouette',
      eyebrow: 'Withheld',
      title: 'Nodes that are not ready to be seen.',
      intro: 'Each entry is a live research branch. The surface is suppressed on purpose — what reaches this page is a code, a shape, and nothing that would commit us to a direction before the architecture holds.',
      items: unknownSystems.map((s) => ({ code: s.code, label: s.label, note: s.note })),
    },
    {
      type: 'cards',
      scene: 'voronoi-cell',
      eyebrow: 'Directions',
      title: 'Where the work is pointed.',
      intro: 'Abstract research tracks, kept deliberately general. These describe the kind of problem under study, not the system that may eventually carry it.',
      items: [
        {
          code: 'RD.01',
          title: 'Adaptive interface logic',
          body: 'Surfaces that reshape themselves around role, intent, and live state instead of holding a fixed layout. Under study for predictability at scale.',
          tags: ['Interface', 'State'],
          status: 'RESEARCH',
        },
        {
          code: 'RD.02',
          title: 'Autonomous orchestration',
          body: 'Coordination layers that resolve dependency and timing with less manual intervention, while keeping every decision auditable after the fact.',
          tags: ['Orchestration'],
          status: 'RESEARCH',
        },
        {
          code: 'RD.03',
          title: 'High-density data surfaces',
          body: 'Readable views over records and relationships that would normally overwhelm an operator. Measured on time-to-decision, not feature count.',
          tags: ['Data', 'Control'],
          status: 'RESEARCH',
        },
        {
          code: 'RD.04',
          title: 'Restricted track',
          body: 'Direction withheld. Held to internal review until the approach is proven enough to describe without overstating it.',
          tags: ['Withheld'],
          status: 'CLASSIFIED',
          redacted: true,
        },
      ],
    },
    {
      type: 'split',
      scene: 'liquid-metal',
      eyebrow: 'Method',
      code: 'RD.MODE',
      title: 'Production-minded prototyping.',
      body: [
        'A prototype here is not a sketch. It is built on the same data discipline, role model, and access control that a deployed Hanoryx system would carry — so the gap between research and production is engineering, not a rewrite.',
        'Ideas earn promotion by surviving real constraints: load, failure, ambiguous input, and the cost of being wrong. Most do not. The ones that do already look like systems by the time they leave this stage.',
      ],
      asideLabel: 'PROMOTION GATES',
      asideCode: 'RD.GATE',
      points: [
        { k: 'CONSTRAINT', v: 'Tested under real load' },
        { k: 'AUDIT', v: 'Every decision traceable' },
        { k: 'ROLES', v: 'Access modelled from day one' },
        { k: 'FAILURE', v: 'Behaviour defined when it breaks' },
        { k: 'EXIT', v: 'Killed, held, or promoted' },
      ],
    },
    {
      type: 'cta',
      scene: 'concentric-gate',
      eyebrow: 'Open a channel',
      title: 'Most of this stays withheld.',
      body: 'If a research direction becomes relevant to your operation, the conversation starts here — under the same controls as the work itself.',
    },
  ],
};

export default page;
