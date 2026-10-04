# What is next

Things that need the owner, a device or a decision — not more code for its own sake.

1. **Real facts for the work pages.** Musebase, the customer-facing product and the internal CRM/data system are described in general terms on purpose. Approved descriptions, screenshots or outcomes can replace them; until then nothing is quoted that cannot be backed up. The word "proprietary" for YK Engine follows the owner's wording — confirm it is the one to keep.
2. **Dates for the timeline.** `company/timeline` is told in phases because no dates are published. If dates are supplied, the scrubber can show them (its track spacing is order, not time, and says so).
3. **Review the legal pages.** `legal/privacy`, `legal/terms`, `legal/cookies` and `legal/accessibility` explain what the site's own code does (Google Fonts is a third-party request; the only browser storage is `hnx.boot.complete`, `hnx.audio.on`, `hnx.search.recent`). They are not legal advice and no one has reviewed them. Update them if analytics, a form backend or another provider is added.
4. **Careers.** The page lists no roles and invents none. Add real openings to `src/data/pages/company-careers.js` when they exist (the areas explorer and the contact studio's `?type=careers` already route interest to the contact page).
5. **Accessibility pass.** Run a screen reader (NVDA/VoiceOver) over the signature pages; check focus order and reading order in the hero objects; confirm contrast on the dimmest labels; check every drag interaction on touch hardware.
6. **Real-device performance.** Measure on a mid-range phone with `/engineering`'s live budget and the dev-only PerfDebug HUD. The scene budget (2 active on desktop, 1 on phones, 0 under reduced motion) is the dial to turn if it is not enough.
7. **Per-route metadata.** The site is a client-rendered SPA: titles and descriptions update per route, but crawlers and link previews that do not run JavaScript only see `index.html`. Pre-rendering would fix that; the page data is already plain JSON, which makes it straightforward.
8. **Keep the catalogues true.** New interactions go in `src/animation/catalog/inventory.js` and the table in `FOREGROUND.md`; new non-prose data keys go in `SKIP_KEYS` in `searchEngine.js`; run `node qa/website-smoke.mjs` and `node qa/foreground-inventory.mjs` before merging.
