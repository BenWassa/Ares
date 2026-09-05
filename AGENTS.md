# Ares agent guide

Ares is maintained by one developer using AI coding agents. Optimize every change for local reasoning, explicit contracts and easy handoff.

## Read first

1. `04-docs/docs/Ares_2_Product_Editorial_Design_Brief.md` — product, editorial and ethical authority.
2. `04-docs/docs/Ares_3_Ground_Level_Overhaul.md` — visual-system and screen-composition authority.
3. `04-docs/docs/Ares_2_Architecture_Decision_Record.md` — architecture authority.
4. `04-docs/docs/Development_Guide.md` — executable development workflow.
5. The GitHub issue you are implementing.

Run `pnpm check` before considering a change complete.

## Architecture contract

Ares has **one production path**: Astro static output from the root pnpm project and `src/` tree. TypeScript is strict. React is not a default dependency. JavaScript enhances static semantic HTML; it must not own essential scholarly content.

The former Python builder, `01-core`, `03-content`, generated HTML and legacy runtime assets were deliberately retired. Do not resurrect them or introduce a second build path. Files under `04-docs/archive/` are historical evidence only and must never be imported by production code.

Structured boundaries are Zod-validated at build time. If the same scholarly datum appears in more than one rendered place, structure it once and render it more than once.

## Ownership map

- `src/content/sections/` — authored long-form publication prose.
- `src/content/cases/` — authored case narrative/analysis, A–F grammar.
- `src/content/data/cases.json` — reusable case metadata, estimates and chronology; source status travels with the datum.
- `src/content/data/glossary.json` — glossary authority.
- `src/content/data/process.json` — the only process-synthesis authority. Four interacting domains, explicitly non-sequential.
- `src/content/data/references.json` — stable source registry.
- `src/lib/content/` — parsing, Zod schemas and cross-reference validation. Do not put visual markup here.
- `src/components/navigation/` — publication orientation/navigation.
- `src/components/cases/` — case grammar, chronology and comparison.
- `src/components/explainers/` and `src/components/glossary/` — process/glossary static renderers.
- `src/components/provenance/` — source presentation.
- `src/scripts/` — optional progressive enhancements only.
- `src/styles/` — semantic CSS by concern. Tokens live only in `tokens.css`.
- `tests/unit/` — content and schema contracts.
- `tests/browser/` — rendered/browser/accessibility/progressive-enhancement contracts.
- `04-docs/archive/` — non-authoritative historical artifacts; never a production dependency.

## Change discipline

Prefer a small component or module over adding branches to a central file. Do not create a generic component abstraction until at least two real uses share the same semantics. Do not add Tailwind, React, a client router, state library or design-system dependency without an issue-level architecture justification.

Preserve durable fragment IDs. Do not replace native links with click handlers. Do not hide essential prose, glossary definitions, citations or process explanation behind JavaScript.

The ground is one warm near-black family and the accent is iron oxide. `--accent` is structure and never carries small text; `--accent-lift` is the only accent value allowed to be typography. No route may introduce a light content band. Do not add a route for a unit that a reader would simply scroll to next: units share a surface unless they are a genuine branch (optional depth, a different topic, a research utility). Nothing may exceed two screens from the opening — `tests/unit/hierarchy.test.ts` enforces it.

Historical UI work must not silently certify a legacy claim. `requires-source-trace` means exactly that. Moving a datum into JSON is not source verification.

No gamification, atrocity spectacle, animated suffering, severity scoring, generic SaaS cards, or decorative testimony.
