const page = {
  key: 'trust/status',
  title: 'Live Status',
  accent: '#ff3333',
  aliases: ['status', 'uptime', 'availability', 'performance', 'speed', 'latency', 'fps', 'health'],
  hero: {
    scene: 'status-pulse-grid',
    intensity: 'hero',
    eyebrow: 'Trust / Live status',
    title: 'A status page for your visit.',
    intro:
      'Not a promise about uptime — a measurement. Everything below is read from your own browser, on your own device, while you watch: how this page is drawing, how it loaded, and how the connection looks.',
    code: 'TRUST.01',
    status: 'MEASURED LIVE',
    actions: [
      { label: 'Read the board', to: '/trust/status#board' },
      { label: 'Site engineering', to: '/engineering', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'liveStatus',
      anchor: 'board',
      railLabel: 'The board',
      scene: 'architectural-grid',
      minHeight: 760,
      eyebrow: 'The board',
      title: 'Measured on your device, right now.',
      intro: 'It starts sampling when it scrolls into view and stops when it leaves.',
      note: 'Every figure is measured by your browser on your device. It describes this visit and nothing else: not the site’s availability for anyone else, not the company’s systems. The only request the page ever makes is the optional connection test, and it goes to the site’s own host.',
    },
    {
      type: 'split',
      anchor: 'limits',
      railLabel: 'What it can’t tell you',
      scene: 'topographic-lines',
      eyebrow: 'What it can’t tell you',
      code: 'STAT.01',
      title: 'An honest status page says what it can’t see.',
      body: [
        'A company status page usually reports whether a service is up for everyone. This one cannot: the site is a set of static files, it has no servers of its own to report on, and nothing here is collected centrally.',
        'What it can do is let you check the thing you actually care about when a page feels slow — whether it is your device, your connection, or the page — and see the numbers for yourself.',
      ],
      asideLabel: 'WHAT EACH TILE MEANS',
      asideCode: 'STAT.MAP',
      points: [
        { k: 'FRAME RATE', v: 'How smoothly this page is being drawn' },
        { k: 'FIRST BYTE', v: 'How long the host took to start answering' },
        { k: 'PAGE READY', v: 'When the page could be used' },
        { k: 'CONNECTION', v: 'What your browser says about the link' },
      ],
    },
    {
      type: 'closer',
      kind: 'frameTape',
      scene: 'status-pulse-grid',
      tag: 'End of the status board',
      minHeight: 440,
      title: 'The tape keeps running.',
      lede: 'Every frame this page draws is a column below. Move, scroll, and watch what it costs.',
      onward: [{ label: 'Site engineering', to: '/engineering' }, { label: 'Trust centre', to: '/trust' }],
    },
  ],
};

export default page;
