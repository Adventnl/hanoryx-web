import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { loadAllPages } from '../../data/pages';
import { routePath } from '../../app/routeConfig';
import { buildDocument, search } from '../../features/search/searchEngine';
import { fx } from '../../utils/fx';
import styles from './AskTheSite.module.css';

function Marked({ text, ranges }) {
  if (!ranges?.length) return text;
  const out = [];
  let last = 0;
  ranges.forEach(([a, b], i) => {
    if (a > last) out.push(text.slice(last, a));
    out.push(<mark key={i}>{text.slice(a, b)}</mark>);
    last = b;
  });
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Ask the whole site a question. It searches every page's title and text with
 *  the same engine as ⌘K and lays the best answers out here, with the sentence
 *  that matched. If the answer is not on the site, it says so. */
export default function AskTheSite({ tag, title, lede, examples = [], onward }) {
  const [docs, setDocs] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let live = true;
    loadAllPages().then((all) => { if (live) setDocs(Object.values(all).map((p) => buildDocument(p, p.path || routePath(p.key)))); });
    return () => { live = false; };
  }, []);

  const results = useMemo(() => (docs && q.trim().length > 1 ? search(docs, q, { limit: 4 }) : []), [docs, q]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.ask} {...fx('askthesite.field')}>
        <label className={styles.field}>
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Ask the site a question</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask in a word or two — “cookies”, “idempotency”, “hiring”…" spellCheck={false} autoComplete="off" />
        </label>
        {examples.length > 0 && (
          <p className={styles.eg}>Try: {examples.map((e) => <button key={e} type="button" onClick={() => setQ(e)}>{e}</button>)}</p>
        )}
        <ul className={styles.results} aria-live="polite" {...fx('askthesite.answers')}>
          {results.map((r, i) => (
            <li key={r.doc.to} style={{ '--i': i }}>
              <Link to={r.doc.to} className={styles.hit} data-cursor="link">
                <span className={styles.sec}>{r.doc.section}</span>
                <strong><Marked text={r.doc.title} ranges={r.titleRanges} /></strong>
                {r.excerpt && <span className={styles.ex}>{r.excerpt.truncatedStart && '… '}<Marked text={r.excerpt.text} ranges={r.excerpt.ranges} />{r.excerpt.truncatedEnd && ' …'}</span>}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
          {docs && q.trim().length > 1 && results.length === 0 && <li className={styles.none}>Nothing on the site mentions that. Try one word instead of a sentence.</li>}
        </ul>
      </div>
    </CloserFrame>
  );
}
