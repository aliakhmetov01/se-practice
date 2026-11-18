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
| Assistant (tool) | Claude Code |
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

- **Catalog** (`src/rooms.ts`): 5 fictional rooms, every field filled - Room A-101 (12 seats,
  projector + whiteboard, booked 10:00-11:00), Room B-204 (8, whiteboard, no bookings), Lab C-310
  (24, projector + computers, booked 12:00-14:00), Seminar Hall D-015 (40, projector + whiteboard +
  video-conference, **blocked**), Study Room E-112 (4, video-conference, booked 09:00-10:00 and
  15:00-16:00). Equipment options: projector, whiteboard, video-conference, computers.
- **Filter** (`src/filter.ts`, `components/RoomFilter.tsx`): a number field for attendees and one
  checkbox per equipment item. The list under "Rooms (n of 5)" is `filterRooms(ROOMS, …)`: F1
  `capacity >= attendees`, F2 `every` selected item. Blocked rooms stay in the list with a red
  "Blocked" label.
- **Empty state** (F4, `components/RoomList.tsx`): "No rooms match these requirements. Try fewer
  attendees or less equipment." in a dashed red box, `role="status"`.
- **Check** (`checkRoom` in `src/booking.ts`): the user picks a room (radio list), enters start/end
  and presses "Check availability". The answer is `checkRoom(ROOMS, selectedId, { start, end, now })`,
  so the chosen room's own `blocked` and `bookings` decide (F3, F5). The fixed demo time 09:00
  (`DEMO_NOW = 540`) is shown at the top.
- **Room change** (F5): the page keeps the last submitted times; choosing another room recomputes
  the answer for that room at once (no stale result). Changing a time clears the answer until the
  next check. While the filter hides the selected room, no room counts as selected and the page says
  "Choose a room from the list to check it."; when the filter lets that room back in, it is selected
  again and its answer (recomputed for it) comes back.
- The "Room blocked" checkbox of the starting point is gone: blocked status comes only from data.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

