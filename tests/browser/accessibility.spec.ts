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
