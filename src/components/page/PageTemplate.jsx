import { useMemo } from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PageHero } from './Hero';
import { PageBlock } from './PageBlocks';
import { ScrollRail } from '../fx/ScrollRail';

/**
 * Renders a full page from a data object: a scene-backed hero followed by an
 * ordered list of blocks. Blocks that declare `anchor` + `railLabel` also feed
 * the page's scroll rail. Distinct scene + accent + content + block ordering per
 * page give every route its own identity while the data stays plain.
 */
export function PageTemplate({ data }) {
  useDocumentTitle(data.title, data.hero?.intro);
  const accent = data.accent || '#ff3333';
  const rail = useMemo(
    () => (data.blocks || []).filter((b) => b.anchor && b.railLabel).map((b) => ({ id: b.anchor, label: b.railLabel })),
    [data.blocks]
  );

  return (
    <PageTransition>
      <PageHero hero={data.hero} accent={accent} />
      {data.blocks?.map((block, i) => (
        <PageBlock key={`${block.type}-${i}`} block={block} accent={accent} />
      ))}
      <ScrollRail sections={rail} />
    </PageTransition>
  );
}

export default PageTemplate;
