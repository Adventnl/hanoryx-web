import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Explicit curation prevents a newly public personal or forked repository from
// appearing on the company site without review. All metadata still comes from GitHub.
const OWNER = 'Adventnl';
const projects = {
  'hanoryx-web': { category: 'Web', summary: 'The Hanoryx Systems website and its Canvas scene system.', highlights: ['React and Vite route shell with lazy page chunks.', 'A shared frame scheduler and visibility budget govern Canvas scenes.', 'Reduced-motion rendering preserves a still visual state.'] },
  'task-set': { category: 'Product', summary: 'A notes and task application with voice capture, calendar, and live sync.', highlights: ['Notes and tasks are separate, with AI task suggestions controlled by the user.', 'Offline notes persist locally and synchronize when connectivity returns.', 'The README states the Cloudflare deployment has not happened yet.'] },
  'YK-Engine': { category: 'Engine', summary: 'A C++20 game engine, editor, player, and project export tools.', highlights: ['Entity and component data can run in both editor and standalone player.', 'The editor provides scene hierarchy, inspector, debugging, and profiling surfaces.', 'Two data-only demos exercise reusable engine systems.'] },
  'orbit-cloud': { category: 'Platform', summary: 'Infrastructure as code for a bare-metal cloud platform.', highlights: ['The public repository contains Ansible provisioning and Kubernetes configuration.', 'MinIO supplies the documented object-storage layer.', 'Setup scripts and a web UI are included in the repository structure.'] },
  'H3D': { category: 'Engine', summary: 'Forge3D: a C++23 application foundation and editor framework; viewport and rendering work remain future phases.', highlights: ['The current repository covers foundational libraries and an application shell.', 'Operator, command, undo, and workspace models are documented.', 'The README explicitly places the viewport and renderer in later phases.'] },
  'HNX-x86': { category: 'Research', summary: 'An x86-64 operating-system research repository focused on kernel and systems foundations.', highlights: ['The README describes an intended desktop and server operating-system direction.', 'Its roadmap spans memory, scheduling, filesystems, drivers, and tooling.', 'Treat the listed subsystems as goals unless the source documents completion.'] },
  'mocha-browser': { category: 'Tool', summary: 'An experimental Rust browser engine with a limited HTML, CSS, and JavaScript subset.', highlights: ['The public status describes a basic HTML, CSS, layout, and scripting subset.', 'The repository documents HTTP and HTTPS networking foundations.', 'Its README says it is not safe for general browsing yet.'] },
  'Rune': { category: 'Research', summary: 'A small statically typed systems language with a typed core IR and interpreter.', highlights: ['Source passes through lexer, parser, AST, and typed core IR.', 'The interpreter runs the language described in the README.', 'HDL analysis exists; hardware generation is described as a future target.'] },
};

function gh(...args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }));
}

function optionalApi(path) {
  try { return gh('api', path); } catch { return null; }
}

const fields = 'name,description,url,homepageUrl,visibility,isPrivate,isFork,isArchived,primaryLanguage,repositoryTopics,createdAt,updatedAt,pushedAt,stargazerCount,forkCount';
const list = gh('repo', 'list', OWNER, '--limit', '100', '--json', fields);
const selected = list.filter((repo) => projects[repo.name] && repo.visibility === 'PUBLIC' && !repo.isPrivate && !repo.isFork && !repo.isArchived && repo.url === `https://github.com/${OWNER}/${repo.name}`);

const repositories = selected.map((repo) => {
  // A partial API failure must leave the checked-in snapshot intact.
  const languages = gh('api', `repos/${OWNER}/${repo.name}/languages`);
  const release = optionalApi(`repos/${OWNER}/${repo.name}/releases/latest`);
  const root = gh('api', `repos/${OWNER}/${repo.name}/contents`);
  const publicRoot = Array.isArray(root) ? root.filter((entry) => ['dir', 'file'].includes(entry.type) && entry.html_url?.startsWith(`${repo.url}/`)) : [];
  const sourceEntry = (entry) => entry.type === 'dir'
    ? !entry.name.startsWith('.')
    : /^(README(?:\..+)?|package\.json|Cargo\.toml|CMakeLists\.txt|CMakePresets\.json|Makefile|wrangler\.jsonc|vite\.config\.[^.]+)$/i.test(entry.name);
  return {
    id: repo.name.toLowerCase(),
    name: repo.name,
    category: projects[repo.name].category,
    summary: projects[repo.name].summary,
    highlights: projects[repo.name].highlights,
    url: repo.url,
    homepageUrl: /^https:\/\//.test(repo.homepageUrl || '') ? repo.homepageUrl : null,
    primaryLanguage: repo.primaryLanguage?.name || null,
    languages: Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([name, bytes]) => ({ name, bytes })),
    topics: (repo.repositoryTopics || []).map((topic) => topic.name).filter(Boolean),
    rootEntryCount: publicRoot.length,
    rootEntries: publicRoot.filter(sourceEntry).sort((a, b) => Number(b.type === 'dir') - Number(a.type === 'dir') || a.name.localeCompare(b.name)).slice(0, 40).map((entry) => ({ name: entry.name, type: entry.type, url: entry.html_url })),
    createdAt: repo.createdAt,
    pushedAt: repo.pushedAt,
    updatedAt: repo.updatedAt,
    latestRelease: release && !release.draft && !release.prerelease ? {
      name: release.name || release.tag_name,
      tag: release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url,
    } : null,
  };
});

if (!repositories.length) throw new Error('No curated public repositories were returned. Existing generated data was preserved.');
const output = resolve('src/data/github.generated.json');
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify({ source: 'github-public', owner: OWNER, generatedAt: new Date().toISOString(), repositories }, null, 2)}\n`);
console.log(`Wrote ${repositories.length} curated public repositories to ${output}`);
