# Lane 2 — Content integrity

**Blocks:** nothing · **Size:** small · **Risk:** low · **Can land first**

The two sharpest ethical findings in the 2.2 review are content-layer defects, not CSS. They
can be fixed independently of everything else and should not wait for the design system.

---

## Problem

### 1. Atrocity keywords are bolded

On `/cases/my-lai-massacre`, the "Atrocity Pattern" section bolds the most violent phrases in
the paragraph: **indiscriminate mass killings**, **Rape and sexual assault**, **torched**,
**livestock slaughtered**, **Mutilation**.

The eye skips across a paragraph of atrocity keywords. There is no analytic reason those
specific phrases are emphasised and others are not — it is inherited Markdown emphasis, passed
through uncorrected. It is the closest thing in the publication to tabloid styling, and it is
the exact "atrocity material becoming aestheticized" failure the brief rules out.

Audit all eight case files; this is unlikely to be confined to My Lai.

### 2. Authored narrative is labelled as witness evidence

`CaseStudy.astro` hardcodes `<p class="evidence-label">Witness / narrative evidence</p>` onto
section A of **every** case, regardless of what section A contains.

For My Lai, section A is an omniscient authored vignette — *"The men of Charlie Company came
into Sơn Mỹ village at dawn…"* — which is Ares's synthesis, not witness testimony.

**A provenance label applied by template position is the same error as colour applied by
template position**, and this one sits on the fact/analysis boundary the project exists to
protect. The publication labels authorship correctly everywhere else; this is the one place
it does not, and it is the most sensitive one.

### 3. Death tolls are styled as administrative fields

`LEGACY ESTIMATE — 347–504` renders in the same 2×2 grid, in the same treatment, as
`PLACE — Quảng Ngãi, Vietnam`. Meanwhile `deathEstimate` already carries `provenanceClass`
and `uncertainty` fields that the interface never surfaces.

### 4. Straight quotes throughout

22 straight double-quotes and zero curly in `framework`; the same pattern corpus-wide, and it
occurs **inside the testimony blockquotes**. Taste v2 §4.10 requires real typographic quotes
in quotations specifically. Only 4 curly doubles and 3 curly apostrophes exist in the whole
corpus.

## Scope

- Strip emphasis-as-sensation from case content. Emphasis stays only where it marks a term of
  art the surrounding analysis depends on.
- Make the section-A label **data-driven** from the section's actual authorship. Add an
  authorship field per section rather than hardcoding a string in the component. My Lai's
  section A becomes *"Narrative written by Ares from the case record."*
- Surface `deathEstimate.uncertainty` next to the figure, and rename `Legacy estimate` to
  something that reads as people rather than as a record type.
- Convert straight quotes and apostrophes to typographic ones across `src/content/`. Watch
  for primes in measurements and for apostrophes at the start of elided years (`'68`).

## Acceptance criteria

- [ ] No `<strong>` in case body content that emphasises a description of violence
- [ ] Section authorship labels derive from data; no hardcoded evidence label in the component
- [ ] Every case's section A label accurately describes what that section is
- [ ] `deathEstimate.uncertainty` renders wherever the estimate renders
- [ ] Zero straight `"` or `'` in prose across `src/content/`
- [ ] Unit tests assert the authorship label matches the section's declared authorship
- [ ] No factual claim altered — this lane changes emphasis, labels and punctuation only

## Note on scholarly control

This lane edits content. Every change is presentational-within-content (emphasis, labels,
punctuation) or additive (surfacing existing uncertainty data). **No claim, figure, date or
attribution is changed.** If any edit would alter meaning, it stops and comes back as a
question.
