export function filterPublicProjects(projects, { query = '', category = 'All', language = 'All' } = {}) {
  const search = query.trim().toLocaleLowerCase();
  return projects.filter((project) => {
    if (category !== 'All' && project.category !== category) return false;
    if (language !== 'All' && !project.languages.some((item) => item.name === language)) return false;
    return !search || [project.name, project.summary, project.category, project.primaryLanguage, ...project.topics]
      .filter(Boolean).some((part) => part.toLocaleLowerCase().includes(search));
  });
}

export function formatProjectDate(value) {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 'Not available' : new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
}
