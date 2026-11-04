import type { Room, Booking, AvailabilityResult } from './types';

const MAX_DURATION = 120;

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function labelToMinutes(label: string): number {
  const [h, m] = label.split(':').map(Number);
  return h * 60 + m;
}

export function evaluateAvailability(
  startMin: number,
  endMin: number,
  currentMin: number,
  room: Room | undefined,
  bookings: Booking[]
): AvailabilityResult {
  if (!room) {
    return { status: 'unavailable', reason: 'Please select a room.' };
  }

  if (isNaN(startMin) || isNaN(endMin)) {
    return { status: 'unavailable', reason: 'Please enter valid start and end times.' };
  }

  // AC1: valid interval bounds and start after current time
  if (startMin < 0 || endMin > 1440) {
    return { status: 'unavailable', reason: 'Times must be between 00:00 and 24:00.' };
  }
  if (startMin >= endMin) {
    return { status: 'unavailable', reason: 'Start time must be earlier than end time.' };
  }
  if (startMin < currentMin) {
    return {
      status: 'unavailable',
      reason: `Start time must be after the current time (${minutesToLabel(currentMin)}).`,
    };
  }

  // AC2: reject bookings longer than 120 minutes
  if (endMin - startMin > MAX_DURATION) {
    return {
      status: 'unavailable',
      reason: `Booking exceeds the maximum duration of ${MAX_DURATION} minutes.`,
    };
  }

  // AC3: reject when room is blocked
  if (room.blocked) {
    return { status: 'unavailable', reason: 'This room is currently blocked and cannot be booked.' };
  }

  // AC4: reject overlapping intervals (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const conflict = roomBookings.find(
    (b) => startMin < b.endMin && endMin > b.startMin
  );
  if (conflict) {
    return {
      status: 'unavailable',
      reason: `Overlaps existing booking (${minutesToLabel(conflict.startMin)}–${minutesToLabel(conflict.endMin)} by ${conflict.bookedBy}).`,
    };
  }

  return { status: 'available', reason: 'Room is available for the selected interval.' };
}
