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
          id: 'words',
          title: 'Words used on this page',
          plain: 'A short dictionary.',
          body: [
            'These words are used the same way throughout. Hover or focus an underlined word anywhere in the document to read its meaning again.',
            { defs: [
              { k: 'Link', v: 'A piece of text, or an image, that takes the reader to another page when it is chosen.' },
              { k: 'Link text', v: 'The words that carry the link. Good link text still makes sense when read on its own.' },
              { k: 'Address', v: 'The line of text that identifies a page, such as hanoryx.com/legal/linking. Also called a URL.' },
              { k: 'Section link', v: 'An address that ends in a hash and a section name, so that the page opens at that section.' },
              { k: 'Redirect', v: 'An instruction that sends a visitor from one address to another.' },
              { k: 'Client-rendered', v: 'Built by scripts in your browser rather than delivered finished. It affects how previews and tools see the site.' },
              { k: 'Preview card', v: 'The title, description and picture that a chat or social app shows when someone pastes a link.' },
              { k: 'Framing', v: 'Showing one site inside a window of another. Also called embedding.' },
            ] },
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
          id: 'recipes',
          title: 'Link recipes',
          plain: 'Four forms to copy and change.',
          body: [
            'Here is the same link, written for four places. Change the title and the address to the page you mean.',
            { sub: 'In a web page', body: [
              { code: '<a href="https://hanoryx.com/legal/privacy">Privacy notice, Hanoryx Systems</a>' },
            ] },
            { sub: 'In Markdown', body: [
              { code: '[Privacy notice, Hanoryx Systems](https://hanoryx.com/legal/privacy)' },
            ] },
            { sub: 'In an email or a message', body: [
              { code: 'Privacy notice, Hanoryx Systems: https://hanoryx.com/legal/privacy' },
            ] },
            { sub: 'To a particular section', body: [
              { code: 'https://hanoryx.com/legal/privacy#cookies' },
              'Add a hash and the section name. The name is the one the section’s own link carries; the next section explains how to get it.',
            ] },
          ],
        },
        {
          id: 'sections',
          title: 'Linking to a section of a long document',
          plain: 'Every section has its own link.',
          body: [
            'The long documents on the site, such as the legal pages, the guides and the handbook, give each section its own link, so that you can point a reader at the exact paragraph you mean.',
            { steps: [
              { title: 'Find the section', body: 'Each section has a numbered heading. The contents list on the side jumps to any of them.' },
              { title: 'Choose the link button', body: 'Next to the heading is a small link button, named “Copy a link to” and then the section’s title. It copies the address with the section name on the end.' },
              { title: 'Paste it', body: 'Anyone who follows it opens the document at that section.' },
            ] },
            { note: 'A page’s address is meant to last. A section’s name is less certain: if a section is renamed or split, the old section link still opens the page but may not scroll to the same place. If a link matters, check it from time to time.', label: 'Worth knowing' },
          ],
        },
        {
          id: 'useful',
          title: 'Some addresses worth knowing',
          plain: 'Places people often link to.',
          body: [
            { table: {
              caption: 'Useful addresses on the site',
              head: ['If you want to send people to', 'Link to'],
              rows: [
                ['The whole site', 'hanoryx.com'],
                ['The list of every page', 'hanoryx.com/sitemap'],
                ['The legal documents', 'hanoryx.com/legal'],
                ['The glossary', 'hanoryx.com/resources/glossary'],
                ['The browser tools', 'hanoryx.com/resources/tools'],
                ['The downloads', 'hanoryx.com/resources/downloads'],
                ['The contact page, with a topic chosen', 'hanoryx.com/contact?type=feedback'],
              ],
            } },
            'The downloads are built in the visitor’s browser, so no file address exists to link to. Link to the downloads page instead.',
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
          id: 'goodtext',
          title: 'Writing links everyone can use',
          plain: 'Link text that still makes sense on its own.',
          body: [
            'Many people move through a page by its links alone: a screen-reader user may call up a list of all the links on a page, and a search engine reads link text to learn what the target is. A link that says “click here” gives them nothing to go on.',
            { table: {
              caption: 'Link text that works and link text that does not',
              head: ['Works', 'Does not work', 'Why'],
              rows: [
                ['Read the privacy notice', 'Click here', 'It says where the link goes, even out of context.'],
                ['Hanoryx Systems’ accessibility statement', 'This page', 'A list of links would show a column of “this page”.'],
                ['The linking policy', 'https://hanoryx.com/legal/linking', 'A long address read aloud letter by letter is a chore.'],
                ['Download the glossary', 'More', 'It names the thing, not the action alone.'],
              ],
            } },
            'If a link opens in a new window or tab, or starts a download, say so in the text. Surprises are what make links hard to use.',
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
          id: 'howredirects',
          title: 'How the redirects work',
          plain: 'Done by the site after it loads, not by the server.',
          body: [
            'When you follow an old address, the site loads, notices that the address has been retired and takes you to its replacement. The redirect is carried out by the site’s own code in your browser. It is not a server instruction.',
            'For people this makes no difference. For automated tools it does: a tool that does not run scripts will not follow the redirect, and will see the site’s general page. If you maintain a link or a bookmark list, update the address instead of relying on the redirect.',
            { note: 'Server-side redirects would make retired addresses work for every tool. The site does not have them yet.', label: 'Open item' },
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
          id: 'previewcards',
          title: 'Preview cards in chats and feeds',
          plain: 'They may show the site, not the page.',
          body: [
            'Each page sets its own title, description and address once it has loaded. Chat and social apps that build a preview card, however, often read only the page as delivered and do not run its scripts. For them the site is one page with one description and one picture.',
            { list: [
              'The preview of a link to any page may show the site’s general description and picture rather than the page’s own.',
              'The page itself, once opened, shows the right title and description.',
              'A line of your own beside the link, saying what the page is, fixes the problem for readers.',
            ] },
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
          id: 'faq',
          title: 'Questions about linking',
          plain: 'Ten short answers.',
          body: [
            { sub: 'Do I need to ask before linking?', body: ['No. Link to any page, from anywhere, without asking.'] },
            { sub: 'Can I link from an advertisement or a paid post?', body: ['You can link. Do not word it so that it appears the company paid for it, supports it or is connected to you, unless that is true.'] },
            { sub: 'Can I link to a page I disagree with?', body: ['Yes. A link is not a statement of agreement, and the site is no worse for being criticised.'] },
            { sub: 'Can I link to an image or a script the site uses?', body: ['Please link to pages instead. Files that pages load can move or change without notice.'] },
            { sub: 'Can I link to a download?', body: ['The downloads are built in the visitor’s browser, so there is no file to link to. Link to the downloads page.'] },
            { sub: 'Can I show the site in a frame on my page?', body: ['Please don’t. The site is built to own the window. Link to it instead.'] },
            { sub: 'Can I use my own address shortener?', body: ['Yes, if the link still arrives at the right page. A short link that hides where it goes is less trustworthy to readers, so say where it leads.'] },
            { sub: 'Will you tell me if an address changes?', body: ['The company has no list of who links, so it cannot. Retired addresses redirect, which keeps most links working.'] },
            { sub: 'What if my link breaks?', body: ['Tell the company through the contact page and say which address it was.'] },
            { sub: 'Can I link to a section that does not seem to scroll?', body: ['Section links scroll after the page has loaded, which can take a moment. If one does not scroll at all, tell the company which one.'] },
          ],
        },
        {
          id: 'changes',
          title: 'Changes',
          plain: 'The version on this page is the current one.',
          body: ['This policy may change. The version on this page is the current one.'],
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
                ['Draft 1.0', 'The first complete policy, written for the site as it stands: links welcome, redirects done in the browser, and a request to link and not frame.'],
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
      kind: 'linkBuilder',
      scene: 'network-constellation',
      tag: 'End of linking',
      minHeight: 560,
      title: 'Build the link.',
      lede: 'Pick a page and a format. The link, written the way this policy asks, is ready to copy.',
      onward: [{ label: 'Site map', to: '/sitemap' }],
    },
  ],
};

export default page;
