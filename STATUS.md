# Status

Updated 2026-10-09.

The site is a data-driven React/Vite app: **86 pages** (33 when this body of work began), each with its own animated Canvas background and its own foreground composition (see `FOREGROUND.md`), plus a 404. Work shows selected company work — Musebase and YK Engine first, an unnamed customer-facing product and an internal CRM/data system as quieter supporting studies. The only GitHub project linked anywhere is YK Engine, on its own page. There are no repository counts, language charts or generated GitHub timelines, and the company timeline is told in undated phases.

Nothing has been deployed from this branch.

## Performance and cleanup pass (2026-10-09)

- The 86 routes still use the documented data-driven page model. The current route loads its own data; hovering or focusing a link warms that destination. The app no longer downloads all page modules in the background.
- Search now fetches one generated full-text index when opened. Listings and the page-list download use a smaller generated catalog. Both are built from page data at dev startup and production build time.
- A pointer effect stops its frame loop when settled, and reduced-motion pages paint offscreen canvases only when they approach view. Search and catalog failures show a retry action. Dead duplicate route/constants data was removed, and the canonical site origin has one runtime source.
- Local headless Chrome, seven seconds after loading home: 151 → 58 requests, 127 → 34 scripts, and about 687 → 384 KB transferred. First search open was ready in about 99 ms in local mobile emulation; its single index transfer was about 337 KB compressed. These are local checks, not real-device or field metrics.
- The downloads page and privacy notice now describe the page catalog request accurately. No change has been deployed.

### Checks for this pass

| check | result |
| --- | --- |
| `npm run build`, `npm run lint`, `npm test`, `git diff --check` | pass on the final source |
| `QA_BASE=http://127.0.0.1:4173 npm run qa:loading` | 7/7: initial loading budget, search, and retry after index/catalog failures |
| `node qa/tools.mjs` (production preview) | 27/27 on the final build, including all 12 downloads |
| `node qa/website-smoke.mjs` (production preview) | 32/32 across 86 routes at eight widths on the earlier build in this pass; the final catalog changes were checked separately on affected routes |
| `node qa/interactions.mjs` (production preview) | 86/86 on the earlier build in this pass; search was rechecked on the final build |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |

The full browser sweeps ran before the final error-state and copy changes; targeted checks covered every catalog-backed route on the final build. Real phones, Firefox and Safari remain unmeasured.

## What changed in the previous pass (2026-10-06)

- **Four things that were reported.** The search overlay's padding is even; every page's closing "go to contact" block is gone and replaced by an ending of its own (84 different ones; the contact page and the site map end on their own content); a menu opens on the *first* hover (a smooth-scroll tail used to cancel the pending open); and the footer is a directory of the whole site, not a second navigation bar.
- **53 new pages.** A legal centre of ten documents, a trust centre (live status measured in your own browser, security disclosure, third-party services, licences), eight guides in Insights, a resource centre (glossary, release notes, downloads, five browser tools), the development handbook, tokens, stack, quality and accessibility pages, systems and work reference pages, company pages (principles, security, timeline, careers, how we work, hiring, questions, press, brand), the interface kit's seven pages and a page that shows the page blocks.
- **Long-form legal documents.** Each of the ten is a real reader — contents rail, find-in-document, section links, a one-line summary on every section, print view — with a word list that defines terms on hover, tables, worked examples, questions and a version history: accessibility 5.6k words, terms 4.9k, privacy 4.9k, cookies 4.3k, acceptable use 3.6k, copyright 3.5k, disclaimers 3.2k, retention 3.0k, complaints 2.9k, linking 2.7k. They were checked against the code, not against any law, and say so. Open items are flagged on the pages (see `WHATS-NEXT.md`).
- **An interface kit.** 61 components in six families (inputs, navigation, feedback, data display, overlays, content and layout), each with a live example, its code, its props and its keyboard behaviour on `/north/components`, with seven endings that use them.
- **Page blocks.** Twelve data-first block types built from the kit (callout, table, timeline, faq, compare, snippet, tabs, quote, checklist, facts, links, numbers) join the eight that were built for the site; `data/blockTypes.js` lists all twenty and `/north/blocks` shows each at work. Four existing pages now use them.
- **Accessibility that the statement can stand on.** Page changes are announced and focus moves to the new page's main region; the single-key shortcuts can be switched off (WCAG 2.1.4); every page's text is measured for contrast as painted (`qa/contrast.mjs`) and small labels, dimmed steps and decorative codes were raised to 4.5 : 1 or hidden from assistive technology; the call-to-action block type was deleted.
- **Honesty fixes.** The readiness check no longer says "ready" until enough has been answered; the copyright notice says "third-party" where GSAP is not open source; the privacy notice describes the device traits the motion budget reads; the privacy notice names the one button on the status page that makes requests.

