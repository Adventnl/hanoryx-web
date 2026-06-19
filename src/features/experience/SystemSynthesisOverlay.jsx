import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import styles from './SystemSynthesisOverlay.module.css';

function pickQuality() {
  if (typeof window === 'undefined') return 'high';
  const w = window.innerWidth;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
  if (w < 640 || coarse) return 'low';
  if (w < 1100) return 'medium';
  return 'high';
}

/**
 * SystemSynthesisOverlay — the full-screen takeover. NOT a page, NOT a player.
 * Mounts already playing, owns the whole viewport (nav/cursor hidden + scroll
 * locked by ExperienceProvider), exposes only a minimal SKIP + a subtle system
 * HUD, and dissolves back into the live site on completion or skip.
 */
export default function SystemSynthesisOverlay({ onClose }) {
  const reduced = usePrefersReducedMotion();
  const quality = useMemo(() => (reduced ? 'low' : pickQuality()), [reduced]);

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const tlRef = useRef(null);
  const fillRef = useRef(null);
  const lastPhaseRef = useRef(-1);
  const closedRef = useRef(false);

  const [phase, setPhase] = useState(PHASES[0]);

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose?.();
  }, [onClose]);

  // Escape skips/closes.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (reduced) {
        // Short, simplified lock-in (~1.6s) then release.
        canvas.render(18.2);
        const t = setTimeout(close, 1600);
        return () => clearTimeout(t);
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
      };

      const tl = gsap.timeline({ paused: true, onUpdate, onComplete: close });
      tlRef.current = tl;
      tl.to({}, { duration: TOTAL });

      // Phase 1 — telemetry stream
      gsap.set(qa('[data-telemetry] span'), { opacity: 0, x: -8 });
      tl.to(qa('[data-telemetry] span'), { opacity: 1, x: 0, stagger: 0.16, duration: 0.4 }, 0.3);
      tl.to(q('[data-telemetry]'), { opacity: 0, duration: 0.8 }, 5.0);
      // Phase 5 — route chips
      gsap.set(qa('[data-routes] li'), { opacity: 0, y: 10, filter: 'blur(6px)' });
      tl.to(qa('[data-routes] li'), { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, duration: 0.5 }, 7.4);
      tl.to(q('[data-routes]'), { opacity: 0, duration: 0.6 }, 9.0);
      // Phase 6 — module chips
      gsap.set(qa('[data-modules] li'), { opacity: 0, scale: 0.8 });
      tl.to(qa('[data-modules] li'), { opacity: 1, scale: 1, stagger: 0.08, duration: 0.4, ease: 'back.out(2)' }, 9.1);
      tl.to(q('[data-modules]'), { opacity: 0, duration: 0.7 }, 12.6);
      // Phase 8 — convergence headline
      gsap.set(q('[data-converge]'), { opacity: 0, letterSpacing: '0.6em', filter: 'blur(12px)' });
      tl.to(q('[data-converge]'), { opacity: 1, letterSpacing: '0.2em', filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 13.2);
      tl.to(q('[data-converge]'), { opacity: 0, duration: 0.6 }, 14.8);
      // Phase 10 — wordmark lock-in
      gsap.set(q('[data-wordmark]'), { opacity: 0, scale: 1.35, clipPath: 'inset(0 50% 0 50%)' });
      gsap.set(q('[data-tagline]'), { opacity: 0, y: 8 });
      gsap.set(q('[data-locknode]'), { scale: 0 });
      tl.to(q('[data-wordmark]'), { opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0%)', duration: 1.0, ease: 'power3.out' }, 17.2);
      tl.to(q('[data-locknode]'), { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 18.0);
      tl.to(q('[data-tagline]'), { opacity: 1, y: 0, duration: 0.6 }, 18.2);
      // Phase 11 — release
      tl.to([q('[data-wordmark]'), q('[data-tagline]'), q('[data-locknode]')], { opacity: 0, duration: 0.8 }, 19.3);
      tl.to(q('[data-stage]'), { opacity: 0, duration: 0.7, ease: 'power2.in' }, 19.3);

      canvas.render(0);
      // Autoplay — the overlay always opens already running.
      tl.play(0);
      return undefined;
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <div ref={rootRef} className={styles.overlay} role="dialog" aria-label="System synthesis sequence" aria-modal="true">
      <div className={styles.stage} data-stage>
        <SynthesisCanvas ref={canvasRef} accent="#ff3333" quality={quality} initialTime={reduced ? 18.2 : 0} className={styles.canvas} />

        <div className={styles.dom} aria-hidden="true">
          <ul className={styles.telemetry} data-telemetry>
            {STATUS_MESSAGES.map((m) => (<li key={m}><span>{m}</span></li>))}
          </ul>
          <ul className={styles.routeChips} data-routes>
            {ROUTE_LABELS.map((r) => (<li key={r}>{r}</li>))}
          </ul>
          <ul className={styles.moduleChips} data-modules>
            {MODULE_LABELS.map((m) => (<li key={m}>{m}</li>))}
          </ul>
          <span className={styles.converge} data-converge>INTERFACE CONVERGENCE</span>
          <div className={styles.lockGroup}>
            <span className={styles.wordmark} data-wordmark>
              HANORYX<span className={styles.locknode} data-locknode />SYSTEMS
            </span>
            <span className={styles.tagline} data-tagline>ONLINE SYSTEMS // NORTH NODE</span>
          </div>
        </div>
      </div>

      {/* minimal, premium HUD — not a player */}
      <div className={styles.hud} aria-hidden="true">
        <span className={styles.hudCode}>{phase.code}</span>
        <span className={styles.hudPhase}>{phase.name}</span>
      </div>
      <span className={styles.progress} aria-hidden="true"><span ref={fillRef} className={styles.progressFill} /></span>

      <button type="button" className={styles.skip} onClick={close}>SKIP</button>
    </div>
  );
}
