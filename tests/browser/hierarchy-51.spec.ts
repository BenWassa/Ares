import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/**
 * The Ares 2.3 screen-hierarchy gate (#51).
 *
 * #45 proved that a bounded reading layer renders. This file proves the stronger
 * claim: that each mobile surface is one conceptual unit inside an explicit
 * hierarchy, that moving between units is a navigation action rather than a
 * scroll, and that the whole tree is traversable without JavaScript.
 */
const evidenceDir = 'release-evidence/issue-51';
const origin = 'http://127.0.0.1:4321/Ares';

const screens = [
  { path: './framework', name: 'framework', parent: 'Ares', role: 'Overview' },
  { path: './framework/definitions-typology', name: 'definitions', parent: 'Framework', role: 'Essential reading' },
  { path: './cases/my-lai-massacre', name: 'my-lai', parent: 'Ares', role: 'Overview' },
  { path: './cases/my-lai-massacre/orientation', name: 'my-lai-orientation', parent: 'My Lai', role: 'Essential reading' },
  { path: './cases/my-lai-massacre/narrative', name: 'my-lai-narrative', parent: 'My Lai', role: 'Essential reading' },
  { path: './cases/my-lai-massacre/key-evidence', name: 'my-lai-key-evidence', parent: 'My Lai', role: 'Essential reading' },
  { path: './cases/my-lai-massacre/finding', name: 'my-lai-finding', parent: 'My Lai', role: 'Essential reading' },
  { path: './cases/my-lai-massacre/scholarly-depth', name: 'my-lai-depth', parent: 'My Lai', role: 'Optional depth' },
  { path: './comparison', name: 'comparison', parent: 'Ares', role: 'Overview' },
  { path: './comparison/tempo', name: 'comparison-tempo', parent: 'Comparison', role: 'Essential reading' },
  { path: './comparison/scholarly-depth', name: 'comparison-depth', parent: 'Comparison', role: 'Optional depth' },
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
  test(`every screen answers the six mobile orientation questions at ${width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const screen of screens) {
      await page.goto(screen.path);
      const location = page.locator('[data-reading-location]');

      // Where am I, and what parent topic am I inside?
      await expect(location.locator('.screen-trail [aria-current]')).toBeVisible();
      await expect(location.locator('.screen-trail a', { hasText: screen.parent })).toBeVisible();
      // Essential or optional depth?
      await expect(location.locator('.reading-location__progress')).toContainText(screen.role);
      // What question does this unit answer?
      await expect(location.locator('.reading-location__question p')).not.toBeEmpty();
      // What does Back do, and what comes next?
      const nav = page.locator('.screen-nav');
      await expect(nav.locator('.screen-nav__parent')).toBeVisible();
      await expect(nav.locator('.screen-nav__hint')).toContainText('Browser Back');
      await expect(nav.locator('a', { hasText: /Next|Continue the reading path/ })).toBeVisible();

      await expectNoOverflow(page, `${screen.path} at ${width}px`);
      if (width === 390) await capture(page, browserName, `${screen.name}-390`);
    }
  });
}

test('a parent surface exposes its immediate children and marks which are optional', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  const children = page.locator('.unit-children a');
  await expect(children).toHaveCount(5);
  await expect(children.first()).toContainText('1 of 5 · Essential reading');
  await expect(children.last()).toContainText('5 of 5 · Optional depth');
  await capture(page, browserName, 'my-lai-children-390');

  await page.goto('./framework');
  const frameworkChildren = page.locator('.unit-children a');
  await expect(frameworkChildren).toHaveCount(3);
  // A child that has deliberately not been promoted to its own screen still
  // appears in the hierarchy, labelled as living on the parent surface.
  await expect(frameworkChildren.first()).toContainText('on this page');
  await expect(frameworkChildren.nth(1)).toHaveAttribute('href', /\/framework\/definitions-typology$/);
});

test('one conceptual unit per screen: a unit does not concatenate its siblings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre/key-evidence');
  await expect(page.locator('#key-evidence')).toBeVisible();
  // The neighbouring units are reachable by name, never stacked underneath.
  await expect(page.locator('#analysis')).toHaveCount(0);
  await expect(page.locator('#orientation')).toHaveCount(0);
  await expect(page.locator('.case-section')).toHaveCount(0);
  await expect(page.locator('.screen-nav a', { hasText: 'Analytical finding' })).toBeVisible();
});

test('optional depth is a branch, not the next step in the guided path', async ({ page }) => {
  await page.goto('./cases/my-lai-massacre/finding');
  // The unit after the finding is the next topic, not the case's extended detail.
  await expect(page.locator('.screen-nav a', { hasText: 'Comparison' })).toBeVisible();
  await expect(page.locator('.screen-nav a', { hasText: 'Next' })).not.toContainText('Scholarly depth');

  await page.goto('./cases/my-lai-massacre/scholarly-depth');
  await expect(page.locator('#full-scholarly-depth')).toContainText('Nothing here is needed to understand');
  await expect(page.getByRole('link', { name: 'Return to the analytical finding instead' })).toBeVisible();
  await expect(page.locator('.screen-nav a', { hasText: 'Continue the reading path' })).toBeVisible();
});

test('every screen keeps its meaning-changing caveats in the first reading layer', async ({ page }) => {
  await page.goto('./cases/my-lai-massacre/key-evidence');
  await expect(page.locator('.critical-caveats')).toContainText('trace status');
  await page.goto('./cases/my-lai-massacre/finding');
  await expect(page.locator('.critical-caveats')).toContainText('source-trace state');
  await page.goto('./comparison');
  await expect(page.locator('.integrity-note')).toContainText('Comparison is not equivalence');
  await expect(page.locator('.critical-caveats')).toContainText('never ranked');
  await page.goto('./comparison/tempo');
  await expect(page.locator('.integrity-note')).toContainText('Comparison is not equivalence');
});

test('the whole hierarchy is traversable with links alone, browser Back included', async ({ page }) => {
  await page.goto('./framework');
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);
  await page.locator('.unit-children a').first().click();
  await expect(page).toHaveURL(/\/orientation$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/orientation$/);

  // The parent link is an address, not a history operation: it returns to the
  // overview whichever way the reader arrived.
  await page.locator('.screen-nav__parent').click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);
  await page.locator('.screen-trail a', { hasText: 'Ares' }).click();
  await expect(page).toHaveURL(/\/Ares\/$|\/Ares$/);
});

test('resume stores and restores a screen-level conceptual unit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre/key-evidence');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ares:reading-position:v2') ?? 'null'));
  expect(stored.unitId).toBe('my-lai-key-evidence');
  expect(stored.href).toBe('/Ares/cases/my-lai-massacre/key-evidence');
  expect(stored.href).not.toContain('#');
  expect(stored.title).toContain('Key evidence');

  await page.goto('./');
  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume.locator('[data-resume-link]')).toContainText('My Lai · Key evidence');
  await resume.locator('[data-resume-link]').click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre\/key-evidence$/);

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

  // v1 state named a fragment on a page that has since been split. It migrates to
  // the screen that owns it rather than being offered as a dead anchor.
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

test('deep links restore the same conceptual location and old anchors forward to it', async ({ page }) => {
  for (const screen of screens) {
    await page.goto(screen.path);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-reading-location]')).toBeVisible();
  }
  for (const [from, to] of [
    ['./cases/my-lai-massacre#analysis', /\/cases\/my-lai-massacre\/finding$/],
    ['./cases/my-lai-massacre#full-scholarly-depth', /\/cases\/my-lai-massacre\/scholarly-depth$/],
    ['./comparison#tempo', /\/comparison\/tempo$/],
    ['./comparison#full-matrix', /\/comparison\/scholarly-depth$/],
    ['./framework#definitions-typology', /\/framework\/definitions-typology$/],
  ] as const) {
    await page.goto(from);
    await expect(page).toHaveURL(to);
  }
});

test('JavaScript-disabled readers traverse the same hierarchy', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(`${origin}/framework`);
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await expect(page.locator('#critical-caveats')).toBeVisible();

  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  for (const label of ['Orientation', 'Core narrative', 'Key evidence', 'Analytical finding', 'Scholarly depth']) {
    await expect(page.locator('.unit-children a', { hasText: label })).toBeVisible();
  }
  await page.locator('.unit-children a', { hasText: 'Scholarly depth' }).click();
  await expect(page).toHaveURL(/\/scholarly-depth$/);
  await expect(page.locator('.chronology')).toBeVisible();
  await expectNoOverflow(page, 'no-JS depth screen at 390px');

  await page.locator('.screen-nav__parent').click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);
  await capture(page, browserName, 'no-js-my-lai-overview-390');
  await context.close();
});

test('the hierarchy holds at 200% text, under reduced motion and by keyboard', async ({ page, browserName }) => {
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const screen of screens) {
    await page.goto(screen.path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoOverflow(page, `${screen.path} at 200% text`);
  }
  await capture(page, browserName, 'my-lai-key-evidence-text-200-390');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./cases/my-lai-massacre');
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

  const firstChild = page.locator('.unit-children a').first();
  await firstChild.focus();
  await expect(firstChild).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/orientation$/);
});

for (const width of [768, 1440]) {
  test(`the hierarchy chrome stays coherent at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const screen of screens) {
      await page.goto(screen.path);
      await expect(page.locator('.screen-trail')).toBeVisible();
      await expectNoOverflow(page, `${screen.path} at ${width}px`);
    }
    await page.goto('./cases/my-lai-massacre');
    await capture(page, browserName, `my-lai-${width}`);
  });
}
