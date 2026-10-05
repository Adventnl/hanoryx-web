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
          id: 'words',
          title: 'Words used in this policy',
          plain: 'A short dictionary for a subject full of jargon.',
          body: [
            'Browsers have a vocabulary of their own, and some of it is used loosely. These are the meanings this policy uses. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Tab', v: 'One open page in your browser. A tab’s session storage belongs to that tab alone.' },
              { k: 'Item', v: 'One piece of stored information. Each has a name and a short value, for example the name `hnx.audio.on` and the value `1`.' },
              { k: 'Origin', v: 'A website’s address as your browser sees it: the protocol, the name and the port. Storage is kept separately for each origin, which is why one site cannot read what another has stored.' },
              { k: 'Site data', v: 'Everything a browser keeps for a website: its cookies, its storage and its copies of files. Browsers let you view and remove it site by site.' },
              { k: 'Cache', v: 'Copies of files your browser keeps so it does not have to fetch them again. It belongs to the browser, not to the site, and it is a different thing from storage.' },
              { k: 'Identifier', v: 'A code a site stores to recognise the same browser later. This site stores none.' },
              { k: 'Tracking', v: 'Following what a person does across visits or across sites, usually by means of identifiers. The site’s code does none of it.' },
              { k: 'Consent banner', v: 'The pop-up many sites show to ask permission before storing things. This site shows none, and the policy says why.' },
              { k: 'Developer tools', v: 'The panel built into most browsers for looking inside a page. It lists a site’s cookies and storage.' },
              { k: 'Private window', v: 'A browser window that discards its history, cookies and storage when it is closed.' },
            ] },
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
          id: 'how',
          title: 'How session storage works',
          plain: 'A little more detail than the table needs.',
          body: [
            'It helps to know what session storage is and what it is not. The points below are properties of browsers in general, not special arrangements made for this site.',
            { list: [
              '**It belongs to one tab.** The same page open in two tabs has two separate stores, and neither can see the other’s.',
              '**It lasts as long as the tab.** Reloading a page keeps the items. Closing the tab removes them. A new tab usually starts empty, which is why the intro can appear again there.',
              '**It is never sent anywhere.** Unlike a cookie, session storage is not attached to the requests your browser makes. It stays in the browser, and this site’s scripts read it only to decide what to show.',
              '**It is separate for each site.** Storage is kept per origin, so another website cannot read what this one keeps, and this one cannot read theirs.',
              '**It is small.** Browsers allow a few megabytes. The three items here are a few characters each, apart from a short list of page addresses.',
            ] },
            'Some browsers restore a recently closed tab together with its session storage, so an item can come back if you reopen the tab straight away. That is the browser being helpful, and it ends when the browser discards the closed tab.',
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
          id: 'lifecycle',
          title: 'A visit, step by step',
          plain: 'When each item is written, and when it goes.',
          body: [
            'Here is what happens in your browser during an ordinary visit. Nothing is written unless one of the steps below happens.',
            { steps: [
              { title: 'You open the site in a tab', body: 'The tab’s session storage is empty. Nothing has been stored.' },
              { title: 'The intro plays, or you skip it', body: 'When it finishes, or when you skip it, the site writes `hnx.boot.complete` with the value 1, so it does not play again in this tab.' },
              { title: 'You press START, or use the audio control', body: 'The site writes `hnx.audio.on`: 1 if the music is on, 0 if you turned it off.' },
              { title: 'You open a result from the search', body: 'The site writes `hnx.search.recent`, a short list of the pages you opened from the search. What you typed is not part of it.' },
              { title: 'You move around', body: 'Each page reads these items to decide what to show. Nothing new is added unless you do one of the things above.' },
              { title: 'You close the tab', body: 'The browser clears the tab’s session storage, and the items go with it.' },
            ] },
            { note: 'If you never skip the intro, never press START and never open a search result, nothing is stored at all.', label: 'Plainly' },
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
          id: 'compare',
          title: 'What is, and is not, in your browser',
          plain: 'A comparison with sites that do track.',
          body: [
            'The clearest way to see what a policy means is to put it beside what it rules out. The first column lists things sites commonly store. The last says whether this site does.',
            { table: {
              caption: 'Common kinds of stored information, and whether this site keeps them',
              head: ['Kind of information', 'Common purpose', 'This site'],
              rows: [
                ['A code that identifies your browser', 'Recognising you on a later visit', 'Not kept'],
                ['A code that follows you from site to site', 'Advertising and measurement', 'Not kept'],
                ['A sign-in token', 'Keeping you signed in to an account', 'Not kept. The site has no accounts.'],
                ['A shopping basket', 'Holding items between pages', 'Not kept. Nothing is sold here.'],
                ['Preferences such as language or theme', 'Remembering a choice for next time', 'Not kept. There are no saved preferences.'],
                ['Whether you accepted a banner', 'Remembering a consent choice', 'Not kept. There is no banner.'],
                ['Whether the intro has played in this tab', 'Not repeating an opening sequence', 'Kept in your tab until it closes'],
                ['Whether the intro music is on', 'Carrying a choice from page to page', 'Kept in your tab until it closes'],
                ['Pages you opened from the search', 'Offering them first next time', 'Kept in your tab until it closes'],
              ],
            } },
            'The first six rows are the ones people worry about, and the site keeps none of them. The last three are the whole of what it keeps.',
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
          id: 'others',
          title: 'Other places a browser keeps things',
          plain: 'The cache, history and the rest belong to the browser.',
          body: [
            'Cookies and storage are not the only things a browser remembers about a visit. The others are not set by the site’s code, but you may come across them while looking, so here is what they are.',
            { defs: [
              { k: 'The cache', v: 'Copies of the files a page needed — scripts, styles, images and the three typefaces — kept so the next page is quicker. The browser decides what to keep and for how long.' },
              { k: 'Browser history', v: 'The list of pages you visited. It belongs to your browser and to the account you use it in. The site cannot see it.' },
              { k: 'Autofill and saved passwords', v: 'Details your browser offers to remember for forms. The site has no sign-in, and the fields on the contact page are not sent to the site. If your browser offers to fill one, that offer comes from the browser.' },
              { k: 'The downloads list', v: 'Files you saved from the Resources section appear in your browser’s own list of downloads, which is yours to clear.' },
              { k: 'Network and name-lookup caches', v: 'Your device and your network keep short-lived records of which addresses they have looked up. They are part of how the internet works, not part of the site.' },
            ] },
            'If you want a visit to leave no trace on your device, a private window is the tool for it. Closing the window asks the browser to discard its history, cookies and storage.',
          ],
        },
        {
          id: 'notuse',
          title: 'What the site does not use',
          plain: 'The technologies you might expect, and the answer for each.',
          body: [
            'Policies usually list what a site does. This one also lists what it does not, because that is often the question. Each row has been checked against the site’s code.',
            { table: {
              caption: 'Browser technologies and whether the site uses them',
              head: ['Technology', 'What it does', 'Used by this site'],
              rows: [
                ['Cookies', 'Notes sent back with every request', 'No'],
                ['Local storage', 'Items that stay until they are cleared', 'No'],
                ['Session storage', 'Items that go when the tab closes', 'Yes: up to three'],
                ['Indexed databases', 'Larger stores kept in the browser', 'No'],
                ['Service workers', 'Scripts that keep a site working offline and handle its requests', 'No'],
                ['Offline caches the site manages', 'Copies of pages the site chooses to keep', 'No'],
                ['Tracking pixels and beacons', 'Tiny requests that report a visit', 'No'],
                ['Analytics or advertising scripts', 'Code from other companies that measures or advertises', 'No'],
                ['Social media buttons and embeds', 'Widgets that load from another company', 'No'],
                ['Device fingerprinting', 'Reading a browser’s traits and sending them to recognise it', 'No. See below.'],
              ],
            } },
            'On the last row, be precise. The site does read a few traits of your device — the number of processor cores and the memory your browser reports, whether you asked for reduced motion, the width of the screen — so that it can decide how much animation to draw. The live status page shows some of them to you. None of it is stored, and none of it is sent anywhere.',
            'The site’s backgrounds are drawn on a canvas, which is a surface a script paints on. Painting is all the site does with it; it never reads the picture back.',
            { note: 'This table describes the site’s code as it stands. The section on changes promises that this page is updated first if that ever stops being true.', label: 'Plainly' },
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
          id: 'check',
          title: 'Checking in your own browser',
          plain: 'Where to look in Chrome, Edge, Firefox and Safari.',
          body: [
            'The panel near the top of this page is the easiest way to see what the site keeps, and it works on a phone. If you would rather look with your browser’s own tools, here is where to find them. Menu names change between versions, so treat these as a guide.',
            { sub: 'Chrome, Edge and other Chromium browsers', body: [
              { ol: [
                'Press F12, or Ctrl+Shift+I (⌘+Option+I on a Mac), to open the developer tools.',
                'Choose the **Application** tab. If it is not visible, open the menu marked with two arrows at the end of the tab row.',
                'In the list on the left, open **Session storage** and choose this site’s address. The items appear in a table.',
                'Open **Cookies** in the same list to see cookies, and **Local storage** for that store.',
              ] },
            ] },
            { sub: 'Firefox', body: [
              { ol: [
                'Press F12, or Ctrl+Shift+I (⌘+Option+I on a Mac).',
                'Choose the **Storage** tab. If it is hidden, turn it on in the tools’ settings.',
                'Open **Session Storage** and choose this site. Cookies and **Local Storage** are listed beside it.',
              ] },
            ] },
            { sub: 'Safari', body: [
              { ol: [
                'In Safari’s settings, under Advanced, turn on the option to show features for web developers.',
                'Choose **Develop**, then **Show Web Inspector**, or press ⌘+Option+I.',
                'Open the **Storage** tab and choose **Session Storage**. Cookies and local storage are listed beside it.',
              ] },
            ] },
            { sub: 'On a phone or tablet', body: [
              'Mobile browsers rarely include developer tools. The panel at the top of this page reads the same information and works on any device.',
            ] },
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
          id: 'private',
          title: 'Private and incognito windows',
          plain: 'The site behaves the same; the browser throws everything away at the end.',
          body: [
            'In a private or incognito window the site works exactly as it does anywhere else. It stores the same three items in that window’s session storage, and the browser discards them when the window closes, along with everything else the window collected.',
            'Some privacy tools, and some browsers on their strictest settings, block storage altogether, even session storage. That case is covered above: the site carries on and remembers less.',
            'A private window does not hide your visit from your network, from an employer or school that provides it, from the host that delivers the files or from the font service. It controls only what your own device keeps.',
          ],
        },
        {
          id: 'faq',
          title: 'Questions people ask',
          plain: 'Twelve short answers.',
          body: [
            { sub: 'Does the site use cookies?', body: ['No. The site’s code sets none.'] },
            { sub: 'Then why does this page exist?', body: ['Because it is a fair question to put to any site, and a clear “none” with a way to check it is more useful than silence.'] },
            { sub: 'How is this different from the privacy notice?', body: ['This policy covers only what is kept in your browser. The privacy notice covers what the site does with information about you in general.'] },
            { sub: 'Do the three items identify me?', body: ['No. They hold a 1, a 0 and a short list of page addresses. None contains a name, an email address or anything typed into the site.'] },
            { sub: 'Is anything in storage sent to the site?', body: ['No. Session storage is not attached to requests. The site’s scripts read it to decide what to show, and that is all.'] },
            { sub: 'Why is there no consent banner?', body: ['Because the items only remember what you did in one tab and are not used to follow you. A banner for storage that does not follow anyone would be noise.'] },
            { sub: 'Can I stop the intro from replaying?', body: ['Finishing or skipping the intro records that it has played, so it does not replay in that tab. A new tab starts fresh and can play it again.'] },
            { sub: 'Will clearing the items break anything?', body: ['No. The intro may play again, the music will forget whether it was on, and the search will forget the pages you opened. Nothing else changes.'] },
            { sub: 'Do the font files count as cookies?', body: ['No. Your browser may keep them in its cache so it need not fetch them again, but a cached file is not a cookie.'] },
            { sub: 'Can the font service set a cookie for me?', body: ['A cookie set by another service belongs to that service’s own domain, not to this site, and this policy and the live panel cover this site’s own storage. For the font service, see its own policy.'] },
            { sub: 'What if the policy changes?', body: ['This page and the live list are updated before the change goes live. The version on this page is the current one.'] },
            { sub: 'What if I see an item here that the policy does not explain?', body: ['Tell the company through the contact page and name the item. The live list exists partly to catch exactly that.'] },
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
        {
          id: 'history',
          title: 'History of this policy',
          plain: 'What has changed, newest first.',
          body: [
            { table: {
              caption: 'Versions of this policy',
              head: ['Version', 'What changed'],
              rows: [
                ['Draft 1.0', 'The first complete policy, written for the site as it stands: no cookies, no local storage, and up to three items in session storage.'],
              ],
            } },
            'The site does not publish dates for its changes. When a change is made, the version above is updated and the change is described in this table.',
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
