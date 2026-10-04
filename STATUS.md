# Status

Updated 2026-10-04.

The site is a data-driven React/Vite app: **33 pages**, each with its own animated Canvas background and its own foreground composition (see `FOREGROUND.md`), plus a 404. Work shows selected company work — Musebase and YK Engine first, an unnamed customer-facing product and an internal CRM/data system as quieter supporting studies. The only GitHub project linked anywhere is YK Engine, on its own page. There are no repository counts, language charts or generated GitHub timelines, and the company timeline is told in undated phases.

Nothing has been deployed from this branch.

## What changed in the latest pass

- **Foreground.** Every page has a signature composition and most heroes carry an interactive object: 36 signature blocks, 12 hero objects, a 17-piece toolkit (`components/fx`), and global pieces (route current, command search, shortcuts panel, blueprint mode, the cursor). `FOREGROUND.md` lists them page by page.
- **Five reported bugs.** START begins the intro music inside the click and the navbar audio control follows playback (a rejected `play()` is handled, Skip intro still works); the lower calibration readout reaches 100% with the main one; the navbar is visible once the site is revealed and its background eases in on scroll; search is a centred portal overlay that reads page body text and case-study copy with highlighted excerpts; Motion Systems scrolls without lag.
- **Content and navigation.** Contact left the primary and mobile menus for the footer and a dedicated page (the address lives only there); the footer is a directory of 27 real pages; Careers and four legal pages were added; the header chrome says "Live"; the favicon set is drawn from the same mark as the navbar.
- **Cost.** The always-on scanline sweep was removed (~15 fps on Motion Systems and Home), loud backgrounds were taken out of text blocks, and route changes use a travelling line instead of a cover.
- **Palette exit.** The section chips and result rows of the search overlay glide with a CSS-driven highlight instead of Motion `layoutId`. A running layout animation kept the dialog in the DOM for ~300 ms after it had faded; it now leaves in ~265 ms.

## Checks run on this state

| check | result |
| --- | --- |
| `npm run lint` | clean |
| `npm run build` | passes |
| `node qa/scene-smoke.mjs` | 67 scenes, no import or runtime errors |
| `node qa/website-smoke.mjs` (prod build) | 18/18 — every page at six widths (320–1920), no errors or horizontal overflow, unique titles, links resolve, only the YK Engine repository is external, `mailto:` only on the contact page, footer directory, no Contact in primary nav, redirects, 404, favicon files, search opens |
| `node qa/interactions.mjs` (prod build) | 41/41 — START / audio / calibration / skip, navbar reveal, search at 1440, 390 and 320, `?` panel, blueprint mode, mobile menu, reduced motion, contact studio, storage inspector |
| Motion Systems scroll (headless, software-rendered) | 60 fps, p95 16.7 ms, no slow frames |
| `node qa/scene-metrics.mjs` | text-dense blocks use calm scenes; heroes readable |
| `node qa/foreground-inventory.mjs` | 33 routes, 88 distinct marked details, 602 placements |

## Limits of those checks

- Headless Chromium here renders in software, so absolute frame rates are pessimistic; no real phone was used.
- The foreground count is the number of distinct `data-fx` markers that rendered. Plain hover, focus and press states that are not marked are not in it.
- Keyboard and touch alternatives exist for the pointer-first demos, but there has been no formal accessibility audit and no screen-reader pass.
- The privacy, terms, cookies and accessibility pages describe what the site's own code does in plain language. They have not been reviewed by the owner or by a lawyer and make no promises beyond the site.
- The company timeline has no dates because none are published; real phases and dates are the owner's to supply.
