import clsx from 'clsx';
import { SectionScene } from '../components/scenes/SectionScene';
import { HeroTitle } from '../components/page/HeroTitle';
import { Button } from '../components/ui/Button';
import { Reveal } from '@/animation/reveal/Reveal';
import { Schematic } from './Schematic';
import { chapterById, engines, showcasePages } from './pages';
import { pad2 } from './hooks';
import { fx } from '../utils/fx';
import styles from './ShowcaseIntro.module.css';

/**
 * The opening screen of a showcase page: a Canvas scene behind the page's name,
 * what it holds (how many specimens, how it moves, how they are framed), a
 * small diagram of the stage, and a way to see every specimen at once.
 */
export function ShowcaseIntro({ meta, no, count, sheet, onToggleSheet }) {
  const chapter = chapterById(meta.chapter);
  const stage = engines[meta.engine];
  return (
    <SectionScene scene={meta.scene} intensity="high" className={styles.intro} contentClassName={styles.content}>
      <div className={clsx('container', styles.inner)}>
        <div className={styles.copy}>
          <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.eyebrow)} {...fx('showcase.intro-eyebrow')}>
            Showcase / {chapter.code} {chapter.title}
          </Reveal>
          <HeroTitle text={meta.title} className={clsx('heading-hero', styles.title)} {...fx('showcase.intro-title')} />
          <Reveal profile="slideLeft" as="p" delay={0.18} className={clsx('lead', styles.line)}>{meta.line}</Reveal>

          <Reveal profile="depthRise" as="dl" delay={0.28} className={styles.facts} {...fx('showcase.intro-facts')}>
            <div><dt>Specimens</dt><dd>{count}</dd></div>
            <div><dt>Stage</dt><dd>{stage.label}</dd></div>
            <div><dt>Frame</dt><dd>{meta.frame}</dd></div>
            <div><dt>Page</dt><dd>{pad2(no)} / {showcasePages.length}</dd></div>
          </Reveal>

          <Reveal profile="depthRise" as="p" delay={0.36} className={styles.note}>
            {stage.hint} Specimens are components shown for their own sake; sample content is illustrative.
          </Reveal>

          <Reveal profile="depthRise" as="div" delay={0.42} className={clsx('cluster', styles.actions)}>
            <Button to="/showcase" variant="outline">All pages</Button>
            <button type="button" className={styles.toggle} onClick={onToggleSheet} aria-pressed={sheet} {...fx('showcase.sheet-toggle')}>
              {sheet ? 'Back to the stage' : 'View as a sheet'}
            </button>
          </Reveal>
        </div>

        <div className={styles.diagram} {...fx('showcase.intro-schematic')}>
          <Schematic engine={sheet ? 'sheet' : meta.engine} />
          <span className={styles.caption}>{sheet ? 'Sheet' : stage.label}</span>
        </div>
      </div>

      <div className={styles.cue} aria-hidden="true">
        <span className={styles.cueLabel}>Scroll</span>
        <span className={styles.cueLine}><span className={styles.cueDot} /></span>
      </div>
    </SectionScene>
  );
}

export default ShowcaseIntro;
