import { useMemo } from 'react';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Tabs from '../../kit/Tabs';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * Several short views of one subject, one at a time. The arrow keys move between
 * the tabs and show the panel at once. Keep each panel short; if a reader needs
 * to compare the views, use a table instead.
 *
 *   { type: 'tabs', label, tabs: [{ id, label, body: [string], list?: [string] }], eyebrow?, title?, intro? }
 */
export function TabsBlock({ block, accent }) {
  const tabs = useMemo(
    () => block.tabs.map((t) => ({
      id: t.id,
      label: t.label,
      content: (
        <div className={styles.pane}>
          {t.body?.map((p) => <p key={p}>{p}</p>)}
          {t.list?.length > 0 && <ul>{t.list.map((li) => <li key={li}>{li}</li>)}</ul>}
        </div>
      ),
    })),
    [block.tabs],
  );
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.tabsWrap} {...fx('tabs.views')}>
        <Tabs tabs={tabs} label={block.label || block.title} />
      </Reveal>
    </Shell>
  );
}

export default TabsBlock;
