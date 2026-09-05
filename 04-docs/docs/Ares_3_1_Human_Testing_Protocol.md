# Ares 3.1 real-reader protocol — Issues #46 / #65

**Status:** READY FOR REAL-HUMAN TESTING. No human evidence is recorded here.  
**Readiness issue:** #65. **Human gate:** #46. **Programme authority:** #61. **Editorial authority:** #62 and `Ares_3_1_Human_First_Mobile_Editorial_System.md`.  
**Supersedes:** the Ares 2.3 testing assumptions and routes previously recorded for #46.

## Exact baseline under test

- `main`: `583967e9d2ff529aa5978dcc66114cb65a1c7bd5`
- merged-main deployment/workflow run: `33977674768`
- exact tested/live `dist/index.html` SHA-256: `89e82561cf104ea82ec743b654375f5461e6382572736d4edae151c4b03c45eb`
- production origin: https://benwassa.github.io/Ares/

This is the deployed Ares 3.1 slice after #63 and #64: the human-first Home, its chronology-only historical field, and the representative A–G case openings for My Lai and the Ukrainian Holodomor.

## Evidence boundary

Only **real-reader sessions** count toward #46. CI, browser automation, screenshots, AI review, artifact inspection and moderator dry-runs are readiness evidence only. They must not become participant rows, task results, quotations, medians, percentages or an ACCEPT / AMEND / REJECT decision.

Test the publication, not the participant. Do not coach toward a label or control. A wrong interpretation is product evidence. Extended traumatic detail is never required for task success, and a participant may pause, skip or stop at any time.

Target **5–8 adult mobile readers** where practical, with a mix of non-specialist and scholarly/history-adjacent readers. Prefer real 390–430 CSS-pixel phones; include a narrower or enlarged-text reader where practical. This is a formative product gate, not an inferential study.

Alternate the representative case by session so both openings receive evidence without doubling the session:

- odd-numbered sessions (`P01`, `P03`, …): **My Lai**;
- even-numbered sessions (`P02`, `P04`, …): **Ukrainian Holodomor**.

If only one session can be run, use My Lai and record that Holodomor remains untested rather than inferring parity.

## Live routes

Use production, not screenshots, localhost or a branch preview.

| Purpose | Live URL |
| --- | --- |
| Home / proposition / historical field / Resume | https://benwassa.github.io/Ares/ |
| Representative case — My Lai | https://benwassa.github.io/Ares/cases/my-lai-massacre |
| Representative case — Ukrainian Holodomor | https://benwassa.github.io/Ares/cases/ukrainian-holodomor |
| Duration/scale explanation reached from Home | https://benwassa.github.io/Ares/comparison#tempo |
| Publication references/provenance utility | https://benwassa.github.io/Ares/references |

## Moderator opening

> We are testing a mobile publication, not testing you. The subject includes genocide, massacres and other mass killing. You may pause, skip material or end the session at any time, and you never need to open more detailed material merely because it is available.
>
> I will give you a few tasks and mostly stay quiet. Please use the site as you naturally would. If something is confusing, do what you would normally do rather than trying to guess what I want.
>
> I may time the first task and take anonymous notes about what you understand and where the interface helps or gets in the way. There is no required prior knowledge.

Record quotation consent separately if quotations will be retained. Do not collect unnecessary identifying information.

## Participant tasks

### T1 — 10-second Home orientation

Open Home at the top. Say:

> Look at this page. As soon as you think you know what it is and what subject it covers, say “ready.”

Start the timer when Home is visible. Stop when the participant says ready, or at **10 seconds**. Do not scroll or explain the page before the answer. Then ask:

1. What is Project Ares?
2. What subject is it about?
3. What do you think you can do here?

Capture **orientation success and time only**, plus the participant's concise answer.

A usable orientation identifies Project Ares as a publication/inquiry or comparable reading project, identifies military massacre/genocide/extreme mass homicide as the subject, and understands that the reader can follow the argument and/or enter historical cases. Exact wording is not required.

### T2 — Thesis recognition

Say:

> Now use the page to find what Project Ares is arguing. Read until you think you can state the central proposition in your own words.

Ask:

> What is the central proposition or question?

Score with the thesis rubric below. Do not require the participant to repeat the authored sentence. The important distinction is that Ares asks how extreme mass homicide becomes possible across unlike cases **without treating those cases as one phenomenon or ranking them by severity**.

### T3 — Historical field comprehension + case finding

Stay on Home. Ask the participant to find the representative case assigned to this session **using the historical field**. Before they open it, ask:

> What is this visual telling you about the eight cases?

Then let them open the assigned case.

Capture:

- **case-finding success**;
- **chronology interpretation:** Correct / Partial / Incorrect;
- the participant's explanation of the visual.

Correct interpretation: the cases are ordered by chronology; the repeated marks are identical case markers; spacing is **ordinal, not proportional**; mark size/position does **not** encode death toll, severity or moral rank. Dates, spans and classifications retain source-trace status. A reader does not need to recite every point, but any interpretation as a severity/death-toll scale is incorrect.

### T4 — Representative case-opening skim comprehension

On the assigned case, say:

> Read the opening the way you naturally would. Stop when you think you understand the case well enough to explain it. Do not open the complete record just because this is a test.

Then ask:

1. What happened?
2. Why is this case in Project Ares?
3. What is the central finding?

Score **case-opening comprehension 0–3** using the rubric below.

Immediately ask the Paas-style item:

> How much mental effort did that reading task require?

Record **1–9**, where 1 = very, very low mental effort and 9 = very, very high mental effort.

### T5 — Information load / grouping

Ask only:

1. Did any section feel overloaded or like too much was presented at once? If so, which one and why?
2. Was the next action clear?
3. What seemed essential, and what seemed like deeper or optional material?

Capture concise **overload/grouping notes** and **essential-vs-depth recognition**: Correct / Partial / Incorrect.

The authored contract is that identity/standing facts, `What happened`, `Why this case is in Project Ares`, `Central finding`, and `Essential reading` form the first reading layer. `The complete record` / `Open the complete record` is deliberate scholarly depth. Do not teach that distinction before the answer.

### T6 — Scholarly-depth discoverability

Say:

> Without my telling you where it is, show me where you would go for the complete case record, fuller evidence and scholarly depth.

Stop when the participant identifies the correct entry. They do **not** need to read the extended material.

Record whether the participant finds the entry and understands it as deliberate depth **inside the existing essential-vs-depth recognition measure from T5**. Do not create a separate depth-discovery metric.

### T7 — Uncertainty / provenance discovery

Use the prompt for the assigned case without teaching the answer.

**My Lai:**

> Project Ares shows an estimated-deaths figure of `347–504`. Show me what qualifies that figure and tell me what the status means.

Correct substance: two institutional counts of the same morning rather than a confidence interval; the exact death toll remains debated; `requires source trace` means the inherited claim still needs verification/source tracing, not that it has been certified.

**Ukrainian Holodomor:**

> Project Ares shows an estimated-deaths figure of `3,900,000–7,000,000`. Show me what qualifies that figure and tell me what the status means.

Correct substance: the legacy estimate is definition-sensitive; exact figures are debated; the endpoints do not necessarily count the same population; `requires source trace` means the inherited claim still needs verification/source tracing. The case also keeps classification limits visible rather than resolving them silently.

Capture **uncertainty/provenance discovery**: Success / Partial / Fail and the participant's interpretation. They may use the visible opening, complete-record provenance or References; do not prescribe a route.

### T8 — Interruption / Resume

JavaScript and ordinary browser storage must be enabled for this task. After the participant has worked in the assigned case, interrupt with a neutral **3–5 minute** break or have them leave the browser. Then return through Home and say:

> Continue from where you believe you left off.

Capture:

- whether the compact Resume affordance is noticed without coaching;
- **resume success**: correct representative case restored and participant can state what they were doing there;
- any concise grouping note if Resume distracts from or dominates Home.

The current contract is case/screen-level Resume. Do not fail a participant because the exact paragraph or internal section is not restored.

## Scoring rubrics

### Thesis comprehension (0–3)

- **0:** no usable proposition or materially wrong account.
- **1:** identifies the subject only, with no comparative question/claim.
- **2:** substantially understands that Ares asks how extreme mass homicide becomes possible across unlike cases and does not equate/rank them.
- **3:** level 2 plus a meaningful part of the recurrence or uncertainty stance (recurring organisational/psychological conditions; uneven records kept visibly qualified).

### Case-opening comprehension (0–3)

- **0:** materially wrong account of the case or no usable answer.
- **1:** broad event identified, but why the case matters to Ares and the central finding are both absent or mistaken.
- **2:** `What happened` is substantially correct and either the Ares role or central finding is substantially correct.
- **3:** all three are substantially correct, with a meaningful limitation/qualification preserved where it affects interpretation.

Do not reward specialist terminology or prior historical knowledge.

## Measures and formative gates

Capture only:

- orientation success + time;
- case-finding success;
- thesis comprehension;
- case-opening comprehension;
- correct interpretation of the chronology visual;
- essential vs depth recognition;
- provenance/uncertainty discovery;
- resume success;
- one 1–9 Paas-style mental-effort rating after T4;
- concise overload/grouping notes.

For a 5–8-reader formative round, use these as decision aids rather than statistical claims:

- ≥80% achieve usable Home orientation within 10 seconds;
- ≥80% find the assigned case from the historical field;
- median thesis comprehension ≥2/3;
- median case-opening comprehension ≥2/3;
- ≥80% correctly interpret the historical field, with no systematic severity/death-toll reading;
- ≥80% correctly distinguish first reading from deliberate depth;
- ≥80% locate and correctly interpret the prompted uncertainty/provenance state;
- ≥80% resume to the correct case/context.

Report the mental-effort distribution/median and grouping notes; there is no invented numeric pass threshold or assumed Ares 2.3 comparison. A severe ethical/comprehension failure can require AMEND even when a percentage threshold is met.

## Readiness dry-run — not human evidence

**Date:** 2026-09-05.  
**Pinned deployment:** `583967e9d2ff529aa5978dcc66114cb65a1c7bd5` / run `33977674768` / index SHA-256 `89e82561cf104ea82ec743b654375f5461e6382572736d4edae151c4b03c45eb`.

The merged-main workflow completed successfully: `pnpm check`, exact-artifact deployment and live verification all passed. Live verification matched the expected index SHA and checked 14 publication routes, 2 document assets and 9 stylesheet assets.

A moderator-path dry-run was performed only for **links and instructions** against the exact Pages artifact produced and deployed by run `33977674768`; the live verifier confirms that exact tested index is what the production origin serves. The artifact check found:

| Contract | Result |
| --- | --- |
| Home carries Project Ares identity, required descriptor/deck and proposition | PASS |
| Home carries `Eight cases · 1915–1995` and the ordinal/not-ranked chronology explanation | PASS |
| Home links to both representative cases and exposes the Resume hook | PASS |
| My Lai exposes `What happened`, `Why this case is in Project Ares`, `Central finding`, `Essential reading`, deliberate depth, `347–504`, its qualification and `requires source trace` | PASS |
| Ukrainian Holodomor exposes the same A–G opening grammar, `3,900,000–7,000,000`, its definition-sensitive qualification and `requires source trace` | PASS |
| Home, both representative cases, `/comparison#tempo` and `/references` exist in the exact deployed artifact | PASS |

This dry-run proves only that the protocol is executable on the pinned production artifact. It says nothing about reader comprehension, mental effort, grouping or Resume usefulness.

## Gate boundary

Use one copy of `Ares_3_1_Human_Testing_Session_Record.md` per real reader and aggregate only real-reader evidence in `Ares_3_1_Human_Testing_Decision_Record.md`.

Until those sessions exist and the decision record contains an explicit **ACCEPT**, **AMEND** (with required rechecks completed before rollout), or **REJECT**, **#46 remains open and #47 and #48 remain blocked**.
