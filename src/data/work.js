/* ============================================================
   WORK — the selected company work, as one source for every surface that
   mentions it (home portals, work index, timeline, case-study cross-links).

   Rules for this file:
   - Two PRIMARY projects (Musebase, YK Engine) and two quieter SUPPORTING
     studies (an unnamed customer-facing product, an internal CRM/data system).
   - Describe only what is known. No clients, dates, measured outcomes, or
     operational detail; the supporting studies stay deliberately unnamed.
   - YK Engine is the only project that links to a GitHub repository.
   ============================================================ */

export const YK_ENGINE_REPO = 'https://github.com/Adventnl/YK-Engine';

export const workItems = [
  {
    id: 'musebase',
    to: '/work/musebase',
    tier: 'primary',
    name: 'Musebase',
    kind: 'Advanced coordination application',
    tagline: 'People, time and information — in one shared picture.',
    summary:
      'Musebase is an advanced coordination application. It brings scheduling, communication and records into one environment, with access scoped to each role.',
    glyph: 'layers',
    code: 'WRK.01',
  },
  {
    id: 'yk-engine',
    to: '/work/yk-engine',
    tier: 'primary',
    name: 'YK Engine',
    kind: 'Proprietary 2D engine',
    tagline: 'Author in the editor. Run in the player.',
    summary:
      'YK Engine is a proprietary 2D engine with an editor, a standalone player and project export tooling.',
    glyph: 'engine',
    code: 'WRK.02',
  },
  {
    id: 'customer-product',
    to: '/work/customer-product',
    tier: 'supporting',
    name: 'Customer product',
    kind: 'Customer-facing product',
    tagline: 'From first look to a confirmed purchase.',
    summary:
      'A customer-facing product built around the shopping and transaction experience. Unnamed by design.',
    glyph: 'cart',
    code: 'WRK.03',
  },
  {
    id: 'internal-crm',
    to: '/work/internal-crm',
    tier: 'supporting',
    name: 'Internal CRM',
    kind: 'Internal data system',
    tagline: 'Designed for very large data sets.',
    summary:
      'An internal CRM and data system designed for very large data sets. Internal by design; not a public product.',
    glyph: 'database',
    code: 'WRK.04',
  },
];

export const primaryWork = workItems.filter((w) => w.tier === 'primary');
export const supportingWork = workItems.filter((w) => w.tier === 'supporting');
