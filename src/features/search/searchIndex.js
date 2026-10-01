import { navGroups, templateRouteKeys } from '../../app/routeConfig';
import { publicProjects } from '../../data/publicProjects';

const titleOverrides = {
  'work/north-console': 'Console Architecture Study',
  'work/unknown-system-03': 'Public Work Boundary',
  'work/experimental-interface-program': 'Interface Experiments',
  'company/status': 'Public Development Status',
};
const archivedRoutes = templateRouteKeys.map((key) => ({
  id: `/${key}`,
  title: titleOverrides[key] || key.split('/').at(-1).split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' '),
  detail: `${key.split('/')[0]} page`,
  to: `/${key}`,
}));
const routes = navGroups.flatMap((group) => group.children.map((route) => ({ id: route.to, title: route.label, detail: group.label, to: route.to })));
const additions = [
  { id: '/', title: 'Home', detail: 'Hanoryx Systems', to: '/' },
  { id: '/projects', title: 'Public projects', detail: 'Repository explorer', to: '/projects' },
  { id: '/engineering', title: 'Engineering', detail: 'How this site is built', to: '/engineering' },
  { id: '/lab', title: 'Visual Lab', detail: 'Interactive Canvas scenes', to: '/lab' },
];
const projects = publicProjects.map((project) => ({
  id: `project:${project.id}`,
  title: project.name,
  detail: `${project.category} / ${project.primaryLanguage || 'Source'}`,
  searchText: [project.summary, ...project.highlights, ...project.languages.map((language) => language.name), ...project.topics].join(' '),
  to: `/projects/${project.id}`,
}));
const promotedRoutes = [...new Map([...additions, ...routes].map((item) => [item.id, item])).values()];
const promotedPaths = new Set(promotedRoutes.map((item) => item.to));
export const searchIndex = [
  ...promotedRoutes,
  ...archivedRoutes.filter((item) => !promotedPaths.has(item.to)),
  ...projects,
];

export function searchSite(query) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return searchIndex.slice(0, 9);
  return searchIndex.map((item) => {
    const title = item.title.toLocaleLowerCase();
    const haystack = `${title} ${item.detail} ${item.searchText || ''}`.toLocaleLowerCase();
    const score = terms.reduce((total, term) => total + (title.startsWith(term) ? 4 : title.includes(term) ? 2 : haystack.includes(term) ? 1 : -100), 0);
    return { item, score };
  }).filter(({ score }) => score >= 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, 10).map(({ item }) => item);
}
