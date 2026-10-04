import { workItems } from '../work';

const more = workItems
  .filter((w) => w.id !== 'customer-product')
  .map((w) => ({ code: w.code, title: w.name, label: w.kind, body: w.tagline, glyph: w.glyph, to: w.to }));

const page = {
  key: 'work/customer-product',
  title: 'Customer Product',
  searchTitle: 'Customer-facing product',
  accent: '#ff3333',
  aliases: ['shopping', 'transactions', 'checkout', 'basket', 'purchase', 'supporting study'],
  hero: {
    scene: 'commerce-pipeline',
    intensity: 'hero',
    eyebrow: 'Work / 03 · Supporting study',
    title: 'From first look to a confirmed purchase.',
    intro:
      'A customer-facing product built around the shopping and transaction experience. It is unnamed by design.',
    code: 'WRK.03',
    status: 'SUPPORTING STUDY',
    actions: [
      { label: 'Next: Internal CRM', to: '/work/internal-crm' },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
    aside: { kind: 'basketAside', caption: 'Abstract tiles — tap to add' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'experienceStoryboard',
      anchor: 'journey',
      railLabel: 'The journey',
      scene: 'transaction-wave',
      minHeight: 700,
      eyebrow: 'The journey',
      title: 'Five frames, one path.',
      intro:
        'A storyboard of the experience, from first look to confirmation. Each frame describes an intent; each has one small thing to try.',
      caption:
        'Abstract wireframes — shapes, not screenshots. Not the product, and no real catalogue, prices or payment details.',
      stages: [
        { id: 'discover', label: 'Discover', glyph: 'lens', title: 'Find your way in', body: 'The first look sets the tone: what is here, and how to start looking.' },
        { id: 'choose', label: 'Choose', glyph: 'cube', title: 'Make a choice easy', body: 'Options are comparable at a glance, and a choice is one clear tap.' },
        { id: 'basket', label: 'Basket', glyph: 'cart', title: 'Keep it in view', body: 'What has been picked stays visible and easy to change.' },
        { id: 'pay', label: 'Pay', glyph: 'key', title: 'Make the commitment calm', body: 'The step where it counts is quiet and orderly: clear progress, no surprises.' },
        { id: 'confirm', label: 'Confirm', glyph: 'shield', title: 'Close the loop', body: 'A clear confirmation that it worked, and what happens next.' },
      ],
    },
    {
      type: 'cards',
      anchor: 'questions',
      railLabel: 'Three questions',
      scene: 'status-pulse-grid',
      eyebrow: 'What it is shaped around',
      title: 'Three questions at every step.',
      intro: 'A shopping and transaction experience works when a person never has to wonder.',
      items: [
        { code: 'Q.01', title: 'Where am I?', body: 'Orientation: the person always knows where they are in the journey.', glyph: 'compass' },
        { code: 'Q.02', title: 'What happens next?', body: 'Momentum: the next step is obvious, and so is the way back.', glyph: 'flow' },
        { code: 'Q.03', title: 'Did it work?', body: 'Confirmation: every action says plainly what it did.', glyph: 'shield' },
      ],
    },
    {
      type: 'modules',
      anchor: 'limits',
      railLabel: 'What is withheld',
      scene: 'privacy-quiet-grid',
      eyebrow: 'What this page does not show',
      title: 'Described, not displayed.',
      intro: 'A supporting study is told at the level of the idea.',
      rows: [
        { k: 'NAME', v: 'Withheld by design.' },
        { k: 'SCREENSHOTS', v: 'Not shown. The storyboard above is abstract.' },
        { k: 'FIGURES', v: 'None claimed.' },
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
      title: 'Discuss an experience.',
      body: 'If you are shaping something customers will use, the conversation starts on the contact page.',
      links: [{ label: 'See all work', to: '/work' }],
    },
  ],
};

export default page;
