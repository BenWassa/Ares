# Development Guide — Ares 2.0

**Status:** Operational companion to the accepted Ares 2.0 architecture.  
**Architecture authority:** [`Ares_2_Architecture_Decision_Record.md`](Ares_2_Architecture_Decision_Record.md)  
**Product/editorial authority:** [`Ares_2_Product_Editorial_Design_Brief.md`](Ares_2_Product_Editorial_Design_Brief.md)

This guide replaces the previous pre-builder development notes. When this file and the architecture ADR differ, the ADR is authoritative.

## Current build

From the repository root:

```bash
python build.py
```

`build.py` invokes `03-content/build/unified_builder.py`, which currently assembles the complete static publication. GitHub Pages runs the same build before deployment.

Ares remains a static publication: Markdown/structured data are transformed into semantic HTML, CSS provides presentation, and vanilla JavaScript progressively enhances navigation, glossary and interactive material.

## Current source locations

```text
03-content/sections/*.md       publication prose
03-content/case-studies/*.md   case-study prose
03-content/data/*.json         current structured data
03-content/maps/               map/geographic configuration
03-content/build/              Python builder
01-core/stylesheet.css         current visual source
01-core/script.js              current enhancement source
02-assets/                     static assets
04-docs/docs/                  product, architecture and programme documentation
```

`01-core/index-with-content.html` is **generated output, not an editing surface**. It remains tracked only during the architecture transition described in the ADR. The accepted target is untracked `_site/index.html` generated reproducibly from source.

## Ares 2.0 source-of-truth direction

The architecture ADR establishes the target ownership model:

- prose stays in Markdown;
- reusable case facts/estimates/chronology become validated structured data;
- glossary definitions remain structured data;
- stable source records live in `references.json`;
- claim/testimony/estimate provenance lives in structured provenance records;
- the future process synthesis lives in one `process.json` source and is rendered into every representation;
- publication hierarchy/durable major anchors come from structured publication data;
- scholarly content must not be duplicated in Python/JavaScript/SVG constants;
- generated HTML is never authoritative.

The current repository is transitional. Do not add new duplicated historical/process facts while #9/#10 migrate the existing debt.

## Builder direction

`unified_builder.py` currently mixes parsing, data, validation, templates, navigation and rendering. It will be decomposed incrementally under the ADR while keeping `python build.py` stable.

The target build package separates:

- typed content models;
- loaders;
- schema/cross-reference validation;
- Markdown/directive handling;
- rendering/templates;
- asset collection/copying.

Do not create a framework migration or generic plugin system to accomplish this.

## Progressive-enhancement rule

Core reading must remain useful with JavaScript disabled. In particular, static HTML must retain:

- publication prose;
- durable major navigation/deep links;
- complete glossary access;
- point-of-use citation paths and full references;
- essential process/explainer information.

JavaScript may add focus-managed navigation, glossary detail surfaces, interactive diagrams/maps, reading aids and other comprehension/orientation enhancements.

## Quality direction

The minimum durable harness defined by the ADR includes:

- deterministic builds;
- schema and cross-reference validation;
- generated/source drift checking during the tracked-output transition;
- HTML and internal-anchor validation;
- Playwright smoke coverage at representative phone, 1366px laptop and wide-desktop sizes;
- JavaScript-disabled checks;
- axe-style accessibility automation plus explicit keyboard/focus assertions;
- representative visual-regression support;
- measured payload/asset reporting.

#12 owns the full hardening pass; #7–#10 should build patterns that can satisfy these gates rather than deferring obvious architecture violations.

## Issue ownership

- **#7:** long-document navigation/orientation, deep links and responsive focus behavior.
- **#8:** typography, spacing, colour, visual tokens and tracked CSS organization.
- **#9:** case-study presentation plus structured case/provenance/reference migration.
- **#10:** glossary/process explainers; final process content must derive from source-mapped structured data.
- **#11:** restrained functional motion.
- **#12:** accessibility, performance and web-correctness hardening.
- **#13:** final rendered QA against the deployable artifact.

Do not use this guide to broaden an issue beyond its own scope.
