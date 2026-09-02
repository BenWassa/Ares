# Ares 2.3 human mobile validation protocol — Issue #46

**Status:** Ready for real-reader sessions; no human evidence is recorded in this document.  
**Issue:** #46 — P2 human mobile validation gate  
**Prototype baseline:** `caf4fa95a5bcf3447c4117108af6f257f5555c4a`  
**Production origin:** https://benwassa.github.io/Ares/  
**Gate boundary:** Issue #47 remains blocked until #46 records real-reader evidence and an explicit **ACCEPT** or **AMEND-complete** decision.

## 1. Purpose and evidence boundary

This protocol tests whether the representative Ares 2.3 mobile reading architecture reduces overload without sacrificing comprehension, orientation, provenance awareness, or reader agency around traumatic material.

The test is of the publication experience, not of the participant's historical knowledge. Do not teach the interface before a task, coach toward a control, or treat a wrong turn as a participant failure. Record it as product evidence.

Only real-reader sessions count toward the #46 gate. Automated QA, rendered screenshots, AI review, and the dry run at the end of this document establish **testing readiness only**. They must never be entered in the participant results table or counted toward a threshold.

Recommended sample from #46: **5–8 adult mobile readers**, including roughly 3–5 non-specialist readers and 2–3 scholarly/history-adjacent readers where practical. Use real phones, prioritizing common 390–430 CSS-pixel widths; include Android and iOS where available, plus a 320–360 px stress device or equivalent display setting where practical.

## 2. Exact live routes

Use the live production origin, not localhost, a branch preview, or a stale screenshot.

| Purpose | Live URL |
| --- | --- |
| Home / goal choice / resume return | https://benwassa.github.io/Ares/ |
| Framework overview | https://benwassa.github.io/Ares/framework |
| Definitions & typology prototype unit | https://benwassa.github.io/Ares/framework/definitions-typology |
| Cases index | https://benwassa.github.io/Ares/cases |
| My Lai prototype case | https://benwassa.github.io/Ares/cases/my-lai-massacre |
| Rwandan Genocide target for findability task | https://benwassa.github.io/Ares/cases/rwandan-genocide |
| Comparison prototype | https://benwassa.github.io/Ares/comparison |
| Glossary utility | https://benwassa.github.io/Ares/glossary |
| References / provenance utility | https://benwassa.github.io/Ares/references |

Useful stable locations for moderator verification only; do not reveal them unless a task explicitly supplies a direct URL:

- https://benwassa.github.io/Ares/framework/definitions-typology#typology
- https://benwassa.github.io/Ares/framework/definitions-typology#critical-caveats
- https://benwassa.github.io/Ares/cases/my-lai-massacre#key-evidence
- https://benwassa.github.io/Ares/cases/my-lai-massacre#analysis
- https://benwassa.github.io/Ares/cases/my-lai-massacre#full-scholarly-depth
- https://benwassa.github.io/Ares/comparison#tempo
- https://benwassa.github.io/Ares/comparison#full-comparison-depth

## 3. Before the participant arrives

Create one copy of `Ares_2_3_Human_Testing_Session_Record.md` and assign a non-identifying session ID such as `P01`. Do not record a participant name, email address, employer, school, account identifier, or other directly identifying information.

Confirm the device/browser can load the production origin. Record device/session metadata before the tasks. Leave the participant's normal text/display scaling in place; do not normalize an accessibility setting merely to make the layout look conventional. Record the setting used.

For the standardized resume task, JavaScript and ordinary browser storage must be enabled. Do not clear Ares local storage immediately before the interruption unless the session protocol specifically calls for a fresh-state variant. The task is meant to test the real progressive-enhancement behavior.

The participant may stop, skip a task, close a disclosure, or end the session at any time without explanation. Extended traumatic detail is never required for task success. If the participant shows discomfort, stop or redirect without asking them to continue for the sake of the test.

## 4. Moderator opening script

Read this with minimal paraphrase:

