# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Ali Akhmetov (group: Monday 16:00–19:00)
**Student ID:** 25B032081
**GitHub:** aliakhmetov01

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude, run as three separate subagents from Claude Code (one per request); the lab itself was done with Claude Code — see AI_USAGE.md |
| Exact model (or "not displayed") | Claude Sonnet 5.5 (`claude-sonnet-5-5`) for R1–R3 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes — three separate subagents, each started with an empty context and only the README prompt |
| Python version (`python --version`) | Python 3.13.9 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether the meeting room can be booked for one time slot today and answers Available or Unavailable. Every time is a whole number of minutes since midnight, from 0 to 1440 (10:00 = 600, 09:15 = 555, 24:00 = 1440). The tool only checks: it does not save, create or change any booking. A slot is Unavailable if it does not start after now, is not before end, is longer than 120 minutes, the room is blocked, or it overlaps an existing booking (touching is allowed). Give every field; never guess a missing time.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start, whole minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end, whole minutes since midnight (24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "The current time, whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "true if the room is blocked (for example for maintenance), otherwise false."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings for today; an empty list if there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Booking start, minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Booking end, minutes since midnight."
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| (root) | `"type": "object"` | The arguments could be an array or a string; nothing below could even be looked up by name. |
| (root) | `"required": [start, end, now, blocked, bookings]` | A model could leave out `now` (S04) and the function would compare against `undefined`, so AC1 "start after now" silently never fires. |
| (root) | `"additionalProperties": false` | A model can invent fields like `"room": "204"` (S05) or `"date": "tomorrow"`; they are accepted and silently ignored, so the user believes the room/date was checked when it was not. |
| `start`, `end`, `now` | `"type": "integer"` | `"end": "11:00"` (S03) would pass, and `600.5` (S10) would pass; in JS `"11:00" > 600` is false, so the comparison gives a wrong answer instead of an error. |
| `start`, `end`, `now` | `"minimum": 0` | Negative times like `-30` (S06) would reach canBook; a day has no minute −30. |
| `start`, `end`, `now` | `"maximum": 1440` | `1500` (S07) — a time after midnight of the next day — would be accepted. 1440 itself must stay valid as `end` = 24:00 (S11), so it is `maximum`, not `exclusiveMaximum`. |
| `blocked` | `"type": "boolean"` | `"false"` (S09) is a non-empty string, which is *truthy* in JavaScript — a free room would be reported as blocked. |
| `bookings` | `"type": "array"` | A single booking object or `null` could be passed instead of a list; the overlap loop would crash or skip. No `minItems`, because `[]` is a valid "no bookings" (S02). |
| `bookings.items` | `"type": "object"` | A booking as a pair `[660, 720]` (S12) would be accepted, and `b.start` / `b.end` would be `undefined`, so no overlap is ever found (AC4 broken). |
| `bookings.items` | `"required": ["start", "end"]` | `{start: 660}` (S08) would pass; `end` is `undefined`, the overlap test is false, and a clash is missed. |
| `bookings.items.start/end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Same reasons as the top-level times: strings or out-of-day numbers inside a booking break the overlap comparison. |
| `bookings.items` | `"additionalProperties": false` | Stops invented booking fields (e.g. `"room"`, `"date"`) that the function would ignore without telling anyone. |
| `description` (tool + fields) | says minutes, 0–1440, examples, "does not save" | Without units a model sends `"10:00"` or hours (`10`); without "does not save" a model (or the user) may think calling it books the room. I deliberately did **not** use 16:30 as an example, so R2's conversion is the model's own work. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

Note: before writing anything I also ran the checker on the untouched template (empty `properties`,
empty `required`): it accepted every call, so S01, S02, S11 were PASS and the nine "refuse" cases
S03–S10, S12 were FAIL (9 FAILs). The "First run" column below is the first run of **my definition**.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | — |
| S02 | PASS | PASS | — |
| S03 | PASS | PASS | — |
| S04 | PASS | PASS | — |
| S05 | PASS | PASS | — |
| S06 | PASS | PASS | — |
| S07 | PASS | PASS | — |
| S08 | PASS | PASS | — |
| S09 | PASS | PASS | — |
| S10 | PASS | PASS | — |
| S11 | PASS | PASS | — |
| S12 | PASS | PASS | — |

The only edit after the first run was in the `description` text: I replaced the example
`16:30 = 990` with `09:15 = 555`, because 16:30 is exactly the time in R2 and would have handed
the model the answer. The schema itself was not changed, and S01–S12 were re-run after the edit
(all PASS).

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Match: F1–F3 PASS. 9:00 → 540, 10:00 → 600, 11:00 → 660, the booking 11:00–12:00 → 660–720,
"isn't blocked" → `false`. No extra fields, no prose, no code fence — it followed "nothing else".
canBook would answer Available: the slot ends exactly when the existing booking starts, and
touching is allowed (AC4).

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match: F4–F6 PASS. 13:30 → 810, 14:00 → 840, 16:30 → 990 (correct, not the 960 trap),
"blocked for maintenance" → `true`, "no other bookings" → `[]`. The model **did** make the call
even though the answer will be Unavailable — twice over: the room is blocked (AC3) and 150 minutes
is longer than 120 (AC2). It did not try to decide that itself, which is right: deciding Unavailable
is canBook's job. The schema accepted the call because every value is a valid integer/boolean —
neither "blocked" nor "150 minutes" is a shape problem.

### R3

```text
I did not call check_room. The request doesn't give enough information to fill the required arguments:

- It says "tomorrow", but the tool only checks slots for today.
- "Afternoon" and "a couple of hours" are not exact start and end times.
- The current time, whether the room is blocked, and the list of existing bookings are all missing.

The question I'd put to the user: What exact start and end time do you want for today, what is the current time, is the room blocked, and what bookings already exist? If they really want tomorrow, this tool can't check it.
```

What was missing: every required argument. `start` and `end` ("afternoon", "a couple of hours"
are ranges, not times), `now`, `blocked` and `bookings` are not mentioned at all, and "tomorrow"
is outside what the tool can check (the description says "today").

What the model did: it **asked** and invented nothing — no `start = 780`, no `now = 720`. So the
"never guess a missing time" line in the description worked. But it did not follow the format: the
prompt says "reply with one short question instead", and it wrote an explanation plus a long
five-part question, phrased in the third person ("The question I'd put to the user"). That third
person comes from how I ran it — as a Claude Code subagent that reports back to a parent agent, not
as a chat with the user. The checker does not catch this (F7 only checks that one non-empty r3 file
exists), so I record it here. Saved as `calls/r3.txt`, unedited (the only change is that Claude
Code indents subagent reports by two spaces when displaying them; I removed that display indent).

## 5. What the schema cannot check

With only the allowed keywords, a JSON Schema checks each value **on its own** (its type and a
fixed range). It cannot compare one argument with another or know anything outside the call.
So these acceptance criteria stay inside `canBook`:

- **AC1 (partly).** The schema enforces `0 ≤ start ≤ 1440` and `0 ≤ end ≤ 1440`, and that they are
  whole numbers. It can **not** enforce `start < end` (S01-style call with `start = end = 600` is
  valid) or "start after `now`" — both compare two fields, and `minimum`/`maximum` only take a
  constant. It also cannot reject `start = 1440`, which is valid for `end` but meaningless as a start,
  without making start and end use different ranges.
- **AC2 (max 120 minutes).** It is about `end − start`. No allowed keyword does arithmetic between
  fields, so R2's 150-minute request passes the schema.
- **AC3 (blocked).** The schema only knows that `blocked` is a boolean; `true` is a perfectly valid
  value (R2). Saying "Unavailable because blocked" is a business rule. (Using `enum: [false]` would
  wrongly make the call itself invalid instead of answering Unavailable.)
- **AC4 (no overlap, touching allowed).** Needs comparing the requested slot with every booking
  in the list — cross-field and cross-item logic. The schema checks only that each booking has
  integer `start`/`end`; it does not even check that a booking's own start is before its end.
- **AC5 (does not save).** A schema describes inputs, not behaviour. Only the implementation (and
  the description, which is a promise, not a guarantee) decides that nothing is written.
- **AC6 (the page's feedback).** That is UI, completely outside a tool call.

The part of AC1 the schema **can** enforce: both times are whole minutes inside the day,
0–1440 (and that `now` is too).

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The tool is read-only (AC5) and the schema refuses malformed arguments, so the worst outcome is a wrong Available/Unavailable answer the user can see and re-ask; nothing is changed. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading a source file in my own repo changes nothing and the file holds no secrets; the only risk is the content going into the model's context, which is acceptable for course code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | This changes a business rule (AC2) because one user asked for a longer slot — the agent would rewrite the spec to satisfy a request, breaking the tests and the agreed acceptance criteria; changing the rule is a human decision, not an agent action. |
| A4 | run `npm test` in `week-08/app` | ask | Tests are normally harmless, but `npm test` runs whatever script `package.json` defines and can trigger installs or lifecycle scripts, so I want to see the command first; after a review it could be allowed for this project. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `reset --hard` irreversibly throws away every uncommitted change in tracked files, including mine, not only the agent's three edits; I must confirm the target commit and that nothing else is lost. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit is local and reversible, but it records the agent's change under my name in my lab history, so I want to review the diff and the message before it is committed. |
| A7 | `git push` to `main` | block | Pushing to `main` publishes unreviewed changes to the shared remote and bypasses the PR the course requires (main must not be touched); it is hard to undo once others or the grader see it. |
| A8 | send the contents of `.env` to an MCP server it found online | block | This is secret exfiltration: `.env` holds keys and passwords, the server is unknown and untrusted, and "to configure it" is exactly the kind of instruction a prompt injection would plant; once sent, a secret cannot be taken back. |

## 7. Checkpoint

Before letting such an agent edit anything, I commit everything I have, so the agent starts from a
clean, known state. In this repository that checkpoint is commit **`d5e3a89`**
(`week-09: save model calls for R1, R2, R3 (unedited)`, on branch `week-09`, from
`git log --oneline`).

Command to go back to it:

```bash
git reset --hard d5e3a89
```

What it throws away: every commit made on `week-09` after `d5e3a89` (they stay reachable only
through `git reflog` for a while) and **all uncommitted changes to tracked files**, staged or not —
including any of my own edits made after the checkpoint, not just the agent's. It does **not**
delete untracked files (for example the untracked `node_modules/` and `week-08/app/` files in my
working copy); removing those would need `git clean -fd`, which I would not run without looking at
`git clean -n` first. It also does not undo anything already pushed to the remote.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None — the last run shows 30 PASS, 0 FAIL, 0 ERROR, so `known_fails` is `[]`.

Two problems the checker does **not** count, reported here so they are not hidden:

- **R3 format:** the model asked instead of guessing (good), but it did not reply with "one short
  question" as the prompt required — it added an explanation and a five-part question in the third
  person. F7 only checks that the file exists.
- **"Fresh chats":** the three requests were run as three separate Claude Code subagents (empty
  context each), not as three chats in a chat web app. Each subagent also had Claude Code's own
  system prompt in front of the lab prompt, which is a difference from a plain chat.

## 10. Conclusion (80–150 words)

The schema checks shape, the model maps words to numbers, and only canBook decides. My schema
refused all nine malformed calls on the first run, for example S09, because `"false"` as a string
would be truthy in JavaScript. But R2 shows the limit: start 840, end 990, blocked true is a valid
call, and only canBook can say Unavailable, twice — blocked (AC3) and 150 minutes (AC2). The schema
cannot compare fields, so `start < end`, start after now, and overlaps stay in the function.
The description mattered as much as the schema: "never guess a missing time" made the model ask on
R3 instead of inventing start = 780, though it still ignored "one short question". Finally, A3 and
A8 showed that permissions protect the rules themselves: an agent that may edit booking.ts can
"fix" AC2 instead of answering the user.
