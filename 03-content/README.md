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
│   └── glossary.json            # current glossary data
├── maps/
│   └── interactive-maps.json    # map/geographic configuration
└── build/
    └── unified_builder.py       # current static publication builder
```

Run the publication build from the repository root:

```bash
python build.py
```

## What is authoritative today

The repository is in an architecture transition after Issue #6.

- `sections/*.md` is the authored source for publication prose.
- `case-studies/*.md` is the authored source for case narrative/analytical prose.
- `glossary.json` is the current glossary-definition source.
- The current builder still contains eight-case metadata and navigation constants used in production.
- `casestudies.json` currently contains only three cases and is therefore **not yet a complete production source of truth**.
- Process content is currently duplicated across prose, glossary data, Python constants and the legacy SVG. Neither existing six-stage nor eight-stage representation is approved as the Ares 2.0 process authority.
- `01-core/index-with-content.html` is generated output. Do not edit it as source.

Do not add new duplicated facts to these transitional structures merely because an existing duplication is present.

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

Schemas will live under `03-content/schemas/` and the build will validate IDs and cross-references before rendering.

### Ownership rules

- **Publication prose:** Markdown under `sections/`.
- **Case prose:** Markdown under `case-studies/`.
- **Reusable case facts, quantitative estimates and structured chronology:** validated case data after #9 migration.
- **Glossary definitions:** `glossary.json`.
- **Source metadata:** `references.json`.
- **Point-of-use claim/testimony/estimate provenance:** structured provenance records referencing stable source IDs.
- **Process synthesis:** `process.json` only after #10 source-maps and approves the scholarly model.
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

#5 rejected both current legacy taxonomies as authoritative Ares 2.0 content. #10 will determine the final source-mapped Ares synthesis.

Architecture rule: once `process.json` is approved, static prose/list output, glossary cross-references, diagram labels, interactive detail and mobile representation must all derive from that same structured model. Do not add another stage list to Markdown, Python, JavaScript or SVG.

## Generated output

The accepted architecture will retire committed `01-core/index-with-content.html` after a deterministic-build transition. The target deployment artifact is untracked `_site/` produced by `python build.py` and tested before GitHub Pages deploys it.

Until that transition lands, the tracked generated file exists only as compatibility output and should be checked for drift—not hand-edited.
