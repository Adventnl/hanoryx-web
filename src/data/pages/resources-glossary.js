import { glossary, glossaryAreas } from '../glossary';

const page = {
  key: 'resources/glossary',
  title: 'Glossary',
  accent: '#ff3333',
  aliases: ['terms', 'definitions', 'dictionary', 'what does it mean', 'jargon', 'vocabulary', 'idempotent', 'rbac', 'cron'],
  hero: {
    scene: 'glyph-field',
    intensity: 'hero',
    eyebrow: 'Resources / Glossary',
    title: 'Words, explained once.',
    intro: `${glossary.length} terms in ${glossaryAreas.length} areas, written in plain language. The same list explains the underlined words in the guides when you hover or focus them.`,
    code: 'RES.01',
    status: `${glossary.length} TERMS`,
    actions: [
      { label: 'Browse the terms', to: '/resources/glossary#terms' },
      { label: 'Resource centre', to: '/resources', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'glossaryBrowser',
      anchor: 'terms',
      railLabel: 'The terms',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The terms',
      title: 'Look a word up.',
      intro: 'Search the terms or their meanings, filter by area, jump by letter. Each term has a link of its own, and most point to where the idea is worked through.',
      note: 'Definitions are deliberately short. They say what a thing is, not everything about it.',
    },
    {
      type: 'modules',
      anchor: 'method',
      railLabel: 'How terms are written',
      scene: 'architectural-grid',
      eyebrow: 'How terms are written',
      title: 'Four rules for a definition.',
      rows: [
        { k: 'SAY WHAT IT IS', v: 'One or two sentences, without leaning on another unexplained word.' },
        { k: 'SAY WHY IT MATTERS', v: 'Where it helps, say what goes wrong without it.' },
        { k: 'KEEP IT SHORT', v: 'A definition is a reminder, not an essay. The guides carry the long version.' },
        { k: 'POINT ONWARD', v: 'Where the site works an idea through, the entry links to it.' },
      ],
    },
    {
      type: 'closer',
      kind: 'flashDeck',
      anchor: 'cards',
      scene: 'glyph-field',
      tag: 'End of the glossary',
      minHeight: 560,
      title: 'Test yourself.',
      lede: 'Ten flashcards, dealt from the glossary. Read the term, say what it means, turn the card, and mark whether you had it.',
      onward: [
        { label: 'Insights', to: '/insights' },
        { label: 'Download the glossary', to: '/resources/downloads' },
      ],
    },
  ],
};

export default page;
