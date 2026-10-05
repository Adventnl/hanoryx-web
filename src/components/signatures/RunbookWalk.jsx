import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { RotateCcw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import styles from './RunbookWalk.module.css';

const WPM = 180; // someone woken up reads slowly

/**
 * The same incident, two runbooks. One explains the system; the other starts
 * from the symptom. Walk either: every block you read adds the time it takes to
 * read (counted from its actual words), until you reach the first step that
 * does something.
 *
 *   versions: [{ id, label, blocks: [{ id, kind: 'context'|'action'|'decision', text }] }]
 */
export default function RunbookWalk({ eyebrow, title, intro, incident, versions = [], note }) {
  const [vid, setVid] = useState(versions[0].id);
  const [at, setAt] = useState(0);
  const v = versions.find((x) => x.id === vid);
  const blocks = v.blocks;
  const seconds = useMemo(() => blocks.slice(0, at).reduce((s, b) => s + (b.text.split(/\s+/).length / WPM) * 60, 0), [blocks, at]);
  const firstAction = blocks.findIndex((b) => b.kind === 'action');
  const reached = at > firstAction;
  const totalToFirst = useMemo(() => blocks.slice(0, firstAction + 1).reduce((s, b) => s + (b.text.split(/\s+/).length / WPM) * 60, 0), [blocks, firstAction]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('runbook.rig')}>
        <div className={styles.incident} {...fx('runbook.pager')}>
          <span className={styles.pager}>03:12</span>
          <p>{incident}</p>
        </div>
        <div className={styles.row}>
          <GlideTabs panels={false} label="Which runbook" idPrefix="rb" value={vid} onChange={(id) => { setVid(id); setAt(0); }} tabs={versions.map((x) => ({ id: x.id, label: x.label }))} />
          <button type="button" className={styles.reset} onClick={() => setAt(0)}><RotateCcw size={13} aria-hidden="true" /> Start again</button>
        </div>
        <div className={styles.cols}>
          <ol className={styles.doc} {...fx('runbook.document')}>
            {blocks.map((b, i) => (
              <li key={b.id} className={clsx(styles.block, styles[b.kind], i < at && styles.read, i === at && styles.cur)}>
                <span className={styles.kind}>{b.kind}</span>
                <span className={styles.text}>{b.text}</span>
              </li>
            ))}
          </ol>
          <div className={styles.side}>
            <div className={styles.clock} role="status" aria-live="polite" {...fx('runbook.clock')}>
              <p className={styles.k}>Time spent reading</p>
              <p className={styles.big}>{Math.round(seconds)}<small> s</small></p>
              <p className={styles.small}>{reached ? `You did something after ${Math.round(totalToFirst)} s of reading.` : `The first block that tells you to do something is block ${firstAction + 1} of ${blocks.length} — about ${Math.round(totalToFirst)} s away.`}</p>
            </div>
            <button type="button" className={styles.next} onClick={() => setAt((a) => Math.min(blocks.length, a + 1))} disabled={at >= blocks.length}>Read the next block</button>
          </div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
