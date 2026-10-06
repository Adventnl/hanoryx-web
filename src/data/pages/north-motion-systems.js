import { north } from '../company';

const page = {
  key: 'north/motion-systems',
  title: 'Motion Systems',
  accent: '#ff3333',
  aliases: ['easing', 'animation', 'cadence', 'cubic bezier', 'reduced motion', 'budget'],
  hero: {
    scene: 'motion-curve-field',
    intensity: 'hero',
    eyebrow: 'Development / Motion systems',
    title: 'Motion is how a system explains itself.',
    intro:
      'How the surfaces of this site move: the easing, the cadence and the budget. Movement is tied to state, and nothing animates just to decorate.',
    code: 'DEV.04',
    status: 'SITE ENGINEERING',
    actions: [
      { label: 'Development', to: '/north', variant: 'outline' },
      { label: 'Visual lab', to: '/lab' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'easingStudio',
      anchor: 'studio',
      railLabel: 'Easing studio',
      minHeight: 640,
      eyebrow: 'Easing studio',
      title: 'Draw a curve. Watch it move.',
      intro:
        'Drag the two handles, or pick a preset. The same curve moves a ball, scales a block and fades a bar. Presets named “Site” are the curves this website actually uses.',
      presets: [
        { id: 'site-out', label: 'Site · ease-out', value: [0.16, 1, 0.3, 1] },
        { id: 'site-glide', label: 'Site · glide', value: [0.22, 1, 0.36, 1] },
        { id: 'site-inout', label: 'Site · in-out', value: [0.65, 0, 0.35, 1] },
        { id: 'linear', label: 'Linear', value: [0, 0, 1, 1] },
        { id: 'overshoot', label: 'Overshoot', value: [0.34, 1.56, 0.64, 1] },
        { id: 'anticipate', label: 'Anticipate', value: [0.36, -0.4, 0.64, 1] },
      ],
      note: 'Curves are shown as CSS cubic-bezier() values. The studio only previews; it changes nothing on the site.',
    },
    {
      type: 'stats',
      anchor: 'budget',
      railLabel: 'From the code',
      eyebrow: 'From the site’s own code',
      title: 'The motion budget, in numbers.',
      items: [
        { value: 30, suffix: ' fps', label: 'Background cadence', note: 'Canvas scenes draw at about thirty frames a second' },
        { value: 2, label: 'Backgrounds at once', note: 'On desktop. One on phones and low-power devices' },
        { value: 1, label: 'Still frame', note: 'What a scene shows under reduced motion' },
      ],
    },
    {
      type: 'manifesto',
      anchor: 'doctrine',
      railLabel: 'Doctrine',
      eyebrow: 'Motion doctrine',
      lines: [
        'Flow like a *river*. Continuous, quiet, high-control.',
        'Acceleration implies weight. Easing implies intention.',
        'Stillness implies readiness — never absence.',
        'The system is always alive, even when nothing is happening.',
      ],
      marquee: ['CADENCE', 'EASING', 'ACCENT', 'IDLE', 'THRESHOLD', 'STATE'],
    },
    {
      type: 'split',
      anchor: 'mechanics',
      railLabel: 'Mechanics',
      eyebrow: 'Mechanics',
      code: 'MOT.MECH',
      title: 'Easing, budget and meaning, held together.',
      body: [
        'Easing is the grammar of weight. Every transition resolves on a small, deliberate set of curves so that movement reads as physics rather than effect. Inconsistent curves are treated as a defect.',
        'The site budgets visible Canvas scenes and caps their draw cadence at roughly thirty frames per second. Quality scales with device hints and the observed frame rate, and reduced-motion settings receive a still frame.',
        'Movement only exists where it carries meaning. Every transition is a statement about state — direction, hierarchy, what just changed. Where motion would not explain something, the surface stays still.',
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
      anchor: 'grammar',
      railLabel: 'Grammar',
      eyebrow: north.motion.eyebrow,
      title: 'Motion grammar.',
      intro: 'Four fixed terms govern how every surface behaves. They are constraints, not suggestions, and apply the same way across the site.',
      rows: north.motion.notes,
    },
    {
      type: 'closer',
      kind: 'motionModes',
      anchor: 'modes',
      scene: 'flow-field',
      tag: 'End of motion systems',
      minHeight: 640,
      title: 'One menu, three policies.',
      lede: 'The same menu opening in full, in calm and in still. The site follows the device’s reduced-motion setting, and also offers a calm display setting of its own, which stills the drawn backgrounds.',
      onward: [
        { label: 'Animation budgets', to: '/insights/animation-budgets' },
        { label: 'Interface lab', to: '/north/interface-lab' },
      ],
    },
  ],
};

export default page;
