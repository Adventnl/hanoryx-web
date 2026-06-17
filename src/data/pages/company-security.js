const page = {
  key: 'company/security',
  title: 'Security Posture',
  accent: '#ff3333',
  hero: {
    scene: 'secure-boundary',
    intensity: 'hero',
    eyebrow: 'Company // SEC',
    title: 'Security is a property of the architecture, not a layer bolted on at the end.',
    intro:
      'How Hanoryx Systems reasons about secure channels, scoped access, and data boundaries — described conceptually. This is a posture, not a claim against any specific standard or certification.',
    code: 'NODE.SEC',
    status: 'OPERATIONAL',
    actions: [{ label: 'Open a channel', to: '/contact', variant: 'outline' }],
    metrics: [
      { value: 3, label: 'Boundary axes' },
      { value: 100, suffix: '%', label: 'Access scoped by role' },
      { value: 1, label: 'Single record owner' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'client-portal-gate',
      eyebrow: 'Foundations',
      code: 'SEC.01',
      title: 'Secure channels, scoped access, and data boundaries.',
      body: [
        'Security is decided where the boundaries are drawn. Channels between surfaces are encrypted in transit and treated as untrusted until a request proves its scope — nothing is granted because it arrived from the right place.',
        'Access is scoped by role and context rather than handed out by default. A request reaches only the records its identity is entitled to, and every elevated action passes through an explicit gate before it touches state.',
        'Data boundaries are the strictest line in the system. Records are owned in one place, written through one path, and read through scoped contracts — so nothing reaches a surface that has not crossed a boundary built to refuse it.',
      ],
      asideLabel: 'POSTURE',
      asideCode: 'SEC.MAP',
      points: [
        { k: 'CHANNEL', v: 'Encrypted, untrusted until scoped' },
        { k: 'ACCESS', v: 'Role and context, never default' },
        { k: 'BOUNDARY', v: 'Single writer, scoped reads' },
        { k: 'ELEVATION', v: 'Explicit gate, recorded' },
        { k: 'DEFAULT', v: 'Deny — grant is the exception' },
      ],
    },
    {
      type: 'modules',
      scene: 'permission-orbit',
      eyebrow: 'Model',
      title: 'Access model, data boundaries, operational control.',
      intro:
        'The three axes a system is reasoned about on: who may act, what may be reached, and how the operation itself is held under control. These are design principles, not assertions of conformance to any named framework.',
      groups: [
        {
          label: 'Access Model',
          items: [
            'Role-based scoping decided from the first commit',
            'Least privilege — identities reach only what they need',
            'Elevation gated, explicit, and never implicit',
            'Sessions scoped, expiring, and revocable',
          ],
        },
        {
          label: 'Data Boundaries',
          items: [
            'Single writer per record, one canonical path in',
            'Reads served through typed, scoped contracts',
            'Records isolated by tenant and by role',
            'Nothing surfaces that has not crossed a boundary',
          ],
        },
        {
          label: 'Operational Control',
          items: [
            'Sensitive actions recorded as an auditable trail',
            'Configuration and secrets held outside the codebase',
            'Failure isolated to the layer that raised it',
            'Change reviewed before it reaches production state',
          ],
        },
      ],
    },
    {
      type: 'cards',
      scene: 'radar-cutaway',
      eyebrow: 'Concepts',
      title: 'The security concepts a system is built around.',
      intro:
        'Abstract and stated honestly. These describe how systems are engineered — not a badge, audit result, or compliance claim against any specific standard.',
      items: [
        {
          code: 'SEC.A',
          label: 'Access',
          title: 'Role-based access',
          body: 'Every identity carries a role, and every role defines a scope. Permission is checked at the boundary on each request, so what a user can do is a property of the system rather than a setting that drifts.',
          tags: ['Roles', 'Scope'],
          status: 'OPERATIONAL',
        },
        {
          code: 'SEC.B',
          label: 'Data',
          title: 'Scoped data',
          body: 'Records are partitioned and filtered to the requesting context before they ever leave the core. A surface receives the slice it is entitled to and no more — isolation is enforced below the interface, not above it.',
          tags: ['Isolation', 'Contracts'],
          status: 'OPERATIONAL',
        },
        {
          code: 'SEC.C',
          label: 'Audit',
          title: 'Audit records',
          body: 'Sensitive and administrative actions are written to an append-only trail with actor, time, and intent. The record exists to make a system accountable to itself — who did what, when, and against which entity.',
          tags: ['Trail', 'Accountability'],
          status: 'OPERATIONAL',
        },
        {
          code: 'SEC.D',
          label: 'Channel',
          title: 'Secure channels',
          body: 'Transport between surfaces is encrypted and authenticated. A channel is treated as a conduit, not a trust signal: a request still has to prove its scope after it arrives, every time.',
          tags: ['Transit', 'Authenticated'],
          status: 'OPERATIONAL',
        },
      ],
    },
    {
      type: 'cta',
      scene: 'concentric-gate',
      eyebrow: 'Open a channel',
      title: 'Ask about a security posture.',
      body: 'Bring the operation and the data it holds. We will reason through the boundaries, access model, and controls it needs — plainly, with no claims we cannot stand behind.',
    },
  ],
};

export default page;
