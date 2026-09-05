import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDir = 'release-evidence/case-openings-64';
const origin = 'http://127.0.0.1:4321/Ares';

const cases = [
  {
    path: './cases/my-lai-massacre',
    slug: 'my-lai-massacre',
    estimate: '347–504',
    classification: 'Military massacre',
    testimony: 'These people were looking at me for help',
    hiddenTrauma: 'Rape and sexual assault',
    hasDurationNote: false,
  },
  {
    path: './cases/ukrainian-holodomor',
    slug: 'ukrainian-holodomor',
    estimate: '3,900,000–7,000,000',
    classification: 'Political slaughter',
    testimony: 'There is no bread. We are dying.',
    hiddenTrauma: 'Reports of cannibalism become increasingly common.',
    hasDurationNote: true,
  },
] as const;

const essentialIds = ['what-happened', 'why-ares', 'finding', 'essential-reading'] as const;

async function expectNoOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, label).toBeLessThanOrEqual(1);
}

async function capture(page: Page, browserName: string, name: string) {
  if (browserName !== 'chromium') return;
  await mkdir(evidenceDir, { recursive: true });
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage: true, animations: 'disabled' });
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

for (const item of cases) {
  test(`${item.slug}: A–G opening keeps integrity material visible and depth deliberate`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(item.path);

    const article = page.locator('.representative-case');
    await expect(article).toHaveCount(1);
    await expect(article.locator('#identity')).toBeVisible();
    await expect(article.locator('#standing-facts')).toBeVisible();

    // B is exactly four standing facts. The estimate is the canonical display
    // string verbatim, with uncertainty and trace status attached rather than
    // converted into a tile, midpoint or geometric mark.
    const facts = article.locator('.case-meta--opening > div');
    await expect(facts).toHaveCount(4);
    const estimate = article.locator('.case-meta__estimate dd');
    expect(await estimate.evaluate((node) => node.firstChild?.textContent ?? '')).toBe(item.estimate);
    await expect(estimate).toContainText(/requires source trace/i);
    await expect(article.locator('.case-meta--opening')).toContainText(item.classification);
    await expect(article.locator('.case-meta--opening')).toContainText(/requires source trace/i);

    const columns = await article.locator('.case-meta--opening').evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length);
    expect(columns).toBe(2);

    if (item.hasDurationNote) {
      await expect(article.locator('#duration-note')).toBeVisible();
      await expect(article.locator('#duration-note')).toContainText('Judgement call');
    } else {
      await expect(article.locator('#duration-note')).toHaveCount(0);
    }

    for (const id of essentialIds) await expect(article.locator(`#${id}`)).toBeVisible();
    await expect(article.locator('#finding .integrity-note')).toBeVisible();
    await expect(article.locator('#finding .integrity-note')).toContainText(/Limitation\./);
    await expect(article.locator('#essential-reading .principal-testimony')).toContainText(item.testimony);
    await expect(article.locator('#essential-reading .evidence-provenance')).toContainText(/quotation status/i);
    await expect(article.locator('#essential-reading .essential-chronology > li')).toHaveCount(4);

    const whatHappened = await article.locator('#what-happened > p').last().innerText();
    const whyAres = await article.locator('#why-ares > p').last().innerText();
    const finding = await article.locator('#finding > p').last().innerText();
    expect(words(whatHappened)).toBeGreaterThanOrEqual(60);
    expect(words(whatHappened)).toBeLessThanOrEqual(110);
    expect(words(whyAres)).toBeGreaterThanOrEqual(30);
    expect(words(whyAres)).toBeLessThanOrEqual(60);
    expect(words(finding)).toBeGreaterThanOrEqual(30);
    expect(words(finding)).toBeLessThanOrEqual(60);

    const note = article.locator('.representative-case__depth-entry > .content-note');
    await expect(note).toBeVisible();
    const depth = article.locator('details#scholarly-depth');
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(false);
    await expect(article.locator('.scholarly-depth__body')).toBeHidden();

    // The content note may name what follows, but the extended canonical detail
    // itself is not accidentally exposed before the reader opens G.
    expect(await page.locator('main').innerText()).not.toContain(item.hiddenTrauma);
    await depth.locator(':scope > summary').click();
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(true);
    await expect(article.locator('.scholarly-depth__body')).toBeVisible();
    await expect(article.locator('.scholarly-depth__body')).toContainText(item.hiddenTrauma);
    await expect(article.locator('.chronology')).toBeVisible();
  });
}

