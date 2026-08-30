import { expect, test, type Page } from '@playwright/test';

/**
 * The Ares 2.2 design-system gate (#30).
 *
 * The 2.1 release gate measured contrast ratios and could not tell that colour was
 * being assigned by DOM position, that a route carried 25 type combinations, or
 * that apparatus text had sunk to 10.9px. These checks measure the system itself.
 */

const routes = ['./', './framework', './cases', './cases/my-lai-massacre', './comparison', './process', './implications', './reflection', './glossary', './references'];

function typographyProbe() {
  const combinations = new Map<string, number>();
  let smallest = Number.POSITIVE_INFINITY;
  let smallestSelector = '';
  const weights = new Set<string>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node.textContent ?? '';
    const parent = node.parentElement;
    if (text.trim() && parent) {
      const rect = parent.getBoundingClientRect();
      const style = getComputedStyle(parent);
      if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none') {
        const size = Number.parseFloat(style.fontSize);
        const family = style.fontFamily.split(',')[0]?.replace(/["']/g, '').trim() ?? '';
        const key = `${family} ${style.fontWeight} ${size.toFixed(1)}px`;
        combinations.set(key, (combinations.get(key) ?? 0) + 1);
        weights.add(style.fontWeight);
        if (size < smallest) {
          smallest = size;
          smallestSelector = `${parent.tagName.toLowerCase()}.${parent.className}`.slice(0, 90);
        }
      }
    }
    node = walker.nextNode();
  }
  return { combinations: [...combinations.keys()].sort(), weights: [...weights].sort(), smallest, smallestSelector };
}

function positionalColourProbe() {
  const sheets = [...document.styleSheets];
  const offenders: string[] = [];
  const colourProperty = /(^|-)(color|background|background-color|background-image|border-color|border-[a-z]+-color|box-shadow|fill|stroke)$/;
  for (const sheet of sheets) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list: CSSRuleList) => {
      for (const rule of [...list]) {
        if (rule instanceof CSSGroupingRule) { walk(rule.cssRules); continue; }
        if (!(rule instanceof CSSStyleRule)) continue;
        if (!/nth-child|nth-of-type|nth-last-child|nth-last-of-type/.test(rule.selectorText)) continue;
        for (const property of [...rule.style]) {
          if (colourProperty.test(property) || /^--/.test(property)) offenders.push(`${rule.selectorText} { ${property} }`);
        }
      }
    };
    walk(rules);
  }
  return offenders;
}

function measureProbe() {
  const candidates = [...document.querySelectorAll<HTMLElement>('main .prose p')]
    .filter((element) => (element.textContent ?? '').trim().length >= 260)
    .slice(0, 6);
  if (candidates.length === 0) return null;
  const samples: number[] = [];
  for (const element of candidates) {
    const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
    const range = document.createRange();
    range.selectNodeContents(element);
    // An inline link splits a line into several client rects, so count distinct
    // line boxes by their top edge rather than counting rects.
    const tops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
    if (tops.size < 3) continue;
    samples.push(text.length / tops.size);
  }
  if (samples.length === 0) return null;
  return { charactersPerLine: samples.reduce((sum, value) => sum + value, 0) / samples.length, samples: samples.length };
}

function contrastProbe() {
  const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
  const backgroundOf = (element: Element): number[] => {
    let current: Element | null = element;
    while (current) {
      const colour = parse(getComputedStyle(current).backgroundColor);
      const alpha = colour[3] ?? 1;
      if (alpha > 0.95 && colour.length >= 3) return colour.slice(0, 3);
      current = current.parentElement;
    }
    return [255, 255, 255];
  };
  const relative = (rgb: number[]) => {
    const channel = (value: number) => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(rgb[0] ?? 0) + 0.7152 * channel(rgb[1] ?? 0) + 0.0722 * channel(rgb[2] ?? 0);
  };

  const failures: { text: string; ratio: number; size: number; weight: string }[] = [];
  let checked = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.textContent ?? '').trim();
    const parent = node.parentElement;
    if (text && parent) {
      const style = getComputedStyle(parent);
      const rect = parent.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && Number.parseFloat(style.opacity) > 0.1) {
        const size = Number.parseFloat(style.fontSize);
        const weight = Number.parseInt(style.fontWeight, 10) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const foreground = parse(style.color).slice(0, 3);
        const background = backgroundOf(parent);
        const a = relative(foreground);
        const b = relative(background);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        checked += 1;
        if (ratio < (large ? 3 : 4.5)) failures.push({ text: text.slice(0, 60), ratio: Number(ratio.toFixed(2)), size, weight: style.fontWeight });
      }
    }
    node = walker.nextNode();
  }
  return { checked, failures };
}

