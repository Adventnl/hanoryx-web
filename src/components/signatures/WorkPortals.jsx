import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { MiniEngine } from './MiniEngine';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../utils/fx';
import { workItems } from '../../data/work';
import styles from './WorkPortals.module.css';

const primary = workItems.filter((w) => w.tier === 'primary');
const supporting = workItems.filter((w) => w.tier === 'supporting');

/* Art for each primary project. Plates echo Musebase's own mark (stacked
   planes); the engine portal runs a miniature 2D scene. */
function Art({ id }) {
  if (id === 'musebase') {
    return (
      <div className={styles.plates} aria-hidden="true">
        <span className={styles.plate} style={{ '--n': 2 }} />
        <span className={styles.plate} style={{ '--n': 1 }} />
        <span className={styles.plate} style={{ '--n': 0 }} />
      </div>
    );
  }
  return <MiniEngine className={styles.engine} />;
}

function Portal({ item, index }) {
  return (
    <Link to={item.to} className={clsx('glyph-host', styles.portal)} data-cursor="card" {...fx(`work.portal-${item.id}`)}>
      <Art id={item.id} />
      <span className={styles.portalShade} aria-hidden="true" />
      <span className={styles.portalTop}>
        <span className={styles.kicker}>{String(index + 1).padStart(2, '0')} / Primary project</span>
        <Glyph name={item.glyph} size={30} className={styles.portalGlyph} />
      </span>
      <span className={styles.portalBody}>
        <span className={styles.portalKind}>{item.kind}</span>
        <span className={styles.portalName}>{item.name}</span>
        <span className={styles.portalTag}>{item.tagline}</span>
        <span className={styles.portalCta}>
          <span>Open case study</span>
          <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

function SupportRow({ item }) {
  return (
    <Link to={item.to} className={clsx('glyph-host', styles.support)} {...fx(`work.support-${item.id}`)}>
      <Glyph name={item.glyph} size={28} className={styles.supportGlyph} />
      <span className={styles.supportMain}>
        <span className={styles.supportKind}>{item.kind}</span>
        <ScrambleText as="span" text={item.name} auto className={styles.supportName} />
        <span className={styles.supportLine}>{item.summary}</span>
      </span>
      <span className={styles.supportGo}>
        Supporting study <ArrowUpRight size={15} strokeWidth={1.4} aria-hidden="true" />
      </span>
    </Link>
  );
}

/**
 * Selected work, composed as portals. Two primary projects sit side by side as
 * big panels; hover or focus one and it widens while the other gives way
 * (flex-grow eases, nothing jumps), its art moves (plates fan out; the
 * miniature scene speeds up). Two quieter supporting studies sit below as
 * slim rows. Stacks vertically on small screens.
 */
export default function WorkPortals({ eyebrow, title, intro, supportingLabel }) {
  return (
    <>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="depth" />
      <Reveal profile="dataMaterialize" as="div" className={styles.portals} {...fx('work.portal-expand')}>
        {primary.map((item, i) => (
          <Portal key={item.id} item={item} index={i} />
        ))}
      </Reveal>
      <div className={styles.supportHead}>
        <span className={styles.supportLabel}>{supportingLabel || 'Supporting studies'}</span>
        <span className={styles.supportRule} aria-hidden="true" />
      </div>
      <Reveal profile="slideLeft" as="div" className={styles.supports}>
        {supporting.map((item) => (
          <SupportRow key={item.id} item={item} />
        ))}
      </Reveal>
    </>
  );
}
