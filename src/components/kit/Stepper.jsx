import { Check } from 'lucide-react';
import styles from './navigation.module.css';

/**
 * The steps of something with an order, and which one you are on. Done steps
 * show a tick, the current one is marked `aria-current="step"`, and each step's
 * state is also written out for a screen reader. On a phone it stacks.
 *
 *   steps: [{ title, hint? }]   current: the zero-based index
 */
export default function Stepper({ steps = [], current = 0, label = 'Progress', className }) {
  return (
    <ol className={`${styles.steps} ${className || ''}`} aria-label={label}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'next';
        return (
          <li key={s.title} className={styles.step} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className={styles.dot} aria-hidden="true">{state === 'done' ? <Check size={13} strokeWidth={2.2} /> : i + 1}</span>
            <span className={styles.stepTitle}>{s.title}<span className="sr-only">{state === 'done' ? ' (completed)' : state === 'current' ? ' (current step)' : ' (not started)'}</span></span>
            {s.hint && <span className={styles.stepHint}>{s.hint}</span>}
          </li>
        );
      })}
    </ol>
  );
}
