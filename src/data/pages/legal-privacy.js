const page = {
  key: 'legal/privacy',
  title: 'Privacy',
  accent: '#ff3333',
  hero: {
    scene: 'architectural-grid',
    intensity: 'hero',
    eyebrow: 'Legal // DOC.PRIV',
    title: 'A restrained position on data: collect little, hold it carefully, and explain the rest plainly.',
    intro: 'This page describes how the Hanoryx Systems website handles information when you visit or contact us. It is written to be read, not to be hidden behind.',
    code: 'DOC.PRIV',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Contact', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      eyebrow: 'Overview',
      code: 'PRIV.01',
      title: 'What a visit to this site actually involves.',
      body: [
        'This is a company site. Most of it is static content that you can read without giving us anything. We do not ask you to create an account, and we do not run advertising, profiling, or third-party tracking pixels to follow you across the web.',
        'The only information we hold is what you choose to send us. If you write to us — by email or through a contact form — we receive your message, your address, and whatever you put in it, and we keep it only for as long as it takes to handle the matter you raised.',
        'When this page is updated, the change applies from the moment it is published. If our practices change in a way that affects you, the wording here is where it will be reflected first.',
      ],
      asideLabel: 'AT A GLANCE',
      asideCode: 'PRIV.MAP',
      points: [
        { k: 'ACCOUNTS', v: 'None required to browse' },
        { k: 'ADVERTISING', v: 'No ad or tracking pixels' },
        { k: 'WE HOLD', v: 'Only what you send us' },
        { k: 'RETENTION', v: 'Kept while relevant, then removed' },
      ],
    },
    {
      type: 'modules',
      eyebrow: 'Principles',
      title: 'How we handle what we hold.',
      intro: 'A short, honest set of rules that govern any information passing through this site.',
      rows: [
        { k: 'DH.01', v: 'Minimise — we ask for the least information needed to answer you' },
        { k: 'DH.02', v: 'Purpose — data sent to us is used only to handle your request, not repurposed' },
        { k: 'DH.03', v: 'Contain — correspondence stays with us and is not sold or shared for marketing' },
        { k: 'DH.04', v: 'Retain briefly — we delete messages once the matter they relate to is closed' },
        { k: 'DH.05', v: 'Access — you may ask what we hold about you and request that we remove it' },
        { k: 'DH.06', v: 'Secure — information is kept under reasonable technical and access controls' },
      ],
    },
    {
      type: 'cards',
      scene: 'redaction-matrix',
      eyebrow: 'Detail',
      title: 'The specifics, without the legalese.',
      intro: 'Four points cover almost every question a visitor sends about this page.',
      items: [
        { code: 'PD.01', title: 'Contact data', body: 'When you email us or submit a form, we store your address and message so a person can read and reply to it. That is the whole purpose, and it is the whole use.', tags: ['Email', 'Forms'] },
        { code: 'PD.02', title: 'Technical logs', body: 'Standard server logs may record the basics of a request — an address, a timestamp, a page. These are operational, kept short-term, and not used to build a profile of you.', tags: ['Logs', 'Short-term'] },
        { code: 'PD.03', title: 'Third parties', body: 'We do not sell or trade your information. Any provider that touches it — for example a mail host — handles it only to deliver the service we use them for.', tags: ['No sale', 'Scoped'] },
        { code: 'PD.04', title: 'Your control', body: 'You can ask us what we hold, ask us to correct it, or ask us to delete it. Write to the contact address and we will act on the request.', tags: ['Access', 'Deletion'] },
      ],
    },
    { type: 'cta', scene: 'architectural-grid', eyebrow: 'Reach us', title: 'Questions on privacy?', body: 'If anything here is unclear, or you want to know what we hold about you, send a message and a person will answer.' },
  ],
};

export default page;
