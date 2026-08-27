// Ares 2.0 — Issue #7 navigation and reading-orientation enhancement.
// Core publication content and anchors remain present without this file.

document.documentElement.classList.add('js');

(function ensureNavigationStyles() {
    const probe = getComputedStyle(document.documentElement)
        .getPropertyValue('--ares-navigation-v2').trim();
    if (probe) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'navigation.css';
    link.dataset.aresNavigation = 'dynamic';
    document.head.appendChild(link);
}());

function initAresNavigation() {
    let navToggle = document.getElementById('nav-toggle');
    const stickyNav = document.getElementById('sticky-nav');
    const backToTop = document.getElementById('back-to-top');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const mainHeader = document.querySelector('.main-header');
    const persistentNav = window.matchMedia('(min-width: 1180px)');

    if (!mainHeader || !stickyNav) return;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function upgradeNavigationMarkup() {
        stickyNav.setAttribute('aria-label', 'Publication contents');

        // The legacy builder emits a div. Replace it at runtime with a native
        // button; the no-JS stylesheet hides that legacy trigger entirely.
        if (navToggle && navToggle.tagName !== 'BUTTON') {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = navToggle.id;
            button.className = navToggle.className;
            button.setAttribute('aria-controls', stickyNav.id);
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', 'Open publication contents');
            button.textContent = 'Contents';
            navToggle.replaceWith(button);
            navToggle = button;
        } else if (navToggle) {
            navToggle.type = 'button';
            navToggle.setAttribute('aria-controls', stickyNav.id);
            navToggle.setAttribute('aria-expanded', 'false');
        }

        const row = document.createElement('div');
        row.className = 'nav-header-row';
        if (navToggle) row.appendChild(navToggle);

        const location = document.createElement('p');
        location.id = 'location-context';
        location.className = 'location-context';
        location.setAttribute('aria-live', 'polite');
        location.setAttribute('aria-atomic', 'true');
        location.innerHTML = '<span class="location-part">Front Matter</span>';
        row.appendChild(location);
        mainHeader.insertBefore(row, stickyNav);

        if (progressBar) {
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-label', 'Document reading progress');
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
            progressBar.setAttribute('aria-valuenow', '0');
        }

        if (backToTop) {
            backToTop.hidden = true;
            backToTop.setAttribute('aria-hidden', 'true');
            backToTop.tabIndex = -1;
        }
    }

    function setNavInert(value) {
        if ('inert' in stickyNav) stickyNav.inert = value;
        if (value) stickyNav.setAttribute('inert', '');
        else stickyNav.removeAttribute('inert');
    }

    function isNavOpen() {
        return !stickyNav.hidden && !persistentNav.matches;
    }

    function closeNav(options) {
        const opts = options || {};
        if (persistentNav.matches) return;
        stickyNav.hidden = true;
        setNavInert(true);
        document.body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open publication contents');
            navToggle.textContent = 'Contents';
            if (opts.restoreFocus) navToggle.focus({ preventScroll: true });
        }
    }

    function openNav() {
        if (persistentNav.matches) return;
        stickyNav.hidden = false;
        setNavInert(false);
        document.body.classList.add('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close publication contents');
            navToggle.textContent = 'Close';
        }
        const active = stickyNav.querySelector('a[aria-current="location"]');
        const first = stickyNav.querySelector('a[href^="#"]');
        (active || first)?.focus({ preventScroll: true });
    }

    function syncNavigationMode() {
        if (persistentNav.matches) {
            stickyNav.hidden = false;
            setNavInert(false);
            document.body.classList.remove('nav-open');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Publication contents');
                navToggle.textContent = 'Contents';
            }
        } else {
            closeNav({ restoreFocus: false });
        }
    }

    function focusAnchorTarget(link) {
        const href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        const id = decodeURIComponent(href.slice(1));
        const target = document.getElementById(id);
        if (!target) return;
        window.requestAnimationFrame(function () {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    }

    upgradeNavigationMarkup();
    syncNavigationMode();

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            if (isNavOpen()) closeNav({ restoreFocus: true });
            else openNav();
        });

        document.addEventListener('click', function (event) {
            if (!isNavOpen()) return;
            if (!stickyNav.contains(event.target) && !navToggle.contains(event.target)) {
                closeNav({ restoreFocus: false });
            }
        });
    }

    stickyNav.addEventListener('click', function (event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        // Do not preventDefault: native fragment navigation preserves durable
        // hashes and normal browser back/forward behavior.
        if (!persistentNav.matches) closeNav({ restoreFocus: false });
        focusAnchorTarget(link);
    });

    if (typeof persistentNav.addEventListener === 'function') {
        persistentNav.addEventListener('change', syncNavigationMode);
    } else if (typeof persistentNav.addListener === 'function') {
        persistentNav.addListener(syncNavigationMode);
    }

    function initEntryOrientation() {
        const titlePage = document.querySelector('.section-title-page');
        const frontMatter = document.getElementById('front-matter');
        if (titlePage && frontMatter && !document.querySelector('.entry-orientation')) {
            const entry = document.createElement('nav');
            entry.className = 'entry-orientation';
            entry.setAttribute('aria-label', 'Reading entry points');
            entry.innerHTML =
                '<a href="#part-i">Begin with Part I</a>' +
                '<a href="#part-ii">Browse case studies</a>' +
                '<button type="button" class="entry-contents">View contents</button>';
            titlePage.insertAdjacentElement('afterend', entry);
            entry.querySelector('.entry-contents')?.addEventListener('click', function () {
                if (persistentNav.matches) {
                    const current = stickyNav.querySelector('a[aria-current="location"]') ||
                        stickyNav.querySelector('a[href^="#"]');
                    current?.focus({ preventScroll: true });
                } else {
                    openNav();
                }
            });
        }

        const guide = document.querySelector('.how-to-use');
        if (guide && guide.tagName !== 'DETAILS') {
            const details = document.createElement('details');
            details.className = 'reading-guide';
            const summary = document.createElement('summary');
            summary.textContent = 'How to read Ares';
            const content = document.createElement('div');
            content.className = 'reading-guide-content';
            Array.from(guide.childNodes).forEach(function (node) {
                if (node.nodeType === 1 && node.tagName === 'H2') return;
                content.appendChild(node);
            });
            details.appendChild(summary);
            details.appendChild(content);
            guide.replaceWith(details);
        }
    }

    function initCaseSequenceNavigation() {
        const cases = Array.from(document.querySelectorAll('.case-study[id]'));
        cases.forEach(function (section, index) {
            if (section.querySelector('.case-sequence-nav')) return;
            const nav = document.createElement('nav');
            nav.className = 'case-sequence-nav';
            nav.setAttribute('aria-label', 'Case study sequence');

            const previous = cases[index - 1];
            const next = cases[index + 1];
            if (previous) {
                const previousTitle = previous.querySelector('h3')?.textContent.trim() || 'Previous case';
                nav.insertAdjacentHTML('beforeend',
                    '<a href="#' + previous.id + '"><span class="case-sequence-label">Previous case</span>' +
                    '<span>' + escapeHtml(previousTitle) + '</span></a>');
            } else {
                nav.insertAdjacentHTML('beforeend', '<span class="case-sequence-spacer" aria-hidden="true"></span>');
            }

            if (next) {
                const nextTitle = next.querySelector('h3')?.textContent.trim() || 'Next case';
                nav.insertAdjacentHTML('beforeend',
                    '<a href="#' + next.id + '"><span class="case-sequence-label">Next case</span>' +
                    '<span>' + escapeHtml(nextTitle) + '</span></a>');
            } else {
                nav.insertAdjacentHTML('beforeend',
                    '<a href="#part-iii"><span class="case-sequence-label">Continue</span>' +
                    '<span>Cross-Case Comparative Analysis</span></a>');
            }
            section.appendChild(nav);
        });
    }

    const navLinks = Array.from(stickyNav.querySelectorAll('.nav-content a[href^="#"]'));
    const navTargets = navLinks.map(function (link) {
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        return { link: link, target: document.getElementById(id) };
    }).filter(function (entry) { return entry.target; });

    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        const bounded = Math.max(0, Math.min(progress, 100));
        if (progressFill) progressFill.style.width = bounded + '%';
        if (progressBar) progressBar.setAttribute('aria-valuenow', String(Math.round(bounded)));
    }

    function contextForLink(link) {
        const text = link.textContent.trim();
        const nestedList = link.closest('ul')?.parentElement;
        if (nestedList && nestedList.tagName === 'LI') {
            const parent = Array.from(nestedList.children).find(function (child) {
                return child.tagName === 'A';
            });
            if (parent) return { part: parent.textContent.trim(), detail: text };
        }
        return { part: text, detail: '' };
    }

    function updateCurrentLocation() {
        if (!navTargets.length) return;
        const headerOffset = mainHeader.getBoundingClientRect().height;
        const marker = window.scrollY + headerOffset + 28;
        let current = navTargets[0];

        navTargets.forEach(function (entry) {
            const top = entry.target.getBoundingClientRect().top + window.scrollY;
            if (top <= marker) current = entry;
        });

        navLinks.forEach(function (link) {
            const active = link === current.link;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });

        const location = document.getElementById('location-context');
        if (location) {
            const context = contextForLink(current.link);
            location.innerHTML = '<span class="location-part">' + escapeHtml(context.part) + '</span>' +
                (context.detail ? '<span class="location-separator"> — </span>' +
                    '<span class="location-detail">' + escapeHtml(context.detail) + '</span>' : '');
            location.title = context.detail ? context.part + ' — ' + context.detail : context.part;
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateProgressBar();
                updateCurrentLocation();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Tab' && isNavOpen()) {
            const focusable = [navToggle].concat(
                Array.from(stickyNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
            ).filter(Boolean).filter(function (element) {
                return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
            });
            if (focusable.length) {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }
        if (event.key === 'Escape' && isNavOpen()) {
            closeNav({ restoreFocus: true });
        }
    });

    initEntryOrientation();
    initCaseSequenceNavigation();
    updateProgressBar();
    updateCurrentLocation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAresNavigation, { once: true });
} else {
    initAresNavigation();
}
