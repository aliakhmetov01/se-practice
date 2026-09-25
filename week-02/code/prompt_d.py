def analyze_marks(marks, pass_mark=50):
    if not hasattr(marks, "__iter__"):
        raise ValueError("marks must be an iterable collection.")

    marks_list = list(marks)
    if not marks_list:
        raise ValueError("marks list cannot be empty.")

    total = 0
    passed_count = 0
    highest = marks_list[0]
    lowest = marks_list[0]

    for mark in marks_list:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError(f"Non-numeric mark encountered: {mark!r}")
        if not (0 <= mark <= 100):
            raise ValueError(f"Mark out of range [0, 100]: {mark}")

        total += mark
        if mark >= pass_mark:
            passed_count += 1
        if mark > highest:
            highest = mark
        if mark < lowest:
            lowest = mark

    count = len(marks_list)
    average = round(total / count, 2)
    pass_rate = round((passed_count / count) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# Tests
import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_single_mark(self):
        result = analyze_marks([75])
        self.assertEqual(
            result,
            {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_decimal_marks(self):
        result = analyze_marks([55.5, 62.25, 78.8])
        self.assertEqual(
            result,
            {"average": 65.52, "highest": 78.8, "lowest": 55.5, "pass_rate": 100.0},
        )

    def test_custom_pass_mark(self):
        result = analyze_marks([40, 60, 80], pass_mark=70)
        self.assertEqual(
            result,
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 33.33},
        )

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([80, "ninety", 75])

    def test_mark_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -5, 90])

    def test_mark_above_hundred(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 105, 90])


if __name__ == "__main__":
    unittest.main()