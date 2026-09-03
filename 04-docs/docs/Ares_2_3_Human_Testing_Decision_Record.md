# Ares 2.3 human-testing decision record — Issue #46

**Status:** Awaiting real-reader evidence. No architecture decision has been selected.  
**Pinned implementation baseline:** `adcd53ebf68335fad7a97f2ad6beac5bbd361666`  
**Deployment/workflow run:** `33704829404`  
**Live/tested `dist/index.html` SHA-256:** `84eacff8fc3056db9b648d277e235bba0de702cabb2e125fa5678fd78055b1b3`  
**Production origin:** https://benwassa.github.io/Ares/

This record must be completed from real-reader session records only. Automated browser results, screenshots, AI review and moderator dry-runs prove test readiness; they do **not** count toward any numerator, denominator, median, quote set or architecture decision.

## Sample

- Real sessions completed: `__ / target 5–8`
- Non-specialist readers: `__`
- Scholarly/history-adjacent readers: `__`
- Android-class phones: `__`
- iOS phones: `__`
- 390–430 px class: `__`
- 320–360 px/accessibility-scaling stress readers: `__`
- Sessions excluded and why:

## Threshold summary

| Product gate | Result | Evidence / severity note |
| --- | --- | --- |
| ≥80% explain Ares and distinguish Guided reading from Full publication | `__/__` | |
| ≥80% find Rwandan Genocide without a wrong-route loop | `__/__` | |
| Median My Lai comprehension ≥2/3 | `__` | |
| ≥80% locate and correctly interpret prompted provenance | `__/__` | |
| ≥80% identify essential vs optional layers | `__/__` | |
| ≥80% place tested child screens under the correct parent | `__/__` | |
| ≥80% resume to the correct conceptual screen | `__/__` | |
| Mental effort improves vs valid comparable baseline without lower comprehension, where comparison exists | `__` | |
| No participant reports progress/navigation pressure to continue through traumatic detail | `__/__` | |

Do not convert these gates into a composite score. With 5–8 participants they are formative evidence, not inferential statistics.

## Task synthesis

### Opening / choice architecture

- Correct Ares description:
- Guided / Explore cases / Full publication distinctions:
- Time-to-orientation pattern:
- Home three-choice surface confusion or success:

### Case findability

- Success rate:
- Wrong-route loops:
- Contents use:
- Recurrent route confusion:

### My Lai comprehension and reading flow

- Median comprehension:
- Mental-effort distribution/median:
- Essential units commonly completed:
- Optional Scholarly depth open rate:
- Analytical finding reach rate:
- Place-loss incidents:
- Fragmentation/step-count incidents:
- Abandonments attributable to screen count:

### Provenance

- Correct source-status findability:
- Correct interpretation of `requires source trace`:
- Parent-return behavior from child screens:
- Confusion between case-level and unit-level source status:

### Essential / optional / hierarchy

My Lai:
- Four essential units recognized:
- Scholarly depth recognized as optional:
- Five screens understood as one case:
- Key evidence understood as subset:

Framework:
- Three child screens recognized:
- Scope & purpose and Definitions & typology recognized as essential:
- Theoretical lenses recognized as depth:
- Parent chooser useful / redundant / mixed:

### Resume

- Correct screen recovery: `__/__`
- Parent topic recovered: `__/__`
- Continue noticed without coaching: `__/__`
- Median seconds to context:
- Previously / Next useful / neutral / annoying:
- Next-day subset, if run:

### Comparison

- Parent-choice expectations:
- Tempo comprehension:
- Non-equivalence qualification retained:
- Full matrix/depth found:
- Mental effort:

### Deep-link orientation and navigation expectation

- Direct Key evidence orientation:
- Visible parent recovery:
- Browser Back expectation mismatches:
- Copied Tempo link orientation:

### Reader agency / traumatic detail

- Agency rating pattern:
- Any pressure to continue:
- Any task stopped/skipped because of content:
- Any design change required for ethical control:

## Qualitative findings

High-salience observations, paraphrases or consented anonymous quotations:

1.
2.
3.
4.
5.

Do not include identifying details.

## Research hypotheses

For each, mark **supported / weakened / contradicted / insufficient evidence** and explain briefly.

| Hypothesis | Verdict | Evidence |
| --- | --- | --- |
| A parent screen as one grouping/decision context reduces overload | | |
| Separate child routes improve orientation more than they fragment reading | | |
| Essential/depth labels make reading obligations legible | | |
| Screen-level resume restores context effectively | | |
| Provenance remains findable after splitting manuscript into screens | | |
| Dimension-first comparison is clearer than exposing the full matrix first | | |
| Home's three choices are understandable without directory content | | |

## Required changes, if any

Only list changes supported by real-reader evidence. Keep #47 blocked while unresolved core changes remain.

| Severity | Evidence | Required change | Tasks to recheck |
| --- | --- | --- | --- |
| | | | |

## Architecture decision

Select exactly one after the evidence is reviewed:

- [ ] **ACCEPT** — the tested Ares 2.3 architecture is ready for rollout.
- [ ] **AMEND** — make only the evidence-required changes above, then recheck the affected tasks before rollout.
- [ ] **REJECT** — do not roll out this architecture.

Decision rationale:

> _Awaiting real-reader evidence._

Decision date:
Reviewer:

## Gate statement

Until a real-reader evidence set and explicit decision are recorded here, **#46 remains open and #47 remains blocked**. Readiness QA alone cannot authorize rollout.