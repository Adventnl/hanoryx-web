import { ArrowUpRight } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { SystemSynthesisExperience } from '../components/experience/SystemSynthesisExperience';
import styles from './SystemSynthesis.module.css';

/**
 * /experience/system-synthesis — the dedicated home for the 20-second pure-code
 * cinematic. A normal scrolling route (never traps scroll), with the sequence
 * stage, a short brief, and a way back into the site.
 */
export default function SystemSynthesis() {
  useDocumentTitle('System Synthesis');

  return (
    <PageTransition>
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Experience // SYS.SYNTH"
            title="System Synthesis"
            intro="A twenty-second, pure-code cinematic — no video, no pre-render. React, GSAP, and a single procedural canvas assemble the Hanoryx Systems identity in real time."
            size="hero"
          />

          <div className={styles.stageWrap}>
            <SystemSynthesisExperience />
          </div>

          <div className={styles.brief}>
            <p className="body-sm">
              The sequence runs through eleven phases — from a black-start core ignition, through grid
              construction, fragment assembly, the Hanoryx North activation, systems expansion, the
              project timeline pull, interface convergence, and the signal wall — before everything
              compresses into the system identity and releases.
            </p>
            <div className="cluster">
              <Button to="/" variant="outline">Return home</Button>
              <Button to="/systems" variant="primary" icon={ArrowUpRight}>Enter systems</Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
