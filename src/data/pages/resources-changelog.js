import { releases } from '../releases';

const notes = releases.reduce((n, r) => n + r.notes.length, 0);

const page = {
  key: 'resources/changelog',
  title: 'Release Notes',
  accent: '#ff3333',
  aliases: ['changelog', 'what is new', 'updates', 'history', 'releases', 'changes', 'fixed', 'added'],
  hero: {
    scene: 'timeline-pulse',
    intensity: 'hero',
    eyebrow: 'Resources / Release notes',
    title: 'What changed, in the order it happened.',
    intro: `${releases.length} chapters and ${notes} notes, newest first. Each says whether something was added, changed or fixed, and links to the page it concerns.`,
    code: 'RES.02',
    status: 'IN CHAPTERS',
    actions: [
      { label: 'Read the notes', to: '/resources/changelog#notes' },
      { label: 'See it as a chart', to: '/resources/changelog#chart', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'releaseNotes',
      anchor: 'notes',
      railLabel: 'The notes',
      scene: 'privacy-quiet-grid',
      minHeight: 800,
      eyebrow: 'The notes',
      title: 'Chapter by chapter.',
      intro: 'Open a chapter to read what it did. Filter by the kind of change to see only what was added, only what was changed, or only what was fixed.',
      note: 'The site is not versioned like a product, and nothing on it is derived from repository or deployment dates. Chapters are in the order they happened, and carry no dates.',
    },
    {
      type: 'split',
      anchor: 'undated',
      railLabel: 'Why no dates',
      scene: 'topographic-lines',
      eyebrow: 'Why no dates',
      code: 'REL.01',
      title: 'An order is honest. A date would be a guess.',
      body: [
        'A release note with a date is making a claim: that the change reached visitors on that day. This site cannot check that claim from within itself, so it does not make it.',
        'What it can say reliably is the order: the first build came before the intro was fixed, which came before the lighter pass. The chapters keep that order and nothing more.',
      ],
      asideLabel: 'WHAT EACH NOTE CARRIES',
      asideCode: 'REL.MAP',
      points: [
        { k: 'CHAPTER', v: 'A number, in order' },
        { k: 'KIND', v: 'Added · Changed · Fixed' },
        { k: 'TEXT', v: 'What, in a sentence' },
        { k: 'LINK', v: 'The page, where one fits' },
      ],
    },
    {
      type: 'closer',
      kind: 'historyBar',
      anchor: 'chart',
      scene: 'timeline-pulse',
      tag: 'End of the release notes',
      minHeight: 560,
      title: 'The whole history in one chart.',
      lede: 'A row for each chapter, a bar as long as the notes in it, cut into what was added, changed and fixed. Point at a row for the chapter; press it to read.',
      onward: [
        { label: 'Resource centre', to: '/resources' },
        { label: 'Site engineering', to: '/engineering' },
      ],
    },
  ],
};

export default page;
