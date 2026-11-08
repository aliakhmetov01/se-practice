def can_book(start, end, now, blocked, existing):
    """Return whether the booking request is allowed."""
    raise NotImplementedError
"""
Smart Campus Room Availability Checker - Final Implementation
Satisfies AC1 - AC5.
Contract: can_book(start, end, now, blocked, existing) -> bool
"""

def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    # AC3: Reject every request when the room is blocked
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440 and start strictly after now
    if not (isinstance(start, int) and isinstance(end, int) and isinstance(now, int)):
        return False

    if not (0 <= start < end <= 1440):
        return False

    if start <= now:
        return False

    # AC2: Duration at most 120 minutes (exactly 120 permitted)
    if (end - start) > 120:
        return False

    # AC4: Reject overlap with any booking; touching at an endpoint is NOT overlap
    for ex_start, ex_end in existing:
        if start < ex_end and end > ex_start:
            return False

    # AC5: Available, pure function without mutating existing bookings
    return True