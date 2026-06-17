/* ============================================================
   ANIMATION INVENTORY — the canonical catalogue of every distinct animation
   system in the site. A guard against regressions: future work should EXTEND
   this, never collapse the variety back into a single fade-up.

   Each entry: { id, type, name, usedOn }
     type: 'background' | 'component' | 'text' | 'nav' | 'form'
         | 'cursor' | 'transition' | 'overlay' | 'audio'

   Not rendered in production. Imported by the dev overlay / docs only.
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
  ['text-redaction-unmask', 'text', 'Redaction decrypt unmask', ['classified']],
  // components
  ['card-bracket-draw', 'component', 'Card corner-bracket draw on view', ['cards']],
  ['card-reveal-scan', 'component', 'Card one-shot reveal scan', ['cards']],
  ['card-hover-lift', 'component', 'Card hover lift + edge', ['cards']],
  ['card-scan-crawl', 'component', 'Card hover scanline crawl', ['cards']],
  ['card-arrow-shift', 'component', 'Card route-arrow shift', ['linked cards']],
  ['stat-countup', 'component', 'Stat odometer count-up', ['stats']],
  ['stat-live-dot', 'component', 'Stat live pulse dot', ['stats']],
  ['stat-sparkline', 'component', 'Stat idle micro-waveform', ['stats']],
  ['pill-dot-pulse', 'component', 'Pill live status dot pulse', ['status pills']],
  ['eyebrow-ping', 'component', 'Section eyebrow signal ping', ['all sections']],
  ['footer-telemetry', 'component', 'Footer telemetry signal rail', ['footer']],
  ['footer-wordmark', 'component', 'Footer dissolving wordmark', ['footer']],
  ['marquee-rail', 'component', 'Marquee telemetry rail', ['manifesto']],
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
  // forms
  ['form-underline-draw', 'form', 'Field underline draw on focus', ['contact']],
  ['form-focus-state', 'form', 'Field focus state shift', ['contact']],
  ['form-segment-control', 'form', 'Inquiry segmented control', ['contact']],
  ['form-submit-compose', 'form', 'Submit compose sequence', ['contact']],
  // cursor
  ['cursor-default', 'cursor', 'Designed cursor — default ring', ['site']],
  ['cursor-link', 'cursor', 'Cursor link state', ['links']],
  ['cursor-nav', 'cursor', 'Cursor nav state', ['nav']],
  ['cursor-audio', 'cursor', 'Cursor audio state', ['audio button']],
  // transitions / overlays / audio
  ['page-transition', 'transition', 'Route blur/slide transition', ['all']],
  ['route-fallback', 'transition', 'Lazy-route loading sweep', ['all']],
  ['boot-sequence', 'transition', 'Cinematic boot calibration', ['entry']],
  ['overlay-scanline', 'overlay', 'Global scanline overlay', ['site']],
  ['overlay-noise', 'overlay', 'Global film-grain noise', ['site']],
  ['audio-nav-visualizer', 'audio', 'Nav mini audio visualizer', ['header']],
  // 20-second System Synthesis cinematic — one phase per entry
  ['synth-black-start', 'cinematic', 'Synthesis P1 — black start core + telemetry', ['system-synthesis']],
  ['synth-core-ignition', 'cinematic', 'Synthesis P2 — concentric ring ignition + orbit nodes', ['system-synthesis']],
  ['synth-grid-construction', 'cinematic', 'Synthesis P3 — architectural grid construction', ['system-synthesis']],
  ['synth-fragment-assembly', 'cinematic', 'Synthesis P4 — fragments pulled inward', ['system-synthesis']],
  ['synth-north-activation', 'cinematic', 'Synthesis P5 — Hanoryx North + route orbit', ['system-synthesis']],
  ['synth-systems-expansion', 'cinematic', 'Synthesis P6 — system modules with micro-motifs', ['system-synthesis']],
  ['synth-timeline-pull', 'cinematic', 'Synthesis P7 — project timeline + redacted silhouettes', ['system-synthesis']],
  ['synth-interface-convergence', 'cinematic', 'Synthesis P8 — panels converge + radial menu flash', ['system-synthesis']],
  ['synth-signal-wall', 'cinematic', 'Synthesis P9 — full-screen audio/signal wall', ['system-synthesis']],
  ['synth-system-lock', 'cinematic', 'Synthesis P10 — compression + wordmark lock-in', ['system-synthesis']],
  ['synth-release', 'cinematic', 'Synthesis P11 — release dissolve into the site', ['system-synthesis']],
];

export const animationInventory = [
  ...BACKGROUND_SCENES.map(([id, name]) => ({ id: `bg-${id}`, type: 'background', name, usedOn: [] })),
  ...OTHER.map(([id, type, name, usedOn]) => ({ id, type, name, usedOn })),
];

export const INVENTORY_COUNT = animationInventory.length;

export const inventoryByType = animationInventory.reduce((acc, e) => {
  (acc[e.type] = acc[e.type] || []).push(e);
  return acc;
}, {});
