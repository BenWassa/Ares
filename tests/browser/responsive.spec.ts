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
    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const overflow = root.scrollWidth - root.clientWidth;
      const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
          };
        })
        .filter(({ left, right }) => left < -1 || right > innerWidth + 1)
        .slice(0, 12);
      return { overflow, offenders };
    });
    expect(result.overflow, JSON.stringify(result.offenders, null, 2)).toBeLessThanOrEqual(1);
    await expect(page.locator('#armenian-genocide-title')).toBeVisible();
    await expect(page.locator('#part-iv')).toBeAttached();
  });
}

test('reduced motion disables smooth scrolling and long transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
  const durations = await page.locator('summary').first().evaluate((element) => getComputedStyle(element).transitionDuration
    .split(',')
    .map((raw) => raw.trim())
    .map((raw) => raw.endsWith('ms') ? Number.parseFloat(raw) / 1000 : Number.parseFloat(raw)));
  expect(durations.every((seconds) => Number.isFinite(seconds) && seconds <= 0.00002)).toBe(true);
});
