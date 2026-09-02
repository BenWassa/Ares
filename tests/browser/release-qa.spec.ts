import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const releaseViewports = [
  { width: 320, height: 700 }, { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 412, height: 915 }, { width: 430, height: 932 }, { width: 768, height: 1024 },
  { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1366, height: 768 },
  { width: 1440, height: 900 }, { width: 1600, height: 1000 },
];

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir('release-evidence', { recursive: true });
  await page.screenshot({ path: `release-evidence/${name}.png`, fullPage: false, animations: 'disabled' });
}

for (const viewport of releaseViewports) {
  test(`release viewport ${viewport.width}px renders the new opening composition`, async ({ page, browserName }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.publication-header')).toBeVisible();
    await expect(page.locator('.case-study')).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await capture(page, browserName, `viewport-${viewport.width}`);
  });
}

test('mobile navigation and framework vertical slice render coherently', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await capture(page, browserName, 'state-initial-mobile');
  const contents = page.locator('#publication-contents');
  await contents.locator('summary').click();
  await expect(contents).toHaveAttribute('open', '');
  await capture(page, browserName, 'state-navigation-open');
  await contents.locator('a[href$="/framework"]').click();
  await expect(page.locator('#part-i')).toBeVisible();
  await capture(page, browserName, 'state-framework-mobile');
});

test('case testimony, provenance and chronology are authored chapter states', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/armenian-genocide');
  await expect(page.locator('#armenian-genocide-title')).toBeVisible();
  await capture(page, browserName, 'state-case-mobile');
  const testimony = page.locator('.narrative-section');
  const provenance = testimony.locator('.evidence-provenance');
  await provenance.scrollIntoViewIfNeeded();
  await expect(provenance).toBeVisible();
  await capture(page, browserName, 'state-testimony-provenance');

  await page.setViewportSize({ width: 1280, height: 800 });
  const chronology = page.locator('.chronology').first();
  await chronology.scrollIntoViewIfNeeded();
  await expect(chronology).toBeVisible();
  await capture(page, browserName, 'state-chronology');
});

test('comparison, process explainer and references remain legible rendered states', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./comparison/scholarly-depth');
  const comparison = page.locator('.comparison-table').first();
  await comparison.scrollIntoViewIfNeeded();
  await expect(comparison).toBeVisible();
  await capture(page, browserName, 'state-comparison');

  await page.goto('./process');
  const process = page.locator('[data-process-domain]').first();
  await process.scrollIntoViewIfNeeded();
  await process.locator('summary').click();
  await capture(page, browserName, 'state-process-explainer');

  await page.goto('./references');
  await expect(page.locator('#references')).toBeVisible();
  await capture(page, browserName, 'state-references');
});

test('glossary dialog and direct glossary route preserve provenance-oriented lookup', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  const cue = page.locator('.glossary-cue').first();
  await cue.click();
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await expect(page.locator('#glossary-dialog-close')).toBeFocused();
  await capture(page, browserName, 'state-glossary-dialog');
  const target = await page.locator('#glossary-dialog-full-link').getAttribute('href');
  expect(target).toMatch(/^\/Ares\/glossary#glossary-/);
  await page.keyboard.press('Escape');
  await expect(cue).toBeFocused();
});

test('native browser history works across publication routes', async ({ page }) => {
  await page.goto('./framework/definitions-typology');
  await page.goto('./cases');
  await page.goto('./process');
  await page.goBack();
  await expect(page).toHaveURL(/\/Ares\/cases$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/Ares\/process$/);
});

test('keyboard-only entry remains visibly focused and reaches the document', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await capture(page, browserName, 'state-keyboard-focus');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();
});

test('JavaScript-disabled release keeps all principal routes readable', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#publication-contents')).toHaveAttribute('open', '');
  await page.goto('http://127.0.0.1:4321/Ares/cases/armenian-genocide');
  await expect(page.locator('.chronology')).toBeVisible();
  await capture(page, browserName, 'state-javascript-disabled');
  await context.close();
});

test('reduced motion and open-control resize preserve comprehension', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  const cue = page.locator('.glossary-cue').first();
  await cue.click();
  await page.setViewportSize({ width: 320, height: 700 });
  const geometry = await page.locator('#glossary-dialog').evaluate((dialog) => { const rect = dialog.getBoundingClientRect(); return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: innerWidth, height: innerHeight }; });
  expect(geometry.left).toBeGreaterThanOrEqual(0);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  expect(geometry.right).toBeLessThanOrEqual(geometry.width);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.height);
  const durations = await page.locator('#glossary-dialog-close').evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map((raw) => raw.trim()).map((raw) => raw.endsWith('ms') ? Number.parseFloat(raw) / 1000 : Number.parseFloat(raw)));
  expect(durations.every((seconds) => Number.isFinite(seconds) && seconds <= 0.00002)).toBe(true);
  await capture(page, browserName, 'state-reduced-motion-resize');
});
