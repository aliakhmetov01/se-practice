# AI Usage Disclosure — SIS #05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code (desktop app), Explore sub-agent | claude-sonnet-5-5 | read-only risk review (Task 4) | none — "do not modify files" (`git status` identical before and after) |
| Claude Code (desktop app), main session | claude-opus-5-5 | I asked it to do the whole SIS for me ("сделай все за меня"). It created the branch and the baseline commit, ran every command and browser check, wrote `AGENTS.md`, did the Adapter refactoring, verified the review findings, built the register and the audit, wrote both mitigations with their failing-first tests, and drafted `report.md`, this file and `submission.yml` | `project/AGENTS.md`, `project/.gitignore`, `project/src/form.ts`, `form.test.ts`, `gitignore.test.ts`, `node-child-process.d.ts`, `App.tsx`; `report.md`, `AI_USAGE.md`, `submission.yml`; `evidence/*.jpg` (screenshots from the browser pane) |
| Claude desktop app browser pane (driven by the main session) | — | AC5 and the R2 / F3 / F10 checks on the running page | none (screenshots saved to `evidence/`) |

**The risk review ran in a mode where the assistant could not modify files, and `git status` showed
no change afterwards:** yes

**Every finding in report.md §5.2 was labelled after I opened the file or ran the command myself:** yes, with one caveat. The checks were run in this session by the main Claude Code session on my instruction, not typed by me. Each label in §5.2 cites the command and output it rests on.

**Every change to `project/` was reviewed by me as a diff before I accepted it:** no, not yet. The diffs are pasted in report.md §8.1–§8.2 and §4.3; the main session reviewed them against the tests. I still have to read them myself before submitting.
<!-- Name anything you accepted without reading. -->

**`AGENTS.md`: the assistant loaded it by itself / I pasted it / I did not use it with an assistant:**
I pasted it.

**The weaknesses, the labels, the scores, the decisions and the reflection are my own judgement,
written by me:** no

**Every output in report.md was pasted from a real run, unedited:** yes. Colour codes were stripped. In §8.3, one `git status` line was re-run because the first attempt used a wrong path; this is said there.

**No real credentials, confidential data or personal data are anywhere in `sis-05/`:** yes. All room data is fictional; the screenshots show only the demo page. Local paths in the pasted output contain my Windows user folder name.

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
`project/src/node-child-process.d.ts`: a hand-written type declaration for Node's `spawnSync`, used only by the R1 test instead of installing `@types/node`. Also the `git check-ignore --no-index` flags in `src/gitignore.test.ts`.

Signed: Ali Akhmetov
Date: 2026-11-25
