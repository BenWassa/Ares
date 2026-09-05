import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDir = 'release-evidence/home-entry';
const widths = [320, 360, 390, 430, 768, 1440] as const;
const expectedCases = [
  'armenian-genocide', 'ukrainian-holodomor', 'nanking-massacre', 'my-lai-massacre',
  'cambodian-genocide', 'el-mozote-massacre', 'rwandan-genocide', 'bosnian-war',
] as const;

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir(evidenceDir, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage: true, animations: 'disabled' });
}

async function expectNoOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, label).toBeLessThanOrEqual(1);
}

for (const width of widths) {
  test(`Ares 3.1 Home keeps the human-first hierarchy at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: width <= 430 ? 900 : 1000 });
    await page.goto('./');

    await expect(page.locator('body')).toHaveClass(/ares-surface-home/);
    await expect(page.locator('.publication-header')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toHaveCount(0);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0a0806');
    await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', 'Project Ares');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Project Ares/);
    await expect(page.getByRole('link', { name: 'Skip to the argument' })).toHaveCount(1);

    await expect(page.locator('.home-wordmark')).toHaveText('Project Ares');
    await expect(page.locator('.home-cover__descriptor')).toHaveText('Military massacre and genocide, examined case by case.');
    await expect(page.locator('.home-cover__deck')).toHaveText('Eight historical cases read against the psychology of extreme mass homicide, with estimates, uncertainty and sources kept in view rather than cleaned away.');
    await expect(page.locator('.home-primary')).toHaveAttribute('href', '#proposition');
    await expect(page.locator('.home-secondary')).toHaveAttribute('href', '#historical-field');
    await expect(page.locator('[data-resume-home]')).toBeHidden();

    await expect(page.locator('#proposition')).toBeAttached();
    await expect(page.locator('#historical-field')).toBeAttached();
    await expect(page.locator('#comparison-question')).toBeAttached();
    await expect(page.locator('#publication-apparatus')).toBeAttached();
    const tops = await page.locator('#front-matter, #proposition, #historical-field, #comparison-question, #publication-apparatus').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top + scrollY));
    expect(tops).toEqual([...tops].sort((a, b) => a - b));

    // The complete publication directory is apparatus now, not default Home body.
    await expect(page.locator('.home-apparatus__contents')).not.toHaveAttribute('open', '');
    await expect(page.locator('.home-apparatus__contents nav')).toBeHidden();

    const entries = page.locator('.historical-field__item');
    await expect(entries).toHaveCount(8);
    expect(await entries.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-case-id')))).toEqual(expectedCases);
    await expect(page.locator('.historical-field__classification small')).toHaveCount(8);
    await expect(page.locator('.historical-field__entry')).toHaveCount(8);
    const fieldText = await page.locator('#historical-field').innerText();
    expect(fieldText).not.toMatch(/1,000,000|800,000|553 children|8,000\+/);

    const markStyles = await page.locator('.historical-field__mark').evaluateAll((marks) => marks.map((mark) => {
      const style = getComputedStyle(mark);
      return [style.width, style.height, style.borderWidth, style.borderColor, style.backgroundColor];
    }));
    expect(new Set(markStyles.map((style) => JSON.stringify(style))).size).toBe(1);

    for (const selector of ['.home-primary', '.home-secondary', '.historical-field__entry', '.home-inline-action', '.home-apparatus__contents > summary']) {
      const boxes = await page.locator(selector).evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
      expect(boxes.length, selector).toBeGreaterThan(0);
      for (const height of boxes) expect(height, selector).toBeGreaterThanOrEqual(44);
    }

    await expectNoOverflow(page, `fresh Home at ${width}px`);
    if (width === 390 || width === 430 || width === 768 || width === 1440) await capture(page, browserName, `home-31-${width}`);
  });
}

test('the chronology is ordinal and all eight canonical cases are reachable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/');
  await expect(page.locator('.historical-field__entry')).toHaveCount(8);
  await expect(page.locator('.home-apparatus__contents')).not.toHaveAttribute('open', '');
  await page.locator('.historical-field__entry[href="/Ares/cases/nanking-massacre"]').click();
  await expect(page).toHaveURL(/\/cases\/nanking-massacre$/);
  await expect(page.locator('#nanking-massacre-title')).toBeVisible();

  await page.goto('http://127.0.0.1:4321/Ares/framework');
  const contents = page.locator('#publication-contents');
  await expect(contents).not.toHaveAttribute('open', '');
  await expect(contents.locator('nav')).toBeHidden();
  await expect(page.locator('#part-i')).toBeVisible();
  await context.close();
});

test('returning-reader Home uses a single compact resume line with touch-safe controls', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  await page.goto('./');

  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume).toHaveClass(/resume-card--compact/);
  await expect(resume.locator('[data-resume-description]')).toHaveCount(0);
  await expect(resume.locator('[data-resume-link]')).toContainText(/^Continue:/);
  await expect(resume.locator('[data-resume-clear]')).toHaveAccessibleName('Clear saved place');
  for (const control of [resume.locator('[data-resume-link]'), resume.locator('[data-resume-clear]')]) {
    const box = await control.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await expectNoOverflow(page, 'returning Home');
  await capture(page, browserName, 'home-31-returning-390');
});

test('Home remains readable at 200% text and under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expect(page.locator('.home-wordmark')).toBeVisible();
  await expect(page.locator('.historical-field__entry')).toHaveCount(8);
  await expectNoOverflow(page, 'Home at 200% text');
  const animations = await page.locator('.historical-field__entry').evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationDuration));
  expect(animations.every((duration) => duration === '0s')).toBe(true);
});

test('publication surfaces retain publication chrome and a closed mobile Contents default', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  await expect(page.locator('body')).toHaveClass(/ares-surface-publication/);
  await expect(page.locator('.publication-header')).toBeVisible();
  await expect(page.locator('.site-footer')).toBeVisible();
  await expect(page.locator('#publication-contents')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('link', { name: 'Skip to publication' })).toHaveCount(1);
});
