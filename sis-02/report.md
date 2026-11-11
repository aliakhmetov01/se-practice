# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Your FINAL scope statement and assumptions, after reviewing Prompt A's output. Say here
     what is out of scope (payments, prerequisites, timetable clashes, waiting lists,
     cancellation) — section 2 must not mention them. Section 10 keeps your first version. -->

**Scope:** The system covers authenticated students browsing course offerings for a specific semester and registering for a single offering with atomic capacity and duplicate checks, returning confirmation or explicit rejection, while excluding payments, prerequisites, timetable clash detection, and waitlists.

**Assumptions:**

1. The student is already authenticated, the target CourseOffering exists in the catalog, and the offering capacity is a positive integer.
2. Catalog browsing does not reserve a seat; seat reservation and duplicate validation occur atomically at the exact moment of registration.

## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** As an authenticated student, I want to view course offerings for a chosen semester along with their current available seats, so that I can identify which sections are open and select an offering for registration.

- **AC-01** (R1): Given an authenticated student accesses the course catalog for a designated semester, When the catalog results are retrieved and displayed, Then the system displays the course code, course title, course offering identifier, and the number of currently available places for each offering in that semester.
- **AC-02** (R1, R2): Given a course offering has reached its maximum enrollment capacity, When an authenticated student views that offering in the semester catalog, Then the system displays 0 available places for that offering without reserving a seat during browsing.

### US-02 — Register for an offering

**US-02:** As an authenticated student, I want to register for an open course offering, so that I secure an enrollment place and receive proof of registration.

- **AC-03** (R2, R3, R4): Given an authenticated student is not enrolled in course offering OFF-101 and OFF-101 has at least 1 available place at the moment of request, When the student submits a registration request for OFF-101, Then the system creates exactly one Enrollment record linking the student to OFF-101, decrements the offering available places by 1, and returns a confirmation to the student.
- **AC-04** (R2, R4): Given course offering OFF-102 has exactly 1 available place remaining and the student is not currently enrolled in OFF-102, When the student submits a registration request for OFF-102, Then the enrollment succeeds, available places become 0, total enrollments equal the capacity, and a confirmation is returned.

### US-03 — Receive a clear rejection

**US-03:** As an authenticated student, I want to receive an explicit explanation if my registration cannot be completed, so that I know why the request was rejected and verify that no invalid records were created.

- **AC-05** (R2, R5): Given an authenticated student who is not enrolled in OFF-201 submits a registration request, When the system rechecks capacity and determines OFF-201 has 0 available places at that moment, Then the system rejects the request, returns the explanation course full, creates no enrollment record, and leaves the enrollment count unchanged.
- **AC-06** (R3, R5): Given an authenticated student who already has an existing enrollment record in OFF-301, When the student submits a repeat registration request for OFF-301, Then the system rejects the request, returns the explanation already enrolled, creates no duplicate enrollment, and leaves the enrollment count unchanged.

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** student (Student actor requesting actions), controller (RegistrationController handling requests and orchestrating workflow), catalog (Catalog technical lifeline retrieving offerings), offering (CourseOffering managing capacity and student registration), enrollment (Enrollment instance created upon successful registration).

**Atomic operation:** The messages inside the Critical Section group — evaluation of existing enrollment, evaluation of available capacity, instantiation of Enrollment, and decrement of available places — form one atomic operation. This ensures no concurrent request can claim the last remaining seat between capacity verification and record creation. The catalog view reserves nothing because it only performs a read-only query of available seats without acquiring a transaction lock.

**Where the Enrollment is created:** The Enrollment is created inside the success branch (not enrolled and places left) by the message offering -> enrollment : new(studentId, offeringId), instantiated by the CourseOffering lifeline, producing an instance of the Enrollment domain class defined in section 4.

**Technical lifelines:** RegistrationController and Catalog are technical lifelines. They do not represent persistent domain classes in the domain class diagram; RegistrationController acts as an application coordinator and Catalog represents the query subsystem. This difference in abstraction is standard because dynamic interactions require boundary controllers and lookup mechanisms that do not require independent domain entity persistence.

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| Course "1" -- "0..*" CourseOffering | One Course is offered as zero or more CourseOfferings | One CourseOffering represents exactly one Course |
| CourseOffering "1" -- "0..*" Enrollment | One CourseOffering targets zero or more Enrollments | One Enrollment targets exactly one CourseOffering |
| Student "1" -- "0..*" Enrollment | One Student holds zero or more Enrollments | One Enrollment is held by exactly one Student |

**How an Enrollment links a student to an offering:** An Enrollment instance represents an association class entity that holds an explicit association to exactly one Student and exactly one CourseOffering, capturing the registration event with its timestamp.

**Capacity constraint:** The total number of Enrollment instances associated with a single CourseOffering must never exceed the capacity attribute of that offering ($0 \le \text{count}(\text{Enrollment}) \le \text{capacity}$), and available places equals $\text{capacity} - \text{count}(\text{Enrollment})$. Multiplicity alone cannot express this because UML multiplicity defines static bounds across the entire lifecycle, whereas capacity is a dynamically configured per-instance numerical attribute.

