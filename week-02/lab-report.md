# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:**
**Group:**
**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Gemini|
| Exact model name | Gemini 3.8 Flash|
| Implementation language |Python|
| Date of the runs | 2026-09-19|

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. The AI assumed the input should be a dictionary mapping student names to scores.
2. The AI assumed the passing threshold should be 60 instead of 50.
3. The AI assumed the program should calculate median, letter grades, grade distribution, top performers, and bottom performers.
4. The AI assumed results should be printed to the terminal instead of returned as a dictionary.
5. The AI assumed student names and example data should be included.

**Questions it should have asked and did not:**

1. What exact function name, parameters, and return format are required?
2. How should invalid input be handled, and what pass mark should be used by default?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called: No — it is called analyze_grades(records, pass_threshold=60.0).

**First impression before testing** (one sentence — you will compare this with section 6 later):
The code looks complete, but it probably will not match the required interface because it uses a different function name, input format, and default pass mark.
---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It specified the exact function name and signature: analyze_marks(marks, pass_mark=50).
2. It specified the required return keys, validation rules, ValueError behavior, and no external libraries.

**What B still leaves open:**

1. It does not say whether average and pass_rate must be rounded, or to how many decimal places.
2. It does not explicitly state whether a mark equal to pass_mark counts as passing.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- |----------------------------|
| one mark | yes                        |
| decimals | yes                        |
| custom pass_mark | yes                        |
| empty list | yes                        |
| text value | yes                        |
| below 0 / above 100 | yes                        |

**Do the AI's own tests pass against the AI's own code?** no

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code:** 

1. marks must be an iterable containing numeric values.
2. Boolean values are rejected as non-numeric.
3. average and pass_rate are rounded to two decimal places.
4. highest and lowest preserve their exact numeric values.
5. pass_mark must be numeric and between 0 and 100.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).

Requirements:
- Return one dictionary with exactly these keys: average, highest, lowest, pass_rate.
- marks must contain only numeric values from 0 to 100.
- Raise ValueError for an empty list, any non-numeric value, or any value outside 0 to 100.
- A mark passes when mark >= pass_mark.
- average and pass_rate must be rounded to two decimal places.
- highest and lowest must preserve their original numeric values.
- Use no external libraries.

Example:
analyze_marks([40, 60, 80], 50) ->
{"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}

Include tests for:
- one mark
- decimal marks
- custom pass_mark
- empty list
- text value
- marks below 0 or above 100

State any assumptions before the code. Return the implementation and tests only, with no unrelated features.
```

**What I deliberately added that A, B and C did not have:**

1. I explicitly stated that a mark passes when mark >= pass_mark.
2. I explicitly required average and pass_rate to be rounded to two decimal places.
3. I required exactly the four keys average, highest, lowest, pass_rate and no unrelated features.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification was ambiguous about rounding. I resolved it by requiring average and pass_rate to be rounded to two decimal places.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
