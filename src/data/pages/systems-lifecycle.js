const page = {
  key: 'systems/lifecycle',
  title: 'System Lifecycle',
  accent: '#ff3333',
  aliases: ['lifecycle', 'maintenance', 'running a system', 'decommission', 'retire', 'end of life', 'sunset', 'total cost of ownership', 'run and change', 'stages'],
  hero: {
    scene: 'timeline-pulse',
    intensity: 'hero',
    eyebrow: 'Systems / Lifecycle',
    title: 'Every system has a life. Plan all of it.',
    intro:
      'Most of the talk is about building. Most of the life is running, changing and, in the end, retiring. This page walks through five stages of a system’s life, what each is mostly about, what gets decided and what tends to go wrong, and ends with a plan for the last one.',
    code: 'SYS.10',
    status: 'FIVE STAGES',
    actions: [
      { label: 'Walk the stages', to: '/systems/lifecycle#stages' },
      { label: 'Plan the end', to: '/systems/lifecycle#end', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'lifecycleLine',
      anchor: 'stages',
      railLabel: 'The stages',
      scene: 'privacy-quiet-grid',
      minHeight: 780,
      eyebrow: 'The stages',
      title: 'Shape, build, run, change, retire.',
      intro: 'Choose a stage, or use the arrow keys. The chart marks where you are on an illustrative curve of effort over a system’s life.',
      stages: [
        { id: 'shape', name: 'Shape', years: 'Weeks', blurb: 'Working out what the problem is, and whether software is the answer to it.', mostly: 'Talking, drawing, and deciding what to leave out.', decisions: ['Whether to build, buy or do nothing.', 'What is in the first version, and what is not.'], risks: ['Building before the problem is clear.', 'Choosing a tool before the need.'], effort: [1, 1.5, 2, 2, 2, 2, 1.5, 1.5, 1, 1] },
        { id: 'build', name: 'Build', years: 'Months', blurb: 'Making it real, in small pieces that run, in an order that tests the riskiest idea first.', mostly: 'Building, testing, and showing working software early.', decisions: ['What to reuse and what to write.', 'How it will be released, and how undone.'], risks: ['Leaving operation to the end.', 'A big release with no way back.'], effort: [3, 5, 7, 8, 8, 8, 7, 6, 5, 5] },
        { id: 'run', name: 'Run', years: 'Years', blurb: 'Keeping it healthy while people depend on it.', mostly: 'Watching, patching, answering questions and making small fixes.', decisions: ['Who is on call, and when.', 'What counts as an incident.'], risks: ['Nobody owns it.', 'Dependencies quietly going out of date.'], effort: [4, 3, 3, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5] },
        { id: 'change', name: 'Change', years: 'Years', blurb: 'Adding, adapting and removing as the work it supports changes.', mostly: 'Careful modification of something people rely on.', decisions: ['What to change, and what to leave alone.', 'When to tidy, and when to rebuild.'], risks: ['Changes nobody understands.', 'Fear of touching it at all.'], effort: [2.5, 3, 3, 4, 3, 3, 4, 3, 3, 3.5] },
        { id: 'retire', name: 'Retire', years: 'Months', blurb: 'Switching it off safely, and keeping what must be kept.', mostly: 'Moving data, telling people, and turning things off one at a time.', decisions: ['What data is kept, and for how long.', 'What replaces it, and when.'], risks: ['Forgotten integrations that quietly stop working.', 'Data that can be neither recovered nor deleted.'], effort: [3, 4, 5, 6, 5, 4, 3, 2, 1, 1] },
      ],
      note: 'The curve is qualitative. It records which stages tend to be larger, not by how much, and every system differs.',
    },
    {
      type: 'split',
      anchor: 'whole',
      railLabel: 'The whole life',
      scene: 'topographic-lines',
      eyebrow: 'The whole life',
      code: 'LIFE.01',
      title: 'The build is a small part of the story.',
      body: [
        'A system is usually built once and lived with for years. The cost of living with it, in attention, in change and in the day it is switched off, is easy to forget while the excitement is in the building.',
        'Planning for the whole life changes early decisions: how simple to keep it, how well to document it, what to log, what to make easy to remove. It is not pessimism. It is the same care a good builder gives to a house that must be maintained.',
      ],
      asideLabel: 'QUESTIONS TO ASK EARLY',
      asideCode: 'LIFE.MAP',
      points: [
        { k: 'WHO RUNS IT', v: 'Named, from day one' },
        { k: 'WHAT CHANGES', v: 'Which parts will move most' },
        { k: 'WHAT IS KEPT', v: 'Data and records, and for how long' },
        { k: 'HOW IT ENDS', v: 'Who decides, and how it is done' },
      ],
    },
    {
      type: 'closer',
      kind: 'sunsetPlan',
      anchor: 'end',
      scene: 'redacted-timeline-branch',
      tag: 'End of the lifecycle',
      minHeight: 780,
      title: 'Plan the end now.',
      lede: 'Choose what applies to a system you might one day retire, and how much notice people get. Out comes an ordered plan, counted back from the day it is switched off.',
      groups: [
        { name: 'People', items: [
          { id: 'p1', text: 'Tell everyone who uses it, and say what replaces it.', when: 1, default: true },
          { id: 'p2', text: 'Give people a place to ask questions.', when: 1, default: true },
          { id: 'p3', text: 'Remind them again, closer to the day.', when: 0.25, default: true },
        ] },
        { name: 'Data', items: [
          { id: 'd1', text: 'Offer every user an export of their own data.', when: 0.7, default: true },
          { id: 'd2', text: 'Decide what must be kept, and for how long.', when: 1, default: true },
          { id: 'd3', text: 'Move or archive what must be kept, and check that it can be read.', when: 0.4, default: true },
          { id: 'd4', text: 'Delete what must not be kept, and record that you did.', when: -0.1, default: false },
        ] },
        { name: 'Access', items: [
          { id: 'a1', text: 'List every integration that talks to it.', when: 1, default: true },
          { id: 'a2', text: 'Tell the owners of those integrations.', when: 0.9, default: true },
          { id: 'a3', text: 'Revoke accounts, keys and tokens.', when: 0, default: true },
          { id: 'a4', text: 'Remove service accounts and firewall rules.', when: -0.1, default: false },
        ] },
        { name: 'Traffic', items: [
          { id: 't1', text: 'Put a notice page where it used to be.', when: 0, default: true },
          { id: 't2', text: 'Redirect old addresses to what replaces them.', when: 0, default: false },
          { id: 't3', text: 'Watch for requests still arriving.', when: -0.2, default: true },
        ] },
        { name: 'Record', items: [
          { id: 'r1', text: 'Write down why it was retired and what was learned.', when: -0.1, default: true },
          { id: 'r2', text: 'Archive the documentation and decision records.', when: -0.1, default: true },
          { id: 'r3', text: 'Update the list of systems the company runs.', when: -0.1, default: false },
        ] },
        { name: 'Cost', items: [
          { id: 'c1', text: 'Cancel hosting, licences and domains, in that order.', when: -0.2, default: true },
          { id: 'c2', text: 'Confirm the final bill.', when: -0.4, default: false },
        ] },
      ],
      onward: [
        { label: 'Data retention', to: '/legal/retention' },
        { label: 'Designing for handover', to: '/insights/handover' },
      ],
    },
  ],
};

export default page;
