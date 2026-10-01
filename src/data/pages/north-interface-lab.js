const page = {
  key: 'north/interface-lab',
  title: 'Interface Lab',
  accent: '#ff3333',
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'Hanoryx North / interface lab',
    title: 'The interface system is tested in use.',
    intro: 'This site is the public specimen: its navigation, content components, search, and Canvas scenes can be inspected here and in source. The Lab lets visitors switch between selected visual studies.',
    code: 'LAB.SITE',
    status: 'PUBLIC IMPLEMENTATION',
    actions: [
      { label: 'Open the Lab', to: '/lab' },
      { label: 'View source', href: 'https://github.com/Adventnl/hanoryx-web', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'split-prism',
      eyebrow: 'Real specimens',
      title: 'Components with a job.',
      intro: 'These components exist in the website. Their value comes from repeated use and behavior across routes, rather than a claimed component count.',
      items: [
        {
          code: 'SPC.01',
          title: 'Data panel',
          body: 'A shared surface for structured details and technical labels on legacy and new pages.',
          tags: ['Surface', 'Content'],
          status: 'SITE SOURCE',
        },
        {
          code: 'SPC.02',
          title: 'Section scene',
          body: 'A section can declare a Canvas background while content remains a separate semantic layer.',
          tags: ['Canvas', 'Layout'],
          status: 'SITE SOURCE',
        },
        {
          code: 'SPC.03',
          title: 'Command palette',
          body: 'Keyboard access to routes and public repositories, with search, arrow selection, Enter, and Escape.',
          tags: ['Search', 'Keyboard'],
          status: 'SITE SOURCE',
        },
        {
          code: 'SPC.04',
          title: 'Project card',
          body: 'A reusable entry to source-linked repository stories across the explorer, homepage, and related-work sections.',
          tags: ['Projects', 'Navigation'],
          status: 'SITE SOURCE',
          to: '/projects',
        },
      ],
    },
    {
      type: 'split',
      scene: 'glyph-compiler',
      eyebrow: 'Interaction',
      code: 'LAB.LANG',
      title: 'Behavior belongs to a real state change.',
      body: [
        'Search has focus, selection, empty-result, and dismissal states. Navigation has hover, keyboard, touch, and close paths. Each is a useful place to make behavior explicit.',
        'Motion helps identify transitions, but content remains readable in a reduced-motion still state. Canvas rendering is budgeted by visibility and device capability.',
      ],
      asideLabel: 'DESIGN CHECKS',
      asideCode: 'LAB.CHECK',
      points: [
        { k: 'FOCUS', v: 'Can the next action be reached by keyboard?' },
        { k: 'STATE', v: 'Does the interface show what changed?' },
        { k: 'MOTION', v: 'Is a quiet equivalent available?' },
        { k: 'DENSITY', v: 'Does the layout hold at small widths?' },
      ],
    },
    {
      type: 'cta',
      scene: 'magnetic-vector',
      eyebrow: 'Visual Lab',
      title: 'Inspect the motion layer.',
      body: 'The Lab exposes selected scenes and their density control in a working interface.',
    },
  ],
};

export default page;
