import { Specimen } from '../Specimen';
import { pad2 } from '../hooks';
import s from './stages.module.css';

/* The pieces every stage draws with: a specimen, the readout, the visual's box. */

/* One specimen, drawn from an items entry: [name, Component, mode]. */
export function spec(meta, no, items, i, inert = false) {
  const [name, Comp, mode] = items[i];
  return (
    <Specimen key={name} no={no} i={i} name={name} mode={mode} slug={meta.slug} inert={inert}>
      <Comp />
    </Specimen>
  );
}

/* The readout that sits under the pinned visual: where you are in the page. */
export function Hud({ no, items, active }) {
  const name = items[active]?.[0] || '';
  return (
    <div className={s.hud} aria-hidden="true">
      <span className={s.hudNo}>{pad2(no)}.{pad2(active + 1)}</span>
      <span className={s.hudName}>{name}</span>
      <span className={s.hudCount}>{pad2(active + 1)} / {pad2(items.length)}</span>
      <span className={s.hudBar}><i /></span>
    </div>
  );
}

/* The visual gets a box it can size itself in: it draws in container units
   (cqw / cqh / cqmin), so the same piece fits a half screen or a phone band. */
export function Visual({ Visual: V }) {
  return <div className={s.visual}><V /></div>;
}

export const common = (meta) => ({ 'data-frame': meta.frame, 'data-ground': meta.ground, 'aria-label': `${meta.title}: specimens` });

