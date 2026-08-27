# Ares 2.0 Architecture Decision Record

**Status:** Accepted architecture for Ares 2.0  
**Issue:** #6 — decide frontend architecture and build-system modernization path  
**Decision branch base:** post-#5 `main` at `af9eaa015d1e06d1081d2516b038ce0ccf3acf70`  
**Product authority:** [`Ares_2_Product_Editorial_Design_Brief.md`](Ares_2_Product_Editorial_Design_Brief.md)  
**Evidence baseline:** [`Ares_2_Baseline_Audit.md`](Ares_2_Baseline_Audit.md)  
**Scope:** Architecture and source-of-truth decision only. This ADR does not implement the #7–#13 redesign programme.

---

## 1. Decision summary

**Ares 2.0 will retain and incrementally modernize its existing Python-generated static-publication architecture.** Markdown and validated structured JSON remain the editorial sources; Python builds semantic static HTML; CSS provides the visual system; small vanilla JavaScript modules progressively enhance navigation, glossary, diagrams and future maps; GitHub Pages serves the generated static site.

Ares will **not** migrate to React/Vite, an SPA, Astro, Eleventy or another site framework during the Ares 2.0 redesign programme. Astro is the strongest modern-static alternative considered here, but it does not solve the project’s demonstrated failures better enough to justify a migration. The problems identified in #4/#5 are source ownership, scholarly provenance, duplicated process content, mixed builder responsibilities, and missing QA—not an inability to generate static pages or reusable markup.

The current architecture is therefore retained **as a product model, not frozen as an implementation**. The builder must be decomposed, important data must become typed/validated source data, generated output must stop acting like hand-edited source, and CI must test the rendered publication.

The governing rule is:

> **Publication sources are authoritative; static HTML is a reproducible product of those sources; JavaScript may enhance but must not be required to read the argument, follow citations, use durable anchors, or access essential glossary/process information.**

---

## 2. Current architecture

Today Ares is a single long-form static document assembled through this flow:

```text
03-content/sections/*.md
03-content/case-studies/*.md
03-content/data/glossary.json
02-assets/svgs/process-model.svg
        +
Python constants and templates inside unified_builder.py
        ↓
build.py → 03-content/build/unified_builder.py
        ↓
01-core/index-with-content.html
        +
01-core/stylesheet.css
01-core/script.js
02-assets/**
        ↓
GitHub Actions stages _site/
        ↓
GitHub Pages
```

This has several genuine strengths:

- the deployed product is static and cacheable;
- core reading works without JavaScript;
- major sections and cases already have durable fragment anchors;
- Markdown is comfortable for sustained editorial prose;
- JSON already works well for glossary-like structured material;
- the runtime has no framework or hydration cost;
- GitHub Pages deployment is simple;
- current payloads are modest: roughly 162 KB generated HTML, 22 KB CSS and 10 KB JavaScript at the #4 baseline.

The weakness is not static generation. It is **where responsibility lives**.

`03-content/build/unified_builder.py` currently combines, in one roughly 43 KB / 1,000-line module:

- Markdown parsing and inline formatting;
- glossary phrase matching and automatic linking;
- hard-coded publication ordering;
- hard-coded navigation structure;
- case parsing;
- hard-coded case metadata and comparative-table data;
- case templates;
- chronology presentation;
- glossary rendering;
- process-model SVG inclusion;
- a second hard-coded eight-stage process dataset for JavaScript;
- full page-shell templating;
- source/reference appendix markup;
- asset paths;
- output writing and a timestamped manifest;
- watch-mode behavior.

That concentration has already produced source drift. The most serious example is the process explainer: prose/glossary and the SVG/JavaScript data describe incompatible taxonomies. Case metadata is also duplicated: the builder contains eight cases while `03-content/data/casestudies.json` contains only three and disagrees with some current presentation data.

The generated document is presently committed as `01-core/index-with-content.html` even though deployment rebuilds it. Its generator metadata and build manifest also contain wall-clock timestamps, so the build is not byte-for-byte reproducible across time.

---

## 3. Requirements inherited from #4 and #5

The architecture must preserve or enable all of the following.

### Publication-first behavior

- Static delivery on GitHub Pages.
- Semantic HTML containing the complete core reading experience.
- Durable IDs and fragment links for parts, cases, glossary/reference targets and other important entry points.
- Markdown/structured-data editorial sources rather than hand-edited generated HTML.
- Progressive enhancement: failure or absence of JavaScript cannot erase core prose, essential citations, glossary definitions or the semantic content of an explainer.
- No client router and no application state requirement for reading.

