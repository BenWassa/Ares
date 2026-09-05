import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/**
 * Screen-hierarchy contracts that remain authoritative after #64.
 *
 * #62 supersedes the old visible My Lai screen apparatus with an editorial A–G
 * opening. Representative case behavior now has its own case-openings-64 gate;
 * this file keeps the still-current framework/comparison hierarchy, navigation,
 * resume compatibility and no-JS traversal contracts.
 */
const evidenceDir = 'release-evidence/hierarchy';
const origin = 'http://127.0.0.1:4321/Ares';

const screens = [
  { path: './framework', name: 'framework', parent: 'Ares', role: 'Overview' },
  { path: './framework/definitions-typology', name: 'definitions', parent: 'Framework', role: 'Essential reading' },
  { path: './framework/theoretical-lenses', name: 'theoretical-lenses', parent: 'Framework', role: 'Optional depth' },
  { path: './comparison', name: 'comparison', parent: 'Ares', role: 'Overview' },
];

const mergedUnits = [
  { surface: './comparison', anchor: 'tempo' },
  { surface: './comparison', anchor: 'scholarly-depth' },
  { surface: './framework', anchor: 'scope-purpose' },
];

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir(evidenceDir, { recursive: true });
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage: false, animations: 'disabled' });
}

async function expectNoOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, label).toBeLessThanOrEqual(1);
}

for (const width of [390, 430]) {
  test(`remaining screen-hierarchy surfaces answer the six orientation questions at ${width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const screen of screens) {
      await page.goto(screen.path);
      const location = page.locator('[data-reading-location]');
      await expect(location.locator('.screen-trail [aria-current]')).toBeVisible();
      await expect(location.locator('.screen-trail a', { hasText: screen.parent })).toBeVisible();
      await expect(location.locator('.reading-location__progress')).toContainText(screen.role);
      await expect(location.locator('.reading-location__question p')).not.toBeEmpty();
      const nav = page.locator('.screen-nav');
      await expect(nav.locator('.screen-nav__parent')).toBeVisible();
      await expect(nav.locator('.screen-nav__hint')).toContainText('Browser Back');
      await expect(nav.locator('a', { hasText: /Next|Continue the reading path/ })).toBeVisible();
      await expectNoOverflow(page, `${screen.path} at ${width}px`);
      if (width === 390) await capture(page, browserName, `${screen.name}-390`);
    }
  });
}

test('merged non-case units keep their own addresses on their parent surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const unit of mergedUnits) {
    await page.goto(`${unit.surface}#${unit.anchor}`);
    await expect(page.locator(`#${unit.anchor}`), `${unit.surface}#${unit.anchor}`).toHaveCount(1);
    await expect(page).toHaveURL(new RegExp(`#${unit.anchor}$`));
  }
});

test('framework exposes its immediate children and marks optional depth', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  const children = page.locator('.unit-children a');
  await expect(children).toHaveCount(3);
  await expect(children.first()).toContainText('on this page');
  await expect(children.first()).toHaveAttribute('href', /\/framework#scope-purpose$/);
  await expect(children.nth(1)).toHaveAttribute('href', /\/framework\/definitions-typology$/);
  await expect(children.last()).toContainText('Optional depth');
  await capture(page, browserName, 'framework-children-390');
});

test('comparison optional depth stays a closed native disclosure', async ({ page }) => {
  await page.goto('./comparison');
  const depth = page.locator('details#scholarly-depth');
  await expect(depth).toHaveCount(1);
  expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(false);
  await depth.locator(':scope > summary').click();
  expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(true);
});

test('comparison keeps meaning-changing caveats in the first reading layer', async ({ page }) => {
  await page.goto('./comparison');
  await expect(page.locator('.page-intro')).toContainText('Neither view ranks the cases');
  await expect(page.locator('.integrity-note').first()).toContainText('Comparison is not equivalence');
});

test('the hierarchy remains traversable with links and browser history', async ({ page }) => {
  await page.goto('./framework');
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);
  await expect(page.locator('#what-happened')).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  await page.locator('.case-index-link').click();
  await expect(page).toHaveURL(/\/cases$/);
});

