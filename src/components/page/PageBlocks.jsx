import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { SectionScene } from '../scenes/SectionScene';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { DataPanel } from '../ui/DataPanel';
import { Pill } from '../ui/Pill';
import { Button } from '../ui/Button';
import { StatBlock } from '../ui/StatBlock';
import { RedactedTag } from '../ui/RedactedTag';
import { GlitchLine } from '../ui/GlitchLine';
import { MarqueeRail } from '../ui/MarqueeRail';
import { KineticText } from '../animation/KineticText';
import { ScrollReveal } from '../animation/ScrollReveal';
import { RedactionReveal } from '../animation/RedactionReveal';
import { RevealText } from '../../animation/componentMotion/textMotions';
import { musebaseLogo, hasMusebaseLogo } from '../../utils/assetResolver';
import styles from './page.module.css';

/* Section wrapper: each block owns its own scene background + container. */
function Shell({ block, accent, className, children }) {
  return (
    <SectionScene
      scene={block.scene}
      intensity={block.intensity || (block.scene ? 'medium' : 'low')}
      accent={accent}
      className={clsx('section', styles.block, className)}
    >
      <div className="container">{children}</div>
    </SectionScene>
  );
}

/* ---------------- Hero ---------------- */
export function PageHeroBlock({ hero, accent }) {
  return (
    <SectionScene
      scene={hero.scene}
      intensity={hero.intensity || 'hero'}
      accent={accent}
      className={clsx(styles.hero)}
    >
      <div className={clsx('container', styles.heroInner)}>
        {hero.eyebrow && (
          <ScrollReveal as="span" className={clsx('eyebrow', styles.heroEyebrow)}>
            {hero.eyebrow}
          </ScrollReveal>
        )}
        <KineticText as="h1" by="word" text={hero.title} immediate className={clsx('heading-hero', styles.heroTitle)} />
        {hero.intro && (
          <ScrollReveal as="p" className={clsx('lead', styles.heroIntro)} delay={0.12}>
            {hero.intro}
          </ScrollReveal>
        )}
        {hero.actions?.length > 0 && (
          <ScrollReveal as="div" className={clsx('cluster', styles.heroActions)} delay={0.22}>
            {hero.actions.map((a) => (
              <Button key={a.label} to={a.to} href={a.href} variant={a.variant || 'primary'} icon={a.variant === 'outline' ? undefined : ArrowUpRight}>
                {a.label}
              </Button>
            ))}
          </ScrollReveal>
        )}
        {hero.metrics?.length > 0 && (
          <ScrollReveal as="div" className={styles.heroMetrics} delay={0.3} stagger={0.08}>
            {hero.metrics.map((m) => (
              <StatBlock key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </ScrollReveal>
        )}
      </div>
      <div className={styles.heroTelemetry} aria-hidden="true">
        <span className="mono">{hero.code}</span>
        <span className={styles.heroDot} />
        <span className="mono">{hero.status}</span>
      </div>
    </SectionScene>
  );
}

/* ---------------- Block dispatcher ---------------- */
export function PageBlock({ block, accent }) {
  switch (block.type) {
    case 'split':
      return (
        <Shell block={block} accent={accent}>
          <div className={clsx('grid', 'grid--split', styles.split)}>
            <div>
              <SectionHeader eyebrow={block.eyebrow} title={block.title} code={block.code} size="h1" />
              <div className={clsx('stack', 'stack-4', styles.splitBody)}>
                {block.body?.map((p) => (
                  <RevealText key={p} as="p" variant="slideIn" amount={0.4} className="body">{p}</RevealText>
                ))}
              </div>
            </div>
            <ScrollReveal as="div" className={styles.splitAside} y={28}>
              <DataPanel label={block.asideLabel || 'PARAMETERS'} code={block.asideCode || 'P.01'}>
                {block.points?.length > 0 ? (
                  <dl className={styles.kv}>
                    {block.points.map((pt) => (
                      <div key={pt.k} className={styles.kvRow}>
                        <dt className={clsx('mono', styles.kvKey)}>{pt.k}</dt>
                        <dd className={styles.kvVal}>{pt.v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="body-sm">{block.asideBody}</p>
                )}
              </DataPanel>
            </ScrollReveal>
          </div>
        </Shell>
      );

    case 'cards':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" />
          <ScrollReveal className={clsx('grid', 'grid--auto', styles.grid)} stagger={0.07}>
            {block.items.map((it) =>
              it.redacted ? (
                <DataPanel key={it.title} code={it.code} tone="redacted" interactive>
                  <RedactedTag label="CLASSIFIED" lock />
                  <h3 className={clsx('heading-3', styles.redName)}>{it.title}</h3>
                  <p className="body-sm">{it.body}</p>
                </DataPanel>
              ) : (
                <Card
                  key={it.title}
                  code={it.code}
                  label={it.label}
                  title={it.title}
                  description={it.body}
                  tags={it.tags}
                  status={it.status}
                  to={it.to}
                />
              )
            )}
          </ScrollReveal>
        </Shell>
      );

    case 'process':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" />
          <ScrollReveal as="ol" className={styles.process} stagger={0.1} y={26}>
            {block.steps.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.stepNum}>{s.step}</span>
                {i < block.steps.length - 1 && <span className={styles.stepLine} aria-hidden="true" />}
                <h3 className={clsx('heading-3', styles.stepTitle)}>{s.title}</h3>
                <p className="body-sm">{s.body}</p>
              </li>
            ))}
          </ScrollReveal>
        </Shell>
      );

    case 'modules':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" />
          {block.groups?.length > 0 && (
            <ScrollReveal className={clsx('grid', 'grid--3', styles.grid)} stagger={0.07}>
              {block.groups.map((g) => (
                <DataPanel key={g.label} code={g.label} brackets={false}>
                  <ul className={styles.moduleList}>
                    {g.items.map((item) => (
                      <li key={item} className="body-sm">
                        <span className="node-dot" aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </ul>
                </DataPanel>
              ))}
            </ScrollReveal>
          )}
          {block.rows?.length > 0 && (
            <ScrollReveal as="dl" className={styles.kvWide} y={24}>
              {block.rows.map((r) => (
                <div key={r.k} className={styles.kvWideRow}>
                  <dt className={clsx('mono', styles.kvKey)}>{r.k}</dt>
                  <dd className={styles.kvVal}>{r.v}</dd>
                </div>
              ))}
            </ScrollReveal>
          )}
        </Shell>
      );

    case 'stats':
      return (
        <Shell block={block} accent={accent}>
          {(block.eyebrow || block.title) && (
            <SectionHeader eyebrow={block.eyebrow} title={block.title} size="h2" />
          )}
          <GlitchLine className={styles.statLine} />
          <ScrollReveal className={clsx(styles.stats)} stagger={0.08}>
            {block.items.map((m) => (
              <StatBlock key={m.label} value={m.value} suffix={m.suffix} decimals={Number.isInteger(m.value) ? 0 : 1} label={m.label} note={m.note} />
            ))}
          </ScrollReveal>
        </Shell>
      );

    case 'manifesto':
      return (
        <Shell block={block} accent={accent} className={styles.manifesto}>
          {block.eyebrow && <span className={clsx('eyebrow', styles.manifestoEyebrow)}>{block.eyebrow}</span>}
          <div className={styles.manifestoLines}>
            {block.lines.map((line, i) =>
              i === 0 ? (
                <KineticText key={line} as="p" by="word" text={line} className={clsx('display', styles.manifestoLead)} />
              ) : (
                <RevealText key={line} as="p" variant="maskUp" className={clsx('heading-1', 'font-serif', styles.manifestoLine)}>
                  {line}
                </RevealText>
              )
            )}
          </div>
          {block.marquee?.length > 0 && <MarqueeRail items={block.marquee} speed={42} className={styles.manifestoRail} />}
        </Shell>
      );

    case 'feature':
      return (
        <Shell block={block} accent={accent}>
          <ScrollReveal>
            <DataPanel label={block.eyebrow || 'FEATURED SYSTEM'} code={block.code} className={styles.feature}>
              <div className={styles.featureGrid}>
                <div className={styles.featureIdentity}>
                  {block.logo && hasMusebaseLogo ? (
                    <img src={musebaseLogo} alt={block.name} className={styles.featureLogo} />
                  ) : (
                    <span className={clsx('font-serif', styles.featureWordmark)}>{block.name}</span>
                  )}
                  <div className={clsx('cluster', styles.featureMeta)}>
                    <span className={clsx('mono', styles.featureType)}>{block.label}</span>
                    <Pill variant="red" dot>{block.status}</Pill>
                  </div>
                  <p className={clsx('body', 'measure')}>{block.summary}</p>
                </div>
                <dl className={styles.featureModules}>
                  {block.modules.map((m) => (
                    <div key={m.k} className={styles.kvRow}>
                      <dt className={clsx('mono', styles.kvKey)}>{m.k}</dt>
                      <dd className={styles.kvVal}>{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </DataPanel>
          </ScrollReveal>
        </Shell>
      );

    case 'redacted':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" />
          <ScrollReveal as="ul" className={clsx('grid', 'grid--auto', styles.grid)} stagger={0.1}>
            {block.items.map((it, i) => (
              <li key={it.code} className={styles.redactedItem}>
                <DataPanel tone="redacted" code={it.code} interactive>
                  <div className={clsx('cluster', styles.redactedHead)}>
                    <RedactedTag label="CLASSIFIED" lock />
                    {i === 0 && <Pill variant="red">RESTRICTED</Pill>}
                  </div>
                  <RedactionReveal as="p" label="DECRYPTING" className={styles.redactedLabel}>
                    {it.label}
                  </RedactionReveal>
                  <span className={clsx('mono', styles.redactedNote)}>{it.note}</span>
                </DataPanel>
              </li>
            ))}
          </ScrollReveal>
        </Shell>
      );

    case 'cta':
      return (
        <SectionScene scene={block.scene || 'signal-wave'} intensity="medium" accent={accent} className={clsx('section', styles.cta)}>
          <div className={clsx('container', styles.ctaInner)}>
            <SectionHeader eyebrow={block.eyebrow || 'Open a channel'} title={block.title || 'Compose an inquiry.'} align="center" size="hero" />
            <ScrollReveal as="div" className={clsx('stack', 'stack-6', styles.ctaBody)} delay={0.1}>
              <p className={clsx('lead', styles.ctaLead)}>{block.body || 'For software systems, internal platforms, operational interfaces, and controlled online infrastructure.'}</p>
              <a href="mailto:contact@hanoryx.com" className={clsx('font-serif', styles.ctaEmail)}>contact@hanoryx.com</a>
              <div className={clsx('cluster', styles.ctaActions)}>
                <Button href="mailto:contact@hanoryx.com" variant="primary" icon={ArrowUpRight}>Email Hanoryx</Button>
                <Button to="/contact" variant="outline">Contact page</Button>
              </div>
            </ScrollReveal>
          </div>
        </SectionScene>
      );

    default:
      return null;
  }
}

export default PageBlock;
