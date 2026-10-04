import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import { Pill } from '../../ui/Pill';
import { SpotlightCard } from '../../fx/SpotlightCard';
import { Glyph } from '../../fx/Glyph';
import { DragRail } from '../../fx/DragRail';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

const FALLBACK_GLYPHS = ['node', 'layers', 'flow', 'grid', 'wave', 'stack', 'loop', 'lens'];

function CardItem({ item, index, glyphs }) {
  const glyph = item.glyph || glyphs[index % glyphs.length];
  return (
    <SpotlightCard to={item.to} className={clsx('glyph-host', styles.cardWrap)} innerClassName={styles.card}>
      <span className={styles.cardTop}>
        <span className={styles.cardCode}>{item.code || String(index + 1).padStart(2, '0')}</span>
        <Glyph name={glyph} size={34} className={styles.cardGlyph} />
      </span>
      {item.label && <span className={styles.cardLabel}>{item.label}</span>}
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardBody}>{item.body}</p>
      {(item.tags?.length > 0 || item.status || item.to) && (
        <span className={styles.cardFoot}>
          <span className={styles.cardTags}>
            {item.tags?.map((t) => <Pill key={t} variant="ghost">{t}</Pill>)}
          </span>
          {item.status && <span className={styles.cardStatus}>{item.status}</span>}
          {item.to && <ArrowUpRight className={styles.cardArrow} size={18} strokeWidth={1.4} aria-hidden="true" />}
        </span>
      )}
    </SpotlightCard>
  );
}

/** Pointer-lit spotlight cards, each with its own glyph that redraws on hover.
 *  `variant: 'rail'` turns the set into a grab-and-fling carousel; `'bento'`
 *  gives the first card double weight. */
export function CardsBlock({ block, accent }) {
  const glyphs = block.glyphs || FALLBACK_GLYPHS;
  const variant = block.variant || (block.items.length > 4 ? 'bento' : 'grid');
  const cards = block.items.map((item, i) => <CardItem key={item.title} item={item} index={i} glyphs={glyphs} />);
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="depth" />
      {variant === 'rail' ? (
        <div className={styles.railWrap} {...fx('cards.drag-rail')}>
          <DragRail label={block.title || 'Cards'}>{cards}</DragRail>
        </div>
      ) : (
        <RevealGroup
          profile="dataMaterialize"
          className={clsx(styles.cardGrid, variant === 'bento' && styles.bento)}
          itemClassName={styles.cardCell}
          stagger={0.08}
          {...fx(variant === 'bento' ? 'cards.bento-spotlight' : 'cards.spotlight-grid')}
        >
          {cards}
        </RevealGroup>
      )}
    </Shell>
  );
}

export default CardsBlock;
