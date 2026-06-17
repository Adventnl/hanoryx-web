import { musebase } from '../systems';

const page = {
  key: 'work/musebase',
  title: 'Musebase',
  accent: '#ff3333',
  hero: {
    scene: 'musebase-coordination',
    intensity: 'hero',
    eyebrow: 'Work // SYS.MB',
    title: 'Musebase is a single controlled environment for coordination that refuses to stay simple.',
    intro: 'An advanced management platform that binds scheduling, communication, records, payment logic, and role-based access into one operating layer. Built so complexity is engineered, not improvised.',
    code: 'NODE.MB',
    status: 'ACTIVE',
    actions: [
      { label: 'All work', to: '/work', variant: 'outline' },
      { label: 'Open a channel', to: '/contact' },
    ],
    metrics: [
      { value: 5, label: 'Core modules' },
      { value: 1, label: 'Operating environment' },
      { value: 100, suffix: '%', label: 'Role-scoped access' },
    ],
  },
  blocks: [
    {
      type: 'feature',
      scene: 'scheduling-grid',
      eyebrow: 'Featured System',
      code: musebase.code,
      name: musebase.name,
      label: musebase.type,
      status: musebase.status,
      summary: musebase.summary,
      logo: true,
      modules: musebase.modules,
    },
    {
      type: 'split',
      scene: 'permission-orbit',
      eyebrow: 'Coordination',
      code: 'MB.COORD',
      title: 'Many roles, one controlled environment.',
      body: [
        'Most operations fracture across separate tools — one for scheduling, another for messaging, a spreadsheet for records, and a manual process for everything in between. Musebase collapses that into a single operating layer where every role works against the same live state.',
        'Permissions are modelled from the first commit. Each role sees only the surfaces and records its work requires, while the platform holds the full picture and keeps every action consistent across the environment.',
        'Because coordination, communication, and record control share one core, there is no reconciliation step and no drift between what one role does and what another sees.',
      ],
      asideLabel: 'ROLES',
      asideCode: 'MB.ROLE',
      points: [
        { k: 'SCOPE', v: 'Role-scoped surfaces' },
        { k: 'STATE', v: 'Shared live state' },
        { k: 'ACCESS', v: 'Permission model' },
        { k: 'AUDIT', v: 'Traceable actions' },
        { k: 'FLOW', v: 'Cross-role workflows' },
      ],
    },
    {
      type: 'modules',
      scene: 'data-interface-wave',
      eyebrow: 'Module Map',
      title: 'The operating layer, broken down.',
      intro: 'Five modules, engineered to function as one. Each is independently controlled, yet bound to the same data core and access model.',
      rows: [
        { k: 'MB.01', v: 'Scheduling logic — time, resource, and dependency resolution across roles.' },
        { k: 'MB.02', v: 'Communication surfaces — role-scoped messaging tied to operational state.' },
        { k: 'MB.03', v: 'Records & data layer — a queryable record held under strict access control.' },
        { k: 'MB.04', v: 'Payment workflows — calculation, tracking, and settlement logic kept auditable.' },
        { k: 'MB.05', v: 'Role-based access — scoped permissions that govern every surface and record.' },
      ],
    },
    {
      type: 'cta',
      scene: 'status-pulse-grid',
      eyebrow: 'Open a channel',
      title: 'Discuss an operating layer of your own.',
      body: 'Bring the coordination problem. We engineer the controlled environment around it.',
    },
  ],
};

export default page;