**Uniqueness constraint:** A Student may appear in at most one Enrollment linking to the same CourseOffering ($\text{self.enrollment}\to\text{isUnique}(\text{student})$). Multiplicity alone cannot express this because the association between Student and Enrollment is 1 to 0..*, allowing multiple enrollments across different offerings, but cannot restrict pairs of (student, offering) from duplicating without a scoped uniqueness invariant.

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | Sequence: browseCatalog, getOfferings, displayOfferings; Class: Course and CourseOffering attributes | Catalog inspection check |
| R2 + AC-02, AC-03, AC-04, AC-05 | Sequence: course full guard; Class: capacity and availablePlaces attributes, note N_Capacity | T1, T2, T3 |
| R3 + AC-03, AC-06 | Sequence: already enrolled guard; Class: note N_Uniqueness | T4 |
| R4 + AC-03, AC-04 | Sequence: not enrolled and places left branch, new(), decrementAvailablePlaces, confirm; Class: Enrollment class | T1, T2 |
| R5 + AC-05, AC-06 | Sequence: reject("already enrolled") and reject("course full") alternative branches returning directly | T3, T4 |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | register -> registerStudent -> alt not enrolled and places left -> new() -> decrementAvailablePlaces() -> confirm -> showConfirmation. Enrollment count changes from 0 to 1, available places from 2 to 1. | Pass: message new() and decrementAvailablePlaces() in success branch |
| T2. Last place | register -> registerStudent -> alt not enrolled and places left -> new() -> decrementAvailablePlaces() -> confirm -> showConfirmation. Enrollment count changes from 1 to 2, available places from 1 to 0. | Pass: guard not enrolled and places left evaluated when availablePlaces == 1 |
| T3. Full | register -> registerStudent -> alt course full -> reject("course full") -> showRejection("course full"). Enrollment count stays 2 of 2, available places stay 0. | Pass: guard course full returns reject message without creating Enrollment |
| T4. Duplicate | register -> registerStudent -> alt already enrolled -> reject("already enrolled") -> showRejection("already enrolled"). Enrollment count stays 1 of 2, available places stay 1. | Pass: guard already enrolled returns reject message with no state change |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| Association navigability between CourseOffering and Enrollment | accepted | Changed directed arrow to bidirectional association so CourseOffering can inspect its enrollments for capacity and uniqueness checks | R2, R3 |
| Guard condition brackets in Sequence Diagram | modified | Removed square brackets from alt guards to comply with strict tool formatting requirements while retaining condition logic | R3, R5 |
| Adding Catalog as a persistent domain class in Class Diagram | rejected | Catalog serves as a technical retrieval lifeline in the sequence diagram rather than a core persistent domain entity | R1 |
| Missing registerStudent and decrementAvailablePlaces methods | accepted | Added registration and seat decrement methods to CourseOffering interface to maintain dynamic and static consistency | R2, R4 |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

The system architecture separates static domain relationships from dynamic registration behavior. In the class diagram, the domain entities Course, CourseOffering, Student, and Enrollment capture structural relationships with bidirectional associations, allowing offerings to navigate their enrollments directly. Multiplicities alone cannot express runtime limits, so separate UML notes specify the capacity constraint and uniqueness constraint. In the sequence diagram, the dynamic workflow models two distinct phases: catalog browsing and course registration. Catalog browsing displays current offering data without acquiring resource locks, while course registration encapsulates duplicate checks, capacity evaluation, and enrollment instantiation within an atomic critical section to prevent race conditions when competing for the final remaining seat.

The class diagram and sequence diagram complement each other by providing static boundaries and dynamic operational views of the same business rules. The class diagram specifies the entity attributes, association multiplicities, and structural constraints that define valid system states. The sequence diagram details the precise execution order, message invocations, activation lifetimes, and guarded decision logic required to transition between these states while satisfying business rules R1 through R5.

An activity diagram would further enhance understanding of this workflow by modeling the operational algorithm as an explicit decision tree with explicit fork, merge, and join nodes. While sequence diagrams focus on message interchange across specific object lifelines, an activity diagram highlights token flow, concurrency locks, and exception branching, providing software engineers with a transparent representation of transaction rollback and thread synchronization during atomic enrollment.

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

Using an AI assistant accelerated the transition from textual requirements to structured UML diagrams. The assistant was particularly helpful in identifying potential edge cases, such as the precedence order when duplicate registration and offering capacity limits coincide. It also drafted comprehensive acceptance criteria aligned with Given/When/Then syntax and generated initial PlantUML code blocks that provided a solid structural starting point.

One critical decision I made independently was rejecting the AI's proposal to include Catalog as a persistent domain entity in the class diagram. I determined that Catalog acts as an orchestration and query lifeline in dynamic execution rather than a persistent domain record. Additionally, I modified the sequence diagram guards to remove square brackets to ensure strict compliance with project format specifications.

A remaining limitation of this modeling approach is that neither UML class nor sequence diagrams natively describe database locking mechanisms, such as pessimistic versus optimistic locking. Although atomicity is documented conceptually, implementing this workflow in production software requires underlying transaction management at the persistence layer to truly prevent race conditions during concurrent access.

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** The system covers authenticated students browsing course offerings for a specific semester and registering for a single offering with atomic capacity and duplicate checks, returning confirmation or explicit rejection, while excluding payments, prerequisites, timetable clash detection, and waitlists.

**Initial assumptions:**

