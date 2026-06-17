/* Scene smoke test — imports every scene file with a mock 2D context,
   instantiates the factory, resizes, and draws several frames at multiple
   qualities/pointer states. Catches runtime errors (undefined vars, bad math,
   missing helpers) that a Vite build cannot. Run: node qa/scene-smoke.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

// Allow Vite-style extensionless relative imports in the scene modules.
register('./ext-loader.mjs', import.meta.url);

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SCENE_DIRS = [
  path.join(ROOT, 'src/animation/scenes'),
  path.join(ROOT, 'src/animation/scenes/presets'),
];

// ---- mock canvas 2D context ----
function makeGradient() {
  return { addColorStop() {} };
}
function makeCtx() {
  const handler = {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient' || prop === 'createConicGradient')
        return () => makeGradient();
      if (prop === 'measureText') return () => ({ width: 10 });
      if (prop === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, (w | 0) * (h | 0) * 4)), width: w | 0, height: h | 0 });
      if (prop === 'createImageData') return (w, h) => ({ data: new Uint8ClampedArray(Math.max(1, (w | 0) * (h | 0) * 4)) });
      if (prop === 'getLineDash') return () => [];
      if (prop === 'canvas') return { width: 1440, height: 900 };
      // default: a no-op function (covers beginPath, arc, fill, etc.)
      return () => {};
    },
    set() { return true; },
  };
  return new Proxy({}, handler);
}

const { registerScene, getScene, listScenes } = await import(
  pathToFileURL(path.join(ROOT, 'src/animation/sceneRegistry.js')).href
);

const files = [];
for (const dir of SCENE_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.js') && f !== 'index.js' && f !== 'registerAll.js') files.push(path.join(dir, f));
  }
}

let importErrors = 0;
for (const file of files) {
  try {
    await import(pathToFileURL(file).href);
  } catch (e) {
    importErrors += 1;
    console.error(`IMPORT FAIL ${path.relative(ROOT, file)}: ${e.message}`);
  }
}

const names = listScenes();
const pointer = (active) => () => ({ active, x: 720, y: 450, nx: active ? 0.3 : 0, ny: active ? -0.2 : 0, vx: 0, vy: 0 });

let runErrors = 0;
for (const name of names) {
  const factory = getScene(name);
  if (typeof factory !== 'function') {
    runErrors += 1;
    console.error(`NOT A FACTORY: ${name}`);
    continue;
  }
  for (const quality of ['static', 'low', 'medium', 'high']) {
    try {
      const ctx = makeCtx();
      const scene = factory({ ctx, width: 1440, height: 900, quality, reduced: quality === 'static', accent: '#ff3333', density: 1, pointer: pointer(false), audio: () => ({ active: false, bands: new Array(32).fill(0), level: 0 }) });
      if (!scene || typeof scene.draw !== 'function') throw new Error('factory returned no draw()');
      // resize (optional)
      if (scene.resize) scene.resize(1000, 600, quality);
      // a few frames, with/without pointer
      for (let i = 0; i < 5; i += 1) {
        scene.draw({ time: i * 16.7 * 30, delta: 16.7, width: 1000, height: 600, quality, pointer: (i % 2 ? pointer(true) : pointer(false))(), still: quality === 'static', audio: { active: i % 2 === 0, bands: new Array(32).fill(0.5), level: 0.5 } });
      }
      if (scene.dispose) scene.dispose();
    } catch (e) {
      runErrors += 1;
      console.error(`RUNTIME FAIL ${name} @${quality}: ${e.message}`);
    }
  }
}

console.log(`\nscenes registered: ${names.length}`);
console.log(`files scanned: ${files.length}`);
console.log(`import errors: ${importErrors}`);
console.log(`runtime errors: ${runErrors}`);
if (importErrors || runErrors) process.exit(1);
console.log('ALL SCENES OK');
