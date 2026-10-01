const page = {
  key: 'systems/data-interfaces',
  title: 'Data Interfaces',
  accent: '#ff3333',
  hero: {
    scene: 'data-interface-wave',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.05',
    title: 'Readable surfaces over records that are anything but simple.',
    intro:
      'A design model for making complex records readable through scoped views, status surfaces, and reporting. The examples below are proposed patterns, not a report on a deployed data platform.',
    code: 'NODE.DI',
    status: 'ACTIVE',
    actions: [
      { label: 'All systems', to: '/systems', variant: 'outline' },
      { label: 'Open a channel', to: '/contact' },
    ],
    metrics: [
      { value: 4, label: 'Surface classes' },
      { value: 1, suffix: 'x', label: 'Source of truth' },
      { value: 0, label: 'Manual exports' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'data-stream-ribbons',
      eyebrow: 'Capability',
      code: 'DI.01',
      title: 'Make the record answerable.',
      body: [
        'Behind every operation is a record set that grew complicated for good reasons — relationships, history, and edge cases that no clean schema fully predicts.',
        'A useful interface could expose filtered views, derived fields, and task-oriented queries. Each view needs an owner, a freshness expectation, and an access rule.',
        'The source of truth and any derived copies should be identified explicitly. If the interface uses a cache or search index, its delay and failure behavior should be visible to the people relying on it.',
      ],
      asideLabel: 'SURFACE',
      asideCode: 'DI.MAP',
      points: [
        { k: 'SOURCE', v: 'Live operational record' },
        { k: 'VIEW', v: 'Filtered, derived projections' },
        { k: 'QUERY', v: 'Intent-shaped lookups' },
        { k: 'SCOPE', v: 'Role-bounded access' },
        { k: 'AUDIT', v: 'Read paths logged' },
      ],
    },
    {
      type: 'cards',
      scene: 'signal-spectrum-field',
      eyebrow: 'Surfaces',
      title: 'What the interface exposes.',
      intro:
        'Four possible surface types for a data-heavy workflow. A real implementation would need to prove access boundaries and data freshness for each one.',
      items: [
        {
          code: 'SF.01',
          title: 'Status surfaces',
          body: 'Show where a record sits, what blocks progress, and when the state was last refreshed. Make the underlying record easy to inspect.',
          tags: ['Live state', 'Signals'],
        },
        {
          code: 'SF.02',
          title: 'Logs',
          body: 'Record the events people need to investigate, including actor and time. Define retention, export rights, and tamper resistance for the use case.',
          tags: ['Append-only', 'Trace'],
        },
        {
          code: 'SF.03',
          title: 'Reporting',
          body: 'Aggregate the fields needed for a decision and display the data window and refresh time so a snapshot cannot be mistaken for current state.',
          tags: ['Aggregation', 'Derived'],
        },
        {
          code: 'SF.04',
          title: 'Query views',
          body: 'Offer saved, parameterised lookups with permission checks applied before results are returned.',
          tags: ['Query', 'Saved views'],
        },
      ],
    },
    {
      type: 'modules',
      scene: 'heatmap-control',
      eyebrow: 'Principles',
      title: 'How a data interface is held together.',
      intro: 'Questions to settle for each implementation, with acceptance checks attached to the actual data source.',
      rows: [
        { k: 'TRUTH', v: 'Name the authoritative source and any derived stores.' },
        { k: 'READ-PATH', v: 'State which views can change records and through what API.' },
        { k: 'SCOPE', v: 'Check access before rows and fields leave the service.' },
        { k: 'DERIVE', v: 'Document how computed fields can be reproduced.' },
        { k: 'TRACE', v: 'Define which reads and reports need an audit record.' },
        { k: 'LATENCY', v: 'Show freshness and expected delay for each surface.' },
      ],
    },
    {
      type: 'cta',
      scene: 'transaction-wave',
      eyebrow: 'Open a channel',
      title: 'Discuss a data interface.',
      body: 'If your operation has records that are hard to read and harder to trust, we can talk about the surface that makes them answerable.',
    },
  ],
};

export default page;