function groundSequenceProbe() {
  const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
  const relative = (rgb: number[]) => {
    const channel = (value: number) => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(rgb[0] ?? 0) + 0.7152 * channel(rgb[1] ?? 0) + 0.0722 * channel(rgb[2] ?? 0);
  };
  const bands: { dark: boolean; label: string }[] = [];
  // Only content bands are considered: the sticky masthead and the closing footer
  // are page chrome, not a mid-scroll inversion of the reading ground.
  const main = document.querySelector('main');
  if (!main) return bands;
  for (const element of main.querySelectorAll<HTMLElement>('header, section, article, div, aside')) {
    const style = getComputedStyle(element);
    const colour = parse(style.backgroundColor);
    if ((colour[3] ?? 1) < 0.95) continue;
    const rect = element.getBoundingClientRect();
    if (rect.height < 80) continue;
    const dark = relative(colour.slice(0, 3)) < 0.2;
    const previous = bands.at(-1);
    if (!previous || previous.dark !== dark) bands.push({ dark, label: `${element.tagName.toLowerCase()}.${element.className}`.slice(0, 60) });
  }
  return bands;
}

async function gotoSettled(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

test('no stylesheet assigns colour by position in a list', async ({ page }) => {
  await gotoSettled(page, './cases/my-lai-massacre');
  const offenders = await page.evaluate(positionalColourProbe);
  expect(offenders, offenders.join('\n')).toEqual([]);
});

for (const route of routes) {
  test(`type ramp holds on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoSettled(page, route);
    const probe = await page.evaluate(typographyProbe);
    expect(probe.combinations.length, `combinations:\n${probe.combinations.join('\n')}`).toBeLessThanOrEqual(9);
    expect(probe.weights.length, `weights in use: ${probe.weights.join(', ')}`).toBeLessThanOrEqual(3);
    expect(probe.smallest, `smallest text is ${probe.smallest}px on ${probe.smallestSelector}`).toBeGreaterThanOrEqual(13);
  });
}

test('prose measure stays inside 60–70 characters at every breakpoint', async ({ page }) => {
  for (const width of [390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoSettled(page, './framework');
    const probe = await page.evaluate(measureProbe);
    expect(probe, `no multi-line paragraph found at ${width}px`).not.toBeNull();
    expect(probe!.charactersPerLine, `measure at ${width}px is ${probe!.charactersPerLine.toFixed(1)} characters`).toBeLessThanOrEqual(70);
    if (width >= 768) expect(probe!.charactersPerLine, `measure at ${width}px is ${probe!.charactersPerLine.toFixed(1)} characters`).toBeGreaterThanOrEqual(55);
  }
});

for (const route of routes) {
  test(`every rendered text node meets WCAG AA on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoSettled(page, route);
    const { checked, failures } = await page.evaluate(contrastProbe);
    expect(checked).toBeGreaterThan(10);
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
}

for (const route of ['./', './framework', './cases/my-lai-massacre', './process']) {
  test(`content ground does not invert mid-scroll on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoSettled(page, route);
    const bands = await page.evaluate(groundSequenceProbe);
    // Dark is reserved for the chapter opening, so a route may open dark and settle
    // light. It may never go back to dark inside the reading material.
    const darkAfterLight = bands.findIndex((band, index) => band.dark && bands.slice(0, index).some((earlier) => !earlier.dark));
    expect(darkAfterLight, `ground sequence: ${bands.map((band) => `${band.dark ? 'dark' : 'light'} ${band.label}`).join(' -> ')}`).toBe(-1);
  });
}

test('the corpus glyphs render in Newsreader rather than a fallback face', async ({ page }) => {
  await gotoSettled(page, './cases/my-lai-massacre');
  const widths = await page.evaluate(async () => {
    await document.fonts.ready;
    const measure = (text: string, family: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return 0;
      context.font = `400 64px ${family}`;
      return context.measureText(text).width;
    };
    // If the subset were missing these, the browser would substitute a fallback and
    // the measured advance would match the fallback stack instead of Newsreader.
    return {
      newsreaderGlyphs: measure('ảỹơćčšž', 'Newsreader, monospace'),
      fallbackGlyphs: measure('ảỹơćčšž', 'monospace'),
      newsreaderLatin: measure('Quang Ngai', 'Newsreader, monospace'),
      fallbackLatin: measure('Quang Ngai', 'monospace'),
    };
  });
  expect(widths.newsreaderLatin).not.toBeCloseTo(widths.fallbackLatin, 0);
  expect(widths.newsreaderGlyphs).not.toBeCloseTo(widths.fallbackGlyphs, 0);
});

test('the desktop contents row keeps the structure mobile shows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoSettled(page, './framework');
  const numerals = page.locator('.publication-contents .contents-numeral');
  await expect(numerals.first()).toBeVisible();
  await expect(numerals).toHaveCount(8);
  await expect(page.locator('.publication-contents a[href$="/framework"]')).toContainText('Framework');
  await expect(page.locator('.publication-contents a[href$="/framework"] .contents-numeral')).toHaveText('I');
});

test('browser surfaces are themed rather than left at the user-agent default', async ({ page }) => {
  await gotoSettled(page, './');
  const surfaces = await page.evaluate(() => ({
    caret: getComputedStyle(document.documentElement).caretColor,
    headerScrollbar: getComputedStyle(document.querySelector('.publication-header')!).scrollbarColor,
    tabular: getComputedStyle(document.querySelector('.case-index__date')!).fontVariantNumeric,
  }));
  expect(surfaces.caret).not.toBe('auto');
  expect(surfaces.headerScrollbar).not.toBe('auto');
  expect(surfaces.tabular).toContain('tabular-nums');
});
