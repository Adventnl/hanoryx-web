import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ArrowLink } from '../fx/ArrowLink';
import { ScrambleText } from '../fx/ScrambleText';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ChronologyScrubber.module.css';

const SPRING = { type: 'spring', stiffness: 420, damping: 40, mass: 0.8 };
const STEP_MS = 2800;

/**
 * The company chronology as something you move through. Drag the playhead (or
 * press ← → Home End on it, or click a stop or a row) and the stage beneath
 * glides from phase to phase; "Play through" walks the whole sequence.
 *
 * The track's spacing is ORDER, not time — no dates are published, so none are
 * implied, and the dashed segments say so.
 *
 *   phases: [{ id, code, title, headline, body, glyph, to?, status, live? }]
 */
export default function ChronologyScrubber({ eyebrow, title, intro, phases, note }) {
  const uid = useId();
  const n = phases.length;
  const last = n - 1;
  const reduced = usePrefersReducedMotion();
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.25 });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const dragRef = useRef({ active: false, moved: false, startX: 0 });

  /* the one place `--pos` is written when NOT dragging: glide to the phase */
  useEffect(() => {
    indexRef.current = index;
    const track = trackRef.current;
    if (track && !dragRef.current.active) track.style.setProperty('--pos', String(index));
  }, [index]);

  const go = useCallback((next, { manual = true } = {}) => {
    const clamped = Math.max(0, Math.min(last, next));
    if (manual) {
      setPlaying(false);
      setFinished(false);
    }
    setIndex(clamped);
  }, [last]);

  /* "Play through": one phase every few seconds, only while on screen */
  useEffect(() => {
    if (!playing || !onScreen) return undefined;
    const id = window.setInterval(() => {
      if (indexRef.current >= last) {
        setPlaying(false);
        setFinished(true);
        return;
      }
      setIndex(indexRef.current + 1);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, onScreen, last]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (finished || index >= last) {
      setIndex(0);
      setFinished(false);
    }
    setPlaying(true);
  };

  /* ---------- drag / click on the track ---------- */
  const positionFromEvent = (event) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    return ratio * last;
  };
  const paint = (p) => {
    trackRef.current.style.setProperty('--pos', p.toFixed(3));
    const nearest = Math.round(p);
    if (nearest !== indexRef.current) {
      indexRef.current = nearest;
      setIndex(nearest);
    }
  };
  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button > 0) return;
    setPlaying(false);
    setFinished(false);
    dragRef.current = { active: true, moved: false, startX: event.clientX };
    trackRef.current.dataset.drag = 'jump';
    event.currentTarget.setPointerCapture?.(event.pointerId);
    paint(positionFromEvent(event));
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    if (!drag.moved && Math.abs(event.clientX - drag.startX) > 3) {
      drag.moved = true;
      trackRef.current.dataset.drag = 'true';
    }
    paint(positionFromEvent(event));
  };
  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    delete trackRef.current.dataset.drag;
    trackRef.current.style.setProperty('--pos', String(indexRef.current));
  };
  const onKeyDown = (event) => {
    const map = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
    if (event.key in map) {
      event.preventDefault();
      go(index + map[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      go(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      go(last);
    }
  };

  const active = phases[index];

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="scan" />

      <div className={styles.stage} {...fx('timeline.phase-stage')}>
        {phases.map((phase, i) => {
          const rel = i === index ? 0 : i < index ? -1 : 1;
          return (
            <article
              key={phase.id}
              className={clsx('glyph-host', styles.panel)}
              data-rel={rel}
              aria-hidden={rel !== 0}
              inert={rel !== 0}
            >
              <span className={clsx('ghost-numeral', styles.ghost)} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.copy}>
                <span className={styles.panelTop}>
                  <Glyph name={phase.glyph} size={40} className={styles.glyph} />
                  <span className={styles.code}>{phase.code}</span>
                  <span className={clsx(styles.status, phase.live && styles.live)}>
                    {phase.live && <i aria-hidden="true" />}
                    {phase.status}
                  </span>
                </span>
                <h3 className={styles.panelTitle}>{phase.title}</h3>
                <p className={styles.headline}>{phase.headline}</p>
                <p className={styles.body}>{phase.body}</p>
                {phase.to && <ArrowLink to={phase.to} tone="red" tabIndex={rel === 0 ? 0 : -1}>Read the case study</ArrowLink>}
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.play} onClick={togglePlay} aria-pressed={playing} {...fx('timeline.play-through')}>
          {playing ? <Pause size={14} aria-hidden="true" /> : finished ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          <span>{playing ? 'Pause' : finished ? 'Replay' : 'Play through'}</span>
        </button>
        <span className={styles.readout} aria-hidden="true">
          <ScrambleText text={active.code} trigger={index} />
          <i />
          <span>{index + 1} / {n}</span>
        </span>
      </div>

      <div className={styles.trackWrap} {...fx('timeline.scrub-track')}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{ '--last': last }}
          role="slider"
          tabIndex={0}
          aria-label="Company chronology"
          aria-orientation="horizontal"
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={index + 1}
          aria-valuetext={`Phase ${index + 1} of ${n}: ${active.title}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          data-cursor="drag"
        >
          <span className={styles.rail} aria-hidden="true" />
          <span className={styles.fill} aria-hidden="true" />
          {phases.map((phase, i) => (
            <span
              key={phase.id}
              className={clsx(styles.stop, i <= index && styles.lit, phase.live && styles.liveStop)}
              style={{ '--i': i }}
              aria-hidden="true"
            >
              <span className={styles.dot} />
              <span className={styles.stopLabel}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{phase.title}</span>
              </span>
            </span>
          ))}
          <span className={styles.knob} aria-hidden="true">
            <span className={styles.knobRing} />
          </span>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>

      <ol className={styles.index}>
        {phases.map((phase, i) => {
          const on = i === index;
          return (
            <li key={phase.id}>
              <button type="button" className={clsx(styles.row, on && styles.rowOn)} onClick={() => go(i)} aria-current={on ? 'step' : undefined}>
                {on && <motion.span layoutId={`${uid}-ink`} className={styles.rowInk} transition={reduced ? { duration: 0 } : SPRING} />}
                <span className={styles.rowCode}>{phase.code}</span>
                <span className={styles.rowTitle}>{phase.title}</span>
                <span className={styles.rowHead}>{phase.headline}</span>
                {phase.to && !on && <span className={styles.rowTag}>Case study</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
