# Hanoryx Systems — Website

The corporate website for **Hanoryx Systems** — an advanced software company that builds online systems, management platforms, commerce infrastructure, automation tools, and digital operating environments. The software division is **Hanoryx North**.

The site is a cinematic, **multi-page (30 routes), animation-heavy** experience built to feel like a real-time digital operating environment — a set of distinct technical chambers, not one long page. Deep black surfaces, white typography, a single restrained red accent. Every section declares **its own animated scene**; there is no single global background. Components are animated too — entrances, hovers, idle micro-motion — so almost nothing is ever fully static, while a performance-first engine keeps it frame-consistent and light on weaker devices.

---

## Stack

- **React 19** + **Vite 8 (rolldown)** — framework & build (route-level code splitting)
- **react-router-dom 7** — routing (30 real routes, all lazy-loaded)
- **GSAP 3** + **@gsap/react** + **ScrollTrigger** — scroll-linked & timeline motion
- **Lenis** — smooth scrolling
- **motion** (Framer Motion) — page/menu transitions + component reveals
- **Web Audio API** — real frequency analysis feeding the audio visualizers
- **clsx**, **lucide-react** — class composition & icons
- **CSS Modules** + a global token design system
- **2D Canvas** for all background scenes (no WebGL dependency — chosen for reliability + performance)
- **playwright-core** (dev only) — headless visual/interaction QA against the system Chrome

No UI kits, no Tailwind, no templates, no external stock images.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview
npm run lint
node qa/scene-smoke.mjs   # validate every scene with a mock 2D context (no browser)
```

---

## Animation engine (performance-first)

The core idea: **one scheduler, many cheap scenes, paused when offscreen, quality scaled to the device, loaded on demand.**

```
src/animation/
  rafScheduler.js     # ONE requestAnimationFrame loop for the whole app; scenes subscribe/unsubscribe
  motionBudget.js     # device tier + DPR cap + live-FPS downgrade + reduced-motion -> resolveQuality(cost)
  pointer.js          # single global pointer tracker (no per-scene listeners)
  audioBridge.js      # shared spectrum snapshot; any scene can react to live audio (idle fallback)
  sceneRegistry.js    # name -> scene factory
  scenePalette.js     # canvas colour helpers mirroring the CSS tokens
  easing.js           # math helpers (flow noise, easings, lerp/clamp)
  animationInventory.js   # canonical catalogue of every animation system (121 entries)
  scenes/
    primitives/       # reusable stateless draw layers (grid, arcs, hex, waves, radial bars,
                      #   particles, nodes, contours, ribbons, voronoi, isometric, redaction,
                      #   glyphs, scan, radar, vector-field, audio-wave)
    presets/          # 42 composed preset scenes built on the primitives
    *.js              # 25 retained base scenes
    registerAll.js    # eager glob of every scene (the code-split boundary)
    index.js          # ensureScenes() — loads registerAll on demand
  componentMotion/    # component (not background) motion grammar
    motionProfiles.js   # easings, springs, reveal variants
    textMotions.jsx     # <RevealText variant=…> (fadeUp|maskUp|scanX|splitY|pop|slideIn, word-split)
    cardMotions.js · buttonMotions.js · formMotions.js · listMotions.js · diagramMotions.js · navMotions.js
