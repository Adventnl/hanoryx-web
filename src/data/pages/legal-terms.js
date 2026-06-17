const page = {
  key: 'legal/terms',
  title: 'Terms',
  accent: '#ff3333',
  hero: {
    scene: 'privacy-quiet-grid',
    intensity: 'hero',
    eyebrow: 'Legal // TERMS',
    title: 'The terms that govern use of this website.',
    intro:
      'A plain account of how this site may be used, what belongs to us, and the limits of what is offered here.',
    code: 'NODE.TERMS',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Contact', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      eyebrow: 'Overview',
      code: 'TERMS.01',
      title: 'Use of this site, in plain terms.',
      body: [
        'By accessing this website you accept these terms. They cover how the site may be used, what is owned by HANORYX SYSTEMS, and the basis on which the content is made available.',
        'You may view, browse, and reference this site for lawful, personal, or professional purposes. You may not copy, reproduce, scrape, or republish its content, structure, or code without written permission. Any commentary or capability described here may change without notice.',
        'The site, its design, copy, source, and any system descriptions are the intellectual property of HANORYX SYSTEMS unless stated otherwise. All such rights are reserved.',
      ],
      asideLabel: 'BASIS',
      asideCode: 'TERMS.MAP',
      points: [
        { k: 'ACCESS', v: 'Granted on acceptance of these terms' },
        { k: 'USE', v: 'Lawful viewing and reference only' },
        { k: 'IP', v: 'Content and code reserved' },
        { k: 'WARRANTY', v: 'Provided as is, without guarantee' },
        { k: 'CHANGE', v: 'Terms may be revised at any time' },
      ],
    },
    {
      type: 'modules',
      eyebrow: 'Term // Meaning',
      title: 'The key terms, read in full.',
      intro:
        'Each clause below states a single obligation or limit. Read together, they form the agreement under which this site is offered.',
      rows: [
        { k: 'Acceptance', v: 'Using the site means you agree to these terms in their current form.' },
        { k: 'Permitted use', v: 'View and reference the site lawfully; do not scrape, mirror, or resell it.' },
        { k: 'Intellectual property', v: 'Text, design, source, and system names remain owned by HANORYX SYSTEMS.' },
        { k: 'No warranty', v: 'Content is provided as is, with no warranty of accuracy, fitness, or uptime.' },
        { k: 'Limitation', v: 'We are not liable for loss arising from use of, or reliance on, this site.' },
        { k: 'Links', v: 'External links are referenced for convenience and are outside our control.' },
        { k: 'Revision', v: 'Terms may be updated; continued use signals acceptance of the current version.' },
      ],
    },
    {
      type: 'cta',
      scene: 'architectural-grid',
      eyebrow: 'Open a channel',
      title: 'Questions on terms?',
      body: 'For clarification on these terms or how content from this site may be used, reach the team directly.',
    },
  ],
};

export default page;
