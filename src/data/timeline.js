/* ============================================================
   TIMELINE — system roadmap nodes (no explicit dates)
   ============================================================ */

export const timelineIntro = {
  eyebrow: 'Roadmap',
  title: 'A system roadmap, not a history.',
  body: 'From the first commerce layer to unannounced programs — phases revealed only as far as they are ready to be seen.',
};

export const timelineNodes = [
  {
    id: 't-01',
    code: 'PHASE.01',
    phase: 'Initial systems phase',
    title: 'Commerce System I',
    body: 'The first operational system — commerce infrastructure carrying catalog, transactions, and payment workflows.',
    status: 'COMPLETE',
    redacted: false,
  },
  {
    id: 't-02',
    code: 'PHASE.02',
    phase: 'Operational platform phase',
    title: 'Musebase',
    body: 'An advanced management platform — a structured operating layer for complex coordination across scheduling, communication, records, and payments.',
    status: 'ACTIVE',
    redacted: false,
  },
  {
    id: 't-03',
    code: 'PHASE.03',
    phase: 'North research phase',
    title: 'North Internal Console',
    body: 'Internal orchestration and telemetry tooling — the control surface the division operates from.',
    status: 'OPERATIONAL',
    redacted: false,
  },
  {
    id: 't-04',
    code: 'PHASE.04',
    phase: 'Classified system branch',
    title: 'Unknown System 03',
    body: 'Detail suppressed. Architecture under internal review.',
    status: 'CLASSIFIED',
    redacted: true,
  },
  {
    id: 't-05',
    code: 'PHASE.05',
    phase: 'Unannounced interface program',
    title: 'Experimental Interface Program',
    body: 'A research node held below the surface. Revealed when ready.',
    status: 'WITHHELD',
    redacted: true,
  },
];
