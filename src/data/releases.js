/* What changed on this site, told in chapters — newest first. The site is not
   versioned like a product and its history is not dated here (nothing on this
   site is derived from repository or deployment dates), so each entry is a
   chapter of the work, in the order it happened. The footer's "new on the site"
   strip and the release-notes page both read this file. */
import { kit } from './kit';

export const releases = [
  {
    id: 'kit',
    chapter: 10,
    title: 'The kit and the depth',
    lede: 'The pages get longer, the parts get named, and the site checks what it says about itself.',
    tags: ['Added', 'Changed', 'Fixed'],
    to: '/north/components',
    notes: [
      { tag: 'Added', text: `An interface kit: ${kit.length} components in six families — inputs, navigation, feedback, data display, overlays, content and layout — each with a live example, its code, its props and its keyboard behaviour.`, to: '/north/components' },
      { tag: 'Added', text: 'Page blocks: twelve data-first kinds of block built from the kit, a catalogue of all twenty, and a page that shows each at work.', to: '/north/blocks' },
      { tag: 'Changed', text: 'The ten legal documents are now long-form: each has a word list with hover definitions, tables, worked examples, questions and a version history, between about 2,700 and 5,600 words.', to: '/legal' },
      { tag: 'Added', text: 'A Feedback & problems topic on the contact page, which the legal documents point to.', to: '/contact' },
      { tag: 'Added', text: 'Moving to another page is announced to assistive technology, and keyboard focus moves to the new page when the link used has gone.' },
      { tag: 'Added', text: 'The single-key shortcuts (?, B and /) can be turned off in the display preferences.', to: '/legal/accessibility#display' },
      { tag: 'Fixed', text: 'Text contrast is now measured on every page, a screen at a time. Small labels, dimmed steps and decorative codes were raised to at least 4.5 to 1 or hidden from assistive technology.', to: '/legal/accessibility' },
    ],
  },
  {
    id: 'library',
    chapter: 9,
    title: 'The library',
    lede: 'The site grows from a showcase into a place to read, check and use.',
    tags: ['Added'],
    to: '/resources',
    notes: [
      { tag: 'Added', text: 'A legal centre: ten plain-language documents, each a long-form reader with a contents rail, find-in-document, section links and a print view.', to: '/legal' },
      { tag: 'Added', text: 'A trust centre: a ledger of what the site does and does not claim, a live status board measured in your own browser, the services your browser contacts, a disclosure policy, and every licence.', to: '/trust' },
      { tag: 'Added', text: 'Insights: eight guides to building operational systems, each with a small interactive demonstration.', to: '/insights' },
      { tag: 'Added', text: 'Resources: a glossary, release notes, downloads, and five browser-only tools.', to: '/resources' },
      { tag: 'Changed', text: 'The footer is a directory of the whole site rather than a second navigation bar.' },
      { tag: 'Changed', text: 'Every page now ends on a composition of its own, not a line pointing at the contact page.' },
    ],
  },
  {
    id: 'fixes',
    chapter: 8,
    title: 'Fixes after use',
    lede: 'Things found by using the site rather than by reading it.',
    tags: ['Fixed'],
    notes: [
      { tag: 'Fixed', text: 'A menu now opens on the first hover after a scroll. Smooth scrolling kept firing events for about a second and each one cancelled the pending open.' },
      { tag: 'Fixed', text: 'The search overlay’s section chips and result rows now share one left edge, and the chips have equal room above and below.' },
      { tag: 'Fixed', text: 'The page cannot scroll while the intro is on screen.' },
    ],
  },
  {
    id: 'checked',
    chapter: 7,
    title: 'Checked',
    lede: 'An automated accessibility pass over every page, and what it found.',
    tags: ['Fixed', 'Changed'],
    to: '/legal/accessibility',
    notes: [
      { tag: 'Fixed', text: 'Selectors that only change a nearby demo are announced as radio groups, not as tabs that control panels that do not exist.' },
      { tag: 'Fixed', text: 'Small labels were lifted to at least 4.5:1 contrast; two code lines wrap instead of scrolling sideways.' },
      { tag: 'Changed', text: 'The search overlay’s highlights glide with CSS rather than a layout animation, so it leaves the screen promptly.' },
    ],
  },
  {
    id: 'foreground',
    chapter: 6,
    title: 'The foreground',
    lede: 'Every page gets an object of its own to read, point at and use.',
    tags: ['Added'],
    to: '/engineering',
    notes: [
      { tag: 'Added', text: 'A foreground toolkit, 36 page-specific compositions and 12 hero objects, with every separate behaviour marked so blueprint mode (press B) can outline and name it.', to: '/sitemap' },
      { tag: 'Added', text: 'Four case studies for the Work section, and a new Home.', to: '/work' },
    ],
  },
  {
    id: 'pages',
    chapter: 5,
    title: 'The pages',
    lede: 'Company, systems, development, contact, site map, legal and a 404.',
    tags: ['Added'],
    to: '/company',
    notes: [
      { tag: 'Added', text: 'Company, principles, security approach, timeline and careers.', to: '/company' },
      { tag: 'Added', text: 'Seven systems areas and five development pages, each with its own signature composition.', to: '/systems' },
      { tag: 'Added', text: 'A site map, four legal pages and a 404 that suggests the nearest real pages.', to: '/sitemap' },
    ],
  },
  {
    id: 'navigation',
    chapter: 4,
    title: 'Navigation',
    lede: 'Finding your way around.',
    tags: ['Added'],
    notes: [
      { tag: 'Added', text: 'Search across page titles and body text, with highlighted excerpts and full keyboard handling.' },
      { tag: 'Added', text: 'A shortcuts panel (press ?), blueprint mode (press B), a travelling line between pages, and a favicon drawn from the company mark.' },
    ],
  },
  {
    id: 'lighter',
    chapter: 3,
    title: 'Lighter',
    lede: 'Measured, then trimmed.',
    tags: ['Changed'],
    to: '/engineering',
    notes: [
      { tag: 'Changed', text: 'An always-on scanline sweep was removed after it cost around fifteen frames a second while scrolling.' },
      { tag: 'Changed', text: 'Filters and clip paths no longer stay behind on revealed elements; pulses animate opacity only.' },
    ],
  },
  {
    id: 'intro',
    chapter: 2,
    title: 'The intro',
    lede: 'Starting properly.',
    tags: ['Fixed'],
    notes: [
      { tag: 'Fixed', text: 'START begins the music inside the click; the calibration readouts reach 100% together; the navigation bar is visible as soon as the site is.' },
    ],
  },
  {
    id: 'first',
    chapter: 1,
    title: 'The first build',
    lede: 'Backgrounds, a boot sequence, and a way in.',
    tags: ['Added'],
    notes: [
      { tag: 'Added', text: 'A Canvas background for every section, an intro sequence, and a radial navigation menu.' },
    ],
  },
];

/** The three most recent chapters, for the footer's "new on the site" strip. */
export const latestReleases = releases.slice(0, 3);
