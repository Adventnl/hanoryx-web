const page = {
  key: 'legal/cookies',
  title: 'Cookies & Storage',
  accent: '#ff3333',
  aliases: ['cookies', 'storage', 'session storage', 'local storage', 'consent'],
  hero: {
    scene: 'privacy-quiet-grid',
    intensity: 'hero',
    eyebrow: 'Legal / Cookies & storage',
    title: 'What is stored in your browser.',
    intro:
      'Not a description — a live reading. The panel below lists what your browser is holding for this site right now.',
    code: 'LEGAL.03',
    status: 'LIVE READING',
    actions: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Contact', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'storageInspector',
      anchor: 'inspector',
      railLabel: 'The live list',
      scene: 'architectural-grid',
      minHeight: 560,
      eyebrow: 'The live list',
      title: 'Look in your own browser.',
      intro: 'Cookies, local storage and session storage, read as you watch. Press START on the intro or run a search elsewhere, come back, and look again.',
      known: [
        { key: 'hnx.boot.complete', purpose: 'Remembers that the intro has played in this tab, so it is not repeated.' },
        { key: 'hnx.audio.on', purpose: 'Remembers whether the music was switched on.' },
        { key: 'hnx.search.recent', purpose: 'Your last few searches, so the search can offer them again.' },
      ],
      note: 'Session storage is cleared by the browser when the tab closes. Nothing listed here is sent to the site or to anyone else.',
    },
    {
      type: 'split',
      anchor: 'meaning',
      railLabel: 'What counts',
      scene: 'topographic-lines',
      eyebrow: 'What counts',
      code: 'COOK.01',
      title: 'Three kinds of storage, one honest answer.',
      body: [
        'Cookies are small notes a site asks the browser to send back with every request. This site’s own code sets none.',
        'Local storage keeps data until it is cleared. This site does not use it. Session storage lasts only as long as the tab, and holds up to three small items that make the intro and the search feel continuous.',
      ],
      asideLabel: 'THE ANSWER',
      asideCode: 'COOK.MAP',
      points: [
        { k: 'COOKIES', v: 'None set by the site’s code' },
        { k: 'LOCAL', v: 'Not used' },
        { k: 'SESSION', v: 'Up to three small items' },
        { k: 'LIFETIME', v: 'Until the tab closes' },
      ],
    },
    {
      type: 'cta',
      scene: 'topology-pulse',
      eyebrow: 'Questions',
      title: 'Something here look wrong?',
      body: 'If the list shows an item this page does not explain, say so through the contact page.',
      links: [{ label: 'Privacy', to: '/legal/privacy' }],
    },
  ],
};

export default page;
