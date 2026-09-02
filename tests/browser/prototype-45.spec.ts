import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const evidenceDir = path.resolve('artifacts/release-evidence/issue-45');
const prototypeRoutes = [
  { path: './', name: 'home' },
  { path: './framework', name: 'framework' },
  { path: './framework/definitions-typology', name: 'definitions' },
  { path: './cases/my-lai-massacre', name: 'my-lai' },
  { path: './comparison', name: 'comparison' },
];
const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
];

async function capture(page: Page, browserName: string, name: string) {
  await fs.mkdir(evidenceDir, { recursive: true });
  await page.screenshot({ path: path.join(evidenceDir, `${browserName}-${name}.png`), fullPage: true });
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const viewport of viewports) {
  test(`Issue #45 prototype renders without horizontal overflow at ${viewport.width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize(viewport);
    for (const prototypeRoute of prototypeRoutes) {
      await page.goto(prototypeRoute.path);
      await expect(page.locator('h1')).toBeVisible();
      await expectNoOverflow(page);
      await capture(page, browserName, `${prototypeRoute.name}-${viewport.width}`);
    }
  });
}

test('framework essential unit keeps critical caveats visible and scholarly depth optional', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  await expect(page.locator('#what-matters')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toContainText('Comparison is not equivalence');
  const depth = page.locator('#scholarly-framing');
  await expect(depth).not.toHaveAttribute('open', '');
  await depth.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(depth).toHaveAttribute('open', '');
  await capture(page, browserName, 'definitions-depth-open-390');
});

test('My Lai permits analysis and pause without requiring extended traumatic detail', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  await expect(page.locator('#orientation')).toBeVisible();
  await expect(page.locator('#analysis')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue to analysis' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pause here', exact: true })).toBeVisible();
  const depth = page.locator('#full-scholarly-depth');
  await expect(depth).not.toHaveAttribute('open', '');
  await expect(depth.locator('.chronology')).not.toBeVisible();
  await depth.locator('summary').click();
  await expect(depth.locator('.chronology')).toBeVisible();
  await capture(page, browserName, 'my-lai-depth-open-390');
});

test('comparison starts dimension-first and preserves the complete matrix as depth', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('./comparison');
  await expect(page.locator('#comparison-findings')).toBeVisible();
  await expect(page.locator('#tempo')).toBeVisible();
  await expect(page.locator('#tempo')).toContainText('not different positions on a single severity scale');
  const depth = page.locator('[data-comparison-depth]');
  await expect(depth).not.toHaveAttribute('open', '');
  await depth.locator(':scope > summary').click();
  await expect(depth).toHaveAttribute('open', '');
  const responsiveMatrix = depth.locator('.comparison-detail');
  await expect(responsiveMatrix).toBeVisible();
  await responsiveMatrix.locator(':scope > summary').click();
  await expect(responsiveMatrix.locator('.comparison-stack')).toBeVisible();
  await capture(page, browserName, 'comparison-depth-open-430');
});

test('local resume state restores and clears the last named conceptual location', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  const caveats = page.locator('#critical-caveats');
  await caveats.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const stored = await page.evaluate(() => localStorage.getItem('ares:reading-position:v1'));
  expect(stored).toContain('Definitions');

  await page.goto('./');
  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume.locator('[data-resume-link]')).toContainText('Continue:');
  await resume.locator('[data-resume-clear]').click();
  await expect(resume).toBeHidden();
});

test('deep links land on named conceptual locations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre#analysis');
  await expect(page.locator('#analysis')).toBeVisible();
  await expect(page).toHaveURL(/#analysis$/);
  await page.goto('./comparison#tempo');
  await expect(page.locator('#tempo')).toBeVisible();
  await expect(page).toHaveURL(/#tempo$/);
});

test('essential reading remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('./framework/definitions-typology');
  await expect(page.locator('#what-matters')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await page.goto('./cases/my-lai-massacre');
  await expect(page.locator('#orientation')).toBeVisible();
  await expect(page.locator('#analysis')).toBeVisible();
  await context.close();
});

test('200% text scaling preserves the representative reading path without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expectNoOverflow(page);
  await expect(page.locator('#analysis')).toBeVisible();
});

test('reduced motion removes prototype transition durations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const duration = await page.locator('.goal-paths__grid a').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration).toMatch(/0(?:\.0+)?(?:ms|s)|0\.00001ms/);
});
