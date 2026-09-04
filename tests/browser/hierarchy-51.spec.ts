import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/**
 * The Ares screen-hierarchy gate.
 *
 * #51 proved that each surface is one conceptual unit inside an explicit
 * hierarchy. #58 keeps that claim and changes what a *surface* is: units that
 * belong to the same topic are sections of one screen rather than one screen
 * each, because a page load between the four essential units of a single case
 * was navigation the reader never asked for.
 *
 * So this file now proves two things at once. The screens still answer the six
 * mobile orientation questions, and the units that merged are still units —
 * separately addressable, separately captioned, with their caveats still in the
 * first reading layer — rather than prose that quietly ran together.
 */
const evidenceDir = 'release-evidence/hierarchy';
const origin = 'http://127.0.0.1:4321/Ares';

const screens = [
  { path: './framework', name: 'framework', parent: 'Ares', role: 'Overview' },
  { path: './framework/definitions-typology', name: 'definitions', parent: 'Framework', role: 'Essential reading' },
  { path: './framework/theoretical-lenses', name: 'theoretical-lenses', parent: 'Framework', role: 'Optional depth' },
  { path: './cases/my-lai-massacre', name: 'my-lai', parent: 'Ares', role: 'Overview' },
  { path: './comparison', name: 'comparison', parent: 'Ares', role: 'Overview' },
];

/** Units that render as sections of the surface named by their parent route. */
const mergedUnits = [
  { surface: './cases/my-lai-massacre', anchor: 'orientation', heading: /why this case is here/i },
  { surface: './cases/my-lai-massacre', anchor: 'narrative', heading: /./ },
  { surface: './cases/my-lai-massacre', anchor: 'key-evidence', heading: /hold in view/i },
  { surface: './cases/my-lai-massacre', anchor: 'finding', heading: /can support/i },
  { surface: './cases/my-lai-massacre', anchor: 'scholarly-depth', heading: /./ },
  { surface: './comparison', anchor: 'tempo', heading: /./ },
  { surface: './comparison', anchor: 'scholarly-depth', heading: /./ },
  { surface: './framework', anchor: 'scope-purpose', heading: /scope/i },
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

test('a merged unit keeps its own address on the surface that renders it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const unit of mergedUnits) {
    await page.goto(`${unit.surface}#${unit.anchor}`);
    const section = page.locator(`#${unit.anchor}`);
    await expect(section, `${unit.surface}#${unit.anchor}`).toHaveCount(1);
    // The anchor resolves inside the surface rather than redirecting off it.
    await expect(page).toHaveURL(new RegExp(`#${unit.anchor}$`));
  }
});

test('a parent surface exposes its immediate children and marks which are optional', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework');
  const frameworkChildren = page.locator('.unit-children a');
  await expect(frameworkChildren).toHaveCount(3);
  // The unit that renders here says so instead of pretending to be a destination.
  await expect(frameworkChildren.first()).toContainText('on this page');
  await expect(frameworkChildren.first()).toHaveAttribute('href', /\/framework#scope-purpose$/);
  await expect(frameworkChildren.nth(1)).toHaveAttribute('href', /\/framework\/definitions-typology$/);
  await expect(frameworkChildren.last()).toContainText('Optional depth');
  await capture(page, browserName, 'framework-children-390');
});

test('a case surface carries its units in order, each still captioned as a unit', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre');
  for (const [index, anchor] of ['orientation', 'narrative', 'key-evidence', 'finding'].entries()) {
    const section = page.locator(`#${anchor}`);
    await expect(section).toBeVisible();
    await expect(section.locator('.reading-unit__index')).toContainText(`${index + 1} of 4 · Essential`);
  }
  await capture(page, browserName, 'my-lai-units-390');
});

