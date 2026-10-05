import { familyPage } from '../kitPages';

export default familyPage({
  family: 'data',
  key: 'north/components/data',
  title: 'Data Display Components',
  aliases: ['data table', 'sortable table', 'tree view', 'code block', 'sparkline', 'bar chart', 'badge', 'chip', 'avatar', 'stat', 'timeline', 'description list'],
  code: 'KIT.04',
  hero: {
    scene: 'architecture-layer',
    crumb: 'Data display',
    title: 'Facts you can read, sort and trust.',
    intro:
      'Eleven ways to show information — a badge, a chip, an avatar, a number, a table, a fact sheet, a timeline, a tree, some code, a trend and a set of bars — each one text first and picture second.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Eleven ways to show what is true, live.',
    intro: 'Sort the table, select rows, walk the tree with the arrow keys, copy the code. Everything shown is sample data and says so.',
  },
  essay: {
    rail: 'Text first',
    scene: 'isometric-module',
    eyebrow: 'Text first, picture second',
    code: 'DAT.01',
    title: 'A chart is a claim made visible.',
    body: [
      'Whether a chart is true is a matter for the data. Whether it can be read is a matter for the component. So every display here keeps its numbers and words in the page as real text — in a table, a list or a description — and treats the drawing as a second way in, not the only one.',
      'That one decision is what lets a screen reader, a search engine, a printout and a person with colour blindness all get the same facts. It also keeps the component honest: if the drawing and the text ever disagreed, you would see it.',
    ],
    asideLabel: 'THE SAME FACTS, FIVE WAYS',
    asideCode: 'DAT.5',
    points: [
      { k: 'SCREEN READER', v: 'Reads the table, list or description' },
      { k: 'SEARCH', v: 'Finds the words, because they are words' },
      { k: 'PRINT', v: 'Loses nothing, because nothing was colour-only' },
      { k: 'COLOUR BLIND', v: 'Reads the figure beside the bar' },
      { k: 'KEYBOARD', v: 'Sorts, selects and walks without a mouse' },
    ],
  },
  rules: {
    scene: 'voronoi-cell',
    title: 'For showing information.',
    rows: [
      { k: 'LINING FIGURES', v: 'Numbers are set in lining figures, so a 1 never reads as a capital I and columns of figures line up.' },
      { k: 'SAY WHAT IT IS COMPARED WITH', v: 'Up 4 percent on what? A change with no baseline is decoration.' },
      { k: 'SORT STATES ARE SPOKEN', v: 'Sortable headers say ascending or descending. They are buttons, not clickable text.' },
      { k: 'SCROLL IN A REGION', v: 'A wide table scrolls inside a focusable region instead of breaking the page, and the region has a name.' },
      { k: 'SAMPLE DATA SAYS SO', v: 'Examples label themselves. Nothing here pretends to measure anything real.' },
      { k: 'ONE PICTURE, ONE POINT', v: 'A sparkline shows direction, a bar list shows rank, a table shows records. Pick the one that answers the question.' },
    ],
  },
  closer: {
    kind: 'dataShape',
    anchor: 'shape',
    scene: 'architectural-grid',
    tag: 'End of the data display components',
    minHeight: 780,
    title: 'What shape is your data?',
    lede: 'Choose the shape the information has and the page shows the component that suits it, drawn with sample data, with the reason — and the usual wrong choice and why it fails.',
    shapes: [
      { id: 'trend', label: 'A trend over time', sees: 'One measure, many moments', use: 'Sparkline', to: '/north/components/data#sparkline', why: 'A single line shows direction at a glance and takes almost no room, so it fits in a row, a card or a sentence. Give it a text description so the shape is never the only way in.', notThis: 'A full chart with axes, gridlines and a legend, when all anyone needs is better or worse.' },
      { id: 'compare', label: 'A few values to compare', sees: 'Four or five things, one measure', use: 'BarList', to: '/north/components/data#barList', why: 'Length is the easiest thing for the eye to compare, and a list keeps the label and the figure beside the bar, so the numbers stay real text.', notThis: 'A pie or donut. Angles and areas are hard to compare, and the labels end up far from the slices.' },
      { id: 'records', label: 'Records with several fields', sees: 'Rows and columns', use: 'DataTable', to: '/north/components/data#dataTable', why: 'When people need to find, sort and compare rows, a table is the honest shape. Headers are real headers, so a screen reader can say which column a cell is in.', notThis: 'A grid of cards. Cards hide the columns, and with them the ability to compare.' },
      { id: 'facts', label: 'Facts about one thing', sees: 'Labels and values', use: 'DescriptionList', to: '/north/components/data#descriptionList', why: 'A term and its detail, paired in the markup and not only side by side on the screen.', notThis: 'Bold text and a colon in a paragraph. It looks the same and means nothing to software.' },
      { id: 'steps', label: 'Things in an order', sees: 'A sequence', use: 'Timeline', to: '/north/components/data#timeline', why: 'An ordered list, so the order is announced. The line and the markers only repeat what the list already says.', notThis: 'Dates you do not have. If the order is known and the dates are not, say phases — this site does.' },
      { id: 'nested', label: 'Things inside things', sees: 'A hierarchy', use: 'Tree', to: '/north/components/data#tree', why: 'One tab stop, arrow keys to walk it, and the level and position announced for every item.', notThis: 'Nested lists of links where every item is a tab stop: forty Tabs to get past a folder.' },
      { id: 'one', label: 'One important number', sees: 'A single figure', use: 'Stat', to: '/north/components/data#stat', why: 'Large, labelled and, if you have it, compared with something — in words.', notThis: 'A gauge, when a number would do.' },
    ],
    onward: [
      { label: 'Overlay components', to: '/north/components/overlays' },
      { label: 'Audit trails that answer questions', to: '/insights/audit-trails' },
    ],
  },
});
