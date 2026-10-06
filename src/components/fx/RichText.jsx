import { Fragment, useId } from 'react';
import styles from './RichText.module.css';

/* Inline markup for copy that lives in plain data files:
     **bold**        `code`        {{defined term}}
   A {{term}} that has an entry in `terms` becomes a focusable word whose
   definition appears on hover or focus (and is announced as its description).
   `highlight` is a list of lowercase search words wrapped in <mark>. */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\{\{[^}]+\}\})/g;

function Marked({ text, highlight }) {
  if (!highlight?.length) return text;
  const escaped = highlight.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pieces = text.split(new RegExp(`(${escaped.join('|')})`, 'ig'));
  return pieces.map((piece, i) => (i % 2 === 1 ? <mark key={i} className={styles.mark}>{piece}</mark> : <Fragment key={i}>{piece}</Fragment>));
}

export function RichText({ text, terms, highlight }) {
  const uid = useId();
  if (typeof text !== 'string') return null;
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**')) return <strong key={i}><RichText text={part.slice(2, -2)} terms={terms} highlight={highlight} /></strong>; // a defined word can sit inside bold
    if (part.startsWith('`')) return <code key={i} className={styles.code}>{part.slice(1, -1)}</code>;
    if (part.startsWith('{{')) {
      const word = part.slice(2, -2);
      const def = terms?.[word] ?? terms?.[word.toLowerCase()];
      if (!def) return <Marked key={i} text={word} highlight={highlight} />;
      const id = `${uid}-t${i}`;
      return (
        <span key={i} className={styles.term} tabIndex={0} aria-describedby={id}>
          <Marked text={word} highlight={highlight} />
          <span role="tooltip" id={id} className={styles.tip}>{def}</span>
        </span>
      );
    }
    return <Marked key={i} text={part} highlight={highlight} />;
  });
}

export default RichText;
