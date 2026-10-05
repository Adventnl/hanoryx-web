import { legalTerms } from '../legalTerms';
import { redirects } from '../../app/routeConfig';

const page = {
  key: 'legal/linking',
  title: 'Linking to This Site',
  accent: '#ff3333',
  aliases: ['link', 'links', 'embed', 'iframe', 'backlink', 'deep link', 'url', 'redirects', 'permalink'],
  hero: {
    scene: 'dependency-graph',
    intensity: 'hero',
    eyebrow: 'Legal / Linking',
    title: 'Link to us. Here is how.',
    intro:
      'Linking to any page is welcome. This page says how to do it well, which addresses are stable, what happens to the ones that were retired, and why the site is better linked than framed.',
    code: 'LEGAL.10',
    status: 'WELCOME',
    actions: [
      { label: 'Build a link', to: '/legal/linking#policy' },
      { label: 'Site map', to: '/sitemap', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'modules',
      anchor: 'good',
      railLabel: 'A good link',
      scene: 'architectural-grid',
      eyebrow: 'A good link',
      title: 'Four habits.',
      rows: [
        { k: 'USE THE TITLE', v: 'Link text that says what the page is called helps readers, search engines and screen-reader users alike.' },
        { k: 'LINK THE PAGE', v: 'Point at the page address, not at a script, image or stylesheet. Those can move.' },
        { k: 'LINK A SECTION', v: 'The long documents give every section a link of its own. Hover a heading and copy it.' },
        { k: 'SAY WHAT IT IS', v: 'A short line of context beats a bare address. Don’t imply the company endorses what you wrote.' },
      ],
    },
    {
      type: 'signature',
      kind: 'document',
      anchor: 'policy',
      railLabel: 'The linking policy',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The linking policy',
      title: 'Linking policy.',
      intro: 'What is welcome, what is stable, and what to avoid.',
      version: 'Draft 1.0',
      summary: [
        'Link to any page, from anywhere, without asking.',
        'Page addresses are meant to be **stable**. Retired ones redirect.',
        'Please **link, don’t frame**. The site isn’t built to sit inside another page.',
      ],
      meta: [{ k: 'Applies to', v: 'Anyone who links' }, { k: 'Status', v: 'Plain-language draft' }],
      terms: legalTerms,
      sections: [
        {
          id: 'welcome',
          title: 'Links are welcome',
          plain: 'No permission needed.',
          body: [
            'You are welcome to link to any page of the website of **Hanoryx Systems**, from anywhere, without asking. Sharing a page is the most direct way of telling people about the company’s work.',
            { note: 'This is a plain-language policy written for this site. It is not legal advice and it has not been reviewed by a lawyer.', tone: 'warn', label: 'Please read' },
          ],
        },
        {
          id: 'how',
          title: 'Linking well',
          plain: 'A few habits that help everyone.',
          body: [
            { list: [
              'Use the page’s own title as the link text, or a plain description of it.',
              'Link to the page address itself rather than to files the page loads.',
              'To point at a part of a long document, copy the link from the heading: every section of the legal documents, the handbook and the articles has one.',
              'Add a few words of context so readers know why they are being sent there.',
            ] },
          ],
        },
        {
          id: 'implying',
          title: 'What a link should not imply',
          plain: 'Don’t suggest the company endorses you.',
          body: [
            'A link by itself does not suggest an endorsement. The words around it can. Please do not word a link, or place it, so that it appears the company supports, sponsors or is connected to you when it is not.',
          ],
        },
        {
          id: 'stable',
          title: 'Stable addresses',
          plain: 'Page addresses are meant to last.',
          body: [
            'The site is organised by section: work, systems, development, company, insights, resources, trust and legal. Addresses follow that structure and are intended to stay put.',
            'When a page is retired its address is not simply dropped. It sends visitors to the page that now covers the subject, so old links keep working.',
          ],
        },
        {
          id: 'retired',
          title: 'Retired addresses',
          plain: 'They redirect.',
          body: [
            { table: {
              caption: 'Addresses that redirect',
              head: ['Old address', 'Now goes to'],
              rows: [...redirects.map(([from, to]) => [from, to]), ['/projects/…', '/work (or /work/yk-engine for YK Engine)']],
            } },
          ],
        },
        {
          id: 'framing',
          title: 'Framing and embedding',
          plain: 'Please link instead.',
          body: [
            'The site is not designed to be shown inside another page. Its layout, scrolling, cursor, keyboard shortcuts and overlays assume that they own the window. Please link to the site rather than framing it.',
          ],
        },
        {
          id: 'previews',
          title: 'Previews and search engines',
          plain: 'What the site tells them.',
          body: [
            'Each page sets its own title and description, and the site publishes a page for crawlers that lists every address. The site is a client-rendered application, so previews built by tools that do not run JavaScript may show the site’s general description rather than the page’s own.',
          ],
        },
        {
          id: 'broken',
          title: 'A link that doesn’t work',
          plain: 'Tell the company.',
          body: [
            'If a link to the site stops working, or a redirect lands somewhere wrong, tell the company through the contact page and say which address it was. The page that shows when an address does not exist suggests the nearest real pages.',
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
      type: 'closer',
      kind: 'linkBuilder',
      scene: 'dependency-graph',
      tag: 'End of linking',
      minHeight: 560,
      title: 'Build the link.',
      lede: 'Pick a page and a format. The link, written the way this policy asks, is ready to copy.',
      onward: [{ label: 'Site map', to: '/sitemap' }],
    },
  ],
};

export default page;
