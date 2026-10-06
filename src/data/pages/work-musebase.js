import { workItems } from '../work';

const more = workItems
  .filter((w) => w.id !== 'musebase')
  .map((w) => ({ code: w.code, title: w.name, label: w.kind, body: w.tagline, glyph: w.glyph, to: w.to }));

const page = {
  key: 'work/musebase',
  title: 'Musebase',
  accent: '#ff3333',
  aliases: ['coordination application', 'scheduling', 'roles', 'primary project'],
  hero: {
    scene: 'musebase-coordination',
    intensity: 'hero',
    eyebrow: 'Work / 01 · Primary project',
    title: 'Coordination, held in one place.',
    intro:
      'Musebase is an advanced coordination application. It brings scheduling, communication and records into one environment, with access scoped to each role.',
    code: 'WRK.01',
    status: 'CASE STUDY',
    actions: [
      { label: 'Next: YK Engine', to: '/work/yk-engine' },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
    aside: { kind: 'logoPlate', caption: 'Musebase' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'coordinationLab',
      anchor: 'try',
      railLabel: 'Try the idea',
      scene: 'privacy-quiet-grid',
      minHeight: 700,
      eyebrow: 'Try the idea',
      title: 'Place, compare, scope.',
      intro:
        'Three small experiments with the idea behind Musebase: many things sharing time, and each person seeing what concerns them.',
      roles: [
        { id: 'wide', label: 'Wide view', sees: ['a', 'b', 'c'], note: 'Every kind of block — the full picture.' },
        { id: 'focused', label: 'Focused view', sees: ['a', 'b'], note: 'Two kinds — enough to do the work.' },
        { id: 'narrow', label: 'Narrow view', sees: ['b'], note: 'One kind — only what concerns them.' },
      ],
      notes: [
        { k: 'PLACE', v: 'Blocks share lanes and time. Overlaps show up the moment they happen.' },
        { k: 'COMPARE', v: 'The same blocks, scattered or coordinated — that difference is the point.' },
        { k: 'SCOPE', v: 'A role lens filters one shared picture down to what a person needs.' },
      ],
    },
    {
      type: 'split',
      anchor: 'idea',
      railLabel: 'The idea',
      scene: 'permission-orbit',
      eyebrow: 'The idea',
      code: 'MB.IDEA',
      title: 'Many roles, one shared picture.',
      body: [
        'Coordination breaks down when people work from different pictures. Musebase is built to give everyone the same picture, in the shape that fits their role.',
        'It is described here in general terms. What it coordinates, and for whom, stays out of public view.',
      ],
      asideLabel: 'AT A GLANCE',
      asideCode: 'MB.MAP',
      points: [
        { k: 'KIND', v: 'Coordination application' },
        { k: 'SHAPE', v: 'One shared environment' },
        { k: 'ACCESS', v: 'Scoped to each role' },
        { k: 'DETAIL', v: 'Withheld by design' },
      ],
    },
    {
      type: 'modules',
      anchor: 'brings',
      railLabel: 'What it brings together',
      scene: 'data-interface-wave',
      eyebrow: 'What it brings together',
      title: 'Four threads, one environment.',
      intro: 'From the published description of Musebase.',
      rows: [
        { k: 'SCHEDULING', v: 'Time and availability, resolved across people.' },
        { k: 'COMMUNICATION', v: 'Messages that live next to the thing they are about.' },
        { k: 'RECORDS', v: 'What happened and what is planned, in one place.' },
        { k: 'ACCESS', v: 'Each role sees the part that concerns it.' },
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
      type: 'closer',
      kind: 'channelCount',
      anchor: 'channels',
      scene: 'musebase-coordination',
      tag: 'End of Musebase',
      minHeight: 640,
      title: 'Why one shared picture.',
      lede: 'Everyone telling everyone needs a channel for every pair of people, and that count grows with the square of the headcount. One shared picture needs one per person. The arithmetic, drawn.',
      onward: [
        { label: 'Operational management', to: '/systems/operational-management' },
        { label: 'All work', to: '/work' },
      ],
    },
  ],
};

export default page;
