import { useMemo, useState } from 'react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import tool from '../signatures/tool.module.css';
import styles from './FixedStep.module.css';

const G = 980;
const DROP = 100;
const SPAN = 3;

/* A ball dropped from 100 units that bounces, simulated with one step size. */
function simulate(dt) {
  let y = DROP;
  let v = 0;
  let t = 0;
  const pts = [[0, y]];
  while (t < SPAN) {
    v -= G * dt;
    y += v * dt;
    if (y < 0) { y = 0; v = -v * 0.8; }
    t += dt;
    pts.push([t, y]);
  }
  return pts;
}

const W = 320;
const H = 130;
const line = (pts) => pts.map(([t, y]) => `${((t / SPAN) * W).toFixed(1)},${(H - 6 - (Math.min(y, DROP) / DROP) * (H - 14)).toFixed(1)}`).join(' ');
const at = (pts, t) => pts.reduce((best, p) => (Math.abs(p[0] - t) < Math.abs(best[0] - t) ? p : best), pts[0])[1];

/** Why a game engine does not simply use the time since the last frame. The same
 *  ball is dropped three ways: with a tiny step (the answer), with a fixed step that
 *  catches up however slowly frames arrive, and with whatever time the frame took.
 *  An illustration of the idea, not the engine's own code. */
export default function FixedStep({ tag, title, lede, onward }) {
  const [fps, setFps] = useState(20);
  const ref = useMemo(() => simulate(1 / 2000), []);
  const fixed = useMemo(() => simulate(1 / 60), []);
  const variable = useMemo(() => simulate(1 / fps), [fps]);
  const t = 2.4;
  const a = at(ref, t);
  const b = at(fixed, t);
  const c = at(variable, t);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('fixedstep.rig')}>
        <div className={styles.form}>
          <label className={tool.field}><span>Frames per second on this machine <b>{fps}</b></span><input type="range" min={8} max={144} value={fps} onChange={(e) => setFps(Number(e.target.value))} /></label>
          <ul className={styles.key}>
            <li><i className={styles.ref} aria-hidden="true" /><b>The answer</b> a tiny step of 1/2000 s</li>
            <li><i className={styles.fix} aria-hidden="true" /><b>Fixed step</b> always 1/60 s, however slowly frames arrive</li>
            <li><i className={styles.var} aria-hidden="true" /><b>Variable step</b> whatever the last frame took</li>
          </ul>
          <p className={styles.read} aria-live="polite">At {t} seconds the ball should be {a.toFixed(1)} units up. Fixed step says <b>{b.toFixed(1)}</b>; variable step says <b className={styles.warn}>{c.toFixed(1)}</b>.</p>
          <p className={styles.sm}>Move the slider. The fixed-step line never moves, because it does not care how fast the machine is. The variable-step line changes shape, so the same game would play differently on a faster computer. That is the whole reason engines fix the step.</p>
        </div>
        <figure className={styles.fig}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Height of a bouncing ball over three seconds, three ways">
            <line x1="0" x2={W} y1={H - 6} y2={H - 6} className={styles.axis} />
            <polyline points={line(variable)} className={styles.var} />
            <polyline points={line(fixed)} className={styles.fix} />
            <polyline points={line(ref)} className={styles.ref} />
            <line x1={(t / SPAN) * W} x2={(t / SPAN) * W} y1="4" y2={H - 6} className={styles.cursor} />
          </svg>
          <figcaption>Height against time</figcaption>
        </figure>
      </div>
    </CloserFrame>
  );
}
