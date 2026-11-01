"""
Smart Campus Room Availability Checker - Prototype v1
Contract: can_book(start, end, now, blocked, existing) -> bool
"""

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