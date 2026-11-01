# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced[cite: 2].

| Tool     | Exact model / plan | Used for | Which files it touched | Reused from |
|----------|--------------------| --- | --- | --- |
| Gemini   | Gemini 3.8 flash   | the plan (stage A) | `report.md` | this SIS |
| Gemini   | Gemini 3.8 flash   | Python v1 (stage B) | `code/original/booking_v1.py` | this SIS |
| Bolt.new | Standart | web prototype v1 (stage B) | `web/original/` | this SIS |
| Gemini   | Gemini 3.8 flash   | critique (stage C) | `report.md`, `code/booking.py` | this SIS |
| Bolt.new | Standart           | repair (stage D) | `web/final/` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
The assistant helped generate the boilerplates and test methods for `code/test_booking.py` (T1 through T11). I independently verified every expected value against the written specifications of AC1–AC5 rather than relying on what the initial code returned; specifically, I ensured T1 expects `True` according to AC4's touch rule despite the AI's v1 code returning `False`.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:**
None. Every conditional branch in `booking.py`, every test assertion in `test_booking.py`, and the state updates in the React prototype were examined, cross-referenced with AC1–AC6, and understood.

Signed: Ali Akhmetov
Date: 01.11.2026
