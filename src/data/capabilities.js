/* ============================================================
   CAPABILITIES — matrix, engineering principles, stack philosophy
   ============================================================ */

export const capabilitiesIntro = {
  eyebrow: 'Capabilities Matrix',
  title: 'A narrow surface, engineered deep.',
  body: 'Hanoryx works across a tight set of disciplines and holds each to the same standard.',
};

/* The capabilities matrix — "level" drives a meter fill (0–100). */
export const capabilities = [
  { id: 'c-01', code: 'CAP.01', label: 'Platform architecture', detail: 'Service boundaries, data models, orchestration.', level: 96 },
  { id: 'c-02', code: 'CAP.02', label: 'Interface systems', detail: 'Component systems, interaction models, design language.', level: 98 },
  { id: 'c-03', code: 'CAP.03', label: 'Automation & orchestration', detail: 'Workflow logic, state machines, internal tooling.', level: 92 },
  { id: 'c-04', code: 'CAP.04', label: 'Operational control', detail: 'Dashboards, telemetry, role-scoped access.', level: 90 },
  { id: 'c-05', code: 'CAP.05', label: 'Commerce & payments', detail: 'Transaction systems, catalog logic, payment workflows.', level: 88 },
  { id: 'c-06', code: 'CAP.06', label: 'Applied prototyping', detail: 'Production-minded prototypes on durable foundations.', level: 94 },
];

/* Engineering principles for the Hanoryx North page. */
export const engineeringPrinciples = [
  { id: 'e-01', code: 'ENG.01', title: 'Foundations first', body: 'Architecture is decided before the surface is drawn. The hard parts are solved at the bottom of the stack.' },
  { id: 'e-02', code: 'ENG.02', title: 'Systems, not screens', body: 'We build interaction languages and component systems, not one-off pages.' },
  { id: 'e-03', code: 'ENG.03', title: 'Scoped by design', body: 'Access, data, and capability are scoped from the first commit, never bolted on.' },
  { id: 'e-04', code: 'ENG.04', title: 'Observable by default', body: 'If it runs in production, it reports. Telemetry is a feature, not an afterthought.' },
  { id: 'e-05', code: 'ENG.05', title: 'Reversible decisions', body: 'We bias toward changes that can be undone, and isolate the ones that cannot.' },
  { id: 'e-06', code: 'ENG.06', title: 'Quiet by default', body: 'Systems surface signal, suppress noise, and stay out of the operator’s way.' },
];

/* System design approach — staged. */
export const designApproach = [
  { id: 'd-01', step: '01', title: 'Map the operation', body: 'Roles, states, flows, and constraints before a single screen.' },
  { id: 'd-02', step: '02', title: 'Lay the architecture', body: 'Data core, orchestration, and interface boundaries decided together.' },
  { id: 'd-03', step: '03', title: 'Build the language', body: 'A component and motion system that scales across the platform.' },
  { id: 'd-04', step: '04', title: 'Harden & observe', body: 'Production-minded foundations, instrumented and monitored from day one.' },
];

/* Stack / tooling philosophy (kept conceptual, not a brag list). */
export const stack = {
  eyebrow: 'Stack & Tooling Philosophy',
  title: 'Tools chosen for control, not fashion.',
  body: 'The stack is deliberately small and deeply understood. We prefer primitives we can reason about over abstractions we cannot.',
  groups: [
    { id: 's-01', label: 'Interface', items: ['Component systems', 'Motion-linked rendering', 'Design tokens'] },
    { id: 's-02', label: 'Platform', items: ['Typed service boundaries', 'Event-driven orchestration', 'Scoped data access'] },
    { id: 's-03', label: 'Operations', items: ['Telemetry & tracing', 'Automated deployment', 'Internal consoles'] },
  ],
};

/* Interface design language summary (North page). */
export const interfaceLanguage = {
  eyebrow: 'Interface Design Language',
  title: 'A controlled visual grammar.',
  body: 'Black surfaces, white type, a single red accent at the threshold of attention. Information is layered, scoped, and revealed — never dumped.',
  rules: [
    { k: 'SURFACE', v: 'Deep black, layered for depth' },
    { k: 'TYPE', v: 'Serif headlines, sans body, mono telemetry' },
    { k: 'ACCENT', v: 'Red — rare, deliberate, alive' },
    { k: 'REVEAL', v: 'Scoped by role, context, intent' },
  ],
};
