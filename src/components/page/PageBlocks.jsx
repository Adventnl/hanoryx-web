import { SplitBlock } from './blocks/SplitBlock';
import { CardsBlock } from './blocks/CardsBlock';
import { ProcessBlock } from './blocks/ProcessBlock';
import { ModulesBlock } from './blocks/ModulesBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { ManifestoBlock } from './blocks/ManifestoBlock';
import { CtaBlock } from './blocks/CtaBlock';
import { SignatureBlock } from './blocks/SignatureBlock';

const BLOCKS = {
  split: SplitBlock,
  cards: CardsBlock,
  process: ProcessBlock,
  modules: ModulesBlock,
  stats: StatsBlock,
  manifesto: ManifestoBlock,
  cta: CtaBlock,
  signature: SignatureBlock,
};

/* Block dispatcher. Every block type declares its OWN motion identity; the
   `signature` type hosts a page-specific interactive composition. */
export function PageBlock({ block, accent }) {
  const Block = BLOCKS[block.type];
  return Block ? <Block block={block} accent={accent} /> : null;
}

export { PageHero as PageHeroBlock } from './Hero';
export default PageBlock;
