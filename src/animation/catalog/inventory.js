/* ============================================================
   ANIMATION INVENTORY — the canonical catalogue of every distinct animation
   system in the site. A guard against regressions: future work should EXTEND
   this, never collapse the variety back into a single fade-up.

   Each entry: { id, type, name, usedOn }
     type: 'background' | 'component' | 'text' | 'nav' | 'foreground'
         | 'cursor' | 'transition' | 'overlay' | 'audio' | 'cinematic'
         | 'performance'

   Not imported by the app — it is a catalogue. The FOREGROUND section lists the
   page-specific compositions; `qa/foreground-inventory.mjs` is the other half:
   it loads every route and counts the `data-fx` markers that actually render.
   ============================================================ */

/* ---- 67 distinct canvas background scenes ---- */
const BACKGROUND_SCENES = [
  ['home-core', 'Home Core composite (arcs + particles + grid)'],
  ['audio-signal-wall', 'Audio Signal Wall (full-width spectrum)'],
  ['radial-audio-core', 'Radial Audio Core (spectrum ring)'],
  ['signal-spectrum-field', 'Signal Spectrum Field (stacked spectrum)'],
  ['orbital-command', 'Orbital Command ring'],
  ['hex-tunnel', 'Perspective Hex Tunnel'],
  ['polar-status', 'Polar Status dial'],
  ['topology-pulse', 'Topology Pulse contours'],
  ['commerce-pipeline', 'Commerce Order Pipeline'],
  ['workflow-river', 'Workflow River streamlines'],
  ['permission-orbit', 'Permission Orbit (role nodes)'],
  ['data-interface-wave', 'Data Interface oscilloscope'],
  ['client-portal-gate', 'Client Portal iris gate'],
  ['research-blackout', 'Research Blackout (redaction)'],
  ['motion-curve-field', 'Motion Curve Field (easings)'],
  ['interface-lab-shape', 'Interface Lab specimens'],
  ['architecture-layer', 'Architecture Layer stack'],
  ['tooling-console', 'Tooling Console terminal'],
  ['musebase-coordination', 'Musebase Coordination orbit'],
  ['unknown-silhouette', 'Unknown System silhouette'],
  ['contact-transmission', 'Contact Transmission rings'],
  ['status-pulse-grid', 'Status Pulse Grid'],
  ['privacy-quiet-grid', 'Privacy Quiet Grid'],
  ['error-signal-lost', 'Error Signal Lost (404)'],
  ['magnetic-vector', 'Magnetic Vector field'],
  ['radar-cutaway', 'Radar Cutaway sweep'],
  ['isometric-infra', 'Isometric Infrastructure'],
  ['redacted-timeline-branch', 'Redacted Timeline Branch'],
  ['liquid-glass-operational', 'Liquid Glass capsules'],
  ['node-compression', 'Node Compression cluster'],
  ['split-prism', 'Split Prism panes'],
  ['glyph-compiler', 'Glyph Compiler'],
  ['compass-vector', 'Compass Vector field'],
  ['heatmap-control', 'Operational Heatmap'],
  ['dependency-graph', 'Dependency Graph DAG'],
  ['build-pipeline', 'Build Pipeline stages'],
  ['scheduling-grid', 'Scheduling Grid'],
  ['transaction-wave', 'Transaction Wave ticker'],
  ['trigger-action-pulse', 'Trigger→Action pulses'],
  ['dashboard-tiles', 'Dashboard Tiles bento'],
  ['data-stream-ribbons', 'Data Stream Ribbons'],
  ['secure-boundary', 'Secure Boundary perimeter'],
  // retained base scenes (still distinct, still in use)
  ['architectural-grid', 'Architectural Grid'],
  ['blackout-silhouette', 'Blackout Silhouette'],
  ['circuit-trace', 'Circuit Trace'],
  ['command-terminal', 'Command Terminal'],
  ['concentric-gate', 'Concentric Gate'],
  ['data-rain', 'Data Rain'],
  ['flow-field', 'Flow Field'],
  ['glass-prism', 'Glass Prism'],
  ['glyph-field', 'Glyph Field'],
  ['heatmap-grid', 'Heatmap Grid'],
  ['hex-lattice', 'Hex Lattice'],
  ['isometric-module', 'Isometric Module'],
  ['liquid-metal', 'Liquid Metal'],
  ['magnetic-particles', 'Magnetic Particles'],
  ['network-constellation', 'Network Constellation'],
  ['orbital-node', 'Orbital Node'],
  ['polar-radar', 'Polar Radar'],
  ['redaction-matrix', 'Redaction Matrix'],
  ['signal-wave', 'Signal Wave oscilloscope'],
  ['spline-ribbon', 'Spline Ribbon'],
  ['timeline-pulse', 'Timeline Pulse'],
  ['topographic-lines', 'Topographic Lines'],
  ['vector-compass', 'Vector Compass'],
  ['voronoi-cell', 'Voronoi Cell'],
  ['wave-interference', 'Wave Interference'],
];

