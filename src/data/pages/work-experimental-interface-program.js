const page = {
  key: 'work/experimental-interface-program',
  title: 'Interface Experiments',
  accent: '#ff3333',
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'Work / interface experiments',
    title: 'Interfaces can make state visible.',
    intro: 'This route collects interface ideas explored through the Hanoryx website. The public Lab lets visitors inspect actual Canvas scenes; the directions below describe design questions, not separate shipped products.',
    code: 'XIP.STUDY',
    status: 'EXPERIMENTAL',
    actions: [
      { label: 'Explore the Lab', to: '/lab' },
      { label: 'Site engineering', to: '/engineering', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'split-prism',
      eyebrow: 'Directions',
      title: 'Questions worth prototyping.',
      intro: 'Each direction is a design approach to test against real content, input, and accessibility needs.',
      items: [
        {
          code: 'XIP.01',
          title: 'Stateful surfaces',
          body: 'Make loading, success, error, and recovery states explicit so the interface explains what can happen next.',
          tags: ['Interaction', 'State'],
          status: 'STUDY',
        },
        {
          code: 'XIP.02',
          title: 'Adaptive density',
          body: 'Test how much detail different tasks need without hiding a critical action or forcing a fixed layout.',
          tags: ['Density', 'Layout'],
          status: 'STUDY',
        },
        {
          code: 'XIP.03',
          title: 'Motion as feedback',
          body: 'Use movement to connect a user action to a visible state change, with an equivalent still state for reduced motion.',
          tags: ['Motion', 'Accessibility'],
          status: 'IMPLEMENTED ON THIS SITE',
          to: '/lab',
        },
      ],
    },
    {
      type: 'split',
      scene: 'glyph-compiler',
      eyebrow: 'Method',
      code: 'XIP.METHOD',
      title: 'Prototype with the real constraints in view.',
      body: [
        'A convincing motion study still needs readable text, keyboard access, a quiet reduced-motion path, and performance limits. Those constraints shape the interaction from the first prototype.',
        'The site Lab is a concrete test surface for these ideas. Its scenes use a shared frame scheduler and device quality budget; visitors can switch between selected experiments.',
      ],
      asideLabel: 'REVIEW QUESTIONS',
      asideCode: 'XIP.CHECK',
      points: [
        { k: 'MEANING', v: 'What change does motion explain?' },
        { k: 'CONTROL', v: 'Can a person pause or leave it?' },
        { k: 'ACCESS', v: 'What does the still state communicate?' },
        { k: 'COST', v: 'How does it behave on a smaller device?' },
      ],
    },
    {
      type: 'cta',
      scene: 'magnetic-vector',
      eyebrow: 'Lab',
      title: 'See the experiments in context.',
      body: 'Explore the live scene catalogue or discuss an interface problem with Hanoryx.',
    },
  ],
};

export default page;
