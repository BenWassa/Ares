import { expect, test, type Page } from '@playwright/test';

/**
 * Lane 3 gate (#32): craft in the chrome, stillness in the material.
 *
 * Two things are checked here that nothing else checks — that the Contents panel
 * cannot be left covering the page while the reader scrolls underneath it, and
 * that no motion has crept onto atrocity content.
 */

const phone = { width: 390, height: 844 };

async function openContents(page: Page) {
  const contents = page.locator('#publication-contents');
  await contents.locator('summary').click();
  await expect(contents).toHaveAttribute('open', '');
  return contents;
}

test('the contents panel dismisses on scroll', async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto('./framework');
  const contents = await openContents(page);
  await page.mouse.wheel(0, 240);
  await expect(contents).not.toHaveAttribute('open', '');
});

test('the contents panel dismisses on an interaction outside it', async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto('./framework');
  const contents = await openContents(page);
  await page.locator('main h1').click({ position: { x: 4, y: 4 } });
  await expect(contents).not.toHaveAttribute('open', '');
});

test('the contents panel dismisses on Escape and returns focus to its control', async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto('./framework');
  const contents = page.locator('#publication-contents');
  const summary = contents.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(contents).toHaveAttribute('open', '');
  await summary.press('Escape');
  await expect(contents).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
});

test('every control carries a distinct rest, hover, active and disabled state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  // State values, not motion: reduced motion collapses the 140ms transition so a
  // sample taken straight after hovering reads the settled value rather than a
  // frame part-way through it.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  test.slow();
  const controls: { route: string; selector: string }[] = [
    { route: './', selector: '.reader-mark' },
    { route: './', selector: '.goal-paths a' },
    { route: './full-publication', selector: '.chapter-directory a' },
    { route: './cases', selector: '.case-index a' },
    { route: './', selector: '.site-footer nav a' },
    { route: './framework', selector: '.screen-nav a' },
    { route: './process', selector: '.page-sequence a' },
    { route: './framework', selector: '.glossary-cue' },
    { route: './process', selector: '[data-process-domain] summary' },
    { route: './cases/my-lai-massacre', selector: '.case-index-link' },
    { route: './cases/my-lai-massacre', selector: '.unit-children a' },
    { route: './cases/my-lai-massacre/finding', selector: '.screen-nav a' },
  ];

  const signature = async (selector: string) => {
    // Computed style during a transition reports the animated value, so let two
    // frames pass (motion is collapsed above) before sampling the settled state.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const element = document.querySelector(selector);
    if (!element) return null;
    const style = getComputedStyle(element);
    return [style.color, style.backgroundColor, style.textDecorationColor, style.textDecorationThickness, style.transform, style.boxShadow, style.outlineColor, style.outlineStyle].join('|');
  };

  for (const { route, selector } of controls) {
    await page.goto(route);
    const target = page.locator(selector).first();
    await target.scrollIntoViewIfNeeded();

    const rest = await page.evaluate(signature, selector);
    await target.hover();
    const hover = await page.evaluate(signature, selector);
    expect(hover, `${selector} has no hover state`).not.toBe(rest);

    // Press and hold to sample :active without navigating.
    const box = await target.boundingBox();
    expect(box, `${selector} is not laid out`).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    const active = await page.evaluate(signature, selector);
    // Release away from the control so the press does not become a navigation.
    await page.mouse.move(1, box!.y + box!.height + 200);
    await page.mouse.up();
    expect(active, `${selector} has no active state`).not.toBe(hover);
  }

  // The fifth state. Nothing in the publication ships disabled today, so the
  // treatment is verified against an injected control rather than left undefined.
  const disabled = await page.evaluate(() => {
    const button = document.createElement('button');
    button.disabled = true;
    button.textContent = 'disabled';
    document.body.append(button);
    const style = getComputedStyle(button);
    const result = { cursor: style.cursor, opacity: Number.parseFloat(style.opacity) };
    button.remove();
    return result;
  });
  expect(disabled.cursor).toBe('not-allowed');
  expect(disabled.opacity).toBeLessThan(1);
});

