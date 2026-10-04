import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import clsx from 'clsx';
import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { KineticText } from '@/animation/reveal/KineticText';
import { SceneCanvas } from '../components/scenes/SceneCanvas';
import { GlitchLine } from '../components/ui/GlitchLine';
import { Button } from '../components/ui/Button';
import { ScrambleText } from '../components/fx/ScrambleText';
import { ProximityText } from '../components/fx/ProximityText';
import { directory } from '../app/routeConfig';
import { fx } from '../utils/fx';
import styles from './NotFound.module.css';

/* Small edit distance, enough to rank "/work/muzebase" next to "/work/musebase". */
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

const FLAT = directory.flatMap((col) => col.links.map((l) => ({ ...l, group: col.title })));

/**
 * "Signal lost". The page that does not exist echoes the address that was asked
 * for, then lists the real pages nearest to it — ranked by how close the
 * spelling is — whose names answer the pointer as it passes. A search button
 * and a way home sit underneath.
 */
export default function NotFound() {
  useDocumentTitle('Signal Lost');
  const { pathname } = useLocation();

  const nearest = useMemo(() => {
    const asked = pathname.toLowerCase().replace(/\/+$/, '') || '/';
    return [...FLAT]
      .map((l) => ({ ...l, score: distance(asked, l.to) - (l.to.split('/')[1] === asked.split('/')[1] ? 3 : 0) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 4);
  }, [pathname]);

  return (
    <PageTransition>
      <section className={clsx('stage', 'scanlines', styles.stage)}>
        <div className={styles.bg} aria-hidden="true">
          <SceneCanvas scene="error-signal-lost" cost="high" />
        </div>
        <div className={styles.vignette} aria-hidden="true" />

        <div className={clsx('container', styles.inner)}>
          <div className={clsx('stack', 'stack-6', styles.core)}>
            <p className={clsx('mono', styles.eyebrow)}>ERR // 404</p>

            <KineticText as="h1" text="SIGNAL LOST" className={clsx('display', styles.title)} immediate />

            <p className={clsx('lead', 'measure', styles.intro)}>
              Nothing lives at{' '}
              <ScrambleText text={pathname.length > 38 ? `${pathname.slice(0, 36)}…` : pathname} auto className={styles.asked} />
            </p>

            <GlitchLine tone="red" className={styles.rule} />

            <div className={styles.near} {...fx('notfound.nearest-pages')}>
              <span className={styles.nearLabel}>The nearest real pages</span>
              <ul>
                {nearest.map((l, i) => (
                  <li key={l.to} style={{ '--i': i }}>
                    <Link to={l.to} className={styles.nearLink} data-cursor="link">
                      <span className={styles.nearGroup}>{l.group}</span>
                      <ProximityText text={l.label} as="span" className={styles.nearName} radius={160} />
                      <ArrowUpRight size={15} strokeWidth={1.4} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={clsx('cluster', styles.actions)}>
              <Button to="/" variant="primary" icon={ArrowLeft}>Return to base</Button>
              <button type="button" className={styles.searchButton} onClick={() => window.dispatchEvent(new Event('hanoryx:search'))} data-cursor="link">
                <Search size={14} aria-hidden="true" /> Search the site
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export { NotFound };
