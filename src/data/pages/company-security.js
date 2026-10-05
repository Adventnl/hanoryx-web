const page = {
  key: 'company/security',
  title: 'Security Approach',
  accent: '#ff3333',
  aliases: ['security', 'boundary', 'access control', 'review checklist', 'authorization'],
  hero: {
    scene: 'secure-boundary',
    intensity: 'hero',
    eyebrow: 'Company / Security approach',
    title: 'Security starts at the boundary.',
    intro:
      'The principles below describe how Hanoryx approaches system design. They are not a certification, audit result, penetration-test report, or claim about controls in any undisclosed deployment.',
    code: 'CMP.02',
    status: 'DESIGN PRINCIPLES',
    actions: [{ label: 'Trust centre', to: '/trust' }, { label: 'Security disclosure', to: '/trust/disclosure', variant: 'outline' }],
  },
  blocks: [
    {
      type: 'split',
      anchor: 'foundations',
      railLabel: 'Foundations',
      scene: 'client-portal-gate',
      eyebrow: 'Foundations',
      code: 'SEC.01',
      title: 'Define what can cross each boundary.',
      body: [
        'A system design should identify who can act, what data each role can reach, and which services own a record. Those decisions belong in the architecture before interface controls are drawn.',
        'Transport protection, identity checks, scoped authorization, and an accountable change path are separate concerns. A secure channel does not by itself authorize a request.',
        'Implementation and verification depend on the specific project. Public documentation for a project should name the actual controls and evidence available for that system.',
      ],
      asideLabel: 'REVIEW AREAS',
      asideCode: 'SEC.MAP',
      points: [
        { k: 'IDENTITY', v: 'Who is making the request?' },
        { k: 'SCOPE', v: 'What may this identity reach?' },
        { k: 'OWNERSHIP', v: 'Where is the record controlled?' },
        { k: 'CHANGE', v: 'How is an action reviewed and traced?' },
      ],
    },
    {
      type: 'signature',
      kind: 'boundaryReview',
      anchor: 'review',
      railLabel: 'Review checklist',
      scene: 'permission-orbit',
      minHeight: 640,
      eyebrow: 'Design checklist',
      title: 'Questions for an implementation review.',
      intro:
        'Work through them for a system you are building. These are review prompts: their presence here does not assert that any particular product has passed them.',
      groups: [
        {
          label: 'Access',
          items: [
            'Is authorization enforced at the service boundary?',
            'Are privileged roles and elevation paths explicit?',
            'Can access be revoked without relying on interface state?',
          ],
        },
        {
          label: 'Data',
          items: [
            'Does each record have a defined owner?',
            'Are reads scoped before data reaches a client?',
            'Are retention and deletion requirements documented?',
          ],
        },
        {
          label: 'Operations',
          items: [
            'Are sensitive actions traceable to an actor and time?',
            'Are secrets kept outside published source and client bundles?',
            'Can the system recover safely from a failed change?',
          ],
        },
      ],
      note: 'A thinking aid. It does not assess any real system, and nothing you tick is stored or sent.',
    },
    {
      type: 'closer',
      kind: 'gateRun',
      scene: 'concentric-gate',
      tag: 'End of the security approach',
      minHeight: 600,
      title: 'Send a request through the gates.',
      lede: 'The four review areas are four questions. Pick a request and watch where, if anywhere, it is turned back.',
      gates: [
        { id: 'identity', label: 'Identity', ask: 'Who is making the request?' },
        { id: 'scope', label: 'Scope', ask: 'What may this identity reach?' },
        { id: 'ownership', label: 'Ownership', ask: 'Whose record is it?' },
        { id: 'change', label: 'Change', ask: 'Is the action traceable?' },
      ],
      scenarios: [
        { id: 'own', label: 'A customer reads their own order', passes: [true, true, true, true], note: 'A signed-in customer asks for an order they placed.' },
        { id: 'other', label: 'A customer reads someone else’s order', passes: [true, true, false, true], note: 'A signed-in customer asks for an order number that is not theirs.', why: 'The record belongs to someone else, so the read is refused at the service, before any data leaves it.' },
        { id: 'admin', label: 'A signed-out visitor opens the admin screen', passes: [false, true, true, true], note: 'Nobody has signed in.', why: 'No identity was presented, so nothing else is even asked.' },
        { id: 'export', label: 'A service account exports every record', passes: [true, false, true, true], note: 'A background service asks for everything.', why: 'Its role covers reading one table, not exporting all of them.' },
        { id: 'edit', label: 'An edit that leaves no trace', passes: [true, true, true, false], note: 'A permitted edit, made through a path that records nothing.', why: 'An action that cannot be traced to an actor and a time is not allowed to complete.' },
        { id: 'refund', label: 'A support agent refunds an order', passes: [true, true, true, true], note: 'An agent with the refund role acts on a customer’s order.' },
      ],
      onward: [{ label: 'Trust centre', to: '/trust' }, { label: 'Security disclosure', to: '/trust/disclosure' }],
    },
  ],
};

export default page;
