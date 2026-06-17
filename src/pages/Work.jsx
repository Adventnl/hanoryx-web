import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/ui/PageHero';
import { ProjectCodex } from '../components/sections/ProjectCodex';
import { UnknownSystems } from '../components/sections/UnknownSystems';
import { MetricsBand } from '../components/sections/MetricsBand';
import { ContactSection } from '../components/sections/ContactSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * Work — a record of systems, some withheld. Cinematic hero into the project
 * codex, the redacted unknown-systems register, the metrics band, and a closing
 * contact CTA. Pure composition of the existing section library.
 */
export function Work() {
  useDocumentTitle('Work');

  return (
    <PageTransition>
      <PageHero
        eyebrow="Work // WRK.NODE"
        title="A record of systems. Some withheld."
        intro="Selected work across commerce, management platforms, internal consoles, and classified research."
        code="NODE.WORK"
        status="LIVE"
      />

      <ProjectCodex />
      <UnknownSystems />
      <MetricsBand />
      <ContactSection variant="cta" />
    </PageTransition>
  );
}

export default Work;
