import { Suspense, lazy } from 'react';
import { SplitBlock } from './blocks/SplitBlock';
import { CardsBlock } from './blocks/CardsBlock';
import { ProcessBlock } from './blocks/ProcessBlock';
import { ModulesBlock } from './blocks/ModulesBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { ManifestoBlock } from './blocks/ManifestoBlock';
import { SignatureBlock } from './blocks/SignatureBlock';
import { CloserBlock } from './blocks/CloserBlock';

/* The blocks built for this site, each with a motion identity of its own. */
const BLOCKS = {
  split: SplitBlock,
  cards: CardsBlock,
  process: ProcessBlock,
  modules: ModulesBlock,
  stats: StatsBlock,
  manifesto: ManifestoBlock,
  signature: SignatureBlock,
  closer: CloserBlock,
};

/* The data-first blocks, made from the interface kit. Each is its own chunk, so a page
   downloads only the kinds it uses. The full list, with the data each one takes, is
   data/blockTypes.js (and the north/blocks page). */
const DATA_BLOCKS = {
  callout: lazy(() => import('./blocks/CalloutBlock')),
  table: lazy(() => import('./blocks/TableBlock')),
  timeline: lazy(() => import('./blocks/TimelineBlock')),
  faq: lazy(() => import('./blocks/FaqBlock')),
  compare: lazy(() => import('./blocks/CompareBlock')),
  snippet: lazy(() => import('./blocks/SnippetBlock')),
  tabs: lazy(() => import('./blocks/TabsBlock')),
  quote: lazy(() => import('./blocks/QuoteBlock')),
  checklist: lazy(() => import('./blocks/ChecklistBlock')),
  facts: lazy(() => import('./blocks/FactsBlock')),
  links: lazy(() => import('./blocks/LinksBlock')),
  numbers: lazy(() => import('./blocks/NumbersBlock')),
};

/* Block dispatcher. Every block type declares its OWN motion identity; the
   `signature` type hosts a page-specific interactive composition. */
export function PageBlock({ block, accent }) {
  const Block = BLOCKS[block.type];
  if (Block) return <Block block={block} accent={accent} />;
  const DataBlock = DATA_BLOCKS[block.type];
  return DataBlock ? (
    <Suspense fallback={<div style={{ minHeight: 260 }} />}>
      <DataBlock block={block} accent={accent} />
    </Suspense>
  ) : null;
}

export { PageHero as PageHeroBlock } from './Hero';
export default PageBlock;
