import { Printer } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { readinessGroups } from '../../data/readiness';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './CheatSheet.module.css';

/* Everything the five tools turn on, on one printable page. */
const SHEET = [
  {
    id: 'contrast', name: 'Contrast', tool: '/resources/tools/contrast',
    rows: [['Body text, AA', '4.5 : 1'], ['Body text, AAA', '7 : 1'], ['Large text, AA', '3 : 1'], ['Large text, AAA', '4.5 : 1'], ['Interface parts, AA', '3 : 1']],
    foot: 'Large means 24px and over, or 19px bold and over.',
  },
  {
    id: 'scale', name: 'Type scale', tool: '/resources/tools/type-scale',
    rows: [['Minor second', '1.067'], ['Major second', '1.125'], ['Minor third', '1.2'], ['Major third', '1.25'], ['Perfect fourth', '1.333'], ['Perfect fifth', '1.5'], ['Golden ratio', '1.618']],
    foot: 'Size at step n = base × ratio ⁿ. Sixteen pixels is one rem.',
  },
  {
    id: 'cron', name: 'Cron', tool: '/resources/tools/cron',
    rows: [['minute', '0–59'], ['hour', '0–23'], ['day of month', '1–31'], ['month', '1–12 or JAN–DEC'], ['day of week', '0–7 or SUN–SAT'], ['* , - /', 'any · list · range · step']],
    foot: 'In the day-of-week field both 0 and 7 mean Sunday. If day-of-month and day-of-week are both set, either may match.',
  },
  {
    id: 'ready', name: 'Readiness', tool: '/resources/tools/readiness',
    rows: readinessGroups.map((g) => [g.name, g.blurb]),
    foot: 'Four questions in each. “Partly” counts for half.',
  },
  {
    id: 'decision', name: 'Decision record', tool: '/resources/tools/decision-record',
    rows: [['Status', 'Proposed · Accepted · Superseded · Rejected'], ['Context', 'Why a decision is needed'], ['Options', 'What else was considered'], ['Decision', 'What was chosen, and why'], ['Consequences', 'What gets easier, what gets harder']],
    foot: 'Five minutes to write. Keep it next to the code.',
  },
  {
    id: 'keys', name: 'This site', tool: null,
    rows: [['⌘ K  or  Ctrl K', 'Search'], ['?', 'Keyboard shortcuts'], ['B', 'Blueprint mode']],
    foot: 'Press Escape to close anything that opened.',
  },
];

const asText = () => SHEET.flatMap((s) => [s.name.toUpperCase(), ...s.rows.map(([a, b]) => `  ${a.padEnd(22)} ${b}`), `  ${s.foot}`, '']).join('\n');

/** One printable page that holds what the five tools turn on: the thresholds,
 *  the ratios, the field ranges, the groups, the headings. Print it, or copy it
 *  as plain text. */
export default function CheatSheet({ tag, title, lede, onward }) {
  const [copied, copy] = useCopy();
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.sheet} data-print="doc" {...fx('cheatsheet.sheet')}>
        <header><span>CHEAT SHEET</span><b>Five tools, one page</b></header>
        <div className={styles.grid}>
          {SHEET.map((s, i) => (
            <section key={s.id}>
              <h3><span>{String(i + 1).padStart(2, '0')}</span>{s.name}</h3>
              <dl>
                {s.rows.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
              </dl>
              <p>{s.foot}</p>
            </section>
          ))}
        </div>
      </div>
      <div className={shared.row}>
        <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => window.print()} {...fx('cheatsheet.print')}><Printer size={14} aria-hidden="true" /> Print the sheet</button>
        <button type="button" className={shared.btn} onClick={() => copy(asText())}>{copied ? 'Copied' : 'Copy as text'}</button>
      </div>
    </CloserFrame>
  );
}
