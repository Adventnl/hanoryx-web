/* ============================================================
   COMPANY CHRONOLOGY

   Exact dates are not published, so this is told in PHASES — each one a stage
   of the company's work, in the order it is told here. It is not a release
   history and nothing in it is derived from repository, commit or deployment
   dates. When a date is approved for publication, add it to a phase as `when`.
   ============================================================ */

export const timelineIntro = {
  eyebrow: 'Company chronology',
  title: 'The company, told in phases.',
  body: 'Dates are not published. Each phase describes a stage of the work, in the order it is told here — a map of how the company has grown, not a release history.',
};

export const timelinePhases = [
  {
    id: 'foundations',
    code: 'PHASE.01',
    title: 'Foundations',
    headline: 'Structure first.',
    body: 'Online systems begin beneath the surface: the data model, the boundaries and the roles. The interface comes after the foundations are settled.',
    glyph: 'stack',
    status: 'Dates not published',
  },
  {
    id: 'coordination',
    code: 'PHASE.02',
    title: 'Coordination',
    headline: 'Musebase.',
    body: 'An advanced coordination application that brings people, time and information into one shared environment.',
    glyph: 'layers',
    to: '/work/musebase',
    status: 'Dates not published',
  },
  {
    id: 'customer-experience',
    code: 'PHASE.03',
    title: 'Customer experience',
    headline: 'A product for customers.',
    body: 'A customer-facing product shaped around the shopping and transaction experience, from first look to confirmation.',
    glyph: 'cart',
    to: '/work/customer-product',
    status: 'Dates not published',
  },
  {
    id: 'data-at-scale',
    code: 'PHASE.04',
    title: 'Data at scale',
    headline: 'An internal data system.',
    body: 'An internal CRM and data system designed for very large data sets — kept internal, and kept quiet.',
    glyph: 'database',
    to: '/work/internal-crm',
    status: 'Dates not published',
  },
  {
    id: 'engine',
    code: 'PHASE.05',
    title: 'Engine',
    headline: 'YK Engine.',
    body: 'A proprietary 2D engine with an editor, a standalone player and export tooling.',
    glyph: 'engine',
    to: '/work/yk-engine',
    status: 'Dates not published',
  },
  {
    id: 'now',
    code: 'PHASE.06',
    title: 'Now',
    headline: 'Live.',
    body: 'The company, its work and this site are live. New phases are added here as they are ready to be told.',
    glyph: 'pulse',
    status: 'Live',
    live: true,
  },
];
