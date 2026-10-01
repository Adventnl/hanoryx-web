// Principles and process used by the existing North overview pages. These are
// an approach to engineering, not a maturity score or deployment claim.
export const engineeringPrinciples = [
  { id: 'e-01', code: 'ENG.01', title: 'Foundations first', body: 'Start with the data model, constraints, and service boundaries before committing to an interface.' },
  { id: 'e-02', code: 'ENG.02', title: 'Systems, not screens', body: 'Design interactions and reusable components for the workflow rather than isolated page states.' },
  { id: 'e-03', code: 'ENG.03', title: 'Scoped by design', body: 'Model roles, access, and data ownership as part of the architecture.' },
  { id: 'e-04', code: 'ENG.04', title: 'Observe what matters', body: 'Identify the signals needed to understand behavior and failure before a system is released.' },
  { id: 'e-05', code: 'ENG.05', title: 'Reversible decisions', body: 'Prefer changes with a recovery path and isolate those that cannot be undone.' },
  { id: 'e-06', code: 'ENG.06', title: 'Quiet by default', body: 'Surface useful state without turning every screen into an alarm.' },
];

export const designApproach = [
  { id: 'd-01', step: '01', title: 'Map the operation', body: 'Record roles, states, flows, and constraints before drawing a screen.' },
  { id: 'd-02', step: '02', title: 'Lay the architecture', body: 'Describe data ownership, workflow, and interface boundaries together.' },
  { id: 'd-03', step: '03', title: 'Build the language', body: 'Create components and motion behavior that can be tested across states.' },
  { id: 'd-04', step: '04', title: 'Harden and observe', body: 'Plan failure behavior, access checks, and useful diagnostics before release.' },
];
