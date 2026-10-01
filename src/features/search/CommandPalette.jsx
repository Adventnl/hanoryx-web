import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchSite } from './searchIndex';
import styles from './CommandPalette.module.css';

export function CommandPalette() {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    const open = () => {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hanoryx:search', open);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('hanoryx:search', open); };
  }, []);

  const choose = (item) => {
    dialogRef.current?.close();
    navigate(item.to);
  };
  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, Math.max(0, results.length - 1))); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); choose(results[active]); }
  };

  return <dialog ref={dialogRef} className={styles.dialog} aria-label="Search Hanoryx Systems" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
    <div className={styles.panel} onKeyDown={onKeyDown}>
      <div className={styles.inputWrap}><Search size={20} aria-hidden="true" /><label className={styles.srOnly} htmlFor={`${listId}-input`}>Search pages and public projects</label><input id={`${listId}-input`} ref={inputRef} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={listId} aria-activedescendant={results[active] ? `${listId}-result-${active}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="Search pages and public projects" autoComplete="off" /><button type="button" className={styles.close} aria-label="Close search" onClick={() => dialogRef.current?.close()}><X size={20} aria-hidden="true" /></button></div>
      <div id={listId} className={styles.results} role="listbox" aria-label="Search results">
        {results.length ? results.map((item, index) => <button id={`${listId}-result-${index}`} type="button" role="option" aria-selected={active === index} key={item.id} onMouseEnter={() => setActive(index)} onClick={() => choose(item)}><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className={styles.arrow}>↗</span></button>) : <p className={styles.empty}>No matching pages or public projects.</p>}
      </div>
      <div className={styles.hint}><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></div>
    </div>
  </dialog>;
}
