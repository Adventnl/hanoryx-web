const page = {
  key: 'systems/internal-platforms',
  title: 'Internal Platforms',
  accent: '#ff3333',
  hero: {
    scene: 'dashboard-tiles',
    intensity: 'hero',
    eyebrow: 'Systems / internal platforms',
    title: 'Make operational state legible.',
    intro: 'An internal platform can join dashboards, administrative controls, and workflow actions. This page describes the design model; it does not report a deployed Hanoryx console or service coverage.',
    code: 'SYS.INTERNAL',
    status: 'CAPABILITY MODEL',
    actions: [
      { label: 'Console design study', to: '/work/north-console' },
      { label: 'All systems', to: '/systems', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'status-pulse-grid',
      eyebrow: 'Interface concerns',
      title: 'Four jobs for an internal platform.',
      intro: 'The right modules depend on the actual organization, data, and decisions involved.',
      items: [
        {
          code: 'INT.01',
          title: 'Overview',
          body: 'Summarize the state an operator needs before acting, and identify when the displayed data was last refreshed.',
          tags: ['State', 'Context'],
          status: 'DESIGN AREA',
        },
        {
          code: 'INT.02',
          title: 'Administration',
          body: 'Separate configuration and access changes from day-to-day workflow actions.',
          tags: ['Roles', 'Configuration'],
          status: 'DESIGN AREA',
        },
        {
          code: 'INT.03',
          title: 'Control',
          body: 'Put confirmation, authorization, and recovery paths around consequential actions.',
          tags: ['Intervention', 'Recovery'],
          status: 'DESIGN AREA',
        },
        {
          code: 'INT.04',
          title: 'Exceptions',
          body: 'Show what requires attention, why it matters, and who can resolve it.',
          tags: ['Alerts', 'Ownership'],
          status: 'DESIGN AREA',
        },
      ],
    },
    {
      type: 'split',
      scene: 'heatmap-control',
      eyebrow: 'Data flow',
      code: 'INT.FLOW',
      title: 'A decision should be traceable to its source.',
      body: [
        'Operational data becomes useful when its source, freshness, and scope are visible. A dashboard should connect a reading to the record or event behind it.',
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
      eyebrow: 'Contact',
      title: 'Start with the operation.',
      body: 'A useful internal platform grows from the real decisions, roles, and records it must support.',
    },
  ],
};

export default page;
