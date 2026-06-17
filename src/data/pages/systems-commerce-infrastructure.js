import { projects } from '../systems';

const commerceSystemI = projects.find((p) => p.id === 'pr-01');

const page = {
  key: 'systems/commerce-infrastructure',
  title: 'Commerce Infrastructure',
  accent: '#ff3333',
  hero: {
    scene: 'spline-ribbon',
    intensity: 'hero',
    eyebrow: 'Systems // SYS.02',
    title: 'Commerce infrastructure engineered for throughput and control.',
    intro:
      'Transaction systems, catalog logic, and payment workflows built as one hardened surface — where every order moves through a known, auditable path.',
    code: 'NODE.CMX',
    status: 'ACTIVE',
    actions: [{ label: 'All systems', to: '/systems', variant: 'outline' }],
    metrics: [
      { value: 4, label: 'Pipeline stages' },
      { value: 100, suffix: '%', label: 'Auditable orders' },
      { value: 1, label: 'Settlement ledger' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'circuit-trace',
      eyebrow: 'Foundations',
      code: 'CMX.01',
      title: 'A storefront is the surface, not the system.',
      body: [
        'Commerce infrastructure begins beneath the storefront: a catalog model that holds products, variants, and pricing as structured records rather than scattered configuration.',
        'Transactions, inventory state, and payment logic are modelled as one connected core, so a checkout is the visible edge of an engineered settlement path — not an isolated form.',
      ],
      asideLabel: 'CORE',
      asideCode: 'CMX.MAP',
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
      scene: 'timeline-pulse',
      eyebrow: 'Pipeline',
      title: 'How an order moves.',
      intro: 'Every order travels one path. No stage is skipped, and each transition is recorded.',
      steps: [
        { step: '01', title: 'Intake', body: 'An order enters with its cart, customer context, and pricing snapshot fixed at the moment of submission.' },
        { step: '02', title: 'Validate', body: 'Inventory, pricing rules, and payment authorisation are checked before the order is allowed to proceed.' },
        { step: '03', title: 'Fulfil', body: 'Stock is committed, fulfilment state advances, and downstream systems are notified through controlled events.' },
        { step: '04', title: 'Settle', body: 'Payment calculations resolve, the transaction is written to the ledger, and the order closes against a reconciled record.' },
      ],
    },
    {
      type: 'cards',
      scene: 'hex-lattice',
      eyebrow: 'Capabilities',
      title: 'What the infrastructure controls.',
      intro: 'Four surfaces over one core. Each is scoped, observable, and built to hold load.',
      items: [
        {
          code: 'CAP.01',
          title: 'Catalog logic',
          body: 'Products, variants, and pricing held as structured records, with rules that resolve the right price and availability on every request.',
          tags: ['Catalog', 'Pricing'],
          status: 'ACTIVE',
        },
        {
          code: 'CAP.02',
          title: 'Payment workflows',
          body: 'Authorisation, capture, and settlement modelled as explicit states, so payment calculations and reconciliation are never guessed at after the fact.',
          tags: ['Payments', 'Settlement'],
          status: 'ACTIVE',
        },
        {
          code: 'CAP.03',
          title: 'Admin surface',
          body: 'A role-scoped control panel over orders, inventory, and records — operational visibility without exposing the underlying core.',
          tags: ['Admin', 'Roles'],
          status: 'ACTIVE',
        },
        {
          code: 'CAP.04',
          title: 'Throughput control',
          body: 'Backpressure, queueing, and idempotent transitions keep the pipeline predictable under spikes instead of degrading silently.',
          tags: ['Throughput', 'Resilience'],
          status: 'ACTIVE',
        },
      ],
    },
    {
      type: 'split',
      scene: 'topographic-lines',
      eyebrow: 'Lineage',
      code: 'WRK.01',
      title: 'This lineage traces back to Commerce System I.',
      body: [
        `The patterns here were proven in ${commerceSystemI.name} — the first Hanoryx system, handling catalog, transactions, and payment workflows in production.`,
        'What shipped as a single deployed storefront became the reference architecture every later commerce surface inherits. The work record sits in the Work codex.',
      ],
      asideLabel: 'REFERENCE',
      asideCode: 'WRK.MAP',
      points: [
        { k: 'CODE', v: commerceSystemI.code },
        { k: 'TYPE', v: commerceSystemI.type },
        { k: 'STATUS', v: commerceSystemI.status },
      ],
    },
    { type: 'cta', scene: 'polar-radar', eyebrow: 'Open a channel', title: 'Discuss a commerce build.' },
  ],
};

export default page;
