import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Lane 5 gate (#34). Every figure must be complete without JavaScript, carry a
 * semantic equivalent rather than only a picture, and never rank or size by toll.
 */

const figureRoutes = [
  { route: './process', id: 'figure-01' },
  { route: './cases/el-mozote-massacre', id: 'figure-02-el-mozote-massacre' },
  { route: './comparison', id: 'figure-03' },
  { route: './references', id: 'figure-04' },
];

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
}

for (const { route, id } of figureRoutes) {
  test(`${id} carries a caption, a finding and a source line`, async ({ page }) => {
    await page.goto(route);
    const figure = page.locator(`#${id}`);
    await expect(figure).toBeVisible();
    await expect(figure.locator('.figure__title')).toContainText(/Figure 0\d/);
    await expect(figure.locator('.figure__finding')).not.toBeEmpty();
    await expect(figure.locator('.figure__source')).not.toBeEmpty();
  });

  test(`${id} stays accessible`, async ({ page }) => {
    await page.goto(route);
    await expectNoSeriousViolations(page);
  });
}

test('every figure renders completely with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const { route, id } of figureRoutes) {
    await page.goto(`http://127.0.0.1:4321/Ares/${route.replace('./', '')}`);
    const figure = page.locator(`#${id}`);
    await expect(figure, `${id} is absent without JavaScript`).toBeVisible();
    const box = await figure.boundingBox();
    expect(box!.height, `${id} collapses without JavaScript`).toBeGreaterThan(80);
    const hidden = await figure.evaluate((element) => element.getAttribute('data-authored-motion'));
    expect(hidden).toBeNull();
  }
  await context.close();
});

test('every figure has a semantic equivalent, not just a picture', async ({ page }) => {
  for (const { route, id } of figureRoutes) {
    await page.goto(route);
    const semantic = await page.locator(`#${id}`).evaluate((element) => ({
      lists: element.querySelectorAll('ol, ul').length,
      tables: element.querySelectorAll('table').length,
      rows: element.querySelectorAll('li, tbody tr').length,
    }));
    expect(semantic.lists + semantic.tables, `${id} has no list or table equivalent`).toBeGreaterThan(0);
    expect(semantic.rows, `${id} has an empty semantic equivalent`).toBeGreaterThan(3);
  }
});

test('no figure encodes a death toll as geometry', async ({ page }) => {
  await page.goto('./comparison');
  const encoded = await page.locator('#figure-03').evaluate((figure) => {
    const rows = [...figure.querySelectorAll('tbody tr')];
    return rows.map((row) => ({
      toll: row.querySelector('.duration-table__toll')?.textContent?.trim() ?? '',
      barWidth: Math.round((row.querySelector('.duration-bar') as HTMLElement | null)?.getBoundingClientRect().width ?? 0),
      reading: row.querySelector('.duration-table__reading')?.textContent?.trim() ?? '',
    }));
  });
  for (const row of encoded) expect(row.toll).toMatch(/[\d,]/);
  const holodomor = encoded.find((row) => row.toll.startsWith('3,900,000'));
  const cambodia = encoded.find((row) => row.toll.startsWith('1,500,000'));
  expect(holodomor && cambodia).toBeTruthy();
  expect(holodomor!.barWidth).toBeLessThan(cambodia!.barWidth);
});

test('the comparison is comparable on a phone in under three screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./comparison');
  const figure = await page.locator('#figure-03').boundingBox();
  // Figure 03 now sits with the dimension it illustrates, and the full matrix is
  // one disclosure below it; the phone reader still meets a comparable comparison
  // without scrolling a matrix.
  await page.locator('details#scholarly-depth > summary').click();
  const detail = await page.locator('.comparison-detail').boundingBox();
  const surface = figure!.height + detail!.height;
  expect(surface / 844, `the comparison surface is ${Math.round(surface)}px`).toBeLessThanOrEqual(3);
  await page.locator('.comparison-detail > summary').click();
  await expect(page.locator('.comparison-stack article')).toHaveCount(8);
});

