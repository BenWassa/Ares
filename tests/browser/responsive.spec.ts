import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 700 }, { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 412, height: 915 }, { width: 430, height: 932 }, { width: 768, height: 1024 },
  { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1366, height: 768 },
  { width: 1440, height: 900 }, { width: 1600, height: 1000 }, { width: 1920, height: 1080 },
];

function overflowProbe() {
  const root = document.documentElement;
  const overflow = root.scrollWidth - root.clientWidth;
  const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
    })
    .filter(({ left, right }) => left < -1 || right > innerWidth + 1)
    .slice(0, 12);
  return { overflow, offenders };
}

for (const viewport of viewports) {
  test(`case chapter has no page overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('./cases/armenian-genocide');
    const result = await page.evaluate(overflowProbe);
    expect(result.overflow, JSON.stringify(result.offenders, null, 2)).toBeLessThanOrEqual(1);
    await expect(page.locator('#armenian-genocide-title')).toBeVisible();
  });
}

// The case chapter alone is not enough cover: the figure routes carry tables and
// axes that overflow in ways a case page never would (#34).
for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1920, height: 1080 }]) {
  test(`every principal route is free of horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of ['./', './framework', './cases', './comparison', './process', './implications', './reflection', './glossary', './references']) {
      await page.goto(route);
      const result = await page.evaluate(overflowProbe);
      expect(result.overflow, `${route} at ${viewport.width}px: ${JSON.stringify(result.offenders, null, 2)}`).toBeLessThanOrEqual(1);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });
}

test('200% text scaling reflows without page-level horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('./cases/armenian-genocide');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const result = await page.evaluate(overflowProbe);
  expect(result.overflow, JSON.stringify(result.offenders, null, 2)).toBeLessThanOrEqual(1);
  await expect(page.locator('#armenian-genocide-title')).toBeVisible();
});

test('navigation adapts when the viewport crosses the desktop contents breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  const nav = page.locator('#publication-contents');
  await nav.locator('summary').click();
  await expect(nav).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(nav).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).not.toHaveAttribute('open', '');
});

test('open glossary remains inside the viewport after a narrow resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  const depth = page.locator('#scholarly-framing');
  await depth.locator('> summary').click();
  await expect(depth).toHaveAttribute('open', '');
  await page.locator('.glossary-cue').first().click();
  await page.setViewportSize({ width: 320, height: 700 });
  const rect = await page.locator('#glossary-dialog').evaluate((dialog) => {
    const box = dialog.getBoundingClientRect();
    return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: innerWidth, height: innerHeight };
  });
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(rect.width);
  expect(rect.bottom).toBeLessThanOrEqual(rect.height);
});

test('default motion is limited to short visual state transitions', async ({ page }) => {
  await page.goto('./');
  const motion = await page.locator('.home-entry__choices a').first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, properties: style.transitionProperty.split(',').map((value) => value.trim()), durations: style.transitionDuration.split(',').map((raw) => { const value = raw.trim(); return value.endsWith('ms') ? Number.parseFloat(value) / 1000 : Number.parseFloat(value); }) };
  });
  expect(motion.scrollBehavior).toBe('auto');
  expect(motion.properties).toContain('color');
  expect(motion.properties).not.toContain('all');
  expect(motion.properties).not.toContain('transform');
  expect(motion.properties).not.toContain('opacity');
  expect(motion.durations.every((seconds) => Number.isFinite(seconds) && seconds <= 0.2)).toBe(true);
});

test('reduced motion disables long transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
  const durations = await page.locator('.home-entry__choices a').first().evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map((raw) => raw.trim()).map((raw) => raw.endsWith('ms') ? Number.parseFloat(raw) / 1000 : Number.parseFloat(raw)));
  expect(durations.every((seconds) => Number.isFinite(seconds) && seconds <= 0.00002)).toBe(true);
});
