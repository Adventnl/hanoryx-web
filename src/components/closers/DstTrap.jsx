import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { changesIn, effectOn, offsetLabel } from '../../utils/zones';
import { fx } from '../../utils/fx';
import tool from '../signatures/tool.module.css';
import styles from './DstTrap.module.css';

const ZONES = [
  'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney', 'Pacific/Auckland', 'America/Santiago', 'Asia/Kolkata', 'Asia/Tokyo', 'UTC',
];

const EFFECT = {
  0: { label: 'Never happens', line: 'That time does not exist on this day. A scheduler may skip the job, or run it at the next valid time.' },
  1: { label: 'Happens once', line: 'Unaffected.' },
  2: { label: 'Happens twice', line: 'That time occurs two times on this day. A scheduler may run the job twice.' },
};

/** Daylight-saving time, as it bites a schedule. Choose a zone and a time of
 *  day; the page finds the day or days this year when the clocks change in that
 *  zone and says what happens to your time on each: skipped, repeated, or fine. */
export default function DstTrap({ tag, title, lede, onward }) {
  const [here] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [zone, setZone] = useState('Europe/London');
  const [time, setTime] = useState('01:30');
  const [year, setYear] = useState(() => new Date().getFullYear());
  const zones = ZONES.includes(here) ? ZONES : [here, ...ZONES];
  const [hh, mm] = time.split(':').map(Number);
  const valid = Number.isInteger(hh) && Number.isInteger(mm);

  const rows = useMemo(() => {
    if (!valid) return [];
    return changesIn(zone, year).map((c) => ({ ...c, effect: effectOn(c, hh, mm, zone) }));
  }, [zone, year, hh, mm, valid]);
  const date = (c) => new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(Date.UTC(c.y, c.m, c.d));

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('dst.rig')}>
        <div className={styles.form}>
          <label className={tool.field}>
            <span>Time zone</span>
            <select value={zone} onChange={(e) => setZone(e.target.value)}>{zones.map((z) => <option key={z} value={z}>{z === here ? `${z} (yours)` : z}</option>)}</select>
          </label>
          <div className={tool.pair}>
            <label className={tool.field}><span>Time of day</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} step={60} /></label>
            <label className={tool.field}><span>Year</span><input type="number" min={1990} max={2060} value={year} onChange={(e) => setYear(Number(e.target.value) || year)} /></label>
          </div>
          <p className={tool.sm}>Try 01:30 in London or 02:30 in New York. Then try Tokyo, which never changes its clocks.</p>
        </div>
        <div className={styles.out} aria-live="polite" {...fx('dst.result')}>
          {valid && rows.length === 0 && <p className={styles.none}><b>{zone}</b> does not change its clocks in {year}. Nothing can be skipped or repeated here.</p>}
          {rows.map((c) => (
            <article key={c.at} className={clsx(styles.change, c.effect !== 1 && styles.bite)}>
              <p className={tool.k}>{date(c)}</p>
              <h3>{c.after > c.before ? 'Clocks go forward' : 'Clocks go back'} <span>{offsetLabel(c.before)} → {offsetLabel(c.after)}</span></h3>
              <p className={styles.verdict}><b>{time} · {EFFECT[c.effect].label}.</b> {EFFECT[c.effect].line}</p>
            </article>
          ))}
          {valid && rows.length > 0 && <p className={tool.note}>Worked out in your browser from its time zone data. A real scheduler may treat these days differently; test the one you use.</p>}
        </div>
      </div>
    </CloserFrame>
  );
}
