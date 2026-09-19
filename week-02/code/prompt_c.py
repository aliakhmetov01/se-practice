from numbers import Real


def analyze_marks(marks, pass_mark=50):
    """Analyze a collection of numerical marks against a passing threshold.

    Args:
        marks: Iterable of numeric values (int or float) between 0 and 100.
        pass_mark: Numeric threshold for passing (default: 50).

    Returns:
        dict: Keys 'average', 'highest', 'lowest', and 'pass_rate'.

    Raises:
        ValueError: If marks is empty, contains non-numeric/boolean values, or
          values out of range [0, 100].
    """
    # Validate pass_mark
    if (
        isinstance(pass_mark, bool)
        or not isinstance(pass_mark, Real)
        or not (0 <= pass_mark <= 100)
    ):
        raise ValueError("pass_mark must be a number between 0 and 100.")

    # Convert iterable to list and ensure non-empty
    try:
        marks_list = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable collection.")

    if not marks_list:
        raise ValueError("The marks list cannot be empty.")

    total = 0
    passed_count = 0
    highest = None
    lowest = None

    for mark in marks_list:
        # Check type (exclude bool which is a subclass of int)
        if isinstance(mark, bool) or not isinstance(mark, Real):
            raise ValueError(f"Non-numeric value encountered: {mark!r}")

        # Check range
        if not (0 <= mark <= 100):
            raise ValueError(
                f"Mark {mark} is out of valid range [0, 100]."
            )

        # Accumulate metrics
        total += mark
        if mark >= pass_mark:
            passed_count += 1

        if highest is None or mark > highest:
            highest = mark
        if lowest is None or mark < lowest:
            lowest = mark

    n = len(marks_list)
    return {
        "average": round(total / n, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round((passed_count / n) * 100, 2),
    }

import unittest


class TestAnalyzeMarks(unittest.TestCase):

    def test_example_case(self):
        result = analyze_marks([40, 60, 80], 50)
        self.assertEqual(
            result,
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_single_mark(self):
        result = analyze_marks([75], 50)
        self.assertEqual(
            result,
            {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_decimal_marks(self):
        result = analyze_marks([52.5, 67.8, 89.2, 45.4], 60)
        self.assertEqual(
            result,
            {
                "average": 63.72,
                "highest": 89.2,
                "lowest": 45.4,
                "pass_rate": 50.0,
            },
        )

    def test_custom_pass_mark(self):
        result = analyze_marks([60, 70, 80], pass_mark=75)
        self.assertEqual(result["pass_rate"], 33.33)

    def test_empty_list_raises_value_error(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value_raises_value_error(self):
        with self.assertRaises(ValueError):
            analyze_marks([70, "85", 90])

    def test_below_zero_raises_value_error(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -5, 80])

    def test_above_hundred_raises_value_error(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 105, 80])

    def test_boolean_value_raises_value_error(self):
        with self.assertRaises(ValueError):
            analyze_marks([True, 50, 70])


if __name__ == "__main__":
    unittest.main()