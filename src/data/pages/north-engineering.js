import { engineeringPrinciples } from '../capabilities';

const GLYPH = { 'e-01': 'stack', 'e-02': 'layers', 'e-03': 'key', 'e-04': 'lens', 'e-05': 'loop', 'e-06': 'wave' };

const page = {
  key: 'north/engineering',
  title: 'Engineering',
  accent: '#ff3333',
  aliases: ['reliability', 'modularity', 'release', 'build pipeline', 'principles'],
  hero: {
    scene: 'build-pipeline',
    intensity: 'hero',
    eyebrow: 'Development / Engineering',
    title: 'Systems are decided at the bottom of the stack.',
    intro:
      'Engineering at Hanoryx North is the discipline of building durable platforms: architecture, reliability and modular design held to one standard from the first line of code.',
    code: 'DEV.01',
    status: 'WAY OF WORKING',
    actions: [
      { label: 'Development', to: '/north' },
      { label: 'Architecture', to: '/north/architecture', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'gateWalk',
      anchor: 'gates',
      railLabel: 'Walk the gates',
      scene: 'architectural-grid',
      minHeight: 700,
      eyebrow: 'Build pipeline',
      title: 'Each stage gates the next.',
      intro:
        'A linear, instrumented path from intent to release. Tick what each gate asks for; only then does the runner move on.',
      stages: [
        {
          id: 'design',
          title: 'Design',
          glyph: 'compass',
          body: 'Roles, states and constraints are mapped before code, and the boundaries are committed to the design before building begins.',
          gates: ['Roles, states and constraints are written down', 'Data ownership and boundaries are agreed', 'The interface boundary is settled before building'],
        },
        {
          id: 'implement',
          title: 'Implement',
          glyph: 'cube',
          body: 'Components are built against the agreed boundaries, so the surface stays narrow while the internals stay replaceable.',
          gates: ['Components are built against the agreed boundaries', 'Code is typed, scoped and reviewed', 'Internals can be replaced without touching the surface'],
        },
        {
          id: 'harden',
          title: 'Harden',
          glyph: 'shield',
          body: 'Failure modes are exercised, dependencies are pinned and the path to release is made reversible.',
          gates: ['Failure modes have been exercised', 'Dependencies are pinned', 'A release can be reversed, and what cannot is flagged'],
        },
        {
          id: 'observe',
          title: 'Observe',
          glyph: 'lens',
          body: 'The signals needed to understand behaviour ship with the system, so the operator sees signal rather than noise.',
          gates: ['The signals that matter are defined before release', 'Telemetry ships with the system', 'The operator sees signal, not noise'],
        },
      ],
      doneTitle: 'Released — and observed.',
      doneBody: 'Nothing reached release unchecked, and nothing runs without reporting back.',
      note: 'A way of working shown as a small game. It is not a certification and not a record of any real release.',
    },
    {
      type: 'split',
      anchor: 'discipline',
      railLabel: 'Discipline',
      scene: 'dependency-graph',
      eyebrow: 'Discipline',
      code: 'ENG.CORE',
      title: 'Architecture, reliability and modularity carry the weight.',
      body: [
        'Every platform begins as a set of boundaries: data core, orchestration and interface decided together, so the hard problems are solved once, deep, and stay solved.',
        'Reliability is treated as a structural property rather than a phase. Failure modes are mapped early and isolated by design.',
        'Modularity keeps the surface small and the internals replaceable. Components are scoped, typed and built to be reasoned about, and rewritten, in isolation.',
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
      type: 'cards',
      variant: 'grid',
      columns: 3,
      anchor: 'principles',
      railLabel: 'Principles',
      scene: 'architecture-layer',
      eyebrow: 'Engineering principles',
      title: 'Rules that decide how things connect.',
      intro: 'How modules connect, where state lives and what is allowed to depend on what.',
      items: engineeringPrinciples.map((e) => ({ code: e.code, title: e.title, body: e.body, glyph: GLYPH[e.id] })),
    },
    {
      type: 'cta',
      scene: 'tooling-console',
      eyebrow: 'Next',
      title: 'Brief the development team.',
      body: 'Bring a system that needs a foundation, not just a surface.',
      links: [{ label: 'Tooling', to: '/north/tooling' }],
    },
  ],
};

export default page;
