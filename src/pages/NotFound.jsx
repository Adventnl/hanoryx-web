import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { KineticText } from '../components/animation/KineticText';
import { SceneCanvas } from '../components/scenes/SceneCanvas';
import { GlitchLine } from '../components/ui/GlitchLine';
import { Button } from '../components/ui/Button';
import styles from './NotFound.module.css';

// Static telemetry rows — pure presentation, never exported.
const telemetry = [
  { k: 'TRACE', v: '0x00 — NO ROUTE' },
  { k: 'NODE', v: 'UNRESOLVED' },
  { k: 'STATUS', v: 'SIGNAL DROPPED' },
];

/**
 * Cinematic 404 — "Signal Lost". A full-height stage with the system grid
 * drifting behind, a redacted/scanline mood, and a kinetic display headline.
 */
export default function NotFound() {
  useDocumentTitle('Signal Lost');

  return (
    <PageTransition>
      <section className={clsx('stage', 'scanlines', styles.stage)}>
        {/* Broken-signal field behind the content */}
        <div className={styles.bg} aria-hidden="true">
          <SceneCanvas scene="error-signal-lost" cost="high" />
        </div>
        <div className={styles.vignette} aria-hidden="true" />

        <div className={clsx('container', styles.inner)}>
          <div className={clsx('stack', 'stack-6', styles.core)}>
            <p className={clsx('mono', styles.eyebrow)}>ERR // 404</p>

            <KineticText
              as="h1"
              text="SIGNAL LOST"
              className={clsx('display', styles.title)}
              immediate
            />

            <p className={clsx('lead', 'measure', styles.intro)}>
              The requested node is unreachable or does not exist.
            </p>

            <GlitchLine tone="red" className={styles.rule} />

            <div className={clsx('cluster', styles.actions)}>
              <Button to="/" variant="primary" icon={ArrowLeft}>
                Return to base
              </Button>
            </div>
          </div>

          {/* Quiet diagnostic readout — reinforces the "lost signal" frame */}
          <ul className={clsx('mono', styles.telemetry)} aria-hidden="true">
            {telemetry.map((row) => (
              <li key={row.k} className={styles.row}>
                <span className={styles.key}>{row.k}</span>
                <span className={styles.dots} />
                <span className={styles.val}>{row.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}

export { NotFound };
