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
      type: 'cta',
      scene: 'isometric-infra',
      eyebrow: 'Next',
      title: 'Brief the development team.',
      body: 'Bring a system that needs a foundation, not just a surface.',
      links: [{ label: 'Motion systems', to: '/north/motion-systems' }],
    },
  ],
};

export default page;
