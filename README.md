# Hanoryx Systems — Website

The corporate website for **Hanoryx Systems** — a young, ambitious advanced software company that builds online systems, management platforms, commerce infrastructure, automation tools, and digital operating environments. The software division is **Hanoryx North**.

The site is a cinematic, **multi-page (30 routes), animation-heavy** experience built to feel like a real-time digital operating environment — a set of distinct technical chambers rather than one long page. Deep black surfaces, white typography, a single restrained red accent. Every section declares **its own animated scene**; there is no single global background. Motion is designed to *flow like a river* — smooth, continuous, high-control — while a performance-first animation engine keeps it frame-consistent on high-refresh displays and light on weaker devices.

---

## Stack

- **React 19** + **Vite** — framework & build
- **react-router-dom 7** — routing (30 real routes)
- **GSAP 3** + **@gsap/react** + **ScrollTrigger** — scroll-linked & timeline motion
- **Lenis** — smooth scrolling, wired into the GSAP ticker
- **motion** (Framer Motion) — page/menu transitions
- **Web Audio API** — real frequency analysis for the audio visualizer
- **clsx**, **lucide-react** — class composition & icons
- **CSS Modules** + a global token design system
- **2D Canvas** for all background scenes (no WebGL dependency — chosen for reliability + performance)

No UI kits, no Tailwind, no templates, no external stock images.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview
npm run lint
```

---

## Animation engine (performance-first)

The core idea: **one scheduler, many cheap scenes, paused when offscreen, quality scaled to the device.**

```
src/animation/
  rafScheduler.js     # ONE requestAnimationFrame loop for the whole app; scenes subscribe/unsubscribe
  motionBudget.js     # device tier + DPR cap + live-FPS downgrade + reduced-motion -> resolveQuality(cost)
  pointer.js          # single global pointer tracker (no per-scene listeners)
  sceneRegistry.js    # name -> scene factory
  scenePalette.js     # canvas colour helpers mirroring the CSS tokens
  easing.js           # math helpers (flow noise, easings, lerp/clamp)
  useViewportActive.js
  scenes/             # 25 self-registering 2D-canvas scene modules (auto-imported via glob)
