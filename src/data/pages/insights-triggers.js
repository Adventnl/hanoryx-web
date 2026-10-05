import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/triggers',
  title: 'Cron, Queues and Events',
  accent: '#ff3333',
  aliases: ['cron', 'scheduler', 'queue', 'events', 'webhooks', 'background jobs', 'automation', 'triggers', 'retries', 'dead letter', 'pub sub', 'workflow', 'scheduled jobs'],
  hero: {
    scene: 'trigger-action-pulse',
    intensity: 'hero',
    eyebrow: 'Insights / Reliability',
    title: 'Three ways to start work, and who decides when.',
    intro:
      'A clock, a pile of jobs, or something that happened: each of these can start the same piece of work, and each fails in its own way. This guide compares them on a burst of jobs you can resize, then sets out how to choose.',
    code: 'INS.05',
    status: 'GUIDE · AUTOMATION',
    actions: [
      { label: 'Compare them', to: '/insights/triggers#try' },
      { label: 'Read the guide', to: '/insights/triggers#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'lanes', caption: 'Three lanes, three kinds of starting gun.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'triggerCompare',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 780,
      eyebrow: 'Try it',
      title: 'One burst of work, three triggers.',
      intro: 'Resize the burst, the number of workers and the schedule. Compare how long the average job waits, how large the backlog grows, and what is turned away.',
      note: 'A small, deterministic model: twenty-four ticks, a single burst, one tick per job. It shows shapes, not speeds, and is not a benchmark of any product.',
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
      title: 'Cron, queues and events.',
      intro: 'What each is for, what goes wrong with each, and how to keep any of them honest.',
      version: 'General guidance',
      summary: [
        '**Cron**: the clock decides. **Queue**: the work decides. **Event**: a fact decides.',
        'All three can deliver twice, so whatever they start must be safe to repeat.',
        'The failures that hurt are the **quiet** ones: a job that stopped running, a queue that is slowly filling.',
      ],
      meta: [
        { k: 'For', v: 'Anyone planning background work, automation or integrations' },
        { k: 'Kind', v: 'General guidance, not a recommendation of any product' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'later',
          title: 'Three ways to make something happen later',
          plain: 'The difference is what gives the starting signal.',
          body: [
            'Much of what a business system does is not a reply to a person. It is something that happens **afterwards**: send the receipt, close the day’s books, tell the warehouse, update the report. Three mechanisms cover nearly all of it.',
            {
              table: {
                head: ['', 'Cron', 'Queue', 'Event'],
                rows: [
                  ['What starts it', 'The time', 'There being something to do', 'Something having happened'],
                  ['Who decides when', 'A schedule someone wrote', 'The workers, as they become free', 'Whoever reacts, independently'],
                  ['Good at', 'Regular, predictable chores', 'Smoothing bursts; retrying one item at a time', 'Letting several parts of a system react without knowing each other'],
                  ['Poor at', 'Responding to work as it arrives', 'Telling many consumers about one thing', 'Doing exactly one thing in an exact order'],
                  ['Typical failure', 'It silently stops running', 'It silently fills up', 'A consumer misreads or misses an event'],
                ],
              },
              caption: 'Three starting guns. Most real systems use all three.',
            },
          ],
        },
        {
          id: 'cron',
          title: 'Cron: the clock decides',
          plain: 'Good for things that are due at a time, not because of an arrival.',
          body: [
            '{{cron}} runs something on a schedule: every night at two, every fifteen minutes, on the first of the month. It is the simplest of the three, and for fixed chores — a nightly report, a periodic clean-up — it is often the right one.',
            'Its weakness is that it knows nothing about the work. It wakes at its appointed time whether there is a great deal to do, a little, or none, and it does not notice if the previous run is still going. A cron job that does “everything that is waiting” turns a steady trickle into a once-a-day flood.',
            { list: [
              '**Keep the job small.** Let the cron job decide what needs doing and hand each piece on (often to a queue), rather than do all the work itself.',
              '**Avoid the top of the hour.** Dozens of jobs all set to run at `00` start together. Choose an odd minute.',
              '**Make it re-runnable.** If it runs twice, or is run by hand, the result should be the same.',
            ] },
          ],
        },
        {
          id: 'queues',
          title: 'Queues: the work decides',
          plain: 'A line of jobs, taken at the pace the workers can manage.',
          body: [
            'A {{queue}} holds jobs until a worker is free. The producer does not wait; the worker takes what it can; if a job fails, it can go back in line. That makes a queue the natural tool for smoothing a burst and for retrying one failed item without disturbing the rest.',
            'It also makes the backlog visible. How many jobs are waiting, and how long the oldest has been waiting, are among the most useful numbers a system can show.',
            { sub: 'What to know before you rely on one', body: [
              { list: [
                'Most queues give you {{at-least-once delivery}}. A job can arrive twice, so jobs must be safe to repeat.',
                'Order is rarely guaranteed unless you pay for it, and then only within a group. Do not build on an ordering you were not promised.',
                'A job that always fails (a “poison” message) can clog the line. Give it a limited number of attempts and then move it aside.',
                '{{back-pressure}} matters: when the queue is full, producers should slow down or be refused, not pile on.',
              ] },
            ] },
          ],
        },
        {
          id: 'events',
          title: 'Events: a fact decides',
          plain: 'Announce what happened; let others react.',
          body: [
            'An {{event}} says that something **has happened**: `order.paid`, `shipment.dispatched`. It is a fact, written in the past tense, with no instruction in it. The sender neither knows nor cares who is listening. Billing may react, so may the warehouse, so may a reporting job, and a new consumer can be added later without touching the sender.',
            'That looseness is the benefit and the price. Because nothing is waiting for an answer, nothing is guaranteed to have happened as a result. It is harder to see, afterwards, that everything that should have reacted did.',
            { list: [
              '**Name events as facts, not commands.** `order.paid`, not `send-receipt`. A command couples the sender to a particular consumer.',
              '**Put enough in the event** for consumers to act without calling back — but not so much that it is a copy of the whole record.',
              '**Version the shape.** Consumers will be written against it. Treat it as a {{contract}} (see the guide on APIs).',
              '**Give every event an id.** Consumers will need it to recognise a repeat.',
            ] },
            'A {{webhook}} is the same idea carried over the internet: your system receives a request from another when something happens there, instead of asking again and again ({{polling}}).',
          ],
        },
        {
          id: 'choosing',
          title: 'Choosing: who knows when?',
          plain: 'Ask what the real trigger is.',
          body: [
            'A reliable way to choose is to ask what the true reason for the work is.',
            {
              defs: [
                { k: 'Because it is 02:00', v: 'The clock is the reason. Use cron.' },
                { k: 'Because there is something to do', v: 'The arrival of work is the reason. Use a queue.' },
                { k: 'Because something happened that others care about', v: 'A fact is the reason. Publish an event.' },
              ],
            },
            'They also combine well. A cron job can look for what is due and put one job per item on a queue. A worker handling a queued job can publish an event when it finishes. The closing card of this page asks three questions and suggests which fits.',
          ],
        },
        {
          id: 'twice',
          title: 'Whichever you choose: expect it twice',
          plain: 'Duplicates are a property of all three.',
          body: [
            'A cron job can overlap its own previous run. A queue can deliver a message twice. A webhook sender will repeat itself if you answer slowly. Whatever the mechanism, the work that follows must be safe to repeat; the guide to idempotency sets out how.',
            'In practice this means recording what has already been done — a message id, an event id, a date — **in the same transaction** as the effect, and checking it first.',
          ],
        },
        {
          id: 'time',
          title: 'Time zones, daylight saving and other traps',
          plain: 'Schedules are written in local time, and local time misbehaves.',
          body: [
            'Most schedulers run in the time zone of the machine unless told otherwise. Two traps follow.',
            { list: [
              '**Daylight saving.** When clocks go forward, an hour does not exist, and a job set for it may not run. When they go back, an hour happens twice, and a job set for it may run twice. Know what your scheduler does, or avoid scheduling in those hours.',
              '**The wrong zone.** “Every day at 18:00” means different things in London and in Sydney. State the zone with the schedule.',
            ] },
            'Store and compare times in UTC. Convert to a local zone only to show a person a time.',
          ],
        },
        {
          id: 'overlap',
          title: 'When the last run has not finished',
          plain: 'Overlap is the quiet cause of many double effects.',
          body: [
            'A job meant to run every five minutes will eventually take six. The next one starts while the previous is still working, and both now work on the same items. Decide in advance what should happen.',
            { list: [
              '**Skip it.** If a run is already going, the new one stops at once. Simple, and usually right.',
              '**Lease it.** The job takes a lock that expires, so a crashed run does not block everything for ever.',
              '**Make the work disjoint.** Give each run its own slice, so overlap does not matter.',
            ] },
          ],
        },
        {
          id: 'retries',
          title: 'Retries, backoff and jitter',
          plain: 'Try again, but not all at once.',
          body: [
            'When a job fails for a temporary reason, trying again is right. Trying again immediately, and repeatedly, is not: a struggling service gets more requests exactly when it can least cope.',
            { list: [
              '{{backoff}}: wait longer after each failure — one second, then two, four, eight — up to a ceiling.',
              '{{jitter}}: add a small random amount, so a thousand jobs that failed together do not all return together.',
              '**A limit.** After a set number of attempts, stop and set the job aside.',
              '**Retry only what can succeed.** A temporary outage is worth retrying; a request that is simply invalid will fail every time.',
            ] },
          ],
        },
        {
          id: 'dead',
          title: 'A place for the ones that cannot be done',
          plain: 'Dead letters are not rubbish. They are a to-do list.',
          body: [
            'A job that has used up its attempts should not vanish. Move it to a {{dead-letter queue}}: a holding area that keeps it, with the error, for a person to look at. It stops the failing job from clogging the line, and it keeps the evidence.',
            'Then look at it. A dead-letter queue nobody reads is a bin. Alert when something arrives in it, and decide for each item whether to fix and replay it, or to discard it deliberately.',
          ],
        },
        {
          id: 'watch',
          title: 'Watching the quiet failures',
          plain: 'The worst failure is the one that makes no noise.',
          body: [
            'A web page that fails shouts. A background job that fails often does not. The cron job stopped three weeks ago and nobody noticed; the queue has been growing for a month. Watching for the absence of a thing needs deliberate design.',
            { list: [
              '**Heartbeat for scheduled jobs.** Have each run report success to a monitor, and alert when a report is **missing**. This is a {{heartbeat}}, sometimes called a dead-man’s switch.',
              '**Age, not just depth, for queues.** A queue of a thousand jobs that clears in a minute is healthy. One of ten that has not moved for an hour is not. Alert on the age of the oldest job.',
              '**Lag for events.** How far behind is each consumer?',
              '**Count what you expect.** “About forty receipts an hour” turns a silent stop into an alert.',
            ] },
          ],
        },
        {
          id: 'cheat',
          title: 'A cheat sheet',
          plain: 'One table to keep.',
          body: [
            {
              table: {
                head: ['If you need…', 'Reach for', 'And remember'],
                rows: [
                  ['A chore at a fixed time', 'Cron', 'Heartbeat it; skip if the last run is going'],
                  ['To smooth a burst of work', 'A queue', 'Watch the age of the oldest job'],
                  ['To retry one item, not the batch', 'A queue with limited attempts', 'Dead-letter what cannot be done'],
                  ['Several parts to react to one thing', 'An event', 'Name it as a fact; give it an id'],
                  ['To hear from another system', 'A webhook', 'Reply fast, process later, expect repeats'],
                  ['A time-based job that fans out', 'Cron → queue', 'Let cron decide what, the queue do it'],
                ],
              },
              caption: 'Most designs are two of these joined.',
            },
          ],
        },
      ],
      note: 'General guidance. It does not recommend any product, and it is not a description of any client system.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'whichOne',
      anchor: 'which',
      scene: 'trigger-action-pulse',
      tag: 'End of triggers',
      minHeight: 640,
      title: 'Which one for this job?',
      lede: 'Three questions about the job in front of you. The answer names the trigger that fits, and why the others do not.',
      questions: [
        { id: 'q1', text: 'What starts the work?', options: ['The time of day', 'Something that happened'] },
        { id: 'q2', text: 'Who needs to react?', options: ['One known worker', 'Several, some not yet known'] },
        { id: 'q3', text: 'Can one item fail without the others?', options: ['No — one run covers the lot', 'Yes — each item stands alone'] },
      ],
      outcomes: {
        '000': { name: 'Cron', why: 'The clock is the reason, one worker handles it, and one run covers the lot. This is what cron is for.', watch: 'A cron job that silently stops. Add a heartbeat, and skip a run if the last one is still going.' },
        '001': { name: 'Cron that feeds a queue', why: 'The time starts it, but each item can fail alone. Let cron decide what is due and put one job per item on a queue.', watch: 'Duplicates: a job can arrive twice. Record what is done in the same transaction as the effect.' },
        '010': { name: 'Cron that publishes an event', why: 'The clock starts it, but several parts of the system care. Have the schedule announce a fact, such as “day closed”, and let others react.', watch: 'Consumers that miss the event. Watch each one’s lag.' },
        '011': { name: 'A scheduled event, with a queue behind each consumer', why: 'Time starts it, many react, and each item can fail alone. Publish on a schedule, and give each consumer its own queue.', watch: 'A tangle. Name each event as a fact and give it an id.' },
        '100': { name: 'A queue', why: 'Something happened, one worker handles it, and one pass is enough. A queue smooths the burst and keeps the backlog visible.', watch: 'The age of the oldest job, not only the count.' },
        '101': { name: 'A queue with retries and a dead-letter queue', why: 'Something happened and each item can fail alone. Give each job a limited number of attempts, then set it aside for a person.', watch: 'A dead-letter queue nobody reads is just a bin.' },
        '110': { name: 'Events', why: 'A fact has occurred and several parts need to react, some not yet known. Publish it and let them subscribe.', watch: 'The shape of the event is a contract. Version it.' },
        '111': { name: 'Events, with a queue behind each consumer', why: 'A fact, many consumers, and items that can fail alone. Publish the event; give each consumer a queue with its own retries.', watch: 'Replays. Consumers must recognise an event they have already handled.' },
        default: { name: 'A queue', why: 'When in doubt, a queue is the most forgiving: it smooths bursts, retries one item at a time and shows its backlog.', watch: 'Make the work safe to repeat.' },
      },
      onward: [
        { label: 'Idempotency in order systems', to: '/insights/idempotency' },
        { label: 'APIs people can integrate against', to: '/insights/api-contracts' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