### Scholarly provenance

The product must distinguish at least:

- documented historical fact;
- Dutton source-paper claim;
- Ares synthesis;
- interpretation;
- quantitative estimate;
- witness/testimony;
- contested/uncertain claim;
- legal/institutional finding.

The architecture must support stable source IDs, reusable references, point-of-use citations, durable full-reference targets, uncertainty/ranges, testimony metadata, source-container/context metadata and essential citation access without JavaScript.

### One process source of truth

The future Ares process explanation must come from one source-mapped structured definition. Prose, glossary references, labels, diagram output, interactive detail and mobile representation must not carry separately editable copies of the same scholarly model.

#6 does **not** decide the final nodes, labels, sequence or relationships. #10 owns that scholarly/editorial resolution within the constraints set by #5.

### Multi-viewport and accessibility support

The architecture must allow #7–#10 to build first-class phone, 1280–1366 laptop and wide-desktop experiences while #12/#13 can enforce WCAG 2.2 AA, progressive enhancement and rendered quality.

---

## 4. Options considered

### Option A — targeted modernization of the existing Python/static system

Retain:

- Markdown for publication prose;
- JSON for reusable structured editorial data;
- `build.py` as the stable repository-level build entry point;
- Python static generation;
- semantic generated HTML;
- vanilla CSS and progressive JavaScript;
- GitHub Pages.

Modernize:

- split the builder by responsibility;
- establish typed content models and schemas;
- introduce explicit reference/provenance/process/publication data;
- remove content facts from Python/JavaScript constants;
- use templates rather than one giant Python string;
- make builds deterministic;
- make generated output uncommitted;
- deploy only referenced/required assets;
- add CI, browser, accessibility and visual QA.

**Assessment:** best fit. It solves every demonstrated architecture problem while preserving the product’s strongest behavior and keeping #7–#10 focused on the publication rather than on framework migration.

### Option B — Astro static site generation

Astro is a credible alternative because it can:

- emit static HTML;
- consume Markdown/content collections;
- provide reusable layouts/components;
- add interactive “islands” only where needed;
- support asset pipelines and modern frontend tooling;
- deploy cleanly to GitHub Pages.

It would improve template ergonomics compared with the current monolithic Python strings, and its island model is compatible with Ares’s progressive-enhancement philosophy when used carefully.

However, Astro does not remove Ares’s hard problems. Ares would still need custom provenance schemas, stable source identifiers, cross-reference validation, testimony/estimate metadata, process-model validation, durable static fallbacks and project-specific QA. It would also require migrating the page shell, Markdown assumptions, data loaders, assets, CSS/JS integration, build/deploy tooling and tests while #7–#10 are trying to redesign the publication.

The reusable-template and island benefits can be obtained more cheaply by decomposing the current Python generator and splitting enhancements into small JavaScript modules. Ares has one publication, not a large route/component estate that currently strains static generation.

**Assessment:** technically sound but rejected for Ares 2.0 because migration cost and programme disruption exceed demonstrated benefit.

### Option C — Eleventy or another JavaScript static-site generator

Eleventy would also preserve static output and has a smaller conceptual footprint than an SPA. It would improve templating and Markdown integration, but it would still move the build into a second ecosystem without solving the bespoke provenance/process contracts. Its main benefits are not currently blocked by Python.

**Assessment:** credible, but no Ares-specific advantage large enough to justify migration.

### React/Vite or an SPA

React/Vite is not used as the token “modern” comparison because Ares does not need client-side routing, application state, authenticated views or a component-heavy interactive shell. A React SPA would make the publication’s strongest property—complete readable static HTML—the thing that needs extra work to preserve.

React could be embedded for a future isolated visualization only if a concrete interactive requirement eventually warrants it. That would be a local dependency decision, not an application-architecture migration.

**Assessment:** rejected.

### Comparison

| Criterion | Modernized Python/static | Astro | Eleventy | React/Vite SPA |
| --- | --- | --- | --- | --- |
| Editorial Markdown ergonomics | Strong | Strong | Strong | Requires additional content layer |
| Static output by default | Yes | Yes | Yes | No / requires prerender strategy |
| Core reading without JS | Native | Native if disciplined | Native | Additional work |
| Progressive enhancement | Native | Strong via islands | Strong | Easy to over-hydrate |
| Reusable templates | Needs decomposition | Excellent | Excellent | Excellent |
| Interactive islands | Small JS modules/dynamic imports | Excellent | Small JS modules | Native but broad runtime |
| Provenance/process validation | Custom Ares work | Custom Ares work | Custom Ares work | Custom Ares work |
| Migration cost | Low and incremental | Medium–high | Medium | High |
| Build/deploy complexity | Low | Medium | Medium | Medium–high |
| Maintenance burden for this project | Lowest | Higher | Higher | Highest |
| Risk of delaying #7–#10 | Lowest | Material | Material | High |

