# Hanoryx Systems — website

The website for **Hanoryx Systems**, a company that builds online systems, software platforms and interfaces. Its development team is **Hanoryx North**.

Deep black surfaces, white typography and a restrained red accent. Every page has an animated 2D Canvas scene behind it, and — the part this codebase is organised around — a **foreground** of its own: interactive diagrams, responsive typography, timelines, builders and small playful controls that make each page feel like a different object, not text laid over a background.

---

## Stack

- **React 19** + **Vite 8 (rolldown)** — route-level and component-level code splitting
- **react-router-dom 7** — routing; **GSAP 3** (+ `@gsap/react`, ScrollTrigger) — scroll-linked motion; **motion** (Framer Motion) — layout and presence animation; **Lenis** — smooth scroll
- **CSS Modules** + a global token system (`src/styles/tokens.css`); registered custom properties (`@property`) for eased pointer and scrub values
- **2D Canvas** for every background scene (no WebGL); **Web Audio** for the intro track's spectrum
- **playwright-core** and **axe-core** (dev only) for the browser and accessibility checks in `qa/`

No UI kit, no Tailwind, no stock imagery.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # sitemap + production build -> dist/
npm run preview
npm run lint
npm run deploy       # build + wrangler deploy (Cloudflare Workers static assets)

node qa/scene-smoke.mjs        # every Canvas scene on a mock 2D context (no browser)
npm run render:icons           # favicon set from public/favicon.svg
npm run render:social          # public/og-image.png from og-image.svg
```

Browser checks need a running site and a Chromium (`QA_BASE=http://127.0.0.1:5173`, `CHROME_PATH=…`) — see [QA](#qa).

Deployment runs on Cloudflare Workers Builds on push to `main`. `wrangler.jsonc` serves `dist/` as static assets with a single-page-app fallback; keep it committed.

---

## How a page is made

Every page is **data**. `src/data/pages/<route>.js` default-exports `{ key, title, accent, aliases, hero, blocks }`, `src/data/pages/index.js` collects them, and `TemplatePage → PageTemplate` renders them. The same data feeds the site search, so what a page says is what can be found.

```js
{
  key: 'company/careers',
  hero: { scene, intensity, eyebrow, title, intro, code, status, actions,
          aside: { kind: 'splitFlap', … } },          // optional hero object
  blocks: [
    { type: 'signature', kind: 'areasExplorer', … },  // a page-specific composition
    { type: 'split' | 'cards' | 'process' | 'modules' | 'stats' | 'manifesto' | 'cta', … },
  ],
}
```

- **Block types** (`components/page/blocks/`) are the shared vocabulary: split (scroll-lit lead + decoding key/value panel), cards (spotlight grid, bento, or drag rail), process (scroll-filled rail), modules (lens columns / ledger), stats (odometers), manifesto (word-by-word scroll text + velocity marquee), cta (pointer light).
- **Signatures** (`components/signatures/`) are the page-specific compositions, one lazy chunk each, registered in `signatures/registry.js` (`signatureRegistry` for blocks, `asideRegistry` for hero objects). A page only downloads the signatures it renders.
- **The foreground toolkit** (`components/fx/`) holds the reusable pieces signatures are built from: `TiltSurface`, `SpotlightCard`, `ProximityText`, `ScrambleText`, `ScrollWords`, `Odometer`, `VelocityMarquee`, `GlideTabs`, `Accordion`, `CompareSlider`, `HoverIndex`, `DragRail`, `ScrollRail`, `Glyph` (27 drawn SVG glyphs), `ProgressRing`, `ArrowLink`, `KeyCap`.
- **Navigation, footer and sitemap** read one source: `src/app/routeConfig.js` (`navGroups`, `pageRouteKeys`, `directory`, `redirects`). A page is added once.

To add a page: write its data file, add its key to `pageRouteKeys` (and to `directory` if it belongs in the footer), run `npm run build`. To add an interaction: write a signature, register it, reference it from page data — see `FOREGROUND.md`.

## Content rules

The copy follows rules that are easy to break by accident — `qa/website-smoke.mjs` checks most of them.

- **Work** shows selected company work: Musebase and YK Engine first, two quieter supporting studies after. No repository counts, language charts or generated GitHub timelines; the **only** external repository link on the site is YK Engine's, on its own page.
- **Nothing is invented.** No client names, launch dates, outcomes or measured results. The company timeline is told in **undated phases**; nothing is derived from repository, commit or deployment dates. Illustrations (diagrams, demos, sample records) say they are illustrations.
- **Contact** is a footer destination with its own page. The email address lives there only; other pages point at the page rather than repeating a `mailto:`.
- **Careers** lists no roles. **Legal** pages describe what the site's own code does and make no promises about anything else.

---

## The animation engine

One scheduler, many cheap scenes, paused when offscreen, quality scaled to the device, loaded on demand.

```
src/animation/
  rafScheduler.js   one requestAnimationFrame loop for the whole app
  motionBudget.js   device tier + DPR cap + reduced motion + FPS -> resolveQuality(cost); maxActiveScenes()
  sceneBudget.js    only the most visible scenes animate (2 on desktop, 1 on phones); the rest hold a frame
  pointer.js        one global pointer tracker        audioBridge.js   shared spectrum snapshot
  sceneRegistry.js  name -> factory                   scenes/          67 Canvas scenes (primitives, presets, base)
  reveal/           33 entrance profiles for <Reveal> / <RevealGroup>
  catalog/inventory.js   the canonical list of animation and foreground systems
```

