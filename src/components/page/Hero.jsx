import { Suspense } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { SectionScene } from '../scenes/SectionScene';
import { Button } from '../ui/Button';
import { Reveal } from '@/animation/reveal/Reveal';
import { useExperience } from '../../app/providers/experience-context';
import { HeroTitle } from './HeroTitle';
import { asideRegistry } from '../signatures/registry';
import { fx } from '../../utils/fx';
import styles from './Hero.module.css';

const STATUS_FALLBACK = 'LIVE';

/**
 * Hero: scene-backed full-screen stage with the pointer-reactive headline and,
 * when the page declares `hero.aside`, a signature object in the right half
 * (an orbit navigator, a plate stack, a miniature editor…). The aside is
 * code-split and reserves its space so it never shifts the layout.
 */
export function PageHero({ hero, accent }) {
  const { openSynthesis } = useExperience();
  const Aside = hero.aside ? asideRegistry[hero.aside.kind] : null;

  return (
    <SectionScene
      scene={hero.scene}
      sceneData={hero.sceneData}
      intensity={hero.intensity || 'hero'}
      accent={accent}
      className={styles.hero}
    >
      <div className={clsx('container', styles.inner, Aside && styles.hasAside)}>
        <div className={styles.copy}>
          {hero.eyebrow && (
            <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.eyebrow)} {...fx('hero.eyebrow-scan')}>
              {hero.eyebrow}
            </Reveal>
          )}
          <HeroTitle text={hero.title} className={clsx('heading-hero', styles.title)} {...fx('hero.pointer-title')} />
          {hero.intro && (
            <Reveal profile="slideLeft" as="p" delay={0.18} className={clsx('lead', styles.intro)}>
              {hero.intro}
            </Reveal>
          )}
          {hero.actions?.length > 0 && (
            <Reveal profile="depthRise" as="div" delay={0.3} className={clsx('cluster', styles.actions)}>
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
        </div>

        {Aside && (
          <div className={styles.aside} {...fx(`hero.aside-${hero.aside.kind}`)}>
            <Suspense fallback={<div className={styles.asideHold} />}>
              <Aside {...hero.aside} />
            </Suspense>
          </div>
        )}
      </div>

      <div className={styles.cue} aria-hidden="true" {...fx('hero.scroll-cue')}>
        <span className={styles.cueLabel}>Scroll</span>
        <span className={styles.cueLine}><span className={styles.cueDot} /></span>
      </div>
      <div className={styles.telemetry} aria-hidden="true">
        <span className="mono">{hero.code}</span>
        <span className={styles.dot} />
        <span className="mono">{hero.status || STATUS_FALLBACK}</span>
      </div>
    </SectionScene>
  );
}

export default PageHero;
