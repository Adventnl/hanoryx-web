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
    status: 'SITE ENGINEERING',
    metricsSource: 'site-code',
    actions: [
      { label: 'Hanoryx North', to: '/north', variant: 'outline' },
    ],
    metrics: [
      { value: 30, suffix: 'fps', label: 'Canvas target cadence' },
      { value: 2, label: 'Maximum desktop scenes' },
      { value: 1, label: 'Reduced-motion still frame' },
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
        'This site budgets visible Canvas scenes and caps their draw cadence at roughly thirty frames per second. Quality scales with device hints and observed frame rate; reduced-motion settings receive a still frame.',
        'Movement only exists where it carries meaning. Every transition is a statement about state — direction, hierarchy, what just changed. Where motion would not explain something, the surface stays still and lets the operator read it in a single pass.',
      ],
      asideLabel: 'CONSTRAINTS',
      asideCode: 'MOT.DIM',
      points: [
        { k: 'EASING', v: 'Small fixed curve set' },
        { k: 'BUDGET', v: 'Visible scenes share a scheduler' },
        { k: 'CADENCE', v: 'Backgrounds target 30fps' },
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
