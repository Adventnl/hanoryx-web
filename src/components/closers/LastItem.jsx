import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight, RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LastItem.module.css';

/* Two shoppers, one item left. Each strategy is a short script of what happens,
   step by step, and what is true afterwards. */
const STRATEGIES = {
  naive: {
    label: 'Read, then write',
    code: 'qty = read(sku)\nif qty > 0:\n    write(sku, qty - 1)\n    create_order()',
    steps: [
      { who: 'A', text: 'reads the stock: 1 left.', stock: 1 },
      { who: 'B', text: 'reads the stock: 1 left.', stock: 1 },
      { who: 'A', text: 'writes 0, and creates an order.', stock: 0 },
      { who: 'B', text: 'writes 0, and creates an order.', stock: 0 },
    ],
    verdict: 'Two orders for one item. The stock count says 0 and hides the problem, because both wrote the same number.',
    bad: true,
  },
  reserve: {
    label: 'Hold it for a while',
    code: 'hold(sku, 10 minutes)   # or fail\npay()\nconfirm_or_release()',
    steps: [
      { who: 'A', text: 'asks for a hold. Granted: 0 available, 1 held.', stock: 0 },
      { who: 'B', text: 'asks for a hold. Refused: “someone is buying the last one”.', stock: 0 },
      { who: 'A', text: 'pays inside ten minutes. The hold becomes an order.', stock: 0 },
      { who: 'B', text: 'is told clearly, and offered a notification.', stock: 0 },
    ],
    verdict: 'One order, and B hears the truth at once. If A had walked away, the hold would expire and the item return to sale. It costs a clock, and a rule for what the clock means.',
    bad: false,
  },
  atomic: {
    label: 'One conditional update',
    code: 'UPDATE stock\n   SET qty = qty - 1\n WHERE sku = :sku AND qty > 0\n-- 1 row changed? you got it.',
    steps: [
      { who: 'A', text: 'sends the update. The database changes 1 row: A has it.', stock: 0 },
      { who: 'B', text: 'sends the same update. The database changes 0 rows: refused.', stock: 0 },
      { who: 'A', text: 'creates the order, in the same transaction.', stock: 0 },
      { who: 'B', text: 'is told it is gone.', stock: 0 },
    ],
    verdict: 'One order. The database decides who was first, in one step that cannot be interleaved. This is the simplest correct answer when you do not need a hold.',
    bad: false,
  },
};

/** The classic race: two people press Buy on the last item at once. Step through
 *  three ways of handling it and see which ones sell the item twice. */
export default function LastItem({ tag, title, lede, onward }) {
  const [id, setId] = useState('naive');
  const [at, setAt] = useState(0);
  const s = STRATEGIES[id];
  const done = at >= s.steps.length;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('lastitem.rig')}>
        <GlideTabs panels={false} label="Strategy" idPrefix="li" value={id} onChange={(v) => { setId(v); setAt(0); }} tabs={Object.entries(STRATEGIES).map(([k, v]) => ({ id: k, label: v.label }))} />
        <div className={styles.cols}>
          <div className={styles.left}>
            <pre tabIndex={0} aria-label="The strategy in pseudo-code"><code>{s.code}</code></pre>
            <div className={styles.stock}><span>Stock</span><b>{at === 0 ? 1 : s.steps[Math.min(at, s.steps.length) - 1].stock}</b><small>1 item to start with</small></div>
          </div>
          <ol className={styles.steps} aria-live="polite">
            {s.steps.map((st, i) => (
              <li key={i} className={clsx(i < at && styles.seen, i === at - 1 && styles.now)}>
                <span className={clsx(styles.who, st.who === 'B' && styles.b)}>{st.who}</span>
                <span>{i < at ? st.text : '…'}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={shared.row}>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => setAt((n) => n + 1)} disabled={done}>Next step <ChevronRight size={14} aria-hidden="true" /></button>
          <button type="button" className={shared.btn} onClick={() => setAt(s.steps.length)} disabled={done}>Run it all</button>
          <button type="button" className={shared.btn} onClick={() => setAt(0)} disabled={at === 0}><RotateCcw size={14} aria-hidden="true" /> Again</button>
        </div>
        {done && <p className={clsx(styles.verdict, s.bad && styles.bad)} role="status"><b>{s.bad ? 'Oversold.' : 'Safe.'}</b> {s.verdict}</p>}
      </div>
    </CloserFrame>
  );
}
