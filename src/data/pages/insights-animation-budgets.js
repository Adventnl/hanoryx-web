import { engineeringTerms } from '../glossary';

const page = {
  key: 'insights/animation-budgets',
  title: 'Animation Budgets',
  accent: '#ff3333',
  aliases: ['animation', 'performance', 'frame rate', '60fps', 'jank', 'motion', 'transform', 'gpu', 'reduced motion', 'easing', 'canvas', 'smooth', 'frame budget', 'requestanimationframe'],
  hero: {
    scene: 'motion-curve-field',
    intensity: 'hero',
    eyebrow: 'Insights / Interfaces',
    title: 'Sixteen milliseconds to make a picture.',
    intro:
      'Motion on a screen is a series of pictures, and each has a deadline. Miss it and the movement stutters. This guide is about spending that time carefully — measured on your own device, not asserted from a chart.',
    code: 'INS.08',
    status: 'GUIDE · MOTION',
    actions: [
      { label: 'Measure your device', to: '/insights/animation-budgets#try' },
      { label: 'Read the guide', to: '/insights/animation-budgets#guide', variant: 'outline' },
    ],
    aside: { kind: 'articleArt', art: 'budget', caption: 'A frame is a bar. The work has to fit inside it.' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'frameBudget',
      anchor: 'try',
      railLabel: 'Try it',
      scene: 'privacy-quiet-grid',
      minHeight: 760,
      eyebrow: 'Try it',
      title: 'Spend the budget. Count the frames.',
      intro: 'Choose how many boxes to move and what moves them, then press Run. The page really animates them for a couple of seconds and counts the frames it manages. The result is a measurement of this device, right now.',
      note: 'A small measurement made in your browser, then discarded. It is not a benchmark: the result depends on your screen, your browser, what else is open and how warm the device is.',
    },
    {
      type: 'signature',
      kind: 'document',
      variant: 'article',
      anchor: 'guide',
      railLabel: 'The guide',
      scene: 'architectural-grid',
      minHeight: 1000,
      eyebrow: 'The guide',
      title: 'Animation budgets.',
      intro: 'What a frame costs, what moves cheaply, how to measure, and how to stay kind to people who want less motion.',
      version: 'General guidance',
      summary: [
        'At 60 frames a second each {{frame}} has about **16.7 ms**; on a faster screen, less. That is the {{frame budget}}.',
        'Moving a thing with `transform` and `opacity` is cheap. Changing its size or position in the layout is not.',
        '**Measure** on a real mid-range device, and always honour {{reduced motion}}.',
      ],
      meta: [
        { k: 'For', v: 'Anyone building or commissioning animated interfaces' },
        { k: 'Kind', v: 'General guidance. Numbers are typical, not guaranteed.' },
      ],
      terms: engineeringTerms,
      sections: [
        {
          id: 'budget',
          title: 'What a frame budget is',
          plain: 'The time you have before the next picture is due.',
          body: [
            'A screen redraws many times a second: usually 60, on some devices 90, 120 or more. To look smooth, each new picture — each {{frame}} — must be ready before the screen asks for it. Divide a second by the rate and you have the {{frame budget}}.',
            {
              table: {
                head: ['Screen rate', 'Time per frame', 'What that leaves your code'],
                rows: [
                  ['60 Hz', '16.7 ms', 'Perhaps 8 to 10 ms, once the browser has done its own work'],
                  ['90 Hz', '11.1 ms', 'Perhaps 5 to 7 ms'],
                  ['120 Hz', '8.3 ms', 'Perhaps 3 to 5 ms'],
                ],
              },
              caption: 'Typical figures. The browser needs part of every frame for itself.',
            },
            'When a frame takes longer, it is simply late, and the eye sees a stutter: {{jank}}. One late frame is invisible. A run of them is not.',
          ],
        },
        {
          id: 'pipeline',
          title: 'What it costs to move a thing',
          plain: 'Three stages, and you can often skip two of them.',
          body: [
            'To show a change, a browser may need to do up to three jobs, in order.',
            {
              steps: [
                { title: 'Layout', body: 'Work out the size and position of everything the change affects. Moving one box can force the browser to recompute many.' },
                { title: 'Paint', body: 'Fill in pixels: colours, borders, shadows, text.' },
                { title: 'Composite', body: 'Slide the already-painted layers into place, usually on the graphics chip. This is the cheap one.' },
              ],
            },
            'The cheap animations are those that need **only the last stage**. The browser paints a layer once, then moves, fades or scales it on the {{compositor}} without redoing the first two jobs.',
            {
              table: {
                head: ['Property you animate', 'Layout?', 'Paint?', 'Cost'],
                rows: [
                  ['`transform` (move, scale, rotate)', 'no', 'no', 'Low'],
                  ['`opacity`', 'no', 'no', 'Low'],
                  ['`background-color`, `color`', 'no', 'yes', 'Medium'],
                  ['`box-shadow`, `filter`', 'no', 'yes', 'Medium to high'],
                  ['`width`, `height`, `margin`', 'yes', 'yes', 'High'],
                  ['`top`, `left`', 'yes', 'yes', 'High'],
                ],
              },
              caption: 'The demonstration lets you compare the first, the fourth and the last in practice.',
            },
            { note: 'The rule of thumb is not “always use transform”. It is: when you have a choice, choose the property that skips {{layout}} and {{paint}}, and check by measuring.', label: 'A rule of thumb' },
          ],
        },
        {
          id: 'measure',
          title: 'Measure, don’t guess',
          plain: 'The only trustworthy number is one from a real device.',
          body: [
            'Intuition about performance is unreliable, especially on a fast development machine. Three habits fix that.',
            { list: [
              '**Use the browser’s own tools.** The performance panel shows each frame, how long it took and what it was spent on.',
              '**Sample the frames yourself.** Call {{requestAnimationFrame}} in a loop and record how long passes between calls. The demonstration does exactly this.',
              '**Test on a mid-range phone.** If your slowest realistic visitor’s device holds the frame rate, the faster ones will too. The reverse is not true.',
              '**Look at the bad frames, not the average.** An average of 60 frames a second can hide a stutter every second. Look at the slowest few percent.',
            ] },
          ],
        },
        {
          id: 'count',
          title: 'How many things move',
          plain: 'One box is free. A thousand is a decision.',
          body: [
            'Cost grows with the number of things being animated, and with how expensive each is. A single fading element costs nothing noticeable; two hundred particles with shadows can use the whole budget.',
            { list: [
              'Animate **fewer, larger** things when you can, and let the rest be still.',
              'Animate things **in view**. See the section on hidden content below.',
              'Group effects that always move together, so the browser handles one layer instead of fifty.',
              'Avoid animating in lists of hundreds. Animate the few that are on screen.',
            ] },
            'In the demonstration, try 300 boxes on `transform`, and then 300 on `left / top`. The difference in frame rate is the pipeline table above, felt.',
          ],
        },
        {
          id: 'canvas',
          title: 'Canvas and drawn scenes',
          plain: 'You draw every pixel yourself, so you pay for every pixel.',
          body: [
            'A {{canvas}} is a surface a script draws on, and it is how animated backgrounds, charts and generative scenes are made. Its cost is mostly the number of pixels and the amount drawn on them each frame.',
            { list: [
              '**Cap the resolution.** A phone may report a pixel ratio of three. Drawing at three times the size in each direction means nine times the pixels. Capping at two often looks identical and costs far less.',
              '**Draw only what changed**, or only what is visible.',
              '**Keep the work per frame small and predictable.** Allocating new objects each frame invites pauses while the browser tidies up.',
              '**Provide a still version.** A background that can be turned off is a courtesy to people and to batteries.',
            ] },
            'This website draws its backgrounds on canvas, and its display settings include a calm mode that freezes them.',
          ],
        },
        {
          id: 'hidden',
          title: 'Off-screen and hidden',
          plain: 'The cheapest animation is the one that is not running.',
          body: [
            'Anything the visitor cannot see should stop. Two signals tell you.',
            { list: [
              '**It has scrolled out of view.** An IntersectionObserver reports when an element enters or leaves the screen; pause the animation when it leaves.',
              '**The tab is in the background.** The page visibility event says when the visitor has switched away; stop timers and loops.',
            ] },
            'Both are easy to forget, and both matter more on a phone, where continuous drawing drains the battery noticeably.',
          ],
        },
        {
          id: 'scroll',
          title: 'Scroll-linked effects',
          plain: 'Code that runs on every scroll runs very often.',
          body: [
            'A scroll event can fire many times per frame. Doing real work inside it is a common source of jank.',
            { ol: [
              'Do as little as possible in the handler: record the position and schedule one update with `requestAnimationFrame`.',
              'Register it as **passive**, to tell the browser you will not cancel the scroll.',
              'Update with `transform` or `opacity`, not with layout properties.',
              'Where the browser can do it natively (for example sticky positioning, or scroll-driven animations), prefer that to script.',
            ] },
          ],
        },
        {
          id: 'thrash',
          title: 'Reading and writing layout',
          plain: 'Mixing the two forces the browser to recompute, repeatedly.',
          body: [
            'Reading a measurement such as an element’s height forces the browser to bring {{layout}} up to date first. If you then change something and read again, it must redo the work. In a loop over many elements, this is called **layout thrashing**, and it can make a smooth page crawl.',
            { code: '// slow: read, write, read, write ...\nitems.forEach((el) => {\n  const h = el.offsetHeight;         // forces layout\n  el.style.height = h + 10 + "px";   // invalidates it again\n});\n\n// fast: all the reads, then all the writes\nconst heights = items.map((el) => el.offsetHeight);\nitems.forEach((el, i) => { el.style.height = heights[i] + 10 + "px"; });' },
          ],
        },
        {
          id: 'easing',
          title: 'Easing and duration',
          plain: 'How a movement feels depends on how its speed changes.',
          body: [
            '{{easing}} describes how speed changes across a movement. The same slide feels brisk, floaty or sluggish depending on it. A few principles carry far.',
            {
              defs: [
                { k: 'Ease-out', v: 'Starts fast and settles gently. Right for things that appear in response to a press, because it reacts at once.' },
                { k: 'Ease-in', v: 'Starts slow and finishes fast. Right for things that are leaving the screen, and rarely anywhere else.' },
                { k: 'Ease-in-out', v: 'Slow at both ends. Right for movements that go from one place on screen to another.' },
                { k: 'Linear', v: 'Constant speed. Right for things that are meant to feel mechanical: a loading bar, a spinner.' },
              ],
            },
            'Keep durations short for interface feedback (a few hundred milliseconds at most) and longer for storytelling. And use a **small, consistent set** of durations and curves, ideally as {{design token}}s, so the whole interface moves in one voice.',
            'The ending of this page lets you play four easings on the same menu and pick the one that feels right.',
          ],
        },
        {
          id: 'reduce',
          title: 'Calm for people who ask for it',
          plain: 'Respect the setting, and offer a control of your own.',
          body: [
            'For some people, motion is not decoration. Large movement, parallax and zooming can cause dizziness or nausea, and constant motion makes reading hard. Devices let people ask for less, and sites can hear it: the {{reduced motion}} setting.',
            { list: [
              '**Honour it.** When it is on, remove large movement, parallax and anything that loops or autoplays.',
              '**Replace, don’t just remove.** A fade can stand in for a slide, so the change is still visible without the travel.',
              '**Keep motion that carries meaning**, such as a loading indicator, in a gentler form.',
              '**Offer an in-page control** as well. Not everyone knows where the device setting is, and some want less motion on one site only.',
              '**Never make motion the only signal.** A state change shown only by movement is lost to people who cannot see it.',
            ] },
          ],
        },
        {
          id: 'team',
          title: 'A budget for a team',
          plain: 'Agree the number before the problem, not after.',
          body: [
            'On a team, “make it smooth” is not a requirement; a budget is. Decide how much each page may spend, and check it as a matter of course.',
            { list: [
              '**Choose a target.** For example: frames stay within budget at least 95% of the time on a named mid-range device, on the heaviest page.',
              '**Write down the cost of each effect** when it is added, so the budget is spent knowingly.',
              '**Measure in the build**, where you can, so a regression is caught the day it appears.',
              '**Have a way to turn effects down.** Calm mode, a lower resolution, fewer particles: a budget with no release valve breaks on the first slow device.',
            ] },
          ],
        },
        {
          id: 'checklist',
          title: 'A checklist to take away',
          plain: 'Ten questions to ask of any animation.',
          body: [
            { ol: [
              'What is it for? Would the interface be worse without it?',
              'Does it move with `transform` or `opacity`, or does it cause layout?',
              'How many things move at once?',
              'Does it stop when it is out of view or the tab is hidden?',
              'If it is a canvas, is the resolution capped?',
              'Does scroll code do the minimum, and do it passively?',
              'Are reads and writes of layout kept apart?',
              'Does the easing fit the purpose, and come from a shared set?',
              'Does it honour reduced motion, and offer its own control?',
              'Has it been measured on a mid-range device?',
            ] },
          ],
        },
      ],
      note: 'General guidance. The figures given are typical rather than guaranteed, and they vary by device and browser.',
      endLabel: 'End of the guide',
    },
    {
      type: 'closer',
      kind: 'easePick',
      anchor: 'ease',
      scene: 'spline-ribbon',
      tag: 'End of animation budgets',
      minHeight: 620,
      title: 'Open the menu four ways.',
      lede: 'The same menu, opening on four different curves. Pick the one that feels right, then compare it with the rule of thumb.',
      options: [
        { id: 'linear', label: 'Linear', css: 'linear' },
        { id: 'in', label: 'Ease-in', css: 'cubic-bezier(0.4, 0, 1, 1)' },
        { id: 'out', label: 'Ease-out', css: 'cubic-bezier(0, 0, 0.2, 1)' },
        { id: 'inout', label: 'Ease-in-out', css: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      ],
      answer: 'out',
      why: 'Something that appears in response to a press should start moving at once and settle gently. Ease-out feels immediate; ease-in makes the visitor wait for the movement to begin.',
      onward: [
        { label: 'Motion systems', to: '/north/motion-systems' },
        { label: 'Accessibility statement', to: '/legal/accessibility' },
        { label: 'All insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
