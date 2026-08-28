import { expect, test } from '@playwright/test';

test('publication renders durable static structure and integrated workstreams', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('h1')).toContainText('Human Story of Extreme Mass Homicide');
  await expect(page.locator('.case-study')).toHaveCount(8);
  await expect(page.locator('[data-process-domain]')).toHaveCount(4);
  await expect(page.locator('#glossary .glossary-entry').first()).toBeVisible();
  await expect(page.locator('#references')).toContainText('Dutton');
  const process = page.locator('#part-iv');
  await expect(process).toContainText('Do not read this as a sequence');
  await expect(process).toContainText('not the six-stage or eight-stage taxonomy previously used in this repository');
  await expect(process).toContainText('does not incorporate Gregory Stanton');
});

test('mobile navigation, deep links, history and current location remain browser-native', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const contents = page.locator('#publication-contents');
  await expect(contents).not.toHaveAttribute('open', '');
  await contents.locator('summary').click();
  await expect(contents).toHaveAttribute('open', '');
  await contents.locator('a[href="#part-iv"]').click();
  await expect(page).toHaveURL(/#part-iv$/);
  await expect(contents).not.toHaveAttribute('open', '');
  await page.goBack();
  await expect(page).not.toHaveURL(/#part-iv$/);
});

test('glossary enhancement uses a dialog and restores focus without replacing static anchors', async ({ page }) => {
  await page.goto('./');
  const cue = page.locator('.glossary-cue').first();
  await cue.focus();
  await cue.press('Enter');
  const dialog = page.locator('#glossary-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#glossary-dialog-title')).not.toBeEmpty();
  await page.locator('#glossary-dialog-close').click();
  await expect(cue).toBeFocused();
  const href = await cue.getAttribute('href');
  expect(href).toMatch(/^#glossary-/);
});

test('core publication remains readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#publication-contents')).toHaveAttribute('open', '');
  await expect(page.locator('.case-study')).toHaveCount(8);
  await expect(page.locator('[data-process-domain]')).toHaveCount(4);
  await expect(page.locator('#glossary')).toBeVisible();
  await expect(page.locator('#references')).toBeVisible();
  await page.locator('a[href="#part-iv"]').first().click();
  await expect(page).toHaveURL(/#part-iv$/);
  await context.close();
});
