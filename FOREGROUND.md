# The foreground

Every page of this site has a Canvas scene behind it. The backgrounds are strong; the job of the **foreground** is to be the thing you actually read, point at and use, so that a page feels like an object with its own behaviour rather than text laid over a picture.

This file explains how that layer is built, the rules it follows, and how to add to it. `README.md` covers the rest of the codebase.

---

## Three levels

| level | where | what it is |
| --- | --- | --- |
| **toolkit** | `src/components/fx/` | small reusable pieces — a tilting surface, a decoding label, a glide-ink tab list, an odometer. They carry no content. |
| **hero asides** | `src/components/signatures/*` (registered in `asideRegistry`) | one object per page, in the right half of the hero. Chosen from page data with `hero.aside = { kind, … }`. |
| **signatures** | `src/components/signatures/*` (registered in `signatureRegistry`) | a whole-block composition with its own interaction. Chosen with `{ type: 'signature', kind, … }`. |

Signatures and asides are lazy chunks: a page downloads only the ones it renders. The shared block types (`split`, `cards`, `process`, `modules`, `stats`, `manifesto`, `cta`) are themselves foreground too — each has its own pointer, scroll or reveal behaviour — but no two signatures share a composition.

### The toolkit (`components/fx`)

`TiltSurface` · `SpotlightCard` · `ProximityText` · `ScrambleText` · `ScrollWords` · `Odometer` · `VelocityMarquee` · `GlideTabs` · `Accordion` · `CompareSlider` · `HoverIndex` · `DragRail` · `ScrollRail` · `Glyph` (27 drawn glyphs) · `ProgressRing` · `ArrowLink` · `KeyCap`

Hooks they lean on (`src/hooks/`): `usePointerField` (writes the pointer to CSS variables, no React state), `useFinePointer`, `usePrefersReducedMotion`, `useOnScreen`, `useMediaQuery` (built on `useSyncExternalStore`).

### Page by page

| page | hero object | compositions |
| --- | --- | --- |
| `/` | orbit nav — four doors on three orbits | work portals · layer stack · chronology strip |
| `/work` | case deck — the studies as a fanning stack of files | work portals (hover to open, supporting studies quieter) |
| `/work/musebase` | logo plates drifting at their own depths | coordination lab |
| `/work/yk-engine` | framed miniature viewport | engine editor · engine pipeline · engine anatomy |
| `/work/customer-product` | basket tiles that count up | experience storyboard |
| `/work/internal-crm` | ~750-dot field under a lens | data slab (a synthetic, very large data set) |
| `/company` | identity card that turns over | surface compare · chronology strip |
| `/company/principles` | tension dials | principle stack |
| `/company/security` | — | boundary review |
| `/company/timeline` | — | chronology scrubber |
| `/company/careers` | split-flap board | areas explorer |
| `/systems` | system map | system index · needs finder |
| `/systems/operational-management` | — | ops flow |
| `/systems/commerce-infrastructure` | — | order path |
| `/systems/automation` | — | rule chain |
| `/systems/internal-platforms` | — | console composer |
| `/systems/data-interfaces` | — | view shift |
| `/systems/client-portals` | — | boundary membrane |
| `/systems/research-systems` | — | research bench |
| `/north` | compass | accordion list |
| `/north/engineering` | — | gate walk |
| `/north/architecture` | — | layer stack |
| `/north/interface-lab` | — | component bench |
| `/north/motion-systems` | — | easing studio |
| `/north/tooling` | — | toolchain map |
| `/engineering` | live budget | architecture explorer |
| `/lab` | — | scene lab |
| `/contact` | — | contact studio |
| `/sitemap` | — | site directory |
| `/legal/privacy` | — | data journey |
| `/legal/terms` | — | clause finder |
| `/legal/cookies` | — | storage inspector |
| `/legal/accessibility` | — | keyboard map |
| `404` | — | nearest pages by edit distance under proximity-reactive type |

Global, on every page: the **route current** (a travelling line between pages), the **command search** (`Ctrl/⌘ K`), the **shortcuts panel** (`?`), **blueprint mode** (`B`), the designed **cursor** (names what a press does — View, Drag, or a `data-cursor-label`), the scroll rail on long pages and the footer directory.

---

## Rules

These came from building and measuring, not from taste.

**Flow.** Motion is continuous and eased. Nothing teleports and nothing cuts to black. Pointer and scrub values are written to CSS variables registered with `@property` (`--px --py --mx --my --pos --needle`, in `styles/fx.css`), so a CSS `transition` turns a jumpy value into a soft follow and a smooth return to rest. A state change that moves something (a token, a marker, an ink bar) is a `transform` over time, or a shared `layoutId`, never a re-render that swaps positions.

**Cheap.** Transform and opacity only. No `filter` or `backdrop-filter` on a large element, no `mask-image` over an animating canvas, no infinite full-screen loop (the one the site used to have cost ~15 fps). Loops run only while the element is on screen. Pointer effects do not touch React state.

