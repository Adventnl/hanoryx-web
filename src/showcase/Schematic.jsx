import clsx from 'clsx';
import styles from './Schematic.module.css';

/* A pocket diagram of how a stage moves: the red shape is the part that holds
   still (or the part you are looking at), the white shapes are what the scroll
   carries past. Drawn on a 120 x 80 grid, stroke only. */
const r = (x, y, w, h, hot) => <rect key={`r${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" className={hot ? styles.hot : undefined} />;
const p = (d, hot) => <path key={d} d={d} className={hot ? styles.hot : undefined} />;
const c = (x, y, rad, hot) => <circle key={`c${x}-${y}`} cx={x} cy={y} r={rad} className={hot ? styles.hot : undefined} />;

const DRAWINGS = {
  split: [r(6, 8, 44, 64, 1), r(62, 8, 52, 14), r(62, 28, 52, 14), r(62, 48, 52, 14), p('M117 14v44m-3-4 3 4 3-4')],
  splitR: [r(70, 8, 44, 64, 1), r(6, 8, 52, 14), r(6, 28, 52, 14), r(6, 48, 52, 14), p('M3 14v44m-3-4 3 4 3-4')],
  index: [p('M8 14h34M8 24h34M8 44h34M8 54h34M8 64h34'), p('M8 34h34', 1), r(54, 10, 60, 60)],
  counter: [r(10, 6, 40, 18), r(10, 30, 40, 18), r(10, 54, 40, 18), r(70, 16, 40, 18, 1), r(70, 40, 40, 18, 1), r(70, 64, 40, 12, 1)],
  rail: [r(6, 10, 28, 60, 1), r(42, 26, 22, 28), r(70, 26, 22, 28), r(98, 26, 22, 28), p('M44 66h40m-4-3 4 3-4 3')],
  stack: [r(24, 8, 72, 22), r(18, 20, 84, 22), r(12, 32, 96, 22), r(6, 44, 108, 26, 1)],
  orbit: [c(60, 40, 17, 1), r(6, 10, 32, 16), r(6, 50, 32, 16), r(82, 28, 32, 16), r(82, 58, 32, 14)],
  spine: [p('M60 4V76'), c(60, 18, 2.5, 1), c(60, 40, 2.5), c(60, 62, 2.5), r(8, 10, 40, 16), r(72, 32, 40, 16), r(8, 54, 40, 16)],
  wheel: [p('M6 58Q60 14 114 58', 1), r(40, 26, 40, 32), r(8, 34, 26, 26), r(86, 34, 26, 26)],
  tunnel: [r(6, 4, 108, 72), r(26, 16, 68, 48), r(44, 28, 32, 24, 1), p('M6 4l20 12M114 4 94 16M6 76l20-12M114 76 94 64')],
  slides: [r(6, 6, 108, 68), p('M6 52 114 28', 1), p('M30 20h30M30 30h18')],
  columns: [r(6, 8, 30, 64, 1), r(44, 8, 32, 20), r(44, 34, 32, 20), r(84, 18, 32, 20), r(84, 44, 32, 20)],
  map: [r(8, 8, 24, 18), r(36, 8, 24, 18), r(64, 8, 24, 18), r(92, 8, 20, 18), r(8, 30, 24, 18), r(36, 30, 24, 18), r(64, 30, 24, 18), r(92, 30, 20, 18), r(8, 52, 24, 18), r(36, 52, 24, 18), r(64, 52, 24, 18), r(92, 52, 20, 18), p('M10 18H108L12 40H108L12 62', 1)],
  rows: [r(6, 8, 30, 16), r(42, 8, 30, 16), r(78, 8, 30, 16), r(20, 32, 30, 16), r(56, 32, 30, 16), r(92, 32, 24, 16), r(6, 56, 30, 16), r(42, 56, 30, 16), r(78, 56, 30, 16), p('M100 4h14m-3-3 3 3-3 3M20 76H6m3-3-3 3 3 3', 1)],
  flow: [r(18, 6, 84, 18, 1), r(18, 30, 84, 12), r(18, 48, 84, 12), r(18, 66, 84, 10)],
  sheet: [r(8, 8, 32, 28), r(44, 8, 32, 28), r(80, 8, 32, 28), r(8, 44, 32, 28), r(44, 44, 32, 28, 1), r(80, 44, 32, 28)],
};

export function Schematic({ engine, className }) {
  return (
    <svg className={clsx(styles.svg, className)} viewBox="0 0 120 80" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {DRAWINGS[engine] || DRAWINGS.flow}
    </svg>
  );
}

export default Schematic;
