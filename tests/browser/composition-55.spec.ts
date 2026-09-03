import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDir = 'release-evidence/issue-55';
const parents = [
  ['./', 3], ['./guided', 5], ['./cases', 8], ['./full-publication', 8],
  ['./framework', 3], ['./cases/my-lai-massacre', 5], ['./comparison', 2],
] as const;

for (const width of [320, 360, 390, 430, 768, 1440]) {
  test(`parent screens keep one chooser and no horizontal overflow at ${width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of parents) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBeLessThanOrEqual(1);
    }
    if (browserName === 'chromium') { await mkdir(evidenceDir,{recursive:true}); await page.goto('./'); await page.screenshot({path:`${evidenceDir}/home-${width}.png`,fullPage:true,animations:'disabled'}); }
  });
}

test('Home, Guided, Explore and Full publication own distinct decision contexts', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.goal-paths a')).toHaveCount(3);
  await expect(page.locator('.chapter-directory, .case-index, .prose')).toHaveCount(0);
  await page.goto('./guided'); await expect(page.locator('.chapter-directory a')).toHaveCount(5);
  await page.goto('./cases'); await expect(page.locator('.case-index a')).toHaveCount(8);
  await page.goto('./full-publication'); await expect(page.locator('.chapter-directory a')).toHaveCount(8);
});

test('representative parents render children but no child manuscripts', async ({ page }) => {
  await page.goto('./framework'); await expect(page.locator('.unit-children a')).toHaveCount(3); await expect(page.locator('.framework-section,.scholarly-depth')).toHaveCount(0);
  await page.goto('./cases/my-lai-massacre'); await expect(page.locator('.unit-children a')).toHaveCount(5); await expect(page.locator('.case-section,.chronology')).toHaveCount(0);
  await page.goto('./comparison'); await expect(page.locator('.unit-children a')).toHaveCount(2); await expect(page.locator('.comparison-findings,.comparison-table')).toHaveCount(0);
});

test('top-level hierarchy remains traversable without JavaScript', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}); const page=await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/'); await page.locator('.goal-paths a[href="/Ares/guided"]').click(); await expect(page).toHaveURL(/\/guided$/);
  await page.goBack(); await page.locator('.goal-paths a[href="/Ares/cases"]').click(); await expect(page.locator('.case-index a')).toHaveCount(8);
  await page.goBack(); await page.locator('.goal-paths a[href="/Ares/full-publication"]').click(); await expect(page.locator('.chapter-directory a')).toHaveCount(8); await context.close();
});
