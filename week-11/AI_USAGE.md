# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code (desktop app), fresh general-purpose sub-agent | claude-opus-5-5 | the feature: mock adapter, explain.ts, the button (Task 3) | `app/src/booking.ts`, `app/src/explain.ts` (new), `app/src/App.tsx`, `app/src/index.css`. It also wrote and deleted a temporary test file of its own. |
| Claude Code, three fresh general-purpose sub-agents (one per prompt, no tools used) | claude-opus-5-5 | the three prompts compared (Task 4) | none — a fresh chat per prompt |
| Claude Code, fresh **Explore** sub-agent (no Edit/Write tools) | claude-sonnet-5-5 (a different model from the builder) | read-only agentic review (Task 6) | none — "Do not edit files"; `git status` showed no change afterwards |
| Claude Code, main session | claude-opus-5-5 | the two fixes (Task 7): V2 in `validateOutput` with its three regression tests, V1 removing the duplicate import | `app/src/explain.ts`, `app/src/explain.test.ts`, `app/src/booking.test.ts` |
| Claude Code, main session | claude-opus-5-5 | ran the whole lab on my instruction: git setup and commits, baseline and test runs, the two modifications in §4.2 (timeout 2000 ms, `SYSTEM_INSTRUCTION`), `explain.test.ts` (E1–E9), the screenshots and the UI check (a headless-Edge DevTools script), the probe tests behind V2–V4 and V7, and drafting `lab-report.md`, this file, `submission.yml` and the PR description | `week-11/` (everything except `README.md` and `tests/`) |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes
<!-- Name anything you accepted without reading. -->
Each file was read as a diff before the commit `week-11: explain availability with a mock adapter`. The decisions are in §4.2: `explain.ts` was modified, and the proposed `booking.test.ts` change was rejected.

**No API key, token or provider call is anywhere in `app/src/`:** yes
`grep` for `fetch`, `VITE_`, `openai`, `anthropic` and `sk-` in `app/src/` finds nothing, and checker X4 and X5 pass.

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
The Explore agent type has no Edit or Write tool. It ran `npx vitest run` and `npm run build`. The build failed in `tsc`, so no `dist/` was written. Afterwards `git status --short week-11/app` showed only the untracked `node_modules/`.

**I labelled every finding in §7.3 after verifying it myself:** yes
Each label rests on a test, a probe test, a command or a step on the page. The main Claude Code session ran these on my instruction, not the reviewing sub-agent. Two of the reviewer's own "confirmed" claims got different labels from me: one is half wrong (V6), and V7 is unsupported.

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
No other product. The same tool, Claude Code (claude-opus-5-5) in the main session, drafted the text of every section of `lab-report.md`. That includes §10, which the README asks to be in my own words, so I have to rewrite §10 myself before the PR is graded.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
The outputs were captured to files with `NO_COLOR=1` and pasted from those files. There are three changes, each noted where it happens:
- In §4.1, the triple-backtick fences of the pasted contract are shown as `~~~`, and its heading lines are indented by one space.
- §8.2 adds a diff of the two build outputs. It is labelled as such and is not a code diff.
- The V2 test-first run (3 failed, 32 passed) is quoted in §7.3, not pasted in full.

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
`app/src/explain.ts`: the details of the `timesIn` regular expressions (the am/pm and `11h00` forms). I rely on the tests for those, not on reading the regexes.

Signed: Ali Akhmetov
Date: 25 November 2026
