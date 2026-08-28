# Ares 2.0 Architecture Decision Record — AI-maintainer amendment

**Status:** Accepted and implemented  
**Issue:** #6 — architecture revalidation completed  
**Supersedes:** the Python/static implementation choice merged in PR #17  
**Implementation:** PR #21, merged to `main` as `04ec4bccb58407a3ef0b607a60b7abb5a8ff2183`  
**Product authority:** `Ares_2_Product_Editorial_Design_Brief.md`

## Decision

Ares 2.0 uses **Astro static output with strict TypeScript**, Vite through Astro, pnpm with a committed lockfile, semantic modular CSS, Zod validation, Vitest, Playwright and axe. GitHub Pages hosts the exact tested static artifact.

React is not part of the baseline stack. It may be introduced only for a future isolated interactive island whose requirements cannot be met cleanly with native HTML and small TypeScript enhancement.

The publication contract does not change: authored Markdown and structured editorial data are authoritative; the shipped product is complete semantic HTML; durable fragment links remain normal links; JavaScript is optional enhancement rather than a reading prerequisite.

## Why #6 was reopened

The original #6 decision correctly optimized for runtime simplicity and avoiding unnecessary migration, but it underweighted a newly explicit operating constraint: **Ares will be maintained by one solo developer using AI coding agents only.** Under that constraint, architecture must optimize for agent legibility, type safety, predictable ownership, small change surfaces, parallel work and recovery by a fresh agent with limited context.

The old system's runtime was simple, but its authoring/build implementation was not. At the accepted baseline:

- `unified_builder.py` was 43,451 bytes and roughly 1,000 lines;
- generated HTML was about 162 KB;
- production CSS was about 22 KB and JavaScript about 10 KB;
- publication order, templates, case facts, glossary behavior, process data, navigation and output orchestration were mixed across the builder and browser files;
- generated HTML was committed even though deployment rebuilt it;
- no single type-safe toolchain protected structured data and browser code.

The parallel #7–#10 branches supplied stronger evidence than the original architecture review had. #9 and #10 both needed purpose-built Python builder subclasses plus edits to the shared `build.py` entry point to avoid rewriting parallel-owned surfaces. #7 independently touched the global browser script and deployment workflow. This was a workable human-coordination strategy, but a poor steady-state interface for context-limited coding agents: local feature work repeatedly crossed central infrastructure.

## Bake-off

Two implementation paths were re-evaluated against the same publication requirements.

| Criterion | Decomposed Python/static | Astro + strict TypeScript |
| --- | --- | --- |
| Complete generated HTML | Native | Native |
| JS-disabled reading | Native | Native; verified as an explicit browser gate |
| Durable anchors | Native | Native; ordinary fragment links |
| Progressive enhancement | Small JS modules | Small TS modules; native details/dialog fallbacks |
| Structured type safety | JSON Schema + custom Python models | Zod runtime validation + inferred TS types |
| Template/component locality | Requires custom package/templates | First-class `.astro` components |
| Browser-code type safety | Separate JS discipline | Same strict TS toolchain |
| Agent ownership inference | Must learn custom builder package | Directory/component names expose ownership |
| Parallel conflict surface | Central orchestration remains shared | Feature components/styles/data are separable |
| Test ergonomics | Python + Node/browser toolchains | One pnpm command across type/unit/build/browser/a11y |
| Build infrastructure | Custom generator, assets, determinism and templates | Astro/Vite standard build; Ares custom code is domain logic |
| GitHub Pages | Simple | Simple static artifact |
| Runtime framework JS | None | None by default; Astro emits static HTML |
| Migration cost | Lower code movement | Moderate one-time movement while #7–#10 remained unmerged |
| Fresh-agent recovery | Requires learning Ares-specific generator | Conventional modern static-site structure + `AGENTS.md` |

### Representative vertical slice

The revalidation was not decided from a framework feature list. The chosen branch ported a production-shaped slice containing:

- title/publication layout and entry points;
- mobile/desktop contents and reading orientation;
- the Issue #8 editorial tokens and typography direction;
- Issue #9 case grammar, testimony/provenance status, structured chronology and comparison;
- Issue #10 static glossary plus dialog enhancement;
- Issue #10 four-domain, source-mapped, explicitly non-sequential process synthesis;
- stable source IDs and reference targets;
- no-JavaScript operation;
- strict schema/content tests and rendered browser tests.

The same structure scales directly to all eight cases rather than being a disposable prototype, so the migration cost contributed to production implementation.

## Decisive finding

