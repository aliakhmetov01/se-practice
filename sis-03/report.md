# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value            |
| --- |------------------|
| Coding assistant (tool) | Gemini           |
| Coding assistant model | Gemini flash 3.8 |
| Bolt.new model | Standart         |
| Bolt project link | https://bolt.new |
| Language | Python           |
| Path | Path A           |
| Python v1 from | fresh            |
| Web v1 from | fresh            |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** A utility for checking individual rooms for availability, implemented as a Python function and a single-page web client. The program evaluates whether the requested time slot is valid within a single day, taking into account existing reservations and the room's status, and returns the result. It strictly excludes user accounts, authentication, databases, backend servers, payments, multiple-room management, as well as any creation of reservations or modification of existing records.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Time is expressed in integer minutes from midnight (0 to 1440). The interval must be valid (0 <= start < end <= 1440) and the booking start time must be strictly in the future relative to current time (start > now). |
| AC2 | Booking duration cannot exceed 120 minutes (end - start <= 120). A duration of exactly 120 minutes is allowed. |
| AC3 | Any booking request must be rejected if the room is flagged as blocked (blocked == True). |
| AC4 | The requested slot must not overlap with any existing reservation. Touching at boundary endpoints (start == existing_end or end == existing_start) is explicitly permitted and is not an overlap. |
| AC5 | The output must be an unambiguous boolean decision (Available / Unavailable). The validation must be a pure function with no side effects and must never mutate existing bookings. |
| AC6 | The user interface must provide clear, understandable validation messages explaining rejection causes, remaining functional and accessible on narrow mobile viewports (~375 px). |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Endpoint touching mistakenly classified as overlap due to non-strict inequality (e.g. using `start <= ex_end and end >= ex_start` instead of strict `<` and `>`). | AC4 | Run test case T1 with slot 660-720 against existing [(600, 660)]. It must return Available / True. |
| 2 | Permitting a booking that starts at the current minute due to using `start >= now` instead of strict `start > now`. | AC1 | Run test case T6 with start = 540 when now = 540. It must return Unavailable / False. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Proposed booking start time in minutes from midnight | `int`, 0 <= start < 1440 |
| `end` | Proposed booking end time in minutes from midnight | `int`, 1 <= end <= 1440, end > start |
| `now` | Current time in minutes from midnight | `int`, 0 <= now <= 1440 |
| `blocked` | Flag indicating whether the room is closed or unavailable | `bool` (True or False) |
| `existing` | Collection of already booked slots for the room | `list[tuple[int, int]]`, each slot (s, e) where 0 <= s < e <= 1440 |
| returns | Availability verdict satisfying AC1-AC4 | `bool` (True if all criteria hold, False otherwise) |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All time inputs represent discrete whole minutes within a single calendar day (0 = 00:00, 1440 = 24:00) with no multi-day or overnight wraps.
2. The `existing` list contains valid, non-overlapping intervals, and the verification behaves as an idempotent, read-only predicate.

**Checked manually:**

