# Smart Campus Room Availability Checker (SIS #04)

React 18 + TypeScript + Vite. A fictional catalog of rooms, filtered by capacity and equipment,
with an availability check for the chosen room. No login, payments, live APIs, database or
browser storage; all data is fictional and lives in `src/rooms.ts`.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open the URL Vite prints (normally http://localhost:5173).

## Test

```bash
npx vitest run
```

(`npm test` runs the same thing.) Type-check: `npx tsc --noEmit`.

## Layout

| File | What it holds |
| --- | --- |
| `src/rooms.ts` | `Booking`, `Room` types, `ROOMS` (the fictional catalog), `EQUIPMENT` (the filter options) |
| `src/booking.ts` | `canBook` (AC1-AC5) and `checkRoom` (the chosen room's `blocked` and `bookings`) |
| `src/filter.ts` | `filterRooms` (F1 capacity, F2 all selected equipment) |
| `src/time.ts` | `toMinutes` / `fmt` - turning `HH:MM` into minutes after midnight and back |
| `src/App.tsx` | page state; imports the rules, holds no room data and no rule |
| `src/components/` | `RoomFilter`, `RoomList` (with the F4 empty state), `ResultMessage` |
| `src/*.test.ts` | Vitest tests on the real modules |
