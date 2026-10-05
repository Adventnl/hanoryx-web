const page = {
  key: 'trust/licences',
  title: 'Licences & Notices',
  accent: '#ff3333',
  aliases: ['open source', 'licenses', 'licences', 'notices', 'attribution', 'dependencies', 'mit', 'oss', 'packages', 'sbom'],
  hero: {
    scene: 'hex-lattice',
    intensity: 'hero',
    eyebrow: 'Trust / Licences & notices',
    title: 'Built on other people’s work.',
    intro:
      'Every library and typeface this site is made with, its version and its licence — read from the packages themselves — and a notices file you can keep.',
    code: 'TRUST.03',
    status: 'THE FULL LIST',
    actions: [
      { label: 'See the list', to: '/trust/licences#list' },
      { label: 'Copyright & marks', to: '/legal/copyright', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'licenceTable',
      anchor: 'list',
      railLabel: 'The list',
      scene: 'architectural-grid',
      minHeight: 820,
      eyebrow: 'The list',
      title: 'Twenty-four things, and their licences.',
      intro: 'Search it, sort it, or filter to what ships to visitors. The bar shows how the licences are spread.',
      note: 'Names, versions and licences are those published by each package, as recorded when the site was last built. Licence texts are in each package’s own repository. The three typefaces are delivered by Google Fonts under the SIL Open Font License.',
    },
    {
      type: 'split',
      anchor: 'reading',
      railLabel: 'Reading the list',
      scene: 'topographic-lines',
      eyebrow: 'Reading the list',
      code: 'LIC.01',
      title: 'Most of it is the most permissive kind.',
      body: [
        'Nearly everything the site ships is under permissive licences that ask for little more than that the licence notice is kept. A few build and test tools carry different terms, and the animation library is under its own “no charge” licence from its authors.',
        'Build and test tools never reach a visitor: they run on the developer’s machine, not in your browser. They are listed so the picture is complete.',
      ],
      asideLabel: 'THREE GROUPS',
      asideCode: 'LIC.MAP',
      points: [
        { k: 'IN THE SITE', v: 'Libraries that ship to your browser' },
        { k: 'BUILD & TEST', v: 'Tools that run on the developer’s machine' },
        { k: 'TYPEFACES', v: 'Delivered by Google Fonts, under open font licences' },
      ],
    },
    {
      type: 'closer',
      kind: 'noticeFile',
      scene: 'hex-lattice',
      tag: 'End of the notices',
      minHeight: 520,
      title: 'The whole list, as a file.',
      lede: 'Built on the spot from the same data as the table above. Read it here, copy it, or take it with you.',
      onward: [{ label: 'Copyright & marks', to: '/legal/copyright' }, { label: 'Trust centre', to: '/trust' }],
    },
  ],
};

export default page;
