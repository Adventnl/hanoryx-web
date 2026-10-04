import { workItems } from '../work';

const more = workItems
  .filter((w) => w.id !== 'internal-crm')
  .map((w) => ({ code: w.code, title: w.name, label: w.kind, body: w.tagline, glyph: w.glyph, to: w.to }));

const page = {
  key: 'work/internal-crm',
  title: 'Internal CRM',
  accent: '#ff3333',
  aliases: ['crm', 'data system', 'large data sets', 'internal system', 'supporting study'],
  hero: {
    scene: 'data-rain',
    intensity: 'hero',
    eyebrow: 'Work / 04 · Supporting study',
    title: 'Built for very large data sets.',
    intro:
      'An internal CRM and data system, designed to stay usable when the data set is very large. It is internal — not a public product.',
    code: 'WRK.04',
    status: 'SUPPORTING STUDY',
    actions: [
      { label: 'Back to the first project', to: '/work/musebase' },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
    aside: { kind: 'dotField', caption: 'A dense field — hover to focus' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'dataSlab',
      anchor: 'slab',
      railLabel: 'The slab',
      scene: 'data-stream-ribbons',
      minHeight: 760,
      eyebrow: 'Scale, felt',
      title: 'Ten million rows, one window.',
      intro:
        'Scrub, filter and jump through a synthetic data set of up to ten million rows. The interface only ever holds a handful of rows at a time.',
      caption:
        'Synthetic rows generated in your browser from their index. Not production data, and no speed or size of the real system is claimed.',
      sizes: [
        { id: 'k', label: '1,000', value: 1000 },
        { id: 'm', label: '1 million', value: 1000000 },
        { id: 't', label: '10 million', value: 10000000 },
      ],
    },
    {
      type: 'process',
      anchor: 'concerns',
      railLabel: 'Four concerns',
      scene: 'dependency-graph',
      eyebrow: 'What the design has to answer',
      title: 'Four concerns of a very large set.',
      intro: 'Design concerns, stated as questions. They are not measured results.',
      steps: [
        { step: '01', title: 'Find', body: 'How does a person reach one record among millions?' },
        { step: '02', title: 'Orient', body: 'How do they stay oriented while moving through the set?' },
        { step: '03', title: 'Act', body: 'How do they act on many records without losing the thread?' },
        { step: '04', title: 'Trust', body: 'How does the interface show what is current and what is not?' },
      ],
    },
    {
      type: 'cards',
      variant: 'grid',
      anchor: 'more',
      railLabel: 'More work',
      scene: 'hex-tunnel',
      eyebrow: 'More work',
      title: 'Keep going.',
      intro: 'The other three case studies.',
      items: more,
    },
    {
      type: 'cta',
      scene: 'data-stream-ribbons',
      eyebrow: 'Next',
      title: 'Discuss a data problem.',
      body: 'If your data outgrew its interface, the conversation starts on the contact page.',
      links: [{ label: 'See all work', to: '/work' }],
    },
  ],
};

export default page;
