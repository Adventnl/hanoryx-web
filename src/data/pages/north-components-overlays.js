import { familyPage } from '../kitPages';

export default familyPage({
  family: 'overlays',
  key: 'north/components/overlays',
  title: 'Overlay Components',
  aliases: ['modal', 'dialog', 'drawer', 'tooltip', 'popover', 'hover card', 'confirm', 'focus trap', 'focus management', 'escape key'],
  code: 'KIT.05',
  hero: {
    scene: 'glass-prism',
    crumb: 'Overlays',
    title: 'Above the page, for a moment.',
    intro:
      'Six ways to put something on top of the page — a hint, a panel, a preview, a dialog, a drawer and a confirmation — each one a promise about where focus goes next.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Six overlays, live.',
    intro: 'Open the dialog and press Tab until you are sure you cannot get out; press Escape and see where focus lands. Try the tooltips with the keyboard, not the mouse.',
  },
  essay: {
    rail: 'A promise about focus',
    scene: 'architectural-grid',
    eyebrow: 'An overlay is a promise about focus',
    code: 'OVL.01',
    title: 'Find it. Use it. Land back where you were.',
    body: [
      'When something appears on top of the page, two things have to happen for everyone, not only for people with a mouse: they have to be able to find it, and when they leave it they must land back where they were.',
      'A hint can wait politely beside its control. A dialog takes over, so it must also stop the page behind it from answering, keep Tab inside, and hand focus back when it goes. Between those two lie the popover (not modal, so Tab moves on) and the hover card (only ever an extra). Choosing the weakest overlay that does the job is most of the craft.',
    ],
    asideLabel: 'FROM LIGHT TO HEAVY',
    asideCode: 'OVL.SCALE',
    points: [
      { k: 'TOOLTIP', v: 'A few words; never needed' },
      { k: 'HOVER CARD', v: 'A preview of a link; never needed' },
      { k: 'POPOVER', v: 'A panel you opened; Tab moves on' },
      { k: 'DRAWER', v: 'Context beside the page; modal' },
      { k: 'DIALOG', v: 'A decision before going on; modal' },
    ],
  },
  rules: {
    scene: 'hex-lattice',
    title: 'For anything that sits on top.',
    rows: [
      { k: 'ADD, NEVER REPLACE', v: 'A tooltip or a hover card only adds detail. If the page makes no sense without it, the detail belongs on the page.' },
      { k: 'FOCUS IN, FOCUS BACK', v: 'Opening moves focus in; closing returns it to what opened it. Lose that and a keyboard user is dropped at the top of the page.' },
      { k: 'ESCAPE ALWAYS WORKS', v: 'Every overlay can be dismissed with Escape and by a press outside it, and always has a visible close as well.' },
      { k: 'LOCK THE PAGE BEHIND', v: 'A modal stops the page scrolling and answering. Smooth scrolling is paused with it.' },
      { k: 'TOUCH HAS NO HOVER', v: 'Whatever opens on hover also opens on focus and on press, or is not essential.' },
      { k: 'ONE AT A TIME', v: 'Two stacked dialogs usually mean a design problem. If it needs a second question, ask it in the first.' },
    ],
  },
  closer: {
    kind: 'focusTrap',
    anchor: 'trap',
    scene: 'polar-status',
    tag: 'End of the overlay components',
    minHeight: 760,
    title: 'Try to escape the dialog.',
    lede: 'Open it and press Tab, Shift+Tab and Escape. A log beside it writes down where focus goes: in, round and round inside, and back to the button that opened it.',
    rules: [
      'Focus moves in when it opens, to the first control or the one marked for it.',
      'Tab and Shift+Tab cycle inside; focus never reaches the page behind.',
      'Escape, the close button and a press on the dark area all dismiss it.',
      'Focus returns to what opened it, and the page behind stops scrolling meanwhile.',
    ],
    onward: [
      { label: 'Content and layout components', to: '/north/components/content' },
      { label: 'Accessible by default', to: '/north/accessibility' },
    ],
  },
});
