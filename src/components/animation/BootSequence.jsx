import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './BootSequence.module.css';

/**
 * Cinematic boot / entry experience.
 *   intro  -> brand + START control glide in
 *   booting-> HUD calibration: grid, brackets, terminal feed, counter,
 *             kinetic block swipes, perspective matrix
 *   done   -> overlay dissolves and the site is revealed (onComplete)
 *
 * Plays at most once per session (the shell decides whether to mount it).
 * START triggers audio (onStart). A Skip control is always available so
 * the user is never trapped. Reduced motion collapses to a quiet fade.
 *
 * Props: onComplete(), onStart()
 */
export function BootSequence({ onComplete, onStart }) {
  const root = useRef(null);
  const tl = useRef(null);
  const [phase, setPhase] = useState('intro');
  const reduced = usePrefersReducedMotion();
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onComplete?.();
  };

  // Entry: brand + control glide in from opposite sides.
  useGSAP(
    () => {
      if (reduced) return;
      gsap.timeline()
        .fromTo(`.${styles.brand}`, { x: 64, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.6, ease: 'power3.out' }, 0.25)
        .fromTo(`.${styles.controls}`, { x: -64, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.6, ease: 'power3.out' }, 0.5);
    },
    { scope: root, dependencies: [reduced] }
  );

  const handleStart = () => {
    onStart?.();

    if (reduced) {
      finish();
      return;
    }

    setPhase('booting');

    const timeline = gsap.timeline({ onComplete: finish });
    tl.current = timeline;

    // Dissolve intro along split trajectories.
    timeline
      .to(`.${styles.brand}`, { x: -64, autoAlpha: 0, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(`.${styles.controls}`, { x: 64, autoAlpha: 0, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(`.${styles.intro}`, { autoAlpha: 0, duration: 0.9 }, 0.3)
      .set(`.${styles.intro}`, { display: 'none' });

    // Bring up the HUD.
    timeline
      .set(`.${styles.hud}`, { display: 'block', autoAlpha: 0 }, 0.9)
      .to(`.${styles.hud}`, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0.9)
      .fromTo(`.${styles.gridH}`, { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.12, ease: 'power3.out' }, 1.0)
      .fromTo(`.${styles.gridV}`, { scaleY: 0 }, { scaleY: 1, duration: 1.6, stagger: 0.12, ease: 'power3.out' }, 1.0)
      .fromTo(`.${styles.bracket}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 1.4)
      .fromTo(`.${styles.logLine}`, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.9 }, 1.3);

    // Geometric block swipes.
    timeline
      .fromTo(`.${styles.blockPrimary}`, { xPercent: -100 }, { xPercent: 100, duration: 3, ease: 'power2.inOut', repeat: 1, yoyo: true }, 1.0)
      .fromTo(`.${styles.blockSecondary}`, { xPercent: 100 }, { xPercent: -100, duration: 2.6, ease: 'power1.inOut', repeat: 1, yoyo: true }, 1.4);

    // Calibration counter.
    const counter = { v: 0 };
    timeline.to(counter, {
      v: 100,
      duration: 4.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        const el = root.current?.querySelector(`.${styles.percent}`);
        if (el) el.textContent = `SYS.CALIBRATION // ${String(Math.floor(counter.v)).padStart(3, '0')}%`;
      },
    }, 1.0);

    // Dissolve HUD out.
    timeline
      .to(`.${styles.hud}`, { autoAlpha: 0, y: -36, duration: 1.3, ease: 'power3.inOut' }, 6.0)
      .set(`.${styles.hud}`, { display: 'none' });
  };

  const handleSkip = () => {
    if (finished.current) return;
    tl.current?.kill();
    if (reduced || !root.current) {
      finish();
      return;
    }
    gsap.to(root.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut', onComplete: finish });
  };

  return (
    <div ref={root} className={styles.root} role="dialog" aria-label="System boot sequence" aria-live="polite">
      {/* Intro shield */}
      <div className={styles.intro}>
        <div className={styles.introInner}>
          <h1 className={styles.brand}>
            HANORYX<br />SYSTEMS
          </h1>
          <div className={styles.controls}>
            <button className={styles.startBtn} onClick={handleStart} autoFocus>
              START
            </button>
          </div>
        </div>
      </div>

      {/* HUD calibration core */}
      <div className={styles.hud} aria-hidden={phase === 'intro'}>
        <div className={`${styles.block} ${styles.blockPrimary}`} />
        <div className={`${styles.block} ${styles.blockSecondary}`} />

        <div className={styles.matrixField}>
          <div className={`${styles.perspGrid} ${styles.gridZoom1}`} />
          <div className={`${styles.perspGrid} ${styles.gridZoom2}`} />
        </div>

        <div className={`${styles.gridLine} ${styles.gridH} ${styles.h1}`} />
        <div className={`${styles.gridLine} ${styles.gridH} ${styles.h2}`} />
        <div className={`${styles.gridLine} ${styles.gridV} ${styles.v1}`} />
        <div className={`${styles.gridLine} ${styles.gridV} ${styles.v2}`} />

        <span className={`${styles.bracket} ${styles.mtl}`} />
        <span className={`${styles.bracket} ${styles.mtr}`} />
        <span className={`${styles.bracket} ${styles.mbl}`} />
        <span className={`${styles.bracket} ${styles.mbr}`} />

        <div className={styles.terminal}>
          <div className={`${styles.logLine} ${styles.bright}`}>** MASTER CORE CONFIG SEQUENCE V4.0 // CONNECTED **</div>
          <div className={styles.logLine}>INIT_CORE_VECTORS // CH_LOAD .................... [OK]</div>
          <div className={styles.logLine}>CALIBRATING STRUCTURAL HUD VOLUMETRICS ......... [STABLE]</div>
          <div className={styles.logLine}>NETWORK_ALIGNMENT // POSITION_LAT.42.083 ....... [ALIGNED]</div>
          <div className={`${styles.logLine} ${styles.warn}`}>WARNING // ENGAGING HIGH FREQUENCY TRANSITION MATRIX</div>
          <div className={styles.logLine}>MOUNTING VIEWPORT CORE FRAMEWORKS .............. [READY]</div>
        </div>

        <div className={styles.counter}>
          <span className={styles.percent}>SYS.CALIBRATION // 000%</span>
          <span className={styles.pulse} />
        </div>
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        Skip intro
      </button>
    </div>
  );
}

export default BootSequence;
