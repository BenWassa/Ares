import { mkdir } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

const evidenceDir = 'release-evidence/home-entry';
const viewports = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '844x390', width: 844, height: 390 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x1000', width: 1440, height: 1000 },
] as const;
const expectedCases = [
  'armenian-genocide', 'ukrainian-holodomor', 'nanking-massacre', 'my-lai-massacre',
  'cambodian-genocide', 'el-mozote-massacre', 'rwandan-genocide', 'bosnian-war',
] as const;
const expectedPositions = [0, 21.53, 28.22, 65.94, 74.78, 83.07, 98.43, 100] as const;

async function prepareEvidence(page: Page) {
  await mkdir(evidenceDir, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page: Page, browserName: string, name: string, fullPage = true) {
  if (browserName !== 'chromium') return;
  await prepareEvidence(page);
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage, animations: 'disabled' });
}

async function captureLocator(page: Page, browserName: string, locator: Locator, name: string) {
  if (browserName !== 'chromium') return;
  await prepareEvidence(page);
  await locator.screenshot({ path: `${evidenceDir}/${name}.png`, animations: 'disabled' });
}

async function expectNoOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, label).toBeLessThanOrEqual(1);
}

async function expectRailContract(page: Page, selector: string) {
  const rail = page.locator(selector);
  await expect(rail).toHaveCount(1);
  await expect(rail.locator('.chronology-rail__years span').first()).toHaveText('1915');
  await expect(rail.locator('.chronology-rail__years span').last()).toHaveText('1995');
  await expect(rail.locator('a, button, [role="button"], [title]')).toHaveCount(0);

  const marks = rail.locator('.chronology-rail__mark');
  await expect(marks).toHaveCount(8);
  expect(await marks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-case-id')))).toEqual(expectedCases);
  const positions = await marks.evaluateAll((nodes) => nodes.map((node) => Number(node.getAttribute('data-position'))));
  positions.forEach((position, index) => expect(position).toBeCloseTo(expectedPositions[index]!, 1));

  const markStyles = await marks.evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node);
    return [style.width, style.height, style.backgroundColor, style.borderWidth, style.opacity];
  }));
  expect(new Set(markStyles.map((style) => JSON.stringify(style))).size).toBe(1);

  const lastTwo = await marks.nth(6).evaluate((node) => node.getBoundingClientRect().left)
    .then(async (left) => [left, await marks.nth(7).evaluate((node) => node.getBoundingClientRect().left)]);
  expect(Math.abs(lastTwo[1]! - lastTwo[0]!)).toBeGreaterThan(2);
}

