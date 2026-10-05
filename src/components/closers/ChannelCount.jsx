import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import tool from '../signatures/tool.module.css';
import styles from './ChannelCount.module.css';

/** Why coordination gets harder faster than the team grows. Everyone telling
 *  everyone needs a channel for every pair of people: the count grows with the
 *  square of the headcount. One shared picture needs one per person. The arithmetic,
 *  drawn. It is a model, not a measurement of any team. */
export default function ChannelCount({ tag, title, lede, onward }) {
  const [n, setN] = useState(7);
  const [shared, setShared] = useState(false);
  const pairs = (n * (n - 1)) / 2;
  const R = 78;
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [100 + Math.cos(a) * R, 100 + Math.sin(a) * R]; });
  const edges = shared ? pts.map((p) => [p, [100, 100]]) : pts.flatMap((p, i) => pts.slice(i + 1).map((q) => [p, q]));

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('channels.rig')}>
        <figure className={styles.fig}>
          <svg viewBox="0 0 200 200" role="img" aria-label={`${n} people with ${shared ? n : pairs} channels between them`}>
            {edges.map(([p, q], i) => <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} className={clsx(styles.edge, shared && styles.hub)} />)}
            {shared && <circle cx="100" cy="100" r="9" className={styles.core} />}
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4.2" className={styles.node} />)}
          </svg>
        </figure>
        <div className={styles.side}>
          <label className={tool.field}><span>People who need to stay in step <b>{n}</b></span><input type="range" min={2} max={14} value={n} onChange={(e) => setN(Number(e.target.value))} /></label>
          <div className={styles.mode} role="radiogroup" aria-label="How they coordinate">
            <button type="button" role="radio" aria-checked={!shared} className={clsx(styles.opt, !shared && styles.on)} onClick={() => setShared(false)}>Everyone tells everyone</button>
            <button type="button" role="radio" aria-checked={shared} className={clsx(styles.opt, shared && styles.on)} onClick={() => setShared(true)}>One shared picture</button>
          </div>
          <p className={styles.count} aria-live="polite"><b>{shared ? n : pairs}</b> channels to keep in step</p>
          <p className={styles.sm}>{shared ? 'Each person reads from, and writes to, the same place. Adding a person adds one channel, however many are already there.' : `Every pair is a channel, so ${n} people need ${pairs}. One more person adds ${n}.`}</p>
          <p className={styles.fine}>A model of the arithmetic, not a measurement of any team. Real teams talk less than this, and a shared picture has costs of its own.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
