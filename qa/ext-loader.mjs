/* Node ESM resolver hook: lets extensionless relative imports (Vite-style)
   resolve to their .js file, so we can import src scene modules directly. */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z]+$/i.test(specifier)) {
    try {
      const basePath = fileURLToPath(new URL(specifier, context.parentURL));
      // extensionless file -> .js
      if (!fs.existsSync(basePath) && fs.existsSync(basePath + '.js')) {
        return nextResolve(specifier + '.js', context);
      }
      // directory -> /index.js (matches Vite/bundler resolution)
      if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
        const idx = specifier.replace(/\/$/, '') + '/index.js';
        if (fs.existsSync(fileURLToPath(new URL(idx, context.parentURL)))) {
          return nextResolve(idx, context);
        }
      }
    } catch {
      /* fall through */
    }
  }
  return nextResolve(specifier, context);
}
