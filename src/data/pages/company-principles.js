import { operatingPrinciples } from '../company';

/* What each principle changes in practice, and the glyph that stands for it. */
const PRACTICE = {
  'p-01': {
    glyph: 'layers',
    practice: 'Depth lives in the model and its boundaries. The surface shows only what the moment needs.',
  },
  'p-02': {
    glyph: 'lens',
    practice: 'A view resolves intent in a single read. Anything that does not help someone decide or act is removed.',
  },
  'p-03': {
    glyph: 'wave',
    practice: 'Every transition reports state, direction or hierarchy. If a movement only decorates, it goes.',
  },
  'p-04': {
    glyph: 'stack',
    practice: 'Foundations are laid for what is not yet announced, so growth is an addition rather than a rewrite.',
  },
  'p-05': {
    glyph: 'key',
    practice: 'Information is scoped by role, context and intent before it ever reaches a screen.',
  },
  'p-06': {
    glyph: 'spark',
    practice: 'Early versions sit on foundations that can survive real use, so a prototype is a first release, not a throwaway.',
  },
};

const page = {
  key: 'company/principles',
  title: 'Principles',
  accent: '#ff3333',
  aliases: ['doctrine', 'values', 'how we work', 'rules'],
  hero: {
    scene: 'compass-vector',
    intensity: 'hero',
    eyebrow: 'Company / Principles',
    title: 'Six rules the work is held to.',
    intro:
      'Short enough to remember and strict enough to say no. Each one settles a tension that keeps coming back — and each comes with what it changes in practice.',
    code: 'CMP.01',
    status: 'DOCTRINE',
    actions: [
      { label: 'Security approach', to: '/company/security' },
      { label: 'Selected work', to: '/work', variant: 'outline' },
    ],
    aside: {
      kind: 'tensionDials',
      dials: [
        {
          id: 'depth',
          left: 'Depth',
          right: 'Clarity',
          start: 18,
          states: {
            low: 'All depth, no surface. Powerful, and hard to read.',
            mid: 'Depth held underneath, clarity on top.',
            high: 'All surface, no depth. Easy to read, and shallow.',
          },
        },
        {
          id: 'speed',
          left: 'Speed',
          right: 'Durability',
          start: 82,
          states: {
            low: 'Fast to ship, and has to be done twice.',
            mid: 'Quick iteration on foundations that last.',
            high: 'Built to last, but too slow to learn from.',
          },
        },
        {
          id: 'scope',
          left: 'Scoped',
          right: 'Open',
          start: 30,
          states: {
            low: 'Everything scoped. Safe, and nobody can do their work.',
            mid: 'Each role sees what concerns it.',
            high: 'Everything open. Convenient, and everyone sees everything.',
          },
        },
      ],
      caption: 'Each principle below settles one of these tensions. Nothing here is measured or stored.',
    },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'principleStack',
      anchor: 'principles',
      railLabel: 'The six',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'Operating principles',
      title: 'Six rules that hold the work together.',
      intro: 'Scroll — each card lays itself over the last, like a deck being dealt.',
      principles: operatingPrinciples.map((p) => ({
        code: p.index,
        title: p.title,
        body: p.body,
        practice: PRACTICE[p.id].practice,
        glyph: PRACTICE[p.id].glyph,
      })),
    },
    {
      type: 'manifesto',
      anchor: 'doctrine',
      railLabel: 'Doctrine',
      scene: 'vector-compass',
      eyebrow: 'Doctrine',
      lines: [
        'A system earns its surface by holding its *weight* underneath.',
        'Clarity is engineered, not decorated.',
        'Access is granted by intent, never by default.',
        'Nothing is released until the architecture can carry it.',
      ],
      marquee: ['CONTROLLED', 'SCOPED', 'DELIBERATE', 'DURABLE', 'QUIET'],
    },
    {
      type: 'closer',
      kind: 'reviewDraw',
      scene: 'vector-compass',
      tag: 'End of the principles',
      minHeight: 560,
      title: 'Take one into your next review.',
      lede: 'Six cards, one for each principle. Draw one and it comes with a question worth asking out loud.',
      cards: [
        { title: 'Controlled complexity', question: 'Which part of this would we be unable to explain in six months, and why are we accepting that?' },
        { title: 'Interfaces before noise', question: 'What could we take off this screen without anyone noticing it was gone?' },
        { title: 'Motion with purpose', question: 'What does each movement here say about state, direction or hierarchy? If nothing, why is it moving?' },
        { title: 'Architecture that can expand', question: 'What would the second use of this look like, and does this design make it cheaper or dearer?' },
        { title: 'Reveal only what is needed', question: 'Who sees this by default, and who should not?' },
        { title: 'Production-minded prototypes', question: 'If this prototype were still running in a year, what would break first?' },
      ],
      onward: [{ label: 'How we work', to: '/company/how-we-work' }, { label: 'Selected work', to: '/work' }],
    },
  ],
};

export default page;
