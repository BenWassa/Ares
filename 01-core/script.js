// Project Ares — Digital Synopsis interactivity
// Glossary tooltips/side panel and the interactive process-model diagram.
// Issue #7 navigation/orientation is isolated in navigation.js so later
// explainer work can reconcile this shared enhancement entry cleanly.
// Content data is injected inline by the build (window.ARES_GLOSSARY /
// window.ARES_PROCESS_STAGES) so the page works when opened directly from disk;
// a fetch fallback covers older builds.

window.ARES_NAVIGATION_V2 = true;
document.documentElement.classList.add('js');
const pendingNavigation = document.getElementById('sticky-nav');
if (pendingNavigation) {
    pendingNavigation.hidden = true;
    pendingNavigation.setAttribute('inert', '');
}
(function loadAresNavigation() {
    const script = document.createElement('script');
    script.src = 'navigation.js';
    script.async = false;
    script.addEventListener('error', function () {
        // If the enhancement module cannot load, return to the fully static
        // publication contents rather than leaving navigation inaccessible.
        document.documentElement.classList.remove('js');
        if (pendingNavigation) {
            pendingNavigation.hidden = false;
            pendingNavigation.removeAttribute('inert');
        }
    });
    document.head.appendChild(script);
}());

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('nav-toggle');
    const stickyNav = document.getElementById('sticky-nav');
    const sidePanel = document.getElementById('side-panel');
    const sidePanelClose = document.getElementById('side-panel-close');
    const backToTop = document.getElementById('back-to-top');
    const progressFill = document.getElementById('progress-fill');

    // ---------- Legacy navigation fallback ----------
    // Kept temporarily for pre-#7 generated/source output. The Ares 2.0
    // navigation module owns behavior when ARES_NAVIGATION_V2 is enabled.
    function closeNav() {
        if (navToggle) navToggle.classList.remove('active');
        if (stickyNav) stickyNav.classList.remove('active');
    }
    if (!window.ARES_NAVIGATION_V2 && navToggle && stickyNav) {
        const toggle = function () {
            navToggle.classList.toggle('active');
            stickyNav.classList.toggle('active');
        };
        navToggle.addEventListener('click', toggle);
        navToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
        document.addEventListener('click', function (event) {
            if (!stickyNav.contains(event.target) && !navToggle.contains(event.target)) {
                closeNav();
            }
        });
    }

    // ---------- Legacy reading progress + back to top ----------
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (progressFill) progressFill.style.width = Math.min(progress, 100) + '%';
    }
    function updateBackToTop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (backToTop) backToTop.classList.toggle('visible', scrollTop > 400);
    }
    if (!window.ARES_NAVIGATION_V2 && backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Legacy active nav highlighting ----------
    const navLinks = Array.from(document.querySelectorAll('.nav-content a'));
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('.section, .subsection');
        let current = '';
        sections.forEach(function (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) current = section.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    if (!window.ARES_NAVIGATION_V2) {
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateProgressBar();
                    updateBackToTop();
                    updateActiveNavItem();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ---------- Glossary ----------
    let glossaryData = window.ARES_GLOSSARY || {};

    function initGlossary() {
        document.querySelectorAll('.glossary-term').forEach(function (el) {
            const def = glossaryData[el.getAttribute('data-term')];
            if (!def) return;
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'button');
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
            el.addEventListener('focus', showTooltip);
            el.addEventListener('blur', hideTooltip);
            el.addEventListener('click', showInSidePanel);
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showInSidePanel.call(el, e); }
            });
        });
    }

    function showTooltip(event) {
        const el = event.currentTarget;
        const def = glossaryData[el.getAttribute('data-term')];
        if (!def || el._tip) return;
        const tip = document.createElement('div');
        tip.className = 'glossary-tooltip';
        tip.textContent = def.definition;
        document.body.appendChild(tip);
        const rect = el.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 6;
        let left = rect.left + window.scrollX;
        left = Math.min(left, window.scrollX + document.documentElement.clientWidth - tip.offsetWidth - 12);
        tip.style.top = top + 'px';
        tip.style.left = Math.max(left, window.scrollX + 8) + 'px';
        el._tip = tip;
    }

    function hideTooltip(event) {
        const el = event.currentTarget;
        if (el._tip) { el._tip.remove(); el._tip = null; }
    }

    function showInSidePanel(event) {
        const el = event.currentTarget;
        const def = glossaryData[el.getAttribute('data-term')];
        if (!def || !sidePanel) return;
        const content = sidePanel.querySelector('.concept-placeholder');
        if (content) {
            content.innerHTML =
                '<h5>' + def.term + '</h5>' +
                '<p>' + def.definition + '</p>' +
                (def.extendedDefinition ? '<p class="concept-extended">' + def.extendedDefinition + '</p>' : '') +
                (def.relatedTerms ? '<p class="concept-related"><span>Related:</span> ' + def.relatedTerms.join(', ') + '</p>' : '');
        }
        sidePanel.classList.add('active');
    }

    function closeSidePanel() { if (sidePanel) sidePanel.classList.remove('active'); }
    if (sidePanelClose) sidePanelClose.addEventListener('click', closeSidePanel);

    // Fallback for builds without inline data.
    if (!window.ARES_GLOSSARY) {
        fetch('../03-content/data/glossary.json')
            .then(function (r) { return r.json(); })
            .then(function (d) { glossaryData = d.glossary || {}; initGlossary(); })
            .catch(function () { /* offline: glossary terms simply render as plain emphasis */ });
    }

    // ---------- Process-model diagram ----------
    const stageData = window.ARES_PROCESS_STAGES || {};
    const detail = document.getElementById('process-model-detail');
    function initProcessModel() {
        const stages = document.querySelectorAll('.process-model-svg .stage');
        if (!stages.length || !detail) return;
        stages.forEach(function (stage) {
            stage.setAttribute('tabindex', '0');
            stage.setAttribute('role', 'button');
            const activate = function () {
                stages.forEach(function (s) { s.classList.remove('active'); });
                stage.classList.add('active');
                const info = stageData[stage.getAttribute('data-stage')];
                if (info) {
                    detail.innerHTML =
                        '<h4>' + info.title + '</h4>' +
                        '<p>' + info.description + '</p>';
                }
            };
            stage.addEventListener('click', activate);
            stage.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
            });
        });
    }

    // ---------- Legacy smooth scrolling for in-page links ----------
    if (!window.ARES_NAVIGATION_V2) {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    closeNav();
                }
            });
        });
    }

    // ---------- Keyboard shortcuts ----------
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (!window.ARES_NAVIGATION_V2) closeNav();
            closeSidePanel();
        }
    });

    // ---------- Reading meta (title page) ----------
    function initReadingMeta() {
        const slot = document.getElementById('reading-meta');
        const main = document.querySelector('.main-content');
        if (!slot || !main) return;
        const words = (main.textContent || '').trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.round(words / 225));
        const cases = document.querySelectorAll('.case-study').length;
        const terms = Object.keys(glossaryData).length;
        const bits = ['≈ ' + minutes + ' min read'];
        if (cases) bits.push(cases + ' case studies');
        if (terms) bits.push(terms + ' glossary terms');
        slot.textContent = bits.join(' · ');
    }

    // ---------- Scroll reveal (progressive enhancement) ----------
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const targets = document.querySelectorAll('.subsection, .part-title, .part-intro');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        targets.forEach(function (el) {
            // Only animate elements below the fold at load time.
            if (el.getBoundingClientRect().top > window.innerHeight) {
                el.classList.add('reveal');
                observer.observe(el);
            }
        });
    }

    // ---------- Init ----------
    initGlossary();
    initProcessModel();
    initReadingMeta();
    initScrollReveal();
    if (!window.ARES_NAVIGATION_V2) {
        updateProgressBar();
        updateBackToTop();
        updateActiveNavItem();
    }
});
