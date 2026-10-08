import { register } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { pageRouteKeys, routePath } from '../src/app/routeConfig.js';

register('../qa/ext-loader.mjs', import.meta.url);

const { buildDocument } = await import('../src/features/search/searchEngine.js');
const pages = await Promise.all(pageRouteKeys.map(async (key) => {
  const file = `../src/data/pages/${key.replaceAll('/', '-')}.js`;
  const { default: page } = await import(file);
  if (page.key !== key) throw new Error(`${file} declares ${page.key}, expected ${key}`);
  return page;
}));

function wordsIn(value) {
  if (typeof value === 'string') return value.split(/\s+/).length;
  if (Array.isArray(value)) return value.reduce((count, item) => count + wordsIn(item), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce((count, item) => count + wordsIn(item), 0);
  return 0;
}

const documents = pages.map((page) => buildDocument(page, page.path || routePath(page.key)));
documents.sort((a, b) => a.to.localeCompare(b.to));
const catalog = Object.fromEntries(pages.map((page) => {
  const document = page.blocks?.find((block) => block.kind === 'document');
  return [page.key, {
    key: page.key,
    title: page.title,
    searchTitle: page.searchTitle,
    heroTitle: page.hero?.title,
    intro: page.hero?.intro,
    words: wordsIn(page.blocks),
    documentWords: document ? wordsIn(document.sections) : null,
    sectionSizes: document?.sections.map((section) => Math.max(20, wordsIn(section.body))) || [],
    sections: document?.sections.map(({ id, title }) => ({ id, title })) || [],
    hasDemo: Boolean(page.blocks?.find((block) => block.type === 'signature' && block.kind !== 'document')),
  }];
}));

await Promise.all([
  writeFile(new URL('../src/features/search/searchDocuments.generated.json', import.meta.url), JSON.stringify(documents)),
  writeFile(new URL('../src/data/pageCatalog.generated.json', import.meta.url), JSON.stringify(catalog)),
]);
console.log(`Wrote search and page indexes for ${documents.length} pages`);
