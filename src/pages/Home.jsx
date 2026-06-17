import { PageTransition } from "../components/layout/PageTransition";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

import { HeroSystem } from "../components/sections/HeroSystem";
import { CompanySignal } from "../components/sections/CompanySignal";
import { MetricsBand } from "../components/sections/MetricsBand";
import { HanoryxNorthPreview } from "../components/sections/HanoryxNorth";
import { SystemsPreview } from "../components/sections/SystemsPreview";
import { CapabilitiesMatrix } from "../components/sections/CapabilitiesMatrix";
import { TimelineSection } from "../components/sections/TimelineSection";
import { ManifestoPanel } from "../components/sections/ManifestoPanel";
import { ContactSection } from "../components/sections/ContactSection";

// Home — thin composition of the system sections. Each section owns its layout,
// data, and motion; this page only orders the narrative.
export default function Home() {
  useDocumentTitle("Online Systems");

  return (
    <PageTransition>
      <HeroSystem />
      <CompanySignal />
      <MetricsBand />
      <HanoryxNorthPreview />
      <SystemsPreview variant="preview" />
      <CapabilitiesMatrix />
      <TimelineSection variant="preview" />
      <ManifestoPanel />
      <ContactSection variant="cta" />
    </PageTransition>
  );
}
