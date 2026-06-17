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
      'Most operational data is dense, related, and hostile to inspection. Data interfaces are the layer that makes it legible — queryable views, status surfaces, and reporting built directly on the live record.',
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
        'A data interface sits on top of that record and turns it into something a person can actually ask questions of: filtered views, derived fields, and queries that read like intent rather than table joins.',
        'Nothing is copied or flattened into a side database. The surface reads from the same authoritative store the rest of the system writes to, so what you query is what is true.',
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
        'Four surface classes cover most of what an operation needs to see. Each is scoped by role and reads from the same hardened core.',
      items: [
        {
          code: 'SF.01',
          title: 'Status surfaces',
          body: 'Live state at a glance — where a record sits, what is blocking it, and what changed since last viewed. Built for the decision, not the data dump.',
          tags: ['Live state', 'Signals'],
        },
        {
          code: 'SF.02',
          title: 'Logs',
          body: 'An append-only account of what happened, by whom, and when. Filterable and exportable, but never editable after the fact.',
          tags: ['Append-only', 'Trace'],
        },
        {
          code: 'SF.03',
          title: 'Reporting',
          body: 'Aggregations and derived metrics computed against the live record, so a report is a question answered now rather than a snapshot that quietly went stale.',
          tags: ['Aggregation', 'Derived'],
        },
        {
          code: 'SF.04',
          title: 'Query views',
          body: 'Saved, parameterised lookups that let a role interrogate the record directly within the limits of what it is permitted to see.',
          tags: ['Query', 'Saved views'],
        },
      ],
    },
    {
      type: 'modules',
      scene: 'heatmap-control',
      eyebrow: 'Principles',
      title: 'How a data interface is held together.',
      intro: 'A short set of rules the surfaces are not allowed to break.',
      rows: [
        { k: 'TRUTH', v: 'One authoritative source. No shadow copies, no drifting exports.' },
        { k: 'READ-PATH', v: 'Interfaces read; they do not mutate the record out of band.' },
        { k: 'SCOPE', v: 'Every view is bounded by role before a single row is returned.' },
        { k: 'DERIVE', v: 'Computed fields are explicit and reproducible, never hand-edited.' },
        { k: 'TRACE', v: 'Significant reads and reports are logged for later inspection.' },
        { k: 'LATENCY', v: 'Surfaces reflect current state, not last night’s batch.' },
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
