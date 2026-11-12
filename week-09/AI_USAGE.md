# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (three Claude Code subagents, one fresh context per request) | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Claude Code (desktop app, agent mode) | Claude Opus 5.5 (`claude-opus-5-5`) | The whole lab on my request: created the `week-09` branch, unzipped the files, wrote `tool/check_room.json`, ran the checker, launched the three Part 2 subagents and saved their replies, wrote lab-report.md (all sections, including §§8–10), this file and submission.yml, made the commits and opened the PR | week-09/tool/check_room.json, week-09/calls/*, week-09/lab-report.md, week-09/AI_USAGE.md, week-09/submission.yml |

**I wrote `tool/check_room.json` myself:** no
Claude Code (Opus 5.5) wrote the whole definition — name, description and schema. It was checked
by running `python tests/check_tool.py` (D1–D6 and S01–S12 all PASS on the first run of the
definition) and by the reasons table in lab-report.md §2, one row per constraint. After the first
run the description example `16:30 = 990` was replaced with `09:15 = 555` so it would not give
away the R2 answer.

**I used an AI to explain a JSON Schema keyword or a check:** yes
Claude Code explained why `maximum` (not `exclusiveMaximum`) is needed so 1440 stays valid (S11),
and why the allowed keywords cannot express `start < end` (§5).

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes
The only difference: Claude Code shows a subagent's report indented by two spaces; that display
indent was removed. No words, numbers or line breaks were changed.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
The lab was done by Claude Code on my request, so all of lab-report.md, including the sections the
course asks to be in my own words (§§8–10), was AI-written. I have to read it and be ready to
defend it. The R3 run was a Claude Code subagent, not a chat in a web assistant; the difference
(an extra Claude Code system prompt, the third-person reply) is described in lab-report.md §4 and §9.

Signed: Ali Akhmetov
Date: 2026-11-12
