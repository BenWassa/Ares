import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/**
 * The #45 reading-layer guarantees, carried forward onto the #51 screen hierarchy.
 *
 * What #45 proved has not changed: essential material comes first, meaning-changing
 * caveats never move into depth, the reader can leave at any point, and none of it
 * depends on JavaScript. Where those guarantees now live has changed, because the
 * reading stages that used to share one route are screens.
 */
const evidenceDir = 'release-evidence/issue-45';
const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const prototypeRoutes = [
  { path: './', name: 'home' },
  { path: './framework/definitions-typology', name: 'definitions' },
  { path: './cases/my-lai-massacre', name: 'my-lai' },
  { path: './cases/my-lai-massacre/finding', name: 'my-lai-finding' },
  { path: './comparison', name: 'comparison' },
  { path: './comparison/tempo', name: 'comparison-tempo' },
];

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir(evidenceDir, { recursive: true });
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage: false, animations: 'disabled' });
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const viewport of viewports) {
  test(`Issue #45 prototype renders without horizontal overflow at ${viewport.width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize(viewport);
    for (const prototypeRoute of prototypeRoutes) {
      await page.goto(prototypeRoute.path);
      await expect(page.locator('h1')).toBeVisible();
      await expectNoOverflow(page);
      await capture(page, browserName, `${prototypeRoute.name}-${viewport.width}`);
    }
  });
}

test('framework essential unit keeps critical caveats visible and scholarly depth optional', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  await expect(page.locator('#what-matters')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toContainText('Comparison is not equivalence');
  const depth = page.locator('#scholarly-framing');
  await expect(depth).not.toHaveAttribute('open', '');
  await depth.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(depth).toHaveAttribute('open', '');
  await capture(page, browserName, 'definitions-depth-open-390');
});

test('My Lai reaches analysis and a pause without requiring extended traumatic detail', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/my-lai-massacre/orientation');
  await expect(page.locator('#orientation')).toBeVisible();
  // Extended detail is a sibling screen the reader has to choose, never material
  // they must scroll through to reach the analysis.
  await expect(page.locator('.case-section')).toHaveCount(0);
  await page.locator('.screen-nav a', { hasText: 'Next' }).click();

  await page.goto('./cases/my-lai-massacre/finding');
  await expect(page.locator('#analysis')).toBeVisible();
  await expect(page.locator('.integrity-note')).toContainText('Limitation.');
  await expect(page.getByRole('link', { name: 'Pause here and return to Ares' })).toBeVisible();
  await capture(page, browserName, 'my-lai-finding-390');

  await page.goto('./cases/my-lai-massacre/scholarly-depth');
  await expect(page.locator('.chronology')).toBeVisible();
  await capture(page, browserName, 'my-lai-depth-390');
});

test('comparison starts dimension-first and preserves the complete matrix as depth', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('./comparison');
  await expect(page.locator('#comparison-findings')).toBeVisible();
  // The matrix is not on the overview at all; it is one explicit choice away.
  await expect(page.locator('.comparison-table')).toHaveCount(0);

  await page.goto('./comparison/tempo');
  await expect(page.locator('#tempo')).toBeVisible();
  await expect(page.locator('#tempo')).toContainText('not different positions on a single severity scale');

  await page.goto('./comparison/scholarly-depth');
  const responsiveMatrix = page.locator('.comparison-detail');
  await expect(responsiveMatrix).toBeVisible();
  await responsiveMatrix.locator(':scope > summary').click();
  await expect(responsiveMatrix.locator('.comparison-stack')).toBeVisible();
  await capture(page, browserName, 'comparison-depth-open-430');
});

test('prototype deep links preserve stable conceptual locations', async ({ page }) => {
  await page.goto('./framework/definitions-typology#critical-caveats');
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await page.goto('./cases/my-lai-massacre/finding#analysis');
  await expect(page.locator('#analysis')).toBeVisible();
  await page.goto('./comparison/tempo#tempo');
  await expect(page.locator('#tempo')).toBeVisible();
});

test('200% text scaling keeps prototype mobile reading free of horizontal overflow', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const prototypeRoute of prototypeRoutes.slice(1)) {
    await page.goto(prototypeRoute.path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('h1')).toBeVisible();
    await expectNoOverflow(page);
  }
  await page.goto('./framework/definitions-typology');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await capture(page, browserName, 'definitions-text-200-390');
});

test('reduced motion preserves keyboard-operated prototype disclosure', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./framework/definitions-typology');
  const summary = page.locator('#scholarly-framing > summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#scholarly-framing')).toHaveAttribute('open', '');
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
  await capture(page, browserName, 'definitions-reduced-motion-390');
});

test('JavaScript-disabled prototype keeps essential reading and scholarly-depth access in the document', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:4321/Ares/framework/definitions-typology');
  await expect(page.locator('#what-matters')).toBeVisible();
  await expect(page.locator('#critical-caveats')).toBeVisible();
  await expect(page.locator('#scholarly-framing > summary')).toBeVisible();
  await expectNoOverflow(page);

  await page.goto('http://127.0.0.1:4321/Ares/cases/my-lai-massacre/finding');
  await expect(page.locator('#analysis')).toBeVisible();
  await expect(page.locator('.unit-children, .screen-nav')).toBeVisible();
  await expectNoOverflow(page);

  await page.goto('http://127.0.0.1:4321/Ares/comparison');
  await expect(page.locator('#comparison-findings')).toBeVisible();
  await expect(page.locator('.unit-children a', { hasText: 'Dimension: tempo' })).toBeVisible();
  await expectNoOverflow(page);
  await capture(page, browserName, 'javascript-disabled-comparison-390');
  await context.close();
});
