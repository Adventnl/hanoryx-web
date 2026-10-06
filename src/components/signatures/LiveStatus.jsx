import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import clsx from 'clsx';
import { Activity, Gauge, Network, Zap } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './LiveStatus.module.css';

const subscribeOnline = (notify) => {
  window.addEventListener('online', notify);
  window.addEventListener('offline', notify);
  return () => { window.removeEventListener('online', notify); window.removeEventListener('offline', notify); };
};

const kb = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} kB`);
const ms = (n) => `${Math.round(n)} ms`;

function readFacts() {
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const res = performance.getEntriesByType?.('resource') || [];
  const conn = navigator.connection;
  return {
    ttfb: nav ? nav.responseStart - nav.requestStart : null,
    dcl: nav ? nav.domContentLoadedEventEnd : null,
    load: nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : null,
    requests: res.length,
    bytes: res.reduce((n, r) => n + (r.transferSize || 0), 0),
    net: conn ? `${conn.effectiveType || '?'} · ${conn.downlink ?? '?'} Mb/s · ${conn.rtt ?? '?'} ms` : null,
    heap: performance.memory ? performance.memory.usedJSHeapSize : null,
    view: `${window.innerWidth} × ${window.innerHeight} @ ${window.devicePixelRatio || 1}×`,
    cores: navigator.hardwareConcurrency || null,
    memory: navigator.deviceMemory || null,
    motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Reduced' : 'No preference',
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
  };
}

/**
 * Not a status page for the company — a status page for YOUR visit. Everything
 * on it is measured by your own browser, live: the frame rate of this very
 * page, how the page loaded, what the connection looks like, and (when you ask)
 * how long a small request to the site's own host takes. It says nothing about
 * anyone else's experience, and says so.
 */
export default function LiveStatus({ eyebrow, title, intro, note }) {
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.1 });
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const [facts, setFacts] = useState(null);
  const [frames, setFrames] = useState({ fps: 0, p95: 0, series: [] });
  const [ping, setPing] = useState({ state: 'idle', runs: [] });
  const buf = useRef([]);

  useEffect(() => {
    const id = window.setTimeout(() => setFacts(readFacts()), 400);
    const again = window.setTimeout(() => setFacts(readFacts()), 3000);
    return () => { window.clearTimeout(id); window.clearTimeout(again); };
  }, []);

  // Frame sampling, only while the board is on screen.
  useEffect(() => {
    if (!onScreen) return undefined;
    let raf = 0;
    let last = 0;
    let lastPaint = 0;
    const loop = (now) => {
      if (last) {
        buf.current.push(Math.min(now - last, 250));
        if (buf.current.length > 120) buf.current.shift();
      }
      last = now;
      if (now - lastPaint > 500 && buf.current.length > 20) {
        lastPaint = now;
        const series = [...buf.current];
        const avg = series.reduce((a, b) => a + b, 0) / series.length;
        const sorted = [...series].sort((a, b) => a - b);
        setFrames({ fps: 1000 / avg, p95: sorted[Math.floor(sorted.length * 0.95)], series });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onScreen]);

  const runPing = useCallback(async () => {
    setPing({ state: 'running', runs: [] });
    const runs = [];
    try {
      for (let i = 0; i < 3; i += 1) {
        const t0 = performance.now();
        await fetch(`/robots.txt?t=${Date.now()}-${i}`, { method: 'HEAD', cache: 'no-store' });
        runs.push(performance.now() - t0);
      }
      setPing({ state: 'done', runs });
    } catch {
      setPing({ state: 'failed', runs });
    }
  }, []);

  const level = !online ? 'offline' : frames.fps === 0 ? 'measuring' : frames.fps >= 50 && frames.p95 <= 26 ? 'good' : frames.fps >= 30 ? 'fair' : 'slow';
  const headline = {
    offline: 'Your browser says it is offline.',
    measuring: 'Measuring this page, live…',
    good: 'This page is running smoothly on your device.',
    fair: 'This page is running, a little unevenly, on your device.',
    slow: 'This page is struggling on your device right now.',
  }[level];

  const spark = useMemo(() => {
    const s = frames.series;
    if (s.length < 2) return '';
    return s.map((v, i) => `${(i / (s.length - 1)) * 100},${40 - Math.min(40, (v / 50) * 40)}`).join(' ');
  }, [frames.series]);

  const median = ping.runs.length ? [...ping.runs].sort((a, b) => a - b)[Math.floor(ping.runs.length / 2)] : null;

  const tiles = [
    { id: 'fps', icon: Gauge, label: 'Frame rate', value: frames.fps ? `${Math.round(frames.fps)} fps` : '—', sub: frames.p95 ? `Slowest 5% of frames: ${ms(frames.p95)}` : 'Sampling…', tone: level },
    { id: 'ttfb', icon: Zap, label: 'First byte', value: facts?.ttfb != null ? ms(facts.ttfb) : '—', sub: 'Time for the host to start answering', tone: facts?.ttfb != null && facts.ttfb > 600 ? 'fair' : 'good' },
    { id: 'load', icon: Activity, label: 'Page ready', value: facts?.dcl ? ms(facts.dcl) : '—', sub: facts?.load ? `Fully loaded at ${ms(facts.load)}` : 'Still finishing, or not reported', tone: 'good' },
    { id: 'net', icon: Network, label: 'Connection', value: online ? (facts?.net ? facts.net.split(' · ')[0] : 'Online') : 'Offline', sub: facts?.net || 'Your browser does not report link details', tone: online ? 'good' : 'offline' },
  ];

  const rows = facts ? [
    ['Requests so far', String(facts.requests)],
    ['Transferred (reported)', facts.bytes ? kb(facts.bytes) : 'Not reported'],
    ['JS heap in use', facts.heap ? kb(facts.heap) : 'Not reported by this browser'],
    ['Viewport', facts.view],
    ['Logical cores', facts.cores ? String(facts.cores) : 'Not reported'],
    ['Device memory', facts.memory ? `${facts.memory} GB (rounded)` : 'Not reported'],
    ['Motion setting', facts.motion],
    ['Language · time zone', `${facts.lang} · ${facts.zone}`],
  ] : [];

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.board} {...fx('status.board')}>
        <div className={clsx(styles.banner, styles[level])} role="status" aria-live="polite" {...fx('status.banner')}>
          <span className={styles.light} aria-hidden="true" />
          <p>{headline}</p>
          <svg className={styles.spark} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" {...fx('status.frame-sparkline')}>
            <line x1="0" x2="100" y1={40 - (16.7 / 50) * 40} y2={40 - (16.7 / 50) * 40} className={styles.ref} />
            <line x1="0" x2="100" y1={40 - (33.3 / 50) * 40} y2={40 - (33.3 / 50) * 40} className={styles.ref} />
            <polyline points={spark} fill="none" className={styles.line} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <ul className={styles.tiles}>
          {tiles.map((t) => (
            <li key={t.id} className={clsx(styles.tile, styles[t.tone])} {...fx('status.tile')}>
              <t.icon size={16} strokeWidth={1.4} aria-hidden="true" />
              <span className={styles.tLabel}>{t.label}</span>
              <span className={styles.tValue}>{t.value}</span>
              <span className={styles.tSub}>{t.sub}</span>
            </li>
          ))}
        </ul>

        <div className={styles.lower}>
          <dl className={styles.facts} {...fx('status.facts')}>
            {rows.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className={styles.ping} {...fx('status.ping')}>
            <p className={styles.pLabel}>Test the connection to the site</p>
            <p className={styles.pText}>Sends three tiny requests to the site’s own host and times them. This is the only request on this page, and it only happens when you press the button.</p>
            <button type="button" className={styles.btn} onClick={runPing} disabled={ping.state === 'running' || !online}>
              {ping.state === 'running' ? 'Timing…' : ping.state === 'done' ? 'Run it again' : 'Run the test'}
            </button>
            <p className={styles.result} role="status" aria-live="polite">
              {ping.state === 'done' && `Median ${ms(median)} · fastest ${ms(Math.min(...ping.runs))} · slowest ${ms(Math.max(...ping.runs))}`}
              {ping.state === 'failed' && 'The request did not complete. Your connection, or the host, did not answer.'}
            </p>
          </div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
