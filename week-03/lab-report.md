# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Ali Akhmetov
Student ID: 25B032081
GitHub username: aliakhmetov01

---

## 1. Setup

| |            |
| --- |------------|
| AI assistant (tool) | Gemini     |
| Exact model name and version | Gemini 3.8 Flash |
| Date of the session | 26.09.2026 |
| Diagram renderer used |   PlantUML         |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
Actor Goals
Student: Identify available study spaces, secure a room for individual or group study within allowable time limits, release rooms if plans change, and receive verifiable confirmation of reservations and cancellations.

Administrator: Manage room availability by taking rooms in or out of service, ensure reservations comply with library policies, and monitor study room utilization over time to make informed operational decisions.

User Stories
US-01: Check Room Schedules
Story: As a Student, I want to view which study rooms are free and their available time slots, so that I can find a suitable space before planning my study session.

Priority: High

Assumption: Room schedules update immediately when a room is reserved, cancelled, or blocked.

US-02: Reserve a Study Room
Story: As a Student, I want to book an unblocked study room for an upcoming time slot of up to two hours that does not conflict with existing reservations, so that I have a guaranteed place to study.

Priority: High

Assumption: "At most two hours" under R2 permits a duration of exactly two hours (inclusive upper bound).

US-03: Cancel an Existing Reservation
Story: As a Student, I want to cancel a room booking I previously made, so that the slot becomes available for other students to reserve.

Priority: Medium

Assumption: Students can only view and cancel bookings associated with their own user identity.

US-04: Receive Booking and Cancellation Confirmations
Story: As a Student, I want the system to send me a confirmation whenever I complete a booking or a cancellation, so that I have an official record of my reservation status.

Priority: Medium

Assumption: Confirmations are delivered automatically upon action completion without requiring separate reminder or status feeds.

US-05: Take Study Rooms In and Out of Service
Story: As an Administrator, I want to block or unblock specific study rooms, so that students cannot book rooms that are temporarily unavailable.

Priority: High

Assumption: Blocking a room prevents any new bookings during the blocked interval as mandated by R4.

US-06: Monitor Study Room Utilization
Story: As an Administrator, I want to review study room usage over selected time periods, so that I can evaluate room demand and make informed scheduling decisions.

Priority: Low

Assumption: Usage data includes historical and scheduled bookings across all rooms without exposing personal student records beyond necessary usage aggregates.

US-07: Validate Contiguous Slot Transitions
Story: As a Student, I want to reserve a room slot that begins at the exact end time of a previous reservation, so that study spaces remain maximally utilized throughout the day.

Priority: Medium

Assumption: A booking starting at the exact moment another booking ends does not constitute an overlap under R3.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| US-01 Check Room Schedules | Rewritten | The story matches UC-01, but the assumption that schedules update immediately is not stated in the scenario. | US-01 |
| US-02 Reserve a Study Room | Kept | It matches UC-02 and correctly applies the booking rules. The assumption also settles the two-hour boundary question. | US-02 |
| US-03 Cancel an Existing Reservation | Rewritten | The story is valid, but the assumption mentions user identity, which is too close to authentication and is outside the scenario. | US-03 |
| US-04 Receive Booking and Cancellation Confirmations | Rewritten | UC-06 supports confirmation, but the scenario does not define a delivery channel or additional notification mechanism. | US-04 |
| US-05 Take Study Rooms In and Out of Service | Rewritten | The story matches UC-04, but the scenario does not define a blocked interval. It only states that a blocked room cannot be booked. | US-05 |
| US-06 Monitor Study Room Utilization | Rewritten | The story matches UC-05, but the assumption invents details about scheduled bookings, personal records and aggregates that are not in the scenario. | US-06 |
| US-07 Validate Contiguous Slot Transitions | Deleted | This is not one of the six system functions. It is a boundary decision for R3 and should be recorded as an assumption instead of a separate user story. | — |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".

**How many stories did you end with, and why that number?**

---

## 4. Original AI output — acceptance criteria (Part 3)

