# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude Code (Claude desktop app, Code tab), including the sub-agents it starts |
| Assistant model | claude-opus-5-5 (Claude Opus 5.5) |
| Starting point | week-08 |
| Baseline commit | 434921c |
| Language (ts or js) | ts |
| Vitest version | 2.1.9 |
| Where I ran the tests | locally, Windows 11 Pro, Node v24.19.0, npm 11.17.0, Git Bash, inside `sis-04/app` |

Note on the starting point: on branch `week-08` only `src/booking.ts` and `src/booking.test.ts` of
`week-08/app` were ever committed; `App.tsx`, `main.tsx`, `index.css`, `package.json` and the Vite
config existed only in my working tree. The baseline commit takes the two committed files from
`week-08` and the rest from that working tree, all unchanged.

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
$ cd sis-04/app && npm install && npx vitest run

 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-04/app

 ✓ src/booking.test.ts (19 tests) 5ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  19:15:02
   Duration  747ms (transform 58ms, setup 0ms, collect 60ms, tests 5ms, environment 0ms, prepare 198ms)
```

The same baseline does **not** type-check, so `npm run build` (`tsc && vite build`) fails:

```text
$ npx tsc --noEmit
src/booking.test.ts(1,10): error TS2300: Duplicate identifier 'describe'.
src/booking.test.ts(1,20): error TS2300: Duplicate identifier 'it'.
src/booking.test.ts(1,24): error TS2300: Duplicate identifier 'expect'.
src/booking.test.ts(3,10): error TS2300: Duplicate identifier 'describe'.
src/booking.test.ts(3,20): error TS2300: Duplicate identifier 'it'.
src/booking.test.ts(3,30): error TS2300: Duplicate identifier 'expect'.
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app (Practice #08 code, unchanged)
- package.json        react 18, vite 5, vitest 2.1.9; scripts dev / build (tsc && vite build) / test (vitest run)
- index.html          Vite entry, viewport meta, mounts #root
- src/main.tsx        createRoot + <App/> in StrictMode
- src/App.tsx         the whole page: type Interval, type Room, const ROOMS (2 rooms: id, name, blocked, bookings),
                      toMinutes(), fmt(), App() with useState for roomId/now/blocked/start/end/endOfDay/result/error,
                      check() that validates the form and calls canBook, the JSX (room select, time inputs,
                      "Ends at 24:00" and "Room blocked" checkboxes, result, bookings list)
- src/booking.ts      interface Booking, interface CanBookParams, canBook({start,end,now,blocked,bookings}): boolean - AC1-AC5
- src/booking.test.ts 19 Vitest tests on canBook (T01-T14, X1, X2, AC5 no-mutation, BUG-A, BUG-B)
- src/index.css       styles, one @media (max-width: 480px) block
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending a small React + TypeScript + Vite app (Smart Campus Room Availability Checker). Please analyse it. Do NOT write code and do NOT propose a full rewrite: I want maintainability risks with file/function references and a short plan of small, safe steps.

REPOSITORY MAP (sis-04/app, my Practice #08 code, unchanged)
- package.json        react 18, vite 5, vitest 2.1.9; scripts dev / build (tsc && vite build) / test (vitest run)
- index.html          Vite entry, viewport meta, mounts #root
- src/main.tsx        createRoot + <App/> in StrictMode
- src/App.tsx         the whole page: type Interval, type Room, const ROOMS (2 rooms: id, name, blocked, bookings), toMinutes(), fmt(), App() with useState for roomId/now/blocked/start/end/endOfDay/result/error, check() that validates the form and calls canBook, the JSX (room select, time inputs, "Ends at 24:00" and "Room blocked" checkboxes, result, bookings list)
- src/booking.ts      interface Booking, interface CanBookParams, canBook({start,end,now,blocked,bookings}): boolean - the AC1-AC5 rules
- src/booking.test.ts 19 Vitest tests on canBook (T01-T14, X1, X2, AC5 no-mutation, BUG-A, BUG-B)
- src/index.css       styles, one @media (max-width: 480px) block

REQUIREMENTS THAT MUST NOT CHANGE
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

NEW FEATURE: a catalog of at least 4 fictional rooms, each with id, name, capacity, equipment list, blocked status and its own bookings. Show only rooms that satisfy the user's requirements. The availability check must use the chosen room's bookings.
F1 capacity >= requested attendees
F2 the room has ALL selected equipment
F3 a blocked room is never reported available
F4 a clear empty state when no rooms match
F5 changing the selected room refreshes the result; the check uses THAT room's bookings

FIXED TARGET LAYOUT in src/: rooms.ts (type Room + const ROOMS), filter.ts (filterRooms(rooms, {attendees, equipment}): Room[]), booking.ts (canBook unchanged + checkRoom(rooms, roomId, {start, end, now}) that calls canBook), App.tsx + components import these and hold no room data and no rule of their own.

CONSTRAINTS: no login, no payments, no live APIs, no database, no browser storage; fictional data only. Times are minutes after midnight (600 = 10:00), now is a fixed demo time.

CURRENT CODE

--- src/booking.ts ---
export interface Booking {
  start: number;
  end: number;
}

export interface CanBookParams {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }

  return true;
}

--- src/App.tsx (check() and data part; JSX is a select over ROOMS, 3 time inputs, 2 checkboxes, result <p>, bookings <ul>) ---
type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
];
...
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    setResult(null);
    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);
    if (!(s < e)) {
      setError('The end time must be after the start time.');
    } else {
      setError('');
    }
    const ok = canBook({ start: s, end: e, now: n, blocked, bookings: room.bookings });
    setResult(ok);
  }
...
  <select value={roomId} onChange={e => setRoomId(e.target.value)}>
  <label className="inline"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} /> Room blocked</label>

