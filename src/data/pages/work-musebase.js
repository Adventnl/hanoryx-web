import { musebase } from '../systems';

const page = {
  key: 'work/musebase',
  title: 'Musebase',
  accent: '#ff3333',
  hero: {
    scene: 'musebase-coordination',
    intensity: 'hero',
    eyebrow: 'Work // SYS.MB',
    title: 'A model for coordination across roles and records.',
    intro: 'Musebase is described on this site as a management platform joining scheduling, communication, records, payments, and role-based access. This page explains that published design; it does not establish deployment status or measured outcomes.',
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
      eyebrow: 'Published concept',
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
      title: 'Many roles, one proposed environment.',
      body: [
        'The proposed system brings scheduling, messaging, records, and payments into a shared model. Its value would depend on the roles, decisions, and data boundaries in a real operation.',
        'A permission model would define which surfaces and records each role may reach. Those boundaries would need to be enforced at the data layer as well as in the interface.',
        'The public description names the five areas below. It does not include an implementation, measured reduction in reconciliation, or evidence of live shared state.',
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
      intro: 'Five areas in the published design. The module map describes intended responsibilities, not verified shipped functionality.',
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