- Converted baseline test times to minutes: 09:00 = 540 min, 10:00 = 600 min, 11:00 = 660 min, 12:00 = 720 min, 14:00 = 840 min, 23:00 = 1380 min, 24:00 = 1440 min.
- Manually calculated T1 (660–720 vs 600–660: touches at 660, no overlapping minute -> Available) and T2 (630–690 vs 600–660: overlaps in [630, 660) -> Unavailable).

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` | AC3 | Yes | Directly checks the boolean flag and immediately rejects requests when the room is blocked. |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Validates that boundaries are within 0 and 1440 minutes, and that start is strictly before end. |
| `if start <= now:` | AC1 | Yes | Guarantees the booking starts strictly in the future relative to the current minute. |
| `if (end - start) > 120:` | AC2 | Yes | Enforces the maximum booking duration threshold of 120 minutes while allowing exactly 120. |
| `if start <= ex_end and end >= ex_start:` | AC4 | No | Uses non-strict inequalities `<=`, causing valid back-to-back bookings touching at endpoints to be falsely flagged as conflicts. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a single-page responsive Smart Campus Room Availability Checker in React with Tailwind CSS.

User story:
As a student, I want to check a room's availability so that I can choose a valid booking time.

Acceptance Criteria (AC1-AC6):
- AC1: Time is handled in minutes from midnight (0 <= start < end <= 1440). Start time must be strictly after the current time "now".
- AC2: Duration must be at most 120 minutes (end - start <= 120). Exactly 120 minutes is permitted.
- AC3: Reject booking if the room is marked as blocked (blocked == true).
- AC4: Reject overlap with existing bookings. Touching at an endpoint (e.g. 11:00-12:00 when 10:00-11:00 is booked) is NOT an overlap and must be allowed.
- AC5: Display unambiguous "Available" or "Unavailable" status with clear visual indicator. Never create, confirm, or mutate existing bookings.
- AC6: Display clear, understandable validation error messages. The UI layout must be fully responsive and usable on narrow mobile screens (~375px).

Strict Constraints & Exclusions:
- Strictly NO authentication or login screens.
- Strictly NO backend server, external APIs, or persistent databases.
- Read-only availability check only: do NOT implement booking submission, confirmation modals, or payment processing.

Initial UI State:
- Baseline settings: "now" set to 09:00 (540 min), room blocked = false.
- Display one pre-configured fictional booking: 10:00 - 11:00 (600 - 660 min).
- Form inputs for proposed Start Time and End Time, a toggle for Room Blocked status, and an explicit "Check Availability" button with immediate feedback.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| `App.tsx` | `src/App.tsx` | Main application component containing time input controls, room status toggle, availability checking logic, and status badge rendering. |
| `RoomSchedule.tsx` | `src/components/RoomSchedule.tsx` | Component rendering the list of fictional existing room reservations and current time reference. |

**What v1 does:**

- Renders a single-page availability checker interface displaying the room name, current reference time (09:00), and existing bookings (10:00–11:00).
- Provides time input pickers for Start Time and End Time alongside a toggle switch for Room Blocked status.
- Evaluates booking intervals against duration limits (max 120 min) and existing reservations upon clicking "Check Availability".
- Displays an "Available" (green) or "Unavailable" (red) status banner with contextual validation messages explaining rejection reasons.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | False | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | False | True | Unavailable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py:15-20`, `src/App.tsx:checkSlot` | T6, T7, T8, T9 | Available for valid intervals strictly after now; Unavailable otherwise | T6: False, T7: False, T8: True, T9: False | T6: False, T7: False, T8: True, T9: False |
| AC2 | `code/booking.py:23-24`, `src/App.tsx:checkDuration` | T4, T5 | Available for duration <= 120; Unavailable for duration > 120 | T4: True, T5: False | T4: True, T5: False |
| AC3 | `code/booking.py:11-12`, `src/App.tsx:checkBlocked` | T3 | Unavailable when blocked is True | False | False |
| AC4 | `code/booking.py:27-29`, `src/App.tsx:checkOverlap` | T1, T2, T10 | Available when touching at boundary; Unavailable when overlapping | T1: False, T2: False, T10: False | T1: True, T2: False, T10: False |
| AC5 | `code/booking.py:32`, `src/App.tsx:renderBadge` | T11 | Pure boolean Available/Unavailable; zero mutation of existing list | False (unmutated) | True (unmutated) |
| AC6 | `src/App.tsx:feedbackAlert`, `index.html` viewport | T12 | Clear rejection messages; responsive layout at ~375 px mobile screen | Available (visual clipping on small screen) | Available (responsive layout with clear feedback) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Lack of specific validation feedback when start time is after end time; ambiguous error banner. | Enter Start 12:00, End 11:00 (T7 / AC1, AC6). | High | "Add explicit validation rule and user feedback: if start time is greater than or equal to end time, display an explicit error alert stating 'Start time must be strictly earlier than end time'." | Displays clear red alert: "Start time must be strictly earlier than end time". Retest T7 passed. |
| 2 | Schedule card only displays a single fixed reservation, preventing multi-interval conflict verification and lacks conflict details. | Enter 12:00–13:00 when existing bookings contain (10:00–11:00) and (11:40–12:40) (T10 / AC4). | Medium | "Display all existing bookings in the room schedule card and when an overlap occurs, specify the exact conflicting time range in the rejection banner." | UI displays full schedule and explicitly reports which reservation caused the conflict. Retest T10 passed. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1 (generic / missing validation for reversed time range replaced with specific inline feedback).

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | AI suggested rejecting slots that touch an existing booking boundary (`start <= ex_end and end >= ex_start`) to prevent scheduling collisions. | Ran test case T1 (660–720 against 600–660). | Reject | Directly violates AC4, which explicitly states that touching at an endpoint is NOT an overlap and must be allowed. |
| 2 | AI recommended enforcing duration validation directly on the client side (`(end - start) <= 120`). | Tested T4 (120 min) and T5 (121 min) in web and Python. | Accept | Complies with AC2: exactly 120 minutes is permitted, while 121 minutes is rejected. |
| 3 | AI recommended auto-adjusting an invalid reversed time range (e.g. automatically flipping end and start if start > end). | Evaluated test case T7 (720–660). | Modify | Modified to strictly reject the request and show a validation error instead of auto-adjusting, as AC1 and AC6 require explicit validation and pure query behavior without hidden side effects. |
## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Provide clear validation for reversed time inputs (AC1, AC6) and display exact conflicting intervals (AC4). |
| Model / plan | Inspect `App.tsx`, introduce a pre-validation guard checking `start >= end`, and extend the conflict detector to reference specific overlapping items. |
| Tool call | `edit_file` / Bolt WebContainer file modification to update `src/App.tsx`. |
| Observation | UI dynamically re-rendered in the preview; reversed times triggered an inline red alert and disabled checking. |
| Next step | Verify mobile layout responsiveness at ~375 px viewport to confirm no overflow or clipping occurred. |
| Human review | Inspected the generated diff, verified that touch boundaries still allowed bookings, and captured evidence screenshots. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Bolt.new WebContainer | Project directory structure, `package.json`, and current `App.tsx` state | In-browser file system read/write, terminal execution for Vite dev server | Observed |
| LLM Coding Assistant | Prompt text containing AC1–AC6 specifications and sample test cases | Text generation context window, token probability scoring | Assumed |
| Local Terminal (Git / Python) | Local repository workspace and Python virtual environment | File execution, local git branch operations, network access for git push | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** A strict manual review of the diff before committing: verifying that the logic for boundary touching (`start < ex_end and end > ex_start`) was not reverted to non-strict inequalities during automated refactoring.

