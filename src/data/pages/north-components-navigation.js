import { familyPage } from '../kitPages';

export default familyPage({
  family: 'navigation',
  key: 'north/components/navigation',
  title: 'Navigation Components',
  aliases: ['breadcrumbs', 'pagination', 'stepper', 'tabs', 'side navigation', 'dropdown menu', 'table of contents', 'toolbar', 'roving tabindex', 'wizard'],
  code: 'KIT.02',
  hero: {
    scene: 'motion-curve-field',
    crumb: 'Navigation',
    title: 'Always know where you are.',
    intro:
      'Eight ways to show the way — a trail back, numbered pages, steps in order, tabs, a folding side menu, an actions menu, a table of contents that follows you and a toolbar — each one driveable from a keyboard and followable by a screen reader.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Eight ways to find the way, live.',
    intro: 'Use them with the keyboard first: Tab into one, then try the arrow keys, Home, End and Escape. The Keyboard tab lists what each answers to.',
  },
  essay: {
    rail: 'A promise about position',
    scene: 'hex-lattice',
    eyebrow: 'Navigation is a promise about position',
    code: 'NAV.01',
    title: 'Where am I, where else, and how do I get back?',
    body: [
      'People rarely read a site from the front. They arrive in the middle and ask three questions: where am I, where else can I go, how do I get back. Navigation components answer them in a fixed order, in the same place on every page — which is what makes them navigation rather than decoration.',
      'The mechanics matter as much as the look. A menu that opens must move focus into itself and give it back. A set of tabs is one tab stop, not six. A folded group must be unreachable, not merely invisible. Each of these is a place where a component can look right and still be broken for anyone who is not using a mouse.',
    ],
    asideLabel: 'THREE QUESTIONS',
    asideCode: 'NAV.Q',
    points: [
      { k: 'WHERE', v: 'Breadcrumbs, “on this page”, the current item marked' },
      { k: 'WHERE ELSE', v: 'Side navigation, menus, tabs' },
      { k: 'HOW FAR', v: 'Pagination, steppers' },
      { k: 'HOW BACK', v: 'The trail, and Escape' },
    ],
  },
  rules: {
    scene: 'circuit-trace',
    title: 'For finding the way.',
    rows: [
      { k: 'ONE CURRENT ITEM', v: 'Mark where you are with aria-current — in the markup and on the screen — and nowhere else.' },
      { k: 'ONE TAB STOP', v: 'A tab list, a toolbar and a tree are one stop each; arrows move inside. Tabbing through forty items is not navigation.' },
      { k: 'FOLDED MEANS HIDDEN', v: 'A closed group is out of the tab order and the reading order, not clipped to nothing.' },
      { k: 'NAME THE LANDMARK', v: 'Two navigations on a page need two names — “Breadcrumb”, “Pagination” — so the list of landmarks makes sense.' },
      { k: 'DO NOT TRAP', v: 'Anything that can be entered can be left: Escape, Tab out, a visible close.' },
      { k: 'SAY HOW FAR', v: '“Page 6 of 20” and “Step 2 of 4” tell people what is left. A bar with no numbers does not.' },
    ],
  },
  closer: {
    kind: 'wizardRun',
    anchor: 'walk',
    scene: 'data-interface-wave',
    tag: 'End of the navigation components',
    minHeight: 820,
    title: 'Walk a flow, and hear it.',
    lede: 'Four steps with a stepper, a Next that waits until the step is complete and says why, and focus that moves to each step’s heading. Beside it, a log writes down what a screen reader would announce.',
    steps: [
      { title: 'Details', hint: 'Who and what', intro: 'Give it a name. At least three characters unlocks the next step.' },
      { title: 'Review', hint: 'Check it over', intro: 'Read back what you entered. Nothing has happened yet.' },
      { title: 'Confirm', hint: 'Make it so', intro: 'One last check before it would be made.' },
      { title: 'Done', hint: 'Nothing left', intro: 'That is the whole flow.' },
    ],
    onward: [
      { label: 'Feedback components', to: '/north/components/feedback' },
      { label: 'Accessible by default', to: '/north/accessibility' },
    ],
  },
});