test('optional depth is a closed disclosure, never material the reader scrolls into', async ({ page }) => {
  for (const path of ['./cases/my-lai-massacre', './comparison']) {
    await page.goto(path);
    const depth = page.locator('details#scholarly-depth');
    await expect(depth, path).toHaveCount(1);
    // Closed by default: extended detail of the killing is never in front of a
    // reader who did not ask for it, even though it is on the same surface.
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open), path).toBe(false);
    await depth.locator(':scope > summary').click();
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open), path).toBe(true);
  }

  await page.goto('./cases/my-lai-massacre');
  await page.locator('details#scholarly-depth > summary').click();
  await expect(page.locator('#scholarly-depth .content-note')).toContainText('Nothing below is needed');
  await expect(page.locator('.chronology')).toBeVisible();
});

test('every surface keeps its meaning-changing caveats in the first reading layer', async ({ page }) => {
  await page.goto('./cases/my-lai-massacre');
  await expect(page.locator('.critical-caveats').first()).toContainText('source-trace');
  await expect(page.locator('.case-header .source-status')).toContainText('requires source trace');
  await page.goto('./comparison');
  await expect(page.locator('.page-intro')).toContainText('Neither view ranks the cases');
  await expect(page.locator('.integrity-note').first()).toContainText('Comparison is not equivalence');
});

test('the whole hierarchy is traversable with links alone, browser Back included', async ({ page }) => {
  await page.goto('./framework');
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  // The parent link is an address, not a history operation: it returns to the
  // overview whichever way the reader arrived.
  await page.locator('.screen-nav__parent').click();
  await expect(page).toHaveURL(/\/Ares\/$|\/Ares$/);
});

test('resume stores and restores a screen-level conceptual unit', async ({ page }) => {
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

  // A position stored against a route that #58 merged away is stale in exactly
  // the same way, and is dropped rather than offered as a link into a 404.
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
  // Anchors published by 2.2 and routes published by #51 both land on the unit
  // that inherited them. A reader's saved link never resolves to nothing.
  for (const [from, to] of [
    ['./cases/my-lai-massacre#analysis', /\/cases\/my-lai-massacre#finding$/],
    ['./cases/my-lai-massacre#full-scholarly-depth', /\/cases\/my-lai-massacre#scholarly-depth$/],
    ['./cases/my-lai-massacre#essential-a', /\/cases\/my-lai-massacre#narrative$/],
    ['./comparison#full-matrix', /\/comparison#scholarly-depth$/],
    ['./comparison#full-comparison-depth', /\/comparison#scholarly-depth$/],
    ['./framework#definitions-typology', /\/framework\/definitions-typology$/],
    ['./framework#theoretical-lenses', /\/framework\/theoretical-lenses$/],
    ['./#scope-purpose', /\/framework#scope-purpose$/],
  ] as const) {
    // Navigating between two hashes on the same document does not reload it, and
    // the forwarding script only runs on load. Reset between assertions.
    await page.goto('about:blank');
    await page.goto(from);
    await expect(page, from).toHaveURL(to);
  }
});

test('JavaScript-disabled readers traverse the same hierarchy', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(`${origin}/framework`);
  // The framework's orientation is on the page itself, so a no-JS reader meets
  // the publication's prose on the first surface rather than after two clicks.
  await expect(page.locator('#scope-purpose .prose')).toBeVisible();
  await page.locator('.unit-children a').nth(1).click();
  await expect(page).toHaveURL(/\/framework\/definitions-typology$/);
  await expect(page.locator('#critical-caveats')).toBeVisible();

  await page.locator('.screen-nav a', { hasText: 'Next' }).click();
  await expect(page).toHaveURL(/\/cases\/my-lai-massacre$/);

  for (const anchor of ['orientation', 'narrative', 'key-evidence', 'finding']) {
    await expect(page.locator(`#${anchor}`)).toBeVisible();
  }
  // `details` is a native control: the complete record opens without scripting.
  await page.locator('details#scholarly-depth > summary').click();
  await expect(page.locator('.chronology')).toBeVisible();
  await expectNoOverflow(page, 'no-JS case surface at 390px');

  await capture(page, browserName, 'no-js-my-lai-390');
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
  await capture(page, browserName, 'my-lai-text-200-390');

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

  const summary = page.locator('details#scholarly-depth > summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await page.locator('details#scholarly-depth').evaluate((element: HTMLDetailsElement) => element.open)).toBe(true);
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
