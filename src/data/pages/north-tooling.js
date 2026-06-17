import { stack } from '../capabilities';

const page = {
  key: 'north/tooling',
  title: 'Tooling',
  accent: '#ff3333',
  hero: {
    scene: 'tooling-console',
    intensity: 'hero',
    eyebrow: 'Hanoryx North // TOOL',
    title: 'The systems we build to build everything else.',
    intro: 'Tooling at Hanoryx North is the internal layer no client ever sees — the consoles, command surfaces, and pipelines that keep the work fast, observed, and reversible. We treat our own infrastructure as a product.',
    code: 'NODE.TOOL',
    status: 'OPERATIONAL',
    actions: [
      { label: 'Division', to: '/north' },
      { label: 'Engineering', to: '/north/engineering', variant: 'outline' },
    ],
    metrics: [
      { value: 12, label: 'Internal consoles' },
      { value: 100, suffix: '%', label: 'Deploys instrumented' },
      { value: 3, label: 'Tooling layers' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'build-pipeline',
      eyebrow: 'Internal Console',
      code: 'TOOL.CORE',
      title: 'One command surface, every operation behind it.',
      body: [
        'The internal console is a single entry point that reaches every system we run — a command palette that resolves intent into a typed, audited action without leaving the keyboard.',
        'Operators do not memorise interfaces; they describe what they want. Fuzzy commands map to scoped operations, each one gated by role, logged on execution, and reversible by default.',
        'The palette is generated from the same boundaries the platforms expose, so the tooling never drifts from the systems it controls. New capabilities appear the moment they ship.',
      ],
      asideLabel: 'PALETTE',
      asideCode: 'TOOL.MAP',
      points: [
        { k: 'INPUT', v: 'Intent, not menus' },
        { k: 'RESOLVE', v: 'Fuzzy to typed action' },
        { k: 'SCOPE', v: 'Role-gated on execution' },
        { k: 'AUDIT', v: 'Every command logged' },
        { k: 'UNDO', v: 'Reversible by default' },
      ],
    },
    {
      type: 'cards',
      scene: 'command-terminal',
      eyebrow: 'Dev Workflow',
      title: 'The instruments behind the work.',
      intro: 'A small set of internal tools, each owning one part of the loop between writing a system and watching it run.',
      items: [
        {
          code: 'TOOL.01',
          title: 'Telemetry surface',
          body: 'Live traces, error budgets, and state transitions streamed into one view. Every running system reports into the same surface, so signal is never scattered across dashboards.',
          tags: ['Tracing', 'Metrics', 'Live'],
          status: 'ONLINE',
        },
        {
          code: 'TOOL.02',
          title: 'Deployment pipeline',
          body: 'A single instrumented path from commit to production. Each stage gates the next, deploys are reversible, and the rollback is exercised as routinely as the release.',
          tags: ['CI', 'Rollback', 'Gated'],
          status: 'ACTIVE',
        },
        {
          code: 'TOOL.03',
          title: 'Internal consoles',
          body: 'Per-system control panels generated from typed boundaries. Operators run scoped actions, inspect records, and replay state without touching the underlying infrastructure.',
          tags: ['Consoles', 'Scoped', 'Replay'],
          status: 'OPERATIONAL',
        },
        {
          code: 'TOOL.04',
          title: 'Command palette',
          body: 'The keyboard-first front door to every operation. It resolves natural commands into audited actions and is the same surface that powers the internal console.',
          tags: ['Palette', 'Audited', 'Fast'],
          status: 'ONLINE',
        },
        {
          code: 'TOOL.05',
          title: 'Record control',
          body: 'A structured layer for inspecting, correcting, and versioning records across systems. Changes are diffed, attributed, and reversible, with history kept as a first-class artifact.',
          tags: ['Records', 'Versioned', 'Diffed'],
          status: 'ACTIVE',
        },
      ],
    },
    {
      type: 'modules',
      scene: 'glyph-compiler',
      eyebrow: stack.eyebrow,
      title: 'Tools chosen for control, not fashion.',
      intro: stack.body,
      rows: [
        { k: 'SMALL', v: 'A deliberately narrow stack, deeply understood' },
        { k: 'PRIMITIVES', v: 'Things we can reason about over abstractions we cannot' },
        { k: 'GENERATED', v: 'Tooling derived from the same boundaries it controls' },
        { k: 'OBSERVED', v: 'If it runs, it reports — telemetry is a feature' },
        { k: 'REVERSIBLE', v: 'Every action biased toward being undone' },
        { k: 'QUIET', v: 'Surface signal, suppress noise, stay out of the way' },
      ],
    },
    {
      type: 'cta',
      scene: 'dependency-graph',
      eyebrow: 'Open a channel',
      title: 'Ask how we run our own systems.',
      body: 'The tooling is internal, but the discipline behind it shows up in everything we ship.',
    },
  ],
};

export default page;
