import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.ARES_TEST_URL || 'http://127.0.0.1:8000/index-with-content.html';
const evidenceDir = process.env.ARES_EVIDENCE_DIR || 'artifacts/issue10';
await fs.mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function assertNoHorizontalOverflow(page, label) {
    const metrics = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
        metrics.scrollWidth <= metrics.width + 1,
        `${label}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.width}px`,
    );
}

async function verifyProcessAtViewport(viewport, label) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${baseUrl}#part-iv`, { waitUntil: 'networkidle' });

    const part = page.locator('#part-iv');
    await part.scrollIntoViewIfNeeded();
    await assertNoHorizontalOverflow(page, label);

    const text = await part.innerText();
    assert.match(text, /Ares synthesis/i, `${label}: Ares authorship label missing`);
    assert.match(text, /Not a ladder/i, `${label}: non-determinism warning missing`);
    assert.match(text, /How the domains can interact/i, `${label}: relationships missing`);
    assert.match(text, /Limits of the synthesis/i, `${label}: limits missing`);
    assert.doesNotMatch(text, /Political Grievance Framing|Mass Atrocity Execution|Extermination/, `${label}: legacy taxonomy visible`);

    const domains = part.locator('details[data-process-domain]');
    assert.equal(await domains.count(), 4, `${label}: expected four process domains`);

    const first = domains.first();
    const summary = first.locator('summary');
    const before = await first.evaluate((node) => node.open);
    await summary.focus();
    await summary.press('Enter');
    const after = await first.evaluate((node) => node.open);
    assert.notEqual(after, before, `${label}: native process disclosure did not toggle from keyboard`);

    const summaryBox = await summary.boundingBox();
    assert.ok(summaryBox && summaryBox.height >= 44, `${label}: process summary touch target is below 44px`);

    await part.screenshot({ path: `${evidenceDir}/process-${label}.png` });
    await context.close();
}

async function verifyGlossaryDialog() {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const cue = page.locator('.glossary-cue').first();
    await cue.scrollIntoViewIfNeeded();
    const cueHref = await cue.getAttribute('href');
    assert.ok(cueHref?.startsWith('#glossary-'), 'glossary cue must retain a durable fragment href');

    const beforeY = await page.evaluate(() => window.scrollY);
    await cue.click();
    const dialog = page.locator('#glossary-dialog');
    assert.equal(await dialog.evaluate((node) => node.open), true, 'glossary dialog should open');
    assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        'glossary-dialog-close',
        'focus should enter the dialog on the close button',
    );
    const afterY = await page.evaluate(() => window.scrollY);
    assert.ok(Math.abs(afterY - beforeY) <= 2, 'opening glossary dialog should preserve reading position');

    const title = (await page.locator('#glossary-dialog-title').innerText()).trim();
    const shortDefinition = (await page.locator('#glossary-dialog-short').innerText()).trim();
    assert.ok(title.length > 0, 'dialog term title is empty');
    assert.ok(shortDefinition.length > 0, 'dialog short definition is empty');

    await dialog.screenshot({ path: `${evidenceDir}/glossary-phone-open.png` });
    await page.keyboard.press('Escape');
    assert.equal(await dialog.evaluate((node) => node.open), false, 'Escape should dismiss glossary dialog');
    assert.equal(
        await cue.evaluate((node) => document.activeElement === node),
        true,
        'closing glossary dialog should restore focus to the originating cue',
    );

    await cue.click();
    const fullLink = page.locator('#glossary-dialog-full-link');
    const targetHref = await fullLink.getAttribute('href');
    await fullLink.click();
    await page.waitForFunction((hash) => window.location.hash === hash, targetHref);
    assert.equal(page.url().endsWith(targetHref), true, 'full glossary link should navigate to durable target');
    const target = page.locator(targetHref);
    assert.equal(await target.count(), 1, 'durable glossary target should exist');

    await assertNoHorizontalOverflow(page, 'glossary-phone');
    await context.close();
}

async function verifyNoJavaScriptFallback() {
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}#part-iv`, { waitUntil: 'load' });

    const part = page.locator('#part-iv');
    assert.equal(await part.locator('details[data-process-domain]').count(), 4, 'no-JS process domains missing');
    const staticText = await part.textContent();
    assert.match(staticText || '', /Structural conditions and grievance/);
    assert.match(staticText || '', /Perpetrator transition and violence dynamics/);
    assert.match(staticText || '', /Source map/);

    const cue = page.locator('.glossary-cue').first();
    const href = await cue.getAttribute('href');
    assert.ok(href?.startsWith('#glossary-'), 'no-JS glossary cue is not a durable anchor');
    await cue.click();
    assert.equal(page.url().endsWith(href), true, 'no-JS glossary cue should navigate to appendix definition');
    assert.equal(await page.locator(href).count(), 1, 'no-JS glossary target should exist');

    await context.close();
}

try {
    await verifyProcessAtViewport({ width: 375, height: 812 }, 'phone-375');
    await verifyProcessAtViewport({ width: 1366, height: 768 }, 'laptop-1366');
    await verifyProcessAtViewport({ width: 1440, height: 900 }, 'desktop-1440');
    await verifyGlossaryDialog();
    await verifyNoJavaScriptFallback();
    console.log('Issue #10 Playwright checks passed.');
} finally {
    await browser.close();
}
