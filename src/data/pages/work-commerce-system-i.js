import { commerceSystemRecord as record } from '../systems';

const page = {
  key: 'work/commerce-system-i',
  title: 'Commerce System I',
  accent: '#ff3333',
  hero: {
    scene: 'commerce-pipeline',
    intensity: 'hero',
    eyebrow: `Work // ${record.code}`,
    title: 'A commerce system in the public concept record.',
    intro:
      'This existing page describes a commerce architecture spanning catalog, transactions, and payment workflows. Its deployment status is not publicly verified.',
    code: 'NODE.CS1',
    status: 'DESCRIBED',
    actions: [
      { label: 'All work', to: '/work', variant: 'outline' },
      { label: 'Commerce infrastructure', to: '/systems/commerce-infrastructure' },
    ],
  },
  blocks: [
    {
      type: 'split',
      scene: 'transaction-wave',
      eyebrow: 'What it is',
      code: 'CS1.01',
      title: 'The proposed commerce layers.',
      body: [
        'The public description models a catalog as structured product, variant, and pricing records.',
        'Its workflow diagram shows an intended path from checkout through authorisation, capture, and reconciliation. The diagram is illustrative, not a report on a live deployment.',
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
      title: 'An illustrative order workflow.',
      intro:
        'Four stages describe the proposed state model. They should not be read as verified production behavior.',
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
        'A summary of the existing public concept description. Implementation details and operational status are not public.',
      rows: [
        { k: 'CODE', v: record.code },
        { k: 'NAME', v: record.name },
        { k: 'TYPE', v: record.type },
        { k: 'STATUS', v: record.status },
        { k: 'CATALOG', v: 'Structured product, variant, and pricing model' },
        { k: 'PIPELINE', v: 'Four-stage order path: intake, validate, fulfil, settle' },
        { k: 'PAYMENTS', v: 'Explicit authorise, capture, and reconcile states' },
        { k: 'LEDGER', v: 'Single settlement ledger reconciled per order' },
        { k: 'SOURCE', v: 'Existing public site description' },
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
