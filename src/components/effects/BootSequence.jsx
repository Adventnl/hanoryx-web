import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useAudio } from '../../app/providers/audio-context';
import styles from './BootSequence.module.css';

/* The terminal feed. Each line unlocks when calibration passes `at` (percent),
   so the log is driven by the SAME value as the lower readout and bar. */
const LOG = [
  { at: 0, text: '** MASTER CORE CONFIG SEQUENCE V4.0 // CONNECTED **', tone: 'bright' },
  { at: 12, text: 'INIT_CORE_VECTORS // CH_LOAD .................... [OK]' },
  { at: 34, text: 'CALIBRATING STRUCTURAL HUD VOLUMETRICS ......... [STABLE]' },
  { at: 56, text: 'NETWORK_ALIGNMENT // POSITION_LAT.42.083 ....... [ALIGNED]' },
  { at: 72, text: 'WARNING // ENGAGING HIGH FREQUENCY TRANSITION MATRIX', tone: 'warn' },
  { at: 88, text: 'MOUNTING VIEWPORT CORE FRAMEWORKS .............. [READY]' },
];

const pad = (n) => String(Math.round(n)).padStart(3, '0');

/**
 * Cinematic boot / entry experience.
 *   intro  -> brand + START control glide in
 *   booting-> HUD calibration: grid, brackets, terminal feed, counter,
 *             kinetic block swipes, perspective matrix
 *   done   -> overlay dissolves and the site is revealed (onComplete)
 *
 * START is a real user gesture, so it also begins the ambient track (through
 * the shared AudioProvider — the navbar control follows the same status). If
 * the browser refuses playback the intro carries on silently and the navbar
 * shows "TAP TO PLAY". Skip never touches audio.
 *
 * Plays at most once per session (the shell decides whether to mount it). A
 * Skip control is always available so the user is never trapped. Reduced
 * motion collapses to a quiet handoff.
 *
 * onComplete fires the moment the reveal begins (so the shell can animate
 * the site in underneath), and onExited fires once the overlay has fully
 * lifted away and is safe to unmount — together they replace the old hard
 * cut with a crossfade.
 *
 * Props: onComplete(), onExited()
 */
export function BootSequence({ onComplete, onExited }) {
  const root = useRef(null);
  const tl = useRef(null);
  const percentRef = useRef(null);
  const barRef = useRef(null);
  const announceRef = useRef(null);
  const [phase, setPhase] = useState('intro');
  const reduced = usePrefersReducedMotion();
  const audio = useAudio();
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    // Reveal the site now (the shell rises it into view), then lift the
    // black overlay away over it so the handoff is a soft crossfade.
    onComplete?.();
    if (reduced || !root.current) {
      onExited?.();
      return;
    }
    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => onExited?.(),
    });
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

  useEffect(() => () => tl.current?.kill(), []);

  // One function paints every calibration readout from a single value.
  const paint = (v) => {
    if (percentRef.current) percentRef.current.textContent = `SYS.CALIBRATION // ${pad(v)}%`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${(v / 100).toFixed(4)})`;
    const lines = root.current?.querySelectorAll('[data-log]');
    lines?.forEach((line) => {
      const on = v >= Number(line.dataset.log);
      if ((line.dataset.on === '1') !== on) line.dataset.on = on ? '1' : '0';
    });
    // Screen readers get quarter-step announcements, not 100 updates.
    if (announceRef.current) {
      const step = Math.floor(v / 25) * 25;
      const text = `Calibration ${step} percent`;
      if (announceRef.current.textContent !== text) announceRef.current.textContent = text;
    }
  };

  const handleStart = () => {
    // Inside the click gesture: the only moment the browser will let us play.
    // start() never rejects; a refusal just leaves the navbar control on
    // "TAP TO PLAY".
    audio.start();

    if (reduced) {
      paint(100);
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
      .fromTo(`.${styles.bracket}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 1.4);

    // Geometric block swipes.
    timeline
      .fromTo(`.${styles.blockPrimary}`, { xPercent: -100 }, { xPercent: 100, duration: 3, ease: 'power2.inOut', repeat: 1, yoyo: true }, 1.0)
      .fromTo(`.${styles.blockSecondary}`, { xPercent: 100 }, { xPercent: -100, duration: 2.6, ease: 'power1.inOut', repeat: 1, yoyo: true }, 1.4);

    // Calibration: ONE value feeds the readout, the bar, and the terminal log.
    const calibration = { v: 0 };
    paint(0);
    timeline.to(calibration, {
      v: 100,
      duration: 4.2,
      ease: 'power1.inOut',
      onUpdate: () => paint(calibration.v),
      onComplete: () => paint(100), // always land exactly on 100%
    }, 1.0);

    // Dissolve HUD out once calibration has settled on 100%.
    timeline
      .to(`.${styles.hud}`, { autoAlpha: 0, y: -36, duration: 1.1, ease: 'power3.inOut' }, 5.6)
      .set(`.${styles.hud}`, { display: 'none' });
  };

  const handleSkip = () => {
    if (finished.current) return;
    tl.current?.kill();
    finish();
  };

  return (
    <div ref={root} className={styles.root} role="dialog" aria-label="System boot sequence">
      <span ref={announceRef} className="sr-only" role="status" aria-live="polite" />

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
            <span className={styles.soundNote}>Begins ambient sound</span>
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
          {LOG.map((line) => (
            <div
              key={line.text}
              data-log={line.at}
              data-on="0"
              className={`${styles.logLine} ${line.tone ? styles[line.tone] : ''}`}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div className={styles.counter}>
          <span ref={percentRef} className={styles.percent}>SYS.CALIBRATION // 000%</span>
          <span className={styles.pulse} />
          <span className={styles.track} aria-hidden="true">
            <span ref={barRef} className={styles.bar} />
          </span>
        </div>
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        Skip intro
      </button>
    </div>
  );
}

export default BootSequence;
