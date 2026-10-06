/* Accessibility pass — axe-core over every page.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/accessibility.mjs [/route ...]
 *
 * Loads every page at desktop and phone width, scrolls it so lazy sections
 * mount, and runs axe-core (WCAG 2 A/AA, 2.1 A/AA and axe's best-practice
 * rules). The run fails on any violation and prints the rule, the element and
 * the reason.
 *
 * What this is and is not: an automated pass finds structure and attribute
 * problems (tab and list roles, aria references, heading order, scrollable
 * regions without keyboard access, text contrast where the background is
 * computable). It does not replace a screen-reader pass or a keyboard walk,
 * and text over the animated canvas backgrounds cannot be measured by it.
 */
import { createRequire } from 'node:module';
import { BASE, launch, newContext, pageRoutes, pause, reporter } from './lib.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const only = process.argv.slice(2).filter((a) => a.startsWith('/'));
const routes = only.length ? only : pageRoutes;
const r = reporter('accessibility');
const browser = await launch();

for (const [tag, options] of [
  ['desktop', { width: 1280, height: 800 }],
  ['phone', { width: 390, height: 844, mobile: true }],
]) {
  const context = await newContext(browser, options);
  const page = await context.newPage();
  const problems = [];
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await pause(1500);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await pause(50);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(400);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
        resultTypes: ['violations'],
      });
      return result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} — ${(n.failureSummary || '').split('\n')[1]?.trim() || ''}`),
        count: v.nodes.length,
      }));
    });
    violations.forEach((v) => problems.push(`${route}: ${v.id} [${v.impact}] ×${v.count} — ${v.nodes[0]}`));
  }
  r.check(`no axe violations on any page (${tag})`, problems.length === 0, problems.length ? `${problems.length} found` : '');
  problems.forEach((problem) => console.log(`        ${problem}`));
  await context.close();
}

await browser.close();
r.done();
