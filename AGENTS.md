# Ares agent guide

Ares is maintained by one developer using AI coding agents. Optimize every change for local reasoning, explicit contracts and easy handoff.

## Read first

1. `04-docs/docs/Ares_2_Product_Editorial_Design_Brief.md` — product, editorial and ethical authority.
2. `04-docs/docs/Ares_3_1_Human_First_Mobile_Editorial_System.md` — public identity, the mobile grouping law, case-opening grammar and the original 3.1 Home authority.
3. `04-docs/docs/Ares_3_1_Quantitative_Historical_Visualisation_Amendment.md` — governing rule for defensible quantitative historical encoding; supersedes categorical anti-geometry clauses in the original 3.1 authority.
4. `04-docs/docs/Ares_3_1_Final_Home_Communication_Design.md` — final #70 Home copy, Hero, quantitative historical field and #71 implementation contract; later authority wherever its Home clauses conflict with #62.
5. `04-docs/docs/Ares_3_Ground_Level_Overhaul.md` — visual-system authority; its Home composition is superseded by 3.1.
6. `04-docs/docs/Ares_2_Architecture_Decision_Record.md` — architecture authority.
7. `04-docs/docs/Development_Guide.md` — executable development workflow.
8. The GitHub issue you are implementing.

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

Route count is a constraint, not the optimization target. Every mobile viewport is dominated by one idea: a surface may hold several sections, a viewport may not. At most one enumerated directory of destinations renders as default body content on any surface, and apparatus never precedes the content it qualifies. Discoverability is never a reason to co-locate. See `Ares_3_1_Human_First_Mobile_Editorial_System.md` §3.

The public identity is **Project Ares**, and the name is never explained. Historical quantitative UI follows the defensible-encoding rule: a visual dimension may vary only when the underlying quantity is sufficiently comparable for that encoding and the dimension is explicitly named. Cases remain ordered chronologically and no visual may frame magnitude as atrocity severity, historical importance, moral worth or competitive rank. The current #70 Home decision encodes canonical calendar position proportionally, keeps recorded case-window duration textual, and does not encode death estimates because the present eight-case evidence/provenance does not support a common death scale. See `Ares_3_1_Quantitative_Historical_Visualisation_Amendment.md` and `Ares_3_1_Final_Home_Communication_Design.md`.

Historical UI work must not silently certify a legacy claim. `requires-source-trace` means exactly that. Moving a datum into JSON is not source verification.

No gamification, atrocity spectacle, animated suffering, severity scoring, generic SaaS cards, or decorative testimony.
