# Hanoryx Systems — Website

The corporate website for **Hanoryx Systems** — a young, ambitious advanced software company that builds online systems, management platforms, automation tools, and digital operating environments. The software division is **Hanoryx North**.

The site is a cinematic, animation-heavy, multi-page experience built to feel like a controlled digital operating environment: deep black surfaces, white typography, a single restrained red accent, procedural background motion, a system boot sequence, smooth scrolling, and scroll-linked reveals. Motion is designed to *flow like a river* — slow, continuous, and high-control.

---

## Stack

- **React 19** + **Vite** — app framework & build tooling
- **react-router-dom 7** — client-side routing
- **GSAP 3** + **@gsap/react** (`useGSAP`) + **ScrollTrigger** — scroll-linked & timeline animation
- **Lenis** — smooth scrolling, wired into the GSAP ticker
- **motion** (Framer Motion) — route/page transitions, mega-menu & mobile-menu animation
- **clsx** — class composition
- **lucide-react** — line icons
- **CSS Modules** + a global token-based design system — styling

No UI kits, no Tailwind, no templates, no external stock images. The background field is a hand-written 2D canvas flow field (no WebGL dependency) for reliability and performance.

---

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

Requires Node 18+.

---

## Project structure

```
src/
  app/
    App.jsx                  # providers + shell + routes (composition only)
    routes.jsx               # route table inside <AnimatePresence>
    providers/
      AnimationProvider.jsx  # registers GSAP plugins + defaults, keeps triggers fresh
      LenisProvider.jsx      # Lenis smooth scroll, ticker wiring, scroll-reset on route change
      lenis-context.js       # context + useLenis() (scrollTo/stop/start)
  assets/                    # HS.jpg (brand), music.mp3, Musebase.jpg (optional logo)
  components/
    layout/                  # SiteShell, Navbar, MegaMenu, MobileNav, Footer, PageTransition
    animation/               # BootSequence, FlowFieldCanvas, CursorField, ScrollReveal,
                             #   KineticText, MagneticButton, ParallaxLayer, AnimatedCounter,
                             #   SectionPin, SystemGrid, ScanlineOverlay, NoiseOverlay,
                             #   RedactionReveal, AudioControl
    ui/                      # Button, Card, Pill, SectionHeader, StatBlock, MarqueeRail,
                             #   TimelineNode, RedactedTag, GlitchLine, DataPanel, PageHero
    sections/                # composed page sections (HeroSystem, CompanySignal, …)
  data/                      # company.js, navigation.js, systems.js, timeline.js, capabilities.js
  hooks/                     # usePrefersReducedMotion, useMousePosition, useElementInView,
                             #   useAudioController, useDocumentTitle
  pages/                     # Home, Systems, HanoryxNorth, Work, Timeline, Contact, NotFound
  styles/                    # tokens.css, globals.css, typography.css, layout.css,
                             #   animation.css, effects.css
  utils/                     # constants.js, animation.js, assetResolver.js
  main.jsx                   # entry: BrowserRouter + global style imports
```

### Architectural principles

- **`App.jsx` only wires providers, the shell, and routes.** All visual/content work lives in the component, section, and page layers.
- **Design system in `styles/`.** `tokens.css` is the single source of truth for color, type, spacing, radii, z-index, shadows, durations, and easings. Components reference tokens via `var(--…)` and never hardcode values.
- **CSS Modules per component** for scoped styling, composed with `clsx`, on top of global utility classes (`container`, `section`, `glass`, `eyebrow`, `heading-*`, etc.).
- **Content lives in `data/`**, not in markup — the whole site is data-driven.
- **Reusable primitives** (`ui/`, `animation/`) are composed into **sections**, which are composed into thin **pages**.

---

## Animation architecture

| System | Where | Notes |
| --- | --- | --- |
| Boot sequence | `animation/BootSequence.jsx` | HUD calibration, terminal feed, counter, kinetic swipes. Plays once per session (`sessionStorage`), always skippable, never traps the user. |
| Smooth scroll | `providers/LenisProvider.jsx` | Lenis on the GSAP ticker; disabled under reduced motion (native scroll). |
| Scroll reveals | `animation/ScrollReveal.jsx`, `KineticText.jsx` | `useGSAP` + ScrollTrigger; auto-cleaned on unmount. |
| Page transitions | `layout/PageTransition.jsx` + `app/routes.jsx` | `motion` + `AnimatePresence` (fade / blur / slide). |
| Background field | `animation/FlowFieldCanvas.jsx` | Cursor-reactive 2D canvas particle/flow field; thinned on mobile, static under reduced motion, cleaned up on unmount. |
| Cursor accent | `animation/CursorField.jsx` | Additive trailing ring/dot; fine-pointer only, off under reduced motion. |
| Ambient overlays | `animation/ScanlineOverlay.jsx`, `NoiseOverlay.jsx` | Subtle CRT scanline + film grain. |
| Magnetic controls | `animation/MagneticButton.jsx` | Pointer-pull via `gsap.quickTo`. |
| Timeline path | `sections/TimelineSection.jsx` | Scroll-scrubbed connecting line that "flows" like a data stream. |
| Redaction | `animation/RedactionReveal.jsx`, `ui/RedactedTag.jsx` | Classified content sweeps/decrypts into view. |

### Accessibility & performance

- **`prefers-reduced-motion` is respected everywhere** — continuous animation freezes, transitions collapse, the canvas renders a single static frame, and the boot sequence resolves instantly.
- The boot sequence is **gated to once per session** and is **always skippable**.
- **Audio never autoplays** — it starts only on a user gesture (the boot `START` control or the audio toggle) and the preference persists for the session.
- Keyboard-accessible controls, a skip-to-content link, semantic landmarks, and `aria` labels on icon-only controls.
- GSAP work runs through `useGSAP` (scoped, auto-reverting) so **ScrollTriggers are killed on route change / unmount**; the canvas and event listeners clean up on unmount.

---

## Assets

- `src/assets/HS.jpg` — brand mark (nav + favicon source).
- `src/assets/music.mp3` — optional ambient track (off by default).
- **Optional Musebase logo** — drop any image named `*musebase*` (`.png/.jpg/.svg/.webp`) into `src/assets/` and it is picked up automatically by `utils/assetResolver.js`. If absent, the UI falls back to a refined text wordmark — the build never breaks.

---

## Routes

`/` Home · `/systems` Systems · `/north` Hanoryx North · `/work` Work · `/timeline` Timeline · `/contact` Contact · `*` 404 (Signal Lost)

---

## Notes on content

Hanoryx Systems is presented as a serious, advanced, deliberately private software company. Unreleased systems are intentionally withheld (redacted / classified nodes). **Musebase** is described only as an *advanced management platform* and is one part of a broader roadmap, never the focus. The contact form has no backend — it composes a `mailto:` to **contact@hanoryx.com**.