test('the chronology spine renders no ISO date and keeps its labels', async ({ page }) => {
  await page.goto('./cases/armenian-genocide');
  const spine = page.locator('figure[id^="figure-02-"]');
  await expect(spine.locator('.chronology__entry')).toHaveCount(5);
  const body = await spine.innerText();
  expect(body).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  expect(body).toContain('Spring-Summer 1915');
  const precisions = await spine.locator('.chronology__entry').evaluateAll((items) => items.map((item) => item.getAttribute('data-precision')));
  expect(new Set(precisions).size).toBeGreaterThan(1);
});

test('the process cycle shows a feedback graph rather than a sequence', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('./process');
  const cycle = page.locator('#figure-01');
  const wide = cycle.locator('.process-cycle__svg--wide');
  await expect(wide).toBeVisible();
  await expect(wide.locator('.process-cycle__nodes rect')).toHaveCount(4);
  await expect(wide.locator('.process-cycle__edges path')).toHaveCount(4);
  await expect(wide.locator('.process-cycle__return')).toHaveCount(1);
  const strokes = await wide.locator('.process-cycle__edges path').evaluateAll((paths) => paths.map((path) => {
    const style = getComputedStyle(path);
    return `${style.strokeWidth}|${style.strokeDasharray}`;
  }));
  expect(new Set(strokes).size).toBe(1);
  const sizes = await wide.locator('.process-cycle__nodes rect').evaluateAll((rects) => rects.map((rect) => {
    const box = rect.getBoundingClientRect();
    return `${Math.round(box.width)}x${Math.round(box.height)}`;
  }));
  expect(new Set(sizes).size).toBe(1);
});

test('the process cycle keeps readable text on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./process');
  const narrow = page.locator('.process-cycle__svg--narrow');
  await expect(narrow).toBeVisible();
  await expect(page.locator('.process-cycle__svg--wide')).toBeHidden();
  const effective = await narrow.evaluate((svg) => {
    const element = svg as unknown as SVGSVGElement;
    const scale = element.getBoundingClientRect().width / element.viewBox.baseVal.width;
    const text = element.querySelector('.process-cycle__nodes text');
    return Number.parseFloat(getComputedStyle(text!).fontSize) * scale;
  });
  expect(effective, `figure text renders at ${effective.toFixed(1)}px`).toBeGreaterThanOrEqual(12);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('figure text stays on the two locked families and above the readable floor', async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { route } of figureRoutes) {
      await page.goto(route);
      const offenders = await page.evaluate(() => {
        const results: string[] = [];
        for (const svg of document.querySelectorAll<SVGSVGElement>('figure svg')) {
          if (svg.getBoundingClientRect().width === 0) continue;
          const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
          for (const node of svg.querySelectorAll('text')) {
            const style = getComputedStyle(node);
            const family = style.fontFamily.split(',')[0]?.replace(/["']/g, '').trim() ?? '';
            const effective = Number.parseFloat(style.fontSize) * scale;
            if (!['Newsreader', 'IBM Plex Sans'].includes(family)) results.push(`${family} is not a locked family`);
            if (effective < 12) results.push(`${node.textContent?.slice(0, 20)} renders at ${effective.toFixed(1)}px`);
          }
        }
        return results;
      });
      expect(offenders, `${route} at ${width}px:\n${offenders.join('\n')}`).toEqual([]);
    }
  }
});

test('the provenance ledger states its position without gamifying it', async ({ page }) => {
  await page.goto('./references');
  const ledger = page.locator('#figure-04');
  const body = await ledger.innerText();
  expect(body).toMatch(/88/);
  expect(body).toMatch(/untraced does not mean false/i);
  expect(body).not.toMatch(/complete|progress|\d+%\s*(done|traced)/i);
  await expect(ledger.locator('tbody tr')).toHaveCount(6);
  const inline = page.locator('.provenance-inline');
  await page.goto('./cases/nanking-massacre');
  await expect(inline.first()).toContainText('records traced');
});
