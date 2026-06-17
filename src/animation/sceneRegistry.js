/* ============================================================
   SCENE REGISTRY — name -> scene factory.
   A scene factory has the shape:

     function createScene({ ctx, width, height, quality, reduced, accent, density, pointer }) {
       return {
         draw({ time, delta, width, height, quality, pointer, still }) { ... },
         resize(width, height, quality) { ... },   // optional
         dispose() { ... },                          // optional
       };
     }

   Scenes register themselves on import (see scenes/index.js). The renderer
   (SceneCanvas) looks them up by name. Pure draw functions sharing one canvas
   + one rAF loop keep dozens of distinct backgrounds cheap and consistent.
   ============================================================ */

const registry = new Map();

export function registerScene(name, factory) {
  registry.set(name, factory);
}

export function getScene(name) {
  return registry.get(name) || null;
}

export function hasScene(name) {
  return registry.has(name);
}

export function listScenes() {
  return Array.from(registry.keys());
}
