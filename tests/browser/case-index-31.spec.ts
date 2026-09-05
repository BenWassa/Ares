import { expect, test } from '@playwright/test';

const expectedYears = ['1915', '1932', '1937', '1968', '1975', '1981', '1994', '1995'];
const expectedSpans = ['about three years', 'about thirteen months', 'six weeks', 'one day', 'about four years', 'one day', 'a hundred days', 'about four years'];

for (const width of [320, 390, 768, 1440]) {
  test(`/cases separates chronology from duration at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./cases');
    await expect(page.locator('.case-index__date')).toHaveText(expectedYears);
    const places = await page.locator('.case-index__place').allTextContents();
    for (const span of expectedSpans) expect(places.join('\n')).toContain(span);
    for (const mixed of ['~6 weeks', '1 day (16 Mar)', '1 day (11 Dec)', '100 days']) {
      expect(await page.locator('.case-index__date').allTextContents()).not.toContain(mixed);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