test('My Lai resume remains a screen-level route after the editorial rewrite', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ares:reading-position:v2') ?? 'null'));
  expect(stored.unitId).toBe('my-lai');
  expect(stored.href).toBe('/Ares/cases/my-lai-massacre');
  expect(stored.href).not.toContain('#');
  expect(stored.title).toContain('My Lai');

  await page.goto('./');
  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume.locator('[data-resume-link]')).toContainText('My Lai');
  await resume.locator('[data-resume-link]').click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  await page.goto('./');
  await resume.locator('[data-resume-clear]').click();
  await expect(resume).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('ares:reading-position:v2'))).toBeNull();
});

test('stale, corrupt and previous-version resume state all fail safe', async ({ page }) => {
  await page.goto('./');
  for (const value of ['not json at all', '{}', '{"href":"https://example.com/","title":"x","savedAt":1}', '{"href":"/Ares/cases/retired-unit","title":"Retired","savedAt":1}']) {
    await page.evaluate((raw) => localStorage.setItem('ares:reading-position:v2', raw), value);
    await page.reload();
    await expect(page.locator('[data-resume-home]'), `resume offered a position from ${value}`).toBeHidden();
  }

  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('ares:reading-position:v2', JSON.stringify({
      unitId: 'my-lai-key-evidence',
      href: '/Ares/cases/my-lai-massacre/key-evidence',
      title: 'My Lai · Key evidence',
      savedAt: Date.now(),
    }));
  });
  await page.reload();
  await expect(page.locator('[data-resume-home]')).toBeHidden();

  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('ares:reading-position:v1', JSON.stringify({
      href: '/Ares/framework/definitions-typology#typology',
      title: 'Framework · Definitions & typology',
      visitedSectionIds: [],
      savedAt: Date.now(),
    }));
  });
  await page.reload();
  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume.locator('[data-resume-link]')).toHaveAttribute('href', '/Ares/framework/definitions-typology');
  expect(await page.evaluate(() => localStorage.getItem('ares:reading-position:v1'))).toBeNull();
});

test('non-case deep links restore their conceptual locations', async ({ page }) => {
  for (const screen of screens) {
    await page.goto(screen.path);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-reading-location]')).toBeVisible();
  }
  for (const [from, to] of [
    ['./comparison#full-matrix', /\/comparison#scholarly-depth$/],
    ['./comparison#full-comparison-depth', /\/comparison#scholarly-depth$/],
    ['./framework#definitions-typology', /\/framework\/definitions-typology$/],
    ['./framework#theoretical-lenses', /\/framework\/theoretical-lenses$/],
    ['./#scope-purpose', /\/framework#scope-purpose$/],
  ] as const) {
    await page.goto('about:blank');
    await page.goto(from);
    await expect(page, from).toHaveURL(to);
  }
});

test('JavaScript-disabled navigation reaches the representative case and native depth', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(`${origin}/framework`);
  await expect(page.locator('#scope-purpose .prose')).toBeVisible();
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  for (const anchor of ['what-happened', 'why-ares', 'finding', 'essential-reading']) {
    await expect(page.locator(`#${anchor}`)).toBeVisible();
  }
  const depth = page.locator('details#scholarly-depth');
  expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(false);
  await depth.locator(':scope > summary').click();
  await expect(page.locator('.chronology')).toBeVisible();
  await expectNoOverflow(page, 'no-JS case surface at 390px');
  await capture(page, browserName, 'no-js-my-lai-390');
  await context.close();
});

test('remaining hierarchy surfaces hold at 200% text and reduced motion', async ({ page, browserName }) => {
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const screen of screens) {
    await page.goto(screen.path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoOverflow(page, `${screen.path} at 200% text`);
  }
  await capture(page, browserName, 'hierarchy-text-200-390');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./comparison');
  const worst = await page.evaluate(() => {
    let maximum = 0;
    for (const element of document.querySelectorAll('*')) {
      const style = getComputedStyle(element);
      for (const value of [style.transitionDuration, style.animationDuration]) {
        for (const raw of value.split(',')) {
          const trimmed = raw.trim();
          const milliseconds = trimmed.endsWith('ms') ? Number.parseFloat(trimmed) : Number.parseFloat(trimmed) * 1000;
          if (Number.isFinite(milliseconds)) maximum = Math.max(maximum, milliseconds);
        }
      }
    }
    return maximum;
  });
  expect(worst).toBeLessThanOrEqual(0.02);
});

for (const width of [768, 1440]) {
  test(`remaining hierarchy chrome stays coherent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const screen of screens) {
      await page.goto(screen.path);
      await expect(page.locator('.screen-trail')).toBeVisible();
      await expectNoOverflow(page, `${screen.path} at ${width}px`);
    }
  });
}
