# AI Usage Disclosure — Week 06

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Bolt.new | Default web agent (Free tier) | prototype v1 (Task 2) | All files in `original/` (`src/App.tsx`, `src/bookingLogic.ts`, config files) |
| Bolt.new | Default web agent (Free tier) | cleanup prompts (Task 4) | `prototype/src/App.tsx`, `prototype/src/bookingLogic.ts` |
| Gemini | Gemini (Web chat) | structuring bug evaluations, and assisting with lab report writeup | `week-06/lab-report.md`, `week-06/AI_USAGE.md` |

**I used another assistant as well (to explain code, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
Yes: Gemini, used to help structure test-case analysis and draft explanations of `lab-report.md`
**`original/` holds Bolt's first version exactly as downloaded, and `evidence/v1.png` shows it:** yes

**Every screenshot in `evidence/` is an unedited capture of the page as it behaved:** yes

**I can explain the component I chose in lab-report.md section 8 — and how the page decides
availability — without the assistant:** yes 

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None. All interval arithmetic and validation checks in `src/bookingLogic.ts` were reviewed line-by-line during the T1–T9 testing process.
Signed: Ali Akhmetov
Date: 15.10.2026
