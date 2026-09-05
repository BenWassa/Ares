import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

/**
 * The surface-composition gate.
 *
 * #55 asserted the opposite of what this file now asserts, and it was right to
 * at the time: the fix for one enormous scrolling page was to give every unit a
 * surface of its own. Carried to its conclusion that produced `/` -> `/guided`
 * -> `/framework` -> `/framework/scope-purpose`, three consecutive surfaces whose
 * entire content was a list of links.
 *
 * #58 keeps the rule that a surface has one job and drops the rule that a job
 * needs its own route. So the checks here are inverted deliberately: a parent
 * surface must now carry *content*, the opening must reach every published part
 * in one click, and no route may be a chooser and nothing else.
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

test('the opening reaches every published part in one click', async ({ page }) => {
  await page.goto('./');
  const contents = page.locator('nav.home-contents a');
  await expect(contents).toHaveCount(8);
  for (const path of ['/Ares/framework', '/Ares/cases', '/Ares/comparison', '/Ares/process', '/Ares/implications', '/Ares/reflection', '/Ares/glossary', '/Ares/references']) {
    await expect(page.locator(`nav.home-contents a[href="${path}"]`)).toBeVisible();
  }
  // The two chooser routes #58 retired must not come back.
  for (const retired of ['/Ares/guided', '/Ares/full-publication']) {
    await expect(page.locator(`a[href="${retired}"]`)).toHaveCount(0);
  }
});

test('no surface is a chooser and nothing else', async ({ page }) => {
  // A parent surface earns its route by saying something. Each of these used to
  // render navigation only; each now carries the prose, figure or record that
  // belongs to it.
  await page.goto('./');
  await expect(page.locator('#about-ares .prose p').first()).not.toBeEmpty();

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

test('the reading path is reachable without JavaScript and without a chooser detour', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // Opening -> Part I -> prose, with no surface in between whose only content is
  // a list of links. That is the whole of #58 in one traversal.
  await page.goto('http://127.0.0.1:4321/Ares/');
  await page.locator('.home-begin').click();
  await expect(page).toHaveURL(/\/framework$/);
  await expect(page.locator('#scope-purpose .prose')).toBeVisible();

  await page.goBack();
  await page.locator('nav.home-contents a[href="/Ares/cases"]').click();
  await expect(page.locator('.case-index a')).toHaveCount(8);
  await context.close();
});
