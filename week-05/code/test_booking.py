import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_is_rejected(self):
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_two_hours_is_allowed(self):
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_over_two_hours_is_rejected(self):
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_starts_now_is_rejected(self):
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_zero_length_is_rejected(self):
        result = can_book(700, 700, 540, False, [])
        self.assertIs(result, False)

    def test_reversed_time_is_rejected(self):
        result = can_book(720, 700, 540, False, [])
        self.assertIs(result, False)

    def test_end_of_day_1440_is_allowed(self):
        result = can_book(1380, 1440, 1300, False, [])
        self.assertIs(result, True)

    def test_end_after_1440_is_rejected(self):
        result = can_book(1380, 1441, 1300, False, [])
        self.assertIs(result, False)

    def test_empty_existing_allows_valid_booking(self):
        result = can_book(700, 760, 540, False, [])
        self.assertIs(result, True)

    def test_multiple_existing_no_overlap_is_allowed(self):
        existing = [(600, 660), (800, 840), (900, 960)]
        result = can_book(700, 760, 540, False, existing)
        self.assertIs(result, True)

    def test_existing_is_not_modified(self):
        existing = [(800, 840), (600, 660)]
        before = existing.copy()

        can_book(700, 760, 540, False, existing)

        self.assertEqual(existing, before)

    def test_touching_start_is_allowed(self):
        result = can_book(570, 600, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_new_booking_contains_existing_is_rejected(self):
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_existing_contains_new_booking_is_rejected(self):
        result = can_book(610, 650, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_overlap_from_left_is_rejected(self):
        result = can_book(570, 630, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_overlap_with_second_existing_is_rejected(self):
        existing = [(600, 660), (700, 760)]
        result = can_book(720, 780, 540, False, existing)
        self.assertIs(result, False)
if __name__ == "__main__":
    unittest.main()