1. The student is already authenticated, the target CourseOffering exists in the catalog, and the offering capacity is a positive integer.
2. Catalog browsing does not reserve a seat; seat reservation and duplicate validation occur atomically at the exact moment of registration.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** Gemini
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-17
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1-R5: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A Course Offering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number.
R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.
Out of scope: payments, prerequisites, timetable clashes, waiting lists, cancellation.
My initial assumptions are 1. The student is already authenticated, the target CourseOffering exists in the catalog, and the offering capacity is a positive integer. 2. Catalog browsing does not reserve a seat; seat reservation and duplicate validation occur atomically at the exact moment of registration.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
### User Stories & Acceptance Criteria

#### US-01: Browse Course Offerings

* **As an** authenticated student,
* **I want to** view course offerings for a chosen semester along with their current available seats,
* **So that** I can identify which sections are open and select an offering for registration.
* **AC-01: Catalog view displaying offering details and availability**
* **Rule Mapping:** R1
* **Given** an authenticated student accesses the course catalog for a designated semester,
* **When** the catalog results are retrieved and displayed,
* **Then** the system displays the course code, course title, course offering identifier, and the number of currently available places for each offering in that semester.


* **AC-02: Reflecting zero available places when an offering is filled**
* **Rule Mapping:** R1, R2
* **Given** a course offering has reached its maximum enrollment capacity,
* **When** an authenticated student views that offering in the semester catalog,
* **Then** the system displays 0 available places for that offering without reserving a seat during browsing.



---

#### US-02: Successful Course Registration

* **As an** authenticated student,
* **I want to** register for an open course offering,
* **So that** I secure an enrollment place and receive proof of registration.
* **AC-03: Successful enrollment when capacity is available and no duplicate exists**
* **Rule Mapping:** R2, R3, R4
* **Given** an authenticated student is not enrolled in course offering `OFF-101`, and `OFF-101` has at least 1 available place at the moment of request,
* **When** the student submits a registration request for `OFF-101`,
* **Then** the system creates exactly one Enrollment record linking the student to `OFF-101`, decrements the offering's available places by 1, and returns a confirmation to the student.


* **AC-04: Atomic boundary check on the final remaining seat**
* **Rule Mapping:** R2, R4
* **Given** course offering `OFF-102` has exactly 1 available place remaining and the student is not currently enrolled in `OFF-102`,
* **When** the student submits a registration request for `OFF-102`,
* **Then** the enrollment succeeds, available places become 0, total enrollments equal the capacity, and a confirmation is returned.



---

#### US-03: Registration Rejection Handling

* **As an** authenticated student,
* **I want to** receive an explicit explanation if my registration cannot be completed,
* **So that** I know why the request was rejected and verify that no invalid records were created.
* **AC-05: Rejection due to offering capacity reached ("course full")**
* **Rule Mapping:** R2, R5
* **Given** an authenticated student who is not enrolled in `OFF-201` submits a registration request,
* **When** the system rechecks capacity and determines `OFF-201` has 0 available places at that moment,
* **Then** the system rejects the request, returns the explanation "course full", creates no enrollment record, and leaves the enrollment count unchanged.


* **AC-06: Rejection due to existing enrollment ("already enrolled")**
* **Rule Mapping:** R3, R5
* **Given** an authenticated student who already has an existing enrollment record in `OFF-301`,
* **When** the student submits a repeat registration request for `OFF-301` (regardless of offering availability),
* **Then** the system rejects the request, returns the explanation "already enrolled", creates no duplicate enrollment, and leaves the enrollment count unchanged.



---

### Areas of Uncertainty

1. **Precedence of Rejection Messages:** If a student who is *already enrolled* in an offering submits a duplicate registration request for that same offering at a moment when the offering is also *at capacity (0 available places)*, R5 specifies both "course full" and "already enrolled" as valid explanations, but does not state which condition evaluated takes priority.
2. **Catalog Semester Filtering Mechanism:** While R1 mandates showing details for "one semester," it is unspecified whether the catalog defaults to the current active semester automatically or requires an explicit semester parameter from the student before rendering.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** Gemini
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-17
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1-R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.

Approved scenario and rules:
A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A Course Offering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number.
R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.
Out of scope: payments, prerequisites, timetable clashes, waiting lists, cancellation.

Approved stories and criteria:
US-01: As an authenticated student, I want to view course offerings for a chosen semester along with their current available seats, so that I can identify which sections are open and select an offering for registration.
- AC-01 (R1): Given an authenticated student accesses the course catalog for a designated semester, When the catalog results are retrieved and displayed, Then the system displays the course code, course title, course offering identifier, and the number of currently available places for each offering in that semester.
- AC-02 (R1, R2): Given a course offering has reached its maximum enrollment capacity, When an authenticated student views that offering in the semester catalog, Then the system displays 0 available places for that offering without reserving a seat during browsing.

US-02: As an authenticated student, I want to register for an open course offering, so that I secure an enrollment place and receive proof of registration.
- AC-03 (R2, R3, R4): Given an authenticated student is not enrolled in course offering OFF-101 and OFF-101 has at least 1 available place at the moment of request, When the student submits a registration request for OFF-101, Then the system creates exactly one Enrollment record linking the student to OFF-101, decrements the offering available places by 1, and returns a confirmation to the student.
- AC-04 (R2, R4): Given course offering OFF-102 has exactly 1 available place remaining and the student is not currently enrolled in OFF-102, When the student submits a registration request for OFF-102, Then the enrollment succeeds, available places become 0, total enrollments equal the capacity, and a confirmation is returned.