---

## 5. Explicit decision and why it wins

Ares 2.0 will use **Option A: targeted modernization of the existing Python/static system**.

It wins because:

1. **The product is a publication.** One durable long-form document with deep links is a natural output for static generation.
2. **The current runtime is already appropriately small.** There is no measured framework-sized performance or interactivity problem.
3. **The P0 defect is a data-ownership defect.** Changing frameworks would not prevent a diagram, prose paragraph and glossary entry from disagreeing unless the content model is fixed.
4. **Provenance is bespoke domain architecture.** The hard work is source IDs, claim classes, testimony context and cross-reference validation; Astro/React would not provide that product model.
5. **Progressive enhancement is already real.** Ares’s core prose, glossary appendix and anchor structure survive JavaScript today. That should remain the default, not be reconstructed after a migration.
6. **The modernization can be incremental.** #7–#10 can proceed against stable contracts without waiting for a frontend rewrite.
7. **The builder’s maintainability problems are tractable.** Separating loaders/models/validation/rendering/templates/assets is enough; no architecture rewrite is needed.

This is not a “no change” decision. It removes several current implementation patterns from the target architecture.

---

## 6. Content and source-of-truth model

A later agent must not have to guess which file owns a concept.

| Concern | Authoritative source in Ares 2.0 | Generated/consumer representations |
| --- | --- | --- |
| Publication prose | `03-content/sections/*.md` | HTML sections, search/read text |
| Case narrative/analytical prose | `03-content/case-studies/*.md` | Case HTML |
| Case identity, reusable metadata, estimates and structured chronology | `03-content/data/casestudies.json` after #9 migration | Case headers, comparison, chronology views, map labels |
| Glossary definitions | `03-content/data/glossary.json` | Inline cues, static glossary, enhanced definition UI |
| Bibliographic/source records | `03-content/data/references.json` | Static references/endnotes, enhanced source details |
| Claim/testimony/estimate provenance | `03-content/data/provenance/*.json` | Point-of-use citations, testimony context, uncertainty notes |
| Ares process synthesis | `03-content/data/process.json` | Static process explanation, labels, diagram data, mobile form, JS enhancement data |
| Publication hierarchy and durable major anchors | `03-content/data/publication.json` | TOC, part/case navigation, previous/next context |
| Maps/geographic configuration | structured files under `03-content/maps/`, with source references where evidentiary | Static fallback, lazy interactive map |
| Visual tokens/styles | CSS source under `01-core/` (final split owned by #8) | Generated/deployed CSS |
| Enhancement behavior | JavaScript source under `01-core/` (modules may be introduced by #7/#10) | Browser behavior only; not scholarly content authority |
| Generated HTML | **No authoritative source role** | `_site/index.html` only |
| Architecture/product decisions | `04-docs/docs/` | Human guidance |

### Rule for repeated information

If a fact, estimate, label, chronology event or scholarly relationship appears in more than one rendered representation, it must have **one structured source**. Templates may render it several ways; authors may not maintain several prose/JSON/JS copies and rely on manual synchronization.

### Transitional truth

The repository does not yet satisfy this target model. In particular:

- builder `CASE_STUDIES` currently owns eight rendered case metadata records while `casestudies.json` is incomplete;
- process content is currently split among Markdown, glossary JSON, Python constants and SVG labels;
- references are effectively hard-coded into the builder.

Until #9/#10 perform those migrations, downstream work must avoid adding new duplicated historical/process facts. The target files above become authoritative as their migration lands.

---

## 7. Provenance architecture

Provenance becomes structured product data rather than bibliography-only markup.

### 7.1 Stable source registry

`03-content/data/references.json` will contain stable, human-readable source IDs such as:

```json
{
  "id": "src-dutton-2005",
  "type": "journal-article",
  "title": "Extreme Mass Homicide: From Military Massacre to Genocide",
  "authors": ["Donald G. Dutton", "Ehor O. Boyanowsky", "Michael H. Bond"],
  "year": 2005,
  "container": "Aggression and Violent Behavior",
  "volume": "10",
  "issue": "4",
  "pages": "437–473",
  "doi": "10.1016/j.avb.2004.06.002"
}
```

IDs are durable editorial identifiers. Display numbering may change with document order; source IDs and HTML reference targets must not.

### 7.2 Provenance records

`03-content/data/provenance/*.json` will hold records keyed by stable provenance IDs. A record includes:

- `id`;
- one required provenance class from the #5 taxonomy;
- one or more `source_id` references;
- source locators where available (page, section, paragraph, record number, timestamp, etc.);
- support relationship where useful (`supports`, `qualifies`, `disputes`);
- an editorial note when indirect sourcing or ambiguity matters.

Specialized fields are required where relevant:

**Quantitative estimates**

- range/min/max/display value as appropriate;
- unit and population definition;
- source date/method note where material;
- explicit uncertainty note rather than forced single-number precision.

**Witness/testimony**

- speaker/witness identity when known and appropriate;
- role/relationship to the event;
- place/date or recollection context;
- source-container type and title (interview, diary, memoir, tribunal record, contemporaneous report, etc.);
- quotation status (`direct`, `translated`, `secondary-quotation`, `paraphrase`);
- translation/indirect-source note where applicable;
- exact quoted text when the record is used to render a verbatim testimony block, preventing the quotation and its source metadata from drifting independently.

**Contested/uncertain claims**

- nature of the uncertainty/dispute;
- competing or qualifying source references where applicable;
- approved reader-facing uncertainty statement.

**Legal/institutional findings**

- institution;
- decision/finding identifier and date;
- scope of the finding;
- source reference.

### 7.3 Linking prose to provenance

Markdown remains the authority for authored prose, but claims that require point-of-use provenance reference stable provenance IDs through a small builder-supported editorial token/directive. The exact visible citation style belongs to #9; the architecture contract does not depend on a specific note-number appearance.

The build model is:

```text
Markdown claim/testimony
        ↓ references stable provenance ID
provenance record
        ↓ references one or more stable source IDs
references.json
        ↓
static citation anchor + static full reference
        + optional enhanced source UI
```

The validator must fail the build for unknown/duplicate IDs, unknown source IDs, invalid provenance classes and required class-specific metadata that is missing.

### 7.4 Static citation contract

Every point-of-use citation must have an ordinary HTML path to a full source target, for example `href="#ref-src-dutton-2005"`, with the corresponding reference element owning that durable ID. JavaScript may add a popover, return affordance or richer source context, but it cannot be the only path to the citation.

This satisfies #5’s requirement for point-of-use discoverability and no-JavaScript durability.

---

## 8. Process-synthesis source-of-truth architecture

`03-content/data/process.json` will be the **only authoritative structured definition** of the future Ares process synthesis.

It will contain, at minimum:

- process ID and title;
- editorial status (`draft`, `source-reviewed`, `approved`);
- explicit authorship label identifying it as Ares synthesis;
- basis source IDs;
- nodes with stable IDs, labels, explanatory summaries and source/provenance mappings;
- relationships with stable IDs, relationship type, source/provenance mappings and uncertainty where relevant;
- optional links to glossary terms;
- notes about sequencing/non-determinism where scholarship requires them.

It will **not** be populated in #6 with a final six-stage, eight-stage or replacement taxonomy.

### Representations generated from this source

Once #10 approves the scholarly model, the same loaded `ProcessModel` must feed:

- the static textual process explanation;
- accessible labels and descriptions;
- desktop diagram/SVG data;
- mobile/reflowed representation;
- interactive detail data serialized for enhancement;
- any process-related glossary cross-references.

There will be no replacement for `PROCESS_STAGE_DETAILS` in JavaScript or Python constants. JavaScript receives generated data; it does not own scholarly labels.

The current hand-authored `process-model.svg` is therefore a legacy rendering asset, not a future content authority. #10 may generate an SVG from `process.json` or bind a template to the same data, but labels and relationships cannot be independently maintained inside the SVG.

### Process prose rule

`03-content/sections/process-model.md` may contain contextual argument, caveats and interpretation, but it must not maintain a parallel enumerated copy of the authoritative nodes/relationships. The builder will provide a process-rendering directive/slot for the structured model. Tests must verify that all rendered process representations originate from the same loaded model and that all process/source references resolve.

This is the direct architectural prevention for the six-stage/eight-stage drift identified by #4.

---

## 9. Builder and template ownership

`build.py` remains the stable repository-level command so contributors and CI do not need to learn a new build interface.

`unified_builder.py` should become a thin compatibility/CLI wrapper while responsibility moves into a small Python package under `03-content/build/`.

Target decomposition:

```text
03-content/build/
├── cli.py            # arguments, watch mode, orchestration entry
├── models.py         # dataclasses/enums for publication/case/source/provenance/process
├── loaders.py        # read Markdown/JSON; construct typed models
├── validation.py     # schema, IDs, cross-references, invariants
├── markdown.py       # Markdown adapter + Ares editorial directives
├── rendering.py      # render typed content into template contexts/fragments
├── assets.py         # referenced/allowed asset collection and copying
└── templates/
    ├── document.html
    └── fragments/    # navigation, case, glossary, process, references, etc.
```

This is intentionally modest. It is not a plugin system, dependency-injection framework or generic CMS.

### Responsibility boundaries

- **Loaders** know file formats and paths, not visual markup.
- **Models** describe validated editorial data, not DOM behavior.
- **Validation** owns failures for malformed/contradictory structured inputs.
- **Markdown** converts authored prose and explicit editorial directives; it does not invent case/process facts.
- **Rendering/templates** own semantic document structure and reusable markup.
- **Assets** determine what is shipped; the deployment workflow does not blindly copy the repository asset tree.
- **JavaScript** enhances already-rendered semantic content; it does not become a shadow content database.

The current purpose-built Markdown renderer may remain during early #7/#8 work. Before provenance directives become publication-critical, it should be put behind `markdown.py` and either hardened with tests or replaced with a standards-based Python Markdown parser that supports the required syntax predictably. That is a contained parser choice, not a frontend-framework migration.

---

## 10. Structured validation strategy

Important structured data gets several simple layers of protection rather than one magical validator.

### JSON Schema

Add schemas under `03-content/schemas/` for:

- publication/navigation;
- case metadata/chronology;
- glossary;
- references;
- provenance;
- process synthesis.

Schema validation catches required fields, value types, enumerations and obvious malformed records before rendering.

### Typed Python models

After schema validation, loaders construct `dataclass`/enum models. Rendering consumes these models rather than arbitrary dictionaries. This centralizes meaning such as provenance classes and process status.

### Build-time cross-reference checks

The builder must fail on at least:

- duplicate stable IDs;
- unresolved source/provenance/glossary/case/process IDs;
- duplicate durable HTML anchors;
- navigation entries pointing to missing content;
- case metadata referring to missing case Markdown;
- testimony records missing required context/source fields;
- estimates missing required uncertainty/range treatment when marked uncertain;
- process nodes/relationships without required source mappings once status is `source-reviewed`/`approved`;
- a process representation attempting to use undeclared node/relationship IDs;
- assets referenced by the publication but unavailable.

### Tests

Unit tests cover loaders, directive parsing, ID resolution and renderers. Integration tests build the complete publication from a clean checkout and verify static output invariants.

The full historical source audit remains #9/#10 editorial work; validators enforce structure and consistency, not historical truth by themselves.

---

## 11. Generated-artifact policy

### Decision

**`01-core/index-with-content.html` will cease to be a committed source-controlled artifact.** The target build writes the complete deployable site to untracked `_site/`, with `_site/index.html` as the publication document.

`index-with-content.html` is useful evidence of the current system, but its source-controlled role is rejected for Ares 2.0.

### Why

**Reviewability:** source PRs should show changes to Markdown, structured data, templates, CSS and JavaScript—not a second 162 KB generated diff containing the same content.

**Drift:** deployment already rebuilds. Keeping a committed generated copy creates two apparent states and makes stale output possible.

**Reproducibility:** deterministic generation plus CI is a stronger guarantee than committing the result.

**Debugging:** local `python build.py` and CI-uploaded `_site` artifacts/previews provide the exact rendered output without treating it as source.

**Deployment:** GitHub Pages already deploys an Actions artifact. It does not require generated HTML to live in Git.

### Transition rule

Do not delete `index-with-content.html` in #6 merely to enact the policy. The transition should be deliberate:

1. first make the current build deterministic;
2. while the file remains tracked, CI rebuilds and requires `git diff --exit-code -- 01-core/index-with-content.html`;
3. change the builder to write `_site/index.html` and copy only deployable assets;
4. remove the tracked generated file and add `_site/` to `.gitignore`;
5. replace the old drift check with clean-build reproducibility and deterministic-output checks.

No later feature branch should hand-edit `index-with-content.html`.

### Determinism requirement

For identical tracked inputs and tool versions, two builds must produce byte-identical deployable output. Current wall-clock generator dates and manifest timestamps must therefore be removed, normalized or derived from a reproducible input such as the source revision—not `datetime.now()`.

---

## 12. Target file/folder ownership

The current top-level organization largely survives. Ares does **not** need a repository-wide replatforming.

```text
Ares/
├── build.py                         # stable build entry
├── 01-core/
│   ├── stylesheet.css               # visual source; #8 may split into styles/
│   └── script.js                    # enhancement entry; #7/#10 may split modules
├── 02-assets/
│   ├── images/                      # only purposeful/licensed/referenced media ships
│   └── svgs/                        # visual assets; not scholarly-data authority
├── 03-content/
│   ├── sections/*.md                # publication prose
│   ├── case-studies/*.md            # case prose
│   ├── data/
│   │   ├── publication.json         # hierarchy/order/durable major IDs
│   │   ├── casestudies.json         # case metadata/estimates/structured chronology
│   │   ├── glossary.json            # glossary definitions
│   │   ├── references.json          # stable source registry
│   │   ├── process.json             # one process-synthesis source of truth
│   │   └── provenance/*.json        # claim/testimony/estimate/source mappings
│   ├── maps/                        # map/geographic source data/config
│   ├── schemas/*.schema.json        # structured editorial contracts
│   └── build/                       # Python builder package + templates
├── 04-docs/docs/                    # product/architecture/implementation decisions
├── tests/
│   ├── unit/                        # loaders, validators, renderers
│   ├── integration/                 # clean-build and output invariants
│   ├── browser/                     # Playwright/a11y/progressive-enhancement smoke
│   ├── visual/                      # representative screenshot baselines
│   └── fixtures/                    # small deterministic QA fixtures
└── _site/                           # generated, ignored, deployed artifact only
```

The exact CSS/module split is deliberately left to #8/#10. The ownership boundary is not: CSS/JS source is tracked; generated HTML is not; scholarly facts do not live in JS/CSS/templates.

---

## 13. Build flow

Target build flow:

```text
1. Load publication Markdown + structured JSON
2. Validate JSON schemas
3. Construct typed models
4. Validate IDs, references, provenance and cross-file invariants
5. Render Markdown/editorial directives
6. Render semantic HTML templates from typed models
7. Serialize only enhancement data needed by the browser
8. Collect/copy referenced deployable assets
9. Write _site/index.html + CSS/JS/assets
10. Run output checks
```

Important characteristics:

- the build fails loudly on invalid structured content rather than logging warnings and continuing with missing scholarly data;
- navigation and major anchors are generated from `publication.json` plus validated content IDs;
- comparative case data comes from `casestudies.json`, not Python constants;
- process data comes from `process.json`, not Python/JS/SVG copies;
- references and point-of-use citations come from the reference/provenance model;
- a build manifest, if retained, contains deterministic source hashes/schema versions rather than a wall-clock timestamp.

Local contributor command remains:

```bash
python build.py
```

---

## 14. Deployment flow

GitHub Pages remains the production host.

Target Actions flow:

```text
checkout
→ pin/setup Python + QA runtime
→ install builder/test dependencies
→ validate + build once into _site/
→ run static/browser/a11y/visual checks against that exact _site/
→ upload the tested _site as the Pages artifact
→ deploy the same artifact
```

The deployment job must not independently rebuild a different site after tests pass.

Assets are copied by the builder or an explicit allowlist/referenced-asset manifest. The workflow must stop copying all of `02-assets/` indiscriminately.

No backend, database, server rendering, authentication or CMS is introduced.

---

## 15. Test and QA architecture

Ares 2.0 needs a small enforced quality harness, not a large testing platform.

### 15.1 Build/data gate — required on PRs

- schema validation;
- typed-model/cross-reference validation;
- clean build from tracked sources;
- deterministic double-build/hash comparison;
- transitional generated-file drift check while `index-with-content.html` is still tracked;
- internal anchor/link validation;
- duplicate-ID detection;
- asset-reference validation.

### 15.2 Static HTML gate

Run HTML validation against the built `_site/`. CSS validation may remain where it produces useful signal, but HTML/document correctness is mandatory.

### 15.3 Browser smoke gate

Use Playwright against the built static site, initially in Chromium, with representative viewports including at least:

- phone: approximately 375×812;
- ordinary laptop: approximately 1366×768;
- wide desktop: approximately 1440×900.

Smoke tests should cover durable anchors/deep links, navigation open/close/focus behavior, glossary access, citation/reference navigation, process fallback/enhancement and representative table/long-document behavior.

### 15.4 Progressive-enhancement gate

At least one browser run disables JavaScript and verifies that:

- the title and core publication prose are present;
- major navigation anchors remain usable;
- full glossary content is reachable/readable;
- full references/citations remain reachable;
- the essential process explanation is present in static form;
- no content is hidden solely because enhancement initialization did not run.

### 15.5 Accessibility automation

Integrate axe-style checks into Playwright for representative states/viewports. Automated scanning does not replace keyboard/screen-reader review, but serious automated violations should fail CI once the #12 baseline is established.

Browser tests also need explicit keyboard/focus assertions for the exact classes of defects found in #4: off-screen focus, trigger state, focus visibility, overlay/panel focus restoration and accessible names/states.

### 15.6 Visual QA/regression support

Use Playwright screenshots for a small set of stable representative states rather than one brittle full-document screenshot:

- front matter/long-form typography;
- case opening with testimony and metadata;
- comparative content;
- glossary enhanced state;
- process fallback/enhanced state;
- phone, laptop and wide-desktop navigation.

Baselines live under `tests/visual/` and intentional visual changes require explicit review. #13 remains the final human rendered-QA pass.

### 15.7 Performance checks

Performance should be measured against the real static publication. #12 may establish durable budgets after the redesign has a representative baseline. #6 does not freeze synthetic scores that would pressure later work to remove useful content.

A lightweight CI check should nevertheless report document/CSS/JS/asset sizes and fail obvious deployment mistakes such as shipping unreferenced multi-megabyte media.

---

## 16. Performance implications

### Single long document

The current generated HTML is roughly 162 KB. That is not evidence of a structural bottleneck. A single document provides meaningful benefits for front-to-back reading, search-in-page, durable fragments, printing and JavaScript-independent access.

Ares should remain a single publication unless measurement after #9/#10 shows concrete DOM/rendering or navigation costs that justify section splitting. Framework migration is not a performance optimization here.

### CSS and JavaScript

Current CSS/JS payloads are modest. As interactions grow:

- keep the core enhancement entry small;
- split/lazy-load genuinely expensive features such as future map code/data;
- prefer native HTML/CSS for disclosure/navigation where appropriate;
- do not hydrate static prose;
- do not serialize large duplicate content datasets into JavaScript when the HTML already contains them.

### Assets

The #4 audit found an unreferenced ~2.7 MB PNG copied into the Pages artifact. That is a deployment-hygiene problem, not evidence that runtime application bundling is needed.

The target build copies only referenced/approved assets. Future documentary imagery must carry provenance/rights/caption/alt treatment as required by #5.

### Fonts

Current Google Fonts introduce a third-party request. #8 should decide final typography and may self-host appropriately licensed/subset files or retain robust system fallbacks. Core content and layout cannot become unusable if a font request fails.

### SVG and future maps

The current process SVG is small; its problem is content ownership and mobile representation, not bytes. Future map code/data should be progressively/lazily enhanced and have a meaningful static/text equivalent.

---

## 17. Modernization steps

These steps are deliberately incremental and can be interleaved with the implementation issues without turning Ares 2.0 into a migration programme.

### Step 1 — deterministic build boundary

- remove wall-clock output variance;
- add clean-build/determinism checks;
- establish `_site/` as the target output;
- retain temporary tracked-output drift checking until `index-with-content.html` is retired.

### Step 2 — extract builder concerns

- keep `build.py` stable;
- move loading/models/validation/rendering/assets/templates out of `unified_builder.py`;
- add unit/integration coverage around the current rendered behavior before large changes.

### Step 3 — establish structured publication/references/provenance contracts

- add `publication.json`, `references.json`, schemas and provenance records;
- migrate case metadata from Python constants/incomplete legacy JSON under #9;
- render durable static citation/reference targets.

### Step 4 — establish the process contract

- add an initially draft/empty `process.json` schema/record without choosing scholarly nodes in #6;
- #10 performs the source-mapped content decision and migrates all representations to that model;
- remove `PROCESS_STAGE_DETAILS` and independently authored process labels as content authorities.

### Step 5 — retire committed generated HTML

- change build/deploy/tests to consume `_site/`;
- remove `01-core/index-with-content.html` from version control;
- upload built site artifacts for debugging/review.

### Step 6 — enforce browser/a11y/visual QA

- establish Playwright and representative viewports;
- add JS-disabled checks;
- add axe integration and focused keyboard assertions;
- add screenshot support for #13-quality review.

No step requires #7–#10 to wait for a framework migration.

---

## 18. Explicit non-goals

This decision does not:

- redesign production UI;
- implement #7 navigation/orientation;
- choose #8 fonts, colour tokens or visual treatments;
- rewrite or fact-check #9 case studies;
- choose the final #10 process nodes, sequence or relationships;
- design the #10 process visualization;
- implement #11 motion;
- perform the full #12 accessibility/performance hardening pass;
- perform #13 final rendered QA;
- add React, Astro, Eleventy or another site framework;
- add a backend, database, authentication, API or CMS;
- add client-side routing;
- make basic reading JavaScript-dependent;
- add a generalized plugin architecture;
- perform the full historical source audit.

---

## 19. Constraints handed to #7–#13

### #7 — navigation and orientation

- Use `publication.json`/durable content IDs as the target navigation source rather than adding another hard-coded TOC.
- Preserve deep links and meaningful static navigation.
- JavaScript may manage enhanced state/focus, but navigation cannot depend on a client router.
- Implement the phone and 1280–1366 laptop orientation contract from #5.

### #8 — visual system

- Work in tracked CSS source; do not edit generated HTML.
- Typography/spacing/palette must preserve static semantic markup and WCAG 2.2 AA constraints.
- A CSS split is permitted for maintainability but must still produce a simple static stylesheet surface.
- Font decisions must have robust failure/fallback behavior.

### #9 — case studies, chronology, comparison and provenance

- Migrate reusable case facts, estimates and chronology data out of builder constants/incomplete legacy data into validated `casestudies.json` (or schema-compatible split files if the migration proves materially clearer).
- Introduce stable references/provenance records and static point-of-use citation targets.
- Testimony context and quantitative uncertainty are structured data, not decorative markup.
- Do not silently certify unsourced current claims merely by moving them into the new structure.

### #10 — glossary/process/interactives

- `process.json` is the only future process-model content authority.
- Do not reuse the current eight-stage constants or six-stage prose as an approved taxonomy.
- Source-map and approve nodes/relationships before final persuasive rendering.
- Generate static, mobile and enhanced representations from the same model.
- Glossary content remains statically available; enhanced glossary/process UI must be progressive and accessible.

### #11 — motion

- Enhancement code remains optional; motion cannot contain essential state/content.
- Preserve reduced-motion equivalence and #5’s ethical constraints.

### #12 — hardening

- Finish the CI/browser/a11y/performance gates defined here.
- Establish final performance budgets from measured Ares 2.0 output, not arbitrary framework norms.
- Verify deterministic/static/JS-disabled behavior and all structured-data invariants.

### #13 — final rendered QA

- Review the exact tested/deployable `_site` artifact across representative viewports.
- Treat source/provenance/citation rendering as part of design correctness.
- Use automated visual support as evidence, not a substitute for editorial human review.

---

## 20. Acceptance check for Issue #6

- [x] PR #16 / Issue #5 was merged first; this branch starts at post-merge `main` `af9eaa015d1e06d1081d2516b038ce0ccf3acf70`.
- [x] The #4 audit, #5 brief, superseded Design Vision, build entry point, complete builder responsibilities, generated document, CSS, JS, package/tooling, Pages workflow and relevant content/data structure were reviewed.
- [x] Current Python/static architecture and credible modern static alternatives (Astro and Eleventy) were genuinely evaluated.
- [x] The decision explicitly retains publication-first static generation rather than adopting technology for modernity.
- [x] Core reading, durable anchors, glossary/reference access and process explanation remain available without JavaScript.
- [x] Provenance has a concrete stable-ID, reference-registry, typed-record and point-of-use static-rendering architecture.
- [x] The process explainer has one future structured source-of-truth contract without prematurely choosing scholarly nodes/relationships.
- [x] Builder decomposition and responsibility ownership are explicit.
- [x] Generated/source drift has an explicit transition and prevention strategy.
- [x] `01-core/index-with-content.html` ownership is decided: retire it as a committed artifact after deterministic-output transition; deploy `_site/index.html`.
- [x] Target file/folder ownership is explicit.
- [x] Build and deployment flows are explicit and preserve GitHub Pages.
- [x] QA covers deterministic build, schema/cross-reference validation, HTML/anchors, Playwright, accessibility, representative viewports, visual regression support and JS-disabled behavior.
- [x] Performance analysis distinguishes real browser costs from unreferenced deployment bloat.
- [x] The decision is incremental enough that #7/#8/#9/#10 can proceed without a migration programme dominating Ares 2.0.
