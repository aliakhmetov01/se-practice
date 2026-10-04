# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value                                                               |
| --- |---------------------------------------------------------------------|
| Name | Ali Akhmetov                                                        |
| Group | Monday 16:00-19:00                                                  |
| AI assistant | Gemini                    |
| Exact model | Gemini 3.8 Flash      |
| Renderer | PyCharm PlantUML Integration plugin |
| Behaviour diagram | sequence                                         |
| Stories used | my week-03 stories, revised     |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 
- Touching bookings do not overlap.
- Blocking prevents only new bookings; existing bookings persist.
- Students cancel only bookings they own.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Book Study Room include Booking Confirmation | The include relationship did not have the required why comment directly above it. | R4 | Added a why comment directly above the include relationship. |
| 2 | Block Room and Unblock Room | The AI created US-05a and US-05b although the approved stories contain only US-05. | US-05 | Combined them into US-05: Block or Unblock Room. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student makes zero or many Bookings. | Each Booking belongs to exactly one Student. | 1 / 0..* |
| Room — Booking | One Room has zero or many Bookings. | Each Booking belongs to exactly one Room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: A note on Booking states that active bookings for the same room cannot overlap.
- R1: A note on Booking states that the start must be in the future and the duration must be greater than 0 and at most 2 hours.
- R3: A note on Room states that a blocked room cannot accept a new booking.
- R4: A note on Booking states that a successful booking produces a confirmation.

### 4.3 Assumptions

- A1: Touching bookings do not overlap.
- A2: Blocking a room does not cancel existing bookings.
- A3: A cancelled booking remains stored with CANCELLED status.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator — Room association | The multiplicity says a room is managed by at most one administrator, but the requirements do not assign rooms to specific administrators. | US-05 / scenario | Removed the Administrator — Room association. |
| 2 | Booking *-- Confirmation | The AI used composition and assumed a lifecycle dependency that is not required by the scenario. | R4 / US-04 | Removed the Confirmation class and represented R4 as a constraint note on Booking. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — I chose a sequence diagram because it clearly shows the order of validation, reservation and confirmation messages during Book room.

**Design components added beyond the domain model:** 
- `BookingService` — coordinates booking validation and creation.
- `BookingRepository` — reads active bookings and saves a successful booking.
- `RoomRepository` — retrieves the room so its blocked status can be checked.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `alt [invalid R1]`, `else [valid R1]` and other guards | The AI used square brackets around sequence guards, but the required PlantUML convention says sequence guards must not use square brackets. | Sequence diagram convention | Removed the square brackets from all `alt` and `else` guards. |
| 2 | `confirmation:Confirmation` | The AI introduced a Confirmation object even though the revised domain class diagram does not contain a Confirmation class. | R4 / US-04 | Removed the Confirmation lifeline and represented confirmation as the successful response from BookingService to Student. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Two separate use cases use the same story ID US-05 | `US-05: Block Room` and `US-05: Unblock Room` | accept | My approved US-05 is one story that says block or unblock a room. Using the same story ID on two separate use cases is confusing for traceability. I combined them into one `US-05: Block or Unblock Room` use case. |
| 2 | Booking initiation names are inconsistent | `Student.requestBooking(...)` and `BookingService.bookRoom(...)` | accept | The two diagrams use different names for the same booking request. I renamed the Student operation to `bookRoom(...)` so the terminology is consistent. |
| 3 | BookingService and repositories are missing from the class diagram | `BookingService`, `RoomRepository`, `BookingRepository` | reject | Task 2 explicitly asks for a domain class diagram, while Task 3 requires BookingService and BookingRepository lifelines and asks us to explain new design components. Therefore the sequence diagram may contain design components that are intentionally not domain classes. |
| 4 | The sequence diagram is missing ownership validation for cancellation | cancellation ownership | reject | The sequence diagram models only the Book room behaviour, not Cancel booking. Ownership validation is relevant to US-03 but is outside the selected behaviour diagram. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | US-02: Book Study Room | Booking.startTime, Booking.endTime | validateTimeRange(startTime, endTime) |
| R2 | US-02: Book Study Room | Booking, Room; R2 note on Booking | checkOverlap(conflictingBookings) |
| R3 | US-02: Book Study Room | Room.isBlocked | checkBlocked(room) |
| R4 | US-02: Book Study Room / US-04: Booking Confirmation | Booking | createConfirmation(savedBooking) and booking confirmation |
| US-01 | US-01: View Room Availability | Student, Room | Not shown in selected Book room sequence |
| US-02 | US-02: Book Study Room | Student, Room, Booking | bookRoom, validation, create and save Booking |
| US-03 | US-03: Cancel Booking | Student, Booking | Not shown in selected Book room sequence |
| US-04 | US-04: Booking Confirmation | Booking | booking confirmation after successful booking |
| US-05 | US-05: Block or Unblock Room | Administrator, Room | R3 check uses Room.isBlocked |
| US-06 | US-06: Review Room Usage | Administrator, Booking | Not shown in selected Book room sequence |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Gemini used `US-05a: Block Room` and `US-05b: Unblock Room`. | Replaced them with one `US-05: Block or Unblock Room` use case. | The approved stories contain only US-05, so this gives clearer traceability. |
| 2 | class | Gemini added an `Administrator — Room` association with `0..1 / 0..*` multiplicities. | Removed the association. | The scenario says administrators can block/unblock rooms but does not assign rooms to one administrator. |
| 3 | sequence | Gemini used square brackets in `alt` guards and created a `Confirmation` lifeline. | Removed square brackets and returned confirmation directly from BookingService. | Sequence guards must not use square brackets, and the revised class model does not include a Confirmation class. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  4 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  2 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
