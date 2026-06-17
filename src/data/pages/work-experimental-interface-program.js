const page = {
  key: 'work/experimental-interface-program',
  title: 'Experimental Interface Program',
  accent: '#ff3333',
  hero: {
    scene: 'glyph-field',
    intensity: 'hero',
    eyebrow: 'Work // NODE.XIP',
    title: 'A standing research program where the next interface grammar is pressured before it earns a name.',
    intro:
      'The Experimental Interface Program is not a product. It is the branch where interaction models, motion behaviour, and density logic are prototyped, broken on purpose, and resolved into something a deployed system could carry.',
    code: 'NODE.X',
    status: 'RESEARCH',
    actions: [
      { label: 'All work', to: '/work', variant: 'outline' },
      { label: 'Research systems', to: '/systems/research-systems' },
    ],
    metrics: [
      { value: 9, label: 'Prototype directions' },
      { value: 2, label: 'Cleared to production' },
      { value: 0, label: 'Publicly named' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'voronoi-cell',
      eyebrow: 'Directions',
      title: 'Prototype directions under study.',
      intro:
        'Each card is an abstract research track held inside the program. They describe the class of problem being pressured, not a finished system. Most are revised, merged, or killed before they leave this stage.',
      items: [
        {
          code: 'XIP.01',
          title: 'Stateful surfaces',
          body: 'Interfaces modelled as explicit state machines, where a surface always knows what it can do, what it is doing, and what it just did. Under study for predictability when many transitions overlap.',
          tags: ['Interaction', 'State'],
          status: 'RESEARCH',
        },
        {
          code: 'XIP.02',
          title: 'Adaptive density',
          body: 'Layouts that re-rank detail around role, intent, and live load rather than holding a fixed grid. The measure is time-to-decision under dense data, not the number of fields shown.',
          tags: ['Density', 'Layout'],
          status: 'RESEARCH',
        },
        {
          code: 'XIP.03',
          title: 'Scoped disclosure',
          body: 'A reveal model that exposes information by context and authority instead of dumping it. Nothing is shown by default; every layer is earned on demand and logged when it is opened.',
          tags: ['Disclosure', 'Access'],
          status: 'RESEARCH',
        },
        {
          code: 'XIP.04',
          title: 'Restricted track',
          body: 'Direction withheld. Held to internal review until the approach survives enough constraint to describe without overstating what it does.',
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
      code: 'XIP.MTN',
      title: 'Motion and interface researched as one continuous problem.',
      body: [
        'Motion is treated as the carrier of state, not as decoration applied afterward. Every transition is timed to a change the operator needs to understand, so movement explains what happened rather than just softening it.',
        'Interface and motion are prototyped together on the same data discipline a deployed Hanoryx system would run on. A prototype here already holds a role model and access control, so the gap to production is engineering work, not a rewrite.',
        'Directions earn promotion by surviving real constraints — load, ambiguous input, failure, and the cost of being wrong. Most do not survive. The ones that do already behave like systems by the time they leave the program.',
      ],
      asideLabel: 'PROMOTION GATES',
      asideCode: 'XIP.GATE',
      points: [
        { k: 'MOTION', v: 'Timed to meaning, not effect' },
        { k: 'STATE', v: 'Carried, never decorative' },
        { k: 'DISCIPLINE', v: 'Production data model from day one' },
        { k: 'CONSTRAINT', v: 'Pressured under real load' },
        { k: 'EXIT', v: 'Killed, held, or promoted' },
      ],
    },
    {
      type: 'redacted',
      scene: 'blackout-silhouette',
      eyebrow: 'Withheld',
      title: 'A direction not yet announced.',
      intro:
        'One track inside the program is suppressed on purpose. What reaches this page is a code, a shape, and nothing that would commit us to a public direction before the architecture holds on its own.',
      items: [
        {
          code: 'XIP.07',
          label: 'Interaction track',
          note: 'Approach under internal review. Surface intentionally withheld.',
        },
        {
          code: 'XIP.08',
          label: 'Motion track',
          note: 'Behaviour model logged; detail held until it clears constraint testing.',
        },
        {
          code: 'XIP.09',
          label: 'Unnamed direction',
          note: 'Silhouette only. Resolves into the record when it is ready to stand alone.',
        },
      ],
    },
    {
      type: 'cta',
      scene: 'concentric-gate',
      eyebrow: 'Open a channel',
      title: 'Most of this stays withheld.',
      body: 'If a direction from the program becomes relevant to your operation, the conversation starts here — under the same controls as the research itself.',
    },
  ],
};

export default page;
