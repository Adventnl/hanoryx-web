import { engineeringPrinciples } from '../capabilities';

const page = {
  key: 'north/engineering',
  title: 'Engineering',
  accent: '#ff3333',
  hero: {
    scene: 'circuit-trace',
    intensity: 'hero',
    eyebrow: 'Hanoryx North // ENG',
    title: 'Systems are decided at the bottom of the stack, before a surface is ever drawn.',
    intro: 'Engineering at Hanoryx North is the discipline of building durable platforms — architecture, reliability, and modular design held to a single standard from the first commit.',
    code: 'NODE.ENG',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Division', to: '/north' },
      { label: 'Work', to: '/work', variant: 'outline' },
    ],
    metrics: [
      { value: 6, label: 'Engineering principles' },
      { value: 4, label: 'Pipeline stages' },
      { value: 100, suffix: '%', label: 'Observable in production' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'architectural-grid',
      eyebrow: 'Discipline',
      code: 'ENG.CORE',
      title: 'Architecture, reliability, and modularity carry the weight.',
      body: [
        'Every platform begins as a set of boundaries: data core, orchestration, and interface decided together so the hard problems are solved once, deep, and stay solved.',
        'Reliability is treated as a structural property rather than a phase. Failure modes are mapped early, isolated by design, and recovered without operator intervention.',
        'Modularity keeps the surface small and the internals replaceable. Components are scoped, typed, and built to be reasoned about — and rewritten — in isolation.',
      ],
      asideLabel: 'PROPERTIES',
      asideCode: 'ENG.MAP',
      points: [
        { k: 'ARCH', v: 'Boundaries before screens' },
        { k: 'RELY', v: 'Failure isolated by design' },
        { k: 'MODULE', v: 'Replaceable in isolation' },
        { k: 'CODE', v: 'Typed, scoped, reviewed' },
        { k: 'STATE', v: 'Single source of truth' },
      ],
    },
    {
      type: 'process',
      scene: 'vector-compass',
      eyebrow: 'Build Pipeline',
      title: 'How a system moves from intent to production.',
      intro: 'A linear, instrumented path. Each stage gates the next, and nothing reaches production unobserved.',
      steps: [
        { step: '01', title: 'Design', body: 'Roles, states, and constraints are mapped before code. The architecture and interface boundaries are committed to the design before implementation begins.' },
        { step: '02', title: 'Implement', body: 'Components are built against the agreed boundaries — typed, scoped, and reviewed — so the surface stays narrow while the internals stay replaceable.' },
        { step: '03', title: 'Harden', body: 'Failure modes are exercised, dependencies are pinned, and the path to production is made reversible. Decisions that cannot be undone are isolated and flagged.' },
        { step: '04', title: 'Observe', body: 'Telemetry, tracing, and scoped consoles ship with the system. If it runs in production, it reports — and the operator sees signal, not noise.' },
      ],
    },
    {
      type: 'cards',
      scene: 'network-constellation',
      eyebrow: 'Engineering Principles',
      title: 'Concepts that govern dependency and structure.',
      intro: 'The rules that decide how modules connect, where state lives, and what is allowed to depend on what.',
      items: engineeringPrinciples.map((e) => ({ code: e.code, title: e.title, body: e.body })),
    },
    { type: 'cta', scene: 'command-terminal', eyebrow: 'Open a channel', title: 'Brief the engineering division.', body: 'Bring a system that needs a foundation, not a surface.' },
  ],
};

export default page;
