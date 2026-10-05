import { north } from '../company';
import { engineeringPrinciples } from '../capabilities';

const page = {
  key: 'north',
  title: 'Development',
  accent: '#ff3333',
  aliases: ['hanoryx north', 'development team', 'engineering division', 'north', 'pillars'],
  hero: {
    scene: 'topographic-lines',
    intensity: 'hero',
    eyebrow: 'Development / Hanoryx North',
    title: 'The team behind the systems.',
    intro:
      'Hanoryx North is the development team behind Hanoryx Systems: platform architecture, interface systems, operational tooling and production-minded software engineering.',
    code: 'DEV.00',
    status: 'LIVE',
    actions: [
      { label: 'Engineering', to: '/north/engineering' },
      { label: 'Selected work', to: '/work', variant: 'outline' },
    ],
    aside: {
      kind: 'northCompass',
      pillars: north.pillars,
      caption: 'Move the pointer around the dial, or tap a point. Each point is a pillar of the work.',
    },
  },
  blocks: [
    {
      type: 'split',
      anchor: 'mission',
      railLabel: 'Mission',
      scene: 'topographic-lines',
      eyebrow: 'Mission',
      code: 'N.MISSION',
      title: north.mission.title,
      body: north.mission.body,
      asideLabel: 'PILLARS',
      asideCode: 'N.MAP',
      points: north.pillars.map((p) => ({ k: p.code, v: p.title })),
    },
    {
      type: 'signature',
      kind: 'accordionList',
      anchor: 'principles',
      railLabel: 'How North builds',
      scene: 'privacy-quiet-grid',
      minHeight: 560,
      eyebrow: 'Engineering principles',
      title: 'How North builds.',
      intro: 'Six habits that shape the work. Open any of them.',
      defaultOpen: engineeringPrinciples[0].id,
      marker: 'north.principles-accordion',
      items: engineeringPrinciples.map((e) => ({ id: e.id, title: e.title, meta: e.code, body: e.body })),
    },
    {
      type: 'modules',
      anchor: 'motion',
      railLabel: 'Motion philosophy',
      scene: 'interface-lab-shape',
      eyebrow: 'Motion philosophy',
      title: 'Flow like a river.',
      intro: 'Motion at Hanoryx is continuous, quiet and high-control — a statement about state, never decoration.',
      rows: north.motion.notes.map((n) => ({ k: n.k, v: n.v })),
    },
    {
      type: 'closer',
      kind: 'symptomRouter',
      anchor: 'start',
      scene: 'isometric-infra',
      tag: 'End of development',
      minHeight: 560,
      title: 'What is going wrong?',
      lede: 'Start from the symptom, not from what the team is called. Choose the one that sounds most like yours and the page names the discipline that deals with it, and why.',
      symptoms: [
        { id: 'numbers', label: 'The numbers disagree between screens', area: 'Architecture', why: 'Two places think they own the same fact. The fix is one source of truth per record and one writer, with everything else reading through a contract.', to: '/north/architecture', also: { label: 'Roles, permissions and scopes', to: '/insights/permissions' } },
        { id: 'avoid', label: 'People avoid using it', area: 'The interface lab', why: 'Usually the controls do not say what they are, what state they are in or what will happen. Components with a job, and every state shown, are the cure.', to: '/north/interface-lab', also: { label: 'Accessible by default', to: '/north/accessibility' } },
        { id: 'laggy', label: 'It feels laggy or jumpy', area: 'Motion systems', why: 'Something is spending more than its share of each frame. A motion budget says what can move, how much and on which property.', to: '/north/motion-systems', also: { label: 'Animation budgets', to: '/insights/animation-budgets' } },
        { id: 'late', label: 'It breaks, and we find out late', area: 'Tooling and quality', why: 'The checks are missing, or they are the wrong kind. Layer cheap fast checks in front of slow broad ones, and watch the quiet failures.', to: '/north/quality', also: { label: 'Development tooling', to: '/north/tooling' } },
        { id: 'nodare', label: 'Nobody dares change it', area: 'Engineering', why: 'Changes are too big to understand and too hard to undo. Small steps with gates between them make change safe again.', to: '/north/engineering', also: { label: 'Engineering handbook', to: '/north/handbook' } },
        { id: 'slow', label: 'It is slow to start', area: 'The stack', why: 'Too much is shipped before anything shows. Splitting by page and loading only what a page uses is a matter of structure, not tuning.', to: '/north/stack', also: { label: 'Site engineering', to: '/engineering' } },
        { id: 'exclude', label: 'Some people cannot use it', area: 'Accessibility', why: 'Structure, keyboard, contrast and choice. Look at the page the way a screen reader does, and fix what it meets.', to: '/north/accessibility', also: { label: 'Contrast checker', to: '/resources/tools/contrast' } },
        { id: 'blind', label: 'We cannot see what it is doing', area: 'Site engineering', why: 'There is no view of the layers. Tracing a page view through them, and measuring it, is how a team learns what its system is really doing.', to: '/engineering', also: { label: 'Runbooks people actually use', to: '/insights/runbooks' } },
      ],
      onward: [
        { label: 'The stack', to: '/north/stack' },
        { label: 'Engineering handbook', to: '/north/handbook' },
      ],
    },
  ],
};

export default page;
