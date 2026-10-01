const page = {
  key: 'systems/client-portals',
  title: 'Client-Facing Portals',
  accent: '#ff3333',
  hero: {
    scene: 'client-portal-gate',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.06',
    title: 'A controlled gateway between an operation and the people it serves.',
    intro: 'A design model for role-aware access to records and workflows. The examples below describe proposed boundaries, not a deployed portal or verified security controls.',
    code: 'SYS.06',
    status: 'ACTIVE',
    actions: [
      { label: 'All systems', to: '/systems', variant: 'outline' },
    ],
    metrics: [
      { value: 0, suffix: '', label: 'Standing access by default' },
      { value: 100, suffix: '%', label: 'Surfaces scoped to role' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'secure-boundary',
      eyebrow: 'Boundary',
      code: 'PRT.01',
      title: 'The line between inside and outside is engineered, not assumed.',
      body: [
        'An operation can hold far more state than any one visitor should see. A portal should define a narrow view of relevant records and actions without exposing the underlying system.',
        'The design starts by asking what each role can read, change, and request. The boundary must be implemented and tested in the backend; an interface alone cannot enforce it.',
      ],
      asideLabel: 'BOUNDARY',
      asideCode: 'PRT.MAP',
      points: [
        { k: 'INSIDE', v: 'Full operational state' },
        { k: 'MEMBRANE', v: 'Scoped portal surface' },
        { k: 'OUTSIDE', v: 'Role-bound visitor' },
        { k: 'RULE', v: 'Reach stops at scope' },
      ],
    },
    {
      type: 'cards',
      scene: 'permission-orbit',
      eyebrow: 'Capabilities',
      title: 'What a portal does.',
      intro: 'Four responsibilities to address when designing a portal. Their presence here is not evidence that a particular deployment has these controls.',
      items: [
        { code: 'PC.01', title: 'Scoped views', body: 'Define the records and fields a visitor needs for a task. Filter at the data boundary, then present the resulting view clearly.', tags: ['Projection', 'Scope'] },
        { code: 'PC.02', title: 'Handoff', body: 'Plan how documents, approvals, and payment-related records move between parties, including who can see a transfer and how it is recorded.', tags: ['Trace', 'Transfer'] },
        { code: 'PC.03', title: 'Role access', body: 'Resolve permissions against identity, role, and record on each request. Test what happens when a role changes or access is revoked.', tags: ['Permission', 'Roles'] },
        { code: 'PC.04', title: 'System boundary', body: 'Put reads and writes behind explicit service rules. Review the routes that could bypass the intended scope.', tags: ['Boundary', 'Review'] },
      ],
    },
    {
      type: 'modules',
      scene: 'radar-cutaway',
      eyebrow: 'Access Model',
      title: 'How reach is decided.',
      intro: 'A request model to specify and test before returning a record or accepting a change.',
      rows: [
        { k: 'AM.01', v: 'Identity — who is making the request' },
        { k: 'AM.02', v: 'Role — the function they hold in the operation' },
        { k: 'AM.03', v: 'Scope — the set of records that role may reach' },
        { k: 'AM.04', v: 'Action — read, request, or sanctioned write' },
        { k: 'AM.05', v: 'Boundary — where reach is denied and logged' },
      ],
    },
    { type: 'cta', scene: 'status-pulse-grid', eyebrow: 'Open a channel', title: 'Discuss a client-facing portal.', body: 'Bring an operation that needs to expose a controlled surface to the people it serves.' },
  ],
};

export default page;