Screenshots were taken in the Claude desktop app's built-in browser (Chromium) from `npm run dev`;
they are JPEG files (`.jpg`), which README §7 allows.

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.jpg` | Attendees 10, projector ticked: "Rooms (3 of 5)" - Room A-101 (12), Lab C-310 (24), Seminar Hall D-015 (40, Blocked label). B-204 (8 seats, no projector) and E-112 (4 seats) are filtered out. |
| `evidence/filter-empty.jpg` | Attendees 10, projector + whiteboard + computers ticked: "Rooms (0 of 5)" and the F4 empty-state message "No rooms match these requirements. Try fewer attendees or less equipment." |
| `evidence/switch-a.jpg` | Same filter as filter-match, Room A-101 selected, 10:30-11:30 checked: "Room A-101, 10:30–11:30: Unavailable"; its bookings list shows 10:00–11:00 (overlap, AC4). |
| `evidence/switch-b.jpg` | The same times 10:30-11:30, Lab C-310 selected without pressing the button again: "Lab C-310, 10:30–11:30: Available"; its own booking is 12:00–14:00 (F5). |
| `evidence/narrow.jpg` | 390 px wide viewport, portrait: filter and time fields stacked in one column, full-width button, Seminar Hall D-015 (Blocked) selected, 10:30-11:30 → "Unavailable" (F3) and "The room is blocked: it cannot be booked." No horizontal scroll (`scrollWidth` 390 = `innerWidth` 390). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: the `Booking` and `Room` types, `ROOMS` (5 fictional rooms), `EQUIPMENT` (filter options), `DEMO_NOW` (fixed current time 09:00). No functions. |
| `src/booking.ts` | Availability rules: `canBook` (AC1-AC5, body unchanged since week-08) and `checkRoom(rooms, roomId, request)`, which finds the room and calls `canBook` with that room's `blocked` and `bookings`; unknown id → false. |
| `src/filter.ts` | `filterRooms(rooms, { attendees, equipment })`: F1 capacity ≥ attendees, F2 all selected equipment. Returns a new array, changes nothing. |
| `src/time.ts` | Input formatting only: `toMinutes("HH:MM")`, `fmt(minutes)`, `END_OF_DAY = 1440`. |
| `src/App.tsx` | Page state (filter values, selected room, times, last submitted request, error) and wiring; imports the rules, holds no room data and no rule. |
| `src/components/RoomFilter.tsx` | The attendees field and equipment checkboxes; reports changes up through props. |
| `src/components/RoomList.tsx` | The filtered rooms as a radio list with the Blocked label, or the F4 empty state. |
| `src/components/ResultMessage.tsx` | Shows Available / Unavailable for the chosen room (`aria-live`) and that room's bookings. Decides nothing. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a red "Blocked" label; `checkRoom` makes them Unavailable. | Hide blocked rooms inside `filterRooms`. | F1/F2 are about capacity and equipment only; hiding would put an F3 rule into the filter and make a user think the room does not exist. F3 is guaranteed in one place, `checkRoom` → `canBook`, and the INT test proves a blocked room returned by `filterRooms` is still `false`. |
| The result is derived on every render from the last submitted times and the currently selected room (`checkRoom(ROOMS, selected.id, …)`); a time change clears it. | Store the boolean result in state and clear it on room change (the assistant's plan step 8, and the starting point stored it without clearing - risk 3). | A stored result is exactly what went stale in the starting point. Deriving it means it cannot belong to another room (F5), and switch-a / switch-b show the refresh without a second click. |
| `Booking` and `Room` types live in `rooms.ts`; `booking.ts` and `filter.ts` import them as types. | `Booking` stays in `booking.ts` and `rooms.ts` imports it (the assistant's step 4). | `checkRoom` needs `Room`, so the assistant's version makes `rooms.ts` and `booking.ts` import each other; with the types next to the data the dependency goes one way only (see `after.puml`). |
| `canBook`'s body is untouched; only its parameter type became `CanBookParams`. | Named constants for 120 and 1440 inside `canBook` (assistant, R7). | README §7 says `canBook` stays unchanged; the 19 week-08 tests still pass unchanged, which is the evidence AC1-AC5 did not move. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` line 4 `type Interval = { start; end }`, a copy of `interface Booking` in `src/booking.ts` | One `interface Booking` in `src/rooms.ts`, imported by `booking.ts` (commit ea05217) |
| `src/booking.ts` `canBook()` re-declared the `{ start, end, now, blocked, bookings }` shape inline next to the unused `interface CanBookParams` | `canBook({ … }: CanBookParams)` (commit b461aff) |
| `src/App.tsx` `check()` lines 39-43 repeated the AC1 rule `s < e` that `canBook` already checks | Removed from the page; only `canBook` (through `checkRoom`) decides (commit a92f564) |
| `src/App.tsx` `useState(false)` + "Room blocked" checkbox, a second source for `Room.blocked` | Removed; `checkRoom` reads `room.blocked` from `ROOMS` (commit a92f564) |
| `src/booking.test.ts` line 3, a second `import { describe, it, test, expect } from 'vitest'` | One import on line 1 (commit b461aff) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

