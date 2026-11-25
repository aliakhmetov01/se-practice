# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Scope: one fictional room with fictional bookings only. Never use real room names, timetables or personal data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow bookings that only touch at endpoints.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit files in `src/` only; never weaken or delete an existing test assertion.
- Do not add packages without a human's approval.
- Never add a login page, a database or a backend (no Supabase), and never add or commit secrets: no API keys, tokens, passwords or `.env` files.

## Before you finish

- Make sure the page still loads.
- Run `npm test` and `npm run build`; both must pass, with real output shown, before proposing acceptance.
- Never deploy to Netlify or any external or production service; a human decides any release.
