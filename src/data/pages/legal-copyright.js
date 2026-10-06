import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/copyright',
  title: 'Copyright & Marks',
  accent: '#ff3333',
  aliases: ['trademark', 'intellectual property', 'ip', 'licence', 'license', 'logo', 'reuse', 'attribution', 'fonts licence'],
  hero: {
    scene: 'glyph-field',
    intensity: 'hero',
    eyebrow: 'Legal / Copyright & marks',
    title: 'Whose is what.',
    intro:
      'The site’s text, design and code belong to the company; its typefaces and third-party libraries belong to their authors; and four names identify the company’s work. Here is the line between them, and how to ask.',
    code: 'LEGAL.06',
    status: 'OWNERSHIP',
    actions: [
      { label: 'Licences & notices', to: '/trust/licences' },
      { label: 'Press & media', to: '/company/press', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'owners',
      railLabel: 'Who owns what',
      scene: 'architectural-grid',
      eyebrow: 'Who owns what',
      title: 'Four kinds of material.',
      intro: 'Each has a different owner and a different answer to “can I reuse it?”.',
      items: [
        { code: 'OWN.01', title: 'The site’s own', label: 'Hanoryx Systems', body: 'The text, design, graphics and code written for this site. Reuse beyond ordinary reading, linking and fair quotation means asking first.', glyph: 'doc' },
        { code: 'OWN.02', title: 'Typefaces', label: 'Their designers', body: 'Cormorant Garamond, Inter and JetBrains Mono, delivered by Google Fonts under open font licences that their authors chose.', glyph: 'ruler' },
        { code: 'OWN.03', title: 'Third-party parts', label: 'Their authors', body: 'The libraries the site is built on keep their own licences. Each is listed, with its licence, on the notices page.', glyph: 'cube', to: '/trust/licences' },
        { code: 'OWN.04', title: 'Names', label: 'Marks of the company', body: 'Hanoryx Systems, Hanoryx North, Musebase and YK Engine identify the company and its work. Other names belong to their owners.', glyph: 'key' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'policy',
      railLabel: 'The full notice',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full notice',
      title: 'Copyright, names and marks.',
      intro: 'The same ground, written out section by section.',
      version: 'Draft 1.0',
      summary: [
        'The site’s text, design and code are the company’s. **Ask first** before reusing them.',
        'Typefaces and third-party libraries keep **their own licences**; the notices page lists them.',
        'Mentioning the company’s names is fine. **Implying endorsement is not.**',
      ],
      meta: [{ k: 'Applies to', v: 'This website' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'about',
          title: 'About this notice',
          plain: 'Who owns the material on this site.',
          body: [
            'This notice explains who owns the different kinds of material on the website of **Hanoryx Systems**, and what that means for anyone who would like to use it. In this notice, “the company” means Hanoryx Systems and “the site” means this website.',
            { note: 'This is a plain-language notice written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'words',
          title: 'Words used in this notice',
          plain: 'The few terms that matter, in everyday language.',
          body: [
            'Copyright has a vocabulary of its own. These are the meanings this notice uses. They are everyday descriptions, not legal definitions. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Copyright', v: 'The right of the person who made something, or of their employer, to decide who may copy it, share it or change it. It usually arises automatically when the work is made.' },
              { k: 'Trademark', v: 'A name, word or sign used to show who a product or service comes from. Rights in it depend on the country and on how it is used.' },
              { k: 'Licence', v: 'Permission, with conditions, to use something that belongs to someone else.' },
              { k: 'Open source', v: 'Software published under a licence that lets other people use and change it on stated conditions.' },
              { k: 'Attribution', v: 'Saying who made something and where you found it.' },
              { k: 'Derivative work', v: 'Something made by changing or building on someone else’s work, such as a translation, a remix or a copy with the name swapped.' },
              { k: 'Quotation', v: 'Using a short extract of someone’s work, with credit, to discuss it. Many countries allow this within limits, and the limits differ.' },
              { k: 'Infringement', v: 'Using something protected by copyright or a trademark in a way the owner has not allowed and the law does not permit.' },
              { k: 'Notice', v: 'A message to the company saying that something on the site infringes your rights.' },
            ] },
          ],
        },
        {
          id: 'site',
          title: 'The site’s own material',
          plain: 'Belongs to the company.',
          body: [
            'Unless something says otherwise, the text, design, graphics, page structure and code written for the site belong to Hanoryx Systems, and copyright in them is held by the company.',
            'Seeing, linking to, printing for your own use and quoting briefly are covered elsewhere and are fine. Copying the site, or substantial parts of it, to use as your own is not.',
          ],
        },
        {
          id: 'coverage',
          title: 'What belongs to whom, item by item',
          plain: 'Thirteen kinds of material and what you can do with each.',
          body: [
            'The cards near the top of this page give four broad groups. This table is finer-grained, and says what each kind of thing means for someone who would like to reuse it.',
            { table: {
              caption: 'Kinds of material on the site, whose they are and what you can do',
              head: ['Kind of material', 'Whose it is', 'What you can do'],
              rows: [
                ['The site’s text: pages, guides and descriptions', 'The company', 'Read, link, print, and quote briefly with credit. Ask for anything more.'],
                ['The site’s design and layout', 'The company', 'Ask before building on this exact design. Ideas and general approaches are free for anyone.'],
                ['Diagrams, illustrations and the animated backgrounds', 'The company', 'Show a diagram in a review with credit. Ask before reusing one.'],
                ['The site’s own code', 'The company', 'Ask before reusing it. The libraries under it keep their own licences.'],
                ['Third-party libraries', 'Their authors', 'Used under their own licences, which the licences page lists.'],
                ['The three typefaces', 'Their designers', 'Published under an open font licence that allows free use. Check each licence.'],
                ['The small line icons', 'Their authors', 'Part of an icon library listed on the licences page under its own licence.'],
                ['Sample data and example records in the demos', 'The company, written for the site', 'Treat them like the site’s text. They are invented illustrations, not records.'],
                ['The intro track', 'Not yet stated', 'Listen to it on the site. Please do not reuse it. See the open item below.'],
                ['Downloadable templates and checklists', 'The company, written for the site', 'Use them for your own work. Ask before passing them on as templates. See the open item below.'],
                ['The company’s names and mark', 'The company', 'Describe the company accurately. Ask before showing the mark.'],
                ['Screenshots of the site', 'The company', 'One that illustrates a review or a discussion, with credit, is in the spirit of quotation.'],
                ['What you send to the company', 'You', 'The company reads it and replies. It does not claim your words.'],
              ],
            } },
          ],
        },
        {
          id: 'fonts',
          title: 'Typefaces',
          plain: 'Open fonts, delivered by Google Fonts.',
          body: [
            'The site is set in three typefaces: Cormorant Garamond, Inter and JetBrains Mono. They are published by their designers under open font licences and are delivered to your browser by {{Google Fonts}}. They are not the company’s, and the company claims no ownership of them.',
          ],
        },
        {
          id: 'open-source',
          title: 'Third-party components',
          plain: 'Each keeps its own licence.',
          body: [
            'The site is built with third-party libraries, most of them open source, for rendering, routing, animation, icons and smooth scrolling. Each remains under the licence its authors chose, and the company’s ownership of the site’s own code does not change that.',
            'The notices page lists each library, its version and its licence, and can produce a notices file you can keep.',
          ],
        },
        {
          id: 'libraries',
          title: 'The libraries, by licence',
          plain: 'What each family of licence asks of the people who use it.',
          body: [
            'The notices page lists every library the site is built with, with its version and licence. Here is the same list sorted by licence, so that the differences are easy to see. The counts are those of the list at the time of writing; if they ever disagree with the notices page, the notices page is right.',
            { table: {
              caption: 'Libraries grouped by licence',
              head: ['Licence', 'Libraries', 'What it asks'],
              rows: [
                ['MIT', 'Six that ship with the site: clsx, Lenis, motion, React, React DOM and React Router', 'Keep the copyright and permission notice with copies. Otherwise use freely.'],
                ['ISC', 'One that ships with the site: the lucide icon library', 'Much the same as MIT.'],
                ['GreenSock Standard (no charge)', 'Two that ship with the site: GSAP and its React helper', 'Used free of charge under GreenSock’s own terms. It is not an open-source licence, and its terms are GreenSock’s to state.'],
                ['Build and test tools', 'Twelve that do not reach your browser, including Vite, ESLint, axe-core and Playwright', 'Under MIT, MPL-2.0 or Apache-2.0 licences. They help make and check the site and are not part of what you download.'],
              ],
            } },
            'A library keeps its own licence whatever the company does with the rest of the site. Nothing in this notice grants you more than a library’s own licence does, or takes away anything it gives.',
          ],
        },
        {
          id: 'names',
          title: 'Names and marks',
          plain: 'Four names identify the company’s work.',
          body: [
            { defs: [
              { k: 'Hanoryx Systems', v: 'The company.' },
              { k: 'Hanoryx North', v: 'The company’s development team.' },
              { k: 'Musebase', v: 'A coordination application the company has built.' },
              { k: 'YK Engine', v: 'The company’s 2D engine and its tooling.' },
            ] },
            'Other product, company and service names mentioned on the site belong to their owners. Mentioning them does not imply any connection.',
          ],
        },
        {
          id: 'marksfaq',
          title: 'Questions about names and marks',
          plain: 'Eight short answers.',
          body: [
            { sub: 'Can I say I use the company’s work?', body: ['Only if it is true, and only in plain words: “we use X”. Do not suggest the company recommends you, works with you or checked what you say.'] },
            { sub: 'Can I list the company among my suppliers or partners?', body: ['Only if it is true and the company has agreed. A name on a list can suggest a relationship, so ask first.'] },
            { sub: 'Can I use the company’s name in a handle or domain?', body: ['Please don’t. A name that could be confused with the company’s may mislead people, and it may be unlawful.'] },
            { sub: 'Can I use its colours or typefaces?', body: ['The typefaces are open fonts, free for anyone under their licences. Colours are not owned by anyone. But a combination of the mark and the palette that suggests you are the company is not fine.'] },
            { sub: 'Can I show the mark in an article about the company?', body: ['A small, unaltered mark beside a factual description is the usual way. Keep it square, on a dark ground, with room around it, as the brand page explains.'] },
            { sub: 'Can I redraw the mark?', body: ['No. Redrawing, recolouring or combining it with your own makes a different mark, which could mislead.'] },
            { sub: 'What if my own name or product is similar?', body: ['Say so through the contact page. Similar names exist, and usually the answer is to be clear about who is who.'] },
            { sub: 'Whose names are the other names on the site?', body: ['Their owners’. Mentioning them does not imply any connection with them.'] },
          ],
        },
        {
          id: 'mentioning',
          title: 'Mentioning the company',
          plain: 'Say what you like, truthfully; don’t imply a link.',
          body: [
            'You may refer to the company and its work by name to describe them accurately, for example in an article, a talk or a list of tools.',
            { list: [
              'Do not use a name or mark in a way that suggests the company endorses or is connected to you when it is not.',
              'Do not alter the company’s mark or combine it with your own to form a new one.',
              'Do not register a name, domain or account that could be confused with the company’s.',
            ] },
          ],
        },
        {
          id: 'quoting',
          title: 'Quoting and reuse',
          plain: 'Brief, credited quotation is ordinary; more means asking.',
          body: [
            'Many places allow short quotations for news, review, criticism or commentary. This notice neither extends nor limits what the law allows. If you quote, please say where the words came from and link to the page.',
            'For anything beyond that, such as reproducing a page, a diagram or a tool, ask first through the contact page and say what you would like to do.',
          ],
        },
        {
          id: 'credit',
          title: 'How to credit the site',
          plain: 'Three ways, to copy and change.',
          body: [
            'Credit is about honesty, not decoration. The aim is that a reader can find the original. Use the page’s own title as the link text. Where a link is not possible, the address is enough.',
            { sub: 'In running text', body: [
              { code: 'Hanoryx Systems, “Idempotency in order systems”, hanoryx.com/insights/idempotency (read on [day month year]).' },
            ] },
            { sub: 'On a web page', body: [
              { code: '<a href="https://hanoryx.com/insights/idempotency">Idempotency in order systems</a>, by Hanoryx Systems' },
            ] },
            { sub: 'Under a screenshot', body: [
              { code: 'Screenshot of the Hanoryx Systems website, hanoryx.com/legal/privacy.' },
            ] },
            'These are examples. Change the title and the address to the page you mean.',
          ],
        },
        {
          id: 'outputs',
          title: 'What you make with the tools and templates',
          plain: 'Your words are yours; the templates are starting points.',
          body: [
            'The browser tools and the downloadable templates produce documents. Two things go into each one: what you type, and text written for the site.',
            { list: [
              '**What you type is yours.** The tools run in your browser and do not keep or send it. The company does not claim your words, or the figures a tool works out from them.',
              '**The wording around it is the company’s.** The headings, prompts and checklist items that frame your entries were written for the site.',
              '**A document you make is for your use.** Use it for your own work, change it freely and keep it. That is what the templates are for.',
            ] },
            { note: 'The site does not yet say on what conditions the templates themselves may be redistributed, for example in another company’s toolkit or on a training course. Until it does, please ask first through the contact page before passing the templates on as templates.', label: 'Open item' },
          ],
        },
        {
          id: 'press',
          title: 'Press and brand material',
          plain: 'There is a page for it.',
          body: [
            'The press and media page and the brand page describe the company in a few lines, show its colours, type and mark, and explain how the mark is best shown. They are there to help people describe the company accurately.',
          ],
        },
        {
          id: 'third',
          title: 'Third-party material',
          plain: 'There is very little.',
          body: [
            'Apart from the typefaces and third-party components above, the site does not reproduce other people’s photographs, logos or text. Diagrams and illustrations are drawn for the site.',
            'If you believe something on the site infringes your rights, tell the company through the contact page and say what, where and why, and it will be looked at.',
          ],
        },
        {
          id: 'music',
          title: 'The intro track',
          plain: 'Played on the site; its origin is not yet stated here.',
          body: [
            'When you press START on the intro, the site plays a short ambient track. The track is a file delivered by the site’s own host, and it plays only when you ask.',
            { note: 'This notice does not yet say who made the track or on what terms it may be used. Until it does, treat it as something to listen to on the site and not to reuse. If you need to know more, ask through the contact page.', label: 'Open item' },
          ],
        },
        {
          id: 'notice',
          title: 'Telling the company about an infringement',
          plain: 'What a useful notice contains.',
          body: [
            'If you believe something on the site infringes your rights, the quickest way to have it looked at is to give the company what it needs to find and judge it. A useful notice has six parts.',
            { steps: [
              { title: 'Who you are', body: 'Your name, and the address the company can reach you on. If you act for someone else, say who and on what basis.' },
              { title: 'What the work is', body: 'Which work you believe is yours, and how you hold the rights in it.' },
              { title: 'Where it is', body: 'The address of the page on the site, and which part of it.' },
              { title: 'Why you believe it infringes', body: 'What is the same, or what is used without permission. A line or two is enough.' },
              { title: 'What you would like', body: 'Removal, a change, a credit, or a conversation.' },
              { title: 'That it is honest', body: 'A sentence saying the information is accurate to the best of your knowledge.' },
            ] },
            'The company will read it, look at the material, and reply to say what it found and what, if anything, it will change. It does not promise response times.',
            { note: 'The company does not currently name an agent for formal notices under any particular law. If your country requires a notice in a set form, say so in your message and the company will look at what is needed.', label: 'Plainly' },
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this notice',
          plain: 'The version on this page is the current one.',
          body: ['This notice may change. The version on this page is the current one.'],
        },
        {
          id: 'history',
          title: 'History of this notice',
          plain: 'What has changed, newest first.',
          body: [
            { table: {
              caption: 'Versions of this notice',
              head: ['Version', 'What changed'],
              rows: [
                ['Draft 1.0', 'The first complete notice, written for the site as it stands. Two points are left open: the conditions for passing on the templates, and the origin of the intro track.'],
              ],
            } },
            'The site does not publish dates for its changes. When a change is made, the version above is updated and the change is described in this table.',
          ],
        },
      ],
      note: 'A plain-language notice written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'markDesk',
      scene: 'glyph-field',
      tag: 'End of copyright',
      minHeight: 560,
      title: 'May I…?',
      lede: 'Pick what you would like to do. The desk answers in one line, and says what to do next.',
      cases: [
        { id: 'link', label: 'Link to a page', verdict: 'Yes', tone: 'yes', line: 'Linking is welcome. Use the page’s own title as the link text.', next: { label: 'How to link well', to: '/legal/linking' } },
        { id: 'quote', label: 'Quote a paragraph', verdict: 'Briefly', tone: 'maybe', line: 'Short, credited quotation is ordinary. Say where it came from and link back.', next: null },
        { id: 'name', label: 'Name the company in a talk', verdict: 'Yes', tone: 'yes', line: 'Referring to the company by name to describe it accurately is fine. Don’t imply endorsement.', next: { label: 'Press & media', to: '/company/press' } },
        { id: 'logo', label: 'Show the mark on my site', verdict: 'Ask first', tone: 'maybe', line: 'Showing the mark can suggest a connection. Ask first, and say how it will appear.', next: { label: 'Brand page', to: '/company/brand' } },
        { id: 'code', label: 'Reuse the site’s code', verdict: 'Ask first', tone: 'maybe', line: 'The site’s own code belongs to the company. The third-party libraries under it have their own licences.', next: { label: 'Licences & notices', to: '/trust/licences' } },
        { id: 'copy', label: 'Copy the whole site', verdict: 'No', tone: 'no', line: 'Copying the site to publish as your own is not allowed.', next: null },
        { id: 'fonts', label: 'Use the same typefaces', verdict: 'Yes', tone: 'yes', line: 'They are open fonts from their designers. Check each licence; none of it is the company’s to grant.', next: null },
      ],
      onward: [{ label: 'Acceptable use', to: '/legal/acceptable-use' }],
    },
  ],
};

export default page;