> We are testing a mobile publication, not testing you. Some of the material concerns genocide, massacres, and other mass killing. You can pause, skip material, or end the session at any point, and you do not need to explain why. You never need to open more detailed material just because it is available.
>
> I will give you a series of tasks and mostly stay quiet. Please use the site as you naturally would. For navigation tasks, you can say what you are looking for if that feels natural. For reading tasks, read normally; I will ask questions afterward. If something is confusing, do what you would normally do rather than trying to guess what I want.
>
> I may time tasks and take anonymous notes about the interface. With your permission, I may also record short anonymous quotations from what you say. There is no right level of prior knowledge for this test.

Record quote consent separately as Yes/No. Do not audio/video record unless a separate consent process exists.

## 5. Participant task sheet

The participant-facing prompts below intentionally omit scoring rules and expected answers. They may be shown one at a time.

### Task 1 — Understand the opening

Open:

https://benwassa.github.io/Ares/

Without opening the Contents control, spend about 10–15 seconds on the opening screen. Then tell me:

1. What do you think Ares is?
2. What do you think it is trying to help a reader understand or do?
3. If you wanted the shortest coherent reading path, what would you choose?
4. What do you think the difference is between **Guided reading** and **Full scholarly publication**?

### Task 2 — Find a case

Starting from wherever you are now:

**Find the Rwandan Genocide case.**

Stop when you believe you are on that case.

### Task 3 — Read one essential case unit

Open:

https://benwassa.github.io/Ares/cases/my-lai-massacre

Read the case naturally until the page tells you that the essential case unit has ended. Do not open anything merely because you think the test expects it.

When you are finished, tell me:

1. What is the main analytical point Ares is making with this case?
2. What evidence or chronology point most supports that interpretation for you?
3. What important uncertainty, limitation, or source qualification did the page leave you with?

### Task 4 — Verify provenance

Stay on the My Lai case.

Find what Ares says about the **source status of the estimated death figure**. Tell me whether the publication presents that figure as fully verified or as still needing source trace, and show me where you found that information.

### Task 5 — Essential versus optional

Still on the My Lai case, tell me which material the page appears to treat as necessary for the first coherent reading and which material it lets you defer. Show me the cues you used.

You do not need to open the optional material to answer.

### Task 6 — Interrupt and resume

Open:

https://benwassa.github.io/Ares/framework

Begin the guided framework reading and continue naturally. The moderator will interrupt you after you have entered **Definitions & typology**.

When the moderator asks you to stop, leave the site for the break. After the break, return to:

https://benwassa.github.io/Ares/

Continue from where you believe you left off. Once you have resumed, tell me:

1. What unit or question were you working on?
2. What do you remember from immediately before the interruption?
3. Did the return cues help, get in the way, or make no difference?

### Task 7 — Compare cases

Open:

https://benwassa.github.io/Ares/comparison

Use the page to answer:

1. Name one cross-case pattern or difference that becomes visible in the comparison.
2. Why does the page say that comparison does **not** mean the cases are equivalent?
3. Find the deeper comparison material and show where you would go for the complete matrix or fuller evidence.

### Task 8 — Debrief

Answer the seven rating statements and the open questions supplied by the moderator. There is no preferred answer.

## 6. Moderator procedure and measurements

### T1 — Home orientation

Start the timer when the production home visibly loads. Stop timing the 10–15 second scan when the participant begins answering.

Capture:

- whether the participant can describe Ares in terms consistent with a scholarly/evidence-led publication rather than an app, quiz, or case database only;
- whether they identify **Guided reading** as the shortest coherent ordered path;
- whether they distinguish Guided reading from Full scholarly publication;
- orientation confidence on a 1–7 scale after their answer;
- hesitation, wrong interpretation, and whether they open Contents despite the instruction.

Do not require exact project wording.

### T2 — Case findability

Start timing when the prompt is read. Stop when the Rwandan Genocide case page is visibly reached.

