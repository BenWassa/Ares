# Ares 2.3 representative mobile-reading prototype — Issue #45 handoff

## Scope and stop boundary

This document describes the **P1 representative vertical slice only**. It starts from Ares 2.2 `main` at `a09832631a496025c91a1e852a8e1950ddf2fc0c` and implements the architecture needed for Issue #45. It does **not** migrate the other seven cases, the remaining framework corpus, or all comparison themes. Issue #46 owns real-reader validation; Issue #47 may not begin until that human gate accepts or amends the model.

The prototype preserves the Ares 2.2 production path: Astro static output, strict TypeScript, Zod validation, native routes and fragments, no-JS essential reading, progressive enhancement only for local resume state, and the existing source/provenance contracts.

## Content-layer contract

`src/content/data/mobile-reading-prototype.json` is validated by `MobileReadingPrototypeSchema` and describes five cognitive/editorial roles:

| Layer | Job in the prototype |
| --- | --- |
| `essential` | Claim, principal evidence and any qualification whose absence would change meaning or confidence. |
| `evidence` | Additional chronology, testimony and evidentiary detail for close inspection. |
| `method` | Legal, definitional and methodological reasoning behind categories and comparisons. |
| `interpretation` | Extended analysis and counter-interpretation beyond the minimum first pass. |
| `source-provenance` | Trace status, source mappings, bibliographic apparatus and unresolved source debt. |

The layer contract is **not** a second manuscript. My Lai chronology, evidence, metadata and A–F prose remain authoritative in `cases.json` and `src/content/cases/my-lai-massacre.md`. The prototype stores selectors into those records. The definitions typology terms are stored once in the validated prototype record; `definitions-typology.md` carries the long-form framing rather than a duplicate table.

Interpretation-critical caveats are deliberately outside closed disclosures. In particular, comparison-not-equivalence, legal-category boundaries, case-classification complexity, My Lai source debt and estimate uncertainty remain visible in the essential reading state.

## Prototype route map

```text
/                                  Goal choice + optional local Continue
|
|-- /framework                     Concise framework orientation
|    `-- /framework/definitions-typology
|          Bounded essential unit + full scholarly framing
|
|-- /cases                         Existing eight-case archive
|    `-- /cases/my-lai-massacre    Representative essential/depth case unit
|          `-- #full-scholarly-depth
|
`-- /comparison                    Findings + one tempo dimension
     `-- #full-comparison-depth     Figure + complete matrix + manuscript

Research utilities (not ordinary previous/next chapters):
/glossary
/references
```

All other case routes remain on the Ares 2.2 renderer for this issue.

## Stop and resume

The no-JS truth is the route and fragment architecture: each prototype unit has a named beginning, stable IDs, native links and authored Previous/Next orientation. JavaScript adds only local browser state in `ares:reading-position:v1`. It records the last named prototype route and major section and can expose `Continue: …` on the home page. The home control clears the state completely. No account, backend or runtime-generated summary exists.

## Trauma-aware case pacing

The My Lai prototype keeps a concise factual orientation, the existing core narrative, four canonical chronology points, the existing focal testimony provenance, an analytical finding and its limitation in the first layer. Extended atrocity pattern, full chronology, wider psychological/societal interpretation and aftermath remain available under **Open full scholarly depth**. The reader can choose **Continue to analysis** or **Pause here** without the interface treating traumatic-detail consumption as an achievement.

The source-trace warning remains visible before optional depth. The prototype does not certify legacy estimates, quotations or inherited case claims.

## Comparison prototype

The primary mobile interaction is question-led: one dimension, **tempo**, held stable across the eight cases. It is explicitly not a severity scale. The existing duration figure, complete matrix and full comparative manuscript remain available in the same canonical route under scholarly depth rather than being the first mobile task.

## Automated and rendered evidence

`tests/browser/prototype-45.spec.ts` owns the issue-specific rendered QA. It captures the prototype at 390, 430, 768 and 1440 px in Chromium and also exercises 200% text scaling, keyboard disclosure, reduced motion, deep links, JavaScript-disabled reading, local resume recovery/clearing, horizontal overflow, and access to full scholarly depth. The existing three-browser Playwright suite remains part of `pnpm check`.

CI uploads `release-evidence/` and the exact tested `dist/` artifact. These checks establish implementation correctness and rendered readiness; **they do not establish lower cognitive load or better comprehension**.

## Human-test handoff for Issue #46

The following remain intentionally provisional hypotheses for real-reader testing:

- whether the home’s three goal choices are immediately understandable;
- whether a bounded Definitions & typology unit feels complete rather than fragmented;
- whether My Lai’s orientation and five named stages preserve enough context while reducing apparatus competition;
- whether `Continue to analysis`, `Pause here` and `Open full scholarly depth` communicate agency without euphemism or pressure;
- whether local resume restores the reader’s conceptual task after interruption;
- whether a tempo-first comparison is easier to integrate before the complete matrix;
- whether the amount and placement of visible uncertainty/source debt is sufficient and intelligible;
- whether the approximate 500–900-word target and current subsection density should be retained, amended or rejected.

Issue #46 must use real readers and produce an **ACCEPT / AMEND / REJECT** decision. Automated QA, screenshots and AI review are not substitutes for that gate.