for (const width of [320, 360, 390, 430, 768, 1440]) {
  test(`representative openings hold at ${width}px`, async ({ page, browserName }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const item of cases) {
      await page.goto(item.path);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('#what-happened')).toBeVisible();
      await expect(page.locator('#finding .integrity-note')).toBeVisible();
      await expect(page.locator('.representative-case__depth-entry > .content-note')).toBeVisible();
      expect(await page.locator('details#scholarly-depth').evaluate((element: HTMLDetailsElement) => element.open)).toBe(false);
      await expectNoOverflow(page, `${item.path} at ${width}px`);

      // Every visible interaction introduced or owned by this case opening meets
      // the 44px minimum target contract.
      const tooSmall = await page.locator('.representative-case a:visible, .representative-case summary:visible').evaluateAll((nodes) =>
        nodes.map((node) => ({ text: node.textContent?.trim() ?? '', height: node.getBoundingClientRect().height }))
          .filter((item) => item.height < 43.5),
      );
      expect(tooSmall, `${item.slug} has an undersized control at ${width}px`).toEqual([]);

      if (width === 390 || width === 430) await capture(page, browserName, `${item.slug}-${width}`);
    }
  });
}

test('representative openings survive 200% text without overflow', async ({ page, browserName }) => {
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const item of cases) {
    await page.goto(item.path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('#what-happened')).toBeVisible();
    await expect(page.locator('.representative-case__depth-entry > .content-note')).toBeVisible();
    await expectNoOverflow(page, `${item.path} at 200% text`);
    await capture(page, browserName, `${item.slug}-200-percent-390`);
  }
});

test('representative opening controls work by keyboard and reduced motion adds no long transition', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const item of cases) {
    await page.goto(item.path);
    const summary = page.locator('details#scholarly-depth > summary');
    await summary.focus();
    await expect(summary).toBeFocused();
    await page.keyboard.press('Enter');
    expect(await page.locator('details#scholarly-depth').evaluate((element: HTMLDetailsElement) => element.open)).toBe(true);

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
  }
});

test('JavaScript-disabled readers get A–F and can deliberately open G', async ({ browser, browserName }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const item of cases) {
    await page.goto(`${origin}/${item.path.replace('./', '')}`);
    for (const id of essentialIds) await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator('.representative-case__depth-entry > .content-note')).toBeVisible();
    const depth = page.locator('details#scholarly-depth');
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(false);
    await depth.locator(':scope > summary').click();
    expect(await depth.evaluate((element: HTMLDetailsElement) => element.open)).toBe(true);
    await expect(page.locator('.scholarly-depth__body')).toBeVisible();
    await expectNoOverflow(page, `no-JS ${item.slug}`);
    await capture(page, browserName, `no-js-${item.slug}-390`);
  }
  await context.close();
});

test('Holodomor resume is accepted but an unknown case route is still rejected', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./cases/ukrainian-holodomor');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ares:reading-position:v2') ?? 'null'));
  expect(stored.href).toBe('/Ares/cases/ukrainian-holodomor');
  expect(stored.title).toContain('Holodomor');

  await page.goto('./');
  const resume = page.locator('[data-resume-home]');
  await expect(resume).toBeVisible();
  await expect(resume.locator('[data-resume-link]')).toHaveAttribute('href', '/Ares/cases/ukrainian-holodomor');

  await page.evaluate(() => localStorage.setItem('ares:reading-position:v2', JSON.stringify({
    unitId: 'case:retired', href: '/Ares/cases/retired-unit', title: 'Retired', savedAt: Date.now(),
  })));
  await page.reload();
  await expect(resume).toBeHidden();
});

test('new case anchors are stable and My Lai legacy anchors forward to the new grammar', async ({ page }) => {
  for (const item of cases) {
    for (const anchor of [...essentialIds, 'scholarly-depth']) {
      await page.goto(`${item.path}#${anchor}`);
      await expect(page.locator(`#${anchor}`)).toHaveCount(1);
      await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
    }
  }

  for (const [from, target] of [
    ['orientation', 'what-happened'],
    ['narrative', 'what-happened'],
    ['key-evidence', 'essential-reading'],
    ['essential-a', 'what-happened'],
    ['analysis', 'finding'],
    ['full-scholarly-depth', 'scholarly-depth'],
  ] as const) {
    await page.goto('about:blank');
    await page.goto(`./cases/my-lai-massacre#${from}`);
    await expect(page).toHaveURL(new RegExp(`/cases/my-lai-massacre#${target}$`));
  }
});
