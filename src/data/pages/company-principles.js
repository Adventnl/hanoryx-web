import { operatingPrinciples } from '../company';

const page = {
  key: 'company/principles',
  title: 'Principles',
  accent: '#ff3333',
  hero: {
    scene: 'orbital-node',
    intensity: 'hero',
    eyebrow: 'Company // DOCTRINE',
    title: 'The operating principles every system is built against.',
    intro:
      'These are not aspirations. They are constraints — applied to architecture, interface, and release before a single line ships.',
    code: 'NODE.PRINCIPLES',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Systems', to: '/systems' },
      { label: 'North', to: '/north', variant: 'outline' },
    ],
    metrics: [
      { value: 6, label: 'Operating principles' },
      { value: 1, label: 'Design language' },
      { value: 100, suffix: '%', label: 'Applied before release' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'hex-lattice',
      eyebrow: 'Operating Principles',
      title: 'Six rules that hold the work together.',
      intro:
        'Each principle resolves a recurring engineering tension — between depth and clarity, speed and durability, access and exposure.',
      items: operatingPrinciples.map((p) => ({
        code: p.index,
        title: p.title,
        body: p.body,
      })),
    },
    {
      type: 'manifesto',
      scene: 'topographic-lines',
      eyebrow: 'Doctrine',
      lines: [
        'A system earns its surface by holding its weight underneath.',
        'Clarity is engineered, not decorated.',
        'Access is granted by intent, never by default.',
        'Nothing is released until the architecture can carry it.',
      ],
      marquee: ['CONTROLLED', 'SCOPED', 'DELIBERATE', 'DURABLE', 'QUIET'],
    },
    {
      type: 'modules',
      scene: 'vector-compass',
      eyebrow: 'Principle // Meaning',
      title: 'What each principle changes in practice.',
      intro:
        'The doctrine compiles down to concrete engineering decisions. These are the operative readings.',
      rows: [
        { k: 'Controlled complexity', v: 'Depth lives in the model, never on the surface' },
        { k: 'Interfaces before noise', v: 'A view resolves intent in a single read' },
        { k: 'Motion with purpose', v: 'Every transition reports state or direction' },
        { k: 'Architecture that expands', v: 'Growth is a property, not a rewrite' },
        { k: 'Reveal only what is needed', v: 'Information surfaces by role and context' },
        { k: 'Production-minded prototypes', v: 'Foundations are built to survive real load' },
      ],
    },
    {
      type: 'cta',
      scene: 'polar-radar',
      eyebrow: 'Open a channel',
      title: 'Hold us to the doctrine.',
      body: 'For teams that want structure, scope, and control over the systems they run on.',
    },
  ],
};

export default page;
