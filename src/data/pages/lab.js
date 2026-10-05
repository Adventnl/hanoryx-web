const page = {
  key: 'lab',
  title: 'Visual Lab',
  accent: '#ff3333',
  aliases: ['canvas', 'scenes', 'studies', 'visual systems', 'experiments'],
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'Development / Visual lab',
    title: 'The visual systems laboratory.',
    intro:
      'A closer look at selected Canvas scenes that already power the site. Choose a study, change its density, and compare it with its still frame.',
    code: 'LAB.01',
    status: 'INTERACTIVE',
    actions: [
      { label: 'How it is built', to: '/engineering' },
      { label: 'Motion systems', to: '/north/motion-systems', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'sceneLab',
      anchor: 'scenes',
      railLabel: 'Scene catalogue',
      minHeight: 700,
      eyebrow: 'Scene catalogue',
      title: 'Study the field.',
      intro: 'Scenes share the site’s scheduler and quality budget. Reduced-motion settings show a still frame — switch it on to see it.',
      experiments: [
        { id: 'flow-field', name: 'Flow field', purpose: 'Vector motion as a continuous field.' },
        { id: 'network-constellation', name: 'Network constellation', purpose: 'Relationships drawn as linked nodes.' },
        { id: 'wave-interference', name: 'Wave interference', purpose: 'Overlapping frequencies create a changing surface.' },
        { id: 'topographic-lines', name: 'Topographic lines', purpose: 'Contour structure with slow spatial movement.' },
        { id: 'dependency-graph', name: 'Dependency graph', purpose: 'Architecture expressed through connections.' },
        { id: 'signal-spectrum-field', name: 'Signal spectrum', purpose: 'A field that responds to the shared audio bridge.' },
      ],
      note: 'Each scene runs on a single canvas, drawn at about thirty frames a second.',
    },
    {
      type: 'closer',
      kind: 'sigilMaker',
      anchor: 'sigil',
      scene: 'magnetic-particles',
      tag: 'End of the visual lab',
      minHeight: 640,
      title: 'Draw a figure from a word.',
      lede: 'A seeded drawing: the same word always makes the same shape, so it is a signature rather than a random picture. Change the rings and spokes, then download it as an SVG.',
      onward: [
        { label: 'Interface lab', to: '/north/interface-lab' },
        { label: 'Motion systems', to: '/north/motion-systems' },
      ],
    },
  ],
};

export default page;
