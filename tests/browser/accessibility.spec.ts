import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
}

test('representative reading state has no serious automated accessibility violations', async ({ page }) => {
  await page.goto('./#part-ii');
  await expectNoSeriousViolations(page);
});

test('open navigation and glossary dialog remain accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.locator('#publication-contents summary').click();
  await expectNoSeriousViolations(page);
  await page.locator('#publication-contents summary').click();
  await page.locator('.glossary-cue').first().click();
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await expectNoSeriousViolations(page);
});

test('comparison and expanded process states remain accessible', async ({ page }) => {
  await page.goto('./#part-iii');
  await expectNoSeriousViolations(page);
  await page.goto('./#part-iv');
  await page.locator('[data-process-domain]').evaluateAll((details) => details.forEach((detail) => detail.setAttribute('open', '')));
  await expectNoSeriousViolations(page);
});

test('heading hierarchy and principal landmarks are coherent', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Publication contents"]')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Reading entry points"]')).toHaveCount(1);
  const levels = await page.locator('main h1, main h2, main h3, main h4').evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  for (let index = 1; index < levels.length; index += 1) {
    expect(levels[index]).toBeLessThanOrEqual((levels[index - 1] ?? 1) + 1);
  }
});

test('keyboard operation covers skip link, navigation, process disclosure and glossary escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  const nav = page.locator('#publication-contents');
  const navSummary = nav.locator('summary');
  await navSummary.focus();
  await navSummary.press('Enter');
  await expect(nav).toHaveAttribute('open', '');
  await navSummary.press('Escape');
  await expect(nav).not.toHaveAttribute('open', '');
  await expect(navSummary).toBeFocused();

  const processSummary = page.locator('[data-process-domain] summary').first();
  const processDetail = page.locator('[data-process-domain]').first();
  await processSummary.focus();
  const wasOpen = await processDetail.getAttribute('open') !== null;
  await processSummary.press('Enter');
  if (wasOpen) await expect(processDetail).not.toHaveAttribute('open', '');
  else await expect(processDetail).toHaveAttribute('open', '');

  const cue = page.locator('.glossary-cue').first();
  await cue.focus();
  await cue.press('Enter');
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await expect(page.locator('#glossary-dialog-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#glossary-dialog')).not.toBeVisible();
  await expect(cue).toBeFocused();
});

test('full glossary link closes the dialog and lands on the durable definition target', async ({ page }) => {
  await page.goto('./');
  const cue = page.locator('.glossary-cue').first();
  await cue.click();
  const destination = await page.locator('#glossary-dialog-full-link').getAttribute('href');
  expect(destination).toMatch(/^#glossary-/);
  await page.locator('#glossary-dialog-full-link').click();
  await expect(page.locator('#glossary-dialog')).not.toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${destination!.replace('#', '#')}$`));
  await expect(page.locator(destination!)).toBeFocused();
});

test('standalone navigation and disclosure controls meet the 44px interaction target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.locator('#publication-contents summary').click();
  const selectors = ['.reader-mark', '#publication-contents summary', '.contents-list a', '.entry-points a', '.case-sequence a', '[data-process-domain] summary'];
  for (const selector of selectors) {
    const boxes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
});
