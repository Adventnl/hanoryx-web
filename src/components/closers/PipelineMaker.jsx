import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PipelineMaker.module.css';

const CHECKS = [
  { id: 'lint', name: 'Lint', cmd: 'npm run lint', guards: 'Mistakes a program can see without running.' },
  { id: 'format', name: 'Format check', cmd: 'npm run format:check', guards: 'Arguments about spacing.' },
  { id: 'types', name: 'Type check', cmd: 'npm run typecheck', guards: 'Passing the wrong thing to the wrong place.' },
  { id: 'test', name: 'Tests', cmd: 'npm test', guards: 'The behaviour you decided to keep.' },
  { id: 'build', name: 'Build', cmd: 'npm run build', guards: 'A change that cannot be shipped at all.' },
  { id: 'a11y', name: 'Accessibility scan', cmd: 'npm run a11y', guards: 'Missing names, bad contrast, broken structure.' },
  { id: 'links', name: 'Link check', cmd: 'npm run links', guards: 'Pages that point at nothing.' },
  { id: 'audit', name: 'Dependency audit', cmd: 'npm audit --audit-level=high', guards: 'Known problems in what you depend on.' },
];

/** Assemble a checks pipeline: choose the checks, put them in order, and a
 *  workflow file comes out, with the same sequence as a local script. The commands
 *  are placeholders for your project's own. */
export default function PipelineMaker({ tag, title, lede, onward }) {
  const [order, setOrder] = useState(['lint', 'test', 'build']);
  const [split, setSplit] = useState(false);
  const [on, setOn] = useState('pull_request');
  const [copied, copy] = useCopy();
  const byId = (id) => CHECKS.find((c) => c.id === id);
  const toggle = (id) => setOrder((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const move = (id, d) => setOrder((o) => { const i = o.indexOf(id); const j = i + d; if (j < 0 || j >= o.length) return o; const n = [...o]; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const yaml = useMemo(() => {
    const trigger = on === 'both' ? '  pull_request:\n  push:\n    branches: [main]' : on === 'push' ? '  push:\n    branches: [main]' : '  pull_request:';
    const setup = '      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci';
    const jobs = split
      ? order.map((id) => `  ${id}:\n    runs-on: ubuntu-latest\n    steps:\n${setup}\n      - run: ${byId(id).cmd}`).join('\n')
      : `  checks:\n    runs-on: ubuntu-latest\n    steps:\n${setup}\n${order.map((id) => `      - run: ${byId(id).cmd}`).join('\n')}`;
    return `# Adjust the commands to your project's own scripts.\nname: checks\non:\n${trigger}\njobs:\n${order.length ? jobs : '  # choose at least one check'}\n`;
  }, [order, split, on]);
  const script = `#!/usr/bin/env sh\n# The same checks, in the same order, on your own machine.\nset -e\n${order.map((id) => byId(id).cmd).join('\n')}\n`;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('pipeline.rig')}>
        <div className={styles.left}>
          <ul className={styles.checks}>
            {CHECKS.map((c) => {
              const i = order.indexOf(c.id);
              return (
                <li key={c.id} className={clsx(styles.check, i >= 0 && styles.on)}>
                  <label>
                    <input type="checkbox" checked={i >= 0} onChange={() => toggle(c.id)} />
                    <span className={styles.box} aria-hidden="true" />
                    <span className={styles.name}><b>{c.name}</b><small>{c.guards}</small></span>
                  </label>
                  {i >= 0 && (
                    <span className={styles.order}>
                      <span>{i + 1}</span>
                      <button type="button" onClick={() => move(c.id, -1)} disabled={i === 0} aria-label={`Move ${c.name} earlier`}><ArrowUp size={13} aria-hidden="true" /></button>
                      <button type="button" onClick={() => move(c.id, 1)} disabled={i === order.length - 1} aria-label={`Move ${c.name} later`}><ArrowDown size={13} aria-hidden="true" /></button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.opts}>
            <label><span className={shared.label}>Runs on</span><select value={on} onChange={(e) => setOn(e.target.value)}><option value="pull_request">Every pull request</option><option value="push">Pushes to main</option><option value="both">Both</option></select></label>
            <label className={styles.inline}><input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} /> One job per check</label>
          </div>
        </div>
        <div className={styles.out}>
          <p className={shared.label}>.github/workflows/checks.yml</p>
          <pre tabIndex={0}><code>{yaml}</code></pre>
          <p className={shared.label}>scripts/check.sh</p>
          <pre tabIndex={0}><code>{script}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('checks.yml', yaml, 'text/yaml')}><Download size={14} aria-hidden="true" /> Download the workflow</button>
            <button type="button" className={shared.btn} onClick={() => copy(yaml)}>{copied === yaml ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
