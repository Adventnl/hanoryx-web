import { githubSnapshot, publicProjects } from '../publicProjects';
import { publicMetrics } from '../publicMetrics';

const page = {
  key: 'company/status',
  title: 'Public Development Status',
  accent: '#ff3333',
  hero: {
    scene: 'status-pulse-grid',
    intensity: 'hero',
    eyebrow: 'Company / Public development',
    title: 'A public source snapshot.',
    intro: 'Repository metadata from GitHub, generated for this site. Dates describe public source activity, not the operational state of private systems.',
    code: 'GH.STATUS',
    status: 'PUBLIC DATA',
    actions: [{ label: 'Explore repositories', to: '/projects' }],
  },
  blocks: [
    {
      type: 'stats',
      scene: 'status-pulse-grid',
      eyebrow: 'Public record',
      title: 'What can be counted.',
      items: publicMetrics,
    },
    {
      type: 'cards',
      scene: 'dashboard-tiles',
      eyebrow: 'Recently pushed',
      title: 'Repository updates.',
      intro: 'Ordered by the latest public push. A push date is not a release, deployment, or service-health indicator.',
      items: [...publicProjects].sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt)).slice(0, 6).map((project) => ({
        code: 'GH.PUBLIC',
        label: project.category,
        title: project.name,
        body: project.summary,
        tags: project.languages.slice(0, 2).map((language) => language.name),
        status: 'PUBLIC',
        to: `/projects/${project.id}`,
      })),
    },
    {
      type: 'modules',
      scene: 'heatmap-control',
      eyebrow: 'Data scope',
      title: 'How this snapshot is made.',
      intro: 'Only reviewed public repositories are included. The site reads a generated file and does not request private GitHub access in the browser.',
      rows: [
        { k: 'SOURCE', v: `GitHub public repositories / ${githubSnapshot.owner}` },
        { k: 'GENERATED', v: new Date(githubSnapshot.generatedAt).toLocaleDateString('en', { dateStyle: 'medium', timeZone: 'UTC' }) },
        { k: 'SCOPE', v: 'Curated public, non-fork repositories' },
      ],
    },
  ],
};

export default page;
