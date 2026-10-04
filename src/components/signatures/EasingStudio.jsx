import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';
import { Check, Copy, Play } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './EasingStudio.module.css';

/* plane geometry inside the SVG (viewBox 0 -10 100 150): x 0..1 -> 15..85, y 0..1 -> 100..30 */
const OX = 15;
const OY = 100;
const SIZE = 70;
const toX = (x) => OX + x * SIZE;
const toY = (y) => OY - y * SIZE;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = (v) => (Math.round(v * 100) / 100).toString();

function feel([x1, y1, x2, y2]) {
  const diagonal = Math.abs(x1 - y1) < 0.04 && Math.abs(x2 - y2) < 0.04;
  if (diagonal) return 'Constant speed. Mechanical, with no sense of weight.';
  if (y1 > 1.05 || y2 > 1.05) return 'Overshoots its target, then settles back.';
  if (y1 < -0.05) return 'Pulls back first, then goes.';
  if (x1 < 0.32 && y1 > 0.75) return 'Fast off the mark, long gentle settle — the site’s usual voice.';
  if (x1 > 0.5 && y2 < 0.5) return 'Slow to start, quick to finish.';
  return 'An even ease in and out.';
}

/**
 * A cubic-bezier studio. Drag the two control points (or focus one and use the
 * arrow keys; Shift moves further), pick a preset — the handles glide there —
 * and watch the same curve move a ball, scale a block and fade a bar. The line
 * below is the CSS you would write, with a copy button. Presets named "Site"
 * are the curves this site actually uses.
 *
 *   presets: [{ id, label, value: [x1, y1, x2, y2] }]
 */
