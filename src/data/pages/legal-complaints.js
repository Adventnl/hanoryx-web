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
          id: 'words',
          title: 'Words used on this page',
          plain: 'A short dictionary.',
          body: [
            'These words are used the same way throughout. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Feedback', v: 'Anything you tell the company about the site that it can use: a mistake, a difficulty, a suggestion.' },
              { k: 'Complaint', v: 'Feedback that says something went wrong or was unfair, and asks for it to be put right.' },
              { k: 'Fault', v: 'Something on the site that does not do what it should, or that some people cannot use.' },
              { k: 'Reproduce', v: 'To make a problem happen again, so that it can be understood and fixed.' },
              { k: 'Second look', v: 'A fresh reading of a report after you have said that the first answer did not settle it.' },
              { k: 'Outside body', v: 'A public organisation that hears complaints independently of the company, such as a {{data-protection authority}}.' },
            ] },
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
          id: 'kinds',
          title: 'Where each kind of report goes',
          plain: 'Seven kinds, and what you can expect to hear.',
          body: [
            'Almost everything goes to the same place, the contact page. The one exception is a security weakness, which has a procedure of its own.',
            { table: {
              caption: 'Kinds of report, where they go and what you will hear',
              head: ['Kind of report', 'For example', 'Where to send it', 'What you will hear'],
              rows: [
                ['A mistake', 'A fact is wrong, or a link leads nowhere', 'The contact page, under Feedback & problems', 'Whether it was a mistake, and that it is corrected or will be'],
                ['Something hard to use', 'A control the keyboard cannot reach, or text too small to read', 'The contact page, under Feedback & problems', 'That it is treated as a fault, and added to the accessibility statement if it is new'],
                ['A privacy question', 'What a particular item in storage is for', 'The contact page, under Feedback & problems', 'An answer, and a clearer document if the document was unclear'],
                ['A concern about content', 'A statement that seems misleading, or a use of someone’s work', 'The contact page, under Feedback & problems', 'A reply saying what was looked at and what, if anything, changed'],
                ['A security weakness', 'A way to run script through a link', 'The contact page, with a message that begins “Security report”', 'What the security disclosure policy describes'],
                ['A reply that did not settle it', 'The answer missed what you asked', 'A reply to the message you received', 'A second look'],
                ['A suggestion', 'A page or a tool you would like to see', 'The contact page, under Feedback & problems', 'It is read. Nothing is promised'],
              ],
            } },
          ],
        },
        {
          id: 'how',
          title: 'How to raise it',
          plain: 'The contact page, with enough detail to act on.',
          body: [
            'Use the contact page and choose **Feedback & problems**. It helps to include:',
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
          id: 'good',
          title: 'A weak report and a strong one',
          plain: 'The difference is what the reader can do with it.',
          body: [
            'A report is easiest to act on when the reader can see exactly what you saw. Here is the same problem reported twice. The example is invented, to show the shape.',
            { sub: 'A weak report', body: [
              { code: 'Your site is broken.' },
              'The reader has no page to look at, nothing to try and no idea what “broken” means. The first reply has to be a question.',
            ] },
            { sub: 'A strong report', body: [
              { code: 'Page: the cookies and storage policy.\nWhat I did: pressed the Clear button, then pressed Tab.\nWhat I expected: focus to stay near the button.\nWhat happened: focus jumped to the top of the page.\nMy set-up: a laptop, keyboard only, a screen reader.' },
              'The reader can go to the page, follow the steps and see the same thing. That is most of the work of fixing it.',
            ] },
            { list: [
              '**Say where.** The address of the page, or its title.',
              '**Say what you did, in order.** Even if it seems obvious.',
              '**Say what you expected and what happened.** The gap between the two is the report.',
              '**Say what you were using, if it matters.** You never have to.',
            ] },
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
          id: 'priority',
          title: 'What gets looked at first',
          plain: 'Broken and misleading before wished-for.',
          body: [
            'The company reads everything it receives. When several reports arrive together, it intends to start with those that describe something broken, misleading or unusable for some people, and to come to suggestions after that.',
            'This is an intention, not a queue you can see. The company does not publish response times or a ranking, and it cannot promise to follow this order every time.',
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
          id: 'limits',
          title: 'What this procedure cannot do',
          plain: 'Its limits, stated plainly.',
          body: [
            'A procedure that promised everything would promise nothing. These are the things this one does not do.',
            { list: [
              'It cannot promise a particular outcome. A report is looked at honestly, and the answer may be that nothing will change.',
              'It cannot make the company change the site. It can make sure the report is read and answered.',
              'It is not legal advice, and it does not settle a legal dispute.',
              'It does not cover work agreed separately between the company and someone else. That work would have its own terms.',
              'It cannot deal with other people’s services. A problem with the hosting platform, the font service or GitHub belongs to their owners.',
            ] },
          ],
        },
        {
          id: 'outside',
          title: 'Bodies outside the company',
          plain: 'Where to go if you would rather not use the company’s procedure.',
          body: [
            'You do not have to use this procedure first, and you do not have to use it at all. Some countries have public bodies that hear complaints about privacy, accessibility or the conduct of businesses. Which one applies depends on where you live and on what your complaint is about, and this page cannot name it for you.',
            'The company does not discourage you from going to such a body, and nothing in this procedure limits your right to do so.',
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
          id: 'examples',
          title: 'Six worked examples',
          plain: 'What to send, and what happens.',
          body: [
            { sub: 'A link that goes nowhere', body: [
              'Send the address of the page the link is on, and say which link it was. The reply will say that it has been fixed, or why it has not.',
            ] },
            { sub: 'A page you could not use with a keyboard', body: [
              'Say which page, which control, and what happened when you pressed which key. It is treated as a fault in the site. If it is new, it is added to the accessibility statement as a known problem until it is fixed.',
            ] },
            { sub: 'A statement you think is misleading', body: [
              'Quote it and say why it misleads. The company will read it in context and tell you whether it agrees. If it does, the wording changes. If it does not, the reply explains why.',
            ] },
            { sub: 'A copy of the site on another address', body: [
              'Send the address of the copy and what you noticed. The acceptable use page says what is and is not allowed, and the reply will say what the company can and cannot do about it.',
            ] },
            { sub: 'A reply that missed the point', body: [
              'Reply to it and say what it did not answer. A second look is part of the procedure.',
            ] },
            { sub: 'A question about what the site stores', body: [
              'Name the item you saw. The cookies and storage page lists what the site keeps, and the reply will say whether the item is on the list and, if not, why not.',
            ] },
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
          id: 'confidential',
          title: 'Who sees what you send',
          plain: 'The people who deal with it, and no one else.',
          body: [
            'What you write is read by the people at the company who deal with it. The company does not publish reports, and it does not publish the names or addresses of the people who make them.',
            'If a report leads to a change, the change may be described in general terms. It would not say who raised the problem unless you have asked to be named. The same applies to security reports.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this procedure',
          plain: 'The version on this page is the current one.',
          body: ['This procedure may change as the company grows. The version on this page is the current one.'],
        },
        {
          id: 'history',
          title: 'History of this procedure',
          plain: 'What has changed, newest first.',
          body: [
            { table: {
              caption: 'Versions of this procedure',
              head: ['Version', 'What changed'],
              rows: [
                ['Draft 1.0', 'The first complete procedure, written for the site as it stands: one place to report, no promised response times, and a second look on request.'],
              ],
            } },
            'The site does not publish dates for its changes. When a change is made, the version above is updated and the change is described in this table.',
          ],
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
