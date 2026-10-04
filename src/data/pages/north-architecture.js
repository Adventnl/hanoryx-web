import { designApproach } from '../capabilities';

const page = {
  key: 'north/architecture',
  title: 'Architecture',
  accent: '#ff3333',
  aliases: ['layers', 'boundaries', 'service map', 'data core', 'scalability'],
  hero: {
    scene: 'architecture-layer',
    intensity: 'hero',
    eyebrow: 'Development / Architecture',
    title: 'Every platform is a stack of boundaries.',
    intro:
      'Architecture at Hanoryx North means shaping a system from the data core outward: laying the layers, drawing the boundaries and deciding where state lives before implementation begins.',
    code: 'DEV.02',
    status: 'WAY OF WORKING',
    actions: [
      { label: 'Development', to: '/north' },
      { label: 'Engineering', to: '/north/engineering', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'layerStack',
      anchor: 'stack',
      railLabel: 'The stack',
      scene: 'privacy-quiet-grid',
      minHeight: 660,
      eyebrow: 'The stack',
      title: 'Four layers, with the lines between them drawn first.',
      intro: 'Scroll to part the layers. Hover or focus a plate to lift it and read what it holds.',
      layers: [
        { code: 'L4', title: 'Interface layer', body: 'Renders for the operator only what has crossed a boundary.', glyph: 'terminal' },
        { code: 'L3', title: 'Service surface', body: 'Capability exposed behind typed contracts.', glyph: 'gate' },
        { code: 'L2', title: 'Orchestration', body: 'Moves work between states; state is moved, never mutated loosely.', glyph: 'loop' },
        { code: 'L1', title: 'Data core', body: 'Owns the truth: one writer per record, read through scoped contracts.', glyph: 'database' },
      ],
      note: 'A model for how a platform is read, top to bottom. It illustrates an approach, not a deployed system.',
    },
    {
      type: 'split',
      anchor: 'seams',
      railLabel: 'The seams',
      scene: 'isometric-infra',
      eyebrow: 'The seams',
      code: 'ARCH.SEAM',
      title: 'The lines between layers matter more than the layers.',
      body: [
        'Boundaries define what may cross: typed contracts, scoped access and explicit state, so a change inside one layer never leaks into the next. Internals stay replaceable because the seams are held firm.',
        'Data boundaries are the strictest of all. Records are owned in one place, written through one path and read through scoped contracts. Nothing reaches the surface that has not passed a boundary built to refuse it.',
      ],
      asideLabel: 'LAYERS',
      asideCode: 'ARCH.MAP',
      points: [
        { k: 'CORE', v: 'Data owns truth, single writer' },
        { k: 'ORCH', v: 'State moved, never mutated loosely' },
        { k: 'SERVICE', v: 'Capability behind typed contracts' },
        { k: 'INTERFACE', v: 'Render only what crossed a boundary' },
        { k: 'SEAM', v: 'Scoped, explicit, reversible' },
      ],
    },
    {
      type: 'process',
      anchor: 'approach',
      railLabel: 'Design approach',
      scene: 'dependency-graph',
      eyebrow: 'Design approach',
      title: 'From operation to hardened system.',
      intro: 'A staged path. The shape of the operation is understood before architecture is laid, and the language is built before anything is hardened.',
      steps: designApproach.map((d) => ({ step: d.step, title: d.title, body: d.body })),
    },
    {
      type: 'modules',
      anchor: 'surface',
      railLabel: 'Architecture surface',
      scene: 'hex-tunnel',
      eyebrow: 'Architecture surface',
      title: 'Service map, boundaries and growth.',
      intro: 'Three axes an architecture is judged on: how capability is divided, how those divisions are enforced, and how the whole grows.',
      groups: [
        {
          label: 'Service map',
          items: [
            'Capability split into bounded services',
            'One responsibility per service surface',
            'Event-driven orchestration between domains',
            'Internal consoles scoped per service',
          ],
        },
        {
          label: 'Boundaries',
          items: [
            'Typed contracts at every crossing',
            'Role-scoped access from the first commit',
            'Single writer per record, read through contracts',
            'Failure isolated to the layer that raised it',
          ],
        },
        {
          label: 'Growth',
          items: [
            'Stateless surfaces, state held at the core',
            'Growth designed in, not bolted on',
            'Backpressure and rate control by design',
            'Signals that stay readable under load',
          ],
        },
      ],
    },
    {
      type: 'cta',
      scene: 'secure-boundary',
      eyebrow: 'Next',
      title: 'Commission an architecture.',
      body: 'Bring an operation that needs its boundaries decided before a single screen is drawn.',
      links: [{ label: 'Security approach', to: '/company/security' }],
    },
  ],
};

export default page;
