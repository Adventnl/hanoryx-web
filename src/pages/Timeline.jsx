import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeroBlock, PageBlock } from '../components/page/PageBlocks';
import { TimelineSection } from '@/features/timeline/TimelineSection';

const ACCENT = '#ff3333';

const hero = {
  scene: 'redacted-timeline-branch',
  intensity: 'hero',
  eyebrow: 'Roadmap // TIME.NODE',
  title: 'A system roadmap, not a history.',
  intro:
    'From the first commerce layer to unannounced programs — revealed only as far as each phase is ready to be seen.',
  code: 'NODE.TIME',
  status: 'STREAMING',
};

const futures = {
  type: 'redacted',
  scene: 'research-blackout',
  eyebrow: 'Future Branches',
  title: 'Unannounced interface programs.',
  intro: 'Beyond the active roadmap, several system branches remain classified.',
  items: [
    { code: 'BRANCH.A', label: 'Classified system branch', note: 'Architecture in progress' },
    { code: 'BRANCH.B', label: 'Unannounced interface program', note: 'Surface withheld' },
    { code: 'BRANCH.C', label: 'Redacted research node', note: 'Access scoped' },
  ],
};

const cta = { type: 'cta', scene: 'contact-transmission', eyebrow: 'Open a channel', title: 'Request roadmap context.' };

export default function Timeline() {
  useDocumentTitle('Timeline');
  return (
    <PageTransition>
      <PageHeroBlock hero={hero} accent={ACCENT} />
      <TimelineSection variant="full" />
      <PageBlock block={futures} accent={ACCENT} />
      <PageBlock block={cta} accent={ACCENT} />
    </PageTransition>
  );
}
