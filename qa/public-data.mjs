import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterPublicProjects, formatProjectDate } from '../src/data/projectQuery.js';

const snapshot = JSON.parse(readFileSync('src/data/github.generated.json', 'utf8'));
const allowed = new Set(['hanoryx-web', 'task-set', 'YK-Engine', 'orbit-cloud', 'H3D', 'HNX-x86', 'mocha-browser', 'Rune']);
assert.equal(snapshot.source, 'github-public');
assert.ok(snapshot.repositories.length > 0);
assert.equal(new Set(snapshot.repositories.map((repo) => repo.id)).size, snapshot.repositories.length);
for (const repo of snapshot.repositories) {
  assert.ok(allowed.has(repo.name), `Unreviewed repository: ${repo.name}`);
  assert.equal(repo.url, `https://github.com/Adventnl/${repo.name}`);
  assert.ok(repo.summary && repo.category && repo.createdAt && repo.pushedAt && repo.highlights.length >= 2);
  assert.ok(!('isPrivate' in repo) && !('visibility' in repo), 'Internal visibility fields must not enter browser data');
  assert.ok(repo.languages.every((language) => language.name && Number.isFinite(language.bytes)));
  assert.ok(Number.isInteger(repo.rootEntryCount) && repo.rootEntryCount >= repo.rootEntries.length);
  assert.ok(repo.rootEntries.length <= 40);
  assert.ok(repo.rootEntries.every((entry) => ['dir', 'file'].includes(entry.type) && entry.name && entry.url.startsWith(`${repo.url}/`)));
}
assert.ok(filterPublicProjects(snapshot.repositories, { query: 'GAME ENGINE' }).some((repo) => repo.name === 'YK-Engine'));
assert.ok(filterPublicProjects(snapshot.repositories, { category: 'Research' }).every((repo) => repo.category === 'Research'));
assert.ok(filterPublicProjects(snapshot.repositories, { language: 'Rust' }).every((repo) => repo.languages.some((language) => language.name === 'Rust')));
assert.equal(filterPublicProjects(snapshot.repositories, { query: 'something absent entirely' }).length, 0);
assert.equal(formatProjectDate(null), 'Not available');
assert.equal(formatProjectDate('invalid'), 'Not available');
console.log(`Public data checks passed for ${snapshot.repositories.length} repositories`);
