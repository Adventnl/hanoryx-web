import PageTransition from '../components/layout/PageTransition';
import PageHero from '../components/ui/PageHero';
import { SystemsPreview } from '../components/sections/SystemsPreview';
import { ArchitectureShowcase } from '../components/sections/ArchitectureShowcase';
import { UnknownSystems } from '../components/sections/UnknownSystems';
import { ContactSection } from '../components/sections/ContactSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Systems.module.css';

/**
 * Systems — the operating environment overview. Composes the full systems
 * showcase, the layered architecture breakdown, the withheld/redacted systems
 * rail, and a closing contact CTA beneath a cinematic page header.
 */
export default function Systems() {
  useDocumentTitle('Systems');

  return (
    <PageTransition className={styles.page}>
      <PageHero
        eyebrow="Systems // SYS.NODE"
        title="Systems built to reduce operational drag."
        intro="Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals — engineered as one operating environment."
        code="NODE.SYS"
        status="ONLINE"
      />

      <SystemsPreview variant="full" />
      <ArchitectureShowcase />
      <UnknownSystems />
      <ContactSection variant="cta" />
    </PageTransition>
  );
}
