import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDir = 'release-evidence/home-entry';

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir(evidenceDir, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage: false, animations: 'disabled' });
}

async function expectNoOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, label).toBeLessThanOrEqual(1);
}

for (const width of [390, 430]) {
  test(`Home is a calm three-choice entry surface at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');

    await expect(page.locator('body')).toHaveClass(/ares-surface-home/);
    await expect(page.locator('.publication-header')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toHaveCount(0);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#e8ecec');
    await expect(page.getByRole('link', { name: 'Skip to entry options' })).toHaveCount(1);

    const choices = page.locator('.home-choice-row');
    await expect(choices).toHaveCount(3);
    await expect(choices.nth(0)).toContainText('Guided reading');
    await expect(choices.nth(0)).toContainText('Essential path');
    await expect(choices.nth(1)).toContainText('Explore cases');
    await expect(choices.nth(1)).toContainText('Eight cases');
    await expect(choices.nth(2)).toContainText('Full publication');
    await expect(choices.nth(2)).toContainText('Complete publication');
    await expect(page.locator('[data-resume-home]')).toBeHidden();

    await expectNoOverflow(page, `fresh Home at ${width}px`);
    await capture(page, browserName, `home-fresh-${width}`);
  });

  test(`returning-reader Home keeps resume compact and touch-safe at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./cases/my-lai-massacre/key-evidence');
    await page.goto('./');

    const resume = page.locator('[data-resume-home]');
    await expect(resume).toBeVisible();
    await expect(resume).toHaveClass(/resume-card--compact/);
    await expect(resume.locator('[data-resume-description]')).toContainText('stored only in this browser');
    await expect(resume.locator('[data-resume-clear]')).toBeVisible();

    for (const control of [resume.locator('[data-resume-link]'), resume.locator('[data-resume-clear]')]) {
      const box = await control.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    await expectNoOverflow(page, `returning Home at ${width}px`);
    await capture(page, browserName, `home-returning-${width}`);
  });
}

test('publication surfaces retain publication chrome and theme colour', async ({ page }) => {
  await page.goto('./framework');
  await expect(page.locator('body')).toHaveClass(/ares-surface-publication/);
  await expect(page.locator('.publication-header')).toBeVisible();
  await expect(page.locator('.site-footer')).toBeVisible();
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0f1c1d');
  await expect(page.getByRole('link', { name: 'Skip to publication' })).toHaveCount(1);
});
