import { describe, it, expect } from 'vitest';
import { checkRoom } from './booking';
import type { Room } from './rooms';

// A fixed catalog for these tests only - not the page's ROOMS, so demo data cannot change a result.
const NOW = 540;
const catalog: Room[] = [
  { id: 'r1', name: 'Test Room 1', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r2', name: 'Test Room 2', capacity: 20, equipment: ['projector'], blocked: false, bookings: [] },
  { id: 'r3', name: 'Test Room 3', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  { id: 'r4', name: 'Test Room 4', capacity: 5, equipment: [], blocked: false, bookings: [] },
];

describe('checkRoom - the chosen room decides', () => {
  it('F3 AC3: a blocked room is never available, even for an otherwise valid free slot', () => {
    // 600-660: after now, 60 minutes, r3 has no bookings - only "blocked" can make it false.
    expect(checkRoom(catalog, 'r3', { start: 600, end: 660, now: NOW })).toBe(false);
  });

  it('F5: same times, two different rooms, two different results', () => {
    const request = { start: 600, end: 660, now: NOW };
    expect(checkRoom(catalog, 'r1', request)).toBe(false); // r1 is booked 600-660
    expect(checkRoom(catalog, 'r2', request)).toBe(true); // r2 has no bookings
  });

  it('F5: an unknown room id is not available', () => {
    expect(checkRoom(catalog, 'nope', { start: 700, end: 760, now: NOW })).toBe(false);
  });

  it('B3 AC4 F5: touching the chosen room\'s booking (660-720 after 600-660) is available', () => {
    expect(checkRoom(catalog, 'r1', { start: 660, end: 720, now: NOW })).toBe(true);
  });

  it('AC5: checkRoom does not change the catalog', () => {
    const before = JSON.parse(JSON.stringify(catalog));
    checkRoom(catalog, 'r2', { start: 600, end: 660, now: NOW });
    checkRoom(catalog, 'r1', { start: 600, end: 660, now: NOW });
    checkRoom(catalog, 'nope', { start: 600, end: 660, now: NOW });
    expect(catalog).toEqual(before);
  });
});
