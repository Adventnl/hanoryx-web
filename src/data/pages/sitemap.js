const page = {
  key: 'sitemap',
  title: 'Site Map',
  accent: '#ff3333',
  aliases: ['directory', 'all pages', 'index', 'map'],
  hero: {
    scene: 'voronoi-cell',
    intensity: 'hero',
    eyebrow: 'Resources / Site map',
    title: 'Every page, in one place.',
    intro:
      'A directory of the whole site, built from the pages themselves. Filter it, or let it choose for you.',
    code: 'SITE.MAP',
    status: 'DIRECTORY',
    actions: [{ label: 'Contact', to: '/contact', variant: 'outline' }],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'siteDirectory',
      anchor: 'directory',
      railLabel: 'The directory',
      scene: 'privacy-quiet-grid',
      minHeight: 900,
      eyebrow: 'The directory',
      title: 'Find a page.',
      intro: 'Type a word and the list narrows as you go. Enter opens a single match.',
    },
  ],
};

export default page;
