# Ares 3.1 real-reader protocol — Issues #46 / #73

**Status:** READY FOR REAL-HUMAN TESTING. No human evidence is recorded here.  
**Readiness issue:** #73. **Human gate:** #46. **Programme authority:** #61. **Home authority:** #70, `Ares_3_1_Final_Home_Communication_Design.md`, `Ares_3_1_Quantitative_Historical_Visualisation_Amendment.md`, and the shipped #71 implementation.  
**Supersedes:** the Ares 2.3 testing assumptions and the #65 chronology-only/ordinal Home baseline previously recorded for #46.

## Exact baseline under test

- `main`: `1bd32106eece1c66adca00429fa6baa12e61a379`
- merged-main deployment/workflow run: `34004407368`
- exact tested/live `dist/index.html` SHA-256: `e394c0b6d7f61f73d7fddb20dfc8f29924ede8993ad7bb07b8b731473c74b50e`
- production origin: https://benwassa.github.io/Ares/

This is the deployed Ares 3.1 slice after #70/#71: the human-first Home, its final quantitative chronology field, and the representative A–G case openings for My Lai and the Ukrainian Holodomor.

The #70 final design/audit decision is binding for this test: Home may geometrically encode **calendar position only**. Recorded case-window duration stays textual because the case boundaries use heterogeneous conventions, and death magnitude is neither encoded nor listed on Home because the current eight estimates are not yet one sufficiently source-traced, commensurable quantity.

The exact #71 Home encoding under test is:

- Hero and historical field use the same **linear 1915–1995 chronology rail** derived from canonical `sortKey` values;
- each case mark is identical;
- mark position is proportional to elapsed calendar time between the earliest and latest canonical anchors;
- chronology/order is fixed and is never a severity, importance or moral ranking;
- each case row prints its place and textual `Recorded case window`;
- duration is not encoded by mark size, length or position;
- no death estimates or death-magnitude encoding appear on Home;
- the post-row boundary note says several case windows are judgement calls and are not a measure of severity or harm.

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
| Home / historical field / thesis / Resume | https://benwassa.github.io/Ares/ |
| Representative case — My Lai | https://benwassa.github.io/Ares/cases/my-lai-massacre |
| Representative case — Ukrainian Holodomor | https://benwassa.github.io/Ares/cases/ukrainian-holodomor |
| Case-window method reached from Home | https://benwassa.github.io/Ares/comparison#tempo |
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

A usable orientation identifies Project Ares as a publication/inquiry or comparable reading project, identifies historical mass killing / organized mass killing as the subject, and understands that the reader can follow the argument and/or enter historical cases. Exact wording is not required.

### T2 — Thesis recognition

Say:

> Now use the page to find what Project Ares is trying to understand. Read until you think you can state the central question or proposition in your own words.

Ask:

> What is the central question or proposition?

Score with the thesis rubric below. Do not require the participant to repeat the authored sentence. The intended substance is that Ares asks **which human and institutional conditions recur across historically unlike cases, and how those conditions can help make organized mass killing possible**. The cases are not presented as interchangeable.

### T3 — Historical field comprehension + case finding

Stay on Home. Ask the participant to use the historical field to find the representative case assigned to this session. **Before they open it**, begin with the unprompted question:

> What is this visual telling you about the eight cases?

Then ask, without explaining the intended answer:

1. What does the position or spacing of the case marks represent?
2. Are the spaces between cases proportional to real calendar time, or merely ordinal/even spacing?
3. Do the identical case marks communicate different death tolls, duration, severity, importance or moral rank? What makes you think that?
4. What historical difference or pattern became easier to understand from the rail?
5. What does the textual `Recorded case window` tell you, and what does it **not** tell you?
6. What do you make of the note that several case windows are judgement calls and are not a measure of severity or harm?

Then let the participant open the assigned case from the field.

Capture:

- **case-finding success**;
- **proportional calendar-position interpretation:** Correct / Partial / Incorrect;
- **false ordinal/even-spacing interpretation:** Yes / No;
- **false mark/position interpretation as death toll, duration, severity, importance or moral rank:** Yes / No;
- **textual case-window boundary comprehension:** Correct / Partial / Incorrect;
- the participant's concise statement of what the rail clarified;
- a concise **Home-load note** if the field felt overloaded or effortful.

Do **not** add a second mental-effort rating here. T4 retains the package's single Paas-style mental-effort measure.

