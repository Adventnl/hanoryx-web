import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/idempotency',
  title: 'Idempotency in Order Systems',
  accent: '#ff3333',
  aliases: ['idempotent', 'idempotency key', 'duplicate payment', 'double charge', 'retries', 'exactly once', 'duplicate orders', 'safe to retry', 'payments'],
  hero: {
    scene: 'transaction-wave',
    intensity: 'hero',
    eyebrow: 'Insights / Reliability',
    title: 'Pressing pay twice should not cost twice.',
    intro:
      'A request leaves, its answer is lost on the way back, and the client — quite reasonably — asks again. Whether that costs the customer twice is decided by one design choice, made long before. This guide explains it, with something to press.',
    code: 'INS.01',
    status: 'GUIDE · RELIABILITY',
    actions: [
      { label: 'Try it', to: '/insights/idempotency#try' },
      { label: 'Read the guide', to: '/insights/idempotency#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'retry', caption: 'One intent, many attempts, one effect.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'idempotencyDemo',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 700,
      eyebrow: 'Try it',
      title: 'Press Pay. Lose the answer. Retry.',
      intro: 'The first request succeeds, but its answer is lost on the way back, so the client sends it again. Switch the key on and off, and watch what the ledger does.',
      amount: 20,
      note: 'A simulation that runs in your browser. No payment is made, and nothing is sent anywhere.',
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
      title: 'Idempotency, in order systems.',
      intro: 'Why retries are unavoidable, what makes them safe, and how to build the part that matters.',
      version: 'General guidance',
      summary: [
        'A network call can fail **after** the work was done. The caller cannot tell the difference, so it must retry.',
        'A retry is safe only if the operation is {{idempotent}}: doing it twice has the effect of doing it once.',
        'The usual tool is an {{idempotency key}}, kept **in the same transaction** as the work it protects.',
      ],
      meta: [
        { k: 'For', v: 'Anyone building or buying order, payment or booking systems' },
        { k: 'Kind', v: 'General guidance, not a promise about any particular system' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'problem',
          title: 'The problem, in one sentence',
          plain: 'You cannot tell “it never arrived” from “it arrived and the answer was lost”.',
          body: [
            'Picture a customer pressing **Pay**. The browser sends a request; the server charges the card and writes the order; the reply starts back — and the connection drops. The browser now holds no answer. It cannot know whether the charge happened.',
            'There are only two honest things it can do. It can give up, and risk leaving a customer who has paid with no order. Or it can ask again, and risk charging them twice. Both are wrong. The way out is to change the question: make asking again **safe**.',
            { quote: 'If asking twice is harmless, the uncertainty stops mattering.', cite: 'The whole idea, in a line' },
          ],
        },
        {
          id: 'retries',
          title: 'Why retries are unavoidable',
          plain: 'Even a perfect server is called through a network that is not perfect.',
          body: [
            'It is tempting to treat duplicates as a rare accident. They are not. Every layer between the person and the database has a reason to try again, and most of them do so without asking anyone.',
            {
              table: {
                head: ['Where the duplicate comes from', 'Why it happens'],
                rows: [
                  ['The person', 'The page seemed to hang, so they pressed the button again. Or double-clicked.'],
                  ['The browser or app', 'A request timed out on a weak connection and was sent again automatically.'],
                  ['A proxy or load balancer', 'It saw a dropped connection and replayed the request to another server.'],
                  ['A job queue', 'Most queues promise {{at-least-once delivery}}: a message may arrive twice, never zero times.'],
                  ['A webhook sender', 'The receiver was slow to answer, so the sender tried again later, as it is told to.'],
                  ['A human operator', 'Someone re-ran a script after it seemed to fail, not knowing how far it got.'],
                ],
              },
              caption: 'Six places a second copy appears. None of them is a bug in the usual sense.',
            },
            'So the question is never “will this be retried?”. It is “what happens when it is?”. A system designed on the first question is surprised in production. One designed on the second is not.',
          ],
        },
        {
          id: 'meaning',
          title: 'What “idempotent” means',
          plain: 'Doing it again has no further effect.',
          body: [
            'An operation is {{idempotent}} if performing it many times leaves the world in the same state as performing it once. “Set the delivery address to X” is idempotent: do it five times and the address is still X. “Add £20 to the balance” is not: do it five times and the balance is £100 higher.',
            'Two things are worth keeping apart. **Safe** means “does not change anything” (reading a page). **Idempotent** means “changing it again changes nothing more”. Every safe operation is idempotent; many idempotent operations are not safe.',
            {
              defs: [
                { k: 'Safe', v: 'It only reads. Asking costs nothing. Example: fetching an order.' },
                { k: 'Idempotent', v: 'It may change things, but only once. Example: cancelling an order that is then cancelled again.' },
                { k: 'Neither', v: 'Each call adds a new effect. Example: “create an order” sent as a plain POST.' },
              ],
            },
            'HTTP itself describes `GET`, `PUT` and `DELETE` as idempotent and `POST` as not. That is a description of what the verbs are for, not a guarantee about your server. Plenty of `PUT`s are written carelessly, and plenty of `POST`s can be made safe. What matters is what your code actually does.',
          ],
        },
        {
          id: 'key',
          title: 'The idempotency key',
          plain: 'A label for the intent, so a repeat can be recognised.',
          body: [
            'The most common way to make a non-idempotent operation safe is to give each **intent** a unique label — an {{idempotency key}} — and have the server remember which labels it has already handled.',
            { sub: 'How it works', body: [
              {
                steps: [
                  { title: 'The client makes a key', body: 'When the person first expresses the intent (opens the checkout, presses Pay), the client generates a random value such as a UUID and keeps it.' },
                  { title: 'It sends the key with the request', body: 'Usually as a header, for example `Idempotency-Key: 7b1c…`. Every attempt for this intent carries the same value.' },
                  { title: 'The server looks the key up', body: 'If it has never seen it, it records the key as “in progress”, does the work, and stores the result against the key.' },
                  { title: 'A repeat finds the result', body: 'If the key is already there, the server does not do the work again. It returns the stored result — the same status, the same body — as though it had just done it.' },
                ],
              },
            ] },
            { sub: 'The smallest honest version', body: [
              { code: "// pseudo-code: one transaction, one unique constraint\nBEGIN;\n  INSERT INTO idempotency (key, fingerprint, status)\n  VALUES ($key, $fingerprint, 'in_progress')\n  ON CONFLICT (key) DO NOTHING;\n\n  -- if nothing was inserted, the key was already used:\n  --   same fingerprint + finished  -> replay the stored response\n  --   same fingerprint + running   -> tell the caller to wait\n  --   different fingerprint        -> reject: key reused for another request\n\n  -- otherwise, do the work in this same transaction:\n  INSERT INTO orders (...) VALUES (...);\n  INSERT INTO charges (...) VALUES (...);\n  UPDATE idempotency SET status = 'done', response = $response WHERE key = $key;\nCOMMIT;" },
            ] },
            { note: 'The key is chosen by the **client**, per intent — not per attempt, and not by the server. A key created fresh for each attempt defeats the purpose: every retry would look new.', tone: 'warn', label: 'The most common mistake' },
          ],
        },
        {
          id: 'transaction',
          title: 'Keep the key in the same transaction as the work',
          plain: 'If they can disagree, they eventually will.',
          body: [
            'The key and the effect it protects have to succeed or fail **together**. If the key is saved in one place (a cache, say) and the order in another (the database), there is a moment — a crash, a timeout — when one exists without the other.',
            {
              table: {
                head: ['If the key is stored…', 'Then a crash between the two steps leaves…'],
                rows: [
                  ['Before the work, separately', 'A key with no order. The retry is told “already done” and the customer is left with nothing.'],
                  ['After the work, separately', 'An order with no key. The retry does the work again and the customer is charged twice.'],
                  ['With the work, in one transaction', 'Both or neither. The retry either finds the finished result or starts cleanly.'],
                ],
              },
              caption: 'The same crash, three places to keep the key.',
            },
            'A database {{unique constraint}} is the quiet hero here. Two requests arriving at the same instant cannot both insert the same key; one wins and the other is told so. No clever locking is needed, because the database already does it correctly.',
            'When the work crosses systems — your database **and** a card processor — the card processor needs to be passed a key too. Pass it the same key (or one derived from it) so that the whole chain is safe, not just your part.',
          ],
        },
        {
          id: 'mismatch',
          title: 'Same key, different request',
          plain: 'A key is a promise about one request. Hold the caller to it.',
          body: [
            'Sometimes a key is reused by mistake: a bug, a copy-and-paste, a client that never generates a new one. If the server replays the stored answer for a request that is actually **different**, the caller is told their £200 order succeeded when only the earlier £20 one did.',
            'The remedy is a **fingerprint**: a hash of the parts of the request that define the intent (the method, the path, the body). Store it with the key. When a request arrives with a known key but a different fingerprint, do not replay. Reject it with a clear error that says the key was used for something else.',
            { note: 'Reject loudly. A mismatch is a bug in the caller, and the sooner they see it, the sooner it is fixed.', label: 'Why an error and not a guess' },
          ],
        },
        {
          id: 'concurrent',
          title: 'Two requests at once',
          plain: 'The retry can arrive while the first is still running.',
          body: [
            'Retries do not always wait politely. A client that times out after five seconds may retry while the server is still working on the first attempt, which is perfectly healthy and simply slow. Now two requests with the same key are running.',
            'Because the key was recorded as “in progress” before the work began, the second one can see that. There are three reasonable responses, and the choice is yours to make deliberately:',
            { list: [
              '**Wait**, then return the first request’s result when it finishes. Friendliest for the caller; costs a connection held open.',
              '**Refuse with a “try again shortly” status** (for example `409 Conflict`), and let the caller’s own backoff handle it. Simple and predictable.',
              '**Never let both run.** Two copies of the work is the one wrong answer.',
            ] },
          ],
        },
        {
          id: 'store',
          title: 'What to store, and for how long',
          plain: 'Enough to replay the answer; long enough to outlast the retries.',
          body: [
            'Store the **status and body** that was returned, not just “done”. The point of a replay is that the caller cannot tell the difference between the first answer and the second.',
            'Be careful about what you replay. A successful result, and a failure that would happen again (a rejected card, a validation error), can be stored. A **transient** failure — the database was briefly unavailable, a dependency timed out — should not be, or the retry will be told “failed” for something that would now succeed. Release the key and let the retry run for real.',
            { sub: 'How long to keep it', body: [
              'Longer than the longest time any client will keep retrying. Hours is common for browsers and apps; days if a queue or a partner sends retries on a schedule. After that, remove the key, and the table does not grow without bound.',
              'Write the period down and tell consumers. “Keys are remembered for 24 hours” is a part of the {{contract}}.',
            ] },
          ],
        },
        {
          id: 'elsewhere',
          title: 'It is not only for payments',
          plain: 'Anything that sends, books, reserves or creates.',
          body: [
            'Payments are the memorable case because the cost of a mistake is plain. The same reasoning applies wherever repeating an action would be visible or expensive.',
            {
              table: {
                head: ['Operation', 'What a duplicate would do', 'A natural way to prevent it'],
                rows: [
                  ['Create an order', 'Two orders for one basket', 'A key per checkout; or a unique order number derived from the basket'],
                  ['Send a confirmation email', 'The customer receives it twice', 'Record “sent” against the order, and check before sending'],
                  ['Reserve stock', 'Stock is held twice and sold out early', 'A key per reservation, or a unique (order, line) constraint'],
                  ['Handle a webhook', 'An event is acted on twice', 'Store the sender’s event id and ignore ids already seen'],
                  ['Process a queue message', 'A job runs twice', 'The same: remember the message id in the same transaction as its effect'],
                  ['Issue a refund', 'Money goes back twice', 'A key per refund request, and a rule that refunds cannot exceed the charge'],
                ],
              },
              caption: 'Six operations, six ways a duplicate hurts.',
            },
          ],
        },
        {
          id: 'natural',
          title: 'Sometimes the data already has a key',
          plain: 'A natural identifier can do the same job.',
          body: [
            'Not every operation needs a separate key. If the thing being created has an identifier that the **client** chooses, a unique constraint on that identifier is itself the protection. `PUT /orders/{id}` with a client-chosen id is idempotent by construction: the second call finds the order that the first created.',
            'A related tool is the **conditional write**. The caller says “change this, but only if it is still at version 7”. If a retry arrives after the change has happened, the version is now 8, the condition fails, and the retry changes nothing. In HTTP this is what `If-Match` and entity tags are for.',
          ],
        },
        {
          id: 'testing',
          title: 'How to test it',
          plain: 'Break the connection on purpose, at the worst moment.',
          body: [
            'The failures that matter happen between steps, which ordinary tests never reach. Test them directly.',
            { ol: [
              '**Drop the response after the commit.** Run the request, throw the answer away, run it again. Expect exactly one effect and an identical answer.',
              '**Send the same request 50 times at once.** Expect exactly one effect and no errors other than the deliberate “in progress” ones.',
              '**Reuse a key with a different body.** Expect a clear rejection, and no effect.',
              '**Kill the process halfway.** Restart and retry. Expect either the whole effect or none of it, never part.',
              '**Let the key expire, then retry.** Know what happens, write it down, and decide whether you are content with it.',
            ] },
            'Keep these as automated tests. Idempotency is easy to break by accident: a new field in the request, a new side effect added outside the transaction, a cache put in front.',
          ],
        },
        {
          id: 'mistakes',
          title: 'Mistakes that keep recurring',
          plain: 'Seven ways it quietly goes wrong.',
          body: [
            { list: [
              '**A new key for every attempt.** Nothing is ever recognised as a repeat.',
              '**Keys generated by the server.** The client never learns the key if the first answer is lost.',
              '**The key stored outside the transaction.** The gap between them is where the duplicates live.',
              '**Keys that expire before the retries stop.** The last retry is treated as new.',
              '**Time used as a key.** Two intents in the same millisecond collide, and one retry is a different time.',
              '**A different answer on replay.** The caller sees a success, then an error, for the same intent.',
              '**Side effects outside the protection.** The order is safe, but the confirmation email is sent twice.',
            ] },
            { note: 'This is general engineering guidance written for this site. It is not a description of any client system, and it is not legal, financial or compliance advice.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'checklist',
          title: 'A checklist to take away',
          plain: 'Ten questions to ask of any operation that matters.',
          body: [
            { ol: [
              'What happens if this request is sent twice?',
              'Who generates the key, and when? (The client, once per intent.)',
              'Is the key stored in the same transaction as the effect?',
              'Is there a unique constraint, so that two at once cannot both win?',
              'What is stored with the key: the response, and a fingerprint?',
              'What happens when the key is reused for a different request?',
              'What happens when the first request is still running?',
              'Are transient failures kept out of the stored results?',
              'How long are keys kept, and is that written in the contract?',
              'Is every side effect — email, stock, refund — inside the same protection?',
            ] },
          ],
        },
      ],
      note: 'General guidance. It describes a common design and is not a promise about how any system built by Hanoryx behaves.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'takeawayDeck',
      anchor: 'keep',
      scene: 'transaction-wave',
      tag: 'End of idempotency',
      minHeight: 560,
      title: 'Five cards worth keeping.',
      lede: 'The guide, folded down. Page through them with the arrows, or the arrow keys.',
      cards: [
        { title: 'Retries are normal', body: 'Every layer between the person and the database may send a request again. Design for the second copy, not against it.' },
        { title: 'Key the intent', body: 'The client makes one key per intent, and sends it with every attempt. A new key per attempt recognises nothing.' },
        { title: 'One transaction', body: 'Keep the key in the same transaction as the effect, with a unique constraint. If they can disagree, they will.' },
        { title: 'Fingerprint it', body: 'A key is a promise about one request. If it comes back attached to a different one, say so loudly.' },
        { title: 'Test the gap', body: 'Drop the answer after the commit. Send fifty at once. Kill the process halfway. The bugs live between the steps.' },
      ],
      onward: [
        { label: 'Audit trails that answer questions', to: '/insights/audit-trails' },
        { label: 'Cron, queues and events', to: '/insights/triggers' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