**Every pointer trick has another way in.** Hover effects have a focus equivalent and a touch equivalent (usually: show the detail without needing hover). Sliders are `role="slider"` with ← → Home End. Anything draggable can be driven by keys. Use real tabs (`GlideTabs`, with `role="tabpanel"` ids that match) only when there is a panel to control; a selector that merely changes a nearby demo is `GlideTabs panels={false}`, which is announced as a radio group. `node qa/accessibility.mjs` (axe-core) must stay clean.

**Reduced motion.** `usePrefersReducedMotion()` — state still changes, movement is shortened or removed, nothing loops, canvases draw one frame, the cursor and smooth scrolling switch off.

**Nothing invented.** A demo says it is a demo. Diagrams are labelled illustrations. No figures, clients, dates or outcomes appear in a composition unless they are real. The company timeline is told in undated phases.

**Text is data.** What a signature says comes from the page's data file as plain JSON so the site search can find it; structural keys (ids, coordinates, anchors, flags) are listed in `SKIP_KEYS` in `src/features/search/searchEngine.js` so they are not indexed as prose.

**React 19 lint rules are strict.** No ref reads during render, no `setState` synchronously in an effect, no components created inside render, one component export per file where `react-refresh` asks for it. Derive state where you can; set state in event handlers and timers; `useSyncExternalStore` for browser state.

---

## Marking details: `data-fx`

```jsx
import { fx } from '../../utils/fx';

<div className={styles.ink} {...fx('timeline.ink')} />
```

`fx('area.name')` adds `data-fx="area.name"` — nothing else. Two things read it:

- **Blueprint mode** (press `B`): outlines every marked element — header and footer included — names it, stacks labels that would collide, names a repeated detail only a few times, and shows a live count of what is on screen.
- **`node qa/foreground-inventory.mjs`**: loads every route at 1440 px, scrolls it, and counts the distinct ids that are actually **on screen** (an element with no box, `display: none` or `visibility: hidden` does not count). It also opens what only exists while open or running — the mega menu, search, the shortcuts panel, blueprint mode, the route line and the intro — and reports those as "global". It fails under the per-page floor. `--markdown` writes the whole list to [`FOREGROUND-DETAILS.md`](./FOREGROUND-DETAILS.md); `--ids` prints it.

Mark a detail only when it is a real, separate behaviour with its own element — a label that decodes on hover, an ink bar that glides, a ghost numeral that drifts, a token that travels — not a wrapper, and not the same effect twice on one element (an element carries one id; a toolkit piece used inside a composition is marked at the call site, which the toolkit components forward to their root). Marked details that exist but are hidden by default (a collapsed panel, the back of a card until it is turned) are marked at the moment they appear.

The count is a floor for the same reason it is honest: it covers marked details only. Plain hover, focus and press states that are not marked are not in it, and several marked details are one toolkit effect used in different compositions (glide-ink tabs, decoding labels, ring gauges, glyph redraws) — each use is its own detail on its own page, and they are counted as such.

---

## Adding an interaction

1. **Write the component** in `src/components/signatures/<Name>.jsx` with a `<Name>.module.css`. Default export; it receives the block's (or aside's) data as props. Keep copy and structure in props, not in the component.
2. **Register it** in `src/components/signatures/registry.js` — `signatureRegistry` for a block, `asideRegistry` for a hero object. Use `lazy(() => import('./Name'))`.
3. **Use it from a page's data file** (`src/data/pages/<route>.js`):
   ```js
   { type: 'signature', kind: 'name', anchor: 'try', railLabel: 'Try it',
     scene: 'privacy-quiet-grid', minHeight: 560,
     eyebrow: '…', title: '…', intro: '…', /* your props */ }
   ```
   `anchor` + `railLabel` put it on the page's scroll rail; `minHeight` reserves space while the chunk loads so nothing below jumps.
4. **Pick a calm scene.** Text-dense blocks must use a quiet background: `node qa/scene-metrics.mjs` lists which scenes are calm enough and fails when a block exceeds the limit.
5. **Mark the details** with `fx('page.name')` — the composition and each separate behaviour inside it; add any non-prose data keys to `SKIP_KEYS`.
6. **Check it** — `npm run lint`, `node qa/foreground-inventory.mjs`, then look at it at 1440 and 390 px, with the keyboard, and with `prefers-reduced-motion`.
7. **Add it to the catalogue** in `src/animation/catalog/inventory.js` (FOREGROUND) and to the table above, then regenerate the list: `node qa/foreground-inventory.mjs --markdown > FOREGROUND-DETAILS.md`.

To add a *page* (not only an interaction): write `src/data/pages/<route>.js`, add its key to `pageRouteKeys` in `src/app/routeConfig.js` (and to `directory` if it belongs in the footer), run `npm run build` (the sitemap regenerates).
