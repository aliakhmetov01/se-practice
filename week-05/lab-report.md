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

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
