import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Copy } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePageCatalog } from '../../hooks/usePageCatalog';
import { CatalogError } from '../ui/CatalogError';
import { pageRouteKeys, routePath } from '../../app/routeConfig';
import { useCopy } from '../../hooks/useCopy';
import { SITE_ORIGIN } from '../../utils/constants';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LinkBuilder.module.css';

const FORMATS = [['html', 'HTML'], ['md', 'Markdown'], ['text', 'Plain text']];

/** Pick a page (and, for the long documents, a section) and a format; the link
 *  comes out written the way the linking policy asks: the page's own title as
 *  the text, the canonical address as the target. */
export default function LinkBuilder({ tag, title, lede, onward }) {
  const { catalog: pages, error, retry } = usePageCatalog();
  const [key, setKey] = useState('legal/privacy');
  const [section, setSection] = useState('');
  const [format, setFormat] = useState('html');
  const [copied, copy] = useCopy();

  const options = useMemo(() => (pages ? pageRouteKeys.filter((k) => pages[k]).map((k) => ({ key: k, title: pages[k].title })) : []), [pages]);
  const sections = useMemo(() => {
    return pages?.[key]?.sections || [];
  }, [pages, key]);

  const pageTitle = pages?.[key]?.title || key;
  const sec = sections.find((s) => s.id === section);
  const href = `${SITE_ORIGIN}${routePath(key)}${sec ? `#${sec.id}` : ''}`;
  const text = sec ? `${pageTitle} — ${sec.title}` : `${pageTitle} — Hanoryx Systems`;
  const out = format === 'html' ? `<a href="${href}">${text}</a>` : format === 'md' ? `[${text}](${href})` : `${text}: ${href}`;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      {error && <CatalogError retry={retry} />}
      <div className={styles.grid} {...fx('linking.builder')}>
        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={shared.label}>Page</span>
            <select value={key} onChange={(e) => { setKey(e.target.value); setSection(''); }} disabled={!pages}>
              {options.map((o) => <option key={o.key} value={o.key}>{o.title} — {routePath(o.key)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={shared.label}>Section</span>
            <select value={section} onChange={(e) => setSection(e.target.value)} disabled={sections.length === 0}>
              <option value="">{sections.length ? 'The whole page' : 'This page has no sections to link to'}</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </label>
          <div className={styles.field} role="radiogroup" aria-label="Format">
            <span className={shared.label}>Format</span>
            <div className={shared.row}>
              {FORMATS.map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={format === v} className={clsx(shared.btn, format === v && shared.btnOn)} onClick={() => setFormat(v)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className={clsx(shared.panel, styles.out)}>
          <p className={shared.label}>Your link</p>
          <pre className={styles.code} tabIndex={0}><code>{out}</code></pre>
          <p className={styles.preview}>Reads as: <a href={href} onClick={(e) => e.preventDefault()}>{text}</a></p>
          <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={() => copy(out)} disabled={!pages} {...fx('linking.copy')}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the link'}</button>
        </div>
      </div>
    </CloserFrame>
  );
}
