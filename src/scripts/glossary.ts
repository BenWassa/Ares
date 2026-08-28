interface GlossaryEntry {
  term: string;
  definition: string;
  extendedDefinition: string;
  sourceNote?: string;
  relatedTerms: string[];
}

declare global {
  interface Window { ARES_GLOSSARY?: Record<string, GlossaryEntry> }
}

const glossary = window.ARES_GLOSSARY ?? {};
const dialog = document.querySelector<HTMLDialogElement>('#glossary-dialog');
const closeButton = document.querySelector<HTMLButtonElement>('#glossary-dialog-close');
const title = document.querySelector<HTMLElement>('#glossary-dialog-title');
const shortDefinition = document.querySelector<HTMLElement>('#glossary-dialog-short');
const extendedDefinition = document.querySelector<HTMLElement>('#glossary-dialog-extended');
const sourceNote = document.querySelector<HTMLElement>('#glossary-dialog-source');
const related = document.querySelector<HTMLElement>('#glossary-dialog-related');
const fullLink = document.querySelector<HTMLAnchorElement>('#glossary-dialog-full-link');
let returnTarget: HTMLElement | null = null;

function setText(element: HTMLElement | null, value: string | undefined, prefix = ''): void {
  if (!element) return;
  element.textContent = value ? `${prefix}${value}` : '';
  element.hidden = !value;
}

function openDefinition(trigger: HTMLAnchorElement): boolean {
  if (!dialog?.showModal) return false;
  const key = trigger.dataset.term;
  if (!key) return false;
  const entry = glossary[key];
  if (!entry) return false;
  returnTarget = trigger;
  setText(title, entry.term);
  setText(shortDefinition, entry.definition);
  setText(extendedDefinition, entry.extendedDefinition);
  setText(sourceNote, entry.sourceNote, 'Source context: ');
  setText(related, entry.relatedTerms.length ? entry.relatedTerms.join(', ') : undefined, 'Related: ');
  fullLink?.setAttribute('href', `#glossary-${key}`);
  dialog.showModal();
  closeButton?.focus({ preventScroll: true });
  return true;
}

document.querySelectorAll<HTMLAnchorElement>('.glossary-cue').forEach((cue) => {
  cue.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (openDefinition(cue)) event.preventDefault();
  });
});

dialog?.addEventListener('close', () => {
  returnTarget?.focus({ preventScroll: true });
  returnTarget = null;
});

dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

export {};