- Scenes load on demand (`ensureScenes()`), draw at ~30 fps, pause off screen, and render a single still frame under reduced motion.
- `SceneCanvas` takes `still` to render that reduced-motion frame on demand (the Visual Lab uses it).
- A page declares a scene per block (`SectionScene`); text-dense blocks use **calm** scenes — see "Foreground and background" below.

### Route transitions

Navigating does not cover the screen. `features/transitions/` draws a thin red line that travels the viewport (direction depends on the section) with the destination written at its end, while `PageTransition` hands the page over at a dim level (never fully dark). Transform and opacity only; skipped under reduced motion.

### Intro, audio and calibration

`BootSequence` shows the intro; **START** begins the music inside the click (`AudioProvider.start()` is called synchronously, handles a rejected `play()` as a `blocked` state, and the navbar's `AudioSignalButton` shows `idle / loading / live / tap to play / unavailable`). The calibration readout and the log lines are driven by the same progress value and reach 100%. **Skip intro** leaves audio untouched.

The page cannot scroll while the intro is mounted — from the START screen through the final fade — so a visitor always lands on the top of the home page. `SiteShell` holds a `lockScroll()` for as long as `BootSequence` is mounted (`html.scroll-locked`, which also covers reduced motion where Lenis does not exist), and `LenisProvider` remembers a `stop()` requested before its instance is created.

### Search

`Ctrl/⌘ K` or `/` opens `CommandPalette`: a portal overlay anchored near the top (so a growing result list cannot move it), sized for phones, with section chips, highlighted body-text excerpts built from the page data, and full keyboard handling (↑ ↓ Home End, Enter, Escape, click outside, focus return). `searchEngine.js` ignores structural keys when extracting copy (`SKIP_KEYS`) — add to it when a signature introduces data that is not prose.

### Keys and blueprint mode

`?` opens a shortcuts panel; `B` switches **blueprint mode**, which outlines every marked detail on the page, names it (`data-fx` ids) and counts them. The key list lives in `src/data/shortcuts.js` and also drives the keyboard map on the accessibility page.

---

## Performance rules (learned by measuring)

Measured in a software-rendered headless Chromium, so absolute numbers are pessimistic; the comparisons are what matter.

- **No infinite full-screen loops.** The scanline overlay once carried a 28vh band crossing the screen forever; it cost ~15 fps while scrolling (home 42 → 55, Motion Systems 53 → 60 fps once removed). Static overlays are cheap; moving ones are not.
- **No `mask-image` over an animating canvas** (the compositor re-renders a masked surface every frame) — scenes fade with a static gradient overlay instead.
- **Never animate or leave behind `filter`/`backdrop-filter` on a large element.** Opacity and transform only.
- Loops run only while on screen (`useOnScreen`); pointer effects write CSS variables (registered with `@property` so CSS eases them) rather than React state.
- Reduced motion: transitions shortened or removed, nothing loops, Canvas scenes show one frame, the cursor and Lenis switch off, the intro resolves instantly.

### Foreground and background

Backgrounds are strong; the foreground must read first. `qa/scene-metrics.mjs` measures every scene's mid-bright share and fails when a text-dense block uses a scene above the limit (heroes may be busier). Pick from the printed list of calm scenes.

---

## QA

All scripts read `QA_BASE` (default `http://127.0.0.1:5173`) and `CHROME_PATH`. Start `npm run dev` or `npm run preview` first.

| script | what it checks |
| --- | --- |
| `qa/scene-smoke.mjs` | every Canvas scene on a mock 2D context, all qualities (no browser) |
| `qa/website-smoke.mjs` | every page at eight widths (280–1920): loads, no errors, no overflow, header controls inside the viewport; unique titles; links resolve; no stray external or `mailto:` links; footer directory; no Contact in the primary navigation; redirects; 404; favicon files; search opens; at 320 px under reduced motion, nothing loops forever and every heading is visible |
| `qa/interactions.mjs` | START / audio / calibration / skip, navbar reveal, search at three widths, `?` and `B`, mobile menu, Motion Systems scroll smoothness, reduced motion, contact studio, storage inspector |
| `qa/accessibility.mjs` | axe-core (WCAG 2 / 2.1 A and AA, best-practice) over every page at desktop and phone width; fails on any violation |
| `qa/foreground-inventory.mjs` | loads every page, scrolls it, and counts the distinct `data-fx` details that are on screen (plus the overlays that only exist while open); fails under the per-page floor; `--markdown` writes `FOREGROUND-DETAILS.md` |
| `qa/scene-metrics.mjs` | the foreground/background balance rule above |

## Assets

`src/assets/HS.jpg` is the company mark (navbar logo); `public/favicon.svg` redraws the same artwork and the PNG/ICO fallbacks are rendered from it (`npm run render:icons`). `src/assets/music.mp3` is the intro track (off until START). `src/assets/Musebase.jpg` is the Musebase mark.
