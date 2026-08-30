/**
 * Per-glyph font coverage gate (#30).
 *
 * The corpus contains `ả ỹ ơ` (Quảng Ngãi, Sơn Mỹ) and `ć č š ž` (Srebrenica
 * material). Google's `latin` subset covers neither, so without the latin-ext and
 * vietnamese blocks those characters render in a fallback face mid-word — a defect
 * that ships silently and is invisible in a screenshot.
 *
 * This reads the cmap out of every self-hosted woff2 in the built site and asserts
 * that every character the built HTML actually renders is covered by both families.
 * It deliberately does not use `document.fonts.check()`, which answers for the
 * family regardless of glyph coverage and would pass a font that has none of these.
 */
import { readdir, readFile } from 'node:fs/promises';
import { brotliDecompressSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca',
  'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea',
  'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL',
  'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar',
  'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
];

function readBase128(buffer, cursor) {
  let value = 0;
  for (let index = 0; index < 5; index += 1) {
    const byte = buffer[cursor.offset];
    cursor.offset += 1;
    value = (value << 7) | (byte & 0x7f);
    if ((byte & 0x80) === 0) return value >>> 0;
  }
  throw new Error('Malformed UIntBase128 in woff2 table directory.');
}

/** Returns the decompressed `cmap` table of a woff2 file. */
function extractCmapTable(buffer) {
  if (buffer.toString('latin1', 0, 4) !== 'wOF2') throw new Error('Not a woff2 file.');
  const numTables = buffer.readUInt16BE(12);
  const cursor = { offset: 48 };
  const tables = [];
  for (let index = 0; index < numTables; index += 1) {
    const flags = buffer[cursor.offset];
    cursor.offset += 1;
    const tagIndex = flags & 0x3f;
    let tag;
    if (tagIndex === 0x3f) {
      tag = buffer.toString('latin1', cursor.offset, cursor.offset + 4);
      cursor.offset += 4;
    } else {
      tag = KNOWN_TAGS[tagIndex] ?? `#${tagIndex}`;
    }
    const transformVersion = (flags >> 6) & 0x03;
    const originalLength = readBase128(buffer, cursor);
    // glyf/loca are transformed when the version is 0; every other table is
    // transformed when the version is non-zero. Only then is a length present.
    const transformed = tag === 'glyf' || tag === 'loca' ? transformVersion === 0 : transformVersion !== 0;
    const transformLength = transformed ? readBase128(buffer, cursor) : originalLength;
    tables.push({ tag, length: transformLength });
  }
  const font = brotliDecompressSync(buffer.subarray(cursor.offset));
  let offset = 0;
  for (const table of tables) {
    if (table.tag === 'cmap') return font.subarray(offset, offset + table.length);
    offset += table.length;
  }
  throw new Error('woff2 file carries no cmap table.');
}

/** Returns the set of Unicode codepoints a cmap table maps to a glyph. */
function codepointsFromCmap(cmap) {
  const covered = new Set();
  const numTables = cmap.readUInt16BE(2);
  for (let index = 0; index < numTables; index += 1) {
    const record = 4 + index * 8;
    const platformId = cmap.readUInt16BE(record);
    const encodingId = cmap.readUInt16BE(record + 2);
    const subtable = cmap.readUInt32BE(record + 4);
    const unicode = platformId === 0 || (platformId === 3 && (encodingId === 1 || encodingId === 10));
    if (!unicode) continue;
    const format = cmap.readUInt16BE(subtable);
    if (format === 4) {
      const segCountX2 = cmap.readUInt16BE(subtable + 6);
      const segCount = segCountX2 / 2;
      const ends = subtable + 14;
      const starts = ends + segCountX2 + 2;
      const deltas = starts + segCountX2;
      const rangeOffsets = deltas + segCountX2;
      for (let segment = 0; segment < segCount; segment += 1) {
        const end = cmap.readUInt16BE(ends + segment * 2);
        const start = cmap.readUInt16BE(starts + segment * 2);
        const delta = cmap.readInt16BE(deltas + segment * 2);
        const rangeOffset = cmap.readUInt16BE(rangeOffsets + segment * 2);
        if (start === 0xffff) continue;
        for (let code = start; code <= end && code !== 0x10000; code += 1) {
          let glyph;
          if (rangeOffset === 0) {
            glyph = (code + delta) & 0xffff;
          } else {
            const glyphAddress = rangeOffsets + segment * 2 + rangeOffset + (code - start) * 2;
            if (glyphAddress + 1 >= cmap.length) continue;
            glyph = cmap.readUInt16BE(glyphAddress);
            if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
          }
          if (glyph !== 0) covered.add(code);
        }
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(subtable + 12);
      for (let group = 0; group < groups; group += 1) {
        const base = subtable + 16 + group * 12;
        const start = cmap.readUInt32BE(base);
        const end = cmap.readUInt32BE(base + 4);
        for (let code = start; code <= end; code += 1) covered.add(code);
      }
    }
  }
  return covered;
}

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, name) => {
      if (name.startsWith('#x') || name.startsWith('#X')) return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
      if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
      return entities[name.toLowerCase()] ?? match;
    });
}

const entries = await readdir(dist, { recursive: true });
const rendered = new Set();
for (const entry of entries.filter((file) => file.endsWith('.html'))) {
  for (const character of visibleText(await readFile(join(dist, entry), 'utf8'))) {
    const code = character.codePointAt(0);
    if (code > 0x20 && code !== 0xa0) rendered.add(code);
  }
}

const fontFiles = entries.filter((entry) => entry.endsWith('.woff2'));
if (fontFiles.length === 0) throw new Error('No self-hosted woff2 files in the build; the type system is not shipping.');

const families = new Map();
for (const file of fontFiles) {
  const covered = codepointsFromCmap(extractCmapTable(await readFile(join(dist, file))));
  // newsreader-italic-latin.<hash>.woff2 -> newsreader-italic
  const family = file.split('/').pop().replace(/\.[^.]+\.woff2$/, '').replace(/-(latin-ext|latin|vietnamese)$/, '');
  const set = families.get(family) ?? new Set();
  for (const code of covered) set.add(code);
  families.set(family, set);
}

const required = ['newsreader', 'plexsans'];
for (const family of required) {
  if (!families.has(family)) throw new Error(`Built site is missing the ${family} subsets.`);
}

const failures = [];
for (const family of required) {
  const covered = families.get(family);
  const missing = [...rendered].filter((code) => !covered.has(code)).sort((a, b) => a - b);
  if (missing.length) {
    failures.push(`${family}: ${missing.map((code) => `U+${code.toString(16).toUpperCase().padStart(4, '0')} ${String.fromCodePoint(code)}`).join(', ')}`);
  }
}

// The named regression the review called out: these must come from Newsreader, not
// from whatever the reader's system substitutes.
const namedGlyphs = [...'ảỹơćčšžáãéíü'].map((character) => character.codePointAt(0));
for (const [family, covered] of families) {
  const missing = namedGlyphs.filter((code) => !covered.has(code));
  if (missing.length) failures.push(`${family} is missing named corpus glyphs: ${missing.map((code) => String.fromCodePoint(code)).join(' ')}`);
}

if (failures.length) {
  throw new Error(`Font coverage gap — published text would fall back mid-word:\n${failures.join('\n')}\nRegenerate the subsets with tools/build-fonts.sh after widening the unicode ranges.`);
}

console.log(`Font coverage OK: ${rendered.size} distinct rendered codepoints across ${entries.filter((file) => file.endsWith('.html')).length} documents, all present in the cmap of every self-hosted family (${[...families.keys()].join(', ')}).`);
