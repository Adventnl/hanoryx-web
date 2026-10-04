import { timelineIntro, timelinePhases } from '../timeline';

const page = {
  key: 'company/timeline',
  title: 'Timeline',
  accent: '#ff3333',
  aliases: ['chronology', 'history', 'phases', 'milestones', 'story'],
  hero: {
    scene: 'timeline-pulse',
    intensity: 'hero',
    eyebrow: 'Company / Timeline',
    title: 'The company, in order.',
    intro: timelineIntro.body,
    code: 'CMP.03',
    status: 'PHASES',
    actions: [
      { label: 'Selected work', to: '/work' },
      { label: 'Company', to: '/company', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'chronologyScrubber',
      anchor: 'phases',
      railLabel: 'Phases',
      scene: 'architectural-grid',
      minHeight: 820,
      eyebrow: 'Move through it',
      title: 'Six phases of work.',
      intro:
        'Drag the playhead, press the arrow keys on it, pick a row, or play the whole sequence through.',
      phases: timelinePhases,
      note: 'The spacing shows order, not time. No dates are published, so none are implied.',
    },
    {
      type: 'split',
      anchor: 'reading',
      railLabel: 'How to read it',
      scene: 'privacy-quiet-grid',
      eyebrow: 'How to read it',
      code: 'CMP.READ',
      title: 'A story of stages, not a release log.',
      body: [
        'Exact dates are not published, so this page describes each stage of the work in the order it is told. It is a map of how the company has grown.',
        'Nothing here is taken from repository, commit or deployment dates. When a date is approved for publication it will be added to its phase.',
      ],
      asideLabel: 'READING GUIDE',
      asideCode: 'TL.KEY',
      points: [
        { k: 'ORDER', v: 'Phases follow the sequence they are told in' },
        { k: 'DATES', v: 'Not published' },
        { k: 'SOURCE', v: 'The company’s own description' },
        { k: 'LATEST', v: 'Live' },
      ],
    },
    {
      type: 'cta',
      scene: 'timeline-pulse',
      eyebrow: 'Next',
      title: 'Read the work behind each phase.',
      body: 'Four case studies, told in general terms.',
      links: [{ label: 'Selected work', to: '/work' }],
    },
  ],
};

export default page;
