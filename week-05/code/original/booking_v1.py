"""booking.py

Provides availability checks for study room bookings.
"""

from typing import Iterable, Tuple


def can_book(
    start: int,
    end: int,
    now: int,
    blocked: bool,
    existing: Iterable[Tuple[int, int]],
) -> bool:
    """Determine whether a study room can be booked based on AC1-AC5.

    Args:
        start: Requested start time in minutes after midnight.
        end: Requested end time in minutes after midnight.
        now: Current time in minutes after midnight (0-1439).
        blocked: Whether the room is currently blocked.
        existing: Iterable of active (start, end) tuples for this room.

    Returns:
        True if the booking satisfies all criteria; False otherwise.
    """
    # AC3: The room is not blocked.
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440, and start > now.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Duration is at most 120 minutes.
    if (end - start) > 120:
        return False

    # AC4 & AC5: No overlap with an existing booking; preserve `existing`.
    # Intervals are [start, end). Two intervals overlap if and only if:
    # start < ex_end and end > ex_start.
    for ex_start, ex_end in existing:
        if start < ex_end and end > ex_start:
            return False

    return True