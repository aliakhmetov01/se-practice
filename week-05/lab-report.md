# Week 05 — Lab report

**Name:** Ali Akhmetov
**Group:** Monday 16:00-19:00
**Date:** 10.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| |                  |
| --- |------------------|
| Assistant (tool) | Gemini           |
| **Exact** model name | Gemini 3.8 flash          |
| Language and version |Python 3.13.9  |
| Path | A                |
| My Week 04 declaration for touching bookings | allowed          |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
### Implementation Plan

To evaluate whether a booking can proceed, check the acceptance criteria using early exit (short-circuiting to return `False` as soon as any check fails) in the following order:

1. **Blocked Room Check (AC3):**
* If `blocked` is `True`, immediately return `False`.


2. **Booking Window & Future Time Check (AC1):**
* Verify $0 \le \text{start} < \text{end} \le 1440$.
* Verify $\text{start} > \text{now}$.
* If either condition fails, return `False`.


3. **Maximum Duration Check (AC2):**
* Verify $(\text{end} - \text{start}) \le 120$.
* If false, return `False`.


4. **No Overlap with Existing Bookings (AC4, AC5):**
* Iterate through the `existing` collection of `(ex_start, ex_end)` tuples without mutating it.
* Because intervals are half-open $[ \text{start}, \text{end} )$, two intervals overlap if and only if:

$$\max(\text{start}, \text{ex\_start}) < \min(\text{end}, \text{ex\_end})$$



Equivalently: $\text{start} < \text{ex\_end} \text{ and } \text{end} > \text{ex\_start}$.
* Touching at borders (e.g., $\text{end} == \text{ex\_start}$ or $\text{start} == \text{ex\_end}$) yields strict equality, not strict inequality, which is permitted.
* If an overlap is detected with any existing booking, return `False`.


5. **Success (AC5):**
* If all checks pass, return `True`.



---

### Assumptions

* **Input Integrity:** Per the contract, `now` is an integer in $[0, 1439]$, `blocked` is a `bool`, and `existing` is an iterable of valid $(start, end)$ integer tuples representing active bookings on the same calendar day.
* **Input Types for `start` and `end`:** While `start` and `end` represent minute offsets, validation must account for potential invalid bounds, non-positive durations ($\text{start} \ge \text{end}$), or out-of-range times.
* **Endpoint Touching:** Because intervals are half-open $[ \text{start}, \text{end} )$, a new booking ending exactly when an existing one starts (or starting exactly when an existing one ends) does not constitute an overlap.
* **Immutability:** The function will only read from `existing` (e.g., no sorting in-place via `.sort()`).

---

### Boundary Cases

| Category | Test Scenario | Inputs (`start`, `end`, `now`, `blocked`, `existing`) | Expected | Exposes |
| --- | --- | --- | --- | --- |
| **Strictly Future (`now`)** | Booking starts exactly at `now` | `start=600, end=660, now=600, blocked=False, existing=[]` | `False` | Using `>=` instead of `>` for `start > now` |
| **Strictly Future (`now`)** | Booking starts 1 minute after `now` | `start=601, end=661, now=600, blocked=False, existing=[]` | `True` | Correct boundary evaluation for future times |
| **Midnight Limits** | Booking reaches end of day (1440) | `start=1380, end=1440, now=1300, blocked=False, existing=[]` | `True` | Off-by-one errors on upper boundary ($1440$) |
| **Midnight Limits** | Booking exceeds 1440 | `start=1380, end=1441, now=1300, blocked=False, existing=[]` | `False` | Missing upper bound ceiling |
| **Duration Limit** | Duration is exactly 120 minutes | `start=100, end=220, now=50, blocked=False, existing=[]` | `True` | Using `< 120` instead of `<= 120` |
| **Duration Limit** | Duration is 121 minutes | `start=100, end=221, now=50, blocked=False, existing=[]` | `False` | Off-by-one check on max duration |
| **Zero/Negative Length** | `start == end` | `start=300, end=300, now=100, blocked=False, existing=[]` | `False` | Allowing zero-length bookings ($\le$ vs $<$) |
| **Endpoint Touching (Left)** | Booking ends exactly when existing starts | `start=500, end=600, now=100, blocked=False, existing=[(600, 700)]` | `True` | Mistaking abutting endpoints for collisions |
| **Endpoint Touching (Right)** | Booking starts exactly when existing ends | `start=700, end=800, now=100, blocked=False, existing=[(600, 700)]` | `True` | Mistaking abutting endpoints for collisions |
| **Minimal Overlap** | Overlaps by exactly 1 minute | `start=500, end=601, now=100, blocked=False, existing=[(600, 700)]` | `False` | Loose collision detection |
| **Enclosure** | Existing booking is fully inside request | `start=500, end=700, now=100, blocked=False, existing=[(550, 650)]` | `False` | Overlap logic only checking endpoints |
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Check `blocked` first and return False if it is True. | AC3 says the room must not be blocked. The specification does not require a specific check order. | Accepted. Checking it first does not change the required behaviour. |
| 2 | Check `0 <= start < end <= 1440` and `start > now`. | AC1 states exactly these conditions. | Accepted with no changes. |
| 3 | Check that `end - start <= 120`. | AC2 says the duration is at most 120 minutes. | Accepted with no changes. |
| 4 | Iterate through `existing` and reject any overlapping booking. | AC4 says there must be no overlap with an existing booking. | Accepted with no changes. |
| 5 | Use strict overlap comparison so touching endpoints are allowed. | AC4 says touching endpoints are allowed. The specification says intervals include the start and exclude the end. | Accepted with no changes. |
| 6 | Do not sort or modify `existing`. | AC5 says the function must never alter `existing`. | Accepted. This is an implementation choice that follows AC5. |
| 7 | Return True only after all previous checks pass. | AC5 says return True only when AC1-AC4 hold and False otherwise. | Accepted with no changes. |