US-03: As an authenticated student, I want to receive an explicit explanation if my registration cannot be completed, so that I know why the request was rejected and verify that no invalid records were created.
- AC-05 (R2, R5): Given an authenticated student who is not enrolled in OFF-201 submits a registration request, When the system rechecks capacity and determines OFF-201 has 0 available places at that moment, Then the system rejects the request, returns the explanation course full, creates no enrollment record, and leaves the enrollment count unchanged.
- AC-06 (R3, R5): Given an authenticated student who already has an existing enrollment record in OFF-301, When the student submits a repeat registration request for OFF-301, Then the system rejects the request, returns the explanation already enrolled, creates no duplicate enrollment, and leaves the enrollment count unchanged.
~~~~

**Response:**

~~~~text
@startuml
skinparam style strictuml
skinparam classAttributeIconSize 0
hide empty methods

class Student {
    - studentId : String
    - name : String
}

class Course {
    - courseCode : String
    - title : String
    - description : String
}

class CourseOffering {
    - offeringId : String
    - section : String
    - semester : String
    - capacity : Integer
    - availablePlaces : Integer
    + isEnrolled(studentId : String) : Boolean
    + hasCapacity() : Boolean
}

class Enrollment {
    - enrollmentId : String
    - enrollmentDate : DateTime
}

Course "1" -- "0..*" CourseOffering : offered as >
CourseOffering "1" <-- "0..*" Enrollment : targets >
Student "1" <-- "0..*" Enrollment : recorded for >

note "Capacity Constraint (R2):\n0 <= availablePlaces <= capacity\ncount(Enrollment) <= capacity\navailablePlaces = capacity - count(Enrollment)" as N_Capacity
CourseOffering .. N_Capacity

note "Uniqueness Constraint (R3):\nA Student may appear in at most one\nEnrollment targeting the same CourseOffering.\ncontext CourseOffering inv:\nself.enrollment->isUnique(student)" as N_Uniqueness
Enrollment .. N_Uniqueness

@enduml

@startuml
skinparam style strictuml
skinparam BoxPadding 10
skinparam ParticipantPadding 10

actor "Student" as student
box "System Boundary"
    participant "RegistrationController" as controller
    participant "Catalog" as catalog
    participant "offering : CourseOffering" as offering
    participant "enrollment : Enrollment" as enrollment
end box

== Catalog Browsing (US-01 / R1) ==

student -> controller : browseCatalog(semester)
activate controller

controller -> catalog : getOfferings(semester)
activate catalog

catalog --> controller : offeringList
deactivate catalog

controller --> student : displayOfferings(code, title, offeringId, availablePlaces)
deactivate controller

== Course Registration (US-02 & US-03 / R2, R3, R4, R5) ==

student -> controller : register(studentId, offeringId)
activate controller

controller -> offering : registerStudent(studentId)
activate offering

group Critical Section [Atomic Check & Enrollment]
    alt [already enrolled (R3, R5)]
        offering --> controller : reject("already enrolled")
        controller --> student : showRejection("already enrolled")

    else [offering full: availablePlaces == 0 (R2, R5)]
        offering --> controller : reject("course full")
        controller --> student : showRejection("course full")

    else [availablePlaces > 0 and not already enrolled (R2, R3, R4)]
        create enrollment
        offering -> enrollment : new(studentId, offeringId)
        activate enrollment
        enrollment --> offering : enrollmentInstance
        deactivate enrollment

        offering -> offering : decrementAvailablePlaces()
        offering --> controller : confirm(enrollmentId)
        controller --> student : showConfirmation(enrollmentId)
    end
end

deactivate offering
deactivate controller

@enduml
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** Gemini
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-17
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
Review these two UML models against R1-R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.
Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.
For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.

Accepted criteria:
- AC-01 (R1): Given an authenticated student accesses the course catalog for a designated semester, When the catalog results are retrieved and displayed, Then the system displays the course code, course title, course offering identifier, and the number of currently available places for each offering in that semester.
- AC-02 (R1, R2): Given a course offering has reached its maximum enrollment capacity, When an authenticated student views that offering in the semester catalog, Then the system displays 0 available places for that offering without reserving a seat during browsing.
- AC-03 (R2, R3, R4): Given an authenticated student is not enrolled in course offering OFF-101 and OFF-101 has at least 1 available place at the moment of request, When the student submits a registration request for OFF-101, Then the system creates exactly one Enrollment record linking the student to OFF-101, decrements the offering available places by 1, and returns a confirmation to the student.
- AC-04 (R2, R4): Given course offering OFF-102 has exactly 1 available place remaining and the student is not currently enrolled in OFF-102, When the student submits a registration request for OFF-102, Then the enrollment succeeds, available places become 0, total enrollments equal the capacity, and a confirmation is returned.
- AC-05 (R2, R5): Given an authenticated student who is not enrolled in OFF-201 submits a registration request, When the system rechecks capacity and determines OFF-201 has 0 available places at that moment, Then the system rejects the request, returns the explanation course full, creates no enrollment record, and leaves the enrollment count unchanged.
- AC-06 (R3, R5): Given an authenticated student who already has an existing enrollment record in OFF-301, When the student submits a repeat registration request for OFF-301, Then the system rejects the request, returns the explanation already enrolled, creates no duplicate enrollment, and leaves the enrollment count unchanged.

Sequence diagram to review:
@startuml
skinparam style strictuml
skinparam BoxPadding 10
skinparam ParticipantPadding 10

