# Ares 2.0 Release Quality Report

**Issue:** #12 — accessibility, web-correctness and performance hardening  
**Target:** WCAG 2.2 AA direction where applicable; this is an engineering verification record, not a formal conformance certification.

## Accessibility and interaction

The production architecture uses native landmarks, links, `<details>/<summary>`, `<dialog>`, semantic tables, headings, definition-list metadata and ordinary fragment targets. The hardening pass adds explicit rendered checks for heading progression, principal landmarks, keyboard operation of the skip link/navigation/process disclosure/glossary dialog, Escape dismissal and focus restoration, and a durable glossary-link path that closes the modal before navigating to the static definition.

Standalone navigation/disclosure targets are held to a 44px usability target. Inline prose links, glossary cues and citations remain inline-text exceptions rather than being padded into disruptive controls.

Automated axe checks block critical/serious violations in representative reading, open navigation, modal glossary, comparative-data and expanded process states. Visible focus remains a 3px high-contrast outline and all essential information remains present without JavaScript.

## Responsive/browser matrix

The authoritative Playwright gate runs in Chromium, Firefox and WebKit. Page-level overflow is checked at 320, 360, 390, 412, 430, 768, 1024, 1280, 1366, 1440 and 1600 CSS pixels. Additional tests exercise 200% root text scaling, navigation while crossing the persistent-navigation breakpoint, and an open glossary dialog during a narrow viewport resize.

Chronology collapses to a vertical representation on narrow screens. Cross-case comparison changes from a semantic scrollable table to a static labelled record view on phones; both are generated from the same structured data. No explanatory equivalent depends on JavaScript.

## Motion

Issue #11 removed global smooth scrolling and limited default motion to short visual-state transitions. `prefers-reduced-motion` is verified in every Playwright engine and leaves navigation, disclosure, focus and content comprehension intact.

## Performance and build hygiene

The obsolete architecture cleanup removed the unused multi-megabyte image, legacy SVG, generated HTML, old CSS/JavaScript and Python production tree. The integrated pre-hardening Ares build measured about 180 KB total with no separate external JavaScript file and no production image/font/SVG payload.

The gate now reports HTML, CSS, external JavaScript, inline script, media, total output and the largest built file. Conservative regression ceilings intentionally leave editorial headroom while blocking architectural bloat:

- total static output: 350 KiB;
- CSS: 40 KiB;
- total inline + external client script: 80 KiB;
- any individual binary media/font asset: 512 KiB.

These are regression guards, not optimization targets. Useful editorial content must not be cut merely to reduce bytes.

## Authoritative gate

`pnpm check` remains the single release-quality command and now covers strict Astro/TypeScript, schema/unit contracts, deterministic double build, duplicate-ID/fragment validation, detailed payload reporting, build budgets, Chromium/Firefox/WebKit rendered tests, JavaScript-disabled reading, responsive/reflow checks, reduced motion and axe.

## Accepted limitations / editorial debt

Automated accessibility tooling does not replace final keyboard/visual inspection; Issue #13 owns the final rendered evidence pass. GitHub Pages limits control over response headers/caching policy.

Case-level casualty estimates, testimony chains, classifications, chronology details and causal interpretations marked `requires-source-trace` remain editorial integrity debt. This engineering pass does not certify them and does not invent citations.