test('nothing in the case material carries motion', async ({ page }) => {
  await page.goto('./cases/my-lai-massacre/scholarly-depth');
  const moving = await page.evaluate(() => {
    const sensitive = [
      '.case-section .prose p',
      '.case-section .prose blockquote',
      '.chronology p',
      '.chronology-date',
      '.case-meta dd',
      '.evidence-provenance p',
      '.case-argument',
    ];
    const offenders: string[] = [];
    for (const selector of sensitive) {
      for (const element of document.querySelectorAll(selector)) {
        const style = getComputedStyle(element);
        const durations = [style.transitionDuration, style.animationDuration]
          .flatMap((value) => value.split(',').map((raw) => raw.trim()))
          .map((raw) => (raw.endsWith('ms') ? Number.parseFloat(raw) : Number.parseFloat(raw) * 1000));
        if (durations.some((ms) => ms > 0.02) || style.animationName !== 'none') offenders.push(`${selector}: ${style.transitionDuration} / ${style.animationName}`);
      }
    }
    return offenders;
  });
  expect(moving, moving.join('\n')).toEqual([]);
});

test('state transitions stay inside the duration ceiling and ease out', async ({ page }) => {
  await page.goto('./');
  const motion = await page.evaluate(() => {
    const results: { selector: string; durations: number[]; timing: string; properties: string[] }[] = [];
    for (const selector of ['.reader-mark', '.goal-paths a', '.site-footer nav a']) {
      const element = document.querySelector(selector);
      if (!element) continue;
      const style = getComputedStyle(element);
      results.push({
        selector,
        durations: style.transitionDuration.split(',').map((raw) => {
          const value = raw.trim();
          return value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
        }),
        timing: style.transitionTimingFunction,
        properties: style.transitionProperty.split(',').map((value) => value.trim()),
      });
    }
    return results;
  });
  expect(motion.length).toBeGreaterThan(2);
  for (const entry of motion) {
    expect(entry.durations.every((ms) => ms <= 200), `${entry.selector} exceeds the 200ms state ceiling`).toBe(true);
    expect(entry.timing, `${entry.selector} uses linear easing`).not.toContain('linear');
    expect(entry.properties, `${entry.selector} transitions transform`).not.toContain('transform');
    expect(entry.properties, `${entry.selector} transitions everything`).not.toContain('all');
  }
});

test('reduced motion leaves a complete static page with no transitions at all', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['./', './cases/my-lai-massacre', './cases/my-lai-massacre/narrative', './process']) {
    await page.goto(route);
    const worst = await page.evaluate(() => {
      let maximum = 0;
      for (const element of document.querySelectorAll('*')) {
        const style = getComputedStyle(element);
        for (const value of [style.transitionDuration, style.animationDuration]) {
          for (const raw of value.split(',')) {
            const trimmed = raw.trim();
            const ms = trimmed.endsWith('ms') ? Number.parseFloat(trimmed) : Number.parseFloat(trimmed) * 1000;
            if (Number.isFinite(ms)) maximum = Math.max(maximum, ms);
          }
        }
      }
      return maximum;
    });
    expect(worst, `${route} keeps motion under prefers-reduced-motion`).toBeLessThanOrEqual(0.02);
    await expect(page.locator('main h1')).toBeVisible();
  }
});

test('keyboard traversal keeps a visible focus ring on every route', async ({ page }) => {
  for (const route of ['./', './framework', './cases/my-lai-massacre', './cases/my-lai-massacre/key-evidence', './comparison', './comparison/tempo', './process', './glossary', './references']) {
    await page.goto(route);
    for (let step = 0; step < 14; step += 1) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return null;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          outline: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth),
          sized: rect.width > 0 && rect.height > 0,
        };
      });
      if (!focused || !focused.sized) continue;
      expect(focused.outline, `${route}: focus ring removed on ${focused.tag}`).not.toBe('none');
      expect(focused.width, `${route}: focus ring invisible on ${focused.tag}`).toBeGreaterThanOrEqual(2);
    }
  }
});
