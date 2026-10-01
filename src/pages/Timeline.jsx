import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeroBlock } from '../components/page/PageBlocks';
import { TimelineSection } from '@/features/timeline/TimelineSection';

const ACCENT = '#ff3333';

const hero = {
  scene: 'timeline-pulse',
  intensity: 'hero',
  eyebrow: 'Hanoryx Systems / Public chronology',
  title: 'The public development record.',
  intro:
    'Repository creation dates and descriptions from public source. Follow any project to inspect its GitHub record.',
  code: 'GH.TIME',
  status: 'PUBLIC DATA',
  actions: [{ label: 'Explore projects', to: '/projects' }],
};

export default function Timeline() {
  useDocumentTitle('Timeline');
  return (
    <PageTransition>
      <PageHeroBlock hero={hero} accent={ACCENT} />
      <TimelineSection variant="full" />
    </PageTransition>
  );
}
