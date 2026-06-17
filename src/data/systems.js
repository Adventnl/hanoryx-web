/* ============================================================
   SYSTEMS + WORK — categories, Musebase, project codex, redacted
   ============================================================ */

export const systemsIntro = {
  eyebrow: 'Systems',
  title: 'We build systems that reduce operational drag.',
  body: 'Management layers, scheduling logic, communication surfaces, payment workflows, data records, and controlled multi-role access — engineered as one operating environment.',
};

/* The seven public-facing system categories. */
export const systemCategories = [
  { id: 'cat-01', code: 'SYS.01', title: 'Operational management platforms', summary: 'Structured operating layers for scheduling, communication, records, and multi-role coordination.', tags: ['Scheduling', 'Records', 'Roles'], status: 'ACTIVE' },
  { id: 'cat-02', code: 'SYS.02', title: 'Commerce infrastructure', summary: 'Transaction systems, catalog logic, and payment workflows built for throughput and control.', tags: ['Payments', 'Catalog', 'Throughput'], status: 'ACTIVE' },
  { id: 'cat-03', code: 'SYS.03', title: 'Automation systems', summary: 'Orchestration that removes manual steps and keeps operational state predictable.', tags: ['Orchestration', 'Workflows'], status: 'ACTIVE' },
  { id: 'cat-04', code: 'SYS.04', title: 'Internal dashboards', summary: 'Operational control surfaces that turn live data into decisions.', tags: ['Telemetry', 'Control'], status: 'ACTIVE' },
  { id: 'cat-05', code: 'SYS.05', title: 'Data interfaces', summary: 'Readable, queryable surfaces over complex records and relationships.', tags: ['Records', 'Query'], status: 'ACTIVE' },
  { id: 'cat-06', code: 'SYS.06', title: 'Client-facing portals', summary: 'Scoped, role-aware access points between an operation and the people it serves.', tags: ['Access', 'Roles'], status: 'ACTIVE' },
  { id: 'cat-07', code: 'SYS.07', title: 'Experimental online systems', summary: 'Early-stage interface programs and research nodes. Detail withheld.', tags: ['Research'], status: 'RESEARCH' },
];

/* Musebase — described only as an advanced management platform. */
export const musebase = {
  name: 'Musebase',
  type: 'Advanced management platform',
  status: 'Active development',
  code: 'SYS.MB',
  summary: 'A structured operating layer for complex scheduling, communication, records, payments, and multi-role coordination.',
  description: [
    'Musebase is an advanced management platform built as a structured operating layer for complex coordination.',
    'It connects scheduling, communication, records, payment logic, and role-based workflows inside a single controlled environment.',
  ],
  modules: [
    { k: 'MB.01', v: 'Scheduling logic' },
    { k: 'MB.02', v: 'Communication surfaces' },
    { k: 'MB.03', v: 'Records & data layer' },
    { k: 'MB.04', v: 'Payment workflows' },
    { k: 'MB.05', v: 'Role-based access' },
  ],
};

/* Operational architecture panel (Systems page). */
export const architecture = {
  eyebrow: 'Operational Architecture',
  title: 'One environment. Many roles. Controlled surfaces.',
  body: 'Hanoryx systems are layered: a hardened data core, an orchestration layer for state and automation, and interface surfaces scoped by role and intent.',
  layers: [
    { id: 'a-01', code: 'L3', title: 'Interface surfaces', body: 'Role-scoped views, dashboards, and portals. Only what is needed, when it is needed.' },
    { id: 'a-02', code: 'L2', title: 'Orchestration layer', body: 'State, automation, scheduling, and workflow logic that keeps coordination predictable.' },
    { id: 'a-03', code: 'L1', title: 'Data core', body: 'Records, relationships, and payment logic held under strict access control.' },
  ],
};

/* The Work page codex — selected systems, some redacted. */
export const projects = [
  {
    id: 'pr-01',
    code: 'WRK.01',
    name: 'Commerce System I',
    type: 'Commerce infrastructure',
    status: 'Deployed',
    classified: false,
    summary: 'The first Hanoryx system — commerce infrastructure handling catalog, transactions, and payment workflows.',
  },
  {
    id: 'pr-02',
    code: 'WRK.02',
    name: 'Musebase',
    type: 'Advanced management platform',
    status: 'Active development',
    classified: false,
    featured: true,
    summary: 'A structured operating layer for complex scheduling, communication, records, payments, and multi-role coordination.',
  },
  {
    id: 'pr-03',
    code: 'WRK.03',
    name: 'North Internal Console',
    type: 'Internal operating layer',
    status: 'Operational',
    classified: false,
    summary: 'The internal control surface for Hanoryx North — telemetry, deployment, and orchestration in one console.',
  },
  {
    id: 'pr-04',
    code: 'WRK.04',
    name: 'Unknown System 03',
    type: 'Restricted detail',
    status: 'Classified',
    classified: true,
    summary: 'Module withheld. Access is scoped to internal review.',
  },
  {
    id: 'pr-05',
    code: 'WRK.05',
    name: 'Unknown System 04',
    type: 'Restricted detail',
    status: 'Classified',
    classified: true,
    summary: 'Redacted research node. Surface intentionally suppressed.',
  },
  {
    id: 'pr-06',
    code: 'WRK.06',
    name: 'Experimental Interface Program',
    type: 'Research',
    status: 'Exploratory',
    classified: true,
    summary: 'An unannounced interface program. Detail will surface when the architecture is ready.',
  },
];

/* Blacked-out future systems — silhouettes / classified nodes. */
export const unknownSystems = [
  { id: 'u-01', code: 'NODE.07', label: 'Classified system branch', note: 'Architecture in progress' },
  { id: 'u-02', code: 'NODE.08', label: 'Unannounced interface program', note: 'Surface withheld' },
  { id: 'u-03', code: 'NODE.09', label: 'Redacted research node', note: 'Access scoped' },
];
