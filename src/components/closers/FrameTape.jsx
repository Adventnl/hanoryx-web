import { useEffect, useRef } from 'react';
import CloserFrame from './CloserFrame';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './FrameTape.module.css';

/** A strip-chart recorder for this page. Every frame the browser draws is one
 *  column on the tape — tall and red when it took long — and three counters tick
 *  from the same measurements. Purely live: nothing is kept or sent. */
export default function FrameTape({ tag, title, lede, onward }) {
  const [wrapRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.15 });
  const canvasRef = useRef(null);
  const outRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onScreen) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const cols = Math.floor(W / 3);
    const tape = [];
    let frames = 0;
    let longest = 0;
    let raf = 0;
    let last = 0;
    let started = 0;
    let lastText = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.setLineDash([3, 4]);
      [16.7, 33.3].forEach((t) => {
        const y = H - (t / 60) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      tape.forEach((dt, i) => {
        const h = Math.max(2, (dt / 60) * H);
        ctx.fillStyle = dt > 33.3 ? '#ff3333' : dt > 20 ? 'rgba(255,51,51,0.5)' : 'rgba(255,255,255,0.55)';
        ctx.fillRect(W - (tape.length - i) * 3, H - h, 2, h);
      });
    };
    const loop = (now) => {
      if (last) {
        const dt = Math.min(now - last, 200);
        tape.push(dt);
        if (tape.length > cols) tape.shift();
        frames += 1;
        longest = Math.max(longest, dt);
        draw();
      } else started = now;
      last = now;
      if (now - lastText > 250) {
        lastText = now;
        const o = outRef.current;
        if (o.frames) o.frames.textContent = frames.toLocaleString();
        if (o.longest) o.longest.textContent = `${Math.round(longest)} ms`;
        if (o.avg) o.avg.textContent = frames ? `${Math.round((frames / ((now - started) / 1000)) || 0)} fps` : '—';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onScreen]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div ref={wrapRef} className={styles.rec} {...fx('frametape.recorder')}>
        <canvas ref={canvasRef} className={styles.tape} role="img" aria-label="A live chart of how long each frame of this page took to draw" />
        <dl className={styles.stats}>
          <div><dt>Frames drawn</dt><dd ref={(el) => { outRef.current.frames = el; }}>0</dd></div>
          <div><dt>Longest gap</dt><dd ref={(el) => { outRef.current.longest = el; }}>0 ms</dd></div>
          <div><dt>Average</dt><dd ref={(el) => { outRef.current.avg = el; }}>—</dd></div>
        </dl>
      </div>
      <p className={styles.note}>The two dashed lines mark 60 fps and 30 fps. Scroll or move about and watch the tape; it only records while it is on screen.</p>
    </CloserFrame>
  );
}
