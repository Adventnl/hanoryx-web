/* The keys that do something on this site — the single source for the shortcuts
   panel (press ?) and the keyboard map on the accessibility page. `match` lists
   the KeyboardEvent.key values that light the cap. */
export const shortcutKeys = [
  { id: 'esc', label: 'Esc', wide: true, match: ['Escape'], does: 'Closes search, menus and overlays, and returns focus to where you were.' },
  { id: 'tab', label: 'Tab', wide: true, match: ['Tab'], does: 'Moves focus to the next link or control, in reading order. Shift + Tab goes back. A visible ring shows where you are.' },
  { id: 'enter', label: 'Enter', wide: true, match: ['Enter'], does: 'Activates the focused link or button, and opens the highlighted result in search.' },
  { id: 'space', label: 'Space', wide: true, match: [' '], does: 'Activates the focused button, switch or checkbox.' },
  { id: 'mod', label: 'Ctrl / ⌘', wide: true, match: ['Control', 'Meta'], does: 'With K, opens the search from anywhere on the site.' },
  { id: 'k', label: 'K', match: ['k', 'K'], does: 'With Ctrl or ⌘, opens the search.' },
  { id: 'slash', label: '/', match: ['/'], does: 'Also opens the search, whenever you are not typing in a field.' },
  { id: 'help', label: '?', match: ['?'], does: 'Opens the shortcuts panel, a short list of these keys.' },
  { id: 'b', label: 'B', match: ['b', 'B'], does: 'Switches blueprint mode on and off, which outlines and names the marked parts of the page.' },
  { id: 'left', label: '←', match: ['ArrowLeft'], does: 'Moves within tab lists, sliders, carousels and the timeline.' },
  { id: 'up', label: '↑', match: ['ArrowUp'], does: 'Moves within lists, search results and radio groups.' },
  { id: 'down', label: '↓', match: ['ArrowDown'], does: 'Moves within lists, search results and radio groups.' },
  { id: 'right', label: '→', match: ['ArrowRight'], does: 'Moves within tab lists, sliders, carousels and the timeline.' },
  { id: 'home', label: 'Home', match: ['Home'], does: 'Jumps to the first item in a tab list or slider.' },
  { id: 'end', label: 'End', match: ['End'], does: 'Jumps to the last item in a tab list or slider.' },
];

export const shortcutRows = [
  ['esc', 'tab', 'enter', 'space'],
  ['mod', 'k', 'slash', 'help', 'b'],
  ['left', 'up', 'down', 'right', 'home', 'end'],
];

/* The short list shown in the ? panel. `keys` are caps to draw, in order. */
export const shortcutPanel = [
  { keys: ['Ctrl / ⌘', 'K'], label: 'Search the site', note: 'Or press / when you are not typing' },
  { keys: ['?'], label: 'Show this panel' },
  { keys: ['B'], label: 'Blueprint mode', note: 'Outlines and names the marked parts of a page' },
  { keys: ['Esc'], label: 'Close what is open' },
  { keys: ['Tab'], label: 'Move to the next control', note: 'Shift + Tab goes back' },
  { keys: ['←', '→'], label: 'Move within tabs, sliders and carousels', note: 'Home and End jump to the ends' },
];
