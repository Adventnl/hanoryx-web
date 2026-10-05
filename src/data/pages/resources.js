import { glossary } from '../glossary';
import { releases } from '../releases';
import { downloads, tools } from '../resources';

const page = {
  key: 'resources',
  title: 'Resource Centre',
  accent: '#ff3333',
  aliases: ['resources', 'library', 'help', 'reference', 'tools', 'downloads', 'templates', 'learn', 'documentation'],
  hero: {
    scene: 'data-stream-ribbons',
    intensity: 'hero',
    eyebrow: 'Resources',
    title: 'A place to look things up, and to use.',
    intro:
      'Four shelves: a glossary of plain-language terms, the release notes, documents you can download, and five small tools that run in your browser. None of them asks for an account, and none of them sends anything anywhere.',
    code: 'RES.00',
    status: 'FOUR SHELVES',
    actions: [
      { label: 'See the shelves', to: '/resources#shelves' },
      { label: 'Insights', to: '/insights', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'resourceDesk',
      anchor: 'shelves',
      railLabel: 'The shelves',
      scene: 'privacy-quiet-grid',
      minHeight: 700,
      eyebrow: 'The shelves',
      title: 'Pick a shelf.',
      intro: 'The counts are read from the data behind each shelf, so they cannot drift from what is actually there.',
      note: 'Everything here is general material written for this site. It is not advice for your situation.',
    },
    {
      type: 'stats',
      anchor: 'figures',
      railLabel: 'On the shelves',
      eyebrow: 'On the shelves',
      title: 'What is here, counted.',
      items: [
        { value: glossary.length, label: 'Glossary terms', note: 'Plain language, with links to where each idea is worked through' },
        { value: downloads.length, label: 'Documents', note: 'Built in your browser when you press the button' },
        { value: tools.length, label: 'Tools', note: 'Contrast, type scale, cron, readiness, decisions' },
        { value: releases.length, label: 'Chapters of history', note: 'The release notes, in the order things happened' },
      ],
    },
    {
      type: 'modules',
      anchor: 'rules',
      railLabel: 'How the shelves work',
      scene: 'architectural-grid',
      eyebrow: 'How the shelves work',
      title: 'Four promises.',
      rows: [
        { k: 'NO ACCOUNT', v: 'Nothing here needs you to sign in, give an email address or say who you are.' },
        { k: 'NOTHING SENT', v: 'The tools run in the page. What you type stays in the page, and is gone when you leave.' },
        { k: 'WORKINGS SHOWN', v: 'Each tool says how it reached its answer, so you can check it rather than trust it.' },
        { k: 'GENERAL, NOT ADVICE', v: 'The material describes common practice. It is not a substitute for advice about your own situation.' },
      ],
    },
    {
      type: 'closer',
      kind: 'readingList',
      anchor: 'list',
      scene: 'data-stream-ribbons',
      tag: 'End of the resource centre',
      minHeight: 700,
      title: 'Make a reading list.',
      lede: 'Tick pages from anywhere on the site, or start from a preset. The list comes out as Markdown, with the links and an estimate of the time, ready to send to someone.',
      presets: [
        { label: 'A new teammate', keys: ['company/how-we-work', 'company/principles', 'insights/handover', 'insights/runbooks', 'north/handbook', 'resources/glossary'] },
        { label: 'Someone deciding', keys: ['work', 'company/security', 'trust', 'company/faq', 'insights/handover', 'legal/privacy'] },
        { label: 'A developer', keys: ['north/stack', 'north/quality', 'insights/idempotency', 'insights/api-contracts', 'insights/triggers', 'resources/tools'] },
      ],
      onward: [
        { label: 'Glossary', to: '/resources/glossary' },
        { label: 'Tools', to: '/resources/tools' },
      ],
    },
  ],
};

export default page;
