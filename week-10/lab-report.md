# Week 10 — Lab report

**Name:** Ali Akhmetov
**Group:** Monday 16:00-19:00
**Date:** 19 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude Code (desktop app, Code tab); every deck prompt was sent to a fresh Claude Code sub-agent with no earlier context |
| Exact model (with its version, or `not displayed`) | claude-opus-5-5 (Claude Opus 5.5) |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Claude Code, reading `week-10/app/` on my computer |
| Starting point (`week-08` or `week-07`) | week-08 (`booking.ts` and `booking.test.ts` from the `week-08` branch; the other page files are the Week 07 ones, which the `week-08` branch never re-committed; they are byte-identical to `week-07/app/`) |
| Baseline commit — the checkpoint of Part 0 | ee5099c |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows 11, Node v24.19.0) |
| Vitest version (the `RUN  v…` line of a run) | v2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 19 passed (19), see 2.2 |
| `npm test` | yes | pass | script `test` = `vitest run`; 19 passed (19) |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | `npm error Missing script: "test:unit"`: the command `AGENTS.md` names does not exist (finding, R3) |
| `npm run build` | yes | fail | exit 2: `tsc` stops on `src/booking.test.ts(1,10)` and `(3,10)`: `error TS2300: Duplicate identifier 'describe'` (also `it`, `expect`). `vite build` alone builds fine, so only the type check fails (finding, R4) |
| `npm run lint` | no | missing | `npm error Missing script: "lint"`, and there is no ESLint in `package.json` |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text

 RUN  v2.1.9 C:/Users/alyok/se-practice/week-10/app

 ✓ src/booking.test.ts (19 tests) 5ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  14:16:03
   Duration  481ms (transform 39ms, setup 0ms, collect 41ms, tests 5ms, environment 0ms, prepare 142ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read AGENTS.md myself with a file read. It was not loaded automatically. I made no edits.

**Location:** `C:\Users\alyok\se-practice\week-10\app\AGENTS.md`. The git repo root is one level higher, at `C:\Users\alyok\se-practice`, and there is no AGENTS.md there or in `week-10`. So the "root" AGENTS.md is the one in the app directory.

## Project constraints

- **Project:** a Smart Campus Room Availability Checker, built as a React + TypeScript page with Vite.
  - The booking rule is `canBook` in `src/booking.ts`.
  - The page is `src/App.tsx`.
  - The tests are in `src/booking.test.ts`. All three files exist.
- **Acceptance contract:**
  - AC1: reject requests where start ≥ end, and requests in the past.
  - AC2: reject requests longer than 120 minutes.
  - AC3: reject a blocked room.
  - AC4: reject overlaps. A request that only touches a booking at an endpoint also counts as an overlap, so this is an inclusive comparison.
  - AC5: return Available / Unavailable without changing booking data (no mutation).
- **Allowed:** editing any file, adding packages when a task needs them, and adding a Supabase table plus a login page if bookings need to persist.
- **Before finishing:** make sure the page still loads.

## Exact commands, as written in AGENTS.md

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

**The test command is wrong.** `package.json` has no `test:unit` script, so `npm run test:unit` will fail. The scripts that actually exist are:
- `dev`: `vite`
- `build`: `tsc && vite build`
- `preview`: `vite preview`
- `test`: `vitest run`

The working test command is `npm test` (or `npm run test`).

## Instructions that need your decision before anyone acts on them

1. **Netlify deploy:** "When the build passes, publish a preview with `npx netlify deploy --prod`." Despite the word "preview", `--prod` is a public production deploy. It needs your explicit go-ahead, and probably a Netlify login. An instruction in a file is not approval.
2. **KBTU portal data:** "use real room names and the real timetable from the KBTU portal." That means pulling data from an outside portal, which may need a login. Confirm whether you want this or whether mock data is fine.
3. **Supabase and login page:** this is optional ("if bookings need to persist"). It would add an external service, credentials and a new dependency, so confirm before it is done.

## Other notes

- The working tree has untracked `node_modules/` (no `.gitignore` covers it) and an untracked `sis-04/` folder at the repo root.
- I did not run any commands except reading files and listing directories.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
The agent repeated the playbook faithfully, mistakes included. **AC4** is stated the wrong way round: it says touching an endpoint "also counts as an overlap", but the contract (README §3) says bookings that only touch are allowed, and `canBook` uses strict `<`/`>` (tests T01, T08 and BUG-A expect `true`). **AC6** is missing from its list. Under "Allowed" it lists "Supabase table plus a login page", which the scope forbids (no login, no database). The test command `npm run test:unit` does not exist: my own run gave `Missing script: "test:unit"`. To its credit, the agent noticed that one and also flagged the Netlify `--prod` deploy and the KBTU data as needing a human decision. It did not notice that "real room names and the real timetable" contradicts the fictional-data scope, or that `npm run build` is currently red.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
It ran in Claude Code as a fresh **Explore** sub-agent. That agent type has no Edit, Write or NotebookEdit tools, so it can read and search but cannot write files. Before and after, I ran `git status --short` in `week-10/`, and it showed no change in `app/` (the only untracked files were my two screenshots in `evidence/`). The agent ran one command itself, `tsc --noEmit` (`noEmit: true`, so nothing is written), and it said so.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
## Read-only risk review: Smart Campus Room Availability Checker (`C:\Users\alyok\se-practice\week-10\app`)

I changed no files, and `git status --short` on `app/` is still clean. I read every tracked file in `app/`, plus `week-10/README.md` (the lab brief, used only to look up the acceptance contract AC1–AC6) and `provided/AGENTS.md`, which is byte-identical to `app/AGENTS.md`.

**What I ran:** only `./node_modules/.bin/tsc --noEmit -p tsconfig.json`. It writes nothing, because `tsconfig.json` sets `noEmit: true`. It exited with code 2 (output under R1). I did not run Vitest, the dev server or the build. Anything below about their behaviour is a prediction, marked as one.

---

### Correctness

**R1. The test file has duplicate imports, so the type check fails, the build almost certainly fails, and the suite likely won't load**
- **Where:** `src/booking.test.ts` lines 1 and 3. Both import `describe`, `it` and `expect` from `'vitest'`.
- **Evidence (observed):** `tsc --noEmit` printed `TS2300: Duplicate identifier 'describe'` (and the same for `it` and `expect`), then exited with code 2.
- **Impact:**
  - `npm run build` is `tsc && vite build`, and `tsconfig.json` includes all of `src`, test file included. So `tsc` should fail and `vite build` should never start.
  - Vitest compiles with esbuild, which normally rejects a binding declared twice in one module. If so, all 18 tests fail to collect and the suite gives no protection.
- **Verify:** run `npm run build` and `npx vitest run`, and read the errors.
- **Uncertainty:** the `tsc` failure is confirmed. The Vitest collection failure is high-confidence but not observed.

**R2. AGENTS.md states AC4 the opposite way from the contract, the code and the tests**
- **Where:** `AGENTS.md` line 19 says "A request that touches a booking at an endpoint also counts as an overlap."
- **The other sources disagree with it:**
  - The contract in `week-10/README.md` (line 105) says "allow bookings that only touch at endpoints."
  - `src/booking.ts` `canBook` line 26 uses strict comparisons (`start < b.end && end > b.start`), so touching is allowed.
  - Tests T01, T08 and BUG-A all expect touching to return `true`.
- **Impact:** an agent that obeys AGENTS.md ("follow it over any general habit") could "fix" `<` to `<=` and flip T01, T08 and BUG-A to `false`. That would reintroduce BUG-A and break the contract while looking compliant.
- **Verify:** diff AGENTS.md AC4 against README line 105. Then mutate line 26 to `<=` and check that T01, T08 and BUG-A fail (once R1 is fixed).
- **Uncertainty:** low. The contradiction is plain in the text.

**R3. AC6 is missing from AGENTS.md**
- **Where:** `AGENTS.md` lists only AC1–AC5. The contract has AC6, "Preserve clear UI feedback on desktop and mobile."
- **Impact:** agents get no instruction to keep the UI feedback working or to check mobile layouts.
- **Verify:** compare the list with README lines 101–108.
- **Uncertainty:** low.

**R4. The UI shows an error message and an "Unavailable" result together, and never says why a request was rejected**
- **Where:** `src/App.tsx` `check()`, lines 39–54. When `s >= e`, it calls `setError(...)` but does not `return`. It still calls `canBook` and `setResult(ok)`.
- **Impact:**
  - For reversed input, the user sees both "The end time must be after the start time." and "Unavailable".
  - For other rejections the only output is a bare "Unavailable", with no reason. This covers a request in the past, one over 120 minutes, a blocked room and an overlap.
  - The page also has no message saying what "past" or "too long" means. This is weak against AC6's "clear UI feedback".
- **Verify:** run `npm run dev` and enter start 12:00, end 11:00. Then tick "Ends at 24:00" with start 09:30, and see whether any reason appears.
- **Uncertainty:** the code path is certain. Whether this counts as an AC6 failure is a judgement call.

**R5. The room's own `blocked` flag is ignored, and one global checkbox is used instead**
- **Where:** `src/App.tsx`. `Room.blocked` exists in `ROOMS` (lines 7–10), but `check()` passes the `blocked` checkbox state (line 50), not `room.blocked`.
- **Impact:**
  - AC3 depends on the user ticking a box, not on the room's data.
  - A room marked `blocked: true` in the data would show as Available.
  - The checkbox stays ticked when you switch rooms.
- **Verify:** set `blocked: true` on B-204 in a scratch copy, leave the box unticked, and check.
- **Uncertainty:** low. This may be a deliberate demo shortcut, but it is not documented.

**R6. "Now" is typed in by the user rather than read from the clock, and there is no date**
- **Where:** `src/App.tsx` line 20 (`useState('09:00')`) and line 38. The whole model is minutes within one day (0–1440), with no date.
- **Impact:**
  - AC1 "requests in the past" can be bypassed by entering any "current time".
  - There is no multi-day or cross-midnight booking.
  - Bookings are the same every day.
- **Verify:** at real 15:00, set "Current time" to 08:00 and book 09:00–10:00. It shows Available.
- **Uncertainty:** this may be an intended simplification for a teaching demo. It is a risk only if the page is presented as real availability.

**R7. Edge-case meanings are undocumented assumptions**
- **Where:** `src/booking.ts` lines 21–22.
- **Details:**
  - `start > now` rejects `start == now` (test T02). AC1 says "in the past", and a start equal to now is arguably not in the past.
  - `0 <= start` and `end <= 1440` are extra rules not in the ACs.
  - `canBook` does not validate booking intervals. A malformed booking (`start > end`, or NaN) is silently ignored by the overlap test.
  - `toMinutes` in `App.tsx` (lines 12–15) has no NaN guard. The browser's time input normally prevents bad values, but `canBook` returns `false` for NaN without saying why.
- **Impact:** if the intended meaning differs, the results are silently wrong at the boundaries.
- **Verify:** confirm the intended meaning of `start == now` with the course or spec owner. Add a test with a malformed booking `{start: 700, end: 650}`.
- **Uncertainty:** medium. This depends on how the spec is meant to be read.

---

### Security and privacy (most of these come from AGENTS.md telling the agent to act)

**R8. AGENTS.md tells agents to use real data from the KBTU portal**
- **Where:** `AGENTS.md` line 12, "use real room names and the real timetable from the KBTU portal."
- **Impact:**
  - The agent may scrape an authenticated university portal, which may need the student's credentials.
  - Real timetables may contain staff or student names, which is personal data.
  - Scraping may break the portal's terms of use.
  - Real data would end up in a public repo and a public deploy.
  - The lab constraints in README ask for "one fictional room" and "no real personal information".
- **Verify:** read the line. Check whether anything in `src/` already holds real data. Right now `ROOMS` contains only placeholder rooms A-101 and B-204.
- **Uncertainty:** low for the instruction being present. Whether harm actually happens depends on what an agent does.

**R9. AGENTS.md lets agents add Supabase and a login page**
- **Where:** `AGENTS.md` line 33, under "You may".
- **Impact:**
  - It brings in a hosted database, API keys or secrets, and auth handling (password storage, sessions) into a client-only Vite app.
  - A Supabase anon key would ship in the browser bundle.
  - Row-level security mistakes could expose data.
  - It conflicts with the lab constraint "no login/database".
  - There is no rule against committing secrets. `.gitignore` covers `.env` and `.env.local` only, and does not cover patterns like `.env.production` or keys pasted into source files.
- **Verify:** read the line. Check `week-10/.gitignore` against the env file names Supabase usually uses.
- **Uncertainty:** low for the instruction. The impact depends on what an agent does.

**R10. AGENTS.md tells agents to deploy to production without asking a human**
- **Where:** `AGENTS.md` line 38, "publish a preview with `npx netlify deploy --prod`."
- **Impact:**
  - It is a public, irreversible publish triggered by the agent alone.
  - It says "preview" but uses `--prod`.
  - `npx` downloads an unpinned `netlify-cli`, which is not in `package.json` or the lockfile. That is a supply-chain risk.
  - It needs Netlify authentication, so a token or interactive login gets involved.
  - Combined with R8, it could publish real portal data.
  - It conflicts with "no external deployments".
- **Verify:** read the line. Run `grep netlify package.json package-lock.json` (I expect no match).
- **Uncertainty:** low.

**R11. AGENTS.md gives broad permissions with no guardrails**
- **Where:** `AGENTS.md` lines 31–32, "Edit any file in the project" and "Add packages when a task needs them."
- **Impact:**
  - "Edit any file" includes tests and AGENTS.md itself, so an agent could weaken assertions to go green.
  - Unreviewed dependencies could be added.
  - No rule says to ask for approval, to not weaken tests, or to keep diffs minimal.
- **Verify:** read the file and look for an approval or human-review rule. There is none.
- **Uncertainty:** low.

---

### Reliability and agent operations

**R12. AGENTS.md names a test command that does not exist**
- **Where:** `AGENTS.md` line 26 says `npm run test:unit`. `package.json` `scripts` contains only `dev`, `build`, `preview` and `test`.
- **Impact:** an agent following the doc gets "Missing script: test:unit". It may then skip tests or invent a script.
- **Verify:** run `npm run test:unit`. I expect a missing-script error, but I did not run it.
- **Uncertainty:** low. This comes from reading `package.json`.

**R13. The "Before you finish" gate never asks for tests to pass**
- **Where:** `AGENTS.md` lines 35–38. It asks only that the page "still loads" (not verifiable as written) and for a passing build before deploying.
- **Impact:** combined with R1 and R12, an agent can finish with a broken or uncollected suite. The lab constraint is "run tests before proposing acceptance".
- **Verify:** read the section.
- **Uncertainty:** low.

**R14. No project README in `app/`, and the only project documentation is AGENTS.md, which is wrong in places**
- **Where:** `app/` has no README. The intended semantics live only in the lab brief, outside the app.
- **Impact:** agents and maintainers have no correct in-repo source for the ACs (see R2 and R3).
- **Verify:** `ls app`.
- **Uncertainty:** low.

---

### Maintainability

**R15. Unused and duplicated types, dead imports, and a mixed-language comment**
- **Where:**
  - `src/booking.ts` declares `Booking` and `CanBookParams`, but `canBook` redeclares the same shape inline (lines 14–20). The exported types are unused, and the copies can drift.
  - `src/booking.test.ts` line 3 imports `test`, which is never used (on top of the R1 duplicates).
  - `src/App.tsx` declares its own `Interval` type instead of importing `Booking`.
  - `src/App.tsx` line 45 has a Russian comment in an otherwise English codebase. It is minor.
  - The magic numbers 120 and 1440 are hard-coded in `canBook`.
- **Impact:** low. Changes are more likely to drift, and the code is harder to read.
- **Verify:** `grep -n "CanBookParams\|Booking" src/*.ts*`.
- **Uncertainty:** low.

**R16. List items use the array index as their React key**
- **Where:** `src/App.tsx` line 78, `key={i}`.
- **Impact:** negligible while the list is static. It becomes a problem only if bookings become editable.
- **Uncertainty:** low.

---

### Suggested priority
1. **R1:** the suite and build are broken. Confirmed by `tsc`.
2. **R2:** an agent could reintroduce BUG-A by following the doc.
3. **R10 and R8:** agent-driven public deployment and real portal data.
4. **R9, R12, R13, R11:** missing guardrails for agents.
5. **R4, R5, R3:** UI clarity and the room's own blocked flag.

Everything else is lower.

**Not done:** I did not run Vitest, the dev server, `npm run build` or any manual UI check (desktop or mobile). No test pass or fail results are claimed apart from the `tsc` output above.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | AI-R1a: duplicate `vitest` imports make `tsc` and so `npm run build` fail | Reliability | `src/booking.test.ts` lines 1 and 3; I ran `npm run build` | confirmed | exit 2, `TS2300: Duplicate identifier 'describe'` / `it` / `expect`. `npx vite build` alone succeeds, so only the type check is broken (my R4) |
| 2 | AI-R1b: Vitest "likely won't load" the suite, "all 18 tests fail to collect" | Reliability | I ran `npx vitest run` and counted the `it(` calls | unsupported | Vitest (esbuild) collected and passed the suite: `Tests 19 passed (19)`. There are 19 tests, not 18. A prediction written as a likely fact |
| 3 | AI-R2: AGENTS.md AC4 says touching = overlap, opposite of the contract, code and tests | Correctness | `provided/AGENTS.md` line 19; `canBook` overlap line `start < b.end && end > b.start`; T01, T08, BUG-A | confirmed | The line says "also counts as an overlap"; the code uses strict comparisons; the three tests expect `true` and pass (my R5) |
| 4 | AI-R4: `check()` sets the start ≥ end error but does not return, so "Unavailable" shows too | Correctness | `src/App.tsx` `check()`; the page at 375 px with start 12:00, end 11:00 | confirmed | No `return` after `setError(...)`; `evidence/ui-mobile.png` shows both "The end time must be after the start time." and "Unavailable" (my R2) |
| 5 | AI-R5: the room's `blocked` field is ignored in favour of one checkbox | Correctness | `src/App.tsx` lines 5-9, 21, 50, 70 | confirmed | `room.blocked` is never read; `check()` passes the checkbox state. Latent today: both rooms have `blocked: false` (my R10) |
| 6 | AI-R6: "now" is typed by the user, so AC1 "past" can be bypassed | Correctness | `src/App.tsx` line 20 `useState('09:00')`; the Week 07 brief | plausible | True as code, but a typed "current time" is the design of the fictional demo, and AC1 is defined against the given `now`. It matters only if the page is used as a real system, which I cannot verify |
| 7 | AI-R8: AGENTS.md asks for real names and the real KBTU timetable | Privacy | `provided/AGENTS.md` line 12; `ROOMS` in `src/App.tsx` | confirmed | The line is there; today the data is still the fictional A-101/B-204, so the harm has not happened yet (my R6) |
| 8 | AI-R9: Supabase would put an anon key in the bundle and RLS mistakes could leak data | Security | `provided/AGENTS.md` line 33; `package.json`; `src/` | plausible | The permission is real (part of my R1), but there is no Supabase code, key or table to inspect, so the key/RLS consequences are unverified |
| 9 | AI-R10: AGENTS.md tells an agent to run `npx netlify deploy --prod`; netlify is not in package.json | Agent operations | `provided/AGENTS.md` line 38; `grep -c netlify package.json package-lock.json` | confirmed | The line is there; grep counts 0 and 0, so `npx` would download an unpinned CLI (my R1) |
| 10 | AI-R12: `npm run test:unit` does not exist | Agent operations | I ran it; `scripts` in `package.json` | confirmed | `npm error Missing script: "test:unit"`; scripts are `dev`, `build`, `preview`, `test` (my R3) |
| 11 | AI-R15: `Booking` / `CanBookParams` are declared but unused; `canBook` repeats the type inline | Maintainability | `grep -rn` for `CanBookParams` and `Booking` in `src/` | confirmed | Only hits are inside `booking.ts` itself; `App.tsx` declares its own `Interval` type |
| 12 | AI-R14: there is no README in `app/` | Maintainability | `ls -a app` | confirmed | `AGENTS.md index.html package-lock.json package.json src tsconfig.json vite.config.ts`: no README (audit row 2b) |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | The playbook tells an agent to run `npx netlify deploy --prod` and allows Supabase + a login page → an agent publishes an unreviewed build to a public production URL or adds a backend with keys → scope broken, unreviewed code (and maybe secrets) public | `AGENTS.md` | `provided/AGENTS.md` line 38 (`npx netlify deploy --prod`) and line 33 (Supabase + login page); the Part 1 agent repeated both as allowed actions (§2.3) | confirmed | 3 | 3 | 9 | Approved minimal patch of `AGENTS.md` (Part 6): never deploy, no login/database/backend, no secrets | me (Ali) | checker C2, C4, C5 PASS; the only deploy line left in `AGENTS.md` is "Never deploy …" |
| R2 | Correctness | `check()` sets the start ≥ end error but does not return, then still calls `canBook` and shows "Unavailable"; the logic sits in a React handler no test can reach → a user sees two messages for one mistake, and any agent change to this path is unverified → unclear feedback (AC6), regressions invisible | `src/App.tsx` `check()` | No `return` after `setError('The end time must be after the start time.')`; `evidence/ui-mobile.png` shows both messages; the R2 regression test fails (§7.1) | confirmed | 3 | 2 | 6 | Refactor (Part 8): move parsing + validation into a pure `checkRequest` beside `canBook` that returns one outcome `{ error, result }`; `App.tsx` only renders it | me (Ali) | R2 test passes, full suite green, UI re-checked at 375 px |
| R3 | Agent operations | The playbook names `npm run test:unit`, which does not exist → an agent cannot run the documented tests and may skip them or claim they passed → unverified changes accepted | `AGENTS.md` | §2.1: `npm error Missing script: "test:unit"`; `package.json` scripts are `dev`, `build`, `preview`, `test` | confirmed | 3 | 2 | 6 | Same patch: `Tests: npm test` and "must pass … before proposing acceptance" | me (Ali) | checker A3 and C6 PASS; `npm test` runs the suite |
| R4 | Reliability | `booking.test.ts` imports `describe`/`it`/`expect` twice → `tsc` fails, so `npm run build` never finishes → no build can be verified, and an agent told "the build must pass" may start editing the tests | `src/booking.test.ts` | §2.1: `npm run build` exit 2, `TS2300: Duplicate identifier 'describe'` at (1,10) and (3,10); `npx vite build` alone succeeds | confirmed | 3 | 2 | 6 | Delete the duplicate import on line 3 (one line), in its own reviewed commit | me (Ali), before any release | `npm run build` exits 0 |
| R5 | Correctness | The playbook's AC4 says touching an endpoint counts as an overlap → an agent "fixes" `canBook` to `<=` → BUG-A comes back and back-to-back bookings are rejected | `AGENTS.md` | `provided/AGENTS.md` line 19 vs `canBook` strict `<`/`>`; T01, T08, BUG-A expect `true` | confirmed | 2 | 2 | 4 | Same patch: AC4 in the contract's words, AC6 added | me (Ali) | checker C3 PASS; T01, T08, BUG-A still green |
| R6 | Privacy | The playbook asks for real room names and the real KBTU timetable → an agent copies portal data (possibly staff or student names) into a public repo → personal data exposed, scope broken | `AGENTS.md` | `provided/AGENTS.md` line 12 | confirmed | 2 | 2 | 4 | Same patch: one fictional room, never real names, timetables or personal data | me (Ali) | checker C1 PASS |
| R7 | Correctness | `ROOMS` holds two rooms (A-101, B-204) although the scope is one room → an agent treats multi-room as the contract and builds on it → scope creep, contract mismatch | `src/App.tsx` `ROOMS` | `src/App.tsx` lines 7-10; the page shows a room selector (`evidence/ui-desktop.png`) | confirmed | 3 | 1 | 3 | Remove B-204 and the selector in a separate change | me (Ali) | page shows one room; suite green |
| R8 | Reliability | No CI → nothing runs `npm test` / `npm run build` on push → regressions reach `main` unnoticed (R4 has been red since Week 08) | missing: CI workflow in `.github/workflows` running npm test and npm run build | no `.github/` in the repository; R4 was never caught | confirmed | 2 | 2 | 4 | Add a GitHub Actions workflow | me (Ali) | a green check on the PR |
| R9 | Security | Dev dependencies have published advisories (esbuild dev server readable by other sites; tinypool prototype pollution) → while `npm run dev` runs, a malicious page could read dev-server responses → source leak on the developer's machine | `package.json` | `npm audit`: 6 vulnerabilities (3 moderate, 1 high, 2 critical); fixes need breaking upgrades of vite/vitest | plausible | 1 | 2 | 2 | Upgrade vite/vitest in a separate reviewed change; keep the dev server on localhost | me (Ali) | `npm audit` clean, suite green after upgrade |
| R10 | Correctness | `check()` uses one "Room blocked" checkbox and ignores each room's `blocked` field → a room marked blocked in the data shows "Available" → AC3 depends on the user | `src/App.tsx` `check()` | `room.blocked` is never read (`grep -n blocked src/App.tsx`); both rooms are `blocked: false` today, so it is latent | confirmed | 1 | 2 | 2 | In a later change, pass the room's own flag or the checkbox to `canBook` | me (Ali) | a test with a blocked room in the data |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3 = 9. Likelihood 3: the file says "follow it over any general habit", and the Part 1 agent repeated the deploy and Supabase lines back to me as allowed actions. Impact 3: `--prod` publishes an unreviewed build publicly and cannot be quietly undone, and a backend brings keys into a project that must have none.
2. **R2** — 3 × 2 = 6. Likelihood 3: a reversed interval is an ordinary input mistake, and I reproduced the double message on the first try (`evidence/ui-mobile.png`). Impact 2: the user is never told "Available" wrongly, but gets two contradicting messages (AC6), and the logic sits where no test can catch the next regression. R3 and R4 also score 6 (not higher). I take R2 because it is the code risk a test can show.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | no `.prettierrc` / `prettier.config.*`, no `prettier` in `package.json` |
| 1b | Linter | no | no `eslint.config.*` / `.eslintrc*`, no `eslint` in `package.json`; `npm run lint` is missing |
| 1c | Type checks | yes | `tsconfig.json` (`strict: true`) and `typescript ^5.5.3` in devDependencies; `tsc` runs in `npm run build` |
| 1d | Unit tests | yes | `src/booking.test.ts` and `vitest ^2.1.9` in devDependencies; `npm test` = `vitest run` |
| 1e | Pinned dependencies (lockfile) | yes | `package-lock.json` committed in `app/` |
| 2a | `.env.example` | no | no `.env.example` in `app/` (the app needs no environment variables) |
| 2b | Architecture notes | yes | only the three lines of `AGENTS.md` §Project say which module does what (`src/booking.ts` canBook, `src/App.tsx`, `src/booking.test.ts`); there is no README |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` (copied from `provided/`, patched in Part 6) |
| 3a | CI | no | no `.github/workflows/` anywhere in the repository |
| 3b | Pre-commit hooks | no | no `.husky/`, `lint-staged`, `simple-git-hooks` or `.pre-commit-config.yaml` |
| 3c | Integration checks | no | the suite tests `canBook` (and, after Part 8, `checkRequest`) in one module; nothing renders the page or tests `App.tsx` |
| 3d | Reviewable evidence | no | no CI log, no PR template; test output exists only when pasted by hand into this report |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1 needs 4 of 5 rows; the project has 3 of 5 (1c, 1d, 1e). Either a formatter (row 1a: `prettier` in devDependencies plus a `.prettierrc` and a `format` script) or a linter (row 1b: `eslint` plus `eslint.config.js` and a `lint` script) would reach Level 1. Both would be better.
- Level 2 would then also need `.env.example` (2a). Even an empty one with a comment saying "no variables" would document that the app needs no secrets.
- Level 3 needs CI in `.github/workflows/` running `npm test` and `npm run build` (3a), pre-commit hooks (3b), a test that renders `App.tsx` (3c) and a PR template or CI log as evidence (3d).
- README: there is none in `app/`. The only description is `AGENTS.md`, which was wrong on AC4, the test command, data and deployment before my patch. The folder layout itself is clear (one `src/` with three source files and one test file).

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
I reviewed `app/AGENTS.md` against the six constraints. It breaks 5 of them outright and leaves the sixth (no secrets) unstated. It also names a test command that doesn't exist, and AC6 is missing. I edited nothing; the draft patch below waits for your approval.

Files read:
- C:\Users\alyok\se-practice\week-10\app\AGENTS.md (byte-identical to C:\Users\alyok\se-practice\week-10\provided\AGENTS.md)
- C:\Users\alyok\se-practice\week-10\README.md (the project scope and the AC1–AC6 contract are in its §3)
- C:\Users\alyok\se-practice\week-10\app\package.json, only to check whether the commands exist

There is no README inside `app/`, and the source code and the checker script were not reviewed. I ran no tests or build, because you scoped this to documentation only.

## Missing or conflicting rules (line numbers in app/AGENTS.md)

| # | Constraint | Line | Problem | Type |
|---|---|---|---|---|
| 1 | One fictional room | 12 | "use real room names and the real timetable from the KBTU portal" — calls for real data. Line 8 ("a campus room") also never says there is only one room. | Conflict, and missing rule |
| 2 | No login / database | 33 | "add a small Supabase table and a login page" — allows both a database and a login. | Conflict |
| 3 | Preserve AC1–AC6 | 19 | AC4 says "touches … at an endpoint also counts as an overlap". The contract (README §3) says "allow bookings that only touch at endpoints". This is the opposite meaning. | Conflict |
| 4 | Preserve AC1–AC6 | 14–20 | AC6 ("Preserve clear UI feedback on desktop and mobile") is not listed. | Missing |
| 5 | No secrets | — | Nothing forbids keys, tokens, `.env` files or personal data. Line 33 (Supabase) would bring in API keys. | Missing |
| 6 | No external deployments | 38 | "`npx netlify deploy --prod`" tells the agent to deploy to production. Netlify is also not in package.json. | Conflict |
| 7 | Run tests before proposing acceptance | 26 | "`npm run test:unit`" does not exist. package.json only has a `test` script (`vitest run`), so an agent can't run the named command. | Conflict |
| 8 | Run tests before proposing acceptance | 35–38 | The finish checklist only says "page still loads". It never requires tests or a build before acceptance. | Missing |
| 9 | (outside the six constraints) | 31–32 | "Edit any file" and "Add packages when a task needs them" are wide permissions, and line 32 lets an agent pull in a Supabase client. | Optional; not in the patch |

The other named commands exist: `npm install`, `npm run dev` and `npm run build`.

## Draft minimal patch (not applied; waiting for your approval)

--- a/app/AGENTS.md
+++ b/app/AGENTS.md
@@ -9,7 +9,7 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: one fictional room with fictional bookings only. Never use real room names, timetables or personal data.
 
 ## Acceptance contract
 
@@ -16,15 +16,16 @@
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
@@ -30,9 +31,11 @@
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login page, a database or any backend service (no Supabase); bookings stay in-memory fixtures.
+- Never add or commit secrets: no API keys, tokens, passwords, `.env` files or real personal data.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`; both must pass, with real output shown, before proposing acceptance.
+- Never deploy to Netlify or any external or production service; a human decides any release.

Notes on the patch:
- **Size:** 5 lines removed and 8 added, 13 in total. That fits the README's limit of 1–14 changed lines (A2), and all five headings stay the same.
- **Commands:** every command it names exists in package.json (`npm install`, `npm run dev`, `npm test`, `npm run build`). It deliberately has no `npx netlify` in backticks, so the command check (A3) won't treat Netlify as a named command.
- **Prohibitions under "You may":** the "Never …" rules sit under that heading only because the headings can't change. If you'd rather not, they can move into the Project scope paragraph.

## Decisions for you

1. Should I also change finding #9, line 32 ("Add packages…"), to "Do not add packages without human approval"? That would make 15 changed lines, one over the limit, so another line would have to be shortened or merged.
2. Should the AC4 wording copy the README contract exactly, as drafted?
3. Use `npm test`, as drafted, or add a `test:unit` script to package.json instead?

Reply "approve" (with any changes) and I'll apply only the approved lines to `app/AGENTS.md`. Nothing is edited or committed.
```

(The answer's patch came inside a ```` ```diff ```` fence. I removed only those inner fence lines so that it would not close this block early. Nothing else is changed.)

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | line 12 "use real room names and the real timetable from the KBTU portal" | conflicting (C1) | approve | The scope is one fictional room with no real personal data. The new line states one fictional room and forbids real names, timetables and personal data |
| 2 | line 33 "add a small Supabase table and a login page" | conflicting (C2) | modify | Approved the ban on login, database and backend. I merged the agent's separate secrets line into this one ("… and never add or commit secrets: no API keys, tokens, passwords or `.env` files") to save a line for finding 9 |
| 3 | line 19 AC4 "touches … also counts as an overlap" | conflicting (C3) | approve | Opposite of the contract and of `canBook`; T01, T08 and BUG-A prove touching is allowed. The new wording is the contract's own |
| 4 | AC6 not listed | missing (C3) | approve | AC6 is part of the contract (README §3); added as one line |
| 5 | no rule on secrets | missing (C4) | modify | Approved the rule but not as its own line: merged into line 33's replacement (see 2). I dropped "real personal data" from it because the new line 12 already covers that |
| 6 | line 38 `npx netlify deploy --prod` | conflicting (C5) | approve | The scope forbids external deployments, and `netlify` is not even in `package.json` (I counted 0 matches). Replaced by "Never deploy … a human decides any release" |
| 7 | line 26 `npm run test:unit` | conflicting (C6, A3) | approve | My run: `Missing script: "test:unit"`. Changed to `npm test`, which exists. I rejected the alternative of adding a `test:unit` script, because that would change `package.json` for a documentation fix |
| 8 | "Before you finish" never asks for tests | missing (C6) | approve | Added "Run `npm test` and `npm run build`; both must pass, with real output shown, before proposing acceptance". `npm run build` is red today (R4), so an agent cannot propose acceptance until R4 is fixed. That is the intended effect |
| 9 | lines 31-32 "Edit any file", "Add packages when a task needs them" | too broad (the agent left it out) | modify | I changed them anyway, within the 14-line limit. Edits are allowed in `src/` only, an existing test assertion may never be weakened or deleted (the review's AI-R11), and packages need a human's approval |
| 10 | the agent's question 2: copy AC4 exactly | — | approve | Yes. The contract's wording, nothing invented |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..7898d3c 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: one fictional room with fictional bookings only. Never use real room names, timetables or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit files in `src/` only; never weaken or delete an existing test assertion.
+- Do not add packages without a human's approval.
+- Never add a login page, a database or a backend (no Supabase), and never add or commit secrets: no API keys, tokens, passwords or `.env` files.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`; both must pass, with real output shown, before proposing acceptance.
+- Never deploy to Netlify or any external or production service; a human decides any release.
```

The checker measures this as 9 changed lines with every heading kept (A2).

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text

 RUN  v2.1.9 C:/Users/alyok/se-practice/week-10/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 9ms
   × Week 10: regression tests named after a risk > R2 AC1/AC6: a reversed interval gives one error and no Available/Unavailable verdict 4ms
     → checkRequest is not a function

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > Week 10: regression tests named after a risk > R2 AC1/AC6: a reversed interval gives one error and no Available/Unavailable verdict
TypeError: checkRequest is not a function
 ❯ src/booking.test.ts:205:21
    203| describe('Week 10: regression tests named after a risk', () => {
    204|   it('R2 AC1/AC6: a reversed interval gives one error and no Available…
    205|     const outcome = checkRequest({
       |                     ^
    206|       now: '09:00',
    207|       start: '12:00',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  14:18:56
   Duration  492ms (transform 46ms, setup 0ms, collect 52ms, tests 9ms, environment 0ms, prepare 131ms)
```

The failure is a `TypeError`, not a wrong value. Before the fix, the reversed-interval path exists only inside `check()` in `App.tsx`, and no test can call it. The test pins the behaviour the contract asks for: one error, and no Available/Unavailable verdict. Until a pure function holds that logic, nothing can satisfy it.

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 × 800 | now 09:00, 11:00-12:00 in Room A-101 (touches the 10:00-11:00 booking): green "Available"; the form fits on one row; nothing cut off; no horizontal scroll (scrollWidth 1280 = viewport) | pass | `evidence/ui-desktop.png` |
| Mobile | 375 × 812 (phone emulation, DPR 2) | now 09:00, start 12:00, end 11:00 (reversed): fields stack vertically, nothing overlaps, no horizontal scroll (375 = 375); but the page shows the error **and** "Unavailable" together. I also tried 10:30-11:30 (overlap): a bare "Unavailable" with no reason | fail for AC6: the double message is R2 | `evidence/ui-mobile.png` |
| Mobile, after the fix | 375 × 812 | the same reversed input after Part 8: only the error line, no verdict | pass | `evidence/ui-mobile-after.png` |

The screenshots were taken from the running dev server (`npx vite`). The page was driven in headless Microsoft Edge by a small DevTools-protocol script, which filled the time inputs, clicked "Check availability" and saved the PNG. I looked at every image myself.

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- No automated test of `App.tsx` or of the rendered page: the project has no DOM test environment (jsdom or Testing Library), and adding one would mean new dependencies, which the refactor prompt forbids. The UI was checked only manually (7.2).
- `npm run lint`: there is no lint script and no linter (audit row 1b).
- I did not check on a real phone or in browsers other than Edge/Chromium (no Safari or Firefox).
- No load, accessibility (screen reader, keyboard-only) or security scan beyond `npm audit`.
- The deck's optional Practice #09 prompt for extra regression tests was not sent. The suite already has past time (X1), reversed (T04), 121 minutes (T07), blocked (T13), overlap (T09-T12), touching endpoints (T01, T08) and unchanged fixtures (AC5, BUG-B).
- `npm run build` was run, but it is red because of R4, which I did not fix (see §10).

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** the agent's two separate "Never …" lines (backend and secrets) became one line, so that the "Edit any file / Add packages" lines could be narrowed within 14 lines. I also rejected its offer to add a `test:unit` script to `package.json`, because it would change the project to match a wrong document. Nothing else was rejected (see §6.2).

The diff I approved (`git diff`), committed as `week-10: AGENTS.md patch, approved` (c2d629e). The same patch also closes R3, R5 and R6:

```text
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: one fictional room with fictional bookings only. Never use real room names, timetables or personal data.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
+- AC6 Preserve clear UI feedback on desktop and mobile.
-- Tests: `npm run test:unit`
+- Tests: `npm test`
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit files in `src/` only; never weaken or delete an existing test assertion.
+- Do not add packages without a human's approval.
+- Never add a login page, a database or a backend (no Supabase), and never add or commit secrets: no API keys, tokens, passwords or `.env` files.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`; both must pass, with real output shown, before proposing acceptance.
+- Never deploy to Netlify or any external or production service; a human decides any release.
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
The project is in C:\Users\alyok\se-practice\week-10\app (read its AGENTS.md first).

Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The problem was that `check()` in `App.tsx` mixed parsing (`toMinutes`), validation and the `canBook` call, and set the error and the verdict separately. That is why a reversed interval showed both messages, and why no test could reach that path. I used no pattern: one extracted pure function, `checkRequest`, beside `canBook` in `src/booking.ts`. It returns exactly one outcome `{ error, result }`, so the R2 regression test can pin it, while `canBook` keeps its inputs and outputs and the page only renders the outcome. Strategy or Adapter would have been unjustified: there is one data shape and one policy.

**What I rejected from the agent's patch, and why:** The agent (a fresh Claude Code sub-agent, prompt above; the first line only told it where the project is) listed its files but then edited them in the same run, without waiting for my approval. I treat that as an Agent-operations finding, and I reviewed the uncommitted diff before accepting anything. I **rejected** three parts: (1) deleting the duplicate `vitest` import in `src/booking.test.ts`, because it is the fix for R4 and does not belong in the R2 refactor, so it gets its own reviewed change; (2) changes inside `canBook` (new `DAY_END` / `MAX_DURATION` constants, switching its parameter type to `CanBookParams`), because they are unrequested "improvements" to a function that must stay unchanged; (3) exporting `toMinutes`, because nothing outside the module needs it. I **accepted** `checkRequest`, its two interfaces and the three-line `check()` in `App.tsx`. One behaviour change is deliberate: a reversed interval now shows only the error. That is the R2 fix the regression test requires. Every other input gives the same output as before (Available, Unavailable, the missing-fields error).

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index 70480fd..af2d11b 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -1,5 +1,5 @@
 import { useState } from 'react';
-import { canBook } from './booking';
+import { checkRequest } from './booking';
 
 type Interval = { start: number; end: number };
 type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };
@@ -9,10 +9,6 @@ const ROOMS: Room[] = [
   { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
 ];
 
-const toMinutes = (value: string) => {
-  const [h, m] = value.split(':').map(Number);
-  return h * 60 + m;
-};
 const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
 
 export default function App() {
@@ -28,30 +24,9 @@ export default function App() {
   const room = ROOMS.find(r => r.id === roomId)!;
 
   function check() {
-    setResult(null);
-    if (!start || !now || (!end && !endOfDay)) {
-      setError('Fill in the current time, the start and the end.');
-      return;
-    }
-    const s = toMinutes(start);
-    const e = endOfDay ? 1440 : toMinutes(end);
-    const n = toMinutes(now);
-    if (!(s < e)) {
-      setError('The end time must be after the start time.');
-    } else {
-      setError('');
-    }
-
-    // Вызываем вынесенную чистую функцию canBook
-    const ok = canBook({
-      start: s,
-      end: e,
-      now: n,
-      blocked,
-      bookings: room.bookings,
-    });
-
-    setResult(ok);
+    const outcome = checkRequest({ now, start, end, endOfDay, blocked, bookings: room.bookings });
+    setError(outcome.error);
+    setResult(outcome.result);
   }
 
   return (
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 58e4059..cf4760d 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -27,4 +27,38 @@ export function canBook({ start, end, now, blocked, bookings }: {
   }
 
   return true;
-}
\ No newline at end of file
+}
+
+/** Raw form values as the page holds them ("HH:MM" strings). */
+export interface CheckRequestParams {
+  now: string;
+  start: string;
+  end: string;
+  endOfDay: boolean;
+  blocked: boolean;
+  bookings: Booking[];
+}
+
+/** Exactly one of: an error message (result null) or a verdict (error ''). */
+export interface CheckOutcome {
+  error: string;
+  result: boolean | null;
+}
+
+const toMinutes = (value: string): number => {
+  const [h, m] = value.split(':').map(Number);
+  return h * 60 + m;
+};
+
+/** Pure: validates the raw form values, then applies canBook. Never mutates bookings. */
+export function checkRequest({ now, start, end, endOfDay, blocked, bookings }: CheckRequestParams): CheckOutcome {
+  if (!start || !now || (!end && !endOfDay)) {
+    return { error: 'Fill in the current time, the start and the end.', result: null };
+  }
+  const s = toMinutes(start);
+  const e = endOfDay ? 1440 : toMinutes(end);
+  if (!(s < e)) {
+    return { error: 'The end time must be after the start time.', result: null };
+  }
+  return { error: '', result: canBook({ start: s, end: e, now: toMinutes(now), blocked, bookings }) };
+}
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | `AGENTS.md` now forbids deploying, login, database, backend and secrets (checker C2, C4, C5 PASS). Impact is unchanged, because a human or an agent that ignores the file could still run `netlify deploy` by hand |
| R2 | 3 | 2 | 6 | 1 | 2 | 2 | `checkRequest` returns early with `result: null` on start ≥ end; the R2 test passes (8.4); `evidence/ui-mobile-after.png` shows one message. Not 0: `App.tsx` still has no render test, so a wiring mistake there would be invisible |
| R3 | 3 | 2 | 6 | 1 | 2 | 2 | Same patch: `AGENTS.md` names `npm test`, which exists (A3 PASS) and must pass before acceptance (C6 PASS) |
| R5 | 2 | 2 | 4 | 1 | 2 | 2 | Same patch: AC4 now says touching is allowed (C3 PASS); T01, T08, BUG-A still pass |
| R6 | 2 | 2 | 4 | 1 | 2 | 2 | Same patch: line 12 forbids real names, timetables and personal data (C1 PASS) |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text

 RUN  v2.1.9 C:/Users/alyok/se-practice/week-10/app

 ✓ src/booking.test.ts (20 tests) 9ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  14:23:24
   Duration  511ms (transform 67ms, setup 0ms, collect 76ms, tests 9ms, environment 0ms, prepare 123ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Its own git worktree on a branch `agent/<task>` cut from `week-10`; never commits to `main` or `week-10`, never force-pushes, never merges; no network beyond `npm install` from the lockfile |
| Permitted files | Only `week-10/app/src/booking.ts`, `src/App.tsx`, `src/index.css` and `src/booking.test.ts` (adding tests only); `AGENTS.md`, `package.json`, `package-lock.json`, `provided/`, `tests/` and the report are read-only to it |
| Commands | Only `npm ci`, `npx vitest run` (or `npm test`), `npm run build`, `git diff`, `git status`, and `npm run dev` on localhost for a look; never `npm audit fix --force`, never `npx <anything new>` |
| Prohibited actions | No deploy (`netlify`, `vercel`, GitHub Pages), no login, database or Supabase, no secrets or `.env`, no real KBTU room names or timetables, no new packages, no deleting or weakening an existing assertion, no editing `AGENTS.md` |
| Required evidence | The full `git diff`; the unedited `npx vitest run` output with the test count (at least 20, all passing); the `npm run build` output; screenshots at 1280 px and 375 px if `App.tsx` or CSS changed; a note on which risk IDs (R1–R10) the change touches |
| Before merging or deploying | I read the diff line by line, re-run `npx vitest run` and `npm run build` myself, re-run `python tests/check_audit.py`, and approve the PR by hand. There is never a deployment: this project has no release target |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->
Not sent.

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
CONDITIONAL. R1, the deploy and Supabase lines in AGENTS.md (3 x 3 = 9), is closed by the approved patch and is now 1 x 3: a person could still deploy by hand. R2, the double message for a reversed interval (3 x 2 = 6), is fixed by moving the request check into a pure checkRequest function. Its regression test failed before the fix and passes now, with all 20 tests green. GO is not possible, because R4 still scores 6: the duplicate vitest import makes npm run build fail, even though vite build alone works. It is a one-line fix that I own and must make before any release. R7 (two rooms, not one) and R8 (no CI) stay open, owned by me. I checked the UI by hand at two widths, but no test renders App.tsx, so I am still unsure about regressions in the page itself.