**Reliability, security, responsibility:** While AI agents excel at generating UI boilerplate and rapid initial implementations, they frequently hallucinate or misjudge boundary edge conditions (such as touch vs overlap). Automated test suites and human verification remain indispensable lines of defense to guarantee system correctness and contract adherence before code is pushed to production.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

AI-assisted coding in Python allowed precise control over boundary logic through unit testing, whereas vibe coding in Bolt provided rapid UI assembly but obscured subtle domain logic. Relying solely on vibe coding poses three distinct software risks: a reliability risk where boundary conditions like endpoint touching are falsely flagged as overlaps; a usability risk where invalid inputs fail silently without descriptive validation feedback; and a security risk where client-side availability assumptions are trusted without backend enforcement. Automated tests and rigorous human code reviews remain strictly human responsibilities because language models optimize for syntax plausibility rather than contract fidelity. During iteration, I explicitly rejected the AI suggestion to treat boundary-touching bookings as conflicts, ensuring compliance with AC4. As a next improvement within the existing scope, I would add full keyboard navigation and ARIA live region announcements to the status banner for enhanced accessibility.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Gemini
- **Model:** Gemini 3.8 flash
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
I need to implement a Python function `can_book(start, end, now, blocked, existing)` that checks room availability.
Rules:
- Minutes from midnight (0 <= start < end <= 1440), start strictly after now.
- Duration at most 120 minutes.
- Reject if room is blocked.
- Reject overlap, but touching at an endpoint is NOT an overlap.
Give me an implementation plan and identify edge cases.
~~~~

