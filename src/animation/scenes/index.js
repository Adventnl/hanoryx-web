/* Scene library entrypoint. The actual registration lives in registerAll.js,
   loaded on demand so the (large) scene library is split out of the initial
   bundle. ensureScenes() is idempotent and returns a promise that resolves
   once every scene has self-registered. */
import { listScenes } from '../sceneRegistry';

let promise = null;

export function ensureScenes() {
  if (!promise) promise = import('./registerAll.js');
  return promise;
}

export { listScenes };
