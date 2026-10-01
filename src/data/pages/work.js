import { publicProjects, projectLanguages } from '../publicProjects';

const page = {
  key: 'work',
  title: 'Work',
  accent: '#ff3333',
  hero: {
    scene: 'node-compression',
    intensity: 'hero',
    eyebrow: 'Hanoryx Systems / Work',
    title: 'Work you can inspect.',
    intro: 'A curated collection of public repositories with source links, language data, and dates. Selected private systems remain described only on their existing public pages.',
    code: 'GH.WORK',
    status: 'PUBLIC SOURCE',
    actions: [
      { label: 'Explore repositories', to: '/projects' },
      { label: 'Development timeline', to: '/timeline', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'cards',
      scene: 'dependency-graph',
      eyebrow: 'Public development',
      title: 'Repositories with a record.',
      intro: 'Descriptions are reviewed against public source. Follow a project to see its metadata and GitHub repository.',
      items: publicProjects.slice(0, 6).map((project, index) => ({
        code: `GH.${String(index + 1).padStart(2, '0')}`,
        label: project.category,
        title: project.name,
        body: project.summary,
        tags: project.languages.slice(0, 3).map((language) => language.name),
        status: 'PUBLIC',
        to: `/projects/${project.id}`,
      })),
    },
    {
      type: 'stats',
      scene: 'status-pulse-grid',
      eyebrow: 'From public source',
      title: 'A measured view.',
      items: [
        { value: publicProjects.length, label: 'Curated public repositories', note: 'GitHub snapshot' },
        { value: projectLanguages.length, label: 'Languages represented', note: 'Public language data' },
      ],
    },
    {
      type: 'cta',
      scene: 'contact-transmission',
      eyebrow: 'Contact',
      title: 'Discuss the work.',
      body: 'Get in touch about software systems, interfaces, or engineering collaboration.',
    },
  ],
};

export default page;
