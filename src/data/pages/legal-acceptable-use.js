import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/acceptable-use',
  title: 'Acceptable Use',
  accent: '#ff3333',
  aliases: ['rules', 'conduct', 'scraping', 'abuse', 'bots', 'misuse', 'prohibited'],
  hero: {
    scene: 'permission-orbit',
    intensity: 'hero',
    eyebrow: 'Legal / Acceptable use',
    title: 'Use it the way it was built to be used.',
    intro:
      'A short set of ground rules for visiting, linking to and building on this site: what is welcome, what is not, and what to do if you find something wrong.',
    code: 'LEGAL.05',
    status: 'GROUND RULES',
    actions: [
      { label: 'Read the rules', to: '/legal/acceptable-use#rules' },
      { label: 'Security disclosure', to: '/trust/disclosure', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'split',
      anchor: 'glance',
      railLabel: 'At a glance',
      scene: 'topographic-lines',
      eyebrow: 'At a glance',
      code: 'USE.01',
      title: 'Be reasonable, and be honest about who you are.',
      body: [
        'The site is public and meant to be read, shared and linked to. The rules here exist so that stays true for everyone: the site stays up, stays accurate, and stays attributed to the people who made it.',
        'None of this is meant to catch out an ordinary visitor. If you are unsure whether something is fine, the contact page is the place to ask before you do it.',
      ],
      asideLabel: 'IN BRIEF',
      asideCode: 'USE.MAP',
      points: [
        { k: 'READING', v: 'Welcome' },
        { k: 'LINKING', v: 'Welcome' },
        { k: 'AUTOMATED ACCESS', v: 'Gently, and identify yourself' },
        { k: 'SECURITY TESTING', v: 'Report; do not exploit' },
        { k: 'IMPERSONATION', v: 'Not allowed' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'rules',
      railLabel: 'The full policy',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full policy',
      title: 'Acceptable use policy.',
      intro: 'Written out in full, so you can search it and link to any part.',
      version: 'Draft 1.0',
      summary: [
        'Read, link, share and print: **all welcome**.',
        'Don’t overload the site, don’t try to get at what isn’t public, and don’t pass the site off as yours.',
        'Found a weakness? **Report it** through the disclosure page instead of using it.',
      ],
      meta: [{ k: 'Applies to', v: 'Visitors' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'purpose',
          title: 'Purpose',
          plain: 'To keep the site open, accurate and safe for everyone.',
          body: [
            'This policy sets out how the website of **Hanoryx Systems** may be used. It supports the terms of use and should be read with them. In this policy, “the company” means Hanoryx Systems, “the site” means this website, and “you” means anyone using it.',
            { note: 'This is a plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'welcome',
          title: 'What is welcome',
          plain: 'Ordinary use, and plenty beyond it.',
          body: [
            { list: [
              'Reading the site, using its tools, and exploring its demonstrations.',
              'Linking to any page and sharing it with others.',
              'Printing or saving pages for your own reference, including the long documents.',
              'Telling the company about a mistake, a broken link or an accessibility problem.',
              'Quoting short passages with a clear credit, to the extent the law allows.',
            ] },
          ],
        },
        {
          id: 'reasonable',
          title: 'Keep the load reasonable',
          plain: 'Don’t make the site slower for other people.',
          body: [
            'The site is a set of ready-made files delivered by a hosting service. Ordinary browsing puts no strain on it. Automated access is a different matter.',
            { list: [
              'Do not run automated tools against the site at a rate that could slow it down or interrupt it for others.',
              'If you collect pages automatically, for example to build a search index or an archive, do it gently, respect the robots file at the site’s root, and identify your tool in its user-agent string.',
              'Do not use the site to test the capacity of other systems.',
            ] },
          ],
        },
        {
          id: 'access',
          title: 'Don’t reach for what isn’t public',
          plain: 'If it isn’t meant to be seen, leave it alone.',
          body: [
            'Do not attempt to gain access to anything that the site does not make public: accounts, administrative areas, the hosting service, other visitors’ browsers or any other system. The site has no accounts, so there is nothing to sign in to.',
            'Do not attempt to disable, bypass or interfere with any protection the site or its hosting service provides.',
          ],
        },
        {
          id: 'security',
          title: 'Security testing',
          plain: 'Report what you find; don’t make use of it.',
          body: [
            'If you believe you have found a security weakness, please follow the security disclosure policy: tell the company, give enough detail to reproduce it, and give it a fair chance to be fixed before you share it more widely.',
            'Good-faith research that follows that policy is welcome. This policy cannot grant legal permission beyond what the law itself allows, and it cannot speak for the hosting service or any other third party.',
          ],
        },
        {
          id: 'identity',
          title: 'Names, marks and honesty',
          plain: 'Don’t pretend to be the company, or to be endorsed by it.',
          body: [
            { list: [
              'Do not present the site, or substantial parts of it, as your own work.',
              'Do not use “Hanoryx Systems”, “Hanoryx North”, “Musebase” or “YK Engine” in a way that suggests the company endorses, sponsors or is connected to you when it is not.',
              'Do not create a site or message that impersonates the company.',
            ] },
            'The copyright and marks page explains what is the company’s and how its names may be mentioned.',
          ],
        },
        {
          id: 'content',
          title: 'Using the site to carry harm',
          plain: 'No unlawful or harmful use.',
          body: [
            'Do not use the site, or what you copy from it, to break the law, to harass or deceive anyone, or to spread malicious software. The site has no way for visitors to post content, so there is no user-generated content to moderate; this rule applies to how you use the site and its material elsewhere.',
          ],
        },
        {
          id: 'framing',
          title: 'Framing and embedding',
          plain: 'Link to the site; don’t wrap it in yours.',
          body: [
            'The site is not designed to be shown inside another page. Please link to it instead of framing it, and see the linking page for how to do that well.',
          ],
        },
        {
          id: 'report',
          title: 'Reporting a problem or abuse',
          plain: 'Use the contact page, and say what you saw.',
          body: [
            'If you see the site or its name being misused, or you find something on it that is wrong or harmful, use the contact page and describe it. The complaints page explains how a report is handled.',
          ],
        },
        {
          id: 'consequences',
          title: 'If the rules are broken',
          plain: 'Access can be limited.',
          body: [
            'The company, or the hosting service acting on its behalf, may limit or block access that breaks these rules, without notice, and may take any other step the law allows. The site keeps no visitor accounts, so there is nothing to suspend; the measures available are at the level of the network address and the hosting service.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          plain: 'The version on this page is the current one.',
          body: ['This policy may change as the site does. The version on this page is the current one.'],
        },
      ],
      note: 'A plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'fairLine',
      scene: 'permission-orbit',
      tag: 'End of acceptable use',
      minHeight: 560,
      title: 'Where is the line?',
      lede: 'Eight things a visitor might do. Decide for each one, then see how the policy reads it.',
      cases: [
        { id: 'quote', text: 'Quote two sentences from a case study in a blog post, with a link back.', fine: true, why: 'Short, credited quotation is ordinary use, and linking back is welcome.' },
        { id: 'crawl', text: 'Run a gentle crawler that identifies itself and respects the robots file.', fine: true, why: 'Gentle, identified automated access that follows the robots file is fine.' },
        { id: 'hammer', text: 'Fetch every page as fast as the connection allows, from several machines at once.', fine: false, why: 'That could slow the site for other people. Keep the rate reasonable.' },
        { id: 'clone', text: 'Copy the whole site, swap the name, and publish it as your own.', fine: false, why: 'Presenting the site’s material as your own is not allowed.' },
        { id: 'link', text: 'Link to the Principles page from a newsletter.', fine: true, why: 'Linking and sharing are welcome.' },
        { id: 'probe', text: 'Spot a way to read something that isn’t public, and keep reading it to see how far it goes.', fine: false, why: 'Report it instead of using it. The disclosure page says how.' },
        { id: 'print', text: 'Print the privacy notice to PDF and keep it for your records.', fine: true, why: 'Printing and saving pages for your own reference is welcome.' },
        { id: 'pose', text: 'Register a lookalike domain and email people as “Hanoryx Systems”.', fine: false, why: 'Impersonating the company is not allowed, and may be unlawful.' },
      ],
      onward: [{ label: 'Linking to this site', to: '/legal/linking' }, { label: 'Security disclosure', to: '/trust/disclosure' }],
    },
  ],
};

export default page;
