import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 700 }, { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 },
  { width: 1280, height: 800 }, { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`layout has no page overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('./#armenian-genocide');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('#armenian-genocide-title')).toBeVisible();
    await expect(page.locator('#part-iv')).toBeAttached();
  });
}

test('reduced motion disables smooth scrolling and long transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
  const duration = await page.locator('summary').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration).toMatch(/0\.01ms|0s/);
});
