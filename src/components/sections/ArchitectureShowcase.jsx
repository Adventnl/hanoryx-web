import clsx from 'clsx';
import { architecture } from '../../data/systems';
import { SectionHeader } from '../ui/SectionHeader';
import { DataPanel } from '../ui/DataPanel';
import { GlitchLine } from '../ui/GlitchLine';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './ArchitectureShowcase.module.css';

/**
 * Operational architecture diagram.
 * Left: section header. Right: a layered stack of DataPanels connected by
 * vertical markers, revealing bottom-up (L1 -> L2 -> L3) on scroll.
 */
export function ArchitectureShowcase() {
  const { eyebrow, title, body, layers } = architecture;

  // Visual order keeps L3 on top; reveal order runs from the base (L1) up,
  // so deeper layers settle first. delay = distance from the bottom.
  const lastIndex = layers.length - 1;

  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <div className={clsx('grid', 'grid--split', styles.split)}>
          {/* LEFT — framing */}
          <div className={styles.lead}>
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              intro={body}
              code="ARCH.STACK"
              as="h2"
              size="h1"
            />
            <GlitchLine className={styles.accent} />
            <p className={clsx('mono', 'text-faint', styles.legend)}>
              L3 — INTERFACE / L2 — ORCHESTRATION / L1 — CORE
            </p>
          </div>

          {/* RIGHT — the stack diagram */}
          <div className={styles.stack}>
            <span className={styles.spine} aria-hidden="true" />

            {layers.map((layer, i) => {
              // Bottom layer (L1) reveals first, top layer (L3) last.
              const fromBottom = lastIndex - i;
              const isBase = i === lastIndex;

              return (
                <ScrollReveal
                  key={layer.id}
                  className={styles.row}
                  y={28}
                  blur={6}
                  delay={fromBottom * 0.14}
                  start="top 88%"
                >
                  {/* Connector marker between stacked panels */}
                  <span className={styles.marker} aria-hidden="true">
                    <i className={styles.node} />
                    {!isBase && <i className={styles.connector} />}
                  </span>

                  <DataPanel className={styles.panel} brackets={false}>
                    <div className={styles.layer}>
                      <span className={clsx('mono', styles.layerCode)}>{layer.code}</span>
                      <div className={styles.layerText}>
                        <h3 className={clsx('heading-3', styles.layerTitle)}>{layer.title}</h3>
                        <p className={clsx('body-sm', 'text-dim', styles.layerBody)}>
                          {layer.body}
                        </p>
                      </div>
                    </div>
                  </DataPanel>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureShowcase;
