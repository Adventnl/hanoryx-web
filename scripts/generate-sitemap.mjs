import { writeFileSync } from 'node:fs';
import { templateRouteKeys } from '../src/app/routeConfig.js';
import snapshot from '../src/data/github.generated.json' with { type: 'json' };

const origin = (process.env.SITE_URL || 'https://hanoryx.com').replace(/\/$/, '');
const paths = ['/', '/contact', '/timeline', '/projects', '/engineering', '/lab', ...templateRouteKeys.map((key) => `/${key}`), ...snapshot.repositories.map((repo) => `/projects/${repo.id}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`Wrote ${paths.length} sitemap URLs`);
