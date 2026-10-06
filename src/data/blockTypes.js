/* Every kind of page block, what it is and the data it takes. This is the one list behind the
   catalogue and the figures on north/blocks and the check in qa/endings.mjs, which fails if a
   block here has no component in components/page/PageBlocks.jsx, or the other way round.
   The first eight were built for this site and each has a motion identity of its own; the
   last twelve are made from the interface kit, take only data and are meant to be used again. */
export const blockTypes = [
  { type: 'split', what: 'A heading and prose on one side, a short list of labelled points on the other', takes: 'eyebrow, title, body[], points[{ k, v }]' },
  { type: 'cards', what: 'A grid, rail or bento of cards, each with a glyph that redraws, linking to a page', takes: 'items[{ code, title, body, to, tags, status }], variant' },
  { type: 'process', what: 'Numbered steps on a rail that fills as you scroll', takes: 'steps[{ step, title, body }]' },
  { type: 'modules', what: 'Columns that lens, or a ledger of rows that decode', takes: 'groups[{ label, items[] }] or rows[{ k, v }]' },
  { type: 'stats', what: 'Large figures, only of things the site can stand behind', takes: 'items[{ value, suffix, label }]' },
  { type: 'manifesto', what: 'A statement that lights word by word as you scroll, with a marquee', takes: 'lines[], marquee[]' },
  { type: 'signature', what: 'A composition that belongs to one page, loaded when it is needed', takes: 'kind, and whatever that composition takes' },
  { type: 'closer', what: 'The last block of a page: a composition that plays the page out', takes: 'kind, tag, title, lede, onward[]' },
  { type: 'callout', what: 'One remark set apart from the text: a note, a tip, a warning', takes: 'tone, heading, body[], list[]' },
  { type: 'table', what: 'Records in rows and columns, sortable if you ask', takes: 'caption, head[], rows[[]], sortable' },
  { type: 'timeline', what: 'Things in the order they happen, down a line', takes: 'items[{ when, title, body, done }]' },
  { type: 'faq', what: 'Questions and answers, each a disclosure', takes: 'items[{ q, a[] }], openFirst' },
  { type: 'compare', what: 'Two or three ways of looking at a choice, side by side', takes: 'columns[{ label, title, tone, items[] }], verdict' },
  { type: 'snippet', what: 'A piece of code or data with a file name and a copy button', takes: 'code, language, filename, lines, notes[]' },
  { type: 'tabs', what: 'Several short views of one subject, one at a time', takes: 'tabs[{ id, label, body[], list[] }]' },
  { type: 'quote', what: 'A pull quote with its source', takes: 'quote, cite, context' },
  { type: 'checklist', what: 'A list to tick through, held in the page only', takes: 'items[{ label, hint }], done' },
  { type: 'facts', what: 'A fact sheet: labels and their values', takes: 'items[{ term, detail }], stacked' },
  { type: 'links', what: 'Where to go next: cards that each hold one link', takes: 'items[{ title, body, to, label }]' },
  { type: 'numbers', what: 'A row of figures with how they moved, and a line if there is a series', takes: 'items[{ label, value, unit, change, series[] }], note' },
];
