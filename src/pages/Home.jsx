import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeroBlock, PageBlock } from '../components/page/PageBlocks';
import { TimelineSection } from '@/features/timeline/TimelineSection';
import { systemCategories } from '../data/systems';
import { manifesto } from '../data/company';
import { publicMetrics } from '../data/publicMetrics';
import { PublicWorkPreview } from '../components/projects/PublicWorkPreview';

const ACCENT = '#ff3333';

const hero = {
  scene: 'home-core',
  intensity: 'hero',
  eyebrow: 'Hanoryx Systems / Software engineering',
  title: 'Software systems, made visible.',
  intro:
    'We build software platforms and interfaces. Explore the systems behind the work, and inspect public code from the people building it.',
  code: 'SYS.CORE',
  status: 'HANORYX SYSTEMS',
  actions: [
    { label: 'Explore public work', to: '/projects' },
    { label: 'Play System Sequence', action: 'system-synthesis', variant: 'outline' },
    { label: 'Open a channel', to: '/contact', variant: 'outline' },
  ],
};

const signal = {
  type: 'split',
  scene: 'signal-spectrum-field',
  intensity: 'high',
  eyebrow: 'Company Signal',
  code: 'SIG.01',
  title: 'A controlled environment for serious operations.',
  body: [
    'Hanoryx Systems develops online systems, internal platforms, and digital operating environments for teams that need structure, speed, and control.',
    'The work sits between software engineering, interface design, automation, and operational architecture — built quietly, released deliberately.',
  ],
  asideLabel: 'DISCIPLINES',
  asideCode: 'SIG.02',
  points: [
    { k: 'ENGINEERING', v: 'Applied software' },
    { k: 'INTERFACE', v: 'Systems, not screens' },
    { k: 'AUTOMATION', v: 'Operational logic' },
    { k: 'ARCHITECTURE', v: 'Built to expand' },
  ],
};

const stats = {
  type: 'stats',
  scene: 'status-pulse-grid',
  intensity: 'low',
  eyebrow: '// Public development',
  items: publicMetrics.map((m) => ({ value: m.value, suffix: m.suffix, label: m.label, note: m.note })),
};

const systems = {
  type: 'cards',
  scene: 'hex-tunnel',
  intensity: 'high',
  eyebrow: 'Systems',
  title: 'We build systems that reduce operational drag.',
  intro:
    'Management layers, commerce infrastructure, automation, dashboards, data interfaces, and client-facing portals.',
  items: systemCategories.slice(0, 6).map((c) => ({
    code: c.code,
    title: c.title,
    body: c.summary,
    tags: c.tags,
    status: c.status,
    to: '/systems',
  })),
};

const north = {
  type: 'split',
  scene: 'dependency-graph',
  eyebrow: 'Hanoryx North',
  code: 'NTH.00',
  title: 'The engineering division behind Hanoryx Systems.',
  body: [
    'North focuses on platform architecture, interface systems, operational tools, and production-minded software development.',
    'A single, tightly-scoped engineering surface held under one design language.',
  ],
  asideLabel: 'DIVISION',
  asideCode: 'NTH.MAP',
  points: [
    { k: 'N.ARCH', v: 'Platform architecture' },
    { k: 'N.IFACE', v: 'Interface systems' },
    { k: 'N.ORCH', v: 'Orchestration' },
    { k: 'N.PROTO', v: 'Prototyping' },
  ],
};

const doctrine = {
  type: 'manifesto',
  scene: 'topology-pulse',
  eyebrow: manifesto.eyebrow,
  lines: manifesto.lines,
  marquee: ['SYSTEMS', 'INTERFACES', 'ORCHESTRATION', 'AUTOMATION', 'CONTROL', 'ARCHITECTURE', 'TELEMETRY'],
};

const contactCta = {
  type: 'cta',
  scene: 'contact-transmission',
  eyebrow: 'Open a channel',
  title: 'Compose an inquiry.',
  body: 'For software systems, internal platforms, operational interfaces, and controlled online infrastructure.',
};

/** Home — the cinematic entry. A scene-per-block experience with the boot,
 *  cursor, nav, audio, hero, and eight distinct section scenes. */
export default function Home() {
  useDocumentTitle('Online Systems');

  return (
    <PageTransition>
      <PageHeroBlock hero={hero} accent={ACCENT} />
      <PageBlock block={signal} accent={ACCENT} />
      <PageBlock block={stats} accent={ACCENT} />
      <PublicWorkPreview />
      <PageBlock block={systems} accent={ACCENT} />
      <PageBlock block={north} accent={ACCENT} />
      <TimelineSection variant="preview" />
      <PageBlock block={doctrine} accent={ACCENT} />
      <PageBlock block={contactCta} accent={ACCENT} />
    </PageTransition>
  );
}
