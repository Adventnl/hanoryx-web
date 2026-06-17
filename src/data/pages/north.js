import { north } from '../company';
import { engineeringPrinciples } from '../capabilities';

const page = {
  key: 'north',
  title: 'Development',
  accent: '#ff3333',
  hero: {
    scene: 'circuit-trace',
    eyebrow: 'Development // DEV.NODE',
    title: 'Software development, run by our team — Hanoryx North.',
    intro:
      'Hanoryx North is the development team behind Hanoryx Systems — platform architecture, interface systems, operational tooling, and production-minded software engineering.',
    code: 'NODE.DEV',
    status: 'ACTIVE',
    actions: [
      { label: 'Engineering', to: '/north/engineering' },
      { label: 'Work', to: '/work', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
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
      type: 'cards',
      scene: 'hex-lattice',
      eyebrow: 'Pillars',
      title: 'Four engineering pillars.',
      intro: 'Architecture, interface, orchestration, and prototyping under one design language.',
      items: north.pillars.map((p) => ({ code: p.code, title: p.title, body: p.body })),
    },
    {
      type: 'cards',
      scene: 'network-constellation',
      eyebrow: 'Engineering Principles',
      title: 'How North builds.',
      items: engineeringPrinciples.map((e) => ({ code: e.code, title: e.title, body: e.body })),
    },
    {
      type: 'modules',
      scene: 'wave-interference',
      eyebrow: 'Motion Philosophy',
      title: 'Flow like a river.',
      intro: 'Motion at Hanoryx is continuous, quiet, and high-control — a statement about state, never decoration.',
      rows: north.motion.notes.map((n) => ({ k: n.k, v: n.v })),
    },
    { type: 'cta', scene: 'polar-radar', eyebrow: 'Open a channel', title: 'Brief the division.' },
  ],
};

export default page;
