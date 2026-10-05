import { legalTerms } from '../legalTerms';

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
        { key: 'hnx.search.recent', purpose: 'The last few pages you opened from the search, so it can offer them first next time.' },
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
      type: 'signature',
      kind: 'document',
      anchor: 'policy',
      railLabel: 'The full policy',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full policy',
      title: 'Cookies and storage policy, in full.',
      intro: 'The live list above shows what is stored right now. This is the same thing written down: what the site stores, why, for how long, and how to remove it.',
      version: 'Draft 1.0',
      summary: [
        'The site sets **no cookies** and does not use local storage.',
        'It keeps **up to three small items** in session storage, which your browser clears when the tab closes.',
        'None of them identify you, and none are sent to the site or to anyone else.',
      ],
      meta: [
        { k: 'Applies to', v: 'This website' },
        { k: 'Items', v: 'Up to 3' },
      ],
      terms: legalTerms,
      sections: [
        {
          id: 'covers',
          title: 'What this policy covers',
          plain: 'Anything the site asks your browser to keep.',
          body: [
            'This policy explains what the website of **Hanoryx Systems** asks your browser to keep, and why. It covers {{cookie}}s, {{local storage}} and {{session storage}}, and anything that works like them.',
            'It describes the site’s own code. Services your browser contacts to show the page, such as the font service, are not covered; the third-party services page lists them.',
          ],
        },
        {
          id: 'kinds',
          title: 'The kinds of storage',
          plain: 'Three kinds exist; the site uses only the lightest.',
          body: [
            { defs: [
              { k: 'Cookies', v: 'Small notes that a site asks the browser to send back with every later request. They are often used to keep you signed in or to recognise you. This site’s code sets none.' },
              { k: 'Local storage', v: 'A store that stays in the browser until it is cleared. This site does not use it.' },
              { k: 'Session storage', v: 'A store that belongs to one tab and is cleared when the tab closes. This site uses it for up to three small items.' },
            ] },
          ],
        },
        {
          id: 'what',
          title: 'What the site stores',
          plain: 'Three small items, each with a single purpose.',
          body: [
            { table: {
              caption: 'Session storage items set by the site',
              head: ['Name', 'Purpose', 'Set when', 'Lasts'],
              rows: [
                ['hnx.boot.complete', 'Remembers that the intro has played in this tab, so it is not repeated.', 'The intro finishes or is skipped', 'Until the tab closes'],
                ['hnx.audio.on', 'Remembers whether the intro music was switched on or off.', 'You press START or use the audio control', 'Until the tab closes'],
                ['hnx.search.recent', 'Remembers the last few pages you opened from the search, so it can offer them first next time.', 'You open a result from the search', 'Until the tab closes'],
              ],
            } },
            'Each item holds a short value, such as “1”, “0” or a short list of page addresses. None contains your name, your email address or anything typed into the site.',
          ],
        },
        {
          id: 'why',
          title: 'Why the site stores them',
          plain: 'So the intro and search feel continuous within a tab.',
          body: [
            'The items exist so that the site behaves sensibly while you move around it. Without the first, the intro would play again on every page you load. Without the second, the music would not know whether you had turned it on. Without the third, the search could not offer the pages you opened last.',
            'They are not used to measure, profile or recognise you, and the site’s code contains no analytics or advertising.',
          ],
        },
        {
          id: 'necessary',
          title: 'Consent and the choices you have',
          plain: 'No banner, because nothing here follows you.',
          body: [
            'Many places expect a site to ask before it stores things that are not strictly needed to deliver what you asked for. The three items here only remember what you did in a single tab and are not used to follow you, which is why the site does not show a consent banner.',
            'You do not have to accept anything to use the site. If you prefer that nothing is stored, you can block or clear session storage in your browser; the cost is described below.',
          ],
        },
        {
          id: 'third',
          title: 'Storage by other services',
          plain: 'The font request is the only other thing involved.',
          body: [
            'To show the page, your browser asks {{Google Fonts}} for three typefaces. The browser may keep those font files in its own cache so it does not need to download them again. That is ordinary browser behaviour, outside the site’s code.',
            'The site does not embed social media buttons, advertising or analytics, so no other service has a chance to set a cookie through it.',
          ],
        },
        {
          id: 'see',
          title: 'How to see what is stored',
          plain: 'The panel above reads it live; your browser can too.',
          body: [
            'The panel near the top of this page reads the real contents of your browser’s cookies, local storage and session storage as you watch, and marks the items that belong to this site.',
            'To look yourself, open your browser’s developer tools and find the **Application** (or **Storage**) tab. Cookies and storage are listed per site there.',
          ],
        },
        {
          id: 'clear',
          title: 'How to remove it',
          plain: 'One button above, or close the tab.',
          body: [
            { steps: [
              { title: 'Use the button', body: 'The panel above has a button that removes only this site’s own items and refreshes the list.' },
              { title: 'Or close the tab', body: 'Session storage is cleared by the browser when the tab closes, so the three items go with it.' },
              { title: 'Or clear site data', body: 'In your browser’s settings, find the site data for this site and remove it. This also removes anything other sites on the same browser hold, only if you choose to.' },
            ] },
          ],
        },
        {
          id: 'block',
          title: 'What happens if you block it',
          plain: 'The site still works; it just remembers less.',
          body: [
            'If your browser blocks session storage entirely, the site carries on without it. The intro may play again each time you load a page, the music will not remember its state, and the search will not offer recent pages.',
            'Nothing else changes. No page depends on storage to be readable.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          plain: 'The version on this page is the current one.',
          body: [
            'If the site ever adds a feature that stores more, or sets a cookie, this page and the live list will be updated first. The version on this page is the current one.',
            { note: 'If the live list near the top ever shows an item that this policy does not explain, that is worth reporting.', label: 'Tell us' },
          ],
        },
      ],
      note: 'A plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'purge',
      scene: 'topology-pulse',
      tag: 'End of storage',
      minHeight: 520,
      title: 'Leave nothing behind.',
      lede: 'One press removes every item this site keeps in your browser. It touches nothing that belongs to another site.',
      onward: [{ label: 'Privacy', to: '/legal/privacy' }, { label: 'Data retention', to: '/legal/retention' }],
    },
  ],
};

export default page;
