import { shortcutKeys, shortcutRows } from '../shortcuts';

const page = {
  key: 'legal/accessibility',
  title: 'Accessibility',
  accent: '#ff3333',
  aliases: ['keyboard', 'shortcuts', 'screen reader', 'reduced motion', 'wcag'],
  hero: {
    scene: 'privacy-quiet-grid',
    intensity: 'hero',
    eyebrow: 'Legal / Accessibility',
    title: 'Accessibility, as it stands.',
    intro:
      'What the site does to be usable, where it falls short, and how to tell the company. It has not been through a formal audit, so nothing here claims conformance with a standard.',
    code: 'LEGAL.04',
    status: 'AS IT STANDS',
    actions: [
      { label: 'Tell us what is wrong', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'keyboardMap',
      anchor: 'keys',
      railLabel: 'The keyboard',
      scene: 'architectural-grid',
      minHeight: 520,
      eyebrow: 'The keyboard',
      title: 'Press a key. See what it does here.',
      intro: 'Every key that does something on this site is drawn below. Press the real key, or tap a cap to read it.',
      keys: shortcutKeys,
      rows: shortcutRows,
      hint: 'Keys are only watched while this map is on screen, and never while you are typing in a field. Nothing is intercepted.',
    },
    {
      type: 'split',
      anchor: 'does',
      railLabel: 'What the site does',
      scene: 'topographic-lines',
      eyebrow: 'What the site does',
      code: 'A11Y.01',
      title: 'The basics, taken seriously.',
      body: [
        'Movement respects your system setting: when reduced motion is on, animations are shortened or removed and the Canvas backgrounds show a single still frame.',
        'Menus, tabs, sliders, search and the interactive demos are meant to be used from the keyboard, with a visible focus ring. Pages have headings and landmarks, and text sizes follow your browser’s settings.',
      ],
      asideLabel: 'IN PLACE',
      asideCode: 'A11Y.MAP',
      points: [
        { k: 'MOTION', v: 'Honours reduced motion' },
        { k: 'FOCUS', v: 'Visible on every control' },
        { k: 'KEYBOARD', v: 'Menus, tabs, sliders, search' },
        { k: 'STRUCTURE', v: 'Headings and landmarks' },
        { k: 'TEXT', v: 'Follows browser sizes' },
      ],
    },
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'limits',
      railLabel: 'Known limits',
      scene: 'privacy-quiet-grid',
      eyebrow: 'Known limits',
      title: 'Where it falls short.',
      intro: 'Honest, and not exhaustive.',
      items: [
        { code: 'LIM.01', title: 'Not formally audited', body: 'No audit against WCAG or any other standard has been carried out, so no conformance is claimed.', glyph: 'ruler' },
        { code: 'LIM.02', title: 'Decorative canvases', body: 'The animated backgrounds are decorative and hidden from assistive technology. They pause off screen and show one still frame under reduced motion.', glyph: 'wave' },
        { code: 'LIM.03', title: 'Pointer-first demos', body: 'Some demos are easiest with a pointer. Where possible they also work from the keyboard; where one does not, that is a bug worth reporting.', glyph: 'compass' },
        { code: 'LIM.04', title: 'A custom cursor', body: 'On devices with a mouse, the site replaces the system cursor with its own, and only when motion is not reduced.', glyph: 'node' },
      ],
    },
    {
      type: 'cta',
      scene: 'topology-pulse',
      eyebrow: 'Tell us',
      title: 'Something not working for you?',
      body: 'Describe what you tried and what happened. That is genuinely useful.',
      links: [{ label: 'Privacy', to: '/legal/privacy' }],
    },
  ],
};

export default page;
