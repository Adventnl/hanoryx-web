const page = {
  key: 'work/unknown-system-03',
  title: 'Unknown System 03',
  accent: '#ff3333',
  hero: {
    scene: 'blackout-silhouette',
    intensity: 'hero',
    eyebrow: 'Work // WRK.04',
    title: 'A system we are not ready to describe.',
    intro:
      'Unknown System 03 is a live build held behind internal review. What reaches this page is a designation and a shape — the rest is withheld on purpose, not because it is unfinished.',
    code: 'NODE.X',
    status: 'CLASSIFIED',
    actions: [{ label: 'All work', to: '/work', variant: 'outline' }],
    metrics: [
      { value: 1, label: 'Designation issued' },
      { value: 0, label: 'Surfaces published' },
    ],
  },
  blocks: [
    {
      type: 'redacted',
      scene: 'redaction-matrix',
      eyebrow: 'Withheld',
      title: 'Designation, scope, and surface are suppressed.',
      intro:
        'Each line below is intentionally blacked out. The codes are real and stable; everything attached to them is held until the system is cleared to be named. We would rather show a controlled silhouette than overstate a direction that is still under review.',
      items: [
        { code: 'WRK.04', label: 'Working designation', note: 'Withheld' },
        { code: 'SCP.X', label: 'Scope and domain', note: 'Restricted to internal review' },
        { code: 'SRF.X', label: 'Interface surface', note: 'Suppressed' },
        { code: 'PRT.X', label: 'External parties', note: 'Not disclosed' },
      ],
    },
    {
      type: 'split',
      scene: 'glyph-field',
      eyebrow: 'Metadata',
      code: 'WRK.04.META',
      title: 'What we can hold in the open, kept abstract.',
      body: [
        'We can confirm the shape of the engagement without confirming its subject. The build follows the same data discipline, role model, and access control that every Hanoryx system carries — there is no separate, looser standard for work that stays unnamed.',
        'Access to detail is scoped to internal review. The people who need to see the full picture already have it; the surface here is the version cleared for the outside, and it will stay this thin until the architecture decides otherwise.',
      ],
      asideLabel: 'CONTROLLED METADATA',
      asideCode: 'WRK.04.SCOPE',
      points: [
        { k: 'CLASS', v: 'Restricted detail' },
        { k: 'STATE', v: 'Active under review' },
        { k: 'ACCESS', v: 'Internal review only' },
        { k: 'SURFACE', v: 'Suppressed' },
        { k: 'DISCLOSURE', v: 'Withheld until cleared' },
      ],
    },
    {
      type: 'cta',
      scene: 'concentric-gate',
      eyebrow: 'Open a channel',
      title: 'Request access context.',
      body: 'If your work intersects this node, the relevant context can be shared under the same controls that govern the build. The conversation starts here, not on this page.',
    },
  ],
};

export default page;
