import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/runbooks',
  title: 'Runbooks People Actually Use',
  accent: '#ff3333',
  aliases: ['runbook', 'playbook', 'on-call', 'incident response', 'operations', 'troubleshooting', 'documentation', 'alerts', 'pager', 'outage'],
  hero: {
    scene: 'status-pulse-grid',
    intensity: 'hero',
    eyebrow: 'Insights / Operations',
    title: 'Written for the person who is awake at three.',
    intro:
      'A runbook is read by someone tired, alone, and without the context its author had. Most are written as if the reader had both. This guide is about the other kind: the ones that get used, and what makes them different.',
    code: 'INS.04',
    status: 'GUIDE · OPERATIONS',
    actions: [
      { label: 'Race two runbooks', to: '/insights/runbooks#try' },
      { label: 'Read the guide', to: '/insights/runbooks#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'runbook', caption: 'A path from the symptom to the first thing you can do.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'runbookWalk',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'Try it',
      title: 'One incident. Two runbooks.',
      intro: 'The pager goes off. Read each runbook one block at a time, and watch the clock that counts the time it takes to read, until you reach the first thing that actually does something.',
      incident: 'Alert: checkout error rate is above its threshold. Customers report that paying fails with a generic error.',
      versions: [
        {
          id: 'explains',
          label: 'Explains the system',
          blocks: [
            { id: 'a1', kind: 'context', text: 'Checkout is the service that sits between the storefront and the payment provider. It was built in two phases: the first handled card payments, the second added wallet payments. It uses a queue to hand finished orders on to fulfilment, and a cache that holds each visitor’s basket and session for fifteen minutes.' },
            { id: 'a2', kind: 'context', text: 'The service has three dependencies: the payment provider’s interface, the session cache and the orders database. Each has its own timeout, set in the settings file and described in the architecture document, which also explains why the timeouts differ.' },
            { id: 'a3', kind: 'context', text: 'Historically, outages of this kind have come from one of three places: the payment provider having a bad period, the cache running out of memory after a busy sale, or a release that changed one of the settings without anyone noticing it would affect checkout.' },
            { id: 'a4', kind: 'decision', text: 'Work out which of the three is failing before you change anything.' },
            { id: 'a5', kind: 'action', text: 'Open the Checkout dependencies dashboard and compare the three error lines.' },
            { id: 'a6', kind: 'decision', text: 'If the payment line is the highest, go to the section on provider outages. If the cache line is, go to the section on the cache. If neither, look at recent releases.' },
            { id: 'a7', kind: 'action', text: 'Open the provider’s status page and read the latest message.' },
          ],
        },
        {
          id: 'symptom',
          label: 'Starts from the symptom',
          blocks: [
            { id: 'b1', kind: 'action', text: 'Open the Checkout dependencies dashboard. Look at the three error lines.' },
            { id: 'b2', kind: 'decision', text: 'Which line is highest? Payment → step 3. Cache → step 5. Neither → step 7.' },
            { id: 'b3', kind: 'action', text: 'Open the payment provider’s status page. Is it reporting a problem?' },
            { id: 'b4', kind: 'action', text: 'If yes: switch the storefront banner on (“Payments are slow; please try again shortly”), post in the incident channel, and stop. Nothing on our side will fix it.' },
            { id: 'b5', kind: 'action', text: 'Cache: check its memory graph. Above 90%? Run the “clear sessions” command (below) once. Expect the error line to fall within two minutes.' },
            { id: 'b6', kind: 'action', text: 'Not recovered after two minutes: page the second contact (see Escalation).' },
            { id: 'b7', kind: 'action', text: 'Neither: open the release list. Was anything released in the last two hours? If yes, roll it back using the rollback card.' },
          ],
        },
      ],
      note: 'The two runbooks are invented for the demonstration. Reading time is counted from their actual words at about 220 words a minute; a person woken at night reads more slowly.',
    },
    {
      type: 'signature',
      kind: 'document',
      variant: 'article',
      anchor: 'guide',
      railLabel: 'The guide',
      scene: 'architectural-grid',
      minHeight: 1000,
      eyebrow: 'The guide',
      title: 'Runbooks people actually use.',
      intro: 'What to put first, what to leave out, and how to keep them true.',
      version: 'General guidance',
      summary: [
        'Start from the **symptom** the reader sees, not from the architecture.',
        'Put the first **safe action** on the first screen. Explanation can wait; it can be linked.',
        'A {{runbook}} that has not been followed by a fresh pair of eyes is a draft.',
      ],
      meta: [
        { k: 'For', v: 'Anyone who runs, or hands over, a system that other people will have to look after' },
        { k: 'Kind', v: 'General guidance, not a description of any client’s procedures' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'reader',
          title: 'Who reads a runbook',
          plain: 'A tired person, in a hurry, who did not write it.',
          body: [
            'Imagine the reader before writing a word. It is the middle of the night. The phone has woken them. They are on {{on-call}}, which means they are responsible for the system but did not necessarily build it. They have a laptop, a poor connection and some ten seconds of patience before they start doing something less careful.',
            'That reader does not want to learn how the system works. They want to know what is wrong, what to do first, and how they will know it has helped. Everything in a good runbook is in service of those three needs.',
            { note: 'The reader may be you, six months from now. You will remember none of it.', label: 'Worth remembering' },
          ],
        },
        {
          id: 'two',
          title: 'Two kinds of runbook',
          plain: 'One explains the system. One gets you moving.',
          body: [
            'Most runbooks begin as an explanation of the system, because that is what the author knows best. They open with a history, an architecture and a list of components; the part where the reader is told to do something turns up on the second page.',
            'The other kind begins from what the reader can **see** — the alert, the error, the customer complaint — and leads straight to the first thing to try. The explanation is still there, but it is behind a link, for the reader who wants it.',
            'The demonstration above lets you read the same incident, in both styles, with a clock. The point is not that one is true and the other false. It is how long you spend before you do something.',
            {
              table: {
                head: ['', 'Explains the system', 'Starts from the symptom'],
                rows: [
                  ['Opens with', 'What the thing is', 'What the reader is seeing'],
                  ['First action comes', 'After the background', 'In the first block'],
                  ['Good at', 'Teaching a new engineer', 'Getting a tired one through the night'],
                  ['Where it belongs', 'In an architecture document', 'In the runbook'],
                ],
              },
              caption: 'Both are useful. Only one belongs where the alert links to.',
            },
          ],
        },
        {
          id: 'symptom',
          title: 'Start from the symptom',
          plain: 'Name each runbook after what is seen.',
          body: [
            'Title a runbook in the words of the person who will be looking for it. Not “Payment orchestration service: failure modes” but “Customers cannot pay: error rate on checkout is high”. The alert should link straight to the page, and the page’s first line should repeat the alert’s text so the reader knows they are in the right place.',
            { list: [
              'One runbook per symptom, not per component.',
              'Use the exact wording of the alert, so searching for it finds the page.',
              'Say how to tell this problem from a similar one in the first few lines.',
            ] },
          ],
        },
        {
          id: 'first',
          title: 'The first safe action, on the first screen',
          plain: 'Something the reader can do before they understand.',
          body: [
            'The best first step is one that is **safe whether or not the diagnosis is right**: look at a particular graph, switch on a notice for customers, pause a job. It buys time and costs little.',
            'Hold the dramatic steps — restarting a database, rolling back a release — for after the reader has confirmed which problem they have. A runbook that opens with a restart will, eventually, be followed by someone for whom it was the wrong problem.',
            { quote: 'Put the first safe action where the eye lands, and the history behind a link.', cite: 'A rule for the top of the page' },
          ],
        },
        {
          id: 'decisions',
          title: 'Make decisions small and explicit',
          plain: 'If this, then that. No essays.',
          body: [
            'Branching is where runbooks go wrong. A paragraph that says “depending on whether the cache or the provider is at fault, you may want to consider…” hands the reader exactly the thinking they are least able to do.',
            { ol: [
              'Phrase each decision as a **question that can be answered by looking**: “Is the payment line the highest?”',
              'Give each answer its own next step, by number or link.',
              'Keep the branches few. If a runbook has more than three or four decisions, it is probably two runbooks.',
            ] },
          ],
        },
        {
          id: 'commands',
          title: 'Commands that can be pasted',
          plain: 'Tell people what to type, and what to expect.',
          body: [
            'Wherever a step involves a command, give the whole command, in a block that can be copied, with the placeholder clearly marked. Then say what the reader should see afterwards — otherwise they cannot tell whether it worked.',
            { code: '# Clear stale checkout sessions (safe: visitors keep their baskets)\n./ops clear-sessions --service checkout --older-than 15m\n\n# Expect: "cleared N sessions" and the cache memory graph falling\n# within about two minutes. If it prints an error, go to Escalation.' },
            'Mark the dangerous commands. A line that says what a command will **not** undo is as useful as one that says what it does.',
          ],
        },
        {
          id: 'worked',
          title: 'Say how you will know it worked',
          plain: 'Every action ends with something to check.',
          body: [
            'After each step that changes something, name the thing to look at and the change to expect: “the error line falls below 2% within two minutes”. Without it, the reader has to guess whether to wait, repeat the step or move on.',
            'Equally, say when to **stop**. Some steps cannot help (“If the provider’s status page reports a problem, nothing on our side will fix it: post the update and stop”). Telling the reader to stop is a kindness.',
          ],
        },
        {
          id: 'escalation',
          title: 'Escalation',
          plain: 'When to ask, whom to ask, and what to tell them.',
          body: [
            'Every runbook should end with a way out. Name who to contact next, how, and what to say, and set a clock: “if the error rate has not fallen in ten minutes, page the second contact”. Without a clock, people stay with a failing plan for far longer than they intend to.',
            { list: [
              '**Who** — by role and by name, and how to reach them out of hours.',
              '**When** — a time limit, or a condition.',
              '**What to say** — the symptom, what has been tried, and what was seen. A template saves thinking.',
            ] },
            'Asking for help early is not failure. Say so in the runbook, so that the reader does not need to be told twice.',
          ],
        },
        {
          id: 'short',
          title: 'Short, and linked',
          plain: 'The reader should never have to scroll to find the action.',
          body: [
            'A runbook is not the place for the full story. Put the explanation, the history and the architecture in other documents, and link to them: “why the timeouts differ” can be one click away for the reader who wants it and invisible to the one who does not.',
            'A useful test is length. If a runbook does not fit on one or two screens, it is probably explaining things, or covering more than one symptom.',
          ],
        },
        {
          id: 'testing',
          title: 'Test it on someone who did not write it',
          plain: 'A runbook is a draft until a stranger has followed it.',
          body: [
            'Authors cannot see the gaps in their own runbooks: they fill them in without noticing. Give the runbook to a person who has never seen the system, in a safe environment, and watch where they stop.',
            { list: [
              '**Run a game day.** Break something on purpose, in a safe place, and let the on-call person follow the page.',
              '**Follow it step by step**, in a test environment, whenever it changes.',
              '**Note every question they ask.** Each is a missing line.',
            ] },
          ],
        },
        {
          id: 'alive',
          title: 'Keeping it true',
          plain: 'A wrong runbook is worse than none.',
          body: [
            'Systems change faster than the pages about them. A runbook that names a dashboard that was renamed, or a command that no longer exists, teaches the reader to stop trusting the others.',
            { list: [
              'Give each runbook an **owner** and a **review date**, visible on the page.',
              'After every {{incident}}, ask whether a runbook was used, whether it helped, and what to change. Fix it while the memory is fresh.',
              'In a {{blameless review}}, treat “the runbook was wrong” as a finding about the runbook, not the reader.',
              'Delete runbooks for things that no longer exist.',
            ] },
          ],
        },
        {
          id: 'skeleton',
          title: 'A skeleton to start from',
          plain: 'The shape that most good ones share.',
          body: [
            { code: '# <The symptom, in the words of the person who sees it>\n\nOwner: <name or team>      Last reviewed: <date>      Alert: <link>\n\n## What you are seeing\n<the alert text, exactly, and what a customer would say>\n\n## Is it really this?\n- [ ] <a quick check that rules it in>\n- [ ] <a quick check that rules it out, with where to go instead>\n\n## Do this first (safe whatever the cause)\n- [ ] <first action>   Expect: <what you should see>\n\n## Then\n1. <question that can be answered by looking>  Yes → step 2. No → step 4.\n\n## How to know it worked\n<the graph, the number, the time>\n\n## If it did not\nWho: <role + name + how to reach them>   When: <after N minutes>\nSay: <symptom> / <what you tried> / <what you saw>\n\n## Afterwards\n<what to write down; where to put it>\n\n## Background (for later)\n<links to the explanation>' },
            'The closing card of this page turns that into a one-page template you can download and fill in.',
          ],
        },
        {
          id: 'checklist',
          title: 'A checklist to take away',
          plain: 'Ten questions to ask of a runbook before you trust it.',
          body: [
            { ol: [
              'Is it titled in the words of the person who sees the problem?',
              'Does the alert link straight to it?',
              'Is the first safe action on the first screen?',
              'Is every decision a question that can be answered by looking?',
              'Can every command be copied, and does each say what to expect?',
              'Does every change say how to know it worked?',
              'Does it say when to stop?',
              'Does it say whom to ask next, when, and what to tell them?',
              'Has someone who did not write it followed it?',
              'Does it have an owner and a review date?',
            ] },
          ],
        },
      ],
      note: 'General guidance. It is not a description of any client’s procedures or of any real incident.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'pagerCard',
      anchor: 'card',
      scene: 'status-pulse-grid',
      tag: 'End of runbooks',
      minHeight: 700,
      title: 'The one-page template.',
      lede: 'The shape most good runbooks share, on a single card. Read it here, copy it as Markdown, or download it and fill it in for a real service.',
      sections: [
        { name: 'What you are seeing', hint: 'The symptom, in the words of the person who reports it.', lines: ['The alert text, exactly as it appears', 'What a customer or colleague would say', 'Which dashboard shows it'] },
        { name: 'Is it really this?', hint: 'Two quick checks: one that rules it in, one that rules it out.', lines: ['A check that confirms the problem', 'A check that points to a different runbook'] },
        { name: 'Do this first', hint: 'Safe whatever the cause. It buys time and costs little.', lines: ['The first action', 'What to expect afterwards'] },
        { name: 'Then', hint: 'Decisions as questions that can be answered by looking.', lines: ['A question. Yes → step 2. No → step 4.', 'The dramatic steps, held until the cause is known'] },
        { name: 'How you will know', hint: 'The graph, the number, the time.', lines: ['What should fall, and by when', 'When to stop because nothing here can help'] },
        { name: 'If it did not work', hint: 'Whom to ask, when, and what to say.', lines: ['Who, by role and name, and how to reach them', 'After how many minutes', 'The symptom, what was tried, what was seen'] },
        { name: 'Afterwards', hint: 'So the next person has an easier night.', lines: ['What to write down, and where', 'Whether this page was right'] },
        { name: 'Owner and review', hint: 'A wrong runbook is worse than none.', lines: ['Owner', 'Last reviewed', 'Next review'] },
      ],
      onward: [
        { label: 'Designing for handover', to: '/insights/handover' },
        { label: 'Live status', to: '/trust/status' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
