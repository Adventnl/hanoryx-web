import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/retention',
  title: 'Data Retention',
  accent: '#ff3333',
  aliases: ['how long', 'deletion', 'delete', 'erase', 'keep', 'logs', 'schedule', 'lifetime'],
  hero: {
    scene: 'timeline-pulse',
    intensity: 'hero',
    eyebrow: 'Legal / Data retention',
    title: 'How long anything lives.',
    intro:
      'For each thing the site touches, who holds it and when it goes. The honest answer for most of them is “until you leave this page”, and for several it is “it never existed”.',
    code: 'LEGAL.08',
    status: 'SCHEDULE',
    actions: [
      { label: 'See the schedule', to: '/legal/retention#schedule' },
      { label: 'Cookies & storage', to: '/legal/cookies', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      anchor: 'idea',
      railLabel: 'The idea',
      scene: 'topographic-lines',
      eyebrow: 'The idea',
      code: 'RET.01',
      title: 'What isn’t collected can’t be kept.',
      body: [
        'Retention is the question of how long information is held before it is deleted. For this site the question is short, because the site’s own code collects nothing about visitors in the first place.',
        'What does exist is small and lives with you: text you have typed sits in the page until you leave, and three small items sit in your tab until you close it. Services your browser reaches and the mailbox you may write to keep things on their own terms.',
      ],
      asideLabel: 'THE LONGEST LIFE',
      asideCode: 'RET.MAP',
      points: [
        { k: 'IN THE PAGE', v: 'Until you leave or reload' },
        { k: 'IN YOUR TAB', v: 'Until the tab closes' },
        { k: 'COOKIES', v: 'None' },
        { k: 'THE SITE’S SERVER', v: 'No visitor records created' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'schedule',
      railLabel: 'The schedule',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The schedule',
      title: 'Data retention schedule.',
      intro: 'Every kind of information the site touches, where it lives, and how long it lasts.',
      version: 'Draft 1.0',
      summary: [
        'The site’s own code creates **no visitor records** on any server.',
        'The longest-lived thing is a short value in **your tab**, which the browser clears when the tab closes.',
        'Services your browser reaches, and the company’s mailbox, **keep things on their own terms**.',
      ],
      meta: [{ k: 'Applies to', v: 'This website' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'about',
          title: 'About this schedule',
          plain: 'What “retention” means here.',
          body: [
            'This schedule lists the information the website of **Hanoryx Systems** touches, where it is held, and how long it is kept. A {{retention period}} is the time information is kept before it is deleted.',
            { note: 'This is a plain-language schedule written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'why',
          title: 'Why shorter is better',
          plain: 'What is never made cannot leak, go stale or need guarding.',
          body: [
            'Most privacy effort goes into protecting information that has already been collected. A simpler approach is not to collect it. Information that was never made cannot be stolen, cannot be wrong, does not have to be kept up to date and never needs to be explained to anyone.',
            'That is the approach this site takes. The question this page answers, how long information is kept, has a short answer because the site’s code creates very little in the first place. What is left is small, it lives on your device, and most of it goes when you leave.',
          ],
        },
        {
          id: 'words',
          title: 'Words used on this page',
          plain: 'A short dictionary.',
          body: [
            'These words are used the same way throughout. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Retention period', v: 'How long a piece of information is kept before it is deleted.' },
              { k: 'Deletion', v: 'Removing information so that the holder can no longer read it. Copies that other people hold are not affected.' },
              { k: 'Backup', v: 'A spare copy kept so that information can be recovered if the original is lost. Email and hosting services commonly keep them.' },
              { k: 'Log', v: 'A running record that a service keeps of what it did, usually the time, the thing asked for and the sender’s address.' },
              { k: 'Cache', v: 'Copies of files your browser keeps so it does not need to fetch them again.' },
              { k: 'Controller', v: 'The person or organisation that decides how a piece of information is kept and used. The last column of the schedule says who that is.' },
            ] },
          ],
        },
        {
          id: 'table',
          title: 'The schedule',
          plain: 'Seven kinds of information, none kept by the site.',
          body: [
            { table: {
              caption: 'Retention schedule',
              head: ['What', 'Where it lives', 'How long', 'Who controls it'],
              rows: [
                ['Text you type', 'The page’s memory, in your browser', 'Until you leave or reload', 'You'],
                ['hnx.boot.complete', 'Session storage, in your tab', 'Until the tab closes', 'You'],
                ['hnx.audio.on', 'Session storage, in your tab', 'Until the tab closes', 'You'],
                ['hnx.search.recent', 'Session storage, in your tab', 'Until the tab closes', 'You'],
                ['Cookies and local storage', 'Not created', 'Not applicable', 'Not applicable'],
                ['Request logs', 'The hosting service and the font service', 'Set by those services', 'Those services'],
                ['Email you send', 'The company’s mailbox', 'Not set by this site', 'The company, as with any email'],
              ],
            } },
            'The first four rows can be seen in your own browser: the cookies and storage page reads them live and can clear them.',
          ],
        },
        {
          id: 'where',
          title: 'Where information can be during a visit',
          plain: 'A map of twelve places, and who looks after each.',
          body: [
            'The schedule above lists what the site creates. This map is wider. It lists every place something connected with a visit may be found, including places that have nothing to do with the site’s code, so that you can see what lies inside this page’s promises and what lies outside.',
            { table: {
              caption: 'Places information connected with a visit can be, and who controls each',
              head: ['Place', 'What may be there', 'Who controls it'],
              rows: [
                ['The page’s memory', 'What you typed, while the page is open', 'You, until you leave'],
                ['Your tab’s storage', 'The three small items', 'You. The browser clears it when the tab closes'],
                ['Your browser’s cache', 'Copies of scripts, styles, images and typefaces', 'Your browser'],
                ['Your browser’s history', 'The addresses of the pages you visited', 'You, through your browser'],
                ['Your downloads', 'Files you saved from the Resources section', 'You'],
                ['Your clipboard', 'The address, if you pressed the copy button', 'You and your device'],
                ['Your network', 'Records kept by a router, proxy or filter, on a work, school or public network', 'Whoever runs the network'],
                ['The host that delivers the files', 'Ordinary request logs', 'The hosting service'],
                ['The font service', 'Ordinary request logs for the font request', 'The font service'],
                ['Your email provider', 'A message you chose to send', 'You and your provider'],
                ['The company’s mailbox', 'A message that reached it', 'The company'],
                ['GitHub', 'Whatever it keeps if you follow the link to the YK Engine repository', 'GitHub'],
              ],
            } },
            'This page speaks for the company about the first two rows, which the site itself creates, and about the company’s mailbox. For the rest it can only describe what is usual and point you to the place that decides.',
          ],
        },
        {
          id: 'page',
          title: 'In the page',
          plain: 'Gone when you leave.',
          body: [
            'What you type into the search box or onto the contact page lives in the memory of the page while you type. It is not sent anywhere. Reloading or leaving the page removes it.',
          ],
        },
        {
          id: 'tab',
          title: 'In your tab',
          plain: 'Gone when the tab closes.',
          body: [
            'The three items in {{session storage}} belong to the tab. Your browser clears them when the tab is closed. You can clear them sooner with the button on the cookies and storage page.',
          ],
        },
        {
          id: 'caches',
          title: 'Copies your browser keeps',
          plain: 'The cache and the history outlast the tab.',
          body: [
            'Some of what your browser keeps does not go when the tab closes. The browser’s {{cache}} may hold copies of the site’s scripts, styles, images and typefaces so that the next visit is quicker. Its {{browser history}} holds the addresses of the pages you visited.',
            'Both belong to your browser and to the account you use it in. The site cannot read them, and it does not ask the browser to keep anything in them that it would not keep for any other site. How long they last, and how to clear them, are settings in your browser.',
            { note: 'On a shared computer, the browser’s history and cache are the places a later user might see signs of your visit. The site’s own storage is not, because it goes when the tab closes.', label: 'Worth knowing' },
          ],
        },
        {
          id: 'none',
          title: 'What is not created',
          plain: 'Nothing to delete.',
          body: [
            'The site’s code sets no {{cookie}}s, uses no {{local storage}}, has no accounts and writes no visitor records to a database. There is nothing in those places to retain, and so nothing to delete.',
          ],
        },
        {
          id: 'visit',
          title: 'A visit, step by step',
          plain: 'What exists at each stage, and where.',
          body: [
            'Here is an imagined visit, with an account of what exists at each stage and who holds it.',
            { steps: [
              { title: 'Arriving', body: 'You follow a link or type the address. Your browser asks the host for the page. The host may log the request in the ordinary way.' },
              { title: 'Settling in', body: 'The page arrives with its scripts and styles, and your browser asks the font service for three typefaces. The font service may log that request. Your browser may keep copies in its cache.' },
              { title: 'The intro', body: 'You press START or skip the intro. One or two small items are written to your tab’s storage. They stay until the tab closes.' },
              { title: 'Searching', body: 'You open the search and type. What you type lives in the page’s memory and goes nowhere. If you open a result, a short list of such pages is written to your tab’s storage.' },
              { title: 'Timing the connection', body: 'On the live status page you press Run the test. Three small requests go to the host and are timed. The host may log them like any others. The timings are shown to you and kept nowhere.' },
              { title: 'Writing to the company', body: 'On the contact page you write a message and open it in your mail app. The page keeps nothing. Your mail app, your provider and the company’s mailbox deal with the message from then on.' },
              { title: 'Leaving', body: 'You close the tab. The page’s memory is gone and the browser clears the tab’s storage. What remains is in places other people control: your browser’s cache and history, the services’ logs, and any message you sent.' },
            ] },
          ],
        },
        {
          id: 'services',
          title: 'Services your browser reaches',
          plain: 'They keep what they keep.',
          body: [
            'The service that delivers the site’s files and the service that delivers its typefaces can keep ordinary {{request log}}s. How long they do so is set by them and is outside this site’s code. The third-party services page lists them.',
          ],
        },
        {
          id: 'email',
          title: 'Email you send',
          plain: 'Held like any email.',
          body: [
            'If you choose to write to the company, your message arrives in its mailbox like any other email. This site does not set a retention period for it. If you would like a message deleted, say so, and the company will look at the request.',
          ],
        },
        {
          id: 'requests',
          title: 'Asking for deletion',
          plain: 'Ask through the contact page.',
          body: [
            'If you believe the company holds something you sent and would like it deleted, use the contact page and say what it is. Where the law gives you further rights, this schedule does not limit them.',
          ],
        },
        {
          id: 'deleting',
          title: 'What deletion can and cannot reach',
          plain: 'A request is only as far-reaching as what the company holds.',
          body: [
            { table: {
              caption: 'What the company can and cannot delete when asked',
              head: ['What you ask about', 'What the company can do', 'What it cannot do'],
              rows: [
                ['A message you sent to the company', 'Delete it from its own mailbox, and any note it made about it', 'Delete your copy, or copies held by email providers along the way'],
                ['A report about the site', 'The same as for a message', 'The same as for a message'],
                ['Items in your tab', 'Nothing. They are yours', 'Clear them for you. The cookies and storage page does it'],
                ['A line in the host’s or the font service’s logs', 'Nothing directly. Those services hold them', 'Delete them. Ask those services'],
                ['Your browser’s history, cache and downloads', 'Nothing. They are in your browser', 'Reach them. See your browser’s settings'],
              ],
            } },
            'Email and hosting services commonly keep backups, so a deleted item can persist for a while in a copy the company cannot see. That is true of most services, and it is not a promise this page can end.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this schedule',
          plain: 'The version on this page is the current one.',
          body: ['If the site ever starts to keep something, this schedule will be updated first. The version on this page is the current one.'],
        },
        {
          id: 'triggers',
          title: 'What would change this schedule',
          plain: 'Things the company would have to tell you about first.',
          body: [
            'The schedule describes the site as it stands. Any of the following would make it wrong, so any of them would be preceded by an update to this page, the privacy notice and the cookies policy.',
            { list: [
              'Adding analytics, advertising or any other measuring service.',
              'Adding accounts, sign-in or anything else that needs a database.',
              'Adding a form that sends what you type to a service instead of preparing an email.',
              'Adding a newsletter, comments, a chat widget or an embedded video.',
              'Setting a cookie, or using local storage or any other store.',
              'Adding another item to session storage.',
              'Loading anything from a new outside service.',
            ] },
            'If you ever see one of these on the site without a change to these documents, that is a mistake and worth reporting.',
          ],
        },
        {
          id: 'history',
          title: 'History of this schedule',
          plain: 'What has changed, newest first.',
          body: [
            { table: {
              caption: 'Versions of this schedule',
              head: ['Version', 'What changed'],
              rows: [
                ['Draft 1.0', 'The first complete schedule, written for the site as it stands: no visitor records, three items in the tab, and everything else left to the services that hold it.'],
              ],
            } },
            'The site does not publish dates for its changes. When a change is made, the version above is updated and the change is described in this table.',
          ],
        },
      ],
      note: 'A plain-language schedule written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'lifetimeRuler',
      scene: 'architectural-grid',
      tag: 'End of retention',
      minHeight: 560,
      title: 'Slide through time.',
      lede: 'Drag the marker along the ruler, and watch what is still alive at each moment.',
      stops: [
        { id: 'now', label: 'While you read', note: 'The page is open.' },
        { id: 'leave', label: 'After you leave the page', note: 'You navigate away, or reload.' },
        { id: 'close', label: 'After you close the tab', note: 'The browser clears the tab’s storage.' },
        { id: 'later', label: 'A week later', note: 'Nothing of the site’s remains in your browser.' },
      ],
      items: [
        { id: 'typed', label: 'Text you typed', lives: [1, 0, 0, 0] },
        { id: 'boot', label: 'hnx.boot.complete', lives: [1, 1, 0, 0] },
        { id: 'audio', label: 'hnx.audio.on', lives: [1, 1, 0, 0] },
        { id: 'recent', label: 'hnx.search.recent', lives: [1, 1, 0, 0] },
        { id: 'cookies', label: 'Cookies from the site', lives: [0, 0, 0, 0] },
        { id: 'records', label: 'Visitor records on the site’s side', lives: [0, 0, 0, 0] },
      ],
      onward: [{ label: 'Cookies & storage', to: '/legal/cookies' }, { label: 'Privacy', to: '/legal/privacy' }],
    },
  ],
};

export default page;