**Boundary cases the assistant suggested that I kept as tests:**

-

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if blocked: return False` | AC3 | Yes. A blocked room must reject the booking. |
| 2 | `if not (0 <= start < end <= 1440 and start > now): return False` | AC1 | Yes. It checks all bounds and requires the booking to start strictly after now. |
| 3 | `if (end - start) > 120: return False` | AC2 | Yes. A duration of exactly 120 minutes is allowed, while anything longer is rejected. |
| 4 | `if start < ex_end and end > ex_start: return False` | AC4, AC5 | Yes. It rejects real overlap while allowing touching endpoints. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None. The type hints and docstrings do not add any extra booking rules or change the function's behaviour.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Touching end is allowed | (660, 720) | — | True | AC4 | PASS | — |
| 2 | Overlap is rejected | (630, 690) | — | False | AC4 | PASS | — |
| 3 | Blocked room is rejected | (660, 720) | blocked=True | False | AC3 | PASS | — |
| 4 | Exactly two hours is allowed | (720, 840) | — | True | AC2 | PASS | — |
| 5 | Over two hours is rejected | (720, 841) | — | False | AC2 | PASS | — |
| 6 | Starts now is rejected | (540, 570) | — | False | AC1 | PASS | — |
| 7 | Zero length is rejected | (700, 700) | existing=[] | False | AC1 | PASS | — |
| 8 | Reversed time is rejected | (720, 700) | existing=[] | False | AC1 | PASS | — |
| 9 | End of day 1440 is allowed | (1380, 1440) | now=1300, existing=[] | True | AC1 | PASS | — |
| 10 | End after 1440 is rejected | (1380, 1441) | now=1300, existing=[] | False | AC1 | PASS | — |
| 11 | Empty existing allows valid booking | (700, 760) | existing=[] | True | AC4 | PASS | — |
| 12 | Several existing bookings with no overlap | (700, 760) | existing=[(600,660),(800,840),(900,960)] | True | AC4 | PASS | — |
| 13 | Existing input is not modified | (700, 760) | existing=[(800,840),(600,660)] | existing unchanged | AC5 | PASS | — |
| 14 | Touching start is allowed | (570, 600) | — | True | AC4 | PASS | — |
| 15 | New booking contains existing | (570, 690) | — | False | AC4 | PASS | — |
| 16 | Existing booking contains new | (610, 650) | — | False | AC4 | PASS | — |
| 17 | Partial overlap from left | (570, 630) | — | False | AC4 | PASS | — |
| 18 | Overlap with second existing booking is rejected | (720, 780) | existing=[(600,660),(700,760)] | False | AC4 | PASS | — |
---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(720, 780, 540, False, [(600, 660), (700, 760)])` | False | False | v1 was correct because `for ex_start, ex_end in existing:` checks every existing booking. The missing coverage was in my test suite, not in the function. | No code change. Added a test where the request overlaps the second existing booking. | Me, after M7 showed a gap in my tests. |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
1. **Boolean coercion for `blocked` check**
* **Quoted Line:** `if blocked:`
* **Contract / Criterion:** Contract line: `blocked is a Boolean.` and AC3: `The room is not blocked.`
* **Issue:** Using truthiness (`if blocked:`) rather than verifying a strict Boolean or boolean value could inadvertently treat non-boolean truthy values as blocked if callers pass other types, though per contract `blocked` is guaranteed to be a Boolean. Under the strict contract, this is sound.


2. **Iterator consumption mutating input state**
* **Quoted Line:** `for ex_start, ex_end in existing:`
* **Contract / Criterion:** Contract line: `Keep all inputs unchanged.` and AC5: `never alter existing.`
* **Issue:** If `existing` is passed as a single-use iterator or generator (rather than a reusable collection like a `list` or `set`), iterating through it exhausts the generator, thereby mutating the caller's input state.


3. **Implicit type assumptions for start and end**
* **Quoted Line:** `if not (0 <= start < end <= 1440 and start > now):`
* **Contract / Criterion:** Contract line: `Times are integer minutes after midnight on one date.` and AC1: `0 <= start < end <= 1440, and start > now.`
* **Issue:** In Python, passing floating-point numbers (e.g., `start = 600.5`, `end = 660.5`) will pass numeric comparisons and return `True` despite the contract requiring times to be integers.


