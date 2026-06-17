import { projects } from '../systems';

const record = projects.find((p) => p.id === 'pr-01');

const page = {
  key: 'work/commerce-system-i',
  title: 'Commerce System I',
  accent: '#ff3333',
  hero: {
    scene: 'commerce-pipeline',
    intensity: 'hero',
    eyebrow: `Work // ${record.code}`,
    title: 'The first Hanoryx system — commerce infrastructure, shipped and held under load.',
    intro:
      'Commerce System I joined catalog, transactions, and payment workflows into one deployed surface. It is the reference build every later commerce node inherits.',
    code: 'NODE.CS1',
    status: 'OPERATIONAL',
    actions: [
      { label: 'All work', to: '/work', variant: 'outline' },
      { label: 'Commerce infrastructure', to: '/systems/commerce-infrastructure' },
    ],
    metrics: [
      { value: 1, label: 'First system' },
      { value: 4, label: 'Pipeline stages' },
      { value: 100, suffix: '%', label: 'Auditable orders' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'transaction-wave',
      eyebrow: 'What it is',
      code: 'CS1.01',
      title: 'A storefront on the surface, a settlement engine underneath.',
      body: [
        'Commerce System I models the catalog as structured records — products, variants, and pricing held as data rather than scattered configuration, so availability and price resolve the same way on every request.',
        'Transactions and payment workflows sit on the same connected core. A checkout is the visible edge of an engineered settlement path: authorise, capture, and reconcile are explicit states, never assumptions made after the fact.',
      ],
      asideLabel: 'CORE',
      asideCode: 'CS1.MAP',
      points: [
        { k: 'CATALOG', v: 'Product & variant model' },
        { k: 'PRICING', v: 'Rules & calculation' },
        { k: 'TXN', v: 'Transaction ledger' },
        { k: 'PAYMENT', v: 'Settlement workflows' },
        { k: 'STATE', v: 'Inventory & order state' },
      ],
    },
    {
      type: 'process',
      scene: 'dashboard-tiles',
      eyebrow: 'Order pipeline',
      title: 'How an order moves through the system.',
      intro:
        'Every order travels one path. No stage is skipped, and each transition is written down before the next begins.',
      steps: [
        {
          step: '01',
          title: 'Intake',
          body: 'An order enters with its cart, customer context, and a pricing snapshot fixed at the moment of submission, so the record can never drift after it is placed.',
        },
        {
          step: '02',
          title: 'Validate',
          body: 'Inventory levels, pricing rules, and payment authorisation are checked together. An order only advances once every gate confirms it is safe to proceed.',
        },
        {
          step: '03',
          title: 'Fulfil',
          body: 'Stock is committed, fulfilment state advances, and downstream surfaces are notified through controlled events rather than ad-hoc calls.',
        },
        {
          step: '04',
          title: 'Settle',
          body: 'Payment calculations resolve, the transaction is written to the ledger, and the order closes against a reconciled record that balances at the end of the path.',
        },
      ],
    },
    {
      type: 'modules',
      scene: 'secure-boundary',
      eyebrow: 'System summary',
      title: 'The record at a glance.',
      intro:
        'Commerce System I as it stands in the work codex — the build that set the architecture the commerce line still runs on.',
      rows: [
        { k: 'CODE', v: record.code },
        { k: 'NAME', v: record.name },
        { k: 'TYPE', v: record.type },
        { k: 'STATUS', v: record.status },
        { k: 'CATALOG', v: 'Structured product, variant, and pricing model' },
        { k: 'PIPELINE', v: 'Four-stage order path: intake, validate, fulfil, settle' },
        { k: 'PAYMENTS', v: 'Explicit authorise, capture, and reconcile states' },
        { k: 'LEDGER', v: 'Single settlement ledger reconciled per order' },
        { k: 'LINEAGE', v: 'Reference architecture for later commerce nodes' },
      ],
    },
    {
      type: 'cta',
      scene: 'data-stream-ribbons',
      eyebrow: 'Open a channel',
      title: 'Discuss a commerce build.',
      body: 'Bring us the catalog, the transactions, and the payment logic you need held under control. We will design the path every order travels.',
    },
  ],
};

export default page;
