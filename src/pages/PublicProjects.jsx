import { PageTransition } from '../components/layout/PageTransition';
import { PageHeroBlock } from '../components/page/PageBlocks';
import { ProjectExplorer } from '../components/projects/ProjectExplorer';
import { ProjectGraph } from '../components/projects/ProjectGraph';
import { TechnologyExplorer } from '../components/projects/TechnologyExplorer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { githubSnapshot, publicProjects } from '../data/publicProjects';
import styles from '../components/projects/projects.module.css';

const hero = {
  scene: 'public-repositories',
  sceneData: publicProjects.map((project) => ({ id: project.id, languages: project.languages.map((language) => language.name) })),
  eyebrow: 'Hanoryx Systems / Public development',
  title: 'Work with a source.',
  intro: 'A curated view of public code associated with the repository owner. Descriptions, languages, and dates come from public GitHub data.',
  code: 'GH.PUBLIC',
  status: 'PUBLIC DATA',
  actions: [{ label: 'Engineering', to: '/engineering', variant: 'outline' }],
};

export default function PublicProjects() {
  useDocumentTitle('Public Projects');
  return <PageTransition>
    <PageHeroBlock hero={hero} accent="#ff3333" />
    <div className={styles.snapshot}><span>{publicProjects.length} curated public repositories</span><span>Source: GitHub / {githubSnapshot.owner}</span><span>Snapshot: {new Date(githubSnapshot.generatedAt).toLocaleDateString('en', { dateStyle: 'medium' })}</span></div>
    <ProjectExplorer />
    <ProjectGraph />
    <TechnologyExplorer />
  </PageTransition>;
}
