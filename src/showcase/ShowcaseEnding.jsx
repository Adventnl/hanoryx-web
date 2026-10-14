import { useContext } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StageApiContext, pad2 } from './hooks';
import { chapterById, showcasePages, showcasePath } from './pages';
import { fx } from '../utils/fx';
import styles from './ShowcaseEnding.module.css';

/* The page's last screen: the specimens filed by name (each one takes you back
   to it) and the two pages either side of this one in the showcase. */
export function ShowcaseEnding({ meta, items, sheet }) {
  const { jump } = useContext(StageApiContext);
  const at = showcasePages.findIndex((p) => p.slug === meta.slug);
  const prev = showcasePages[at - 1];
  const next = showcasePages[at + 1];
  const chapter = chapterById(meta.chapter);

  return (
    <section className={styles.end} aria-label={`End of ${meta.title}`} {...fx('showcase.ending')}>
      <div className={clsx('container', styles.inner)}>
        <div className={styles.head}>
          <span className="eyebrow">End of {meta.title}</span>
          <h2 className="heading-2">{items.length} specimens, filed.</h2>
          <p className={styles.lede}>
            Every part of this page is a component of its own, framed and labelled like a museum drawer.
            {sheet ? ' Pick any name to find it on the sheet.' : ' Pick any name to scroll back to it.'}
          </p>
        </div>

        <ol className={styles.index} {...fx('showcase.ending-index')}>
          {items.map(([name], i) => (
            <li key={name}>
              <button type="button" className={styles.chip} onClick={() => (sheet ? document.getElementById(`${meta.slug}-${i + 1}`)?.scrollIntoView({ block: 'center' }) : jump(i))}>
                <span>{pad2(i + 1)}</span>{name}
              </button>
            </li>
          ))}
        </ol>

        <nav className={styles.nav} aria-label="More of the showcase">
          {prev ? (
            <Link to={showcasePath(prev.slug)} className={clsx(styles.step, styles.prev)} data-cursor="link">
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.stepKey}>Previous</span>
              <span className={styles.stepName}>{prev.title}</span>
              <span className={styles.stepLine}>{prev.line}</span>
            </Link>
          ) : <span />}
          <Link to="/showcase" className={styles.all} data-cursor="link">
            <span className={styles.stepKey}>{chapter.code} {chapter.title}</span>
            <span className={styles.stepName}>All {showcasePages.length} pages</span>
          </Link>
          {next ? (
            <Link to={showcasePath(next.slug)} className={clsx(styles.step, styles.next)} data-cursor="link">
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.stepKey}>Next</span>
              <span className={styles.stepName}>{next.title}</span>
              <span className={styles.stepLine}>{next.line}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </section>
  );
}

export default ShowcaseEnding;
