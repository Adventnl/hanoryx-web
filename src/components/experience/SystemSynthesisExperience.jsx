import { useCallback, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SynthesisCanvas } from './SynthesisCanvas';
import {
  TOTAL,
  PHASES,
  phaseAt,
  STATUS_MESSAGES,
  ROUTE_LABELS,
  MODULE_LABELS,
} from './synthesisTimeline';
import styles from './SystemSynthesisExperience.module.css';

function fmt(s) {
  const sec = Math.max(0, Math.min(TOTAL, s));
  return `${String(Math.floor(sec)).padStart(2, '0')}.${String(Math.floor((sec % 1) * 10))}`;
}

/* Lower the canvas quality on small / coarse-pointer devices (mobile gets a
   genuinely reduced version: fewer particles, lower DPR ceiling). */
function pickQuality() {
  if (typeof window === 'undefined') return 'high';
  const w = window.innerWidth;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
  if (w < 640 || coarse) return 'low';
  if (w < 1100) return 'medium';
  return 'high';
}

/**
 * SystemSynthesisExperience — a 20-second, pure-code cinematic that assembles
 * the Hanoryx Systems identity. One master GSAP timeline is the single clock:
 * it choreographs the DOM overlay (telemetry, route/module chips, wordmark) and,
 * in onUpdate, drives the procedural canvas. No video, no autoplay; the user
 * presses play, can scrub/skip/replay, and reduced-motion gets a static poster.
 */
