import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { downloadText } from '../../utils/clipboard';
import { fontLicences, licences } from '../../data/licences';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './NoticeFile.module.css';

const pad = (s, n) => String(s).padEnd(n, ' ');

function build() {
  const list = (items) => items.map((p) => `${pad(p.name, 28)}${pad(p.version || '', 10)}${p.licence}`).join('\n');
  return [
    'HANORYX SYSTEMS — OPEN-SOURCE AND THIRD-PARTY NOTICES',
    '',
    'This website is built with the libraries and typefaces below. Each remains',
    'under the licence its authors chose; the licence text is in each package’s',
    'own repository. Versions are those the site was built with.',
    '',
    'IN THE SITE',
    list(licences.filter((p) => p.kind === 'runtime')),
    '',
    'USED TO BUILD AND TEST IT (NOT SHIPPED TO VISITORS)',
    list(licences.filter((p) => p.kind === 'build')),
    '',
    'TYPEFACES (DELIVERED BY GOOGLE FONTS)',
    list(fontLicences),
    '',
  ].join('\n');
}

/** The notices page's ending: the whole list as a plain NOTICE file you can read
 *  here, copy, or download. Built on the spot from the same data as the table. */
export default function NoticeFile({ tag, title, lede, onward }) {
  const text = build();
  const [copied, copy] = useCopy();
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.file} {...fx('notice.file')}>
        <div className={styles.bar}>
          <span>NOTICE.txt</span>
          <span>{text.split('\n').length} lines</span>
        </div>
        <pre tabIndex={0}><code>{text}</code></pre>
      </div>
      <div className={shared.row}>
        <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('NOTICE.txt', text)} {...fx('notice.download')}><Download size={14} aria-hidden="true" /> Download NOTICE.txt</button>
        <button type="button" className={shared.btn} onClick={() => copy(text)}>{copied ? 'Copied' : 'Copy the text'}</button>
      </div>
    </CloserFrame>
  );
}
