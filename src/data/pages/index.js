/* Combines every per-route page-data module into a map keyed by `key`.
   Each file in this folder default-exports a page object { key, title, hero,
   blocks }. Splitting per file means many pages can be authored in parallel
   without touching a shared file. New files are picked up automatically. */

const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });

export const pages = {};
for (const mod of Object.values(modules)) {
  const page = mod.default;
  if (page && page.key) pages[page.key] = page;
}

export const PAGE_DATA_COUNT = Object.keys(pages).length;
