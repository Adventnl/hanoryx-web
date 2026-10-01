const page = {
  key: 'work/north-console',
  title: 'Console Architecture Study',
  accent: '#ff3333',
  hero: {
    scene: 'tooling-console',
    intensity: 'hero',
    eyebrow: 'Work / design study',
    title: 'A console for decisions under load.',
    intro: 'A design study for an internal console that joins action with observable state. The diagrams describe proposed behavior; implementation and deployment status are not public.',
    code: 'NC.STUDY',
    status: 'DESIGN STUDY',
    actions: [
      { label: 'Site engineering', to: '/engineering' },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'dashboard-tiles',
      eyebrow: 'Architecture question',
      code: 'NC.LAYERS',
      title: 'How could one surface join action and evidence?',
      body: [
        'The study groups command, telemetry, deployment, and orchestration as four interface concerns. A real implementation would need each action tied to an identity, a permission boundary, and an audit record.',
        'The value of a unified console is contextual: an operator should see the state behind a decision, take a scoped action, and then verify its effect. The diagrams on this page illustrate that flow only.',
      ],
      asideLabel: 'PROPOSED CONCERNS',
      asideCode: 'NC.MAP',
      points: [
        { k: 'COMMAND', v: 'Actions constrained by role and context' },
        { k: 'OBSERVE', v: 'State and exceptions beside each action' },
        { k: 'RELEASE', v: 'A visible, reversible change path' },
        { k: 'AUDIT', v: 'An accountable history of interventions' },
      ],
    },
    {
      type: 'modules',
      scene: 'command-terminal',
      eyebrow: 'Design requirements',
      title: 'What would have to be proven.',
      intro: 'These are criteria for a future implementation, not a report of running services.',
      rows: [
        { k: 'IDENTITY', v: 'Every control resolves to a named, authorized role.' },
        { k: 'STATE', v: 'Displayed data declares its source and refresh behavior.' },
        { k: 'RECOVERY', v: 'Critical actions have confirmation and rollback paths.' },
        { k: 'TRACE', v: 'Events can be followed from intent through outcome.' },
        { k: 'ACCESS', v: 'Sensitive detail remains behind explicit permissions.' },
      ],
    },
    {
      type: 'cta',
      scene: 'status-pulse-grid',
      eyebrow: 'Engineering',
      title: 'Discuss a real operating problem.',
      body: 'The right console starts with the actual workflow, people, and constraints. Contact Hanoryx to explore a specific system.',
    },
  ],
};

export default page;
