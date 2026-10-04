import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './LayerStack.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * An exploded view of a layered system. Three plates start stacked and part as
 * you scroll through the section (one ScrollTrigger writes --p, CSS does the
 * rest); hover or focus a plate to lift it clear and read what it holds. Built
 * in CSS 3D from three static elements — no canvas, no per-frame JS.
 *
 *   layers: [{ code, title, body, glyph }]   top plate first
 */
export default function LayerStack({ eyebrow, title, intro, layers, note }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      el.style.setProperty('--p', '1');
      return undefined;
    }
    const write = (p) => el.style.setProperty('--p', p.toFixed(4));
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'center 45%',
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
    write(trigger.progress);
    return () => trigger.kill();
  }, [reduced]);

  const pick = (i) => {
    setActive(i);
    setPulse((p) => p + 1);
  };
  const current = layers[active];

  return (
    <div ref={ref} className={styles.root} {...fx('layers.exploded-stack')}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.stage}>
        <div className={styles.scene} aria-hidden="false">
          <div className={styles.stack}>
            {layers.map((layer, i) => (
              <button
                key={layer.code}
                type="button"
                className={clsx(styles.plate, active === i && styles.on)}
                style={{ '--i': i, '--n': layers.length }}
                {...fx('layers.plate')}
                onPointerEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                aria-pressed={active === i}
                aria-label={`${layer.code} ${layer.title}`}
              >
                <span className={styles.plateGrid} aria-hidden="true" />
                <span className={styles.plateCode}>{layer.code}</span>
                <span className={styles.plateName}>{layer.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.detail} aria-live="polite">
          <span className={styles.dCode}>{current.code}</span>
          <Glyph name={current.glyph || 'layers'} size={46} className={styles.dGlyph} playKey={pulse} {...fx('layers.glyph-redraw')} />
          <ScrambleText as="h3" text={current.title} trigger={pulse} className={styles.dTitle} {...fx('layers.title-decode')} />
          <p className={styles.dBody}>{current.body}</p>
          {note && <p className={styles.note}>{note}</p>}
        </div>
      </div>
    </div>
  );
}
