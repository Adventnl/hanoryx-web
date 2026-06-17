import { north } from '../company';

const page = {
  key: 'north/motion-systems',
  title: 'Motion Systems',
  accent: '#ff3333',
  hero: {
    scene: 'motion-curve-field',
    intensity: 'hero',
    eyebrow: 'North // MOT.SYS',
    title: 'Motion is the language a system uses to explain itself.',
    intro: 'Motion Systems defines how every Hanoryx surface moves — the easing, the cadence, the rare accent. Movement here is engineered, budgeted, and tied to state. Nothing animates to decorate.',
    code: 'NODE.MOT',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Hanoryx North', to: '/north', variant: 'outline' },
    ],
    metrics: [
      { value: 60, suffix: 'fps', label: 'Sustained target' },
      { value: 8, label: 'Motion budget (ms/frame)' },
      { value: 1, label: 'Accent colour' },
    ],
  },
  blocks: [
    {
      type: 'manifesto',
      scene: 'radial-audio-core',
      eyebrow: 'Motion Doctrine',
      lines: [
        'Flow like a river. Continuous, quiet, high-control.',
        'Acceleration implies weight. Easing implies intention.',
        'Stillness implies readiness — never absence.',
        'The system is always alive, even when nothing is happening.',
      ],
      marquee: ['CADENCE', 'EASING', 'ACCENT', 'IDLE', 'THRESHOLD', 'STATE'],
    },
    {
      type: 'split',
      scene: 'signal-spectrum-field',
      eyebrow: 'Mechanics',
      code: 'MOT.MECH',
      title: 'Easing, budget, and meaning — held together.',
      body: [
        'Easing is the grammar of weight. We resolve every transition on a small, deliberate set of curves so that movement reads as physics, not as effect — heavy surfaces ease in slowly, light state changes settle fast. Inconsistent curves are treated as a defect.',
        'Performance is a hard constraint, not a target reached after the fact. Each surface holds a frame budget, and any animation that cannot stay inside it is cut or simplified before it ships. Sixty frames per second is the floor, sustained under real operational load.',
        'Movement only exists where it carries meaning. Every transition is a statement about state — direction, hierarchy, what just changed. Where motion would not explain something, the surface stays still and lets the operator read it in a single pass.',
      ],
      asideLabel: 'CONSTRAINTS',
      asideCode: 'MOT.DIM',
      points: [
        { k: 'EASING', v: 'Small fixed curve set' },
        { k: 'BUDGET', v: '8ms / frame ceiling' },
        { k: 'FLOOR', v: '60fps under load' },
        { k: 'MEANING', v: 'No motion without state' },
        { k: 'FALLBACK', v: 'Honours reduced-motion' },
      ],
    },
    {
      type: 'modules',
      scene: 'compass-vector',
      eyebrow: north.motion.eyebrow,
      title: 'Motion grammar.',
      intro: 'Four fixed terms govern how every surface behaves. They are constraints, not suggestions — applied identically across each Hanoryx node so the whole system moves with one voice.',
      rows: north.motion.notes,
    },
    {
      type: 'cta',
      scene: 'magnetic-vector',
      eyebrow: 'Open a channel',
      title: 'Commission a motion language.',
      body: 'Bring an interface that needs movement with intent — easing, cadence, and accent engineered to explain state, not to decorate it.',
    },
  ],
};

export default page;
