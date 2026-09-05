/**
 * Local-only reading position (#45), rewritten for the screen hierarchy (#51).
 *
 * v1 stored "the last section I scrolled past on a long page". v2 stores the
 * conceptual unit the reader was inside, because that is what has to be restored
 * after an interruption: a fragment on a page that has since been split is not a
 * place, and a scroll offset is not a task. The within-unit section is still
 * recorded, but only to describe the position, never to address it.
 */
const STORAGE_KEY = 'ares:reading-position:v2';
const LEGACY_KEY = 'ares:reading-position:v1';

interface ReadingState {
  /** Durable hierarchy unit ID. Absent only in state migrated from v1. */
  unitId?: string;
  /** Screen-level address. Never carries a fragment. */
  href: string;
  title: string;
  role?: string;
  sectionLabel?: string;
  savedAt: number;
}

function parseState(raw: string | null): ReadingState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ReadingState>;
    if (typeof parsed.href !== 'string' || typeof parsed.title !== 'string' || typeof parsed.savedAt !== 'number') return null;
    // A stored href must stay a same-origin path. Anything else is corrupt state
    // or someone else's, and resume must not turn it into a link.
    if (!parsed.href.startsWith('/') || parsed.href.startsWith('//')) return null;
    return {
      ...(typeof parsed.unitId === 'string' ? { unitId: parsed.unitId } : {}),
      href: parsed.href.split('#')[0] ?? parsed.href,
      title: parsed.title,
      ...(typeof parsed.role === 'string' ? { role: parsed.role } : {}),
      ...(typeof parsed.sectionLabel === 'string' ? { sectionLabel: parsed.sectionLabel } : {}),
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

function readState(): ReadingState | null {
  try {
    const current = parseState(localStorage.getItem(STORAGE_KEY));
    if (current) return current;
    // One explicit migration hop: v1 state names a route and a title but no unit,
    // so it is carried over as a screen-level position with its fragment dropped.
    const legacy = parseState(localStorage.getItem(LEGACY_KEY));
    localStorage.removeItem(LEGACY_KEY);
    if (!legacy) return null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    return legacy;
  } catch {
    return null;
  }
}

function writeState(marker: HTMLElement, section?: HTMLElement) {
  const title = marker.dataset.readingTitle;
  const href = marker.dataset.readingPath;
  if (!title || !href) return;
  const state: ReadingState = {
    ...(marker.dataset.readingUnit ? { unitId: marker.dataset.readingUnit } : {}),
    href: href.split('#')[0] ?? href,
    title,
    ...(marker.dataset.readingRole ? { role: marker.dataset.readingRole } : {}),
    ...(section?.dataset.readingLabel ? { sectionLabel: section.dataset.readingLabel } : {}),
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.removeItem(LEGACY_KEY);
  } catch { /* local storage is an optional enhancement */ }
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
  const clearState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_KEY);
    } catch { /* optional enhancement */ }
  };

  let known: string[] = [];
  try { known = JSON.parse(resume.dataset.resumeKnownRoutes ?? '[]') as string[]; } catch { known = []; }

  /**
   * #64 makes the Holodomor a resumable representative case without making every
   * case a screen-graph node. Home already carries one durable compatibility ID
   * per published case. A stored case route is therefore current only when its
   * slug still has that canonical ID on Home; retired/unknown case routes still
   * fail safe exactly like other stale state.
   */
  const isCurrentCaseRoute = (href: string) => {
    const match = href.match(/\/cases\/([^/]+)$/);
    const slug = match?.[1];
    if (!slug) return false;
    const anchor = document.getElementById(slug);
    return anchor?.closest('.legacy-anchor-aliases') !== null;
  };

  const state = readState();
  // A position that no longer names a published screen or a canonical current
  // case is stale rather than useful. Dropping it is safer than offering a link
  // into a route that a rollout has since moved.
  if (state && known.length && !known.includes(state.href) && !isCurrentCaseRoute(state.href)) {
    clearState();
  } else if (state && link) {
    link.href = state.href;
    link.textContent = `Continue: ${state.title}`;
    if (description) {
      const within = state.sectionLabel ? ` You were on ${state.sectionLabel}.` : '';
      description.textContent = `${state.title}.${within} Stored only in this browser.`;
    }
    resume.hidden = false;
  }

  clear?.addEventListener('click', () => {
    clearState();
    resume.hidden = true;
  });
}
