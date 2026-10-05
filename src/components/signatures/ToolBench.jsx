import { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../fx/SpotlightCard';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { tools } from '../../data/resources';
import { fx } from '../../utils/fx';
import styles from './ToolBench.module.css';

/** The five browser tools, each with what it does and what it never does. Every
 *  one runs in the page: no account, no upload, nothing kept. */
export default function ToolBench({ eyebrow, title, intro, note }) {
  const [area, setArea] = useState('All');
  const areas = ['All', ...new Set(tools.map((t) => t.area))];
  const shown = tools.filter((t) => area === 'All' || t.area === area);
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('tools.bench')}>
        <div className={styles.chips} role="group" aria-label="Kind of tool">
          {areas.map((a) => <button key={a} type="button" className={clsx(styles.chip, area === a && styles.on)} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>)}
        </div>
        <RevealGroup key={area} profile="dataMaterialize" className={styles.grid} itemClassName={styles.cell} stagger={0.07}>
          {shown.map((t, i) => (
            <SpotlightCard key={t.id} to={t.to} className={styles.cardWrap} innerClassName={styles.card} {...fx('tools.card')}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.area}>{t.area}</span>
              <h3 className={styles.name}>{t.title}</h3>
              <p className={styles.blurb}>{t.blurb}</p>
              <p className={styles.never}><ShieldCheck size={14} aria-hidden="true" /><span>{t.never}</span></p>
              <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.4} aria-hidden="true" />
            </SpotlightCard>
          ))}
        </RevealGroup>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