```

- **Single RAF scheduler.** Every scene/visualizer subscribes to one loop — no uncontrolled `requestAnimationFrame` stacking. The loop stops when nothing is subscribed and resets on tab hide/restore.
- **Scene registry + `SceneCanvas`.** Each scene is a pure draw-factory `({ctx,width,height,quality,accent,density,pointer,audio}) => {draw, resize, dispose}`. `SceneCanvas` renders one scene, **pauses it via IntersectionObserver when offscreen**, caps DPR, scales quality, and tears everything down on unmount.
- **Lazy scene library.** Scenes register inside `registerAll.js`, which is imported on demand by `ensureScenes()` — the whole library (≈119 KB) is a separate async chunk, never in the initial bundle.
- **Primitives + presets.** Background variety comes from a toolkit of stateless draw primitives composed by per-page preset scenes — a recognisable shape/motion language each, not recolours of one grid.
- **`SectionScene`.** Wraps a section and mounts its declared scene behind the content (`contain: layout paint style` isolates paints). Every block picks a distinct scene preset.
- **Motion budget.** `resolveQuality(cost)` combines a one-time device probe (cores/memory/touch), reduced-motion, a DPR cap, and the live FPS — degrading scene density automatically if frames slip. At most one "hero"-quality scene at a time.
- **Audio bridge.** `AudioProvider` samples the `AnalyserNode` once per frame into `audioBridge`; audio-reactive scenes (`audio-signal-wall`, `radial-audio-core`, `signal-spectrum-field`) read the shared snapshot and fall back to procedural idle motion when nothing is playing.
- **Reduced motion.** Scenes render a single static frame and never loop; component reveals/idle motion are disabled via media queries; the boot resolves instantly; the cursor and Lenis are disabled.

### Scene library (67)

**42 new presets** — `home-core · audio-signal-wall · radial-audio-core · signal-spectrum-field · orbital-command · hex-tunnel · polar-status · topology-pulse · commerce-pipeline · workflow-river · permission-orbit · data-interface-wave · client-portal-gate · research-blackout · motion-curve-field · interface-lab-shape · architecture-layer · tooling-console · musebase-coordination · unknown-silhouette · contact-transmission · status-pulse-grid · privacy-quiet-grid · error-signal-lost · magnetic-vector · radar-cutaway · isometric-infra · redacted-timeline-branch · liquid-glass-operational · node-compression · split-prism · glyph-compiler · compass-vector · heatmap-control · dependency-graph · build-pipeline · scheduling-grid · transaction-wave · trigger-action-pulse · dashboard-tiles · data-stream-ribbons · secure-boundary`

**25 retained base scenes** — `flow-field · orbital-node · hex-lattice · topographic-lines · polar-radar · wave-interference · spline-ribbon · concentric-gate · network-constellation · data-rain · circuit-trace · redaction-matrix · voronoi-cell · glass-prism · command-terminal · timeline-pulse · liquid-metal · architectural-grid · signal-wave · isometric-module · glyph-field · magnetic-particles · blackout-silhouette · vector-compass · heatmap-grid`

Add a scene by dropping a self-registering module into `scenes/` or `scenes/presets/` — it is picked up automatically. Validate every scene headlessly with `node qa/scene-smoke.mjs`.

### Animation inventory

`src/animation/animationInventory.js` catalogues **121 distinct animation systems** (67 background + 54 component/text/nav/form/cursor/transition/overlay/audio). It is a guard against regressions — extend it, never collapse the variety back into a single fade-up. It is never rendered in production.

---

## Interaction systems

- **Navigation hover-intent controller** (`navigation/useNavIntent.js` + `useDismissableLayer.js`). The mega-menu opens only on a **deliberate dwell** (~150 ms, longer on a fast sweep) and closes on **every** dismissal path: route change, menu-link click, outside pointer-down, Escape, scroll/wheel, window blur, focus-out, and the mobile menu opening. A short close delay bridges the nav→panel gap so it never flickers; single-child groups (Timeline/Contact) never deploy a panel.
- **`RadialMegaMenu`** — reads as a **diagram, not a dropdown**: a chamfered HUD field with corner-bracket draw-in, a drawn orbit ring with one node per route, connectors that stroke open from the core, a selector arc that swings to the focused route, and route labels that clip-reveal in a terminal column. Anchored under the hovered item; keyboard accessible.
- **`MobileNav`** — a fully opaque command surface (no content bleed-through) with a connector rail + per-group node markers, not a plain list.
- **Full-page audio visualizer** — `audio-signal-wall` covers the Contact hero (spectrum bars + mirrored reflection + travelling read-head); reacts to live audio, idles procedurally when off. `radial-audio-core` / `signal-spectrum-field` are used on Motion Systems and the Home signal block.
- **`HanoryxCursor`** — a designed precision cursor; elements declare `data-cursor="link|nav|audio"` to morph it. Zero React state on mousemove; fine-pointer only; off under reduced motion.
- **Component motion** — `DataPanel` (every card/module) arms on scroll-in with a corner-bracket draw + reveal scan; cards lift + scan on hover; `StatBlock` has count-up + live pulse dot + idle micro-waveform; `SectionHeader` eyebrows carry a signal ping; buttons have magnetic pull + hover light-sweep + press compression; `RevealText` gives body/manifesto copy distinct reveal languages instead of one fade-up.

---

## Pages & routing

`src/app/routeConfig.js` is the source of truth: `navGroups` drives the radial menu, `templateRouteKeys` drives the data-routed pages.

- **Bespoke pages:** Home, Contact, Timeline, 404 — each lazy-loaded.
- **Data-driven pages:** every other route renders through **`TemplatePage` → `PageTemplate`** from a data object in `src/data/pages/<route>.js` (one file per route, auto-combined). Each page = a scene-backed hero + ordered **blocks** (`split`, `cards`, `process`, `modules`, `stats`, `manifesto`, `feature`, `redacted`, `cta`), each block with its **own distinct scene preset**. Scenes are assigned thematically per page (operational pages get workflow/permission/scheduling scenes; commerce gets pipeline/transaction; research gets redaction/silhouette; etc.) so no two pages feel cloned.

**Routes (30):** `/` · `/systems` (+7 sub) · `/north` (+5 sub) · `/work` (+5 sub incl. Musebase) · `/company` (+3 sub) · `/timeline` · `/contact` · `/legal/privacy` · `/legal/terms` · `*`.

---

## Performance & resilience

- **Code splitting.** Routes are `React.lazy` + `Suspense`; the scene library and page data are separate async chunks; GSAP / motion / Lenis / React are split into cacheable vendor chunks. The initial app chunk dropped from **686 KB → ~48 KB** and the Vite chunk-size warning is resolved.
- **Error boundary.** A render fault in any page/scene drops to a controlled "Signal Fault" panel (with recovery) instead of a white screen; resets on navigation.
- **Dev perf HUD.** `PerfDebug` (dev only) shows live FPS, active rAF subscribers (≈ running scenes), and the current quality tier.
- One RAF loop; offscreen scenes paused; DPR capped; quality auto-downgraded on low FPS; transform/opacity-only UI motion; `contain` on animated sections; ScrollTriggers scoped via `useGSAP` and killed on route change; canvases/listeners cleaned up on unmount; no React re-render on pointer/scroll motion.
- `prefers-reduced-motion` honored everywhere; semantic HTML, keyboard-accessible nav + radial menu, focus styles, skip link, `aria` labels, canvases `aria-hidden`. Boot plays once per session and is always skippable.

---

## QA tooling (`qa/`, dev only — excluded from lint)

- `qa/scene-smoke.mjs` — imports every scene with a mock 2D context and draws frames at all qualities/pointer/audio states; catches runtime errors a build can't.
- `qa/qa.mjs`, `qa/nav-behavior.mjs`, `qa/shots2.mjs` — headless Chrome (playwright-core) route screenshots, nav interaction assertions, console-error capture, mobile + reduced-motion checks.

---

## Assets

- `src/assets/HS.jpg` — brand mark · `src/assets/music.mp3` — ambient track (off by default).
- **Optional Musebase logo:** drop any image named `*musebase*` into `src/assets/` — `utils/assetResolver.js` picks it up automatically; otherwise a text wordmark is shown. The build never breaks if it is absent.

## Content notes

Hanoryx Systems is presented as a serious, advanced, deliberately private software company. Unreleased systems are withheld (redacted/classified nodes). **Musebase** is described only as an *advanced management / coordination platform* and is one node in a broader roadmap, never the focus, and its industry is never revealed. The contact form composes a `mailto:` to **contact@hanoryx.com** (no backend). No fake clients, awards, offices, certifications, or company history.
```