--- src/booking.test.ts (first lines) ---
import { describe, it, expect } from 'vitest';
import { canBook } from './booking';
import { describe, it, test, expect } from 'vitest';

Please answer with:
1. Maintainability risks (at least 3), each with file/function, the evidence in the code, and a priority High/Medium/Low.
2. A numbered plan of small steps, smallest safe step first, that gets to the target layout while keeping AC1-AC6 green. No code.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Blocked status is a page-level checkbox, not room data, so F3/AC3 cannot hold per room | `src/App.tsx`, `App()` line 21 (`useState(false)`), line 70 (checkbox), `check()` line 50 | `grep -n blocked src/App.tsx`: the `Room` type and `ROOMS` have `blocked`, but `room.blocked` is never read; `check()` passes the checkbox state to `canBook`. A blocked room in the catalog would show Available unless the user ticks the box. | High |
| 2 | The build is broken while the tests are green | `src/booking.test.ts` lines 1 and 3 | `describe`, `it`, `expect` imported twice from `vitest`. `npx tsc --noEmit` prints six TS2300 "Duplicate identifier" errors (pasted in 1.1), so `npm run build` (`tsc && vite build`) stops; `npx vitest run` only transpiles and passes 19/19. | High |
| 3 | Changing the room keeps the old result (stale answer, breaks F5); the lookup can crash once the list is filtered | `src/App.tsx`, the room `<select>` `onChange` line 62; `ROOMS.find(...)!` line 28 | `onChange={e => setRoomId(e.target.value)}` never touches `result`, so A-101's "Unavailable" stays on screen next to B-204's bookings. The `!` hides `undefined`; `room.bookings` on line 78 would throw if the id is filtered out. | High |
| 4 | Duplicated validation and two messages for one problem | `src/App.tsx`, `check()` lines 39-54 | `check()` repeats the AC1 rule `s < e` that `canBook` already has; on failure it sets the error but does not `return`, then calls `canBook` and also shows "Unavailable". | Medium |
| 5 | Room data and types live in the UI; the same shape is declared three times | `src/App.tsx` lines 4-10 (`Interval`, `Room`, `ROOMS`); `src/booking.ts` `interface Booking`, `interface CanBookParams`, `canBook()` inline parameter type | `Interval` in App.tsx repeats `Booking`; `canBook` re-declares the `CanBookParams` shape inline instead of using it, so `CanBookParams` is exported but unused. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

After every step: `npx vitest run` (whole suite) and `npx tsc --noEmit`, read the diff, commit.

1. Delete the duplicate `vitest` import in `src/booking.test.ts` (risk 2). Must stay 19/19 green; `tsc` must become clean.
2. Type `canBook`'s parameter as `CanBookParams` and change nothing in its body (risk 5). The 19 AC tests are the safety net; give the existing tests that already prove B1-B4 their IDs (T06 → B1, T07 → B2, T01 → B3, T09 → B4).
3. Create `src/rooms.ts`: the `Booking` and `Room` types (`id, name, capacity, equipment: string[], blocked, bookings`), `ROOMS` with 5 fictional rooms (one blocked, one without bookings), the equipment options and the fixed demo time. `booking.ts` imports `Booking` from here (risk 5).
4. Test first, then add `checkRoom(rooms, roomId, { start, end, now })` to `src/booking.ts`: find the room, call `canBook` with that room's `blocked` and `bookings`; an unknown id is not available. Tests: F3 (blocked room), F5 (same times, two rooms, two results), AC5 (catalog unchanged).
5. Test first, then add `filterRooms(rooms, { attendees, equipment })` in `src/filter.ts`: F1 `capacity >= attendees`, F2 ALL selected items. Tests: F1, F2, F4 (empty result), B5 (equal capacity in), B6 (one below out), then an INT test (`filterRooms` then `checkRoom` on what it returned).
6. Move `toMinutes`/`fmt` to `src/time.ts`; split the page into `RoomFilter`, `RoomList` (with the F4 empty state) and `ResultMessage`. `App.tsx` uses `filterRooms` and `checkRoom`, the "Room blocked" checkbox is removed (risk 1), the duplicated `s < e` check is removed (risk 4), the result is recomputed for the newly selected room with the same submitted times and cleared when a time changes (risk 3, F5).
7. Check the page at desktop and phone width (AC6), take the five screenshots, draw `before.puml`/`after.puml`, fill §4-§7.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| "Clean up `canBook` without changing behaviour (R6, R7). Type its parameter as `CanBookParams`. Replace 1440 and 120 with named exported constants." (exchange 8.1, plan step 3) | Rejected | The brief (README §7) says `canBook` stays unchanged from Practice #07/#08, and the AC2 limit is checked as written. I kept only the type annotation; the `> 120` and `1440` literals in `canBook` stay exactly as they were, and the 19 AC tests prove nothing moved. |
| "Clear the result and error whenever the room or a time input changes (R4, F5)." (exchange 8.1, plan step 8) | Modified | F5 says changing the room must *refresh* the result, not erase it. The page keeps the last submitted times and recomputes with `checkRoom` for the newly selected room; only a time change clears the result. This is what `switch-a.png` / `switch-b.png` must show. |
| "Move `Room` into `rooms.ts`, built on `Booking` from `booking.ts` instead of `Interval`" and "Add `capacity` and `equipment` (a string-literal union)" (exchange 8.2, steps 4 and 7) | Modified | `checkRoom` in `booking.ts` needs `Room` from `rooms.ts`; taking `Booking` from `booking.ts` would make the two modules import each other. `Booking` moves to `rooms.ts` (data types live with the data) and `booking.ts` imports it. `equipment` stays `string[]` because README §7 fixes the `Room` type for everyone. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
