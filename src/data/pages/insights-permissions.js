import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/permissions',
  title: 'Roles, Permissions and Scopes',
  accent: '#ff3333',
  aliases: ['rbac', 'access control', 'authorisation', 'authorization', 'permissions', 'roles', 'least privilege', 'scopes', 'who can see what', 'idor', 'user management'],
  hero: {
    scene: 'permission-orbit',
    intensity: 'hero',
    eyebrow: 'Insights / Security',
    title: 'Who may do what, and to whose records.',
    intro:
      'Logging in proves who you are. It says nothing about what you may do. This guide is about the second question — roles, permissions and scopes — and how to answer it so that the answer is the same every time and easy to check.',
    code: 'INS.03',
    status: 'GUIDE · ACCESS',
    actions: [
      { label: 'Try the matrix', to: '/insights/permissions#try' },
      { label: 'Read the guide', to: '/insights/permissions#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'matrix', caption: 'Roles down one side, actions along the other.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'permissionMatrix',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'Try it',
      title: 'Grant, withhold, then act as someone.',
      intro: 'Toggle what each role may do. Switch between “roles only” and “roles plus scope”. Then act as a person, try an action, and read the rule that decided it.',
      roles: [
        { id: 'viewer', label: 'Viewer', grants: ['view'], scoped: [] },
        { id: 'agent', label: 'Support agent', grants: ['view', 'note', 'refund'], scoped: ['note', 'refund'] },
        { id: 'lead', label: 'Team lead', grants: ['view', 'note', 'refund', 'export'], scoped: ['note'] },
        { id: 'admin', label: 'Administrator', grants: ['view', 'note', 'refund', 'export', 'roles'], scoped: [] },
      ],
      actions: [
        { id: 'view', label: 'View orders', owned: false },
        { id: 'note', label: 'Add a note', owned: true },
        { id: 'refund', label: 'Issue a refund', owned: true },
        { id: 'export', label: 'Export customers', owned: false },
        { id: 'roles', label: 'Change roles', owned: false },
      ],
      note: 'An illustration of the idea. The roles and actions are invented for the demonstration and do not describe any real system.',
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
      title: 'Roles, permissions and scopes.',
      intro: 'A way of thinking about access that stays understandable as a system grows.',
      version: 'General guidance',
      summary: [
        '{{authentication}} is “who are you?”. {{authorisation}} is “what may you do?”. They are separate checks.',
        'Start from {{deny by default}}. Grant {{permission}}s, bundle them as {{role}}s, and limit them with {{scope}}.',
        'Check on the **server**, at the **record**, every time. A hidden button is not a lock.',
      ],
      meta: [
        { k: 'For', v: 'Anyone designing or buying a system with more than one kind of user' },
        { k: 'Kind', v: 'General guidance, not a security audit' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'two',
          title: 'Two questions, not one',
          plain: 'Signing in is only the first check.',
          body: [
            '{{authentication}} establishes who someone is: a password, a code, a key. {{authorisation}} decides what that someone may do. A system can be flawless at the first and careless at the second, and the usual result is a person who is correctly identified, correctly signed in, and able to open a page that was never meant for them.',
            'Keep the two apart in the code as well as in the mind. The first produces an **identity**. The second takes that identity, an **action** and a **record**, and returns yes or no — in one place, so that the rules are written once and can be read.',
          ],
        },
        {
          id: 'deny',
          title: 'Deny by default',
          plain: 'If nothing says “yes”, the answer is no.',
          body: [
            'The safest starting position is that no one may do anything, and each power is added deliberately. {{deny by default}} turns a forgotten rule into an inconvenience (someone cannot do something and tells you) rather than a hole (someone can do something and does not).',
            'It also changes how new features arrive. A new action has no one allowed to do it until somebody decides who should be. The reverse design — everything allowed until blocked — means every new feature is open from the moment it ships.',
            { note: 'In the demonstration above, a missing grant is the first thing checked, and the rule it reports says so: “Deny by default”.', label: 'Try it' },
          ],
        },
        {
          id: 'roles',
          title: 'Roles: useful, and easily overgrown',
          plain: 'A role is a name for a bundle of permissions.',
          body: [
            'A {{role}} such as “support agent” saves anyone from listing forty permissions each time someone joins the team. It is also a vocabulary that people outside engineering can use: “make her a team lead” is a sentence everybody understands.',
            'The trouble starts when roles are asked to carry too much. Each exception — “like an agent, but able to export” — tempts someone to create a new role, and a system with sixty roles is one in which nobody knows what any of them can do. This is called **role explosion**, and it is the main way role-based systems decay.',
            { list: [
              'Keep roles few, named for jobs rather than people.',
              'Treat the **permission**, not the role, as the thing you reason about.',
              'When someone needs one more power than their role gives, ask whether the role is wrong or the person is an exception, and decide on purpose.',
            ] },
          ],
        },
        {
          id: 'permissions',
          title: 'Permissions are the real unit',
          plain: 'A verb, on a noun.',
          body: [
            'A {{permission}} is the right to do one specific thing: `order:view`, `order:refund`, `customer:export`, `role:change`. Written as a verb on a noun, it is precise enough to check and plain enough to read out loud.',
            'Roles then become simple lists of these. That has a useful consequence: you can answer “who can issue refunds?” by looking up **one permission**, not by reading the descriptions of every role.',
            {
              table: {
                head: ['Role', 'order:view', 'order:refund', 'customer:export', 'role:change'],
                rows: [
                  ['Viewer', 'yes', '—', '—', '—'],
                  ['Support agent', 'yes', 'own queue', '—', '—'],
                  ['Team lead', 'yes', 'yes', 'yes', '—'],
                  ['Administrator', 'yes', 'yes', 'yes', 'yes'],
                ],
              },
              caption: 'Roles are lists of permissions. This one is an example, not a recommendation.',
            },
          ],
        },
        {
          id: 'scope',
          title: 'Scope: whose records?',
          plain: 'Some powers apply to everything. Most should apply to less.',
          body: [
            'A role says what kind of thing someone may do. It rarely says **to what**. “Support agents can issue refunds” is dangerous if it means every refund in the company; it is reasonable if it means refunds on orders in their own queue. That limit is the {{scope}}.',
            'The common scopes are worth naming:',
            {
              defs: [
                { k: 'Own', v: 'Only records the person created or is assigned to.' },
                { k: 'Team', v: 'Records belonging to a team they are part of.' },
                { k: 'Tenant', v: 'Records of one customer organisation, in a system that serves several. This one should hold without exception.' },
                { k: 'All', v: 'Everything. Reserved for the few who must.' },
              ],
            },
            'The demonstration’s second mode adds scope. Under “roles plus scope”, a support agent who may add notes may add them to their **own** records, and is refused for someone else’s — with the reason stated.',
          ],
        },
        {
          id: 'models',
          title: 'Roles, attributes and policies',
          plain: 'Three ways of deciding. Most systems start with the first.',
          body: [
            {
              table: {
                head: ['Approach', 'Decides by', 'Good for', 'Watch for'],
                rows: [
                  ['Role-based ({{RBAC}})', 'Which roles you hold', 'Small and medium systems; easy to explain', 'Role explosion; no sense of “whose record”'],
                  ['Attribute-based', 'Facts about the person, the record and the situation', 'Rules like “managers in the same region, in office hours”', 'Rules scattered across the code; hard to see the whole'],
                  ['Policy engine', 'Rules written in one language, evaluated in one place', 'Larger systems with many services', 'Another thing to run, learn and test'],
                ],
              },
              caption: 'None is best. Choose the simplest one that expresses the rules you really have.',
            },
            'A sensible path is to begin with roles and permissions, add scope as soon as “whose records” matters, and move to something richer only when the rules clearly outgrow that. Rushing to a policy engine for a five-role system is the more common error than staying too simple.',
          ],
        },
        {
          id: 'where',
          title: 'Check on the server, at the record',
          plain: 'A hidden button is not a lock.',
          body: [
            'Hiding a button in the interface is a courtesy. It is not a control, because anyone can send the request the button would have sent. Every decision must be made on the **server**, for every request.',
            'And it must be made about the **record**, not just the page. The most common serious access flaw is {{BOLA}}: the server confirms that the caller is signed in and is allowed to use the “view order” feature, then fetches whichever order number was in the address. Change the number, and you are reading someone else’s order.',
            { code: "// wrong: checks that you may use the feature, not that this record is yours\napp.get('/orders/:id', requireLogin, (req, res) => res.json(getOrder(req.params.id)));\n\n// right: the decision names the user, the action AND the record\napp.get('/orders/:id', requireLogin, (req, res) => {\n  const order = getOrder(req.params.id);\n  if (!can(req.user, 'order:view', order)) return res.sendStatus(404);\n  res.json(order);\n});" },
            { note: 'Answering “not found” rather than “forbidden” for records someone may not see avoids confirming that the record exists.', label: 'A small courtesy' },
          ],
        },
        {
          id: 'software',
          title: 'Software needs permissions too',
          plain: 'Integrations and jobs are users with no one watching.',
          body: [
            'A {{service account}} — the identity a script, an integration or a scheduled job runs as — is the easiest place to forget {{least privilege}}. It is created in a hurry, given broad rights “so it works”, and then runs for years without a person looking at it.',
            { list: [
              'Give each integration its **own** identity, so what it did is visible and it can be removed alone.',
              'Give it only what its job needs. A job that writes a report does not need to read customers or issue refunds.',
              'Prefer short-lived {{token}}s to long-lived keys, and keep every {{secret}} out of code.',
              'Give every key an owner and an expiry, and review the list.',
            ] },
            'The ending of this page makes the point with a slider: as you grant a job more powers, the distance a stolen credential could travel grows, while the job itself needs only the first few.',
          ],
        },
        {
          id: 'elevation',
          title: 'Temporary power and break-glass',
          plain: 'Sometimes someone needs more, briefly.',
          body: [
            'Emergencies happen: a payment has to be reversed at night and the only person who can is asleep. Rather than leave permanent super-powers lying about “just in case”, give people a way to ask for more **temporarily**, with the request recorded.',
            { ol: [
              '{{break-glass access}} is a deliberate route to higher powers, for a stated reason, that expires on its own.',
              'Every use is written to the audit trail, with the reason, and flagged for review.',
              'Someone other than the person who used it looks at it afterwards.',
            ] },
          ],
        },
        {
          id: 'review',
          title: 'Reviewing who can do what',
          plain: 'Access accumulates. Prune it on a schedule.',
          body: [
            'People change jobs, projects end, contractors leave. Unless something removes access, it only grows. Put a review in the calendar — quarterly is common — and ask two simple questions of the list of people and accounts holding each powerful permission: should they still? and does anyone else need to?',
            { list: [
              'Remove access **when people leave**, as a step in leaving, not as a task someone remembers.',
              'Prefer roles to individual grants, so a person’s change of job is one change.',
              'Be able to answer, quickly, “who can do X?” and “what can this person do?”. If you cannot, the structure is too tangled.',
            ] },
          ],
        },
        {
          id: 'testing',
          title: 'Testing permissions',
          plain: 'Test the “no” answers harder than the “yes”.',
          body: [
            'Most tests check that the right person succeeds. The failures that matter are in the other direction, so test those.',
            { ol: [
              'For each action, a test that a role **without** the permission is refused.',
              'For each scoped action, a test that a user cannot reach **another user’s** record, by changing the id.',
              'For multi-tenant systems, a test that one tenant cannot see another’s data, by every route.',
              'A test that a brand-new action is denied to everyone until granted.',
              'A test that revoking a permission takes effect on the next request, not at the next login.',
            ] },
            'Where there are many roles and actions, generate the tests from the matrix itself, so adding a row adds its checks.',
          ],
        },
        {
          id: 'checklist',
          title: 'A checklist to take away',
          plain: 'Ten questions for any system with more than one kind of user.',
          body: [
            { ol: [
              'Is access denied unless something grants it?',
              'Are permissions written as verbs on nouns, and roles as lists of them?',
              'Are there few roles, named for jobs?',
              'Is scope (own, team, tenant) part of the decision where it matters?',
              'Is every decision made on the server, about the record?',
              'Does a user get “not found” for records they may not see?',
              'Does each integration have its own identity with only what it needs?',
              'Is there a recorded, expiring, reviewed way to get temporary power?',
              'Is access reviewed on a schedule and removed when people leave?',
              'Are the “no” answers tested?',
            ] },
          ],
        },
      ],
      note: 'General guidance. It is not a security audit, and it does not describe the controls of any particular system.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'leastPrivilege',
      anchor: 'least',
      scene: 'permission-orbit',
      tag: 'End of permissions',
      minHeight: 640,
      title: 'How far could it reach?',
      lede: 'Slide to give a job more powers. The ring shows how much a stolen password, or a slip, could touch. The job only ever needed the first three.',
      job: 'the nightly stock report',
      needed: 3,
      powers: [
        { name: 'Read stock levels', risk: '' },
        { name: 'Read product names', risk: '' },
        { name: 'Write one report file', risk: '' },
        { name: 'Read customer records', risk: 'A stolen key could now read personal data the report never touches.' },
        { name: 'Edit stock levels', risk: 'A bug, or a thief, could change what the business believes it holds.' },
        { name: 'Issue refunds', risk: 'Money could leave the business.' },
        { name: 'Create other accounts', risk: 'An attacker could make themselves a way back in.' },
        { name: 'Change permissions', risk: 'It could grant itself anything else.' },
      ],
      onward: [
        { label: 'Audit trails that answer questions', to: '/insights/audit-trails' },
        { label: 'Security approach', to: '/company/security' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
