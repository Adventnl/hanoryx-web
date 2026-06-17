const page = {
  key: 'systems/automation',
  title: 'Automation Systems',
  accent: '#ff3333',
  hero: {
    scene: 'network-constellation',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.03',
    title: 'Automation that holds operational state predictable.',
    intro:
      'Rule-based orchestration that removes manual steps, enforces sequence, and writes a record of every run. Work moves on defined conditions, not on memory.',
    code: 'NODE.AUTO',
    status: 'ACTIVE',
    actions: [{ label: 'All systems', to: '/systems', variant: 'outline' }],
    metrics: [
      { value: 4, label: 'Execution stages' },
      { value: 100, suffix: '%', label: 'Runs logged' },
      { value: 0, label: 'Silent failures' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'circuit-trace',
      eyebrow: 'Capability',
      code: 'AUTO.01',
      title: 'Rule-based workflow orchestration.',
      body: [
        'An automation system is a set of explicit rules over operational state — each one with a trigger, a condition, and a defined action. Nothing fires implicitly.',
        'Workflows are versioned and inspectable. When a rule changes, the change is recorded; when a run executes, its path through the rules is reconstructable from the log.',
        'The orchestration layer sits above the data core, so automation never bypasses access control or writes outside the structured record.',
      ],
      asideLabel: 'ORCHESTRATION',
      asideCode: 'AUTO.MAP',
      points: [
        { k: 'TRIGGER', v: 'Event and schedule sources' },
        { k: 'CONDITION', v: 'Guarded rule evaluation' },
        { k: 'ACTION', v: 'Idempotent execution' },
        { k: 'STATE', v: 'Single source of truth' },
        { k: 'LOG', v: 'Append-only run record' },
      ],
    },
    {
      type: 'process',
      scene: 'vector-compass',
      eyebrow: 'Flow',
      title: 'How a rule resolves.',
      intro: 'Every automated action follows the same four-stage path. No stage is skipped, and each one is observable.',
      steps: [
        {
          step: '01',
          title: 'Trigger',
          body: 'An event, schedule, or state change enters the orchestration layer with its full context attached.',
        },
        {
          step: '02',
          title: 'Condition',
          body: 'Guards evaluate the current state. If the rule does not hold, execution stops cleanly and the decision is recorded.',
        },
        {
          step: '03',
          title: 'Action',
          body: 'The action runs idempotently against the data core, so a repeated trigger never produces a duplicated effect.',
        },
        {
          step: '04',
          title: 'Log',
          body: 'Trigger, condition outcome, and action result are written to an append-only record for audit and replay.',
        },
      ],
    },
    {
      type: 'cards',
      scene: 'heatmap-grid',
      eyebrow: 'Surfaces',
      title: 'What automation removes.',
      intro: 'Four patterns that turn repeated manual effort into controlled, observable execution.',
      items: [
        {
          code: 'AU.01',
          title: 'Repetition compression',
          body: 'Recurring manual sequences collapse into a single rule. The work happens once in design and then runs on demand without re-entry.',
          tags: ['Rules', 'Reuse'],
        },
        {
          code: 'AU.02',
          title: 'Alerts',
          body: 'Conditions watch operational state and surface a signal the moment a threshold is crossed — routed to the role that can act on it.',
          tags: ['Signals', 'Routing'],
        },
        {
          code: 'AU.03',
          title: 'Scheduled execution',
          body: 'Time-bound jobs run on a defined cadence with overlap protection, so a long run never collides with the next window.',
          tags: ['Schedule', 'Cadence'],
        },
        {
          code: 'AU.04',
          title: 'Structured runs',
          body: 'Every execution is a record: inputs, decisions, and outputs preserved together so any run can be inspected or replayed.',
          tags: ['Audit', 'Replay'],
        },
      ],
    },
    { type: 'cta', scene: 'polar-radar', eyebrow: 'Open a channel', title: 'Discuss an automation layer.' },
  ],
};

export default page;
