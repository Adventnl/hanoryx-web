import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Pause, Play, Plus } from 'lucide-react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { Odometer } from '../fx/Odometer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ExperienceStoryboard.module.css';

const EASE = [0.16, 1, 0.3, 1];

/* Abstract wireframes — shapes, not screenshots. Each stage has a little thing
   to do. None of it is the real product and none of it shows real catalogue,
   prices or payment details. */
function Discover() {
  return (
    <div className={styles.wire}>
      <div className={styles.search}><span className={styles.caret} /></div>
      <div className={styles.tiles}>
        {Array.from({ length: 6 }, (_, i) => <span key={i} className={styles.tile} style={{ '--d': i }} />)}
      </div>
    </div>
  );
}

function Choose() {
  const [opt, setOpt] = useState(0);
  return (
    <div className={styles.wire}>
      <div className={styles.choose}>
        <span className={styles.hero} data-opt={opt} />
        <div className={styles.lines}>
          <span /><span /><span className={styles.short} />
          <div className={styles.chips} role="group" aria-label="Pick an option">
            {['One', 'Two', 'Three'].map((label, i) => (
              <button key={label} type="button" className={clsx(styles.chip, opt === i && styles.chipOn)} aria-pressed={opt === i} onClick={() => setOpt(i)}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Basket() {
  const [qty, setQty] = useState([1, 2, 1]);
  const total = qty.reduce((a, b) => a + b, 0);
  const bump = (i, d) => setQty((q) => q.map((v, j) => (j === i ? Math.max(0, Math.min(9, v + d)) : v)));
  return (
    <div className={styles.wire}>
      <ul className={styles.rows}>
        {qty.map((q, i) => (
          <li key={i} className={styles.row} style={{ '--d': i }}>
            <span className={styles.thumb} />
            <span className={styles.rowLines}><span /><span className={styles.short} /></span>
            <span className={styles.stepper}>
              <button type="button" onClick={() => bump(i, -1)} aria-label={`Fewer of item ${i + 1}`}><Minus size={12} /></button>
              <b className={styles.qty}>{q}</b>
              <button type="button" onClick={() => bump(i, 1)} aria-label={`More of item ${i + 1}`}><Plus size={12} /></button>
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.total}><span>Items</span><span className={styles.totalNum}><Odometer value={total} /></span></div>
    </div>
  );
}

function Pay() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className={styles.wire}>
      <ol className={styles.steps}>
        {['Details', 'Review', 'Confirm'].map((l, i) => (
          <li key={l} className={clsx(styles.stepItem, step > i && styles.stepDone, step === i && styles.stepNow)}><span>{i + 1}</span>{l}</li>
        ))}
      </ol>
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 48 48" className={styles.ring} aria-hidden="true">
          <circle cx="24" cy="24" r="19" className={styles.ringTrack} />
          <circle cx="24" cy="24" r="19" className={styles.ringArc} style={{ strokeDashoffset: 1 - Math.min(1, (step + 1) / 4) }} pathLength="1" />
        </svg>
        <span className={styles.ringLabel}>{step < 3 ? 'Working' : 'Done'}</span>
      </div>
    </div>
  );
}

function Confirm() {
  return (
    <div className={styles.wire}>
      <div className={styles.done}>
        <svg viewBox="0 0 48 48" className={styles.check} aria-hidden="true">
          <circle cx="24" cy="24" r="19" pathLength="1" />
          <path d="M15 25 L22 32 L34 17" pathLength="1" />
        </svg>
        <div className={styles.receipt}>
          <span /><span /><span className={styles.short} />
        </div>
      </div>
    </div>
  );
}

const SCREENS = { discover: Discover, choose: Choose, basket: Basket, pay: Pay, confirm: Confirm };

/**
 * A storyboard of the shopping and transaction experience, from first look to
 * confirmation. Five abstract frames, each with one small interaction; a
 * scrubber and ← → move through them, and Play walks the whole journey. It is
 * an illustration of the *experience* — shapes, not screenshots.
 *
 *   stages: [{ id, label, glyph, title, body }]
 */
export default function ExperienceStoryboard({ eyebrow, title, intro, stages, caption }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(0);
  const reduced = usePrefersReducedMotion();
  const timer = useRef(0);
  const n = stages.length;
  const stage = stages[active];
  const Screen = SCREENS[stage.id] || Discover;

  const go = (i) => {
    setActive(Math.max(0, Math.min(n - 1, i)));
    setPulse((p) => p + 1);
  };

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = window.setInterval(() => {
      setActive((a) => {
        if (a >= n - 1) { setPlaying(false); return a; }
        setPulse((p) => p + 1);
        return a + 1;
      });
    }, 2600);
    return () => window.clearInterval(timer.current);
  }, [playing, n]);

  const togglePlay = () => {
    if (!playing && active >= n - 1) go(0);
    setPlaying((p) => !p);
  };

  return (
    <div {...fx('product.storyboard')}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="depth" />
      <div className={styles.layout}>
        <div className={styles.device} {...fx('story.device-frame')}>
          <div className={styles.chrome} aria-hidden="true"><i /><i /><i /><span>storyboard</span></div>
          <div className={styles.screen}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage.id}
                className={styles.frame}
                initial={reduced ? false : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } }}
                exit={reduced ? undefined : { opacity: 0, x: -30, transition: { duration: 0.22 } }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.side}>
          <span className={styles.count}>{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <ScrambleText as="h3" text={stage.title} trigger={pulse} className={styles.sTitle} {...fx('story.title-decode')} />
          <p className={styles.sBody} aria-live="polite">{stage.body}</p>
          <div className={styles.controls}>
            <button type="button" className={styles.play} onClick={togglePlay} aria-pressed={playing} {...fx('story.play-journey')}>
              {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {playing ? 'Pause' : 'Play the journey'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scrub} style={{ '--n': n, '--a': active }}>
        <span className={styles.track} aria-hidden="true" {...fx('story.scrub-knob')}><span className={styles.fill} /><span className={styles.knob} /></span>
        <ul className={styles.stops} role="tablist" aria-label="Journey stages" {...fx('story.stage-tabs')}>
          {stages.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                className={clsx('glyph-host', styles.stop, i === active && styles.stopOn, i < active && styles.stopDone)}
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
                  if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
                }}
              >
                <Glyph name={s.glyph} size={22} />
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
