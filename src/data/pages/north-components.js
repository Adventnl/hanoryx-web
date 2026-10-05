import { kit, kitFamilies } from '../kit';

const sum = (pick) => kit.reduce((n, k) => n + k[pick].length, 0);

const find = (id, why) => ({ id, why });

const page = {
  key: 'north/components',
  title: 'Interface Components',
  accent: '#ff3333',
  aliases: ['ui kit', 'design system', 'component library', 'storybook', 'form controls', 'buttons', 'inputs', 'dialogs', 'tables', 'accessible components', 'patterns'],
  hero: {
    scene: 'interface-lab-shape',
    intensity: 'hero',
    eyebrow: 'Development / Components',
    title: 'The interface, in working parts.',
    intro:
      'The pieces this site’s tools and pages are made from: fields, navigation, feedback, data display, overlays and layout. Each is shown live — press it, type in it, tab through it — with the code to use it, its props and the keys it answers to.',
    code: 'KIT.00',
    status: `${kit.length} COMPONENTS`,
    actions: [
      { label: 'Find a component', to: '/north/components#find' },
      { label: 'Which one do I need?', to: '/north/components#pick', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'kitIndex',
      anchor: 'find',
      railLabel: 'Find a component',
      scene: 'privacy-quiet-grid',
      minHeight: 640,
      eyebrow: 'The kit',
      title: 'Six families. Search them, or open one.',
      intro: 'Type a name, or what you need to do — “sort”, “focus”, “date” — and the matching components appear, each linking to its live example.',
      note: 'Sixty-odd components is a lot to hold in your head; the search and the picker at the foot of the page are there so you do not have to.',
    },
    {
      type: 'split',
      anchor: 'promises',
      railLabel: 'What each promises',
      scene: 'architectural-grid',
      eyebrow: 'What every component promises',
      code: 'KIT.RULES',
      title: 'Built to be used, not only looked at.',
      body: [
        'A component library is easy to make look good in a screenshot. These are held to a harder standard. Every one can be operated with a keyboard alone, has a name that assistive technology can read, takes its colours, spacing and motion from the same tokens as the rest of the site, and stops moving for visitors who ask it to.',
        'None of them is clever. Where the browser already has a control that does the job — a select, a radio, a range, a checkbox — the component wraps it rather than replacing it, so the platform’s own behaviour (autofill, the phone’s picker, form submission, the screen reader’s announcements) comes with it. Where there is no native control — a combobox, a tree, a toolbar — the component follows the published ARIA pattern, key for key.',
      ],
      asideLabel: 'FIVE PROMISES',
      asideCode: 'KIT.05',
      points: [
        { k: 'OPERABLE', v: 'Every control works from the keyboard' },
        { k: 'NAMED', v: 'A text name for everything that is not text' },
        { k: 'TOKENISED', v: 'Colour, space and motion come from the tokens' },
        { k: 'CALM', v: 'Motion stops when you ask it to' },
        { k: 'HONEST', v: 'Sample data says it is sample data' },
      ],
    },
    {
      type: 'stats',
      anchor: 'counts',
      railLabel: 'In numbers',
      scene: 'topographic-lines',
      eyebrow: 'In numbers',
      title: 'What is documented.',
      items: [
        { label: 'Components', value: kit.length, note: 'Each with a live example.' },
        { label: 'Families', value: kitFamilies.length, note: 'Inputs to layout.' },
        { label: 'Props described', value: sum('props'), note: 'Type, default and purpose.' },
        { label: 'Keys documented', value: sum('keys'), note: 'What each one answers to.' },
      ],
    },
    {
      type: 'process',
      anchor: 'joining',
      railLabel: 'Joining the kit',
      scene: 'circuit-trace',
      eyebrow: 'How a component joins the kit',
      title: 'Four steps, and the last is the one that matters.',
      steps: [
        { step: '01', title: 'Write it', body: 'A file in components/kit, using the tokens for every colour, space and duration, and a native element wherever there is one.' },
        { step: '02', title: 'Describe it', body: 'An entry in data/kit.js: what it is for, a usage snippet, each prop, each key and what to know. These pages and the site search read it.' },
        { step: '03', title: 'Show it', body: 'A live example in components/kit/demos, with sample data that says it is sample data.' },
        { step: '04', title: 'Operate it', body: 'One test presses every control on every page, another runs an accessibility audit over it, a third checks the behaviours that matter. A component nobody operated is not finished.' },
      ],
    },
    {
      type: 'closer',
      kind: 'kitPicker',
      anchor: 'pick',
      scene: 'topology-pulse',
      tag: 'End of the interface components',
      minHeight: 760,
      title: 'Which component do you need?',
      lede: 'Say what you are trying to do, then narrow it. The page names the one or two components that fit, says why, and takes you to each in its gallery.',
      goals: [
        {
          id: 'collect', label: 'Collect something', ask: 'What kind of thing?',
          choices: [
            { label: 'A few words or a number', picks: [find('textField', 'One line with a label, a hint and an error that is announced. Add a prefix or suffix for a unit.'), find('numberField', 'If it is a quantity with a range: arrows step it, typing is free, and it is clamped when you leave.')] },
            { label: 'One choice from a few', picks: [find('radioGroup', 'Native radios: the arrows choose, and a screen reader says “2 of 4”.'), find('segmented', 'When the choices are short and few and the control should read as one piece.')] },
            { label: 'One choice from many', picks: [find('selectField', 'Native, so a phone gives its own picker. The first thing to try.'), find('combobox', 'When the list is long enough that people will want to type to find their answer.')] },
            { label: 'Several things', picks: [find('checkbox', 'Each option is its own box; a parent box can show the mixed state.'), find('tagInput', 'When people supply their own words rather than choosing from a list.')] },
            { label: 'A file', picks: [find('fileDrop', 'Drag and drop, with a real file button underneath for everyone else.')] },
          ],
        },
        {
          id: 'move', label: 'Help people move', ask: 'How?',
          choices: [
            { label: 'Show where they are', picks: [find('breadcrumbs', 'A trail back up the site, with the current page marked.'), find('onThisPage', 'For a long page: the section you are in is marked as you read.')] },
            { label: 'Step through a process', picks: [find('stepper', 'The steps in order and which one you are on, written out for a screen reader.'), find('pagination', 'For a long list split into pages: first, last and the neighbours.')] },
            { label: 'Switch between views', picks: [find('tabs', 'When each choice shows a different panel of content.'), find('segmented', 'When each choice only changes a setting or a nearby demonstration.')] },
            { label: 'Offer a set of actions', picks: [find('dropdownMenu', 'A button that opens a menu of actions, with typeahead and Escape.'), find('toolbar', 'A row of tools that is one tab stop, with toggles.')] },
            { label: 'List the pages of a section', picks: [find('sideNav', 'Grouped links that fold, with the current page marked.')] },
          ],
        },
        {
          id: 'tell', label: 'Tell someone something', ask: 'How much does it matter?',
          choices: [
            { label: 'It needs no answer', picks: [find('toast', 'A brief message in a corner that leaves by itself and never takes focus.'), find('statusDot', 'A live state, written out beside its colour.')] },
            { label: 'It is about this part of the page', picks: [find('alert', 'In the flow, with a tone that is also an icon and a word.')] },
            { label: 'It is about the whole page', picks: [find('banner', 'Runs the width of its container, with one action and a dismiss.')] },
            { label: 'Something is loading', picks: [find('spinner', 'When the wait is short and you cannot say how short.'), find('skeleton', 'When you know the shape of what is coming and want nothing to jump.'), find('progressBar', 'When you know how far along it is.')] },
            { label: 'There is nothing to show', picks: [find('emptyState', 'Say why, and say what to do next.')] },
          ],
        },
        {
          id: 'show', label: 'Show information', ask: 'What shape is it?',
          choices: [
            { label: 'Records with several fields', picks: [find('dataTable', 'Sortable, selectable, and scrollable inside a named region.')] },
            { label: 'Facts about one thing', picks: [find('descriptionList', 'Labels and values, paired in the markup.'), find('stat', 'For the one number that matters, with how it moved.')] },
            { label: 'A trend', picks: [find('sparkline', 'Direction at a glance, with a text description of the range.')] },
            { label: 'A few values to compare', picks: [find('barList', 'Length is easy to compare, and the figures stay as text.'), find('meter', 'One quantity inside a known range, with its zone in words.')] },
            { label: 'Things in order', picks: [find('timeline', 'An ordered list with a line and markers.')] },
            { label: 'Things inside things', picks: [find('tree', 'One tab stop, arrow keys to walk it.')] },
            { label: 'Code', picks: [find('codeBlock', 'With a copy button, optional line numbers and light colouring.')] },
          ],
        },
        {
          id: 'attention', label: 'Ask for attention', ask: 'How much?',
          choices: [
            { label: 'A hint on hover or focus', picks: [find('tooltip', 'A short description that adds detail and never replaces a label.'), find('hoverCard', 'A richer preview of where a link goes.')] },
            { label: 'A small panel on demand', picks: [find('popover', 'Opens under a button; not modal, so Tab moves on.')] },
            { label: 'A decision before going on', picks: [find('dialog', 'Takes over until it is dealt with; traps focus and gives it back.'), find('confirmDialog', 'For “are you sure?”, with buttons that say what they do.')] },
            { label: 'A side panel with context', picks: [find('drawer', 'A dialog that runs the full height from an edge.')] },
          ],
        },
        {
          id: 'arrange', label: 'Arrange content', ask: 'What do you need?',
          choices: [
            { label: 'Group related content', picks: [find('card', 'A surface with an eyebrow, a heading and a foot.'), find('callout', 'A remark set apart from the text: a note, a tip, a warning.')] },
            { label: 'Lay things out', picks: [find('stack', 'A column with an even gap.'), find('cluster', 'A row that wraps.'), find('grid', 'As many columns as fit, with no breakpoint.')] },
            { label: 'A long text', picks: [find('prose', 'A reading column about 68 characters wide.'), find('quote', 'A pull quote with its source.'), find('figure', 'A picture and its caption, kept together.')] },
            { label: 'Hide detail until asked', picks: [find('disclosure', 'One section that opens and closes properly.')] },
            { label: 'Hold the shape of an image', picks: [find('aspectRatio', 'Reserves the room before the picture arrives.')] },
          ],
        },
      ],
      onward: [
        { label: 'Interface lab', to: '/north/interface-lab' },
        { label: 'Design tokens', to: '/north/design-tokens' },
        { label: 'Accessible by default', to: '/north/accessibility' },
      ],
    },
  ],
};

export default page;
