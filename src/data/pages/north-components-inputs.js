import { familyPage } from '../kitPages';

export default familyPage({
  family: 'inputs',
  key: 'north/components/inputs',
  title: 'Input Components',
  aliases: ['form fields', 'text field', 'select', 'combobox', 'checkbox', 'radio', 'switch', 'slider', 'tag input', 'file upload', 'validation', 'forms'],
  code: 'KIT.01',
  hero: {
    scene: 'dashboard-tiles',
    crumb: 'Inputs',
    title: 'Fields that explain themselves.',
    intro:
      'Fifteen ways to ask a person for something — a word, a number, a choice, a file — each with a visible label, help that is read out, and an error that says what to do about it.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Fifteen inputs, live.',
    intro: 'Choose one and use it. Narrow the preview to a phone to see how it holds up; the tabs under it give the code, the props, the keys and what to know.',
  },
  essay: {
    rail: 'Native first',
    scene: 'architectural-grid',
    eyebrow: 'Why not just style the native control?',
    code: 'FORM.01',
    title: 'Native first, then a pattern, then your own.',
    body: [
      'A text field, a select, a radio group, a range: the browser already gives you these, with autofill, a picker on a phone, form submission, spell checking and a screen-reader experience refined over twenty years. A custom replacement starts a long way behind, so the kit wraps the native control and styles the outside.',
      'Where there is no native control — a combobox that filters as you type, a field of tags — the kit follows the ARIA pattern for it exactly: the roles, the states, the keys. Not an approximation of the pattern; the pattern.',
      'Underneath all of them is one small piece, Field, that ties a label, a hint and an error to a control so a screen reader hears them in the right order and an error is announced the moment it appears.',
    ],
    asideLabel: 'THE ORDER OF PREFERENCE',
    asideCode: 'FORM.ORD',
    points: [
      { k: '1 · NATIVE', v: 'Text, select, radio, range, checkbox, file' },
      { k: '2 · A PATTERN', v: 'Combobox, switch, tag input — to the letter' },
      { k: '3 · YOUR OWN', v: 'Only when neither exists, and rarely' },
    ],
  },
  rules: {
    scene: 'topographic-lines',
    title: 'For any field you ever build.',
    rows: [
      { k: 'A LABEL IS NOT A PLACEHOLDER', v: 'Placeholder text vanishes the moment someone types and is rarely high enough in contrast. Every field has a visible label; the placeholder, if there is one, is an example.' },
      { k: 'ERRORS SAY WHAT TO DO', v: '“Invalid input” is a verdict. “Use at least three characters” is an instruction. Errors replace the hint and are announced when they appear.' },
      { k: 'KEEP WHAT THEY TYPED', v: 'Never cut text off to enforce a limit. Show the count, mark the field, and let the person decide what to remove.' },
      { k: 'THE FOCUS RING STAYS', v: 'Every field changes its border and gains a halo on focus. Removing the outline without replacing it makes a form unusable from a keyboard.' },
      { k: 'BIG ENOUGH TO HIT', v: 'Targets are at least 40 pixels where a finger presses, and the whole label is part of a checkbox’s target.' },
      { k: 'ASK FOR LESS', v: 'The best field is the one you do not need. Every extra field costs completions; remove one before you design one.' },
    ],
  },
  closer: {
    kind: 'formBuilder',
    anchor: 'build',
    scene: 'signal-wave',
    tag: 'End of the input components',
    minHeight: 900,
    title: 'Build a form, check it, take the code.',
    lede: 'Tick the fields a form needs and the page builds it from the kit’s own components. Send it empty to see how the errors read and where focus goes; the JSX underneath is yours to copy.',
    fields: [
      { id: 'name', label: 'Full name', kind: 'text', required: true, start: true },
      { id: 'email', label: 'Email address', kind: 'email', required: true, start: true, hint: 'We reply from this address.' },
      { id: 'password', label: 'Password', kind: 'password', required: true, hint: 'At least 12 characters is a good start.' },
      { id: 'seats', label: 'Seats', kind: 'number', min: 1, max: 12, hint: 'Between 1 and 12.' },
      { id: 'plan', label: 'Plan', kind: 'select', required: true, start: true, options: ['Starter', 'Team', 'Studio'] },
      { id: 'contact', label: 'Contact by', kind: 'radio', required: true, options: ['Email', 'Phone', 'Post'] },
      { id: 'notes', label: 'Anything else', kind: 'textarea', max: 200, hint: 'Optional.' },
      { id: 'agree', label: 'I have read the terms', kind: 'checkbox', required: true, start: true },
    ],
    onward: [
      { label: 'Navigation components', to: '/north/components/navigation' },
      { label: 'Roles, permissions and scopes', to: '/insights/permissions' },
    ],
  },
});
