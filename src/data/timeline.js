import { formatProjectDate, publicProjects } from './publicProjects';

export const timelineIntro = {
  eyebrow: 'Public development',
  title: 'A chronology with sources.',
  body: 'Creation dates for curated public repositories. A repository date marks the public record, not the start of an undisclosed product or company milestone.',
};

export const timelineNodes = [...publicProjects]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((project, index) => ({
    id: project.id,
    code: `REPO.${String(index + 1).padStart(2, '0')}`,
    phase: formatProjectDate(project.createdAt),
    title: project.name,
    body: project.summary,
    status: 'PUBLIC',
    redacted: false,
    to: `/projects/${project.id}`,
  }));
