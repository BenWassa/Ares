import { createHash } from 'node:crypto';

const pageUrl = process.env.PAGE_URL;
const expectedSha = process.env.EXPECTED_INDEX_SHA;
if (!pageUrl || !expectedSha) throw new Error('PAGE_URL and EXPECTED_INDEX_SHA are required.');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

function extractAssetUrls(html, baseUrl) {
  const urls = new Set();
  const srcPattern = /<(?:script|img|source)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(srcPattern)) urls.add(new URL(match[1], baseUrl).href);
  const linkPattern = /<link\b([^>]*)>/gi;
  for (const match of html.matchAll(linkPattern)) {
    const attributes = match[1] ?? '';
    const rel = attributes.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase() ?? '';
    if (!/(?:stylesheet|icon|preload|modulepreload)/.test(rel)) continue;
    const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) urls.add(new URL(href, baseUrl).href);
  }
  return [...urls];
}

async function fetchPage(relative = '') {
  const root = pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`;
  const candidates = [new URL(relative, root), new URL(relative ? `${relative}.html` : '', root)];
  let last;
  for (const url of candidates) {
    url.searchParams.set('_ares_verify', `${Date.now()}`);
    const response = await fetch(url, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
    if (response.ok) return { response, url };
    last = `HTTP ${response.status} at ${url}`;
  }
  throw new Error(last ?? `Unable to fetch ${relative}`);
}

const routeChecks = [
  ['', ['chapter-directory', 'legacy-bridge']],
  ['framework', ['id="part-i"', 'id="scope-purpose"']],
  ['cases', ['id="part-ii"', 'class="case-index"']],
  ['cases/armenian-genocide', ['id="armenian-genocide"', 'chronology--spine', 'figure-02-armenian-genocide']],
  ['comparison', ['id="part-iii"', 'comparison-table', 'id="figure-03"']],
  ['process', ['id="part-iv"', 'data-process-domain=', 'id="figure-01"']],
  ['implications', ['id="part-v"']],
  ['reflection', ['id="part-vi"']],
  ['glossary', ['id="glossary"']],
  ['references', ['id="references"', 'ref-src-dutton-2005', 'id="figure-04"']],
];

let lastFailure = 'live publication was not checked';
for (let attempt = 1; attempt <= 8; attempt += 1) {
  try {
    const rootResult = await fetchPage('');
    const bytes = Buffer.from(await rootResult.response.arrayBuffer());
    const liveSha = hash(bytes);
    if (liveSha !== expectedSha) {
      lastFailure = `live SHA ${liveSha} does not yet match tested SHA ${expectedSha}`;
      if (attempt < 8) { await sleep(5000); continue; }
      throw new Error(lastFailure);
    }

    const rootHtml = bytes.toString('utf8');
    for (const [relative, markers] of routeChecks) {
      const html = relative === '' ? rootHtml : await (await fetchPage(relative)).response.text();
      for (const marker of markers) if (!html.includes(marker)) throw new Error(`${relative || 'root'} is missing required marker ${marker}`);
    }

    const rootOrigin = new URL(pageUrl).origin;
    const assets = extractAssetUrls(rootHtml, pageUrl).filter((url) => new URL(url).origin === rootOrigin);
    // Fonts are referenced from the stylesheet rather than the document, so a
    // wrong base path would leave every route rendering in a fallback face and
    // still pass a document-only asset check.
    const nested = [];
    for (const asset of assets) {
      const response = await fetch(asset, { cache: 'no-store' });
      if (!response.ok) throw new Error(`live asset failed: ${asset} -> HTTP ${response.status}`);
      if (!asset.endsWith('.css')) continue;
      const css = await response.text();
      for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
        const href = match[1];
        if (!href || href.startsWith('data:')) continue;
        const resolved = new URL(href, asset);
        if (resolved.origin === rootOrigin) nested.push(resolved.href);
      }
    }
    const fonts = [...new Set(nested)];
    for (const font of fonts) {
      const response = await fetch(font, { cache: 'no-store' });
      if (!response.ok) throw new Error(`live stylesheet asset failed: ${font} -> HTTP ${response.status}`);
    }
    if (fonts.filter((url) => url.endsWith('.woff2')).length < 9) {
      throw new Error(`live stylesheet references ${fonts.length} same-origin assets; the nine self-hosted font subsets must all resolve.`);
    }

    console.log(`Live Pages verification OK: ${pageUrl}`);
    console.log(`Exact tested/live index SHA-256: ${liveSha}`);
    console.log(`Publication routes checked: ${routeChecks.length}; document assets checked: ${assets.length}; stylesheet assets checked: ${fonts.length}.`);
    process.exit(0);
  } catch (error) {
    lastFailure = error instanceof Error ? error.message : String(error);
    if (attempt < 8) await sleep(5000);
  }
}
throw new Error(`Live Pages verification failed after deployment propagation retries: ${lastFailure}`);
