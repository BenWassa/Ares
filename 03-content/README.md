# Ares Content Sources

This directory contains the authored and structured source material used to build the Ares publication.

**Architecture authority:** [`../04-docs/docs/Ares_2_Architecture_Decision_Record.md`](../04-docs/docs/Ares_2_Architecture_Decision_Record.md)  
**Product/editorial authority:** [`../04-docs/docs/Ares_2_Product_Editorial_Design_Brief.md`](../04-docs/docs/Ares_2_Product_Editorial_Design_Brief.md)

## Current structure

```text
03-content/
├── sections/                    # main analytical/publication Markdown
├── case-studies/                # one Markdown source per historical case
├── data/
│   ├── casestudies.json         # legacy/incomplete structured case data
│   ├── glossary.json            # current glossary data
│   └── process.json             # source-reviewed Ares process synthesis (#10)
├── schemas/
│   └── process.schema.json      # structured process contract
├── maps/
│   ├── interactive-maps.json    # legacy/research-draft map configuration
│   └── README.md                # Ares 2.0 map ship/defer decision
└── build/
    ├── unified_builder.py       # current shared static publication builder
    └── ares2_builder.py         # scoped Ares 2.0 explainer integration (#10)
```

Run the publication build from the repository root:

```bash
python build.py
```

## What is authoritative today

The repository is in an architecture transition after Issue #6.

- `sections/*.md` is the authored source for publication prose.
- `case-studies/*.md` is the authored source for case narrative/analytical prose.
- `glossary.json` is the glossary-definition source.
- `process.json` is the only structured source for the source-reviewed Ares process synthesis introduced by #10.
- The current shared builder still contains eight-case metadata and navigation constants used in production.
- `casestudies.json` currently contains only three cases and is therefore **not yet a complete production source of truth**.
- The legacy process SVG and eight-stage constants remain transitional repository artifacts only; the Ares 2.0 build path rejects generated output that contains them.
- `01-core/index-with-content.html` is generated output. Do not edit it as source.

Do not add new duplicated facts to transitional structures merely because an existing duplication is present.

## Accepted Ares 2.0 target ownership

Issue #6 retains the Markdown/JSON → Python → static HTML model but replaces ambiguous ownership with explicit structured sources.

Target additions under `03-content/data/` are:

```text
publication.json          publication hierarchy/order and durable major IDs
casestudies.json          complete reusable case metadata/estimates/chronology
references.json           stable bibliographic/source registry
process.json              one source-mapped Ares process-synthesis definition
provenance/*.json         claim/testimony/estimate provenance records
```

Schemas live under `03-content/schemas/`; the build validates IDs and cross-references before rendering as each structured source is migrated.

### Ownership rules

- **Publication prose:** Markdown under `sections/`.
- **Case prose:** Markdown under `case-studies/`.
- **Reusable case facts, quantitative estimates and structured chronology:** validated case data after #9 migration.
- **Glossary definitions:** `glossary.json`.
- **Source metadata:** shared `references.json` once #9 lands; #10 currently preserves stable process source ID `src-dutton-2005` for reconciliation.
- **Point-of-use claim/testimony/estimate provenance:** structured provenance records referencing stable source IDs.
- **Process synthesis:** `process.json`.
- **Navigation hierarchy:** structured publication data rather than a second hard-coded TOC.
- **Rendered HTML/SVG/interactive details:** generated consumers, never independent scholarly authorities.

If the same scholarly datum is needed in multiple representations, structure it once and render it multiple times.

## Case-study content

The useful A–F case grammar remains a product/editorial pattern:

1. opening narrative/testimony context;
2. historical context;
3. chronology;
4. atrocity pattern;
5. psychological/societal drivers;
6. aftermath/legacy.

The old instruction to make the opening “cinematic” is superseded. Under the Ares 2.0 brief, narrative detail must be evidentiary and respectfully sourced; testimony is evidence rather than decorative quotation.

#9 owns the migration of case metadata, estimates, chronology and provenance. Do not treat moving an existing claim into JSON as historical verification.

## Process content

#5 rejected both legacy taxonomies as authoritative Ares 2.0 content. #10 source-mapped the replacement against Dutton, Boyanowsky & Bond (2005).

The accepted Issue #10 candidate is a non-linear **Ares synthesis of four interacting domains**:

- structural conditions and grievance;
- target-group construction and perceived threat;
- authorization and organized implementation;
- perpetrator transition and violence dynamics.

It is not presented as a Dutton-authored stage model, prediction score, or universal sequence. Domain claims, relationships, limits and source locators live in `process.json`. `sections/process-model.md` contains only framing/caveats and must not grow a parallel enumerated taxonomy.

Static disclosure, wider-screen arrangement and optional interaction are generated from the same process data. The legacy `02-assets/svgs/process-model.svg` is not rendered by the Ares 2.0 build path and is not a scholarly authority.

## Glossary content

Glossary cues link the first occurrence within each major editorial reading unit. The link target is always a durable `#glossary-{key}` entry in Appendix B.

JavaScript may open the definition in a contextual dialog and restore focus to the cue, but it does not own the definition or the link. Without JavaScript, cues remain normal fragment links to the complete glossary.

## Maps

Interactive maps are **deferred from Ares 2.0**. See `maps/README.md` for the decision record.

`maps/interactive-maps.json` is retained as legacy/research-draft material, not a production source of truth. Prepared configuration alone is not sufficient reason to ship a map, and the existing data has not yet met the project's geographic provenance and accessibility requirements.

## Generated output

The accepted architecture will retire committed `01-core/index-with-content.html` after a deterministic-build transition. The target deployment artifact is untracked `_site/` produced by `python build.py` and tested before GitHub Pages deploys it.

Until that transition lands, the tracked generated file exists only as compatibility output and should be checked for drift—not hand-edited.
