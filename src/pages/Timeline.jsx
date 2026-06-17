import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/ui/PageHero';
import { TimelineSection } from '../components/sections/TimelineSection';
import { UnknownSystems } from '../components/sections/UnknownSystems';
import { ContactSection } from '../components/sections/ContactSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * Timeline — the program roadmap, read as a forward-looking sequence of nodes
 * rather than a corporate history. Cinematic hero, the full node timeline, a
 * band of withheld/unknown systems, then a closing contact CTA.
 */
export default function Timeline() {
  useDocumentTitle('Timeline');

  return (
    <PageTransition>
      <PageHero
        eyebrow="Roadmap // TIME.NODE"
        title="A system roadmap, not a history."
        intro="From the first commerce layer to unannounced programs — revealed only as far as each phase is ready to be seen."
        code="NODE.TIME"
        status="STREAMING"
      />

      <TimelineSection variant="full" />
      <UnknownSystems />
      <ContactSection variant="cta" />
    </PageTransition>
  );
}
