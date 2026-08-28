import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const releaseViewports = [
  { width: 320, height: 700 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1600, height: 1000 },
];

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir('release-evidence', { recursive: true });
  await page.screenshot({ path: `release-evidence/${name}.png`, fullPage: false, animations: 'disabled' });
}

for (const viewport of releaseViewports) {
  test(`release viewport ${viewport.width}px renders the publication shell`, async ({ page, browserName }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.reader-header')).toBeVisible();
    await expect(page.locator('.case-study')).toHaveCount(8);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await capture(page, browserName, `viewport-${viewport.width}`);
  });
}

test('mobile navigation, current location, process and glossary transient states remain coherent', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await capture(page, browserName, 'state-initial-mobile');

  const contents = page.locator('#publication-contents');
  await contents.locator('summary').click();
  await expect(contents).toHaveAttribute('open', '');
  await capture(page, browserName, 'state-navigation-open');

  await contents.locator('a[href="#part-iv"]').click();
  await expect(page).toHaveURL(/#part-iv$/);
  await expect(contents).not.toHaveAttribute('open', '');
  await expect(page.locator('#reader-location')).toContainText('Process Synthesis');

  const process = page.locator('[data-process-domain]').first();
  await process.locator('summary').click();
  await expect(process).toHaveAttribute('open', '');
  await process.scrollIntoViewIfNeeded();
  await capture(page, browserName, 'state-process-disclosure');

  const cue = page.locator('.glossary-cue').first();
  await cue.click();
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await expect(page.locator('#glossary-dialog-close')).toBeFocused();
  await capture(page, browserName, 'state-glossary-dialog');
  await page.keyboard.press('Escape');
  await expect(page.locator('#glossary-dialog')).not.toBeVisible();
  await expect(cue).toBeFocused();
});

test('chronology, comparison and references remain legible rendered states', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./#armenian-genocide');
  const chronology = page.locator('#armenian-genocide .chronology').first();
  await chronology.scrollIntoViewIfNeeded();
  await expect(chronology).toBeVisible();
  await capture(page, browserName, 'state-chronology');

  await page.goto('./#part-iii');
  const comparison = page.locator('.comparison-table').first();
  await comparison.scrollIntoViewIfNeeded();
  await expect(comparison).toBeVisible();
  await capture(page, browserName, 'state-comparison');

  await page.goto('./#references');
  await expect(page.locator('#references')).toBeVisible();
  await capture(page, browserName, 'state-references');
});

test('case sequence and native browser back/forward remain durable', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#part-ii');
  const firstCase = page.locator('.case-study').first();
  const next = firstCase.locator('.case-sequence a').first();
  const nextHref = await next.getAttribute('href');
  expect(nextHref).toMatch(/^#/);
  await next.click();
  await expect(page).toHaveURL(new RegExp(`${nextHref}$`));
  await capture(page, browserName, 'state-case-transition');

  await page.evaluate(() => { window.location.hash = '#part-iii'; });
  await expect(page).toHaveURL(/#part-iii$/);
  await page.evaluate(() => { window.location.hash = '#part-iv'; });
  await expect(page).toHaveURL(/#part-iv$/);
  await page.goBack();
  await expect(page).toHaveURL(/#part-iii$/);
  await page.goForward();
  await expect(page).toHaveURL(/#part-iv$/);
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

test('JavaScript-disabled release remains a complete readable publication', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/#part-iv');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.case-study')).toHaveCount(8);
  await expect(page.locator('[data-process-domain]')).toHaveCount(4);
  await expect(page.locator('#glossary')).toBeVisible();
  await expect(page.locator('#references')).toBeVisible();
  await capture(page, browserName, 'state-javascript-disabled');
  await context.close();
});

test('reduced motion and open-control resize preserve comprehension', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const cue = page.locator('.glossary-cue').first();
  await cue.click();
  await expect(page.locator('#glossary-dialog')).toBeVisible();
  await page.setViewportSize({ width: 320, height: 700 });
  const geometry = await page.locator('#glossary-dialog').evaluate((dialog) => {
    const rect = dialog.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: innerWidth, height: innerHeight };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(0);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  expect(geometry.right).toBeLessThanOrEqual(geometry.width);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.height);
  const duration = await page.locator('#glossary-dialog-close').evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration).toMatch(/(?:0\.00001s|0\.01ms)/);
  await capture(page, browserName, 'state-reduced-motion-resize');
});
