import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/privacy',
  title: 'Privacy',
  accent: '#ff3333',
  aliases: ['data', 'personal data', 'tracking', 'analytics', 'fonts', 'google fonts'],
  hero: {
    scene: 'privacy-quiet-grid',
    intensity: 'hero',
    eyebrow: 'Legal / Privacy',
    title: 'What this site does with your data.',
    intro:
      'A plain description of what the website’s own code does: what it asks for, what it stores and which connections it makes. It describes this site, not any other service.',
    code: 'LEGAL.01',
    status: 'PLAIN LANGUAGE',
    actions: [
      { label: 'See what is stored', to: '/legal/cookies' },
      { label: 'Contact', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'dataJourney',
      anchor: 'journey',
      railLabel: 'What leaves your browser',
      scene: 'architectural-grid',
      minHeight: 640,
      eyebrow: 'What leaves your browser',
      title: 'Pick something to do.',
      intro: 'The diagram shows which connections are made when you do it, and which are not.',
      dests: [
        { id: 'site', title: 'This site', line: 'Where the page comes from', glyph: 'cube' },
        { id: 'fonts', title: 'Google Fonts', line: 'Where the typefaces come from', glyph: 'ruler' },
        { id: 'mail', title: 'Your mail app', line: 'On your own device', glyph: 'doc' },
      ],
      actions: [
        {
          id: 'open',
          label: 'Open any page',
          summary: 'Your browser asks this site for the page and its files, and asks Google Fonts for the typefaces.',
          reach: ['site', 'fonts'],
          sends: [
            { to: 'site', what: 'Page files: markup, scripts, styles and images.' },
            { to: 'fonts', what: 'Font files for the three typefaces.' },
          ],
          stays: ['Whether the intro has played, so it is not repeated in this tab.'],
        },
        {
          id: 'search',
          label: 'Search the site',
          summary: 'Search runs in your browser against page text that is already loaded. Nothing you type is sent anywhere.',
          reach: [],
          sends: [],
          stays: ['The last few pages you opened from the search, so it can offer them first next time.'],
        },
        {
          id: 'music',
          label: 'Press START (music)',
          summary: 'The intro track is a file served by this site. Whether the music is on is remembered for the tab.',
          reach: ['site'],
          sends: [{ to: 'site', what: 'The music file.' }],
          stays: ['Whether the music is on or off.'],
        },
        {
          id: 'write',
          label: 'Write on the contact page',
          summary: 'What you type lives only in the page while you type it. There is no server behind the form.',
          reach: [],
          sends: [],
          stays: ['What you type, in the page’s memory only. It is gone when you leave.'],
        },
        {
          id: 'mail',
          label: 'Open it in your mail app',
          summary: 'The page hands your subject and message to your own mail app through a mail link. Your mail app sends it, not this site.',
          reach: ['mail'],
          sends: [{ to: 'mail', what: 'Your subject and message, passed to the app on your device.' }],
          stays: [],
        },
      ],
      note: 'Accurate to the site’s code at the time of writing. Your browser, your network and the service that delivers the site’s files have practices of their own, which this page does not speak for.',
    },
    {
      type: 'split',
      anchor: 'short',
      railLabel: 'In short',
      scene: 'topographic-lines',
      eyebrow: 'In short',
      code: 'PRIV.01',
      title: 'Little is asked, and little is kept.',
      body: [
        'This is a company website. Most of it is static content you can read without giving anything. There are no accounts, and the site’s own code contains no analytics, advertising or tracking scripts.',
        'The only way a message reaches the company is if you choose to send one from your own mail app, using the address on the contact page.',
      ],
      asideLabel: 'AT A GLANCE',
      asideCode: 'PRIV.MAP',
      points: [
        { k: 'ACCOUNTS', v: 'None' },
        { k: 'COOKIES', v: 'None set by the site’s code' },
        { k: 'ANALYTICS', v: 'None in the site’s code' },
        { k: 'FORMS', v: 'Nothing is submitted to a server' },
      ],
    },
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'details',
      railLabel: 'The details',
      scene: 'privacy-quiet-grid',
      eyebrow: 'The details',
      title: 'Four things worth knowing.',
      items: [
        {
          code: 'PD.01',
          title: 'Fonts',
          body: 'The typefaces are requested from Google Fonts, so your browser contacts Google’s font servers when a page first loads. That request carries the usual details of any web request, such as your IP address. Google describes its own handling in its own policy.',
          glyph: 'ruler',
        },
        {
          code: 'PD.02',
          title: 'Storage in your tab',
          body: 'Up to three small items live in session storage: whether the intro has played, whether music is on, and your recent searches. They disappear when the tab closes. The cookies and storage page lists the real ones.',
          glyph: 'database',
          to: '/legal/cookies',
        },
        {
          code: 'PD.03',
          title: 'Contact',
          body: 'The contact page prepares a mail link. If you choose to send it, your mail app sends the message to the address shown there, and the company receives what you wrote.',
          glyph: 'doc',
          to: '/contact',
        },
        {
          code: 'PD.04',
          title: 'Delivery of the site',
          body: 'Like any website, its files are delivered by a service that can keep ordinary request logs. This site’s code does not read or use them.',
          glyph: 'cube',
        },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'notice',
      railLabel: 'The full notice',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full notice',
      title: 'Privacy notice, in full.',
      intro: 'Everything above, written out as a document you can search, link to section by section, and print.',
      version: 'Draft 1.0',
      summary: [
        'The site is a set of ready-made files. It has **no accounts, no cookies of its own, no analytics and no advertising**.',
        'Your browser keeps up to **three small items** for the length of the tab, and contacts the font service and the site’s host to show the page.',
        'Nothing you type on the site is sent anywhere by the site. If you write to the company, you do it from **your own email app**.',
      ],
      meta: [
        { k: 'Applies to', v: 'This website' },
        { k: 'Status', v: 'Plain-language draft' },
      ],
      terms: legalTerms,
      sections: [
        {
          id: 'about',
          title: 'About this notice',
          plain: 'Who this is about and what it covers.',
          body: [
            'This notice explains what the website of **Hanoryx Systems** does with information about the people who visit it. In this notice, “the company” means Hanoryx Systems, “the site” means this website, and “you” means a visitor to it.',
            'It describes the site’s own code. It does not describe other services your browser talks to, your own device, your network or your email provider, each of which has practices of its own.',
            { note: 'This is a plain-language description written for this site. It is not legal advice, and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'short',
          title: 'The short version',
          plain: 'Little is asked, and little is kept.',
          body: [
            'The site is a {{static site}}: ready-made files that your browser turns into pages. There is no database behind it and no way to create an account or sign in.',
            'The site’s code contains **no analytics, advertising or tracking scripts**, sets **no {{cookie}}** and does not use {{local storage}}. It keeps up to three small items in {{session storage}} so that the intro and the search feel continuous within a tab.',
            { list: ['No accounts, passwords or profiles.', 'No forms that send what you type to a server.', 'No advertising, and no sharing of visitor information with advertisers.', 'No tracking of you from one site to another.'] },
          ],
        },
        {
          id: 'collect',
          title: 'What the site collects',
          plain: 'Nothing, as far as its own code is concerned.',
          body: [
            'The site’s code does not collect {{personal data}}. It does not read your name, your location, your contacts or your files, and it does not ask for any of them.',
            'Some features need to remember a little about what you did, so that they can carry on sensibly. Those details stay in your browser and are listed in full below.',
            { defs: [
              { k: 'Typed text', v: 'What you type in the search box or on the contact page lives in the page’s memory while you type. It is not sent anywhere and is gone when you leave or reload.' },
              { k: 'Pointer and keys', v: 'The site reacts to your pointer and keyboard while you use it, for example to light a card or move a cursor. These movements are not recorded or sent.' },
              { k: 'Device settings', v: 'The site reads a few display settings, such as reduced motion and screen width, to decide how to show itself. They are not stored or sent.' },
            ] },
          ],
        },
        {
          id: 'browser',
          title: 'What your browser keeps',
          plain: 'Up to three small items, until you close the tab.',
          body: [
            'The site stores up to three items in {{session storage}}. A tab’s session storage belongs to that tab and is cleared by the browser when the tab closes.',
            { table: {
              caption: 'Items the site may keep in your tab',
              head: ['Name', 'What it remembers', 'Lasts'],
              rows: [
                ['hnx.boot.complete', 'That the intro has played in this tab, so it is not shown again.', 'Until the tab closes'],
                ['hnx.audio.on', 'Whether the intro music was switched on or off.', 'Until the tab closes'],
                ['hnx.search.recent', 'The last few pages you opened from the search, so it can offer them first next time.', 'Until the tab closes'],
              ],
            } },
            'The **Cookies and storage** page reads these items live from your own browser, so you can check this table against the real thing, and clear them.',
          ],
        },
        {
          id: 'connections',
          title: 'Connections your browser makes',
          plain: 'The site’s host, the font service, and nothing else unless you click out.',
          body: [
            'To show a page, your browser contacts a small number of services. Each of them receives the usual details of a web request, including your {{IP address}}.',
            { table: {
              caption: 'Services contacted to show the site',
              head: ['Service', 'Why', 'When'],
              rows: [
                ['The site’s host', 'Delivers the page, its scripts, styles, images and the intro music.', 'Every visit'],
                ['{{Google Fonts}}', 'Delivers the three typefaces the site is set in.', 'When a page first loads'],
                ['GitHub', 'Only if you follow the YK Engine link on its own page, which leaves the site.', 'Only if you click'],
                ['Your email app', 'Only if you choose to send a message from the contact page. The site hands your text to the app on your device.', 'Only if you choose'],
              ],
            } },
            'The Trust centre lists these services on the **third-party services** page, and the diagram near the top of this page shows which of them an action reaches.',
          ],
        },
        {
          id: 'contact',
          title: 'When you write to the company',
          plain: 'You send it from your own email app, not from the site.',
          body: [
            'The contact page helps you write a message and prepares a {{mail link}}. Nothing is sent from the page itself. If you choose to send the message, your email app sends it from your account to the address shown on the contact page.',
            'The company then receives what you wrote, plus the details that come with any email, such as your address and the time. That is an ordinary email conversation. This notice describes the website; it does not set rules for how a mailbox is run.',
            'If you would like a message you sent to be deleted, say so on the contact page and the company will look at the request.',
          ],
        },
        {
          id: 'logs',
          title: 'Logs kept by services you reach',
          plain: 'Hosts and font services can keep ordinary logs; the site’s code does not read them.',
          body: [
            'Like any website, the site’s files are delivered by a {{hosting}} service, and its typefaces by a font service. Such services commonly keep {{request log}}s and may offer their operators summary figures.',
            'The site’s own code does not read, collect or use those logs. What those services keep, and for how long, is set by them, and this notice cannot speak for them.',
          ],
        },
        {
          id: 'cookies',
          title: 'Cookies and similar technologies',
          plain: 'None set by the site’s code.',
          body: [
            'The site’s code sets no {{cookie}}s and does not use {{local storage}}. It uses {{session storage}} in the way described above. Because those items only remember what you did in the tab and are not used to follow you, they are the kind of small convenience that does not normally need a consent banner; the site therefore does not show one.',
            'The full details, including how to see and clear what is stored, are in the Cookies and storage policy.',
          ],
        },
        {
          id: 'children',
          title: 'Children',
          plain: 'The site is not aimed at children and collects nothing from them.',
          body: [
            'The site is a company website intended for people who are interested in the company’s work. It is not directed at children, and because it collects no personal data it does not knowingly collect any from them.',
          ],
        },
        {
          id: 'transfers',
          title: 'Where the information travels',
          plain: 'Web requests cross borders; the site stores nothing to move.',
          body: [
            'A website is reachable from anywhere, and the services that deliver it are spread across many places. Your request for a page may therefore be answered from a location far from you, and a font request may reach servers in other countries.',
            'The site itself holds no visitor information, so there is none for the company to move between countries. What the delivery services do is up to them.',
          ],
        },
        {
          id: 'rights',
          title: 'Your choices and rights',
          plain: 'You are in control of your browser; ask about anything the company holds.',
          body: [
            { list: [
              'You can clear the three small items at any time from the Cookies and storage page, or by closing the tab.',
              'You can use your browser’s settings or an extension to stop the font request; the site then shows in your system’s own typefaces.',
              'You can ask the company what, if anything, it holds that you sent, and ask for it to be deleted.',
              'Where the law of your country gives you further rights over information about you, this notice does not limit them.',
            ] },
          ],
        },
        {
          id: 'security',
          title: 'Keeping things safe',
          plain: 'Less held means less to lose.',
          body: [
            'The site is meant to be delivered over an encrypted connection (HTTPS). Because it holds no accounts or visitor records, there is no stored visitor information for anyone to take from it.',
            'If you find something that looks like a security problem, please read the security disclosure page rather than posting it publicly.',
            { note: 'No website can promise absolute security, and this notice does not.', label: 'Plainly' },
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this notice',
          plain: 'The version on this page is the current one.',
          body: [
            'This notice may change as the site changes, for example if analytics, a form service or another provider is ever added. If that happens, this page will be updated before the change goes live. The version on this page is the current one.',
          ],
        },
        {
          id: 'questions',
          title: 'Questions',
          plain: 'Ask through the contact page and say which part you mean.',
          body: [
            'If anything here is unclear, or you think it is wrong, use the contact page and say which part you mean. If you think the site is doing something this notice does not describe, that is worth reporting.',
          ],
        },
      ],
      note: 'A plain-language description written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'receipt',
      scene: 'privacy-quiet-grid',
      tag: 'End of privacy',
      minHeight: 560,
      title: 'Your receipt.',
      lede: 'Everything the site is holding for you right now, itemised from your own browser. Nothing on it was sent anywhere.',
      onward: [{ label: 'Cookies & storage', to: '/legal/cookies' }, { label: 'Third-party services', to: '/trust/third-parties' }],
    },
  ],
};

export default page;