4. **Handling of Boolean `start` or `end` values**
* **Quoted Line:** `if not (0 <= start < end <= 1440 and start > now):`
* **Contract / Criterion:** Contract line: `Times are integer minutes after midnight on one date.`
* **Issue:** In Python, `bool` is a subclass of `int` (`isinstance(True, int) == True`). If `start` or `end` were passed as boolean values (e.g., `start=True` representing `1`), numerical comparisons evaluate them as integers `0` or `1` rather than rejecting invalid non-integer time representations.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Check `blocked` as a strict Boolean instead of using `if blocked:`. | reject | The contract explicitly says `blocked is a Boolean`, so non-Boolean values are outside the supplied contract. `if blocked:` correctly implements AC3 for valid inputs. | No change required; 18 tests already pass. |
| 2 | Iterating over `existing` could consume a generator and alter its state. | reject | For the Python path, `existing` is specified as a list of `(start, end)` tuples. The submitted function only reads the list and does not modify it, satisfying AC5. Supporting generators would add behaviour outside the stated contract. | No change required; AC5 and input-unchanged tests pass. |
| 3 | Add explicit validation that `start` and `end` are integers. | reject | The contract states that times are integer minutes after midnight. Non-integer times are outside the valid input contract, so extra type validation is not required by AC1-AC5. | No change required; 18 tests already pass. |
| 4 | Explicitly reject Boolean values for `start` and `end`. | reject | The contract states that times are integer minutes after midnight. It does not require defensive validation for invalid input types such as Boolean times. Adding this would go beyond the stated scope. | No change required; 18 tests already pass. |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change to `code/booking.py`. Added one AC4 test for overlap with the second existing booking. | v1 already passed F1-F10. The first checker run showed M7 FAIL because my test suite did not catch one faulty AC4 implementation. | After adding `test_overlap_with_second_existing_is_rejected`, M7 changed from FAIL to PASS and all 18 tests passed. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing_allows_valid_booking (test_booking.BookingTests.test_empty_existing_allows_valid_booking) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected) ... ok
test_end_of_day_1440_is_allowed (test_booking.BookingTests.test_end_of_day_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_contains_new_booking_is_rejected (test_booking.BookingTests.test_existing_contains_new_booking_is_rejected) ... ok
test_existing_is_not_modified (test_booking.BookingTests.test_existing_is_not_modified) ... ok
test_multiple_existing_no_overlap_is_allowed (test_booking.BookingTests.test_multiple_existing_no_overlap_is_allowed) ... ok
test_new_booking_contains_existing_is_rejected (test_booking.BookingTests.test_new_booking_contains_existing_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_from_left_is_rejected (test_booking.BookingTests.test_overlap_from_left_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_with_second_existing_is_rejected (test_booking.BookingTests.test_overlap_with_second_existing_is_rejected) ... ok
test_reversed_time_is_rejected (test_booking.BookingTests.test_reversed_time_is_rejected) ... ok
test_starts_now_is_rejected (test_booking.BookingTests.test_starts_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 18 tests in 0.001s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (47 lines)
PASS   S1   your suite has at least 11 tests            18 tests
PASS   S2   your suite is green on your own code        18 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_with_second_existing_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_new_booking_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_is_not_modified
PASS   M10  your tests catch a fault in AC5             caught by test_existing_is_not_modified
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 18 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              4 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  18 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 4 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
FAIL   L9   report 10: conclusion of 120-180 words      section 10 has 0 words, the task asks for 120-180
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: no
SUMMARY pass=31 fail=1 error=0   (32 checks)
Every FAIL or ERROR you keep goes in lab-report.md section 9 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 32 checks pass. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-My function does not explicitly handle non-integer times. The contract says that times are integers, so I decided not to add extra validation for values such as `600.5` or `"600"`. In Python, some non-integer numeric values may still pass the comparisons, while incompatible types may raise an error. I consider these inputs outside the stated contract.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-The bound `0 <= start` can never be the only reason for rejection. `now` is always valid and is at least 0. Therefore, if `start` is below 0, the condition `start > now` also fails. Both conditions fail at the same time, so the lower bound on `start` cannot reject a request by itself.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
In this task, I learned how to check booking rules with tests instead of trusting the first implementation. The overlap condition uses `start < ex_end` and `end > ex_start`. These strict comparisons are important because bookings that only touch at the endpoints are allowed. For example, one booking may end at 660 and the next one may start at 660 without overlap.

My first version already passed all functional checks, but my test suite missed one fault. The checker showed M7 FAIL because I did not test a case where the new booking overlaps with the second item in `existing`. I added a new test for this case, and after that M7 passed.

The main decision I made myself was which edge cases to add. I included day limits, zero-length and reversed times, multiple existing bookings, unchanged input, touching endpoints, and different overlap situations. This helped me verify the function more completely.
