import { engineeringTerms } from '../glossary';

const page = {
  key: 'north/accessibility',
  title: 'Accessible by Default',
  accent: '#ff3333',
  aliases: ['a11y', 'accessibility', 'screen reader', 'keyboard', 'wcag', 'inclusive design', 'aria', 'semantic html', 'alt text', 'focus', 'reduced motion'],
  hero: {
    scene: 'vector-compass',
    intensity: 'hero',
    eyebrow: 'Development / Accessibility',
    title: 'Built so that more people can use it.',
    intro:
      'Accessibility is not a feature added at the end. It is what happens when the structure of a page is honest: headings that are headings, buttons that are buttons, names that say what things do. The best way to see it is to look at this very page the way a screen reader does.',
    code: 'NTH.10',
    status: 'LOOK AT THIS PAGE',
    actions: [
      { label: 'Inspect this page', to: '/north/accessibility#outline' },
      { label: 'Write alt text', to: '/north/accessibility#alt', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'pageOutline',
      anchor: 'outline',
      railLabel: 'This page, as read aloud',
      scene: 'privacy-quiet-grid',
      minHeight: 780,
      eyebrow: 'This page, as read aloud',
      title: 'What a screen reader meets here.',
      intro: 'Every number below is read from the page you are looking at, right now: its headings as an outline, its landmarks, how many places the Tab key can stop and a handful of things that commonly go wrong.',
      note: 'An automated read can find structure and missing names. It cannot tell whether a heading makes sense or whether a name is a good one. Only a person can.',
    },
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'habits',
      railLabel: 'Four habits',
      scene: 'architectural-grid',
      eyebrow: 'Four habits',
      title: 'Most of it is these.',
      intro: 'Get these four right and a great deal else follows.',
      items: [
        { code: 'A11Y.01', title: 'Say what it is', body: 'Use the element that means the thing: a button for a button, a heading for a heading, a list for a list. Assistive technology understands them for free.', glyph: 'doc' },
        { code: 'A11Y.02', title: 'Reach it with a keyboard', body: 'Everything that can be pressed can be reached, in a sensible order, with a visible ring showing where you are.', glyph: 'terminal' },
        { code: 'A11Y.03', title: 'Make it readable', body: 'Enough contrast, text that can grow, and layouts that do not fall apart when it does.', glyph: 'lens' },
        { code: 'A11Y.04', title: 'Let people choose', body: 'Respect the device’s settings for motion and size, and offer controls of your own for the rest.', glyph: 'compass' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      variant: 'article',
      anchor: 'notes',
      railLabel: 'Notes',
      scene: 'architectural-grid',
      minHeight: 800,
      eyebrow: 'Notes',
      title: 'What this site does, and what it does not.',
      intro: 'A plain account of the habits behind these pages, and of their limits.',
      version: 'General notes',
      summary: [
        'Pages use real headings, landmarks and controls, and every page is scanned for accessibility problems.',
        'The interface offers display settings for text size, spacing, contrast and calm, and follows {{reduced motion}}.',
        'Automated scans are **not** the whole job. The animated backgrounds, and what a screen reader makes of the whole experience, need a person.',
      ],
      meta: [
        { k: 'See also', v: 'The accessibility statement, under Legal' },
        { k: 'Kind', v: 'General notes, not a conformance claim' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'structure',
          title: 'Structure first',
          plain: 'Meaning comes from the markup, not from the paint.',
          body: [
            'A page is read in two ways: seen, and understood by software. The second depends on the structure underneath — {{semantic HTML}} — and on the {{accessibility tree}} that browsers build from it. A heading made by enlarging bold text looks the same and means nothing to a screen reader.',
            { list: [
              'One top-level heading, then headings that nest without skipping.',
              'Landmarks (header, navigation, main, footer) so people can jump to what they want.',
              'Lists for lists, tables for data, buttons for actions and links for places.',
              '{{ARIA}} only where plain HTML cannot say it. The first rule of ARIA is not to need it.',
            ] },
          ],
        },
        {
          id: 'keyboard',
          title: 'The keyboard',
          plain: 'If a keyboard cannot do it, many people cannot.',
          body: [
            'Not everyone uses a pointer. People with motor impairments, people using switches or voice control, and a great many fast typists all rely on the keyboard. Every control should be reachable and usable with it, in an order that follows the page, and with a clear indication of where focus is.',
            { list: [
              'Never remove the focus ring without a better one.',
              'Custom controls need the keys people expect: arrows in a menu, Escape to close.',
              'A pop-up that takes focus must give it back.',
              'There should be a way past repeated navigation.',
            ] },
          ],
        },
        {
          id: 'settings',
          title: 'Display settings',
          plain: 'The site lets you adjust it, and remembers nothing about you.',
          body: [
            'Beyond what the device already asks for, the site offers its own display settings: text size, spacing, contrast, and a calm mode that stills the drawn backgrounds. The choices are applied as you make them, and are kept only for the session you are in. They are described under the accessibility statement.',
          ],
        },
        {
          id: 'checks',
          title: 'How it is checked',
          plain: 'Scans every page, then people for the rest.',
          body: [
            'Every page is opened at desktop and phone widths and scanned with an open-source accessibility engine against the web content guidelines, and the run fails on any violation. That finds missing names, bad structure, broken references and, where the background can be measured, low contrast.',
            'It does not replace a keyboard walk or a screen-reader pass, and text over the animated backgrounds cannot be measured by a scan at all. That is why the backgrounds are kept calm behind text, and why there is a calm mode.',
          ],
        },
        {
          id: 'limits',
          title: 'The limits, stated plainly',
          plain: 'Nothing here claims perfection.',
          body: [
            'This site makes no claim to meet a particular conformance level, and no one has certified it. It is checked, it is improved when something is found, and it has an address for telling the company when something is wrong. The accessibility statement lists what is known to fall short.',
          ],
        },
      ],
      note: 'General notes about this site. They are not a conformance claim; see the accessibility statement.',
      endLabel: 'End of the notes',
    },
    {
      type: 'closer',
      kind: 'altTextLab',
      anchor: 'alt',
      scene: 'redaction-matrix',
      tag: 'End of accessibility',
      minHeight: 760,
      title: 'Write the alt text.',
      lede: 'Four pictures, four different problems: a chart, an ornament, an icon inside a button and an illustration. Describe each as you would to someone who cannot see it, then check against a few common rules.',
      onward: [
        { label: 'Accessibility statement', to: '/legal/accessibility' },
        { label: 'Contrast checker', to: '/resources/tools/contrast' },
      ],
    },
  ],
};

export default page;
