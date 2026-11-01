import unittest
from booking import can_book

class TestBookingAvailability(unittest.TestCase):
    def setUp(self):
        self.now = 540  # 09:00
        self.blocked = False
        self.existing = [(600, 660)]

    def test_T1_touching_endpoint(self):
        # Touching at an endpoint (660) is allowed -> Available
        self.assertTrue(can_book(660, 720, self.now, self.blocked, self.existing))

    def test_T2_overlap(self):
        # Overlaps with 600-660 -> Unavailable
        self.assertFalse(can_book(630, 690, self.now, self.blocked, self.existing))

    def test_T3_room_blocked(self):
        # Room is blocked -> Unavailable
        self.assertFalse(can_book(660, 720, self.now, True, self.existing))

    def test_T4_exactly_120_minutes(self):
        # Exactly 120 minutes is permitted -> Available
        self.assertTrue(can_book(720, 840, self.now, self.blocked, self.existing))

    def test_T5_duration_121_minutes(self):
        # Exceeds max 120 minutes -> Unavailable
        self.assertFalse(can_book(720, 841, self.now, self.blocked, self.existing))

    def test_T6_starts_now(self):
        # Starts at now (540 == 540) is invalid -> Unavailable
        self.assertFalse(can_book(540, 570, self.now, self.blocked, self.existing))

    def test_T7_reversed_interval(self):
        # Reversed start > end -> Unavailable
        self.assertFalse(can_book(720, 660, self.now, self.blocked, self.existing))

    def test_T8_ends_at_midnight(self):
        # Exactly at 1440 (midnight) -> Available
        self.assertTrue(can_book(1380, 1440, self.now, self.blocked, self.existing))

    def test_T9_past_midnight(self):
        # Exceeds 1440 -> Unavailable
        self.assertFalse(can_book(1380, 1441, self.now, self.blocked, self.existing))

    def test_T10_second_booking_overlap(self):
        # Overlaps with the second interval -> Unavailable
        multi_existing = [(600, 660), (700, 760)]
        self.assertFalse(can_book(720, 780, self.now, self.blocked, multi_existing))

    def test_T11_idempotence_and_immutability(self):
        # Catches M9 and M10: testing with unsorted list to detect in-place sorting or mutations
        unsorted_existing = [(900, 960), (600, 660)]
        initial = list(unsorted_existing)
        first_call = can_book(660, 720, self.now, self.blocked, unsorted_existing)
        second_call = can_book(660, 720, self.now, self.blocked, unsorted_existing)
        self.assertTrue(first_call)
        self.assertTrue(second_call)
        self.assertEqual(unsorted_existing, initial)

    def test_zero_duration_rejected(self):
        # Catches M3: start == end (0 length) must be rejected
        self.assertFalse(can_book(600, 600, self.now, self.blocked, []))

    def test_strictly_encloses_existing(self):
        # Catches M8: proposed interval (580-680) completely encloses existing booking (600-660)
        self.assertFalse(can_book(580, 680, self.now, self.blocked, self.existing))

    def test_touching_left_endpoint(self):
        # Touching the left boundary of existing booking -> Available
        self.assertTrue(can_book(550, 600, self.now, self.blocked, self.existing))

if __name__ == '__main__':
    unittest.main()