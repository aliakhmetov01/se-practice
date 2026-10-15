# Week 06 — Lab report

**Name:** Ali Akhmetov
**Group:** Monday 16:00-19:00
**Date:** 15.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | not shared |
| Browser and version | Chrome 130 |
| If you could not use Bolt.new: the tool you used instead, and why | N/A |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The model might treat touching boundary intervals as an overlap (e.g. rejecting 11:00-12:00 when an existing booking ends at 11:00), failing the touching endpoints rule. | AC4 | Partly: touching logic could not even be evaluated directly on v1 because the current time was hardcoded to system time and dropdowns lacked granular input. |
| 2 | The checker button might add/save the candidate interval to the bookings list instead of merely checking availability, mutating state on check. | AC5 | No: Bolt made the checker read-only from the start and explicitly stated it does not modify booking data. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
- AC1: Accept a candidate interval only when 0 <= start < end <= 1440 and start is after the supplied current time.
- AC2: Reject a booking longer than 120 minutes.
- AC3: Reject the request when the selected room is blocked.
- AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
- AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
- AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
- .bolt/config.json
- .bolt/prompt
- .gitignore
- eslint.config.js
- index.html
- package.json
- package-lock.json
- postcss.config.js
- tailwind.config.js
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts
- src/App.tsx
- src/bookingLogic.ts
- src/data.ts
- src/index.css
- src/main.tsx
- src/types.ts
- src/vite-env.d.ts
```

**What v1 does — one line per thing that works, or visibly does not:**

- Displays room availability checker interface with sample room selection and blocked status.
- Provides input fields for current time, booking start time, and booking end time.
- Lists existing reservations (10:00 - 11:00) for the selected room.
- Validates interval inputs and displays Available or Unavailable badge upon check.
- Mobile view adapts layout to single column, but touch targets and spacing require verification.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | -- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | Available| final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable |Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Not testable | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Not testable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable |Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Not testable | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Current time is hardcoded to system time instead of being configurable (AC1) | Steps: open page and try to evaluate baseline cases with 09:00 current time. Expected: an editable current time field per AC1 ("supplied current time"). Observed: page locks current time to system clock (13:xx), making morning slots test-blocking and causing false Unavailable results. (evidence/issue-1.png) | High | Fix |
| 2 | Mobile view at 375px width freezes / controls are unclickable (AC6) | Steps: open browser DevTools, switch to mobile view at 375px width, and tap room cards/inputs. Expected: responsive, fully usable interface per AC6. Observed: touch targets/buttons do not respond to clicks or taps on narrow viewports. (evidence/issue-2.png) | High | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, selecting start time 09:00 when the supplied current time is 09:00 produces Available, but AC1 requires accepting a candidate interval only when start is strictly after the supplied current time (expected Unavailable). Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
```
```text
Build passes. I changed one line in src/bookingLogic.ts: the AC1 boundary check from startMin < currentMin to startMin <= currentMin.
Why: AC1 requires the start time to be strictly after the supplied current time. The old < comparison allowed start == current (e.g. 09:00 start with 09:00 current time) to pass as Available. Changing it to <= correctly rejects that case as Unavailable. No other acceptance criteria were touched.
```
**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only src/bookingLogic.ts for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1-AC6.
```
```text
Build passes. I removed the isNaN guard in src/bookingLogic.ts — it was dead code defending against NaN inputs that can't occur, since startMin and endMin are always numbers derived from dropdown selections. The validation flow now goes straight from the room check into the AC1 bounds checks, which is clearer and preserves all six acceptance criteria.
```
Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Added configurable Current time dropdown control in App.tsx | accept | AC1 requires candidate intervals to be evaluated against a supplied current time; without this control, baseline scenarios like 09:00 cannot be tested. | T1, T6: setting current time to 09:00 now correctly updates validation context. |
| 2 | Changed boundary check from `<` to `<=` in src/bookingLogic.ts | accept | AC1 requires start time to be strictly after current time; start equal to current time must be rejected. | T6: 09:00-11:00 with current time 09:00 now correctly returns Unavailable. |
| 3 | Removed redundant isNaN check in src/bookingLogic.ts | accept | Cleaned up dead code since input values are always parsed numbers; simplifies logic while strictly preserving AC1-AC6. | T1-T8 retested: all results remain identical. |
---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Hardcoded system time prevented evaluating baseline tests at 09:00 | Fix | Added user-configurable `currentTime` dropdown in `src/App.tsx` | Pass: time can now be manually set to 09:00 for testing. |
| 2 | Intervals starting exactly at current time were accepted instead of rejected | Fix | Changed condition from `startMin < currentMin` to `startMin <= currentMin` in `src/bookingLogic.ts` | Pass: T6 now returns Unavailable as required by AC1. |
| 3 | Redundant dead-code guards in validation logic | Cleanup | Removed unnecessary `isNaN` guard in `src/bookingLogic.ts` | Pass: cleaner validation pipeline, behavior unchanged. |
---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/bookingLogic.ts`

