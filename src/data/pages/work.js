const page = {
  key: 'work',
  title: 'Work',
  accent: '#ff3333',
  aliases: ['projects', 'portfolio', 'case studies', 'selected work'],
  hero: {
    scene: 'node-compression',
    intensity: 'hero',
    eyebrow: 'Hanoryx Systems / Work',
    title: 'Selected work.',
    intro:
      'Two primary projects and two quieter supporting studies — described plainly, without client names, dates or figures we cannot stand behind.',
    code: 'WRK.00',
    status: 'CASE STUDIES',
    actions: [
      { label: 'Musebase', to: '/work/musebase' },
      { label: 'YK Engine', to: '/work/yk-engine', variant: 'outline' },
    ],
    aside: { kind: 'caseDeck' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'workPortals',
      anchor: 'portfolio',
      railLabel: 'Portfolio',
      scene: 'dependency-graph',
      minHeight: 760,
      eyebrow: 'Case studies',
      title: 'Start with the two that lead.',
      intro: 'Hover or focus a project to open it up. Each one leads to its own case study.',
      supportingLabel: 'Supporting studies',
    },
    {
      type: 'modules',
      anchor: 'how',
      railLabel: 'How work is described',
      scene: 'privacy-quiet-grid',
      eyebrow: 'How work is described here',
      title: 'Plain, and deliberately partial.',
      intro: 'Some work is internal and some is unnamed on purpose. These are the ground rules for what appears on this site.',
      rows: [
        { k: 'DESCRIPTIONS', v: 'What each piece of work is, in plain terms.' },
        { k: 'NAMES', v: 'The two supporting studies are unnamed by design.' },
        { k: 'FIGURES', v: 'No measured results are quoted unless they can be backed up.' },
        { k: 'DATES', v: 'Not published. The company timeline is told in phases.' },
        { k: 'LINKS', v: 'Only YK Engine links out, to its source on GitHub. The rest are described, not linked.' },
      ],
    },
    {
      type: 'cta',
      scene: 'contact-transmission',
      eyebrow: 'Next',
      title: 'Talk about a build.',
      body: 'If one of these sits close to something you are working on, the conversation starts on the contact page.',
      links: [{ label: 'Read the company chronology', to: '/company/timeline' }],
    },
  ],
};

export default page;
