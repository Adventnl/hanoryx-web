import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandLogo } from '../../utils/assetResolver';
import { ScrambleText } from '../fx/ScrambleText';
import { TiltSurface } from '../fx/TiltSurface';
import { fx } from '../../utils/fx';
import styles from './OrbitNav.module.css';

/* Four doors into the site, placed on three orbits. `a` is the starting angle,
   `t` the orbital period in seconds, `dir` the direction. */
const NODES = [
  { id: 'systems', label: 'Systems', code: 'SYS', to: '/systems', line: 'Platforms, automation and interfaces.', ring: 2, a: 0, t: 64, dir: 1 },
  { id: 'north', label: 'Development', code: 'DEV', to: '/north', line: 'The team, the architecture, the motion.', ring: 3, a: 96, t: 84, dir: -1 },
  { id: 'work', label: 'Work', code: 'WRK', to: '/work', line: 'Selected work: Musebase and YK Engine.', ring: 1, a: 200, t: 54, dir: 1 },
  { id: 'company', label: 'Company', code: 'CMP', to: '/company', line: 'Principles, security and the chronology.', ring: 2, a: 288, t: 72, dir: 1 },
];
const SATELLITES = [
  { ring: 1, a: 40, t: 30, dir: -1 },
  { ring: 2, a: 150, t: 44, dir: 1 },
  { ring: 3, a: 240, t: 58, dir: 1 },
  { ring: 3, a: 330, t: 70, dir: -1 },
  { ring: 2, a: 215, t: 38, dir: -1 },
];
const IDLE = { code: 'HANORYX', label: 'Move through the work', line: 'Four doors. Choose one — or just watch the system turn.' };

/**
 * An orbit-shaped site navigator. Four routes circle a brand core; the whole
 * object leans toward the pointer; hovering or focusing a node freezes the orbit
 * and the core reads out where it leads. Touch simply taps through.
 * Motion is transforms only (compositor), and stands still under reduced motion.
 */
export default function OrbitNav() {
  const [active, setActive] = useState(null);
  const [pulse, setPulse] = useState(0);
  const node = NODES.find((n) => n.id === active);
  const view = node ? { code: node.code, label: node.label, line: node.line } : IDLE;

  const show = (id) => {
    setActive(id);
    setPulse((p) => p + 1);
  };

  return (
    <TiltSurface tilt={7} glare={false} className={styles.wrap}>
      <div className={styles.orbit} onPointerLeave={() => setActive(null)} {...fx('home.orbit-navigator')}>
        <div className={styles.rings} aria-hidden="true" data-depth="10">
          <span className={styles.ring} data-ring="1" />
          <span className={styles.ring} data-ring="2" />
          <span className={styles.ring} data-ring="3" />
          <span className={styles.dash} />
        </div>

        {SATELLITES.map((s, i) => (
          <span
            key={i}
            className={styles.arm}
            style={{ '--a': s.a, '--t': `${s.t}s` }}
            data-ring={s.ring}
            data-dir={s.dir}
            aria-hidden="true"
          >
            <span className={styles.sat} />
          </span>
        ))}

        {NODES.map((n) => (
          <span
            key={n.id}
            className={styles.arm}
            style={{ '--a': n.a, '--t': `${n.t}s` }}
            data-ring={n.ring}
            data-dir={n.dir}
          >
            <Link
              to={n.to}
              className={styles.node}
              data-active={active === n.id ? 'true' : 'false'}
              data-cursor="nav"
              onPointerEnter={() => show(n.id)}
              onFocus={() => show(n.id)}
              onBlur={() => setActive(null)}
              aria-label={`${n.label} — ${n.line}`}
            >
              <span className={styles.nodeDot} />
              <span className={styles.nodeLabel}>{n.label}</span>
            </Link>
          </span>
        ))}

        <div className={styles.core} data-depth="22">
          <span className={styles.coreRing} aria-hidden="true" />
          <img className={styles.mark} src={brandLogo} alt="" />
          <div className={styles.readout} aria-live="polite">
            <span className={styles.rCode}>{view.code}</span>
            <ScrambleText as="span" text={view.label} trigger={pulse} className={styles.rLabel} />
            <span className={styles.rLine}>{view.line}</span>
          </div>
        </div>
      </div>
    </TiltSurface>
  );
}
