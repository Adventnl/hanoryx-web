import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Download, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { ProgressRing } from '../fx/ProgressRing';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { readinessAnswers, readinessGroups } from '../../data/readiness';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './ReadinessCheck.module.css';

const BANDS = [
  { min: 0.9, name: 'Close to ready', line: 'The gaps that remain are small. Close them, and go with your eyes open.' },
  { min: 0.7, name: 'Nearly there', line: 'The foundations are in place. Close the gaps below before you rely on it.' },
  { min: 0.4, name: 'Not yet', line: 'Several things would hurt on the first bad day. Work down the list, starting with the red ones.' },
  { min: 0, name: 'Early', line: 'This is still a plan rather than a launch. That is a fine thing to be, as long as it is said out loud.' },
];

const all = readinessGroups.flatMap((g) => g.questions.map((q) => ({ ...q, group: g.name })));

/** Twenty questions to ask before something goes live, in five groups. Answer
 *  Yes, Partly, No or Not applicable; the gaps come back as a list to act on,
 *  which can be copied or downloaded. Nothing is kept once you leave. */
export default function ReadinessCheck({ eyebrow, title, intro, note }) {
  const [ans, setAns] = useState({});
  const [copied, copy] = useCopy();
  const values = Object.fromEntries(readinessAnswers.map((a) => [a.id, a.value]));
  const answered = all.filter((q) => ans[q.id]);
  const scored = answered.filter((q) => values[ans[q.id]] !== null);
  const score = scored.length ? scored.reduce((n, q) => n + values[ans[q.id]], 0) / scored.length : 0;
  const band = BANDS.find((b) => score >= b.min);
  // a verdict on three answers out of twenty would be a guess: hold it back until half are in
  const enough = answered.length >= Math.ceil(all.length / 2);
  const left = all.length - answered.length;
  const verdict = !answered.length
    ? { name: 'Start anywhere', line: 'Answer honestly. “Partly” is a perfectly good answer, and “No” is the most useful one.' }
    : !enough
      ? { name: 'Keep going', line: `${left} questions to go. A verdict on so few answers would only be a guess.` }
      : left
        ? { name: `So far: ${band.name.toLowerCase()}`, line: `${left} ${left === 1 ? 'question' : 'questions'} to go. ${band.line}` }
        : band;

  const groupScore = (g) => {
    const s = g.questions.filter((q) => ans[q.id] && values[ans[q.id]] !== null);
    return s.length ? s.reduce((n, q) => n + values[ans[q.id]], 0) / s.length : null;
  };

  const md = useMemo(() => {
    const by = (id) => all.filter((q) => ans[q.id] === id);
    const list = (id, head) => (by(id).length ? [`## ${head}`, ...by(id).map((q) => `- [ ] ${q.text} (${q.group})`), ''] : []);
    return ['# Readiness check', '', `${answered.length} of ${all.length} answered.`, '', ...list('no', 'To do'), ...list('partly', 'Partly done'), ...(by('yes').length ? ['## Done', ...by('yes').map((q) => `- [x] ${q.text} (${q.group})`), ''] : []), ...list('na', 'Not applicable')].join('\n');
  }, [ans, answered.length]);

  const pick = (qid, id) => setAns((a) => ({ ...a, [qid]: a[qid] === id ? undefined : id }));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={`${tool.rig} ${tool.rigWide}`} {...fx('readiness.rig')}>
        <div className={tool.stack}>
          {readinessGroups.map((g) => {
            const gs = groupScore(g);
            return (
              <fieldset key={g.id} className={styles.group} {...fx('readiness.group')}>
                <legend><b>{g.name}</b><span>{g.blurb}</span></legend>
                <span className={styles.bar} aria-hidden="true"><i style={{ transform: `scaleX(${gs ?? 0})` }} /></span>
                <ol>
                  {g.questions.map((q) => (
                    <li key={q.id}>
                      <p>{q.text}</p>
                      <div role="radiogroup" aria-label={q.text} className={styles.opts}>
                        {readinessAnswers.map((a) => (
                          <button key={a.id} type="button" role="radio" aria-checked={ans[q.id] === a.id} className={clsx(styles.opt, ans[q.id] === a.id && styles[`on_${a.id}`])} onClick={() => pick(q.id, a.id)}>{a.id === 'na' ? 'N/A' : a.label}</button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </fieldset>
            );
          })}
        </div>

        <aside className={clsx(tool.panel, tool.sticky, styles.side)} {...fx('readiness.result')}>
          <ProgressRing value={score} size={140} stroke={3.6} label={`${Math.round(score * 100)} percent of answered questions are yes`} {...fx('readiness.ring')}>
            <span className={tool.big}>{Math.round(score * 100)}<small>%</small></span>
          </ProgressRing>
          <p className={tool.k}>{answered.length} of {all.length} answered</p>
          <div role="status" aria-live="polite">
            <p className={styles.band}>{verdict.name}</p>
            <p className={tool.sm}>{verdict.line}</p>
          </div>
          {answered.some((q) => ans[q.id] === 'no') && (
            <div className={styles.gaps}>
              <p className={tool.k}>To do first</p>
              <ul>{all.filter((q) => ans[q.id] === 'no').slice(0, 5).map((q) => <li key={q.id}>{q.text}</li>)}</ul>
            </div>
          )}
          <div className={tool.row}>
            <button type="button" className={styles.btn} onClick={() => downloadText('readiness-check.md', md, 'text/markdown')} disabled={!answered.length}><Download size={13} aria-hidden="true" /> Download</button>
            <button type="button" className={styles.btn} onClick={() => copy(md)} disabled={!answered.length}>{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" className={styles.btn} onClick={() => setAns({})} disabled={!answered.length}><RotateCcw size={13} aria-hidden="true" /> Clear</button>
          </div>
        </aside>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
