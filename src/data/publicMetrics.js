import { publicProjects, projectLanguages } from './publicProjects';

export const publicMetrics = [
  { id: 'm-01', value: publicProjects.length, suffix: '', label: 'Curated public repositories', note: 'GitHub snapshot' },
  { id: 'm-02', value: projectLanguages.length, suffix: '', label: 'Languages represented', note: 'public repositories' },
];
