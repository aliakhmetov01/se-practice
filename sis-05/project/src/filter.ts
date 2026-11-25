// src/filter.ts - which rooms satisfy the user's requirements. Pure: returns a new array, changes nothing.
import type { Room } from './rooms';

export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[] {
  return rooms.filter(
    room =>
      room.capacity >= criteria.attendees && // F1: capacity >= requested attendees
      criteria.equipment.every(item => room.equipment.includes(item)), // F2: ALL selected items, not any
  );
}
