/* ============================================================
   ASSET RESOLVER — single source for static assets.
   Optional brand assets (e.g. a Musebase logo) resolve gracefully:
   if the file is not present, the site falls back to a text mark
   and never breaks the build.
   ============================================================ */

import brandMark from '../assets/HS.jpg';
import musicTrack from '../assets/music.mp3';

export const brandLogo = brandMark;
export const musicSrc = musicTrack;

/*
 * Resolve an optional Musebase logo from /assets without hard-coding a
 * filename. Any image whose name contains "musebase" is picked up.
 * import.meta.glob is evaluated at build time and returns {} if nothing
 * matches, so a missing asset is a no-op rather than an error.
 */
const musebaseCandidates = import.meta.glob(
  '../assets/*.{jpg,jpeg,png,svg,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

const musebaseEntry = Object.entries(musebaseCandidates).find(([path]) =>
  /musebase/i.test(path)
);

export const musebaseLogo = musebaseEntry ? musebaseEntry[1] : null;
export const hasMusebaseLogo = Boolean(musebaseLogo);

/* Generic resolver for any optional asset by name fragment. */
export function resolveOptionalImage(fragment) {
  const entry = Object.entries(musebaseCandidates).find(([path]) =>
    new RegExp(fragment, 'i').test(path)
  );
  return entry ? entry[1] : null;
}