actor "Student" as student
box "System Boundary"
    participant "RegistrationController" as controller
    participant "Catalog" as catalog
    participant "offering : CourseOffering" as offering
    participant "enrollment : Enrollment" as enrollment
end box

== Catalog Browsing (US-01 / R1) ==

student -> controller : browseCatalog(semester)
activate controller

controller -> catalog : getOfferings(semester)
activate catalog

catalog --> controller : offeringList
deactivate catalog

controller --> student : displayOfferings(code, title, offeringId, availablePlaces)
deactivate controller

== Course Registration (US-02 & US-03 / R2, R3, R4, R5) ==

student -> controller : register(studentId, offeringId)
activate controller

controller -> offering : registerStudent(studentId)
activate offering

group Critical Section [Atomic Check & Enrollment]
    alt [already enrolled (R3, R5)]
        offering --> controller : reject("already enrolled")
        controller --> student : showRejection("already enrolled")

    else [offering full: availablePlaces == 0 (R2, R5)]
        offering --> controller : reject("course full")
        controller --> student : showRejection("course full")

    else [availablePlaces > 0 and not already enrolled (R2, R3, R4)]
        create enrollment
        offering -> enrollment : new(studentId, offeringId)
        activate enrollment
        enrollment --> offering : enrollmentInstance
        deactivate enrollment

        offering -> offering : decrementAvailablePlaces()
        offering --> controller : confirm(enrollmentId)
        controller --> student : showConfirmation(enrollmentId)
    end
end

deactivate offering
deactivate controller

@enduml

Class diagram to review:
@startuml
skinparam style strictuml
skinparam classAttributeIconSize 0
hide empty methods

class Student {
    - studentId : String
    - name : String
}

class Course {
    - courseCode : String
    - title : String
    - description : String
}

class CourseOffering {
    - offeringId : String
    - section : String
    - semester : String
    - capacity : Integer
    - availablePlaces : Integer
    + isEnrolled(studentId : String) : Boolean
    + hasCapacity() : Boolean
}

class Enrollment {
    - enrollmentId : String
    - enrollmentDate : DateTime
}

Course "1" -- "0..*" CourseOffering : offered as >
CourseOffering "1" <-- "0..*" Enrollment : targets >
Student "1" <-- "0..*" Enrollment : recorded for >

note "Capacity Constraint (R2):\n0 <= availablePlaces <= capacity\ncount(Enrollment) <= capacity\navailablePlaces = capacity - count(Enrollment)" as N_Capacity
CourseOffering .. N_Capacity

note "Uniqueness Constraint (R3):\nA Student may appear in at most one\nEnrollment targeting the same CourseOffering.\ncontext CourseOffering inv:\nself.enrollment->isUnique(student)" as N_Uniqueness
Enrollment .. N_Uniqueness

@enduml
~~~~

**Response:**

~~~~text
### Validation Cases

```
                                VALIDATION MATRIX
 Case                     Trigger / Guard Path                     State Change / Response
────────────────────────────────────────────────────────────────────────────────────────────
 1. Available Places      availablePlaces > 0 and not enrolled    - Decrements availablePlaces
    (AC-03 / R2, R3, R4)  [Branch 3 executed]                     - Creates Enrollment
                                                                  - Returns confirm(enrollmentId)
────────────────────────────────────────────────────────────────────────────────────────────
 2. Exactly One Place     availablePlaces == 1 (Guard > 0 holds)  - availablePlaces: 1 -> 0
    (AC-04 / R2, R4)      [Branch 3 executed]                     - total enrollments == capacity
                                                                  - Returns confirm(enrollmentId)
────────────────────────────────────────────────────────────────────────────────────────────
 3. Stale View / Full     availablePlaces == 0                    - No enrollment created
    (AC-05 / R2, R5)      [Branch 2 executed]                     - No count change
                                                                  - Returns reject("course full")
────────────────────────────────────────────────────────────────────────────────────────────
 4. Duplicate Reg.        already enrolled                        - No enrollment created
    (AC-06 / R3, R5)      [Branch 1 executed]                     - No count change
                                                                  - Returns reject("already enrolled")

```

* **Case 1: Available Places (AC-03 / R2, R3, R4):** When an offering has places available and the student is not enrolled, the sequence flows through the final `else` branch. It instantiates `Enrollment`, invokes `decrementAvailablePlaces()`, and returns confirmation to the student. The operational ordering is logically sound, though structural mismatches exist between the parameters and the static model.
* **Case 2: Exactly One Place Boundary (AC-04 / R2, R4):** Starting from `availablePlaces == 1`, the guard `[availablePlaces > 0 and not already enrolled]` evaluates to true. Executing `decrementAvailablePlaces()` drops `availablePlaces` to 0, reaching capacity. Subsequent attempts are blocked by the full-course guard.
* **Case 3: Full Course After Stale View (AC-05 / R2, R5):** If browsing occurred when seats were open but concurrent transactions filled the course, the `Critical Section` ensures atomicity. The guard `[offering full: availablePlaces == 0]` evaluates first before any creation step, returning `reject("course full")` without mutating state or creating orphaned records.
* **Case 4: Duplicate Registration (AC-06 / R3, R5):** The guard `[already enrolled]` is positioned at the head of the `alt` block, taking precedence over capacity checks. It terminates the call immediately with `reject("already enrolled")`, preventing duplicate enrollments.

