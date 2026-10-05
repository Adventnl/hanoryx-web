import { shortcutKeys, shortcutRows } from '../shortcuts';
import { legalTerms } from '../legalTerms';

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
      { label: 'Feedback & complaints', to: '/legal/complaints', variant: 'outline' },
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
      type: 'signature',
      kind: 'document',
      anchor: 'statement',
      railLabel: 'The full statement',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full statement',
      title: 'Accessibility statement, in full.',
      intro: 'What the site does, what has and has not been checked, where it falls short, and how to tell the company when something does not work for you.',
      version: 'Draft 1.0',
      summary: [
        'The site is built to be usable from the keyboard, with visible focus, headings, landmarks and **reduced-motion** support.',
        'It has had **automated** accessibility checks. It has **not** had a formal audit, so it **claims no conformance** with {{WCAG}} or any other standard.',
        'Some things are known to fall short, and they are listed plainly below.',
      ],
      meta: [
        { k: 'Standard claimed', v: 'None' },
        { k: 'Audit', v: 'Not carried out' },
      ],
      terms: legalTerms,
      sections: [
        {
          id: 'aim',
          title: 'Our aim',
          plain: 'To be usable by as many people as possible.',
          body: [
            'Hanoryx Systems wants its website to be usable by as many people as possible, whatever device they use and however they get around a page. Accessibility is treated as part of building the site, not something added afterwards.',
            'This statement is honest about where that stands. It is better to say what has and has not been done than to claim a standard that has not been checked.',
          ],
        },
        {
          id: 'scope',
          title: 'What this statement covers',
          plain: 'Every page of the website.',
          body: [
            'The statement covers the website at its public address, including its interactive diagrams, tools, long-form documents and the search. It does not cover other sites it links to, or the font service it loads typefaces from.',
          ],
        },
        {
          id: 'status',
          title: 'Conformance status',
          plain: 'No standard is claimed.',
          body: [
            'The site has not been through a formal audit against {{WCAG}} or any other standard, so it does not claim conformance with one.',
            'Its automated checks and the fixes they prompted are described below. They show that some kinds of problem are absent. They cannot show that a page is accessible in the ways that matter most to people.',
          ],
        },
        {
          id: 'inplace',
          title: 'What is in place',
          plain: 'The basics, taken seriously.',
          body: [
            { list: [
              '**Keyboard.** Menus, tabs, sliders, the search and the interactive demos are meant to be used from the keyboard, with a visible focus ring on every control.',
              '**Structure.** Pages have a single main heading, an ordered outline, and landmarks for the header, navigation, main content and footer. A skip link jumps to the content.',
              '**Motion.** When {{reduced motion}} is on in your system, animations are shortened or removed, the animated backgrounds show one still frame, and the custom cursor and smooth scrolling switch off.',
              '**Text.** Text sizes follow your browser’s settings, and pages reflow rather than scroll sideways at narrow widths.',
              '**Names and labels.** Controls have accessible names; decorative graphics are hidden from {{assistive technology}}.',
              '**Documents.** The long documents have a contents list, headings you can jump between, and a print view.',
            ] },
          ],
        },
        {
          id: 'checks',
          title: 'How it has been checked',
          plain: 'Automated checks on every page; no manual audit yet.',
          body: [
            'Every page is tested with {{axe-core}}, an open-source accessibility engine, at a desktop width and a phone width, using automated browser scripts. The run must be free of violations before changes are accepted. It found real problems along the way, such as tab roles with nothing to control, a skipped heading level and small low-contrast labels, and they were fixed.',
            { note: 'Automated tools find only a part of the problems that exist. They cannot hear a {{screen reader}}, press a key as a person would, or judge text drawn over the animated backgrounds.', tone: 'warn', label: 'What that means' },
            'The site has not been tested with the full range of {{assistive technology}}. Manual screen-reader passes, a keyboard-only walk of every demonstration and checks on touch hardware are still to be done.',
          ],
        },
        {
          id: 'limits',
          title: 'Known limitations',
          plain: 'Where the site falls short today.',
          body: [
            { table: {
              caption: 'Known limitations',
              head: ['Area', 'What is not ideal', 'What helps'],
              rows: [
                ['Animated backgrounds', 'The {{canvas}} scenes are decorative, hidden from assistive technology and drawn behind text. Contrast of text over them cannot be measured automatically.', 'They pause off screen and show one frame under reduced motion; text blocks use the calmest scenes.'],
                ['Pointer-first demos', 'Some demonstrations are easiest with a pointer.', 'Most also work from the keyboard. Where one does not, that is a bug worth reporting.'],
                ['Custom cursor', 'On devices with a mouse, the site replaces the system cursor with its own.', 'It is off for touch and for reduced motion, and text fields keep the normal caret.'],
                ['Not formally audited', 'No audit has been carried out.', 'The checks above, and your feedback.'],
                ['Fonts from a third party', 'If the font service is blocked, the site shows in system typefaces.', 'It stays readable; the layout adapts.'],
              ],
            } },
          ],
        },
        {
          id: 'motion',
          title: 'Motion and animation',
          plain: 'The site respects your system setting.',
          body: [
            'The site is animated by design. It reads the reduced-motion setting of your system and, when it is on, shortens or removes movement: page transitions are brief, nothing loops, the background scenes draw a single still frame and the intro resolves immediately.',
            'The display preferences panel at the end of this page lets you calm the site down further for the current view without changing anything in your system.',
          ],
        },
        {
          id: 'keyboard',
          title: 'Keyboard shortcuts',
          plain: 'A handful of keys, none of which fire while you type.',
          body: [
            'The keyboard map near the top of this page draws every key that does something here. In summary:',
            { defs: [
              { k: 'Ctrl / ⌘ + K', v: 'Opens the search from anywhere. The slash key does the same when you are not typing.' },
              { k: '?', v: 'Opens a short list of these keys.' },
              { k: 'B', v: 'Switches blueprint mode, which outlines and names the marked parts of a page.' },
              { k: 'Esc', v: 'Closes what is open and returns focus to where you were.' },
              { k: 'Arrow keys', v: 'Move within tabs, sliders, carousels, lists and search results. Home and End jump to the ends.' },
            ] },
            'Shortcuts are ignored while you are typing in a field or holding a modifier key, and they never replace the standard behaviour of Tab, Enter or Space.',
          ],
        },
        {
          id: 'tech',
          title: 'Technical specifications',
          plain: 'What the site relies on.',
          body: [
            'The site relies on HTML, CSS, JavaScript, SVG and the Canvas API. A browser that does not support these will not show it as intended. It is a client-rendered application, so JavaScript must be enabled.',
          ],
        },
        {
          id: 'feedback',
          title: 'Feedback and contact',
          plain: 'Tell the company what is not working for you.',
          body: [
            'If something on the site does not work for you, please say so through the contact page. It helps to include the page, what you tried, what you expected, what happened, and the browser and any assistive technology you use.',
            'The feedback and complaints page explains how a report moves, and what to do if you are not satisfied with the answer.',
          ],
        },
        {
          id: 'prepared',
          title: 'How this statement was prepared',
          plain: 'By the company, from its own checks.',
          body: [
            'This statement was prepared by the company from its own automated checks and its own review of how the site behaves. It has not been reviewed by an external accessibility specialist. It will be updated as checks are added and problems are fixed.',
          ],
        },
      ],
      note: 'A plain-language statement written for this site. It claims no conformance with any standard.',
    },
    {
      type: 'closer',
      kind: 'prefsPanel',
      scene: 'architectural-grid',
      tag: 'End of accessibility',
      minHeight: 520,
      title: 'Tune the site to you.',
      lede: 'Four settings you can change right now. They apply to this view only and are not stored.',
      onward: [{ label: 'Feedback & complaints', to: '/legal/complaints' }, { label: 'Keyboard shortcuts', to: '/legal/accessibility#keys' }],
    },
  ],
};

export default page;
