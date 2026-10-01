// Public capability categories. A category describes a design area, not a
// deployed product or service-health assertion.
export const systemCategories = [
  { id: 'cat-01', code: 'SYS.01', title: 'Operational management platforms', summary: 'Structured operating layers for scheduling, communication, records, and multi-role coordination.', tags: ['Scheduling', 'Records', 'Roles'], status: 'CAPABILITY' },
  { id: 'cat-02', code: 'SYS.02', title: 'Commerce infrastructure', summary: 'Transaction models, catalog logic, and payment workflow design.', tags: ['Payments', 'Catalog', 'Workflows'], status: 'CAPABILITY' },
  { id: 'cat-03', code: 'SYS.03', title: 'Automation systems', summary: 'Orchestration patterns for reducing manual steps and making state predictable.', tags: ['Orchestration', 'Workflows'], status: 'CAPABILITY' },
  { id: 'cat-04', code: 'SYS.04', title: 'Internal dashboards', summary: 'Control surfaces that help people read operational data and make decisions.', tags: ['Data', 'Control'], status: 'CAPABILITY' },
  { id: 'cat-05', code: 'SYS.05', title: 'Data interfaces', summary: 'Readable, queryable surfaces over complex records and relationships.', tags: ['Records', 'Query'], status: 'CAPABILITY' },
  { id: 'cat-06', code: 'SYS.06', title: 'Client-facing portals', summary: 'Scoped, role-aware access points between an operation and the people it serves.', tags: ['Access', 'Roles'], status: 'CAPABILITY' },
  { id: 'cat-07', code: 'SYS.07', title: 'Research systems', summary: 'Visible interface, motion, and Canvas studies in this website.', tags: ['Research', 'Lab'], status: 'PUBLIC STUDIES' },
];

// Musebase retains only the description already published on this website.
export const musebase = {
  name: 'Musebase',
  type: 'Advanced management platform',
  status: 'Public description',
  code: 'SYS.MB',
  summary: 'A structured operating layer for scheduling, communication, records, payments, and multi-role coordination.',
  description: [
    'Musebase is described publicly as a management platform for complex coordination.',
    'Its published design brings scheduling, communication, records, payment logic, and role-based workflows into one environment.',
  ],
  modules: [
    { k: 'MB.01', v: 'Scheduling logic' },
    { k: 'MB.02', v: 'Communication surfaces' },
    { k: 'MB.03', v: 'Records and data' },
    { k: 'MB.04', v: 'Payment workflows' },
    { k: 'MB.05', v: 'Role-based access' },
  ],
};

export const architecture = {
  eyebrow: 'Architecture model',
  title: 'One environment. Many roles. Clear boundaries.',
  body: 'A model for operational software: a data core, a layer for state and workflow, and interface surfaces scoped to a person and task. This diagram explains a design approach, not a deployed system.',
  layers: [
    { id: 'a-01', code: 'L3', title: 'Interface surfaces', body: 'Role-scoped views, dashboards, and portals.' },
    { id: 'a-02', code: 'L2', title: 'Workflow layer', body: 'State, automation, scheduling, and coordination.' },
    { id: 'a-03', code: 'L1', title: 'Data core', body: 'Records and relationships under a defined access model.' },
  ],
};

// Kept for the two existing, explicitly conceptual commerce routes.
export const commerceSystemRecord = {
  id: 'pr-01',
  code: 'WRK.01',
  name: 'Commerce System I',
  type: 'Commerce infrastructure',
  status: 'Concept description',
  classified: false,
  summary: 'An existing public concept description covering catalog, transactions, and payment workflows. Deployment status is not public.',
};
