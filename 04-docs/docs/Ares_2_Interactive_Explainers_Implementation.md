# Ares 2.0 — Issue #10 Interactive Explainers Implementation

Status: **Issue #10 implementation candidate**  
Branch: `ares-2/10-interactive-explainers`  
Base: post-#6 `main` at `ad33a84f7508f91c0c7efe19f125d551498748fa`

This record captures the scholarly and interaction decisions implemented for Issue #10. It is subordinate to the Ares 2.0 Product/Editorial/Design Brief (#5) and Architecture Decision Record (#6).

## 1. Scholarly process-model decision

Ares 2.0 does **not** ship either legacy taxonomy:

- the six-part “escalation ladder” previously authored in `process-model.md` is not an authenticated Dutton, Boyanowsky & Bond model;
- the eight-stage SVG/Python structure resembles part of Gregory Stanton's stage framework and was not validly attributed as a Dutton-derived model.

The implemented replacement is:

> **Ares synthesis: interacting processes in extreme mass homicide**

It is a source-reviewed Ares editorial synthesis of processes discussed by Dutton, Boyanowsky & Bond (2005), represented as **four interacting domains rather than stages**.

The decision not to use a ladder is substantive. Dutton et al. move among sociopolitical structure, target selection and perceived threat, official sanction/organization, and multiple theories of perpetrator transition. They also qualify causal generalizations: for example, racial/ethnic conflict is described as neither necessary nor sufficient, and later sections distinguish long-term from short-term transitions and preserve individual variation.

### Final domains

| Ares synthesis domain | What it groups | Source mapping in Dutton et al. (2005) |
| --- | --- | --- |
| Structural conditions and grievance | sociopolitical structure; political organization; historical conflict; need frustration; grievance and perceived unfairness | Abstract p. 437; §§8–9, pp. 453–455 |
| Target-group construction and perceived threat | selection or invention of an out-group; fear; conformity; polarization; generalized threat; contaminating/viral representations | §10, pp. 455–457; §10.1, pp. 457–458 |
| Authorization and organized implementation | elimination policy; planning; official sanction/exhortation; command and local organizational capacity | §8, pp. 453–455; §10.2, p. 458 |
| Perpetrator transition and violence dynamics | multiple transition theories; long-term shaping/desensitization; short-term situational transition; violence dynamics; individual variation | §§15–18, pp. 464–469 |

The complete machine-readable source mapping is in `03-content/data/process.json` and is the only structured process authority.

### Relationship model

Relationships use qualified verbs — **can shape**, **can enable**, **changes conditions**, **can reinforce** — rather than deterministic arrows. They are not a chronology. The static explainer explicitly states that domains may overlap, recur and reinforce one another.

The synthesis also carries explicit limits:

- no domain is a necessary or sufficient cause;
- no fixed temporal sequence is claimed;
- genocide and military massacre are not treated as interchangeable;
- individual participation is not automatic;
- denial is not imported as a terminal process stage.

### Stanton decision

No Stanton stage content is included in the Part IV synthesis. Because Issue #10 does not need Stanton to explain the paper, adding a parallel external framework would increase conceptual load without advancing the central argument. If Stanton is added later, #5 requires it to be separately attributed and visually/content-wise distinct from the Ares/Dutton synthesis.

## 2. Source-of-truth implementation

`03-content/data/process.json` now owns:

- process identity and title;
- `source-reviewed` editorial status;
- explicit Ares authorship label;
- basis source IDs;
- source metadata used by this scoped implementation;
- domain labels, summaries and detailed explanations;
- glossary cross-references;
- relationships and qualified relationship types;
- source locators and explanatory source notes;
- non-determinism and scope limitations.

`03-content/schemas/process.schema.json` records the structured contract. The current incremental builder additionally fails on unresolved domain/source/glossary references, duplicate IDs, non-reviewed status, or attempts to introduce stage/step keys into process domains.

The source registry embedded in `process.json` is deliberately limited to the source mapping needed by #10. When #9 introduces the shared `references.json` registry, `src-dutton-2005` should be reconciled into that registry without changing the stable ID.

## 3. Process interaction pattern

The legacy desktop SVG is no longer rendered by the Ares 2.0 build path.

The replacement uses semantic HTML `<details>/<summary>` groups generated from `process.json`:

- one vertical, comfortably tappable structure on phones;
- the same semantic structure can use a restrained two-column layout at wider widths;
- open/closed state is native and exposed to assistive technology;
- keyboard activation is native;
- no SVG text is scaled to illegible phone sizes;
- full explanatory text and source locators exist in HTML before JavaScript runs;
- relationships and model limits are always present as text;
- optional JavaScript records selected/open state but does not create or own explanatory content.

This is intentionally closer to an editorial explanatory figure than to a stage-selector widget.

## 4. Glossary model

### Discovery rule

A glossary term is linked only on its **first occurrence within a major editorial reading unit** (front-matter group, analytical section, or case study). This preserves discoverability for nonlinear entry into a case while avoiding repeated-link noise in sustained prose.

### Static contract

Each cue is a normal anchor:

`href="#glossary-{stable-key}"`

Every glossary entry owns the corresponding durable target in Appendix B. With JavaScript disabled, selecting a cue simply navigates to the complete definition. Deep links to glossary entries therefore remain normal document URLs.

### Enhanced contract

When JavaScript is available, the same anchor opens a native `<dialog>` containing:

- term;
- short definition;
- extended definition;
- source context when the glossary record provides it;
- related terms;
- a normal link to the durable full glossary entry.

The enhancement:

- does not depend on hover;
- works with mouse, touch and keyboard;
- uses a real dialog and real button;
- gives Escape its native dismissal behavior;
- places focus on the close button on entry;
- restores focus to the originating term on close without scrolling the reader away;
- leaves modified-click behavior (new tab/window) to the anchor;
- renders as a bottom sheet on narrow phones and a restrained dialog on wider screens.

The old hover tooltip and pseudo-button glossary interaction are not used by Ares 2.0 cues.

### Process-linked glossary corrections

Glossary entries that encoded the rejected stage assumptions were revised narrowly. In particular:

- `escalation` no longer names the legacy six-part sequence;
- `denial` no longer claims to be the final stage of an Ares/Dutton model;
- `situationalTransition` now reflects the paper's multiple long-/short-term transition discussions;
- `groupPolarization` and `dehumanization` are described as mechanisms/conditions rather than universal stages.

This is a consistency correction inside #10, not a general glossary fact-check.

## 5. Maps decision

**Defer interactive maps from Ares 2.0.**

The decision is documented at `03-content/maps/README.md`. The prepared configuration is retained only as research-draft/legacy material.

Reasons:

1. only three of eight cases have prepared configurations;
2. referenced geography datasets are absent from the repository;
3. prepared coordinates, boundaries, routes, counts and labels have not received the provenance treatment required by #5/#6;
4. there is no complete textual-equivalent/accessibility contract;
5. no current map interaction is necessary to understand the paper or Ares's cross-case argument.

Shipping a novelty map because configuration data exists would reduce rather than improve evidentiary quality.

## 6. Progressive enhancement fallback

The no-JavaScript experience retains:

- normal linked glossary cues;
- complete Appendix B glossary definitions;
- durable glossary anchors;
- the complete four-domain process synthesis;
- native process disclosure using `<details>/<summary>`;
- relationship prose;
- source mappings;
- model limitations;
- the Appendix C Dutton source target.

JavaScript improves glossary context and focus return only. It does not own the existence of a definition or process claim.

## 7. Builder integration strategy

Parallel implementation is active across Issues #7–#10. To avoid unnecessarily rewriting the shared 43 KB legacy builder while #7/#9 also work from the same base, Issue #10 adds `03-content/build/ares2_builder.py` as a scoped subclass/transition layer.

`python build.py` remains the stable repository command and now routes through that Ares 2.0 builder. The extension replaces only Issue-10-owned output while delegating navigation, case rendering and other publication structure to the existing builder.

This is not a second content authority:

- process content comes only from `process.json`;
- glossary content comes only from `glossary.json`;
- the extension explicitly rejects generated output containing `ARES_PROCESS_STAGES` or the legacy process SVG class;
- `explainers.css` and `explainers.js` are source files that the builder inlines into generated output, so Pages does not require a parallel asset-pipeline change.

During integrated reconciliation, the subclass methods should be folded into the #6 target builder modules/templates rather than preserving a permanent inheritance layer.

## 8. Targeted QA

Issue #10 adds two layers of focused tests:

### Contract/build checks

`tests/issue10_contract_test.py` verifies:

- process IDs, sources and relationships resolve;
- process structure is non-sequential and explicitly Ares-authored;
- legacy six-/eight-stage output is absent;
- process-linked glossary definitions no longer encode the rejected stage model;
- glossary cues are durable anchors and their targets exist;
- generated process domains and source links exist;
- the glossary dialog exists;
- map deferral is documented.

### Browser checks

`tests/browser/issue10-explainers.mjs` uses Chromium/Playwright to verify:

- glossary open/close by pointer/keyboard semantics;
- focus entry and focus restoration;
- Escape dismissal;
- durable glossary-anchor navigation;
- native process disclosure state;
- JavaScript-disabled glossary and process fallbacks;
- no horizontal overflow attributable to the Issue #10 explainer at phone/laptop/desktop representative widths;
- rendered screenshots at 375×812, 1366×768 and 1440×900 plus a phone glossary-open state.

The PR-only workflow uploads those screenshots as `issue10-rendered-evidence`. This targeted harness is intentionally narrow; #12 remains responsible for the integrated repository-wide accessibility/performance gate.

## 9. Integration points with parallel branches

### #7 navigation

- Part IV's reader-facing label changes from “Process Model” to “Process Synthesis”; #7 should preserve the durable `#part-iv` anchor and use that editorial label when its structured navigation source is reconciled.
- Glossary dialog does not modify browser history, so it should compose with #7's history/navigation work.

### #8 visual system

- `01-core/explainers.css` is deliberately scoped and minimal.
- #8 is the authority for final type, palette, spacing and surface tokens; reconcile the local explainer rules into #8 tokens without changing semantic interaction behavior.
- The process treatment intentionally avoids card/elevation-heavy styling so #8 can absorb it without a competing design system.

### #9 case/provenance work

- Stable source ID `src-dutton-2005` should move into/reuse #9's shared `references.json` registry.
- `process.json` source mappings should then reference that shared record rather than duplicate bibliographic metadata.
- #10 does not create case-level provenance or alter case chronology.

### Shared builder

- `build.py` is changed to keep the stable command while routing through the scoped Ares 2.0 extension.
- During reconciliation, keep #10's glossary/process semantics and validation while integrating them into whichever shared builder decomposition lands from the parallel work.

## 10. Explicit non-changes

Issue #10 does not:

- redesign global navigation behavior;
- establish the final shared visual system;
- redesign case-study grammar or chronology;
- add motion polish;
- claim a predictive atrocity-risk model;
- source-certify map configuration data;
- silently rewrite case-level historical claims.
