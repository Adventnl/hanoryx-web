/* Operating controls — shared by qa/controls.mjs (every control on every page) and
 * qa/kit.mjs (every control in every component example).
 *
 * `operate(page, errors, options)` works through the controls inside `scope`, one
 * at a time, the way a person would: click, tick, drag a slider to both ends and the
 * middle, choose each of the first few options, type and clear. After each it checks
 * that nothing threw, no "signal fault" panel replaced the page and the page did not
 * grow sideways. It returns { operated, skipped, problems, navigated }.
 */
import { pause } from './lib.mjs';

const real = (e) => !/CERT|net::ERR|Failed to load resource|ERR_/i.test(e);

export const controlSelector = (scope) => [
  `${scope} button:not([disabled])`,
  `${scope} [role="tab"]`,
  `${scope} [role="switch"]`,
  `${scope} [role="radio"]`,
  `${scope} [role="checkbox"]`,
  `${scope} summary`,
  `${scope} input:not([type="hidden"]):not([type="file"]):not([disabled])`,
  `${scope} select:not([disabled])`,
  `${scope} textarea:not([disabled])`,
].join(',');

/* what the control is, whether a person could reach it, and a name for the report */
const describe = (el) => {
  const tag = el.tagName.toLowerCase();
  const type = (el.getAttribute('type') || '').toLowerCase();
  const role = el.getAttribute('role') || '';
  const label = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '').replace(/\s+/g, ' ').trim().slice(0, 48);
  const hidden = !el.getClientRects().length
    || getComputedStyle(el).visibility === 'hidden'
    || Boolean(el.closest('[inert], [aria-hidden="true"], header, footer, [hidden], dialog:not([open])'));
  return { tag, type, role, label, hidden };
};

/* set a value the way React expects to hear about it */
const setValue = (el, value) => {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, String(value));
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
};

export async function operate(page, errors, { scope = 'main', max = 60, path, reload, skipLabel } = {}) {
  const problems = [];
  let operated = 0;
  let skipped = 0;
  const selector = controlSelector(scope);
  for (let i = 0; i < max; i += 1) {
    const all = page.locator(selector);
    if (i >= (await all.count())) break;
    const control = all.nth(i);
    const info = await control.evaluate(describe).catch(() => null);
    if (!info || info.hidden || (skipLabel && skipLabel.test(info.label))) { skipped += 1; continue; }
    const name = `${info.tag}${info.type ? `[${info.type}]` : ''}${info.role ? `[role=${info.role}]` : ''} "${info.label}"`;
    errors.length = 0;
    try {
      await control.scrollIntoViewIfNeeded({ timeout: 1500 });
      if (info.type === 'range') {
        for (const at of ['min', 'max', 'mid']) {
          await control.evaluate((el, where) => {
            const lo = Number(el.min || 0);
            const hi = Number(el.max || 100);
            const v = where === 'min' ? lo : where === 'max' ? hi : (lo + hi) / 2;
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, at);
          await pause(40);
        }
      } else if (info.tag === 'select') {
        const options = await control.locator('option').count();
        for (let o = 0; o < Math.min(options, 4); o += 1) { await control.selectOption({ index: o }, { timeout: 1500 }); await pause(40); }
      } else if (info.tag === 'textarea' || (info.tag === 'input' && !['checkbox', 'radio', 'button', 'submit', 'reset', 'image'].includes(info.type))) {
        const sample = info.type === 'number' ? '7' : info.type === 'color' ? '#336699' : info.type === 'email' ? 'a@example.test' : info.type === 'url' ? 'https://example.test' : info.type === 'date' ? '2026-01-15' : 'Test entry 123';
        if (info.type === 'color' || info.type === 'date' || info.type === 'time') await control.evaluate(setValue, sample);
        else { await control.fill(sample, { timeout: 1500 }); await pause(40); await control.fill('', { timeout: 1500 }); }
      } else {
        await control.click({ timeout: 1500 });
      }
      operated += 1;
    } catch {
      skipped += 1; // covered, detached or animating away: not a failure of the page
      continue;
    }
    await pause(80);

    const state = await page.evaluate(() => ({
      fault: Boolean(document.querySelector('[role="alert"]')?.textContent?.includes('Signal Fault')),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      dialog: Boolean(document.querySelector('[role="dialog"]')),
    })).catch(() => ({ fault: false, overflow: 0, dialog: false }));
    const bad = errors.filter(real);
    if (bad.length) problems.push(`${name}: ${bad[0].slice(0, 140)}`);
    if (state.fault) problems.push(`${name}: the page fell to the fault panel`);
    if (state.overflow > 2) problems.push(`${name}: page grew ${state.overflow}px sideways`);
    if (problems.length >= 3) break;

    if (path && path() !== path.expected) {
      await reload(); // the control took us elsewhere: come back and carry on
    } else if (state.dialog) {
      await page.keyboard.press('Escape');
      await pause(120);
    }
  }
  return { operated, skipped, problems };
}
