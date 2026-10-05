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
          id: 'words',
          title: 'Words used in this policy',
          plain: 'A few terms that have a particular meaning here.',
          body: [
            'These words are used the same way throughout. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Automated access', v: 'Visiting the site with a program instead of a person at a browser: a crawler, a checker, a script, a monitoring service.' },
              { k: 'Crawler', v: 'A program that follows links from page to page and reads or copies what it finds.' },
              { k: 'Scraping', v: 'Collecting the content of pages automatically, usually to reuse or analyse it.' },
              { k: 'Rate', v: 'How many requests are made in a given time. A slow, steady rate is gentle. A burst from many machines at once is not.' },
              { k: 'Load', v: 'The work the site’s host has to do to answer requests. A flood of requests raises it for everyone.' },
              { k: 'Good faith', v: 'Acting honestly, to help the site and its visitors and not to harm them or to gain from a weakness.' },
              { k: 'Impersonation', v: 'Presenting yourself, a page or a message as being from the company when it is not.' },
            ] },
            'Two more terms, the {{robots file}} and the {{user-agent}}, are explained where they first appear.',
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
          id: 'principles',
          title: 'The four ideas behind the rules',
          plain: 'Proportion, honesty, care and asking first.',
          body: [
            'Every rule in this policy comes from one of four ideas. When a situation is not covered, asking which of the four it touches is usually enough to settle it.',
            { defs: [
              { k: 'Proportion', v: 'Use the site in the way, and at the scale, that a person reading it would. A reader opens a few pages a minute, and a program should behave like a considerate reader.' },
              { k: 'Honesty', v: 'Say who you are and what you are doing. Do not pass the company’s work off as yours, or yours off as the company’s.' },
              { k: 'Care for others', v: 'The site is shared. Do not make it slower, riskier or less trustworthy for the next visitor.' },
              { k: 'Asking first', v: 'Where you are unsure, ask through the contact page before you act. A short question is always welcome.' },
            ] },
          ],
        },
        {
          id: 'reasonable',
          title: 'Keep the load reasonable',
          plain: 'Don’t make the site slower for other people.',
          body: [
            'The site is a set of ready-made files delivered by a {{hosting}} service. Ordinary browsing puts no strain on it. Automated access is a different matter.',
            { list: [
              'Do not run automated tools against the site at a rate that could slow it down or interrupt it for others.',
              'If you collect pages automatically, for example to build a search index or an archive, do it gently, respect the {{robots file}} at the site’s root, and identify your tool in its {{user-agent}} string.',
              'Do not use the site to test the capacity of other systems.',
            ] },
          ],
        },
        {
          id: 'automated',
          title: 'Automated access, in practice',
          plain: 'How to run a crawler or a checker politely.',
          body: [
            'Automated access is welcome in moderation. Search engines, link checkers, accessibility monitors and archives all use it. The aim is that the site cannot tell your program is there, except by the courtesy it shows.',
            { steps: [
              { title: 'Start from the sitemap', body: 'The site publishes a sitemap file that lists its pages, and the robots file points to it. That is a better starting point than following every link.' },
              { title: 'Read the robots file', body: 'It sits at the root of the site. At present it welcomes all visitors. If that changes, follow what it says.' },
              { title: 'Identify yourself', body: 'Put the name of your program, and a way to reach you, in its user-agent string, so that a person can get in touch if something goes wrong.' },
              { title: 'Go slowly', body: 'Make requests one at a time, with a pause between them, from a single machine. A reader opens a page every few seconds at most, and a program that keeps to that pace will never be noticed.' },
              { title: 'Do not repeat yourself', body: 'Keep what you have fetched and do not fetch it again without a reason.' },
              { title: 'Stop when asked', body: 'If the company asks you to slow down or stop, do so, and use the contact page to say what you were doing.' },
            ] },
            { note: 'The site is client-rendered. A plain download of a page returns a small shell, and the text appears when scripts run in a browser. A program that wants the text has to run the page as a browser does, which is heavier. That is one more reason to go slowly.', label: 'Practical' },
            { note: 'Whether the site’s text may be used to build, train or test machine-learning systems has not been decided. The robots file is the only signal the site currently gives, and it welcomes all visitors. Until the company says more, please ask first through the contact page.', label: 'Open item' },
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
          id: 'examples',
          title: 'More examples of what is and is not fine',
          plain: 'Seventeen situations, with a reason for each.',
          body: [
            'The closing section of this page lets you try eight cases. This table is longer, and is there to be searched and skimmed.',
            { table: {
              caption: 'More examples of what is and is not fine',
              head: ['Situation', 'Verdict', 'Why'],
              rows: [
                ['Reading every page in one sitting', 'Fine', 'This is what the site is for.'],
                ['Using your browser’s translate, reader or read-aloud tools', 'Fine', 'They work inside your own browser and are part of ordinary use.'],
                ['Saving a page for offline reading', 'Fine', 'For your own reference.'],
                ['Checking your own links to the site with a script', 'Fine, gently', 'A handful of requests, spaced out.'],
                ['Monitoring the site from a service', 'Fine, gently', 'A check every few minutes is plenty. Ask if you need more.'],
                ['Indexing the site for a search engine or an archive', 'Fine, gently', 'Follow the robots file and identify your program.'],
                ['Quoting a paragraph with a credit and a link', 'Fine', 'Short, credited quotation is ordinary.'],
                ['Linking from a page that disagrees with the site', 'Fine', 'Linking is welcome whether or not you agree.'],
                ['Describing the company accurately in an article', 'Fine', 'Referring to it by name to describe it is ordinary.'],
                ['Using the tools on confidential information', 'Fine, with your own rules', 'The tools send nothing, but your employer or client may have rules of its own.'],
                ['Running a load test against the site', 'Not fine', 'The site is not there to test capacity, yours or anyone’s.'],
                ['Running a vulnerability scanner at full speed', 'Not fine', 'Follow the security disclosure policy instead.'],
                ['Fetching pages from many machines at once', 'Not fine', 'That is a flood however polite each machine is.'],
                ['Republishing a whole guide under your name', 'Not fine', 'That presents the company’s work as yours.'],
                ['Naming your product after the company’s', 'Not fine', 'That suggests a connection that does not exist.'],
                ['Showing the site inside a frame on your page', 'Please don’t', 'It is not built for it. Link to it instead.'],
                ['Using the text to train a machine-learning system', 'Ask first', 'Not decided yet. See the open item under automated access.'],
              ],
            } },
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
          id: 'testing',
          title: 'Security testing, in practice',
          plain: 'What a careful tester does, and what a careless one does not.',
          body: [
            'The security disclosure policy is the full account. From the point of view of acceptable use, it comes down to staying within what you need in order to show that a problem exists.',
            { table: {
              caption: 'Careful and careless security testing',
              head: ['A careful tester', 'A careless one'],
              rows: [
                ['Uses their own browser and device', 'Uses other people’s'],
                ['Shows that a problem exists, then stops', 'Keeps going to see how far it goes'],
                ['Looks at what the site makes public', 'Tries to reach what it does not'],
                ['Sends a few requests, spaced out', 'Runs a scanner at full speed'],
                ['Reports privately and gives a fair chance to fix it', 'Posts the details publicly first'],
                ['Says plainly what they did and found', 'Exaggerates, or demands something in return'],
              ],
            } },
            'Reports from the left-hand column are read gladly. The company does not run a reward programme, and it does not promise response times.',
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
          id: 'scenarios',
          title: 'Some scenarios',
          plain: 'Eight real-life situations and how the policy reads them.',
          body: [
            { sub: 'A student who wants to cite a guide', body: ['Cite it as you would any web page: the title, the address and the day you read it. Quote briefly if you need to. No permission is needed.'] },
            { sub: 'A journalist writing about the company', body: ['Naming the company and quoting briefly are fine. The press page has a short description to start from, and the contact page is the way to have a fact checked.'] },
            { sub: 'A teacher who wants to use a guide in a course', body: ['Linking to the guide from course materials is welcome. If you want to reproduce a guide in full, ask first and say how it will be used.'] },
            { sub: 'A developer building a link checker', body: ['Fine. Start from the sitemap, identify the program, keep a gentle pace and stop if asked.'] },
            { sub: 'A researcher measuring how quickly the site loads', body: ['A few visits from an ordinary browser are fine. For repeated or automated measurement, keep to a gentle rate and tell the company what you are doing. The live status page shows what your own browser measures.'] },
            { sub: 'A company putting the site in a list of examples', body: ['Linking and naming it accurately are welcome. Do not suggest that the company endorses the list or whoever sponsors it.'] },
            { sub: 'Someone who finds a typo', body: ['Tell the company through the contact page. That is a contribution, not a breach of anything.'] },
            { sub: 'A person using assistive technology or their own style sheet', body: ['That is ordinary use. A screen reader, a magnifier, a browser extension or a custom style sheet is part of your browser and does not count as automated access.'] },
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
          id: 'response',
          title: 'What usually happens first',
          plain: 'Asking comes before blocking, where there is time.',
          body: [
            'Most problems are mistakes: a script left running, a name used carelessly, a passage copied without a credit. The company’s first step, where it can take one, is to ask.',
            { ol: [
              'If a program is straining the site, the first step is usually to reach whoever runs it, if they can be found, or to slow it down at the network level.',
              'If a name or mark is used in a way that suggests a connection, the first step is a request to change it.',
              'If material has been copied, the first step is a request to remove it or to credit it.',
              'If the rules are broken knowingly, or the harm is serious, or asking has not worked, the company may block access, tell a hosting service or other provider, or take whatever step the law allows.',
            ] },
            'None of this is a promise to proceed in that order. The company may need to act at once, and may do so without notice, as the section above says.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          plain: 'The version on this page is the current one.',
          body: ['This policy may change as the site does. The version on this page is the current one.'],
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
                ['Draft 1.0', 'The first complete policy, written for the site as it stands: reading, linking and printing are welcome, automated access is welcome in moderation, and the question of machine-learning use is left open.'],
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
