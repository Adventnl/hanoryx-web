export const meta = {
  name: 'hanoryx-scene-library',
  description: 'Generate 40 visually-distinct canvas background scenes for Hanoryx Systems',
  phases: [{ title: 'Author scenes', detail: 'one agent per scene preset' }],
};

const DIR = '/Users/adventnl/hanoryx-web/src/animation/scenes/presets';

const SHARED = `
You are writing ONE self-contained canvas background "scene" file for the Hanoryx Systems site
(dark, premium, technical, restrained — black background, white lines, sparse red accent #ff3333).

WRITE THE FILE with the Write tool to the EXACT path given. It must be a single ES module.

EXACT import block (copy verbatim, then drop any primitive you do not use):
\`\`\`
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid, drawDotGrid, drawArcs, drawRadialBars, drawWave, drawAudioWave, drawHex, drawParticles, drawNodes, drawContours, drawRibbons, drawVoronoi, drawIsometric, drawRedaction, drawGlyphs, drawScan, drawRadar, drawVectorField, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';
\`\`\`

EXACT shape (fill in the draw body; keep resize + dispose):
\`\`\`
registerScene('SCENE_NAME', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  // optional: derive counts from quality ('static'|'low'|'medium'|'high') and density (~0.5..1.4)
  const build = (w, h) => { W = w; H = h; };
  build(width, height);
  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer, audio }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);            // ALWAYS clear first
      const p = pointer || {};               // {active,x,y,nx,ny} — may be empty
      // ...compose 1-3 primitives + your own structure/motion here...
    },
    dispose() {},
  };
});
\`\`\`

PRIMITIVE API (all take (ctx, opts); opts use w,h,t in pixels/seconds; accent = the A() fn):
- drawGrid(ctx,{w,h,t,cell,alpha,scroll,accentEvery,accent})    scrolling line grid
- drawDotGrid(ctx,{w,h,t,cell,alpha,accent,pulse})              dot lattice w/ pulse wave
- drawArcs(ctx,{cx,cy,t,count,rStep,alpha,accent,accentRing,spread})  concentric rotating arcs
- drawRadialBars(ctx,{cx,cy,t,count,inner,alpha,accent,bands,level})  bars around a circle (audio: pass bands)
- drawWave(ctx,{w,h,t,rows,amp,alpha,accent,level})            stacked sine waves
- drawAudioWave(ctx,{w,h,t,bands,level,alpha,accent,mode})     mode 'bars'|'wave'; pass bands for audio
- drawHex(ctx,{w,h,t,size,alpha,accent})                       hex lattice
- drawParticles(ctx,{w,h,t,count,alpha,accent,connect,speed,pointer})  drifting points (returns pts)
- drawNodes(ctx,{w,h,t,count,alpha,accent})                    network nodes + packets (returns nodes)
- drawContours(ctx,{w,h,t,lines,alpha,accent})                 topographic contour bands
- drawRibbons(ctx,{w,h,t,count,alpha,accent})                  flowing spline ribbons
- drawVoronoi(ctx,{w,h,t,seeds,alpha,accent})                  cell web (returns pts)
- drawIsometric(ctx,{w,h,t,size,alpha,accent})                 isometric module field
- drawRedaction(ctx,{w,h,t,rows,alpha,accent})                 redaction bars w/ reveal flicker
- drawGlyphs(ctx,{w,h,t,cols,alpha,accent,fontSize})           falling glyph columns
- drawScan(ctx,{w,h,t,axis,alpha,accent,speed})               soft moving scan band ('x'|'y')
- drawRadar(ctx,{cx,cy,t,radius,rings,alpha,accent})          radar rings + rotating sweep
- drawVectorField(ctx,{w,h,t,cell,alpha,accent,pointer})      arrow flow field (pointer-warped)
- hash(n), hash2(x,y) -> 0..1 deterministic; white(alpha) -> rgba string; A(alpha) -> red rgba

DRAW PARAMS at runtime: \`pointer\` is an object {active,x,y,nx,ny} (nx,ny are -1..1). \`audio\` is
an object {active:boolean, level:0..1, bands:Float32Array(32)} — use it ONLY for audio-reactive scenes;
when audio.active is false, pass bands:null to the primitive so it shows idle motion.

HARD RULES — the file is rejected if it breaks any:
1. ctx.clearRect(0,0,W,H) is the FIRST draw call every frame.
2. Use ONLY the imports above + Math. No new deps, no DOM, no external files, no fetch.
3. Keep red sparse and premium: most lines white() at LOW alpha (0.03-0.2); red A() only for highlights/cores.
4. Allocation: small per-frame arrays from primitives are fine; do NOT allocate arrays of size > ~200 per frame.
5. Must be VISUALLY DISTINCT in STRUCTURE/motion from other scenes — not just a recolored grid.
   Different accent/density/speed alone does NOT count. Build a recognisable shape language.
6. The registerScene name MUST be exactly the SCENE_NAME given. One registerScene call only.
7. No console.log. No comments referencing this prompt. Add a 1-line top comment describing the scene.
8. If you guard pointer/audio, default them: const p = pointer||{}; const au = audio||{};
`;

