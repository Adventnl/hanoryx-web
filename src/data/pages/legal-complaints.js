import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/complaints',
  title: 'Feedback & Complaints',
  accent: '#ff3333',
  aliases: ['complaint', 'feedback', 'report a problem', 'escalate', 'concern', 'dispute', 'abuse report'],
  hero: {
    scene: 'workflow-river',
    intensity: 'hero',
    eyebrow: 'Legal / Feedback & complaints',
    title: 'When something is wrong, say so.',
    intro:
      'How to tell the company that a page is wrong, a feature is broken, something is hard to use, or you are unhappy with an answer — and what happens to what you send.',
    code: 'LEGAL.09',
    status: 'PROCEDURE',
    actions: [
      { label: 'How a report moves', to: '/legal/complaints#procedure' },
      { label: 'Accessibility statement', to: '/legal/accessibility', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'process',
      anchor: 'kinds',
      railLabel: 'What to report',
      scene: 'architectural-grid',
      eyebrow: 'What to report',
      title: 'Five kinds of thing.',
      steps: [
        { step: '01', title: 'A mistake', body: 'A fact that is wrong, a link that is broken, a page that has gone stale.' },
        { step: '02', title: 'Something hard to use', body: 'A control you could not reach, a demo that needed a pointer, text you could not read.' },
        { step: '03', title: 'A privacy question', body: 'Anything about what the site stores or sends that this site’s documents do not explain.' },
        { step: '04', title: 'A concern about content', body: 'Something on the site that is misleading, or that uses someone’s name or work without right.' },
        { step: '05', title: 'A problem with an answer', body: 'A reply from the company that did not settle what you raised.' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'procedure',
      railLabel: 'The procedure',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The procedure',
      title: 'Feedback and complaints procedure.',
      intro: 'How to raise something, what to include, and what happens next.',
      version: 'Draft 1.0',
      summary: [
        'Use the **contact page**, say what happened, and say which page it was on.',
        'A real person reads it. The page **does not promise a response time**; it does promise to say what is and is not done.',
        'Security weaknesses go through the **disclosure page** instead.',
      ],
      meta: [{ k: 'Applies to', v: 'This website' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'why',
          title: 'Why this page exists',
          plain: 'So you know what to do, and what to expect.',
          body: [
            'The company wants to hear when its website is wrong, hard to use or unfair. This page explains how to tell it, and what happens to what you send. In this page, “the company” means Hanoryx Systems and “the site” means this website.',
            { note: 'This is a plain-language procedure written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'what',
          title: 'What counts',
          plain: 'Almost anything about the site.',
          body: [
            { list: [
              'A mistake, a broken link or out-of-date content.',
              'A part of the site you could not use, including with {{assistive technology}}.',
              'A question about privacy, cookies or storage that the site’s documents do not answer.',
              'A concern that content is misleading, or uses someone’s name or work without right.',
              'A reply from the company that did not settle your concern.',
            ] },
            'Weaknesses in the site’s security are handled differently, because details should not be made public before they are fixed. Please use the disclosure page for those.',
          ],
        },
        {
          id: 'how',
          title: 'How to raise it',
          plain: 'The contact page, with enough detail to act on.',
          body: [
            'Use the contact page and choose the topic that fits best. It helps to include:',
            { steps: [
              { title: 'The page', body: 'The address of the page, or its title.' },
              { title: 'What you did', body: 'What you tried, in the order you tried it.' },
              { title: 'What you expected, and what happened', body: 'Both, even if they seem obvious.' },
              { title: 'Your set-up', body: 'The browser, device, and any assistive technology, if it matters. Leave it out if you would rather not say.' },
            ] },
            'You do not need to give your name, though an address to reply to is needed if you would like an answer.',
          ],
        },
        {
          id: 'next',
          title: 'What happens next',
          plain: 'It is read, looked into, and answered.',
          body: [
            { steps: [
              { title: 'Received', body: 'Your message arrives in the company’s mailbox like any email.' },
              { title: 'Read', body: 'Someone at the company reads it and, where it describes a fault, tries to reproduce it.' },
              { title: 'Answered', body: 'You get a reply saying what was found and what, if anything, will change. If nothing will, the reply says why.' },
              { title: 'Followed up', body: 'Where something is fixed, the site is updated. You may be told, if you left an address.' },
            ] },
            'This page does not promise a response time, because the company is not in a position to promise one it cannot keep. It does promise that a message will not be ignored.',
          ],
        },
        {
          id: 'unhappy',
          title: 'If you are not satisfied',
          plain: 'Say so, in your reply.',
          body: [
            'If the answer does not settle what you raised, reply and say so. A second look is part of the procedure.',
            'If your concern is about how information about you is handled, you may also have the right to contact the data-protection authority in your country. This page does not limit that.',
          ],
        },
        {
          id: 'accessibility',
          title: 'Accessibility reports',
          plain: 'Treated as real faults.',
          body: [
            'A report that part of the site is not accessible is treated as a fault in the site, not as a request for a favour. The accessibility statement lists what is known; a new report is added to it.',
          ],
        },
        {
          id: 'abuse',
          title: 'Reporting abuse',
          plain: 'Misuse of the company’s name is worth knowing about.',
          body: [
            'If someone is using the company’s name, or a copy of the site, to mislead people, tell the company through the contact page and include where you saw it. The acceptable use page explains what is and is not allowed.',
          ],
        },
        {
          id: 'records',
          title: 'What is kept',
          plain: 'The message, for as long as it takes to deal with it.',
          body: [
            'Your message is held in the company’s mailbox like any email, and is used to deal with what you raised. The data retention page explains how this site treats information, and what it does not set rules for.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this procedure',
          plain: 'The version on this page is the current one.',
          body: ['This procedure may change as the company grows. The version on this page is the current one.'],
        },
      ],
      note: 'A plain-language procedure written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'parcelTrack',
      scene: 'workflow-river',
      tag: 'End of complaints',
      minHeight: 560,
      title: 'Follow a report through.',
      lede: 'Four stages, no promises about how long each takes. Step through to see what happens at each.',
      stages: [
        { id: 'received', label: 'Received', line: 'It lands in the company’s mailbox like any email.', who: 'Automatic' },
        { id: 'read', label: 'Read', line: 'Someone reads it and, if it describes a fault, tries to reproduce it.', who: 'A person at the company' },
        { id: 'answered', label: 'Answered', line: 'You are told what was found and what will change, or why nothing will.', who: 'A person at the company' },
        { id: 'followed', label: 'Followed up', line: 'The fix goes into the site, and the accessibility statement or documents are updated if they need it.', who: 'The development team' },
      ],
      onward: [{ label: 'Accessibility statement', to: '/legal/accessibility' }, { label: 'Security disclosure', to: '/trust/disclosure' }],
    },
  ],
};

export default page;
