/* The interface kit, as data — the catalogue behind the Components pages. Each
   entry describes one component in `src/components/kit/`: what it is for, how to
   use it, its props, the keys it answers to and what to know about it.

     id        the component's name, camel-cased
     family    inputs | navigation | feedback | data | overlays | content
     demo      the live example (components/kit/demos), by export name
     code      a usage snippet (kept out of the site search by its key)
     props     [{ k: name, v: 'type · default · what it does' }]
     keys      [{ k: key, v: what it does }]
     notes     things to know, in sentences

   The page text is plain data so the site search can find it. */

export const kitFamilies = [
  { id: 'inputs', name: 'Inputs', to: '/north/components/inputs', blurb: 'Fields, choices and switches. Each is a real form control underneath, so keyboards, autofill and screen readers behave as they do everywhere else.' },
  { id: 'navigation', name: 'Navigation', to: '/north/components/navigation', blurb: 'Knowing where you are and moving: trails, pages, steps, tabs, menus and a table of contents that follows you.' },
  { id: 'feedback', name: 'Feedback', to: '/north/components/feedback', blurb: 'Telling people what is happening, how far along it is and what to do about it — without relying on colour or on being looked at.' },
  { id: 'data', name: 'Data display', to: '/north/components/data', blurb: 'Facts, records and code: tables you can sort, trees you can walk, small charts that describe themselves.' },
  { id: 'overlays', name: 'Overlays', to: '/north/components/overlays', blurb: 'Things that sit above the page for a moment: hints, panels, previews and dialogs that trap focus and give it back.' },
  { id: 'content', name: 'Content and layout', to: '/north/components/content', blurb: 'The surfaces text sits on, and the primitives that arrange everything else — a reading column, a grid that needs no breakpoint.' },
];

