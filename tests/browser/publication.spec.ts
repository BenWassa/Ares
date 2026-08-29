import { expect, test } from '@playwright/test';

test('opening is a publication gateway rather than the former monolithic document', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('h1')).toContainText('Human Story of Extreme Mass Homicide');
  await expect(page.locator('.chapter-directory')).toBeVisible();
  await expect(page.locator('.case-index li')).toHaveCount(8);
  await expect(page.locator('.case-study')).toHaveCount(0);
  await expect(page.locator('a[href="/Ares/framework"]')).toBeVisible();
  await expect(page.locator('a[href="/Ares/process"]')).toBeVisible();
});

test('major scholarly surfaces are dedicated static routes with durable anchors', async ({ page }) => {
  await page.goto('./framework');
  await expect(page.locator('#part-i')).toBeVisible();
  await expect(page.locator('#scope-purpose')).toBeVisible();

  await page.goto('./cases/armenian-genocide');
  await expect(page.locator('.case-study')).toHaveCount(1);
  await expect(page.locator('#armenian-genocide-title')).toBeVisible();
  await expect(page.locator('.chronology')).toBeVisible();

  await page.goto('./process');
  await expect(page.locator('[data-process-domain]')).toHaveCount(4);
  await expect(page.locator('#part-iv')).toContainText('Do not read this as a sequence');
  await expect(page.locator('#part-iv')).toContainText('not the six-stage or eight-stage taxonomy previously used in this repository');
  await expect(page.locator('#part-iv')).not.toContainText('Stanton');
  await expect(page.locator('a[href="/Ares/references#ref-src-dutton-2005"]').first()).toBeAttached();

  await page.goto('./references');
  await expect(page.locator('#ref-src-dutton-2005')).toBeAttached();
});

test('legacy root fragment URLs resolve to the new publication routes', async ({ page }) => {
  await page.goto('./#part-iv');
  await expect(page).toHaveURL(/\/Ares\/process$/);
  await page.goto('./#armenian-genocide');
  await expect(page).toHaveURL(/\/Ares\/cases\/armenian-genocide$/);
});

test('mobile publication contents open, close and navigate without a client router', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  const contents = page.locator('#publication-contents');
  await expect(contents).not.toHaveAttribute('open', '');
  await contents.locator('summary').click();
  await expect(contents).toHaveAttribute('open', '');
  await contents.locator('a[href="/Ares/process"]').click();
  await expect(page).toHaveURL(/\/Ares\/process$/);
});

test('glossary enhancement preserves a durable cross-route target and focus restoration', async ({ page }) => {
  await page.goto('./framework');
  const cue = page.locator('.glossary-cue').first();
  const href = await cue.getAttribute('href');
  expect(href).toMatch(/^\/Ares\/glossary#glossary-/);
  await cue.focus();
  await cue.press('Enter');
  const dialog = page.locator('#glossary-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#glossary-dialog-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(cue).toBeFocused();
});

test('core publication remains readable and navigable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#publication-contents')).toHaveAttribute('open', '');
  await expect(page.locator('.case-study')).toHaveCount(0);
  await page.locator('a[href="/Ares/cases/armenian-genocide"]').first().click();
  await expect(page.locator('#armenian-genocide-title')).toBeVisible();
  await expect(page.locator('.chronology')).toBeVisible();
  await page.goto('http://127.0.0.1:4321/Ares/process');
  await expect(page.locator('[data-process-domain]')).toHaveCount(4);
  await context.close();
});
