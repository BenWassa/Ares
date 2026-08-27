# Ares 2.0 Case-Study Editorial Grammar

**Status:** Issue #9 implementation record  
**Authority:** #5 product/editorial brief and #6 architecture decision record  
**Scope:** Case-study presentation, structured chronology and cross-case comparison only

## 1. Editorial decision

The eight historical cases remain the evidentiary centre of Part II, but they no longer render as repeated card stacks with equally weighted subsections. The production grammar now separates four reader tasks:

1. **Orient:** identify the case, place/time, current Ares classification and scale/context.
2. **Understand why it is present:** a short statement explicitly labelled **Ares synthesis** explains the case's role in the publication's comparative argument.
3. **Encounter narrative and quoted evidence:** the opening prose remains human-scale, while quoted material is treated as evidence with attached attribution/context and provenance status rather than as a decorative pull quote.
4. **Reconstruct and analyze:** historical context, chronology, atrocity pattern, psychological/social interpretation and aftermath/accountability are visually sequenced rather than placed inside one equal-weight analytical card.

This implementation deliberately does not create a new global visual system. Case-study CSS is scoped and uses shared-token hooks with fallbacks so Issue #8 remains the visual authority during reconciliation.

## 2. Structured source-of-truth migration

`03-content/data/casestudies.json` is now the single structured source for all eight cases' reusable metadata and chronology, as required by #6.

It owns:

- durable case ID and source filename;
- navigation title;
- chronological ordering key;
- current Ares classification;
- location and opening place/time context;
- period/duration display;
- quantitative death-estimate display;
- primary-method display;
- Ares-authored statement of the case's role in the argument;
- quoted-evidence context metadata;
- structured chronology.

The lettered case Markdown files remain authoritative for authored narrative and analytical prose. Their **C. Chronology of Events** blocks now contain only a migration comment; the chronology itself is rendered from `casestudies.json`. This removes the previous Markdown/Python duplication rather than adding a third representation.

The old Python `CASE_STUDIES` facts are no longer used as scholarly content authority. `case_study_builder.py` adapts the structured JSON into the legacy builder's navigation/body interface until the broader #6 builder decomposition lands.

## 3. Content-integrity boundary

Issue #9 is a structural/editorial implementation, not a retrospective historical-source audit. The migration therefore does **not** certify the legacy claims it moves into structured data.

Every migrated classification, quantitative estimate, chronology event and quoted-evidence attribution carries `sourceStatus: "requires-source-trace"`. Death estimates also carry the #6 provenance class `quantitative-estimate` and a local uncertainty note where the existing case text already signals dispute.

The production rendering states, quietly but explicitly, that source-level trace is pending. This is preferable to manufacturing source IDs or making legacy metadata look newly verified.

### High-priority source-trace concerns discovered

The following are not corrections. They are implementation findings that require source-level verification before Ares should treat them as publication-certified historical claims:

- **Armenian Genocide:** period/scale metadata conflict existed between the old three-case JSON (`1915–1923`) and the rendered Python metadata/current case title (`1915–1917`); the migration preserves the rendered/current case wording rather than silently choosing a new historical period.
- **Holodomor:** intentionality/genocide framing, the `3.9–7 million` estimate, the claim that deaths peaked around ten thousand per day, and several policy-causation statements need explicit sources and uncertainty treatment.
- **Nanking:** the `200,000–300,000` estimate, command-responsibility language, and claims including reported killing contests require traceable sourcing and qualification where scholarly dispute is material.
- **My Lai:** the `347–504` estimate, command-order characterization, sexual-violence claims and legal/accountability figures require source-level mapping.
- **Cambodia:** the `1.5–3 million` estimate, S-21 counts/survival wording, attributed regime slogan and legal classifications require specific source records.
- **El Mozote:** casualty/child counts, Rufina Amaya testimony chain, forensic-exhumation figures, and U.S./Salvadoran denial/complicity claims require explicit provenance.
- **Rwanda:** `800,000–1,000,000`, “fastest”/comparative-rate language, plane-assassination attribution and other causal claims require careful source mapping rather than rhetorical certainty.
- **Bosnia/Srebrenica:** war and Srebrenica death estimates, institutional/legal genocide findings, quotation attribution and the scope of legal determinations should resolve to named ICTY/ICJ records rather than generic bibliography.

Vivid scene reconstruction throughout all eight openings also requires source trace under #5's narrative-integrity rule. No sensory detail was expanded or invented in this implementation.

## 4. Case opening grammar

Each case opens with:

- `Case N of 8 · Part II` orientation;
- the existing case title;
- place/time context;
- **Why this case is here · Ares synthesis**;
- a plain definition-list fact block for classification, period/duration, estimated deaths and location;
- a concise provenance-status note.

