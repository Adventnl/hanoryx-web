import { Fragment } from 'react';
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
import { KineticText } from '@/animation/reveal/KineticText';
import { RedactionReveal } from '@/animation/reveal/RedactionReveal';
import { Reveal, RevealGroup } from '@/animation/reveal/Reveal';
import { useExperience } from '../../app/providers/experience-context';
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
  const { openSynthesis } = useExperience();
  return (
    <SectionScene
      scene={hero.scene}
      intensity={hero.intensity || 'hero'}
      accent={accent}
      className={clsx(styles.hero)}
    >
      <div className={clsx('container', styles.heroInner)}>
        {hero.eyebrow && (
          <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.heroEyebrow)}>
            {hero.eyebrow}
          </Reveal>
        )}
        <KineticText as="h1" by="word" text={hero.title} immediate className={clsx('heading-hero', styles.heroTitle)} />
        {hero.intro && (
          <Reveal profile="slideLeft" as="p" delay={0.12} className={clsx('lead', styles.heroIntro)}>
            {hero.intro}
          </Reveal>
        )}
        {hero.actions?.length > 0 && (
          <Reveal profile="depthRise" as="div" delay={0.22} className={clsx('cluster', styles.heroActions)}>
            {hero.actions.map((a) =>
              a.action === 'system-synthesis' ? (
                <Button key={a.label} onClick={openSynthesis} variant={a.variant || 'primary'}>
                  {a.label}
                </Button>
              ) : (
                <Button key={a.label} to={a.to} href={a.href} variant={a.variant || 'primary'} icon={a.variant === 'outline' ? undefined : ArrowUpRight}>
                  {a.label}
                </Button>
              )
            )}
          </Reveal>
        )}
        {hero.metrics?.length > 0 && (
          <RevealGroup profile="countRise" className={styles.heroMetrics} stagger={0.08} delayChildren={0.3}>
            {hero.metrics.map((m) => (
              <StatBlock key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </RevealGroup>
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

/* ---------------- Block dispatcher ----------------
   Every block type declares its OWN motion identity (header variant + body /
   item reveal profiles). No two block types share a reveal language. */
export function PageBlock({ block, accent }) {
  switch (block.type) {
    case 'split':
      return (
        <Shell block={block} accent={accent}>
          <div className={clsx('grid', 'grid--split', styles.split)}>
            <div>
              <SectionHeader eyebrow={block.eyebrow} title={block.title} code={block.code} size="h1" variant="left" />
              <RevealGroup profile="slideLeft" className={clsx('stack', 'stack-4', styles.splitBody)} stagger={0.12}>
                {block.body?.map((p) => (
                  <p key={p} className="body">{p}</p>
                ))}
              </RevealGroup>
            </div>
            <Reveal profile="diagonalSlice" as="div" className={styles.splitAside}>
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
            </Reveal>
          </div>
        </Shell>
      );

    case 'cards':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="depth" />
          <RevealGroup profile="dataMaterialize" className={clsx('grid', 'grid--auto', styles.grid)} itemClassName={styles.cardCell} stagger={0.08}>
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
          </RevealGroup>
        </Shell>
      );

    case 'process':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="scan" />
          <RevealGroup profile="stepActivate" as="ol" itemAs="li" className={styles.process} itemClassName={styles.step} stagger={0.12}>
            {block.steps.map((s, i) => (
              <Fragment key={s.title}>
                <span className={styles.stepNum}>{s.step}</span>
                {i < block.steps.length - 1 && <span className={styles.stepLine} aria-hidden="true" />}
                <h3 className={clsx('heading-3', styles.stepTitle)}>{s.title}</h3>
                <p className="body-sm">{s.body}</p>
              </Fragment>
            ))}
          </RevealGroup>
        </Shell>
      );

    case 'modules':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="right" />
          {block.groups?.length > 0 && (
            <RevealGroup profile="hexCellForm" className={clsx('grid', 'grid--3', styles.grid)} itemClassName={styles.cardCell} stagger={0.09}>
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
            </RevealGroup>
          )}
          {block.rows?.length > 0 && (
            <RevealGroup profile="redactedUnlock" as="dl" className={styles.kvWide} stagger={0.07}>
              {block.rows.map((r) => (
                <div key={r.k} className={styles.kvWideRow}>
                  <dt className={clsx('mono', styles.kvKey)}>{r.k}</dt>
                  <dd className={styles.kvVal}>{r.v}</dd>
                </div>
              ))}
            </RevealGroup>
          )}
        </Shell>
      );

    case 'stats':
      return (
        <Shell block={block} accent={accent}>
          {(block.eyebrow || block.title) && (
            <SectionHeader eyebrow={block.eyebrow} title={block.title} size="h2" variant="split" />
          )}
          <GlitchLine className={styles.statLine} />
          <RevealGroup profile="countRise" className={clsx(styles.stats)} stagger={0.08}>
            {block.items.map((m) => (
              <StatBlock key={m.label} value={m.value} suffix={m.suffix} decimals={Number.isInteger(m.value) ? 0 : 1} label={m.label} note={m.note} />
            ))}
          </RevealGroup>
        </Shell>
      );

    case 'manifesto':
      return (
        <Shell block={block} accent={accent} className={styles.manifesto}>
          {block.eyebrow && (
            <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.manifestoEyebrow)}>
              {block.eyebrow}
            </Reveal>
          )}
          <div className={styles.manifestoLines}>
            {block.lines.map((line, i) =>
              i === 0 ? (
                <KineticText key={line} as="p" by="word" text={line} className={clsx('display', styles.manifestoLead)} />
              ) : (
                <Reveal key={line} profile={i % 2 ? 'maskUp' : 'curtainSplit'} as="p" className={clsx('heading-1', 'font-serif', styles.manifestoLine)}>
                  {line}
                </Reveal>
              )
            )}
          </div>
          {block.marquee?.length > 0 && <MarqueeRail items={block.marquee} speed={42} className={styles.manifestoRail} />}
        </Shell>
      );

    case 'feature':
      return (
        <Shell block={block} accent={accent}>
          {/* "into reality" assembly for the featured-system block */}
          <Reveal profile="realityAssemble">
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
                <RevealGroup profile="nodeSequence" as="dl" className={styles.featureModules} stagger={0.08} delayChildren={0.3}>
                  {block.modules.map((m) => (
                    <div key={m.k} className={styles.kvRow}>
                      <dt className={clsx('mono', styles.kvKey)}>{m.k}</dt>
                      <dd className={styles.kvVal}>{m.v}</dd>
                    </div>
                  ))}
                </RevealGroup>
              </div>
            </DataPanel>
          </Reveal>
        </Shell>
      );

    case 'redacted':
      return (
        <Shell block={block} accent={accent}>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="left" />
          <RevealGroup profile="redactedUnlock" as="ul" itemAs="li" className={clsx('grid', 'grid--auto', styles.grid)} itemClassName={styles.redactedItem} stagger={0.1}>
            {block.items.map((it, i) => (
              <DataPanel key={it.code} tone="redacted" code={it.code} interactive>
                <div className={clsx('cluster', styles.redactedHead)}>
                  <RedactedTag label="CLASSIFIED" lock />
                  {i === 0 && <Pill variant="red">RESTRICTED</Pill>}
                </div>
                <RedactionReveal as="p" label="DECRYPTING" className={styles.redactedLabel}>
                  {it.label}
                </RedactionReveal>
                <span className={clsx('mono', styles.redactedNote)}>{it.note}</span>
              </DataPanel>
            ))}
          </RevealGroup>
        </Shell>
      );

    case 'cta':
      return (
        <SectionScene scene={block.scene || 'signal-wave'} intensity="medium" accent={accent} className={clsx('section', styles.cta)}>
          <div className={clsx('container', styles.ctaInner)}>
            <SectionHeader eyebrow={block.eyebrow || 'Open a channel'} title={block.title || 'Compose an inquiry.'} align="center" size="hero" variant="depth" />
            <Reveal profile="zoomThrough" as="div" delay={0.1} className={clsx('stack', 'stack-6', styles.ctaBody)}>
              <p className={clsx('lead', styles.ctaLead)}>{block.body || 'For software systems, internal platforms, operational interfaces, and controlled online infrastructure.'}</p>
              <a href="mailto:contact@hanoryx.com" className={clsx('font-serif', styles.ctaEmail)}>contact@hanoryx.com</a>
              <div className={clsx('cluster', styles.ctaActions)}>
                <Button href="mailto:contact@hanoryx.com" variant="primary" icon={ArrowUpRight}>Email Hanoryx</Button>
                <Button to="/contact" variant="outline">Contact page</Button>
              </div>
            </Reveal>
          </div>
        </SectionScene>
      );

    default:
      return null;
  }
}

export default PageBlock;
