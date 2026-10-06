import clsx from 'clsx';
import styles from './ArticleArt.module.css';

/* One small drawing per article, on a 200 × 140 grid. Every stroke carries
   pathLength=1, so it draws itself in (one-shot, staggered). Pure SVG — no state. */
const P = (props, i) => ({ pathLength: 1, style: { '--i': i }, ...props });

const ARTS = {
  retry: (
    <>
      <path {...P({ d: 'M12 44 H84' }, 0)} />
      <path {...P({ d: 'M84 34 L98 54 M98 34 L84 54', className: 'red' }, 1)} />
      <path {...P({ d: 'M12 96 H150 M138 86 L150 96 L138 106' }, 2)} />
      <rect {...P({ x: 156, y: 80, width: 32, height: 32, rx: 4 }, 3)} />
      <path {...P({ d: 'M164 96 H180 M172 88 V104', className: 'red' }, 4)} />
      <path {...P({ d: 'M12 70 H188', className: 'faint' }, 5)} />
    </>
  ),
  trail: (
    <>
      <path {...P({ d: 'M30 14 V126' }, 0)} />
      {[28, 52, 76, 100].map((y, k) => (
        <g key={y}>
          <circle {...P({ cx: 30, cy: y, r: 5, className: k === 1 ? 'red' : '' }, k + 1)} />
          <path {...P({ d: `M46 ${y} H${70 + k * 30}`, className: k === 1 ? 'red' : '' }, k + 2)} />
          <path {...P({ d: `M46 ${y + 9} H${58 + k * 14}`, className: 'faint' }, k + 3)} />
        </g>
      ))}
    </>
  ),
  matrix: (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const x = 24 + (i % 4) * 36;
        const y = 16 + Math.floor(i / 4) * 28;
        return <rect key={i} {...P({ x, y, width: 24, height: 18, rx: 3, className: [0, 5, 6, 10, 15].includes(i) ? 'red' : '' }, i % 8)} />;
      })}
    </>
  ),
  runbook: (
    <>
      {[20, 46, 72, 98].map((y, k) => (
        <g key={y}>
          <rect {...P({ x: 20, y, width: 16, height: 16, rx: 3, className: k === 0 ? 'red' : '' }, k * 2)} />
          {k < 2 && <path {...P({ d: `M24 ${y + 8} L28 ${y + 12} L34 ${y + 4}`, className: 'red' }, k * 2 + 1)} />}
          <path {...P({ d: `M50 ${y + 8} H${150 - k * 18}`, className: k === 0 ? '' : 'faint' }, k * 2 + 1)} />
        </g>
      ))}
    </>
  ),
  lanes: (
    <>
      {[28, 70, 112].map((y, k) => <path key={y} {...P({ d: `M12 ${y} H188`, className: 'faint' }, k)} />)}
      {[30, 80, 130, 180].map((x, i) => <circle key={x} {...P({ cx: x, cy: 28, r: 5 }, i + 1)} />)}
      {[40, 52, 64, 76, 88].map((x, i) => <circle key={x} {...P({ cx: x, cy: 70, r: 4, className: 'red' }, i + 2)} />)}
      {[22, 58, 64, 118, 124, 160].map((x, i) => <circle key={x} {...P({ cx: x, cy: 112, r: 4 }, i + 3)} />)}
    </>
  ),
  contract: (
    <>
      <path {...P({ d: 'M52 18 C34 18 38 54 24 70 C38 86 34 122 52 122' }, 0)} />
      <path {...P({ d: 'M148 18 C166 18 162 54 176 70 C162 86 166 122 148 122' }, 1)} />
      <path {...P({ d: 'M78 44 H122 M78 70 H122 M78 96 H110', className: 'faint' }, 2)} />
      <path {...P({ d: 'M78 70 H122', className: 'red' }, 3)} />
      <circle {...P({ cx: 130, cy: 70, r: 4, className: 'red' }, 4)} />
    </>
  ),
  handover: (
    <>
      <circle {...P({ cx: 40, cy: 76, r: 18 }, 0)} />
      <circle {...P({ cx: 160, cy: 76, r: 18, className: 'red' }, 1)} />
      <path {...P({ d: 'M62 76 H138' }, 2)} />
      <path {...P({ d: 'M82 66 H118 V86 H82 Z', className: 'red' }, 3)} />
      <path {...P({ d: 'M160 58 V26 L184 36 L160 46', className: 'faint' }, 4)} />
    </>
  ),
  budget: (
    <>
      <path {...P({ d: 'M24 112 A76 76 0 0 1 176 112' }, 0)} />
      <path {...P({ d: 'M24 112 A76 76 0 0 1 112 40', className: 'red' }, 1)} />
      <path {...P({ d: 'M100 112 L112 40' }, 2)} />
      <circle {...P({ cx: 100, cy: 112, r: 5, className: 'red' }, 3)} />
      <path {...P({ d: 'M112 30 V46', className: 'faint' }, 4)} />
    </>
  ),
};

export default function ArticleArtShape({ art, className }) {
  return (
    <svg viewBox="0 0 200 140" className={clsx(styles.art, className)} fill="none" aria-hidden="true">
      {ARTS[art] || ARTS.matrix}
    </svg>
  );
}
