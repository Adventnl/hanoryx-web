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
      'The site’s text, design and code belong to the company; its typefaces and open-source parts belong to their authors; and four names identify the company’s work. Here is the line between them, and how to ask.',
    code: 'LEGAL.06',
    status: 'OWNERSHIP',
    actions: [
      { label: 'Open-source notices', to: '/trust/licences' },
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
        { code: 'OWN.03', title: 'Open-source parts', label: 'Their authors', body: 'The libraries the site is built on keep their own licences. Each is listed, with its licence, on the notices page.', glyph: 'cube', to: '/trust/licences' },
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
        'Typefaces and open-source parts keep **their own licences**; the notices page lists them.',
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
          id: 'site',
          title: 'The site’s own material',
          plain: 'Belongs to the company.',
          body: [
            'Unless something says otherwise, the text, design, graphics, page structure and code written for the site belong to Hanoryx Systems, and copyright in them is held by the company.',
            'Seeing, linking to, printing for your own use and quoting briefly are covered elsewhere and are fine. Copying the site, or substantial parts of it, to use as your own is not.',
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
          title: 'Open-source components',
          plain: 'Each keeps its own licence.',
          body: [
            'The site is built with open-source libraries for rendering, routing, animation, icons and smooth scrolling. Each remains under the licence its authors chose, and the company’s ownership of the site’s own code does not change that.',
            'The notices page lists each library, its version and its licence, and can produce a notices file you can keep.',
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
            'Apart from the typefaces and open-source components above, the site does not reproduce other people’s photographs, logos or text. Diagrams and illustrations are drawn for the site.',
            'If you believe something on the site infringes your rights, tell the company through the contact page and say what, where and why, and it will be looked at.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this notice',
          plain: 'The version on this page is the current one.',
          body: ['This notice may change. The version on this page is the current one.'],
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
        { id: 'code', label: 'Reuse the site’s code', verdict: 'Ask first', tone: 'maybe', line: 'The site’s own code belongs to the company. The open-source libraries under it have their own licences.', next: { label: 'Open-source notices', to: '/trust/licences' } },
        { id: 'copy', label: 'Copy the whole site', verdict: 'No', tone: 'no', line: 'Copying the site to publish as your own is not allowed.', next: null },
        { id: 'fonts', label: 'Use the same typefaces', verdict: 'Yes', tone: 'yes', line: 'They are open fonts from their designers. Check each licence; none of it is the company’s to grant.', next: null },
      ],
      onward: [{ label: 'Acceptable use', to: '/legal/acceptable-use' }],
    },
  ],
};

export default page;
