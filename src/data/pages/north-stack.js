import { licences } from '../licences';

const runtime = licences.filter((l) => l.kind === 'runtime').length;
const build = licences.filter((l) => l.kind === 'build').length;

const page = {
  key: 'north/stack',
  title: 'The Stack',
  accent: '#ff3333',
  aliases: ['technology', 'tech stack', 'react', 'vite', 'gsap', 'dependencies', 'libraries', 'frameworks', 'tools we use', 'architecture of this site'],
  hero: {
    scene: 'dependency-graph',
    intensity: 'hero',
    eyebrow: 'Development / The stack',
    title: 'What this site is made of.',
    intro: `${runtime} libraries run in your browser and ${build} more build and check the site. Everything else — the pages, the layout system, the sixty-odd drawn backgrounds — was written for it. Here is each part, and why it is there.`,
    code: 'NTH.08',
    status: `${runtime} + ${build} PACKAGES`,
    actions: [
      { label: 'See the stack', to: '/north/stack#stack' },
      { label: 'Pull one out', to: '/north/stack#remove', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'stackMap',
      anchor: 'stack',
      railLabel: 'The stack',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'The stack',
      title: 'From what you touch to what builds it.',
      intro: 'Seven layers, top to bottom. Choose a part for its version, its licence and the reason it earned a place. Dashed parts are code written for this site.',
      layers: [
        { id: 'face', name: 'The interface', blurb: 'What a visitor sees and touches', packages: [
          { name: 'React components', why: 'The pages are components. Page content lives in data files and is rendered by a small set of block types.' },
          { name: 'CSS Modules', why: 'Each component’s styles are local to it, with shared values coming from design tokens. No CSS framework.' },
          { name: 'lucide-react', why: 'The small line icons, imported one by one so that only the ones used are shipped.' },
          { name: 'clsx', why: 'Joins class names conditionally, in a few bytes.' },
        ] },
        { id: 'motion', name: 'Motion and drawing', blurb: 'What moves, and how it is drawn', packages: [
          { name: 'gsap', why: 'Timelines and pointer-driven effects, where precise sequencing is worth a library: the intro, the cursor, magnetic buttons and the text that answers the pointer.' },
          { name: '@gsap/react', why: 'Connects GSAP to React’s lifecycle so animations are set up and cleaned up properly.' },
          { name: 'motion', why: 'The entrance reveals as sections arrive, page transitions, and the springs and glides in menus, tabs and panels.' },
          { name: 'lenis', why: 'Smooth scrolling, wrapped in one place so it can be removed without touching pages.' },
          { name: 'Canvas scenes', why: 'The animated backgrounds are plain drawing code on a canvas. No graphics library.' },
        ] },
        { id: 'routing', name: 'Routing and data', blurb: 'How a page is found and filled', packages: [
          { name: 'react-router-dom', why: 'Page addresses, links and navigation. Every page is a route.' },
          { name: 'Page data files', why: 'Each page is a data file loaded on demand, so a visitor downloads the page they are reading, not all of them.' },
        ] },
        { id: 'framework', name: 'The framework', blurb: 'What it is all built on', packages: [
          { name: 'react', why: 'The component model and state.' },
          { name: 'react-dom', why: 'Puts React’s output into the browser’s document.' },
        ] },
        { id: 'build', name: 'Build', blurb: 'Turning source into a site', packages: [
          { name: 'vite', why: 'A fast development server and the production bundler. It splits the site into pieces so pages load only what they use.' },
          { name: '@vitejs/plugin-react', why: 'Teaches the build about React’s syntax.' },
        ] },
        { id: 'checks', name: 'Checks', blurb: 'What guards each change', packages: [
          { name: 'eslint', why: 'Reads the code and flags mistakes before it runs.' },
          { name: 'eslint-plugin-react-hooks', why: 'Catches the ways components go wrong: state set in the wrong place, impure rendering.' },
          { name: 'playwright-core', why: 'Drives a real browser through every page and interaction.' },
          { name: 'axe-core', why: 'Tests every page against accessibility rules.' },
        ] },
        { id: 'deploy', name: 'Deploy', blurb: 'Putting it on the internet', packages: [
          { name: 'wrangler', why: 'The tool that publishes the built site to its host.' },
        ] },
      ],
      note: 'Versions and licences are read from the same data as the licences page. Layer membership is our own grouping.',
    },
    {
      type: 'stats',
      anchor: 'figures',
      railLabel: 'The numbers',
      eyebrow: 'The numbers',
      title: 'Small on purpose.',
      items: [
        { value: runtime, label: 'Libraries shipped', note: 'Run in the visitor’s browser' },
        { value: build, label: 'Build and check tools', note: 'Never sent to a visitor' },
        { value: 0, label: 'CSS frameworks', note: 'Styles are written for the site' },
        { value: 0, label: 'State libraries', note: 'React’s own state and context' },
      ],
    },
    {
      type: 'modules',
      anchor: 'choices',
      railLabel: 'Choices and trade-offs',
      scene: 'architectural-grid',
      eyebrow: 'Choices and trade-offs',
      title: 'What was chosen, and what it costs.',
      rows: [
        { k: 'NO CSS FRAMEWORK', v: 'Styles are local to components and use design tokens. It costs writing more CSS and buys a smaller site that looks like itself.' },
        { k: 'SPLIT BY PAGE', v: 'Page text, signature compositions and page endings are each their own downloadable piece. It costs a short wait the first time a piece is needed, and a lot less everywhere else.' },
        { k: 'CANVAS BY HAND', v: 'The backgrounds are written, not borrowed. It costs time and buys control over their weight, their stillness and their calm mode.' },
        { k: 'ONE WRAPPER PER BIG IDEA', v: 'Smooth scrolling is wrapped in one place. A library can be swapped by changing one file instead of hundreds.' },
        { k: 'FEW LIBRARIES', v: 'Every dependency is code someone else can change under you. The set stays small, and each part earned its place.' },
      ],
    },
    {
      type: 'closer',
      kind: 'whatIfRemove',
      anchor: 'remove',
      scene: 'node-compression',
      tag: 'End of the stack',
      minHeight: 640,
      title: 'Pull one out.',
      lede: 'Choose a part of the stack and take it away in your head. The card says what stops, what carries on and what it would cost to replace. The judgements are ours.',
      parts: [
        { id: 'lenis', name: 'lenis', kind: 'Runtime', headline: 'Scrolling would be the browser’s own.', stops: 'The smooth, eased scrolling and the glide to a section when a link points at one.', keeps: 'Every page, every link and all content. Scroll-linked effects would still read the scroll position.', effort: 'Small', how: 'It lives behind one provider and one hook. Change what the hook returns and the callers carry on.', files: 1 },
        { id: 'gsap', name: 'gsap', kind: 'Runtime', headline: 'The timelines and the pointer-driven effects go.', stops: 'The intro sequence, the custom cursor, magnetic buttons, the title that answers the pointer and the marquee that scroll speed pushes.', keeps: 'Content, routing, layout and the canvases. The entrance reveals use the other animation library and would carry on.', effort: 'Medium', how: 'Each effect is its own component. They could be dropped one by one, or rewritten with CSS and the other library.', files: 17 },
        { id: 'motion', name: 'motion', kind: 'Runtime', headline: 'Things would arrive and change without easing.', stops: 'The entrance reveals as sections scroll into view, page transitions, and the springs and glides in menus, tabs and panels.', keeps: 'All content and function. Controls would still work, and change state at once.', effort: 'Large', how: 'It is used widely. Most uses could become CSS transitions or animations; the layout transitions are the hard part.', files: 22 },
        { id: 'router', name: 'react-router-dom', kind: 'Runtime', headline: 'There would be one page.', stops: 'Every page address, every link between pages and the back button’s meaning.', keeps: 'Components and styles. The content would have nowhere to be addressed.', effort: 'Large', how: 'Routing is the skeleton of the site. Replacing it with another router is realistic; removing it is not.', files: 40 },
        { id: 'icons', name: 'lucide-react', kind: 'Runtime', headline: 'The small line icons disappear.', stops: 'Arrows, chevrons, and the pictograms on buttons and cards.', keeps: 'All text and behaviour. Controls keep their labels.', effort: 'Medium', how: 'Replace with inline SVGs, one icon at a time. Tedious rather than hard.', files: 100 },
        { id: 'clsx', name: 'clsx', kind: 'Runtime', headline: 'Class names would be joined by hand.', stops: 'Nothing visible; a convenience for conditional class names.', keeps: 'Everything.', effort: 'Small', how: 'It does one tiny job; template strings could do it, at the price of tidiness.', files: 146 },
        { id: 'canvas', name: 'The canvas scenes', kind: 'Ours', headline: 'The backgrounds would be plain.', stops: 'The animated backgrounds behind every section and hero.', keeps: 'All content and function. Calm mode already shows pages without moving backgrounds.', effort: 'Small', how: 'Sections declare a scene by name. Removing them leaves a quiet page that works.', files: null },
      ],
      onward: [
        { label: 'Licences and notices', to: '/trust/licences' },
        { label: 'Site engineering', to: '/engineering' },
      ],
    },
  ],
};

export default page;