All expected values come from AC1-AC5 / F1-F5 and were worked out by hand; the catalogs are
defined inside `checkRoom.test.ts` and `filter.test.ts` (r1 10 seats projector+whiteboard booked
600-660; r2 20 seats projector; r3 30 seats projector+whiteboard blocked; r4 5 seats nothing).

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: 540-570 starts now` (booking.test.ts) | canBook 540-570, now 540 → `false` (not after now) |
| AC2 | `T06 B1 AC2: 720-840 (120 min)` (booking.test.ts) | canBook 720-840 → `true` |
| AC3 | `T13 AC3: 660-720, blocked = true` (booking.test.ts) | canBook 660-720, blocked → `false` |
| AC4 | `T12 AC4: 600-660 identical` (booking.test.ts) | canBook 600-660 over booking 600-660 → `false` |
| AC5 | `AC5: checkRoom does not change the catalog` (checkRoom.test.ts) | three checkRoom calls → catalog deep-equals its copy |
| F1 | `F1: 15 attendees keeps only rooms with capacity >= 15 (r2, r3)` (filter.test.ts) | filterRooms attendees 15 → `['r2', 'r3']` |
| F2 | `F2: projector + whiteboard needs ALL of them - r2 (projector only) is out` (filter.test.ts) | filterRooms projector+whiteboard → `['r1', 'r3']` |
| F3 | `F3 AC3: a blocked room is never available, even for an otherwise valid free slot` (checkRoom.test.ts) | checkRoom r3 600-660 → `false` |
| F4 | `F4: no room holds 100 attendees - the result is empty` (filter.test.ts) | filterRooms attendees 100 → `[]` |
| F5 | `F5: same times, two different rooms, two different results` (checkRoom.test.ts) | 600-660: r1 → `false`, r2 → `true` |
| B1 | `T06 B1 AC2: 720-840 (120 min)` (booking.test.ts) | exactly 120 min → `true` |
| B2 | `T07 B2 AC2: 720-841 (121 min)` (booking.test.ts) | 121 min → `false` |
| B3 | `T01 B3 AC4: 660-720 touching after` (booking.test.ts) | touches 600-660 → `true` |
| B4 | `T09 B4 AC4: 630-690 partial overlap` (booking.test.ts) | overlaps 600-660 → `false` |
| B5 | `B5: capacity exactly equal to attendees (10 for 10) - r1 is included` (filter.test.ts) | attendees 10 → contains `r1` |
| B6 | `B6: capacity one below attendees (10 for 11) - r1 is excluded` (filter.test.ts) | attendees 11 → does not contain `r1` |
| INT | `INT F3: filterRooms then checkRoom - the blocked room stays in the list but is never available` (filter.test.ts) | filterRooms 15 + projector → `['r2','r3']`; checkRoom on that result: r2 → `true`, r3 → `false` |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm install
npx vitest run src/checkRoom.test.ts src/booking.test.ts   # before checkRoom existed: 5 failed
npx vitest run src/filter.test.ts                          # before filter.ts existed: suite failed to load
npx vitest run
npx tsc --noEmit
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
$ npx vitest run

 RUN  v2.1.9 C:/Users/alyok/se-practice/sis-04/app

 ✓ src/checkRoom.test.ts (5 tests) 5ms
 ✓ src/booking.test.ts (19 tests) 7ms
 ✓ src/filter.test.ts (9 tests) 7ms

 Test Files  3 passed (3)
      Tests  33 passed (33)
   Start at  19:24:27
   Duration  634ms (transform 119ms, setup 0ms, collect 199ms, tests 19ms, environment 1ms, prepare 598ms)
```

`npx tsc --noEmit` on the same code prints nothing (exit 0); at the baseline it printed six TS2300
errors (1.1).

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 33/33 | The `Tests` line of the `npx vitest run` outputs in 1.1 (baseline 434921c) and 6.3 (final) |
| Duplicated logic locations removed | 0 (5 duplicated locations present) | 5 removed | Counted as the rows of 5.3, each pointing at a line of the baseline and the commit that removed it |
| Code structure: modules and their responsibilities | 3 source modules: `App.tsx` (data + parsing + validation + page), `booking.ts` (canBook), `main.tsx`; 1 test file | 9 source modules: `rooms`, `booking`, `filter`, `time`, `App`, 3 components, `main`; 3 test files | `git ls-tree -r --name-only 434921c -- app/src` vs `git ls-files app/src`, read against 5.1 |
| Remaining limitation | Blocked status from a page checkbox; stale result after a room change; `tsc` (and so `npm run build`) failing | The page says only "Unavailable", never why: `canBook` returns a boolean, and I removed the page's own `s < e` message (5.3), so "end before start" now gets a plain "Unavailable" instead of "The end time must be after the start time.". Also no rendered UI test: F4's message and F5's refresh on the page are shown by screenshots, not by an automated test. | Reading `ResultMessage.tsx` and `App.tsx check()`; entering 12:00-11:00 on the page; test files listed in 6.1 (none uses `render`) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

**How these exchanges happened (disclosure).** I asked Claude Code (Claude desktop app, model
claude-opus-5-5) to do this assignment. Claude Code did the work in this repository and, for the
analysis, the plan and the implementation, sent the prompts below to separate Claude Code
sub-agents (same model), so that each exchange has an exact prompt and an exact answer. The
prompts were written by Claude Code from the repository map and the brief; the outputs are the
sub-agents' answers, cut with […]. The problems, changes and verification are what was checked
against the code, the tests and the page. See `AI_USAGE.md`.

### 8.1 Exchange 1

**Tool and model:** Claude Code sub-agent (general-purpose), claude-opus-5-5
**Date:** 2026-11-13
**Purpose:** Task 1 analysis - maintainability risks with file/function references and a first plan, no code

