import type { Booking, Room } from './rooms';

export interface CanBookParams {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }

  return true;
}

/**
 * F3, F5: the availability of ONE room from the catalog. It finds the room by id and asks canBook
 * with that room's own blocked status and bookings. An unknown id is not available. Reads only (AC5).
 */
export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });
}
