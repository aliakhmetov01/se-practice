# Approved stories — Smart Campus study room booking

> **Replace this file's stories with your own Week 03 stories, as revised after review**
> (`week-03/requirements/user-stories.md`), keeping their IDs. If you did not complete Week 03, or
> your set was rejected in review, keep the reference set below and say so in `lab-report.md` §1.
> Either way, the IDs here are the ones your consistency table (§7) must use.

**Source of this set:** my week-03 stories, revised

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Reference set

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view which study rooms are free and when, so that I can choose a suitable room for study. | — |
| US-02 | As a Student, I want to book a free study room for a future time slot, so that I have a room for individual or group study. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that the room becomes available again. | R2 |
| US-04 | As a Student, I want to receive confirmation after a successful booking, so that I know the booking was completed. | R4 |
| US-05 | As an Administrator, I want to block or unblock a study room, so that rooms that are unavailable cannot be booked and can later be returned to service. | R3 |
| US-06 | As an Administrator, I want to review study room usage over a period, so that I can understand how the rooms are being used. | — |

## Declared assumptions

- Touching bookings do not overlap. If one booking ends at 12:00, another booking may start at 12:00.
- Blocking a room does not cancel existing bookings. It prevents only new bookings.

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.
