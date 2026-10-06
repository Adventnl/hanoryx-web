import { readinessGroups } from '../readiness';

const questions = readinessGroups.reduce((n, g) => n + g.questions.length, 0);

const page = {
  key: 'resources/tools/readiness',
  title: 'Readiness Check',
  accent: '#ff3333',
  aliases: ['go live', 'launch', 'checklist', 'production readiness', 'pre-launch', 'release checklist', 'ready to ship', 'risk'],
  hero: {
    scene: 'status-pulse-grid',
    intensity: 'hero',
    eyebrow: 'Resources / Tools / Readiness',
    title: 'Are you ready to switch it on?',
    intro: `${questions} questions in five groups: access, data, operation, quality and people. Answer honestly, and the gaps come back as a list you can act on. “Partly” is a good answer; “No” is the most useful one.`,
    code: 'RES.08',
    status: `${questions} QUESTIONS`,
    actions: [
      { label: 'Start the check', to: '/resources/tools/readiness#tool' },
      { label: 'The launch fortnight', to: '/resources/tools/readiness#launch', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'readinessCheck',
      anchor: 'tool',
      railLabel: 'The check',
      scene: 'privacy-quiet-grid',
      minHeight: 1000,
      eyebrow: 'The check',
      title: 'Twenty honest answers.',
      intro: 'Choose Yes, Partly, No or Not applicable for each question. Tap the same answer again to unset it. Download or copy the result when you are done.',
      note: 'A starting point for a conversation, not a certification. A high score does not mean something is safe, and a low one does not mean it is doomed. Nothing you choose here is stored.',
    },
    {
      type: 'modules',
      anchor: 'scoring',
      railLabel: 'How the score works',
      scene: 'architectural-grid',
      eyebrow: 'How the score works',
      title: 'Simple on purpose.',
      rows: [
        { k: 'YES', v: 'Counts as one.' },
        { k: 'PARTLY', v: 'Counts as a half.' },
        { k: 'NO', v: 'Counts as nothing, and goes to the top of the to-do list.' },
        { k: 'NOT APPLICABLE', v: 'Left out of the score altogether, so it neither helps nor hurts.' },
        { k: 'UNANSWERED', v: 'Also left out. The score is of the questions you have answered, and says how many that is.' },
        { k: 'THE BANDS', v: 'Ninety per cent or more: close to ready. Seventy: nearly there. Forty: not yet. Below that: early.' },
      ],
    },
    {
      type: 'split',
      anchor: 'limits',
      railLabel: 'What it is not',
      scene: 'topographic-lines',
      eyebrow: 'What it is not',
      code: 'READY.01',
      title: 'A mirror, not a verdict.',
      body: [
        'The check asks questions that experience says matter. It cannot know your system, your risks or your obligations, and it does not try to. It cannot tell whether your answers are true.',
        'Its value is in being asked: teams often discover, partway down the list, that nobody has actually tried the restore, or that only one person has the keys.',
      ],
      asideLabel: 'THE FIVE GROUPS',
      asideCode: 'READY.MAP',
      points: readinessGroups.map((g) => ({ k: g.name.toUpperCase(), v: g.blurb })),
    },
    {
      type: 'closer',
      kind: 'launchTimeline',
      anchor: 'launch',
      scene: 'workflow-river',
      tag: 'End of the readiness check',
      minHeight: 640,
      title: 'The launch fortnight.',
      lede: 'Seven stops from two weeks before to a week after. Walk along the track, tick what you have done at each stop, and watch the ring fill. The arrow keys move between stops.',
      stops: [
        { id: 'm14', when: 'T − 14', title: 'Two weeks out: decide, and find the gaps', items: ['Name the person who decides go or no-go', 'Run the readiness check and write down the gaps', 'Rehearse a restore of the backup, and time it'] },
        { id: 'm7', when: 'T − 7', title: 'A week out: test the riskiest path', items: ['Walk the riskiest path from end to end', 'Have someone who did not write them follow the runbooks', 'Confirm who is on call, and how they are reached'] },
        { id: 'm3', when: 'T − 3', title: 'Three days out: freeze and rehearse', items: ['Freeze changes that are not needed for the launch', 'Break something on purpose, to see that monitoring notices', 'Tell the people who will be affected, and when'] },
        { id: 'm1', when: 'T − 1', title: 'The day before: confirm the way back', items: ['Confirm the rollback, and who may call it', 'Check capacity against the load you expect', 'Agree the plan for the first hour'] },
        { id: 'd0', when: 'Launch', title: 'Launch day: release quietly, watch together', items: ['Release in a quiet hour, not a busy one', 'Watch the first-hour graphs together', 'Write down anything odd as it happens'] },
        { id: 'p1', when: 'T + 1', title: 'The day after: review and mend', items: ['Read the overnight alerts', 'Fix the small things while the memory is fresh', 'Thank the people who stayed up'] },
        { id: 'p7', when: 'T + 7', title: 'A week after: learn from it', items: ['Hold a blameless review', 'Update the runbooks with what you learned', 'Decide what to leave alone'] },
      ],
      onward: [
        { label: 'Designing for handover', to: '/insights/handover' },
        { label: 'Runbooks people actually use', to: '/insights/runbooks' },
      ],
    },
  ],
};

export default page;
