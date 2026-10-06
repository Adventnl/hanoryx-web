import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/api-contracts',
  title: 'APIs People Can Integrate Against',
  accent: '#ff3333',
  aliases: ['api', 'api design', 'versioning', 'breaking changes', 'deprecation', 'integration', 'openapi', 'contract testing', 'backwards compatible', 'rest', 'response format'],
  hero: {
    scene: 'data-interface-wave',
    intensity: 'hero',
    eyebrow: 'Insights / Interfaces',
    title: 'An interface is a promise made to strangers.',
    intro:
      'Someone has built something on top of your response. You do not know what, and you will not be told when you break it. This guide is about making changes that people can survive — and the habits that keep an interface honest.',
    code: 'INS.06',
    status: 'GUIDE · INTERFACES',
    actions: [
      { label: 'Break a response', to: '/insights/api-contracts#try' },
      { label: 'Read the guide', to: '/insights/api-contracts#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'contract', caption: 'What was promised, and what each side may rely on.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'contractDiff',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 780,
      eyebrow: 'Try it',
      title: 'Change the response. See who breaks.',
      intro: 'Three consumers read the same response in three different ways. Tick a change and see which of them it breaks — including the one that surprises you.',
      consumers: [
        {
          id: 'app',
          name: 'The mobile app',
          how: 'Shows the total and a list of item numbers and prices. It ignores everything else in the response.',
          needs: [
            { path: 'total', type: 'number' },
            { path: 'items[].sku', type: 'string' },
            { path: 'items[].price', type: 'number' },
          ],
        },
        {
          id: 'ledger',
          name: 'The accounting export',
          how: 'Reads each item’s price and status, and writes one line to the ledger. It was written against a fixed list of statuses.',
          strictEnum: true,
          needs: [
            { path: 'items[].price', type: 'number' },
            { path: 'items[].status', type: 'enum:paid|shipped' },
          ],
        },
        {
          id: 'partner',
          name: 'A partner’s integration',
          how: 'Checks every response against a strict description, and rejects anything with a field it was not told about.',
          strict: true,
          needs: [
            { path: 'total', type: 'number' },
            { path: 'items[].sku', type: 'string' },
          ],
        },
      ],
      note: 'The response and the three consumers are invented for the demonstration. They stand for the kinds of reader any interface ends up with.',
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
      title: 'APIs people can integrate against.',
      intro: 'Compatibility, versioning, deprecation and the unglamorous habits that make an interface trusted.',
      version: 'General guidance',
      summary: [
        'An {{API}} is a {{contract}}. The people relying on it cannot all be found, so assume they exist.',
        'Adding is usually safe; renaming, removing and re-typing are not — and some “safe” changes still break strict readers.',
        'Announce {{deprecation}} early, say what replaces it, give a {{sunset}} date, and watch who still uses the old thing.',
      ],
      meta: [
        { k: 'For', v: 'Anyone who offers, or depends on, an interface between two systems' },
        { k: 'Kind', v: 'General guidance, not a specification' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'promise',
          title: 'An interface is a promise',
          plain: 'What you publish is what people will build on.',
          body: [
            'The moment something other than you reads your response, the response has become a **promise**. It says: these fields will be here, with these types, meaning these things, and these errors will mean these things. The promise is made whether or not you meant to make it, and it is relied on by people you may never meet.',
            'That is the difference between an interface and an internal function. An internal function can be renamed with a search-and-replace, because every caller is in the same repository. An interface cannot, because you cannot search other people’s code.',
          ],
        },
        {
          id: 'consumers',
          title: 'Who is on the other end',
          plain: 'Readers differ, and so do the ways they break.',
          body: [
            'It is helpful to imagine three kinds of reader, because they react to the same change in three different ways. The demonstration above is built around them.',
            {
              defs: [
                { k: 'The tolerant reader', v: 'Takes the fields it needs and ignores the rest. A {{tolerant reader}} survives additions and is only hurt when what it needs changes.' },
                { k: 'The fixed-list reader', v: 'Wrote its logic against a closed set of values, such as the list of statuses. A new value it has never seen falls through its logic.' },
                { k: 'The strict reader', v: 'Validates the whole response against a description and rejects anything unexpected. Even a harmless new field makes it fail.' },
              ],
            },
            'You do not choose which readers you have. You can find out, though, and you can be generous in how you introduce change.',
          ],
        },
        {
          id: 'additive',
          title: 'Adding is usually safe',
          plain: 'New fields rarely hurt a reader who ignores what it does not know.',
          body: [
            'For most readers, a new field is invisible. That is why “only add, never change” is the first rule of compatible interfaces, and why it is worth guarding: when you can reach a goal by adding something beside the old, do that, and mark the old for later removal.',
            { note: '“Usually” is carrying real weight. The strict reader in the demonstration breaks on a purely additive change. If you know you have strict readers, tell them what is coming, or ship the field behind an option they can switch on.', tone: 'warn', label: 'Not always' },
          ],
        },
        {
          id: 'breaking',
          title: 'What really breaks things',
          plain: 'Six changes that look small and are not.',
          body: [
            {
              table: {
                head: ['Change', 'Who it hurts', 'A safer way'],
                rows: [
                  ['Rename a field', 'Everyone who reads it', 'Add the new name; keep the old for a notice period; deprecate it'],
                  ['Remove a field', 'Everyone who reads it', 'Deprecate first, measure who still uses it, then remove'],
                  ['Change a field’s type', 'Typed readers; sometimes everyone', 'Add a new field with the new type'],
                  ['Change what a value means', 'Everyone, silently (the worst kind)', 'New field, new name; never reuse a name for a new meaning'],
                  ['Add a value to a fixed list', 'Fixed-list readers', 'Say from the start that lists may grow; announce additions'],
                  ['Tighten validation', 'Callers who sent what used to be accepted', 'Warn first; enforce later; document the rule'],
                ],
              },
              caption: 'Quietly changing a meaning is more dangerous than removing a field. The second is at least loud.',
            },
            'Defaults are also part of the contract. If a missing parameter used to mean “the last thirty days” and now means “everything”, no field has changed and every reader has.',
          ],
        },
        {
          id: 'versioning',
          title: 'Versioning',
          plain: 'A way of saying “this is the one you agreed to”.',
          body: [
            'Versions let old readers keep an old shape while new ones adopt the new. There are several ways to do it, and each has costs.',
            {
              table: {
                head: ['Approach', 'How it looks', 'Good for', 'Cost'],
                rows: [
                  ['In the address', '`/v2/orders`', 'Clear, visible, easy to route', 'Whole-API jumps; people stay on old versions'],
                  ['In a header', '`Accept-Version: 2`', 'Clean addresses', 'Easy to forget; harder to test by hand'],
                  ['By date', '`Version: 2026-03-01`', 'Small, frequent changes per customer', 'More states to support'],
                  ['None, additive only', 'One shape, always growing', 'Small interfaces with friendly readers', 'The old never goes away'],
                ],
              },
              caption: 'None is free. Whichever is chosen, supporting two versions is a standing cost: decide how long.',
            },
            'Numbering schemes such as {{semantic versioning}} help for libraries, where the number can be read by a machine. For a web interface, the clearer promise is the written one: which versions exist, which are supported, and until when.',
          ],
        },
        {
          id: 'deprecation',
          title: 'Deprecating well',
          plain: 'Give notice, offer a replacement, and watch the traffic.',
          body: [
            'Everything is eventually retired. The kindness is in how. A good {{deprecation}} has five parts:',
            { ol: [
              '**Say what is going**, precisely: a field, a route, a behaviour.',
              '**Say what replaces it**, with an example that can be run.',
              '**Give a date** after which it will stop working — the {{sunset}}.',
              '**Say it where machines can see it.** Send `Deprecation` and `Sunset` headers on affected responses, so tools can notice without anyone reading an email.',
              '**Watch who still uses it.** Log use of the old thing by caller, and contact the callers still on it before the date, not after.',
            ] },
            'The notice period should be as long as your slowest reader needs, not as short as you can get away with. The closing card of this page drafts a notice and the two headers.',
          ],
        },
        {
          id: 'errors',
          title: 'Errors are part of the contract',
          plain: 'People write code that handles them. Keep them stable.',
          body: [
            'Readers branch on errors: retry this one, show that one to the customer, give up on the third. They can only do so if errors are stable, specific and machine-readable.',
            { list: [
              'Use the HTTP status honestly: a client mistake is `4xx`, a server problem is `5xx`. Retrying a `5xx` can be right; retrying a `4xx` never is.',
              'Return a **stable code** in the body (`card_declined`, `out_of_stock`), separate from the human message, which can be reworded freely.',
              'There is a standard shape for this, “problem details” (RFC 9457), which many tools already understand.',
              'Never put secrets, or internal detail an attacker would value, in an error.',
            ] },
            { code: '{\n  "type": "https://example.test/problems/out-of-stock",\n  "title": "That item is out of stock",\n  "status": 409,\n  "code": "out_of_stock",\n  "detail": "Only 2 of item sku_5509 remain; 3 were requested."\n}' },
          ],
        },
        {
          id: 'lists',
          title: 'Lists, pages and order',
          plain: 'The boring part that breaks readers most.',
          body: [
            'Any list that can grow needs paging, and the way it is paged is a promise. Page-number paging (“give me page 3”) drifts when rows are added while someone is reading: a row is shown twice or skipped. {{cursor pagination}} (“give me what comes after this one”) does not.',
            { list: [
              '**State the order.** If a list has no declared order, some reader will depend on the accidental one.',
              '**Make the order stable.** Sort by something unique as the tie-breaker.',
              '**Cap the page size**, and say what the cap is.',
              '**Say what an empty result looks like**: an empty list, not an error, and not nothing.',
            ] },
          ],
        },
        {
          id: 'docs',
          title: 'Documentation is the contract’s other half',
          plain: 'If it is not written down, it was not promised.',
          body: [
            'A written description turns a hope into a promise, and it gives readers somewhere to look first. Prefer a **machine-readable** description — {{OpenAPI}} is the common one for web interfaces — from which the human documentation, example requests and checks can be produced, so they cannot drift apart.',
            { list: [
              '**Examples that run.** Every example in the documentation should be a real request that works today.',
              '**A changelog**, in plain words, that says what changed and who it affects.',
              '**The things that are not promised.** Say that the order of fields in JSON is not guaranteed, that new fields may appear, that lists may grow. Naming the freedoms you keep is part of the promise.',
            ] },
          ],
        },
        {
          id: 'testing',
          title: 'Testing the contract',
          plain: 'Check the promise, not just the code.',
          body: [
            'Ordinary tests check that the code does what the author intended. Contract tests check that the **shape** of the response is the shape that was promised, so an accidental rename is caught before it ships.',
            { ol: [
              'Compare each response against the written description, in the automated build.',
              'Compare the description between releases, and flag any change that removes, renames or re-types.',
              'Where you can, keep a sample of what real readers need, and run it against each release. This is the idea behind consumer-driven contract tests.',
              'Test the errors as thoroughly as the successes.',
            ] },
          ],
        },
        {
          id: 'limits',
          title: 'Limits and behaviour under load',
          plain: 'How it behaves when things go wrong is also promised.',
          body: [
            'Rate limits, timeouts and maximum sizes are part of the contract, and are a frequent surprise because they appear only under load. Publish them. Tell callers when they are close, through headers, and tell them what to do when they are over: which status, and how long to wait.',
            'Make retries safe by supporting an idempotency key on operations that change things (see the guide on idempotency), and say how long keys are remembered.',
          ],
        },
        {
          id: 'checklist',
          title: 'A checklist to take away',
          plain: 'Ten questions to ask before changing an interface.',
          body: [
            { ol: [
              'Who reads this? Do I know all of them?',
              'Can I add instead of change?',
              'Does any change alter what a value means, or a default?',
              'Could a strict reader be hurt even by an addition?',
              'Is the change written in the changelog, in plain words?',
              'If it removes something, has it been deprecated with headers and a date?',
              'Do I know who still uses the old thing?',
              'Are errors stable, coded and documented?',
              'Is the description machine-readable, and checked in the build?',
              'Is it clear which versions are supported, and until when?',
            ] },
          ],
        },
      ],
      note: 'General guidance. It is not a specification, and it does not describe any particular interface.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'deprecationNotice',
      anchor: 'notice',
      scene: 'data-interface-wave',
      tag: 'End of API contracts',
      minHeight: 640,
      title: 'Write the notice before you break anything.',
      lede: 'Say what is going, what replaces it and how long people have. Out come the announcement and the two response headers that let tools notice by themselves.',
      onward: [
        { label: 'Cron, queues and events', to: '/insights/triggers' },
        { label: 'Designing for handover', to: '/insights/handover' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
