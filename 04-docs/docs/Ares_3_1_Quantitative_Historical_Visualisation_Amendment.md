# Ares 3.1 — quantitative historical visualisation amendment

**Status:** Authoritative amendment to `Ares_3_1_Human_First_Mobile_Editorial_System.md` for quantitative historical visualisation.
**Parent programme:** #61.
**Supersedes:** the blanket prohibition in §5.1, §5.3–§5.7 and the categorical `Death-toll data visualisation — Reject` ruling in §7 of `Ares_3_1_Human_First_Mobile_Editorial_System.md`, wherever those clauses prohibit quantitative encoding in principle rather than rejecting a specific unsupported encoding.
**Does not supersede:** chronology-first ordering, anti-ranking ethics, provenance requirements, uncertainty requirements, trauma-aware restraint, no decorative atrocity imagery, or the rule that no historical claim may be strengthened to make a visual work.

---

## 1. Why this amendment exists

Ares 3.1 correctly rejected atrocity ranking and correctly identified real comparability problems in the current eight-case death-estimate data. It went too far when it converted those findings into a permanent prohibition on quantitative geometry.

That prohibition treats visualisation itself as the problem. The actual product question is narrower:

> **Which historically meaningful quantitative dimensions can Ares make perceptible without asserting a comparison the underlying evidence cannot support?**

A weak visual can mislead. So can suppressing meaningful differences behind identical marks. Equal-sized marks are not neutral when cases differ materially in duration, scale, geography or evidential status.

The goal is therefore neither "show the biggest death toll" nor "never show scale." The goal is defensible visual explanation.

---

## 2. Locked rule

> ### Defensible quantitative-encoding rule
>
> **Ares may visualise a quantitative historical dimension when the underlying quantities are sufficiently comparable for that specific encoding and the visual is explicitly framed as representing that dimension only. No visual dimension may be described, styled, ordered or interpreted as atrocity severity, historical importance, moral worth or competitive rank.**
>
> If the evidence does not support a proposed common scale, that encoding is rejected on measurement and provenance grounds — not because quantitative visualisation is categorically forbidden.

This is now the governing rule.

### Consequences

1. **Chronological order remains fixed.** Cases are never reordered by toll, duration, geography, classification or any other magnitude.
2. **Quantitative variation is permitted in principle.** Length, area, position, bands, ranges or other channels may be used only when the represented quantity is sufficiently commensurable and the channel is appropriate for the audience and viewport.
3. **The encoded dimension must be named.** `Deaths`, `duration`, `estimated deaths`, `named victims`, `geographic extent`, etc. are not interchangeable labels.
4. **No geometry may silently choose among incompatible quantities.** A compound field such as a whole-war total plus a massacre subset must be resolved editorially and evidentially before it can drive a mark.
5. **Ranges are not automatically uncertainty intervals.** Two institutional counts, definitional ranges and statistical confidence intervals must not be rendered as though they mean the same thing.
6. **Textual caveats do not rescue invalid geometry.** If the visual assertion is false or materially misleading before the reader opens a note, the visual fails.
7. **A strong visual is allowed to simplify presentation, not evidence.** It may reduce prose burden while preserving the real limits of the source record.

---

## 3. What remains prohibited

The amendment does **not** permit:

- sorting cases from smallest to largest or largest to smallest;
- language such as `severity`, `worst`, `greater atrocity`, `more important`, `rank` or equivalent visual framing;
- KPI tiles that turn deaths into competitive dashboard metrics;
- decorative accumulation, counters, animated body counts, pulsing marks, spectacle or game-like progression;
- converting ranges to midpoints merely for easier drawing;
- using one aggregate field when its components measure different populations/scopes without a documented choice;
- hiding `requires-source-trace` or other uncertainty/provenance states when they materially affect interpretation;
- claiming direct comparability merely because two fields are both called `deathEstimate`;
- using a visual whose main effect is emotional shock rather than historical explanation.

---

## 4. Required audit before a new Home scale ships

Ares must audit the actual eight canonical case records before choosing a quantitative Home treatment.

For each candidate dimension, document:

- exact quantity represented;
- numerator/population counted;
- case boundary and time window;
- whether the number is direct killing, broader mortality, a named-victim count, a subset, combatant-inclusive, or another construct;
- source status and trace completeness;
- whether a lower/upper value is a statistical interval, definitional range, competing institutional count, or something else;
- whether comparison with the other seven cases is substantively valid;
- what information would be lost by reducing it to one visual value.

