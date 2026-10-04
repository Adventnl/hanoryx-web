import { useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { Check, Copy, Mail } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ContactStudio.module.css';

const SPRING = { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 };
const SOFT_LIMIT = 1200;

/**
 * The contact page's one composition. Choose what the message is about, write
 * it (a starter line can be dropped in for you), watch the envelope fill in,
 * then either open it in your own mail app or copy the address. Nothing is sent
 * from this page and nothing is stored: the form only builds a mail link.
 * `?type=careers` (or any type id) opens with that type selected.
 *
 *   types: [{ id, code, title, body, glyph, subject, starters: [string] }]
 */
export default function ContactStudio({ eyebrow, title, intro, types, email, note }) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [params] = useSearchParams();
  const initial = types.find((t) => t.id === params.get('type')) || types[0];
  const [typeId, setTypeId] = useState(initial.id);
  const [subjectEdited, setSubjectEdited] = useState(false);
  const [subject, setSubject] = useState(initial.subject);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState('');
  const [pulse, setPulse] = useState(0);
  const messageRef = useRef(null);
  const type = types.find((t) => t.id === typeId);

  const pickType = (t) => {
    setTypeId(t.id);
    if (!subjectEdited) setSubject(t.subject);
    setPulse((p) => p + 1);
  };
  const onKeyDown = (event) => {
    const i = types.findIndex((t) => t.id === typeId);
    let next = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (i + 1) % types.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (i - 1 + types.length) % types.length;
    if (next < 0) return;
    event.preventDefault();
    pickType(types[next]);
    document.getElementById(`${uid}-${types[next].id}`)?.focus();
  };
  const addStarter = (line) => {
    setMessage((m) => (m ? `${m.replace(/\s+$/, '')}\n\n${line} ` : `${line} `));
    messageRef.current?.focus();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied('Copied');
    } catch {
      setCopied('Select it to copy');
    }
    window.setTimeout(() => setCopied(''), 2200);
  };

  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const long = message.length > SOFT_LIMIT;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="scan" />
      <div className={styles.layout} {...fx('contact.studio')}>
        <div className={styles.left}>
          <div role="radiogroup" aria-label="What is this about?" className={styles.types} onKeyDown={onKeyDown}>
            {types.map((t) => {
              const on = t.id === typeId;
              return (
                <button
                  key={t.id}
                  id={`${uid}-${t.id}`}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  className={clsx('glyph-host', styles.type, on && styles.on)}
                  onClick={() => pickType(t)}
                >
                  {on && <motion.span layoutId={`${uid}-ink`} className={styles.ink} transition={reduced ? { duration: 0 } : SPRING} />}
                  <Glyph name={t.glyph} size={26} className={styles.glyph} />
                  <span className={styles.typeText}>
                    <span className={styles.code}>{t.code}</span>
                    <strong>{t.title}</strong>
                    <span>{t.body}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.form}>
            <label className={styles.field}>
              <span>Subject</span>
              <input
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setSubjectEdited(true); }}
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <label className={styles.field}>
              <span>Message <em className={clsx(styles.count, long && styles.over)}>{message.length} / {SOFT_LIMIT}</em></span>
              <textarea
                ref={messageRef}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are you building, who is it for, and what is hard about it?"
              />
            </label>
            <div className={styles.starters} role="group" aria-label="Starter lines">
              <span>Need a start?</span>
              {type.starters.map((s) => (
                <button key={s} type="button" onClick={() => addStarter(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className={styles.envelope} aria-label="Preview of your message">
            <div className={styles.envRow}><span>TO</span><b>{email}</b></div>
            <div className={styles.envRow}><span>SUBJECT</span><b>{subject || '—'}</b></div>
            <p className={styles.envBody}>{message || 'Your message will appear here as you write it.'}</p>
          </div>

          <div className={styles.actions}>
            <a href={href} className={styles.send} data-cursor="link">
              <Mail size={15} aria-hidden="true" /> Open in your mail app
            </a>
            <button type="button" className={styles.copy} onClick={copy} data-cursor="link">
              {copied === 'Copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span>{copied || 'Copy the address'}</span>
            </button>
          </div>
          {long && <p className={styles.warn}>Long messages may not fit in a mail link. Copy the address and paste your message instead.</p>}

          <p className={styles.address}>
            <span className={styles.addrLabel}>The address</span>
            <ScrambleText text={email} trigger={pulse} auto className={styles.email} />
          </p>
          {note && <p className={styles.note}>{note}</p>}
        </div>
      </div>
    </div>
  );
}
