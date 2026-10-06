import { useRef, useState } from 'react';
import CloserFrame from './CloserFrame';
import { Alert, Checkbox, Segmented, Stepper, TextField } from '../kit';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './WizardRun.module.css';

/**
 * A four-step flow, walked. The Stepper shows where you are; Next is held back
 * until the step is complete and says why; when the step changes, focus moves to
 * its heading so a keyboard or screen-reader user starts reading at the top of the
 * new step — and a log beside it writes down what a screen reader would announce.
 *
 *   steps: [{ title, hint, intro }]   (four, in order: details, review, confirm, done)
 */
export default function WizardRun({ tag, title, lede, steps = [], onward }) {
  const [at, setAt] = useState(0);
  const [name, setName] = useState('');
  const [size, setSize] = useState('team');
  const [agree, setAgree] = useState(false);
  const [log, setLog] = useState(() => [`Step 1 of ${steps.length}: ${steps[0]?.title}.`]);
  const heading = useRef(null);

  const problem = at === 0 && name.trim().length < 3 ? 'Enter a project name of at least three characters to go on.' : at === 2 && !agree ? 'Tick the box to confirm.' : '';
  const go = (to) => {
    setAt(to);
    setLog((l) => [...l, `Step ${to + 1} of ${steps.length}: ${steps[to].title}.`].slice(-6));
    requestAnimationFrame(() => heading.current?.focus());
  };
  const restart = () => { setName(''); setSize('team'); setAgree(false); setAt(0); setLog([`Step 1 of ${steps.length}: ${steps[0]?.title}.`]); requestAnimationFrame(() => heading.current?.focus()); };
  const step = steps[at] || {};
  const last = at === steps.length - 1;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('wizard.rig')}>
        <div className={styles.flow}>
          <Stepper steps={steps} current={at} label="Setup progress" />
          <section className={styles.card} aria-labelledby="wiz-h" {...fx('wizard.card')}>
            <h3 id="wiz-h" ref={heading} tabIndex={-1}>{step.title}</h3>
            <p>{step.intro}</p>
            {at === 0 && (
              <>
                <TextField label="Project name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Example project" />
                <Segmented label="Size of the group" options={[{ value: 'solo', label: 'Just me' }, { value: 'team', label: 'A team' }, { value: 'org', label: 'Everyone' }]} value={size} onChange={setSize} />
              </>
            )}
            {at === 1 && (
              <dl style={{ margin: 0, display: 'grid', gap: '0.5rem', font: '0.8rem var(--font-mono)', color: 'var(--c-white)' }}>
                <div><dt style={{ color: 'var(--c-white-65)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Project</dt><dd style={{ margin: 0 }}>{name || '—'}</dd></div>
                <div><dt style={{ color: 'var(--c-white-65)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Group</dt><dd style={{ margin: 0 }}>{size === 'solo' ? 'Just me' : size === 'team' ? 'A team' : 'Everyone'}</dd></div>
              </dl>
            )}
            {at === 2 && <Checkbox label="I understand nothing is saved or sent" hint="This is a demonstration of the steps, not a real sign-up." checked={agree} onChange={setAgree} />}
            {last && <Alert tone="success" title="All done">There was nothing to save. Go back to change an answer, or start again.</Alert>}
            {problem && <p role="status" style={{ color: 'var(--c-red-bright)' }}>{problem}</p>}
            <div className={styles.nav}>
              <button type="button" className={shared.btn} onClick={() => go(at - 1)} disabled={at === 0}>Back</button>
              {last ? (
                <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={restart}>Start again</button>
              ) : (
                <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => go(at + 1)} disabled={Boolean(problem)}>Next: {steps[at + 1]?.title}</button>
              )}
            </div>
          </section>
        </div>

        <div className={styles.ear}>
          <p className={shared.label}>What a screen reader announces</p>
          <ol className={styles.log} aria-label="Announcements" {...fx('wizard.log')}>
            {log.map((line, i) => <li key={`${i}-${line}`}><b>&gt;</b> {line}</li>)}
          </ol>
          <p className={styles.fine}>Focus moves to the step’s heading each time, so reading starts at the top of the new step. The button that is held back says why in the line above it.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
