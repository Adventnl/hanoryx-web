/* ============================================================
   SEARCH ENGINE — pure functions, no React, no Vite-only APIs.

   A *document* is one page: { id, to, title, section, crumbs, aliases,
   passages: [{ heading, text }] }. Passages are every piece of readable body
   copy on the page (hero intro, block bodies, list items, key/value rows,
   steps...) so search finds what a page SAYS, not just what it is called.

   search() requires every query term to appear somewhere in the document
   (AND), ranks title > heading > body, and returns the best-matching passage
   as an excerpt with highlight ranges the UI renders as <mark>.
   ============================================================ */

const MAX_PASSAGE = 520;

/* Keys that carry structure/styling, not readable copy. */
const SKIP_KEYS = new Set([
  'type', 'scene', 'sceneData', 'intensity', 'accent', 'code', 'to', 'href', 'id', 'key',
  'variant', 'kind', 'status', 'action', 'metricsSource', 'logo', 'icon', 'glyph', 'tone',
  'step', 'size', 'align', 'aliases', 'path', 'actions', 'metrics', 'index', 'order', 'mode',
  'sceneName', 'name_', 'className', 'at', 'value', 'suffix', 'decimals', 'accentColor',
  'search', 'cursor', 'width', 'height', 'columns', 'seed', 'count', 'min', 'max', 'ease',
]);

/* lowercase + strip diacritics so "café" matches "cafe". */
export function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase();
}