Correct interpretation: the eight anchors are chronological and their positions on the 1915–1995 rail are **proportional to elapsed calendar time**. Repeated marks are identical and encode no death toll, duration, severity, importance or moral rank. The `Recorded case window` is a textual summary of the boundary used for that case study; it is not mark geometry, a common severity measure, or a claim that all eight boundaries were defined by one uniform historical rule. Several boundaries are judgement calls. Home contains no death-estimate visual to interpret.

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

For this testing issue, score against the **shipped representative-case opening** rather than performing new source verification: the opening currently presents the range as two institutional counts of the same morning rather than a confidence interval, says the exact death toll remains debated, and marks the inherited claim `requires source trace`. #73 does not certify that inherited provenance; source-trace remediation belongs elsewhere.

**Ukrainian Holodomor:**

> Project Ares shows an estimated-deaths figure of `3,900,000–7,000,000`. Show me what qualifies that figure and tell me what the status means.

Correct substance from the shipped opening: the legacy estimate is definition-sensitive; exact figures are debated; the endpoints do not necessarily count the same population; `requires source trace` means the inherited claim still needs verification/source tracing. The case also keeps classification limits visible rather than resolving them silently.

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
- **2:** substantially understands that Ares asks which human and institutional conditions recur across historically unlike cases and how those conditions can help make organized mass killing possible.
- **3:** level 2 plus a meaningful guardrail or framework point visible on Home, such as the cases not being interchangeable or the recurring conditions not forming a fixed sequence.

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
- correct identification of proportional **calendar position**;
- false ordinal/even-spacing interpretation yes/no;
- false mark/position interpretation as death toll, duration, severity, importance or rank yes/no;
- textual case-window boundary comprehension;
- one concise statement of what the rail clarified and a Home-load note if needed;
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
- ≥80% correctly identify proportional calendar position on the historical rail;
- no systematic false reading of the rail as ordinal/even spacing or as death-toll/duration/severity/importance/rank encoding;
- ≥80% understand `Recorded case window` at the intended level: a textual, case-specific recorded boundary that is not a severity measure or uniform geometric encoding;
- ≥80% correctly distinguish first reading from deliberate depth;
- ≥80% locate and correctly interpret the prompted uncertainty/provenance state;
- ≥80% resume to the correct case/context.

Report the single T4 mental-effort distribution/median, the Home-load note and grouping observations; there is no invented numeric pass threshold or assumed Ares 2.3 comparison. A severe ethical/comprehension failure can require AMEND even when a percentage threshold is met.

## Readiness dry-run — not human evidence

**Date:** 2026-09-06.  
**Pinned deployment:** `1bd32106eece1c66adca00429fa6baa12e61a379` / run `34004407368` / index SHA-256 `e394c0b6d7f61f73d7fddb20dfc8f29924ede8993ad7bb07b8b731473c74b50e`.

The merged-main workflow completed successfully. Its `build-and-verify` job ran full `pnpm check`; the exact tested Pages artifact was then deployed; the `verify-live` job confirmed the production origin matched the tested artifact.

A moderator-path dry-run was performed only for **routes, instructions and expected interpretations** against that exact deployed artifact. Artifact inspection confirmed:

| Contract | Result |
| --- | --- |
| Home identifies Project Ares as eight historical cases of mass killing across 1915–1995 | PASS |
| Hero and historical field carry the same eight canonical chronology positions from 0% to 100% on the 1915–1995 rail | PASS |
| Historical-field text explicitly says position is proportional to calendar time | PASS |
| Case marks share one identical mark treatment; no mark size/length varies by case | PASS |
| Home lists textual `Recorded case window` values and the judgement-call / not-severity-or-harm boundary note | PASS |
| Home contains no `Estimated deaths` field or death-estimate values | PASS |
| Home links to both representative cases and exposes the Resume hook | PASS |
| My Lai and Ukrainian Holodomor retain the representative A–G opening/provenance tasks used by T4–T7 | PASS |
| Home, both representative cases, `/comparison#tempo` and `/references` exist in the exact deployed artifact | PASS |

This dry-run proves only that the protocol is executable on the pinned production artifact. It says nothing about reader comprehension, mental effort, grouping, rail interpretation or Resume usefulness.

## Gate boundary

Use one copy of `Ares_3_1_Human_Testing_Session_Record.md` per real reader and aggregate only real-reader evidence in `Ares_3_1_Human_Testing_Decision_Record.md`.

Until those sessions exist and the decision record contains an explicit **ACCEPT**, **AMEND** (with required rechecks completed before rollout), or **REJECT**, **#46 remains open and #47 and #48 remain blocked**.
