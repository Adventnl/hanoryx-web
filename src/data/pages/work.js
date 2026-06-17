import { projects, unknownSystems } from '../systems';

/* Deep routes for the systems cleared for public record. Classified
   entries resolve to undefined and render without a destination. */
const deepRoutes = {
  'pr-01': '/work/commerce-system-i',
  'pr-02': '/work/musebase',
  'pr-03': '/work/north-console',
};

const codexItems = projects.map((p) => ({
  code: p.code,
  label: p.type,
  title: p.name,
  body: p.summary,
  status: p.status,
  to: p.classified ? undefined : deepRoutes[p.id],
  redacted: p.classified || undefined,
}));

const page = {
  key: 'work',
  title: 'Work',
  accent: '#ff3333',
  hero: {
    scene: 'node-compression',
    intensity: 'hero',
    eyebrow: 'Work // NODE.WRK',
    title: 'The Project Codex — every system Hanoryx has built, deployed, or sealed.',
    intro:
      'A registry of work. Cleared entries open to a record; classified entries hold their surface and stay closed. What is shown here is the part we are willing to name.',
    code: 'NODE.WRK',
    status: 'OPERATIONAL',
    actions: [
      { label: 'All systems', to: '/systems', variant: 'outline' },
      { label: 'Open a channel', to: '/contact' },
    ],
    metrics: [
      { value: projects.length, label: 'Codex entries' },
      { value: projects.filter((p) => !p.classified).length, label: 'Cleared records' },
      { value: projects.filter((p) => p.classified).length, label: 'Sealed nodes' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'orbital-command',
      eyebrow: 'The Project Codex',
      title: 'Every system on record.',
      intro:
        'Each card is a node in the codex. Where the architecture is public, the record is open. Where it is not, the entry is held under redaction and the surface is suppressed.',
      items: codexItems,
    },
    {
      type: 'redacted',
      scene: 'isometric-infra',
      eyebrow: 'Sealed Branches',
      title: 'Systems that have not surfaced.',
      intro:
        'Beyond the named codex sit branches still under construction. Their silhouettes are logged; their detail is not. These resolve into the registry when the architecture is ready to stand on its own.',
      items: unknownSystems.map((u) => ({
        code: u.code,
        label: u.label,
        note: u.note,
      })),
    },
    {
      type: 'stats',
      eyebrow: 'System Status',
      title: 'The codex at a glance.',
      items: [
        { value: projects.length, label: 'Registered systems', note: 'Total nodes held in the codex' },
        {
          value: projects.filter((p) => !p.classified).length,
          label: 'Open records',
          note: 'Cleared for public detail',
        },
        {
          value: projects.filter((p) => p.classified).length,
          label: 'Under redaction',
          note: 'Surface intentionally withheld',
        },
        { value: unknownSystems.length, label: 'Sealed branches', note: 'Architecture in progress' },
      ],
    },
    {
      type: 'cta',
      scene: 'research-blackout',
      eyebrow: 'Open a channel',
      title: 'Request access to a record.',
      body: 'Cleared entries can be discussed in detail. For anything under redaction, the conversation starts behind the gate.',
    },
  ],
};

export default page;
