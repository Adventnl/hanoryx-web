const page = {
  key: 'company/security',
  title: 'Security Approach',
  accent: '#ff3333',
  hero: {
    scene: 'secure-boundary',
    intensity: 'hero',
    eyebrow: 'Company / security approach',
    title: 'Security starts at the boundary.',
    intro: 'The principles below describe how Hanoryx approaches system design. They are not a certification, audit result, penetration-test report, or claim about controls in an undisclosed deployment.',
    code: 'SEC.APPROACH',
    status: 'DESIGN PRINCIPLES',
    actions: [{ label: 'Discuss a project', to: '/contact', variant: 'outline' }],
  },
  blocks: [
    {
      type: 'split',
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
      type: 'modules',
      scene: 'permission-orbit',
      eyebrow: 'Design checklist',
      title: 'Questions for an implementation review.',
      intro: 'These are review prompts. Their presence here does not assert that a particular product has passed them.',
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
    },
    {
      type: 'cta',
      scene: 'concentric-gate',
      eyebrow: 'Contact',
      title: 'Discuss the actual boundary.',
      body: 'Bring the data, people, and workflow involved. A useful security review begins with the system that exists or is being designed.',
    },
  ],
};

export default page;