---

### Genuine Defects

#### 1. Unidirectional Navigability Breaks Capacity and Uniqueness Invariants

* **Affected Rules:** R2, R3 (AC-03, AC-05, AC-06, notes `N_Capacity` and `N_Uniqueness`).
* **Affected Elements:** Class diagram association `CourseOffering "1" <-- "0..*" Enrollment : targets >`.
* **Impact:** The navigation arrow points solely from `Enrollment` to `CourseOffering`. `CourseOffering` has no visibility into its associated `Enrollment` objects. Consequently:
* The OCL constraint `N_Uniqueness` (`context CourseOffering inv: self.enrollment->isUnique(student)`) is semantically invalid because `self.enrollment` cannot be resolved.
* The constraint `N_Capacity` (`count(Enrollment) <= capacity`) cannot be evaluated by `CourseOffering`.
* The operation `CourseOffering.isEnrolled(studentId)` cannot inspect enrollments to enforce R3/R5.


* **Focused Correction:** Change the association from `CourseOffering "1" <-- "0..*" Enrollment` to bidirectional navigability or direct it toward `Enrollment` with a explicit role name:
```plantuml
CourseOffering "1" o-- "0..*" Enrollment : - enrollments

```



#### 2. Operation Signature Mismatches Between Dynamic and Static Models

* **Affected Rules:** R2, R4 (AC-03, AC-04).
* **Affected Elements:** `CourseOffering` (Class diagram) vs. messages `registerStudent(studentId)` and `decrementAvailablePlaces()` (Sequence diagram).
* **Impact:** The sequence diagram relies on `offering.registerStudent(studentId)` as the primary entry point and `offering.decrementAvailablePlaces()` as the state-mutating step. Neither operation exists in `CourseOffering` (which only declares `isEnrolled` and `hasCapacity`), making the sequence diagram non-executable against the class interface.
* **Focused Correction:** Add the missing operations to `CourseOffering` in the class diagram:
```plantuml
class CourseOffering {
    ...
    + isEnrolled(studentId : String) : Boolean
    + hasCapacity() : Boolean
    + registerStudent(studentId : String) : String
    - decrementAvailablePlaces() : void
}

```



#### 3. Missing Static Declaration of `Catalog`

* **Affected Rules:** R1 (AC-01, AC-02).
* **Affected Elements:** Sequence diagram participant `catalog : Catalog` vs. Class diagram.
* **Impact:** The sequence diagram assigns key responsibilities to `Catalog` (`getOfferings(semester)`), but `Catalog` is entirely absent from the class diagram. There is no static definition specifying how `Catalog` accesses `Course` or `CourseOffering`.
* **Focused Correction:** Add `Catalog` to the class diagram with its association and method:
```plantuml
class Catalog {
    + getOfferings(semester : String) : List<CourseOffering>
}
Catalog "1" o-- "0..*" CourseOffering : lists >

```



#### 4. Missing Instance Lookup in Registration Flow

* **Affected Rules:** R4 (AC-03, AC-04).
* **Affected Elements:** Sequence diagram message `controller -> offering : registerStudent(studentId)`.
* **Impact:** The controller receives primitive arguments `register(studentId, offeringId)` from `Student`, but directly calls `offering : CourseOffering` without retrieving or binding the instance matching `offeringId`.
* **Focused Correction:** Insert a lookup call to `catalog` (or a repository) prior to calling the offering:
```plantuml
controller -> catalog : getOffering(offeringId)
activate catalog
catalog --> controller : offeringInstance
deactivate catalog
controller -> offeringInstance : registerStudent(studentId)

```



#### 5. Primitive Data Types in Domain Object Construction

* **Affected Rules:** R3, R4 (AC-03).
* **Affected Elements:** Sequence diagram message `offering -> enrollment : new(studentId, offeringId)`.
* **Impact:** The class diagram defines domain-level associations between `Enrollment`, `Student`, and `CourseOffering`. Constructing `Enrollment` with raw foreign keys (`studentId`, `offeringId`) bypasses object-oriented domain relationships and contradicts the static model where `Enrollment` has references to `Student` and `CourseOffering`, but no string attribute fields for foreign keys.
* **Focused Correction:** Pass the domain object references into the constructor:
```plantuml
offering -> enrollment : new(student, this)

```


*(Requires `controller` or `offering` to resolve the `Student` reference corresponding to `studentId`).*

---

### Optional Design Choices

* **Derived vs. Stored `availablePlaces` (R2):** Note `N_Capacity` defines `availablePlaces = capacity - count(Enrollment)`. Storing `availablePlaces` as an explicit `Integer` attribute while also invoking `decrementAvailablePlaces()` introduces dual sources of truth.
* *Alternative:* Mark `/availablePlaces : Integer` as derived in `CourseOffering` and compute it via `capacity - enrollments.size()`. This eliminates the need for `decrementAvailablePlaces()` and prevents counter desynchronization.


* **Explicit Guard Method Invocations:** In the sequence diagram, the guards `[already enrolled]` and `[availablePlaces == 0]` inspect state implicitly.
* *Alternative:* Explicitly show self-calls to the methods declared in the class diagram: `offering -> offering : isEnrolled(studentId)` and `offering -> offering : hasCapacity()` right before entering the `alt` branches.


