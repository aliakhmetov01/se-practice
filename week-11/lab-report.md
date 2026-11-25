# Week 11 — Lab report

**Name:** Ali Akhmetov
**Group:** Monday 16:00-19:00
**Date:** 25 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I built the feature with (tool) | Claude Code (desktop app, Code tab); the deck's implementation prompt went to a fresh general-purpose sub-agent with no earlier context |
| Its exact model (with its version, or `not displayed`) | claude-opus-5-5 (Claude Opus 5.5) |
| Assistant I reviewed with (tool) | Claude Code, a fresh **Explore** sub-agent (read-only: it has no Edit or Write tool), run on a different model from the builder |
| Its exact model (with its version, or `not displayed`) | claude-sonnet-5-5 (Claude Sonnet 5.5) |
| Starting point (`week-10` or `week-08`) | week-10 (`week-10/app` from the `week-10` branch, moved with `git mv` to `week-11/app`) |
| Baseline commit — the checkpoint of Part 0 | 0fafea2 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows 11, Node v24.19.0) |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/` before any change. **Exists:** `yes` or `no`. **Result:**
`pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 20 tests in `src/booking.test.ts`, all passing (§2.2) |
| `npm run build` | yes | fail | `tsc` stops on the duplicate `vitest` import in `src/booking.test.ts` lines 1 and 3 (`TS2300: Duplicate identifier 'describe'` …). This is Week 10's open risk R4, carried over unchanged; Vite never runs. |
| `npm run lint` | no | missing | `npm error Missing script: "lint"`: there is no ESLint in the project |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/`, before any change:

```text
$ npx vitest run
 RUN  v2.1.9 C:/Users/alyok/se-practice/week-11/app

 ✓ src/booking.test.ts (20 tests) 5ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  20:54:40
   Duration  485ms (transform 44ms, setup 0ms, collect 44ms, tests 5ms, environment 0ms, prepare 153ms)
```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | `app/src/booking.ts`: `canBook({ start, end, now, blocked, bookings })` returns `true`/`false`; `checkRequest(...)` (Week 10's R2 refactor) validates the raw "HH:MM" form values and then calls `canBook` |
| The UI component | `app/src/App.tsx`: the `App` component, its `check()` handler and the *Check availability* button (rooms in `ROOMS`: Room A-101 with a 10:00–11:00 booking, Room B-204 with none) |
| The repository instructions | `app/AGENTS.md` (the Week 10 patched playbook: AC1–AC6, edit `src/` only, no packages without approval, no login/database/backend, no secrets, `npm test` and `npm run build` before acceptance) |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

<!-- The deck's sentence, exactly. -->

As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | string, 1–60 characters after `trim()` | rejected (adapter never called) if it is not a string, is empty or blank after trimming, or is longer than 60 characters. It is **data**: never followed as an instruction, only ever passed on as a JSON value |
| `start` | input | string `"HH:MM"`, 24-hour, `00:00`–`23:59` | rejected if it does not match `^([01]\d\|2[0-3]):[0-5]\d$` |
| `end` | input | string `"HH:MM"`; `"24:00"` allowed for *Ends at 24:00* | rejected if it is not `HH:MM` (or `24:00`). start ≥ end is **not** rejected here: that is the checker's `invalid_time`, and it must still be explainable (E4) |
| `isAvailable` | input | boolean, the result of `canBook` | rejected if not a boolean, or if it disagrees with `reasonCode` (`true` only with `available`, `false` only with the five other codes) |
| `reasonCode` | input | one of `available`, `invalid_time`, `past_time`, `too_long`, `room_blocked`, `overlap`, from the deterministic `availabilityReason` in `booking.ts` | rejected if it is not one of the six codes |
| `explanation` | output | `{ explanation: string }` from the adapter, shown as plain text | replaced by the **fallback** if it is not a non-empty string, is longer than 280 characters, has more than two sentences, contradicts `isAvailable` (says available when unavailable, or the reverse), or names a time (`HH:MM`) that is not the request's `start` or `end` |

### 3.3 Acceptance criteria and failure behaviour

F1–F5 (README §3.4), then what the student sees in each failure:

<!-- Write below this line -->

- **F1** Existing availability and overlap rules remain unchanged. (`canBook` returns exactly what it returned in Week 10; all 20 old tests stay and pass.)
- **F2** The explanation agrees with the deterministic result; no invented booking details.
- **F3** Empty, malformed or overly long input is rejected.
- **F4** API timeout, error or unavailable key produces a safe fallback.
- **F5** A user can distinguish generated explanation from confirmed booking status.

In every failure the **status line (Available / Unavailable) stays exactly as `canBook` computed it**; only the explanation box changes.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | No model call. The explanation box says that the request could not be explained (invalid input) and why, e.g. "roomLabel must be 1–60 characters". The decision above it is unchanged. |
| The model times out | After the timeout (2000 ms) the box shows the **fallback** sentence built from the reason code, e.g. *"Room A-101 is unavailable for 10:30–11:30 because it overlaps an existing booking."*, labelled as a fallback explanation, not a booking decision. |
| The model fails (error, no key) | The same deterministic fallback sentence and the same fallback label; no error text from the adapter and no stack trace. |
| The model's answer contradicts the decision, or invents a detail | The output check discards the answer and the fallback sentence is shown instead. The model can never change the Available / Unavailable line. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the
adapter, and say which one decides availability.

```text
student form (room, now, start, end, Ends at 24:00, Room blocked)
   -> checkRequest / availabilityReason (booking.ts, the rule engine)   <-- DECIDES availability
        -> { isAvailable = canBook(...), reasonCode }  -> status line "Available" / "Unavailable"
   -> [Explain availability] button
        -> explainAvailability(input, adapter, timeoutMs)              (explain.ts)
             -> validate input (F3)  -- invalid -> "invalid input" message, adapter not called
             -> adapter (mockAdapter; a real model would only run behind a server)
                  -- timeout / throws -> fallback from reasonCode (F4)
             -> validate output (F2) -- bad / contradicting -> fallback from reasonCode
        -> explanation box, labelled "Generated explanation (mock), not a booking decision" (F5)