**Prompt:**

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

**Output used:**

```text
I read every file in `C:\Users\alyok\se-practice\sis-04\app\src` and ran both commands. `npm test` passes all 19 tests, but `npx tsc --noEmit` fails, which means **`npm run build` is broken right now**. I wrote no code.

| R1 | `src/booking.test.ts` lines 1 and 3 | `describe`, `it` and `expect` are imported twice. `tsc` reports TS2300 "Duplicate identifier" six times. [...] | High |
| R2 | `src/App.tsx` `App()` lines 21 and 70, and `check()` line 50 | The room's blocked status comes from a UI checkbox (`useState(false)`), not from the room data. `room.blocked` is never read anywhere. [...] | High |
| R3 | `src/App.tsx` `check()` lines 39–54 | When start >= end it sets the error message but does not `return`. It then calls `canBook` and shows "Unavailable" as well [...] | High |
| R4 | `src/App.tsx` lines 28 and 62 | The room select's `onChange` only calls `setRoomId`. `result` is not cleared [...] (breaks F5). Line 28 also uses `ROOMS.find(...)!`. [...] | High |
| R5 | `src/App.tsx` lines 4–10 | Room data and the `Interval`/`Room` types live inside the UI file. `Interval` repeats `Booking` from `booking.ts`. [...] | Medium |
| R6 | `src/booking.ts` lines 6–20 | `Booking` and `CanBookParams` are exported but `canBook` doesn't use them; it repeats the same shape inline. [...] | Medium |
| R7 | `src/booking.ts` lines 21–23 and `src/App.tsx` line 37 | `1440` and `120` are bare numbers [...] | Medium |
[...]
3. **Clean up `canBook` without changing behaviour (R6, R7).** Type its parameter as `CanBookParams`. Replace 1440 and 120 with named exported constants. The 19 tests must stay green unchanged [...]
[...]
8. **Clear the result and error whenever the room or a time input changes (R4, F5).**
[...]
```

**Problems found:** The sub-agent opened the files itself although the prompt only asked it to analyse the message; its line numbers still matched. R7 (named constants inside `canBook`) conflicts with README §7 "canBook unchanged". Step 8 (clear the result on room change) does not meet F5, which asks for a refresh. R8-R10 (editable "now", missing UI tests, Russian comment / index keys / no `aria-live`) were real but minor.
**Changes made:** R1-R6 became risks 1-5 in 3.1 after checking each one (`npx tsc --noEmit`, `grep -n blocked src/App.tsx`, reading `check()`). R7 rejected and step 8 modified (3.3). R8 taken: fixed `DEMO_NOW`; R10 taken: `aria-live` on the result.
**Verified by:** `npx tsc --noEmit` output (1.1) for R1; `grep -n` of `blocked`, `setResult`, `setRoomId` in `src/App.tsx` for R2-R4; the 19 unchanged tests staying green after every later step.

### 8.2 Exchange 2

**Tool and model:** Claude Code sub-agent (same conversation as 8.1), claude-opus-5-5
**Date:** 2026-11-13
**Purpose:** the improvement plan - correct two steps of 8.1 and get a short numbered plan with the tests for each step

**Prompt:**

```text
Thanks. I checked R1-R4 myself (tsc output, grep for room.blocked, check() lines 39-54, the select onChange) and they are real. Two corrections before I commit the plan:
(a) The brief says canBook must stay UNCHANGED from Practice #07/#08, so in step 3 I will not replace 120/1440 with constants inside canBook; I will only type its parameter as CanBookParams.
(b) F5 says changing the room must REFRESH the result. Instead of clearing the result on room change (your step 8), I want the result to be recomputed with checkRoom for the newly selected room and the same submitted times; only changing a time clears it.
Please give me the final plan as at most 8 numbered steps, smallest safe step first, each step naming the file(s) it touches and the test(s) that must be green after it. Still no code.
```

**Output used:**

