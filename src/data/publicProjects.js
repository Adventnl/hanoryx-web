import snapshot from './github.generated.json';
export { filterPublicProjects, formatProjectDate } from './projectQuery';

export const publicProjects = snapshot.repositories;
export const githubSnapshot = { generatedAt: snapshot.generatedAt, owner: snapshot.owner };

export const projectCategories = ['All', ...new Set(publicProjects.map((project) => project.category))];
export const projectLanguages = [...new Set(publicProjects.flatMap((project) => project.languages.map((language) => language.name)))].sort();

export function getPublicProject(id) {
  return publicProjects.find((project) => project.id === id) || null;
}
