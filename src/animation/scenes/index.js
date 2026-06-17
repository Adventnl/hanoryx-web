/* Auto-registers every scene module in this folder. Each scene file calls
   registerScene(...) at import time, so importing this index makes the whole
   scene library available. New scene files are picked up automatically. */

import { listScenes } from '../sceneRegistry';

const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });

export const SCENE_MODULE_COUNT = Object.keys(modules).length;
export { listScenes };
