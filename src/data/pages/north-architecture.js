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
      type: 'closer',
      kind: 'layerSort',
      anchor: 'sort',
      scene: 'secure-boundary',
      tag: 'End of architecture',
      minHeight: 780,
      title: 'Where does it belong?',
      lede: 'Eight small responsibilities and four layers. Put each in the layer you would give it, then check against the reasoning. There is rarely only one possible answer; the point is to say why.',
      layers: [
        { id: 'interface', name: 'Interface', blurb: 'Shows things and takes input. Presentation, and nothing that has to be true.' },
        { id: 'surface', name: 'Service surface', blurb: 'The typed contracts. Who may ask for what, and what shape the question and answer take.' },
        { id: 'orchestration', name: 'Orchestration', blurb: 'Moves work between states: steps, retries, hand-offs, schedules.' },
        { id: 'data', name: 'Data core', blurb: 'Owns the truth. One writer per record, with rules that cannot be bypassed.' },
      ],
      items: [
        { id: 'a', text: 'Show a price with a currency symbol and two decimals', layer: 'interface', why: 'Presentation is the edge’s job. The data core stores an amount and a currency code, and every screen formats it for its reader.' },
        { id: 'b', text: 'Check that this person may issue a refund', layer: 'surface', why: 'Authorisation belongs at the boundary of the service, decided there for every request, so no path can skip it.' },
        { id: 'c', text: 'Move an order from paid to packed and tell the warehouse', layer: 'orchestration', why: 'Moving work between states, and telling other parts about it, is orchestration. State moves; it is not edited loosely.' },
        { id: 'd', text: 'Make sure two people cannot change one record at the same moment', layer: 'data', why: 'Only the layer that owns the record can guarantee this, with a transaction or a version check that cannot be bypassed.' },
        { id: 'e', text: 'Retry a failed email three times, then give up', layer: 'orchestration', why: 'Retries, back-off and the point of giving up are about the progress of work, not about data or screens.' },
        { id: 'f', text: 'Reject a request that is missing a field it promised to carry', layer: 'surface', why: 'The contract states the shape of a request. Enforcing it at the surface keeps bad input from travelling any further.' },
        { id: 'g', text: 'Remember that this order has been refunded', layer: 'data', why: 'A fact about the world is stored where truth lives, once. Everything else reads it.' },
        { id: 'h', text: 'Grey out the Refund button for people who cannot refund', layer: 'interface', why: 'A courtesy at the edge. The real check is at the surface, because anyone can send the request the button would have sent.' },
      ],
      onward: [
        { label: 'Roles, permissions and scopes', to: '/insights/permissions' },
        { label: 'Security approach', to: '/company/security' },
      ],
    },
  ],
};

export default page;
