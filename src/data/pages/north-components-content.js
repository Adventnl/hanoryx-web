import { familyPage } from '../kitPages';

export default familyPage({
  family: 'content',
  key: 'north/components/content',
  title: 'Content and Layout Components',
  aliases: ['card', 'callout', 'quote', 'figure', 'prose', 'typography', 'reading width', 'grid', 'stack', 'cluster', 'disclosure', 'aspect ratio', 'layout'],
  code: 'KIT.06',
  hero: {
    scene: 'liquid-glass-operational',
    crumb: 'Content and layout',
    title: 'The surfaces text sits on.',
    intro:
      'Twelve primitives for putting things on a page — a card, a callout, a quote, a figure, a divider, a reading column, three layout helpers, a disclosure, a box that holds a shape, and text only a screen reader hears.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Twelve primitives, live.',
    intro: 'Resize the window while you look at the grid, or narrow the preview to a phone: nothing here has a breakpoint to break.',
  },
  essay: {
    rail: 'Layout without breakpoints',
    scene: 'topographic-lines',
    eyebrow: 'Layout without breakpoints',
    code: 'LAY.01',
    title: 'Ask for a minimum, not a width.',
    body: [
      'Most layout code is breakpoints: at this width, that many columns. The kit avoids them where it can. A grid asks for a minimum column width and fits as many as will go. A cluster wraps when it runs out of room. A stack just stacks. The page is never wrong at an unexpected width, because nothing was written for a particular one.',
      'Spacing comes from the tokens, so rhythm changes in one place. And visual order is source order: layout never reorders content, so what a keyboard tabs through and what a screen reader reads is what the eye sees.',
    ],
    asideLabel: 'WHAT REPLACES A BREAKPOINT',
    asideCode: 'LAY.AUTO',
    points: [
      { k: 'GRID', v: 'As many columns as fit, none narrower than a minimum' },
      { k: 'CLUSTER', v: 'A row that wraps when it must' },
      { k: 'STACK', v: 'A column with a token-sized gap' },
      { k: 'ASPECT RATIO', v: 'A shape held before the picture arrives' },
    ],
  },
  rules: {
    scene: 'circuit-trace',
    title: 'For putting things on a page.',
    rows: [
      { k: 'HEADINGS FIT THE OUTLINE', v: 'A card’s title is a heading whose level you choose, so the page’s outline stays true.' },
      { k: 'MEASURE 45 TO 75', v: 'Lines of about 45 to 75 characters read best. Prose sets about 68.' },
      { k: 'SPACE FROM TOKENS', v: 'Gaps are tokens, not numbers, so rhythm changes in one place.' },
      { k: 'SOURCE ORDER IS READING ORDER', v: 'Layout never reorders content. Visual order and reading order agree.' },
      { k: 'DECORATION IS CSS', v: 'A rule or flourish with no meaning is a background, not an element. A divider is for breaks that mean something.' },
      { k: 'ONE ACCENT PER SCREEN', v: 'The accent card says start here. Say it once.' },
    ],
  },
  closer: {
    kind: 'readingColumn',
    anchor: 'column',
    scene: 'split-prism',
    tag: 'End of the content and layout components',
    minHeight: 800,
    title: 'Set a reading column.',
    lede: 'Slide the measure, the line height and the size, and change the face. The text reflows as you go, and the page says whether each setting is short, comfortable or long: the rules of thumb behind the Prose component.',
    heading: 'Handing a system over',
    paragraphs: [
      'A handover is judged by the first change a stranger can make safely. Everything else — the diagrams, the wiki, the recorded walkthrough — is in service of that one moment, and it is worth designing for it from the first week rather than the last.',
      'The people who built a system carry a great deal in their heads: why a table is shaped as it is, which job must never run twice, what the odd configuration value is for. None of it is secret, and almost none of it is written down. The work of a handover is the unglamorous work of writing it down while it is still fresh.',
      'Write how it is run, not only how it is built. List what can go wrong, in the order it usually does. Say what you would do differently. A newcomer reading that has a head start of months.',
    ],
    onward: [
      { label: 'Designing for handover', to: '/insights/handover' },
      { label: 'Design tokens', to: '/north/design-tokens' },
    ],
  },
});
