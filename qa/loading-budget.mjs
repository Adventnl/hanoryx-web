/* Production loading regression: the home page stays focused on its own
   resources, while search still reaches the complete generated index. */
import { BASE, launch, newContext, pause, reporter, watchErrors } from './lib.mjs';

const r = reporter('loading budget');
const browser = await launch();

try {
  const context = await newContext(browser);
  const page = await context.newPage();
  const errors = watchErrors(page);
  const requests = [];
  page.on('requestfinished', (request) => requests.push(request));

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').waitFor();
  await pause(5000);
  const scripts = requests.filter((request) => request.resourceType() === 'script').length;
  r.check('home does not fetch search or the page catalog', !requests.some((request) => /searchDocuments|pageCatalog/.test(request.url())));
  r.check('home keeps the script request budget under 50', scripts < 50, `${scripts} scripts`);

  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Search Hanoryx Systems' });
  await dialog.waitFor();
  await dialog.getByRole('status').filter({ hasText: 'Suggested pages' }).waitFor({ timeout: 20000 });
  await dialog.getByRole('combobox').fill('idempotency');
  r.check('search finds indexed body text', await dialog.getByRole('option').count() > 0);
  r.check('search fetches one index asset', requests.filter((request) => /searchDocuments.*\.json/.test(request.url())).length === 1);
  r.check('search and home have no browser errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await context.close();

  const retryContext = await newContext(browser);
  const retryPage = await retryContext.newPage();
  let attempts = 0;
  await retryPage.route(/searchDocuments\.generated-.*\.json/, (route) => {
    attempts += 1;
    return attempts === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue();
  });
  await retryPage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await retryPage.locator('main h1').waitFor();
  await retryPage.keyboard.press('Control+k');
  const retryDialog = retryPage.getByRole('dialog', { name: 'Search Hanoryx Systems' });
  await retryDialog.getByText('Search could not load the page index.').waitFor({ timeout: 20000 });
  await retryDialog.getByRole('button', { name: 'Try again' }).click();
  await retryDialog.getByRole('status').filter({ hasText: 'Suggested pages' }).waitFor({ timeout: 20000 });
  r.check('failed search index can be retried', attempts === 2, `${attempts} attempts`);
  await retryContext.close();

  const catalogContext = await newContext(browser);
  const catalogPage = await catalogContext.newPage();
  let catalogAttempts = 0;
  await catalogPage.route(/pageCatalog\.generated-.*\.json/, (route) => {
    catalogAttempts += 1;
    return catalogAttempts === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue();
  });
  await catalogPage.goto(`${BASE}/sitemap`, { waitUntil: 'domcontentloaded' });
  const catalogError = catalogPage.getByRole('alert').filter({ hasText: 'page list could not load' });
  await catalogError.waitFor({ timeout: 20000 });
  await catalogError.getByRole('button', { name: 'Try again' }).click();
  await catalogPage.locator('main a[href="/legal/privacy"]').waitFor({ timeout: 20000 });
  r.check('failed page catalog can be retried', catalogAttempts === 2, `${catalogAttempts} attempts`);
  await catalogContext.close();
} finally {
  await browser.close();
}

r.done();
