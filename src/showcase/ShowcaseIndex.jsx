import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, Shuffle } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionScene } from '../components/scenes/SectionScene';
import { HeroTitle } from '../components/page/HeroTitle';
import { Reveal } from '@/animation/reveal/Reveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLenis } from '../app/providers/lenis-context';
import { Schematic } from './Schematic';
import { MIN_SPECIMENS, chapters, engines, pagesIn, showcasePages, showcasePath } from './pages';
import { pad2 } from './hooks';
import { fx } from '../utils/fx';
import './showcase.css';
import styles from './ShowcaseIndex.module.css';

const TICKS = showcasePages.length;
const STEP = 360 / TICKS;

/** The mosaic: one small tile per page, a column per chapter. */
function Mosaic() {
  return (
    <div className={styles.mosaic} {...fx('showcase.mosaic')}>
      {chapters.map((c) => (
        <div key={c.id} className={styles.mosaicCol}>
          <span className={styles.mosaicHead} aria-hidden="true">{c.code}</span>
          {pagesIn(c.id).map((p) => {
            const n = showcasePages.indexOf(p) + 1;
            return (
              <Link key={p.slug} to={showcasePath(p.slug)} className={styles.tile} data-cursor="link" aria-label={`${p.title}, page ${n}`}>
                <span className={styles.tileNo}>{pad2(n)}</span>
                <span className={styles.tileName}>{p.title}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** The pinned dial: fifty ticks, one per page; the chapter being read sits at the top and lights. */
function Dial({ active }) {
  const c = chapters[active];
  return (
    <div className={styles.dial} style={{ '--c': active }} {...fx('showcase.chapter-dial')}>
      <svg viewBox="0 0 200 200" className={styles.dialSvg} aria-hidden="true">
        <g className={styles.dialRotor}>
          {Array.from({ length: TICKS }, (_, i) => {
            const a = ((i * STEP + STEP / 2) * Math.PI) / 180;
            const on = Math.floor(i / 5) === active;
            const r1 = i % 5 === 0 ? 78 : 83;
            return <line key={i} className={on ? styles.tickOn : styles.tick} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 94} y2={100 - Math.cos(a) * 94} />;
          })}
        </g>
        <circle className={styles.ringA} cx="100" cy="100" r="70" />
        <circle className={styles.ringB} cx="100" cy="100" r="56" />
        <path className={styles.pointer} d="M100 4 L96 14 H104 Z" />
      </svg>
      <div className={styles.dialCore}>
        <span className={styles.dialCode}>{c.code} / {pad2(chapters.length)}</span>
        <span className={styles.dialTitle}>{c.title}</span>
        <span className={styles.dialBlurb}>{c.blurb}</span>
      </div>
    </div>
  );
}

/**
 * /showcase — the index of the showcase. An opening screen with a mosaic of every
 * page; then the pages by chapter beside a pinned dial that turns to the chapter
 * being read; then the fourteen stages, each with the pages that use it.
 */
export default function ShowcaseIndex() {
  useDocumentTitle('Showcase', `${showcasePages.length} scroll-driven pages of components for their own sake, in ${chapters.length} chapters.`);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Which chapter is in the middle of the screen.
  useEffect(() => {
    const nodes = Array.from(listRef.current?.querySelectorAll('[data-chapter]') || []);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.chapter)); }),
      { rootMargin: '-46% 0px -46% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // /showcase#controls lands on that chapter (after the route settles, so the scroll reset does not undo it).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return undefined;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [lenis]);

  const stageUse = useMemo(
    () => Object.entries(engines).map(([id, e]) => ({ id, ...e, pages: showcasePages.filter((p) => p.engine === id) })),
    []
  );
  const surprise = () => navigate(showcasePath(showcasePages[Math.floor(Math.random() * showcasePages.length)].slug));

  return (
    <PageTransition>
      <SectionScene scene="home-core" intensity="high" className={styles.hero} contentClassName={styles.heroContent}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.copy}>
            <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.eyebrow)} {...fx('showcase.index-eyebrow')}>Showcase / index</Reveal>
            <HeroTitle text="Showcase" className={clsx('heading-hero', styles.title)} {...fx('showcase.index-title')} />
            <Reveal profile="slideLeft" as="p" delay={0.18} className={styles.line}>
              {showcasePages.length} pages of components for their own sake. Nothing to read; a great deal to touch.
            </Reveal>
            <Reveal profile="depthRise" as="dl" delay={0.28} className={styles.facts}>
              <div><dt>Pages</dt><dd>{showcasePages.length}</dd></div>
              <div><dt>Specimens</dt><dd>{(showcasePages.length * MIN_SPECIMENS).toLocaleString('en-US')}+</dd></div>
              <div><dt>Stages</dt><dd>{Object.keys(engines).length}</dd></div>
              <div><dt>Chapters</dt><dd>{chapters.length}</dd></div>
            </Reveal>
            <Reveal profile="depthRise" as="p" delay={0.36} className={styles.note}>
              Each page is a stage the scroll drives: a still side that moves with you, and at least forty specimens beside it.
              Every specimen is a component shown on its own; sample content is illustrative.
            </Reveal>
            <Reveal profile="depthRise" as="div" delay={0.42} className={clsx('cluster', styles.actions)}>
              <button type="button" className={styles.surprise} onClick={surprise} {...fx('showcase.surprise')}>
                <Shuffle size={15} strokeWidth={1.5} aria-hidden="true" /> Surprise me
              </button>
              <a href="#chapters" className={styles.skip} onClick={(e) => { e.preventDefault(); lenis.scrollTo(document.getElementById('chapters'), { offset: -80 }); }}>Read the list</a>
            </Reveal>
          </div>
          <Mosaic />
        </div>
        <div className={styles.cue} aria-hidden="true"><span>Scroll</span><i /></div>
      </SectionScene>

      <section id="chapters" className={styles.chapters} aria-label="The showcase by chapter" data-frame="plate">
        <div className={styles.stageGrid}>
          <aside className={styles.dialSide}>
            <div className={styles.dialSticky}><Dial active={active} /></div>
          </aside>
          <div ref={listRef} className={styles.list}>
            {chapters.map((c, ci) => (
              <section key={c.id} id={c.id} data-chapter={ci} className={styles.chapter} aria-labelledby={`h-${c.id}`}>
                <header className={styles.chapterHead}>
                  <span className={styles.chapterNo}>{c.code}</span>
                  <h2 id={`h-${c.id}`} className={styles.chapterTitle}>{c.title}</h2>
                  <p className={styles.chapterBlurb}>{c.blurb}</p>
                </header>
                <ol className={styles.rows}>
                  {pagesIn(c.id).map((p) => {
                    const n = showcasePages.indexOf(p) + 1;
                    return (
                      <li key={p.slug}>
                        <Link to={showcasePath(p.slug)} className={styles.row} data-cursor="link" {...fx(`showcase.row-${p.slug}`)}>
                          <span className={styles.rowNo}>{pad2(n)}</span>
                          <span className={styles.rowBody}>
                            <span className={styles.rowTitle}>{p.title}</span>
                            <span className={styles.rowLine}>{p.line}</span>
                          </span>
                          <span className={styles.rowStage}>
                            <Schematic engine={p.engine} className={styles.rowSvg} />
                            <span>{engines[p.engine].label}</span>
                          </span>
                          <ArrowUpRight className={styles.rowArrow} size={18} strokeWidth={1.4} aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.legend} aria-label="End of the showcase index" {...fx('showcase.stage-legend')}>
        <div className={clsx('container', styles.legendInner)}>
          <div className={styles.legendHead}>
            <span className="eyebrow">End of the index</span>
            <h2 className="heading-2">{stageUse.length} ways to move.</h2>
            <p className={styles.legendLede}>Every page borrows one of these stages. The same specimens can be seen on another stage by adding <code>?stage=</code> and its name to any page, or all at once with <code>?view=sheet</code>.</p>
          </div>
          <ul className={styles.stages}>
            {stageUse.map((e) => (
              <li key={e.id} className={styles.stageCard}>
                <Schematic engine={e.id} className={styles.stageSvg} />
                <h3 className={styles.stageName}>{e.label}</h3>
                <p className={styles.stageHint}>{e.hint}</p>
                <p className={styles.stagePages}>
                  {e.pages.map((p, i) => (
                    <span key={p.slug}><Link to={showcasePath(p.slug)} data-cursor="link">{p.title}</Link>{i < e.pages.length - 1 ? ', ' : ''}</span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
