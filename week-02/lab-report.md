# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:Ali Akhmetov**
**Group:monday 16:00-19:00**
**Date:19.09.2026**

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

| # | Call | Required | A     | B   | C    | D    |
| --- | --- | --- |-------|-----|------|------|
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS    | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR |  PASS   | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR |  PASS   | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR |    PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR |  PASS   | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR |  PASS   | PASS | PASS |
| | **Totals** | | 0/6   | 6/6 | 6/6  | 6/6  |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt   | Case | What actually happened |
|----------| --- | --- |
| Prompt A | Cases 1–6 | No callable named analyze_marks was defined; the AI created analyze_grades instead.|
|          | | |
|          | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list must be a non-empty list or tuple.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid non-numeric mark encountered: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of range [0, 100]: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: The marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric value encountered: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark -1 is out of valid range [0, 100].
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric mark encountered: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of range [0, 100]: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D  |
| --- |---|---|---|----|
| Correctness (cases passed) | 0 | 2 | 2 | 2  |
| Requirement coverage | 0 | 2 | 2 | 2  |
| Verifiability (tests) | 0 | 0 | 2 | 2  |
| Assumptions stated | 0 | 1 | 2 | 2  |
| Noise (2 = none) | 0 | 2 | 1 | 2  |
| **Total / 10** | 0 | 7 | 9 | 10 |

**Prompt length, in words:** A __7__ · B __42__ · C __72__ · D __110__

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:
B over A: 5 words per point; C over B: 15 words per point; D over C: 38 words per point. This shows that Prompt B gave the biggest improvement for the fewest extra words, while C and D added more detail with smaller score gains.
---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
Prompt D received the highest overall score, so it was the best prompt in this experiment. However, Prompt B was already strong enough for the required task because it passed all six harness cases. Prompt A failed all six cases because the AI created a function named analyze_grades instead of the required analyze_marks, so the harness could not call it. The most useful addition was the exact function signature and return requirements in Prompt B. This changed the result from 0/6 in Prompt A to 6/6 in Prompt B.

Prompt C added examples, tests, and explicit assumptions, which improved verifiability, but it did not increase the harness result because Prompt B already passed every case. Some of the extra validation, such as special handling of boolean values, was not required by the six official tests. Prompt D also passed 6/6, but it was clearer because it explicitly stated that a mark passes when mark >= pass_mark and that average and pass_rate must be rounded to two decimal places. The main ambiguity I found was rounding, and I resolved it by defining two-decimal rounding directly in Prompt D.



```

**Word count:**
170
---

## 9. Two questions for the debrief

Written before class, answered in class.

1. If Prompt B already passed all six tests, how can we decide whether the extra details in Prompt C and Prompt D are still useful in a real software project?

2. How should we choose the right amount of detail in a prompt without making it unnecessarily long or adding too much noise?
