import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { kit, kitFamilies } from '../../data/kit';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './KitPicker.module.css';

const find = (id) => {
  const item = kit.find((k) => k.id === id);
  const family = kitFamilies.find((f) => f.id === item?.family);
  return item && family ? { item, family } : null;
};

/** “Which component?” — answer what you are trying to do, then narrow it, and the
 *  page names the one or two components that fit, with the reason, and links to
 *  each in its gallery. */
export default function KitPicker({ tag, title, lede, goals = [], onward }) {
  const [goalId, setGoalId] = useState(null);
  const [choice, setChoice] = useState(null);
  const goal = goals.find((g) => g.id === goalId);
  const picked = goal?.choices.find((c) => c.label === choice);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('picker.rig')}>
        <div className={styles.step}>
          <p className={styles.ask} id="kit-ask-1">What are you trying to do?</p>
          <div className={styles.opts} role="radiogroup" aria-labelledby="kit-ask-1">
            {goals.map((g) => (
              <button key={g.id} type="button" role="radio" aria-checked={goalId === g.id} className={styles.opt} onClick={() => { setGoalId(g.id); setChoice(null); }}>{g.label}</button>
            ))}
          </div>
        </div>

        {goal && (
          <div className={styles.step}>
            <p className={styles.ask} id="kit-ask-2">{goal.ask}</p>
            <div className={styles.opts} role="radiogroup" aria-labelledby="kit-ask-2">
              {goal.choices.map((c) => (
                <button key={c.label} type="button" role="radio" aria-checked={choice === c.label} className={styles.opt} onClick={() => setChoice(c.label)}>{c.label}</button>
              ))}
            </div>
          </div>
        )}

        <div role="status" aria-live="polite">
          {picked && (
            <ul className={styles.picks} aria-label="Components that fit" {...fx('picker.result')}>
              {picked.picks.map((p) => {
                const hit = find(p.id);
                if (!hit) return null;
                return (
                  <li key={p.id} className={styles.pick}>
                    <small>{hit.family.name}</small>
                    <h3>{hit.item.name}</h3>
                    <p>{p.why}</p>
                    <Link to={`${hit.family.to}#${hit.item.id}`} data-cursor="link">See it working <ArrowUpRight size={13} aria-hidden="true" /></Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {goalId && (
          <button type="button" className={`${shared.btn} ${styles.reset}`} onClick={() => { setGoalId(null); setChoice(null); }}><RotateCcw size={13} aria-hidden="true" /> Start again</button>
        )}
      </div>
    </CloserFrame>
  );
}
