import { tools } from '../resources';

const page = {
  key: 'resources/tools',
  title: 'Tools',
  accent: '#ff3333',
  aliases: ['tools', 'calculators', 'checkers', 'utilities', 'contrast', 'cron', 'type scale', 'readiness', 'decision record'],
  hero: {
    scene: 'tooling-console',
    intensity: 'hero',
    eyebrow: 'Resources / Tools',
    title: 'Five small tools. All of them honest.',
    intro: `${tools.length} tools for ordinary jobs: checking a colour pair, setting a type scale, reading a schedule, asking whether something is ready, writing down a decision. Each runs in the page and shows how it reached its answer.`,
    code: 'RES.04',
    status: `${tools.length} TOOLS`,
    actions: [
      { label: 'Open the bench', to: '/resources/tools#bench' },
      { label: 'The cheat sheet', to: '/resources/tools#sheet', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'toolBench',
      anchor: 'bench',
      railLabel: 'The bench',
      scene: 'privacy-quiet-grid',
      minHeight: 640,
      eyebrow: 'The bench',
      title: 'Pick a tool.',
      intro: 'Each card says what the tool does and what it never does. Filter by the kind of job.',
      note: 'The tools give general answers to general questions. They are aids to thinking, not certification of anything.',
    },
    {
      type: 'modules',
      anchor: 'promises',
      railLabel: 'What every tool promises',
      scene: 'architectural-grid',
      eyebrow: 'What every tool promises',
      title: 'Five things, every time.',
      rows: [
        { k: 'RUNS IN THE PAGE', v: 'No server is involved. Close the tab and what you typed is gone.' },
        { k: 'NO ACCOUNT', v: 'Nothing to sign in to, nothing to sign up for.' },
        { k: 'SHOWS ITS WORKINGS', v: 'A short note beside each result says how it was reached.' },
        { k: 'KEYBOARD FIRST', v: 'Every control can be reached and used without a pointer.' },
        { k: 'SAYS WHAT IT IS NOT', v: 'Each tool names its limits, so a tidy answer is not mistaken for a guarantee.' },
      ],
    },
    {
      type: 'closer',
      kind: 'cheatSheet',
      anchor: 'sheet',
      scene: 'tooling-console',
      tag: 'End of the tools',
      minHeight: 640,
      title: 'All five, on one page.',
      lede: 'The thresholds, the ratios, the field ranges, the groups and the headings the tools turn on, laid out as a sheet. Print it, or copy it as plain text.',
      onward: [
        { label: 'Downloads', to: '/resources/downloads' },
        { label: 'Glossary', to: '/resources/glossary' },
      ],
    },
  ],
};

export default page;
