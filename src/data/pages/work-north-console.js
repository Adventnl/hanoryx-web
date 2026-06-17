const page = {
  key: 'work/north-console',
  title: 'North Internal Console',
  accent: '#ff3333',
  hero: {
    scene: 'tooling-console',
    intensity: 'hero',
    eyebrow: 'Work // CASE.NC',
    title: 'One console that runs the division — command, telemetry, deployment, and orchestration on a single surface.',
    intro:
      'The North Internal Console is the operating layer for Hanoryx North itself. It is the surface operators use to see every running system, move releases into production, and steer live workloads without leaving the room.',
    code: 'NODE.NC',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Division', to: '/north' },
      { label: 'Work', to: '/work', variant: 'outline' },
    ],
    metrics: [
      { value: 4, label: 'Console layers' },
      { value: 100, suffix: '%', label: 'Services instrumented' },
      { value: 24, suffix: '/7', label: 'Live telemetry' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'dashboard-tiles',
      eyebrow: 'Architecture',
      code: 'NC.CORE',
      title: 'Four control layers folded into one operating surface.',
      body: [
        'The console collapses what is normally four separate tools into a single instrumented view. Command issues scoped actions into running systems; telemetry returns the live state those actions produce; deployment moves builds through gated stages; and orchestration holds the whole choreography together.',
        'Each layer is permission-scoped and writes to a shared action trail, so an operator can intervene in a process, watch the effect arrive, and read exactly who changed what without switching context.',
        'It is internal by design. The console assumes a trusted operator and trades public polish for density, reach, and the ability to act on production directly.',
      ],
      asideLabel: 'LAYERS',
      asideCode: 'NC.MAP',
      points: [
        { k: 'COMMAND', v: 'Scoped actions into live systems' },
        { k: 'TELEMETRY', v: 'State streamed back in real time' },
        { k: 'DEPLOY', v: 'Gated builds into production' },
        { k: 'ORCHESTRATE', v: 'Workloads steered and rerouted' },
        { k: 'TRAIL', v: 'Every action recorded and queryable' },
      ],
    },
    {
      type: 'modules',
      scene: 'command-terminal',
      eyebrow: 'System Status',
      title: 'What the console reports at a glance.',
      intro:
        'The status layer compresses the health of the division into a small set of readings. Each row is live, refreshed against thresholds, and tuned to surface change rather than constant noise.',
      rows: [
        { k: 'SERVICES', v: 'Every running system reporting health, latency, and error rate' },
        { k: 'QUEUES', v: 'Depth and throughput watched against backpressure limits' },
        { k: 'DEPLOYMENTS', v: 'Stage, build identity, and rollback path for each release in flight' },
        { k: 'WORKLOADS', v: 'Active jobs, their owners, and the route they are running' },
        { k: 'ALERTS', v: 'Threshold and anomaly signals escalated to the right operator' },
        { k: 'TRACE', v: 'Request paths followed across services for live diagnosis' },
      ],
    },
    {
      type: 'redacted',
      scene: 'build-pipeline',
      eyebrow: 'Internal Only',
      title: 'Modules that stay behind the wall.',
      intro:
        'Parts of the console operate on systems that are not public. These entries are kept abstract on purpose — a code, a shape, and nothing that would expose an internal capability before it is meant to be seen.',
      items: [
        { code: 'NC.X1', label: 'Privileged actions', note: 'A command class reserved for operators with elevated scope. Its surface and effects are suppressed outside the division.' },
        { code: 'NC.X2', label: 'Internal orchestration', note: 'Routing logic that steers workloads across systems we have not disclosed. The map exists; the labels do not leave the console.' },
        { code: 'NC.X3', label: 'Restricted telemetry', note: 'A reporting channel wired to research-stage systems. Visible only where the operator is cleared to read it.' },
      ],
    },
    {
      type: 'cta',
      scene: 'status-pulse-grid',
      eyebrow: 'Open a channel',
      title: 'Brief us on an operating layer.',
      body: 'Bring an operation that has outgrown its tools. We build the console that lets operators see it, steer it, and trust what it reports.',
    },
  ],
};

export default page;
