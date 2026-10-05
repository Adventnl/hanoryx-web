const areas = [
  { id: 'ops', name: 'Operational management', to: '/systems/operational-management' },
  { id: 'commerce', name: 'Commerce infrastructure', to: '/systems/commerce-infrastructure' },
  { id: 'auto', name: 'Automation', to: '/systems/automation' },
  { id: 'internal', name: 'Internal platforms', to: '/systems/internal-platforms' },
  { id: 'data', name: 'Data interfaces', to: '/systems/data-interfaces' },
  { id: 'portal', name: 'Client portals', to: '/systems/client-portals' },
  { id: 'research', name: 'Research systems', to: '/systems/research-systems' },
];

const u = (ops, commerce, auto, internal, data, portal, research) => ({ ops, commerce, auto, internal, data, portal, research });

const page = {
  key: 'systems/capabilities',
  title: 'Capabilities',
  accent: '#ff3333',
  aliases: ['features', 'what systems need', 'requirements', 'building blocks', 'capability map', 'scope', 'size', 'roles', 'audit', 'workflow'],
  hero: {
    scene: 'architecture-layer',
    intensity: 'hero',
    eyebrow: 'Systems / Capabilities',
    title: 'What operational systems are made of.',
    intro:
      'Most operational software is a dozen capabilities in different proportions: who may do what, what happened, what is due, who needs telling. This page lays them out against the seven kinds of system, so a conversation can start from the parts rather than from a product name.',
    code: 'SYS.08',
    status: 'REFERENCE',
    actions: [
      { label: 'Open the grid', to: '/systems/capabilities#grid' },
      { label: 'How big is yours?', to: '/systems/capabilities#size', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'capabilityMatrix',
      anchor: 'grid',
      railLabel: 'The grid',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'The grid',
      title: 'Twelve capabilities, seven kinds of system.',
      intro: 'Choose a capability to see where it turns up, or a kind of system (a column heading) to see what it usually needs.',
      areas,
      capabilities: [
        { id: 'roles', name: 'Roles and access', blurb: 'Who may see and do what, decided on the server for every request, with the rules written down.', uses: u(2, 2, 1, 2, 2, 2, 0) },
        { id: 'audit', name: 'Audit trail', blurb: 'A record of who did what, to which record and why, kept so that it can be checked later.', uses: u(2, 2, 2, 2, 1, 2, 0) },
        { id: 'schedule', name: 'Scheduling and due dates', blurb: 'Things that must happen at a time, and the reminders and overdue states around them.', uses: u(2, 1, 2, 1, 0, 1, 0) },
        { id: 'workflow', name: 'Workflow and state', blurb: 'Records that move through named steps under rules, with only the allowed moves available.', uses: u(2, 2, 2, 1, 0, 1, 0) },
        { id: 'notify', name: 'Notifications', blurb: 'Telling the right person, at the right moment, without telling everyone about everything.', uses: u(2, 2, 2, 1, 0, 2, 0) },
        { id: 'dash', name: 'Dashboards and reports', blurb: 'Reading the state of things at a glance, with a way to follow a number back to its source.', uses: u(1, 1, 1, 2, 2, 1, 1) },
        { id: 'search', name: 'Search and filters', blurb: 'Finding one thing among many, quickly, in the words people actually use.', uses: u(1, 2, 0, 2, 2, 1, 0) },
        { id: 'io', name: 'Import and export', blurb: 'Getting data in and out as files, because someone always needs a spreadsheet.', uses: u(1, 2, 1, 2, 2, 1, 0) },
        { id: 'api', name: 'Integrations and APIs', blurb: 'Talking to other systems in a way that survives their changes and their bad days.', uses: u(1, 2, 2, 1, 2, 2, 0) },
        { id: 'pay', name: 'Payments', blurb: 'Taking money, refunding it, and reconciling what happened with what was recorded.', uses: u(0, 2, 0, 0, 0, 1, 0) },
        { id: 'scale', name: 'Handling large data', blurb: 'Working over very many records without slowing to a crawl: indexes, paging, windows.', uses: u(0, 1, 1, 2, 2, 0, 0) },
        { id: 'motion', name: 'Motion and visual feedback', blurb: 'Showing change as it happens, in a way that explains the state of things.', uses: u(1, 1, 0, 1, 1, 1, 2) },
      ],
      note: 'A judgement from experience, not a statement about any particular project. The dots say how often a capability turns up in that kind of system, not what any one system contains.',
    },
    {
      type: 'modules',
      anchor: 'proportions',
      railLabel: 'Proportions, not parts',
      scene: 'architectural-grid',
      eyebrow: 'Proportions, not parts',
      title: 'Why a grid, and not a catalogue.',
      rows: [
        { k: 'SAME PARTS, DIFFERENT MIX', v: 'A commerce system and an internal dashboard both need roles and an audit trail. What differs is how much weight each carries, and what goes wrong when it is missing.' },
        { k: 'THE QUIET ONES MATTER', v: 'Roles, audit and notifications are rarely why a project starts, and are often why it succeeds. They are where the unglamorous risk lives.' },
        { k: 'A COLUMN IS A CONVERSATION', v: 'Read down a column and you have the list of questions to ask about that kind of system, before any screen is drawn.' },
        { k: 'A ROW IS A DECISION', v: 'Read along a row and you see where a decision made once, such as how access is decided, will be felt in several places.' },
      ],
    },
    {
      type: 'closer',
      kind: 'sizeUp',
      anchor: 'size',
      scene: 'orbital-node',
      tag: 'End of capabilities',
      minHeight: 740,
      title: 'How big is yours?',
      lede: 'Five questions about a system, each a judgement. The answer is a shape, not a price and not a duration: what kind of work this adds up to, what changes at that size and what to decide first.',
      questions: [
        { id: 'users', text: 'How many kinds of people use it?', options: [{ label: 'One', points: 0 }, { label: 'Two or three', points: 1 }, { label: 'Four or more', points: 2 }] },
        { id: 'links', text: 'How many other systems does it talk to?', options: [{ label: 'None', points: 0 }, { label: 'One or two', points: 1 }, { label: 'Three or more', points: 2 }] },
        { id: 'data', text: 'What does it hold?', options: [{ label: 'Little that matters', points: 0 }, { label: 'Ordinary business records', points: 1 }, { label: 'Personal, financial or regulated data', points: 2 }] },
        { id: 'down', text: 'What happens if it is down for a day?', options: [{ label: 'People wait, mildly', points: 0 }, { label: 'Work stops', points: 1 }, { label: 'Money or safety is at risk', points: 2 }] },
        { id: 'start', text: 'Where does its data come from?', options: [{ label: 'It starts empty', points: 0 }, { label: 'We import a spreadsheet', points: 1 }, { label: 'We migrate from systems still in use', points: 2 }] },
      ],
      bands: [
        { min: 0, name: 'A focused tool', summary: 'One job, a few people, little around it. It can be small, quick and simple, and should stay that way.', changes: ['One person can hold the whole thing in their head.', 'A single release path is enough.', 'A good README is the documentation.'], first: ['The one job it must do well.', 'What “done” means.', 'Who will look after it.'] },
        { min: 4, name: 'A platform', summary: 'Several roles and several neighbours. The seams between the parts now matter as much as the parts.', changes: ['Boundaries and contracts between parts become the design.', 'Access rules need to be written down and tested.', 'Operation (watching, alerting, recovering) is part of the build.'], first: ['Who may see and do what.', 'What the source of truth is for each record.', 'How you will know when it is unwell.'] },
        { min: 7, name: 'A programme', summary: 'Many roles, sensitive data and real consequences if it stops. A long piece of work with several parts moving together, which has to be managed as one.', changes: ['Work is staged, with a working slice early.', 'Security, audit and recovery are designed first, not added.', 'Several people must be able to run it, so handover starts in week one.', 'Migration and running in parallel are projects of their own.'], first: ['The riskiest assumption, and how to test it first.', 'What must never be lost, and how it is protected.', 'How you will cut over, and how you will go back.'] },
      ],
      onward: [
        { label: 'Integration patterns', to: '/systems/integrations' },
        { label: 'System lifecycle', to: '/systems/lifecycle' },
      ],
    },
  ],
};

export default page;