The checker (canBook / availabilityReason) decides. The adapter only explains: its text is shown
apart from the status line, and nothing it returns is ever written back to isAvailable.
```

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
(paste here)
```

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
(paste here)
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | |
| The timeout (milliseconds) | |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: (paste here)
```

```text
B: (paste here)
```

```text
C: (paste here)
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
(paste here)
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | | | | |
| B | | | | |
| C | | | | |

### 5.4 The one I chose

**Chosen:** A / B / C

<!-- Why, from the table above. Then confirm it is in explain.ts as SYSTEM_INSTRUCTION. -->

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | | | | |
| E2 | overlap | | | | |
| E3 | blocked room | | | | |
| E4 | invalid time | | | | |
| E5 | past time | | | | |
| E6 | empty input | | | | |
| E7 | long input | | | | |
| E8 | timeout | | | | |
| E9 | simulated API failure | | | | |
| UI | the UI never changes the deterministic decision | | | | |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
(paste here)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | |
| `evidence/explain-fallback.png` | |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

Where it ran, how you made sure it could not edit, and what you gave it (the diff, README,
`AGENTS.md`, the criteria):

<!-- Write below this line -->

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The reviewer's answer, pasted unedited:

```text
(paste here)
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | | | | | | | |
| V2 | | | | | | | |
| V3 | | | | | | | |

### 7.4 My own inspection, and the linter

What you checked by hand that the reviewer did not, and which of these findings a linter would have
caught and which it could not:

<!-- Write below this line -->

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
(paste here)
```

### 8.4 Ready for demonstration?

**Ready:** yes / no

**What remains unresolved:**

<!-- Write below this line -->

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Reflection

<!-- 80-150 words, in your own words, without the assistant: what the AI generated, what you
     verified, and what you changed. Name at least one finding ID (V1...) and one test ID (E1...).
     Worthless: "AI helped me build the feature faster and the review was useful."
     Worth everything: "Bolt wrote explain.ts and put a fetch to the OpenAI API in App.tsx with a
     VITE_ key; I rejected that file and kept the mock (X4). The reviewer's V3, 'prompt injection
     through roomLabel', was unsupported: the label comes from a fixed list. E8 failed at first
     because the timeout was never armed; V1 was confirmed by a test that failed before the fix." -->

<!-- Write your reflection below this line -->
