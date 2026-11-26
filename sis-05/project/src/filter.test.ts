import { describe, it, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

// A fixed catalog for these tests only - not the page's ROOMS.
const NOW = 540;
const catalog: Room[] = [
  { id: 'r1', name: 'Test Room 1', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r2', name: 'Test Room 2', capacity: 20, equipment: ['projector'], blocked: false, bookings: [] },
  { id: 'r3', name: 'Test Room 3', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  { id: 'r4', name: 'Test Room 4', capacity: 5, equipment: [], blocked: false, bookings: [] },
];

const ids = (rooms: Room[]) => rooms.map(r => r.id);

describe('filterRooms - capacity and equipment', () => {
  it('F1: 15 attendees keeps only rooms with capacity >= 15 (r2, r3)', () => {
    expect(ids(filterRooms(catalog, { attendees: 15, equipment: [] }))).toEqual(['r2', 'r3']);
  });

  it('F2: projector + whiteboard needs ALL of them - r2 (projector only) is out', () => {
    expect(ids(filterRooms(catalog, { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['r1', 'r3']);
  });

  it('F2: no equipment selected keeps every room that is big enough', () => {
    expect(ids(filterRooms(catalog, { attendees: 1, equipment: [] }))).toEqual(['r1', 'r2', 'r3', 'r4']);
  });

  it('F4: no room holds 100 attendees - the result is empty', () => {
    expect(filterRooms(catalog, { attendees: 100, equipment: [] })).toEqual([]);
  });

  it('F4: a room big enough exists but none has a computer - the result is empty', () => {
    expect(filterRooms(catalog, { attendees: 1, equipment: ['computers'] })).toEqual([]);
  });

  it('B5: capacity exactly equal to attendees (10 for 10) - r1 is included', () => {
    expect(ids(filterRooms(catalog, { attendees: 10, equipment: [] }))).toContain('r1');
  });

  it('B6: capacity one below attendees (10 for 11) - r1 is excluded', () => {
    expect(ids(filterRooms(catalog, { attendees: 11, equipment: [] }))).not.toContain('r1');
  });

  it('AC5: filterRooms does not change the catalog', () => {
    const before = JSON.parse(JSON.stringify(catalog));
    filterRooms(catalog, { attendees: 15, equipment: ['projector'] });
    expect(catalog).toEqual(before);
  });

  it('INT F3: filterRooms then checkRoom - the blocked room stays in the list but is never available', () => {
    const found = filterRooms(catalog, { attendees: 15, equipment: ['projector'] });
    expect(ids(found)).toEqual(['r2', 'r3']);
    expect(checkRoom(found, 'r2', { start: 600, end: 660, now: NOW })).toBe(true);
    expect(checkRoom(found, 'r3', { start: 600, end: 660, now: NOW })).toBe(false);
  });
});
