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
          id: 'why',
          title: 'Why this page exists',
          plain: 'So that a description is not mistaken for a promise.',
          body: [
            'A website that explains how a company thinks and works can easily be taken for a set of promises. A guide reads like advice. A demonstration looks like a product. A tidy figure looks like a result. None of those readings is intended, and the page you are reading exists to say so in plain words.',
            'It is not meant to be hostile, and it is not meant to hide anything. It marks the edges of the site so that you can lean on the parts that are solid, and know which parts are illustration.',
          ],
        },
        {
          id: 'words',
          title: 'Words used on this page',
          plain: 'A short dictionary.',
          body: [
            'These words are used the same way throughout. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Disclaimer', v: 'A statement that limits what a reader may take from something. This page is a set of them.' },
              { k: 'Warranty', v: 'A promise that something is as described or will work as stated.' },
              { k: 'Advice', v: 'A recommendation about what you should do in your circumstances, from someone who has looked at them.' },
              { k: 'Illustration', v: 'A diagram, demonstration or sample record made to explain an idea.' },
              { k: 'Sample data', v: 'Invented records used in a demonstration so that it has something to show.' },
              { k: 'Measurement', v: 'A figure your own browser works out about your own device, such as a frame rate or a timing.' },
              { k: 'Opinion', v: 'A view on which reasonable people can differ.' },
              { k: 'Reliance', v: 'Acting on something because you believe it to be true or suitable.' },
            ] },
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
          id: 'claims',
          title: 'What the site says, and what it does not',
          plain: 'Ten subjects, each with both sides.',
          body: [
            'It is easier to read a disclaimer when you can see what it sits beside. For each subject, the left column says what the site does say. The right column says what you should not conclude from it.',
            { table: {
              caption: 'What the site says about ten subjects, and what it does not',
              head: ['Subject', 'What the site says', 'What it does not say'],
              rows: [
                ['The company’s work', 'The kinds of system it builds, and how it approaches them', 'That it can deliver any particular result for you, at any cost or time'],
                ['Its products', 'That Musebase and YK Engine exist, and what they are', 'That either is for sale, supported, or suited to your use'],
                ['Its clients', 'Nothing. No clients are named', 'That anyone uses, recommends or has approved the work'],
                ['Results', 'Nothing. No outcomes or measured results are published', 'That any approach produces a particular improvement'],
                ['The guides', 'General explanations of how the company thinks about a subject', 'That they are complete, current or right for your case'],
                ['The tools', 'That each does the calculation it describes, in your browser', 'That a result suits the decision you are making'],
                ['The demonstrations', 'That they illustrate an idea', 'That they are working systems or hold real data'],
                ['The status page', 'What your own browser measures, live', 'That the site is up for anyone else, or anything about the company’s reliability'],
                ['Security', 'How the company approaches it, and how to report a problem', 'That the site, or any system, is free of weaknesses'],
                ['The future', 'Nothing that is a commitment', 'That any page, feature or policy will stay or arrive'],
              ],
            } },
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
          id: 'pagebypage',
          title: 'Part by part',
          plain: 'What to bear in mind in each section of the site.',
          body: [
            { table: {
              caption: 'Cautions for each section of the site',
              head: ['Section', 'Bear in mind'],
              rows: [
                ['Work', 'The descriptions show the shape of the work. They name no clients and report no results.'],
                ['Systems', 'The capability pages describe kinds of system in general. They are not a list of what the company will build for you.'],
                ['Development', 'The demonstrations and the interface components show ideas, with sample data. The gallery is not a product.'],
                ['Company', 'Principles and the timeline describe how the company works. Unless a page says a role is open, the careers pages are not job adverts.'],
                ['Insights', 'The guides give general explanations. A threshold or an example illustrates a point and is not a recommendation for your numbers.'],
                ['Resources', 'The tools and templates are starting points. Check what they produce before you rely on it.'],
                ['Trust', 'The status page shows figures from your own device. The security pages do not claim that your risk is nil.'],
                ['Legal', 'These documents are plain-language drafts and have not been reviewed by a lawyer.'],
              ],
            } },
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
          id: 'toollimits',
          title: 'What each tool can and cannot tell you',
          plain: 'Five tools, five limits.',
          body: [
            'The tools in the Resources section do small, well-defined jobs. Each job has an edge, and it is worth knowing where.',
            { defs: [
              { k: 'Contrast checker', v: 'Works out the contrast ratio between two colours and says whether it meets the usual thresholds. It cannot judge whether a design is readable: size, weight, background images and your readers’ eyes also matter.' },
              { k: 'Type scale', v: 'Calculates sizes from a base and a ratio and writes the CSS. It does not choose a good base or ratio for your design.' },
              { k: 'Cron explainer', v: 'Reads a schedule in English and lists its next runs in your browser’s time zone. Different schedulers read some expressions differently, and yours may run in a different time zone.' },
              { k: 'Readiness check', v: 'Asks twenty questions before something goes live and returns the gaps as a list. It starts a conversation. It is not an audit, and a clean result does not mean a system is ready.' },
              { k: 'Decision-record writer', v: 'Helps you write a decision down in a standard form. It does not make the decision, check it or keep it.' },
            ] },
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
          id: 'misreadings',
          title: 'Eight common misreadings',
          plain: 'Things the site does not mean, and why.',
          body: [
            { sub: 'The site says the company “builds” systems. Does that mean it will build mine?', body: ['Not necessarily. Nothing on the site is an offer. Any real work would be agreed separately, in writing.'] },
            { sub: 'A guide says to do something a particular way. Is that the company’s advice to me?', body: ['No. It is a general explanation of a way of working. It has not looked at your circumstances.'] },
            { sub: 'The status page says my page is running smoothly. Is the site reliable?', body: ['The page says only that this page is running smoothly on your device at that moment. It measures nothing about the site as a service.'] },
            { sub: 'A demonstration showed a screen of orders. Are those real?', body: ['No. They are invented records, made so that the demonstration has something to show.'] },
            { sub: 'The security pages explain how to report a problem. Does the site have no weaknesses?', body: ['No claim of that kind is made. A report policy exists because every system can have weaknesses.'] },
            { sub: 'The principles page says what the company values. Is that a contract?', body: ['No. It describes how the company works and what it tries to do. It creates no obligation to you.'] },
            { sub: 'The timeline shows phases. Are those dates?', body: ['No. The site publishes no dates for the company’s history. The phases show order, not a calendar.'] },
            { sub: 'The licences page lists libraries. Do their authors endorse or support the site?', body: ['No. Listing a library says only that the site uses it, under its licence.'] },
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
          id: 'rights',
          title: 'Rights you may have anyway',
          plain: 'This page does not try to take them away.',
          body: [
            'Some places give people rights that cannot be signed away, and some kinds of responsibility cannot be limited by anyone. This page does not try to do either. Where it says “to the extent the law allows”, it means exactly that: the limit applies up to the point where the law says it must stop.',
            'The site sells nothing, so the rights people have as customers are unlikely to arise from it. If you think a right of yours has been affected, say so through the contact page and describe what happened.',
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
        {
          id: 'history',
          title: 'History of this page',
          plain: 'What has changed, newest first.',
          body: [
            { table: {
              caption: 'Versions of this page',
              head: ['Version', 'What changed'],
              rows: [
                ['Draft 1.0', 'The first complete page, written for the site as it stands: no clients named, no results published, and nothing offered for sale.'],
              ],
            } },
            'The site does not publish dates for its changes. When a change is made, the version above is updated and the change is described in this table.',
          ],
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
