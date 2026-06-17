import { designApproach } from '../capabilities';

const page = {
  key: 'north/architecture',
  title: 'Architecture',
  accent: '#ff3333',
  hero: {
    scene: 'architectural-grid',
    intensity: 'hero',
    eyebrow: 'Hanoryx North // ARCH',
    title: 'Every platform is a stack of boundaries decided before a screen is ever drawn.',
    intro: 'Architecture at Hanoryx North is the discipline of shaping a system from the data core outward — laying the layers, drawing the boundaries, and deciding where state lives long before implementation begins.',
    code: 'NODE.ARCH',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Division', to: '/north' },
      { label: 'Engineering', to: '/north/engineering', variant: 'outline' },
    ],
    metrics: [
      { value: 4, label: 'System layers' },
      { value: 4, label: 'Architecture stages' },
      { value: 100, suffix: '%', label: 'Boundaries decided first' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'isometric-module',
      eyebrow: 'The Stack',
      code: 'ARCH.STACK',
      title: 'Four layers, with the lines between them drawn first.',
      body: [
        'A platform is read top to bottom: a data core that owns truth, an orchestration tier that moves work between states, a service surface that exposes capability, and an interface layer that renders it for the operator. Each layer is decided before the one above it is built.',
        'The lines between layers matter more than the layers themselves. Boundaries define what may cross — typed contracts, scoped access, and explicit state — so a change inside one layer never leaks into the next. Internals stay replaceable because the seams are held firm.',
        'Data boundaries are the strictest of all. Records are owned in one place, written through one path, and read through scoped contracts. Nothing reaches the surface that has not passed a boundary built to refuse it.',
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
      scene: 'timeline-pulse',
      eyebrow: 'Design Approach',
      title: 'From operation to hardened system.',
      intro: 'A staged path. The shape of the operation is understood before architecture is laid, and the language is built before anything is hardened.',
      steps: designApproach.map((d) => ({ step: d.step, title: d.title, body: d.body })),
    },
    {
      type: 'modules',
      scene: 'hex-lattice',
      eyebrow: 'Architecture Surface',
      title: 'Service map, boundaries, and scalability.',
      intro: 'The three axes every architecture is judged on: how capability is divided, how those divisions are enforced, and how the whole grows under load.',
      groups: [
        {
          label: 'Service Map',
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
          label: 'Scalability',
          items: [
            'Stateless surfaces, state held at the core',
            'Horizontal growth without re-architecture',
            'Backpressure and rate control by design',
            'Observable under load — signal, not noise',
          ],
        },
      ],
    },
    {
      type: 'cta',
      scene: 'command-terminal',
      eyebrow: 'Open a channel',
      title: 'Commission an architecture.',
      body: 'Bring an operation that needs its boundaries decided before a single screen is drawn.',
    },
  ],
};

export default page;
