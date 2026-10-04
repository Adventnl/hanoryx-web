const page = {
  key: 'north/interface-lab',
  title: 'Interface Lab',
  accent: '#ff3333',
  aliases: ['components', 'specimens', 'design system', 'ui kit', 'buttons'],
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'Development / Interface lab',
    title: 'The interface system, tested in use.',
    intro:
      'This website is the specimen: its navigation, search, components and Canvas scenes. Here are a few of the parts, laid out on a bench.',
    code: 'DEV.03',
    status: 'SITE IMPLEMENTATION',
    actions: [
      { label: 'Open the Lab', to: '/lab' },
      { label: 'Motion systems', to: '/north/motion-systems', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'componentBench',
      anchor: 'bench',
      railLabel: 'The bench',
      scene: 'privacy-quiet-grid',
      minHeight: 620,
      eyebrow: 'The bench',
      title: 'Change a prop. See the part respond.',
      intro:
        'These are the site’s real components. Pick one, change what it can do, then hover it, tab to it and press it.',
      specimens: [
        { id: 'button', label: 'Button', purpose: 'The site’s primary control. It can be a link, an anchor or a button, and it pulls a little toward the pointer.' },
        { id: 'pill', label: 'Pill', purpose: 'A small mono tag for status and metadata, with an optional live dot.' },
        { id: 'key', label: 'Keycap', purpose: 'A visible key, used wherever a shortcut is mentioned.' },
        { id: 'switch', label: 'Switch', purpose: 'An on/off control with a visible state and a real focus ring.' },
      ],
      note: 'The generated line is a sketch of the call, not a spec.',
    },
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'specimens',
      railLabel: 'Components with a job',
      scene: 'split-prism',
      eyebrow: 'Real specimens',
      title: 'Components with a job.',
      intro: 'These parts exist in the website. Their value comes from repeated use across the pages, not from a count.',
      items: [
        { code: 'SPC.01', title: 'Data panel', body: 'A shared surface for structured details and technical labels.', tags: ['Surface', 'Content'], glyph: 'doc' },
        { code: 'SPC.02', title: 'Section scene', body: 'A section can declare a Canvas background while its content stays a separate, readable layer.', tags: ['Canvas', 'Layout'], glyph: 'layers' },
        { code: 'SPC.03', title: 'Command palette', body: 'Keyboard access to every page, with search of the page text, arrow selection, Enter and Escape.', tags: ['Search', 'Keyboard'], glyph: 'terminal' },
        { code: 'SPC.04', title: 'Glide tabs', body: 'A tab list whose selection glides from tab to tab, with the full arrow-key model.', tags: ['Tabs', 'Motion'], glyph: 'flow' },
      ],
    },
    {
      type: 'split',
      anchor: 'interaction',
      railLabel: 'Interaction',
      scene: 'glyph-compiler',
      eyebrow: 'Interaction',
      code: 'LAB.LANG',
      title: 'Behaviour belongs to a real state change.',
      body: [
        'Search has focus, selection, empty-result and dismissal states. Navigation has hover, keyboard, touch and close paths. Each is a useful place to make behaviour explicit.',
        'Motion helps identify transitions, but content stays readable in a reduced-motion still state. Canvas rendering is budgeted by visibility and device capability.',
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
      eyebrow: 'Visual lab',
      title: 'Inspect the motion layer.',
      body: 'The Lab exposes selected scenes and their density control in a working interface.',
      links: [{ label: 'Open the Lab', to: '/lab' }],
    },
  ],
};

export default page;