/* ---- component / text / nav / form / cursor / transition / overlay ---- */
const OTHER = [
  // text reveals
  ['text-kinetic-char', 'text', 'Kinetic char slit reveal', ['hero titles']],
  ['text-kinetic-word', 'text', 'Kinetic word-mask reveal', ['hero titles']],
  ['text-reveal-fadeup', 'text', 'RevealText fade-up', ['body']],
  ['text-reveal-maskup', 'text', 'RevealText clip mask-up', ['manifesto lines']],
  ['text-reveal-scanx', 'text', 'RevealText horizontal scan wipe', ['labels']],
  ['text-reveal-splity', 'text', 'RevealText split-axis', ['headings']],
  ['text-reveal-pop', 'text', 'RevealText radial pop', ['tags']],
  ['text-reveal-slidein', 'text', 'RevealText slide-in', ['split body']],
  ['text-sectionheader', 'text', 'SectionHeader staged blur reveal', ['all sections']],

  // ---- component reveal profiles (revealProfiles.js): one distinct entrance
  //      language PER BLOCK, applied via <Reveal> / <RevealGroup>. The fix for
  //      "every box fades up the same way." ----
  ['reveal-slide-left', 'component', 'Slide in from inline-start', ['split body', 'hero intro']],
  ['reveal-slide-right', 'component', 'Slide in from inline-end', ['contact email row']],
  ['reveal-skew-in', 'component', 'Skewed slide settle', ['accent rows']],
  ['reveal-settle-down', 'component', 'Drop in from above', ['footer lead']],
  ['reveal-scan-x', 'component', 'Horizontal scan-mask wipe', ['eyebrows', 'manifesto eyebrow']],
  ['reveal-scan-x-reverse', 'component', 'Reverse scan-mask wipe', ['labels']],
  ['reveal-mask-up', 'component', 'Clip mask-up reveal', ['manifesto lines']],
  ['reveal-mask-down', 'component', 'Clip mask-down reveal', ['panels']],
  ['reveal-curtain-split', 'component', 'Center curtain split reveal', ['manifesto lines']],
  ['reveal-depth-rise', 'component', 'Scale-from-behind depth rise', ['hero actions', 'cta header']],
  ['reveal-zoom-through', 'component', 'Zoom-through from large scale', ['cta body']],
  ['reveal-split-y', 'component', 'Vertical split open', ['stats header']],
  ['reveal-unfold-x', 'component', 'Horizontal unfold from edge', ['bars']],
  ['reveal-radial-pop', 'component', 'Radial spring pop', ['tags']],
  ['reveal-chip-pop', 'component', 'Chip spring pop', ['chips']],
  ['reveal-module-snap', 'component', 'Spring snap into grid', ['modules']],
  ['reveal-orbital-card', 'component', 'Rotate-into-place like an orbit node', ['cards']],
  ['reveal-rise-rotate', 'component', 'Rise with slight rotation', ['footer columns']],
  ['reveal-flip-in', 'component', '3D rotateY flip-in', ['inquiry cards']],
  ['reveal-terminal-open', 'component', 'Terminal-window scaleY open', ['studio panels']],
  ['reveal-glass-materialize', 'component', 'De-blur zoom-out glass materialize', ['cta body']],
  ['reveal-data-materialize', 'component', 'Blur + scale data materialize', ['card grids']],
  ['reveal-reality-assemble', 'component', 'Disintegrate→assemble into reality', ['feature/Musebase block']],
  ['reveal-blur-focus', 'component', 'Chromatic blur-to-focus lock', ['headings']],
  ['reveal-diagonal-slice', 'component', 'Diagonal clip-path slice-in', ['split aside panel']],
  ['reveal-redacted-unlock', 'component', 'Redaction bar slides away to unlock', ['redacted cards', 'module rows']],
  ['reveal-node-sequence', 'component', 'Sequential node slide', ['feature modules list']],
  ['reveal-step-activate', 'component', 'Process-step activation slide', ['process steps']],
  ['reveal-count-rise', 'component', 'Stat block count rise', ['stats', 'hero metrics']],
  ['reveal-bracket-in', 'component', 'Bracketed blur-scale settle', ['panels']],
  ['reveal-depth-stack-rise', 'component', 'Stacked-layer depth rise', ['stacked cards']],
  ['reveal-hex-cell-form', 'component', 'Hex-cell spring form', ['module groups']],

  // ---- per-block SectionHeader entrance variants (no two blocks share one) ----
  ['header-variant-up', 'text', 'SectionHeader rise (default)', ['hero/manifesto']],
  ['header-variant-left', 'text', 'SectionHeader slide-left', ['split', 'redacted']],
  ['header-variant-right', 'text', 'SectionHeader slide-right', ['modules']],
  ['header-variant-depth', 'text', 'SectionHeader depth scale-in', ['cards', 'cta']],
  ['header-variant-split', 'text', 'SectionHeader vertical split', ['stats']],
  ['header-variant-scan', 'text', 'SectionHeader scan-mask wipe', ['process', 'contact']],

  // ---- reveal primitives ----
  ['reveal-primitive-single', 'component', '<Reveal> single-element profile host', ['site-wide']],
  ['reveal-primitive-group', 'component', '<RevealGroup> staggered profile host', ['grids/lists']],

  // components
  ['card-bracket-draw', 'component', 'DataPanel corner-bracket draw on view', ['split panels']],
  ['card-reveal-scan', 'component', 'DataPanel one-shot reveal scan', ['split panels']],
  ['pill-dot-pulse', 'component', 'Pill live status dot pulse', ['status pills']],
  ['eyebrow-ping', 'component', 'Section eyebrow signal ping', ['all sections']],
  ['footer-telemetry', 'component', 'Footer telemetry signal rail', ['footer']],
  ['footer-wordmark', 'component', 'Footer dissolving wordmark', ['footer']],
  ['glitch-line', 'component', 'Glitch divider line', ['stats/404']],
  ['timeline-node', 'component', 'Timeline node activation + branch', ['timeline']],
  ['datapanel-arm', 'component', 'DataPanel in-view arm sequence', ['panels']],
  // buttons
  ['btn-magnetic', 'component', 'Magnetic button pull', ['CTAs']],
  ['btn-sweep', 'component', 'Button hover light-sweep', ['CTAs']],
  ['btn-press', 'component', 'Button press compression', ['CTAs']],
  ['btn-icon-shift', 'component', 'Button icon path shift', ['CTAs']],
  // nav
  ['nav-hover-intent', 'nav', 'Hover-intent open/close gating', ['header']],
  ['nav-radial-deploy', 'nav', 'Radial menu deploy from item', ['header']],
  ['nav-ring-stroke', 'nav', 'Menu ring stroke-draw', ['header']],
  ['nav-connector-draw', 'nav', 'Menu connector stroke-draw', ['header']],
  ['nav-node-pop', 'nav', 'Menu orbit-node spring pop', ['header']],
  ['nav-selector-swing', 'nav', 'Menu selector arc swing', ['header']],
  ['nav-label-clip', 'nav', 'Menu route label clip reveal', ['header']],
  ['nav-active-pulse', 'nav', 'Active route live pulse', ['header']],
  ['mobile-command-rail', 'nav', 'Mobile command-surface rail', ['mobile menu']],
  ['mobile-group-expand', 'nav', 'Mobile group accordion expand', ['mobile menu']],
  // cursor
  ['cursor-default', 'cursor', 'Designed cursor — default ring', ['site']],
  ['cursor-link', 'cursor', 'Cursor link state', ['links']],
  ['cursor-nav', 'cursor', 'Cursor nav state', ['nav']],
  ['cursor-audio', 'cursor', 'Cursor audio state', ['audio button']],
  ['cursor-label', 'cursor', 'Cursor names what a press does (View / Drag / custom data-cursor-label)', ['cards', 'rails']],
  ['cursor-drag', 'cursor', 'Cursor grips while dragging a rail, slider or scrubber', ['drag surfaces']],
  // transitions / overlays / audio
  ['route-current', 'transition', 'Route current — a thin red line travels the viewport, destination written at its end', ['all']],
  ['page-handover', 'transition', 'Page hand-over at a dim level (never fully dark, no opaque cover)', ['all']],
  ['route-fallback', 'transition', 'Lazy-route loading sweep', ['all']],
  ['boot-sequence', 'transition', 'Cinematic boot calibration (START begins the music inside the click)', ['entry']],
  ['overlay-scanline', 'overlay', 'Static scanline veil (the sweeping band was removed: ~15 fps)', ['site']],
  ['overlay-noise', 'overlay', 'Global film-grain noise', ['site']],
  ['audio-nav-visualizer', 'audio', 'Nav mini audio visualizer + live / tap-to-play states', ['header']],
  ['palette-overlay', 'overlay', 'Command search — centred portal overlay with body-text excerpts', ['Ctrl/⌘ K', '/']],
  ['shortcuts-panel', 'overlay', 'Keyboard shortcuts panel', ['?']],
  ['blueprint-mode', 'overlay', 'Blueprint mode — outlines, names and counts every marked foreground detail', ['B']],
  ['footer-directory', 'nav', 'Footer as a directory of every real page (company, work, systems, resources, legal, careers, contact)', ['footer']],
  // 20-second System Synthesis cinematic — full-screen takeover OVERLAY (not a page)
  ['synth-camera-push', 'cinematic', 'Synthesis camera push-in + ignition/collapse punches', ['synthesis-overlay']],
  ['synth-streaks', 'cinematic', 'Synthesis constant radial speed-lines', ['synthesis-overlay']],
  ['synth-black-start', 'cinematic', 'Synthesis P1 — black start core + telemetry', ['synthesis-overlay']],
  ['synth-core-ignition', 'cinematic', 'Synthesis P2 — concentric ring ignition + orbit nodes', ['synthesis-overlay']],
  ['synth-grid-construction', 'cinematic', 'Synthesis P3 — architectural grid construction', ['synthesis-overlay']],
  ['synth-fragment-assembly', 'cinematic', 'Synthesis P4 — fragments pulled inward', ['synthesis-overlay']],
  ['synth-north-activation', 'cinematic', 'Synthesis P5 — Hanoryx North + route orbit', ['synthesis-overlay']],
  ['synth-systems-expansion', 'cinematic', 'Synthesis P6 — system modules with micro-motifs', ['synthesis-overlay']],
  ['synth-timeline-pull', 'cinematic', 'Synthesis P7 — project timeline + redacted silhouettes', ['synthesis-overlay']],
  ['synth-interface-convergence', 'cinematic', 'Synthesis P8 — panels converge + radial menu flash', ['synthesis-overlay']],
  ['synth-signal-wall', 'cinematic', 'Synthesis P9 — full-screen audio/signal wall', ['synthesis-overlay']],
  ['synth-system-lock', 'cinematic', 'Synthesis P10 — compression + wordmark lock-in', ['synthesis-overlay']],
  ['synth-release', 'cinematic', 'Synthesis P11 — release dissolve into the live home', ['synthesis-overlay']],
  ['synth-overlay-seizure', 'cinematic', 'Full-screen overlay clip-in viewport seizure', ['synthesis-overlay']],

  // performance systems
  ['perf-fast-scroll-governor', 'performance', 'Fast-scroll governor (scene/reveal/cursor mode)', ['site-wide']],
  ['perf-scene-fast-freeze', 'performance', 'Scenes freeze last frame during fast scroll', ['backgrounds']],
  ['perf-scene-eager-skip', 'performance', 'Skip painting scenes flown past', ['backgrounds']],
  ['perf-reveal-snap', 'performance', 'Reveals snap in cheaply during fast scroll', ['components']],
  ['perf-scenes-global-pause', 'performance', 'Pause all page scenes during overlays', ['backgrounds']],
  ['perf-viewport-director', 'performance', 'Measured --viewport-h + layout-settled refresh', ['stages']],

  // route current — one direction of travel per section (categoryTransitions.js)
  ['route-current-home', 'transition', 'Route current rises from the bottom', ['/']],
  ['route-current-systems', 'transition', 'Route current crosses left to right', ['/systems']],
  ['route-current-north', 'transition', 'Route current falls top to bottom', ['/north', '/engineering', '/lab']],
  ['route-current-work', 'transition', 'Route current crosses right to left', ['/work']],
  ['route-current-company', 'transition', 'Route current opens outward from the middle', ['/company']],
  ['route-current-contact', 'transition', 'Route current rises from the bottom', ['/contact']],
  ['route-current-legal', 'transition', 'Route current falls top to bottom', ['/legal/*']],
];