* **Course Attribute Traversal in Catalog Browsing (R1):** `displayOfferings` outputs `code` and `title`, which reside in `Course`, while `offeringId` and `availablePlaces` reside in `CourseOffering`. The association `Course "1" -- "0..*" CourseOffering` allows traversal, but making it explicitly directed (`CourseOffering "0..*" --> "1" Course : references >`) clarifies that offerings can independently fetch their parent course's descriptive metadata.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** Gemini
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-17
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
Revise the UML sources using only my accepted review decisions: 
1. Make the association between CourseOffering and Enrollment bidirectional (CourseOffering "1" -- "0..*" Enrollment) so offerings can inspect enrollments, and ensure Student "1" -- "0..*" Enrollment holds.
2. In sequence diagram, remove square brackets from alt and else guards (e.g. use "alt already enrolled", "else course full", "else not enrolled and places left").
3. Keep Catalog as a technical lifeline in sequence diagram without adding it to the domain class diagram.
4. Align method signatures in CourseOffering by adding registerStudent(studentId) and decrementAvailablePlaces().
5. Keep the explicit atomic group/note around checks and enrollment creation.
Keep justified existing elements and explain each change.
Preserve the agreed scope and rule IDs. Return both updated PlantUML blocks and a concise change log. Flag any unresolved issue.

Approved requirements:
US-01: Browse offerings (AC-01: R1, AC-02: R1, R2)
US-02: Register for offering (AC-03: R2, R3, R4, AC-04: R2, R4)
US-03: Rejection handling (AC-05: R2, R5, AC-06: R3, R5)

Original sources:
Sequence:
@startuml
skinparam style strictuml
skinparam BoxPadding 10
skinparam ParticipantPadding 10

actor "Student" as student
box "System Boundary"
    participant "RegistrationController" as controller
    participant "Catalog" as catalog
    participant "offering : CourseOffering" as offering
    participant "enrollment : Enrollment" as enrollment
end box

== Catalog Browsing (US-01 / R1) ==

student -> controller : browseCatalog(semester)
activate controller

controller -> catalog : getOfferings(semester)
activate catalog

catalog --> controller : offeringList
deactivate catalog

controller --> student : displayOfferings(code, title, offeringId, availablePlaces)
deactivate controller

== Course Registration (US-02 & US-03 / R2, R3, R4, R5) ==

student -> controller : register(studentId, offeringId)
activate controller

controller -> offering : registerStudent(studentId)
activate offering

group Critical Section [Atomic Check & Enrollment]
    alt [already enrolled (R3, R5)]
        offering --> controller : reject("already enrolled")
        controller --> student : showRejection("already enrolled")

    else [offering full: availablePlaces == 0 (R2, R5)]
        offering --> controller : reject("course full")
        controller --> student : showRejection("course full")

    else [availablePlaces > 0 and not already enrolled (R2, R3, R4)]
        create enrollment
        offering -> enrollment : new(studentId, offeringId)
        activate enrollment
        enrollment --> offering : enrollmentInstance
        deactivate enrollment

        offering -> offering : decrementAvailablePlaces()
        offering --> controller : confirm(enrollmentId)
        controller --> student : showConfirmation(enrollmentId)
    end
end

deactivate offering
deactivate controller

@enduml

Classes:
@startuml
skinparam style strictuml
skinparam classAttributeIconSize 0
hide empty methods

class Student {
    - studentId : String
    - name : String
}

class Course {
    - courseCode : String
    - title : String
    - description : String
}

class CourseOffering {
    - offeringId : String
    - section : String
    - semester : String
    - capacity : Integer
    - availablePlaces : Integer
    + isEnrolled(studentId : String) : Boolean
    + hasCapacity() : Boolean
}

class Enrollment {
    - enrollmentId : String
    - enrollmentDate : DateTime
}

Course "1" -- "0..*" CourseOffering : offered as >
CourseOffering "1" <-- "0..*" Enrollment : targets >
Student "1" <-- "0..*" Enrollment : recorded for >

note "Capacity Constraint (R2):\n0 <= availablePlaces <= capacity\ncount(Enrollment) <= capacity\navailablePlaces = capacity - count(Enrollment)" as N_Capacity
CourseOffering .. N_Capacity

note "Uniqueness Constraint (R3):\nA Student may appear in at most one\nEnrollment targeting the same CourseOffering.\ncontext CourseOffering inv:\nself.enrollment->isUnique(student)" as N_Uniqueness
Enrollment .. N_Uniqueness

@enduml

My review decisions and evidence:
- Association navigability: bidirectional between CourseOffering and Enrollment (R2, R3).
- Remove square brackets from alt guards (R3, R5).
- Reject adding Catalog to domain class diagram; treat Catalog as technical lifeline in sequence diagram (R1).
- Add registerStudent(studentId) and decrementAvailablePlaces() to CourseOffering (R2, R4).
~~~~

**Response:**

~~~~text
Sequence Diagram
Фрагмент кода

@startuml
skinparam style strictuml
skinparam BoxPadding 10
skinparam ParticipantPadding 10

actor "Student" as student
box "System Boundary"
    participant "RegistrationController" as controller
    participant "Catalog" as catalog
    participant "offering : CourseOffering" as offering
    participant "enrollment : Enrollment" as enrollment
end box

== Catalog Browsing (US-01 / R1) ==

student -> controller : browseCatalog(semester)
activate controller

controller -> catalog : getOfferings(semester)
activate catalog

catalog --> controller : offeringList
deactivate catalog

