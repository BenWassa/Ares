# Development Guide — Ares 2.0

**Status:** Current operational guide.  
**Architecture authority:** [`Ares_2_Architecture_Decision_Record.md`](Ares_2_Architecture_Decision_Record.md)  
**Product/editorial authority:** [`Ares_2_Product_Editorial_Design_Brief.md`](Ares_2_Product_Editorial_Design_Brief.md)

Ares has one executable production path: the root Astro/pnpm project. The pre-Ares-2 Python builder and generated-production tree have been retired.

## Toolchain

Use Node 24 and pnpm 11.23.0. From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

The deployable artifact is `dist/`. It is generated output and must not be hand-edited or committed.

## Mandatory quality gate

Before a change is considered complete:

```bash
pnpm check
```

The single gate covers:

- strict Astro/TypeScript diagnostics;
- Zod/content/schema unit contracts;
- two independent byte-for-byte deterministic builds;
- duplicate-ID and fragment-target validation;
- built-payload reporting;
- Chromium, Firefox and WebKit Playwright coverage;
- JavaScript-disabled reading/navigation;
- responsive overflow checks;
- reduced-motion behavior;
- axe accessibility checks.

Do not bypass or weaken a gate to make CI green. Fix the product or fix an incorrect test invariant while preserving the intended contract.

## Production source locations

```text
src/content/sections/*.md       publication prose
src/content/cases/*.md          case narrative/analysis
src/content/data/cases.json     case metadata, estimates, chronology, provenance status
src/content/data/glossary.json  glossary authority
src/content/data/process.json   only process-synthesis authority
src/content/data/references.json stable source registry
src/lib/content/                schemas, loaders, Markdown adapter, validation
src/components/                 semantic publication renderers by feature
src/scripts/                    optional progressive enhancement
src/styles/                     semantic CSS and tokens
tests/unit/                     content/schema contracts
tests/browser/                  rendered/a11y/browser contracts
scripts/                        deterministic-build and artifact validators
```

Files under `04-docs/archive/` are historical records only. Production code must not read them.

## Progressive enhancement

Core reading must remain useful with JavaScript disabled. Static HTML must retain publication prose, durable major navigation/deep links, complete glossary access, citations/references, all case chronologies/comparison material and essential process explanation.

Enhancement code may improve orientation, focus management and glossary presentation, but normal links and native browser history remain the foundation.

## Editorial integrity

Do not infer that a claim became verified because it was migrated into a schema. `requires-source-trace` records remain unresolved editorial debt. Never invent citations or silently normalize disputed casualty estimates, testimony chains, legal classifications, chronology details or causal interpretations.

## Architecture changes

Do not add React, Tailwind, a client router, state library, backend, CMS or a second build pipeline as an incidental implementation choice. Any such change requires issue-level evidence that the accepted architecture can no longer satisfy a real requirement.

## Deployment

`.github/workflows/deploy-pages.yml` runs `pnpm check` on `main`, then uploads that exact tested `dist/` directory to GitHub Pages. There is no deployment rebuild.

The branch quality workflow uses the same gate and uploads the tested static artifact plus Playwright report for inspection.

## Remaining Ares 2.0 closeout ownership

- **#11:** restrained functional motion and interaction polish.
- **#12:** accessibility, web correctness and performance hardening.
- **#13:** final rendered QA, exact-artifact deployment and live-origin verification.

Do not use this guide to broaden an issue beyond its own scope.
