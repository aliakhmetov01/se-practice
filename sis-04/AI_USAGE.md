# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

**Summary.** I gave Claude Code (Claude desktop app, Code tab) the assignment text and the handout
and asked it to do the assignment. Claude Code did most of the work in this repository: it created
the `sis-04` branch, brought the week-08 app in, ran the commands, wrote the code, tests, diagrams
and report sections 1-9, took the screenshots in the app's built-in browser and made the commits
(authored with my git identity, with a `Co-Authored-By: Claude` trailer). For the three exchanges
in report §8 it sent the prompts to separate Claude Code sub-agents of the same model and recorded
their answers unedited (cut with […]). Report §10 (the reflection) is mine and was not written by
the assistant.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude Code (main session) | claude-opus-5-5 (Claude Opus 5.5) | 2026-11-13 | baseline set-up and run, report §1-§9, plan, code, refactoring, tests, screenshots, diagrams, commits | everything under `sis-04/` except `README.md`, `starter/`, `tests/` (provided, unchanged) and report §10 |
| Claude Code sub-agent | claude-opus-5-5 | 2026-11-13 | codebase analysis (Task 1), exchange 8.1 | none (read `sis-04/app/src`, ran `npm test` and `npx tsc --noEmit`) |
| Claude Code sub-agent (same as above) | claude-opus-5-5 | 2026-11-13 | improvement plan, exchange 8.2 | none |
| Claude Code sub-agent | claude-opus-5-5 | 2026-11-13 | feature extension and tests (Tasks 2, 4), exchange 8.3 | none (answer in text; the main session adapted it into `src/booking.ts`, `src/filter.ts`, `src/checkRoom.test.ts`, `src/filter.test.ts`) |
| Claude desktop built-in browser (driven by Claude Code) | — | 2026-11-13 | running the page from `npm run dev` at localhost, the five screenshots, the manual checks in report §4/§8 | `evidence/*.jpg` |

**The assistant wrote, or helped write, tests in `app/`:** yes
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->
All of `src/checkRoom.test.ts` and `src/filter.test.ts`, and the B1-B4 IDs added to four existing
titles in `src/booking.test.ts`. The expected values were derived by hand from F1-F5 and AC1-AC5
(the derivation for each is in report §6.1 and §8.3), and both new files were run and failed
before `checkRoom` / `filterRooms` existed.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes
(run by Claude Code in my local checkout; colour codes removed with `NO_COLOR=1`, nothing else changed)

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes / no

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <your name>
Date:
