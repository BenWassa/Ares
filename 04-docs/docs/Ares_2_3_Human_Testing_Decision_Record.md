# Ares 2.3 human validation decision record — Issue #46

**Status:** Template only. Do not select a decision until real-reader sessions have been completed and aggregated.  
**Prototype baseline:** `caf4fa95a5bcf3447c4117108af6f257f5555c4a`  
**Protocol:** `04-docs/docs/Ares_2_3_Human_Testing_Protocol.md`  
**Session template:** `04-docs/docs/Ares_2_3_Human_Testing_Session_Record.md`

## 1. Evidence set

**Decision date:**  
**Session IDs included:**  
**Session IDs excluded from any metric and why:**  
**Number of real readers:**  
**Non-specialist readers:**  
**Scholarly/history-adjacent readers:**  
**Android sessions:**  
**iOS sessions:**  
**Narrow 320–360 px stress sessions, if any:**  
**Larger-text/display-scaling sessions, if any:**  
**Ares 2.2 baseline comparison run:** Yes / No  
**If Yes, exact baseline artifact/origin and counterbalancing method:**  

Only real-reader results belong in this evidence set. Do not count AI review, automated browser tests, screenshots, moderator rehearsals, or the protocol dry run as participants.

### Anonymous participant/device table

Keep this table non-identifying. Age band and accessibility presentation settings are optional; do not record diagnoses or other sensitive personal information.

| Session | Cohort | Device | OS / browser | Viewport / orientation | Text/display scaling | Notes affecting comparability |
| --- | --- | --- | --- | --- | --- | --- |
| P__ | | | | | | |

## 2. Gate table

Use numerators and denominators rather than rounded percentages alone. `SKIPPED` tasks caused by participant agency should be reported separately; do not silently remove them from the narrative. If a product defect blocked a task, record the defect and treat the gate as unresolved until the task can be validly rerun.

| Gate | #46 threshold | Observed | Result |
| --- | --- | --- | --- |
| Home orientation | ≥80% correctly explain Ares and distinguish Guided reading from Full scholarly publication | `__/__ = __%` | PASS / FAIL / UNRESOLVED |
| Case findability | ≥80% find the specified Rwandan Genocide case without a wrong-route loop | `__/__ = __%` | PASS / FAIL / UNRESOLVED |
| Case comprehension | Median My Lai comprehension ≥2/3 | `median __; distribution __` | PASS / FAIL / UNRESOLVED |
| Provenance findability + meaning | ≥80% locate and correctly interpret the My Lai source-status signal | `__/__ = __%` | PASS / FAIL / UNRESOLVED |
| Essential vs optional | ≥80% correctly distinguish first-pass material from scholarly depth | `__/__ = __%` | PASS / FAIL / UNRESOLVED |
| Resume | ≥80% return to the correct conceptual unit after interruption | `__/__ = __%` | PASS / FAIL / UNRESOLVED |
| Mental effort versus comparable Ares 2.2 baseline | Prototype median at least 1 point lower without lower comprehension | `prototype __; baseline __; Δ __; comprehension comparison __` | PASS / FAIL / NOT TESTED |
| Trauma-aware agency | No participant reports that progress controls pressured them to continue through traumatic detail | `0/__ pressured` or describe | PASS / FAIL / UNRESOLVED |

### Comparative mental-effort evidence rule

The production-only #46 readiness package does not provide a separate Ares 2.2 public baseline. Absolute 1–9 effort scores are still valid observations, but they do **not** prove improvement over Ares 2.2.

If the baseline comparison is not run, mark the gate `NOT TESTED`. Do not convert a low absolute score into a comparative pass. If the programme requires the one-point comparative threshold for ACCEPT, #46 remains blocked until a valid baseline is supplied or the gate itself is explicitly amended by the issue owner with rationale.

## 3. Supporting measures

### Orientation and agency

| Measure | Aggregate |
| --- | --- |
| Median T1 orientation confidence, 1–7 | |
| Median “I always knew where I was”, 1–7 | |
| Median “I knew what was essential and what was optional”, 1–7 | |
| Median “The amount presented at once felt manageable”, 1–7 | |
| Median “I could stop without feeling I had lost my place”, 1–7 | |
| Median “The interface added unnecessary strain”, 1–7 — lower is better | |
| Median central-argument confidence, 1–7 | |
| Median traumatic-detail control, 1–7 | |

### Comprehension and effort detail

| Measure | Aggregate |
| --- | --- |
| T3 My Lai comprehension median / distribution | |
| T3 mental-effort median, 1–9 | |
| T7 comparison comprehension median / distribution | |
| T7 mental-effort median, 1–9 | |
| Comparison non-equivalence correctly explained | `__/__` |

### Resume detail

| Measure | Aggregate |
| --- | --- |
| Median seconds to regain context | |
| Correct unit + near-section recovery | `__/__` |
| Continue affordance noticed without coaching | `__/__` |
| Previously/Next useful / neutral / annoying | `__ / __ / __` |
| Next-day subset result, if run | |

### Reading behavior

| Measure | Aggregate / pattern |
| --- | --- |
| Essential unit abandonment/pausing | |
| Voluntary scholarly-depth opening during T3 | |
| Re-reading/backtracking pattern | |
| Comparison depth discoverability | |
| Complete matrix discoverability | |
| Recurrent wrong turns | |

## 4. Failure-point log

List repeated failure points before proposing fixes. A repeated observation across independent participants is stronger than a single solution request.

| Failure point | Sessions | Severity | Evidence | Hypothesis — not yet a fact |
| --- | --- | --- | --- | --- |
| | | Critical / High / Medium / Low | | |

Critical examples include: materially wrong comprehension induced by the architecture; uncertainty/source state hidden by disclosure; inability to resume; navigation loops; required analytical understanding forcing extended traumatic detail; comparison being read as a severity/equivalence ranking.

## 5. Participant quotations

Include only short anonymous quotations from sessions with quote consent. Remove incidental identifying details.

- 

## 6. Changes implied by evidence

Separate changes required to pass the gate from optional refinements.

### Required amendments

| Amendment | Evidence | Prototype surface only? | Human recheck required | Owner/status |
| --- | --- | --- | --- | --- |
| | | Yes / No | Task(s) T__ | |

### Optional follow-ups

- 

Do not use #46 to begin mass migration. If an amendment requires implementation, change only the validated prototype/shared infrastructure necessary to test that amendment, then rerun the affected human task(s).

## 7. Decision

Select exactly one after reviewing the evidence.

### ACCEPT

Choose **ACCEPT** only when the evidence supports rolling out the architecture and all required gate conditions have been satisfied or explicitly resolved. Record any non-blocking refinements separately.

**Decision:** ACCEPT / not selected  
**Rationale:**


**Accepted architecture behaviors to freeze for #47:**

- 

**Non-blocking refinements allowed during rollout:**

- 

### AMEND

Choose **AMEND** when the architecture remains plausible but one or more prototype behaviors require correction before corpus rollout.

**Decision:** AMEND / not selected  
**Failed or unresolved gates:**  
**Exact prototype amendments required:**

- 

**Human tasks to rerun:**  
**AMEND-complete criteria:**

- the named prototype amendments are merged and live;
- affected tasks are rerun with real readers rather than inferred from automated QA;
- updated evidence is appended to #46;
- the decision record explicitly changes to `AMEND — complete for rollout` or ACCEPT;
- no unresolved amendment still affects the architecture being rolled out.

Until those conditions are met, #47 remains blocked.

### REJECT

Choose **REJECT** when the central essential/depth, orientation, or stop/resume architecture is not supported by the evidence, or when fixing the failures would amount to a materially different architecture rather than an amendment.

**Decision:** REJECT / not selected  
**Evidence:**


**Rejected architecture assumptions:**

- 

On REJECT, do not generalize the prototype schema, migrate additional cases/framework/comparison material, or open a #47 implementation PR. Return to a separately scoped architecture/design decision before any rollout.

## 8. #47 release of the block

Issue #47 may begin only when this record contains one of:

1. **ACCEPT**, with the accepted behaviors stated; or
2. **AMEND — complete for rollout**, with real-reader recheck evidence satisfying the named amendment criteria.

The #47 implementation agent must cite the exact #46 decision-record commit SHA it is using. A prose comment saying “testing looked good” is not sufficient evidence to release the block.