Capture success, time, route taken, wrong turns, loops, use of Contents, and any moderator assistance. A wrong-route loop means leaving the plausible path and returning/repeating it without reaching the target.

### T3 — My Lai essential reading

Do not instruct the participant to open **Open full scholarly depth**. Observe whether they choose it independently.

Record:

- whether they reach the explicit end of the essential unit;
- whether they voluntarily open optional depth and at what point;
- visible backtracking/re-reading and navigation confusion;
- the three post-reading answers verbatim or close paraphrase;
- case comprehension score using the rubric in the session record;
- immediate 1–9 mental-effort rating.

Do not score historical details that are not required to understand the page's analytical claim.

### T4 — Provenance

Start timing after the prompt. Stop when the participant points to the relevant source-status information and gives an interpretation.

A pass requires both findability and correct meaning: **requires source trace** must be understood as unresolved verification/source-tracing debt, not as a badge saying the estimate has been verified.

Record wrong targets, whether the participant expects a citation elsewhere, and whether the wording itself causes confusion.

### T5 — Essential/optional distinction

Do not define the distinction first. Record the participant's classification and the visible cues they cite.

A pass requires them to recognize the main five-step case unit/visible limitation as first-pass material and **Open full scholarly depth** as optional deeper evidence/method/interpretation/provenance. They need not reproduce every layer label.

### T6 — Interruption and resume

Use `/framework` as the entry and let the participant follow the guided path into Definitions & typology. Interrupt after they have reached the `Three terms, three different jobs` section (`#typology`) or, if reading speed makes that impractical, after the immediately following critical-caveats section. Do not tell the participant the anchor name.

Use a neutral **3–5 minute** break. Record the actual duration. Ask the participant to put the phone down or use a neutral non-Ares activity; do not rehearse the content during the break.

After the break, have them return through the production home. Do not point out **Continue where you left off**. Start the resume timer when home loads. Stop it when they reach the correct Definitions & typology unit and say they have regained context.

Capture:

- whether the saved Continue affordance is noticed without coaching;
- whether it returns to the correct conceptual unit;
- whether it returns near the interrupted named section;
- seconds to regain context;
- backtracking or Contents use;
- recall of the prior question/finding;
- reaction to `Previously` / `Next` orientation cues;
- any stale, surprising, or privacy-related reaction to local resume state.

A next-day repeat on a subset is useful but optional. Mark it separately from the standardized same-session gate.

### T7 — Comparison

Do not explain the tempo view or non-equivalence warning first.

Record:

- comparison comprehension score;
- whether the dimension-first view is understood as one controlled variable rather than a severity scale;
- whether the non-equivalence warning is understood;
- whether **Open full scholarly comparison** is discovered;
- whether the complete matrix can be found after opening depth;
- immediate 1–9 mental-effort rating;
- confusion, backtracking, and requests for a different comparison dimension.

### T8 — Debrief

Use a 1–7 agreement scale: `1 = strongly disagree`, `4 = neither agree nor disagree`, `7 = strongly agree`.

Ask:

1. I always knew where I was.
2. I knew what was essential and what was optional.
3. The amount presented at once felt manageable.
4. I could stop without feeling I had lost my place.
5. The interface added unnecessary strain. **[reverse-direction item]**
6. I am confident I understood the central argument.
7. I had appropriate control over how much traumatic detail I encountered.

Then ask:

- What felt longest or most tiring?
- What, if anything, did you skip, and why?
- What felt repetitive?
- What did you want to see earlier?
- What source, methodological, or other apparatus felt unnecessary at the point where you encountered it?
- Was there any point where the interface made you feel pressured to continue into traumatic detail?

Do not argue with a response or explain the design rationale during the debrief.

## 7. Mental-effort measure

After T3 and T7, ask:

> How much mental effort did this reading task require?

Use the same 1–9 scale every time:

| Score | Anchor |
| ---: | --- |
| 1 | Extremely low effort |
| 2 | Very low |
| 3 | Low |
| 4 | Somewhat low |
| 5 | Moderate |
| 6 | Somewhat high |
| 7 | High |
| 8 | Very high |
| 9 | Extremely high effort |

Ask before discussing the participant's answer. Do not convert time-on-task into a mental-effort score.

Issue #46 prefers a within-participant Ares 2.2 comparison where practical, counterbalanced across participants. There is **no separate Ares 2.2 public test origin in this readiness package**. Therefore:

- collect the absolute 1–9 ratings in every session;
- if an exact Ares 2.2 baseline is later supplied, use a matched task and alternate prototype/baseline order across participants;
- never infer a one-point improvement from absolute Ares 2.3 ratings alone;
- mark the comparative mental-effort threshold `NOT TESTED` until a valid baseline comparison exists.

If that comparative threshold remains required for ACCEPT, lack of a baseline is a gate gap to resolve explicitly; it is not permission to fabricate a comparison.

## 8. Session completion and data handling

After the debrief, save the anonymous session record. Separate observations from interpretation. Use participant quotes only when quote consent is Yes, and remove incidental identifying details before they enter the repository.

Do not aggregate results until the session record is complete. Do not replace missing observations with moderator inference. A task skipped because of participant choice is `SKIPPED`, not `FAIL`; a task impossible because of a product defect is `BLOCKED/PRODUCT`, with the defect described.

## 9. Readiness dry run — not human evidence

The task materials were dry-run against the exact GitHub Pages artifact produced by merged `main` at `caf4fa95a5bcf3447c4117108af6f257f5555c4a`.

Deployment run: `33592114226`. The run's `pnpm check`, deploy, and `verify-live` jobs all passed. `verify-live` reported production origin `https://benwassa.github.io/Ares/`, exact tested/live `index.html` SHA-256 `5cffeb5fa21d9e6bccf49efe46a40b660b3f48fd61714da3af6a273242b1e6c2`, and successful checks of 12 publication routes. The downloaded Pages artifact was artifact `9832199571` from that same run.

A material/link dry run against that exact deployed artifact produced **34/34 checks passing**:

| Task | Verified material/instruction contract |
| --- | --- |
| T1 | Home exposes Guided reading → `/framework`, Explore cases → `/cases`, and Full scholarly publication → `#chapter-directory`. |
| T2 | `/cases` contains a Rwandan Genocide link resolving to `/cases/rwandan-genocide`; the destination exists in the deployed artifact. |
| T3 | My Lai exposes orientation, key evidence, analysis, the explicit essential-unit ending, Continue to analysis, Pause here, and initially closed full scholarly depth. |
| T4 | My Lai visibly contains Estimated deaths, the source-trace boundary, `requires source trace` wording, and evidence trace status. |
| T5 | The page explicitly states that the essential case unit ends and labels the optional disclosure Open full scholarly depth. |
| T6 | Definitions & typology has stable typology/caveat sections; the home contains Continue/Clear resume UI; deployed scripts use `ares:reading-position:v1`. The merged-main browser gate separately passed resume restore/clear behavior. |
| T7 | Comparison exposes high-level findings, tempo, the non-equivalence warning, full scholarly comparison, complete matrix, and full analysis. |
| T8 | Debrief is route-independent; wording was checked for neutrality and consistency with #46. |

No broken live route, link target, or task-material mismatch requiring a production change was found. No participant was simulated, and none of the dry-run checks count toward #46's human thresholds.

## 10. Package files

Use this protocol together with:

- `04-docs/docs/Ares_2_3_Human_Testing_Session_Record.md` — one copy per participant/session;
- `04-docs/docs/Ares_2_3_Human_Testing_Decision_Record.md` — aggregate evidence and final ACCEPT / AMEND / REJECT gate decision;
- `04-docs/docs/Ares_2_3_Rollout_Preflight.md` — #47 preflight only; remains blocked on the human gate.