```
### Assumptions

- **Authentication & Role Enforcement:** The user is logged in; the system distinguishes between standard Student accounts and Administrator accounts with appropriate authorization checks.
- **Granularity of Slots:** Bookings are made in fixed increments (e.g., 30- or 60-minute blocks) or arbitrary start/end timestamps within a single calendar day.
- **Immediate Availability:** Canceling a booking immediately frees up the slot for other students in real time.
- **Administrator Precedence:** Blocking a room requires handling or rejecting conflicting active bookings (assumed here: blocking prevents new bookings; existing conflicts must be cleared or notified prior to or upon blocking).
- **Ownership Rule:** Students can only view cancellation options for bookings they created, whereas administrators have global rights.

### US-02 — Book a room

**Scenario 1: Successful booking (Happy Path)**

- **Given** a student is logged into the booking portal,
- **When** they select an unblocked study room for a slot starting in the future with a duration of 2 hours or less, and that slot has no overlapping reservations,
- **Then** the booking is confirmed, recorded under the student's profile, and the selected slot is marked as unavailable to other users.

**Scenario 2: Validation failure on duration exceeding maximum limit**

- **Given** a student selects an unblocked, available study room for a future date,
- **When** they attempt to submit a booking request for a duration of 2 hours and 30 minutes,
- **Then** the system rejects the request, displays a validation error stating "Bookings cannot exceed a maximum duration of 2 hours," and leaves the slot unreserved.

**Scenario 3: Validation failure on past or present time selection**

- **Given** a student is selecting a time slot for an unblocked room,
- **When** they enter a start time that is in the past or earlier than the current system timestamp,
- **Then** the system prevents submission and alerts the student that "Bookings must be scheduled for a future time slot."

**Scenario 4: Error handling for overlapping booking conflict**

- **Given** Room A is already booked from 2:00 PM to 3:30 PM on an upcoming day,
- **When** another student attempts to book Room A on the same day from 3:00 PM to 4:00 PM,
- **Then** the system rejects the booking, displays a message stating "The selected room is unavailable during this time," and prompts the user to select an alternative slot or room.

**Scenario 5: Attempting to book a blocked room**

- **Given** Study Room B is currently marked as "Blocked" by an administrator for maintenance,
- **When** a student attempts to reserve Room B for an otherwise empty future slot,
- **Then** the system disables the booking action, shows the room status as "Unavailable / Under Maintenance," and prevents the booking from being created.

### US-03 — Cancel a booking

**Scenario 1: Successful cancellation by owner (Happy Path)**

- **Given** a student has an upcoming, confirmed booking for a study room,
- **When** the student navigates to their active reservations and confirms the cancellation of that booking,
- **Then** the system updates the reservation status to "Canceled" and immediately releases the time slot to the pool of available rooms for other students.

**Scenario 2: Validation on cancellation ownership (Alternative / Security Case)**

- **Given** Student A holds a confirmed booking for a future slot,
- **When** Student B attempts to trigger a cancellation on Student A's booking via direct interface or API request,
- **Then** the system denies the request with an unauthorized error and leaves the original booking intact.

**Scenario 3: Error handling when attempting to cancel an expired or past booking**

- **Given** a student had a booking whose end time has already passed,
- **When** the student attempts to cancel the past booking,
- **Then** the system rejects the action with a notification that "Past bookings cannot be canceled," preserving the historical audit log.

**Scenario 4: Idempotency / Double-cancellation handling**

- **Given** a booking was already canceled in another browser tab or session,
- **When** the student attempts to click "Cancel" again on the stale interface,
- **Then** the system displays a notice stating "This booking has already been canceled" and refreshes the view to reflect current state.

### US-05 — Block or unblock a room

**Scenario 1: Successful room blocking by administrator (Happy Path)**

- **Given** an authenticated administrator is managing facility rooms,
- **When** they select an active room with no conflicting future bookings and set its status to "Blocked" with a maintenance reason,
- **Then** the room status updates to "Blocked," and it is immediately excluded from student search results and booking availability.

**Scenario 2: Successful room unblocking by administrator (Happy Path)**

- **Given** a study room is currently in "Blocked" status,
- **When** an authenticated administrator selects the room and triggers the "Unblock" action,
- **Then** the room status transitions to "Active," making future non-overlapping slots eligible for student reservations.

**Scenario 3: Non-administrator permission check (Validation / Security Case)**

- **Given** a user is authenticated as a Student,
- **When** they attempt to access or invoke the block/unblock action on any room,
- **Then** the system refuses the operation with a "403 Forbidden" permission error, making no state changes to the room.

**Scenario 4: Error handling when blocking a room with active future bookings**

- **Given** a room has confirmed student bookings scheduled for upcoming dates,
- **When** an administrator attempts to block the room without resolving the conflicts,
- **Then** the system halts the block action, presents a warning listing the affected reservations, and requires the administrator to confirm cancellation/rescheduling of existing bookings before proceeding.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| US-02 Scenario 1 | It added login, profile and interface-related details that are outside the supplied scenario. | I kept only the booking conditions: future time, maximum two hours, no overlap and room not blocked. | AC-01 |
| US-02 Scenario 2 | It included a displayed validation message, which is a UI detail not required by the scenario. | I changed it to a simple observable result: the booking is rejected if it lasts more than two hours. | AC-03 |
| US-02 Scenario 3 | It described submission controls and alerts instead of only the system behavior. | I changed it to state that a booking starting in the past or at the current time is rejected. | AC-02 |
| US-02 Scenario 4 | It added a prompt to choose another slot or room, which is not part of the scenario. | I kept only the overlap rule and the rejected booking result. | AC-04 |
| US-02 Scenario 5 | It introduced maintenance and an "Under Maintenance" status, which are explicitly outside the scenario. | I removed the maintenance details and kept only that a blocked room cannot be booked. | AC-05 |
| US-03 Scenario 1 | It added navigation, reservation status and immediate real-time behavior that are not defined in the scenario. | I simplified it to cancellation of a booking made by the Student and release of the reserved time. | AC-06 |
| US-03 Scenario 2 | It introduced API requests and authorization errors, which are technical details outside the scenario. | I changed it to state that a Student cannot cancel a booking made by another Student. | AC-07 |
| US-03 Scenario 3 | It invented a historical audit log and rules for cancelling past bookings that are not stated in the scenario. | I removed the invented audit-log behavior. | Removed |
| US-03 Scenario 4 | It introduced browser tabs, sessions and stale interfaces, which are outside the scenario. | I replaced it with a simpler alternative case about an already cancelled booking. | AC-08 |
| US-05 Scenario 1 | It added authentication, maintenance reasons and search-result behavior that are not in the scenario. | I kept only the Administrator blocking the room and the room becoming unavailable for new bookings. | AC-09 |
| US-05 Scenario 2 | It introduced an "Active" status that is not defined in the scenario. | I simplified it to unblocking the room so valid future bookings are possible again. | AC-10 |
| US-05 Scenario 3 | It added authentication and a 403 HTTP error, which are technical implementation details. | I removed the technical error details and kept the rule that Students do not perform Administrator actions. | Removed |
| US-05 Scenario 4 | It invented a rule for handling existing future bookings when a room is blocked. The scenario does not define this. | I removed this criterion instead of inventing behavior. | Removed |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | The bookings only touch at the boundary and do not share any time interval. |
| Is exactly two hours allowed under R2? | allowed | R2 says a booking lasts at most two hours, so exactly two hours is within the limit. |

**Which invalid or boundary case did the assistant leave out?**
The assistant did not clearly test the boundary where one booking starts exactly when another booking ends. Under my assumption, this is allowed and is not treated as an overlap under R3.
---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Student" as student
actor "Administrator" as admin

rectangle "Smart Campus — Study Room Booking" {
    usecase "UC-01: View availability" as UC1
    usecase "UC-02: Book room" as UC2
    usecase "UC-03: Cancel booking" as UC3
    usecase "UC-04: Block or unblock room" as UC4
    usecase "UC-05: Review usage" as UC5
    usecase "UC-06: Send confirmation" as UC6
}

' Student interactions
student --> UC1
student --> UC2
student --> UC3

' Administrator interactions
admin --> UC1
admin --> UC4
admin --> UC5

' System-triggered confirmation included by booking and cancellation
UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>

@enduml
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| Administrator → UC-01 View availability | The generated diagram associates Administrator with View availability, but this association is not supported by the revised user stories or the Administrator responsibilities in the scenario. | I removed the Administrator → UC-01 association. |
| UC-06 Send confirmation | No direct actor should trigger this use case. Confirmation happens as a result of booking or cancellation. | I kept UC-06 connected to UC-02 and UC-03 with <<include>> and did not add a direct actor association. |
| UC-05 Review usage | This use case should be associated with Administrator, because reviewing room usage is an Administrator responsibility. | I kept the Administrator → UC-05 association. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.
The questionable association was Administrator → UC-01 View availability. I removed it because UC-01 is represented by the Student story US-01, while the Administrator responsibilities in the supplied scenario are blocking or unblocking rooms and reviewing usage. UC-06 Send confirmation has no direct actor association because it is triggered by booking or cancellation.
**Did any screen, database or internal component appear as a use case or an actor?**
No. The generated diagram contains only the two required actors and the six fixed use cases. It does not model any screen, database or internal component.
---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: none
- Stories with **no use case** they belong to: none
- Criteria that test **no rule** from section 1: AC-06, AC-07, AC-08, AC-09, AC-10

**What does the largest gap tell you about the generated requirements?**
The largest gap is that UC-01, UC-05 and UC-06 have user stories but no acceptance criteria. This happened because the task required acceptance criteria for only three selected stories. The traceability table shows that story coverage is complete, but test coverage is intentionally incomplete.
---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
