# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that starts exactly when another booking ends is not considered an overlap.
- **Duration:** a booking of exactly two hours is allowed.

---

## US-02 — Book a room

### AC-01
- **Given** a study room is not blocked and has no overlapping booking,
- **When** a Student requests a future time slot lasting no more than two hours,
- **Then** the booking is created successfully.

### AC-02
- **Given** a study room is available,
- **When** a Student requests a booking that starts in the past or at the current time,
- **Then** the booking is rejected.

### AC-03
- **Given** a study room is available,
- **When** a Student requests a booking longer than two hours,
- **Then** the booking is rejected.

### AC-04
- **Given** a study room already has a booking for a time period,
- **When** a Student requests an overlapping booking for the same room,
- **Then** the booking is rejected.

### AC-05
- **Given** a study room is blocked,
- **When** a Student requests a booking for that room,
- **Then** the booking is rejected.
---

## US-03 — Cancel a booking

### AC-06
- **Given** a Student has a booking they made,
- **When** the Student cancels that booking,
- **Then** the booking is cancelled and the reserved time becomes available.

### AC-07
- **Given** a booking was made by another Student,
- **When** a Student attempts to cancel that booking,
- **Then** the cancellation is rejected.

### AC-08
- **Given** a Student has already cancelled a booking,
- **When** the same booking is no longer active,
- **Then** it cannot be cancelled again.

---

## US-05 — Block or unblock a room

### AC-09
- **Given** a study room is available for booking,
- **When** an Administrator blocks the room,
- **Then** the room becomes blocked and cannot receive new bookings.

### AC-10
- **Given** a study room is blocked,
- **When** an Administrator unblocks the room,
- **Then** the room becomes available for valid future bookings.

### AC-11
- **Given** a study room is blocked,
- **When** a Student attempts to book it,
- **Then** the booking is rejected.
