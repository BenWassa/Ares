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

function focusHashTarget(): void {
  if (!window.location.hash) return;
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function activationLineFor(target: HTMLElement): number {
  const scroller = getComputedStyle(document.documentElement);
  const targetStyle = getComputedStyle(target);
  return cssPixels(scroller.scrollPaddingTop) + cssPixels(targetStyle.scrollMarginTop) + 1;
}

function updateReadingState(): void {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.max(0, Math.min(100, (window.scrollY / scrollable) * 100)) : 0;
  if (progress) {
    progress.value = percent;
    progress.textContent = `${Math.round(percent)}%`;
  }

  let current = navLinks[0];
  for (const link of navLinks) {
    const id = link.dataset.navTarget;
    if (!id) continue;
    const target = document.getElementById(id);
    if (target && target.getBoundingClientRect().top <= activationLineFor(target)) current = link;
  }

  for (const link of navLinks) {
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (locationLabel && current) locationLabel.textContent = current.textContent?.trim() || 'Ares';
}

nav?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.open && !desktop.matches) {
    nav.open = false;
    navSummary?.focus({ preventScroll: true });
  }
});

nav?.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (link && !desktop.matches) nav.open = false;
});

desktop.addEventListener('change', syncNavigationMode);
window.addEventListener('hashchange', focusHashTarget);
window.addEventListener('scroll', () => window.requestAnimationFrame(updateReadingState), { passive: true });

syncNavigationMode();
updateReadingState();
