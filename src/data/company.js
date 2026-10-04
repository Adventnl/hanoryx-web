/* ============================================================
   COMPANY — identity, operating principles and the development team
   ============================================================ */

export const company = {
  name: 'Hanoryx Systems',
  shortName: 'Hanoryx',
  division: 'Hanoryx North',
  email: 'contact@hanoryx.com',
  status: 'Live',
};

/* The operating doctrine — short, declarative, restrained. */
export const operatingPrinciples = [
  { id: 'p-01', index: '01', title: 'Controlled complexity', body: 'Depth is engineered, never improvised. Systems hold weight without leaking it to the surface.' },
  { id: 'p-02', index: '02', title: 'Interfaces before noise', body: 'A surface should resolve intent in a single read. Everything that does not serve clarity is removed.' },
  { id: 'p-03', index: '03', title: 'Motion with purpose', body: 'Movement carries meaning — state, direction, hierarchy. Nothing moves to decorate.' },
  { id: 'p-04', index: '04', title: 'Architecture that can expand', body: 'Foundations are laid for systems that have not been announced yet. Growth is a property, not a rewrite.' },
  { id: 'p-05', index: '05', title: 'Reveal only what is needed', body: 'Access is scoped. Information surfaces by role, by context, by intent — never by default.' },
  { id: 'p-06', index: '06', title: 'Production-minded prototypes', body: 'Fast iteration on foundations that are already built to survive contact with real operations.' },
];

/* Hanoryx North — the engineering division. */
export const north = {
  eyebrow: 'Hanoryx North // Engineering Division',
  title: 'The software development division behind Hanoryx Systems.',
  lead: 'North focuses on platform architecture, interface systems, operational tools, and production-minded software development.',

  mission: {
    title: 'Mission',
    body: [
      'Hanoryx North builds the systems Hanoryx Systems runs on — and the systems it intends to run on next.',
      'The division operates as a single, tightly-scoped engineering surface: architecture, interface, orchestration, and tooling held under one design language.',
    ],
  },

  pillars: [
    { id: 'n-01', code: 'N.ARCH', title: 'Platform architecture', body: 'Service boundaries, data models, and orchestration layers designed to carry operational load without ceremony.' },
    { id: 'n-02', code: 'N.IFACE', title: 'Interface systems', body: 'Component systems and interaction models built as a controlled language, not a collection of screens.' },
    { id: 'n-03', code: 'N.ORCH', title: 'Orchestration & automation', body: 'Internal tooling that removes manual operational drag and keeps multi-role coordination predictable.' },
    { id: 'n-04', code: 'N.PROTO', title: 'Production-minded prototyping', body: 'Applied software engineering that ships fast, then hardens — foundations first, surface second.' },
  ],

  motion: {
    eyebrow: 'Motion Philosophy',
    title: 'Flow like a river.',
    body: [
      'Motion at Hanoryx is continuous, quiet, and high-control. Interfaces breathe, drift, scan, and resolve — they do not shake.',
      'Every transition is a statement about state. We use acceleration to imply weight, easing to imply intention, and stillness to imply readiness.',
    ],
    notes: [
      { k: 'CADENCE', v: 'Slow, scrubbed, scroll-linked' },
      { k: 'ACCENT', v: 'Red, used at the threshold of attention' },
      { k: 'GLITCH', v: 'Rare — a signal, never a texture' },
      { k: 'IDLE', v: 'Never static — the system is always alive' },
    ],
  },
};
