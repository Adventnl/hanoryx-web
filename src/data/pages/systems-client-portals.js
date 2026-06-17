const page = {
  key: 'systems/client-portals',
  title: 'Client-Facing Portals',
  accent: '#ff3333',
  hero: {
    scene: 'client-portal-gate',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.06',
    title: 'A controlled gateway between an operation and the people it serves.',
    intro: 'Client-facing portals expose exactly the surface a person is meant to see — scoped by role, bounded by permission, and held under the same access discipline as the core.',
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
        'An operation holds far more state than any single person it serves should ever see. A portal is the deliberate membrane between the two — it grants a scoped view onto live records without opening the system behind it.',
        'Each role is modelled from the first commit: what it can read, what it can act on, and where its reach stops. Nothing leaks across the boundary by accident, because the boundary is part of the architecture.',
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
      intro: 'Four functions define a Hanoryx portal. Each is a control, not a convenience.',
      items: [
        { code: 'PC.01', title: 'Scoped views', body: 'A person sees a projection of live operational data shaped to their role — current records, status, and history, with everything outside their scope simply absent rather than hidden.', tags: ['Projection', 'Live'] },
        { code: 'PC.02', title: 'Secure handoff', body: 'Documents, approvals, and payment-relevant records cross the boundary through controlled handoff points with a full audit trail, never through open channels.', tags: ['Audit', 'Transfer'] },
        { code: 'PC.03', title: 'Role access', body: 'Permission is granted per role and per record, resolved at request time. A change to a role updates every surface that role touches, with no stale access left behind.', tags: ['Permission', 'Roles'] },
        { code: 'PC.04', title: 'Controlled boundary', body: 'The portal is sealed against the operational core. It can read what it is allowed to read and write only through sanctioned paths — the system behind it stays out of reach.', tags: ['Sealed', 'Bounded'] },
      ],
    },
    {
      type: 'modules',
      scene: 'radar-cutaway',
      eyebrow: 'Access Model',
      title: 'How reach is decided.',
      intro: 'Every request is resolved against the same model — identity, role, scope, and record — before a single field is returned.',
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
