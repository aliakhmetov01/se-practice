# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- |--------------------| --- | --- |
| Gemini | Gemini 3.8 flash   | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Gemini | Gemini 3.8 flash             | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Gemini | Gemini 3.8 flash           | comparative guidance and report structure review | none |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** yes
<!-- If an assistant edited app/ directly, say which change and how you reviewed it. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
Used Gemini (Advanced) to double-check formatting and verify table consistency against report requirements.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
none — both the interval boundary logic (BUG-A) and array immutability purity requirements (BUG-B) were manually reviewed and verified with tests.

Signed: Ali Akhmetov
Date: 2026-11-08
