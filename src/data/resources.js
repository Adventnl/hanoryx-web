/* The Resources section's shelves: the five browser tools and the documents that
   can be downloaded. Everything a download contains is generated in the visitor's
   browser when they press the button — nothing is fetched — so the files can be
   built from the site's own data (the glossary, the page list) and are always
   in step with it. */
import { glossary } from './glossary';
import { readinessGroups } from './readiness';
import { routePath } from '../app/routeConfig';

export const tools = [
  { id: 'contrast', to: '/resources/tools/contrast', title: 'Contrast checker', area: 'Design', blurb: 'Two colours in, the WCAG contrast ratio out, with a verdict for body text, large text and interface parts.', never: 'Sends no colour anywhere.' },
  { id: 'type-scale', to: '/resources/tools/type-scale', title: 'Type scale', area: 'Design', blurb: 'Pick a base size and a ratio. See every step set in type, and copy the sizes as CSS.', never: 'Loads no fonts and tracks nothing.' },
  { id: 'cron', to: '/resources/tools/cron', title: 'Cron explainer', area: 'Engineering', blurb: 'Paste a schedule. Read it in plain English and see the next times it will run, in your own time zone.', never: 'Runs nothing. It only explains.' },
  { id: 'readiness', to: '/resources/tools/readiness', title: 'Readiness check', area: 'Operations', blurb: 'Twenty questions to ask before something goes live. Get the gaps back as a list you can act on.', never: 'Keeps no answers once you leave.' },
  { id: 'decision-record', to: '/resources/tools/decision-record', title: 'Decision records', area: 'Engineering', blurb: 'Write down what was decided and why, in a form the next person can read. Download it as Markdown.', never: 'Stores nothing. Your text stays in the page.' },
];

const ruler = (n) => '='.repeat(n);

const runbook = `# Runbook: <the symptom, in the words of the person who sees it>

Owner: <name or team>      Last reviewed: <date>      Alert: <link>

## What you are seeing
<the alert text, exactly as it appears, and what a customer or colleague would say>

## Is it really this?
- [ ] <a quick check that rules it in>
- [ ] <a quick check that rules it out, and where to go instead>

## Do this first (safe whatever the cause)
- [ ] <first action>   Expect: <what you should see>

## Then
1. <a question that can be answered by looking>   Yes -> step 2. No -> step 4.

## How you will know it worked
<the graph, the number, the time>

## If it did not work
Who: <role, name, how to reach them>   When: <after how many minutes>
Say: <the symptom> / <what you tried> / <what you saw>

## Afterwards
<what to write down, and where>

## Background (for later)
<links to the explanation>
`;

const readme = `# <Service name>

> One sentence: what this is, and who it is for.

## Run it locally
<!-- The exact commands, from a clean machine to a working copy. -->

## Configuration and secrets
<!-- Every setting, what it does, and where its value lives. Never the value itself. -->

## How it fits together
<!-- A picture, and a paragraph: the parts, and where they meet. -->

## Release and rollback
<!-- How a change reaches production, and how to undo it. -->

## Tests
<!-- What runs, how to run it, and what a failure means. -->

## Running it
<!-- What is monitored, what the alerts mean, and links to the runbooks. -->

## Decisions
<!-- Links to the decision records, newest first. -->

## Known problems
<!-- What is fragile or wrong, and how to tell when it bites. -->

## Who to ask
<!-- Roles and names, and what each can answer. -->
`;

const decision = `# <Short title of the decision>

Status: <proposed | accepted | superseded by ...>
Date: <date>
Deciders: <who>

## Context
<What is the situation? What forces are at work? Write it so a stranger could follow it.>

## Options considered
1. <Option A> - <what it costs, what it buys>
2. <Option B> - <what it costs, what it buys>
3. <Option C> - <what it costs, what it buys>

## Decision
<What was chosen, in one or two sentences, and the main reason.>

## Consequences
<What becomes easier? What becomes harder? What must now be true? When should this be revisited?>
`;

const handover = `# Handover checklist

- [ ] How to run it on your own machine, tested on a clean machine
- [ ] Accounts, domains and keys held in the owner's name, and proved by signing in
- [ ] How to release, and how to roll back
- [ ] Backups, with a restore that has actually been tried
- [ ] Where secrets live, and how to change them
- [ ] A one-page picture of how the parts fit
- [ ] Decisions, written down with their reasons
- [ ] Tests that run on every change
- [ ] Runbooks for the problems that actually happen
- [ ] What is watched, and who is told
- [ ] A guide to the data: what each table holds, and who owns it
- [ ] A list of dependencies, and which are risky
- [ ] An honest list of known problems
- [ ] Who to ask, and about what
`;

const deprecation = `Subject: Deprecation notice - <what is going>

<what is going> is deprecated and will be removed on <date>.

Use instead: <what replaces it>.

What happens now:
  - Until <date> it keeps working exactly as before.
  - Responses carry two headers so your tooling can notice:
      Deprecation: true
      Sunset: <date, in HTTP format>
  - After <date> requests that depend on it will fail.

What we need from you: switch before that date. If you cannot, tell us what is in the way.
`;

const incident = `Subject: <short description of what people are seeing>

Status: <investigating | identified | monitoring | resolved>
Started: <time, with time zone>
Affects: <who, and what they cannot do>

What we know:
  - <one plain sentence at a time>

What we are doing:
  - <the next step, and who has it>

What you can do meanwhile:
  - <a workaround, or "nothing needed">

Next update: <time, with time zone>
`;

const accessReview = `Person,Role,Last signed in,Still needed (yes/no),Reviewed by,Date
,,,,,
,,,,,
,,,,,
`;

