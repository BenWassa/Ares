# Ares 2.0 Release Closeout

**Issue:** #13 — final rendered QA and release closeout  
**Programme:** #14  
**Status:** Release candidate; final acceptance requires merged-main CI, exact-artifact deployment and successful live-origin verification.

## Release standard

Ares 2.0 is accepted only from rendered production output. Source review, a green build, or successful Pages configuration is insufficient by itself. The release workflow tests `dist/`, deploys that exact artifact, and then independently fetches the live Pages origin and requires its `index.html` SHA-256 to equal the tested artifact hash.

## Baseline comparison

Issue #4 documented the pre-redesign production experience. The final candidate addresses its principal product and engineering failures as follows:

| #4 baseline | Ares 2.0 release candidate |
| --- | --- |
| Fixed ~250px desktop-first navigation consumed most phone width | Native mobile `<details>` contents; persistent editorial contents only above the wide-screen breakpoint |
| Large unused desktop space around a narrow monolithic shell | Reading and breakout measures are independent; wide screens use editorial navigation + reading column rather than an app dashboard |
| 400px glossary side panel competed with reading space | Native modal dialog enhancement with full static glossary fallback and focus restoration |
| Scroll-spy/glossary/process comprehension depended heavily on JavaScript | Durable fragment links, complete static glossary, semantic process disclosures and core reading all work with JS disabled |
| Eight-stage process graphic plus deterministic/escalation implications | Four interacting, explicitly non-sequential Ares synthesis domains with source mappings and limits |
| Low-contrast metadata/stage/timeline/narrative roles | High-contrast semantic text roles and axe-gated rendered states |
| No visible-focus system and small controls | 3px focus-visible treatment plus 44px standalone navigation/disclosure targets |
| Global smooth scrolling with no reduced-motion policy | No global smooth scroll; property-scoped short state feedback and explicit reduced-motion contract |
| Phone tables/diagram surfaces risked overflow | Vertical chronology, phone comparison records and multi-engine overflow/reflow matrix |
| Remote font dependency | Durable system/local font stacks; no production font payload |
| Card/gradient/shadow-heavy generic academic UI | Restrained publication typography, rules, hierarchy and documentary voice; testimony is not ornamentalized |
| No authoritative automated release gate | `pnpm check`: strict types/schema, deterministic build, fragment validation, budgets, 3-browser rendered tests, JS-disabled, a11y, responsive and motion checks |
| Python builder + committed generated HTML + duplicated content/runtime trees | One Astro/pnpm production path; obsolete architecture removed, provenance-only artifacts explicitly archived |

## Final rendered matrix

The release QA suite renders and asserts the publication in Chromium, Firefox and WebKit at:

- 320 × 700
- 360 × 800
- 390 × 844
- 412 × 915
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1280 × 800
- 1366 × 768
- 1440 × 900
- 1600 × 1000

Chromium additionally emits screenshot evidence for each viewport and representative transient states. Assertions run in all three engines.

## Transient-state release coverage

The final gate explicitly exercises:

- initial load;
- durable deep links;
- mobile navigation open/closed;
- current-location feedback;
- process disclosures;
- glossary modal open/close and focus restoration;
- chronology;
- cross-case comparison;
- case next/previous transitions;
- references;
- visible keyboard-only entry/focus;
- JavaScript-disabled reading;
- reduced motion;
- viewport resize while a modal control is open;
- native browser back/forward history.

## Artifact and performance contract

Issue #12 established conservative regression ceilings of 350 KiB total static output, 40 KiB CSS, 80 KiB client script and 512 KiB per binary media/font asset. The final gate reports actual output on every run and must remain below those ceilings.

The release does not hydrate a framework runtime, load remote fonts, or ship production image/SVG media merely for decoration.

## Deployment truth

The `main` workflow has three sequential acceptance jobs:

1. `build-and-verify` — runs the complete gate and records SHA-256 of the exact tested `dist/index.html`;
2. `deploy` — uploads the same `dist/` Pages artifact without rebuilding it;
3. `verify-live` — fetches the resulting Pages URL with cache bypass, requires exact HTML hash equality, checks durable release markers, and fetches same-origin stylesheet/script/media assets.

Issue #13 and programme #14 must remain open until this three-job merged-main workflow succeeds for the final release SHA. The exact run/SHA/live URL are recorded in the GitHub closeout comments after verification rather than being guessed in this document.

## Remaining editorial integrity debt

Ares 2.0 is technically release-ready only; it does not claim every historical statement has completed source-level verification. Case-level casualty estimates, testimony chains, legal classifications, chronology details and causal interpretations explicitly marked `requires-source-trace` remain research debt.

The final UI preserves those boundaries. No release check converts an unresolved historical claim into a verified one, and no citation has been invented to make the publication appear more complete.