export const kit = [
  /* ------------------------------------------------------------------ inputs */
  {
    id: 'field', family: 'inputs', name: 'Field', demo: 'FieldDemo',
    summary: 'The label, hint and error that every field shares, wired up so a screen reader hears them. The control you put inside it receives its id, aria-describedby and aria-invalid.',
    code: "import { Field } from '../kit';\n\n<Field label=\"Email\" hint=\"We reply from this address.\" error={error} required>\n  {(props) => <input {...props} type=\"email\" />}\n</Field>",
    props: [
      { k: 'label', v: 'string · — · The visible label, tied to the control.' },
      { k: 'hint', v: 'string · — · Help text, read after the label. Replaced by the error while one is showing.' },
      { k: 'error', v: 'string · — · What is wrong. Announced as an alert when it appears.' },
      { k: 'required', v: 'boolean · false · Adds “required” to the label.' },
      { k: 'children', v: 'function · — · Receives { id, aria-describedby, aria-invalid } and returns the control.' },
    ],
    keys: [{ k: 'Tab', v: 'Moves focus to the control it wraps; the label itself is not a stop.' }],
    notes: ['An error replaces the hint, so the described-by pointer never points at something that is not there.', 'Put all three props on the one element that takes focus.', 'Every other input in the kit is built on this.'],
  },
  {
    id: 'textField', family: 'inputs', name: 'TextField', demo: 'TextFieldDemo',
    summary: 'A single-line text field with a label, hint and error, and an optional prefix and suffix inside the border for a currency, a unit or an @.',
    code: "import { TextField } from '../kit';\n\n<TextField label=\"Budget\" prefix=\"$\" suffix=\"per month\" inputMode=\"numeric\" value={v} onChange={(e) => setV(e.target.value)} />",
    props: [
      { k: 'label', v: 'string · — · The visible label.' },
      { k: 'hint, error', v: 'string · — · Help text and the problem; see Field.' },
      { k: 'prefix, suffix', v: 'node · — · Drawn inside the border, before and after the input.' },
      { k: 'type', v: 'string · "text" · Any input type that holds text.' },
      { k: '...input', v: 'attributes · — · Everything else goes to the input: value, defaultValue, onChange, placeholder, inputMode, readOnly, disabled.' },
    ],
    keys: [{ k: 'Tab / Shift+Tab', v: 'Moves into and out of the field.' }],
    notes: ['Controlled (value and onChange) or uncontrolled (defaultValue) — it is a plain input.', 'Autocomplete is off by default; turn it back on for names and addresses with the autoComplete attribute.', 'Disabled and read-only look different on purpose: read-only text can still be selected and copied.'],
  },
  {
    id: 'textArea', family: 'inputs', name: 'TextArea', demo: 'TextAreaDemo',
    summary: 'A multi-line field that counts. Going over the limit turns the count red and marks the field invalid; it never cuts off what you typed.',
    code: "import { TextArea } from '../kit';\n\n<TextArea label=\"Describe the change\" maxLength={140} hint=\"Two sentences is plenty.\" />",
    props: [
      { k: 'label, hint, error', v: 'string · — · As for every field.' },
      { k: 'maxLength', v: 'number · — · The most characters expected. Not enforced by truncation.' },
      { k: 'value, defaultValue, onChange', v: 'string · "" · Controlled or uncontrolled; onChange receives the text.' },
      { k: 'rows', v: 'number · 4 · Starting height.' },
    ],
    keys: [{ k: 'Tab', v: 'Leaves the field (Tab is not a character here).' }],
    notes: ['The count is decorative; the over-the-limit message is announced as an alert.', 'The field can be resized vertically by the user.'],
  },
  {
    id: 'numberField', family: 'inputs', name: 'NumberField', demo: 'NumberFieldDemo',
    summary: 'A number with a minus and a plus either side. The value is clamped to its range when you leave the field, never while you are typing.',
    code: "import { NumberField } from '../kit';\n\n<NumberField label=\"Seats\" min={1} max={12} value={n} onChange={setN} />",
    props: [
      { k: 'value, defaultValue, onChange', v: 'number | null · null · onChange receives a number, or null while the box is empty.' },
      { k: 'min, max', v: 'number · ±Infinity · The range; the buttons stop at the ends.' },
      { k: 'step', v: 'number · 1 · How much a press or an arrow key changes it; decimals are kept tidy.' },
      { k: 'suffix', v: 'node · — · A unit after the number.' },
    ],
    keys: [{ k: '↑ / ↓', v: 'Step the value up or down.' }, { k: 'Typing', v: 'Free-form; clamped on blur.' }],
    notes: ['The plus and minus buttons are not tab stops: the arrow keys do their job for keyboard users.', 'Values are rounded to the precision of the step, so 1.25 + 0.05 is 1.3 and not 1.3000000000000003.'],
  },
  {
    id: 'searchField', family: 'inputs', name: 'SearchField', demo: 'SearchFieldDemo',
    summary: 'A search box with a clear button and, when you give it a count, a result count that is read out as it changes.',
    code: "import { SearchField } from '../kit';\n\n<SearchField label=\"Find a term\" value={q} onChange={setQ} count={hits.length} noun=\"terms\" />",
    props: [
      { k: 'value, defaultValue, onChange', v: 'string · "" · onChange receives the text.' },
      { k: 'count', v: 'number · — · Results found; shown and announced.' },
      { k: 'noun', v: 'string · "results" · What is being counted; the singular is made by dropping a trailing s.' },
      { k: 'placeholder', v: 'string · "Search…" · A hint inside the box — not a replacement for the label.' },
    ],
    keys: [{ k: 'Esc', v: 'Clears the box and keeps focus in it.' }],
    notes: ['It does not search anything itself; filter your own list from the text it gives you.', 'The count is a polite live region.'],
  },
  {
    id: 'passwordField', family: 'inputs', name: 'PasswordField', demo: 'PasswordFieldDemo',
    summary: 'A password field with a show/hide toggle and a rough strength meter. Everything happens in the page; nothing is sent anywhere.',
    code: "import { PasswordField } from '../kit';\n\n<PasswordField label=\"New password\" hint=\"At least 12 characters is a good start.\" />",
    props: [
      { k: 'label', v: 'string · "Password" · The visible label.' },
      { k: 'value, defaultValue, onChange', v: 'string · "" · onChange receives the text.' },
      { k: 'meter', v: 'boolean · true · Show the strength meter.' },
    ],
    keys: [{ k: 'Tab', v: 'Moves to the show/hide button after the field.' }],
    notes: ['The meter scores length first and variety second and takes off common patterns; it is a nudge, not a guarantee.', 'The strength is written out in words as well as drawn, and announced politely.', 'autoComplete is “new-password” so password managers offer to generate one.'],
  },
  {
    id: 'selectField', family: 'inputs', name: 'SelectField', demo: 'SelectFieldDemo',
    summary: 'A native select, styled. Native on purpose: the platform’s own keyboard handling, its picker on a phone and its screen-reader behaviour come for free.',
    code: "import { SelectField } from '../kit';\n\n<SelectField label=\"Environment\" options={['Development', 'Staging', 'Production']} />",
    props: [
      { k: 'options', v: 'array · [] · Strings, or { value, label, disabled }.' },
      { k: 'value, defaultValue, onChange', v: 'string · "" · onChange receives the chosen value.' },
      { k: 'placeholder', v: 'string · — · A disabled first option shown until something is chosen.' },
    ],
    keys: [{ k: '↑ / ↓', v: 'Change the option (the platform’s own behaviour).' }, { k: 'Space / Enter', v: 'Open the list.' }, { k: 'Type a letter', v: 'Jump to an option that starts with it.' }],
    notes: ['Use a Combobox when the list is long enough that people will want to type.'],
  },
  {
    id: 'combobox', family: 'inputs', name: 'Combobox', demo: 'ComboboxDemo',
    summary: 'An editable combobox: type to filter, move through the matches with the arrow keys, choose with Enter. Focus stays in the input; the highlighted option is named with aria-activedescendant.',
    code: "import { Combobox } from '../kit';\n\n<Combobox label=\"Time zone\" options={zones} value={zone} onChange={setZone} />",
    props: [
      { k: 'options', v: 'array · [] · Strings, or { value, label }.' },
      { k: 'value, defaultValue, onChange', v: 'string · "" · onChange receives the chosen value, not the typed text.' },
      { k: 'onSelect', v: 'function · — · Called with the chosen option.' },
      { k: 'emptyText', v: 'string · "Nothing matches." · Shown when the typed text matches nothing.' },
    ],
    keys: [{ k: '↓ / ↑', v: 'Open the list, then move through it.' }, { k: 'Home / End', v: 'First and last match.' }, { k: 'Enter', v: 'Choose the highlighted match.' }, { k: 'Esc', v: 'Close the list; pressed again, clear the field.' }, { k: 'Tab', v: 'Close the list and move on.' }],
    notes: ['The ARIA 1.2 list-autocomplete pattern: role combobox on the input, listbox beside it, no focus movement.', 'The part of each label that matched is marked.', 'The list is only in the page while there are matches, so aria-controls never points at nothing.'],
  },
  {
    id: 'checkbox', family: 'inputs', name: 'Checkbox', demo: 'CheckboxDemo',
    summary: 'A checkbox with room for a hint. It is a real input — the square is drawn beside it — and it supports the indeterminate “some of them” state of a parent box.',
    code: "import { Checkbox } from '../kit';\n\n<Checkbox label=\"Send the weekly summary\" checked={on} onChange={setOn} />",
    props: [
      { k: 'label', v: 'node · — · The text beside the box.' },
      { k: 'hint', v: 'string · — · A smaller line under the label.' },
      { k: 'checked, defaultChecked, onChange', v: 'boolean · — · onChange receives (checked, event).' },
      { k: 'indeterminate', v: 'boolean · false · The mixed state of a parent whose children differ.' },
    ],
    keys: [{ k: 'Space', v: 'Toggles it.' }],
    notes: ['Indeterminate is a display state only: it becomes checked or unchecked when pressed.', 'The whole label is the click target.'],
  },
  {
    id: 'radioGroup', family: 'inputs', name: 'RadioGroup', demo: 'RadioGroupDemo',
    summary: 'A group of real radio buttons under a legend: the arrow keys move and choose, Tab leaves the group, and a screen reader says “2 of 4”.',
    code: "import { RadioGroup } from '../kit';\n\n<RadioGroup legend=\"Support level\" value={plan} onChange={setPlan} options={[{ value: 'self', label: 'Self-serve' }, { value: 'team', label: 'Team', hint: 'A named contact.' }]} />",
    props: [
      { k: 'legend', v: 'string · — · Names the group.' },
      { k: 'options', v: 'array · [] · { value, label, hint?, disabled? }.' },
      { k: 'value, defaultValue, onChange', v: 'string · — · onChange receives the chosen value.' },
      { k: 'row', v: 'boolean · false · Lay the options out in a wrapping row.' },
    ],
    keys: [{ k: '← → ↑ ↓', v: 'Move to the next or previous option and choose it.' }, { k: 'Tab', v: 'Enter the group (on the chosen option) or leave it.' }],
    notes: ['Native radios in a fieldset: nothing to re-implement, nothing to get wrong.', 'Use Segmented when the choices are short and few and the control should look like one piece.'],
  },
  {
    id: 'switch', family: 'inputs', name: 'Switch', demo: 'SwitchDemo',
    summary: 'An on/off switch for a setting that takes effect at once. A button with role switch, so Space and Enter flip it and a screen reader says “on” or “off”.',
    code: "import { Switch } from '../kit';\n\n<Switch label=\"Email me when a deploy fails\" checked={on} onChange={setOn} />",
    props: [
      { k: 'label', v: 'string · — · The setting’s name; also the accessible name.' },
      { k: 'checked, defaultChecked, onChange', v: 'boolean · false · onChange receives the new state.' },
      { k: 'showState', v: 'boolean · true · Write “On” or “Off” beside it.' },
    ],
    keys: [{ k: 'Space / Enter', v: 'Flip the switch.' }],
    notes: ['Use a checkbox for something that waits for a Save button; use a switch for something that happens as you flip it.', 'On and off are told apart by position and by a word, not only by colour.'],
  },
  {
    id: 'rangeField', family: 'inputs', name: 'RangeField', demo: 'RangeFieldDemo',
    summary: 'A slider: the native range input, with its value written beside the label and a text version (“240 ms”) for assistive technology.',
    code: "import { RangeField } from '../kit';\n\n<RangeField label=\"Duration\" min={0} max={1000} step={20} value={ms} onChange={setMs} format={(n) => `${n} ms`} />",
    props: [
      { k: 'min, max, step', v: 'number · 0, 100, 1 · The range.' },
      { k: 'value, defaultValue, onChange', v: 'number · 0 · onChange receives a number.' },
      { k: 'format', v: 'function · String · Turns the number into text for display and aria-valuetext.' },
      { k: 'marks', v: 'array · — · A few words under the track.' },
    ],
    keys: [{ k: '← → ↑ ↓', v: 'One step.' }, { k: 'PageUp / PageDown', v: 'A larger step.' }, { k: 'Home / End', v: 'The minimum and the maximum.' }],
    notes: ['Native, so touch dragging and keyboard control need no code of ours.', 'A slider is a poor way to enter an exact number — pair it with a NumberField where exactness matters.'],
  },
  {
    id: 'segmented', family: 'inputs', name: 'Segmented', demo: 'SegmentedDemo',
    summary: 'A short row of exclusive choices drawn as one control, with an ink that glides to the chosen one. Radio buttons underneath.',
    code: "import { Segmented } from '../kit';\n\n<Segmented label=\"Range\" options={['Day', 'Week', 'Month']} value={view} onChange={setView} />",
    props: [
      { k: 'label', v: 'string · — · Names the group for assistive technology.' },
      { k: 'options', v: 'array · [] · Strings, or { value, label }.' },
      { k: 'value, defaultValue, onChange', v: 'string · first option · onChange receives the chosen value.' },
    ],
    keys: [{ k: '← →', v: 'Choose the previous or next segment.' }, { k: 'Tab', v: 'Enter and leave the control.' }],
    notes: ['For choices that switch a panel of content, use Tabs. Segmented is for settings, not for pages.', 'Keep to two to five short options.'],
  },
  {
    id: 'tagInput', family: 'inputs', name: 'TagInput', demo: 'TagInputDemo',
    summary: 'Type a word, press Enter or a comma and it becomes a tag. Each tag has its own remove button, and adding or removing is announced.',
    code: "import { TagInput } from '../kit';\n\n<TagInput label=\"Topics\" value={tags} onChange={setTags} max={6} />",
    props: [
      { k: 'value, defaultValue, onChange', v: 'string[] · [] · onChange receives the new list.' },
      { k: 'max', v: 'number · 8 · The most tags; the box is disabled once reached.' },
      { k: 'placeholder', v: 'string · "Add a tag…" · Shown while there is room.' },
    ],
    keys: [{ k: 'Enter / ,', v: 'Turn what you typed into a tag.' }, { k: 'Backspace', v: 'In an empty box, takes the last tag back.' }, { k: 'Tab', v: 'Moves through each remove button.' }],
    notes: ['Duplicates (ignoring case) are refused with a spoken message.', 'Leaving the box with text in it adds the tag rather than losing the text.'],
  },
  {
    id: 'fileDrop', family: 'inputs', name: 'FileDrop', demo: 'FileDropDemo',
    summary: 'A drop zone that is also a file button: drag files onto it, or press it and choose. It lists what was picked and uploads nothing itself.',
    code: "import { FileDrop } from '../kit';\n\n<FileDrop label=\"Choose files\" accept=\".csv\" onFiles={(files) => read(files)} />",
    props: [
      { k: 'label, hint', v: 'string · — · The two lines inside the zone.' },
      { k: 'accept', v: 'string · — · File types, as the input’s accept attribute.' },
      { k: 'multiple', v: 'boolean · true · Allow several files.' },
      { k: 'onFiles', v: 'function · — · Called with an array of File objects.' },
    ],
    keys: [{ k: 'Enter / Space', v: 'Open the file picker (the real input sits inside the zone).' }],
    notes: ['The list of chosen files is a polite live region.', 'Dragging gives a visual cue; the picker is always there for people who cannot or do not drag.'],
  },

  /* -------------------------------------------------------------- navigation */
  {
    id: 'breadcrumbs', family: 'navigation', name: 'Breadcrumbs', demo: 'BreadcrumbsDemo',
    summary: 'Where you are, as a trail back up. The last item is the current page and is not a link.',
    code: "import { Breadcrumbs } from '../kit';\n\n<Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: 'Glossary' }]} />",
    props: [
      { k: 'items', v: 'array · [] · { label, to? }. The last is the current page.' },
      { k: 'label', v: 'string · "Breadcrumb" · The nav landmark’s name; change it when two trails share a page.' },
    ],
    keys: [{ k: 'Tab', v: 'Through each link in the trail.' }],
    notes: ['An ordered list inside a nav, with aria-current on the last item; the separators are drawn by CSS and not read out.'],
  },
  {
    id: 'pagination', family: 'navigation', name: 'Pagination', demo: 'PaginationDemo',
    summary: 'Page buttons with the first, the last and the neighbours of the current one, “…” for what is skipped, and previous and next that stop at the ends.',
    code: "import { Pagination } from '../kit';\n\n<Pagination page={page} pages={20} onChange={setPage} />",
    props: [
      { k: 'page, defaultPage, onChange', v: 'number · 1 · onChange receives the new page number.' },
      { k: 'pages', v: 'number · 1 · The total.' },
      { k: 'siblings', v: 'number · 1 · How many neighbours to show each side of the current page.' },
    ],
    keys: [{ k: 'Tab', v: 'Through the buttons; Enter or Space presses one.' }],
    notes: ['The current page is aria-current and each button says “Page 6”, not just “6”.', 'A gap that stands for a single page is shown as that page instead of “…”.'],
  },
  {
    id: 'stepper', family: 'navigation', name: 'Stepper', demo: 'StepperDemo',
    summary: 'The steps of something with an order, and which one you are on. Done steps show a tick, the current one is aria-current, and each state is written out for a screen reader.',
    code: "import { Stepper } from '../kit';\n\n<Stepper current={1} steps={[{ title: 'Details' }, { title: 'Review' }, { title: 'Confirm' }]} />",
    props: [
      { k: 'steps', v: 'array · [] · { title, hint? }.' },
      { k: 'current', v: 'number · 0 · The zero-based index of the current step.' },
    ],
    keys: [{ k: '—', v: 'A stepper shows progress; it is not a control. Put Back and Next buttons beside it.' }],
    notes: ['On a phone the steps stack and the connecting line is dropped.', 'It does not decide whether a step may be skipped — that rule belongs to your flow.'],
  },
  {
    id: 'tabs', family: 'navigation', name: 'Tabs', demo: 'TabsDemo',
    summary: 'Tabs that change a panel of content, as the ARIA pattern asks: one tab stop for the list, arrow keys move between tabs and show the panel at once.',
    code: "import { Tabs } from '../kit';\n\n<Tabs label=\"About the service\" tabs={[{ id: 'what', label: 'What it does', content: <p>…</p> }, { id: 'run', label: 'Running it', content: <p>…</p> }]} />",
    props: [
      { k: 'tabs', v: 'array · [] · { id, label, content }.' },
      { k: 'value, defaultValue, onChange', v: 'string · first tab · The id of the selected tab.' },
      { k: 'label', v: 'string · — · Names the tab list.' },
    ],
    keys: [{ k: '← →', v: 'Move to the previous or next tab, wrapping, and show its panel.' }, { k: 'Home / End', v: 'First and last tab.' }, { k: 'Tab', v: 'Leaves the list for the panel.' }],
    notes: ['Only for choices that switch a panel. A selector that changes a nearby demo is a radio group (Segmented).', 'The content of panels that are not shown is not rendered at all, and their panel element is hidden.'],
  },
  {
    id: 'sideNav', family: 'navigation', name: 'SideNav', demo: 'SideNavDemo',
    summary: 'A vertical navigation in groups that fold. A folded group is out of the tab order and the reading order, not only out of sight.',
    code: "import { SideNav } from '../kit';\n\n<SideNav current={pathname} groups={[{ label: 'Reliability', open: true, items: [{ label: 'Runbooks', to: '/insights/runbooks' }] }]} />",
    props: [
      { k: 'groups', v: 'array · [] · { label, items: [{ label, to, badge? }], open? }.' },
      { k: 'current', v: 'string · — · The `to` of the page you are on; it gets aria-current.' },
      { k: 'label', v: 'string · "Section navigation" · The nav landmark’s name.' },
    ],
    keys: [{ k: 'Enter / Space', v: 'Open or close a group.' }, { k: 'Tab', v: 'Through the group buttons and the links of open groups.' }],
    notes: ['Group headings are real headings holding a button, so a screen reader can list them.', 'The first group starts open unless you say otherwise.'],
  },
  {
    id: 'dropdownMenu', family: 'navigation', name: 'DropdownMenu', demo: 'DropdownMenuDemo',
    summary: 'A button that opens a menu of actions — not a navigation; use links for that. The ARIA menu-button pattern, with typeahead.',
    code: "import { DropdownMenu } from '../kit';\n\n<DropdownMenu label=\"Actions\" items={[{ label: 'Rename', onSelect: rename }, { separator: true }, { label: 'Delete…', onSelect: remove, danger: true }]} />",
    props: [
      { k: 'label', v: 'string · — · The button’s text and the menu’s name.' },
      { k: 'items', v: 'array · [] · { label, onSelect, danger?, disabled? } or { separator: true }.' },
      { k: 'align', v: '"start" | "end" · "start" · Which edge of the button the menu lines up with.' },
    ],
    keys: [{ k: '↓ / Enter', v: 'Open the menu and move to the first item.' }, { k: '↑', v: 'Open and move to the last item.' }, { k: '↑ ↓ Home End', v: 'Move between items.' }, { k: 'A letter', v: 'Jump to the next item starting with it.' }, { k: 'Esc', v: 'Close and return to the button.' }, { k: 'Tab', v: 'Close and move on.' }],
    notes: ['Focus moves into the menu when it opens and back to the button when it closes.', 'Disabled items are skipped by the arrow keys.'],
  },
  {
    id: 'onThisPage', family: 'navigation', name: 'OnThisPage', demo: 'OnThisPageDemo',
    summary: 'An “on this page” list that follows the reader: the entry for the section nearest the top is marked, and pressing one scrolls there and moves focus to it.',
    code: "import { OnThisPage } from '../kit';\n\n<OnThisPage items={[{ id: 'intro', label: 'Introduction' }, { id: 'steps', label: 'Steps' }]} />",
    props: [
      { k: 'items', v: 'array · [] · { id, label } where id is an element on the page.' },
      { k: 'label', v: 'string · "On this page" · The nav landmark’s name.' },
    ],
    keys: [{ k: 'Enter', v: 'Scroll to the section and focus it.' }],
    notes: ['Marked with aria-current="location".', 'Scrolling is instant for people who prefer reduced motion.', 'Focus moves to the section so the next Tab continues from it, rather than from the link.'],
  },
  {
    id: 'toolbar', family: 'navigation', name: 'Toolbar', demo: 'ToolbarDemo',
    summary: 'A row of tool buttons that is one tab stop; the arrow keys move between the tools. A tool can be a toggle, with aria-pressed.',
    code: "import { Toolbar } from '../kit';\nimport { Bold, Italic } from 'lucide-react';\n\n<Toolbar label=\"Text formatting\" items={[{ id: 'b', label: 'Bold', icon: Bold, toggle: true }, { id: 'i', label: 'Italic', icon: Italic, toggle: true }]} />",
    props: [
      { k: 'label', v: 'string · — · Names the toolbar.' },
      { k: 'items', v: 'array · [] · { id, label, icon?, toggle?, pressed?, onClick? } or { separator: true }.' },
    ],
    keys: [{ k: '← →', v: 'Move between tools, wrapping.' }, { k: 'Home / End', v: 'First and last tool.' }, { k: 'Enter / Space', v: 'Press the tool.' }, { k: 'Tab', v: 'Leave the toolbar.' }],
    notes: ['Icon-only tools get their name from the label, which is also their tooltip.', 'Roving tabindex: only the tool you last used is in the tab order.'],
  },

  /* ---------------------------------------------------------------- feedback */
  {
    id: 'alert', family: 'feedback', name: 'Alert', demo: 'AlertDemo',
    summary: 'A message in the flow of the page. Information and success speak politely; warnings and errors interrupt. The tone is never carried by colour alone.',
    code: "import { Alert } from '../kit';\n\n<Alert tone=\"warning\" title=\"Token expires soon\">Replace it before Friday.</Alert>",
    props: [
      { k: 'tone', v: '"info" | "success" | "warning" | "danger" · "info" · Sets the icon, the colour and how it is announced.' },
      { k: 'title', v: 'string · — · A short bold line.' },
      { k: 'children', v: 'node · — · The message.' },
      { k: 'onDismiss', v: 'function · — · Adds a dismiss button when given.' },
    ],
    keys: [{ k: 'Tab', v: 'To the dismiss button, if there is one.' }],
    notes: ['role="status" for info and success, role="alert" for warning and danger.', 'Do not auto-dismiss an alert; use a Toast for something that needs no answer.'],
  },
  {
    id: 'toast', family: 'feedback', name: 'Toast', demo: 'ToastDemo',
    summary: 'Brief messages in a corner that leave by themselves. Announced politely, never take focus, pause while the pointer or keyboard is on them, and can always be dismissed.',
    code: "import { ToastProvider, useToast } from '../kit';\n\n// once, near the top of the app:\n<ToastProvider>…</ToastProvider>\n\n// anywhere below it:\nconst toast = useToast();\ntoast({ title: 'Copied', body: 'The address is on your clipboard.', tone: 'success' });",
    props: [
      { k: 'title, body', v: 'string · — · The message.' },
      { k: 'tone', v: '"info" | "success" | "danger" · "info" · Icon and border.' },
      { k: 'duration', v: 'number · 5000 · Milliseconds before it leaves; 0 keeps it until dismissed.' },
      { k: 'max (provider)', v: 'number · 4 · How many show at once; older ones leave first.' },
    ],
    keys: [{ k: 'Tab', v: 'To a toast’s dismiss button; focusing a toast stops its timer.' }],
    notes: ['A toast is for something that needs no answer. Anything that does is a dialog.', 'Outside a provider, useToast returns a function that does nothing — so a component that toasts never has to know.'],
  },
  {
    id: 'banner', family: 'feedback', name: 'Banner', demo: 'BannerDemo',
    summary: 'A notice that runs the width of its container, for something about the whole page or site rather than one field. It may carry one action and may be dismissed.',
    code: "import { Banner } from '../kit';\n\n<Banner title=\"New:\" action={{ label: 'Read the notes', to: '/resources/changelog' }}>A chapter was added to the release notes.</Banner>",
    props: [
      { k: 'title', v: 'string · — · A bold lead-in.' },
      { k: 'action', v: 'object · — · { label, to } for a link or { label, onClick } for a button.' },
      { k: 'dismissible', v: 'boolean · true · Show a dismiss button.' },
    ],
    keys: [{ k: 'Tab', v: 'To the action, then to the dismiss button.' }],
    notes: ['A group named by its title, so two banners on a page never collide as landmarks.', 'Dismissal lasts until the page is reloaded; nothing is stored.'],
  },
  {
    id: 'progressBar', family: 'feedback', name: 'ProgressBar', demo: 'ProgressBarDemo',
    summary: 'How far along something is. With a value it announces its percentage; without one it is indeterminate and says it is working.',
    code: "import { ProgressBar } from '../kit';\n\n<ProgressBar label=\"Importing rows\" value={42} />\n<ProgressBar label=\"Waiting for the server\" />",
    props: [
      { k: 'label', v: 'string · — · What is progressing; names the bar.' },
      { k: 'value, max', v: 'number · —, 100 · Omit value for indeterminate.' },
      { k: 'hideValue', v: 'boolean · false · Do not write the percentage beside the label.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['role="progressbar" with aria-valuenow, aria-valuetext and a name.', 'Indeterminate stops moving under reduced motion.', 'For a quantity in a range (storage used), use Meter.'],
  },
  {
    id: 'meter', family: 'feedback', name: 'Meter', demo: 'MeterDemo',
    summary: 'A gauge for a quantity inside a known range. The colour changes in the low and high zones and the zone is also written out for anyone who cannot see the colour.',
    code: "import { Meter } from '../kit';\n\n<Meter label=\"Storage used\" value={62} unit=\"%\" low={10} high={85} />",
    props: [
      { k: 'label', v: 'string · — · What is measured.' },
      { k: 'value, min, max', v: 'number · —, 0, 100 · The reading and its range.' },
      { k: 'low, high', v: 'number · — · Below low or above high changes the zone.' },
      { k: 'cells, unit', v: 'number, string · 20, "" · How many cells to draw; the unit after the number.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['role="meter" with min, max, now and a text value that includes the zone.', 'A meter is not progress toward a goal — that is a ProgressBar.'],
  },
  {
    id: 'spinner', family: 'feedback', name: 'Spinner', demo: 'SpinnerDemo',
    summary: 'A small “working on it” ring. It is a status message first — the label is announced — and a picture second. It stops turning for visitors who ask for less motion.',
    code: "import { Spinner } from '../kit';\n\n<Spinner label=\"Saving\" />\n<Spinner label=\"Working\" hideLabel />",
    props: [
      { k: 'label', v: 'string · "Loading" · The words announced (and shown).' },
      { k: 'size', v: 'string · "1.6rem" · The ring’s size, as a CSS length.' },
      { k: 'hideLabel', v: 'boolean · false · Keep the label for screen readers only.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['If the wait is long enough to need a spinner, it is long enough to say what it is waiting for.'],
  },
  {
    id: 'skeleton', family: 'feedback', name: 'Skeleton', demo: 'SkeletonDemo',
    summary: 'The shape of content that has not arrived yet, holding its space so nothing jumps when it does. Decorative: hidden from assistive technology.',
    code: "import { Skeleton } from '../kit';\n\n<Skeleton width=\"48%\" height=\"1.1rem\" />\n<Skeleton lines={3} />",
    props: [
      { k: 'width, height', v: 'string · "100%", "1rem" · CSS lengths.' },
      { k: 'lines', v: 'number · — · Draw a short paragraph instead of one block; the last line is shorter.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Pair it with a live “loading” message (a Spinner with hideLabel) wherever the wait matters.', 'The shimmer stops under reduced motion.'],
  },
  {
    id: 'emptyState', family: 'feedback', name: 'EmptyState', demo: 'EmptyStateDemo',
    summary: 'What a list or a page says when there is nothing in it: why it is empty, and the one thing to do next. An empty state with no way forward is a dead end.',
    code: "import { EmptyState } from '../kit';\nimport { CalendarX2 } from 'lucide-react';\n\n<EmptyState icon={CalendarX2} title=\"Nothing scheduled\" action={<button>Add the first one</button>}>When a job is scheduled it appears here.</EmptyState>",
    props: [
      { k: 'icon', v: 'component · Inbox · A lucide icon.' },
      { k: 'title', v: 'string · — · A heading (level 3).' },
      { k: 'children', v: 'node · — · One or two sentences.' },
      { k: 'action', v: 'node · — · The next step, usually a button.' },
    ],
    keys: [{ k: 'Tab', v: 'To the action.' }],
    notes: ['Say why it is empty — “nothing yet” and “nothing matches your filter” need different words.'],
  },
  {
    id: 'statusDot', family: 'feedback', name: 'StatusDot', demo: 'StatusDotDemo',
    summary: 'A coloured dot with its state spelled out beside it, so the colour is never the only signal. A live one can breathe.',
    code: "import { StatusDot } from '../kit';\n\n<StatusDot state=\"ok\" pulse />\n<StatusDot state=\"warn\" label=\"Slow responses\" />",
    props: [
      { k: 'state', v: '"ok" | "warn" | "down" | "idle" · "idle" · Sets the colour and the default word.' },
      { k: 'label', v: 'string · state word · The text beside the dot.' },
      { k: 'pulse', v: 'boolean · false · A slow ring for a live thing; stops under reduced motion.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['The words are Operational, Degraded, Down and Idle unless you give your own.'],
  },

  /* -------------------------------------------------------------------- data */
  {
    id: 'badge', family: 'data', name: 'Badge', demo: 'BadgeDemo',
    summary: 'A short label for the state or kind of a thing: New, Beta, Deprecated. The word carries the meaning; the tone only reinforces it.',
    code: "import { Badge } from '../kit';\n\n<Badge tone=\"success\" dot>Healthy</Badge>",
    props: [
      { k: 'tone', v: '"neutral" | "red" | "solid" | "outline" | "success" | "warning" · "neutral" · The colour treatment.' },
      { k: 'dot', v: 'boolean · false · A small mark before the word.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Never use a badge’s colour alone to say something.', 'Keep it to one or two words.'],
  },
  {
    id: 'chip', family: 'data', name: 'Chip', demo: 'ChipDemo',
    summary: 'A compact pill that can be plain information, a toggle (give it onClick; selected says whether it is on) and/or removable (give it onRemove).',
    code: "import { Chip } from '../kit';\n\n<Chip selected={on} onClick={toggle}>Operations</Chip>\n<Chip onRemove={drop}>security</Chip>",
    props: [
      { k: 'selected', v: 'boolean · — · Whether a toggle chip is on.' },
      { k: 'onClick', v: 'function · — · Makes it a toggle button with aria-pressed.' },
      { k: 'onRemove', v: 'function · — · Adds a separate close button named “Remove …”.' },
    ],
    keys: [{ k: 'Space / Enter', v: 'Toggle, or press the remove button.' }],
    notes: ['A filter set is a group of toggle chips; name the group with role="group" and an aria-label.'],
  },
  {
    id: 'avatar', family: 'data', name: 'Avatar', demo: 'AvatarDemo',
    summary: 'A person, a team or a system as its initials in a circle or square. No photographs, on purpose: initials need no consent, load instantly and cannot be the wrong face.',
    code: "import { Avatar, AvatarGroup } from '../kit';\n\n<Avatar name=\"Alex Example\" />\n<AvatarGroup names={['Alex Example', 'Sam Sample', 'Rin Placeholder']} max={3} />",
    props: [
      { k: 'name', v: 'string · — · The full name; becomes the accessible name.' },
      { k: 'size', v: 'string · "2.4rem" · A CSS length.' },
      { k: 'shape, tone', v: '"circle" | "square", "red" · "circle" · Appearance.' },
      { k: 'names, max (group)', v: 'array, number · [], 4 · The group shows max avatars and “+N” for the rest.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['The group lists every name in its accessible label, including those it only counts.'],
  },
  {
    id: 'stat', family: 'data', name: 'Stat', demo: 'StatDemo',
    summary: 'One number, large, with its label above and, if you have it, how it moved. The change is written as words for a screen reader; the arrow and colour are decoration.',
    code: "import { Stat } from '../kit';\n\n<Stat label=\"Jobs on time\" value=\"96\" unit=\"%\" change={2} changeLabel=\"vs. last week\" />",
    props: [
      { k: 'label, value, unit', v: 'string · — · The caption, the figure, and the small word after it.' },
      { k: 'change', v: 'number · — · Percent change; positive, negative or zero.' },
      { k: 'changeLabel', v: 'string · — · What it is compared with.' },
      { k: 'note', v: 'string · — · A caveat or a source.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Figures use lining numerals, so a 1 never looks like a capital I.', 'Say what a figure is compared with, or leave the change off.'],
  },
  {
    id: 'dataTable', family: 'data', name: 'DataTable', demo: 'DataTableDemo',
    summary: 'A table you can sort and select from. A sortable column’s header is a button and the th carries aria-sort. It scrolls sideways inside a focusable region on a narrow screen.',
    code: "import { DataTable } from '../kit';\n\n<DataTable caption=\"Scheduled jobs\" rows={rows} selectable onSelect={setChosen} columns={[{ key: 'job', label: 'Job', sortable: true }, { key: 'mins', label: 'Minutes', sortable: true, align: 'right' }]} />",
    props: [
      { k: 'caption', v: 'string · — · The table’s caption and the region’s name.' },
      { k: 'columns', v: 'array · [] · { key, label, sortable?, align?, render?, value? }.' },
      { k: 'rows', v: 'array · [] · Objects; each needs a unique rowKey.' },
      { k: 'selectable, onSelect', v: 'boolean, function · false · Adds checkboxes; onSelect receives the chosen keys.' },
      { k: 'maxHeight', v: 'string · — · Scroll vertically past this height; the header stays.' },
    ],
    keys: [{ k: 'Enter / Space', v: 'On a header button: sort ascending, then descending, then back to the original order.' }, { k: 'Tab', v: 'Into the scrolling region, then through its buttons and checkboxes.' }],
    notes: ['Sorting is stable and numeric-aware; numbers in a column should be right-aligned.', 'The header checkbox is indeterminate when only some rows are chosen.'],
  },
  {
    id: 'descriptionList', family: 'data', name: 'DescriptionList', demo: 'DescriptionListDemo',
    summary: 'Terms and what they mean, or labels and their values — the right element for a fact sheet. A real dl, so a screen reader pairs each term with its detail.',
    code: "import { DescriptionList } from '../kit';\n\n<DescriptionList items={[{ term: 'Service', detail: 'Order intake' }, { term: 'Owner', detail: 'Commerce team' }]} />",
    props: [
      { k: 'items', v: 'array · [] · { term, detail } — detail may be any node.' },
      { k: 'stacked', v: 'boolean · false · Put each detail under its term.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['On a phone every pair stacks.'],
  },
  {
    id: 'timeline', family: 'data', name: 'Timeline', demo: 'TimelineDemo',
    summary: 'Things in the order they happen, down a line. It is an ordered list, so the order is announced. This site’s own timeline is told in undated phases — pass words, not dates, unless you have them.',
    code: "import { Timeline } from '../kit';\n\n<Timeline items={[{ when: 'Phase one', title: 'Shape', body: 'Work out the problem.', done: true }, { when: 'Phase two', title: 'Build' }]} />",
    props: [
      { k: 'items', v: 'array · [] · { when?, title, body?, done? }.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Items marked done get a filled marker.'],
  },
  {
    id: 'tree', family: 'data', name: 'Tree', demo: 'TreeDemo',
    summary: 'An expandable tree — files, categories, an outline — following the ARIA tree-view pattern: one tab stop, arrow keys through what is visible.',
    code: "import { Tree } from '../kit';\n\n<Tree label=\"Project files\" defaultOpen={['src']} onSelect={(node) => open(node.id)} nodes={[{ id: 'src', label: 'src', children: [{ id: 'main', label: 'main.jsx' }] }]} />",
    props: [
      { k: 'nodes', v: 'array · [] · { id, label, children? }, nested to any depth.' },
      { k: 'defaultOpen', v: 'string[] · [] · Ids of branches that start open.' },
      { k: 'onSelect', v: 'function · — · Called with the chosen node.' },
    ],
    keys: [{ k: '↓ / ↑', v: 'Next or previous visible item.' }, { k: '→', v: 'Open a closed branch; on an open one, step into it.' }, { k: '←', v: 'Close an open branch; on a closed one or a leaf, step out to the parent.' }, { k: 'Home / End', v: 'First and last visible item.' }, { k: 'Enter / Space', v: 'Choose (and open or close) the item.' }],
    notes: ['aria-level, aria-setsize and aria-posinset are set, so a screen reader can say “3 of 5, level 2”.'],
  },
  {
    id: 'codeBlock', family: 'data', name: 'CodeBlock', demo: 'CodeBlockDemo',
    summary: 'A block of code with an optional file name, light colouring and a copy button. The colour is a nicety: every token is also plain text, so copying gives exactly what you see.',
    code: "import { CodeBlock } from '../kit';\n\n<CodeBlock filename=\"retry.js\" lines code={source} />",
    props: [
      { k: 'code', v: 'string · — · The text.' },
      { k: 'language', v: 'string · "js" · js, jsx, ts, json, css, sh, html or yaml; anything else is shown plain.' },
      { k: 'filename', v: 'string · — · Shown in the header; also names the region.' },
      { k: 'lines', v: 'boolean · false · Number the lines (the numbers are not copied).' },
    ],
    keys: [{ k: 'Tab', v: 'To the copy button, then into the code, so a long line can be scrolled with the arrow keys.' }],
    notes: ['The colouring is deliberately small — a tokenizer of about eighty lines, no dependency.', 'Copying uses the clipboard API, with a fallback for browsers that do not offer it.'],
  },
  {
    id: 'sparkline', family: 'data', name: 'Sparkline', demo: 'SparklineDemo',
    summary: 'A tiny line chart with no axes, for “which way is it going”. It is an image with a text description — range, first and last value — so the shape is never the only way to learn it.',
    code: "import { Sparkline } from '../kit';\n\n<Sparkline label=\"Response time\" unit=\" ms\" data={[210, 190, 205, 180, 150, 140]} />",
    props: [
      { k: 'data', v: 'number[] · [] · At least two values.' },
      { k: 'label, unit', v: 'string · — · Used in the text description.' },
      { k: 'width, height', v: 'number · 180, 44 · The viewBox; the chart scales to its container.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['The last point is marked.', 'Show the numbers somewhere nearby if they matter — a sparkline shows shape, not values.'],
  },
  {
    id: 'barList', family: 'data', name: 'BarList', demo: 'BarListDemo',
    summary: 'Bars you can read as a list: each row has its label, a bar and the figure, so the values are text first and a picture second. The largest is picked out in red.',
    code: "import { BarList } from '../kit';\n\n<BarList label=\"Jobs by owner\" items={[{ label: 'Operations', value: 12 }, { label: 'Platform', value: 8 }]} />",
    props: [
      { k: 'items', v: 'array · [] · { label, value, display? }.' },
      { k: 'max', v: 'number · largest value · The value that fills a bar.' },
      { k: 'unit', v: 'string · "" · Added after each value unless display is given.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['A list of items, so the order and the count are announced.', 'On a phone the bar drops under its label.'],
  },

  /* ---------------------------------------------------------------- overlays */
  {
    id: 'tooltip', family: 'overlays', name: 'Tooltip', demo: 'TooltipDemo',
    summary: 'A short description that appears beside a control on hover or keyboard focus, after a beat so it does not flicker. It adds detail; it never replaces a label.',
    code: "import { Tooltip } from '../kit';\n\n<Tooltip text=\"Copy a link\"><button aria-label=\"Copy a link\">…</button></Tooltip>",
    props: [
      { k: 'text', v: 'string · — · The description.' },
      { k: 'placement', v: '"top" | "bottom" | "start" | "end" · "top" · Where it appears.' },
      { k: 'delay', v: 'number · 350 · Milliseconds of hover before it shows (focus shows it at once).' },
    ],
    keys: [{ k: 'Tab', v: 'Focusing the control shows the tooltip.' }, { k: 'Esc', v: 'Dismisses it without moving focus.' }],
    notes: ['Wired with aria-describedby on the one focusable child.', 'Never put anything in a tooltip the user needs to act on — touch has no hover.'],
  },
  {
    id: 'popover', family: 'overlays', name: 'Popover', demo: 'PopoverDemo',
    summary: 'A panel that opens under a button and holds anything — text, a small form, a few links. It is not modal: focus stays where it is and Tab moves on into the panel.',
    code: "import { Popover } from '../kit';\n\n<Popover label=\"Share\" title=\"Share this view\">…</Popover>",
    props: [
      { k: 'label', v: 'string · — · The button’s text.' },
      { k: 'title', v: 'string · — · A small heading inside the panel; also names it.' },
      { k: 'align, placement', v: '"start" | "end", "bottom" | "top" · "start", "bottom" · Where the panel sits.' },
    ],
    keys: [{ k: 'Enter / Space', v: 'Open or close.' }, { k: 'Esc', v: 'Close and return to the button.' }, { k: 'Tab', v: 'Into the panel, which follows the button in the page.' }],
    notes: ['A press outside closes it.', 'If it must be answered before anything else, it is a dialog, not a popover.'],
  },
  {
    id: 'hoverCard', family: 'overlays', name: 'HoverCard', demo: 'HoverCardDemo',
    summary: 'A preview card for a link: hover or focus the link and a little more about where it goes appears, and stays while the pointer is on it. It must only ever add.',
    code: "import { HoverCard } from '../kit';\n\n<HoverCard title=\"Glossary\" body=\"Every term the site uses…\"><Link to=\"/resources/glossary\">glossary</Link></HoverCard>",
    props: [
      { k: 'title, body', v: 'string · — · The card’s heading and text.' },
      { k: 'delay', v: 'number · 280 · Milliseconds of hover before it opens.' },
    ],
    keys: [{ k: 'Tab', v: 'Focusing the link opens the card.' }, { k: 'Esc', v: 'Closes it.' }],
    notes: ['Touch has no hover, so the link has to make sense without the card.', 'Linked by aria-describedby; the card is not focusable.'],
  },
  {
    id: 'dialog', family: 'overlays', name: 'Dialog', demo: 'DialogDemo',
    summary: 'A modal dialog: it takes over the screen until it is dealt with. Focus moves in and is trapped, Escape and the backdrop close it, the page behind stops scrolling and focus returns to what opened it.',
    code: "import { Dialog } from '../kit';\n\n<Dialog open={open} onClose={() => setOpen(false)} title=\"Rename\" footer={<><button onClick={cancel}>Cancel</button><button onClick={save}>Save</button></>}>…</Dialog>",
    props: [
      { k: 'open, onClose', v: 'boolean, function · — · You own the open state.' },
      { k: 'title', v: 'string · — · The heading; also the dialog’s name.' },
      { k: 'footer', v: 'node · — · The buttons; the primary action comes last.' },
      { k: 'width', v: 'string · "32rem" · A CSS length.' },
      { k: 'dismissible', v: 'boolean · true · Allow Escape, the backdrop and the close button.' },
    ],
    keys: [{ k: 'Tab / Shift+Tab', v: 'Cycle through the controls inside; never leave.' }, { k: 'Esc', v: 'Close.' }],
    notes: ['Mark the element that should take focus first with data-autofocus; otherwise it is the first control.', 'Smooth scrolling is stopped and the page behind is locked while it is open.', 'Use it sparingly — most things do not need to interrupt.'],
  },
  {
    id: 'drawer', family: 'overlays', name: 'Drawer', demo: 'DrawerDemo',
    summary: 'A dialog that slides in from an edge and runs the full height — for a filter panel or a record’s detail, where the page behind still gives context.',
    code: "import { Drawer } from '../kit';\n\n<Drawer open={open} onClose={close} title=\"Filters\" side=\"right\">…</Drawer>",
    props: [
      { k: 'side', v: '"right" | "left" · "right" · Which edge it comes from.' },
      { k: 'width', v: 'string · "26rem" · Its width, capped at the screen.' },
      { k: '...dialog', v: 'props · — · Everything a Dialog takes.' },
    ],
    keys: [{ k: 'Tab / Shift+Tab', v: 'Cycle inside it.' }, { k: 'Esc', v: 'Close.' }],
    notes: ['Everything a Dialog does for focus, Escape and scrolling, a Drawer does too.', 'Under reduced motion it appears without sliding.'],
  },
  {
    id: 'confirmDialog', family: 'overlays', name: 'ConfirmDialog', demo: 'ConfirmDialogDemo',
    summary: '“Are you sure?” done properly: the title says what will happen, the buttons say what they do, and for something that cannot be undone the safe choice has focus.',
    code: "import { ConfirmDialog } from '../kit';\n\n<ConfirmDialog open={open} title=\"Delete this draft?\" confirmLabel=\"Delete the draft\" cancelLabel=\"Keep it\" danger onConfirm={remove} onCancel={close}>It cannot be recovered.</ConfirmDialog>",
    props: [
      { k: 'title, children', v: 'string, node · — · What will happen.' },
      { k: 'confirmLabel, cancelLabel', v: 'string · "Confirm", "Cancel" · Say what the buttons do.' },
      { k: 'danger', v: 'boolean · false · Red confirm button; focus starts on Cancel.' },
      { k: 'onConfirm, onCancel', v: 'function · — · Both required.' },
    ],
    keys: [{ k: 'Tab', v: 'Between the two buttons.' }, { k: 'Esc', v: 'Same as Cancel.' }],
    notes: ['Avoid “OK” and “Yes”: a button’s label should still make sense out of context.'],
  },

  /* ----------------------------------------------------------------- content */
  {
    id: 'card', family: 'content', name: 'Card', demo: 'CardDemo',
    summary: 'A surface that groups related content, in four variants. The title is a heading whose level you choose, so the card fits the outline of the page it is on.',
    code: "import { Card } from '../kit';\n\n<Card eyebrow=\"Accent\" title=\"Pick one\" variant=\"accent\" footer=\"Once per screen.\">The red wash says start here.</Card>",
    props: [
      { k: 'eyebrow, title, footer', v: 'string · — · The small label, the heading and the foot line.' },
      { k: 'as', v: 'string · "h3" · The title’s heading element.' },
      { k: 'variant', v: '"raised" | "flat" | "outline" | "accent" · "raised" · The surface.' },
      { k: 'interactive', v: 'boolean · false · Lift on hover and focus.' },
    ],
    keys: [{ k: 'Tab', v: 'To the one link or button inside it.' }],
    notes: ['Do not wrap a whole card in a link — put the link on the title or in the footer.', 'Use the accent variant at most once per screen.'],
  },
  {
    id: 'callout', family: 'content', name: 'Callout', demo: 'CalloutDemo',
    summary: 'A remark set apart from the text around it: a note, a tip, a warning. The kind is written out as a word as well as shown by colour and icon.',
    code: "import { Callout } from '../kit';\n\n<Callout tone=\"warning\">Changing the retention period applies to new records only.</Callout>",
    props: [
      { k: 'tone', v: '"note" | "tip" | "warning" | "danger" · "note" · Icon, colour and the default title word.' },
      { k: 'title', v: 'string · tone word · Replaces the default title.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['A note role, not a landmark and not an alert — it is part of the reading flow, so a page can have as many as it needs.'],
  },
  {
    id: 'quote', family: 'content', name: 'Quote', demo: 'QuoteDemo',
    summary: 'A pull quote with its source: a real blockquote inside a figure, the attribution as the caption. Only put words here that someone really said.',
    code: "import { Quote } from '../kit';\n\n<Quote cite=\"From this company’s principles\">A system that is hard to hand over is hard to trust.</Quote>",
    props: [
      { k: 'cite', v: 'string · — · Who said it, or where it is from.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['This site quotes its own principles, not testimonials — nothing invented, nothing implied.'],
  },
  {
    id: 'figure', family: 'content', name: 'Figure', demo: 'FigureDemo',
    summary: 'Something visual with a caption. The caption belongs to the figure, so a screen reader reads the two together.',
    code: "import { Figure } from '../kit';\n\n<Figure caption=\"Figure 1. Three plates.\"><svg role=\"img\" aria-label=\"Three stacked plates\">…</svg></Figure>",
    props: [
      { k: 'caption', v: 'string · — · The figcaption.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Whatever goes inside needs its own text alternative: an alt, or an aria-label on an SVG.'],
  },
  {
    id: 'divider', family: 'content', name: 'Divider', demo: 'DividerDemo',
    summary: 'A line between things. Without a label it is a plain thematic break; with one it reads as a section break (“or”, “Later”) and is a separator, not a heading.',
    code: "import { Divider } from '../kit';\n\n<Divider />\n<Divider>or</Divider>",
    props: [
      { k: 'children', v: 'node · — · An optional word in the middle.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Decorative breaks should be CSS, not elements; use a Divider when the break means something.'],
  },
  {
    id: 'prose', family: 'content', name: 'Prose', demo: 'ProseDemo',
    summary: 'A reading column. Wrap plain HTML — headings, paragraphs, lists, links, code, quotes — and it is typeset for reading: about 68 characters wide, generous leading, serif headings.',
    code: "import { Prose } from '../kit';\n\n<Prose><h2>Handing a system over</h2><p>…</p><ul><li>…</li></ul></Prose>",
    props: [
      { k: 'as', v: 'string · "div" · The wrapper element.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Links are underlined — colour is not the only cue — and the underline turns red on hover.', 'Lines stay around 68 characters wide on any screen.'],
  },
  {
    id: 'stack', family: 'content', name: 'Stack', demo: 'StackDemo',
    summary: 'Children in a column with an even gap taken from the spacing tokens.',
    code: "import { Stack } from '../kit';\n\n<Stack gap={5}><Card …/><Card …/></Stack>",
    props: [
      { k: 'gap', v: 'number · 4 · A spacing token, 1 to 12 (space-1 … space-12).' },
      { k: 'as', v: 'string · "div" · The element.' },
    ],
    keys: [{ k: '—', v: 'Layout only.' }],
    notes: ['Spacing comes from the tokens, so it changes in one place.'],
  },
  {
    id: 'cluster', family: 'content', name: 'Cluster', demo: 'ClusterDemo',
    summary: 'Children in a row that wraps when it runs out of room — buttons, tags, links.',
    code: "import { Cluster } from '../kit';\n\n<Cluster gap={3} justify=\"space-between\"><Chip>…</Chip><Chip>…</Chip></Cluster>",
    props: [
      { k: 'gap', v: 'number · 3 · A spacing token.' },
      { k: 'align, justify', v: 'string · "center", "flex-start" · Flexbox values.' },
    ],
    keys: [{ k: '—', v: 'Layout only.' }],
    notes: ['Reading order is source order — wrapping never reorders anything.'],
  },
  {
    id: 'grid', family: 'content', name: 'Grid', demo: 'GridDemo',
    summary: 'Children in as many equal columns as fit, none narrower than a minimum. There is no breakpoint to maintain: on a phone the minimum is wider than the screen, so you get one column.',
    code: "import { Grid } from '../kit';\n\n<Grid min=\"15rem\" gap={4}>{cards}</Grid>",
    props: [
      { k: 'min', v: 'string · "15rem" · The narrowest a column may be.' },
      { k: 'gap', v: 'number · 4 · A spacing token.' },
    ],
    keys: [{ k: '—', v: 'Layout only.' }],
    notes: ['Uses auto-fit with min(100%, …) so a column never overflows a narrow screen.'],
  },
  {
    id: 'disclosure', family: 'content', name: 'Disclosure', demo: 'DisclosureDemo',
    summary: 'One section that opens and closes — a question and its answer, a “more detail”. The closed body is out of the tab order and the reading order, not only out of sight.',
    code: "import { Disclosure } from '../kit';\n\n<Disclosure title=\"What does idempotent mean?\" defaultOpen>Doing it twice has the same effect as once.</Disclosure>",
    props: [
      { k: 'title', v: 'string · — · The heading’s text; the button inside it opens and closes.' },
      { k: 'open, defaultOpen, onChange', v: 'boolean · false · Controlled or not.' },
      { k: 'as', v: 'string · "h3" · The heading element.' },
    ],
    keys: [{ k: 'Enter / Space', v: 'Open or close.' }],
    notes: ['Several in a row make an accordion. The fx Accordion adds numbering and a scrambling code.'],
  },
  {
    id: 'aspectRatio', family: 'content', name: 'AspectRatio', demo: 'AspectRatioDemo',
    summary: 'Reserves a box of a fixed shape and fills it with its child, so an image, a video or a chart has its room before it loads and nothing below it jumps.',
    code: "import { AspectRatio } from '../kit';\n\n<AspectRatio ratio=\"16 / 9\"><iframe title=\"…\" /></AspectRatio>",
    props: [
      { k: 'ratio', v: 'string · "16 / 9" · Width / height, as CSS aspect-ratio.' },
    ],
    keys: [{ k: '—', v: 'Layout only.' }],
    notes: ['The child is stretched to fill, so give media object-fit.'],
  },
  {
    id: 'visuallyHidden', family: 'content', name: 'VisuallyHidden', demo: 'VisuallyHiddenDemo',
    summary: 'Text for assistive technology that is not drawn: the “Close” on an icon-only button, the “(current page)” after a link. It stays in the reading order and out of the layout.',
    code: "import { VisuallyHidden } from '../kit';\n\n<button><span aria-hidden=\"true\">×</span><VisuallyHidden>Close the panel</VisuallyHidden></button>",
    props: [
      { k: 'as', v: 'string · "span" · The element.' },
    ],
    keys: [{ k: '—', v: 'Not interactive.' }],
    notes: ['Prefer a visible label wherever there is room for one.', 'The same utility is the sr-only class used across the site.'],
  },
];

export const kitByFamily = (id) => kit.filter((k) => k.family === id);
