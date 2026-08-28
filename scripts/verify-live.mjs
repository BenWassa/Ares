import { createHash } from 'node:crypto';

const pageUrl = process.env.PAGE_URL;
const expectedSha = process.env.EXPECTED_INDEX_SHA;
if (!pageUrl || !expectedSha) throw new Error('PAGE_URL and EXPECTED_INDEX_SHA are required.');

const requiredMarkers = [
  'id="part-iv"',
  'id="glossary"',
  'id="references"',
  'id="rwandan-genocide"',
];
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

let lastFailure = 'live page was not checked';
for (let attempt = 1; attempt <= 8; attempt += 1) {
  try {
    const requestUrl = new URL(pageUrl);
    requestUrl.searchParams.set('_ares_verify', `${Date.now()}-${attempt}`);
    const response = await fetch(requestUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
    if (!response.ok) throw new Error(`root returned HTTP ${response.status}`);

    const bytes = Buffer.from(await response.arrayBuffer());
    const liveSha = hash(bytes);
    if (liveSha !== expectedSha) {
      lastFailure = `live SHA ${liveSha} does not yet match tested SHA ${expectedSha}`;
      if (attempt < 8) { await sleep(5000); continue; }
      throw new Error(lastFailure);
    }

    const html = bytes.toString('utf8');
    for (const marker of requiredMarkers) {
      if (!html.includes(marker)) throw new Error(`live HTML is missing required marker ${marker}`);
    }

    const rootOrigin = new URL(pageUrl).origin;
    const assets = extractAssetUrls(html, pageUrl).filter((url) => new URL(url).origin === rootOrigin);
    for (const asset of assets) {
      const response = await fetch(asset, { cache: 'no-store' });
      if (!response.ok) throw new Error(`live asset failed: ${asset} -> HTTP ${response.status}`);
    }

    console.log(`Live Pages verification OK: ${pageUrl}`);
    console.log(`Exact tested/live index SHA-256: ${liveSha}`);
    console.log(`Required durable markers: ${requiredMarkers.length}; same-origin assets checked: ${assets.length}.`);
    process.exit(0);
  } catch (error) {
    lastFailure = error instanceof Error ? error.message : String(error);
    if (attempt < 8) await sleep(5000);
  }
}

throw new Error(`Live Pages verification failed after deployment propagation retries: ${lastFailure}`);
