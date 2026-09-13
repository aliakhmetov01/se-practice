# Week 01 — Manual vs AI: Comparison

**Name:**
**Group:**
**Date:**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2)          |
| --- |----------------|--------------------------|
| Language / stack used | java           | Next.js + TypeScript     |
| Time to first version that ran | 60+-           | 10+-                     |
| Time to all 4 test cases passing | 90+-           | not all passed correctly |
| Number of attempts / prompts needed | some + fixes   | 2                        |
| Lines of code you actually wrote | 84             | 0                        |
| Did it handle invalid marks (case B)? | yes            | after fix yes            |
| Did it handle an empty list (case D)? | yes            | nope                     |
| Did it use the ≥ 50 pass threshold? | yes            | yes                      |
| Output format matches the spec? | yes            | sometimes no             |
| Can you explain every line of it? | maybe          | no                       |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | | | avg 67.00 · high 92 · low 23 · pass 60.0% | |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% | |
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% | |
| D | `abc, , xyz` | | | clear message, no crash | |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->
- A web interface using Next.js and TypeScript
- A grade distribution chart
- A sortable entries table
## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

- It did not initially parse comma-separated marks correctly
- no valid marks case did not work correctly

## 5. The defect I asked Rocket to fix

**Prompt I used:** Fix the app so that comma-separated student marks are parsed correctly, including invalid values such as text, empty values, numbers below 0, and numbers above 100.

**Result:** partly fixed

**What this tells me:**
prompt fixed the main parsing defect, but the output still did not like we expected
---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
