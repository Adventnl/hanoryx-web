import { writeFileSync } from 'node:fs';
import { pageRouteKeys, routePath } from '../src/app/routeConfig.js';

const origin = (process.env.SITE_URL || 'https://hanoryx.com').replace(/\/$/, '');
const paths = pageRouteKeys.map(routePath);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`Wrote ${paths.length} sitemap URLs`);
