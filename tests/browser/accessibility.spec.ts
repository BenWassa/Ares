import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
}

test('opening and representative case have no serious automated accessibility violations', async ({ page }) => {
  await page.goto('./');
  await expectNoSeriousViolations(page);
  await page.goto('./cases/armenian-genocide');
  await expectNoSeriousViolations(page);
});

test('open mobile navigation and glossary dialog remain accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  await page.locator('#publication-contents summary').click();
  await expectNoSeriousViolations(page);
  await page.locator('#publication-contents summary').click();
  await page.locator('.glossary-cue').first().click();
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await expectNoSeriousViolations(page);
});

test('comparison and expanded process states remain accessible', async ({ page }) => {
  await page.goto('./comparison');
  await expectNoSeriousViolations(page);
  await page.goto('./process');
  await page.locator('[data-process-domain]').evaluateAll((details) => details.forEach((detail) => detail.setAttribute('open', '')));
  await expectNoSeriousViolations(page);
});

test('heading hierarchy and principal landmarks are coherent on representative routes', async ({ page }) => {
  for (const path of ['./', './framework', './cases/armenian-genocide', './process']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Publication contents"]')).toHaveCount(1);
    const levels = await page.locator('main h1, main h2, main h3, main h4').evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) expect(levels[index]).toBeLessThanOrEqual((levels[index - 1] ?? 1) + 1);
  }
});

test('keyboard operation covers skip link, navigation, process disclosure and glossary escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  const nav = page.locator('#publication-contents');
  const summary = nav.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(nav).toHaveAttribute('open', '');
  await summary.press('Escape');
  await expect(nav).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();

  const cue = page.locator('.glossary-cue').first();
  await cue.focus();
  await cue.press('Enter');
  await expect(page.locator('#glossary-dialog-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(cue).toBeFocused();

  await page.goto('./process');
  const processSummary = page.locator('[data-process-domain] summary').first();
  await processSummary.focus();
  await processSummary.press('Enter');
  await expect(processSummary).toBeFocused();
});

test('standalone navigation and disclosure controls meet the 44px interaction target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./process');
  await page.locator('#publication-contents summary').click();
  const selectors = ['.reader-mark', '#publication-contents summary', '.publication-contents a', '.page-sequence a', '[data-process-domain] summary'];
  for (const selector of selectors) {
    const boxes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => { const rect = element.getBoundingClientRect(); return { width: rect.width, height: rect.height }; }));
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) { expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44); }
  }
});
