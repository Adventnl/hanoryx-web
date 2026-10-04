const page = {
  key: 'systems/internal-platforms',
  title: 'Internal Platforms',
  accent: '#ff3333',
  aliases: ['dashboards', 'console', 'admin', 'control surface', 'internal dashboards', 'operations'],
  hero: {
    scene: 'dashboard-tiles',
    intensity: 'hero',
    eyebrow: 'Systems / SYS.04',
    title: 'Make operational state legible.',
    intro:
      'An internal platform can join dashboards, administrative controls and workflow actions. This page describes the design model; it does not report a deployed console or service coverage.',
    code: 'SYS.04',
    status: 'DESIGN MODEL',
    actions: [
      { label: 'Internal CRM', to: '/work/internal-crm' },
      { label: 'All systems', to: '/systems', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'consoleComposer',
      anchor: 'compose',
      railLabel: 'Compose a console',
      scene: 'privacy-quiet-grid',
      minHeight: 700,
      eyebrow: 'Compose a console',
      title: 'Four jobs for an internal platform.',
      intro:
        'Switch modules on and off and the console re-flows around them. Change the role, and notice what lock the Administration module takes.',
      modules: [
        { id: 'overview', title: 'Overview', body: 'Summarise the state an operator needs before acting, and when it was last refreshed.', span: 6 },
        { id: 'administration', title: 'Administration', body: 'Keep configuration and access changes apart from day-to-day workflow actions.', span: 3, adminOnly: true },
        { id: 'control', title: 'Control', body: 'Put confirmation, authorisation and a way back around consequential actions.', span: 3 },
        { id: 'exceptions', title: 'Exceptions', body: 'Show what needs attention, why it matters and who can resolve it.', span: 3 },
      ],
      roles: [
        { id: 'operator', label: 'Operator' },
        { id: 'admin', label: 'Administrator' },
      ],
      note: 'Shapes only. The right modules depend on the actual organisation, data and decisions involved.',
    },
    {
      type: 'split',
      anchor: 'flow',
      railLabel: 'Data flow',
      scene: 'topographic-lines',
      eyebrow: 'Data flow',
      code: 'INT.FLOW',
      title: 'A decision should be traceable to its source.',
      body: [
        'Operational data becomes useful when its source, freshness and scope are visible. A dashboard should connect a reading to the record or event behind it.',
        'A control should carry its own context: the state it will change, the identity allowed to change it, and a way to inspect the outcome.',
      ],
      asideLabel: 'PROPOSED FLOW',
      asideCode: 'INT.MAP',
      points: [
        { k: 'SOURCE', v: 'Identify the underlying record or event' },
        { k: 'SCOPE', v: 'Apply the viewing role and task' },
        { k: 'DECIDE', v: 'Show the relevant state and exception' },
        { k: 'ACT', v: 'Gate a change and record the result' },
      ],
    },
    {
      type: 'cta',
      scene: 'architecture-layer',
      eyebrow: 'Next',
      title: 'Start with the operation.',
      body: 'A useful internal platform grows from the real decisions, roles and records it must support.',
      links: [{ label: 'Internal CRM', to: '/work/internal-crm' }],
    },
  ],
};

export default page;
