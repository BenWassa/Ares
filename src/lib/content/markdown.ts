import { marked } from 'marked';
import type { Glossary } from './schemas';

marked.setOptions({ gfm: true, breaks: false, async: false });

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function addGlossaryCues(markdown: string, glossary: Glossary, hrefPrefix = '#glossary-'): string {
  const linked = new Set<string>();
  const entries = Object.entries(glossary).sort(([, a], [, b]) => b.term.length - a.term.length);

  return markdown
    .split('\n')
    .map((line) => {
      const trimmed = line.trimStart();
      if (!trimmed || /^(#{1,6}|>|[-*+]\s|\d+\.\s|```|<)/.test(trimmed) || line.includes('](')) return line;

      let next = line;
      for (const [key, entry] of entries) {
        if (linked.has(key)) continue;
        const pattern = new RegExp(`\\b${escapeRegExp(entry.term)}\\b`, 'i');
        if (!pattern.test(next)) continue;
        next = next.replace(pattern, (match) => `<a class="glossary-cue" href="${hrefPrefix}${key}" data-term="${key}">${match}</a>`);
        linked.add(key);
      }
      return next;
    })
    .join('\n');
}

/**
 * Authored tables carry more columns than a 320px column can hold, so each one
 * gets a keyboard-reachable scroll container rather than pushing the page into
 * horizontal overflow. The table keeps its own semantics.
 */
function wrapTables(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (table) =>
    `<div class="prose-table" tabindex="0" role="region" aria-label="Table; scroll horizontally if needed">${table}</div>`);
}

export function renderMarkdown(markdown: string, glossary?: Glossary, glossaryHrefPrefix = '#glossary-'): string {
  const source = glossary ? addGlossaryCues(markdown, glossary, glossaryHrefPrefix) : markdown;
  const rendered = marked.parse(source);
  if (typeof rendered !== 'string') throw new Error('Markdown rendering unexpectedly became asynchronous.');
  return wrapTables(rendered);
}