```text
On (b): recomputing needs the last submitted times kept in state. Store the submitted start, end and now as one object, separate from the live inputs.
- **Room change:** if a submitted query exists, run `checkRoom` again for the new room with those times.
- **Time change:** clear both the result and the submitted query.
- **Filter removes the selected room:** when the filter drops the selected room and the selection moves, go through the same room-change path. [...]

1. **Make the build pass** (`src/booking.test.ts`). Delete the duplicate import on line 3. [...]
2. **Type `canBook` with its interface** (`src/booking.ts`). Use `CanBookParams` as the parameter type and change nothing else [...]
4. **Move the room data out of the UI** (new `src/rooms.ts`, `src/App.tsx`). Move `Room` into `rooms.ts`, built on `Booking` from `booking.ts` instead of `Interval` [...] Add a fixed demo-time constant equal to 540 [...]
5. **Add `checkRoom` with tests** [...] the same times give different results for two rooms [...] a blocked room is always Unavailable [...] an unknown id returns Unavailable; the rooms array is not changed (AC5).
7. **Bigger catalog and the filter** [...] Add `capacity` and `equipment` (a string-literal union) to `Room`. [...] capacity equal to attendees passes, one below fails (F1); a room needs ALL selected equipment [...]
8. **Wire the filter into the UI and split it into components** [...] If the selected room is filtered out, move the selection to the first match [...]
```

**Problems found:** Step 4 takes `Booking` from `booking.ts` while step 5's `checkRoom` needs `Room` from `rooms.ts` - the two modules would import each other. Step 7's string-literal union contradicts the fixed `equipment: string[]` of README §7. Step 8 auto-selects the first match when the selected room is filtered out, which would show an answer for a room the user never chose. Step 3 (fix the double message) was overtaken by removing the page's own `s < e` check altogether.
**Changes made:** Plan 3.2 follows steps 1, 2, 5, 7, 8 in that order; `Booking` moved to `rooms.ts` instead (5.2), `equipment` stays `string[]`, a filtered-out room is treated as not selected (`App.tsx`: `visible.find(...) ?? null`), never replaced by another room, and the room-change refresh is a value derived on render rather than an extra code path.
**Verified by:** `npx tsc --noEmit` clean after each commit (no import cycle), the F5 test in `checkRoom.test.ts`, and the page: switch-a / switch-b show the refresh; with A-101 selected, raising attendees to 20 hides it and the page shows "Choose a room from the list to check it." (checked in the browser on 2026-11-13).

### 8.3 Exchange 3

**Tool and model:** Claude Code sub-agent (general-purpose, new conversation), claude-opus-5-5
**Date:** 2026-11-13
**Purpose:** implementation and tests - `checkRoom`, `filterRooms` and Vitest tests for F1-F5, B5, B6, AC5, INT

**Prompt:**

```text
Context: React + TypeScript + Vitest 2.1.9 app, "Smart Campus Room Availability Checker". Times are minutes after midnight (600 = 10:00). Do not edit any files; answer with code in your reply only.

Existing, must stay UNCHANGED - src/booking.ts:
import type { Booking } from './rooms';
export interface CanBookParams { start: number; end: number; now: number; blocked: boolean; bookings: Booking[]; }
export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) { if (start < b.end && end > b.start) return false; }
  return true;
}

src/rooms.ts exports: interface Booking { start: number; end: number }; type Room = { id: string; name: string; capacity: number; equipment: string[]; blocked: boolean; bookings: Booking[] }.

Write, as small as possible:
1. checkRoom(rooms: Room[], roomId: string, request: { start: number; end: number; now: number }): boolean, to be added to src/booking.ts. It finds the room by id and calls canBook with THAT room's blocked and bookings. Unknown id -> false. Must not change anything.
2. src/filter.ts: filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[]
   F1 capacity >= attendees. F2 the room has ALL selected equipment (not any). Do not mutate the input.
3. src/rooms.test.ts: Vitest tests that import from 'vitest', './booking' and './filter' (never mocks, no .skip/.only/.each), use a fixed catalog defined INSIDE the test file (not the app's ROOMS), one test per case, and put these IDs as words in the titles:
   F1 capacity filter, F2 all equipment, F3 a blocked room is never available (checkRoom), F4 no room matches -> empty array, F5 same times, two different rooms, two different results (checkRoom),
   B5 capacity exactly equal to attendees -> included, B6 capacity one below -> excluded,
   AC5 checkRoom does not change the catalog,
   INT filterRooms then checkRoom on a room it returned.
   Use now = 540. Expected values must follow from the rules above, not from running the code.
```

**Output used:**

