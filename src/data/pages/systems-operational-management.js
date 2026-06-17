const page = {
  key: 'systems/operational-management',
  title: 'Operational Management',
  accent: '#ff3333',
  hero: {
    scene: 'orbital-node',
    eyebrow: 'Systems // SYS.01',
    title: 'Operational management platforms.',
    intro: 'Structured operating layers for scheduling, communication, records, and multi-role coordination.',
    code: 'SYS.01',
    status: 'ACTIVE',
    actions: [{ label: 'All systems', to: '/systems', variant: 'outline' }],
  },
  blocks: [
    {
      type: 'split',
      scene: 'wave-interference',
      eyebrow: 'Capability',
      code: 'OPS.01',
      title: 'Coordination, held under control.',
      body: [
        'An operational management platform turns scattered scheduling, communication, and record-keeping into one predictable surface.',
        'Roles, permissions, and workflow state are modelled from the first commit — so complexity is engineered, never improvised.',
      ],
      asideLabel: 'MODULES',
      asideCode: 'OPS.MAP',
      points: [
        { k: 'SCHED', v: 'Scheduling logic' },
        { k: 'COMMS', v: 'Communication surfaces' },
        { k: 'RECORDS', v: 'Structured records' },
        { k: 'ROLES', v: 'Permission model' },
        { k: 'FLOW', v: 'Workflow orchestration' },
      ],
    },
    {
      type: 'process',
      scene: 'circuit-trace',
      eyebrow: 'Flow',
      title: 'How an operation moves.',
      steps: [
        { step: '01', title: 'Intake', body: 'Requests enter the system with role, context, and intent attached.' },
        { step: '02', title: 'Schedule', body: 'Scheduling logic resolves time, resource, and dependency constraints.' },
        { step: '03', title: 'Coordinate', body: 'Communication surfaces keep every role aligned to current state.' },
        { step: '04', title: 'Record', body: 'Every action is written to the structured record for later control.' },
      ],
    },
    {
      type: 'cards',
      scene: 'hex-lattice',
      eyebrow: 'Surfaces',
      title: 'Control surfaces.',
      items: [
        { code: 'CS.01', title: 'Scheduling matrix', body: 'A dense view of time, resource, and dependency in one grid.' },
        { code: 'CS.02', title: 'Communication layer', body: 'Role-scoped messaging tied to operational state.' },
        { code: 'CS.03', title: 'Records & permissions', body: 'A queryable record under strict, role-based access.' },
      ],
    },
    { type: 'cta', scene: 'polar-radar', eyebrow: 'Open a channel', title: 'Discuss an operating layer.' },
  ],
};

export default page;
