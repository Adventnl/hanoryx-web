import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const line = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
      if (line.current) line.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
  return <div className={styles.track} aria-hidden="true"><span ref={line} /></div>;
}
