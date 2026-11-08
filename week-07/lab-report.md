# Week 07 — Lab report

**Name:** Ali
**Group:** Monday 16:00-19:00
**Date:** 04-11-2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| |                               |
| --- |-------------------------------|
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter                       |
| Bolt project link (or `not shared`, and why) | not shared, developed locally |
| Assistant that generated the tests (tool) | Claude / Bolt / Gemini        |
| Exact model (with its version, or `not displayed`) | not displayed                 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer                   |
| Vitest version (the `RUN  v…` line of a run) | v5.1.0                        |
| Test command | npx vitest run                |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | inside the page component (App.tsx in check function) |
| Its inputs | local React state: start, end, now, blocked, endOfDay, room.bookings |
| What it returned | boolean (updated local state setResult(ok)) |
| How the page used it | rendered 'Available' or 'Unavailable' paragraph and error text |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.


<!-- Write below this line -->
I extracted the pure availability decision logic from the check function in App.tsx into a dedicated module at app/src/booking.ts. The logic validates time ordering, future start time, 120-minute maximum limit, blocked status, and slot overlap against existing bookings. The behaviour did not change because identical validation rules and inputs are evaluated, returning an exact boolean. Now App.tsx imports and calls canBook directly with parsed values.
---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | Slot begins exactly at existing booking end; adjacent boundary touching without overlap is valid. |
| T02 | 540–570 (starts now) | false | AC1 | Slot start time equals current time (540); booking start must strictly be in the future. |
| T03 | 720–720 (zero duration) | false | AC1 | Start equals end resulting in 0 minutes; duration must be positive. |
| T04 | 750–720 (reversed) | false | AC1 | Start time is strictly greater than end time; reversed interval is invalid. |
| T05 | 1380–1441 (past day end) | false | AC1 | End time exceeds the 1440-minute day boundary. |
| T06 | 720–840 (120 minutes) | true | AC2 | Duration is exactly 120 minutes, which is within the allowed maximum limit. |
| T07 | 720–841 (121 minutes) | false | AC2 | Duration is 121 minutes, exceeding the maximum allowed limit of 120 minutes. |
| T08 | 570–600 (touching before) | true | AC4 | Slot ends exactly at existing booking start; adjacent touching without overlap is allowed. |
| T09 | 630–690 (partial overlap) | false | AC4 | Requested interval starts inside existing booking and ends after it; overlapping is forbidden. |
| T10 | 570–690 (contains booking) | false | AC4 | Requested slot encloses the entire existing booking; overlap is forbidden. |
| T11 | 615–645 (inside booking) | false | AC4 | Requested slot is completely inside an existing booking; overlap is forbidden. |
| T12 | 600–660 (identical interval) | false | AC4 | Requested slot matches existing booking start and end exactly; complete overlap. |
| T13 | 660–720, blocked = true | false | AC3 | Room is blocked; booking must be rejected regardless of slot availability. |
| T14 | 630–690, bookings = [] | true | AC4 | Overlapping interval is requested, but room has no existing bookings. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Pure query function must never mutate its arguments or the bookings array. |
| X1 | 539–600 (starts in past) | false | AC1 | Slot starts at 539 which is strictly before now (540); past bookings are forbidden. |
| X2 | 1320–1440 (ends at midnight) | true | AC2 | Valid 120-minute interval that ends precisely on the midnight boundary (1440). |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest.
Import the real function used by the page.
Assert exact decisions and unchanged booking data.
Function signature: export function canBook({ start, end, now, blocked, bookings }): boolean.
Times are minutes after midnight (e.g. 600 = 10:00, 1440 = 24:00). Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }].
Generate exactly one test per case below using the exact IDs in test titles:
T01: 660-720 touching after -> true (AC4)
T02: 540-570 starts now -> false (AC1)
T03: 720-720 zero duration -> false (AC1)
T04: 750-720 reversed -> false (AC1)
T05: 1380-1441 past day end -> false (AC1)
T06: 720-840 (120 min) -> true (AC2)
T07: 720-841 (121 min) -> false (AC2)
T08: 570-600 touching before -> true (AC4)
T09: 630-690 partial overlap -> false (AC4)
T10: 570-690 contains booking -> false (AC4)
T11: 615-645 inside booking -> false (AC4)
T12: 600-660 identical -> false (AC4)
T13: 660-720, blocked = true -> false (AC3)
T14: 630-690, bookings = [] -> true (AC4)
AC5: check bookings array immutability -> true
X1: 539-600 starts in past -> false (AC1)
X2: 1320-1440 ends at midnight -> true (AC2)
Use exact assertions .toBe(true) and .toBe(false). Do not mock, do not use test.each. We will run the tests ourselves.
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Here is the test suite using Vitest.
Run command: npx vitest run
AC Mapping:
- AC1: T02, T03, T04, T05, X1 (time validation: start > now, start < end, end <= 1440)
- AC2: T06, T07, X2 (max duration 120 minutes limit)
- AC3: T13 (room blocked status)
- AC4: T01, T08, T09, T10, T11, T12, T14 (overlap calculations)
- AC5: AC5 (immutability check for bookings array)
Notes: All tests use exact boolean assertions .toBe(true) / .toBe(false) without mocks or clocks.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06, T07 duration boundary | Potential risk of "expected = current output" bias; confirmed exact boolean assertions .toBe(true)/.toBe(false) strictly adhere to spec | accept | AC2 (strictly allows up to 120 minutes and rejects 121 minutes) |
| 2 | AC5 immutability check | "no exception occurred" style check; the assistant used JSON serialization to assert deep equality rather than checking array mutation | revise | AC5 (must verify bookings array reference and contents remain strictly unchanged) |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
RUN  v5.1.0 C:/Users/alyok/se-practice/week-07

 ✓ app/src/booking.test.ts (17 tests) 6ms
 ✓ suites/first/booking.test.ts (17 tests) 7ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  11:25:28
   Duration  294ms (transform 60%, import 21%, worker 10%, tests 9%)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- |------------------| --- | --- | --- |
