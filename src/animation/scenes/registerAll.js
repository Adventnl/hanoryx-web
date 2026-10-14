/* Eagerly imports every scene module so each self-registers. This file is the
   code-split boundary: it is only pulled in via ensureScenes() (a dynamic
   import), so the whole scene library lives in its own async chunk instead of
   the initial bundle. Base scenes + presets register; primitives are excluded. */
import.meta.glob(
  ['./*.js', './presets/*.js', '!./index.js', '!./registerAll.js'],
  { eager: true }
);