Astro wins **not because the site needs a runtime framework**, but because it removes custom infrastructure from the maintainer's cognitive load while preserving the static-publication model.

The original Python option could have been made sound, but doing so meant designing and maintaining a project-specific template system, model layer, validation layer, asset pipeline, deterministic build machinery and dual Python/JavaScript test environment. Astro supplies the static component/build substrate. Ares code can therefore concentrate on the project-specific hard parts: scholarly data contracts, provenance, ethical presentation and browser behavior.

## Final stack

- Astro static output;
- strict TypeScript (`astro/tsconfigs/strictest` plus additional strictness flags);
- Vite through Astro;
- pnpm with committed lockfile;
- Zod at structured-data boundaries;
- Marked for trusted repository-authored Markdown rendering;
- semantic CSS/custom properties, split by editorial concern;
- small TypeScript progressive-enhancement modules;
- Vitest for content/domain contracts;
- Playwright in Chromium, Firefox and WebKit;
- `@axe-core/playwright` for automated accessibility checks;
- GitHub Actions + GitHub Pages;
- no Tailwind, React, client router, state library, backend, CMS or database.

## Module ownership

```text
src/
├── content/
│   ├── sections/          long-form authored prose
│   ├── cases/             A–F case prose
│   └── data/              cases, glossary, process, references
├── lib/content/           Zod schemas, loaders, Markdown adapter, cross-file validation
├── components/
│   ├── navigation/        orientation and contents
│   ├── cases/             case grammar, chronology, comparison
│   ├── explainers/        process synthesis
│   ├── glossary/          definition appendix/dialog shell
│   └── provenance/        references/source presentation
├── scripts/               optional browser enhancements only
├── styles/                tokens + semantic concern-specific CSS
├── layouts/               document shell
└── pages/                 route composition only
tests/
├── unit/                  editorial/schema contracts
└── browser/               rendered, a11y, viewport, JS-disabled and history behavior
scripts/                   deterministic-build and built-artifact validators
```

A fresh agent should normally need one component directory, its adjacent content/data contract, and a focused test file — not a central renderer.

## Content integrity amendment

The revalidation exposed stale copy outside the old process diagram. `front-matter.md`, Scope & Purpose, Critical Reflection and Part V contained escalation-ladder or predictive framing that conflicted with Issue #10's source-reviewed conclusion. The migration removed those claims from authoritative framing and states the release boundary explicitly: Part IV is an Ares synthesis of four interacting domains, not a universal sequence or validated prediction tool; prevention claims require independent sourcing.

The longer legacy case/comparative corpus still contains source-trace debt. Architecture must expose that debt rather than imply verification. Ares 2.0 UI work does not silently change dates, estimates, quotations or classifications simply to make them look more authoritative.

## Build and quality contract

`pnpm check` is the mandatory local/CI gate. It performs:

1. Astro/TypeScript checking;
2. Vitest content/schema contracts;
3. two independent static builds with byte-level deterministic hash comparison;
4. built-site duplicate-ID and fragment-target validation;
5. build-payload reporting;
6. Playwright tests in Chromium, Firefox and WebKit;
7. JavaScript-disabled reading checks;
8. responsive overflow checks from 320px through wide desktop;
9. reduced-motion checks;
10. axe checks of representative reading/navigation/dialog states.

Deployment builds and tests once, then uploads that exact `dist/` as the Pages artifact. There is no second deployment rebuild.

## Progressive-enhancement contract

The following must remain available without JavaScript:

- title and full core prose;
- publication contents and durable fragment links;
- all eight cases and chronologies;
- structured comparison;
- all process domains/source mappings/limits;
- full glossary;
- stable reference targets.

JavaScript may collapse contents on mobile, update location/progress and upgrade a glossary fragment link to a native dialog. If it fails, the underlying link and content remain valid.

## Non-goals

This amendment does not add a backend, accounts, CMS, client-side router, React application, map system, quiz, gamification or predictive atrocity-risk model. Maps remain deferred under Issue #10 unless later evidence justifies a separately scoped implementation.

## Migration closeout

The migration implementation merged in PR #21 and passed the full integrated quality gate. The obsolete Python builder, committed generated HTML, old `01-core` production files, duplicated `03-content` tree, legacy process SVG/runtime assets and superseded helper scripts were then retired from the working tree. Historical artifacts that still have provenance/research value live only under `04-docs/archive/` and are explicitly non-authoritative.

There is now one obvious production path: root pnpm → Astro/Vite → validated `src/` content/components → deterministic `dist/` → exact-artifact GitHub Pages deployment.