|none | none             |none |none |none |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.
Improve the tests without changing correct expectations to match buggy behavior.
Separate test repairs from implementation fixes.
Review the Vitest suite against acceptance criteria AC1-AC5, verify that assertions strictly use .toBe(true) and .toBe(false), ensure tests are completely isolated, and confirm no global mocks or test.each were introduced.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v5.1.0 C:/Users/alyok/se-practice/week-07

 ✓ app/src/booking.test.ts (17 tests) 6ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  11:25:28
   Duration  294ms (transform 60%, import 21%, worker 10%, tests 9%)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06, X2 | Caught by exact 120 min boundary tests |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Caught by touching boundary tests |
| M3 | Remove the blocked-room rejection | Detected | T13 | Caught by blocked status check test |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
RUN  v5.1.0 C:/Users/alyok/se-practice/week-07
 FAIL  app/src/booking.test.ts > canBook - First Suite > T06 AC2: 720-840 (120 min)
 FAIL  app/src/booking.test.ts > canBook - First Suite > X2 AC2: 1320-1440 ends at midnight
 Test Files  1 failed (1)
      Tests  2 failed | 15 passed (17)

 RUN  v5.1.0 C:/Users/alyok/se-practice/week-07
 FAIL  app/src/booking.test.ts > canBook - First Suite > T01 AC4: 660-720 touching after
 FAIL  app/src/booking.test.ts > canBook - First Suite > T08 AC4: 570-600 touching before
 FAIL  app/src/booking.test.ts > canBook - First Suite > AC5: Available request does not mutate bookings array
 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)

 RUN  v5.1.0 C:/Users/alyok/se-practice/week-07
 FAIL  app/src/booking.test.ts > canBook - First Suite > T13 AC3: 660-720, blocked = true
 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Green "Available" message displayed, existing booking unaffected | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Red "Unavailable" message replaces previous status immediately | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Error message "Fill in the current time, the start and the end." is shown | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | Form elements stack vertically and remain usable on 375px viewport | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Existing bookings list remains unchanged showing 10:00–11:00 | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All tests pass cleanly without errors |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 17 / 17 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 covered, boundaries tested | AC1–AC5 covered, mutation resistance verified |
| Selected mutants detected | M1, M2, M3 all detected | M1, M2, M3 all detected |
| Accepted / revised / rejected tests | 16 accepted, 1 revised | 17 accepted |
| Remaining limitations | No validation for malformed database entries | No validation for malformed database entries |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

- The function returns `true`. Because the overlap check calculates `start < b.end && end > b.start` (which evaluates `660 < 650`, returning `false`), the inverted interval is ignored and does not block booking. No AC specifies behavior or error handling for malformed existing booking fixtures in the database.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
During the review of the first test suite, I verified that expected values strictly matched acceptance criteria rather than mirroring accidental code behavior. If the assistant had mistakenly expected T06 (exactly 120 minutes) to be rejected, and if I had modified canBook to fit that incorrect expectation, mutant M1 (rejecting duration >= 120) would have become the accepted behavior undetected. Our final green run proves that the pure canBook function conforms to AC1–AC5 across tested edge cases and reliably detects boundary defects like M1–M3. However, it does NOT prove overall web application correctness; it cannot verify DOM event wiring, responsive CSS layout on mobile screens, or user validation errors triggered by empty inputs (which we confirmed separately via manual UI checks U1–U5). Finally, one clear testing limitation remains: neither the specification nor the tests handle corrupt existing database bookings (such as reversed start and end times), which pass availability checks silently.