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
          id: 'none',
          title: 'What is not created',
          plain: 'Nothing to delete.',
          body: [
            'The site’s code sets no {{cookie}}s, uses no {{local storage}}, has no accounts and writes no visitor records to a database. There is nothing in those places to retain, and so nothing to delete.',
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
          id: 'changes',
          title: 'Changes to this schedule',
          plain: 'The version on this page is the current one.',
          body: ['If the site ever starts to keep something, this schedule will be updated first. The version on this page is the current one.'],
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
