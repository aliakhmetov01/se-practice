# SIS #05 — Report

**Name:** Ali Akhmetov
**Group:** monday 16:00-19:00
**Date:** 2026-11-25

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

> **Disclosure.** I asked Claude Code to carry out this SIS for me. It ran every command, wrote
> every change and drafted this whole report. All of that is listed in `AI_USAGE.md` and §11. The
> read-only risk review in §5 used a separate sub-agent on a different model. Every output below
> was pasted from a real run in this session.

---

## 1. Setup and the project

| | |
| --- | --- |
| Project (name, and what it does in one line) | Smart Campus Room Availability: lists a fictional catalog of rooms, filters them by attendees and equipment, and says whether the chosen room can be booked for a start and end time today |
| Language and stack | TypeScript 5.9.3; React 18.3, Vite 5.4.21, Vitest 2.1.9; Node 24.19.0, npm 11.17.0 |
| Where it comes from (my own / Smart Campus / other: say what) | Smart Campus: my own SIS #04 app (`sis-04/app` on branch `sis-04`), copied unchanged. Nothing is taken from my Week 10 or Week 11 worksheets; the findings, the register and the audit are new and about this code. |
| Baseline commit — the project brought in unchanged (§3 of the README) | `2e65e6a`. The tree of `sis-05/project` at this commit is `a68e8fc`, identical to `sis-04:sis-04/app` (`git rev-parse` of both). |
| Assistant (tool) | Claude Code (desktop app, Code tab). The main session did the work; a read-only Explore sub-agent did the §5 review. |
| Exact model (with its version, or `not displayed`) | claude-opus-5-5 (main session); claude-sonnet-5-5 (the §5 reviewer) |
| Where I ran the commands (my computer / Codespace / Bolt terminal / …) | My computer: Windows 11, Git Bash, Node 24.19.0. The page was checked in the Claude desktop app's browser pane at `http://127.0.0.1:5173`. |

---

## 2. Task 1 — baseline and context

### 2.1 Repository map

Real paths in `project/`.

| Part | Where (paths) and what it does |
| --- | --- |
| Entry points | `index.html` loads `src/main.tsx`, which mounts `src/App.tsx` (page state and wiring) with `createRoot` |
| Modules | `src/booking.ts`: `canBook` (the five booking rules) and `checkRoom` (one room from the catalog) · `src/filter.ts`: `filterRooms` (F1 capacity, F2 all selected equipment) · `src/time.ts`: `toMinutes`, `fmt`, `END_OF_DAY` · `src/rooms.ts`: the types and the fictional `ROOMS`, `EQUIPMENT`, `DEMO_NOW = 540` · `src/components/RoomFilter.tsx`, `RoomList.tsx`, `ResultMessage.tsx`: presentation only |
| Dependencies (and where they are declared) | `package.json`: `react`, `react-dom` ^18.3.1; dev: `typescript` ^5.5.3, `vite` ^5.4.2, `vitest` ^2.1.9, `@vitejs/plugin-react` ^4.3.1, `@types/react(-dom)`. Exact versions are pinned in `package-lock.json` (vite 5.4.21, vitest 2.1.9, esbuild 0.21.5). No `@types/node`. |
| Tests | `src/booking.test.ts` (19), `src/checkRoom.test.ts` (5), `src/filter.test.ts` (9): 33 Vitest tests on the real modules, run by `npm test`. None for `time.ts`, `App.tsx` or the components. |
| Build / run scripts | `package.json` scripts: `dev` (vite), `build` (`tsc && vite build`), `preview`, `test` (`vitest run`). `tsconfig.json` sets `strict`, `noEmit`. `vite.config.ts` adds the React plugin. No lint script, no ESLint, no CI. |

### 2.2 Commands

At least three. **Kind:** `test`, `lint`, `type`, `build` or `run`. **Exists:** `yes` / `no`.
**Result:** `pass`, `fail`, `missing` or `not run` (say why in the note).

| Command | Kind | Exists | Result | Note |
| --- | --- | --- | --- | --- |
| `npx vitest run` (= `npm test`) | test | yes | pass | 3 files, 33/33 tests (§2.3) |
| `npx tsc --noEmit` | type | yes | pass | no output, exit 0 |
| `npm run build` | build | yes | pass | `tsc && vite build`; `dist/assets/index-6Yj10Ctb.js 147.38 kB`, built in 694 ms |
| `npm run lint` | lint | no | missing | `npm error Missing script: "lint"`; there is no ESLint config either |
| `npx vite --port 5174` on a clean `git archive 2e65e6a` copy | run | yes | pass | The page loads at 127.0.0.1:5174, and typing `-5` attendees gives "Rooms (5 of 5)" (weakness 4) |

### 2.3 Baseline output

The **real** output of the baseline test run (or of running the program, if there were no tests):

```text

 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-05/project

 ✓ src/checkRoom.test.ts (5 tests) 5ms
 ✓ src/filter.test.ts (9 tests) 6ms
 ✓ src/booking.test.ts (19 tests) 7ms

 Test Files  3 passed (3)
      Tests  33 passed (33)
   Start at  21:35:45
   Duration  529ms (transform 85ms, setup 0ms, collect 149ms, tests 18ms, environment 1ms, prepare 407ms)
```

### 2.4 Weaknesses and missing checks

At least three. **Evidence:** a file and line, or a command and its output. **Kind:** `fact` (you saw
it) or `assumption` (not yet shown).

