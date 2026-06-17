const page = {
  key: 'company/status',
  title: 'Status',
  accent: '#ff3333',
  hero: {
    scene: 'status-pulse-grid',
    intensity: 'hero',
    eyebrow: 'Company // STAT.NODE',
    title: 'A live read on every system Hanoryx holds.',
    intro:
      'Operational state across the active roadmap — what is running, what is in research, and what remains withheld. No vanity figures, only posture.',
    code: 'NODE.STAT',
    status: 'OPERATIONAL',
    actions: [{ label: 'Open a channel', to: '/contact', variant: 'outline' }],
  },
  blocks: [
    {
      type: 'stats',
      eyebrow: 'Current Posture',
      title: 'Systems, by state.',
      items: [
        { value: 6, label: 'Systems mapped', note: 'across the active roadmap' },
        { value: 3, label: 'Surfaces operational', note: 'serving live coordination' },
        { value: 2, label: 'Platforms in development', note: 'foundations hardening' },
        { value: 3, label: 'Nodes withheld', note: 'detail scoped to internal review' },
      ],
    },
    {
      type: 'cards',
      scene: 'dashboard-tiles',
      eyebrow: 'Module Grid',
      title: 'System status, node by node.',
      intro:
        'Each entry is a discrete system with its own state. Status reflects operational reality, not a target.',
      items: [
        {
          code: 'SYS.MB',
          title: 'Operational management platform',
          body: 'An advanced management layer coordinating scheduling logic, communication surfaces, records, and multi-role workflows. In active development; core surfaces live under controlled access.',
          tags: ['Scheduling', 'Records', 'Roles'],
          status: 'ACTIVE',
        },
        {
          code: 'SYS.CI',
          title: 'Commerce infrastructure',
          body: 'Transaction handling, catalog logic, and payment calculations built for throughput. Deployed and carrying real operational load.',
          tags: ['Payments', 'Catalog', 'Throughput'],
          status: 'OPERATIONAL',
        },
        {
          code: 'SYS.NC',
          title: 'North internal console',
          body: 'The internal control surface for the engineering division — telemetry, deployment, and orchestration held in one place.',
          tags: ['Telemetry', 'Orchestration'],
          status: 'OPERATIONAL',
        },
        {
          code: 'SYS.AX',
          title: 'Automation layer',
          body: 'Orchestration that removes manual steps and keeps multi-role coordination predictable across connected systems.',
          tags: ['Workflows', 'State'],
          status: 'ACTIVE',
        },
        {
          code: 'SYS.RX',
          title: 'Experimental interface program',
          body: 'An early-stage research node. Architecture is being laid before any surface is exposed. Detail will release when it is ready to hold.',
          tags: ['Research'],
          status: 'RESEARCH',
        },
        {
          code: 'NODE.07',
          title: 'Restricted system branch',
          body: 'Module withheld. Surface intentionally suppressed and scoped to internal review.',
          status: 'CLASSIFIED',
          redacted: true,
        },
      ],
    },
    {
      type: 'modules',
      scene: 'heatmap-control',
      eyebrow: 'Telemetry',
      title: 'Signal readout.',
      intro:
        'Qualitative telemetry from the operating environment. State is reported in posture, not in invented percentages.',
      rows: [
        { k: 'CORE', v: 'Data core responding — records under strict access control' },
        { k: 'ORCH', v: 'Orchestration steady — workflow state resolving in order' },
        { k: 'SCHED', v: 'Scheduling logic nominal — no contended slots flagged' },
        { k: 'COMMS', v: 'Communication surfaces clear — role channels in sync' },
        { k: 'PAY', v: 'Payment calculations reconciled — no open exceptions' },
        { k: 'ACCESS', v: 'Permission model enforced — every surface scoped by role' },
        { k: 'RESEARCH', v: 'Research nodes quiet — surfaces deliberately suppressed' },
        { k: 'SIGNAL', v: 'Continuous monitoring active — drift watched, never assumed' },
      ],
    },
    {
      type: 'cta',
      scene: 'polar-status',
      eyebrow: 'Open a channel',
      title: 'Need a deeper read than this surface shows?',
      body: 'Status here is intentionally abstract. For scoped detail on a specific system, compose an inquiry at contact@hanoryx.com.',
    },
  ],
};

export default page;