The previous thematic epigraphs were project-written Python strings with no explicit authorship cue. They are no longer rendered. The argument-role sentence replaces their orientation function and is explicitly labelled as Ares synthesis.

Metadata is not rendered as chips, badges or KPI cards.

## 5. Narrative and quoted evidence

The narrative opening is differentiated from analysis using multiple non-colour signals:

- a `Narrative evidence` label;
- narrower measure and a left rule;
- different section rhythm;
- a separately labelled evidence block;
- attached attribution/context and provenance status.

Quoted material uses ordinary `<blockquote>`/`<cite>` semantics without giant quotation marks, oversized display type, quote cards or theatrical styling.

The structured evidence record describes what the current text claims about the quotation without inventing a primary source. Rufina Amaya's quotation is explicitly marked `secondary-quotation` because the displayed words are presented through her recollection of her son. The Khmer Rouge slogan and Judge Fouad Riad statement are not mislabeled as survivor testimony.

## 6. Analytical hierarchy

The five analytical blocks retain their authored order but gain explicit editorial roles:

- **Historical record** — Historical Context
- **Sequence** — Chronology of Events
- **Observed pattern** — Atrocity Pattern
- **Interpretation** — Psychological & Societal Drivers
- **Consequences and accountability** — Aftermath & Legacy

This preserves the useful cross-case grammar while making interpretation visibly different from descriptive record. No historical prose was rewritten to manufacture stronger distinctions.

## 7. Chronology

Chronology is a semantic ordered list generated from structured data.

At wider widths each event uses a date column and event column. At phone widths it reflows vertically, keeping the date immediately above the event. Exact dates use `<time datetime="…">` where an unambiguous machine-readable date already exists; ranges and broad periods remain textual rather than being given false precision.

There is no horizontally scaled desktop timeline, tiny label geometry or JavaScript dependency.

The structured order was also used to correct the production **case sequence** itself. The previous Python list described itself as chronological but began with Nanking before Armenia and the Holodomor. Part II now follows the cases' chronological sort keys. This changes document ordering only; it does not rewrite any event chronology.

## 8. Comparative-data decision

Ares keeps a descriptive comparison rather than adding filters, sorting controls, dashboards, KPI cards or severity ranking.

- **Tablet/laptop/desktop:** a semantic table preserves row/column scanability.
- **Phone:** the same structured source renders as stacked case records, avoiding a mandatory horizontal table gesture.
- **No JS:** both forms exist in static HTML; CSS chooses the appropriate reading form.

Casualty estimates remain one descriptive field among classification, period, method and location. Introductory copy explicitly states that the comparison is not a ranking and estimates are not a proxy for significance.

## 9. Validation and rendered evidence

Issue #9 adds focused QA without taking over the programme-wide #12 accessibility hardening scope.

`tests/test_case_studies.py` verifies:

- exactly eight unique structured cases;
- true chronological ordering;
- source/provenance-status invariants;
- Markdown no longer owns chronology data;
- semantic chronology and attached evidence context;
- both desktop and phone comparison forms;
- absence of case epigraph/chip rendering and severity/score language.

`tests/render_case_evidence.py` verifies rendered output in Chromium at:

- 390×844 phone;
- 768×1024 tablet;
- 1280×800 laptop;
- 1366×768 laptop;
- 1440×900 desktop;
- JavaScript-disabled phone mode.

The browser gate checks viewport overflow, chronology legibility/structure, correct phone-vs-table comparison presentation, point-of-use provenance status and static/no-JS availability. It captures Nanking across representative tiers plus a structurally different My Lai phone render.

## 10. Integration boundaries

### #8 visual system

`01-core/case-studies.css` is deliberately scoped. It uses `--ares-*` hooks with neutral fallbacks and does not establish global typography or palette tokens. During reconciliation, #8 should absorb or remap those hooks while preserving the semantic hierarchy and responsive behavior.

### #7 navigation

Case IDs remain durable. Navigation still receives the same IDs/titles from the structured case source; #7 can build previous/next/current-location behavior without extracting case facts from Python.

### #10 explainers

No glossary or process interaction was redesigned. The case builder continues using the existing glossary-linking renderer. #10 should not create a second case chronology system.

### Future provenance implementation

#6 defines `references.json` and `provenance/*.json` as the publication-ready source registry and provenance store. Issue #9 provides the point-of-use semantic hooks and explicit pending states, but does not fabricate reference records that do not yet exist. When source mapping is completed, those pending statuses should resolve to durable citation anchors rather than being hidden.
