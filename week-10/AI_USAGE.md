# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code (desktop app), fresh Explore sub-agent | claude-opus-5-5 | read-only risk review (Task 2) | none — "WITHOUT editing files" (`git status` clean afterwards) |
| Claude Code, fresh Explore sub-agent | claude-opus-5-5 | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval. The sub-agent drafted; the approved lines were applied in the main session, with two of them modified (see lab-report §6.2) |
| Claude Code, fresh general-purpose sub-agent | claude-opus-5-5 | minimal patches for two risks (Task 8): the R2 refactor | `app/src/booking.ts`, `app/src/App.tsx` (and `app/src/booking.test.ts`, which I reverted, see §8.2) |
| Claude Code, fresh Explore sub-agent | claude-opus-5-5 | the agent reads AGENTS.md (Task 1, Practice #09 prompt) | none |
| Claude Code, main session | claude-opus-5-5 | ran the whole lab on my instruction: git setup, baseline runs, UI screenshots (headless Edge script), claim checks, register, audit, applying the approved patches, and drafting `lab-report.md`, `AI_USAGE.md` and `submission.yml` | `week-10/` (all files except `provided/`, `README.md` and `tests/`) |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
The Explore sub-agent has no edit or write tools. It ran `tsc --noEmit` once, which writes nothing.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes
Each label rests on a file that was opened or a command that was run (`npm run build`, `npx vitest run`, `grep`, `ls`). The main Claude Code session did these checks on my instruction, not the reviewing sub-agent.

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->
From the Task 8 patch I rejected the test-file edit (the R4 fix), the `DAY_END` / `MAX_DURATION` / `CanBookParams` changes inside `canBook`, and the export of `toMinutes`. The refactor sub-agent edited before it was approved. That was caught in the diff review and is recorded in lab-report §8.2 as an agent-operations finding.

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
No other product. The same tool, Claude Code (claude-opus-5-5) in the main session, drafted the text of every section of `lab-report.md`, including §9.3 and §10, which the README asks to be my own words.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
The outputs were captured to files with `NO_COLOR=1` (no colour codes) and pasted from those files. The only change is in §6.1: the inner ```` ```diff ```` fence lines of the agent's answer were removed so that they would not break the Markdown block. That is noted there.

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes / no

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Ali Akhmetov
Date: 19 November 2026