A candidate common scale must fail if the audit shows that it requires materially unlike constructs to be treated as one measurement.

---

## 5. Candidate Home treatments to evaluate

The next design/research batch must evaluate the real data rather than inherit a predetermined answer. At minimum test these three treatments:

### A. Chronology + duration + textual death estimate

- chronological order remains the spine;
- duration may receive visual length/extent **only if case-boundary definitions are sufficiently consistent**;
- death estimates remain textual beside each case with their real range/status;
- useful if tempo is the most defensible shared quantitative dimension.

### B. Chronology + magnitude bands/ranges

- broad, explicitly named orders of magnitude or estimate bands rather than precise proportional geometry;
- may be more honest when exact point comparability is weak but coarse human-scale differences are still defensible;
- bands must not manufacture thresholds unsupported by the source record;
- actual display estimate/range remains visible in text.

### C. Chronology + proportional magnitude

- allowed only if a source audit establishes a sufficiently common construct across all plotted cases, or across a clearly labelled subset;
- geometry must be mathematically and perceptually appropriate;
- minimum-size/capping rules must not destroy the encoded relationship;
- if phone constraints make a valid common scale unreadable, reject this treatment rather than distort it.

The design/research batch may propose a stronger fourth treatment, including small multiples, if it better satisfies the rule.

---

## 6. Duration, geography and other dimensions

Death estimates are not the only possible quantitative dimension.

Ares should prefer the dimension that best serves the thesis and survives source scrutiny.

Potential dimensions include:

- **duration / tempo** — often analytically relevant to Ares, but case-boundary definitions must be audited;
- **calendar position** — already safely comparable and should remain the organising order;
- **geographic spread** — only with sourced historical boundaries and a defensible common definition of extent;
- **estimated deaths / victims** — potentially powerful, but only after the commensurability audit above;
- **named/identified victims** — may be meaningful for specific cases but usually cannot be compared corpus-wide as though absence of names means fewer deaths.

A Home visual does not need to encode every dimension at once. One dominant visual job per section still governs.

---

## 7. Human-first interpretation requirement

The purpose of quantitative visualisation on Home is to reduce cognitive work, not add a methodology puzzle.

A successful treatment should let a first-time reader perceive, with minimal prose:

- that the eight cases occur across different historical periods;
- that they differ materially in tempo and/or human scale where the evidence supports saying so;
- that those differences do not make them morally rankable;
- that Project Ares is interested in recurring enabling conditions across unlike events.

If understanding the visual requires a paragraph of defensive explanation before the reader can use it, the treatment is too complex for Home.

Methodological detail may sit one layer away, but the visual itself must remain truthful without that detail.

---

## 8. Relationship to the current Ares 3.1 Home

The current chronology-only historical field is a valid **baseline**, not the final authority on visual communication.

Its strengths remain:

- fixed chronological order;
- direct case entry;
- accessible ordered-list semantics;
- no false precision;
- no severity ranking.

Its weaknesses are now explicit:

- identical marks suppress meaningful differences;
- ordinal spacing communicates little beyond sequence;
- the field is predominantly a styled list rather than explanatory visualisation;
- it leaves the reader to construct human scale and tempo from text.

Future implementation may replace or extend that treatment after the audit/design gate.

---

## 9. Testing requirement

Any revised Home quantitative treatment must be tested with real readers for interpretation, not merely rendering correctness.

At minimum ask:

1. What does the varying visual dimension represent?
2. What does a larger/longer/different mark **not** mean?
3. Are the cases being ranked in your reading of the graphic?
4. What historical difference did the graphic make easier to understand?
5. Did uncertainty/ranges remain understandable without overwhelming the Home section?

A treatment that readers systematically interpret as moral/severity ranking must be amended or rejected even if its mathematical encoding is technically correct.

---

## 10. Implementation boundary

Do not change production Home geometry directly from this amendment.

The next sequence is:

1. high-reasoning agent audits the canonical data and compares candidate treatments against this rule;
2. the chosen treatment is documented with exact data/encoding contracts;
3. a regular implementation agent builds only that approved treatment;
4. the real-reader package is repinned to the new deployed Home before participant evidence is collected.

No corpus-wide historical rewrite is authorized by this amendment.
