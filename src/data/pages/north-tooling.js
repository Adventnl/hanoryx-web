const page = {
  key: 'north/tooling',
  title: 'Development Tooling',
  accent: '#ff3333',
  hero: {
    scene: 'tooling-console',
    intensity: 'hero',
    eyebrow: 'Hanoryx North / site tooling',
    title: 'Tools that keep the site observable.',
    intro: 'The public website has a concrete development toolchain: Vite builds, a Canvas scene harness, browser interaction checks, and a reviewed GitHub data sync. These are inspectable in the site repository.',
    code: 'TOOL.SITE',
    status: 'PUBLIC SOURCE',
    actions: [
      { label: 'View site source', href: 'https://github.com/Adventnl/hanoryx-web' },
      { label: 'Site engineering', to: '/engineering', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'command-terminal',
      eyebrow: 'In this repository',
      title: 'Tools with a visible job.',
      intro: 'Each item below maps to a real script or runtime system in the public site repository.',
      items: [
        {
          code: 'TOOL.01',
          title: 'Vite build',
          body: 'Builds lazy route chunks and vendor bundles for the static site.',
          tags: ['Vite', 'React'],
          status: 'SITE SOURCE',
        },
        {
          code: 'TOOL.02',
          title: 'Scene smoke harness',
          body: 'Imports each registered Canvas scene and exercises draw calls with a mock two-dimensional context.',
          tags: ['Canvas', 'QA'],
          status: 'SITE SOURCE',
        },
        {
          code: 'TOOL.03',
          title: 'Browser checks',
          body: 'Visits routes at mobile and desktop widths and checks for errors, broken local links, and horizontal overflow.',
          tags: ['Playwright', 'Responsive'],
          status: 'SITE SOURCE',
        },
        {
          code: 'TOOL.04',
          title: 'GitHub snapshot',
          body: 'A local script curates public repository metadata into a checked-in JSON file. Browser code uses the snapshot without an API token.',
          tags: ['GitHub', 'Data'],
          status: 'SITE SOURCE',
        },
      ],
    },
    {
      type: 'split',
      scene: 'build-pipeline',
      eyebrow: 'Feedback loop',
      code: 'TOOL.CHECK',
      title: 'Build, inspect, revise.',
      body: [
        'The scene smoke harness catches import and draw failures before a browser opens. Browser tests then visit routes, exercise interactions, and capture responsive states for visual review.',
        'The public data script is deliberately separate from the browser bundle. Its output can be reviewed as a file diff before publication.',
      ],
      asideLabel: 'CHECKS',
      asideCode: 'TOOL.FLOW',
      points: [
        { k: 'STATIC', v: 'Lint and production build' },
        { k: 'SCENES', v: 'Registry import and draw smoke' },
        { k: 'ROUTES', v: 'Browser errors, links, and overflow' },
        { k: 'VISUAL', v: 'Settled mobile and desktop captures' },
      ],
    },
    {
      type: 'cta',
      scene: 'dependency-graph',
      eyebrow: 'Source',
      title: 'Trace the implementation.',
      body: 'The public site repository provides the actual scripts and runtime code behind this page.',
    },
  ],
};

export default page;