/* ============================================================
   FOREGROUND — the part of each page that sits in front of its background.
   `toolkit` pieces live in components/fx and are reused; `aside` pieces are
   hero objects (hero.aside.kind); `signature` pieces are whole-block
   compositions ({ type: 'signature', kind }). Each signature is its own lazy
   chunk (components/signatures/registry.js).
   ============================================================ */
const FOREGROUND = [
  // ---- toolkit (components/fx) ----
  ['fx-tilt-surface', 'foreground', 'TiltSurface — a surface that leans toward the pointer (eased through registered CSS vars)', ['asides', 'cards']],
  ['fx-spotlight-card', 'foreground', 'SpotlightCard — a light that follows the pointer across the card', ['card grids']],
  ['fx-proximity-text', 'foreground', 'ProximityText — letters swell and brighten as the pointer nears', ['404', 'big titles']],
  ['fx-scramble-text', 'foreground', 'ScrambleText — characters decode into the real text on hover or entry', ['codes', 'labels', 'email']],
  ['fx-scroll-words', 'foreground', 'ScrollWords — a paragraph lights word by word as it scrolls', ['manifestos', 'split leads']],
  ['fx-odometer', 'foreground', 'Odometer — digits roll to their value', ['stats', 'counters']],
  ['fx-velocity-marquee', 'foreground', 'VelocityMarquee — a ticker whose speed follows scroll velocity', ['manifestos']],
  ['fx-glide-tabs', 'foreground', 'GlideTabs — a tab list whose ink glides between tabs', ['signatures']],
  ['fx-accordion', 'foreground', 'Accordion — eased-height disclosure with a plus that turns', ['lists']],
  ['fx-compare-slider', 'foreground', 'CompareSlider — drag, key or tap a handle to peel one layer from another', ['surface compare']],
  ['fx-hover-index', 'foreground', 'HoverIndex — big rows; a red rule glides to the hovered row, codes scramble, a preview trails the cursor (touch: every row shows its own detail)', ['index lists']],
  ['fx-drag-rail', 'foreground', 'DragRail — grab and fling a rail (momentum), ← → buttons and keys, a progress thumb', ['card rails']],
  ['fx-scroll-rail', 'foreground', 'ScrollRail — a section rail on long pages: the current tick stretches and lights, hover names it, click glides there', ['long pages']],
  ['fx-glyph', 'foreground', 'Glyph — 27 drawn SVG glyphs that animate on hover', ['cards', 'rows']],
  ['fx-progress-ring', 'foreground', 'ProgressRing — a ring that fills from a value', ['review aids', 'budgets']],
  ['fx-arrow-link', 'foreground', 'ArrowLink — an inline link whose arrow slides on hover', ['links']],
  ['fx-keycap', 'foreground', 'KeyCap — a drawn keyboard key with a pressed, lit state', ['shortcuts', 'keyboard map', 'component bench']],

  // ---- hero asides (hero.aside.kind) ----
  ['aside-orbit-nav', 'foreground', 'Orbit nav — four doors into the site on three orbits', ['home']],
  ['aside-case-deck', 'foreground', 'Case deck — the case studies as a fanning deck of files, each a link', ['work']],
  ['aside-logo-plate', 'foreground', 'Logo plates — the Musebase mark on stacked plates drifting at their own depths', ['work/musebase']],
  ['aside-engine-viewport', 'foreground', 'Engine viewport — a framed miniature viewport leaning toward the pointer', ['work/yk-engine']],
  ['aside-basket', 'foreground', 'Basket tiles — tap abstract tiles and the basket count rolls up', ['work/customer-product']],
  ['aside-dot-field', 'foreground', 'Dot field — ~750 dots under a soft lens that follows the pointer', ['work/internal-crm']],
  ['aside-identity-card', 'foreground', 'Identity card — leans toward the pointer, turns over to the company and its team', ['company']],
  ['aside-split-flap', 'foreground', 'Split-flap board — letters flip to each new word; press a row for the next', ['company/careers']],
  ['aside-tension-dials', 'foreground', 'Tension dials — three sliders; push one to an extreme and its cost is named', ['company/principles']],
  ['aside-system-map', 'foreground', 'System map — seven areas around a shared core; nodes open in place to a card', ['systems']],
  ['aside-north-compass', 'foreground', 'Compass — the needle follows the pointer and settles on one of four pillars', ['north']],
  ['aside-live-budget', 'foreground', 'Live budget — fps, active scenes, loops and quality tier read from this page, this device', ['engineering']],

  // ---- signature blocks ----
  ['sig-work-portals', 'foreground', 'Work portals — hover or focus a project to open it, each with its own art; supporting studies sit quieter', ['home', 'work']],
  ['sig-layer-stack', 'foreground', 'Layer stack — three CSS-3D plates part as you scroll; hover or focus lifts one clear', ['home', 'north/architecture']],
  ['sig-chronology-strip', 'foreground', 'Chronology strip — a line draws as it scrolls in and the undated phase nodes light in turn', ['home', 'company']],
  ['sig-coordination-lab', 'foreground', 'Coordination lab — an illustration of many things kept in step', ['work/musebase']],
  ['sig-engine-editor', 'foreground', 'Engine editor — a small demo of authoring entities in an editor and running them in a player (an illustration, not the engine)', ['work/yk-engine']],
  ['sig-engine-pipeline', 'foreground', 'Engine pipeline — pick a stage (click, tap, ← →) and a token travels there', ['work/yk-engine']],
  ['sig-engine-anatomy', 'foreground', 'Engine anatomy — an interactive blueprint of how the engine is organised', ['work/yk-engine']],
  ['sig-experience-storyboard', 'foreground', 'Experience storyboard — abstract wireframes of a customer-facing flow, each stage with something to do (no real catalogue, prices or payments)', ['work/customer-product']],
  ['sig-data-slab', 'foreground', 'Data slab — a window onto a synthetic, very large data set', ['work/internal-crm']],
  ['sig-surface-compare', 'foreground', 'Surface compare — drag to peel a screen back to its structure', ['company']],
  ['sig-principle-stack', 'foreground', 'Principle stack — cards that pile as you scroll (CSS sticky + scroll-driven settle)', ['company/principles']],
  ['sig-boundary-review', 'foreground', 'Boundary review — tick questions, rings and bars fill, copy what is left', ['company/security']],
  ['sig-chronology-scrubber', 'foreground', 'Chronology scrubber — drag or play through undated phases; the ink follows', ['company/timeline']],
  ['sig-areas-explorer', 'foreground', 'Areas explorer — strips open as you point, neighbours fold to a label', ['company/careers']],
  ['sig-system-index', 'foreground', 'System index — large rows, a red rule between them, a preview trailing the cursor', ['systems']],
  ['sig-needs-finder', 'foreground', 'Needs finder — pick what you are trying to do and the matching area lights', ['systems']],
  ['sig-ops-flow', 'foreground', 'Ops flow — send a request and a token glides through four stages', ['systems/operational-management']],
  ['sig-order-path', 'foreground', 'Order path — an order as a state machine you can run, with a settlement ledger', ['systems/commerce-infrastructure']],
  ['sig-rule-chain', 'foreground', 'Rule chain — pick a trigger, a guard and an action and run the chain step by step', ['systems/automation']],
  ['sig-console-composer', 'foreground', 'Console composer — assemble a console from abstract panels (shapes only)', ['systems/internal-platforms']],
  ['sig-view-shift', 'foreground', 'View shift — one set of records, four surfaces; markers glide between layouts', ['systems/data-interfaces']],
  ['sig-boundary-membrane', 'foreground', 'Boundary membrane — twelve records behind a membrane; choose a role and the records it may reach cross to the outside', ['systems/client-portals']],
  ['sig-research-bench', 'foreground', 'Research bench — three studies running on the page: scene budget, a still state for motion, focus you can follow', ['systems/research-systems']],
  ['sig-accordion-list', 'foreground', 'Accordion list — disclosures with a scrambling code and a turning plus', ['north']],
  ['sig-gate-walk', 'foreground', 'Gate walk — tick what a gate asks and the runner passes to the next stage', ['north/engineering']],
  ['sig-component-bench', 'foreground', 'Component bench — change the variant, size and state of the site\'s real Button, Pill and KeyCap and read the code it makes', ['north/interface-lab']],
  ['sig-easing-studio', 'foreground', 'Easing studio — drag Bézier handles, a ball travels the curve, the feel is described in words', ['north/motion-systems']],
  ['sig-toolchain-map', 'foreground', 'Toolchain map — switch a check off and see what could slip through', ['north/tooling']],
  ['sig-architecture-explorer', 'foreground', 'Architecture explorer — the layers of this website; trace a page view', ['engineering']],
  ['sig-scene-lab', 'foreground', 'Scene lab — view the site\'s own canvas scenes, density, still frame', ['lab']],
  ['sig-contact-studio', 'foreground', 'Contact studio — pick a subject, write (or drop in a starter), watch the envelope fill, open in your mail app or copy the address; nothing is sent from the page', ['contact']],
  ['sig-site-directory', 'foreground', 'Site directory — every page, grouped and filterable, with "take me somewhere"', ['sitemap']],
  ['sig-data-journey', 'foreground', 'Data journey — what leaves your browser for each thing you might do', ['legal/privacy']],
  ['sig-clause-finder', 'foreground', 'Clause finder — filter plain-language clauses by text or topic', ['legal/terms']],
  ['sig-storage-inspector', 'foreground', 'Storage inspector — live read of what this site keeps in your browser', ['legal/cookies']],
  ['sig-keyboard-map', 'foreground', 'Keyboard map — press a real key (or tap a cap) to see what it does here', ['legal/accessibility']],
  ['page-404', 'foreground', '404 — nearest real pages by edit distance, under proximity-reactive type', ['404']],
];

export const animationInventory = [
  ...BACKGROUND_SCENES.map(([id, name]) => ({ id: `bg-${id}`, type: 'background', name, usedOn: [] })),
  ...OTHER.map(([id, type, name, usedOn]) => ({ id, type, name, usedOn })),
  ...FOREGROUND.map(([id, type, name, usedOn]) => ({ id, type, name, usedOn })),
];

export const INVENTORY_COUNT = animationInventory.length;

export const inventoryByType = animationInventory.reduce((acc, e) => {
  (acc[e.type] = acc[e.type] || []).push(e);
  return acc;
}, {});
