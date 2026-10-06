import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { downloadText } from '../../utils/clipboard';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PagerCard.module.css';

/** A one-page runbook template, laid out as a card. Read it here, copy it, or
 *  download it as Markdown and fill it in for a real service. */
export default function PagerCard({ tag, title, lede, sections = [], onward }) {
  const [copied, copy] = useCopy();
  const md = ['# Runbook: <the symptom, in the words of the person who sees it>', '', ...sections.flatMap((s) => [`## ${s.name}`, s.hint, '', ...s.lines.map((l) => `- [ ] ${l}`), ''])].join('\n');
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.card} data-print="doc" {...fx('pager.card')}>
        <header><span>RUNBOOK</span><b>&lt;the symptom, as the person who sees it would say it&gt;</b></header>
        <div className={styles.grid}>
          {sections.map((s, i) => (
            <section key={s.name}>
              <h3><span>{String(i + 1).padStart(2, '0')}</span>{s.name}</h3>
              <p>{s.hint}</p>
              <ul>{s.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            </section>
          ))}
        </div>
      </div>
      <div className={shared.row}>
        <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('runbook-template.md', md, 'text/markdown')} {...fx('pager.download')}><Download size={14} aria-hidden="true" /> Download the template</button>
        <button type="button" className={shared.btn} onClick={() => copy(md)}>{copied ? 'Copied' : 'Copy as Markdown'}</button>
      </div>
    </CloserFrame>
  );
}
