import { useState } from 'react';
import clsx from 'clsx';
import { Check, Lock } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import styles from './PermissionMatrix.module.css';

/**
 * Roles against actions. Toggle what a role may do, switch between "roles
 * only" and "roles plus scope" (own records, own team), then act as a person
 * and see the decision — and the rule that made it.
 *
 *   roles:   [{ id, label, grants: [actionId], scoped: [actionId] }]
 *   actions: [{ id, label, owned: bool }]    owned = needs a record of your own under the scoped model
 */
export default function PermissionMatrix({ eyebrow, title, intro, roles = [], actions = [], note }) {
  const [model, setModel] = useState('scope');
  const [grants, setGrants] = useState(() => Object.fromEntries(roles.map((r) => [r.id, new Set(r.grants)])));
  const [who, setWho] = useState(roles[1]?.id || roles[0].id);
  const [mine, setMine] = useState(true);
  const [last, setLast] = useState(null);

  const flip = (rid, aid) => setGrants((g) => { const s = new Set(g[rid]); if (s.has(aid)) s.delete(aid); else s.add(aid); return { ...g, [rid]: s }; });

  const decide = (a) => {
    const role = roles.find((r) => r.id === who);
    let verdict;
    if (!grants[who].has(a.id)) verdict = { ok: false, rule: `Deny by default: the ${role.label} role has not been granted “${a.label.toLowerCase()}”.` };
    else if (model === 'scope' && a.owned && role.scoped?.includes(a.id) && !mine) verdict = { ok: false, rule: `Granted, but only for the ${role.label.toLowerCase()}’s own records, and this one belongs to someone else.` };
    else verdict = { ok: true, rule: model === 'scope' && a.owned && role.scoped?.includes(a.id) ? `Granted, and the record is the ${role.label.toLowerCase()}’s own.` : `Granted to the ${role.label} role.` };
    setLast({ a: a.label, ...verdict });
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('perm.rig')}>
        <div className={styles.top}>
          <GlideTabs panels={false} label="Model" idPrefix="perm-model" value={model} onChange={(m) => { setModel(m); setLast(null); }} tabs={[{ id: 'roles', label: 'Roles only' }, { id: 'scope', label: 'Roles plus scope' }]} {...fx('perm.model-switch')} />
          <p className={styles.hint}>{model === 'roles' ? 'A role either may or may not. Nothing considers whose record it is.' : 'A granted action can be limited to records you own.'}</p>
        </div>

        <div className={styles.grid} role="region" aria-label="Permission matrix" tabIndex={0}>
          <table>
            <thead>
              <tr><th scope="col">Role</th>{actions.map((a) => <th key={a.id} scope="col">{a.label}</th>)}</tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className={clsx(r.id === who && styles.me)}>
                  <th scope="row">{r.label}</th>
                  {actions.map((a) => {
                    const has = grants[r.id].has(a.id);
                    const scoped = model === 'scope' && a.owned && has && r.scoped?.includes(a.id);
                    return (
                      <td key={a.id}>
                        <button type="button" className={clsx(styles.cell, has && styles.has)} aria-pressed={has} aria-label={`${r.label}: ${a.label}`} onClick={() => { flip(r.id, a.id); setLast(null); }}>
                          {has ? <Check size={13} aria-hidden="true" /> : <Lock size={12} aria-hidden="true" />}
                          {scoped && <i>own</i>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.try} {...fx('perm.try-as')}>
          <div className={styles.who} role="radiogroup" aria-label="Act as">
            <span className={styles.k}>Act as</span>
            {roles.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={r.id === who} className={clsx(styles.pick, r.id === who && styles.picked)} onClick={() => { setWho(r.id); setLast(null); }}>{r.label}</button>
            ))}
          </div>
          {model === 'scope' && (
            <label className={clsx(styles.own, mine && styles.ownOn)}>
              <input type="checkbox" checked={mine} onChange={(e) => { setMine(e.target.checked); setLast(null); }} />
              <span>The record is my own</span>
            </label>
          )}
          <div className={styles.acts}>
            {actions.map((a) => <button key={a.id} type="button" className={styles.act} onClick={() => decide(a)}>{a.label}</button>)}
          </div>
          <p className={clsx(styles.verdict, last && (last.ok ? styles.allow : styles.deny))} role="status" aria-live="polite">
            {last ? <><b>{last.ok ? 'Allowed' : 'Denied'}: {last.a}.</b> {last.rule}</> : 'Choose an action to see the decision and the rule behind it.'}
          </p>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
