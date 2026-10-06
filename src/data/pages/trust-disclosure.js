import { legalTerms } from '../legalTerms';

const page = {
  key: 'trust/disclosure',
  title: 'Security Disclosure',
  accent: '#ff3333',
  aliases: ['vulnerability', 'report a bug', 'security.txt', 'responsible disclosure', 'bug bounty', 'security report', 'cve'],
  hero: {
    scene: 'secure-boundary',
    intensity: 'hero',
    eyebrow: 'Trust / Security disclosure',
    title: 'Found a weakness? Tell us first.',
    intro:
      'How to report a security problem with this website, what is and is not in scope, what a useful report contains, and what you can expect back.',
    code: 'TRUST.04',
    status: 'POLICY',
    actions: [
      { label: 'Read the policy', to: '/trust/disclosure#policy' },
      { label: 'Security approach', to: '/company/security', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'process',
      anchor: 'report',
      railLabel: 'A good report',
      scene: 'architectural-grid',
      eyebrow: 'A good report',
      title: 'Five things that make a report easy to act on.',
      steps: [
        { step: '01', title: 'What you found', body: 'One clear sentence: what is wrong, and why it matters.' },
        { step: '02', title: 'Where', body: 'The address of the page, and the browser you used.' },
        { step: '03', title: 'How to see it', body: 'The smallest set of steps that reproduces it, in order.' },
        { step: '04', title: 'What you saw', body: 'What happened, compared with what you expected. A screenshot helps.' },
        { step: '05', title: 'What you did not do', body: 'Confirm you stopped at showing the problem and did not go further.' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'policy',
      railLabel: 'The policy',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The policy',
      title: 'Security disclosure policy.',
      intro: 'Scope, how to report, what to expect, and what this policy cannot promise.',
      version: 'Draft 1.0',
      summary: [
        'Report weaknesses in **this website** through the contact page, and give the company a fair chance to fix them before you share the details.',
        'Show the problem; **do not go further** than you need to, and do not touch other people’s data.',
        'This policy is not a legal permission. It **cannot speak for** the hosting platform or any other third party.',
      ],
      meta: [{ k: 'Applies to', v: 'This website' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'purpose',
          title: 'Purpose',
          plain: 'To make reporting a problem easy and safe.',
          body: [
            'This policy tells you how to report a security problem with the website of **Hanoryx Systems**, so that it can be fixed. In this policy, “the company” means Hanoryx Systems and “the site” means this website.',
            { note: 'This is a plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'scope',
          title: 'What is in scope',
          plain: 'The website itself.',
          body: [
            'The site at its public address, including its pages, scripts, styles and the way it is delivered to your browser.',
            { list: [
              'Ways to run script of your choosing in another visitor’s browser through the site.',
              'Ways to read or change anything that is not meant to be public.',
              'Mistakes in how the site handles links, redirects or the information in its address.',
              'Anything in the site’s code that sends visitor information somewhere it should not.',
            ] },
          ],
        },
        {
          id: 'out-of-scope',
          title: 'What is out of scope',
          plain: 'Other people’s systems, and anything that harms visitors.',
          body: [
            { list: [
              'The hosting platform, the font service, GitHub, or any other service the site depends on. Report problems with those to their owners.',
              'Attacks that only overload the site or its network (denial of service).',
              'Social engineering of the company’s people, and physical attacks.',
              'Spam, or reports that only say a security header or setting could be stricter, without a way it could be abused.',
              'Findings that depend on a visitor’s own device or browser already being compromised.',
            ] },
          ],
        },
        {
          id: 'how',
          title: 'How to report',
          plain: 'Use the contact page and say it is a security report.',
          body: [
            'Use the contact page and choose the topic that fits best, then begin your message with “Security report”. Please include the details listed in a good report: what you found, where, how to see it, what you saw, and that you stopped there.',
            'Please do not post the details publicly, or send them to anyone else, before the company has had a fair chance to fix the problem.',
          ],
        },
        {
          id: 'conduct',
          title: 'How to test responsibly',
          plain: 'Show the problem; stop there.',
          body: [
            { list: [
              'Use only your own browser, device and, where one is needed, your own account on a service. The site has no accounts.',
              'Do not access, change or delete anything that belongs to someone else.',
              'Do not run automated scans at a rate that could slow the site for others.',
              'Stop as soon as you have shown there is a problem. Do not look for more.',
            ] },
            'The acceptable use policy has the general rules.',
          ],
        },
        {
          id: 'expect',
          title: 'What to expect',
          plain: 'A real reading, an answer, and a fix where one is needed.',
          body: [
            { steps: [
              { title: 'Receipt', body: 'Your report arrives in the company’s mailbox like any email.' },
              { title: 'Assessment', body: 'Someone reads it and tries to reproduce what you describe.' },
              { title: 'Reply', body: 'You are told what was found and what, if anything, will change.' },
              { title: 'Fix', body: 'Where there is a real problem, the site is changed. The company will tell you when it has been, if you left an address.' },
            ] },
            'This policy does not promise response times, because the company is not in a position to promise ones it cannot keep.',
          ],
        },
        {
          id: 'credit',
          title: 'Credit',
          plain: 'Thanks, and a name if you want one.',
          body: [
            'If you would like to be thanked by name for a report that led to a fix, say so in the report. If you would rather not be named, say that. Neither affects how the report is handled. The company does not run a reward programme.',
          ],
        },
        {
          id: 'limits',
          title: 'What this policy cannot promise',
          plain: 'It is not a legal permission.',
          body: [
            'This policy describes how the company would like to hear about problems. It cannot give you legal permission to do anything the law does not already allow, and it cannot speak for the hosting platform or any other third party whose systems the site depends on.',
            'The company intends to treat people who follow this policy in good faith fairly. That is an intention, not a legal guarantee.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes',
          plain: 'The version on this page is the current one.',
          body: ['This policy may change. The version on this page is the current one.'],
        },
      ],
      note: 'A plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'checklist',
      anchor: 'before',
      railLabel: 'Before you report',
      scene: 'secure-boundary',
      eyebrow: 'Before you report',
      title: 'A short list to go through.',
      intro: 'Tick as you go. Nothing is stored; the ticks are gone when you leave.',
      done: 'Ready to write.',
      items: [
        { label: 'I used only my own browser and device', hint: 'The site has no accounts, so there is nothing else to use.' },
        { label: 'I stopped as soon as I had shown the problem', hint: 'Looking for more is where a report turns into a risk.' },
        { label: 'I did not touch anything that belongs to someone else' },
        { label: 'I have the address of the page and the steps that show it' },
        { label: 'I can say what I expected and what I saw' },
        { label: 'I have not posted the details anywhere else', hint: 'The company would like a fair chance to fix it first.' },
      ],
    },
    {
      type: 'closer',
      kind: 'scopeTarget',
      scene: 'secure-boundary',
      tag: 'End of the disclosure policy',
      minHeight: 560,
      title: 'In scope, and out.',
      lede: 'The centre is what this policy covers. Every ring beyond it belongs to someone else.',
      rings: [
        { id: 'site', label: 'The website', scope: 'in', short: 'The site', note: 'The site at its public address.', items: ['Pages, scripts and styles', 'Links, redirects and addresses', 'What the site’s code sends, and to whom'] },
        { id: 'delivery', label: 'How it is delivered', scope: 'in', short: 'Delivery', note: 'How the site reaches your browser, as far as the company controls it.', items: ['Headers and settings the company chooses', 'The way files are served from the site’s host'] },
        { id: 'services', label: 'Services it depends on', scope: 'out', short: 'Dependencies', note: 'Other people’s systems. Report problems to their owners.', items: ['The hosting platform', 'The font service', 'GitHub'] },
        { id: 'people', label: 'People and places', scope: 'out', short: 'Beyond', note: 'Not covered by this policy at all.', items: ['Social engineering of the company’s people', 'Physical attacks', 'Denial of service'] },
      ],
      onward: [{ label: 'Acceptable use', to: '/legal/acceptable-use' }, { label: 'Trust centre', to: '/trust' }],
    },
  ],
};

export default page;
