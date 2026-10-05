import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { contrastRatio, parseHex, toHex } from '../../utils/colour';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PairMatrix.module.css';

const tier = (r) => (r >= 7 ? { id: 'aaa', label: 'AAA' } : r >= 4.5 ? { id: 'aa', label: 'AA' } : r >= 3 ? { id: 'lg', label: 'Large only' } : { id: 'no', label: 'Fails' });

/** Check a whole palette at once. Paste colours, and every text-on-background
 *  pairing is graded in a grid, so the ones that never work are visible
 *  before anyone designs with them. */
export default function PairMatrix({ tag, title, lede, start = '#0a0b0d, #f5f5f2, #d92b2b, #9a9ea6, #2b6cb0', onward }) {
  const [text, setText] = useState(start);
  const colours = useMemo(() => {
    const seen = new Set();
    return text.split(/[\s,;]+/).map((t) => ({ raw: t, rgb: parseHex(t) })).filter((c) => c.rgb).map((c) => ({ hex: toHex(c.rgb), rgb: c.rgb })).filter((c) => (seen.has(c.hex) ? false : seen.add(c.hex))).slice(0, 8);
  }, [text]);
  const grid = colours.map((fg) => colours.map((bg) => (fg === bg ? null : contrastRatio(fg.rgb, bg.rgb))));
  const pairs = grid.flat().filter((r) => r !== null);
  const good = pairs.filter((r) => r >= 4.5).length;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('pairmatrix.rig')}>
        <label className={styles.in}>
          <span className={shared.label}>Colours · up to eight</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} rows={4} aria-describedby="pm-help" />
          <small id="pm-help">Hex colours, separated by commas or spaces. Rows are the text; columns are the background.</small>
          <p className={styles.sum}><b>{good}</b> of {pairs.length} pairings reach body-text contrast (4.5 : 1)</p>
        </label>
        <div className={styles.scroll} role="region" aria-label="Contrast of every pairing" tabIndex={0}>
          {colours.length < 2 ? <p className={styles.wait}>Enter at least two colours.</p> : (
            <table>
              <thead>
                <tr><th scope="col"><span className="sr-only">Text on background</span></th>{colours.map((c) => <th key={c.hex} scope="col"><i style={{ background: c.hex }} aria-hidden="true" />{c.hex}</th>)}</tr>
              </thead>
              <tbody>
                {colours.map((fg, r) => (
                  <tr key={fg.hex}>
                    <th scope="row"><i style={{ background: fg.hex }} aria-hidden="true" />{fg.hex}</th>
                    {colours.map((bg, c) => {
                      const ratio = grid[r][c];
                      if (ratio === null) return <td key={bg.hex} className={styles.same} aria-label="same colour">—</td>;
                      const t = tier(ratio);
                      return (
                        <td key={bg.hex} className={clsx(styles.cell, styles[t.id])} style={{ background: bg.hex }}>
                          <span className={styles.sr}>{`${fg.hex} on ${bg.hex}: ${ratio.toFixed(1)} to 1. ${t.label}.`}</span>
                          <span className={styles.sample} style={{ color: fg.hex }} aria-hidden="true" inert>
                            <b>Aa</b>
                            <span>{ratio.toFixed(1)}</span>
                            <em>{t.label}</em>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
