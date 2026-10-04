import clsx from 'clsx';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import { Odometer } from '../../fx/Odometer';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

/** Large rolling-odometer figures. Only figures a page can stand behind belong
 *  here (counts of what is on the site, not performance claims). */
export function StatsBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      {(block.eyebrow || block.title) && (
        <SectionHeader eyebrow={block.eyebrow} title={block.title} size="h2" variant="split" />
      )}
      <RevealGroup profile="countRise" className={styles.stats} stagger={0.1} {...fx('stats.odometer')}>
        {block.items.map((m) => (
          <div key={m.label} className={styles.stat}>
            <span className={clsx('ghost-numeral', styles.statGhost)} aria-hidden="true">{String(m.value).padStart(2, '0')}</span>
            <span className={styles.statValue}>
              <Odometer value={m.value} decimals={m.decimals || 0} prefix={m.prefix || ''} suffix={m.suffix || ''} />
            </span>
            <span className={styles.statLabel}>{m.label}</span>
            {m.note && <span className={styles.statNote}>{m.note}</span>}
          </div>
        ))}
      </RevealGroup>
    </Shell>
  );
}

export default StatsBlock;
