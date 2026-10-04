import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { getFps, getSubscriberCount } from '../../animation/rafScheduler';
import { getMotionState, maxActiveScenes } from '../../animation/motionBudget';
import { activeSceneCount, setScenesPaused } from '../../animation/sceneBudget';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './LiveBudget.module.css';

/**
 * Live numbers from THIS page on THIS device: frames per second, how many
 * background scenes are actually running (against the cap), how many animation
 * loops are subscribed and the current quality tier. Read twice a second,
 * written straight to the DOM, and only while the panel is on screen. The
 * button pauses every background so you can watch the numbers move.
 * `framed` gives it a card of its own (used as a hero object).
 */
export function LiveBudget({ framed = false }) {
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.2 });
  const [paused, setPaused] = useState(false);
  const fpsRef = useRef(null);
  const barRef = useRef(null);
  const scenesRef = useRef(null);
  const loopsRef = useRef(null);
  const tierRef = useRef(null);
  const dotsRef = useRef(null);
  const cap = maxActiveScenes();

  useEffect(() => () => setScenesPaused(false), []);

  useEffect(() => {
    if (!onScreen) return undefined;
    const read = () => {
      const fps = Math.max(0, Math.min(60, Math.round(getFps())));
      const scenes = activeSceneCount();
      const { tier } = getMotionState();
      if (fpsRef.current) fpsRef.current.textContent = String(fps);
      if (barRef.current) barRef.current.style.transform = `scaleX(${fps / 60})`;
      if (scenesRef.current) scenesRef.current.textContent = String(scenes);
      if (loopsRef.current) loopsRef.current.textContent = String(getSubscriberCount());
      if (tierRef.current) tierRef.current.textContent = String(tier).toUpperCase();
      dotsRef.current?.querySelectorAll('i').forEach((dot, i) => { dot.dataset.on = i < scenes ? 'true' : 'false'; });
    };
    read();
    const id = window.setInterval(read, 500);
    return () => window.clearInterval(id);
  }, [onScreen]);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    setScenesPaused(next);
  };

  return (
    <div ref={rootRef} className={clsx(styles.budget, framed && styles.framed)} {...fx('engineering.live-budget')}>
      <div className={styles.meter}>
        <div className={styles.big}>
          <span ref={fpsRef}>—</span>
          <small>frames / second</small>
        </div>
        <span className={styles.bar} aria-hidden="true"><i ref={barRef} /></span>
      </div>
      <dl className={styles.readouts}>
        <div><dt>Backgrounds running</dt><dd><span ref={scenesRef}>—</span> <small>of {cap} allowed</small></dd></div>
        <div><dt>Animation loops</dt><dd ref={loopsRef}>—</dd></div>
        <div><dt>Quality tier</dt><dd ref={tierRef}>—</dd></div>
      </dl>
      <div ref={dotsRef} className={styles.dots} aria-hidden="true">
        {Array.from({ length: Math.max(cap, 2) }, (_, i) => <i key={i} data-on="false" />)}
      </div>
      <button type="button" className={styles.action} onClick={toggle} aria-pressed={paused} data-cursor="link">
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        <span>{paused ? 'Resume the backgrounds' : 'Pause every background'}</span>
      </button>
    </div>
  );
}

export default LiveBudget;
