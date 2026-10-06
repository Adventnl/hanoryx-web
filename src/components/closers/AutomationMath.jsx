import { useMemo, useState } from 'react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import tool from '../signatures/tool.module.css';
import styles from './AutomationMath.module.css';

/** Is it worth automating? Put in how long a job takes, how often it happens,
 *  what it costs to build and what it costs to keep running; the page says when it
 *  pays for itself, if it ever does. Your numbers; the arithmetic only. */
export default function AutomationMath({ tag, title, lede, onward }) {
  const [minutes, setMinutes] = useState(20);
  const [perWeek, setPerWeek] = useState(10);
  const [build, setBuild] = useState(40);
  const [upkeep, setUpkeep] = useState(15);
  const [years, setYears] = useState(3);

  const r = useMemo(() => {
    const savedPerWeek = (minutes * perWeek) / 60; // hours
    const upkeepPerWeek = (build * (upkeep / 100)) / 52; // hours a week to keep it alive
    const net = savedPerWeek - upkeepPerWeek;
    const weeks = years * 52;
    const total = net * weeks - build;
    const breakEven = net > 0 ? build / net : null;
    const points = Array.from({ length: 41 }, (_, i) => {
      const w = (i / 40) * weeks;
      return { w, v: net * w - build };
    });
    return { savedPerWeek, upkeepPerWeek, net, total, breakEven, points, weeks };
  }, [minutes, perWeek, build, upkeep, years]);

  const lo = Math.min(...r.points.map((p) => p.v), 0);
  const hi = Math.max(...r.points.map((p) => p.v), 1);
  const X = (w) => (w / r.weeks) * 300;
  const Y = (v) => 104 - ((v - lo) / (hi - lo || 1)) * 96;
  const line = r.points.map((p) => `${X(p.w).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const verdict = r.breakEven === null ? 'It never pays for itself: keeping it running costs as much as it saves.' : r.breakEven > r.weeks ? `It pays for itself after about ${Math.round(r.breakEven)} weeks, which is longer than the ${years} years you are planning for.` : `It pays for itself after about ${Math.round(r.breakEven)} weeks.`;

  const slider = (label, value, set, lo2, hi2, unit) => (
    <label className={tool.field}><span>{label} <b>{value}{unit}</b></span><input type="range" min={lo2} max={hi2} value={value} onChange={(e) => set(Number(e.target.value))} /></label>
  );

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('automath.rig')}>
        <div className={styles.form}>
          {slider('The job takes', minutes, setMinutes, 1, 120, ' min')}
          {slider('It happens', perWeek, setPerWeek, 1, 100, ' a week')}
          {slider('Building the automation takes', build, setBuild, 2, 400, ' h')}
          {slider('Keeping it alive costs, each year,', upkeep, setUpkeep, 0, 60, '% of the build')}
          {slider('You will use it for', years, setYears, 1, 8, ' years')}
        </div>
        <div className={styles.out} aria-live="polite">
          <p className={styles.big}><b>{r.total >= 0 ? '+' : '−'}{Math.abs(Math.round(r.total))}</b> hours over {years} year{years > 1 ? 's' : ''}</p>
          <p className={styles.verdict}>{verdict}</p>
          <svg viewBox="0 0 300 112" className={styles.chart} role="img" aria-label="Cumulative hours saved against time, crossing zero at the break-even point">
            <line x1="0" x2="300" y1={Y(0)} y2={Y(0)} className={styles.zero} />
            <polyline points={line} className={styles.line} />
            {r.breakEven !== null && r.breakEven <= r.weeks && <circle cx={X(r.breakEven)} cy={Y(0)} r="4" className={styles.dot} />}
          </svg>
          <p className={styles.fine}>Saves {r.savedPerWeek.toFixed(1)} h a week; upkeep takes {r.upkeepPerWeek.toFixed(2)} h a week. Remember to count the time to notice when it breaks, and the time to fix it.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
