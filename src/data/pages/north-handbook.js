import { engineeringTerms } from '../glossary';

const page = {
  key: 'north/handbook',
  title: 'Engineering Handbook',
  accent: '#ff3333',
  aliases: ['handbook', 'engineering practices', 'code review', 'how we build', 'working agreement', 'definition of done', 'release process', 'conventions', 'standards'],
  hero: {
    scene: 'build-pipeline',
    intensity: 'hero',
    eyebrow: 'Development / Handbook',
    title: 'How we build, written down.',
    intro:
      'The habits the development team holds itself to: how work is shaped, written, reviewed, released and handed on. A handbook is only worth having if it is short enough to read and honest enough to follow, so this one tries to be both.',
    code: 'NTH.06',
    status: 'DRAFT HANDBOOK',
    actions: [
      { label: 'Read the handbook', to: '/north/handbook#handbook' },
      { label: 'Write a definition of done', to: '/north/handbook#done', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'document',
      variant: 'handbook',
      anchor: 'handbook',
      railLabel: 'The handbook',
      scene: 'privacy-quiet-grid',
      minHeight: 1000,
      eyebrow: 'The handbook',
      title: 'Engineering handbook.',
      intro: 'Thirteen short chapters. Each says what the practice is, why it is there, and what it looks like on a normal day.',
      version: 'Draft 1.0',
      summary: [
        'Work in **small steps** that can each be understood, checked and undone.',
        'Write for the **next person**: the code, the commit, the decision and the runbook.',
        'A change is finished when it is **released, watched and written down**, not when it compiles.',
      ],
      meta: [
        { k: 'Status', v: 'Draft for review by the company' },
        { k: 'Kind', v: 'A statement of practice, not a certification or a promise about any project' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'use',
          title: 'How to use this handbook',
          plain: 'Short on purpose. Where it is silent, use judgement and write down what you decided.',
          body: [
            'This handbook describes how the development team aims to work. It is written for the people who do the work, for the people who commission it, and for whoever inherits it.',
            'It is deliberately short. A rule that nobody remembers is not a rule, so the handbook prefers a few habits that are easy to keep to a long list that is easy to ignore. Where it is silent, use judgement — and write down what you decided and why, so that the next person does not have to guess.',
            { note: 'This is a plain-language statement of working practice. It is a draft, has not been reviewed by a lawyer, and is not a contract, a warranty or a description of any particular project.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'principles',
          title: 'Principles in practice',
          plain: 'Four habits that sit under everything else.',
          body: [
            {
              defs: [
                { k: 'Small steps', v: 'A change that is small enough to hold in your head can be reviewed properly, tested properly and undone easily. Big changes are made of small ones.' },
                { k: 'Reversible by default', v: 'Prefer the choice you can take back. When a choice is hard to reverse, slow down, write it down and ask someone.' },
                { k: 'Plain writing', v: 'Say it in words a colleague would use. If it takes a paragraph of jargon to explain, the idea is not yet understood.' },
                { k: 'Evidence over opinion', v: 'Measure before optimising, reproduce before fixing and test before claiming. “It should work” is a hypothesis.' },
              ],
            },
          ],
        },
        {
          id: 'shaping',
          title: 'Shaping the work',
          plain: 'Say what the problem is before deciding what to build.',
          body: [
            'Work begins with a sentence anyone can check: what is going wrong, for whom, and what would count as fixed. If that sentence cannot be written, the work is not yet shaped, and building is premature.',
            { ol: [
              '**State the problem**, without the solution in it.',
              '**Name who is affected** and how often.',
              '**Say what “done” means** for this piece of work, as a short list (see the closing card of this page).',
              '**List what is out of scope.** This is the most useful line in the document.',
              '**Take the riskiest idea first.** If something is going to fail, learn that early.',
            ] },
          ],
        },
        {
          id: 'writing',
          title: 'Writing code',
          plain: 'Code is read far more often than it is written.',
          body: [
            { list: [
              '**Name things for what they are.** A good name saves a comment. A vague name costs a conversation.',
              '**Comments explain why.** The code already says what. A comment that restates the line is noise; one that explains a surprising choice is gold.',
              '**Keep functions short and single-minded.** If you need “and” to describe what it does, it is two functions.',
              '**Prefer plain over clever.** The cleverest solution is usually the hardest to change.',
              '**Delete what is not used.** Dead code is a trap for the next reader. Version control remembers it for you.',
              '**Handle the unhappy path on purpose.** Decide what happens on failure, and write it, rather than hoping it does not.',
            ] },
          ],
        },
        {
          id: 'review',
          title: 'Reviewing changes',
          plain: 'Review is how a team learns the code together.',
          body: [
            'A review is not a gate to be endured. It is a second pair of eyes, a chance to teach and be taught, and the cheapest bug-finding there is.',
            {
              table: {
                head: ['When you see…', 'Write it as…', 'So the author knows…'],
                rows: [
                  ['Something that will break', '**Blocker:** a clear statement of what breaks', 'It must change before it merges'],
                  ['Something that could be better', '**Suggestion:** an alternative, with a reason', 'It is worth considering and their call'],
                  ['Something you do not follow', '**Question:** asked plainly', 'You want to understand, not to object'],
                  ['A trivial point of taste', '**Nit:** marked as such', 'It can be ignored'],
                ],
              },
              caption: 'Labelling a comment tells the author how much weight it carries.',
            },
            { list: [
              '**Keep changes small.** A review of two hundred lines is a review; of two thousand it is a rubber stamp.',
              '**Review the tests first.** They say what the change is supposed to do.',
              '**Be kind and be specific.** Criticise the code, not the person, and say what you would do instead.',
              '**Authors review their own work first**, as a stranger would.',
            ] },
          ],
        },
        {
          id: 'branches',
          title: 'Branches and commits',
          plain: 'History is documentation. Keep it readable.',
          body: [
            { list: [
              'Branch from the main line, keep branches short-lived and merge often. A branch that lives for weeks is a merge conflict waiting.',
              'Write commit messages in the imperative, with a first line that stands alone: “Retry failed receipts from a queue”.',
              'Put the reason in the body of the message. The diff shows what changed; only you can say why.',
              'One idea per commit, where practical, so that any one can be undone cleanly.',
              'Never rewrite shared history. Add a new commit that fixes the old one.',
            ] },
          ],
        },
        {
          id: 'testing',
          title: 'Testing and checks',
          plain: 'Automate the checks you would otherwise forget.',
          body: [
            'Every change runs through automated checks before a person looks at it. The exact list depends on the project; the principle does not: **anything a machine can check, a machine should check**, so people can spend their attention on judgement.',
            { list: [
              'Tests describe behaviour a user or a caller would notice, not the shape of the code.',
              'A flaky test is a bug in the tests. Fix it or remove it; never learn to ignore it.',
              'Test the unhappy paths as thoroughly as the happy ones: the duplicate request, the slow reply, the missing field.',
              'Accessibility and performance have checks too. A page that works only for some people or some devices does not work.',
            ] },
            'The page on quality sets out which kind of check catches which kind of problem.',
          ],
        },
        {
          id: 'release',
          title: 'Releasing',
          plain: 'Releasing should be boring.',
          body: [
            { ol: [
              '**Release in small pieces,** often. Small releases are easy to understand and easy to undo.',
              '**Make the way back as easy as the way forward.** If rolling back is frightening, nobody will release on a Friday, or any other day.',
              '**Release in a quiet hour,** with the people who can fix it nearby.',
              '**Watch it.** Look at the graphs, the errors and the first real users for a while after, not just until the deploy turns green.',
              '**Write it down.** One line in the release notes saying what changed, in plain words.',
            ] },
          ],
        },
        {
          id: 'operating',
          title: 'Operating what we build',
          plain: 'A system that cannot be looked after is not finished.',
          body: [
            'Someone has to be able to see that a system is healthy, to be told when it is not, and to know what to do about it at three in the morning. That is part of the build, not an afterthought.',
            { list: [
              'Decide what to watch, and who is told, before launch.',
              'Write {{runbook}}s from the symptom, for the problems that really happen.',
              'Alert on what a person must act on. An alert that is always ignored is worse than none.',
              'Hold a {{blameless review}} after anything serious, and change something because of it.',
            ] },
          ],
        },
        {
          id: 'docs',
          title: 'Documentation',
          plain: 'Write for the next person, and keep it next to the code.',
          body: [
            { list: [
              'A README that gets a stranger from a clean machine to a running copy.',
              'A one-page picture of how the parts fit.',
              'A short {{decision record}} whenever a choice would surprise a newcomer.',
              'A glossary for the words the team uses without noticing.',
              'Dates and owners on pages, so staleness is visible.',
            ] },
          ],
        },
        {
          id: 'security',
          title: 'Security habits',
          plain: 'Small, boring habits do most of the work.',
          body: [
            { list: [
              'Keep {{secret}}s out of code, and know how to change each one.',
              'Give accounts only the powers their job needs ({{least privilege}}).',
              'Keep dependencies few, current and understood. Know which ones are risky to upgrade.',
              'Check authorisation on the server, for the record, on every request.',
              'Publish a way for people to report problems, and answer them.',
            ] },
          ],
        },
        {
          id: 'access',
          title: 'Accessibility and performance',
          plain: 'Both are quality, not extras.',
          body: [
            'The interface should work with a keyboard, with a screen reader, with large text and with reduced motion, and it should respect the budget of a modest phone. These are checked as part of the work, not added at the end.',
            'The pages on accessibility and on animation budgets describe the habits in detail.',
          ],
        },
        {
          id: 'handover',
          title: 'Handing over',
          plain: 'Plan for the day someone else takes over.',
          body: [
            'From the first week, work as though the system will be handed to someone who was not there: write down how to run it, why it is built the way it is and how to look after it. The guide on handover sets out what a good pack contains.',
          ],
        },
        {
          id: 'change',
          title: 'Changing this handbook',
          plain: 'It is a draft. Say what is wrong with it.',
          body: [
            'This handbook is a draft, and it will be wrong in places. If a practice here does not match how the team really works, or does not work in a particular case, say so. Either the practice or the page should change.',
            { note: 'Suggestions are welcome through the contact page. No version history is claimed: nothing on this site is derived from repository or deployment dates.', label: 'Suggest a change' },
          ],
        },
      ],
      note: 'A statement of working practice for the development team. It is a draft, not legal advice, and not a promise about any project.',
      endLabel: 'End of the handbook',
    },
    {
      type: 'closer',
      kind: 'doneBuilder',
      anchor: 'done',
      scene: 'build-pipeline',
      tag: 'End of the handbook',
      minHeight: 760,
      title: 'Write your definition of done.',
      lede: 'Choose what must be true before work counts as finished. The list becomes a card to print or paste. Keep it short enough that it is really checked.',
      start: ['t1', 'r1', 'o1', 'd1'],
      groups: [
        { name: 'The change', items: [
          { id: 'c1', text: 'It does what the problem statement asked, and nothing it was told to leave out.' },
          { id: 'c2', text: 'The unhappy paths have been decided and tried, not only the happy one.' },
          { id: 'c3', text: 'It is as small as it can be while still being a whole change.' },
        ] },
        { name: 'The checks', items: [
          { id: 't1', text: 'The automated checks pass on the branch.' },
          { id: 't2', text: 'New behaviour has a test that would fail without it.' },
          { id: 't3', text: 'It has been used with a keyboard alone.' },
        ] },
        { name: 'The review', items: [
          { id: 'r1', text: 'Someone other than the author has read it and said so.' },
          { id: 'r2', text: 'Every blocker has been answered, and nits are decided either way.' },
        ] },
        { name: 'The release', items: [
          { id: 'o1', text: 'It has been released, and the way back has been checked.' },
          { id: 'o2', text: 'It has been watched for a while after release.' },
          { id: 'o3', text: 'Monitoring or alerts have been updated if the change needed it.' },
        ] },
        { name: 'The record', items: [
          { id: 'd1', text: 'The README and any runbook the change touches are up to date.' },
          { id: 'd2', text: 'A decision record exists if the choice would surprise a newcomer.' },
          { id: 'd3', text: 'One line is in the release notes, in plain words.' },
        ] },
      ],
      onward: [
        { label: 'How we check the work', to: '/north/quality' },
        { label: 'Designing for handover', to: '/insights/handover' },
      ],
    },
  ],
};

export default page;
