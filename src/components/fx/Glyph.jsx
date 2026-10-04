import clsx from 'clsx';
import styles from './Glyph.module.css';

/* A small set of hand-built pictograms on a 48x48 grid. Every shape carries
   pathLength=1, so on hover (or when `play` is set) each stroke redraws itself —
   the glyph "draws" rather than flashes. Stroke-only: colour is currentColor. */
const D = {
  orbit: [['circle', { cx: 24, cy: 24, r: 4 }], ['ellipse', { cx: 24, cy: 24, rx: 18, ry: 8, transform: 'rotate(-25 24 24)' }], ['circle', { cx: 39, cy: 17, r: 2 }]],
  layers: [['path', { d: 'M24 8 L42 17 L24 26 L6 17 Z' }], ['path', { d: 'M6 24 L24 33 L42 24' }], ['path', { d: 'M6 31 L24 40 L42 31' }]],
  flow: [['circle', { cx: 8, cy: 12, r: 3 }], ['circle', { cx: 40, cy: 36, r: 3 }], ['path', { d: 'M11 12 H24 C31 12 24 36 31 36 H37' }]],
  grid: [['rect', { x: 7, y: 7, width: 10, height: 10 }], ['rect', { x: 19, y: 7, width: 10, height: 10 }], ['rect', { x: 31, y: 7, width: 10, height: 10 }], ['rect', { x: 7, y: 19, width: 10, height: 10 }], ['rect', { x: 19, y: 19, width: 10, height: 10 }], ['rect', { x: 31, y: 19, width: 10, height: 10 }], ['rect', { x: 7, y: 31, width: 10, height: 10 }], ['rect', { x: 19, y: 31, width: 10, height: 10 }], ['rect', { x: 31, y: 31, width: 10, height: 10 }]],
  shield: [['path', { d: 'M24 6 L39 11 V23 C39 33 32 40 24 43 C16 40 9 33 9 23 V11 Z' }], ['path', { d: 'M17 24 L22 29 L31 19' }]],
  chart: [['path', { d: 'M8 40 V8' }], ['path', { d: 'M8 40 H42' }], ['path', { d: 'M15 33 V27 M23 33 V19 M31 33 V23 M39 33 V13' }]],
  terminal: [['rect', { x: 6, y: 9, width: 36, height: 30, rx: 3 }], ['path', { d: 'M13 19 L19 24 L13 29' }], ['path', { d: 'M23 30 H33' }]],
  cube: [['path', { d: 'M24 6 L40 15 V33 L24 42 L8 33 V15 Z' }], ['path', { d: 'M8 15 L24 24 L40 15' }], ['path', { d: 'M24 24 V42' }]],
  wave: [['path', { d: 'M4 24 C10 8 16 8 22 24 S34 40 44 24' }]],
  branch: [['circle', { cx: 14, cy: 10, r: 3 }], ['circle', { cx: 14, cy: 38, r: 3 }], ['circle', { cx: 35, cy: 20, r: 3 }], ['path', { d: 'M14 13 V35' }], ['path', { d: 'M14 29 C14 22 35 28 35 23' }]],
  key: [['circle', { cx: 16, cy: 24, r: 7 }], ['path', { d: 'M23 24 H42 M36 24 V30 M42 24 V28' }]],
  clock: [['circle', { cx: 24, cy: 24, r: 16 }], ['path', { d: 'M24 14 V24 L31 28' }]],
  doc: [['path', { d: 'M13 6 H28 L36 14 V42 H13 Z' }], ['path', { d: 'M28 6 V14 H36' }], ['path', { d: 'M18 24 H31 M18 30 H31 M18 36 H26' }]],
  spark: [['path', { d: 'M24 6 V16 M24 32 V42 M6 24 H16 M32 24 H42 M12 12 L19 19 M29 29 L36 36 M36 12 L29 19 M19 29 L12 36' }]],
  gate: [['path', { d: 'M10 42 V16 C10 8 38 8 38 16 V42' }], ['path', { d: 'M10 42 H38' }], ['path', { d: 'M24 11 V42' }]],
  lens: [['circle', { cx: 21, cy: 21, r: 12 }], ['path', { d: 'M30 30 L42 42' }]],
  stack: [['rect', { x: 8, y: 8, width: 32, height: 9, rx: 2 }], ['rect', { x: 8, y: 20, width: 32, height: 9, rx: 2 }], ['rect', { x: 8, y: 32, width: 32, height: 9, rx: 2 }]],
  loop: [['path', { d: 'M12 16 H32 A8 8 0 0 1 32 32 H16' }], ['path', { d: 'M21 28 L16 32 L21 36' }]],
  node: [['circle', { cx: 24, cy: 24, r: 5 }], ['circle', { cx: 8, cy: 12, r: 2.5 }], ['circle', { cx: 40, cy: 12, r: 2.5 }], ['circle', { cx: 8, cy: 38, r: 2.5 }], ['circle', { cx: 40, cy: 38, r: 2.5 }], ['path', { d: 'M10 14 L20 21 M38 14 L28 21 M10 36 L20 27 M38 36 L28 27' }]],
  ruler: [['rect', { x: 5, y: 16, width: 38, height: 16, rx: 2 }], ['path', { d: 'M12 16 V23 M19 16 V25 M26 16 V23 M33 16 V25 M40 16 V23' }]],
  cart: [['path', { d: 'M5 10 H11 L16 32 H38 L42 17 H13' }], ['circle', { cx: 20, cy: 39, r: 2.5 }], ['circle', { cx: 35, cy: 39, r: 2.5 }]],
  engine: [['circle', { cx: 24, cy: 24, r: 7 }], ['path', { d: 'M24 6 V12 M24 36 V42 M6 24 H12 M36 24 H42 M11 11 L15 15 M33 33 L37 37 M37 11 L33 15 M15 33 L11 37' }]],
  database: [['ellipse', { cx: 24, cy: 12, rx: 14, ry: 5 }], ['path', { d: 'M10 12 V36 C10 39 16 41 24 41 S38 39 38 36 V12' }], ['path', { d: 'M10 24 C10 27 16 29 24 29 S38 27 38 24' }]],
  people: [['circle', { cx: 17, cy: 17, r: 5 }], ['circle', { cx: 33, cy: 19, r: 4 }], ['path', { d: 'M7 38 C7 30 12 27 17 27 S27 30 27 38' }], ['path', { d: 'M29 38 C29 32 32 29 36 29 S42 32 42 38' }]],
  calendar: [['rect', { x: 7, y: 10, width: 34, height: 30, rx: 3 }], ['path', { d: 'M7 19 H41 M16 6 V13 M32 6 V13' }], ['path', { d: 'M15 27 H19 M23 27 H27 M31 27 H35 M15 33 H19 M23 33 H27' }]],
  compass: [['circle', { cx: 24, cy: 24, r: 17 }], ['path', { d: 'M30 18 L26 26 L18 30 L22 22 Z' }]],
  pulse: [['path', { d: 'M4 26 H14 L19 12 L26 38 L31 22 L34 26 H44' }]],
};


/**
 * <Glyph name="layers" size={44} play />
 * `play` replays the draw-in once (change `playKey` to retrigger); hovering any
 * ancestor with the class `glyph-host` also redraws it.
 */
export function Glyph({ name, size = 40, className, playKey = 0, title, ...rest }) {
  const shapes = D[name] || D.node;
  return (
    <svg
      key={playKey}
      className={clsx(styles.glyph, playKey > 0 && styles.play, className)}
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      {...rest}
    >
      {shapes.map(([tag, attrs], i) => {
        const Shape = tag;
        return <Shape key={i} pathLength="1" {...attrs} style={{ '--gi': i }} />;
      })}
    </svg>
  );
}

export default Glyph;
