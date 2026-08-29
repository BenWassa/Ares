# Ares 2.1 Visual Hierarchy and Publication Experience Overhaul

**Issue:** #26  
**Baseline:** `main` at `dcd796eb5c7031ab0a3b94f6eb88499d786af6b2`  
**Scope:** visual hierarchy, publication composition, route architecture and rendered quality; no historical source-status upgrades.

## Evidence and design-skill boundary

The redesign reviewed the exact Ares 2.0 Pages artifact and its release-evidence screenshots at 320–1600 px. Direct browser retrieval of the public Pages origin was not available from the implementation environment, so no claim is made that the pre-change origin was manually browsed over the network. The successful Ares 2.0 deployment workflow proved the downloaded artifact was the exact deployed artifact.

The canonical upstream Impeccable, Taste v2 and Taste redesign skill documents named in Issue #26 were read directly from their GitHub repositories. The portable `npx skills add` path could not be used because the execution environment could not resolve GitHub from its shell. Impeccable's replacement-world and craft-floor guidance therefore informed the work directly; Taste's audit and anti-default guidance was used as a second lens. Motion-heavy, texture-heavy and Awwwards-like defaults were rejected where they conflict with Ares's scholarly tone, ethics and reduced-motion contract.

The baseline rendered evidence showed the central #26 problem clearly: mobile opened with crowded chrome followed by a large dead gap; desktop presented a long beige/grey document with a persistent contents rail but little chapter identity; cases, comparison and process were semantically sound yet visually remained variants of one flat stream.

## Direction

The replacement visual world is an **archival field guide**: a contemporary scholarly publication with crisp paper/ink contrast, one mineral teal accent, strong route-level chapter openings, typographic indexing, documentary rules and asymmetrical evidence layouts.

The direction deliberately refuses generic card grids, hero metrics, gradients, glass, floating pills, ornamental quotation marks, dramatic imagery and scroll choreography. Hierarchy is carried by typography, measure, rules, alignment, pacing and changes in composition.

The font strategy was reassessed but remains payload-free. Ares uses durable local serif and sans-serif stacks rather than reintroducing a remote or bundled font dependency solely for novelty. The stronger identity comes from scale, measure, weight, italic/roman contrast and composition while retaining the Ares 2.0 resilience and performance contract.

## Information architecture

The main experience is no longer a single giant route. Static Astro routes now separate the publication into:

- `/` — opening, orientation, chapter directory and case index;
- `/framework` — Part I;
- `/cases` — Part II case index;
- `/cases/[slug]` — one authored chapter per historical case;
- `/comparison` — Part III;
- `/process` — Part IV;
- `/implications` — Part V;
- `/reflection` — Part VI;
- `/glossary` — durable glossary;
- `/references` — source registry.

The old root fragment scheme is preserved as a compatibility bridge. With JavaScript, legacy hashes resolve directly to their new canonical route. Without JavaScript, the old fragment target still lands on an explicit bridge link to the new page. Core reading never depends on the redirect.

## Vertical slice

The representative rendered slice is the opening, global navigation, Framework, Armenian Genocide chapter, testimony/provenance treatment, chronology and Process synthesis. Those surfaces exercise the new system's highest-risk requirements: mobile first viewport, chapter hierarchy, evidence restraint, metadata density, long prose, direct navigation, chronology and non-sequential explanation.

The same case component and structured data source render all eight case routes, preventing the slice from becoming a one-off mock. Remaining publication routes use the same page-intro, sequence-navigation, typography and source-boundary grammar.

## Visual system

- Canvas: neutral archival grey-beige; page surfaces are lighter without becoming card containers.
- Ink: blue-black with high-contrast secondary roles.
- Accent: one dark mineral teal for navigation, sequence and explanatory emphasis.
- Reading measure: approximately 65–75 characters; wide surfaces are reserved for chronology, comparison and route indexes.
- Major page titles use the display serif at a capped 6rem; UI and analytical hierarchy use the sans stack.
- Testimony remains evidence: it gains a distinct measure, rule rhythm and provenance block, but no oversized quote treatment or emotional colour coding.
- Case chronology uses a date rail at wide widths and a single-column reflow on phones.
- The process synthesis uses a four-domain field of native disclosures and a separate relationships/limits structure. It does not imply sequence through arrows or staged progression.

## Release contract

`pnpm check` remains authoritative: strict types/schema, unit contracts, deterministic build, multi-page built-site validation, budgets, Chromium/Firefox/WebKit browser tests, responsive matrix, axe checks, JavaScript-disabled reading and reduced-motion checks.

The main deployment workflow now uploads the merged-main rendered evidence as well as deploying the exact tested `dist/` artifact. Final acceptance therefore combines manual visual inspection of the post-merge screenshot artifact with the existing live-origin SHA verification, proving that the visually reviewed artifact is the one served by Pages even when the implementation environment cannot directly browse the public origin.