<!-- Write your explanation below this line -->
The `src/bookingLogic.ts` file acts as the single source of truth for all room availability rules. Its main exported function receives the target room identifier, candidate start and end times, the supplied current time, and the existing room bookings. 

First, the function immediately inspects whether the selected room has its `blocked` flag set to true (enforcing AC3); if blocked, it halts early and returns an Unavailable verdict with an explanatory message. Next, it converts time strings into absolute integer minutes since midnight to make comparisons reliable. It validates AC1 by asserting that start is strictly earlier than end and that candidate start is strictly greater than the supplied current time (`startMin <= currentMin` triggers rejection). 

It then computes duration (`endMin - startMin`) and enforces AC2, rejecting any interval exceeding 120 minutes or non-positive durations. Finally, for AC4, it loops over all non-blocked confirmed reservations for the room. It checks for overlaps using the condition `startMin < booking.endMin && endMin > booking.startMin`. This strict comparison ensures that touching endpoints (such as 11:00 touching 11:00) are accepted as Available. Because all checks are pure functions operating on read-only inputs, no state or bookings array is mutated, satisfying AC5.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All automated checks and manual baseline scenarios pass cleanly. |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- In the final prototype, the time dropdown list ends at 23:00 / 23:30, meaning selecting a slot terminating precisely at 24:00 is not exposed via the select options. This is acceptable for a daytime campus room checker prototype assuming standard building operating hours, provided the underlying interval validation logic `bookingLogic.ts` mathematically supports `endMin <= 1440` without arithmetic overflow.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- Version 1 used the client machine's browser clock (`new Date()`) as "now". Because testing occurred in the afternoon (around 13:40–14:30), evaluating test case T6 (a morning slot such as 09:00–09:30 with current time 09:00) was physically impossible because the hardcoded clock had already surpassed the candidate interval, causing it to fail immediately as a past event rather than testing the boundary rule `start > current_time`.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
Neither of my initial predictions in Section 2 manifested as anticipated: Bolt kept the availability check strictly read-only (disproving mutation worries) and handled endpoint touches correctly. However, v1 failed fundamentally on testability: it bound "current time" to the live system clock instead of accepting a supplied parameter, preventing evaluation of morning slots, and it froze entirely on 375px mobile viewports. During cleanup, accepting an unconstrained full-state redesign suggested by generic prompts would have destroyed existing validation guarantees; instead, I rejected large-scale changes and enforced single-line surgical edits. The stark difference between looking finished and satisfying AC1–AC6 is demonstrated by test T6: visually, selecting 09:00–11:00 with current time 09:00 returned a polished green "Available" badge, but AC1 explicitly demands that candidate intervals start strictly after current time. Without boundary verification (`startMin <= currentMin`), a visually complete UI disguised a clear functional violation of the specification.