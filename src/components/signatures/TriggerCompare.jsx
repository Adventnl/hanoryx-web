import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './TriggerCompare.module.css';

const TICKS = 24; // a small, deterministic world: 24 one-second ticks

/* Three ways to start the same work, simulated on the same burst of jobs.
   Jobs arrive in a burst at tick 1. Each takes one tick to do.
     cron   – wakes every `every` ticks and does everything waiting (no limit)
     queue  – `workers` workers each take one job per tick
     event  – every job starts the tick it arrives, but the downstream can only
              absorb `cap` per tick, so the rest are rejected and retried next tick */
function simulate(jobs, workers, every) {
  const cap = 3;
  const cron = { backlog: [] };
  const arrive = new Array(jobs).fill(1);
  const doneAt = { cron: [], queue: [], event: [] };
  // cron
  let pending = arrive.map((a, i) => ({ i, a }));
  for (let t = 1; t <= TICKS; t += 1) {
    cron.backlog.push(pending.length);
    if (t % every === 0 && pending.length) { pending.forEach((p) => doneAt.cron.push(t + 1 - p.a)); pending = []; }
  }
  // queue
  const queue = { backlog: [] };
  let q = jobs;
  let served = 0;
  for (let t = 1; t <= TICKS; t += 1) {
    queue.backlog.push(q);
    const take = Math.min(workers, q);
    for (let k = 0; k < take; k += 1) { served += 1; doneAt.queue.push(Math.ceil(served / workers)); }
    q -= take;
  }
  // events
  const event = { backlog: [], rejected: 0 };
  let e = jobs;
  for (let t = 1; t <= TICKS; t += 1) {
    event.backlog.push(e);
    const take = Math.min(cap, e);
    event.rejected += e - take;
    for (let k = 0; k < take; k += 1) { doneAt.event.push(t); }
    e -= take;
  }
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  return {
    cron: { backlog: cron.backlog, avg: avg(doneAt.cron), peak: Math.max(...cron.backlog), note: `Does nothing until minute ${every}, then does everything at once.` },
    queue: { backlog: queue.backlog, avg: avg(doneAt.queue), peak: Math.max(...queue.backlog), note: `${workers} worker${workers > 1 ? 's' : ''}, one job each per tick. Steady, and the backlog is visible.` },
    event: { backlog: event.backlog, avg: avg(doneAt.event), peak: Math.max(...event.backlog), rejected: event.rejected, note: `Starts at once, but the downstream takes ${cap} a tick. ${event.rejected} attempts were turned away and had to be retried.` },
  };
}

function Spark({ data, max }) {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${40 - (v / Math.max(1, max)) * 36}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={styles.spark} aria-hidden="true">
      <polyline points={`0,40 ${pts} 100,40`} className={styles.area} />
      <polyline points={pts} className={styles.line} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Three triggers, one burst of work. Slide the size of the burst, the number of
 *  workers and the cron interval, and compare how long the average job waits and
 *  how big the backlog gets. An illustrative model — a small deterministic world,
 *  not a benchmark. */
export default function TriggerCompare({ eyebrow, title, intro, note }) {
  const [jobs, setJobs] = useState(12);
  const [workers, setWorkers] = useState(2);
  const [every, setEvery] = useState(6);
  const r = useMemo(() => simulate(jobs, workers, every), [jobs, workers, every]);
  const max = Math.max(r.cron.peak, r.queue.peak, r.event.peak);
  const lanes = [
    { id: 'cron', name: 'Cron', ask: '“Is it time?”', d: r.cron },
    { id: 'queue', name: 'Queue', ask: '“Is there work?”', d: r.queue },
    { id: 'event', name: 'Event', ask: '“Did it happen?”', d: r.event },
  ];
  const best = [...lanes].sort((a, b) => a.d.avg - b.d.avg)[0].id;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('triggers.rig')}>
        <div className={styles.sliders} {...fx('triggers.sliders')}>
          <label><span>Jobs in the burst <b>{jobs}</b></span><input type="range" min={2} max={20} value={jobs} onChange={(e) => setJobs(Number(e.target.value))} /></label>
          <label><span>Queue workers <b>{workers}</b></span><input type="range" min={1} max={4} value={workers} onChange={(e) => setWorkers(Number(e.target.value))} /></label>
          <label><span>Cron wakes every <b>{every}</b> ticks</span><input type="range" min={2} max={12} value={every} onChange={(e) => setEvery(Number(e.target.value))} /></label>
        </div>
        <div className={styles.lanes}>
          {lanes.map((l) => (
            <article key={l.id} className={clsx(styles.lane, l.id === best && styles.best)} {...fx('triggers.lane')}>
              <header><h3>{l.name}</h3><span>{l.ask}</span>{l.id === best && <i>Quickest here</i>}</header>
              <Spark data={l.d.backlog} max={max} />
              <dl>
                <div><dt>Average wait</dt><dd>{l.d.avg.toFixed(1)}<small> ticks</small></dd></div>
                <div><dt>Biggest backlog</dt><dd>{l.d.peak}<small> jobs</small></dd></div>
              </dl>
              <p>{l.d.note}</p>
            </article>
          ))}
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
