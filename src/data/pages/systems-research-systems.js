const page = {
  key: 'systems/research-systems',
  title: 'Research Systems',
  accent: '#ff3333',
  hero: {
    scene: 'network-constellation',
    intensity: 'hero',
    eyebrow: 'Systems / research',
    title: 'Research through working interfaces.',
    intro: 'Canvas rendering, motion, and project visualization explored through public site code. Open the Lab and source-linked work to inspect each study.',
    code: 'SYS.RESEARCH',
    status: 'PUBLIC STUDIES',
    actions: [
      { label: 'Open the Lab', to: '/lab' },
      { label: 'All systems', to: '/systems', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'glyph-compiler',
      eyebrow: 'Visible experiments',
      title: 'Questions the site puts to work.',
      intro: 'Each study has a visible implementation or source-linked record. Its purpose is to learn from an interaction, not to imply a separate deployed product.',
      items: [
        {
          code: 'RD.01',
          title: 'Scene budgeting',
          body: 'How many visual layers can remain active while scrolling stays responsive? The site uses visibility, quality, and device budgets to answer that in code.',
          tags: ['Canvas', 'Performance'],
          status: 'SITE IMPLEMENTATION',
          to: '/engineering',
        },
        {
          code: 'RD.02',
          title: 'Motion with a still state',
          body: 'What information should an animation convey when motion is reduced? The Lab scenes render a static frame under a reduced-motion preference.',
          tags: ['Motion', 'Accessibility'],
          status: 'SITE IMPLEMENTATION',
          to: '/lab',
        },
        {
          code: 'RD.03',
          title: 'Repository relationships',
          body: 'How can public source data shape a visual system? A project scene connects curated repositories through shared detected languages.',
          tags: ['Public data', 'Visualization'],
          status: 'PUBLIC SOURCE',
          to: '/projects',
        },
      ],
    },
    {
      type: 'split',
      scene: 'redaction-matrix',
      eyebrow: 'Method',
      code: 'RD.METHOD',
      title: 'Test an idea in the environment it serves.',
      body: [
        'A visual experiment has to coexist with readable content, navigation, keyboard use, and small screens. The site offers a practical place to test those constraints together.',
        'Public source is linked where available. Unpublished ideas remain outside this catalogue until there is material specific enough to review and share.',
      ],
      asideLabel: 'REVIEW LENSES',
      asideCode: 'RD.CHECK',
      points: [
        { k: 'MEANING', v: 'What does the interaction explain?' },
        { k: 'ACCESS', v: 'Can everyone reach the same content?' },
        { k: 'COST', v: 'How does it perform on a small device?' },
        { k: 'SOURCE', v: 'What can a visitor verify?' },
      ],
    },
    {
      type: 'cta',
      scene: 'blackout-silhouette',
      eyebrow: 'Lab',
      title: 'Inspect the experiments.',
      body: 'The Lab provides a direct view of selected scenes and their behavior.',
    },
  ],
};

export default page;
