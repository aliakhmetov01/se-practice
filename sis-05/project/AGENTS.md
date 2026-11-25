# AGENTS.md — Smart Campus Room Availability

Instructions for a coding agent (and for people) working in this folder. Read it before you change
anything. If something here is wrong, stop and say so instead of guessing.

## Purpose

A small React page that lists a **fictional** catalog of campus rooms, filters them by the number
of attendees and the equipment needed, and answers one question for the chosen room: *can it be
booked for this start and end time today?* There is no login, no server, no database, no network
call and no browser storage. All data is fictional and lives in `src/rooms.ts`.

## Architecture

| Path | Responsibility | May it hold rules? |
| --- | --- | --- |
| `src/rooms.ts` | Types `Booking`, `Room`; the data `ROOMS`, `EQUIPMENT`, `DEMO_NOW` | no — data only |
| `src/booking.ts` | `canBook` (the five booking rules) and `checkRoom` (one room from the catalog) | yes |
| `src/filter.ts` | `filterRooms` — capacity (F1) and *all* selected equipment (F2) | yes |
| `src/time.ts` | `toMinutes`, `fmt`, `END_OF_DAY` — `HH:MM` ⇄ minutes after midnight | no — formatting only |
| `src/App.tsx` | page state and wiring; calls the functions above | no |
| `src/components/` | `RoomFilter`, `RoomList`, `ResultMessage` — presentation only | no |
| `src/*.test.ts` | Vitest tests on the real modules (no mocks) | — |

Times are integers: minutes after midnight (`600` = 10:00, `1440` = 24:00). The demo clock is the
constant `DEMO_NOW = 540` (09:00); the rules take `now` as a parameter, never read the real clock.

## Setup

Requirements: Node.js 18 or newer (checked on Node 24.19.0, npm 11.17.0).

```bash
npm ci          # installs exactly what package-lock.json pins; does not rewrite it
```

## Safe commands

Run from this folder. Every one of these exists and is safe to run without asking:

| Purpose | Command |
| --- | --- |
| Tests (Vitest, single run) | `npm test` (same as `npx vitest run`) |
| Type check (strict TypeScript; this project's lint step) | `npx tsc --noEmit` |
| Production build (type check + Vite build into `dist/`) | `npm run build` |
| Run locally (dev server on localhost:5173) | `npm run dev` |
| List known vulnerable packages (read-only) | `npm audit` |

There is **no ESLint** and **no `npm run lint` script**: do not invent one.

## Coding conventions

- TypeScript `strict`; no `any`, no `@ts-ignore`, no non-null `!` except the existing root lookup in `src/main.tsx`.
- Rules are pure functions: they take their inputs as parameters, return a new value and never mutate
  their arguments (AC5). No rule goes into a component or into `src/rooms.ts`.
- Keep a rule and its test together: a change to `src/booking.ts` or `src/filter.ts` comes with a test
  in the matching `*.test.ts`.
- Test names start with the requirement or risk ID they prove (`T01 …`, `F2: …`, `R1 …`).
- Small, focused diffs; one concern per commit; keep the existing 2-space indentation and single quotes.

## Test expectations

A change is done only when all of these pass and the output is shown, not described:

1. `npm test` — every test passes; none skipped (`.skip`/`.only` are not committed).
2. `npx tsc --noEmit` — no errors.
3. `npm run build` — succeeds.
4. A bug fix starts with a test that **fails before** the fix and passes after it.

Never edit or delete a test to make it pass; if a test looks wrong, stop and ask.

## Forbidden actions

- **Never** commit secrets: no `.env` files, API keys, tokens, passwords or real personal data, anywhere.
- **Never** deploy or publish this app to production or to any public host; there is no release step for an agent.
- **Never** run destructive commands: no `rm -rf`, `git reset --hard`, `git clean -fd`, force-push (`--force`), or deleting files outside `src/`.
- **Never** change dependencies without human review: no `npm install <pkg>`, `npm uninstall`, `npm update` or `npm audit fix`, and no edits to `package.json` or `package-lock.json`, unless the human approved that exact change.
- Do not commit `node_modules/` or `dist/`.

## Review gate

Work on a branch, never on `main`. Every change is merged only after a human has read the diff and
the test output and approved the pull request; an agent must not merge its own pull request.
