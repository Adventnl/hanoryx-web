/* ============================================================
   SHOWCASE REGISTRY — plain data, no JSX, importable from Node.

   The showcase is fifty pages of components for their own sake. Each page is
   a scroll-driven stage (`engine`), a pinned visual that moves with the scroll,
   and at least forty specimens of its own. This file is the one list of them:
   the menu, the footer, the sitemap, the search index and the /showcase index
   all read it. A page's code lives in `pages/<slug>.jsx` (loaded on demand).

   `engine`  how the page moves        -> stages/index.js
   `frame`   how a specimen is framed   -> the data-frame rules in showcase.css
   `scene`   the Canvas scene behind the page's opening screen
   `ground`  the faint pattern under the stage
   ============================================================ */

export const MIN_SPECIMENS = 40;

export const chapters = [
  { id: 'controls', code: '01', title: 'Controls', blurb: 'Switches, dials, faders, keys and fields you can operate.' },
  { id: 'data', code: '02', title: 'Data', blurb: 'Gauges, charts, matrices, figures and graphs.' },
  { id: 'type', code: '03', title: 'Type', blurb: 'Kinetic words, tickers, marks, glyphs and editorial parts.' },
  { id: 'cards', code: '04', title: 'Cards', blurb: 'Surfaces that tilt, glow, fold, tile and perforate.' },
  { id: 'navigation', code: '05', title: 'Navigation', blurb: 'Tabs, docks, menus, steppers and waypoints.' },
  { id: 'feedback', code: '06', title: 'Feedback', blurb: 'Loaders, toasts, progress, skeletons and signals.' },
  { id: 'overlays', code: '07', title: 'Overlays', blurb: 'Popovers, sheets, cursors, wipes and lenses.' },
  { id: 'objects', code: '08', title: 'Objects', blurb: 'Instruments, studio gear, terminals, stamps and archives.' },
  { id: 'ground', code: '09', title: 'Ground', blurb: 'Beams, patterns, drift, waves and morphing shapes.' },
  { id: 'patterns', code: '10', title: 'Patterns', blurb: 'Handset screens, boards, feeds, checkout and heroes.' },
];

/* How each page moves. `hint` is what the page's opening screen says it will do. */
export const engines = {
  split: { label: 'Pinned left', hint: 'The left side holds still and moves with you; the right column scrolls.' },
  splitR: { label: 'Pinned right', hint: 'The right side holds still and moves with you; the left column scrolls.' },
  index: { label: 'Live index', hint: 'An index follows you down the left while each specimen takes a full screen.' },
  counter: { label: 'Counter-scroll', hint: 'Two columns drift in opposite directions as you scroll.' },
  rail: { label: 'Sideways rail', hint: 'Scrolling down drives a track sideways past a fixed panel.' },
  stack: { label: 'Sticky stack', hint: 'Specimens pile up like a deck of cards.' },
  orbit: { label: 'Centre stage', hint: 'A still centre; specimens arrive from both sides.' },
  spine: { label: 'Spine', hint: 'A line fills as you scroll and specimens branch from it.' },
  wheel: { label: 'Carousel', hint: 'Specimens ride a ring that turns with the page.' },
  tunnel: { label: 'Fly-through', hint: 'The camera moves forward through a column of specimens.' },
  slides: { label: 'Wipes', hint: 'One specimen at a time, cut in by a moving edge.' },
  columns: { label: 'Parallax', hint: 'Columns move at different speeds beside a fixed panel.' },
  map: { label: 'Pan map', hint: 'The page pans across a large field along a path.' },
  rows: { label: 'Belts', hint: 'Rows slide in alternating directions.' },
  canvas: { label: 'Canvas flight', hint: 'The page is a canvas: scrolling pulls the camera out, flies it left, right, up or down to the next specimen, and drops it back in.' },
  atlas: { label: 'Atlas', hint: 'Every specimen sits on one sheet. The camera dives into each, and at the end of every row pulls right out to show the whole sheet.' },
  spiral: { label: 'Spiral', hint: 'The specimens wind outward in a spiral and the camera follows them round, banking as it turns.' },
};

const P = (slug, title, chapter, engine, frame, scene, ground, line, blurb) => ({ slug, title, chapter, engine, frame, scene, ground, line, blurb });

