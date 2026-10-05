import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PageVitals.module.css';

const kb = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/* Read what the browser already knows about this page. Nothing is sent anywhere. */
function read() {
  const res = performance.getEntriesByType('resource');
  const size = (r) => r.transferSize || r.encodedBodySize || 0;
  const scripts = res.filter((r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name));
  const nav = performance.getEntriesByType('navigation')[0];
  const fcp = performance.getEntriesByName('first-contentful-paint')[0];
  return {
    nodes: document.getElementsByTagName('*').length,
    canvases: document.querySelectorAll('canvas').length,
    images: document.images.length,
    svgs: document.querySelectorAll('svg').length,
    requests: res.length,
    scripts: scripts.length,
    bytes: res.reduce((n, r) => n + size(r), 0),
    jsBytes: scripts.reduce((n, r) => n + size(r), 0),
    fcp: fcp ? Math.round(fcp.startTime) : null,
    loaded: nav ? Math.round(nav.loadEventEnd) : null,
    heap: performance.memory ? performance.memory.usedJSHeapSize : null,
  };
}

/** The page you are on, weighed: its elements, its requests, its size, its first
 *  paint and the frame rate it is managing right now. Every number comes from the
 *  browser's own Performance API; nothing is sent anywhere. */
export default function PageVitals({ tag, title, lede, onward }) {
  const [v, setV] = useState(null);
  const [fps, setFps] = useState(null);

  const measure = useCallback(() => {
    setFps('sampling');
    setV(read());
    let frames = 0;
    let t0 = 0;
    const tick = (now) => {
      if (!t0) t0 = now;
      frames += 1;
      if (now - t0 < 1000) requestAnimationFrame(tick);
      else setFps(Math.round((frames * 1000) / (now - t0)));
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(measure, 500);
    return () => window.clearTimeout(id);
  }, [measure]);

  const rows = v && [
    { k: 'Elements on the page', v: v.nodes.toLocaleString(), note: 'Every tag in the document right now.' },
    { k: 'Canvas backgrounds', v: v.canvases, note: 'Drawn by script, one per live scene.' },
    { k: 'Images and drawings', v: `${v.images} · ${v.svgs}`, note: 'Pictures · inline SVGs.' },
    { k: 'Requests since load', v: v.requests, note: `${v.scripts} of them scripts.` },
    { k: 'Weight of those requests', v: kb(v.bytes), note: `${kb(v.jsBytes)} of it script. Compressed size where the browser reports it.` },
    { k: 'First paint', v: v.fcp == null ? '—' : `${v.fcp} ms`, note: 'Time to the first thing drawn, from the first load of this tab.' },
    { k: 'Script memory in use', v: v.heap == null ? 'not shared' : kb(v.heap), note: v.heap == null ? 'This browser does not report it.' : 'The JavaScript heap, as the browser reports it.' },
    { k: 'Frames per second now', v: fps === 'sampling' || fps == null ? '…' : fps, note: 'Counted over one second while you read this.' },
  ];

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('vitals.rig')}>
        {rows ? (
          <dl className={styles.grid} aria-live="polite">
            {rows.map((r) => (
              <div key={r.k} className={styles.cell}>
                <dt>{r.k}</dt>
                <dd>{r.v}<small>{r.note}</small></dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={styles.wait} role="status">Measuring…</p>
        )}
        <div className={styles.side}>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={measure} disabled={fps === 'sampling'}><RefreshCw size={14} aria-hidden="true" /> {fps === 'sampling' ? 'Measuring…' : 'Measure again'}</button>
          <p className={styles.fine}>The sizes of a page change from visit to visit and from device to device. On the live site the scripts are a handful of bundled files; on a development server there are hundreds, and the numbers are very different. These describe this visit only, and are not a benchmark.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