const auditExample = `{
  "at": "<server time, in UTC>",
  "actor": "agent_4417",
  "action": "order.refund",
  "target": "order_30211",
  "change": { "status": ["paid", "refunded"] },
  "reason": "Ticket 8812: arrived damaged",
  "request": "req_9f3a2c",
  "source": "support-console",
  "outcome": "success"
}
`;

const tokens = `/* A starting set of design tokens. Change the values, keep the names. */
:root {
  /* colour */
  --colour-ink: #0b0c0f;
  --colour-paper: #f5f5f2;
  --colour-accent: #d92b2b;
  --colour-muted: #6b6f76;
  --colour-line: rgba(255, 255, 255, 0.12);

  /* type */
  --font-body: system-ui, sans-serif;
  --font-display: Georgia, serif;
  --size-1: 0.875rem;
  --size-2: 1rem;
  --size-3: 1.25rem;
  --size-4: 1.5625rem;
  --size-5: 1.953rem;

  /* space (a 4px rhythm) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;

  /* shape */
  --radius-s: 4px;
  --radius-m: 10px;

  /* motion */
  --duration-quick: 120ms;
  --duration-base: 240ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root { --duration-quick: 0ms; --duration-base: 0ms; }
}
`;

const readinessSheet = () =>
  ['# Readiness check', '', 'Answer each with Yes, Partly, No or Not applicable. Everything that is not a Yes becomes an action.', '', ...readinessGroups.flatMap((g) => [`## ${g.name}`, `_${g.blurb}_`, '', ...g.questions.map((q) => `- [ ] ${q.text}   (Yes / Partly / No / N/A)`), ''])].join('\n');

const glossaryMd = () =>
  ['# Glossary', '', `${glossary.length} terms, in plain language.`, '', ...[...glossary].sort((a, b) => a.term.localeCompare(b.term)).flatMap((g) => [`**${g.term}** (${g.area})`, `: ${g.def}`, ''])].join('\n');

const pageList = async () => {
  const { loadAllPages } = await import('./pages'); // loaded on demand: the page index is browser-only
  const pages = await loadAllPages();
  const rows = Object.values(pages).map((p) => ({ path: routePath(p.key), title: p.title }));
  return ['PAGES ON THIS SITE', ruler(18), '', ...rows.map((r) => `${r.path.padEnd(38)} ${r.title}`), '', `${rows.length} pages`].join('\n');
};

/** `build` returns the file's text (or a promise of it). */
export const downloads = [
  { id: 'runbook', file: 'runbook-template.md', mime: 'text/markdown', area: 'Operations', title: 'Runbook template', blurb: 'One page that starts from the symptom and gets a tired reader to the first safe action.', see: '/insights/runbooks', build: () => runbook },
  { id: 'readme', file: 'README-template.md', mime: 'text/markdown', area: 'Delivery', title: 'README template', blurb: 'The sections a newcomer needs, each with a prompt saying what belongs there.', see: '/insights/handover', build: () => readme },
  { id: 'decision', file: 'decision-record-template.md', mime: 'text/markdown', area: 'Delivery', title: 'Decision record template', blurb: 'Context, options, decision, consequences. Five minutes to write, years to be grateful for.', see: '/resources/tools/decision-record', build: () => decision },
  { id: 'handover', file: 'handover-checklist.md', mime: 'text/markdown', area: 'Delivery', title: 'Handover checklist', blurb: 'Fourteen things that decide how quickly a newcomer can make a safe first change.', see: '/insights/handover', build: () => handover },
  { id: 'readiness', file: 'readiness-checklist.md', mime: 'text/markdown', area: 'Operations', title: 'Readiness checklist', blurb: 'The twenty questions of the readiness tool, as a printable list.', see: '/resources/tools/readiness', build: readinessSheet },
  { id: 'incident', file: 'incident-update-template.md', mime: 'text/markdown', area: 'Operations', title: 'Incident update template', blurb: 'A plain structure for telling people what is happening while it is happening.', see: '/insights/runbooks', build: () => incident },
  { id: 'deprecation', file: 'deprecation-notice-template.md', mime: 'text/markdown', area: 'Interfaces', title: 'Deprecation notice template', blurb: 'What is going, what replaces it, and the two headers that let tools notice.', see: '/insights/api-contracts', build: () => deprecation },
  { id: 'audit', file: 'audit-entry-example.json', mime: 'application/json', area: 'Security', title: 'Audit entry example', blurb: 'One structured entry: who, what, to which record, the change, the reason and the outcome.', see: '/insights/audit-trails', build: () => auditExample },
  { id: 'access', file: 'access-review-sheet.csv', mime: 'text/csv', area: 'Security', title: 'Access review sheet', blurb: 'A blank sheet for the quarterly question: should this person still be able to do this?', see: '/insights/permissions', build: () => accessReview },
  { id: 'tokens', file: 'design-tokens-starter.css', mime: 'text/css', area: 'Interfaces', title: 'Design tokens starter', blurb: 'Colour, type, space, shape and motion as named values, with reduced motion handled.', see: '/north/design-tokens', build: () => tokens },
  { id: 'glossary', file: 'glossary.md', mime: 'text/markdown', area: 'Reference', title: 'The glossary', blurb: `All ${glossary.length} terms, built from the site's own data so it is never out of date.`, see: '/resources/glossary', build: glossaryMd },
  { id: 'pages', file: 'site-pages.txt', mime: 'text/plain', area: 'Reference', title: 'List of pages', blurb: 'Every page on the site with its address and title, built when you press the button.', see: '/sitemap', build: pageList },
];