export const showcasePages = [
  /* 01 — Controls */
  P('switchboard', 'Switchboard', 'controls', 'canvas', 'bracket', 'status-pulse-grid', 'dots', 'Forty ways to flip a state.', 'Switches, latches and breakers on a canvas the camera flies across.'),
  P('dials', 'Dials', 'controls', 'spiral', 'plate', 'polar-radar', 'rings', 'Turn, wind, spin and detent.', 'Knobs, wheels and rotaries wound out along a spiral.'),
  P('faders', 'Faders', 'controls', 'rail', 'edge', 'signal-spectrum-field', 'ruler', 'Sliders on a rail that slides.', 'Ranges, scrubbers and tracks on a sideways rail.'),
  P('keypads', 'Keypads', 'controls', 'columns', 'slab', 'glyph-field', 'cross', 'Keys, triggers and buttons with a feel.', 'Press mechanics in three parallax columns.'),
  P('fields', 'Fields', 'controls', 'index', 'tape', 'redaction-matrix', 'lines', 'Inputs, pickers and steppers, reimagined.', 'Text, date, code and tag fields beside a live index.'),

  /* 02 — Data */
  P('gauges', 'Gauges', 'data', 'spiral', 'plate', 'polar-status', 'rings', 'Meters that read the room.', 'Needles, arcs and bars wound out along a spiral.'),
  P('charts', 'Charts', 'data', 'atlas', 'cross', 'heatmap-control', 'cross', 'Marks, bars, lines and areas.', 'Forty small charts on one sheet; the camera dives into each.'),
  P('matrices', 'Matrices', 'data', 'atlas', 'dash', 'heatmap-grid', 'dots', 'Heat, tables and dot grids to pan across.', 'Heat, tables and dot grids on one sheet you fly across.'),
  P('figures', 'Figures', 'data', 'slides', 'bare', 'data-rain', 'none', 'Numerals that roll, flip and settle.', 'Counters and clocks cut in one at a time.'),
  P('graphs', 'Graphs', 'data', 'spine', 'lift', 'dependency-graph', 'lines', 'Nodes, trees and flows that grow.', 'Networks that branch from a filling spine.'),

  /* 03 — Type */
  P('kinetic', 'Kinetic', 'type', 'canvas', 'bare', 'glyph-compiler', 'none', 'Words that scramble, split and settle.', 'Moving type on a canvas the camera swoops across.'),
  P('tickers', 'Tickers', 'type', 'rows', 'slab', 'data-stream-ribbons', 'lines', 'Flaps, boards and marquees.', 'Mechanical text on belts that slide both ways.'),
  P('markup', 'Markup', 'type', 'stack', 'tape', 'research-blackout', 'lines', 'Highlights, strikes and redactions.', 'Annotations that stack like pages in a deck.'),
  P('glyphs', 'Glyphs', 'type', 'wheel', 'ring', 'blackout-silhouette', 'none', 'Outlines, strokes and letterforms.', 'Letterforms riding a carousel ring.'),
  P('editorial', 'Editorial', 'type', 'tunnel', 'bare', 'privacy-quiet-grid', 'lines', 'Quotes, captions and footnotes.', 'Editorial parts met on a fly-through.'),

  /* 04 — Cards */
  P('tilt', 'Tilt', 'cards', 'tunnel', 'lift', 'isometric-module', 'cross', 'Cards with depth and weight.', 'Parallax and tilt surfaces in a deep column.'),
  P('glow', 'Glow', 'cards', 'canvas', 'dash', 'glass-prism', 'none', 'Spotlights, beams and borders of light.', 'Light-led cards on a dark canvas, found by flying across it.'),
  P('fold', 'Fold', 'cards', 'wheel', 'plate', 'split-prism', 'dots', 'Cards that flip, fold and peel.', 'Turning, folding cards on a rotating ring.'),
  P('bento', 'Bento', 'cards', 'atlas', 'plate', 'dashboard-tiles', 'dots', 'Tiles that tessellate.', 'Dashboard tiles on one sheet, dived into one by one.'),
  P('passes', 'Passes', 'cards', 'canvas', 'ticket', 'redacted-timeline-branch', 'lines', 'Tickets, receipts and badges.', 'Perforated passes scattered over a canvas the camera flies across.'),

  /* 05 — Navigation */
  P('tabs', 'Tabs', 'navigation', 'index', 'edge', 'timeline-pulse', 'lines', 'Strips, pills and segments that glide.', 'Tab systems beside a live index.'),
  P('docks', 'Docks', 'navigation', 'canvas', 'plate', 'architecture-layer', 'none', 'Floating bars, rails and toolbars.', 'Bars and rails on a canvas the camera flies across.'),
  P('menus', 'Menus', 'navigation', 'split', 'bracket', 'orbital-command', 'rings', 'Dropdowns, radials and command lists.', 'Menu forms around a pinned node map.'),
  P('steps', 'Steps', 'navigation', 'rail', 'cross', 'workflow-river', 'ruler', 'Steppers, breadcrumbs and pagination.', 'Sequences along a sideways rail.'),
  P('waypoints', 'Waypoints', 'navigation', 'atlas', 'bracket', 'compass-vector', 'cross', 'Outlines, contents and wayfinding.', 'Wayfinding pieces on an atlas you fly across.'),

  /* 06 — Feedback */
  P('loaders', 'Loaders', 'feedback', 'spiral', 'bare', 'orbital-node', 'rings', 'Forty ways to wait.', 'Spinners and waiting states wound out along a spiral.'),
  P('toasts', 'Toasts', 'feedback', 'stack', 'lift', 'trigger-action-pulse', 'none', 'Alerts, banners and notices.', 'Notices that arrive and pile up.'),
  P('progress', 'Progress', 'feedback', 'counter', 'plate', 'build-pipeline', 'lines', 'Bars, rings and vessels that fill.', 'Fills and meters in counter-scrolling columns.'),
  P('skeletons', 'Skeletons', 'feedback', 'slides', 'dash', 'unknown-silhouette', 'none', 'Placeholders and empty states.', 'Waiting shapes cut in one at a time.'),
  P('signals', 'Signals', 'feedback', 'splitR', 'slab', 'topology-pulse', 'dots', 'Lights, pills and health.', 'Status lights beside a pinned beacon.'),

  /* 07 — Overlays */
  P('popovers', 'Popovers', 'overlays', 'split', 'cross', 'network-constellation', 'dots', 'Tooltips, hover cards and callouts.', 'Anchored overlays with a pinned reference.'),
  P('sheets', 'Sheets', 'overlays', 'tunnel', 'plate', 'secure-boundary', 'lines', 'Drawers, modals and layered panes.', 'Layered panes met on a fly-through.'),
  P('cursors', 'Cursors', 'overlays', 'canvas', 'dash', 'magnetic-particles', 'cross', 'Pointers, followers and magnets.', 'Pointer effects across a canvas the camera flies over.'),
  P('wipes', 'Wipes', 'overlays', 'slides', 'bare', 'liquid-metal', 'none', 'Curtains, clips and reveals.', 'Transitions cut in by a moving edge.'),
  P('lenses', 'Lenses', 'overlays', 'rows', 'ring', 'concentric-gate', 'rings', 'Magnifiers, compare and focus.', 'Lenses on belts that slide both ways.'),

  /* 08 — Objects */
  P('cockpit', 'Cockpit', 'objects', 'wheel', 'bracket', 'radar-cutaway', 'rings', 'Instruments with presence.', 'Flight instruments on a rotating ring.'),
  P('studio', 'Studio', 'objects', 'splitR', 'slab', 'audio-signal-wall', 'lines', 'Meters, reels and faders for sound.', 'Studio gear beside a pinned VU needle.'),
  P('terminal', 'Terminal', 'objects', 'index', 'bracket', 'command-terminal', 'lines', 'Code, logs and command-line pieces.', 'Console parts with a live index.'),
  P('stamps', 'Stamps', 'objects', 'canvas', 'tape', 'permission-orbit', 'none', 'Labels, seals, stickers and tape.', 'Marks pressed onto a canvas, found one by one.'),
  P('archive', 'Archive', 'objects', 'stack', 'edge', 'architectural-grid', 'lines', 'Files, drawers and index cards.', 'Records filed in a sticky deck.'),

  /* 09 — Ground */
  P('beams', 'Beams', 'ground', 'spine', 'bare', 'circuit-trace', 'lines', 'Lines and traces of light.', 'Light traces running along a spine.'),
  P('patterns', 'Patterns', 'ground', 'atlas', 'cross', 'hex-lattice', 'none', 'Grids, dots and hatching as surfaces.', 'Surfaces laid out on one sheet.'),
  P('drift', 'Drift', 'ground', 'spiral', 'ring', 'flow-field', 'none', 'Particles, stars and rain.', 'Particle systems wound out along a spiral.'),
  P('waves', 'Waves', 'ground', 'rows', 'edge', 'wave-interference', 'lines', 'Ripples, interference and noise.', 'Wave forms on sliding belts.'),
  P('morphs', 'Morphs', 'ground', 'canvas', 'bare', 'liquid-glass-operational', 'none', 'Shapes that become other shapes.', 'Shape-changers scattered across a canvas.'),

  /* 10 — Patterns */
  P('handset', 'Handset', 'patterns', 'split', 'lift', 'client-portal-gate', 'dots', 'Mobile screens, onboarding to settings.', 'Phone-screen patterns beside a pinned handset.'),
  P('boards', 'Boards', 'patterns', 'atlas', 'plate', 'scheduling-grid', 'cross', 'Kanban, calendars and agendas.', 'Planning surfaces on one sheet.'),
  P('feeds', 'Feeds', 'patterns', 'index', 'plate', 'node-compression', 'none', 'Lists, chats and notification streams.', 'Streams and lists with a live index.'),
  P('checkout', 'Checkout', 'patterns', 'columns', 'ticket', 'transaction-wave', 'lines', 'Pricing, carts and order flows.', 'Sample pricing and order parts in parallax columns.'),
  P('heroes', 'Heroes', 'patterns', 'canvas', 'bracket', 'hex-tunnel', 'none', 'Opening screens, bands and endings.', 'Layouts for opening screens, scattered across a canvas.'),
];

export const showcasePath = (slug) => `/showcase/${slug}`;
export const pageBySlug = (slug) => showcasePages.find((p) => p.slug === slug) || null;
export const pagesIn = (chapterId) => showcasePages.filter((p) => p.chapter === chapterId);
export const chapterById = (id) => chapters.find((c) => c.id === id) || null;
export const showcaseNumber = (slug) => showcasePages.findIndex((p) => p.slug === slug) + 1;
