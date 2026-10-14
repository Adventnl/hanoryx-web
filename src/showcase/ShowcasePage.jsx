import { use, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import NotFound from '../pages/NotFound';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { StageApiContext } from './hooks';
import { loadShowcase } from './loader';
import { engines, pageBySlug, showcaseNumber } from './pages';
import { ShowcaseIntro } from './ShowcaseIntro';
import { ShowcaseEnding } from './ShowcaseEnding';
import { Stage } from './stages/engines';
import './showcase.css';

/* One showcase page: its opening screen, its stage, its ending. The page's own
   code (a visual and its specimens) is a separate chunk, read with use() so the
   route waits on the shell's fallback until it has arrived. */
function ShowcaseBody({ meta, mod }) {
  const [params, setParams] = useSearchParams();
  const sheet = params.get('view') === 'sheet';
  // ?stage=<engine> lets a visitor try the same specimens on another stage.
  const asked = params.get('stage');
  const stage = engines[asked] ? asked : meta.engine;
  const no = showcaseNumber(meta.slug);
  const items = mod.items;

  useDocumentTitle(`${meta.title} — Showcase`, `${meta.line} ${items.length} specimens. ${engines[meta.engine].hint}`);

  // The ending sends the stage back to a specimen: the stage registers how.
  const jumpTo = useRef(() => {});
  const api = useMemo(() => ({ register: (fn) => { jumpTo.current = fn; }, jump: (i) => jumpTo.current(i) }), []);

  const toggleSheet = () => setParams(sheet ? {} : { view: 'sheet' }, { replace: true });

  return (
    <StageApiContext.Provider value={api}>
      <PageTransition>
        <ShowcaseIntro meta={meta} no={no} count={items.length} sheet={sheet} onToggleSheet={toggleSheet} />
        <Stage meta={meta} no={no} Visual={mod.Visual} items={items} view={sheet ? 'sheet' : stage} />
        <ShowcaseEnding meta={meta} items={items} sheet={sheet} />
      </PageTransition>
    </StageApiContext.Provider>
  );
}

function Loaded({ meta }) {
  const mod = use(loadShowcase(meta.slug));
  return mod ? <ShowcaseBody meta={meta} mod={mod} /> : <NotFound />;
}

export default function ShowcasePage() {
  const { slug } = useParams();
  const meta = pageBySlug(slug);
  return meta ? <Loaded key={meta.slug} meta={meta} /> : <NotFound />;
}