```text
import type { Room } from './rooms';

export function checkRoom(rooms: Room[], roomId: string, request: { start: number; end: number; now: number }): boolean {
  const room = rooms.find((r) => r.id === roomId);
  return room ? canBook({ ...request, blocked: room.blocked, bookings: room.bookings }) : false;
}

export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[] {
  return rooms.filter(
    (r) => r.capacity >= criteria.attendees && criteria.equipment.every((e) => r.equipment.includes(e)),
  );
}

const catalog: Parameters<typeof filterRooms>[0] = [
  { id: 'r1', name: 'Test Room 1', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r2', name: 'Test Room 2', capacity: 20, equipment: ['projector'], blocked: false, bookings: [] },
  { id: 'r3', name: 'Test Room 3', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  { id: 'r4', name: 'Test Room 4', capacity: 5, equipment: [], blocked: false, bookings: [] },
];
[...]
  it('F5 same times, two different rooms, two different results (checkRoom)', () => {
    const request = { start: 600, end: 660, now: NOW };
    expect(checkRoom(catalog, 'r1', request)).toBe(false);
    expect(checkRoom(catalog, 'r2', request)).toBe(true);
  });
[...]
  it('AC5 checkRoom does not change the catalog', () => {
    const before = JSON.parse(JSON.stringify(catalog));
    checkRoom(catalog, 'r2', { start: 600, end: 660, now: NOW });
    checkRoom(catalog, 'r1', { start: 600, end: 660, now: NOW });
    checkRoom(catalog, 'nope', { start: 600, end: 660, now: NOW });
    expect(catalog).toEqual(before);
  });
[...]
```

**Problems found:** (1) The `import type { Room }` was meant to be appended below `canBook`, i.e. an import in the middle of `booking.ts`. (2) `{ ...request, … }` passes whatever else is in `request` through to `canBook`. (3) Unknown id → false was only called inside the AC5 test and never asserted. (4) `Parameters<typeof filterRooms>[0]` hides the `Room` type for no reason. (5) The INT test only checked the unblocked room, so it did not show that a blocked room returned by the filter stays unavailable. (6) All tests were in one file named `rooms.test.ts`, which tests no code in `rooms.ts`. I re-derived every expected value from F1-F5 (e.g. F1 with 15 attendees: r1 = 10 and r4 = 5 are out, so `['r2','r3']`) and they were correct.
**Changes made:** One `import type { Booking, Room }` at the top of `booking.ts`; `checkRoom` destructures `{ start, end, now }` and passes them explicitly; tests split into `checkRoom.test.ts` and `filter.test.ts` with `import type { Room }`; added "F5: an unknown room id is not available", a B3 touching test through `checkRoom`, a second F2 and F4 case, an AC5 test for `filterRooms`, and the blocked room in INT. The test files were committed and run before the code: 5 failed ("checkRoom is not a function") and the filter suite failed to load.
**Verified by:** the red runs listed in 6.2, then `npx vitest run` 33/33 (6.3) and `npx tsc --noEmit` clean; commits 2f5d062 and 0f7bd51.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | The last run of `python tests/check_sis.py` (on a checkout without `app/node_modules`) gives pass=33 fail=0 error=0. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I gave the assistant AC1 Reject start >= end and requests in the past. AC2 Set the maximum allowed duration (120 minutes). AC3 Reject a locked room. AC4 Reject overlaps; allow bookings that only affect endpoints. AC5 Return Available/Unavailable without changing the booking details. AC6 Clear and responsive feedback on desktop and mobile. F1 Capacity >= requested participants F2 Room has ALL the selected equipment F3 A locked room is never reported as available F4 Clear empty state when no room matches F5 Changing the selected room updates the result; the receipt uses the booking code for THIS room from booking.ts and a batch() check for it to make a plan. I didn't write the prompts, the claude code. The assistant immediately found that npm run build was failing due to double importing vitest, even though the tests were green (19/19). He also noticed that the room was locked and couldn't be read anywhere. The incorrect part is that Booking suggested leaving it in booking.ts, which is why rooms.ts and booking.ts were imported by another friend. Also, 120 and 1440 need to be replaced with constants inside canBook, but the brief requires leaving canBook unchanged. With Claude's help, I realized that 19 old tests had never been changed, and this proves that AC1–AC5 are intact. This is my conclusion, which I wrote.