for (const viewport of viewports) {
  test(`Ares 3.1 final Home keeps the reader-first hierarchy at ${viewport.name}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('./');

    await expect(page.locator('body')).toHaveClass(/ares-surface-home/);
    await expect(page.locator('.publication-header')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toHaveCount(0);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0a0806');
    await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', 'Project Ares');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Project Ares/);
    await expect(page.getByRole('link', { name: 'Skip to the argument' })).toHaveCount(1);

    await expect(page.locator('.home-wordmark')).toHaveText('Project Ares');
    await expect(page.locator('.home-cover__descriptor')).toHaveText('Eight historical cases of mass killing · 1915–1995');
    await expect(page.locator('.home-cover__deck')).toHaveText('They unfold across different societies and regimes, from single-day massacres to years-long campaigns. Project Ares asks what human and institutional conditions recur across them.');
    await expect(page.locator('.home-primary')).toHaveText('See the eight cases');
    await expect(page.locator('.home-primary')).toHaveAttribute('href', '#historical-field');
    await expect(page.locator('.home-secondary')).toHaveCount(0);
    await expect(page.locator('[data-resume-home]')).toBeHidden();
    await expectRailContract(page, '[data-chronology-rail="hero"]');

    await expect(page.locator('#historical-field')).toBeAttached();
    await expect(page.locator('#proposition')).toBeAttached();
    await expect(page.locator('#comparison-question')).toBeAttached();
    await expect(page.locator('#recurring-conditions')).toBeAttached();
    await expect(page.locator('#publication-apparatus')).toBeAttached();
    const tops = await page.locator('#front-matter, #historical-field, #proposition, #recurring-conditions, #publication-apparatus').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top + scrollY));
    expect(tops).toEqual([...tops].sort((a, b) => a - b));

    await expect(page.locator('#historical-field-title')).toHaveText('Eight cases across eighty years');
    await expect(page.locator('.historical-field__heading p')).toHaveText('The cases are separated by years and decades, and their recorded case windows range from one day to about four years.');
    await expect(page.locator('.historical-field__legend')).toHaveText('Position on the line is proportional to calendar time.');
    await expectRailContract(page, '[data-chronology-rail="field"]');

    const entries = page.locator('.historical-field__item');
    await expect(entries).toHaveCount(8);
    expect(await entries.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-case-id')))).toEqual(expectedCases);
    const links = page.locator('.historical-field__entry');
    await expect(links).toHaveCount(8);
    for (let index = 0; index < 8; index += 1) {
      const link = links.nth(index);
      await expect(link.locator('.historical-field__case')).toHaveText(await link.getAttribute('data-nav-title') ?? '');
      await expect(link.locator('.historical-field__location')).toHaveText(await link.getAttribute('data-location') ?? '');
      await expect(link.locator('.historical-field__window')).toHaveText(await link.getAttribute('data-window') ?? '');
      await expect(link).not.toHaveAttribute('style', /.+/);
    }
    await expect(page.locator('.historical-field__classification, .historical-field__decade, [data-duration]')).toHaveCount(0);
    await expect(page.locator('.historical-field__boundary')).toHaveText('Case windows follow the boundary recorded for each case study; several are judgement calls. They are not a measure of severity or harm.');
    await expect(page.locator('.historical-field__method')).toHaveText('How the case windows are defined');
    await expect(page.locator('.historical-field__method')).toHaveAttribute('href', '/Ares/comparison#tempo');

    const homeText = await page.locator('.home').innerText();
    expect(homeText).not.toMatch(/1,000,000|1,500,000|3,900,000|7,000,000|347–504|200,000|300,000|~978|553 children|800,000|8,000\+/);
    expect(homeText).not.toContain('What Project Ares claims — and refuses to claim');
    expect(homeText).not.toContain('Chronological order. Spacing is ordinal');
    await expect(page.locator('.home-proposition__list, .home-proposition__number')).toHaveCount(0);

    await expect(page.locator('#proposition .home-section__label')).toHaveText('The question');
    await expect(page.locator('#proposition h2')).toHaveText('What makes organized mass killing possible?');
    await expect(page.locator('.home-question__body')).toHaveText('These cases are not interchangeable. Project Ares asks which human and institutional conditions recur across them—and how those conditions can help make organized mass killing possible.');
    await expect(page.locator('#recurring-conditions .home-section__label')).toHaveText('What appears to recur');
    await expect(page.locator('#recurring-conditions h2')).toHaveText('Recurring conditions, not a fixed sequence');
    await expect(page.locator('.home-framework__body')).toContainText('political and social conditions');
    await expect(page.locator('.home-framework__body')).toContainText('construction of a threatening out-group');
    await expect(page.locator('.home-framework__body')).toContainText('authorization and organization');
    await expect(page.locator('.home-framework__body')).toContainText('situational dynamics that can move people into violence');
    await expect(page.locator('.home-framework__source')).toHaveText('Ares synthesis of Dutton, Boyanowsky & Bond (2005).');
    await expect(page.locator('.home-inline-action')).toHaveText('Read the framework');

    // The complete publication directory remains quiet apparatus, not a second case directory.
    await expect(page.locator('.home-apparatus__intro')).toHaveText('For the complete publication, source registry, uncertainty and method:');
    await expect(page.locator('.home-apparatus__contents')).not.toHaveAttribute('open', '');
    await expect(page.locator('.home-apparatus__contents nav')).toBeHidden();
    await expect(page.locator('main a[href^="/Ares/cases/"]')).toHaveCount(8);

    for (const selector of ['.home-primary', '.historical-field__entry', '.home-inline-action', '.home-apparatus__contents > summary']) {
      const boxes = await page.locator(selector).evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
      expect(boxes.length, selector).toBeGreaterThan(0);
      for (const height of boxes) expect(height, selector).toBeGreaterThanOrEqual(44);
    }

    await expectNoOverflow(page, `fresh Home at ${viewport.name}`);
    await capture(page, browserName, `home-71-${viewport.name}`);
    if (viewport.width === 390 || viewport.width === 430) {
      await captureLocator(page, browserName, page.locator('#front-matter'), `home-71-${viewport.name}-hero`);
      await captureLocator(page, browserName, page.locator('#historical-field'), `home-71-${viewport.name}-field`);
      await captureLocator(page, browserName, page.locator('#proposition'), `home-71-${viewport.name}-question`);
      await captureLocator(page, browserName, page.locator('#recurring-conditions'), `home-71-${viewport.name}-recurring`);
    }
  });
}

test('the proportional chronology and all eight canonical cases are reachable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Ares/');
  await expect(page.locator('[data-chronology-rail="hero"] .chronology-rail__mark')).toHaveCount(8);
  await expect(page.locator('[data-chronology-rail="field"] .chronology-rail__mark')).toHaveCount(8);
  await expect(page.locator('.historical-field__entry')).toHaveCount(8);
  await expect(page.locator('.home-apparatus__contents')).not.toHaveAttribute('open', '');
  await page.locator('.home-primary').click();
  await expect(page).toHaveURL(/#historical-field$/);
  await page.locator('.historical-field__entry[href="/Ares/cases/nanking-massacre"]').click();
  await expect(page).toHaveURL(/\/cases\/nanking-massacre$/);
  await expect(page.locator('#nanking-massacre-title')).toBeVisible();
  await context.close();
});

test('Home keyboard order reaches the Hero action and ordinary case links without timeline controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the argument' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.home-primary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#historical-field$/);
  const firstCase = page.locator('.historical-field__entry').first();
  await firstCase.focus();
  await expect(firstCase).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/cases\/armenian-genocide$/);
});

test('returning-reader Home remains a single compact line and does not reflow the Hero', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const freshHeroHeight = (await page.locator('#front-matter').boundingBox())?.height ?? 0;
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
  const returningHeroHeight = (await page.locator('#front-matter').boundingBox())?.height ?? 0;
  expect(returningHeroHeight).toBeCloseTo(freshHeroHeight, 0);
  await expectNoOverflow(page, 'returning Home');
  await capture(page, browserName, 'home-71-returning-390x844');
  await captureLocator(page, browserName, resume, 'home-71-returning-390x844-resume');
});

test('Home remains readable at 200% text and adds no timeline motion under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expect(page.locator('.home-wordmark')).toBeVisible();
  await expect(page.locator('.historical-field__entry')).toHaveCount(8);
  await expect(page.locator('.historical-field__case').first()).not.toHaveCSS('text-overflow', 'ellipsis');
  await expectNoOverflow(page, 'Home at 200% text');
  const motion = await page.locator('.chronology-rail__mark, .historical-field__entry').evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node);
    return [style.animationDuration, style.animationName];
  }));
  expect(motion.every(([duration, name]) => duration === '0s' && name === 'none')).toBe(true);
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
