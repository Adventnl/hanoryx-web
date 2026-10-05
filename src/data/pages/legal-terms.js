import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/terms',
  title: 'Terms',
  accent: '#ff3333',
  aliases: ['terms of use', 'conditions', 'copyright', 'warranty', 'liability'],
  hero: {
    scene: 'privacy-quiet-grid',
    intensity: 'hero',
    eyebrow: 'Legal / Terms',
    title: 'The terms for using this website.',
    intro:
      'A plain-language account of what this site is, what its descriptions are and are not, and where its limits lie. Filter the clauses, or open any of them.',
    code: 'LEGAL.02',
    status: 'PLAIN LANGUAGE',
    actions: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Contact', to: '/contact', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'clauseFinder',
      anchor: 'clauses',
      railLabel: 'The clauses',
      scene: 'architectural-grid',
      minHeight: 700,
      eyebrow: 'The clauses',
      title: 'Eight short clauses.',
      intro: 'Each has a one-line gist you can read without opening anything.',
      topics: ['All', 'Use', 'Content', 'Limits'],
      clauses: [
        {
          id: 'what',
          meta: 'T.01',
          topic: 'Use',
          title: 'What this site is',
          gist: 'Information about the company and its work.',
          body: [
            'This website presents Hanoryx Systems and its work. It is provided for information, and it is not a service you sign up for.',
            'The work is described in general terms. Some details are left out deliberately.',
          ],
        },
        {
          id: 'offer',
          meta: 'T.02',
          topic: 'Use',
          title: 'Nothing here is an offer',
          gist: 'Descriptions are not quotations or promises.',
          body: 'Descriptions of work, capabilities and design models are not an offer, a quotation or a guarantee. Any work between a visitor and the company would be agreed separately, in writing.',
        },
        {
          id: 'illustrations',
          meta: 'T.03',
          topic: 'Content',
          title: 'Models and demos are illustrations',
          gist: 'Diagrams, demos and sample records are not real systems.',
          body: 'Interactive diagrams, demos and sample records on this site illustrate an approach. They are not real systems, real data or measurements, and nothing in them should be relied on as such.',
        },
        {
          id: 'names',
          meta: 'T.04',
          topic: 'Content',
          title: 'Names and marks',
          gist: 'Names identify the company and its work.',
          body: 'Hanoryx Systems, Hanoryx North, Musebase and YK Engine identify the company and its work. Other names mentioned belong to their owners.',
        },
        {
          id: 'material',
          meta: 'T.05',
          topic: 'Content',
          title: 'The site’s own material',
          gist: 'The text, design and code are the company’s.',
          body: 'The text, design and code of this site belong to Hanoryx Systems unless something says otherwise. If you would like to reuse any of it, ask first through the contact page.',
        },
        {
          id: 'external',
          meta: 'T.06',
          topic: 'Limits',
          title: 'Other services',
          gist: 'Fonts come from a third party.',
          body: 'The site loads its typefaces from Google Fonts. That service is outside the company’s control and has its own terms. The privacy page explains what this involves.',
        },
        {
          id: 'accuracy',
          meta: 'T.07',
          topic: 'Limits',
          title: 'Accuracy and availability',
          gist: 'Provided as it is, and it may change.',
          body: 'The site is provided as it is. Content may be out of date, may contain mistakes, and may change or disappear without notice. If you spot something wrong, please say so through the contact page.',
        },
        {
          id: 'changes',
          meta: 'T.08',
          topic: 'Limits',
          title: 'Changes to these terms',
          gist: 'The version here is the current one.',
          body: 'These terms may change. The version on this page is the current one.',
        },
      ],
      note: 'A plain-language summary written for this site. It is not legal advice.',
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'terms',
      railLabel: 'The full terms',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full terms',
      title: 'Terms of use, in full.',
      intro: 'The eight clauses above, written out as a complete document: what the site is, what you may do with it, and where its limits lie.',
      version: 'Draft 1.0',
      summary: [
        'The site **describes** the company and its work. It is not a shop, a quotation or advice.',
        'Diagrams, demos and sample records are **illustrations**, not real systems or measurements.',
        'You are welcome to read, link to and print the site. Reusing its material beyond that means **asking first**.',
        'It is provided **as it is**, and it may change or be unavailable without notice.',
      ],
      meta: [
        { k: 'Applies to', v: 'This website' },
        { k: 'Status', v: 'Plain-language draft' },
      ],
      terms: legalTerms,
      sections: [
        {
          id: 'about',
          title: 'About these terms',
          plain: 'Using the site means accepting them.',
          body: [
            'These terms explain how the website of **Hanoryx Systems** may be used. In these terms, “the company” means Hanoryx Systems, “the site” means this website, and “you” means anyone using it.',
            'By using the site you accept these terms. If you do not accept them, please do not use the site.',
            { note: 'These terms are a plain-language account written for this site. They are not legal advice and they have not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'what',
          title: 'What the site is',
          plain: 'Information about the company and its work.',
          body: [
            'The site presents Hanoryx Systems, its development team Hanoryx North, and the work and approach of both. It is provided for information. It is not a service you sign up for, and it has no accounts.',
            'The work is described in general terms. Some of it is internal and some involves other people’s operations, so the site shows the shape of the work, not its details.',
          ],
        },
        {
          id: 'offer',
          title: 'No offer, quotation or advice',
          plain: 'Descriptions are not promises.',
          body: [
            'Nothing on the site is an offer, a quotation, a proposal or a guarantee. Descriptions of work, capabilities, approaches and design models are exactly that: descriptions.',
            'Nothing on the site is professional advice, whether technical, legal, financial or of any other kind. The articles and tools in the Insights and Resources sections are general information and general utilities. They do not take your circumstances into account.',
            'Any work between a visitor and the company would be agreed separately, in writing, and those terms would apply to that work instead of anything described here.',
          ],
        },
        {
          id: 'illustrations',
          title: 'Illustrations, demos and sample data',
          plain: 'They show an idea; they are not real systems.',
          body: [
            'Interactive diagrams, demos, tools, sample records and live figures on the site illustrate an approach or perform a small calculation in your browser. They are not real systems, real customer data or published measurements.',
            'Where the site shows a figure measured on your own device, such as the live status page, the figure describes your device at that moment and nothing else.',
            { list: ['Do not rely on a demo as if it were a product.', 'Do not treat sample data as real data.', 'Do not read an illustration as a claim about the company’s results.'] },
          ],
        },
        {
          id: 'material',
          title: 'The company’s material',
          plain: 'The text, design and code are the company’s.',
          body: [
            'The text, design, graphics and code of the site belong to Hanoryx Systems unless something says otherwise. Open-source components and typefaces used by the site remain under their own licences, which are listed on the licences page.',
            '“Hanoryx Systems”, “Hanoryx North”, “Musebase” and “YK Engine” identify the company and its work. Other names mentioned belong to their owners.',
            'The copyright page explains this in more detail. If you would like to reuse any of the site’s material, ask first through the contact page.',
          ],
        },
        {
          id: 'allowed',
          title: 'What you may do',
          plain: 'Read it, link to it, print it, quote it fairly.',
          body: [
            { list: [
              'Read the site and use its tools and demos for your own purposes.',
              'Link to any page, and tell others about it. The linking page explains how to do it well.',
              'Print or save a page for your own reference. The long documents are designed to print cleanly.',
              'Quote short passages for news, review or commentary, to the extent the law allows, and say where they came from.',
            ] },
          ],
        },
        {
          id: 'not-allowed',
          title: 'What you may not do',
          plain: 'Don’t break it, copy it wholesale or pass it off as yours.',
          body: [
            'Please follow the acceptable use page. In short, do not:',
            { list: [
              'copy the site, or substantial parts of it, and present them as your own;',
              'use the company’s names or marks in a way that suggests it endorses or is connected to you when it is not;',
              'attempt to disrupt the site, overload it, or gain access to anything that is not meant to be public;',
              'use the site to break the law or to harm other people.',
            ] },
          ],
        },
        {
          id: 'third-parties',
          title: 'Other services and sites',
          plain: 'Fonts come from a third party; links may leave the site.',
          body: [
            'To show a page, the site asks your browser to load typefaces from {{Google Fonts}}. That service is outside the company’s control and has its own terms and policies.',
            'The YK Engine page links to a code repository on GitHub. Following that link takes you to a site the company does not control, under its own terms. The company is not responsible for what other sites do.',
          ],
        },
        {
          id: 'availability',
          title: 'Accuracy and availability',
          plain: 'Provided as it is; it may change or go away.',
          body: [
            'The site is provided as it is and as it is available. Content may be out of date or contain mistakes, and the site, or any part of it, may change, move or disappear without notice.',
            'The company does not promise that the site will be available at any particular time, or free of errors, or that it will work in every browser or on every device.',
            'If you spot something wrong, please say so through the contact page.',
          ],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimers',
          plain: 'No warranties beyond those the law insists on.',
          body: [
            'To the extent the law allows, the company gives no warranty about the site, whether stated or implied, including any warranty of accuracy, fitness for a particular purpose or freedom from interruption.',
            'The disclaimers page sets out, in plain terms, what the site’s content is and is not.',
          ],
        },
        {
          id: 'liability',
          title: 'Limits of responsibility',
          plain: 'Use the site sensibly; the company cannot cover every outcome.',
          body: [
            'To the extent the law allows, the company is not responsible for loss or damage that arises from using the site or relying on its content, including indirect or consequential loss.',
            'Nothing in these terms limits any responsibility that the law does not allow to be limited, for example for fraud, or for death or personal injury caused by negligence.',
          ],
        },
        {
          id: 'privacy',
          title: 'Privacy, cookies and storage',
          plain: 'They have their own documents.',
          body: [
            'How the site treats information about visitors is explained in the privacy notice, the cookies and storage policy and the data retention page. They form part of how the site is run, though they are not terms you are asked to agree to.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to these terms',
          plain: 'The version on this page is the current one.',
          body: [
            'These terms may change as the site changes. The version on this page is the current one, and using the site after a change means accepting the changed terms.',
          ],
        },
        {
          id: 'law',
          title: 'Law and disputes',
          plain: 'The company’s details are not yet published here.',
          body: [
            'If a disagreement about the site cannot be settled by talking, the law of the place where the company is established would apply. The company has not yet published its registered details on this site, so this page does not name that place.',
            'When those details are published, this section will name the applicable law and where disputes would be heard.',
            { note: 'This section is deliberately incomplete rather than guessed. It will be filled in once the company’s registered details are confirmed.', label: 'Open item' },
          ],
        },
        {
          id: 'contact',
          title: 'Contact',
          plain: 'Use the contact page and say which part you mean.',
          body: [
            'Questions about these terms are welcome. Use the contact page and say which section you mean.',
          ],
        },
      ],
      note: 'A plain-language account written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'termsCard',
      scene: 'architectural-grid',
      tag: 'End of terms',
      minHeight: 560,
      title: 'The terms, on one card.',
      lede: 'Turn it over. One side is what you can do; the other is what not to lean on.',
      can: ['Read, use the tools, print what you need', 'Link to any page, and say where it came from', 'Quote briefly, as the law allows', 'Ask to reuse more, through the contact page'],
      cant: ['Treat a description as an offer or a quotation', 'Treat a demo or sample record as a real system', 'Expect the site to always be there, or always right', 'Present the site’s material as your own'],
      onward: [{ label: 'Acceptable use', to: '/legal/acceptable-use' }, { label: 'Disclaimers', to: '/legal/disclaimer' }],
    },
  ],
};

export default page;
