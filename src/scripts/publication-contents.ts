/**
 * The publication Contents panel (#30), split out of the masthead in #51.
 *
 * It used to ship inline on every route. The screen hierarchy multiplied the
 * routes, so the behaviour now lives in one cached module and only the
 * close-before-paint line stays inline in the header.
 */
const contents = document.getElementById('publication-contents');
if (contents instanceof HTMLDetailsElement) {
  const summary = contents.querySelector('summary');
  const mobile = window.matchMedia('(max-width: 75.99rem)');

  /*
   * The panel is opaque and covers most of a phone viewport, so it must not
   * survive the reader moving the page underneath it. Dismissal on scroll is done
   * with an IntersectionObserver over a viewport-sized sentinel rather than a
   * scroll listener: the sentinel is fully visible at the moment the panel opens,
   * so any scroll in either direction drops its ratio below 1 and closes the panel
   * — with no per-frame handler and no layout reads.
   */
  let sentinel: HTMLElement | null = null;
  let observer: IntersectionObserver | null = null;
  let outsideHandler: ((event: PointerEvent) => void) | null = null;

  const release = () => {
    observer?.disconnect();
    observer = null;
    sentinel?.remove();
    sentinel = null;
    if (outsideHandler) document.removeEventListener('pointerdown', outsideHandler, true);
    outsideHandler = null;
  };

  const close = () => {
    if (!contents.open || !mobile.matches) return;
    contents.open = false;
    release();
  };

  const sync = () => {
    if (mobile.matches) {
      contents.removeAttribute('open');
    } else {
      // On the desktop contents row the panel is the navigation itself: it is
      // always open, and the dismissal watchers do not apply to it.
      release();
      contents.setAttribute('open', '');
    }
  };

  const watch = () => {
    release();
    sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;left:0;width:1px;pointer-events:none;visibility:hidden;';
    sentinel.style.top = `${window.scrollY + 1}px`;
    sentinel.style.height = `${Math.max(window.innerHeight - 2, 1)}px`;
    document.body.append(sentinel);
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.intersectionRatio < 1)) close();
    }, { threshold: 1 });
    observer.observe(sentinel);

    outsideHandler = (event: PointerEvent) => {
      if (!contents.contains(event.target as Node)) close();
    };
    document.addEventListener('pointerdown', outsideHandler, true);
  };

  sync();
  mobile.addEventListener('change', sync);

  contents.addEventListener('toggle', () => {
    if (!mobile.matches) return;
    if (contents.open) watch();
    else release();
  });

  contents.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobile.matches || !contents.open) return;
    close();
    summary?.focus();
  });

  contents.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    if (mobile.matches) close();
  }));
}
