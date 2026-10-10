# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for                                         | Which files it touched |
| --- | --- |--------------------------------------------------| --- |
| Gemini | Gemini 3.8 Flash | the plan (Task 1)                                | `lab-report.md` |
| Gemini | Gemini 3.8 Flash | the first version, v1 (Task 2) and critique      | `code/original/booking_v1.py`, `code/booking.py`, `lab-report.md` |
| ChatGPT | GPT-5.6 Sol | helpp to understand task, checker interpretation | `code/test_booking.py`, `lab-report.md` |
**The assistant wrote, or helped write, my tests in `code/`:** yes
<!-- Either answer is allowed. If "yes": say which tests, and how you checked that their EXPECTED
     values come from AC1–AC5 and not from what the generated code happens to return. -->
ChatGPT helped propose the additional tests in `code/test_booking.py`. I checked the expected values against AC1–AC5, not against the output of the implementation. The checker also confirmed that the suite catches M1–M10.
**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->
none.
Signed: Ali Akhmetov
Date: 10.10.2026
