const page = {
  key: 'systems/internal-platforms',
  title: 'Internal Platforms',
  accent: '#ff3333',
  hero: {
    scene: 'dashboard-tiles',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.04',
    title: 'Internal consoles that turn live operational state into decisions.',
    intro:
      'Dashboards, admin surfaces, and control panels engineered as a single instrumented layer over the operation. Built for operators who need signal, scope, and reach in one place.',
    code: 'NODE.04',
    status: 'OPERATIONAL',
    actions: [
      { label: 'All systems', to: '/systems', variant: 'outline' },
      { label: 'Open a channel', to: '/north' },
    ],
    metrics: [
      { value: 3, label: 'Console layers' },
      { value: 90, suffix: '%', label: 'Coverage instrumented' },
      { value: 4, label: 'Control surfaces' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'status-pulse-grid',
      eyebrow: 'Surfaces',
      title: 'Dashboard, admin, and control modules.',
      intro:
        'An internal platform is assembled from a small set of hardened modules. Each one is scoped, instrumented, and built to be read at a glance under load.',
      items: [
        {
          code: 'INT.01',
          label: 'Dashboard',
          title: 'Operational dashboard',
          body: 'A dense, live view of system state — throughput, queues, and exceptions resolved into a single reading surface. No noise, only the metrics that change a decision.',
          tags: ['Telemetry', 'Live state'],
          status: 'OPERATIONAL',
        },
        {
          code: 'INT.02',
          label: 'Admin',
          title: 'Administrative console',
          body: 'The authority surface for an operation: configuration, role assignment, and record control held behind strict, scoped permissions and a full action trail.',
          tags: ['Roles', 'Records'],
          status: 'OPERATIONAL',
        },
        {
          code: 'INT.03',
          label: 'Control',
          title: 'Control panel',
          body: 'Direct intervention into running processes — pause, retry, reroute. Every control is gated, reversible where possible, and logged the moment it is used.',
          tags: ['Intervention', 'Audit'],
          status: 'OPERATIONAL',
        },
        {
          code: 'INT.04',
          label: 'Alerting',
          title: 'Signal & escalation',
          body: 'Thresholds and anomaly rules surface what needs attention and escalate to the right role. Alerting is tuned to suppress the routine and raise the rare.',
          tags: ['Alerts', 'Escalation'],
          status: 'OPERATIONAL',
        },
      ],
    },
    {
      type: 'split',
      scene: 'heatmap-control',
      eyebrow: 'Capability',
      code: 'INT.DEC',
      title: 'Live data, resolved into a decision.',
      body: [
        'Raw operational data is constant and shapeless. The work of an internal platform is to compress it — into a state an operator can read in seconds and act on with confidence.',
        'Streams are aggregated, scoped to the viewing role, and rendered against the thresholds that matter. The console does not show everything; it shows what would change what you do next.',
        'When a metric crosses a line, the surface moves the operator toward the action — not just the number — so decisions stay close to the data that drives them.',
      ],
      asideLabel: 'PIPELINE',
      asideCode: 'INT.FLOW',
      points: [
        { k: 'INGEST', v: 'Live event streams' },
        { k: 'AGGREGATE', v: 'Rolled into state' },
        { k: 'SCOPE', v: 'Filtered by role' },
        { k: 'THRESHOLD', v: 'Measured against limits' },
        { k: 'ACT', v: 'Routed to a decision' },
      ],
    },
    {
      type: 'modules',
      scene: 'data-interface-wave',
      eyebrow: 'Platform',
      title: 'Platform capabilities.',
      intro:
        'What every internal platform carries by default — the standard fittings of a console built to be trusted in production.',
      rows: [
        { k: 'REAL-TIME', v: 'Live state with sub-second refresh on critical surfaces' },
        { k: 'ROLE SCOPE', v: 'Views, controls, and data filtered per role from the first commit' },
        { k: 'AUDIT TRAIL', v: 'Every administrative and control action recorded and queryable' },
        { k: 'TELEMETRY', v: 'Instrumented coverage across services, queues, and workflows' },
        { k: 'ALERTING', v: 'Threshold and anomaly rules with role-aware escalation' },
        { k: 'EXPORT', v: 'Structured extracts for reporting and downstream systems' },
      ],
    },
    {
      type: 'cta',
      scene: 'architecture-layer',
      eyebrow: 'Open a channel',
      title: 'Discuss an internal platform.',
      body: 'Bring us the operation and the data it already produces. We will design the console that makes it legible.',
    },
  ],
};

export default page;
