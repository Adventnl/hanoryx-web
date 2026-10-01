const page = {
  key: 'work/unknown-system-03',
  title: 'Public Work Boundary',
  accent: '#ff3333',
  hero: {
    scene: 'unknown-silhouette',
    intensity: 'hero',
    eyebrow: 'Work / source boundary',
    title: 'Some work has no public record yet.',
    intro: 'This route previously described an unnamed system without a verifiable public source. We keep the URL available, but make no claim about an undisclosed build, deployment, or client.',
    code: 'WRK.PUBLIC',
    status: 'SOURCE REQUIRED',
    actions: [
      { label: 'Explore public repositories', to: '/projects' },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'blackout-silhouette',
      eyebrow: 'Publication standard',
      code: 'WRK.SOURCE',
      title: 'A project story needs evidence.',
      body: [
        'A useful case study should show what was built, the constraints that shaped it, and a source or approved account of the outcome. A codename alone cannot do that.',
        'Public repositories on this site have reviewed descriptions and links to the underlying code. Private work can receive a case study when its owner approves specific facts and media for publication.',
      ],
      asideLabel: 'EVIDENCE',
      asideCode: 'WRK.CHECK',
      points: [
        { k: 'SOURCE', v: 'A public repository or approved project record' },
        { k: 'SCOPE', v: 'A precise account of what exists' },
        { k: 'MEDIA', v: 'Approved screenshots or diagrams' },
        { k: 'OUTCOME', v: 'Claims supported by a source' },
      ],
    },
    {
      type: 'cta',
      scene: 'redaction-matrix',
      eyebrow: 'Work',
      title: 'Inspect what is public.',
      body: 'Browse source-linked projects, or contact Hanoryx about work that can be discussed directly.',
    },
  ],
};

export default page;
