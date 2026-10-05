/* The site's glossary. One list, three uses: the Glossary page browses it, the
   long guides explain a {{word}} from it on hover, and the search index reads
   it. Plain language first; each entry says what the thing is, not how clever
   it is. `see` points at a page on this site where the idea is worked through. */

export const glossaryAreas = ['Reliability', 'Data', 'Security', 'Interfaces', 'Motion', 'Process'];

export const glossary = [
  /* ---------- Reliability ---------- */
  { term: 'idempotent', area: 'Reliability', def: 'An operation that has the same effect whether it is done once or many times. That is what makes it safe to retry.', see: 'insights/idempotency' },
  { term: 'idempotency key', area: 'Reliability', def: 'A unique value a client sends with a request, so the server can recognise a retry and replay its first answer instead of doing the work again.', see: 'insights/idempotency' },
  { term: 'retry', area: 'Reliability', def: 'Trying a failed operation again. It is only safe when repeating the operation cannot do harm.', see: 'insights/idempotency' },
  { term: 'backoff', area: 'Reliability', def: 'Waiting longer between each retry (one second, two, four…) so a struggling service gets room to recover.', see: 'insights/triggers' },
  { term: 'jitter', area: 'Reliability', def: 'A small random amount added to a wait, so that many clients do not all retry at the same instant.', see: 'insights/triggers' },
  { term: 'timeout', area: 'Reliability', def: 'The longest a caller will wait for an answer before giving up. Giving up does not mean the work did not happen.', see: 'insights/idempotency' },
  { term: 'at-least-once delivery', area: 'Reliability', def: 'A promise that a message will arrive one or more times: never zero, but possibly twice. Whoever receives it must cope with duplicates.', see: 'insights/triggers' },
  { term: 'dead-letter queue', area: 'Reliability', def: 'A holding place for messages that keep failing, so they stop blocking the rest and a person can look at them.', see: 'insights/triggers' },
  { term: 'back-pressure', area: 'Reliability', def: 'Slowing down or refusing new work when a system is already full, instead of piling it up until something breaks.', see: 'insights/triggers' },
  { term: 'circuit breaker', area: 'Reliability', def: 'A switch that stops calling a failing service for a while, so the caller fails fast and the service can recover.' },
  { term: 'SLO', area: 'Reliability', def: 'A service-level objective: a target for how well a service should perform, such as “99.9% of requests succeed”, agreed in advance.' },
  { term: 'runbook', area: 'Reliability', def: 'A short document that tells whoever is on call what to check and what to do for one specific problem.', see: 'insights/runbooks' },
  { term: 'on-call', area: 'Reliability', def: 'Being the person who can be reached to respond when a system raises an alert, for a set period.', see: 'insights/runbooks' },
  { term: 'incident', area: 'Reliability', def: 'An event that harms, or threatens to harm, a service people depend on.', see: 'insights/runbooks' },
  { term: 'blameless review', area: 'Reliability', def: 'A written look back at an incident that asks how the system allowed it to happen, not who to blame.', see: 'insights/runbooks' },
  { term: 'heartbeat', area: 'Reliability', def: 'A signal a scheduled job sends to show that it ran. If the signal stops arriving, an alert fires. Also called a dead-man’s switch.', see: 'insights/triggers' },
  { term: 'failover', area: 'Reliability', def: 'Switching to a backup when the main system stops working.' },
  { term: 'rollback', area: 'Reliability', def: 'Returning to the previous version after a change goes wrong.' },

  /* ---------- Data ---------- */
  { term: 'audit trail', area: 'Data', def: 'An append-only record of who did what to which record, when and why, kept so that it can be checked later.', see: 'insights/audit-trails' },
  { term: 'append-only', area: 'Data', def: 'A record you can add to but not change or delete.', see: 'insights/audit-trails' },
  { term: 'source of truth', area: 'Data', def: 'The one place where a piece of information is authoritative. Every other copy defers to it.' },
  { term: 'transaction', area: 'Data', def: 'A group of changes that either all happen or none do.', see: 'insights/idempotency' },
  { term: 'unique constraint', area: 'Data', def: 'A database rule that refuses a second row with the same value, however many requests arrive at once.', see: 'insights/idempotency' },
  { term: 'schema', area: 'Data', def: 'The agreed shape of data: which fields it has and what type each one is.' },
  { term: 'migration', area: 'Data', def: 'A controlled change to a database’s structure or contents, applied in order and recorded.' },
  { term: 'cursor pagination', area: 'Data', def: 'Paging through results by saying “after this one” instead of “page 3”, so results do not shift while data changes.', see: 'insights/api-contracts' },
  { term: 'backup', area: 'Data', def: 'A copy of data kept so that it can be restored. It is only a backup once a restore has been tried.', see: 'insights/handover' },
  { term: 'restore test', area: 'Data', def: 'Actually restoring a backup somewhere safe, to prove that it works and to learn how long it takes.', see: 'insights/handover' },
  { term: 'webhook', area: 'Data', def: 'A request one system sends to another when something happens, so the other does not have to keep asking.', see: 'insights/triggers' },
  { term: 'event', area: 'Data', def: 'A record that something happened (“order paid”), published so that others can react to it.', see: 'insights/triggers' },
  { term: 'queue', area: 'Data', def: 'A line of jobs or messages waiting to be handled by one or more workers.', see: 'insights/triggers' },
  { term: 'cron', area: 'Data', def: 'A schedule that runs a job at set times, such as “every day at 02:00”.', see: 'insights/triggers' },
  { term: 'polling', area: 'Data', def: 'Asking again and again whether something has changed.', see: 'insights/triggers' },
  { term: 'data retention', area: 'Data', def: 'How long information is kept before it is deleted, and who decides.', see: 'legal/retention' },

  /* ---------- Security ---------- */
  { term: 'authentication', area: 'Security', def: 'Proving who you are.', see: 'insights/permissions' },
  { term: 'authorisation', area: 'Security', def: 'Deciding what you are allowed to do, once it is known who you are.', see: 'insights/permissions' },
  { term: 'least privilege', area: 'Security', def: 'Giving an account only the powers its job needs, and no more.', see: 'insights/permissions' },
  { term: 'deny by default', area: 'Security', def: 'Treating anything that has not been explicitly allowed as forbidden.', see: 'insights/permissions' },
  { term: 'role', area: 'Security', def: 'A named bundle of permissions, such as “support agent”.', see: 'insights/permissions' },
  { term: 'permission', area: 'Security', def: 'Permission to do one particular thing, such as “refund an order”.', see: 'insights/permissions' },
  { term: 'scope', area: 'Security', def: 'A limit on where a permission applies, such as “only your own records” or “only this team”.', see: 'insights/permissions' },
  { term: 'RBAC', area: 'Security', def: 'Role-based access control: access decided by which roles a person holds.', see: 'insights/permissions' },
  { term: 'break-glass access', area: 'Security', def: 'A temporary, logged, emergency route to higher powers, to be used only when it is really needed.', see: 'insights/permissions' },
  { term: 'service account', area: 'Security', def: 'An identity used by software rather than by a person.', see: 'insights/permissions' },
  { term: 'API key', area: 'Security', def: 'A secret string that identifies the software calling an API.' },
  { term: 'secret', area: 'Security', def: 'Anything that grants access to whoever knows it: passwords, keys, tokens. It is never kept in code.' },
  { term: 'token', area: 'Security', def: 'A short-lived proof of identity or permission handed to software.' },
  { term: 'BOLA', area: 'Security', def: 'Broken object-level authorisation (also called IDOR): the server checks that you are signed in but not that the record is yours, so changing an id reaches someone else’s data.', see: 'insights/permissions' },
  { term: 'threat model', area: 'Security', def: 'A short, honest list of what could go wrong and who might make it happen.', see: 'company/security' },
  { term: 'CSP', area: 'Security', def: 'Content Security Policy: a header that tells the browser which sources of scripts and styles to trust.' },
  { term: 'TLS', area: 'Security', def: 'The protocol that encrypts traffic between a browser and a site. It is the “s” in https.' },
  { term: 'vulnerability disclosure', area: 'Security', def: 'A published, safe way for people to report a security problem to the people who can fix it.', see: 'trust/disclosure' },

  /* ---------- Interfaces ---------- */
  { term: 'API', area: 'Interfaces', def: 'A way for one program to ask another to do something, under agreed rules.', see: 'insights/api-contracts' },
  { term: 'contract', area: 'Interfaces', def: 'What an API promises to those who use it: its fields, their types, its errors and its behaviour.', see: 'insights/api-contracts' },
  { term: 'breaking change', area: 'Interfaces', def: 'A change that makes something that used to work stop working.', see: 'insights/api-contracts' },
  { term: 'tolerant reader', area: 'Interfaces', def: 'A consumer that ignores what it does not need, so that extra fields in a response do not break it.', see: 'insights/api-contracts' },
  { term: 'deprecation', area: 'Interfaces', def: 'Announcing that something will be removed, with notice and a replacement.', see: 'insights/api-contracts' },
  { term: 'sunset', area: 'Interfaces', def: 'The date after which a deprecated feature stops working.', see: 'insights/api-contracts' },
  { term: 'semantic versioning', area: 'Interfaces', def: 'A numbering scheme (MAJOR.MINOR.PATCH) in which the first number changes only when something breaks.' },
  { term: 'OpenAPI', area: 'Interfaces', def: 'A standard, machine-readable way of describing an HTTP API.', see: 'insights/api-contracts' },
  { term: 'accessibility tree', area: 'Interfaces', def: 'The version of a page that assistive technology reads: names, roles and states instead of pixels.', see: 'north/accessibility' },
  { term: 'ARIA', area: 'Interfaces', def: 'Attributes that add meaning for assistive technology where plain HTML cannot say it. The first rule is not to need them.', see: 'north/accessibility' },
  { term: 'contrast ratio', area: 'Interfaces', def: 'The difference in brightness between text and its background, written as a ratio. WCAG asks for at least 4.5 to 1 for normal text.', see: 'resources/tools/contrast' },
  { term: 'semantic HTML', area: 'Interfaces', def: 'Using the element that means the thing (a button for a button, a heading for a heading) so browsers and assistive technology understand it for free.', see: 'north/accessibility' },
  { term: 'progressive enhancement', area: 'Interfaces', def: 'Building so the basics work everywhere, then adding what better browsers can do.' },
  { term: 'design token', area: 'Interfaces', def: 'A named design value (a colour, a space, a duration) stored once and used everywhere.', see: 'north/design-tokens' },
  { term: 'type scale', area: 'Interfaces', def: 'A set of font sizes that step up by a fixed ratio, so the sizes belong together.', see: 'resources/tools/type-scale' },
  { term: 'code splitting', area: 'Interfaces', def: 'Breaking a site’s code into pieces so a page downloads only the ones it needs.', see: 'north/stack' },
  { term: 'lazy loading', area: 'Interfaces', def: 'Loading something only when it is about to be needed.', see: 'north/stack' },

  /* ---------- Motion ---------- */
  { term: 'frame', area: 'Motion', def: 'One still picture in an animation. Most screens show sixty or more of them a second.', see: 'insights/animation-budgets' },
  { term: 'frame budget', area: 'Motion', def: 'The time available to prepare one frame: about 16.7 milliseconds at sixty frames a second, and less on faster screens.', see: 'insights/animation-budgets' },
  { term: 'jank', area: 'Motion', def: 'Visible stuttering, which happens when frames take longer than their budget.', see: 'insights/animation-budgets' },
  { term: 'compositor', area: 'Motion', def: 'The part of the browser that moves already-painted layers around the screen cheaply, usually on the graphics chip.', see: 'insights/animation-budgets' },
  { term: 'layout', area: 'Motion', def: 'The browser working out the size and position of everything on the page. Doing it every frame is expensive.', see: 'insights/animation-budgets' },
  { term: 'paint', area: 'Motion', def: 'The browser filling in the pixels for each element.', see: 'insights/animation-budgets' },
  { term: 'easing', area: 'Motion', def: 'How speed changes over the length of an animation: starting slowly, ending slowly, or neither.', see: 'insights/animation-budgets' },
  { term: 'requestAnimationFrame', area: 'Motion', def: 'A browser call that runs your code just before the next frame is drawn.', see: 'insights/animation-budgets' },
  { term: 'reduced motion', area: 'Motion', def: 'A setting in your device that asks websites to use less animation.', see: 'legal/accessibility' },
  { term: 'will-change', area: 'Motion', def: 'A hint to the browser that a property is about to animate. It costs memory, so it is used sparingly.', see: 'insights/animation-budgets' },
  { term: 'canvas', area: 'Motion', def: 'A part of a web page that a script draws on. The animated backgrounds on this site are canvases.', see: 'north/motion-systems' },

  /* ---------- Process ---------- */
  { term: 'decision record', area: 'Process', def: 'A short note recording a decision, the options that were considered and why one was chosen.', see: 'resources/tools/decision-record' },
  { term: 'handover', area: 'Process', def: 'Passing a system to the people who will run it, together with everything they need to do so.', see: 'insights/handover' },
  { term: 'bus factor', area: 'Process', def: 'How many people could be lost before nobody understands a system. A bus factor of one is a risk.', see: 'insights/handover' },
  { term: 'tacit knowledge', area: 'Process', def: 'What people know but have never written down.', see: 'insights/handover' },
  { term: 'definition of done', area: 'Process', def: 'An agreed list of what must be true before a piece of work counts as finished.', see: 'company/how-we-work' },
  { term: 'acceptance criteria', area: 'Process', def: 'The specific checks a piece of work must pass to be accepted.', see: 'company/how-we-work' },
  { term: 'discovery', area: 'Process', def: 'The early work of finding out what the problem really is, before deciding what to build.', see: 'company/how-we-work' },
  { term: 'retrospective', area: 'Process', def: 'A pause after a piece of work to ask what helped, what got in the way and what to change.', see: 'company/how-we-work' },
  { term: 'readiness check', area: 'Process', def: 'A short list of questions asked before a system goes live.', see: 'resources/tools/readiness' },
];

/* term -> definition, in the form the RichText reader takes. */
export const engineeringTerms = Object.fromEntries(glossary.map((g) => [g.term, g.def]));
