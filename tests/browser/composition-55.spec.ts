import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

/**
 * Surface-composition gate. #63 supersedes #58's directory-first Home while
 * preserving the rule that every surface has a communicative job of its own.
 */
const evidenceDir = 'release-evidence/composition';
const surfaces = [
  './', './framework', './framework/definitions-typology', './cases',
  './cases/my-lai-massacre', './comparison', './process', './references',
] as const;

for (const width of [320, 360, 390, 430, 768, 1440]) {
  test(`every surface opens with a title and no horizontal overflow at ${width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const path of surfaces) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBeLessThanOrEqual(1);
    }
    if (browserName === 'chromium') {
      await mkdir(evidenceDir, { recursive: true });
      await page.goto('./');
      await page.screenshot({ path: `${evidenceDir}/home-${width}.png`, fullPage: true, animations: 'disabled' });
    }
  });
}

test('the opening is an editorial sequence, not a default complete publication directory', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.home-wordmark')).toHaveText('Project Ares');
  await expect(page.locator('#proposition')).toBeVisible();
  await expect(page.locator('.historical-field__entry')).toHaveCount(8);
  await expect(page.locator('.home-apparatus__contents')).not.toHaveAttribute('open', '');
  await expect(page.locator('.home-apparatus__contents nav')).toBeHidden();
  await page.locator('.home-apparatus__contents > summary').click();
  await expect(page.locator('.home-apparatus__contents nav a')).toHaveCount(8);
  // The two chooser routes #58 retired must not come back.
  for (const retired of ['/Ares/guided', '/Ares/full-publication']) {
    await expect(page.locator(`a[href="${retired}"]`)).toHaveCount(0);
  }
});

test('no surface is a chooser and nothing else', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#proposition .home-proposition__thesis')).not.toBeEmpty();
  await expect(page.locator('#historical-field .historical-field__entry')).toHaveCount(8);

  await page.goto('./framework');
  await expect(page.locator('#scope-purpose .prose p').first()).not.toBeEmpty();

  await page.goto('./cases/my-lai-massacre');
  await expect(page.locator('#orientation p').first()).not.toBeEmpty();
  await expect(page.locator('#narrative .prose')).toBeVisible();
  await expect(page.locator('.essential-chronology li')).toHaveCount(4);

  await page.goto('./comparison');
  await expect(page.locator('.dimension-list li')).toHaveCount(8);
  await expect(page.locator('#figure-03')).toBeVisible();

  await page.goto('./cases');
  await expect(page.locator('.case-index a')).toHaveCount(8);
});

test('the human-first entry path is reachable without JavaScript and without a chooser detour', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:4321/Ares/');
  await page.locator('.home-primary').click();
  await expect(page).toHaveURL(/#proposition$/);
  await expect(page.locator('#proposition')).toBeVisible();

  await page.goto('http://127.0.0.1:4321/Ares/');
  await page.locator('.historical-field__entry[href="/Ares/cases/armenian-genocide"]').click();
  await expect(page.locator('#armenian-genocide-title')).toBeVisible();
  await context.close();
});