| # | Weakness or missing check | Evidence | Kind |
| --- | --- | --- | --- |
| 1 | No linter: nothing enforces the code style beyond `tsc` | `npm run lint` → `npm error Missing script: "lint"`; no `.eslintrc*` or `eslint.config.*` in `project/` | fact |
| 2 | `project/` has no `.gitignore`, and the root `.gitignore` lists only `.idea/`, `*.iml` and `out/`, so `node_modules/`, `dist/` and a `.env` can be committed | After `npm ci` and `npm run build`, `git status --porcelain sis-05` → `?? sis-05/project/dist/` and `?? sis-05/project/node_modules/` | fact |
| 3 | The dev dependencies have known vulnerabilities | `npm audit` → `6 vulnerabilities (3 moderate, 1 high, 2 critical)`: tinypool (critical), esbuild ≤0.24.2 (GHSA-67mh-4wv8-2f99), vite ≤6.4.3, vitest ≤4.1.10 | fact |
| 4 | Invalid attendees are accepted silently: `-5` or `0` lists every room | `src/App.tsx:23` converts with `Number(attendees)` and falls back to 0; in the browser (clean baseline copy), attendees `-5` → heading "Rooms (5 of 5)" with no message | fact |
| 5 | The form-to-minutes conversion in `App.tsx:41-54` and `src/time.ts` have no tests | `git grep -n "time'" 2e65e6a -- 'sis-05/project/src/*.test.ts'` → no match; Vitest lists only 3 test files | fact |
| 6 | A time that is not `HH:MM` would reach the rules as `NaN` and be shown as "NaN:NaN" | `src/time.ts:6-9` splits on `:` with no check; not shown in a browser (Edge's time input only gives `HH:MM`) | assumption |

### 2.5 Acceptance criteria

Three to five things that must still be true after every change, and how you check each one.

| ID | Must remain true | How I check it (a test, a command, a step) |
| --- | --- | --- |
| AC1 | The booking rules give the same answers: a valid free slot is available; past, reversed, longer than 120 min, past 24:00, blocked or overlapping slots are not; touching slots are allowed | `npm test`: the 19 tests in `booking.test.ts` and the 5 in `checkRoom.test.ts` pass unchanged |
| AC2 | The room list shows only rooms with capacity ≥ attendees that have *all* the selected equipment | `npm test`: the 9 tests in `filter.test.ts` pass unchanged |
| AC3 | No rule or helper mutates the catalog or its bookings | `npm test`: the AC5 tests in `booking.test.ts`, `checkRoom.test.ts` and `filter.test.ts` |
| AC4 | The project type-checks under `strict` and builds | `npx tsc --noEmit` (no output) and `npm run build` (`✓ built`) |
| AC5 | The page works: no room → "Choose a room from the list first."; Room A-101, 11:00–12:00 → "Available" | Manual check in the browser pane at `npm run dev` (done after Task 3, §4.4, and again after R2, §8.2) |

---

## 3. Task 2 — agent instructions

### 3.1 The file and how the assistant reads it

| | |
| --- | --- |
| File (`project/AGENTS.md` or `project/CLAUDE.md`) | `project/AGENTS.md` (commit `1143373`; the architecture table was updated in `379c454`) |
| Created or improved? | Created. The project had no agent file. |
| Does the assistant load it by itself? (`yes` / `no, I pasted it` / `not sure, I pasted it`) | not sure, I pasted it. Claude Code loads `CLAUDE.md` by itself; I did not confirm that it loads `AGENTS.md`. The reviewer prompt (§5.1) therefore contains the safe commands, the forbidden actions and the review gate, pasted, and tells it to read the file. The main session wrote the file and read it as it went. |

### 3.2 What it covers

Where each topic is in the file (the heading, or the line).

| Topic | Where in the file |
| --- | --- |
| Purpose | `## Purpose` |
| Architecture | `## Architecture`: a path / responsibility / "may it hold rules?" table, plus the minutes convention |
| Setup | `## Setup`: Node 18+ (checked on 24.19.0), `npm ci` |
| Safe commands | `## Safe commands`: `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run dev`, `npm audit`, and "there is no `npm run lint`" |
| Coding conventions | `## Coding conventions`: strict TS, no `any` or `@ts-ignore`, pure rules, test names start with an ID |
| Test expectations | `## Test expectations`: test, tsc and build pass; a bug fix starts with a failing test; never edit a test to make it pass |
| Forbidden actions | `## Forbidden actions`: never commit secrets, never deploy or publish, never run destructive commands, never change dependencies without review. Also `## Review gate`: a human approves every PR. |

---

## 4. Task 3 — a focused pattern decision

### 4.1 The maintainability problem

<!-- One problem: the file and lines, and why it makes the code harder to change. Write below this line -->

UI mixed with input translation. In `src/App.tsx` at the baseline, line 23 turns the attendees
string into a number (`Number(attendees) || 0`). Lines 41-54 (`check()`) decide which form message
to show and turn the start and end strings and the "Ends at 24:00" checkbox into minutes
(`toMinutes(start)`, `endOfDay ? END_OF_DAY : toMinutes(end)`). This is the boundary between what the
form holds (strings, a boolean) and what the rules take (numbers of minutes). It sits inside a React
component, and the project has no component-testing library, so no test can reach it. Every rule
about input (weaknesses 4 and 6) would have to be changed and checked by hand in the browser.

### 4.2 The pattern I evaluated

<!-- Strategy, Adapter, or another you can name; what it would change for this problem. Write below this line -->

**Strategy** (interchangeable validation algorithms) does not fit. There is one way to read this
form and no variant to switch between, so a Strategy interface would add types and one
implementation and solve nothing.

**Adapter** fits. The form's interface (`start: '11:00'`, `endOfDay: true`, `attendees: '12'`) and
the rules' interface (`canBook({ start: 660, end: 1440, … })`, `filterRooms({ attendees: 12 })`) are
incompatible, and an adapter's job is to translate one into the other. In TypeScript a class
`FormAdapter` would be ceremony. The useful core is a small module of pure functions in the adapter
role: `toAttendees(value)` and `toRequest(form)`. The page calls these instead of converting by
itself, and Vitest can test them without React.

### 4.3 My decision, before and after

**Decision:** applied

<!-- Why, and the structure before and after (functions, modules, or a diagram in a code block). Write below this line -->

Applied as **one** focused refactoring (commit `496f9a6`). It moves code without changing
behaviour: the same messages in the same order, the same conversions, and even the same
`Number(value) || 0` for attendees, so that fixing that weakness stays a separate, visible
mitigation (R2). The page is no longer the only place where input handling can be checked: six new
tests (P1-P6) pin its current good behaviour.

```text
BEFORE (2e65e6a)                                   AFTER (496f9a6)
src/App.tsx                                        src/App.tsx
  line 23  Number(attendees) || 0                    filterRooms(ROOMS, { attendees: toAttendees(attendees), … })
  check()  2 if-branches with messages,              check()  const read = toRequest({ start, end, endOfDay, roomChosen })
           toMinutes(start), END_OF_DAY,                      'error' in read ? show read.error : setRequest(read.request)
           toMinutes(end)                          src/form.ts  (new, pure, no React)
  imports  END_OF_DAY, fmt, toMinutes                toAttendees(value): number
                                                     toRequest(form): { request } | { error }
                                                   src/form.test.ts  (new) P1-P6
rules untouched: booking.ts, filter.ts, time.ts, rooms.ts, components/
```

### 4.4 The acceptance criteria still hold

The real output of the same checks, run after the decision:

```text
> npm test

> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-05/project

 ✓ src/checkRoom.test.ts (5 tests) 6ms
 ✓ src/booking.test.ts (19 tests) 7ms
 ✓ src/filter.test.ts (9 tests) 7ms
 ✓ src/form.test.ts (6 tests) 4ms

 Test Files  4 passed (4)
      Tests  39 passed (39)
   Start at  21:38:51
   Duration  525ms (transform 156ms, setup 0ms, collect 245ms, tests 23ms, environment 1ms, prepare 561ms)

> npx tsc --noEmit
(no output: 0 errors)
> npm run build

> smart-campus-availability@0.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
transforming...
✓ 39 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.43 kB │ gzip:  0.29 kB
dist/assets/index-DVGJkppb.css    1.86 kB │ gzip:  0.73 kB
dist/assets/index-BDn9Tq5v.js   147.57 kB │ gzip: 47.72 kB
✓ built in 647ms
```

AC5, in the browser pane at `npm run dev` (`496f9a6`): pressing "Check availability" with no room
chosen showed the alert "Choose a room from the list first.". Choosing Room A-101 and pressing it
again showed "Room A-101, 11:00–12:00: **Available**". Both are the same as before the refactoring.

---

## 5. Task 4 — read-only AI risk review

### 5.1 The review

How you made sure the assistant could not modify files, and what it was given:

<!-- Write below this line -->

The review ran in a separate Claude Code **Explore** sub-agent on a **different model**
(claude-sonnet-5-5; the main session is claude-opus-5-5). Explore agents get no Edit, Write or
NotebookEdit tools. They could still run shell commands, so the prompt also forbids every writing
command. The agent got the prompt below (with the pasted part of `AGENTS.md`) and read access to
`project/` at commit `496f9a6`. Before and after the review I saved `git status --porcelain` to a
file, then compared the two with `diff`: **identical**. `git diff --stat` was empty and HEAD stayed
`496f9a6`. The agent reports that it ran only `git status`, `ls-files`, `log` and `check-ignore`,
which are all read-only.

What you sent, exactly:

```text
You are a read-only risk reviewer. Do NOT modify, create, delete or move any file, do not run git commands that change state, and do not run npm install, npm audit fix or any command that writes to disk. You may only read files and run read-only commands (cat, ls, grep, git log, git diff, git show). Do not invent test results: you have not run the tests, so never claim that a test passes or fails; say "not run" instead.

Project: C:\Users\alyok\se-practice\sis-05\project - a small React 18 + TypeScript + Vite + Vitest page (Smart Campus Room Availability, fictional data). Read project/AGENTS.md first. It is not loaded automatically, so here are its relevant parts, pasted:

--- AGENTS.md (excerpt) ---
Safe commands: npm test (vitest run) | npx tsc --noEmit (type check, the lint step) | npm run build | npm run dev | npm audit (read-only). There is no ESLint and no npm run lint script.
Forbidden actions: never commit secrets (.env, keys, tokens, passwords, personal data); never deploy or publish to production; never run destructive commands (rm -rf, git reset --hard, git clean -fd, --force); never change dependencies without human review (no npm install <pkg>, npm update, npm audit fix, no edits to package.json / package-lock.json); do not commit node_modules/ or dist/.
Review gate: work on a branch, a human approves every pull request.
--- end of excerpt ---

Then read README.md, package.json, tsconfig.json, vite.config.ts, src/*.ts, src/*.tsx, src/components/*.tsx and the four *.test.ts files. Also look at the repository root .gitignore (C:\Users\alyok\se-practice\.gitignore) and whether sis-05/project has its own .gitignore.

Task: propose risks in this project, in these five categories: correctness, maintainability, security, dependency, agent operations. Give 6 to 10 candidate findings. For each one give:
- a short title and the category;
- the exact file and line(s), or the command that would show it;
- cause -> event -> consequence in one sentence;
- how I could verify it myself (a test to write, a command to run, an input to try);
- your confidence: high / medium / low, and whether you actually saw it in the file or are inferring it.
Do not propose fixes longer than one sentence. Do not pad the list with generic risks that have no file or line in this project.
```

The answer, pasted unedited:

```text
RISK REVIEW, sis-05/project. Read-only. I ran no tests, no tsc, no build and no npm audit, so every test or command result is "not run". Line numbers are from the files as read.

Files read: AGENTS.md (the real file, which is longer than your excerpt), README.md, package.json, tsconfig.json, vite.config.ts, index.html, all of src/*.ts, src/*.tsx and src/components/*.tsx, the four test files, and both .gitignore locations. I did not read src/index.css. The git commands I ran were status, ls-files, log and check-ignore.

F1. node_modules/ and dist/ are not ignored (dependency / agent operations)
- Where: C:\Users\alyok\se-practice\.gitignore contains only `.idea/`, `*.iml` and `out/`. sis-05/project has no .gitignore. `git status --short` from sis-05/project shows `?? project/dist/`, `?? project/node_modules/` and `?? ../node_modules/`.
- Chain: no ignore rule -> an agent or human runs `git add .` or `git add -A` -> node_modules and dist enter the commit or PR, which AGENTS.md forbids, and the PR diff becomes unreviewable.
- Verify: `git check-ignore -v node_modules dist` returned nothing and exit 1, and `git status` lists both as untracked. After `git add -n .`, look for node_modules paths in the output.
- Confidence: high, seen. It is the biggest one because the only guard is a prose rule.

F2. Untracked evidence/ folder and loose files next to the project (agent operations / security)
- Where: `git status` shows `?? evidence/before-attendees-minus5.jpg`, plus `?? ../sis-04/`, `?? ../week-08/`, `?? ../week-11/` and `?? ../week-10-PR-description.md`.
- Chain: a broad `git add .` from the repo root sweeps in unreviewed binaries and unrelated weeks -> screenshots may expose local paths or personal data, and PR scope grows beyond one concern.
- Verify: `git add -n .` from the repo root, then open the .jpg for personal data.
- Confidence: medium. I saw the untracked files but did not open the image, so personal content is inferred.

F3. Negative or fractional attendees are accepted (correctness)
- Where: src/form.ts:20-22 (`Number(value) || 0`), src/components/RoomFilter.tsx:17-19 (`min={1}` is only a browser hint), src/filter.ts:7 (`room.capacity >= criteria.attendees`).
- Chain: the user types -5 or 0 -> toAttendees returns -5 or 0 -> every room passes the capacity check -> the page shows "5 of 5", and the user sees rooms that fit nobody. The evidence file name "before-attendees-minus5" suggests this was already seen.
- Verify: add `expect(toAttendees('-5')).toBe(...)` and a filterRooms test with `attendees: -5`. Neither exists today. In the UI, type -5 and check the "Rooms (n of 5)" heading.
- Confidence: high on the code path (seen). The intended behavior is unknown, so whether it counts as a bug is a judgement call.

F4. Attendees validation depends on the browser, and the empty field means "no limit" (correctness)
- Where: src/form.ts:21, and the test form.test.ts:29-31 which locks in `toAttendees('') === 0`.
- Chain: an empty field, or a value like "1e3" or "3.5", goes through Number() and becomes 0, 1000 or 3.5 -> the empty field silently shows all rooms, and 1e3 shows none, with no error message.
- Verify: unit-test `toAttendees('abc')`, `'1e3'`, `'3.5'` and `' '`. In the UI, clear the field.
- Confidence: medium. The code is seen, the exact input behavior across browsers is inferred.

F5. Hard-coded 1440 and 120, with the 120-minute limit untested in the form or App path (maintainability / correctness)
- Where: src/booking.ts:12 (`end <= 1440`) and :14 (`> 120`). src/time.ts:4 defines END_OF_DAY = 1440, so the value is duplicated.
- Chain: someone changes END_OF_DAY or the max duration in one place only -> the page and the rules disagree, and there is no test tying them together.
- Verify: `grep -n "1440\|120" src/*.ts`. Write a test asserting `canBook` accepts an end equal to END_OF_DAY.
- Confidence: high, seen. The impact is low today.

F6. toMinutes does no validation (correctness)
- Where: src/time.ts:6-9. `value.split(':').map(Number)` gives NaN for malformed input, and src/form.ts:28 passes it straight on.
- Chain: a value like "11:00:30", "11" or a stray string yields NaN or a wrong number -> in canBook every comparison with NaN is false, so line 12 returns false and the user sees "Unavailable" with a label like "NaN:NaN" from fmt in ResultMessage.tsx:22.
- Verify: a test `toRequest({start:'ab', end:'12:00', endOfDay:false, roomChosen:true})` and `toMinutes('')`. No test covers malformed time strings (form.test.ts only uses valid ones).
- Confidence: medium. `<input type=time>` normally gives HH:MM, so reaching this needs a non-browser caller. The code path is seen, the reachability is inferred.

F7. Documentation drift: README, AGENTS.md and the file map disagree (maintainability / agent operations)
- Where: README.md line 1 says "SIS #04" while the project is sis-05. README Setup says `npm install`, but AGENTS.md says `npm ci` and forbids dependency changes. README says to run `npx vitest run`. The README layout table and the AGENTS.md architecture table both omit src/form.ts, which commit 496f9a6 added. AGENTS.md has a rule "No rule goes into a component", yet form.ts is a new file with its own responsibility and is not in the table.
- Chain: an agent follows the README's `npm install` -> it may rewrite package-lock.json and violate the dependency rule -> the PR diff contains an unreviewed lockfile change.
- Verify: `diff <(grep -c form README.md) ...` or just `grep -n "form.ts\|npm install\|SIS" README.md AGENTS.md`.
- Confidence: high, seen.

F8. The AGENTS.md "lint" step is only a type check, and `npm run build` runs `tsc` (agent operations)
- Where: package.json:8 (`"build": "tsc && vite build"`) and no lint script. tsconfig.json has `strict` but not noUnusedLocals, noImplicitReturns or noUncheckedIndexedAccess.
- Chain: AGENTS.md bans `any`, `@ts-ignore` and non-null `!` (except main.tsx:6), but nothing enforces it -> an agent can add them and every gate still passes, so only the human reviewer catches it. `time.ts:7-8` destructures `[h, m]` and relies on lax indexing, which noUncheckedIndexedAccess would flag.
- Verify: `grep -rn "any\b\|@ts-ignore\|!\." src` (the only expected hit is main.tsx:6), and try adding `// @ts-ignore` then run `npx tsc --noEmit`, which would pass. Not run.
- Confidence: medium. The config is seen, the effect is inferred.

F9. Dependency range and supply-chain exposure (dependency)
- Where: package.json uses caret ranges for everything. package-lock.json pins vite 5.4.21, vitest 2.1.9 and esbuild 0.21.5, which are old majors (vite 5 and esbuild 0.21 era). Dev-server advisories on vite and esbuild are plausible for these versions, but I have not checked them.
- Chain: `npm install` (as the README says) or a fresh lock resolves new minor versions -> the result differs from what was reviewed. Also `npm run dev` exposes the dev server, which in these old versions could be reachable by other pages.
- Verify: `npm audit` (read-only per AGENTS.md; I did not run it), and `npm ci` versus `npm install` followed by `git diff package-lock.json`.
- Confidence: low-medium. This is inferred from version numbers, not from an audit result.

F10. Small correctness and UX edge cases in App.tsx and ResultMessage.tsx (correctness)
- Where: src/App.tsx:24 and :26. The selected room is derived from the filtered list, so changing attendees or equipment can silently drop the selection, and `roomId` stays stale. When the room reappears, it is selected again without the user choosing it. ResultMessage.tsx:33 uses `key={start-end}`, which would collide if a room had two identical bookings.
- Chain: filter changes -> the stale roomId reselects a room -> the last request is rechecked automatically and the result appears without a click. That may be surprising but may also be intended ("recomputed on every render" is documented in the comment at line 25).
- Verify: React Testing Library is not installed, so there is no component test. Manually: select a room, check it, raise attendees until the room disappears, then lower it again.
- Confidence: low-medium. The code is seen, whether it is a defect is a design question.

Also noted but not listed as findings: all tests I read use fixed catalogs and do not touch the real ROOMS in src/rooms.ts, so nothing checks the demo data itself (for example that the 'd015' room is blocked). The tests are the whole safety net and none were run.
```

### 5.2 The findings, investigated

At least **five**, across at least **three** categories: `correctness`, `maintainability`, `security`,
`dependency`, `agent operations`. **Label:** `confirmed`, `plausible` or `unsupported`.

| # | Finding (short) | Category | What I opened or ran | Label | Evidence or why not |
| --- | --- | --- | --- | --- | --- |
| 1 | F1: `node_modules/`, `dist/` (and `.env`) are not ignored | agent operations | `git check-ignore -v node_modules dist .env` from `project/`; `git status --porcelain` | confirmed | exit 1, no rule printed; status lists `?? sis-05/project/dist/` and `?? sis-05/project/node_modules/` → R1 |
| 2 | F2: a screenshot in `evidence/` may expose personal data; broad `git add .` sweeps other weeks | security | opened `evidence/before-attendees-minus5.jpg`; `git status` | unsupported | The image shows only the fictional app page (no path, name or account). The other untracked folders (`sis-04/`, `week-08/`…) are outside `sis-05/` and are the same missing-ignore cause as F1. |
| 3 | F3: negative or zero attendees are accepted and list every room | correctness | browser: attendees `-5` at the clean baseline copy (5174) and at `496f9a6` (5173); probe test `toAttendees('-5')` | confirmed | "Rooms (5 of 5)", no message; probe printed `toAttendees -5,0,… => [ -5, 0, 1000, 3.5, 0, 0 ]` and `rooms for -5: 5` → R2 |
| 4 | F4: empty, `1e3` or `3.5` attendees fail silently | correctness | the same probe; `RoomList.tsx:11-16` | unsupported | `''` → 0 is deliberate (all rooms, no requirement yet; P6). `1e3` → 1000 → 0 rooms, and the page shows the F4 empty state "No rooms match these requirements". `3.5` filters correctly (capacity ≥ 4). Nothing is wrong without a message. |
| 5 | F5: `1440` is duplicated in `booking.ts:12` while `time.ts:4` exports `END_OF_DAY = 1440` | maintainability | `grep -n -e 1440 -e 120 src/booking.ts src/time.ts` | confirmed | `src/booking.ts:12: … end <= 1440`, `src/time.ts:4: export const END_OF_DAY = 1440;`. No behaviour is wrong today → R7 |
| 6 | F6: `toMinutes` does no validation; malformed times give "NaN:NaN" | correctness | probe: `toMinutes('11'), ('11:00:30'), ('ab'), ('')`, `fmt(NaN)`, `toRequest({start:'ab',…})` | plausible | `[ NaN, 660, NaN, NaN ]`, `fmt(NaN) => NaN:NaN`, and `toRequest` gives `start: NaN`. But `'11:00:30'` → 660 is correct (the reviewer was wrong there), and Edge's `type=time` input never produced a non-`HH:MM` value, so the UI path is not reproduced → R6 |
| 7 | F7: docs drift: README says "SIS #04" and `npm install`; README and AGENTS.md omit `src/form.ts` | maintainability | `grep -n -e SIS -e "npm install" -e form.ts README.md AGENTS.md`; clean copy: `npm install` then `cmp package-lock.json` | confirmed | `README.md:1 … (SIS #04)`, `README.md:10 npm install`, no `form.ts` in either table. The claimed consequence was **not** reproduced: `npm install` left `package-lock.json` unchanged → R5 |
| 8 | F8: AGENTS.md's ban on `any` and `@ts-ignore` is not enforced by any check | agent operations | scratch copy outside the repo: added `const loose: any` and a `// @ts-ignore`d bad assignment, ran `npx tsc --noEmit` | confirmed | `tsc exit=0`: both pass every gate, so only the human review gate catches them → R4 |
| 9 | F9: old vite and esbuild may carry dev-server advisories | dependency | `npm audit` (read-only) | confirmed | `6 vulnerabilities (3 moderate, 1 high, 2 critical)`, including esbuild GHSA-67mh-4wv8-2f99 and tinypool (critical). The reviewer had only inferred it from version numbers → R3 |
| 10 | F10: a hidden-then-shown room is re-selected and re-checked without a click | correctness | browser (5174): check A-101 → attendees 20 → back to 1 | confirmed | A-101 was checked again, and "Room A-101, 11:00–12:00: Available" reappeared with no click. The answer is still right for that room and those times, so I judge it harmless and do not register it. |

---

## 6. Task 5 — risk register

### 6.1 The register

At least five risks, at least two `confirmed`. **Component:** a path in `project/`, or
`missing: <check>`. **Score = L × I.**

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | agent operations | No ignore rule for generated and secret files → an agent or I run `git add sis-05` / `git add -A` after `npm ci` → ~100 MB of `node_modules/`, `dist/` or a `.env` lands in the commit and PR (and the checker's P2 fails) | missing: project/.gitignore ignore rules for node_modules/, dist/, .env | `git check-ignore` exit 1; `git status` showed `?? sis-05/project/node_modules/`, `?? sis-05/project/dist/` (§5.2 #1) | confirmed | 3 | 2 | 6 | `project/.gitignore` for `node_modules/`, `dist/`, `.env`, `.env.*` (keeping `.env.example`) | Ali Akhmetov | `R1 …` tests ask `git check-ignore` and fail before, pass after; `git status` clean after `npm ci` and a build |
| R2 | correctness | The attendees field is converted with `Number(v)`, falling back to 0 → a user types `-5`, `0` or `2.5` → every room is listed as if it fitted, with no message | src/form.ts (`toAttendees`), src/App.tsx | browser: `-5` → "Rooms (5 of 5)" at baseline and at `496f9a6`; probe `toAttendees('-5') = -5` (§5.2 #3) | confirmed | 2 | 2 | 4 | `toAttendees` returns `null` for anything that is not a whole number ≥ 1; the page lists no rooms and shows why | Ali Akhmetov | `R2 …` test fails before, passes after; browser: `-5`, `0`, `2.5` → message and 0 rooms, `12` → 3 rooms |
| R3 | dependency | Old vite 5.4.21, esbuild 0.21.5, vitest 2.1.9 → a malicious page reads the dev server while `npm run dev` runs, or a crafted option reaches tinypool → code or source exposure on the developer machine (dev only; `dist/` contains only React) | package-lock.json | `npm audit`: 6 vulnerabilities (3 moderate, 1 high, 2 critical) (§5.2 #9) | confirmed | 2 | 2 | 4 | A separate, human-reviewed upgrade PR (vitest ≥ 4.1.11, vite ≥ 6.4.4; both breaking); until then the dev server binds to localhost only and is stopped after use | Ali Akhmetov | `npm audit` → 0 vulnerabilities on the upgrade branch, and test / tsc / build all pass there |
| R4 | agent operations | The only static check is `tsc` → an agent adds `any` or `// @ts-ignore` against AGENTS.md → a hidden type error passes every gate and only human review catches it | tsconfig.json; missing: lint step (ESLint) | scratch copy: `any` + `@ts-ignore` → `npx tsc --noEmit` exit 0 (§5.2 #8) | confirmed | 2 | 1 | 2 | A reviewed ESLint setup with `no-explicit-any` and `ban-ts-comment`; until then the review gate (`## Review gate`) | Ali Akhmetov | A planted `any` or `@ts-ignore` must make `npm run lint` fail |
| R5 | maintainability | The docs were not updated with the code → README says SIS #04 and omits `src/form.ts`; AGENTS.md did too → an agent puts input logic back into `App.tsx` or the wrong module | README.md, AGENTS.md | `README.md:1` "(SIS #04)", no `form.ts` in either table (§5.2 #7) | confirmed | 3 | 1 | 3 | Keep both tables in step with the files; AGENTS.md was fixed in `379c454`, README still to do | Ali Akhmetov | `grep -n "form.ts" README.md AGENTS.md` finds both |
| R6 | correctness | `toMinutes` does not validate → a browser without a native time picker sends `"11"` → `NaN` reaches `canBook` → "NaN:NaN … Unavailable" with no message | src/time.ts | probe: `toMinutes('11') = NaN`, `fmt(NaN) = NaN:NaN`; not reproduced in a browser (§5.2 #6) | plausible | 1 | 2 | 2 | `toRequest` returns an error when either time is not `HH:MM` | Ali Akhmetov | An `R6 …` test with `'11'`, `'ab'` and `''`, failing first |
| R7 | maintainability | `1440` is written twice → someone changes `END_OF_DAY` only → the "Ends at 24:00" request is refused by `canBook` | src/booking.ts | `booking.ts:12` `end <= 1440` vs `time.ts:4` (§5.2 #5) | confirmed | 1 | 1 | 1 | `booking.ts` imports `END_OF_DAY` | Ali Akhmetov | X2 (1320–1440) still passes after the change |

### 6.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** (score 6 = L3 × I2): seen in this repository, `git status` listed `node_modules/` and `dist/` as untracked after one `npm ci`. `git add sis-05` is the exact command the README tells me to run (likely), and the result would be an unreviewable PR and a failed P2 (moderate).
2. **R2** (score 4 = L2 × I2): reproduced in the browser at the baseline and after Task 3, `-5` attendees gave "Rooms (5 of 5)" with no message. It is ahead of R3, which has the same score 4, because it changes what every user of the page sees and can be fixed without a dependency change. R3 needs breaking major upgrades, which AGENTS.md says must go through human review in their own PR.

---

## 7. Task 6 — agent-readiness audit

### 7.1 The rows

`yes` or `no`, and the evidence (README §10).

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Tests, one command | yes | `npm test` runs all Vitest files (33 at baseline, 46 at the end, §8.3) |
| 1b | Lint or type check | yes | `npx tsc --noEmit` with `"strict": true` in `tsconfig.json` (a type check; there is no linter, see R4) |
| 1c | Build or run from a clean copy | yes | `git archive 2e65e6a` into an empty folder → `npm install`, `npm test` 33/33, `npm run build` `✓ built in 689ms`; `npx vite` served the page |
| 1d | Pinned dependencies | yes | `package-lock.json` pins every package (vite 5.4.21, vitest 2.1.9); `npm install` on the clean copy left it byte-identical (`cmp`) |
| 2a | README accurate | yes | Every README command works as written: `npm install`, `npm run dev`, `npx vitest run`, `npm test`, `npx tsc --noEmit`. Its title and layout table are out of date (R5), but no command is wrong. |
| 2b | Reproducible setup | yes | The clean-copy run in 1c followed the README alone. Gap: the README does not state the Node version (AGENTS.md does: 18+). |
| 2c | `AGENTS.md` with safe commands and forbidden actions | yes | `project/AGENTS.md`: `## Safe commands`, `## Forbidden actions` (checker P3–P5 pass) |
| 3a | CI | no | No `.github/workflows/` in the repository (`ls .github` → no such file or directory) |
| 3b | Logging an agent can read | no | The app writes nothing to the console or a log. Errors appear only as page text, so an agent needs a browser to see them. Only the test, tsc and build output is machine-readable. |
| 3c | Security safeguards | no | No secret scanning and no dependency audit in any pipeline; `npm audit` shows 6 open vulnerabilities (R3). The input validation is partial: attendees since R2, times not yet (R6). |
| 3d | Review gate before merge | yes | `AGENTS.md` `## Review gate`: work on a branch; a human approves every pull request; an agent never merges its own PR |

### 7.2 The level and the missing evidence

**Level:** 2

Level 1: 4 of 4 rows yes (100%). Level 2: 3 of 3 (100%). Level 3: 1 of 4 (25%, below 80%), so
the project is at Level 2, Documented.

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. -->
- **3a**: a workflow in the repository-root `.github/workflows/` that runs `npm ci`, `npm test`, `npx tsc --noEmit` and `npm run build` in `sis-05/project` on every push. A workflow inside `project/` would not run, because GitHub only reads the root.
- **3b**: an error boundary in `src/main.tsx` that logs the error with `console.error`, plus a short "how to read errors" note in AGENTS.md, so that an agent with browser tools sees failures.
- **3c**: `npm audit --audit-level=high` and a secret scan (for example gitleaks) in that CI, with R3 resolved so that the audit can pass, and the time validation of R6.

---

## 8. Task 7 — two mitigations and verification

### 8.1 The first mitigation

**Risk:** R1

**What I changed, and what I rejected from the assistant's proposal:**

Commit `903a603`. It adds `project/.gitignore` (`node_modules/`, `dist/`, `.env`, `.env.*`,
`!.env.example`) and `src/gitignore.test.ts`, which asks git itself (`git check-ignore --no-index -q`)
whether each path is ignored. Five tests: four paths that must be ignored, and source, lockfile and
`.env.example`, which must not be.

Claude's first idea was to add `node_modules/` to the **repository-root** `.gitignore`. I rejected
it: that changes every other week's folder, which is outside this SIS, and the project would still
have no rule of its own when copied elsewhere.

The test needs Node's `spawnSync`, and `@types/node` is not installed. Adding it would be a
dependency change (AGENTS.md: never without review). So I rejected `npm install -D @types/node`
and accepted a three-line declaration file, `src/node-child-process.d.ts`, for the one function used.

The test that fails before the fix (or why a test is not feasible):

```text
> npx vitest run src/gitignore.test.ts   (before the fix: no project/.gitignore)

 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-05/project

 ❯ src/gitignore.test.ts (5 tests | 4 failed) 327ms
   × R1 - generated and secret files stay out of git > R1 git ignores node_modules/ 67ms
     → git check-ignore node_modules/: expected 1 to be +0 // Object.is equality
   × R1 - generated and secret files stay out of git > R1 git ignores dist/ 49ms
     → git check-ignore dist/: expected 1 to be +0 // Object.is equality
   × R1 - generated and secret files stay out of git > R1 git ignores .env 42ms
     → git check-ignore .env: expected 1 to be +0 // Object.is equality
   × R1 - generated and secret files stay out of git > R1 git ignores .env.local 43ms
     → git check-ignore .env.local: expected 1 to be +0 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/gitignore.test.ts > R1 - generated and secret files stay out of git > R1 git ignores node_modules/
AssertionError: git check-ignore node_modules/: expected 1 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 1

 ❯ src/gitignore.test.ts:9:55
      7|   it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ig…
      8|     const result = spawnSync('git', ['check-ignore', '--no-index', '-q…
      9|     expect(result.status, `git check-ignore ${path}`).toBe(0);
       |                                                       ^
     10|   });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/gitignore.test.ts > R1 - generated and secret files stay out of git > R1 git ignores dist/
AssertionError: git check-ignore dist/: expected 1 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 1

 ❯ src/gitignore.test.ts:9:55
      7|   it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ig…
      8|     const result = spawnSync('git', ['check-ignore', '--no-index', '-q…
      9|     expect(result.status, `git check-ignore ${path}`).toBe(0);
       |                                                       ^
     10|   });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/gitignore.test.ts > R1 - generated and secret files stay out of git > R1 git ignores .env
AssertionError: git check-ignore .env: expected 1 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 1

 ❯ src/gitignore.test.ts:9:55
      7|   it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ig…
      8|     const result = spawnSync('git', ['check-ignore', '--no-index', '-q…
      9|     expect(result.status, `git check-ignore ${path}`).toBe(0);
       |                                                       ^
     10|   });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/gitignore.test.ts > R1 - generated and secret files stay out of git > R1 git ignores .env.local
AssertionError: git check-ignore .env.local: expected 1 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 1

 ❯ src/gitignore.test.ts:9:55
      7|   it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ig…
      8|     const result = spawnSync('git', ['check-ignore', '--no-index', '-q…
      9|     expect(result.status, `git check-ignore ${path}`).toBe(0);
       |                                                       ^
     10|   });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯

 Test Files  1 failed (1)
      Tests  4 failed | 1 passed (5)
   Start at  21:43:14
   Duration  764ms (transform 29ms, setup 0ms, collect 31ms, tests 327ms, environment 0ms, prepare 131ms)
```

The diff (`git diff`):

```text
diff --git a/sis-05/project/.gitignore b/sis-05/project/.gitignore
new file mode 100644
index 0000000..797f3b7
--- /dev/null
+++ b/sis-05/project/.gitignore
@@ -0,0 +1,8 @@
+# Generated: recreated by `npm ci` and `npm run build`; never committed (AGENTS.md).
+node_modules/
+dist/
+
+# Secrets: never committed (AGENTS.md, Forbidden actions). A shareable template may be committed.
+.env
+.env.*
+!.env.example
diff --git a/sis-05/project/src/gitignore.test.ts b/sis-05/project/src/gitignore.test.ts
new file mode 100644
index 0000000..a190396
--- /dev/null
+++ b/sis-05/project/src/gitignore.test.ts
@@ -0,0 +1,18 @@
+import { spawnSync } from 'node:child_process';
+import { describe, expect, it } from 'vitest';
+
+// R1: generated folders and secret files must be ignored by git in this project, so that an agent's
+// `git add .` cannot commit them. Asks git itself (`git check-ignore`), run from the project folder.
+describe('R1 - generated and secret files stay out of git', () => {
+  it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ignores %s', path => {
+    const result = spawnSync('git', ['check-ignore', '--no-index', '-q', path], { cwd: '.', encoding: 'utf8' });
+    expect(result.status, `git check-ignore ${path}`).toBe(0);
+  });
+
+  it('R1 git does not ignore the source, the lockfile or .env.example', () => {
+    for (const path of ['src/booking.ts', 'package-lock.json', '.env.example']) {
+      const result = spawnSync('git', ['check-ignore', '--no-index', '-q', path], { cwd: '.', encoding: 'utf8' });
+      expect(result.status, `git check-ignore ${path}`).toBe(1);
+    }
+  });
+});
diff --git a/sis-05/project/src/node-child-process.d.ts b/sis-05/project/src/node-child-process.d.ts
new file mode 100644
index 0000000..ca3f512
--- /dev/null
+++ b/sis-05/project/src/node-child-process.d.ts
@@ -0,0 +1,9 @@
+// The one Node API the R1 test uses. @types/node is not a dependency of this project, and adding it
+// would be a dependency change (AGENTS.md: never without review), so the signature is declared here.
+declare module 'node:child_process' {
+  export function spawnSync(
+    command: string,
+    args: string[],
+    options: { cwd: string; encoding: 'utf8' },
+  ): { status: number | null; stdout: string; stderr: string };
+}
```

After the fix: `npx vitest run src/gitignore.test.ts` → `Tests  5 passed (5)`. The effect on
`git status`: before R1 (at `496f9a6`) and at the end (`379c454`). `node_modules/` and `dist/` still
exist on disk but are now ignored. The `.jpg` line went because the screenshot was committed with R2.

```text
> diff -u status-at-496f9a6.txt status-at-379c454.txt   (git status --porcelain from the repo root, before R1 and at the end)
--- status-at-496f9a6.txt
+++ status-at-379c454.txt
@@ -1,8 +1,5 @@
 ?? node_modules/
 ?? sis-04/
-?? sis-05/evidence/before-attendees-minus5.jpg
-?? sis-05/project/dist/
-?? sis-05/project/node_modules/
 ?? week-08/
 ?? week-10-PR-description.md
 ?? week-11-PR-description.md
```

### 8.2 The second mitigation

**Risk:** R2

**What I changed, and what I rejected from the assistant's proposal:**

Commit `9589cf2`. `toAttendees` in `src/form.ts` now returns `number | null`: `''` → 0 (no
requirement yet, as before), a whole number ≥ 1 → itself, and anything else → `null`.
`src/App.tsx` lists no rooms when it gets `null` and shows the alert "Attendees must be a whole
number, 1 or more." Two `R2 …` tests were added to `form.test.ts`. The existing P6 test was not
touched and still passes.

Rejected alternatives the assistant put forward:
- clamping `-5` to 1, which is still silent;
- relying on the input's `min={1}`, which the browser does not enforce on typed values (seen in §5.2 #3);
- changing `filterRooms` in `filter.ts`. Its numeric contract is right and is pinned by B5 and B6, so I kept the fix at the form boundary that Task 3 created.

The test that fails before the fix (or why a test is not feasible):

```text
> npx vitest run src/form.test.ts   (before the fix)

 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-05/project

 ❯ src/form.test.ts (8 tests | 1 failed) 10ms
   × form adapter - page fields to rule inputs > R2 attendees -5, 0, 2.5 and "abc" are refused (null), never turned into a filter 6ms
     → toAttendees('-5'): expected -5 to be null

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/form.test.ts > form adapter - page fields to rule inputs > R2 attendees -5, 0, 2.5 and "abc" are refused (null), never turned into a filter
AssertionError: toAttendees('-5'): expected -5 to be null

- Expected: 
null

+ Received: 
-5

 ❯ src/form.test.ts:36:61
     34|   it('R2 attendees -5, 0, 2.5 and "abc" are refused (null), never turn…
     35|     for (const value of ['-5', '0', '2.5', 'abc']) {
     36|       expect(toAttendees(value), `toAttendees('${value}')`).toBeNull();
       |                                                             ^
     37|     }
     38|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  21:43:45
   Duration  474ms (transform 40ms, setup 0ms, collect 50ms, tests 10ms, environment 0ms, prepare 123ms)
```

The diff (`git diff`):

```text
diff --git a/sis-05/project/src/App.tsx b/sis-05/project/src/App.tsx
index 4533f77..7f4da67 100644
--- a/sis-05/project/src/App.tsx
+++ b/sis-05/project/src/App.tsx
@@ -3,7 +3,7 @@ import { checkRoom } from './booking';
 import { filterRooms } from './filter';
 import { DEMO_NOW, EQUIPMENT, ROOMS } from './rooms';
 import { fmt } from './time';
-import { toAttendees, toRequest, type TimeRequest } from './form';
+import { ATTENDEES_ERROR, toAttendees, toRequest, type TimeRequest } from './form';
 import { RoomFilter } from './components/RoomFilter';
 import { RoomList } from './components/RoomList';
 import { ResultMessage } from './components/ResultMessage';
@@ -19,7 +19,9 @@ export default function App() {
   const [error, setError] = useState('');
 
   // F1, F2: the list comes from filterRooms; the page adds no rule of its own.
-  const visible = filterRooms(ROOMS, { attendees: toAttendees(attendees), equipment });
+  // R2: an invalid attendees value lists no rooms and says why, instead of listing every room.
+  const people = toAttendees(attendees);
+  const visible = people === null ? [] : filterRooms(ROOMS, { attendees: people, equipment });
   // A room hidden by the filter is no longer selected, so no result is shown for it.
   const selected = visible.find(r => r.id === roomId) ?? null;
   // F3, F5: recomputed on every render for the selected room with the last submitted times.
@@ -61,6 +63,7 @@ export default function App() {
         selected={equipment}
         onToggle={toggle}
       />
+      {people === null && <p className="error" role="alert">{ATTENDEES_ERROR}</p>}
 
       <h2>Rooms ({visible.length} of {ROOMS.length})</h2>
       <RoomList rooms={visible} selectedId={selected?.id ?? ''} onSelect={setRoomId} />
diff --git a/sis-05/project/src/form.test.ts b/sis-05/project/src/form.test.ts
index d46583f..b85f45d 100644
--- a/sis-05/project/src/form.test.ts
+++ b/sis-05/project/src/form.test.ts
@@ -30,4 +30,14 @@ describe('form adapter - page fields to rule inputs', () => {
     expect(toAttendees('12')).toBe(12);
     expect(toAttendees('')).toBe(0);
   });
+
+  it('R2 attendees -5, 0, 2.5 and "abc" are refused (null), never turned into a filter', () => {
+    for (const value of ['-5', '0', '2.5', 'abc']) {
+      expect(toAttendees(value), `toAttendees('${value}')`).toBeNull();
+    }
+  });
+
+  it('R2 whole numbers of 1 or more still pass through unchanged (1, 12, 40)', () => {
+    expect(['1', '12', '40'].map(toAttendees)).toEqual([1, 12, 40]);
+  });
 });
diff --git a/sis-05/project/src/form.ts b/sis-05/project/src/form.ts
index b3114ac..2a2d87b 100644
--- a/sis-05/project/src/form.ts
+++ b/sis-05/project/src/form.ts
@@ -16,9 +16,17 @@ export type TimeRequest = { start: number; end: number };
 
 export type FormResult = { request: TimeRequest } | { error: string };
 
-/** F1: the attendees field as the number filterRooms expects; an empty field counts as 0. */
-export function toAttendees(value: string): number {
-  return Number(value) || 0;
+/** Shown instead of the room list when the attendees field is not a valid number (R2). */
+export const ATTENDEES_ERROR = 'Attendees must be a whole number, 1 or more.';
+
+/**
+ * F1: the attendees field as the number filterRooms expects; an empty field counts as 0 (no capacity
+ * requirement yet). R2: anything that is not a whole number of at least 1 gives null, never a filter.
+ */
+export function toAttendees(value: string): number | null {
+  if (value.trim() === '') return 0;
+  const count = Number(value);
+  return Number.isInteger(count) && count >= 1 ? count : null;
 }
 
 /** The submitted times as minutes, or the message the page shows instead of a result. */
```

After the fix: `form.test.ts` 8/8 pass. In the browser pane, `-5`, `0` and `2.5` give "Rooms (0 of
5)" plus the alert; `12` gives "Rooms (3 of 5)" with no alert; an empty field gives "Rooms (5 of
5)" (`evidence/before-attendees-minus5.jpg`, `evidence/after-attendees-minus5.jpg`).

### 8.3 The final checks

The real output of the final test run (and any other check you ran):

```text
> git rev-parse --short HEAD
379c454
> npm test
> smart-campus-availability@0.0.0 test
> vitest run
 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-05/project
 ✓ src/filter.test.ts (9 tests) 9ms
 ✓ src/checkRoom.test.ts (5 tests) 6ms
 ✓ src/booking.test.ts (19 tests) 11ms
 ✓ src/form.test.ts (8 tests) 6ms
 ✓ src/gitignore.test.ts (5 tests) 322ms
 Test Files  5 passed (5)
      Tests  46 passed (46)
   Start at  21:44:39
   Duration  994ms (transform 232ms, setup 0ms, collect 394ms, tests 354ms, environment 1ms, prepare 1.34s)
> npx tsc --noEmit
(0 errors)
> npm run build
rendering chunks...
computing gzip size...
dist/index.html                   0.43 kB │ gzip:  0.29 kB
dist/assets/index-DVGJkppb.css    1.86 kB │ gzip:  0.73 kB
dist/assets/index-B_5TOnW5.js   147.77 kB │ gzip: 47.81 kB
✓ built in 632ms
> npm audit


6 vulnerabilities (3 moderate, 1 high, 2 critical)

To address all issues (including breaking changes), run:
  npm audit fix --force
> git status --porcelain -- sis-05
(exit 0, no lines = nothing untracked or modified under sis-05)
```

Tests and checks I did not run, and why:

<!-- Write below this line. "None" only if it is true. -->

- **No lint**: the project has no linter (R4), so `npx tsc --noEmit` is the only static check.
- **No component or end-to-end tests**: React Testing Library and Playwright are not installed, and installing them would be an unreviewed dependency change. The page (AC5, R2) was checked by hand in the browser pane, in Edge's engine only; no other browser was tried.
- **R1 tests need `git` on PATH**: in a copy without git (a downloaded zip) `spawnSync` returns `status: null`, and the five `R1 …` tests would fail. They were run only inside this repository.
- **`npm audit` was run but not fixed** (R3 stays open); `npm audit fix --force` was deliberately not run.
- `npm run preview` was not run (it serves the same `dist/` that `npm run build` produced).
- The last `git status` line in the block above is a re-run: my first attempt used a wrong path (`fatal: … outside repository`), so I ran it again correctly and kept only the correct run.

### 8.4 Updated scores and what remains

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 2 | 6 | 1 | 2 | 2 | `903a603`: the `R1 …` tests failed 4/5 before and pass 5/5 after; `git status -- sis-05` is empty after `npm ci` and a build. I stays 2: a `git add -f` or a file outside `project/` can still slip through. |
| R2 | 2 | 2 | 4 | 1 | 2 | 2 | `9589cf2`: the `R2 …` test failed (`expected -5 to be null`) and now passes; the browser shows the alert for `-5`, `0` and `2.5`. L is 1 because the page path is checked by hand only, not by a component test. |
| R5 | 3 | 1 | 3 | 2 | 1 | 2 | `379c454`: the AGENTS.md architecture table lists `src/form.ts`, the shim and `.gitignore`; README.md still says SIS #04 and omits `form.ts` |

**Remaining limitations and trade-offs:**

<!-- Write below this line -->

- **R3** (4) is the highest open risk. Closing it needs breaking major upgrades of vite and vitest, in their own reviewed PR. The exposure is the development machine only, not the built page.
- **R1's test depends on git being installed.** I chose a real `git check-ignore` over reading the `.gitignore` text, because it proves what git does, at the cost of not running in a git-less copy.
- **R2's rule refuses decimals and zero** but accepts an empty field as "no requirement". A user who clears the field sees every room; that is deliberate, and P6 pins it.
- **R4, R6 and R7** stay as registered. The page itself is still tested only by hand.

---

## 9. Tasks 8–9 — background-agent safeguards and the release decision

### 9.1 A hypothetical background-agent task

| Safeguard | For this project |
| --- | --- |
| The task | Mitigate R6: `toRequest` in `src/form.ts` returns `{ error: 'Times must be HH:MM.' }` when `toMinutes` gives `NaN`, with `R6 …` tests that fail first (`'11'`, `'ab'`, `''`). No other behaviour changes. |
| Isolation (branch or worktree) | A separate git worktree on a new branch `agent/r6-time-validation`, created from `sis-05` at `379c454`, with its own `npm ci`. It never touches `main` or `sis-05` directly. |
| Allowed files | `sis-05/project/src/form.ts`, `src/form.test.ts`, `src/time.ts` and a new `src/time.test.ts`; nothing else (no `package.json`, lockfile, `AGENTS.md`, `.gitignore`, README or other weeks) |
| Commands | Only the AGENTS.md safe commands: `npm ci`, `npm test`, `npx tsc --noEmit`, `npm run build`, plus `git diff`, `git add <allowed files>` and `git commit` on its own branch |
| Time limit | 30 minutes of wall clock and at most 3 fix-and-test iterations. When either runs out, the agent stops and reports where it is; it does not keep trying. |
| Prohibited operations | The four forbidden actions in AGENTS.md (no secrets or `.env`, no deploy or publish, no `rm -rf`, `reset --hard` or force-push, no `npm install <pkg>` or `audit fix`). Also no editing or deleting existing tests, no push to `main`, and no merging its own branch. |
| Required artifacts | A change summary; the full `git diff`; the `R6 …` test failing before and passing after (Vitest output); the final `npm test`, `tsc` and `build` output; risk notes (a proposed new R6 score and any new risk seen); a list of what it did not run |
| Human approval, failure and rollback | I read the diff and the logs and rerun `npm test` myself, then merge into `sis-05` only if R6 fails first and every check passes. If it fails, times out or touches a disallowed file: `git worktree remove` and delete the branch, so `sis-05` is untouched. If a merged change proves wrong: `git revert` that commit. |

### 9.2 Release decision

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words: the test evidence, the register, the readiness level. Name at least two
     risk IDs. -->

<!-- Write your justification below this line -->

The reviewed version (`379c454`) passes every check I have: 46/46 Vitest tests, a clean
`tsc --noEmit` and a successful build, and the page works in the browser. The two top risks are
mitigated with tests that failed first: R1 dropped from 6 to 2 and R2 from 4 to 2. No confirmed
risk still scores 6 or more, so GO would be allowed by the rule. I still choose CONDITIONAL. R3
(4) leaves six known dev-dependency vulnerabilities, and its control is an explicit owner (me) and
a separate reviewed upgrade PR, with the dev server kept on localhost meanwhile. R4 (2) means only
human review enforces the coding rules. The project is at readiness Level 2, with no CI (3a), so
nothing re-runs these checks automatically. Release only for local demo use until R3 is closed.

---

## 10. AI reflection

<!-- 200-300 words, in your own words, without the assistant. Answer all four:
     1. Which assistant and model did you use, and what context did it receive?
     2. One useful AI suggestion, and one inaccurate, weak or unverified one.
     3. What did you personally check, and how did the tests change your decisions?
     4. Did AGENTS.md improve the process? What should improve next?
     Worthless: "The AI was very helpful and saved me a lot of time."
     Worth everything: "Claude (claude-sonnet-5-5) got the README, AGENTS.md and the diff. Its R1,
     eval on the shares field, was right: test_R1 failed before the fix. Its claim that the tests
     were flaky was unsupported: ten runs, ten passes." -->

<!-- DRAFT WRITTEN BY CLAUDE CODE (claude-opus-5-5), NOT BY ME. The course requires this section in
     my own words, without the assistant: I must rewrite it before the deadline (README section 13). -->

<!-- Write your reflection below this line -->

I used Claude Code in the desktop app. The main session ran on claude-opus-5-5 and had the whole
repository, the SIS README and the checker. The risk reviewer was a separate read-only Explore
sub-agent on claude-sonnet-5-5. It received a written prompt, the pasted safe-command and
forbidden-action parts of AGENTS.md, and read access to the project at commit 496f9a6. It did not
see our conversation.

The most useful suggestion was F1: neither the project nor the repository root ignored
node_modules or dist. The reviewer had actually run git check-ignore, and the R1 tests failed
four of five before the fix. The weakest part was the evidence behind
some claims. F9 guessed at dev-server advisories from version numbers without running npm audit;
the audit then showed six real vulnerabilities, so the risk was right but unproven. F6 said
"11:00:30" would give a wrong number, but a probe test returned 660, which is correct. F2 feared
personal data in a screenshot of the fictional page.

Every label in 5.2 comes from a run made in this session: probe tests, grep, npm audit, a scratch
copy for the ts-ignore check, and the browser pane. The tests changed two decisions. Writing the R2
test first made me keep the empty field meaning "no requirement", because P6 already pinned it.
The R1 test showed that reading the .gitignore text proves less than asking git itself, even
though the git version cannot run without git installed.

AGENTS.md helped. The forbidden dependency change stopped me from installing @types/node for one
test, and the reviewer used the file to spot that form.ts was missing from the architecture table.
Next, the repository needs CI at its root and a linter, so these rules are checked automatically
and not only by me.

---

## 11. AI evidence appendix

At least **three** complete exchanges.

### 11.1 Exchange 1

| | |
| --- | --- |
| Tool and date | Claude Code (desktop app), Explore sub-agent, 2026-11-25 |
| Exact model | claude-sonnet-5-5 |
| Prompt (summary) | The read-only risk review in §5.1: do not modify anything, do not invent test results; the pasted AGENTS.md parts; read the listed files and both `.gitignore`s; give 6–10 findings in five categories, each with file and line, chain, how to verify, and confidence |
| Output I used | All ten findings F1–F10 as candidates for §5.2. F1, F3, F5, F7, F8 and F9 became R1, R2, R7, R5, R4 and R3. F6 became the plausible R6. |
| Problems I found in it | F2 and F4 were unsupported (no personal data in the image; `1e3` gets the empty-state message). F6's `'11:00:30'` example was wrong (a probe returned 660). F7's consequence (`npm install` rewrites the lockfile) was not reproduced. F9 was inferred, not audited. |
| Changes I made | Relabelled each finding after my own check. F9's evidence was replaced with the real `npm audit` result. F10 was confirmed but judged harmless and not registered. Scores and the top two were set from the reproduced evidence, not from its confidence words. |
| How I verified it | `git status` before and after (identical); then for each finding the command in §5.2: `git check-ignore`, a probe test, grep, `npm audit`, a scratch-copy `tsc` run, and the browser pane on the baseline and the current version |

### 11.2 Exchange 2

| | |
| --- | --- |
| Tool and date | Claude Code (desktop app), main session, 2026-11-25 |
| Exact model | claude-opus-5-5 |
| Prompt (summary) | My request to do SIS #05 for me; from it, Task 2 (write `project/AGENTS.md` with the seven topics and four forbidden actions) and Task 3 (locate one maintainability problem, evaluate Strategy and Adapter, at most one refactoring) |
| Output I used | `project/AGENTS.md` (`1143373`); the Adapter refactoring: `src/form.ts`, `src/form.test.ts` P1–P6, and the `App.tsx` change (`496f9a6`); the before/after in §4.3 |
| Problems I found in it | After the refactoring, the AGENTS.md architecture table did not list `src/form.ts` (found by the reviewer, F7, R5). AGENTS.md calls `tsc` "the lint step", but nothing enforces its no-`any` rule (F8, R4). |
| Changes I made | AGENTS.md architecture updated in `379c454`. Kept the attendees conversion (`Number(value)`, falling back to 0) unchanged in the refactoring, so that the R2 fix stayed a separate, visible commit. Strategy was rejected (no variant to switch between). |
| How I verified it | `npm test` 39/39, `npx tsc --noEmit`, `npm run build` (§4.4); the browser check of AC5; checker P3–P5 and L5 pass |

### 11.3 Exchange 3

| | |
| --- | --- |
| Tool and date | Claude Code (desktop app), main session, 2026-11-25 |
| Exact model | claude-opus-5-5 |
| Prompt (summary) | Task 7: mitigate the top two confirmed risks R1 and R2, each with a test whose name starts with the risk ID and that fails before the fix, then run the final checks |
| Output I used | `project/.gitignore`, `src/gitignore.test.ts`, `src/node-child-process.d.ts` (`903a603`); `toAttendees` returning `null`, the page alert and the R2 tests (`9589cf2`) |
| Problems I found in it | The first R1 idea edited the repository-root `.gitignore` (out of scope). The R1 test needed `@types/node`, which is a dependency change. R2 alternatives (clamping to 1, relying on `min={1}`, changing `filterRooms`) were silent or touched a pinned rule. My first final `git status` used a wrong path. |
| Changes I made | Project-level `.gitignore` only; a three-line type declaration instead of a new package; the fix kept at the `form.ts` boundary; the `git status` re-run with the right path (noted in §8.3) |
| How I verified it | Both tests failed first (§8.1, §8.2); the full run: 46/46, `tsc` clean, build OK (§8.3); `git status -- sis-05` empty; the browser pane: `-5`, `0` and `2.5` show the alert, `12` shows 3 rooms |

### 11.4 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The last checker run, on a clean `git archive` export of the commit named in `submission.yml`, gave 23 PASS · 0 FAIL · 0 ERROR. Run in my working folder, P2 fails only because `project/node_modules/` is on disk; it is ignored by git and never committed. |
