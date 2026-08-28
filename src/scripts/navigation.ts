const nav = document.querySelector<HTMLDetailsElement>('#publication-contents');
const navSummary = nav?.querySelector<HTMLElement>('summary');
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-target]'));
const progress = document.querySelector<HTMLProgressElement>('#reading-progress');
const locationLabel = document.querySelector<HTMLElement>('#reader-location');
const desktop = window.matchMedia('(min-width: 73.75rem)');

function syncNavigationMode(): void {
  if (!nav) return;
  nav.open = desktop.matches;
}

function setCurrentNavigation(current: HTMLAnchorElement | undefined): void {
  for (const link of navLinks) {
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (locationLabel && current) locationLabel.textContent = current.textContent?.trim() || 'Ares';
}

function navigationLinkFor(id: string): HTMLAnchorElement | undefined {
  return navLinks.find((link) => link.dataset.navTarget === id);
}

function targetForHash(hash: string): HTMLElement | null {
  if (!hash.startsWith('#')) return null;
  const id = decodeURIComponent(hash.slice(1));
  return document.getElementById(id);
}

function alignHashTarget(hash = window.location.hash): void {
  const target = targetForHash(hash);
  if (!target) return;

  const id = decodeURIComponent(hash.slice(1));
  const current = navigationLinkFor(id);
  if (current) setCurrentNavigation(current);

  target.setAttribute('tabindex', '-1');
  target.scrollIntoView({ block: 'start' });
  target.focus({ preventScroll: true });

  if (current) setCurrentNavigation(current);
}

function syncHashTarget(): void {
  if (!window.location.hash) return;
  window.requestAnimationFrame(() => alignHashTarget());
}

function updateReadingState(): void {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.max(0, Math.min(100, (window.scrollY / scrollable) * 100)) : 0;
  if (progress) {
    progress.value = percent;
    progress.textContent = `${Math.round(percent)}%`;
  }

  const marker = window.scrollY + 104;
  let current = navLinks[0];
  for (const link of navLinks) {
    const id = link.dataset.navTarget;
    if (!id) continue;
    const target = document.getElementById(id);
    const targetTop = target ? target.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
    if (targetTop <= marker) current = link;
  }

  setCurrentNavigation(current);
}

nav?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.open && !desktop.matches) {
    nav.open = false;
    navSummary?.focus({ preventScroll: true });
  }
});

nav?.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute('href');
  if (!hash || !targetForHash(hash)) return;

  event.preventDefault();
  if (!desktop.matches) nav.open = false;
  if (window.location.hash !== hash) window.history.pushState(null, '', hash);

  // Closing mobile contents changes document geometry. Explicit fragment navigation
  // forces layout after that change instead of relying on browser-specific anchor timing.
  alignHashTarget(hash);
});

desktop.addEventListener('change', syncNavigationMode);
window.addEventListener('hashchange', syncHashTarget);
window.addEventListener('popstate', syncHashTarget);
window.addEventListener('scroll', () => window.requestAnimationFrame(updateReadingState), { passive: true });

syncNavigationMode();
if (window.location.hash) syncHashTarget();
else updateReadingState();
