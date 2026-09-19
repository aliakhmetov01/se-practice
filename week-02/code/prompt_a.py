from statistics import mean, median


def assign_grade(score: float) -> str:
    """Map percentage score to standard letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    return "F"


def analyze_grades(records: dict[str, float], pass_threshold: float = 60.0):
    if not records:
        print("No student records provided.")
        return

    scores = list(records.values())

    # Core statistics
    avg_score = mean(scores)
    med_score = median(scores)
    highest_score = max(scores)
    lowest_score = min(scores)

    # Performance breakdowns
    passed_students = {k: v for k, v in records.items() if v >= pass_threshold}
    failed_students = {k: v for k, v in records.items() if v < pass_threshold}
    pass_rate = (len(passed_students) / len(records)) * 100

    top_performers = [k for k, v in records.items() if v == highest_score]
    bottom_performers = [k for k, v in records.items() if v == lowest_score]

    # Grade distribution counts
    grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    for score in scores:
        grade_counts[assign_grade(score)] += 1

    # Formatted Output
    print("=" * 42)
    print("        STUDENT MARKS ANALYSIS")
    print("=" * 42)
    print(f"Total Students  : {len(records)}")
    print(f"Passing Cutoff  : {pass_threshold:.1f}")
    print(f"Average Score   : {avg_score:.2f}")
    print(f"Median Score    : {med_score:.2f}")
    print(f"Highest Score   : {highest_score:.1f} ({', '.join(top_performers)})")
    print(f"Lowest Score    : {lowest_score:.1f} ({', '.join(bottom_performers)})")
    print(f"Pass Rate       : {pass_rate:.1f}% ({len(passed_students)} passed, {len(failed_students)} failed)")

    print("\n--- Grade Breakdown ---")
    for grade, count in grade_counts.items():
        percentage = (count / len(records)) * 100
        print(f"Grade {grade}: {count:2d} students ({percentage:5.1f}%)")

    print("\n--- Student Details ---")
    print(f"{'Student Name':<20} | {'Score':<6} | {'Grade':<5} | {'Status':<6}")
    print("-" * 42)
    for name, score in sorted(records.items()):
        status = "PASS" if score >= pass_threshold else "FAIL"
        print(f"{name:<20} | {score:<6.1f} | {assign_grade(score):<5} | {status:<6}")


# Example usage
if __name__ == "__main__":
    student_data = {
        "Amina S.": 88.5,
        "Daulet K.": 54.0,
        "Elena M.": 95.0,
        "Nursultan T.": 72.5,
        "Dana B.": 61.0,
        "Arman Z.": 42.0,
        "Aruzhan K.": 95.0,
        "Timur N.": 78.0,
    }

    analyze_grades(student_data, pass_threshold=60.0)