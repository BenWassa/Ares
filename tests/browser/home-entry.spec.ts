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
  test(`Home is a cover and a directory at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');

    await expect(page.locator('body')).toHaveClass(/ares-surface-home/);
    await expect(page.locator('.publication-header')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toHaveCount(0);
    // 3.0 is one ground, cover included, so the browser chrome no longer changes
    // colour between the opening and a chapter.
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0a0806');
    await expect(page.getByRole('link', { name: 'Skip to entry options' })).toHaveCount(1);

    await expect(page.locator('.home-wordmark')).toHaveText('Ares');
    await expect(page.locator('.home-cover__subject')).toContainText('extreme mass homicide');
    await expect(page.locator('.home-begin')).toHaveAttribute('href', '/Ares/framework');
    await expect(page.locator('nav.home-contents a')).toHaveCount(8);
    await expect(page.locator('[data-resume-home]')).toBeHidden();

    await expectNoOverflow(page, `fresh Home at ${width}px`);
    await capture(page, browserName, `home-fresh-${width}`);
  });

  test(`returning-reader Home keeps resume compact and touch-safe at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./cases/my-lai-massacre');
    await page.goto('./');

    const resume = page.locator('[data-resume-home]');
    await expect(resume).toBeVisible();
    await expect(resume).toHaveClass(/resume-card--compact/);
    await expect(resume.locator('[data-resume-description]')).toContainText(/stored only in this browser/i);
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
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0a0806');
  await expect(page.getByRole('link', { name: 'Skip to publication' })).toHaveCount(1);
});