export function SystemSynthesisExperience() {
  const reduced = usePrefersReducedMotion();
  const quality = useMemo(() => pickQuality(), []);

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const tlRef = useRef(null);
  const fillRef = useRef(null);
  const lastPhaseRef = useRef(-1);

  const [status, setStatus] = useState('idle'); // idle | playing | paused | done
  const [phase, setPhase] = useState(PHASES[0]);
  const [clock, setClock] = useState(0);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (reduced) {
        // Static poster: render a single representative "lock" frame. No loop.
        canvas.render(18.2);
        setPhase(phaseAt(18.2));
        setClock(18.2);
        if (fillRef.current) fillRef.current.style.width = '100%';
        return;
      }

      const root = rootRef.current;
      const q = (sel) => root.querySelector(sel);
      const qa = (sel) => Array.from(root.querySelectorAll(sel));

      const onUpdate = () => {
        const t = tlRef.current ? tlRef.current.time() : 0;
        canvas.render(t);
        if (fillRef.current) fillRef.current.style.width = `${(t / TOTAL) * 100}%`;
        const p = phaseAt(t);
        if (p.index !== lastPhaseRef.current) {
          lastPhaseRef.current = p.index;
          setPhase(p);
        }
        setClock(t);
      };

      const tl = gsap.timeline({
        paused: true,
        onUpdate,
        onComplete: () => setStatus('done'),
      });
      tlRef.current = tl;

      // Master clock spacer so the timeline is exactly TOTAL seconds even where
      // no DOM tween reaches the end.
      tl.to({}, { duration: TOTAL });

      // ---- Phase 1: telemetry stream (0.3 - 5.0) ----
      gsap.set(qa('[data-telemetry] span'), { opacity: 0, x: -8 });
      tl.to(qa('[data-telemetry] span'), { opacity: 1, x: 0, stagger: 0.18, duration: 0.4 }, 0.3);
      tl.to(q('[data-telemetry]'), { opacity: 0, duration: 0.8 }, 5.0);

      // ---- Phase 5: route chips orbit label-in (7.4 - 9.2) ----
      gsap.set(qa('[data-routes] li'), { opacity: 0, y: 10, filter: 'blur(6px)' });
      tl.to(qa('[data-routes] li'), { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, duration: 0.5 }, 7.4);
      tl.to(q('[data-routes]'), { opacity: 0, duration: 0.6 }, 9.0);

      // ---- Phase 6: system module chips (9.1 - 12.8) ----
      gsap.set(qa('[data-modules] li'), { opacity: 0, scale: 0.8 });
      tl.to(qa('[data-modules] li'), { opacity: 1, scale: 1, stagger: 0.09, duration: 0.4, ease: 'back.out(2)' }, 9.1);
      tl.to(q('[data-modules]'), { opacity: 0, duration: 0.7 }, 12.6);

      // ---- Phase 8: convergence headline resolves (13.0 - 15.0) ----
      gsap.set(q('[data-converge]'), { opacity: 0, letterSpacing: '0.5em', filter: 'blur(10px)' });
      tl.to(q('[data-converge]'), { opacity: 1, letterSpacing: '0.18em', filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 13.2);
      tl.to(q('[data-converge]'), { opacity: 0, duration: 0.6 }, 14.8);

      // ---- Phase 10: wordmark lock-in (17.0 - 19.2) ----
      gsap.set(q('[data-wordmark]'), { opacity: 0, scale: 1.3, clipPath: 'inset(0 50% 0 50%)' });
      gsap.set(q('[data-tagline]'), { opacity: 0, y: 8 });
      gsap.set(q('[data-locknode]'), { scale: 0 });
      tl.to(q('[data-wordmark]'), { opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0%)', duration: 1.0, ease: 'power3.out' }, 17.2);
      tl.to(q('[data-locknode]'), { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 18.0);
      tl.to(q('[data-tagline]'), { opacity: 1, y: 0, duration: 0.6 }, 18.2);
      // ---- Phase 11: release — overlay dissolves into the site ----
      tl.to([q('[data-wordmark]'), q('[data-tagline]'), q('[data-locknode]')], { opacity: 0, duration: 0.8 }, 19.3);

      // initial frame
      canvas.render(0);
    },
    { scope: rootRef, dependencies: [reduced, quality] }
  );

  const play = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.progress() >= 1) {
      lastPhaseRef.current = -1;
      tl.restart();
    } else {
      tl.play();
    }
    setStatus('playing');
  }, []);

  const pause = useCallback(() => {
    tlRef.current?.pause();
    setStatus('paused');
  }, []);

  const replay = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    lastPhaseRef.current = -1;
    tl.restart();
    setStatus('playing');
  }, []);

  const skip = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.pause();
    tl.seek(TOTAL);
    setStatus('done');
  }, []);

  const scrub = useCallback((e) => {
    const tl = tlRef.current;
    if (!tl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    tl.seek(ratio * TOTAL);
    if (status === 'idle') setStatus('paused');
  }, [status]);

  /* ---------------- Reduced-motion poster ---------------- */
  if (reduced) {
    return (
      <div ref={rootRef} className={styles.stage} data-reduced="true">
        <SynthesisCanvas ref={canvasRef} accent="#ff3333" quality={quality} initialTime={18.2} className={styles.canvas} />
        <div className={styles.posterOverlay}>
          <span className={styles.wordmark} data-wordmark>
            HANORYX<span className={styles.locknode} data-locknode />SYSTEMS
          </span>
          <span className={styles.tagline} data-tagline>System Synthesis — reduced-motion still</span>
          <p className={styles.reducedNote}>
            Motion is minimised per your system preference. The full 20-second sequence is available
            with reduced-motion disabled.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Full cinematic ---------------- */
  return (
    <div ref={rootRef} className={styles.stage} data-status={status}>
      <SynthesisCanvas ref={canvasRef} accent="#ff3333" quality={quality} className={styles.canvas} />

      {/* DOM overlay — choreographed by the master timeline */}
      <div className={styles.overlay} aria-hidden="true">
        <ul className={styles.telemetry} data-telemetry>
          {STATUS_MESSAGES.map((m) => (
            <li key={m}><span>{m}</span></li>
          ))}
        </ul>

        <ul className={styles.routeChips} data-routes>
          {ROUTE_LABELS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <ul className={styles.moduleChips} data-modules>
          {MODULE_LABELS.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <span className={styles.converge} data-converge>INTERFACE CONVERGENCE</span>

        <div className={styles.lockGroup}>
          <span className={styles.wordmark} data-wordmark>
            HANORYX<span className={styles.locknode} data-locknode />SYSTEMS
          </span>
          <span className={styles.tagline} data-tagline>ONLINE SYSTEMS // NORTH NODE</span>
        </div>
      </div>

      {/* HUD */}
      <div className={styles.hud}>
        <span className={styles.hudCode}>{phase.code}</span>
        <span className={styles.hudPhase}>{phase.name}</span>
        <span className={styles.hudTime}>{fmt(clock)} / {TOTAL}.0s</span>
      </div>

      {/* Center play affordance before first play */}
      {status === 'idle' && (
        <button type="button" className={styles.bigPlay} onClick={play}>
          <span className={styles.bigPlayIcon} aria-hidden="true" />
          <span className={styles.bigPlayLabel}>Play System Sequence</span>
          <span className={styles.bigPlayMeta}>20s · pure-code cinematic</span>
        </button>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.transport}>
          {status === 'playing' ? (
            <button type="button" className={styles.ctrl} onClick={pause}>Pause</button>
          ) : status === 'done' ? (
            <button type="button" className={styles.ctrlPrimary} onClick={replay}>Replay</button>
          ) : (
            <button type="button" className={styles.ctrlPrimary} onClick={play}>Play</button>
          )}
          <button type="button" className={styles.ctrl} onClick={replay}>Restart</button>
          <button type="button" className={styles.ctrl} onClick={skip}>Skip</button>
        </div>

        <button type="button" className={styles.scrubber} onClick={scrub} aria-label="Seek sequence">
          <span className={styles.scrubFill} ref={fillRef} />
          {PHASES.slice(0, -1).map((p) => (
            <span key={p.id} className={styles.scrubTick} style={{ left: `${(p.start / TOTAL) * 100}%` }} />
          ))}
        </button>
      </div>
    </div>
  );
}

export default SystemSynthesisExperience;
