const page = {
  key: 'resources/tools/contrast',
  title: 'Contrast Checker',
  accent: '#ff3333',
  aliases: ['wcag', 'colour contrast', 'color contrast', 'accessibility', 'readable', 'aa', 'aaa', 'luminance', 'palette', 'text colour'],
  hero: {
    scene: 'liquid-glass-operational',
    intensity: 'hero',
    eyebrow: 'Resources / Tools / Contrast',
    title: 'Is it readable? Measure it.',
    intro:
      'Two colours go in. Out come the contrast ratio, a verdict for body text, large text and interface parts, and the nearest colour that would pass if yours does not. It runs in the page and sends nothing anywhere.',
    code: 'RES.05',
    status: 'WCAG 2',
    actions: [
      { label: 'Check a pair', to: '/resources/tools/contrast#tool' },
      { label: 'How it works', to: '/resources/tools/contrast#workings', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'contrastChecker',
      anchor: 'tool',
      railLabel: 'The checker',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'The checker',
      title: 'Text colour on a background.',
      intro: 'Type a hex colour or use the picker. The preview shows both colours at real sizes, because a ratio only tells you so much.',
      note: 'This measures flat colours against the WCAG 2 formula. It cannot judge text over images, gradients or moving backgrounds, and a pass is not a guarantee that something is pleasant to read.',
    },
    {
      type: 'process',
      anchor: 'workings',
      railLabel: 'How the number is worked out',
      scene: 'architectural-grid',
      eyebrow: 'How the number is worked out',
      title: 'Four steps from two colours to one ratio.',
      steps: [
        { step: '01', title: 'Straighten each channel', body: 'Screens do not store brightness evenly. Each red, green and blue value is converted to linear light.' },
        { step: '02', title: 'Weigh the channels', body: 'The eye is most sensitive to green and least to blue, so the relative luminance is 0.2126 red + 0.7152 green + 0.0722 blue.' },
        { step: '03', title: 'Divide', body: 'The ratio is (lighter + 0.05) ÷ (darker + 0.05). It runs from 1 (the same colour) to 21 (black on white).' },
        { step: '04', title: 'Compare with the levels', body: 'Body text needs 4.5 to pass at AA and 7 at AAA. Large text needs 3 and 4.5. Interface parts need 3.' },
      ],
    },
    {
      type: 'modules',
      anchor: 'limits',
      railLabel: 'What contrast does not tell you',
      scene: 'topographic-lines',
      eyebrow: 'What contrast does not tell you',
      title: 'Passing is the floor.',
      rows: [
        { k: 'COLOUR ALONE', v: 'Never use colour as the only way to tell things apart. Add a shape, a label or a pattern.' },
        { k: 'THIN TYPE', v: 'A hairline weight can pass the ratio and still be hard to read. Weight and size matter too.' },
        { k: 'BACKGROUNDS THAT MOVE', v: 'Text over an animated or photographic background cannot be reduced to a single ratio. It has to be looked at, over time.' },
        { k: 'PEOPLE VARY', v: 'Low vision, colour blindness, glare and tired eyes all change what is readable. Give people a way to adjust.' },
      ],
    },
    {
      type: 'closer',
      kind: 'pairMatrix',
      anchor: 'palette',
      scene: 'signal-spectrum-field',
      tag: 'End of the contrast checker',
      minHeight: 640,
      title: 'Grade a whole palette.',
      lede: 'Paste the colours you are working with. Every text-on-background pairing is graded in a grid, so the ones that never work are visible before anything is designed with them.',
      onward: [
        { label: 'Accessible by default', to: '/north/accessibility' },
        { label: 'Type scale', to: '/resources/tools/type-scale' },
      ],
    },
  ],
};

export default page;
