import { useState } from 'react';
import clsx from 'clsx';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import { SpotlightCard } from '../../fx/SpotlightCard';
import { ScrambleText } from '../../fx/ScrambleText';
import { Reveal, RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

function Row({ row }) {
  const [pulse, setPulse] = useState(0);
  return (
    <div
      className={styles.modRow}
      tabIndex={0}
      onPointerEnter={() => setPulse((p) => p + 1)}
      onFocus={() => setPulse((p) => p + 1)}
    >
      <ScrambleText as="dt" text={row.k} trigger={pulse} className={clsx('mono', styles.modKey)} />
      <dd className={styles.modVal}>{row.v}</dd>
    </div>
  );
}

/** Groups: columns that "lens" — hover one and the others recede. Rows: a
 *  ledger where the hovered line lights, a rule draws under it, and its code
 *  decodes. */
export function ModulesBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="right" />
      {block.groups?.length > 0 && (
        <RevealGroup profile="hexCellForm" className={clsx('grid', 'grid--3', styles.lensGrid)} itemClassName={styles.cardCell} stagger={0.09} {...fx('modules.lens-columns')}>
          {block.groups.map((g) => (
            <SpotlightCard key={g.label} tone="white" className={styles.lensCard} innerClassName={styles.lensInner}>
              <span className={styles.lensLabel}>{g.label}</span>
              <ul className={styles.lensList}>
                {g.items.map((item) => (
                  <li key={item}>
                    <span className="node-dot" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </RevealGroup>
      )}
      {block.rows?.length > 0 && (
        <Reveal profile="redactedUnlock" as="dl" className={styles.ledger} {...fx('modules.ledger-rows')}>
          {block.rows.map((r) => (
            <Row key={r.k} row={r} />
          ))}
        </Reveal>
      )}
    </Shell>
  );
}

export default ModulesBlock;
