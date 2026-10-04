import { useState } from 'react';
import clsx from 'clsx';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import { DataPanel } from '../../ui/DataPanel';
import { ScrollWords } from '../../fx/ScrollWords';
import { ScrambleText } from '../../fx/ScrambleText';
import { TiltSurface } from '../../fx/TiltSurface';
import { Reveal, RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

/* One key/value row: the key decodes (scrambles) when the pointer or focus
   arrives, the row lights and the value nudges toward the key. */
function PointRow({ point }) {
  const [pulse, setPulse] = useState(0);
  return (
    <div
      className={styles.pointRow}
      tabIndex={0}
      onPointerEnter={() => setPulse((p) => p + 1)}
      onFocus={() => setPulse((p) => p + 1)}
    >
      <ScrambleText as="dt" text={point.k} trigger={pulse} className={clsx('mono', styles.pointKey)} />
      <dd className={styles.pointVal}>{point.v}</dd>
    </div>
  );
}

/** Text left (lead paragraph lights word-by-word with scroll), a leaning
 *  key/value panel right whose rows decode on hover. */
export function SplitBlock({ block, accent }) {
  const [lead, ...rest] = block.body || [];
  return (
    <Shell block={block} accent={accent}>
      <div className={clsx('grid', 'grid--split', styles.split)}>
        <div>
          <SectionHeader eyebrow={block.eyebrow} title={block.title} code={block.code} size="h1" variant="left" />
          <div className={clsx('stack', 'stack-5', styles.splitBody)}>
            {lead && <ScrollWords text={lead} className={styles.lead} {...fx('split.scroll-words')} />}
            <RevealGroup profile="slideLeft" className={clsx('stack', 'stack-4')} stagger={0.12}>
              {rest.map((p) => (
                <p key={p} className="body">{p}</p>
              ))}
            </RevealGroup>
          </div>
        </div>
        <Reveal profile="depthRise" as="div" className={styles.splitAside}>
          <TiltSurface tilt={4} {...fx('split.tilt-panel')}>
            <DataPanel label={block.asideLabel || 'PARAMETERS'} code={block.asideCode || 'P.01'}>
              {block.points?.length > 0 ? (
                <dl className={styles.points} {...fx('split.decode-rows')}>
                  {block.points.map((pt) => (
                    <PointRow key={pt.k} point={pt} />
                  ))}
                </dl>
              ) : (
                <p className="body-sm">{block.asideBody}</p>
              )}
            </DataPanel>
          </TiltSurface>
        </Reveal>
      </div>
    </Shell>
  );
}

export default SplitBlock;
