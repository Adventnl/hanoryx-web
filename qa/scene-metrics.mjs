/* Scene balance — keep the background from drowning the foreground.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/scene-metrics.mjs
 *
 * Renders every registered Canvas scene at medium quality in the browser, measures
 * how much of the frame is mid-bright (luminance above 0.12), and then reads every
 * page's data to check the rule that keeps copy readable:
 *   - text-dense blocks (everything but heroes and closing bands) must use a scene
 *     whose mid-bright share is at most LIMIT_BLOCK
 *   - heroes may be busier, up to LIMIT_HERO, because their copy is large
 * It prints the scenes it would reject so a page author can swap one for a calmer
 * scene (the table is sorted quietest first).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'node:module';
import { BASE, launch, newContext, pause, reporter } from './lib.mjs';

register('./ext-loader.mjs', import.meta.url);

const LIMIT_BLOCK = 0.0045;
const LIMIT_HERO = 0.05;
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

/* 1. measure the scenes in the browser */
const browser = await launch();
const context = await newContext(browser, { width: 1440, height: 900 });
const page = await context.newPage();
await page.goto(BASE + '/lab', { waitUntil: 'domcontentloaded' });
await pause(2500);
const metrics = await page.evaluate(async () => {
  const registry = await import('/src/animation/sceneRegistry.js');
  const library = await import('/src/animation/scenes/index.js');
  await library.ensureScenes();
  const W = 1200;
  const H = 700;
  const out = {};
  for (const name of registry.listScenes()) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    try {
      const pointer = { x: W / 2, y: H / 2, nx: 0, ny: 0, active: false, influence: 0 };
      const scene = registry.getScene(name)({ ctx, width: W, height: H, quality: 'medium', reduced: false, accent: '#ff3333', density: 1, sceneData: undefined, pointer: () => pointer, audio: () => ({ level: 0, bins: [] }) });
      for (let i = 0; i < 40; i += 1) scene.draw({ time: i * 33, delta: 33, width: W, height: H, quality: 'medium', progress: 0.5, pointer, audio: { level: 0, bins: [] }, still: false });
      const d = ctx.getImageData(0, 0, W, H).data;
      let mid = 0;
      for (let i = 0; i < d.length; i += 4) if (((0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255) * (d[i + 3] / 255) > 0.12) mid += 1;
      out[name] = mid / (W * H);
      scene.dispose?.();
    } catch {
      out[name] = null;
    }
  }
  return out;
});
await browser.close();

/* 2. read every page's data and check the scenes it uses */
const r = reporter('scene balance');
const dir = path.join(ROOT, 'src/data/pages');
const offenders = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const page = (await import(pathToFileURL(path.join(dir, file)).href)).default;
  if (!page?.key) continue;
  const check = (scene, limit, where) => {
    if (!scene) return;
    const m = metrics[scene];
    if (m == null) offenders.push(`${page.key} ${where}: unknown scene ${scene}`);
    else if (m > limit) offenders.push(`${page.key} ${where}: ${scene} is too busy (${m.toFixed(4)} > ${limit})`);
  };
  check(page.hero?.scene, LIMIT_HERO, 'hero');
  (page.blocks || []).forEach((block, i) => {
    if (block.type !== 'cta') check(block.scene, LIMIT_BLOCK, `block ${i + 1} (${block.type}${block.kind ? ` ${block.kind}` : ''})`);
  });
}
r.check('text-dense blocks use calm scenes and heroes stay readable', offenders.length === 0, offenders.join(' ; '));
const table = Object.entries(metrics).filter(([, m]) => m != null).sort((x, y) => x[1] - y[1]);
console.log(`\nQuietest first (share of mid-bright pixels):\n  ${table.map(([n, m]) => `${n} ${m.toFixed(4)}`).join('\n  ')}`);
const quiet = Object.entries(metrics).filter(([, m]) => m != null && m <= LIMIT_BLOCK).map(([n]) => n);
console.log(`\n${quiet.length} of ${Object.keys(metrics).length} scenes are calm enough for text-dense blocks:\n  ${quiet.join(', ')}`);
r.done();
