import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import CodeBlock from '../../kit/CodeBlock';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A piece of code or data with a file name, light colouring and a copy button.
 * Every token is also plain text, and the block is a focusable region, so a long
 * line can be scrolled from the keyboard.
 *
 *   { type: 'snippet', code, language?: 'js'|'json'|'css'|'sh'..., filename?, lines?, notes?: [string],
 *     eyebrow?, title?, intro? }
 */
export function SnippetBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.snippet} {...fx('snippet.code')}>
        <CodeBlock code={block.code} language={block.language} filename={block.filename} lines={Boolean(block.lines)} />
      </Reveal>
      {block.notes?.length > 0 && <ul className={styles.snippetNotes}>{block.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
    </Shell>
  );
}

export default SnippetBlock;
