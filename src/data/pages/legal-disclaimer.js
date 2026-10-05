import { legalTerms } from '../legalTerms';

const page = {
  key: 'legal/disclaimer',
  title: 'Disclaimers',
  accent: '#ff3333',
  aliases: ['warranty', 'liability', 'advice', 'accuracy', 'as is', 'limits', 'fine print', 'illustrations'],
  hero: {
    scene: 'redaction-matrix',
    intensity: 'hero',
    eyebrow: 'Legal / Disclaimers',
    title: 'What this site is, and is not.',
    intro:
      'A plain list of the things you should not read into the site: that its descriptions are promises, its demos are products, its articles are advice, or its numbers are anyone’s but your own.',
    code: 'LEGAL.07',
    status: 'LIMITS',
    actions: [
      { label: 'Terms of use', to: '/legal/terms' },
      { label: 'Complaints', to: '/legal/complaints', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      variant: 'grid',
      columns: 4,
      anchor: 'five',
      railLabel: 'The five things',
      scene: 'architectural-grid',
      eyebrow: 'The five things',
      title: 'Read the site as what it is.',
      intro: 'Each of these is expanded in the full text below.',
      items: [
        { code: 'DIS.01', title: 'Descriptions, not promises', body: 'What the site says about the company’s work is a description. It is not an offer, a quotation or a guarantee.', glyph: 'doc' },
        { code: 'DIS.02', title: 'Illustrations, not products', body: 'Diagrams, demos and sample records show an idea. They are not real systems or real data.', glyph: 'layers' },
        { code: 'DIS.03', title: 'Information, not advice', body: 'Articles and tools are general. They do not take your circumstances into account.', glyph: 'compass' },
        { code: 'DIS.04', title: 'Your numbers are yours', body: 'Any live figure is a measurement of your own device at that moment, and means nothing beyond it.', glyph: 'chart' },
        { code: 'DIS.05', title: 'As it is', body: 'The site may be wrong, out of date or unavailable. No warranty is given beyond what the law requires.', glyph: 'shield' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'text',
      railLabel: 'The full text',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The full text',
      title: 'Disclaimers and limits.',
      intro: 'Written out in full, section by section.',
      version: 'Draft 1.0',
      summary: [
        'Everything on the site is **information**. None of it is an offer, a quotation, a guarantee or advice.',
        'Demos and sample data are **illustrations**.',
        'The site is provided **as it is**, to the extent the law allows.',
      ],
      meta: [{ k: 'Applies to', v: 'This website' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'about',
          title: 'About this page',
          plain: 'What these disclaimers are for.',
          body: [
            'This page sets out, in plain terms, the limits of what the website of **Hanoryx Systems** says and does. It supports the terms of use. In this page, “the company” means Hanoryx Systems and “the site” means this website.',
            { note: 'This is a plain-language page written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'information',
          title: 'Information only',
          plain: 'The site informs; it does not offer.',
          body: [
            'The site presents the company, its development team and its work. It is provided for information. Nothing on it is an offer to supply anything, a quotation, a proposal, or a promise that any particular result can be achieved.',
          ],
        },
        {
          id: 'case-studies',
          title: 'Descriptions of work',
          plain: 'General terms, deliberately.',
          body: [
            'The work is described in general terms. Some of it is internal and some involves other people’s operations, so the site shows the shape of the work rather than its details. Descriptions should not be read as complete, as current, or as a statement of results.',
            'The site names no clients, quotes no outcomes and publishes no measured results of the company’s work. If you find a statement that reads as one, it is a mistake, and it is worth reporting.',
          ],
        },
        {
          id: 'illustrations',
          title: 'Illustrations and demonstrations',
          plain: 'They show an idea.',
          body: [
            'The site contains interactive diagrams, demonstrations, tools and sample records. They are drawn or written for the site to explain an approach. They are not real systems, real customer data or real measurements, and they should not be relied on as such.',
            { list: [
              'A demonstration of how an order might flow does not describe any customer’s order system.',
              'A sample record is invented for the example.',
              'A diagram of an architecture is a way of thinking, not a design to copy without thought.',
            ] },
          ],
        },
        {
          id: 'advice',
          title: 'No advice',
          plain: 'Articles and tools are general.',
          body: [
            'The articles in Insights and the tools in Resources are general information and general-purpose utilities. They are not professional advice of any kind, whether technical, legal, financial, security-related or otherwise. They do not take your circumstances into account.',
            'If a decision matters, take advice from someone who knows your situation. Check results from a tool before you rely on them.',
          ],
        },
        {
          id: 'measurements',
          title: 'Figures measured on your device',
          plain: 'They describe your device, nothing else.',
          body: [
            'Some pages, such as the live status page and the site engineering page, show figures measured by your own browser on your own device: frame rates, timings and similar. They describe that device at that moment. They are not statements about the site, the company or any other device.',
          ],
        },
        {
          id: 'opinions',
          title: 'Opinions',
          plain: 'The articles say what the authors think.',
          body: [
            'The articles express general engineering opinions. Reasonable people disagree about many of the things they discuss, and your context may call for a different choice.',
          ],
        },
        {
          id: 'links',
          title: 'Other sites and services',
          plain: 'Not under the company’s control.',
          body: [
            'The site links to, and loads typefaces from, services it does not control. Their content, availability and practices are theirs. A link is not an endorsement.',
          ],
        },
        {
          id: 'availability',
          title: 'Availability and accuracy',
          plain: 'It may be wrong, and it may not be there.',
          body: [
            'The site is provided as it is and as it is available. It may contain mistakes or be out of date, and it may change, move or be withdrawn without notice. The company does not promise that it will be uninterrupted, error-free or suited to any particular purpose.',
          ],
        },
        {
          id: 'warranty',
          title: 'No warranty',
          plain: 'Beyond what the law insists on.',
          body: [
            'To the extent the law allows, the company gives no warranty about the site, stated or implied, including any warranty of accuracy, completeness, fitness for a particular purpose, or non-infringement.',
          ],
        },
        {
          id: 'responsibility',
          title: 'Limits of responsibility',
          plain: 'The company cannot cover every outcome.',
          body: [
            'To the extent the law allows, the company is not responsible for loss or damage arising from the use of the site or from relying on its content, including indirect and consequential loss.',
            'Nothing here limits any responsibility that the law does not allow to be limited, for example for fraud, or for death or personal injury caused by negligence.',
          ],
        },
        {
          id: 'yours',
          title: 'Your responsibility',
          plain: 'Use judgement.',
          body: [
            'You are responsible for how you use what you read here and for the devices and browsers you use to read it. If something looks wrong, check it before acting, and please tell the company.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes',
          plain: 'The version on this page is the current one.',
          body: ['These disclaimers may change as the site does. The version on this page is the current one.'],
        },
      ],
      note: 'A plain-language page written for this site. It is not legal advice and it has not been reviewed by a lawyer.',
    },
    {
      type: 'closer',
      kind: 'finePrint',
      scene: 'redaction-matrix',
      tag: 'End of disclaimers',
      minHeight: 520,
      title: 'The fine print, made readable.',
      lede: 'Move over it. Or switch the lens on, and read it at a size you can.',
      lines: [
        'The site is provided as it is and as it is available, and may change, move or be withdrawn without notice.',
        'Descriptions of work are descriptions, not offers, quotations or guarantees of any result.',
        'Illustrations, demonstrations and sample records are not real systems, real data or real measurements.',
        'Articles and tools are general information. They are not advice, and they do not know your circumstances.',
        'Figures measured on your own device describe that device at that moment, and nothing else.',
        'Links to other sites are not endorsements. Those sites, and the font service, are not under the company’s control.',
        'Nothing here limits any responsibility that the law does not allow to be limited.',
      ],
      onward: [{ label: 'Terms of use', to: '/legal/terms' }],
    },
  ],
};

export default page;
