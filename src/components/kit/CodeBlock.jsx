import { useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopy } from '../../hooks/useCopy';
import { highlight } from './highlight';
import styles from './data.module.css';

/**
 * A block of code with an optional file name, light colouring and a copy button.
 * The colours are a nicety: every token is also plain text, so copying gives you
 * exactly what you see, and the block is a focusable region so a keyboard user
 * can scroll a long line. `lines` adds line numbers.
 */
export default function CodeBlock({ code, language = 'js', filename, lines = false, className }) {
  const [copied, copy] = useCopy();
  const tokens = useMemo(() => highlight(code, language), [code, language]);
  const parts = useMemo(() => {
    // number the lines without breaking tokens that span them
    if (!lines) return tokens.map((t, i) => ({ ...t, key: i }));
    let n = 1;
    const out = [{ type: 'ln', text: String(n), key: 'l1' }];
    tokens.forEach((t, i) => {
      t.text.split(/(\n)/).forEach((piece, j) => {
        if (piece === '\n') { n += 1; out.push({ type: 'plain', text: '\n', key: `${i}-${j}` }, { type: 'ln', text: String(n), key: `l${n}` }); }
        else if (piece) out.push({ type: t.type, text: piece, key: `${i}-${j}` });
      });
    });
    return out;
  }, [tokens, lines]);

  return (
    <figure className={`${styles.code} ${className || ''}`} style={{ margin: 0 }}>
      <figcaption className={styles.codeHead}>
        <span>{filename || language}</span>
        <button type="button" className={styles.copy} onClick={() => copy(code)}>
          {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre className={styles.pre} tabIndex={0} aria-label={filename ? `Code: ${filename}` : 'Code'}>
        <code>
          {parts.map((t) => (t.type === 'ln' ? <span key={t.key} className={styles.ln} aria-hidden="true">{t.text}</span> : <span key={t.key} className={t.type === 'plain' ? undefined : styles[`t-${t.type}`]}>{t.text}</span>))}
        </code>
      </pre>
    </figure>
  );
}
