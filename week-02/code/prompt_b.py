def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, (list, tuple)) or len(marks) == 0:
        raise ValueError("Marks list must be a non-empty list or tuple.")

    if not isinstance(pass_mark, (int, float)) or isinstance(pass_mark, bool):
        raise ValueError("pass_mark must be a valid number.")

    total = 0
    highest = float("-inf")
    lowest = float("inf")
    pass_count = 0

    for mark in marks:
        # bool is a subclass of int in Python, so explicitly disallow booleans
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError(f"Invalid non-numeric mark encountered: {mark!r}")

        if mark < 0 or mark > 100:
            raise ValueError(f"Mark out of range [0, 100]: {mark}")

        total += mark
        if mark > highest:
            highest = mark
        if mark < lowest:
            lowest = mark
        if mark >= pass_mark:
            pass_count += 1

    total_count = len(marks)
    return {
        "average": round(total / total_count, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round((pass_count / total_count) * 100, 2),
    }