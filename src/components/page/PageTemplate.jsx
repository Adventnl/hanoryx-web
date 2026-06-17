import { PageTransition } from '../layout/PageTransition';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PageHeroBlock, PageBlock } from './PageBlocks';

/**
 * Renders a full page from a data object: a scene-backed hero followed by an
 * ordered list of scene-backed blocks. Distinct scene + accent + content +
 * block ordering per page give every route its own visual identity while the
 * rendering stays consistent and maintainable.
 */
export function PageTemplate({ data }) {
  useDocumentTitle(data.title);
  const accent = data.accent || '#ff3333';

  return (
    <PageTransition>
      <PageHeroBlock hero={data.hero} accent={accent} />
      {data.blocks?.map((block, i) => (
        <PageBlock key={`${block.type}-${i}`} block={block} accent={accent} />
      ))}
    </PageTransition>
  );
}

export default PageTemplate;
