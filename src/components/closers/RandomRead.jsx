import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Dices } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePageCatalog } from '../../hooks/usePageCatalog';
import { CatalogError } from '../ui/CatalogError';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './RandomRead.module.css';

/** Can't choose? A reel of the guide titles spins and lands on one. It is a
 *  dice with manners: it never lands on the same one twice in a row. */
export default function RandomRead({ tag, title, lede, keys = [], onward }) {
  const reduced = usePrefersReducedMotion();
  const { catalog: pages, error, retry } = usePageCatalog();
  const [spin, setSpin] = useState({ at: 0, n: 0, going: false });
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const list = keys.map((k) => ({ key: k, name: pages?.[k]?.title || k, line: pages?.[k]?.heroTitle || '' }));
  const roll = () => {
    if (!list.length || spin.going) return;
    let next = Math.floor(Math.random() * list.length);
    if (next === spin.at && list.length > 1) next = (next + 1) % list.length;
    setSpin((s) => ({ at: next, n: s.n + 1, going: !reduced }));
    timer.current = window.setTimeout(() => setSpin((s) => ({ ...s, going: false })), 1500);
  };
  const lap = list.length * 3;
  const final = spin.n ? lap + spin.at : spin.at;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      {error && <CatalogError retry={retry} />}
      <div className={styles.rig} {...fx('randomread.reel')}>
        <div className={styles.window}>
          <ol key={spin.n} className={styles.reel} style={{ '--final': final, '--going': spin.n && !reduced ? 1 : 0 }} aria-hidden="true">
            {[...list, ...list, ...list, ...list].map((it, i) => <li key={i}>{it.name}</li>)}
          </ol>
          <span className={styles.pointer} aria-hidden="true" />
        </div>
        <div className={styles.out} role="status" aria-live="polite">
          {spin.n > 0 && !spin.going && list[spin.at] ? (
            <>
              <p className={shared.label}>Your read</p>
              <p className={styles.name}>{list[spin.at].name}</p>
              <p className={styles.line}>{list[spin.at].line}</p>
              <Link to={`/${list[spin.at].key}`} className={styles.go} data-cursor="link">Read it <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </>
          ) : (
            <p className={styles.wait}>{spin.going ? 'Spinning…' : 'Spin for one.'}</p>
          )}
        </div>
        <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={roll} disabled={error || spin.going || !list.length} {...fx('randomread.spin')}><Dices size={14} aria-hidden="true" /> Spin</button>
      </div>
    </CloserFrame>
  );
}