const SCENES = [
  ['orbitalCommandScene.js', 'orbital-command', 'A single command ring with route-like nodes evenly spaced around it; short packets travel along chords between nodes; a pulsing core in the middle. Use drawArcs lightly + your own ring of nodes + travelling dots. Reads as an operations command ring.'],
  ['hexTunnelScene.js', 'hex-tunnel', 'A perspective hexagon tunnel: concentric hexagons scaling outward from the centre toward the viewer (z-motion), each rotated slightly, fading with depth. Build hexagons yourself with a loop (do not use drawHex which is a flat lattice). One accent hex ring pulses.'],
  ['polarStatusScene.js', 'polar-status', 'A polar status dial: radial tick gauge, an arc that fills to a slowly changing value, small satellite readout dots, and a sweeping indicator. Use drawArcs + drawRadialBars sparingly + your own gauge arc.'],
  ['topologyPulseScene.js', 'topology-pulse', 'Topographic contour lines flowing horizontally (drawContours) with a bright radial pulse ring that periodically expands from a moving point, briefly lifting the contour brightness near it.'],
  ['commercePipelineScene.js', 'commerce-pipeline', 'Abstract commerce/order pipeline: 3-4 horizontal lanes with order tokens (small squares) flowing left to right through stage gates (vertical ticks); occasional token turns red (flagged). No generic grid.'],
  ['workflowRiverScene.js', 'workflow-river', 'River-like directional flow: many near-parallel curved streamlines drifting in one direction with varying speed (use drawRibbons as a base but add directional flow particles riding the curves).'],
  ['permissionOrbitScene.js', 'permission-orbit', 'Roles/permissions as nodes orbiting a central lock core at two or three concentric radii, each orbit rotating at a different rate; thin radial connectors blink when a node aligns. Build the orbits yourself.'],
  ['dataInterfaceWaveScene.js', 'data-interface-wave', 'Data interface traces: an oscilloscope-style multi-line graph (drawWave) over a faint measurement grid (drawGrid), with a moving vertical cursor line and a readout dot tracking the top trace.'],
  ['clientPortalGateScene.js', 'client-portal-gate', 'A secure portal gate: two large concentric rings that rhythmically open (arc gaps widen then close) like an iris/aperture, with a scanning beam (drawScan radial-ish) and a locked core glyph.'],
  ['researchBlackoutScene.js', 'research-blackout', 'A redacted research field: drawRedaction rows of blacked-out bars, with rare cells flickering a partial reveal, plus a slow horizontal scan (drawScan) that momentarily exposes more. Mostly dark, ominous.'],
  ['motionCurveFieldScene.js', 'motion-curve-field', 'Easing curves drawn as a background: several bezier/ease curves plotted on a faint axis grid, a dot animating along each curve at its own easing, labels-as-ticks. Reads like a motion-grammar reference.'],
  ['interfaceLabShapeScene.js', 'interface-lab-shape', 'UI specimen shapes morphing: abstract rounded-rect "component" outlines that periodically resize/rearrange (toolbars, cards, toggles) on a snap grid, with corner brackets. Build rects yourself.'],
  ['architectureLayerScene.js', 'architecture-layer', 'A layered system blueprint: 4-5 stacked horizontal slab layers drawn in slight isometric skew, with vertical connectors between layers and a data pulse rising through the stack.'],
  ['toolingConsoleScene.js', 'tooling-console', 'A command console field: a faint terminal with a blinking caret, lines of mono glyph text typing in (drawGlyphs adapted to left-aligned rows), and a command-palette box that slides in/out.'],
  ['musebaseCoordinationScene.js', 'musebase-coordination', 'Abstract coordination orbit: a central core with FOUR labelled module clusters around it (scheduling, communication, records, payment as abstract node clusters, NO literal text needed) connected by curved links that pulse as coordination happens. Premium, mysterious.'],
  ['unknownSilhouetteScene.js', 'unknown-silhouette', 'A blacked-out future system object: a large dark silhouette mass (irregular polygon) in the centre that subtly breathes, surrounded by a sparse scanning frame and a few redacted readout ticks. Withheld, ominous.'],
  ['contactTransmissionScene.js', 'contact-transmission', 'A signal transmission field: concentric transmission rings emitting outward from a source point at intervals (like sonar pings), faint carrier waves (drawWave) underneath, and a few drifting signal motes.'],
  ['statusPulseGridScene.js', 'status-pulse-grid', 'A system status grid: a matrix of small status cells (dots/squares) where pulses of "active" state sweep across in diagonal waves; most cells dim, a few green/red-accented active. Use drawDotGrid as inspiration but make cells square status tiles.'],
  ['privacyQuietGridScene.js', 'privacy-quiet-grid', 'A calm, very quiet legal-page grid: a slow faint drawGrid with a single soft drawScan passing occasionally and a couple of slow drifting tick marks. Minimal motion, restrained.'],
  ['errorSignalLostScene.js', 'error-signal-lost', 'A broken/lost-signal animation (404): a flatlining waveform that glitches and drops out, intermittent static bands, and a faint search radar sweep (drawRadar) hunting but finding nothing. Slightly unstable but controlled.'],
  ['magneticVectorScene.js', 'magnetic-vector', 'A cursor-influenced magnetic vector field: drawVectorField warped strongly by pointer; arrows bend toward/around the cursor; a faint accent ripple at the cursor position. Works with no pointer too.'],
  ['radarCutawayScene.js', 'radar-cutaway', 'A partial radar cutaway: a quarter/half radar (drawRadar but clipped to a corner) with range rings, sweep, and blips that appear then fade. Asymmetric composition anchored to one corner.'],
  ['isometricInfraScene.js', 'isometric-infra', 'An isometric infrastructure field (drawIsometric) where modules light up in travelling clusters and a couple of vertical "data columns" rise from lit modules. Blueprint feel.'],
  ['redactedTimelineBranchScene.js', 'redacted-timeline-branch', 'A timeline branch masked by redaction: a central horizontal timeline spine with branch lines forking off; active branches draw in solid, future branches are redaction bars that flicker. Time markers tick along the spine.'],
  ['liquidGlassOperationalScene.js', 'liquid-glass-operational', 'Liquid-glass capsule shapes drifting: several large rounded translucent capsules/blobs slowly floating and overlapping with soft outline highlights and faint refraction lines. Elegant, operational calm.'],
  ['nodeCompressionScene.js', 'node-compression', 'Many scattered nodes that periodically COMPRESS toward a centre forming an ordered system, then disperse again — a breathing self-organising cluster with connector lines that strengthen when compressed.'],
  ['splitPrismScene.js', 'split-prism', 'Diagonal prism panes: the field divided by several diagonal slices that shift offset, each pane carrying a faint different texture (lines vs dots vs blank); a light edge highlight travels along the slice seams.'],
  ['glyphCompilerScene.js', 'glyph-compiler', 'Abstract symbols compiling into labels: scattered glyphs that drift then snap into neat left-aligned rows (compiling), hold, then scatter again. Mono, technical, like code assembling.'],
  ['compassVectorFieldScene.js', 'compass-vector-field', 'A rotational compass field: a large faint compass rose in the centre with cardinal ticks slowly rotating, and a vector field of small needles all pointing along the current compass heading. Directional.'],
  ['heatmapControlScene.js', 'heatmap-control', 'An operational heatmap: a grid of cells whose intensity (alpha) ebbs in smooth blobs of activity moving across the grid; hottest cells get a red accent outline. Reads like a control dashboard heatmap.'],
  ['radialAudioCoreScene.js', 'radial-audio-core', 'AUDIO-REACTIVE: a radial spectrum core — drawRadialBars around a centre using audio.bands when audio.active, idle procedural when not; add an expanding pulse ring on loud beats (level). The audio companion to motion pages.'],
  ['signalSpectrumFieldScene.js', 'signal-spectrum-field', 'AUDIO-REACTIVE: a wide spectral ribbon field — multiple stacked spectrum lines (drawAudioWave mode wave) reacting to audio.bands, with a faint grid; idle wave motion when audio off. Subtle, full-width.'],
  ['dependencyGraphScene.js', 'dependency-graph', 'An engineering dependency graph: nodes arranged in loose layers (left-to-right) with directed edges; a build wave sweeps left to right lighting edges/nodes in order. Reads like a module dependency DAG.'],
  ['buildPipelineScene.js', 'build-pipeline', 'A CI/build pipeline: 5 stage gates connected in a horizontal chain; a build token advances stage by stage, each completed stage fills with a check-tick pulse; occasional parallel branch. Mono ticks.'],
  ['schedulingGridScene.js', 'scheduling-grid', 'A scheduling/calendar grid: a week-like column/row grid where booking blocks of varying length fade in across lanes and a "now" line sweeps horizontally; some blocks accent red. Abstract, not literal dates.'],
  ['transactionWaveScene.js', 'transaction-wave', 'A commerce transaction wave: a ticker-style baseline with transaction spikes erupting upward at intervals (varying heights), a running cumulative line rising slowly, faint value gridlines. Markets/throughput feel.'],
  ['triggerActionPulseScene.js', 'trigger-action-pulse', 'Automation trigger->action: trigger nodes on the left fire pulses that travel along rule-lines to action nodes on the right which flash on arrival; some rules branch. Cause-and-effect rhythm.'],
  ['dashboardTilesScene.js', 'dashboard-tiles', 'An internal dashboard: a bento layout of tiles (rects of varied sizes) each with a tiny live element (mini sparkline / bar / dot) animating; a focus highlight moves tile to tile. Control-surface feel.'],
  ['dataStreamRibbonsScene.js', 'data-stream-ribbons', 'Data stream ribbons: several bright thin ribbons of flowing dashes moving across diagonally like data in transit, with packet glints; a faint baseline grid. Distinct from workflow-river by being straight diagonal streams of dashes.'],
  ['secureBoundaryScene.js', 'secure-boundary', 'A secure boundary diagram: a central protected zone outlined by a dashed perimeter that rotates; access nodes approach from outside and either pass through a gate (accent) or are deflected. Security perimeter feel.'],
];

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'file', 'ok'],
  properties: {
    name: { type: 'string' },
    file: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
};

phase('Author scenes');
const results = await parallel(
  SCENES.map(([file, name, concept]) => () =>
    agent(
      `${SHARED}\n\nSCENE TO BUILD\nFile path (Write here exactly): ${DIR}/${file}\nregisterScene name (exact): '${name}'\nConcept: ${concept}\n\nWrite the complete file now, then return {name, file, ok:true, note:<one line on the visual>}.`,
      { label: `scene:${name}`, phase: 'Author scenes', schema: SCHEMA }
    )
  )
);

const ok = results.filter(Boolean).filter((r) => r.ok);
log(`authored ${ok.length}/${SCENES.length} scenes`);
return { count: ok.length, total: SCENES.length, scenes: results.filter(Boolean) };
