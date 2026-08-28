import { marked } from 'marked';
import type { Glossary } from './schemas';

marked.setOptions({ gfm: true, breaks: false, async: false });

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function addGlossaryCues(markdown: string, glossary: Glossary): string {
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
        next = next.replace(pattern, (match) => `<a class="glossary-cue" href="#glossary-${key}" data-term="${key}">${match}</a>`);
        linked.add(key);
      }
      return next;
    })
    .join('\n');
}

export function renderMarkdown(markdown: string, glossary?: Glossary): string {
  const source = glossary ? addGlossaryCues(markdown, glossary) : markdown;
  const rendered = marked.parse(source);
  if (typeof rendered !== 'string') throw new Error('Markdown rendering unexpectedly became asynchronous.');
  return rendered;
}