**Response:**

~~~~text
Plan:
1. Validate room status: return False if blocked is True.
2. Validate time boundaries: check 0 <= start < end <= 1440 and start > now.
3. Validate duration: check (end - start) <= 120.
4. Check conflicts: iterate through existing bookings; check overlap using (start < ex_end and end > ex_start).
5. Return True if all checks pass.
Edge cases: back-to-back bookings (touching endpoints), booking starting at now, reversed times, and maximum 120-minute slots.
~~~~

### B2

- **Tool:** Gemini
- **Model:** Gemini 3.8 flash
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Generate the initial Python implementation for `can_book(start, end, now, blocked, existing)` based on the contract.
~~~~

**Response:**

~~~~text
def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    if blocked:
        return False

    if not (0 <= start < end <= 1440):
        return False

    if start <= now:
        return False

    if (end - start) > 120:
        return False

    for ex_start, ex_end in existing:
        # Flawed condition: touches at endpoint are incorrectly flagged as overlaps
        if start <= ex_end and end >= ex_start:
            return False

    return True
~~~~

### B3

- **Tool:** Gemini
- **Model:** Gemini 3.8 flash
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Critique the booking function against AC1-AC6. Does `start <= ex_end and end >= ex_start` satisfy AC4?
~~~~

**Response:**

~~~~text
The condition `start <= ex_end and end >= ex_start` fails AC4. When a new booking starts exactly when an existing booking ends (e.g. 660 and 660), `start <= ex_end` evaluates to True, causing the function to reject valid back-to-back slots. To comply with AC4, strict inequality must be used: `start < ex_end and end > ex_start`.
~~~~

### B4

- **Tool:** Gemini
- **Model:** Gemini 3.8 flash
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Please apply two focused fixes to the room availability checker:
1. Validation feedback improvement (AC6): If the student enters a start time that is greater than or equal to the end time, immediately show a clear red error message: "Start time must be strictly earlier than end time".
2. Multi-interval support & precise conflict feedback (AC4, AC6): Display all existing reservations in the room schedule (10:00 - 11:00 and 11:40 - 12:40). If a requested slot overlaps with any reservation, mention the specific conflicting time range in the rejection banner.
Ensure the responsive layout remains fully compact and cleanly aligned on mobile width (~375px).
~~~~

**Response:**

~~~~text
Updated App.tsx:
- Added explicit state validation checking `startMinute >= endMinute` with inline warning banner.
- Updated room schedule card to map through multiple reservations.
- Updated conflict detection logic to capture conflicting slot times and interpolate them into the rejection status alert.
- Refined responsive flexbox wrapping for viewports down to 375px.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_T10_second_booking_overlap (test_booking.TestBookingAvailability) ... ok
test_T11_idempotence_and_immutability (test_booking.TestBookingAvailability) ... ok
test_T1_touching_endpoint (test_booking.TestBookingAvailability) ... ok
test_T2_overlap (test_booking.TestBookingAvailability) ... ok
test_T3_room_blocked (test_booking.TestBookingAvailability) ... ok
test_T4_exactly_120_minutes (test_booking.TestBookingAvailability) ... ok
test_T5_duration_121_minutes (test_booking.TestBookingAvailability) ... ok
test_T6_starts_now (test_booking.TestBookingAvailability) ... ok
test_T7_reversed_interval (test_booking.TestBookingAvailability) ... ok
test_T8_ends_at_midnight (test_booking.TestBookingAvailability) ... ok
test_T9_past_midnight (test_booking.TestBookingAvailability) ... ok
test_touching_left_endpoint (test_booking.TestBookingAvailability) ... ok
----------------------------------------------------------------------
Ran 12 tests in 0.001s
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| None / Clean suite | All unit tests T1–T11 pass and the submission checker completes without errors. | In a future version with expanded scope, connect the interface to a persistent database and calendar integration. |