export function tokenize(query) {
  return normalize(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function clean(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

/* Walk a page-data object and collect readable passages with the nearest
   heading they sit under. */
export function extractPassages(node, heading = '', out = []) {
  if (node == null) return out;
  if (typeof node === 'string') {
    const text = clean(node);
    if (text.length > 2) out.push({ heading, text: text.slice(0, MAX_PASSAGE) });
    return out;
  }
  if (Array.isArray(node)) {
    if (node.length && node.every((item) => typeof item === 'string')) {
      // tag lists read as one line ("Scheduling · Records") unless they are sentences
      const longest = Math.max(...node.map((item) => item.length));
      if (longest < 28) {
        out.push({ heading, text: node.join(' · ') });
        return out;
      }
    }
    node.forEach((item) => extractPassages(item, heading, out));
    return out;
  }
  if (typeof node === 'object') {
    // { k, v } key/value pair -> one passage
    if (typeof node.k === 'string' && typeof node.v === 'string') {
      out.push({ heading, text: `${node.k} — ${node.v}`.slice(0, MAX_PASSAGE) });
      return out;
    }
    const own = typeof node.title === 'string' ? clean(node.title) : typeof node.name === 'string' ? clean(node.name) : '';
    const h = own || heading;
    if (own) out.push({ heading: h, text: own, isHeading: true });
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.has(key) || key === 'title' || key === 'name') continue;
      extractPassages(value, h, out);
    }
  }
  return out;
}

const SECTION_BY_ROOT = {
  work: 'Work',
  systems: 'Systems',
  north: 'Development',
  engineering: 'Development',
  lab: 'Development',
  company: 'Company',
  contact: 'Company',
  legal: 'Legal',
  sitemap: 'Site',
};

export function sectionOf(path) {
  if (path === '/') return 'Home';
  const root = path.split('/').filter(Boolean)[0];
  return SECTION_BY_ROOT[root] || 'Site';
}

/* Build a searchable document from a page-data object. */
export function buildDocument(page, path) {
  const hero = page.hero || {};
  const passages = [];
  if (hero.eyebrow) passages.push({ heading: page.title, text: clean(hero.eyebrow), isEyebrow: true });
  if (hero.title) passages.push({ heading: page.title, text: clean(hero.title), isHeading: true });
  if (hero.intro) passages.push({ heading: page.title, text: clean(hero.intro).slice(0, MAX_PASSAGE) });
  extractPassages(page.blocks || [], page.title, passages);
  // de-duplicate identical passages
  const seen = new Set();
  const unique = passages.filter((p) => {
    const k = normalize(p.text);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const section = sectionOf(path);
  return {
    id: path,
    to: path,
    title: page.searchTitle || page.title,
    section,
    summary: clean(hero.intro || '').slice(0, 160),
    aliases: (page.aliases || []).map(normalize),
    passages: unique.map((p) => ({ ...p, norm: normalize(p.text) })),
    titleNorm: normalize(page.searchTitle || page.title),
  };
}

/* ---- matching --------------------------------------------------------- */

function wordStart(hay, term) {
  if (hay.startsWith(term)) return true;
  return hay.includes(` ${term}`) || hay.includes(`-${term}`) || hay.includes(`/${term}`);
}

function scoreText(norm, terms, weights) {
  let score = 0;
  let hits = 0;
  for (const term of terms) {
    if (wordStart(norm, term)) {
      score += weights.start;
      hits += 1;
    } else if (norm.includes(term)) {
      score += weights.contains;
      hits += 1;
    }
  }
  return { score, hits };
}

/* Highlight ranges for every term inside `text` (case/diacritic-insensitive). */
export function highlightRanges(text, terms) {
  const norm = normalize(text);
  // normalize() can change length for some scripts; guard so ranges stay valid.
  if (norm.length !== text.length) return [];
  const ranges = [];
  for (const term of terms) {
    if (!term) continue;
    let from = 0;
    while (from <= norm.length) {
      const at = norm.indexOf(term, from);
      if (at === -1) break;
      ranges.push([at, at + term.length]);
      from = at + term.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}

/* A ~150 char window around the first match, with ranges relative to the window. */
export function makeExcerpt(text, terms, width = 150) {
  const all = highlightRanges(text, terms);
  if (!all.length || text.length <= width) {
    return { text, ranges: all, truncatedStart: false, truncatedEnd: false };
  }
  let start = Math.max(0, all[0][0] - 52);
  let end = Math.min(text.length, start + width);
  // snap to word boundaries so we never cut a word in half
  if (start > 0) {
    const space = text.indexOf(' ', start);
    if (space !== -1 && space < all[0][0]) start = space + 1;
  }
  if (end < text.length) {
    const space = text.lastIndexOf(' ', end);
    if (space > all[0][1]) end = space;
  }
  const slice = text.slice(start, end);
  const ranges = all
    .filter(([a, b]) => a >= start && b <= end)
    .map(([a, b]) => [a - start, b - start]);
  return { text: slice, ranges, truncatedStart: start > 0, truncatedEnd: end < text.length };
}

/**
 * search(documents, query, { section, limit })
 * Returns [{ doc, score, excerpt, headingHit, titleRanges }].
 */
export function search(documents, query, { section = 'All', limit = 12 } = {}) {
  const terms = tokenize(query).filter((t) => t.length > 1 || tokenize(query).length === 1);
  if (!terms.length) return [];
  const phrase = normalize(query).replace(/\s+/g, ' ').trim();
  const results = [];

  for (const doc of documents) {
    if (section !== 'All' && doc.section !== section) continue;
    const title = scoreText(doc.titleNorm, terms, { start: 12, contains: 7 });
    const aliasText = doc.aliases.join(' ');
    const alias = aliasText ? scoreText(aliasText, terms, { start: 6, contains: 4 }) : { score: 0, hits: 0 };

    let best = null;
    const covered = new Set();
    for (const passage of doc.passages) {
      const { score, hits } = scoreText(passage.norm, terms, { start: 3, contains: 2 });
      if (!hits) continue;
      terms.forEach((term) => { if (passage.norm.includes(term)) covered.add(term); });
      const bonus = (passage.isHeading ? 2.5 : 0) + (phrase.length > 2 && passage.norm.includes(phrase) ? 4 : 0) + (hits === terms.length ? 3 : 0) - passage.text.length / 1400;
      const total = score + bonus;
      if (!best || total > best.total) best = { passage, total, hits };
    }
    for (const term of terms) {
      if (doc.titleNorm.includes(term) || aliasText.includes(term)) covered.add(term);
    }
    if (covered.size < terms.length) continue; // AND across the whole page

    const score = title.score * 3 + alias.score + (best ? best.total : 0) + (doc.titleNorm === phrase ? 30 : 0) + (doc.titleNorm.startsWith(phrase) ? 12 : 0);
    // Excerpt: prefer a body passage; if only the title matched, show the summary.
    let excerpt = null;
    if (best && !(best.passage.isHeading && normalize(best.passage.text) === doc.titleNorm)) {
      excerpt = { ...makeExcerpt(best.passage.text, terms), heading: best.passage.heading };
    } else if (doc.summary) {
      excerpt = { ...makeExcerpt(doc.summary, terms), heading: doc.title };
    }
    results.push({
      doc,
      score,
      excerpt,
      titleRanges: highlightRanges(doc.title, terms),
      titleHit: title.hits > 0,
    });
  }

  results.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));
  return results.slice(0, limit);
}

/* Per-section result counts for the filter chips. */
export function countBySection(documents, query) {
  const counts = { All: 0 };
  const all = search(documents, query, { limit: 500 });
  for (const r of all) {
    counts.All += 1;
    counts[r.doc.section] = (counts[r.doc.section] || 0) + 1;
  }
  return counts;
}
