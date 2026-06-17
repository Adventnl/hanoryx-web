import { interfaceLanguage } from '../capabilities';

const page = {
  key: 'north/interface-lab',
  title: 'Interface Lab',
  accent: '#ff3333',
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'North // LAB.IFC',
    title: 'Where the interface system is forged before it ships.',
    intro: 'The Interface Lab is where component systems, interaction models, and motion language are built, stress-tested, and resolved into a single grammar that scales across every Hanoryx surface.',
    code: 'NODE.LAB',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Hanoryx North', to: '/north', variant: 'outline' },
    ],
    metrics: [
      { value: 240, label: 'Resolved components' },
      { value: 60, suffix: 'fps', label: 'Motion target' },
      { value: 4, label: 'Density tiers' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'split-prism',
      eyebrow: 'Specimens',
      title: 'Component-system specimens.',
      intro: 'Each specimen is a self-contained unit of the interface system — proven in isolation, then admitted into the shared library only once its behaviour is fully defined.',
      items: [
        {
          code: 'SPC.01',
          title: 'Threshold panel',
          body: 'A layered black surface that holds telemetry, controls, and record in one frame. Depth is built from elevation, never from colour.',
          tags: ['surface', 'layout'],
          status: 'STABLE',
        },
        {
          code: 'SPC.02',
          title: 'Scoped reveal',
          body: 'A disclosure primitive that exposes information by role, context, and intent. Nothing is dumped; everything is earned on demand.',
          tags: ['disclosure', 'state'],
          status: 'STABLE',
        },
        {
          code: 'SPC.03',
          title: 'Telemetry rail',
          body: 'A monospace strip for live numeric state. It reports continuously and stays quiet until a value crosses a defined threshold.',
          tags: ['mono', 'signal'],
          status: 'STABLE',
        },
        {
          code: 'SPC.04',
          title: 'Command field',
          body: 'A focused input surface for operator action, with predictable focus order and keyboard-first navigation throughout.',
          tags: ['input', 'control'],
          status: 'REVIEW',
        },
        {
          code: 'SPC.05',
          title: 'Accent threshold',
          body: 'The single red marker that signals the edge of attention. It appears rarely, deliberately, and only where a decision is required.',
          tags: ['accent', 'attention'],
          status: 'STABLE',
        },
        {
          code: 'SPC.06',
          title: 'Density grid',
          body: 'A responsive lattice that holds dense data without crowding, scaling row height and column rhythm across four density tiers.',
          tags: ['grid', 'density'],
          status: 'STABLE',
        },
      ],
    },
    {
      type: 'split',
      scene: 'glyph-compiler',
      eyebrow: 'Language',
      code: 'LAB.LANG',
      title: 'Interaction, motion, and density resolved together.',
      body: [
        'Interaction is engineered as a state machine, not a sequence of effects. Every surface knows what it can do, what it is doing, and what it has just done — and it tells the operator without raising its voice.',
        'Motion carries that state. It is continuous and high-control: a quiet statement about transition, never decoration applied after the fact. Animation timing is tied to meaning, so movement always explains a change.',
        'Information density is tuned, not maximised. We layer detail across four tiers so an operator can move from overview to deep record without ever losing the thread of where they are.',
      ],
      asideLabel: 'DIMENSIONS',
      asideCode: 'LAB.DIM',
      points: [
        { k: 'INTERACTION', v: 'Modelled as explicit state' },
        { k: 'MOTION', v: 'Continuous, meaning-linked' },
        { k: 'DENSITY', v: 'Four layered tiers' },
        { k: 'FOCUS', v: 'Keyboard-first ordering' },
        { k: 'FEEDBACK', v: 'Quiet, immediate, scoped' },
      ],
    },
    {
      type: 'modules',
      scene: 'dashboard-tiles',
      eyebrow: interfaceLanguage.eyebrow,
      title: interfaceLanguage.title,
      intro: interfaceLanguage.body,
      rows: interfaceLanguage.rules,
    },
    {
      type: 'cta',
      scene: 'magnetic-vector',
      eyebrow: 'Open a channel',
      title: 'Commission an interface system.',
      body: 'Bring an operation that needs a real interface language — not another set of screens.',
    },
  ],
};

export default page;