```

- **Single RAF scheduler.** Every scene/visualizer subscribes to one loop — no uncontrolled `requestAnimationFrame` stacking. The loop stops when nothing is subscribed and resets on tab hide/restore.
- **Scene registry + `SceneCanvas`.** Each scene is a pure draw-factory `({ctx,width,height,quality,accent,density,pointer}) => {draw, resize, dispose}`. `SceneCanvas` renders one scene, **pauses it via IntersectionObserver when offscreen**, caps DPR, scales quality, and tears everything down on unmount.
- **`SectionScene`.** Wraps a section and mounts its declared scene behind the content (`contain: layout paint style` isolates paints). This is how the site has **25 distinct backgrounds instead of one repeated dot field**.
- **Motion budget.** `resolveQuality(cost)` combines a one-time device probe (cores/memory/touch), the reduced-motion setting, a DPR cap, and the live FPS from the scheduler — degrading scene density automatically if frames slip.
- **Reduced motion.** Scenes render a single static frame and never loop; the boot sequence resolves instantly; the custom cursor and Lenis are disabled.

### Scene library (25)

`flow-field · orbital-node · hex-lattice · topographic-lines · polar-radar · wave-interference · spline-ribbon · concentric-gate · network-constellation · data-rain · circuit-trace · redaction-matrix · voronoi-cell · glass-prism · command-terminal · timeline-pulse · liquid-metal · architectural-grid · signal-wave · isometric-module · glyph-field · magnetic-particles · blackout-silhouette · vector-compass · heatmap-grid`

Add a scene by dropping a self-registering module into `src/animation/scenes/` — it is picked up automatically.

---

## Interaction systems

- **`HanoryxCursor`** (`components/cursor/`) — a designed precision cursor: a tight core dot tracks exactly while a reticle follows with GSAP `quickTo`. Elements declare `data-cursor="link|card|nav|redacted|audio"` to morph the reticle. Zero React state on mousemove; fine-pointer only; off under reduced motion.
- **Audio** (`components/audio/`, `app/providers/AudioProvider.jsx`) — a single Web Audio graph (`MediaElementSource → AnalyserNode → destination`) built lazily on the first user gesture. The navbar `AudioSignalButton` shows a **real frequency visualizer** driven by `getByteFrequencyData`; it idles subtly when paused and falls back gracefully if Web Audio is unavailable. Audio never autoplays.
- **`AdvancedNavbar` + `RadialMegaMenu`** (`components/navigation/`) — grouped routes; hovering/focusing a multi-route group **deploys an SVG radial constellation** (rings draw via `stroke-dashoffset`, orbit nodes, connector lines, route preview). Active route is marked with an animated node; background shifts on scroll. A single **"Open Channel"** action replaces the duplicated Contact CTA.

---

## Pages & routing

`src/app/routeConfig.js` is the source of truth: `navGroups` drives the radial menu, `templateRouteKeys` drives the data-routed pages.

- **Bespoke pages:** Home, Contact, Timeline, 404.
- **Data-driven pages:** every other route renders through **`PageTemplate`** from a data object in `src/data/pages/<route>.js` (one file per route, auto-combined by `data/pages/index.js`). Each page = a scene-backed hero + ordered **blocks** (`split`, `cards`, `process`, `modules`, `stats`, `manifesto`, `feature`, `redacted`, `cta`), each block with its **own scene + accent**. Distinct scene/content/block-order per page gives every route its own identity while staying maintainable.

**Routes (30):** `/` · `/systems` (+7 sub) · `/north` (+5 sub) · `/work` (+5 sub incl. Musebase) · `/company` (+3 sub) · `/timeline` · `/contact` · `/legal/privacy` · `/legal/terms` · `*`.

---

## Project structure

```
src/
  app/            App.jsx, routes.jsx, routeConfig.js, providers/ (Animation, Audio, Lenis)
  animation/      the engine (scheduler, budget, registry, scenes/, pointer, easing)
  components/
    audio/        AudioProvider visualizer + nav signal button
    cursor/       HanoryxCursor
    navigation/   AdvancedNavbar, RadialMegaMenu
    page/         PageTemplate, PageBlocks (block renderers)
    scenes/       SceneCanvas, SectionScene
    layout/       SiteShell, MobileNav, Footer, PageTransition
    sections/     ContactSection (form), TimelineSection (scrubbed path)
    ui/ animation/ reusable primitives (Button, Card, DataPanel, KineticText, ScrollReveal, ...)
  data/           company, systems, capabilities, timeline, navigation, pages/<route>.js
  hooks/          audio analyzer, cursor state, reduced-motion, in-view, document title
  pages/          Home, Contact, Timeline, NotFound
  styles/         tokens, globals, typography, layout, animation, effects
  utils/          constants, assetResolver, animation helpers
```

---

## Performance & accessibility

- One RAF loop; offscreen scenes paused (IntersectionObserver); DPR capped; quality auto-downgraded on low FPS; no global always-on background; transform/opacity-only UI motion; `contain` on animated sections.
- `prefers-reduced-motion` honored everywhere; ScrollTriggers scoped via `useGSAP` and killed on route change; canvases and listeners cleaned up on unmount; no React re-render on pointer motion.
- Semantic HTML, keyboard-accessible nav + radial menu, focus styles, skip link, `aria` labels, canvases `aria-hidden`. Boot plays once per session (`sessionStorage`) and is always skippable.

---

## Assets

- `src/assets/HS.jpg` — brand mark · `src/assets/music.mp3` — ambient track (off by default).
- **Optional Musebase logo:** drop any image named `*musebase*` into `src/assets/` — `utils/assetResolver.js` picks it up automatically; otherwise a text wordmark is shown. The build never breaks if it is absent.

## Content notes

Hanoryx Systems is presented as a serious, advanced, deliberately private software company. Unreleased systems are withheld (redacted/classified nodes). **Musebase** is described only as an *advanced management platform* and is one node in a broader roadmap, never the focus. The contact form composes a `mailto:` to **contact@hanoryx.com** (no backend).