export default function EasingStudio({ eyebrow, title, intro, presets, note }) {
  const reduced = usePrefersReducedMotion();
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.25 });
  const [p, setP] = useState(presets[0].value);
  const [duration, setDuration] = useState(900);
  const [atEnd, setAtEnd] = useState(false);
  const [copied, setCopied] = useState('');
  const [presetId, setPresetId] = useState(presets[0].id);
  const svgRef = useRef(null);
  const dragRef = useRef(-1);
  const tweenRef = useRef(null);

  useEffect(() => () => tweenRef.current?.kill(), []);

  /* gentle auto-replay while the studio is on screen (never under reduced motion) */
  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    const id = window.setInterval(() => setAtEnd((v) => !v), duration + 900);
    return () => window.clearInterval(id);
  }, [reduced, onScreen, duration]);

  const css = `cubic-bezier(${p.map(fmt).join(', ')})`;

  const pickPreset = (preset) => {
    setPresetId(preset.id);
    tweenRef.current?.kill();
    const proxy = { a: p[0], b: p[1], c: p[2], d: p[3] };
    if (reduced) {
      setP(preset.value);
      return;
    }
    tweenRef.current = gsap.to(proxy, {
      a: preset.value[0], b: preset.value[1], c: preset.value[2], d: preset.value[3],
      duration: 0.55,
      ease: 'power3.out',
      onUpdate: () => setP([proxy.a, proxy.b, proxy.c, proxy.d]),
    });
  };

  const toPlane = (event) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const local = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [clamp((local.x - OX) / SIZE, 0, 1), clamp((OY - local.y) / SIZE, -0.5, 1.5)];
  };
  const set = (index, x, y) => {
    setPresetId('');
    setP((prev) => {
      const next = [...prev];
      next[index * 2] = x;
      next[index * 2 + 1] = y;
      return next;
    });
  };
  const onDown = (index) => (event) => {
    tweenRef.current?.kill();
    dragRef.current = index;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onMove = (event) => {
    if (dragRef.current < 0) return;
    const [x, y] = toPlane(event);
    set(dragRef.current, x, y);
  };
  const onUp = () => { dragRef.current = -1; };
  const onKey = (index) => (event) => {
    const step = event.shiftKey ? 0.1 : 0.02;
    const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const d = map[event.key];
    if (!d) return;
    event.preventDefault();
    set(index, clamp(p[index * 2] + d[0], 0, 1), clamp(p[index * 2 + 1] + d[1], -0.5, 1.5));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`transition: transform ${duration}ms ${css};`);
      setCopied('Copied');
    } catch {
      setCopied('Copy unavailable');
    }
    window.setTimeout(() => setCopied(''), 1800);
  };

  const transition = (prop) => ({ transition: `${prop} ${duration}ms ${css}` });

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('motion.easing-studio')}>
        <div className={styles.editor}>
          <svg
            ref={svgRef}
            className={styles.svg}
            viewBox="0 -10 100 150"
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            role="group"
            aria-label="Cubic bezier editor"
          >
            <rect className={styles.plane} x={OX} y={toY(1)} width={SIZE} height={SIZE} />
            <line className={styles.diag} x1={toX(0)} y1={toY(0)} x2={toX(1)} y2={toY(1)} />
            <line className={styles.arm} x1={toX(0)} y1={toY(0)} x2={toX(p[0])} y2={toY(p[1])} />
            <line className={styles.arm} x1={toX(1)} y1={toY(1)} x2={toX(p[2])} y2={toY(p[3])} />
            <path className={styles.curve} d={`M ${toX(0)} ${toY(0)} C ${toX(p[0])} ${toY(p[1])}, ${toX(p[2])} ${toY(p[3])}, ${toX(1)} ${toY(1)}`} />
            {[0, 1].map((i) => (
              <g key={i}>
                <circle
                  className={styles.hit}
                  cx={toX(p[i * 2])}
                  cy={toY(p[i * 2 + 1])}
                  r="9"
                  tabIndex={0}
                  role="slider"
                  aria-label={`Control point ${i + 1}`}
                  aria-valuetext={`x ${fmt(p[i * 2])}, y ${fmt(p[i * 2 + 1])}`}
                  aria-valuenow={Math.round(p[i * 2 + 1] * 100)}
                  onPointerDown={onDown(i)}
                  onKeyDown={onKey(i)}
                  data-cursor="drag"
                />
                <circle className={styles.dot} cx={toX(p[i * 2])} cy={toY(p[i * 2 + 1])} r="3.4" />
              </g>
            ))}
          </svg>
          <p className={styles.feel} aria-live="polite">{feel(p)}</p>
        </div>

        <div className={styles.side}>
          <div className={styles.previews} aria-hidden="true">
            <div className={styles.row}>
              <span>MOVE</span>
              <div className={styles.lane}><i className={styles.ball} style={{ ...transition('transform'), transform: `translateX(${atEnd ? 'calc(100cqw - 22px)' : '0px'})` }} /></div>
            </div>
            <div className={styles.row}>
              <span>SCALE</span>
              <div className={styles.lane}><i className={styles.block} style={{ ...transition('transform'), transform: `scale(${atEnd ? 1 : 0.45})` }} /></div>
            </div>
            <div className={styles.row}>
              <span>FADE</span>
              <div className={styles.lane}><i className={styles.bar} style={{ ...transition('opacity'), opacity: atEnd ? 1 : 0.1 }} /></div>
            </div>
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.play} onClick={() => setAtEnd((v) => !v)} data-cursor="link">
              <Play size={13} aria-hidden="true" /> Play
            </button>
            <label className={styles.duration}>
              <span>Duration</span>
              <input type="range" min={200} max={1800} step={50} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              <output>{duration} ms</output>
            </label>
          </div>

          <div className={styles.presets} role="group" aria-label="Presets">
            {presets.map((preset) => (
              <button key={preset.id} type="button" className={clsx(styles.preset, presetId === preset.id && styles.presetOn)} onClick={() => pickPreset(preset)} aria-pressed={presetId === preset.id}>
                {preset.label}
              </button>
            ))}
          </div>

          <div className={styles.code}>
            <code>{css}</code>
            <button type="button" onClick={copy} aria-label="Copy the transition">
              {copied === 'Copied' ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />} {copied || 'Copy'}
            </button>
          </div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