controller --> student : displayOfferings(code, title, offeringId, availablePlaces)
deactivate controller

== Course Registration (US-02 & US-03 / R2, R3, R4, R5) ==

student -> controller : register(studentId, offeringId)
activate controller

controller -> offering : registerStudent(studentId)
activate offering

group Critical Section [Atomic Check & Enrollment]
    alt already enrolled (R3, R5)
        offering --> controller : reject("already enrolled")
        controller --> student : showRejection("already enrolled")

    else course full (R2, R5)
        offering --> controller : reject("course full")
        controller --> student : showRejection("course full")

    else not enrolled and places left (R2, R3, R4)
        create enrollment
        offering -> enrollment : new(studentId, offeringId)
        activate enrollment
        enrollment --> offering : enrollmentInstance
        deactivate enrollment

        offering -> offering : decrementAvailablePlaces()
        offering --> controller : confirm(enrollmentId)
        controller --> student : showConfirmation(enrollmentId)
    end
end

deactivate offering
deactivate controller

@enduml
Domain Class Diagram
Фрагмент кода

@startuml
skinparam style strictuml
skinparam classAttributeIconSize 0
hide empty methods

class Student {
- studentId : String
- name : String
}

class Course {
- courseCode : String
- title : String
- description : String
}

class CourseOffering {
- offeringId : String
- section : String
- semester : String
- capacity : Integer
- availablePlaces : Integer
    + isEnrolled(studentId : String) : Boolean
    + hasCapacity() : Boolean
    + registerStudent(studentId : String) : Enrollment
    + decrementAvailablePlaces() : void
}

class Enrollment {
- enrollmentId : String
- enrollmentDate : DateTime
}

Course "1" -- "0..*" CourseOffering : offered as >
CourseOffering "1" -- "0..*" Enrollment : enrolls / targets
Student "1" -- "0..*" Enrollment : recorded for

note "Capacity Constraint (R2):\n0 <= availablePlaces <= capacity\ncount(Enrollment) <= capacity\navailablePlaces = capacity - count(Enrollment)" as N_Capacity
CourseOffering .. N_Capacity

note "Uniqueness Constraint (R3):\nA Student may appear in at most one\nEnrollment targeting the same CourseOffering.\ncontext CourseOffering inv:\nself.enrollment->isUnique(student)" as N_Uniqueness
Enrollment .. N_Uniqueness

@enduml
Change Log
1. Bidirectional Associations (Decision 1 - R2, R3):
2. 
  - Changed CourseOffering "1" <-- "0..*" Enrollment : targets > to CourseOffering "1" -- "0..*" Enrollment : enrolls / targets. This allows CourseOffering to navigate directly to its associated Enrollment instances to verify current enrollment count and check for duplicate registrations.
  - 
  - Changed Student "1" <-- "0..*" Enrollment : recorded for > to Student "1" -- "0..*" Enrollment : recorded for to ensure standard bidirectional multiplicity.
  - 
3. Removed Square Brackets from Guard Conditions (Decision 2 - R3, R5):
4. 
  - Replaced [already enrolled (R3, R5)], [offering full: availablePlaces == 0 (R2, R5)], and [availablePlaces > 0 and not already enrolled (R2, R3, R4)] with PlantUML-clean guard text: already enrolled (R3, R5), course full (R2, R5), and not enrolled and places left (R2, R3, R4).
  - 
5. Catalog Boundary Retained as Lifeline Only (Decision 3 - R1):
6. 
  - Retained Catalog strictly as an execution participant/technical lifeline in the sequence diagram to model catalog retrieval for US-01 without cluttering the conceptual domain model.
  - 
7. Synchronized CourseOffering Signatures (Decision 4 - R2, R4):
8. 
  - Added + registerStudent(studentId : String) : Enrollment and + decrementAvailablePlaces() : void to CourseOffering in the class diagram to align directly with the messages dispatched in the sequence diagram.
  - 
9. Maintained Atomic Grouping (Decision 5 - R2, R3, R4):
10. 
  - Kept group Critical Section [Atomic Check & Enrollment] enveloping duplicate evaluation, capacity check, and Enrollment instantiation to enforce concurrency safety and atomicity.
  - 
Unresolved Issues Flagged
- Precedence of Rejection Explanations (R5): If a student is already registered in an offering that is concurrently at capacity (0 available places), the order in the alt construct defaults to "already enrolled" over "course full". The business requirements do not explicitly mandate whether duplicate checks take strict priority over capacity checks.
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5.
- Fowler, M. (2004). UML Distilled: A Brief Guide to the Standard Object Modeling Language, 3rd ed. Addison-Wesley. Ch. 3-4.

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| Modeling capacity and uniqueness as notes rather than multiplicities | Fowler, M. (2004). UML Distilled, 3rd ed., Ch. 3, p. 41 | Multiplicities specify numerical range constraints on associations, but complex invariants and multi-attribute rules require explicit notes or OCL expressions | Supports placing capacity and uniqueness constraints into dedicated UML notes attached to CourseOffering and Enrollment |
| Enclosing final checks and creation inside an atomic transaction | Sommerville, I. (2016). Software Engineering, 10th ed., Ch. 5, p. 146 | Interaction models must represent critical state transitions and guarded alternatives clearly to ensure distributed components maintain data integrity | Guided the grouping of duplicate check, capacity verification, and enrollment creation inside a critical section |
