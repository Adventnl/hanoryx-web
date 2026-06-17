/* ============================================================
   SYSTEM SYNTHESIS — timeline model for the 20-second pure-code cinematic.
   Pure data + envelope math shared by the canvas renderer and the GSAP DOM
   choreography. No rendering here; this is the single source of truth for
   *when* each phase happens so the canvas and the DOM overlay stay in lock-step.
   ============================================================ */

export const TOTAL = 20; // seconds

/* The eleven phases of the assembly, in wall-clock seconds. `code` is the
   telemetry tag shown in the HUD; `name` is the human label. */
export const PHASES = [
  { id: 'black-start', name: 'Black Start', code: 'SYS.BOOT', start: 0.0, end: 1.5 },
  { id: 'core-ignition', name: 'Core Ignition', code: 'SYS.IGN', start: 1.5, end: 3.0 },
  { id: 'grid-construction', name: 'Grid Construction', code: 'SYS.GRID', start: 3.0, end: 5.0 },
  { id: 'fragment-assembly', name: 'Fragment Assembly', code: 'SYS.FRAG', start: 5.0, end: 7.0 },
  { id: 'north-activation', name: 'Hanoryx North Activation', code: 'NTH.PWR', start: 7.0, end: 9.0 },
  { id: 'systems-expansion', name: 'Systems Expansion', code: 'SYS.EXP', start: 9.0, end: 11.0 },
  { id: 'timeline-pull', name: 'Project Timeline Pull', code: 'WRK.SEQ', start: 11.0, end: 13.0 },
  { id: 'interface-convergence', name: 'Interface Convergence', code: 'IFC.CONV', start: 13.0, end: 15.0 },
  { id: 'signal-wall', name: 'Signal Wall', code: 'SIG.WALL', start: 15.0, end: 17.0 },
  { id: 'system-lock', name: 'System Lock', code: 'SYS.LOCK', start: 17.0, end: 19.0 },
  { id: 'release', name: 'Release', code: 'SYS.LIVE', start: 19.0, end: 20.0 },
];

export function phaseAt(t) {
  for (let i = 0; i < PHASES.length; i += 1) {
    if (t < PHASES[i].end) return { ...PHASES[i], index: i };
  }
  return { ...PHASES[PHASES.length - 1], index: PHASES.length - 1 };
}

/* ---- envelope helpers (no abrupt cuts: everything ramps) ---- */

// linear 0..1 ramp between a and b
export function seg(t, a, b) {
  if (b <= a) return t >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (t - a) / (b - a)));
}

// smoothstep version for organic acceleration
export function segSmooth(t, a, b) {
  const x = seg(t, a, b);
  return x * x * (3 - 2 * x);
}

// trapezoid envelope: fades in over `fin`, holds at 1, fades out over `fout`
export function env(t, a, b, fin = 0.4, fout = 0.4) {
  if (t < a || t > b) return 0;
  const up = seg(t, a, a + fin);
  const down = 1 - seg(t, b - fout, b);
  return Math.min(up, down);
}

/* ---- copy used in the canvas + DOM overlay ---- */

export const ROUTE_LABELS = ['ENGINEERING', 'INTERFACE LAB', 'MOTION SYSTEMS', 'ARCHITECTURE', 'TOOLING'];

export const MODULE_LABELS = [
  'OPERATIONAL MGMT',
  'COMMERCE INFRA',
  'AUTOMATION',
  'INTERNAL PLATFORMS',
  'DATA INTERFACES',
  'CLIENT PORTALS',
  'RESEARCH SYSTEMS',
];

/* project nodes for the timeline pull — solid ones first, then redacted */
export const PROJECT_NODES = [
  { label: 'COMMERCE SYSTEM I', code: 'WRK.01', redacted: false },
  { label: 'MUSEBASE', code: 'WRK.02', redacted: false },
  { label: 'NODE.07', code: 'WRK.04', redacted: true },
  { label: 'NODE.08', code: 'WRK.05', redacted: true },
  { label: 'NODE.09', code: 'WRK.06', redacted: true },
];

/* low-level boot telemetry streamed in phase 1 */
export const STATUS_MESSAGES = [
  '> initializing hanoryx kernel',
  '> mounting telemetry bus ............ ok',
  '> calibrating motion budget ......... ok',
  '> linking scene registry [67] ....... ok',
  '> spooling north node ............... ok',
  '> assembling interface surface ...... ok',
  '> system identity lock .............. ok',
];
