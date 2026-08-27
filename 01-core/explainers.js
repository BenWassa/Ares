// Ares 2.0 Issue #10 — progressive glossary/process enhancements.
// Essential definitions and process content already exist in static HTML.

(function () {
    'use strict';

    const glossary = window.ARES_GLOSSARY || {};
    const dialog = document.getElementById('glossary-dialog');
    const closeButton = document.getElementById('glossary-dialog-close');
    const title = document.getElementById('glossary-dialog-title');
    const shortDefinition = document.getElementById('glossary-dialog-short');
    const extendedDefinition = document.getElementById('glossary-dialog-extended');
    const sourceNote = document.getElementById('glossary-dialog-source');
    const related = document.getElementById('glossary-dialog-related');
    const fullLink = document.getElementById('glossary-dialog-full-link');
    let returnTarget = null;

    function setOptionalText(element, text, prefix) {
        if (!element) return;
        if (!text) {
            element.textContent = '';
            element.hidden = true;
            return;
        }
        element.textContent = prefix ? prefix + text : text;
        element.hidden = false;
    }

    function openDefinition(trigger) {
        if (!dialog || typeof dialog.showModal !== 'function') return false;
        const key = trigger.getAttribute('data-term');
        const entry = glossary[key];
        if (!entry) return false;

        returnTarget = trigger;
        if (title) title.textContent = entry.term || trigger.textContent.trim();
        if (shortDefinition) shortDefinition.textContent = entry.definition || '';
        setOptionalText(extendedDefinition, entry.extendedDefinition || '', '');
        setOptionalText(sourceNote, entry.sourceNote || '', 'Source context: ');
        setOptionalText(
            related,
            Array.isArray(entry.relatedTerms) && entry.relatedTerms.length
                ? entry.relatedTerms.join(', ')
                : '',
            'Related: '
        );
        if (fullLink) fullLink.setAttribute('href', '#glossary-' + key);

        dialog.showModal();
        if (closeButton) closeButton.focus({ preventScroll: true });
        return true;
    }

    document.querySelectorAll('.glossary-cue').forEach(function (cue) {
        cue.addEventListener('click', function (event) {
            if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            if (openDefinition(cue)) {
                event.preventDefault();
                // The legacy publication script attaches a document-wide
                // smooth-scroll handler to fragment links. Stop this enhanced
                // click before that handler can move the reader to Appendix B.
                event.stopImmediatePropagation();
            }
        }, { capture: true });
    });

    if (closeButton && dialog) {
        closeButton.addEventListener('click', function () {
            dialog.close();
        });
    }

    if (dialog) {
        dialog.addEventListener('close', function () {
            if (returnTarget && document.contains(returnTarget)) {
                returnTarget.focus({ preventScroll: true });
            }
            returnTarget = null;
        });

        // Pointer dismissal on the backdrop; keyboard Escape is supplied by
        // the native <dialog> cancel behavior.
        dialog.addEventListener('click', function (event) {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            const inside = event.clientX >= rect.left && event.clientX <= rect.right
                && event.clientY >= rect.top && event.clientY <= rect.bottom;
            if (!inside) dialog.close();
        });

        if (fullLink) {
            fullLink.addEventListener('click', function (event) {
                // Preserve the anchor's native fragment navigation (including
                // URL hash/history) while preventing the legacy smooth-scroll
                // enhancer from replacing it with scroll-only behavior.
                event.stopImmediatePropagation();
                dialog.close();
            }, { capture: true });
        }
    }

    // Native <details>/<summary> owns process interaction semantics. This
    // listener only exposes the active domain for styling/diagnostics; no
    // explanatory content is created or hidden by JavaScript.
    document.querySelectorAll('[data-process-domain]').forEach(function (domain) {
        domain.addEventListener('toggle', function () {
            domain.dataset.selected = domain.open ? 'true' : 'false';
        });
        domain.dataset.selected = domain.open ? 'true' : 'false';
    });
})();
