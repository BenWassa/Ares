const STORAGE_KEY = 'ares:reading-position:v1';

interface ReadingState {
  href: string;
  title: string;
  sectionLabel?: string;
  savedAt: number;
}

function readState(): ReadingState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ReadingState>;
    if (typeof parsed.href !== 'string' || typeof parsed.title !== 'string' || typeof parsed.savedAt !== 'number') return null;
    return parsed as ReadingState;
  } catch {
    return null;
  }
}

function writeState(marker: HTMLElement, section?: HTMLElement) {
  const title = marker.dataset.readingTitle;
  if (!title) return;
  const sectionId = section?.id;
  const sectionLabel = section?.dataset.readingLabel;
  const state: ReadingState = {
    href: `${window.location.pathname}${sectionId ? `#${encodeURIComponent(sectionId)}` : ''}`,
    title,
    ...(sectionLabel ? { sectionLabel } : {}),
    savedAt: Date.now(),
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* local storage is optional enhancement */ }
}

const marker = document.querySelector<HTMLElement>('[data-reading-location]');
if (marker) {
  writeState(marker);
  const sections = [...document.querySelectorAll<HTMLElement>('[data-reading-section][id]')];
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target instanceof HTMLElement) writeState(marker, visible.target);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.6] });
    sections.forEach((section) => observer.observe(section));
  }
}

const resume = document.querySelector<HTMLElement>('[data-resume-home]');
if (resume) {
  const link = resume.querySelector<HTMLAnchorElement>('[data-resume-link]');
  const description = resume.querySelector<HTMLElement>('[data-resume-description]');
  const clear = resume.querySelector<HTMLButtonElement>('[data-resume-clear]');
  const state = readState();
  if (state && link) {
    link.href = state.href;
    link.textContent = `Continue: ${state.sectionLabel ?? state.title}`;
    if (description) description.textContent = `${state.title}${state.sectionLabel ? ` · ${state.sectionLabel}` : ''}. Stored only in this browser.`;
    resume.hidden = false;
  }
  clear?.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* optional enhancement */ }
    resume.hidden = true;
  });
}