## Checks recorded for the previous pass

| check | result |
| --- | --- |
| `npm run lint` | clean |
| `npm run build` | passes (every page is its own chunk; the largest legal document is about 30 kB, 10 kB gzipped) |
| `node qa/scene-smoke.mjs` | 67 scenes, no import or runtime errors |
| `node qa/scene-metrics.mjs` | text-dense blocks use calm scenes (56 of the 67 scenes qualify); heroes readable |
| `node qa/endings.mjs` | 13/13 — 84 pages close on 84 different compositions, none a call to action; the block catalogue and the page loader list the same 20 kinds; every internal link written in the page data goes to a real page |
| `node qa/website-smoke.mjs` (prod build) | 32/32 — every page at eight widths (280–1920), no errors or horizontal overflow, the header's controls inside the viewport, unique titles, links resolve, only the YK Engine repository is external, `mailto:` only on the contact page, retired wording absent, the footer a directory of the whole site, no Contact in the primary navigation, redirects, 404, favicon files, search opens; at 320 px under reduced motion also no infinite animations and a fully visible heading |
| `node qa/interactions.mjs` (prod build) | 86/86 — START / audio / calibration / skip, the page cannot scroll during the intro, search at three widths, a menu's first hover (fresh, after a scroll, shortly after), `?` and blueprint mode, the shortcut switch, the mobile menu, the footer on desktop and phone, Motion Systems scroll (60 fps), reduced motion, contact studio, storage inspector, and the page-change announcer (title said, focus handed to main, back button too) |
| `node qa/tools.mjs` (prod build) | 27/27 — contrast, type scale, cron, readiness, decision record, all 89 glossary terms, all 12 downloads built, all 10 release-note chapters, and a distinctive word finding each new section's page in the search |
| `node qa/controls.mjs` (prod build) | desktop 86/86 pages, 1,832 controls operated; phone 86/86 pages, 1,408 controls — no console error, fault panel or sideways overflow |
| `node qa/kit.mjs` (prod build) | desktop and phone 6/6 families — all 61 components opened, their four tabs checked against the catalogue and their live examples operated |
| `node qa/accessibility.mjs` (prod build) | axe-core (WCAG 2 / 2.1 A and AA and best practice), 86 pages at 1280 and 390 px: no violations |
| `node qa/contrast.mjs` (prod build) | 86 pages, desktop (24,451 pieces of text) and phone width (16,283): every piece of text as painted reaches 4.5 : 1 (3 : 1 if large). The first full pass found text below target on 66 of the 85 pages then in the site (about 8% of the visible text on a sample of twelve) — small mono labels and "not yet" states — and every case was fixed. Text over the animated backgrounds is not measurable |
| `node qa/foreground-inventory.mjs` (prod build) | 86 routes · **612 distinct marked details on screen** (96 on more than one route) · 4,462 across the pages, each page's own list summed (40–71 per page). The list is in `FOREGROUND-DETAILS.md` |

## Limits of those checks

- Headless Chromium here renders in software, so absolute frame rates are pessimistic; no real phone was used.
- The foreground count is the number of distinct `data-fx` markers that were on screen. Plain hover, focus and press states that are not marked are not in it, and several markers are one toolkit effect used in different compositions.
- Automated checks are clean, but there has been no formal accessibility audit, no keyboard-only walk of every demo, no screen-reader pass, no voice-control or switch testing, no real phone or tablet, and no Firefox or Safari. axe-core and the contrast script cannot measure text over the animated canvas backgrounds.
- The legal, trust, insight, resource and reference pages are drafts for the owner: plain-language descriptions of what the site's own code does and general guidance in the company's voice. None has been reviewed by the owner or by a lawyer, and none makes a promise beyond the site.
- The company timeline, the documents' version tables and the guides carry no dates because none are published.
- **The intro track.** The tags in `src/assets/music.mp3` name a third-party song's instrumental; see `WHATS-NEXT.md` before the site goes anywhere public.
