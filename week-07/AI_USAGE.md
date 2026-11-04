# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan   | Used for | Which files it touched |
| --- |----------------------| --- | --- |
| Gemini | Gemini 3.8 flash | the first test suite (Task 3) | suites/first/booking.test.ts, app/src/booking.test.ts |
| Gemini | Gemini 3.8 flash | the improvement prompt (Task 5) | app/src/booking.test.ts, lab-report.md |
| Gemini | Gemini 3.8 flash     | extracting logic and drafting report | app/src/booking.ts, app/src/App.tsx, lab-report.md |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->
Extracted booking validation logic from App.tsx into app/src/booking.ts. Verified that identical validation conditions are preserved and manual UI checks confirmed identical behavior.
**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes 

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:** none
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Ali Akhmetov
Date: 04-11-2026
